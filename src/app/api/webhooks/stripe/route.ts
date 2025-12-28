import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutExpired(session);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { auctionId, projectId, bidAmount } = session.metadata || {};

  if (!auctionId || !projectId || !bidAmount) {
    console.error("Missing metadata in checkout session:", session.id);
    return;
  }

  // Update bid status to confirmed
  await db.sponsoredBid.updateMany({
    where: {
      stripeSessionId: session.id,
    },
    data: {
      status: "CONFIRMED",
      stripePaymentId: session.payment_intent as string,
    },
  });

  // Check if this is the highest bid
  const auction = await db.sponsoredAuction.findUnique({
    where: { id: auctionId },
    include: {
      bids: {
        where: { status: "CONFIRMED" },
        orderBy: { bidAmount: "desc" },
        take: 1,
      },
    },
  });

  if (auction) {
    const highestBid = auction.bids[0];
    const newBidAmount = parseInt(bidAmount);

    // If this bid is the highest, update the auction's winning project
    if (!highestBid || newBidAmount >= Number(highestBid.bidAmount)) {
      await db.sponsoredAuction.update({
        where: { id: auctionId },
        data: {
          winningProjectId: projectId,
        },
      });

      // If the auction has ended, mark the project as sponsored
      if (auction.endTime < new Date()) {
        await db.project.update({
          where: { id: projectId },
          data: {
            sponsored: true,
            sponsorExpiresAt: new Date(
              Date.now() +
                (auction.endTime.getTime() - auction.startTime.getTime())
            ),
          },
        });
      }
    }
  }

  console.log(`Bid confirmed for auction ${auctionId}, project ${projectId}`);
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  // Mark pending bid as expired
  await db.sponsoredBid.updateMany({
    where: {
      stripeSessionId: session.id,
      status: "PENDING",
    },
    data: {
      status: "EXPIRED",
    },
  });

  console.log(`Checkout expired: ${session.id}`);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Mark bid as failed
  await db.sponsoredBid.updateMany({
    where: {
      stripePaymentId: paymentIntent.id,
    },
    data: {
      status: "FAILED",
    },
  });

  console.log(`Payment failed: ${paymentIntent.id}`);
}
