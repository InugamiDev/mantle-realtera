import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";
import {
  validateBody,
  validateSearchParams,
  createCommentSchema,
  commentsQuerySchema,
  ValidationError,
  sanitizeString,
} from "@/lib/validations";

// GET /api/v1/comments - List comments for a target
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate query params
    let params;
    try {
      params = validateSearchParams(searchParams, commentsQuerySchema);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(error.toJSON(), { status: 400 });
      }
      return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
    }

    const { targetType, targetId, status, sortBy, sortOrder, page, limit } = params;
    const offset = (page - 1) * limit;

    // Get current user (optional for public read)
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);

    // Build where clause
    const where = {
      targetType,
      targetId,
      // Public users only see approved comments
      // Authenticated users see their own pending + all approved
      ...(user
        ? {
            OR: [
              { status: "APPROVED" as const },
              { authorId: user.id },
            ],
          }
        : { status: "APPROVED" as const }),
      ...(status && { status }),
    };

    // Fetch comments with author and reply count
    const [comments, totalCount] = await Promise.all([
      db.comment.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              profileImageUrl: true,
            },
          },
          replies: {
            where: { status: "APPROVED" },
            take: 3,
            orderBy: { createdAt: "asc" },
            include: {
              author: {
                select: {
                  id: true,
                  displayName: true,
                  profileImageUrl: true,
                },
              },
            },
          },
          _count: {
            select: { replies: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      }),
      db.comment.count({ where }),
    ]);

    // Get current user's votes if authenticated
    let userVotes: Record<string, number> = {};
    if (user && comments.length > 0) {
      const votes = await db.commentVote.findMany({
        where: {
          userId: user.id,
          commentId: { in: comments.map((c) => c.id) },
        },
      });
      userVotes = votes.reduce((acc, v) => ({ ...acc, [v.commentId]: v.value }), {});
    }

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: comments.map((comment) => ({
        ...comment,
        userVote: userVotes[comment.id] || null,
        replyCount: comment._count.replies,
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
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/v1/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
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

    // Validate request body
    let data;
    try {
      data = await validateBody(request, createCommentSchema);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(error.toJSON(), { status: 400 });
      }
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Get DB user
    const dbUser = await db.user.findUnique({
      where: { stackAuthId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Sanitize content
    const sanitizedContent = sanitizeString(data.content);

    // Create comment
    // Auto-approve comments from verified users, otherwise pending
    const comment = await db.comment.create({
      data: {
        content: sanitizedContent,
        targetType: data.targetType,
        targetId: data.targetId,
        authorId: dbUser.id,
        rating: data.rating,
        // Auto-approve for now (can add moderation later)
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
    });

    return NextResponse.json({
      data: comment,
      message: "Comment created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
