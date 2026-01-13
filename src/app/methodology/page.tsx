import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";
import { TIER_ORDER, TIERS } from "@/lib/tier";

export default async function MethodologyPage() {
  const t = await getTranslations("methodology");
  const tCommon = await getTranslations("common");
  const tTier = await getTranslations("tier");

  // Governance Hardening v1.0: 4 components, NO ROI/Value
  // ROI removed to avoid investment-promise territory and legal liability
  // See: Vietnam Advertising Law (effective 1 Jan 2026)
  const criteria = [
    { nameKey: "legal", descKey: "legalDesc", weight: "30%" },
    { nameKey: "developer", descKey: "developerDesc", weight: "30%" },
    { nameKey: "location", descKey: "locationDesc", weight: "25%" },
    { nameKey: "progress", descKey: "progressDesc", weight: "15%" },
    // REMOVED: "value" (ROI/Investment Value) - legal liability risk
    // Investment analysis is available in calculator tools with explicit disclaimers
  ];

  return (
    <div className="container-app py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {tCommon("backToRanking")}
      </Link>

      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">{t("subtitle")}</p>
      </header>

      {/* Main content */}
      <div className="space-y-8">
        {/* Philosophy */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">{t("philosophy")}</h2>
          <p className="mb-4 text-muted-foreground">{t("philosophyText")}</p>
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground">
            &ldquo;{t("quote")}&rdquo;
          </blockquote>
        </GlassCard>

        {/* Scoring criteria */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">{t("criteria")}</h2>
          <p className="mb-4 text-muted-foreground">{t("criteriaIntro")}</p>
          <div className="space-y-4">
            {criteria.map((item) => (
              <div key={item.nameKey} className="flex items-start gap-4 rounded-lg bg-muted/50 p-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">{item.weight}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t(item.nameKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(item.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Tier mapping table */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">{t("tierTable")}</h2>
          <p className="mb-4 text-muted-foreground">{t("tierTableIntro")}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left font-semibold text-foreground">{t("tierColumn")}</th>
                  <th className="py-3 text-left font-semibold text-foreground">{t("scoreColumn")}</th>
                  <th className="py-3 text-left font-semibold text-foreground">{t("meaningColumn")}</th>
                </tr>
              </thead>
              <tbody>
                {TIER_ORDER.map((tier) => {
                  const info = TIERS[tier];
                  const tierKey = tier.toLowerCase().replace("+", "+") as "sss" | "s+" | "s" | "a" | "b" | "c" | "d" | "f";
                  return (
                    <tr key={tier} className="border-b border-border/50">
                      <td className="py-3">
                        <TierBadge tier={tier} />
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {info.minScore}-{info.maxScore}
                      </td>
                      <td className="py-3 text-muted-foreground">{tTier(`desc.${tierKey}`)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Data sources */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">{t("dataSources")}</h2>
          <p className="mb-4 text-muted-foreground">{t("dataSourcesIntro")}</p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>{t("source1")}</li>
            <li>{t("source2")}</li>
            <li>{t("source3")}</li>
            <li>{t("source4")}</li>
            <li>{t("source5")}</li>
          </ul>
        </GlassCard>

        {/* Update frequency */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">{t("updateFrequency")}</h2>
          <p className="text-muted-foreground">{t("updateFrequencyText")}</p>
        </GlassCard>
      </div>
    </div>
  );
}
