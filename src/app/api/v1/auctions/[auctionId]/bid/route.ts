import { NextRequest, NextResponse } from "next/server";
import { stripe, vndToStripeAmount } from "@/lib/stripe";
import { db } from "@/lib/db";
import { validateBody, auctionBidSchema, ValidationError } from "@/lib/validations";

// POST /api/v1/auctions/[auctionId]/bid - Place a bid (creates Stripe checkout)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ auctionId: string }> }
) {
  try {
    const { auctionId } = await params;

    // Validate and parse request body with Zod
    let validatedBody;
    try {
      validatedBody = await validateBody(request, auctionBidSchema);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(error.toJSON(), { status: 400 });
      }
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { projectSlug, amount } = validatedBody;
    // userId comes from auth in production
    const userId = "authenticated-user";

    // Validate auction exists and is active
    const auction = await db.sponsoredAuction.findUnique({
      where: { id: auctionId },
      include: {
        bids: {
          orderBy: { bidAmount: "desc" },
          take: 1,
        },
      },
    });

    if (!auction) {
      return NextResponse.json(
        { error: "Auction not found" },
        { status: 404 }
      );
    }

    if (auction.status !== "ACTIVE" || auction.endTime < new Date()) {
      return NextResponse.json(
        { error: "Auction is not active" },
        { status: 400 }
      );
    }

    // Validate project exists
    const project = await db.project.findUnique({
      where: { slug: projectSlug },
      select: { id: true, name: true, slug: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Validate bid amount
    const currentHighestBid = auction.bids[0]?.bidAmount
      ? Number(auction.bids[0].bidAmount)
      : Number(auction.minBid);
    const minNextBid = currentHighestBid + 1_000_000; // Min increment: 1 triệu

    if (amount < minNextBid) {
      return NextResponse.json(
        {
          error: "Bid too low",
          minBid: minNextBid,
          currentBid: currentHighestBid,
        },
        { status: 400 }
      );
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "vnd",
            product_data: {
              name: `Đấu giá: ${auction.slotName}`,
              description: `Dự án: ${project.name} - ${auction.description}`,
              metadata: {
                auctionId: auction.id,
                projectSlug: project.slug,
                slotType: auction.slotType,
              },
            },
            unit_amount: vndToStripeAmount(amount),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/developer/sponsorship?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/developer/sponsorship?canceled=true`,
      metadata: {
        auctionId: auction.id,
        projectId: project.id,
        projectSlug: project.slug,
        userId: userId || "anonymous",
        bidAmount: amount.toString(),
      },
    });

    // Create pending bid record
    await db.sponsoredBid.create({
      data: {
        auctionId: auction.id,
        projectId: project.id,
        bidAmount: BigInt(amount),
        status: "PENDING",
        stripeSessionId: session.id,
      },
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Failed to create bid:", error);
    return NextResponse.json(
      { error: "Failed to create bid" },
      { status: 500 }
    );
  }
}

// GET /api/v1/auctions/[auctionId]/bid - Get bids for an auction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auctionId: string }> }
) {
  try {
    const { auctionId } = await params;

    const bids = await db.sponsoredBid.findMany({
      where: {
        auctionId,
        status: "CONFIRMED",
      },
      orderBy: { bidAmount: "desc" },
      take: 10,
    });

    // Fetch projects separately (soft reference lookup)
    const projectIds = bids.map((b) => b.projectId);
    const projects = await db.project.findMany({
      where: { id: { in: projectIds } },
      select: { id: true, name: true, slug: true },
    });
    const projectMap = new Map(projects.map((p) => [p.id, p]));

    return NextResponse.json({
      bids: bids.map((bid) => ({
        id: bid.id,
        amount: Number(bid.bidAmount),
        project: projectMap.get(bid.projectId) || { name: "Unknown", slug: "" },
        createdAt: bid.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch bids:", error);
    return NextResponse.json(
      { error: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}
