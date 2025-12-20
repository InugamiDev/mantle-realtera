"use client";

import { Signal } from "lucide-react";
import { useTranslations } from "next-intl";

interface DataQualityIndicatorProps {
  quality: number; // 0-100
  showLabel?: boolean;
}

export function DataQualityIndicator({ quality, showLabel = true }: DataQualityIndicatorProps) {
  const t = useTranslations("dataQuality");

  // Determine quality level and styling
  let colorClass: string;
  let labelKey: "high" | "good" | "medium" | "low";

  if (quality >= 80) {
    colorClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    labelKey = "high";
  } else if (quality >= 60) {
    colorClass = "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    labelKey = "good";
  } else if (quality >= 40) {
    colorClass = "text-amber-400 bg-amber-500/10 border-amber-500/30";
    labelKey = "medium";
  } else {
    colorClass = "text-red-400 bg-red-500/10 border-red-500/30";
    labelKey = "low";
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${colorClass}`}
    >
      <Signal className="h-3 w-3 shrink-0" aria-hidden="true" />
      {showLabel ? (
        <span>{t(labelKey)} ({quality}%)</span>
      ) : (
        <span>{quality}%</span>
      )}
    </span>
  );
}
