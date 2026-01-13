import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";
import { db } from "@/lib/db";
import type { PermissionCode } from "@/generated/prisma";

export class PermissionError extends Error {
  constructor(
    message: string,
    public statusCode: number = 403
  ) {
    super(message);
    this.name = "PermissionError";
  }
}

interface RequirePermissionOptions {
  /**
   * Where to redirect if user doesn't have the required permission
   * @default "/?error=forbidden"
   */
  redirectTo?: string;

  /**
   * Limit the permission check to a specific organization
   */
  organizationId?: string;
}

/**
 * Server-side guard that requires a specific permission
 * Use in page.tsx or layout.tsx files (Server Components)
 *
 * @example
 * ```tsx
 * // In a page.tsx
 * export default async function ProjectEditPage({ params }) {
 *   await requirePermission("WRITE_PROJECTS");
 *   return <ProjectEditor />;
 * }
 * ```
 */
export async function requirePermission(
  permission: PermissionCode,
  options: RequirePermissionOptions = {}
) {
  const { redirectTo = "/?error=forbidden", organizationId } = options;

  // Get current user from Stack Auth
  const stackUser = await stackServerApp.getUser();

  if (!stackUser) {
    redirect("/handler/sign-in?after_auth_return_to=" + encodeURIComponent(redirectTo));
  }

  const hasPerm = await hasPermission(stackUser.id, permission, organizationId);

  if (!hasPerm) {
    redirect(redirectTo);
  }

  return stackUser;
}

/**
 * Check if a user has a specific permission
 * Can be scoped to an organization
 */
export async function hasPermission(
  stackAuthId: string,
  permission: PermissionCode,
  organizationId?: string
): Promise<boolean> {
  // Find user by Stack Auth ID
  const dbUser = await db.user.findFirst({
    where: {
      stackAuthId,
    },
    include: {
      roles: {
        where: organizationId
          ? {
              OR: [
                { organizationId: null }, // Platform-wide roles
                { organizationId }, // Org-specific roles
              ],
            }
          : undefined,
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!dbUser) return false;

  // Check if any of the user's roles have the required permission
  return dbUser.roles.some((userRole) =>
    userRole.role.permissions.some((rp) => rp.permission.code === permission)
  );
}

/**
 * Get all permissions for the current user
 * Optionally scoped to an organization
 */
export async function getUserPermissions(
  organizationId?: string
): Promise<PermissionCode[]> {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) return [];

  const dbUser = await db.user.findFirst({
    where: {
      stackAuthId: stackUser.id,
    },
    include: {
      roles: {
        where: organizationId
          ? {
              OR: [
                { organizationId: null },
                { organizationId },
              ],
            }
          : undefined,
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!dbUser) return [];

  // Collect all unique permissions from all roles
  const permissions = new Set<PermissionCode>();

  for (const userRole of dbUser.roles) {
    for (const rolePermission of userRole.role.permissions) {
      permissions.add(rolePermission.permission.code);
    }
  }

  return Array.from(permissions);
}

/**
 * Check if user has ALL of the specified permissions
 */
export async function hasAllPermissions(
  permissions: PermissionCode[],
  organizationId?: string
): Promise<boolean> {
  const userPermissions = await getUserPermissions(organizationId);
  return permissions.every((p) => userPermissions.includes(p));
}

/**
 * Check if user has ANY of the specified permissions
 */
export async function hasAnyPermission(
  permissions: PermissionCode[],
  organizationId?: string
): Promise<boolean> {
  const userPermissions = await getUserPermissions(organizationId);
  return permissions.some((p) => userPermissions.includes(p));
}
