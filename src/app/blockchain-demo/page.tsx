"use client";

import { Web3Provider } from "@/providers/Web3Provider";
import { ConnectWalletButton } from "@/components/realtera/ConnectWalletButton";
import { MintVerificationBadge } from "@/components/realtera/MintVerificationBadge";
import { MintPropertyNFT } from "@/components/realtera/MintPropertyNFT";
import { MintDeveloperSBT } from "@/components/realtera/MintDeveloperSBT";
import { useState } from "react";
import { useTranslations } from "next-intl";

function BlockchainDemo() {
  const [mintedTxs, setMintedTxs] = useState<string[]>([]);
  const t = useTranslations("blockchain");

  const handleSuccess = (txHash: string) => {
    setMintedTxs((prev) => [...prev, txHash]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
              {t("title")}
            </h1>
            <p className="text-slate-400 mt-2">
              {t("subtitle")}
            </p>
          </div>
          <ConnectWalletButton />
        </div>

        <div className="grid gap-6">
          {/* Verification Badge */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-semibold mb-4 text-amber-400">
              {t("verificationBadge.title")}
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              {t("verificationBadge.description")}
            </p>
            <MintVerificationBadge
              projectSlug="vinhomes-grand-park"
              projectName="Vinhomes Grand Park"
              tier="S+"
              score={92}
              verificationTier="premium"
              onSuccess={handleSuccess}
            />
          </div>

          {/* Property NFT */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">
              {t("propertyNFT.title")}
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              {t("propertyNFT.description")}
            </p>
            <MintPropertyNFT
              projectSlug="the-marq-district-1"
              projectName="The Marq"
              district="Quận 1"
              tier="SSS"
              score={98}
              pricePerSqm={150000000}
              onSuccess={handleSuccess}
            />
          </div>

          {/* Developer SBT */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">
              {t("developerSBT.title")}
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              {t("developerSBT.description")}
            </p>
            <MintDeveloperSBT
              developerSlug="vinhomes"
              developerName="Vinhomes"
              tier="SSS"
              score={95}
              onSuccess={handleSuccess}
            />
          </div>

          {/* Transaction History */}
          {mintedTxs.length > 0 && (
            <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20">
              <h2 className="text-xl font-semibold mb-4 text-emerald-400">
                {t("mintedTransactions")}
              </h2>
              <ul className="space-y-2">
                {mintedTxs.map((tx, i) => (
                  <li key={i} className="text-sm font-mono text-slate-300">
                    {tx.slice(0, 20)}...{tx.slice(-10)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-slate-800/30 rounded-xl border border-slate-700/30">
          <h3 className="font-semibold text-amber-400 mb-3">{t("setupInstructions")}</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
            <li>{t("instruction1")}</li>
            <li>{t("instruction2")} <code className="bg-slate-700 px-2 py-0.5 rounded text-xs">0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80</code></li>
            <li>{t("instruction3")}</li>
          </ol>
        </div>

        <div className="mt-6 text-center text-slate-500 text-sm">
          {t("contractAddress")}: 0x5FbDB2315678afecb367f032d93F642f64180aa3 (Localhost)
        </div>
      </div>
    </div>
  );
}

export default function BlockchainDemoPage() {
  return (
    <Web3Provider>
      <BlockchainDemo />
    </Web3Provider>
  );
}
