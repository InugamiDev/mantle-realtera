import Link from "next/link";
import { getAllDevelopers, getAllProjects } from "@/lib/data";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";
import { DeveloperCard } from "@/components/realtera/DeveloperCard";
import { getTranslations } from "next-intl/server";

const DEVELOPER_TIER_ORDER = ["SSS", "S", "A", "B", "C", "D", "F"] as const;

export default async function DevelopersPage() {
  const t = await getTranslations("developers");
  const [developers, projects] = await Promise.all([
    getAllDevelopers(),
    getAllProjects(),
  ]);

  // Create a map of developer slug to rated project count
  const developerProjectCounts = new Map<string, number>();
  projects.forEach((project) => {
    const slug = project.developer.slug;
    developerProjectCounts.set(slug, (developerProjectCounts.get(slug) || 0) + 1);
  });

  // Group developers by tier
  const developersByTier = DEVELOPER_TIER_ORDER.reduce(
    (acc, tier) => {
      acc[tier] = developers.filter((d) => d.tier === tier);
      return acc;
    },
    {} as Record<string, typeof developers>
  );

  return (
    <div className="container-app py-8">
      {/* Header */}
      <header className="page-header">
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">
          {t("subtitle")}
        </p>
      </header>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{developers.length}</p>
          <p className="text-sm text-muted-foreground">{t("stats.developers")}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">
            {developers.filter((d) => ["SSS", "S", "A"].includes(d.tier)).length}
          </p>
          <p className="text-sm text-muted-foreground">{t("stats.highTier")}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {developers.reduce((sum, d) => sum + d.projectCount, 0)}
          </p>
          <p className="text-sm text-muted-foreground">{t("stats.totalProjects")}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">
            {developers.filter((d) => d.stockCode).length}
          </p>
          <p className="text-sm text-muted-foreground">{t("stats.listed")}</p>
        </GlassCard>
      </div>

      {/* Developer list by tier */}
      <div className="space-y-10">
        {DEVELOPER_TIER_ORDER.map((tier) => {
          const tierDevelopers = developersByTier[tier];
          if (tierDevelopers.length === 0) return null;

          return (
            <section key={tier}>
              <div className="mb-4 flex items-center gap-3">
                <TierBadge tier={tier} size="lg" />
                <span className="text-lg font-semibold text-foreground">
                  {t("developersCount", { count: tierDevelopers.length })}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tierDevelopers.map((developer) => (
                  <DeveloperCard
                    key={developer.slug}
                    developer={developer}
                    ratedCount={developerProjectCounts.get(developer.slug) || 0}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Methodology note */}
      <GlassCard className="mt-12 p-6">
        <h2 className="mb-3 text-lg font-bold text-foreground">{t("methodology.title")}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {t("methodology.description")}
        </p>
        <Link
          href="/methodology"
          className="mt-4 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          {t("methodology.link")}
        </Link>
      </GlassCard>
    </div>
  );
}
