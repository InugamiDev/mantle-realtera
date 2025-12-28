import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";

// POST /api/v1/portfolio/holdings - Add holding to portfolio
export async function POST(request: NextRequest) {
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
    const { projectSlug, purchaseDate, purchasePrice, unitArea, currentValue, notes } = body as {
      projectSlug: string;
      purchaseDate?: string;
      purchasePrice?: number;
      unitArea?: number;
      currentValue?: number;
      notes?: string;
    };

    // Get or create portfolio
    let portfolio = await db.portfolio.findFirst({
      where: { userId: user.id },
    });

    if (!portfolio) {
      portfolio = await db.portfolio.create({
        data: {
          userId: user.id,
          name: "My Portfolio",
        },
      });
    }

    // Find project
    const project = await db.project.findUnique({
      where: { slug: projectSlug },
      select: { id: true, slug: true, name: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Create holding
    const holding = await db.portfolioHolding.create({
      data: {
        portfolioId: portfolio.id,
        projectId: project.id,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        purchasePrice: purchasePrice ? BigInt(purchasePrice) : null,
        unitArea: unitArea ?? null,
        currentValue: currentValue ? BigInt(currentValue) : null,
        notes,
      },
      include: {
        project: {
          select: {
            slug: true,
            name: true,
            tier: true,
            score: true,
          },
        },
      },
    });

    return NextResponse.json({
      holding: {
        id: holding.id,
        projectSlug: holding.project.slug,
        project: holding.project,
        purchaseDate: holding.purchaseDate?.toISOString() || null,
        purchasePrice: holding.purchasePrice ? Number(holding.purchasePrice) : null,
        unitArea: holding.unitArea ? Number(holding.unitArea) : null,
        currentValue: holding.currentValue ? Number(holding.currentValue) : null,
        notes: holding.notes,
        createdAt: holding.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to add holding:", error);
    return NextResponse.json(
      { error: "Failed to add holding" },
      { status: 500 }
    );
  }
}
