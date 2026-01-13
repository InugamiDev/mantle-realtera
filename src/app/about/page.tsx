import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { GlassCard } from "@/components/realtera/GlassCard";

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tCommon = await getTranslations("common");

  return (
    <div className="container-app py-8">
      {/* Page Header */}
      <header className="page-header text-center">
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle mx-auto">
          {t("subtitle")}
        </p>
      </header>

      {/* Main content */}
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Mission */}
        <GlassCard className="p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">{t("mission")}</h2>
          <p className="text-lg text-muted-foreground">
            {t.rich("missionText", {
              transparent: (chunks) => <span className="font-medium text-foreground">{t("transparent")}</span>,
              objective: (chunks) => <span className="font-medium text-foreground">{t("objective")}</span>,
              easyToUnderstand: (chunks) => <span className="font-medium text-foreground">{t("easyToUnderstand")}</span>,
            })}
          </p>
        </GlassCard>

        {/* Why we exist */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">{t("whyExist")}</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>{t("whyExistIntro")}</p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>{t("problem1")}</li>
              <li>{t("problem2")}</li>
              <li>{t("problem3")}</li>
              <li>{t("problem4")}</li>
            </ul>
            <p>{t("whyExistConclusion")}</p>
          </div>
        </GlassCard>

        {/* Our values */}
        <GlassCard className="p-6">
          <h2 className="mb-6 text-xl font-bold text-foreground">{t("coreValues")}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                titleKey: "transparent",
                descKey: "transparentDesc",
              },
              {
                titleKey: "objective",
                descKey: "objectiveDesc",
              },
              {
                titleKey: "easyToUnderstand",
                descKey: "easyToUnderstandDesc",
              },
            ].map((value) => (
              <div key={value.titleKey} className="rounded-xl bg-muted/50 p-4">
                <h3 className="mb-2 font-semibold text-foreground">{t(value.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(value.descKey)}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Disclaimer */}
        <GlassCard nested variant="info" className="p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">{t("disclaimer")}</h2>
          <p className="text-sm text-muted-foreground">{t("disclaimerText")}</p>
        </GlassCard>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <Link href="/" className="btn btn-primary">
            {tCommon("viewRanking")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <span
            className="cursor-not-allowed text-sm text-muted-foreground opacity-50"
            title={tCommon("comingSoon")}
          >
            {t("registerProject")} ({tCommon("comingSoon")})
          </span>
        </div>
      </div>
    </div>
  );
}
