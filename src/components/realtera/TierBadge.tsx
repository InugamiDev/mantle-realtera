"use client";

import { cn } from "@/lib/utils";
import { getTierClassSuffix, TIERS } from "@/lib/tier";
import type { TierLevel } from "@/lib/types";
import { useTranslations } from "next-intl";

export interface TierBadgeProps {
  tier: TierLevel;
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function TierBadge({ tier, size = "default", showLabel = false, className }: TierBadgeProps) {
  const t = useTranslations("tier");
  const tierClass = `tier-${getTierClassSuffix(tier)}`;
  const sizeClass = size === "lg" ? "tier-badge-lg" : size === "sm" ? "tier-badge-sm" : "";
  const tierInfo = TIERS[tier];

  return (
    <span
      className={cn("tier-badge shrink-0 whitespace-nowrap", tierClass, sizeClass, className)}
      role="status"
      aria-label={`Tier ${tier}: ${tierInfo.label}`}
    >
      {tier}
      {showLabel && (
        <span className="ml-1 text-xs font-medium opacity-80">{t("ranked")}</span>
      )}
    </span>
  );
}
