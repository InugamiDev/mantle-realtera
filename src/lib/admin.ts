import { stackServerApp } from "@/stack/server";

/**
 * Check if user is admin via clientReadOnlyMetadata.role
 * Admin role must be set in Stack Auth dashboard or via server API
 */
export async function isAdmin(): Promise<boolean> {
  if (!stackServerApp) return false;

  const user = await stackServerApp.getUser();
  if (!user) return false;

  const metadata = user.clientReadOnlyMetadata as { role?: string } | null;
  return metadata?.role === "admin";
}

/**
 * Get admin user or throw unauthorized error
 */
export async function requireAdmin() {
  if (!stackServerApp) {
    throw new Error("Unauthorized: Auth not configured");
  }

  const user = await stackServerApp.getUser();

  if (!user) {
    throw new Error("Unauthorized: Not logged in");
  }

  const metadata = user.clientReadOnlyMetadata as { role?: string } | null;
  if (metadata?.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  return user;
}

/**
 * Client-side admin check hook helper
 * Use with useUser() from @stackframe/stack
 */
export function checkAdminRole(user: { clientReadOnlyMetadata?: unknown } | null): boolean {
  if (!user) return false;
  const metadata = user.clientReadOnlyMetadata as { role?: string } | null;
  return metadata?.role === "admin";
}
