import { requireRole } from "@/lib/auth/guards";

/**
 * Layout for Agency routes
 * Requires user to have an agency role
 */
export default async function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require agency role, redirect to onboarding if not onboarded
  await requireRole("agency", {
    redirectTo: "/?error=forbidden",
    onboardingRedirect: "/onboarding?type=agency",
  });

  return <>{children}</>;
}
