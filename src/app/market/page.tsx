"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Map,
  TrendingUp,
  Building2,
  BarChart3,
  Filter,
  RefreshCw,
} from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";

type HeatmapType = "projects" | "prices" | "tiers" | "demand" | "growth";

interface HeatmapCell {
  district: string;
  city: string;
  value: number;
  intensity: number;
  label: string;
}

interface MarketOverview {
  totalProjects: number;
  totalDevelopers: number;
  avgMarketScore: number;
  tierDistribution: Record<string, number>;
  topDistricts: { district: string; projectCount: number }[];
  verificationRate: number;
}

export default function MarketPage() {
  const t = useTranslations("market");
  const tCommon = useTranslations("common");
  const [heatmapType, setHeatmapType] = useState<HeatmapType>("projects");
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
  const [overview, setOverview] = useState<MarketOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const HEATMAP_TYPES: { type: HeatmapType; labelKey: string; icon: typeof Map }[] = [
    { type: "projects", labelKey: "projectDensity", icon: Building2 },
    { type: "prices", labelKey: "avgPrices", icon: TrendingUp },
    { type: "tiers", labelKey: "quality", icon: BarChart3 },
    { type: "demand", labelKey: "demand", icon: TrendingUp },
    { type: "growth", labelKey: "growth", icon: TrendingUp },
  ];

  useEffect(() => {
    fetchData();
  }, [heatmapType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [heatmapRes, overviewRes] = await Promise.all([
        fetch(`/api/v1/heatmaps?type=${heatmapType}`),
        fetch("/api/v1/market-data?type=overview"),
      ]);

      const heatmap = await heatmapRes.json();
      const overviewData = await overviewRes.json();

      setHeatmapData(heatmap.cells || []);
      setOverview(overviewData);
    } catch (error) {
      console.error("Failed to fetch market data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity > 0.7) return "bg-emerald-500/80";
    if (intensity > 0.4) return "bg-amber-500/80";
    return "bg-cyan-500/80";
  };

  return (
    <div className="container-app py-6 sm:py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">{tCommon("backToRanking")}</span>
        <span className="sm:hidden">{tCommon("backToRanking").split(" ")[0]}</span>
      </Link>

      {/* Header */}
      <header className="page-header">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Map className="h-5 w-5 text-cyan-400" />
          <span className="text-sm font-medium uppercase tracking-wider text-cyan-400">
            {t("badge")}
          </span>
        </div>
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">{t("subtitle")}</p>
      </header>

      {/* Overview Stats */}
      {overview && (
        <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <GlassCard className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {overview.totalProjects}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">{t("totalProjects")}</p>
          </GlassCard>
          <GlassCard className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {overview.totalDevelopers}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">{t("totalDevelopers")}</p>
          </GlassCard>
          <GlassCard className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {overview.avgMarketScore}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">{t("avgScore")}</p>
          </GlassCard>
          <GlassCard className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {overview.verificationRate}%
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">{t("verifiedRate")}</p>
          </GlassCard>
        </div>
      )}

      {/* Heatmap Type Selector */}
      <div className="mt-6 sm:mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{t("mapType")}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {HEATMAP_TYPES.map(({ type, labelKey, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setHeatmapType(type)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                heatmapType === type
                  ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                  : "border-white/10 bg-white/5 text-foreground hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t(labelKey)}</span>
            </button>
          ))}
          <button
            onClick={fetchData}
            className="ml-auto flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{t("refresh")}</span>
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <GlassCard className="mt-6 p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          {t(HEATMAP_TYPES.find((h) => h.type === heatmapType)?.labelKey || "projectDensity")} {t("byDistrict")}
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-lg bg-white/10"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {heatmapData.map((cell) => (
              <div
                key={cell.district}
                className={`relative overflow-hidden rounded-lg p-3 sm:p-4 ${getIntensityColor(
                  cell.intensity
                )}`}
              >
                <div className="relative z-10">
                  <h3 className="font-semibold text-white text-sm sm:text-base">
                    {cell.district}
                  </h3>
                  <p className="mt-1 text-lg sm:text-xl font-bold text-white">
                    {cell.label}
                  </p>
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                  style={{ opacity: cell.intensity }}
                />
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Tier Distribution */}
      {overview && (
        <GlassCard className="mt-6 p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">
            {t("tierDistribution")}
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {Object.entries(overview.tierDistribution).map(([tier, count]) => (
              <div key={tier} className="text-center">
                <TierBadge tier={tier as "SSS" | "S+" | "S" | "A" | "B" | "C" | "D" | "F"} size="sm" />
                <p className="mt-2 text-lg font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground">{t("totalProjects").toLowerCase()}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Top Districts */}
      {overview && (
        <GlassCard className="mt-6 p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">
            {t("topDistricts")}
          </h2>
          <div className="space-y-3">
            {overview.topDistricts.map((district, index) => (
              <div
                key={district.district}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm font-bold ${
                      index === 0
                        ? "bg-amber-500/20 text-amber-400"
                        : index === 1
                          ? "bg-gray-400/20 text-gray-300"
                          : index === 2
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-white/10 text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="font-medium text-foreground text-sm sm:text-base">
                    {district.district}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {district.projectCount} {t("totalProjects").toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* CTA */}
      <GlassCard className="mt-6 p-4 sm:p-6 text-center">
        <h3 className="text-lg font-bold text-foreground">
          {t("needMoreAnalysis")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("upgradeProDesc")}
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/api/v1/market-reports"
            className="rounded-lg bg-cyan-500/20 px-6 py-2.5 text-sm font-medium text-cyan-400 hover:bg-cyan-500/30"
          >
            {t("viewSampleReport")}
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-medium text-black hover:bg-amber-400"
          >
            {t("upgradePro")}
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
