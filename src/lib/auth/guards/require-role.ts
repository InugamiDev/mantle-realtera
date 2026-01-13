import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";
import { db } from "@/lib/db";
import type { RoleType } from "@/generated/prisma";

export class RoleError extends Error {
  constructor(
    message: string,
    public statusCode: number = 403
  ) {
    super(message);
    this.name = "RoleError";
  }
}

/**
 * Role requirement types that can be checked
 * These are abstracted from the specific RoleType enum values
 */
export type RoleRequirement =
  | "investor"
  | "investor_pro"
  | "agency"
  | "developer"
  | "api_user"
  | "admin";

interface RequireRoleOptions {
  /**
   * Where to redirect if user doesn't have the required role
   * @default "/?error=forbidden"
   */
  redirectTo?: string;

  /**
   * Whether to redirect to onboarding if user is not onboarded
   * @default true
   */
  checkOnboarding?: boolean;

  /**
   * Custom onboarding redirect URL
   * @default "/onboarding"
   */
  onboardingRedirect?: string;
}

/**
 * Server-side guard that requires a specific role
 * Use in page.tsx or layout.tsx files (Server Components)
 *
 * @example
 * ```tsx
 * // In a layout.tsx
 * export default async function AgencyLayout({ children }) {
 *   await requireRole("agency");
 *   return <>{children}</>;
 * }
 * ```
 */
export async function requireRole(
  roles: RoleRequirement | RoleRequirement[],
  options: RequireRoleOptions = {}
) {
  const {
    redirectTo = "/?error=forbidden",
    checkOnboarding = true,
    onboardingRedirect = "/onboarding",
  } = options;

  // Get current user from Stack Auth
  const stackUser = await stackServerApp.getUser();

  if (!stackUser) {
    redirect("/handler/sign-in?after_auth_return_to=" + encodeURIComponent(redirectTo));
  }

  // Get user from database with roles
  const dbUser = await db.user.findFirst({
    where: {
      OR: [
        { stackAuthId: stackUser.id },
        { email: stackUser.primaryEmail ?? undefined },
      ],
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  // Check if user needs onboarding
  if (checkOnboarding && (!dbUser?.onboardedAt || !dbUser?.accountType)) {
    redirect(onboardingRedirect);
  }

  // If no db user or no roles, check if they need onboarding
  if (!dbUser || dbUser.roles.length === 0) {
    // Check admin metadata fallback (for backwards compatibility)
    const metadata = stackUser.clientReadOnlyMetadata as { role?: string } | null;
    const isAdmin = metadata?.role === "admin";

    if (isAdmin && roleMatchesRequirement("PLATFORM_ADMIN", roles)) {
      return stackUser;
    }

    // No roles found, redirect to onboarding or forbidden
    if (checkOnboarding && !dbUser?.onboardedAt) {
      redirect(onboardingRedirect);
    }

    redirect(redirectTo);
  }

  // Check if user has any of the required roles
  const userRoleTypes = dbUser.roles.map((ur) => ur.role.type);
  const required = Array.isArray(roles) ? roles : [roles];

  const hasRole = required.some((req) =>
    userRoleTypes.some((roleType) => roleMatchesRequirement(roleType, req))
  );

  if (!hasRole) {
    redirect(redirectTo);
  }

  return stackUser;
}

/**
 * Check if a RoleType matches a RoleRequirement
 */
function roleMatchesRequirement(
  roleType: RoleType,
  requirement: RoleRequirement | RoleRequirement[]
): boolean {
  const requirements = Array.isArray(requirement) ? requirement : [requirement];

  return requirements.some((req) => {
    switch (req) {
      case "investor":
        return roleType === "INVESTOR" || roleType === "INVESTOR_PRO";
      case "investor_pro":
        return roleType === "INVESTOR_PRO";
      case "agency":
        return (
          roleType === "AGENCY_OWNER" ||
          roleType === "AGENCY_ADMIN" ||
          roleType === "AGENCY_AGENT"
        );
      case "developer":
        return (
          roleType === "DEVELOPER_OWNER" ||
          roleType === "DEVELOPER_ADMIN" ||
          roleType === "DEVELOPER_STAFF"
        );
      case "api_user":
        return roleType === "API_READONLY" || roleType === "API_FULL";
      case "admin":
        return roleType === "PLATFORM_ADMIN" || roleType === "PLATFORM_SUPPORT";
      default:
        return false;
    }
  });
}

/**
 * Non-throwing version that returns boolean
 * Useful for conditional rendering in Server Components
 */
export async function hasRole(
  roles: RoleRequirement | RoleRequirement[]
): Promise<boolean> {
  try {
    const stackUser = await stackServerApp.getUser();
    if (!stackUser) return false;

    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { stackAuthId: stackUser.id },
          { email: stackUser.primaryEmail ?? undefined },
        ],
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!dbUser || dbUser.roles.length === 0) {
      // Check admin metadata fallback
      const metadata = stackUser.clientReadOnlyMetadata as { role?: string } | null;
      if (metadata?.role === "admin" && roleMatchesRequirement("PLATFORM_ADMIN", roles)) {
        return true;
      }
      return false;
    }

    const userRoleTypes = dbUser.roles.map((ur) => ur.role.type);
    const required = Array.isArray(roles) ? roles : [roles];

    return required.some((req) =>
      userRoleTypes.some((roleType) => roleMatchesRequirement(roleType, req))
    );
  } catch {
    return false;
  }
}

/**
 * Get all roles for the current user
 */
export async function getUserRoles(): Promise<RoleType[]> {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) return [];

  const dbUser = await db.user.findFirst({
    where: {
      OR: [
        { stackAuthId: stackUser.id },
        { email: stackUser.primaryEmail ?? undefined },
      ],
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!dbUser) return [];

  return dbUser.roles.map((ur) => ur.role.type);
}
