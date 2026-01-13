import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { stackServerApp } from "@/stack/server";
import { db } from "@/lib/db";
import { GlassCard } from "@/components/realtera/GlassCard";
import { Shield } from "lucide-react";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("onboarding");

  // Require authentication
  const stackUser = await stackServerApp.getUser();

  if (!stackUser) {
    redirect("/handler/sign-in?after_auth_return_to=/onboarding");
  }

  // Check if user is already onboarded
  const dbUser = await db.user.findFirst({
    where: {
      OR: [
        { stackAuthId: stackUser.id },
        { email: stackUser.primaryEmail ?? undefined },
      ],
    },
    select: {
      onboardedAt: true,
      accountType: true,
    },
  });

  // If already onboarded, redirect to appropriate dashboard
  if (dbUser?.onboardedAt) {
    const dashboards: Record<string, string> = {
      investor: "/portfolio",
      agency: "/agency",
      developer: "/developer/console",
      api_user: "/developer/api",
    };

    const dashboard = dbUser.accountType
      ? dashboards[dbUser.accountType] || "/"
      : "/";

    redirect(dashboard);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-gray-900 to-gray-950">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute -right-1/4 top-1/4 h-1/2 w-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="container-app relative py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-400 mb-4 backdrop-blur-sm">
            <Shield className="h-4 w-4" />
            {t("secureOnboarding")}
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="mt-2 text-white/60">
            {t("subtitle")}
          </p>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-2xl">
          <GlassCard className="p-8 backdrop-blur-xl">{children}</GlassCard>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/40">
            {t("terms")}
          </p>
        </div>
      </div>
    </div>
  );
}
