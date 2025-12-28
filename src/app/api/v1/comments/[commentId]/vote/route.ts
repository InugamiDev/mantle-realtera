import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";
import {
  validateBody,
  commentVoteSchema,
  ValidationError,
} from "@/lib/validations";

interface RouteParams {
  params: Promise<{ commentId: string }>;
}

// POST /api/v1/comments/[commentId]/vote - Vote on a comment
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
      data = await validateBody(request, commentVoteSchema);
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

    // Check if user already voted
    const existingVote = await db.commentVote.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: dbUser.id,
        },
      },
    });

    if (existingVote) {
      if (existingVote.value === data.value) {
        // Same vote - remove it (toggle off)
        await db.$transaction([
          db.commentVote.delete({
            where: { id: existingVote.id },
          }),
          db.comment.update({
            where: { id: commentId },
            data: {
              upvoteCount: data.value === 1 ? { decrement: 1 } : undefined,
              downvoteCount: data.value === -1 ? { decrement: 1 } : undefined,
            },
          }),
        ]);

        return NextResponse.json({
          data: { vote: null },
          message: "Vote removed",
        });
      } else {
        // Different vote - change it
        await db.$transaction([
          db.commentVote.update({
            where: { id: existingVote.id },
            data: { value: data.value },
          }),
          db.comment.update({
            where: { id: commentId },
            data: {
              upvoteCount: data.value === 1 ? { increment: 1 } : { decrement: 1 },
              downvoteCount: data.value === -1 ? { increment: 1 } : { decrement: 1 },
            },
          }),
        ]);

        return NextResponse.json({
          data: { vote: data.value },
          message: "Vote changed",
        });
      }
    }

    // New vote
    await db.$transaction([
      db.commentVote.create({
        data: {
          commentId,
          userId: dbUser.id,
          value: data.value,
        },
      }),
      db.comment.update({
        where: { id: commentId },
        data: {
          upvoteCount: data.value === 1 ? { increment: 1 } : undefined,
          downvoteCount: data.value === -1 ? { increment: 1 } : undefined,
        },
      }),
    ]);

    return NextResponse.json({
      data: { vote: data.value },
      message: "Vote recorded",
    }, { status: 201 });
  } catch (error) {
    console.error("Error voting on comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
