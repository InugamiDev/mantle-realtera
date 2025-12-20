"use client";

import { cn } from "@/lib/utils";
import { Scale, DollarSign, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import type { SignalQuality } from "@/lib/types";

export type SignalType = "legal" | "price" | "liquidity";

export interface SignalChipProps {
  type: SignalType;
  value: string;
  quality?: SignalQuality;
  className?: string;
}

const signalIcons: Record<SignalType, typeof Scale> = {
  legal: Scale,
  price: DollarSign,
  liquidity: TrendingUp,
};

export function SignalChip({ type, value, quality, className }: SignalChipProps) {
  const t = useTranslations("signalChip");
  const Icon = signalIcons[type];
  const label = t(type);

  // Map quality values to CSS classes
  const getQualityClass = (val: string, q?: SignalQuality) => {
    if (q === "Good" || val === "Good" || val === "Tốt") return "signal-good";
    if (q === "Average" || val === "Average" || val === "Trung bình" || val === "Medium") return "signal-medium";
    if (q === "Poor" || val === "Poor" || val === "Yếu" || val === "Weak" || val === "N/A") return "signal-weak";
    return "";
  };

  const computedQualityClass = getQualityClass(value, quality);

  return (
    <span
      className={cn("signal-chip shrink-0 whitespace-nowrap", computedQualityClass, className)}
      role="status"
      aria-label={`${label}: ${value}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="truncate font-medium">{label}:</span>
      <span className="truncate">{value}</span>
    </span>
  );
}
