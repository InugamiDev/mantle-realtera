import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { stackServerApp } from "@/stack/server";
import { db } from "@/lib/db";
import { ACCOUNT_TYPE_DASHBOARDS, type AccountType } from "@/lib/onboarding";
import {
  CheckCircle2,
  TrendingUp,
  Building2,
  HardHat,
  Code2,
  ArrowRight,
} from "lucide-react";

const ACCOUNT_TYPE_ICONS: Record<AccountType, React.ReactNode> = {
  investor: <TrendingUp className="h-8 w-8" />,
  agency: <Building2 className="h-8 w-8" />,
  developer: <HardHat className="h-8 w-8" />,
  api_user: <Code2 className="h-8 w-8" />,
};

export default async function OnboardingCompletePage() {
  const t = await getTranslations("onboarding");
  const stackUser = await stackServerApp.getUser();

  if (!stackUser) {
    redirect("/handler/sign-in");
  }

  const dbUser = await db.user.findFirst({
    where: {
      OR: [
        { stackAuthId: stackUser.id },
        { email: stackUser.primaryEmail ?? undefined },
      ],
    },
    select: {
      accountType: true,
      onboardedAt: true,
      displayName: true,
    },
  });

  // If not onboarded, redirect to onboarding
  if (!dbUser?.onboardedAt) {
    redirect("/onboarding");
  }

  const accountType = (dbUser.accountType || "investor") as AccountType;
  const icon = ACCOUNT_TYPE_ICONS[accountType];
  const dashboardUrl = ACCOUNT_TYPE_DASHBOARDS[accountType];
  const accountTypeKey = accountType === "api_user" ? "api_user" : accountType;
  const features = t.raw(`complete.accountTypes.${accountTypeKey}.features`) as string[];

  return (
    <div className="space-y-8 text-center">
      {/* Progress - All Complete */}
      <div className="flex items-center justify-center gap-2 text-sm text-white/60">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-500/20 text-xs font-medium text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <span className="w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-500/50 rounded-full" />
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-500/20 text-xs font-medium text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <span className="w-12 h-0.5 bg-gradient-to-r from-emerald-500/50 to-emerald-500 rounded-full" />
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-black shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="h-4 w-4" />
        </span>
      </div>

      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 border border-emerald-500/30">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white">{t("complete.title")}</h2>
        <p className="mt-2 text-white/60">
          {dbUser.displayName
            ? t("complete.subtitle", { name: dbUser.displayName })
            : t("complete.subtitleDefault")}
        </p>
      </div>

      {/* Account Type Card */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/20 p-2 text-amber-400 border border-amber-500/30">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-white">
            {t(`complete.accountTypes.${accountTypeKey}.title`)}
          </h3>
        </div>

        <ul className="space-y-2 text-left">
          {features.map((feature: string, i: number) => (
            <li key={i} className="flex items-center gap-2 text-sm text-white/60">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="pt-4">
        <Link
          href={dashboardUrl}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 px-8 py-4 font-medium text-black hover:from-amber-300 hover:to-amber-500 transition-all duration-200 shadow-lg shadow-amber-500/20"
        >
          {t("complete.goToDashboard")}
          <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="mt-4 text-sm text-white/40">
          {t("complete.updateInSettings")}
        </p>
      </div>
    </div>
  );
}
