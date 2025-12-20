"use client";

import { Wind, Volume2, TreePine, Footprints, Building2, Train, Car, School, Hospital, TreeDeciduous, ShoppingBag, Store } from "lucide-react";
import { useTranslations } from "next-intl";
import type { QualityOfLifeMetrics } from "@/lib/types";

interface QualityOfLifeCardProps {
  metrics: QualityOfLifeMetrics;
  compact?: boolean;
}

export function QualityOfLifeCard({ metrics, compact = false }: QualityOfLifeCardProps) {
  const t = useTranslations("qualityOfLife");

  // AQI color coding
  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (aqi <= 100) return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    if (aqi <= 150) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    if (aqi <= 200) return "text-orange-400 bg-orange-500/10 border-orange-500/30";
    return "text-red-400 bg-red-500/10 border-red-500/30";
  };

  // Noise level color
  const getNoiseColor = (level: string) => {
    if (level === "Quiet" || level === "Yên tĩnh") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (level === "Normal" || level === "Bình thường") return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  };

  // Transport color
  const getTransportColor = (level: string) => {
    if (level === "Convenient" || level === "Thuận tiện") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (level === "Average" || level === "Bình thường") return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  };

  // Traffic color
  const getTrafficColor = (level: string) => {
    if (level === "Clear" || level === "Thông thoáng") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (level === "Moderate" || level === "Trung bình") return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  };

  // Walkability color
  const getWalkabilityColor = (score: number) => {
    if (score >= 70) return "bg-emerald-500";
    if (score >= 50) return "bg-cyan-500";
    if (score >= 30) return "bg-amber-500";
    return "bg-red-500";
  };

  if (compact) {
    // Compact view for ProjectCard
    return (
      <div className="flex flex-wrap gap-2">
        {/* AQI Badge */}
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium cursor-help ${getAqiColor(metrics.aqi)}`}
          title={t("aqiTooltip", { aqi: metrics.aqi, label: metrics.aqiLabel })}
        >
          <Wind className="h-3 w-3" />
          AQI {metrics.aqi}
        </span>

        {/* Walkability Badge */}
        <span
          className="inline-flex items-center gap-1 rounded-full border border-slate-600/30 bg-slate-700/30 px-2 py-0.5 text-xs font-medium text-slate-300 cursor-help"
          title={t("walkabilityTooltip", { score: metrics.walkabilityScore })}
        >
          <Footprints className="h-3 w-3" />
          {metrics.walkabilityScore}
        </span>

        {/* Green Space */}
        <span
          className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 cursor-help"
          title={t("greenSpaceTooltip", { ratio: metrics.greenSpaceRatio })}
        >
          <TreePine className="h-3 w-3" />
          {metrics.greenSpaceRatio}%
        </span>
      </div>
    );
  }

  // Full view for detail page
  return (
    <div className="space-y-4">
      {/* Header Row - Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* AQI */}
        <div className={`rounded-lg border p-3 ${getAqiColor(metrics.aqi)}`}>
          <div className="flex items-center gap-2 mb-1">
            <Wind className="h-4 w-4" />
            <span className="text-xs font-medium opacity-80">AQI</span>
          </div>
          <div className="text-lg font-bold">{metrics.aqi}</div>
          <div className="text-xs opacity-80">{metrics.aqiLabel}</div>
        </div>

        {/* Walkability */}
        <div className="rounded-lg border border-slate-600/30 bg-slate-800/50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Footprints className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-400">{t("walkability")}</span>
          </div>
          <div className="text-lg font-bold text-white">{metrics.walkabilityScore}</div>
          <div className="mt-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getWalkabilityColor(metrics.walkabilityScore)} rounded-full transition-all`}
              style={{ width: `${metrics.walkabilityScore}%` }}
            />
          </div>
        </div>

        {/* Green Space */}
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
          <div className="flex items-center gap-2 mb-1">
            <TreePine className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">{t("greenSpace")}</span>
          </div>
          <div className="text-lg font-bold text-emerald-400">{metrics.greenSpaceRatio}%</div>
          <div className="mt-1 h-1.5 bg-emerald-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${metrics.greenSpaceRatio}%` }}
            />
          </div>
        </div>

        {/* Noise Level */}
        <div className={`rounded-lg border p-3 ${getNoiseColor(metrics.noiseLevel)}`}>
          <div className="flex items-center gap-2 mb-1">
            <Volume2 className="h-4 w-4" />
            <span className="text-xs font-medium opacity-80">{t("noiseLevel")}</span>
          </div>
          <div className="text-sm font-bold">{metrics.noiseLevel}</div>
        </div>
      </div>

      {/* Transport & Traffic Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Public Transport */}
        <div className={`rounded-lg border p-3 ${getTransportColor(metrics.publicTransport)}`}>
          <div className="flex items-center gap-2 mb-1">
            <Train className="h-4 w-4" />
            <span className="text-xs font-medium opacity-80">{t("publicTransport")}</span>
          </div>
          <div className="text-sm font-bold">{metrics.publicTransport}</div>
        </div>

        {/* Traffic Level */}
        <div className={`rounded-lg border p-3 ${getTrafficColor(metrics.trafficLevel)}`}>
          <div className="flex items-center gap-2 mb-1">
            <Car className="h-4 w-4" />
            <span className="text-xs font-medium opacity-80">{t("trafficLevel")}</span>
          </div>
          <div className="text-sm font-bold">{metrics.trafficLevel}</div>
        </div>
      </div>

      {/* Nearby Amenities */}
      <div className="rounded-lg border border-slate-600/30 bg-slate-800/50 p-4">
        <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {t("nearbyAmenities")}
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          <AmenityItem
            icon={<School className="h-4 w-4" />}
            count={metrics.nearbyAmenities.schools}
            label={t("schools")}
          />
          <AmenityItem
            icon={<Hospital className="h-4 w-4" />}
            count={metrics.nearbyAmenities.hospitals}
            label={t("hospitals")}
          />
          <AmenityItem
            icon={<TreeDeciduous className="h-4 w-4" />}
            count={metrics.nearbyAmenities.parks}
            label={t("parks")}
          />
          <AmenityItem
            icon={<ShoppingBag className="h-4 w-4" />}
            count={metrics.nearbyAmenities.malls}
            label={t("malls")}
          />
          <AmenityItem
            icon={<Store className="h-4 w-4" />}
            count={metrics.nearbyAmenities.markets}
            label={t("markets")}
          />
        </div>
      </div>
    </div>
  );
}

function AmenityItem({ icon, count, label }: { icon: React.ReactNode; count: number; label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50 text-slate-300 mb-1">
        {icon}
      </div>
      <span className="text-lg font-bold text-white">{count}</span>
      <span className="text-[10px] text-slate-400 leading-tight">{label}</span>
    </div>
  );
}

// Compact AQI indicator for card view
export function AqiIndicator({ aqi, label }: { aqi: number; label: string }) {
  const getColor = (aqi: number) => {
    if (aqi <= 50) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (aqi <= 100) return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    if (aqi <= 150) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    if (aqi <= 200) return "text-orange-400 bg-orange-500/10 border-orange-500/30";
    return "text-red-400 bg-red-500/10 border-red-500/30";
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getColor(aqi)}`}>
      <Wind className="h-3 w-3" />
      <span>AQI {aqi} - {label}</span>
    </span>
  );
}
