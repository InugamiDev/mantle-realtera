"use client";

import { cn } from "@/lib/utils";
import { Database } from "lucide-react";
import { useTranslations } from "next-intl";

interface DataQualityBadgeProps {
  quality: number; // 0-100
  className?: string;
  showLabel?: boolean;
}

export function DataQualityBadge({ quality, className, showLabel = false }: DataQualityBadgeProps) {
  const t = useTranslations("dataQualityBadge");

  const getQualityColor = (q: number) => {
    if (q >= 70) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (q >= 50) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    return "text-slate-400 bg-slate-500/10 border-slate-500/30";
  };

  const getQualityLabel = (q: number) => {
    if (q >= 70) return t("high");
    if (q >= 50) return t("medium");
    return t("low");
  };

  const getQualityDescription = (q: number) => {
    if (q >= 70) return t("highDesc");
    if (q >= 50) return t("mediumDesc");
    return t("lowDesc");
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        getQualityColor(quality),
        className
      )}
    >
      <Database className="h-3 w-3 shrink-0" />
      <span>{quality}%</span>
      {showLabel && <span className="hidden truncate sm:inline">({getQualityLabel(quality)})</span>}

      {/* Tooltip - positioned to the right */}
      <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 hidden max-w-[200px] -translate-y-1/2 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
        <div className="font-medium">{t("title", { quality })}</div>
        <div className="mt-1 text-white/60">
          {getQualityDescription(quality)}
        </div>
        <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-slate-800" />
      </div>
    </div>
  );
}
