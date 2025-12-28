import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";

// PATCH /api/v1/portfolio/holdings/[holdingId] - Update holding
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ holdingId: string }> }
) {
  try {
    const { holdingId } = await params;
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify ownership
    const holding = await db.portfolioHolding.findFirst({
      where: {
        id: holdingId,
        portfolio: { userId: user.id },
      },
    });

    if (!holding) {
      return NextResponse.json(
        { error: "Holding not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { purchaseDate, purchasePrice, unitArea, currentValue, notes } = body as {
      purchaseDate?: string | null;
      purchasePrice?: number | null;
      unitArea?: number | null;
      currentValue?: number | null;
      notes?: string | null;
    };

    const updated = await db.portfolioHolding.update({
      where: { id: holdingId },
      data: {
        ...(purchaseDate !== undefined && {
          purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        }),
        ...(purchasePrice !== undefined && {
          purchasePrice: purchasePrice ? BigInt(purchasePrice) : null,
        }),
        ...(unitArea !== undefined && { unitArea }),
        ...(currentValue !== undefined && {
          currentValue: currentValue ? BigInt(currentValue) : null,
        }),
        ...(notes !== undefined && { notes }),
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
        id: updated.id,
        projectSlug: updated.project.slug,
        project: updated.project,
        purchaseDate: updated.purchaseDate?.toISOString() || null,
        purchasePrice: updated.purchasePrice ? Number(updated.purchasePrice) : null,
        unitArea: updated.unitArea ? Number(updated.unitArea) : null,
        currentValue: updated.currentValue ? Number(updated.currentValue) : null,
        notes: updated.notes,
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to update holding:", error);
    return NextResponse.json(
      { error: "Failed to update holding" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/portfolio/holdings/[holdingId] - Remove holding
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ holdingId: string }> }
) {
  try {
    const { holdingId } = await params;
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify ownership
    const holding = await db.portfolioHolding.findFirst({
      where: {
        id: holdingId,
        portfolio: { userId: user.id },
      },
    });

    if (!holding) {
      return NextResponse.json(
        { error: "Holding not found" },
        { status: 404 }
      );
    }

    await db.portfolioHolding.delete({
      where: { id: holdingId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete holding:", error);
    return NextResponse.json(
      { error: "Failed to delete holding" },
      { status: 500 }
    );
  }
}
