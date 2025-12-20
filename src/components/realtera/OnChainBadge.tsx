"use client";

import { useReadContract } from "wagmi";
import { Shield, ExternalLink, Clock, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  REALTERA_ATTESTATION_ADDRESS,
  REALTERA_ATTESTATION_ABI,
} from "@/lib/contracts";
import { getExplorerTokenUrl } from "@/lib/mantle";
import { cn } from "@/lib/utils";

interface OnChainBadgeProps {
  tokenId: bigint;
  className?: string;
  showDetails?: boolean;
}

export function OnChainBadge({
  tokenId,
  className,
  showDetails = false,
}: OnChainBadgeProps) {
  const t = useTranslations("blockchain.onChain");
  const tBlockchain = useTranslations("blockchain");

  const { data: verification, isLoading } = useReadContract({
    address: REALTERA_ATTESTATION_ADDRESS,
    abi: REALTERA_ATTESTATION_ABI,
    functionName: "verifications",
    args: [tokenId],
  });

  // Validity check available for future use
  const { data: _isValid } = useReadContract({
    address: REALTERA_ATTESTATION_ADDRESS,
    abi: REALTERA_ATTESTATION_ABI,
    functionName: "isVerificationValid",
    args: [tokenId],
  });

  if (isLoading || !verification) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-slate-700/50 px-2.5 py-1 text-xs text-slate-400",
          className
        )}
      >
        <div className="h-3 w-3 animate-pulse rounded-full bg-slate-500" />
        {t("loading")}
      </div>
    );
  }

  const [_slug, tier, score, _timestamp, expiresAt, isActive] = verification;
  const isExpired = expiresAt > 0n && BigInt(Date.now()) / 1000n > expiresAt;

  if (!isActive || isExpired) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs text-red-400",
          className
        )}
      >
        <AlertTriangle className="h-3 w-3" />
        {isExpired ? t("expired") : t("revoked")}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <a
        href={getExplorerTokenUrl(
          REALTERA_ATTESTATION_ADDRESS,
          tokenId
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors w-fit"
      >
        <Shield className="h-3.5 w-3.5" />
        {t("verified")}
        <ExternalLink className="h-3 w-3" />
      </a>

      {showDetails && (
        <div className="text-xs text-slate-500 space-y-1">
          <p>
            <span className="text-slate-400">{tBlockchain("tier")}:</span> {tier}
          </p>
          <p>
            <span className="text-slate-400">{tBlockchain("score")}:</span> {score.toString()}/100
          </p>
          {expiresAt > 0n && (
            <p className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {t("expires")}:{" "}
              {new Date(Number(expiresAt) * 1000).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Simple inline badge for use in lists/cards
export function OnChainBadgeInline({
  isVerified,
  txHash: _txHash,
  className,
}: {
  isVerified: boolean;
  txHash?: string; // Reserved for future transaction link feature
  className?: string;
}) {
  const t = useTranslations("blockchain.onChain");

  if (!isVerified) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400",
        className
      )}
    >
      <Shield className="h-3 w-3" />
      {t("onChain")}
    </span>
  );
}
