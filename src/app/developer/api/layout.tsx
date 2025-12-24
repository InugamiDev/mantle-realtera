import { requireRole } from "@/lib/auth/guards";

/**
 * Layout for Developer API routes
 * Requires user to have a developer or api_user role
 */
export default async function DeveloperApiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require developer or api_user role
  await requireRole(["developer", "api_user"], {
    redirectTo: "/?error=forbidden",
    onboardingRedirect: "/onboarding",
  });

  return <>{children}</>;
}
