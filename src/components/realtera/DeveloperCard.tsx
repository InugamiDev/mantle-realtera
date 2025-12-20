"use client";

import Link from "next/link";
import { Building2, MapPin, Globe, TrendingUp, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";
import type { Developer } from "@/lib/types";
import { useTranslations } from "next-intl";

interface DeveloperCardProps {
  developer: Developer;
  ratedCount?: number;
}

export function DeveloperCard({ developer, ratedCount = 0 }: DeveloperCardProps) {
  const t = useTranslations("developerCard");

  return (
    <Link href={`/developers/${developer.slug}`} className="block">
      <GlassCard hover className="group h-full p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
              <Building2 className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-foreground transition-colors group-hover:text-cyan-400 line-clamp-2">
                {developer.name}
              </h3>
              {developer.stockCode && (
                <span className="text-xs text-cyan-400">{developer.stockCode}</span>
              )}
            </div>
          </div>
          <TierBadge tier={developer.tier} size="sm" className="shrink-0" />
        </div>

        <div className="space-y-2 text-sm">
          {developer.headquarters && (
            <p className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{developer.headquarters}</span>
            </p>
          )}
          <p className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              {developer.projectCount} {t("projects")}
            </span>
            {ratedCount > 0 && (
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-400">
                {ratedCount} {t("rated")}
              </span>
            )}
          </p>
          {developer.foundedYear && (
            <p className="text-muted-foreground">
              {t("founded")}: {developer.foundedYear}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          {developer.website && (
            <span
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(developer.website, "_blank");
              }}
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm text-cyan-400 hover:text-cyan-300"
            >
              <Globe className="h-3.5 w-3.5 shrink-0" />
              {t("website")}
            </span>
          )}
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-cyan-400 opacity-80 transition-all group-hover:opacity-100">
            {t("viewDetails")}
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </GlassCard>
    </Link>
  );
}
