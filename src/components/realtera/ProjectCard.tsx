"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import type { Project } from "@/lib/types";
import type { AttestationSummary } from "@/lib/attestation-registry";
import { GlassCard } from "./GlassCard";
import { TierBadge } from "./TierBadge";
import { VerificationBadge } from "./VerificationBadge";
import { AttestationBadgeCompact } from "./AttestationBadge";
import { SignalChip } from "./SignalChip";
import { DisclosureTooltip } from "./DisclosureTooltip";
import { BookmarkButton } from "./BookmarkButton";
import { DataQualityBadge } from "./DataQualityBadge";
import { LegalStageBadge } from "./LegalStageBadge";
import { ArrowRight, Calendar, Database, TrendingUp, MapPin, Building2, Banknote, Wind, Footprints, TreePine } from "lucide-react";
import { useTranslations } from "next-intl";

export interface ProjectCardProps {
  project: Project;
  className?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  attestation?: AttestationSummary | null;
}

export function ProjectCard({ project, className, isBookmarked = false, onToggleBookmark, attestation }: ProjectCardProps) {
  const t = useTranslations("projectCard");

  // Get ROI display
  const roiDisplay = project.investmentMetrics
    ? `${project.investmentMetrics.estimatedRoiMin >= 0 ? "+" : ""}${project.investmentMetrics.estimatedRoiMin}% - ${project.investmentMetrics.estimatedRoiMax}%`
    : project.roiLabel;

  const roiColorClass = project.investmentMetrics
    ? project.investmentMetrics.estimatedRoiMin >= 0
      ? "text-emerald-400"
      : "text-red-400"
    : {
        "Strong": "text-emerald-400",
        "Average": "text-amber-400",
        "Weak": "text-red-400",
        "Fail": "text-red-400",
        // Legacy Vietnamese support
        "Mạnh": "text-emerald-400",
        "Trung bình": "text-amber-400",
        "Yếu": "text-red-400",
      }[project.roiLabel];

  // Format price display
  const formatPrice = (price: number) => {
    if (price >= 1_000_000_000) {
      return `${(price / 1_000_000_000).toFixed(1)}B`;
    }
    return `${(price / 1_000_000).toFixed(0)}M`;
  };

  const priceDisplay = project.priceMetrics
    ? `${formatPrice(project.priceMetrics.minPrice)}/m² - ${formatPrice(project.priceMetrics.maxPrice)}/m²`
    : null;

  return (
    <Link href={`/project/${project.slug}`} className="block h-full">
      <GlassCard
        hover
        className={cn("group flex h-full flex-col p-5", className)}
      >
        {/* Top row: Tier badge + Bookmark + Sponsored */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <TierBadge tier={project.tier} showLabel />
          <div className="flex items-center gap-1.5">
            {onToggleBookmark && (
              <BookmarkButton
                isBookmarked={isBookmarked}
                onToggle={onToggleBookmark}
                size="sm"
              />
            )}
            {project.sponsored && (
              <span onClick={(e) => e.stopPropagation()}>
                <DisclosureTooltip />
              </span>
            )}
          </div>
        </div>

        {/* Project name */}
        <h3 className="mb-1 text-base font-bold leading-tight text-white transition-colors duration-200 group-hover:text-amber-300 line-clamp-2">
          {project.name}
        </h3>

        {/* Developer name */}
        <p className="mb-2 flex items-center gap-1.5 text-xs text-cyan-400/80">
          <Building2 className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">{project.developer?.name || "Chủ đầu tư"}</span>
        </p>

        {/* Location */}
        <p className="mb-2 flex items-center gap-1.5 text-xs text-white/50">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">{project.district}, {project.city}</span>
        </p>

        {/* Price range */}
        {priceDisplay && (
          <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-amber-400/90">
            <Banknote className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span>{priceDisplay}</span>
          </p>
        )}

        {/* Verdict (1-line clamp) */}
        <p className="mb-3 text-sm leading-relaxed text-white/60 line-clamp-2">
          {project.verdict}
        </p>

        {/* Legal stage + Signal chips + ROI */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {project.legalStage && (
            <LegalStageBadge stage={project.legalStage} compact />
          )}
          <SignalChip type="legal" value={project.signals.legal} quality={project.signals.legal} />
          <SignalChip type="liquidity" value={project.signals.liquidity} quality={project.signals.liquidity} />
          <span className={cn("flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium", roiColorClass)}>
            <TrendingUp className="h-3 w-3 shrink-0" aria-hidden="true" />
            {roiDisplay}
          </span>
        </div>

        {/* Quality of Life indicators */}
        {project.qualityOfLife && (
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
              project.qualityOfLife.aqi <= 50 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" :
              project.qualityOfLife.aqi <= 100 ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" :
              project.qualityOfLife.aqi <= 150 ? "text-amber-400 bg-amber-500/10 border-amber-500/30" :
              "text-red-400 bg-red-500/10 border-red-500/30"
            )}>
              <Wind className="h-3 w-3" aria-hidden="true" />
              AQI {project.qualityOfLife.aqi}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-600/30 bg-slate-700/30 px-2 py-0.5 text-xs font-medium text-slate-300">
              <Footprints className="h-3 w-3" aria-hidden="true" />
              {project.qualityOfLife.walkabilityScore}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
              <TreePine className="h-3 w-3" aria-hidden="true" />
              {project.qualityOfLife.greenSpaceRatio}%
            </span>
          </div>
        )}

        {/* Trust meta row */}
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-white/5 pt-3 text-xs text-white/40">
          <span className="flex shrink-0 items-center gap-1 whitespace-nowrap">
            <Calendar className="h-3 w-3 shrink-0" aria-hidden="true" />
            {formatDate(project.updatedAt)}
          </span>
          {project.dataQuality !== undefined ? (
            <DataQualityBadge quality={project.dataQuality} />
          ) : (
            <span className="flex shrink-0 items-center gap-1 whitespace-nowrap">
              <Database className="h-3 w-3 shrink-0" aria-hidden="true" />
              {project.sourceCount} {t("sources")}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <VerificationBadge status={project.verificationStatus} className="shrink-0" />
            {attestation && (
              <AttestationBadgeCompact
                tier={attestation.tier}
                isValid={attestation.isValid}
                disputed={attestation.disputed}
                locale="vi"
              />
            )}
          </div>
        </div>

        {/* Micro CTA */}
        <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 opacity-80 transition-opacity duration-200 group-hover:opacity-100">
          {t("viewDetails")}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </GlassCard>
    </Link>
  );
}
