import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";

// GET /api/v1/watchlist - Get user's watchlist
export async function GET(request: NextRequest) {
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

    const watchlist = await db.watchlist.findMany({
      where: { userId: user.id },
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
    });

    return NextResponse.json({
      items: watchlist.map((item) => ({
        id: item.id,
        projectSlug: item.project.slug,
        project: item.project,
        addedAt: item.createdAt.toISOString(),
        notes: item.notes,
        alertEnabled: item.alertOnPriceChange,
        targetPrice: item.targetPrice ? Number(item.targetPrice) : null,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch watchlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

// POST /api/v1/watchlist - Add item to watchlist
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
    const { projectSlug, notes, alertEnabled, targetPrice } = body;

    // Find project by slug
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

    // Check if already in watchlist
    const existing = await db.watchlist.findFirst({
      where: {
        userId: user.id,
        projectId: project.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already in watchlist", item: existing },
        { status: 409 }
      );
    }

    // Create watchlist entry
    const item = await db.watchlist.create({
      data: {
        userId: user.id,
        projectId: project.id,
        notes,
        alertOnPriceChange: alertEnabled ?? false,
        targetPrice: targetPrice ? BigInt(targetPrice) : null,
      },
      include: {
        project: {
          select: { slug: true, name: true },
        },
      },
    });

    return NextResponse.json({
      item: {
        id: item.id,
        projectSlug: item.project.slug,
        addedAt: item.createdAt.toISOString(),
        notes: item.notes,
        alertEnabled: item.alertOnPriceChange,
        targetPrice: item.targetPrice ? Number(item.targetPrice) : null,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to add to watchlist:", error);
    return NextResponse.json(
      { error: "Failed to add to watchlist" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/watchlist - Clear entire watchlist
export async function DELETE(request: NextRequest) {
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

    await db.watchlist.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to clear watchlist:", error);
    return NextResponse.json(
      { error: "Failed to clear watchlist" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/watchlist - Bulk sync watchlist (merge local with server)
export async function PUT(request: NextRequest) {
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
    const { items } = body as {
      items: Array<{
        projectSlug: string;
        addedAt?: string;
        notes?: string;
        alertEnabled?: boolean;
        targetPrice?: number;
      }>;
    };

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid items array" },
        { status: 400 }
      );
    }

    // Get all project IDs for the slugs
    const projectSlugs = items.map((i) => i.projectSlug);
    const projects = await db.project.findMany({
      where: { slug: { in: projectSlugs } },
      select: { id: true, slug: true },
    });

    const slugToId = new Map(projects.map((p) => [p.slug, p.id]));

    // Get existing watchlist items
    const existing = await db.watchlist.findMany({
      where: { userId: user.id },
      include: { project: { select: { slug: true } } },
    });

    const existingSlugs = new Set(existing.map((e) => e.project.slug));

    // Create new items that don't exist
    const newItems = items.filter(
      (item) => !existingSlugs.has(item.projectSlug) && slugToId.has(item.projectSlug)
    );

    if (newItems.length > 0) {
      await db.watchlist.createMany({
        data: newItems.map((item) => ({
          userId: user.id,
          projectId: slugToId.get(item.projectSlug)!,
          notes: item.notes,
          alertOnPriceChange: item.alertEnabled ?? false,
          targetPrice: item.targetPrice ? BigInt(item.targetPrice) : null,
          createdAt: item.addedAt ? new Date(item.addedAt) : new Date(),
        })),
        skipDuplicates: true,
      });
    }

    // Fetch updated watchlist
    const updatedWatchlist = await db.watchlist.findMany({
      where: { userId: user.id },
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      items: updatedWatchlist.map((item) => ({
        id: item.id,
        projectSlug: item.project.slug,
        project: item.project,
        addedAt: item.createdAt.toISOString(),
        notes: item.notes,
        alertEnabled: item.alertOnPriceChange,
        targetPrice: item.targetPrice ? Number(item.targetPrice) : null,
      })),
      merged: newItems.length,
    });
  } catch (error) {
    console.error("Failed to sync watchlist:", error);
    return NextResponse.json(
      { error: "Failed to sync watchlist" },
      { status: 500 }
    );
  }
}
