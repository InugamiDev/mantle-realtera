"use client";

import { useTranslations } from "next-intl";
import { Mail, Wallet } from "lucide-react";
import Link from "next/link";

interface AuthOptionsProps {
  onWalletSelect: () => void;
}

/**
 * Initial auth method selection screen
 */
export function AuthOptions({ onWalletSelect }: AuthOptionsProps) {
  const t = useTranslations("authModal");

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">{t("title")}</h2>
        <p className="mt-1 text-sm text-white/60">{t("subtitle")}</p>
      </div>

      <div className="space-y-3 pt-2">
        {/* Email/Google Option */}
        <Link
          href="/handler/sign-in"
          className="flex items-center gap-4 w-full p-4 rounded-xl
            border border-white/10 bg-white/5 hover:bg-white/10
            transition-all hover:border-amber-500/30 group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20">
            <Mail className="h-5 w-5 text-amber-400" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white group-hover:text-amber-300 transition-colors">
              {t("emailOption")}
            </p>
            <p className="text-sm text-white/50">{t("emailDescription")}</p>
          </div>
        </Link>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/40">{t("or")}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Wallet Option */}
        <button
          onClick={onWalletSelect}
          className="flex items-center gap-4 w-full p-4 rounded-xl
            border border-white/10 bg-white/5 hover:bg-white/10
            transition-all hover:border-purple-500/30 group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <Wallet className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
              {t("walletOption")}
            </p>
            <p className="text-sm text-white/50">{t("walletDescription")}</p>
          </div>
        </button>
      </div>

      <p className="text-center text-xs text-white/40 pt-2">
        {t("terms")}
      </p>
    </div>
  );
}
