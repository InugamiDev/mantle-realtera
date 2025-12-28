import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";
import {
  validateBody,
  reportCommentSchema,
  ValidationError,
  sanitizeString,
} from "@/lib/validations";

interface RouteParams {
  params: Promise<{ commentId: string }>;
}

// POST /api/v1/comments/[commentId]/report - Report a comment
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
      data = await validateBody(request, reportCommentSchema);
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

    // Check if user already reported this comment
    const existingReport = await db.commentReport.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: dbUser.id,
        },
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: "You have already reported this comment" },
        { status: 409 }
      );
    }

    // Create report
    const report = await db.commentReport.create({
      data: {
        commentId,
        userId: dbUser.id,
        reason: data.reason,
        details: data.details ? sanitizeString(data.details) : null,
      },
    });

    // Check if comment should be auto-flagged (3+ reports)
    const reportCount = await db.commentReport.count({
      where: { commentId },
    });

    if (reportCount >= 3 && comment.status !== "FLAGGED") {
      await db.comment.update({
        where: { id: commentId },
        data: { status: "FLAGGED" },
      });
    }

    return NextResponse.json({
      data: { id: report.id },
      message: "Report submitted successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error reporting comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
