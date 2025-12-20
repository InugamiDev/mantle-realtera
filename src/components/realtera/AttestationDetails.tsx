"use client";

import { useState, useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Scale,
  FileText,
  Building,
  Users,
  TrendingUp,
  HardHat,
  Fingerprint,
} from "lucide-react";
import {
  VERIFICATION_CHECKS,
  CHECK_LABELS,
  TIER_LABELS,
  MOCK_BLOCKCHAIN,
} from "@/lib/attestation-registry";
import type { AttestationSummary } from "@/lib/attestation-registry";
import { GlassCard } from "./GlassCard";

interface AttestationDetailsProps {
  attestation: AttestationSummary;
  projectName?: string;
  locale?: "vi" | "en";
  showEvidence?: boolean;
}

const CHECK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LEGAL_STATUS: Scale,
  OWNERSHIP_TITLE: FileText,
  CONSTRUCTION_PERMIT: Building,
  DEVELOPER_BACKGROUND: Users,
  FINANCIAL_HEALTH: TrendingUp,
  CONSTRUCTION_PROGRESS: HardHat,
  REGISTRY_CORROBORATION: CheckCircle2,
  PARTNER_COSIGN: Shield,
};

export function AttestationDetails({
  attestation,
  projectName,
  locale = "vi",
  showEvidence = true,
}: AttestationDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const tierLabel = TIER_LABELS[attestation.tier]?.[locale] || "Unknown";
  const tierColor = getTierColor(attestation.tier);

  const formatDate = (date: Date | null) => {
    if (!date) return locale === "vi" ? "Không hết hạn" : "Never expires";
    return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const daysUntilExpiry = useMemo(() => {
    if (!attestation.expiresAt) return null;
    // eslint-disable-next-line react-hooks/purity -- Necessary: need current time to calculate days until expiry
    const now = Date.now();
    return Math.ceil((attestation.expiresAt.getTime() - now) / (1000 * 60 * 60 * 24));
  }, [attestation.expiresAt]);

  return (
    <GlassCard className="overflow-hidden">
      {/* Header */}
      <div className={`p-4 border-b border-white/5 ${tierColor.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {attestation.disputed ? (
              <ShieldAlert className={`h-8 w-8 text-orange-400`} />
            ) : attestation.isValid ? (
              <ShieldCheck className={`h-8 w-8 ${tierColor.text}`} />
            ) : (
              <Shield className="h-8 w-8 text-slate-400" />
            )}
            <div>
              <h3 className="font-bold text-white">
                {locale === "vi" ? "Xác minh Tier" : "Verification Tier"} {attestation.tier}
              </h3>
              <p className={`text-sm ${tierColor.text}`}>{tierLabel}</p>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2">
            {attestation.disputed && (
              <span className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-medium flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {locale === "vi" ? "Đang tranh chấp" : "Disputed"}
              </span>
            )}
            {!attestation.isValid && !attestation.disputed && (
              <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                {locale === "vi" ? "Hết hạn" : "Expired"}
              </span>
            )}
            {attestation.isValid && !attestation.disputed && (
              <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {locale === "vi" ? "Hợp lệ" : "Valid"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 space-y-4">
        {/* Project name if provided */}
        {projectName && (
          <div className="pb-3 border-b border-white/5">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
              {locale === "vi" ? "Dự án" : "Project"}
            </p>
            <p className="font-semibold text-white">{projectName}</p>
          </div>
        )}

        {/* Verification checks */}
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">
            {locale === "vi" ? "Các mục đã kiểm tra" : "Verification Checks"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(VERIFICATION_CHECKS).map(([name, value]) => {
              const passed = attestation.checksPassed.includes(name);
              const failed = attestation.checksFailed.includes(name);
              const label = CHECK_LABELS[value]?.[locale] || name;
              const Icon = CHECK_ICONS[name] || Shield;

              return (
                <div
                  key={name}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    passed
                      ? "bg-emerald-500/10 text-emerald-400"
                      : failed
                      ? "bg-red-500/10 text-red-400"
                      : "bg-slate-500/10 text-slate-500"
                  }`}
                >
                  {passed ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  ) : failed ? (
                    <XCircle className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <Icon className="h-4 w-4 flex-shrink-0 opacity-50" />
                  )}
                  <span className="text-xs font-medium truncate">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {locale === "vi" ? "Ngày cấp" : "Issued"}
            </p>
            <p className="text-sm text-white">{formatDate(attestation.issuedAt)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {locale === "vi" ? "Hết hạn" : "Expires"}
            </p>
            <p className={`text-sm ${daysUntilExpiry && daysUntilExpiry < 30 ? "text-orange-400" : "text-white"}`}>
              {formatDate(attestation.expiresAt)}
              {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                <span className="text-xs text-slate-400 ml-1">
                  ({daysUntilExpiry} {locale === "vi" ? "ngày" : "days"})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Evidence hash (collapsible) */}
        {showEvidence && (
          <div className="pt-3 border-t border-white/5">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-left"
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Fingerprint className="h-3 w-3" />
                {locale === "vi" ? "Bằng chứng" : "Evidence"}
              </p>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    {locale === "vi" ? "Hash bằng chứng" : "Evidence Hash"}
                  </p>
                  <code className="text-xs text-cyan-400 bg-slate-800/50 px-2 py-1 rounded block break-all">
                    {attestation.evidenceHash || "N/A"}
                  </code>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Asset ID</p>
                  <code className="text-xs text-cyan-400 bg-slate-800/50 px-2 py-1 rounded block break-all">
                    {attestation.assetId}
                  </code>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mock mode indicator */}
        {MOCK_BLOCKCHAIN && (
          <div className="pt-3 border-t border-white/5">
            <p className="text-xs text-amber-400/70 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {locale === "vi" ? "Chế độ demo - Dữ liệu mẫu" : "Demo mode - Sample data"}
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

function getTierColor(tier: number) {
  const colors: Record<number, { bg: string; text: string; border: string }> = {
    0: { bg: "bg-slate-500/5", text: "text-slate-400", border: "border-slate-500/20" },
    1: { bg: "bg-blue-500/5", text: "text-blue-400", border: "border-blue-500/20" },
    2: { bg: "bg-green-500/5", text: "text-green-400", border: "border-green-500/20" },
    3: { bg: "bg-amber-500/5", text: "text-amber-400", border: "border-amber-500/20" },
    4: { bg: "bg-emerald-500/5", text: "text-emerald-400", border: "border-emerald-500/20" },
  };
  return colors[tier] || colors[0];
}

// Compact inline version for cards
export function AttestationInline({
  attestation,
  locale = "vi",
}: {
  attestation: AttestationSummary | null;
  locale?: "vi" | "en";
}) {
  if (!attestation) {
    return (
      <span className="text-xs text-slate-400">
        {locale === "vi" ? "Chưa xác minh" : "Unverified"}
      </span>
    );
  }

  const tierLabel = TIER_LABELS[attestation.tier]?.[locale] || `Tier ${attestation.tier}`;

  if (attestation.disputed) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-orange-400">
        <ShieldAlert className="h-3 w-3" />
        {locale === "vi" ? "Tranh chấp" : "Disputed"}
      </span>
    );
  }

  if (!attestation.isValid) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-400">
        <Shield className="h-3 w-3" />
        {locale === "vi" ? "Hết hạn" : "Expired"}
      </span>
    );
  }

  const tierColors: Record<number, string> = {
    0: "text-slate-400",
    1: "text-blue-400",
    2: "text-green-400",
    3: "text-amber-400",
    4: "text-emerald-400",
  };

  return (
    <span className={`inline-flex items-center gap-1 text-xs ${tierColors[attestation.tier]}`}>
      <ShieldCheck className="h-3 w-3" />
      {tierLabel}
    </span>
  );
}
