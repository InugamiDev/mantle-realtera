import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";

// GET /api/v1/portfolio - Get user's portfolio with holdings
export async function GET() {
  try {
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get or create portfolio for user
    let portfolio = await db.portfolio.findFirst({
      where: { userId: user.id },
      include: {
        holdings: {
          include: {
            project: {
              select: {
                slug: true,
                name: true,
                tier: true,
                score: true,
                district: true,
                city: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!portfolio) {
      portfolio = await db.portfolio.create({
        data: {
          userId: user.id,
          name: "My Portfolio",
        },
        include: {
          holdings: {
            include: {
              project: {
                select: {
                  slug: true,
                  name: true,
                  tier: true,
                  score: true,
                  district: true,
                  city: true,
                },
              },
            },
          },
        },
      });
    }

    // Calculate totals
    let totalValue = BigInt(0);
    let totalCost = BigInt(0);

    const holdings = portfolio.holdings.map((h) => {
      const currentValue = h.currentValue ?? BigInt(0);
      const purchasePrice = h.purchasePrice ?? BigInt(0);
      totalValue += currentValue;
      totalCost += purchasePrice;

      return {
        id: h.id,
        projectSlug: h.project.slug,
        project: h.project,
        purchaseDate: h.purchaseDate?.toISOString() || null,
        purchasePrice: h.purchasePrice ? Number(h.purchasePrice) : null,
        unitArea: h.unitArea ? Number(h.unitArea) : null,
        currentValue: h.currentValue ? Number(h.currentValue) : null,
        notes: h.notes,
        createdAt: h.createdAt.toISOString(),
        gainLoss: h.currentValue && h.purchasePrice
          ? Number(h.currentValue) - Number(h.purchasePrice)
          : null,
        gainLossPercent: h.currentValue && h.purchasePrice && Number(h.purchasePrice) > 0
          ? ((Number(h.currentValue) - Number(h.purchasePrice)) / Number(h.purchasePrice)) * 100
          : null,
      };
    });

    return NextResponse.json({
      portfolio: {
        id: portfolio.id,
        name: portfolio.name,
        totalValue: Number(totalValue),
        totalCost: Number(totalCost),
        totalGainLoss: Number(totalValue - totalCost),
        totalGainLossPercent: Number(totalCost) > 0
          ? ((Number(totalValue) - Number(totalCost)) / Number(totalCost)) * 100
          : 0,
        holdingsCount: holdings.length,
        holdings,
      },
    });
  } catch (error) {
    console.error("Failed to fetch portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/portfolio - Update portfolio name
export async function PATCH(request: NextRequest) {
  try {
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body as { name?: string };

    const portfolio = await db.portfolio.findFirst({
      where: { userId: user.id },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    const updated = await db.portfolio.update({
      where: { id: portfolio.id },
      data: {
        ...(name !== undefined && { name }),
      },
    });

    return NextResponse.json({
      portfolio: {
        id: updated.id,
        name: updated.name,
      },
    });
  } catch (error) {
    console.error("Failed to update portfolio:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio" },
      { status: 500 }
    );
  }
}
