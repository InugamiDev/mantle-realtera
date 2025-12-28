import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";
import {
  validateBody,
  validateSearchParams,
  createReplySchema,
  paginationSchema,
  ValidationError,
  sanitizeString,
} from "@/lib/validations";

interface RouteParams {
  params: Promise<{ commentId: string }>;
}

// GET /api/v1/comments/[commentId]/replies - Get replies for a comment
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { commentId } = await params;
    const { searchParams } = new URL(request.url);

    // Validate pagination
    let pagination;
    try {
      pagination = validateSearchParams(searchParams, paginationSchema);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(error.toJSON(), { status: 400 });
      }
      return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
    }

    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // Check if comment exists
    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Get current user
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);
    let dbUser = null;
    if (user) {
      dbUser = await db.user.findUnique({
        where: { stackAuthId: user.id },
      });
    }

    // Build where clause
    const where = {
      commentId,
      // Public users only see approved replies
      // Authenticated users see their own pending + all approved
      ...(dbUser
        ? {
            OR: [
              { status: "APPROVED" as const },
              { authorId: dbUser.id },
            ],
          }
        : { status: "APPROVED" as const }),
    };

    // Fetch replies
    const [replies, totalCount] = await Promise.all([
      db.commentReply.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              profileImageUrl: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
        skip: offset,
        take: limit,
      }),
      db.commentReply.count({ where }),
    ]);

    // Get user's votes if authenticated
    let userVotes: Record<string, number> = {};
    if (dbUser && replies.length > 0) {
      const votes = await db.commentReplyVote.findMany({
        where: {
          userId: dbUser.id,
          replyId: { in: replies.map((r) => r.id) },
        },
      });
      userVotes = votes.reduce((acc, v) => ({ ...acc, [v.replyId]: v.value }), {});
    }

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: replies.map((reply) => ({
        ...reply,
        userVote: userVotes[reply.id] || null,
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/v1/comments/[commentId]/replies - Create a reply
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { commentId } = await params;

    // Require authentication
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get DB user
    const dbUser = await db.user.findUnique({
      where: { stackAuthId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Validate request body
    let data;
    try {
      data = await validateBody(request, createReplySchema);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(error.toJSON(), { status: 400 });
      }
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Check if comment exists
    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Create reply and update comment reply count
    const [reply] = await db.$transaction([
      db.commentReply.create({
        data: {
          content: sanitizeString(data.content),
          commentId,
          authorId: dbUser.id,
          // Auto-approve for now
          status: "APPROVED",
        },
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              profileImageUrl: true,
            },
          },
        },
      }),
      db.comment.update({
        where: { id: commentId },
        data: {
          replyCount: { increment: 1 },
        },
      }),
    ]);

    return NextResponse.json({
      data: reply,
      message: "Reply created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
