import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";
import { db } from "@/lib/db";
import { getOnboardingUrl } from "@/lib/onboarding";
import type { AccountType } from "@/lib/onboarding";

/**
 * Onboarding router - redirects to appropriate step based on user's progress
 */
export default async function OnboardingPage() {
  const stackUser = await stackServerApp.getUser();

  if (!stackUser) {
    redirect("/handler/sign-in?after_auth_return_to=/onboarding");
  }

  // Get user from database
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
    },
  });

  // If no DB user, create one and redirect to type selection
  if (!dbUser) {
    await db.user.create({
      data: {
        stackAuthId: stackUser.id,
        email: stackUser.primaryEmail,
        displayName: stackUser.displayName,
        profileImageUrl: stackUser.profileImageUrl,
        onboardingStep: "type",
      },
    });
    redirect("/onboarding/type");
  }

  // If already onboarded, redirect to dashboard
  if (dbUser.onboardedAt) {
    const dashboards: Record<string, string> = {
      investor: "/portfolio",
      agency: "/agency",
      developer: "/developer/console",
      api_user: "/developer/api",
    };
    redirect(dashboards[dbUser.accountType || "investor"] || "/");
  }

  // Redirect based on current step
  const accountType = dbUser.accountType as AccountType | null;
  const currentStep = dbUser.onboardingStep || "type";

  redirect(getOnboardingUrl(accountType, currentStep));
}
