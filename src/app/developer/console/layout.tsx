import { requireRole } from "@/lib/auth/guards";

/**
 * Layout for Developer Console routes
 * Requires user to have a developer role
 */
export default async function DeveloperConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require developer role, redirect to onboarding if not onboarded
  await requireRole("developer", {
    redirectTo: "/?error=forbidden",
    onboardingRedirect: "/onboarding?type=developer",
  });

  return <>{children}</>;
}
