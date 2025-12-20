"use client";

import { Shield, ShieldCheck, ShieldAlert, ShieldX, AlertTriangle } from "lucide-react";
import { TIER_LABELS, VERIFICATION_TIERS } from "@/lib/attestation-registry";
import type { AttestationSummary } from "@/lib/attestation-registry";

interface AttestationBadgeProps {
  attestation: AttestationSummary | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  locale?: "vi" | "en";
}

const TIER_ICONS: Record<number, typeof Shield> = {
  [VERIFICATION_TIERS.UNVERIFIED]: Shield,
  [VERIFICATION_TIERS.BASIC]: Shield,
  [VERIFICATION_TIERS.STANDARD]: ShieldCheck,
  [VERIFICATION_TIERS.CORROBORATED]: ShieldCheck,
  [VERIFICATION_TIERS.MONITORED]: ShieldCheck,
};

const TIER_COLORS: Record<number, string> = {
  [VERIFICATION_TIERS.UNVERIFIED]: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  [VERIFICATION_TIERS.BASIC]: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  [VERIFICATION_TIERS.STANDARD]: "text-green-400 bg-green-500/10 border-green-500/20",
  [VERIFICATION_TIERS.CORROBORATED]: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  [VERIFICATION_TIERS.MONITORED]: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

const SIZE_CLASSES = {
  sm: "px-2 py-1 text-xs gap-1",
  md: "px-3 py-1.5 text-sm gap-1.5",
  lg: "px-4 py-2 text-base gap-2",
};

const ICON_SIZES = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function AttestationBadge({
  attestation,
  size = "md",
  showLabel = true,
  locale = "vi",
}: AttestationBadgeProps) {
  // No attestation
  if (!attestation) {
    return (
      <div
        className={`inline-flex items-center rounded-full border font-medium ${SIZE_CLASSES[size]} ${TIER_COLORS[VERIFICATION_TIERS.UNVERIFIED]}`}
      >
        <Shield className={ICON_SIZES[size]} />
        {showLabel && (
          <span>{locale === "vi" ? "Chưa xác minh" : "Unverified"}</span>
        )}
      </div>
    );
  }

  // Disputed
  if (attestation.disputed) {
    return (
      <div
        className={`inline-flex items-center rounded-full border font-medium ${SIZE_CLASSES[size]} text-orange-400 bg-orange-500/10 border-orange-500/20`}
      >
        <AlertTriangle className={ICON_SIZES[size]} />
        {showLabel && (
          <span>{locale === "vi" ? "Đang tranh chấp" : "Disputed"}</span>
        )}
      </div>
    );
  }

  // Invalid (expired or revoked)
  if (!attestation.isValid) {
    return (
      <div
        className={`inline-flex items-center rounded-full border font-medium ${SIZE_CLASSES[size]} text-red-400 bg-red-500/10 border-red-500/20`}
      >
        <ShieldX className={ICON_SIZES[size]} />
        {showLabel && (
          <span>{locale === "vi" ? "Hết hạn" : "Expired"}</span>
        )}
      </div>
    );
  }

  // Valid attestation
  const Icon = TIER_ICONS[attestation.tier] || Shield;
  const colorClass = TIER_COLORS[attestation.tier] || TIER_COLORS[0];
  const label = attestation.tierLabel?.[locale] || TIER_LABELS[attestation.tier]?.[locale] || "Unknown";

  return (
    <div
      className={`inline-flex items-center rounded-full border font-medium ${SIZE_CLASSES[size]} ${colorClass}`}
    >
      <Icon className={ICON_SIZES[size]} />
      {showLabel && <span>Tier {attestation.tier}: {label}</span>}
    </div>
  );
}

// Compact version for lists
export function AttestationBadgeCompact({
  tier,
  isValid,
  disputed,
  locale = "vi",
}: {
  tier: number;
  isValid: boolean;
  disputed: boolean;
  locale?: "vi" | "en";
}) {
  if (disputed) {
    return (
      <span className="inline-flex items-center gap-1 text-orange-400 text-xs">
        <ShieldAlert className="h-3 w-3" />
        <span>{locale === "vi" ? "Tranh chấp" : "Disputed"}</span>
      </span>
    );
  }

  if (!isValid) {
    return (
      <span className="inline-flex items-center gap-1 text-red-400 text-xs">
        <ShieldX className="h-3 w-3" />
        <span>{locale === "vi" ? "Hết hạn" : "Expired"}</span>
      </span>
    );
  }

  const colorMap: Record<number, string> = {
    0: "text-slate-400",
    1: "text-blue-400",
    2: "text-green-400",
    3: "text-amber-400",
    4: "text-emerald-400",
  };

  return (
    <span className={`inline-flex items-center gap-1 text-xs ${colorMap[tier] || "text-slate-400"}`}>
      <ShieldCheck className="h-3 w-3" />
      <span>T{tier}</span>
    </span>
  );
}
