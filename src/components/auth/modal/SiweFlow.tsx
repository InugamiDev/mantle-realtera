"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ArrowLeft, Wallet, Loader2, CheckCircle, AlertCircle, Fingerprint } from "lucide-react";
import { useSiweSignIn } from "@/hooks/auth";

interface SiweFlowProps {
  onBack: () => void;
  onSuccess: () => void;
}

/**
 * SIWE sign-in flow component
 */
export function SiweFlow({ onBack, onSuccess }: SiweFlowProps) {
  const t = useTranslations("authModal");
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { step, error, signIn, reset } = useSiweSignIn();

  // Auto-proceed to sign when wallet connects
  useEffect(() => {
    if (isConnected && step === "idle") {
      signIn();
    }
  }, [isConnected, step, signIn]);

  // Handle success
  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(onSuccess, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, onSuccess]);

  const handleBack = () => {
    reset();
    if (isConnected) {
      disconnect();
    }
    onBack();
  };

  const handleRetry = () => {
    reset();
    if (isConnected) {
      signIn();
    }
  };

  // Wallet selection step
  if (!isConnected) {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </button>

        <div className="text-center py-2">
          <h3 className="text-lg font-semibold text-white">{t("connectWallet")}</h3>
          <p className="text-sm text-white/60 mt-1">{t("selectWallet")}</p>
        </div>

        <div className="space-y-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isConnecting}
              className="flex items-center gap-3 w-full p-3 rounded-lg
                border border-white/10 bg-white/5 hover:bg-white/10
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wallet className="h-5 w-5 text-purple-400" />
              <span className="font-medium text-white">{connector.name}</span>
              {isConnecting && <Loader2 className="h-4 w-4 animate-spin ml-auto text-white/40" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Signing/Verifying step
  if (step === "signing" || step === "verifying") {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </button>

        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            {step === "signing" ? (
              <Fingerprint className="h-12 w-12 text-purple-400 animate-pulse" />
            ) : (
              <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-white">
            {step === "signing" ? t("signMessage") : t("verifying")}
          </h3>
          <p className="text-sm text-white/60 mt-2">
            {step === "signing" ? t("signMessageDesc") : t("verifyingDesc")}
          </p>
          <p className="text-xs text-white/40 mt-4 font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
      </div>
    );
  }

  // Success step
  if (step === "success") {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white">{t("success")}</h3>
        <p className="text-sm text-white/60 mt-2">{t("successDesc")}</p>
      </div>
    );
  }

  // Error step
  if (step === "error") {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </button>

        <div className="text-center py-6">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white">{t("error")}</h3>
          <p className="text-sm text-red-400 mt-2">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            {t("tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  // Idle state (should auto-proceed)
  return (
    <div className="text-center py-8">
      <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto" />
    </div>
  );
}
