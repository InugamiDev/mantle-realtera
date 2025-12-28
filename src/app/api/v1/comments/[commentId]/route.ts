import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";
import {
  validateBody,
  updateCommentSchema,
  ValidationError,
  sanitizeString,
} from "@/lib/validations";

interface RouteParams {
  params: Promise<{ commentId: string }>;
}

// GET /api/v1/comments/[commentId] - Get a single comment
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { commentId } = await params;

    const comment = await db.comment.findUnique({
      where: { id: commentId },
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
          select: { replies: true, votes: true },
        },
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check visibility
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);
    if (comment.status !== "APPROVED") {
      if (!user) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 }
        );
      }
      const dbUser = await db.user.findUnique({
        where: { stackAuthId: user.id },
      });
      if (comment.authorId !== dbUser?.id) {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 }
        );
      }
    }

    // Get user's vote if authenticated
    let userVote = null;
    if (user) {
      const dbUser = await db.user.findUnique({
        where: { stackAuthId: user.id },
      });
      if (dbUser) {
        const vote = await db.commentVote.findUnique({
          where: {
            commentId_userId: {
              commentId: comment.id,
              userId: dbUser.id,
            },
          },
        });
        userVote = vote?.value || null;
      }
    }

    return NextResponse.json({
      data: {
        ...comment,
        userVote,
        replyCount: comment._count.replies,
      },
    });
  } catch (error) {
    console.error("Error fetching comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/comments/[commentId] - Update own comment
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    // Find comment
    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (comment.authorId !== dbUser.id) {
      return NextResponse.json(
        { error: "Not authorized to edit this comment" },
        { status: 403 }
      );
    }

    // Validate request body
    let data;
    try {
      data = await validateBody(request, updateCommentSchema);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(error.toJSON(), { status: 400 });
      }
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Update comment
    const updatedComment = await db.comment.update({
      where: { id: commentId },
      data: {
        content: sanitizeString(data.content),
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
      data: updatedComment,
      message: "Comment updated successfully",
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/comments/[commentId] - Delete own comment
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Find comment
    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check ownership (or admin)
    // TODO: Add admin check with requireRole
    if (comment.authorId !== dbUser.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this comment" },
        { status: 403 }
      );
    }

    // Delete comment (cascade deletes replies, votes, reports)
    await db.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
