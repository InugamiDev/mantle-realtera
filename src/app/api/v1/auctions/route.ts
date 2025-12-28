import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/v1/auctions - List active auctions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";
    const slotType = searchParams.get("slotType");

    const where: Record<string, unknown> = {};

    if (status === "active") {
      where.status = "ACTIVE";
      where.endTime = { gt: new Date() };
    } else if (status === "pending") {
      where.status = "PENDING";
      where.startTime = { gt: new Date() };
    } else if (status === "ended") {
      where.endTime = { lt: new Date() };
    }

    if (slotType) {
      where.slotType = slotType;
    }

    const auctionsRaw = await db.sponsoredAuction.findMany({
      where,
      include: {
        bids: {
          orderBy: { bidAmount: "desc" },
          take: 1,
        },
        _count: {
          select: { bids: true },
        },
      },
      orderBy: { endTime: "asc" },
    });

    // Collect project IDs from highest bids (soft reference lookup)
    const projectIds = auctionsRaw
      .filter((a) => a.bids[0]?.projectId)
      .map((a) => a.bids[0].projectId);

    const projects = await db.project.findMany({
      where: { id: { in: projectIds } },
      select: { id: true, name: true, slug: true },
    });
    const projectMap = new Map(projects.map((p) => [p.id, p]));

    const formatted = auctionsRaw.map((auction) => ({
      id: auction.id,
      slotType: auction.slotType,
      slotName: auction.slotName,
      description: auction.description,
      startTime: auction.startTime.toISOString(),
      endTime: auction.endTime.toISOString(),
      minBid: Number(auction.minBid),
      currentBid: auction.bids[0]?.bidAmount ? Number(auction.bids[0].bidAmount) : null,
      currentBidder: auction.bids[0] ? projectMap.get(auction.bids[0].projectId) || null : null,
      bidCount: auction._count.bids,
      status: auction.status.toLowerCase(),
      duration: `${Math.ceil((auction.endTime.getTime() - auction.startTime.getTime()) / (24 * 60 * 60 * 1000))} ngày`,
    }));

    return NextResponse.json({
      auctions: formatted,
      total: formatted.length,
    });
  } catch (error) {
    console.error("Failed to fetch auctions:", error);
    return NextResponse.json(
      { error: "Failed to fetch auctions" },
      { status: 500 }
    );
  }
}

// POST /api/v1/auctions - Create new auction (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slotId, slotType, slotName, description, startTime, endTime, minBid } = body;

    // TODO: Verify admin authentication
    // const user = await getStackServerClient().getUser();
    // if (!user || user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Find or create the slot
    let slot = await db.sponsoredSlot.findFirst({
      where: slotId ? { id: slotId } : { slotType },
    });

    if (!slot) {
      slot = await db.sponsoredSlot.create({
        data: {
          slotType,
          slotPosition: 1,
          maxProjects: 1,
        },
      });
    }

    const auction = await db.sponsoredAuction.create({
      data: {
        slotId: slot.id,
        slotType,
        slotName,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        minBid: BigInt(minBid),
        status: new Date(startTime) > new Date() ? "PENDING" : "ACTIVE",
      },
    });

    return NextResponse.json({
      auction: {
        ...auction,
        minBid: Number(auction.minBid),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create auction:", error);
    return NextResponse.json(
      { error: "Failed to create auction" },
      { status: 500 }
    );
  }
}
