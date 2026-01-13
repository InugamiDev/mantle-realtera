/**
 * Onboarding State Machine
 *
 * Manages user onboarding flow based on account type selection.
 * Each account type has a different set of steps to complete.
 */

import { db } from "@/lib/db";
import type { RoleType, UserTier } from "@/generated/prisma";

/**
 * Account types available during onboarding
 */
export type AccountType = "investor" | "agency" | "developer" | "api_user";

/**
 * Steps for each account type
 */
export const ONBOARDING_STEPS = {
  investor: ["type", "profile", "complete"] as const,
  agency: ["type", "profile", "organization", "verify", "complete"] as const,
  developer: ["type", "profile", "organization", "verify", "complete"] as const,
  api_user: ["type", "profile", "use-case", "complete"] as const,
} as const;

/**
 * Step type union for type safety
 */
export type OnboardingStep =
  | (typeof ONBOARDING_STEPS.investor)[number]
  | (typeof ONBOARDING_STEPS.agency)[number]
  | (typeof ONBOARDING_STEPS.developer)[number]
  | (typeof ONBOARDING_STEPS.api_user)[number];

/**
 * Role mapping for each account type
 */
export const ACCOUNT_TYPE_ROLES: Record<AccountType, RoleType> = {
  investor: "INVESTOR",
  agency: "AGENCY_OWNER",
  developer: "DEVELOPER_OWNER",
  api_user: "API_READONLY",
};

/**
 * Tier mapping for each account type
 */
export const ACCOUNT_TYPE_TIERS: Record<AccountType, UserTier> = {
  investor: "FREE",
  agency: "AGENCY",
  developer: "DEVELOPER",
  api_user: "API_USER",
};

/**
 * Dashboard routes for each account type
 */
export const ACCOUNT_TYPE_DASHBOARDS: Record<AccountType, string> = {
  investor: "/portfolio",
  agency: "/agency",
  developer: "/developer/console",
  api_user: "/developer/api",
};

/**
 * Get the steps for a given account type
 */
export function getOnboardingSteps(accountType: AccountType): readonly string[] {
  return ONBOARDING_STEPS[accountType];
}

/**
 * Get the next step after the current step
 */
export function getNextOnboardingStep(
  accountType: AccountType,
  currentStep: string
): string | null {
  const steps = ONBOARDING_STEPS[accountType] as readonly string[];
  const currentIndex = steps.indexOf(currentStep);

  if (currentIndex === -1 || currentIndex >= steps.length - 1) {
    return null;
  }

  return steps[currentIndex + 1];
}

/**
 * Get the previous step before the current step
 */
export function getPreviousOnboardingStep(
  accountType: AccountType,
  currentStep: string
): string | null {
  const steps = ONBOARDING_STEPS[accountType] as readonly string[];
  const currentIndex = steps.indexOf(currentStep);

  if (currentIndex <= 0) {
    return null;
  }

  return steps[currentIndex - 1];
}

/**
 * Check if a step is valid for an account type
 */
export function isValidStep(accountType: AccountType, step: string): boolean {
  const steps = ONBOARDING_STEPS[accountType] as readonly string[];
  return steps.includes(step);
}

/**
 * Get step progress as a percentage
 */
export function getStepProgress(
  accountType: AccountType,
  currentStep: string
): number {
  const steps = ONBOARDING_STEPS[accountType] as readonly string[];
  const currentIndex = steps.indexOf(currentStep);

  if (currentIndex === -1) return 0;

  return Math.round(((currentIndex + 1) / steps.length) * 100);
}

/**
 * Get step index (1-based for UI display)
 */
export function getStepIndex(
  accountType: AccountType,
  currentStep: string
): number {
  const steps = ONBOARDING_STEPS[accountType] as readonly string[];
  const index = steps.indexOf(currentStep);
  return index === -1 ? 1 : index + 1;
}

/**
 * Get total number of steps
 */
export function getTotalSteps(accountType: AccountType): number {
  return ONBOARDING_STEPS[accountType].length;
}

/**
 * Update user's onboarding step in database
 */
export async function updateOnboardingStep(
  userId: string,
  step: string
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { onboardingStep: step },
  });
}

/**
 * Set user's account type in database
 */
export async function setAccountType(
  userId: string,
  accountType: AccountType
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: {
      accountType,
      tier: ACCOUNT_TYPE_TIERS[accountType],
      onboardingStep: "profile",
    },
  });
}

/**
 * Complete onboarding: set onboardedAt and assign role
 */
export async function completeOnboarding(
  userId: string,
  accountType: AccountType
): Promise<void> {
  // Get the role for this account type
  const roleType = ACCOUNT_TYPE_ROLES[accountType];

  // Try to find or create the role
  let role = await db.role.findUnique({
    where: { type: roleType },
  });

  // If role doesn't exist, create it with minimal config
  // This handles cases where seed-roles.ts hasn't been run
  if (!role) {
    console.warn(`Role ${roleType} not found. Creating with default permissions.`);
    role = await db.role.create({
      data: {
        type: roleType,
        displayName: roleType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
        description: `Auto-created role for ${accountType}`,
        tier: ACCOUNT_TYPE_TIERS[accountType],
        isDefault: roleType === "INVESTOR",
      },
    });
  }

  // Check if user already has this role (platform-wide)
  const existingRole = await db.userRole.findFirst({
    where: {
      userId,
      roleId: role.id,
      organizationId: null, // Platform-wide role
    },
  });

  // Update user and assign role if not already assigned
  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        onboardedAt: new Date(),
        onboardingStep: "complete",
        tier: ACCOUNT_TYPE_TIERS[accountType],
      },
    });

    if (!existingRole) {
      await tx.userRole.create({
        data: {
          userId,
          roleId: role.id,
          // organizationId is null for platform-wide roles (optional field)
        },
      });
    }
  });
}

/**
 * Get user's onboarding status
 */
export async function getOnboardingStatus(userId: string): Promise<{
  isOnboarded: boolean;
  accountType: AccountType | null;
  currentStep: string | null;
  nextStep: string | null;
  progress: number;
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      onboardedAt: true,
      accountType: true,
      onboardingStep: true,
    },
  });

  if (!user) {
    return {
      isOnboarded: false,
      accountType: null,
      currentStep: "type",
      nextStep: null,
      progress: 0,
    };
  }

  const accountType = user.accountType as AccountType | null;
  const currentStep = user.onboardingStep || "type";

  return {
    isOnboarded: !!user.onboardedAt,
    accountType,
    currentStep,
    nextStep: accountType ? getNextOnboardingStep(accountType, currentStep) : null,
    progress: accountType ? getStepProgress(accountType, currentStep) : 0,
  };
}

/**
 * Check if user should be redirected to onboarding
 */
export async function shouldRedirectToOnboarding(
  userId: string
): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { onboardedAt: true },
  });

  return !user?.onboardedAt;
}

/**
 * Get the onboarding URL for a step
 */
export function getOnboardingUrl(
  accountType: AccountType | null,
  step: string
): string {
  if (step === "type" || !accountType) {
    return "/onboarding/type";
  }

  if (step === "complete") {
    return "/onboarding/complete";
  }

  if (step === "profile") {
    return `/onboarding/${accountType}`;
  }

  if (step === "organization") {
    return `/onboarding/${accountType}?step=organization`;
  }

  if (step === "verify") {
    return "/onboarding/verify";
  }

  if (step === "use-case") {
    return `/onboarding/${accountType}?step=use-case`;
  }

  return "/onboarding";
}
