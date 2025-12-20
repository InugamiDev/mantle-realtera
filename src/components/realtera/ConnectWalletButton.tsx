"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { Wallet, LogOut, ChevronDown, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

// Get expected chain from env
const expectedChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 31337;

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("blockchain");

  // Prevent hydration mismatch - only render wallet state after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const isWrongNetwork = isConnected && chainId !== expectedChainId;

  // Show loading skeleton until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="h-10 w-36 rounded-lg bg-white/5 animate-pulse" />
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {isWrongNetwork && (
          <button
            onClick={() => switchChain?.({ chainId: expectedChainId })}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-sm text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <AlertCircle className="h-4 w-4" />
            {t("switchNetwork")}
          </button>
        )}
        <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="rounded-lg bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-colors"
          title={t("disconnect")}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 px-4 py-2 text-sm font-medium text-amber-300 hover:from-amber-500/30 hover:to-amber-600/30 transition-all border border-amber-500/20"
      >
        <Wallet className="h-4 w-4" />
        {isPending ? t("connecting") : t("connectWallet")}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl bg-slate-800/95 backdrop-blur-sm p-2 shadow-xl border border-slate-700/50">
            <div className="px-3 py-2 text-xs text-slate-400 border-b border-slate-700/50 mb-2">
              {expectedChainId === 31337 ? t("connectToLocalhost") : t("connectToMantle")}
            </div>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white hover:bg-slate-700/50 transition-colors"
              >
                {connector.name === "MetaMask" && (
                  <span className="text-lg">🦊</span>
                )}
                {connector.name === "Injected" && (
                  <span className="text-lg">💉</span>
                )}
                {connector.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
