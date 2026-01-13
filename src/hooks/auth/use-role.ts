"use client";

import { useState, useEffect } from "react";
import type { RoleRequirement } from "@/lib/auth/guards/require-role";

interface OnboardingStatus {
  isOnboarded: boolean;
  accountType: string | null;
  currentStep: string | null;
  tier: string | null;
}

interface UseRoleResult {
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  accountType: string | null;
  hasRole: (role: RoleRequirement | RoleRequirement[]) => boolean;
  tier: string | null;
  refetch: () => Promise<void>;
}

/**
 * Client-side hook for checking user roles and onboarding status
 *
 * @example
 * ```tsx
 * function AgencyDashboard() {
 *   const { isLoading, hasRole, isOnboarded } = useRole();
 *
 *   if (isLoading) return <Loader />;
 *   if (!hasRole("agency")) return <Redirect to="/onboarding" />;
 *
 *   return <Dashboard />;
 * }
 * ```
 */
export function useRole(): UseRoleResult {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<OnboardingStatus | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/v1/auth/onboarding");

      if (!response.ok) {
        setIsAuthenticated(false);
        setStatus(null);
        return;
      }

      const data = await response.json();
      setIsAuthenticated(true);
      setStatus(data);
    } catch {
      setIsAuthenticated(false);
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const hasRole = (role: RoleRequirement | RoleRequirement[]): boolean => {
    if (!status?.accountType) return false;

    const roles = Array.isArray(role) ? role : [role];
    const accountType = status.accountType;

    return roles.some((r) => {
      switch (r) {
        case "investor":
          return accountType === "investor";
        case "investor_pro":
          return accountType === "investor" && status.tier === "PRO";
        case "agency":
          return accountType === "agency";
        case "developer":
          return accountType === "developer";
        case "api_user":
          return accountType === "api_user";
        case "admin":
          // Admin check would need additional logic
          return false;
        default:
          return false;
      }
    });
  };

  return {
    isLoading,
    isAuthenticated,
    isOnboarded: status?.isOnboarded ?? false,
    accountType: status?.accountType ?? null,
    hasRole,
    tier: status?.tier ?? null,
    refetch: fetchStatus,
  };
}

/**
 * Hook to require a specific role, redirecting if not authorized
 */
export function useRequireRole(
  role: RoleRequirement | RoleRequirement[],
  options?: {
    redirectTo?: string;
    onboardingRedirect?: string;
  }
) {
  const { redirectTo = "/?error=forbidden", onboardingRedirect = "/onboarding" } =
    options || {};

  const { isLoading, isAuthenticated, isOnboarded, hasRole } = useRole();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      window.location.href = `/handler/sign-in?after_auth_return_to=${encodeURIComponent(
        window.location.pathname
      )}`;
      return;
    }

    if (!isOnboarded) {
      window.location.href = onboardingRedirect;
      return;
    }

    if (!hasRole(role)) {
      window.location.href = redirectTo;
    }
  }, [isLoading, isAuthenticated, isOnboarded, hasRole, role, redirectTo, onboardingRedirect]);

  return {
    isLoading,
    isAuthorized: !isLoading && isAuthenticated && isOnboarded && hasRole(role),
  };
}
