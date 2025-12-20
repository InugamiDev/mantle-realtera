"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Mail, Wallet, Link2, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLinkWallet } from "@/hooks/auth";
import { GlassCard } from "@/components/realtera/GlassCard";

interface LinkedAccountsProps {
  email: string | null;
  walletAddress: string | null;
}

/**
 * Component for displaying and managing linked accounts
 */
export function LinkedAccounts({ email, walletAddress }: LinkedAccountsProps) {
  const t = useTranslations("linkedAccounts");
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { step, error, linkWallet, reset } = useLinkWallet();

  const [showWalletConnect, setShowWalletConnect] = useState(false);

  // Auto-link when wallet connects
  useEffect(() => {
    if (isConnected && showWalletConnect && step === "idle" && !walletAddress) {
      linkWallet();
    }
  }, [isConnected, showWalletConnect, step, linkWallet, walletAddress]);

  // Handle successful link
  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        setShowWalletConnect(false);
        reset();
        window.location.reload();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, reset]);

  const handleLinkWallet = () => {
    setShowWalletConnect(true);
  };

  const handleCancelLink = () => {
    setShowWalletConnect(false);
    reset();
    if (isConnected) {
      disconnect();
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Link2 className="h-5 w-5 text-amber-400" />
        <h3 className="text-lg font-bold text-white">{t("title")}</h3>
      </div>

      <div className="space-y-3">
        {/* Email Status */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
              <Mail className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-white">{t("email")}</p>
              {email ? (
                <p className="text-sm text-emerald-400">{email}</p>
              ) : (
                <p className="text-sm text-white/40">{t("notLinked")}</p>
              )}
            </div>
          </div>
          {!email && (
            <Link
              href="/handler/sign-in"
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {t("linkEmail")}
            </Link>
          )}
          {email && (
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          )}
        </div>

        {/* Wallet Status */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
              <Wallet className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-white">{t("wallet")}</p>
              {walletAddress ? (
                <p className="text-sm text-emerald-400 font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              ) : (
                <p className="text-sm text-white/40">{t("notLinked")}</p>
              )}
            </div>
          </div>
          {!walletAddress && !showWalletConnect && (
            <button
              onClick={handleLinkWallet}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors"
            >
              {t("linkWallet")}
            </button>
          )}
          {walletAddress && (
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          )}
        </div>

        {/* Wallet Connect Flow */}
        {showWalletConnect && !walletAddress && (
          <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-500/10">
            {step === "error" && (
              <div className="flex items-center gap-2 mb-3 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {step === "success" ? (
              <div className="flex items-center justify-center gap-2 text-emerald-400 py-2">
                <CheckCircle className="h-5 w-5" />
                <span>{t("walletLinkedSuccess")}</span>
              </div>
            ) : step === "signing" || step === "linking" ? (
              <div className="flex items-center justify-center gap-2 text-purple-300 py-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{step === "signing" ? t("signing") : t("linking")}</span>
              </div>
            ) : !isConnected ? (
              <div className="space-y-2">
                <p className="text-sm text-white/60 mb-3">Select a wallet:</p>
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    disabled={isConnecting}
                    className="flex items-center gap-2 w-full p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors disabled:opacity-50"
                  >
                    <Wallet className="h-4 w-4 text-purple-400" />
                    {connector.name}
                    {isConnecting && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/60 py-2">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                <span className="text-sm">Preparing...</span>
              </div>
            )}

            {step !== "success" && (
              <button
                onClick={handleCancelLink}
                className="w-full mt-3 text-sm text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
