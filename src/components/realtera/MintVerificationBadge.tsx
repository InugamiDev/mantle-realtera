"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Award, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  REALTERA_ATTESTATION_ADDRESS,
  REALTERA_ATTESTATION_ABI,
  TOKEN_TYPES,
  BADGE_VALIDITY,
} from "@/lib/contracts";
import { getExplorerTxUrl } from "@/lib/mantle";

interface MintVerificationBadgeProps {
  projectSlug: string;
  projectName: string;
  tier: string;
  score: number;
  verificationTier: "basic" | "standard" | "premium";
  onSuccess?: (txHash: string) => void;
}

export function MintVerificationBadge({
  projectSlug,
  projectName,
  tier,
  score,
  verificationTier,
  onSuccess,
}: MintVerificationBadgeProps) {
  const { address, isConnected } = useAccount();
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("blockchain");

  const badgeTypeMap = {
    basic: TOKEN_TYPES.BADGE_BASIC,
    standard: TOKEN_TYPES.BADGE_STANDARD,
    premium: TOKEN_TYPES.BADGE_PREMIUM,
  };

  const badgeLabelMap: Record<string, string> = {
    basic: t("verificationBadge.basic"),
    standard: t("verificationBadge.standard"),
    premium: t("verificationBadge.premium"),
  };

  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMint = async () => {
    if (!address || !REALTERA_ATTESTATION_ADDRESS) {
      setError(t("walletNotConnected"));
      return;
    }

    setError(null);

    try {
      writeContract({
        address: REALTERA_ATTESTATION_ADDRESS,
        abi: REALTERA_ATTESTATION_ABI,
        functionName: "mintVerificationBadge",
        args: [
          address,
          badgeTypeMap[verificationTier],
          projectSlug,
          tier,
          BigInt(score),
          BADGE_VALIDITY[verificationTier],
        ],
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t("mintError");
      setError(errorMessage);
    }
  };

  // Call onSuccess when transaction is confirmed
  if (isSuccess && hash && onSuccess) {
    onSuccess(hash);
  }

  if (!isConnected) {
    return (
      <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 text-center">
        <p className="text-sm text-slate-400">
          {t("verificationBadge.connectPrompt")}
        </p>
      </div>
    );
  }

  if (isSuccess && hash) {
    return (
      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-6">
        <div className="flex items-center gap-3 text-emerald-400">
          <CheckCircle className="h-8 w-8" />
          <div>
            <p className="font-bold text-lg">{t("verificationBadge.mintedSuccess")}</p>
            <a
              href={getExplorerTxUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-emerald-300/70 hover:text-emerald-300 transition-colors"
            >
              {t("viewOnExplorer")} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white">{t("verificationBadge.mintTitle")}</h3>
          <p className="text-sm text-slate-400">
            {projectName} - {tier} {t("tier")} ({score}/100)
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {badgeLabelMap[verificationTier]} {t("verificationBadge.badge")}
          </p>
        </div>
        <button
          onClick={handleMint}
          disabled={isPending || isConfirming}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isPending || isConfirming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Award className="h-4 w-4" />
          )}
          {isPending
            ? t("confirmInWallet")
            : isConfirming
            ? t("confirming")
            : t("mintBadge")}
        </button>
      </div>
      {(error || writeError) && (
        <p className="mt-3 text-sm text-red-400">
          {error || writeError?.message}
        </p>
      )}
    </div>
  );
}
