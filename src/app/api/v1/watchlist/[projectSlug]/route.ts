import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";

// GET /api/v1/watchlist/[projectSlug] - Check if project is in watchlist
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  try {
    const { projectSlug } = await params;
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const project = await db.project.findUnique({
      where: { slug: projectSlug },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const item = await db.watchlist.findFirst({
      where: {
        userId: user.id,
        projectId: project.id,
      },
    });

    if (!item) {
      return NextResponse.json({ inWatchlist: false });
    }

    return NextResponse.json({
      inWatchlist: true,
      item: {
        id: item.id,
        projectSlug,
        addedAt: item.createdAt.toISOString(),
        notes: item.notes,
        alertEnabled: item.alertOnPriceChange,
        targetPrice: item.targetPrice ? Number(item.targetPrice) : null,
      },
    });
  } catch (error) {
    console.error("Failed to check watchlist:", error);
    return NextResponse.json(
      { error: "Failed to check watchlist" },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/watchlist/[projectSlug] - Update watchlist item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  try {
    const { projectSlug } = await params;
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
    const { notes, alertEnabled, targetPrice } = body as {
      notes?: string;
      alertEnabled?: boolean;
      targetPrice?: number;
    };

    const project = await db.project.findUnique({
      where: { slug: projectSlug },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const item = await db.watchlist.findFirst({
      where: {
        userId: user.id,
        projectId: project.id,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Not in watchlist" },
        { status: 404 }
      );
    }

    const updated = await db.watchlist.update({
      where: { id: item.id },
      data: {
        ...(notes !== undefined && { notes }),
        ...(alertEnabled !== undefined && { alertOnPriceChange: alertEnabled }),
        ...(targetPrice !== undefined && {
          targetPrice: targetPrice ? BigInt(targetPrice) : null,
        }),
      },
    });

    return NextResponse.json({
      item: {
        id: updated.id,
        projectSlug,
        addedAt: updated.createdAt.toISOString(),
        notes: updated.notes,
        alertEnabled: updated.alertOnPriceChange,
        targetPrice: updated.targetPrice ? Number(updated.targetPrice) : null,
      },
    });
  } catch (error) {
    console.error("Failed to update watchlist item:", error);
    return NextResponse.json(
      { error: "Failed to update watchlist item" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/watchlist/[projectSlug] - Remove from watchlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  try {
    const { projectSlug } = await params;
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const project = await db.project.findUnique({
      where: { slug: projectSlug },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    await db.watchlist.deleteMany({
      where: {
        userId: user.id,
        projectId: project.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to remove from watchlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from watchlist" },
      { status: 500 }
    );
  }
}
