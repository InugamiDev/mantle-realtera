"use client";

import { GlassCard } from "./GlassCard";
import { TierBadge } from "./TierBadge";
import { useTranslations } from "next-intl";
import type { Developer, DeveloperScoreCategory } from "@/lib/types";
import { Award, Building2, CheckCircle, TrendingUp, Users, Briefcase } from "lucide-react";

interface ScoreBarProps {
  category: DeveloperScoreCategory;
}

function ScoreBar({ category }: ScoreBarProps) {
  const percentage = (category.score / category.maxScore) * 100;
  const getColor = (pct: number) => {
    if (pct >= 90) return "bg-emerald-500";
    if (pct >= 75) return "bg-cyan-500";
    if (pct >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="truncate font-medium text-foreground">{category.category}</span>
        <span className="shrink-0 text-muted-foreground">
          {category.score}/{category.maxScore}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${getColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {category.description && (
        <p className="text-xs text-muted-foreground">{category.description}</p>
      )}
    </div>
  );
}

interface DeveloperScorecardProps {
  developer: Developer;
}

export function DeveloperScorecard({ developer }: DeveloperScorecardProps) {
  const t = useTranslations("developerScorecard");

  const scoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 75) return "text-cyan-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Award className="h-5 w-5 text-amber-400" />
          <span className="truncate">{t("title")}</span>
        </h2>
        <TierBadge tier={developer.tier} size="lg" />
      </div>

      {/* Overall Score */}
      {developer.score && (
        <div className="mb-6 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-5xl font-bold ${scoreColor(developer.score)}`}>
              {developer.score}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{t("totalScore")}</div>
          </div>
        </div>
      )}

      {/* Score Breakdown */}
      {developer.scoreBreakdown && developer.scoreBreakdown.length > 0 && (
        <div className="space-y-4">
          {developer.scoreBreakdown.map((item, index) => (
            <ScoreBar key={index} category={item} />
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
        {developer.completedProjects !== undefined && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-bold text-foreground">{developer.completedProjects}</div>
              <div className="truncate text-xs text-muted-foreground">{t("completedProjects")}</div>
            </div>
          </div>
        )}
        {developer.ongoingProjects !== undefined && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
              <Building2 className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-bold text-foreground">{developer.ongoingProjects}</div>
              <div className="truncate text-xs text-muted-foreground">{t("ongoingProjects")}</div>
            </div>
          </div>
        )}
        {developer.employeeCount !== undefined && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-bold text-foreground">
                {developer.employeeCount.toLocaleString()}
              </div>
              <div className="truncate text-xs text-muted-foreground">{t("employees")}</div>
            </div>
          </div>
        )}
        {developer.marketCap && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
              <TrendingUp className="h-5 w-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-foreground">{developer.marketCap}</div>
              <div className="truncate text-xs text-muted-foreground">{t("marketCap")}</div>
            </div>
          </div>
        )}
      </div>

      {/* Certifications */}
      {developer.certifications && developer.certifications.length > 0 && (
        <div className="mt-6 border-t border-white/10 pt-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <Briefcase className="h-4 w-4 text-cyan-400" />
            <span className="truncate">{t("certifications")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {developer.certifications.map((cert, index) => (
              <span
                key={index}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-foreground"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {developer.description && (
        <div className="mt-6 border-t border-white/10 pt-6">
          <p className="text-sm leading-relaxed text-muted-foreground">{developer.description}</p>
        </div>
      )}
    </GlassCard>
  );
}
