"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/auth/use-role";
import type { RoleRequirement } from "@/lib/auth/guards/require-role";
import { Loader2 } from "lucide-react";

interface RoleGateProps {
  /**
   * Required role(s) to view the children
   */
  role: RoleRequirement | RoleRequirement[];

  /**
   * Content to show when user has the required role
   */
  children: React.ReactNode;

  /**
   * Content to show while loading (default: spinner)
   */
  loadingFallback?: React.ReactNode;

  /**
   * Content to show when user doesn't have the required role
   * If not provided, nothing is rendered
   */
  fallback?: React.ReactNode;

  /**
   * Whether to redirect instead of showing fallback
   */
  redirect?: boolean;

  /**
   * URL to redirect to (only used if redirect is true)
   */
  redirectTo?: string;
}

/**
 * Client-side component that gates content based on user role
 *
 * @example
 * ```tsx
 * <RoleGate role="agency">
 *   <AgencyDashboard />
 * </RoleGate>
 *
 * <RoleGate role={["admin", "developer"]} fallback={<p>Not authorized</p>}>
 *   <AdminPanel />
 * </RoleGate>
 * ```
 */
export function RoleGate({
  role,
  children,
  loadingFallback,
  fallback = null,
  redirect = false,
  redirectTo = "/?error=forbidden",
}: RoleGateProps) {
  const router = useRouter();
  const { isLoading, isAuthenticated, isOnboarded, hasRole } = useRole();

  // Handle redirects via useEffect to avoid modifying values during render
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && redirect) {
      const returnTo = typeof window !== "undefined" ? window.location.pathname : "/";
      router.push(`/handler/sign-in?after_auth_return_to=${encodeURIComponent(returnTo)}`);
      return;
    }

    if (!isOnboarded && redirect) {
      router.push("/onboarding");
      return;
    }

    if (!hasRole(role) && redirect) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, isOnboarded, hasRole, role, redirect, redirectTo, router]);

  // Show loading state
  if (isLoading) {
    return (
      loadingFallback ?? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </div>
      )
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Not onboarded
  if (!isOnboarded) {
    return <>{fallback}</>;
  }

  // Check role
  if (!hasRole(role)) {
    return <>{fallback}</>;
  }

  // User has role, render children
  return <>{children}</>;
}

/**
 * Shows content only for authenticated and onboarded users
 */
export function AuthGate({
  children,
  loadingFallback,
  fallback = null,
}: {
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isLoading, isAuthenticated, isOnboarded } = useRole();

  if (isLoading) {
    return (
      loadingFallback ?? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </div>
      )
    );
  }

  if (!isAuthenticated || !isOnboarded) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Shows content only for users with a specific permission
 * (Simplified version - in production, would need a dedicated permissions endpoint)
 */
export function PermissionGate({
  permission,
  children,
  fallback = null,
}: {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isLoading, hasRole } = useRole();

  if (isLoading) {
    return null;
  }

  // Map permissions to roles (simplified)
  const permissionToRoles: Record<string, RoleRequirement[]> = {
    WRITE_PROJECTS: ["developer"],
    CREATE_ATTESTATIONS: ["developer"],
    WRITE_COLLECTIONS: ["agency", "investor_pro"],
    SHARE_COLLECTIONS: ["agency", "investor_pro"],
    API_READ: ["api_user", "developer"],
    API_WRITE: ["api_user"],
    ADMIN_USERS: ["admin"],
    ADMIN_PROJECTS: ["admin"],
  };

  const requiredRoles = permissionToRoles[permission];

  if (!requiredRoles || !hasRole(requiredRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
