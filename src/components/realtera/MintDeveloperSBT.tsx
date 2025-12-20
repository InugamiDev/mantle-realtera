"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Shield, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  REALTERA_ATTESTATION_ADDRESS,
  REALTERA_ATTESTATION_ABI,
} from "@/lib/contracts";
import { getExplorerTxUrl } from "@/lib/mantle";

interface MintDeveloperSBTProps {
  developerSlug: string;
  developerName: string;
  tier: string;
  score: number;
  onSuccess?: (txHash: string) => void;
}

export function MintDeveloperSBT({
  developerSlug,
  developerName,
  tier,
  score,
  onSuccess,
}: MintDeveloperSBTProps) {
  const { address, isConnected } = useAccount();
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("blockchain");

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
        functionName: "mintDeveloperSBT",
        args: [address, developerSlug, tier, BigInt(score)],
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t("mintError");
      setError(errorMessage);
    }
  };

  if (isSuccess && hash && onSuccess) {
    onSuccess(hash);
  }

  if (!isConnected) {
    return (
      <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 text-center">
        <p className="text-sm text-slate-400">
          {t("developerSBT.connectPrompt")}
        </p>
      </div>
    );
  }

  if (isSuccess && hash) {
    return (
      <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-6">
        <div className="flex items-center gap-3 text-purple-400">
          <CheckCircle className="h-8 w-8" />
          <div>
            <p className="font-bold text-lg">{t("developerSBT.mintedSuccess")}</p>
            <p className="text-xs text-purple-300/70 mb-1">
              {t("developerSBT.nonTransferable")}
            </p>
            <a
              href={getExplorerTxUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-purple-300/70 hover:text-purple-300 transition-colors"
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
          <h3 className="font-bold text-white">{t("developerSBT.mintTitle")}</h3>
          <p className="text-sm text-slate-400">{developerName}</p>
          <p className="text-xs text-slate-500 mt-1">
            {tier} {t("tier")} | {score}/100 | {t("developerSBT.soulBound")}
          </p>
        </div>
        <button
          onClick={handleMint}
          disabled={isPending || isConfirming}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isPending || isConfirming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Shield className="h-4 w-4" />
          )}
          {isPending
            ? t("confirmInWallet")
            : isConfirming
            ? t("confirming")
            : t("mintSBT")}
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
