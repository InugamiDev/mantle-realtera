import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stackServerApp } from "@/stack/server";
import { db } from "@/lib/db";
import {
  setAccountType,
  completeOnboarding,
  updateOnboardingStep,
  ACCOUNT_TYPE_DASHBOARDS,
  type AccountType,
} from "@/lib/onboarding";
import { ValidationError, sanitizeString } from "@/lib/validations";

// Request body schema with discriminated union
const onboardingRequestSchema = z.discriminatedUnion("action", [
  // Account type selection
  z.object({
    action: z.literal("setAccountType"),
    accountType: z.enum(["investor", "agency", "developer", "api_user"]),
  }),
  // Step completion
  z.object({
    action: z.literal("complete"),
  }),
  // Step update
  z.object({
    action: z.literal("updateStep"),
    step: z.string().min(1).max(50),
  }),
  // Legacy format support (no action field)
  z.object({
    action: z.undefined(),
    accountType: z.enum(["investor", "agency", "developer", "api_user"]).optional(),
    step: z.string().min(1).max(50).optional(),
  }),
]);

/**
 * POST /api/v1/auth/onboarding
 * Handle onboarding step updates
 */
export async function POST(request: NextRequest) {
  try {
    const stackUser = await stackServerApp.getUser();

    if (!stackUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body: z.infer<typeof onboardingRequestSchema>;
    try {
      const rawBody = await request.json();
      body = onboardingRequestSchema.parse(rawBody);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: "Validation error",
            details: error.issues.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Find or create user
    let dbUser = await db.user.findFirst({
      where: {
        OR: [
          { stackAuthId: stackUser.id },
          { email: stackUser.primaryEmail ?? undefined },
        ],
      },
    });

    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          stackAuthId: stackUser.id,
          email: stackUser.primaryEmail,
          displayName: stackUser.displayName ? sanitizeString(stackUser.displayName) : null,
          profileImageUrl: stackUser.profileImageUrl,
          onboardingStep: "type",
        },
      });
    }

    // Handle based on action type
    if ("accountType" in body && body.accountType && !dbUser.accountType) {
      await setAccountType(dbUser.id, body.accountType as AccountType);

      return NextResponse.json({
        success: true,
        accountType: body.accountType,
        nextStep: "profile",
      });
    }

    if (body.action === "complete" && dbUser.accountType) {
      await completeOnboarding(dbUser.id, dbUser.accountType as AccountType);

      return NextResponse.json({
        success: true,
        completed: true,
        redirectTo: ACCOUNT_TYPE_DASHBOARDS[dbUser.accountType as AccountType],
      });
    }

    if ("step" in body && body.step) {
      const sanitizedStep = sanitizeString(body.step);
      await updateOnboardingStep(dbUser.id, sanitizedStep);

      return NextResponse.json({
        success: true,
        step: sanitizedStep,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);

    if (error instanceof ValidationError) {
      return NextResponse.json(error.toJSON(), { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to update onboarding" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/auth/onboarding
 * Get current onboarding status
 */
export async function GET() {
  try {
    const stackUser = await stackServerApp.getUser();

    if (!stackUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { stackAuthId: stackUser.id },
          { email: stackUser.primaryEmail ?? undefined },
        ],
      },
      select: {
        id: true,
        accountType: true,
        onboardingStep: true,
        onboardedAt: true,
        tier: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({
        isOnboarded: false,
        accountType: null,
        currentStep: "type",
      });
    }

    return NextResponse.json({
      isOnboarded: !!dbUser.onboardedAt,
      accountType: dbUser.accountType,
      currentStep: dbUser.onboardingStep || "type",
      tier: dbUser.tier,
    });
  } catch (error) {
    console.error("Onboarding status error:", error);
    return NextResponse.json(
      { error: "Failed to get onboarding status" },
      { status: 500 }
    );
  }
}
