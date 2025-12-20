"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Shield, FileCheck, RefreshCw } from "lucide-react";

export function TrustBar() {
  const t = useTranslations("trustBar");

  return (
    <div className="border-b border-white/5 bg-white/2 backdrop-blur-xl">
      <div className="container-app">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 text-xs sm:justify-between">
          <div className="flex items-center gap-4 whitespace-nowrap">
            <span className="font-semibold text-cyan-400">{t("transparency")}:</span>
            <Link
              href="/verification"
              className="flex items-center gap-1.5 text-white/60 transition-colors hover:text-cyan-400"
            >
              <Shield className="h-3.5 w-3.5 text-cyan-500/70" aria-hidden="true" />
              {t("verification")}
            </Link>
            <span className="text-white/20" aria-hidden="true">•</span>
            <Link
              href="/methodology"
              className="flex items-center gap-1.5 text-white/60 transition-colors hover:text-purple-400"
            >
              <FileCheck className="h-3.5 w-3.5 text-purple-500/70" aria-hidden="true" />
              {t("sources")}
            </Link>
            <span className="text-white/20" aria-hidden="true">•</span>
            <Link
              href="/about"
              className="flex items-center gap-1.5 text-white/60 transition-colors hover:text-pink-400"
            >
              <RefreshCw className="h-3.5 w-3.5 text-pink-500/70" aria-hidden="true" />
              {t("updates")}
            </Link>
          </div>
          <div className="flex items-center gap-4 whitespace-nowrap text-white/50">
            <Link
              href="/verification"
              className="transition-colors hover:text-cyan-400 focus:outline-none focus-visible:text-cyan-400"
            >
              {t("verificationProcess")}
            </Link>
            <span className="text-white/20" aria-hidden="true">|</span>
            <Link
              href="/sponsorship"
              className="transition-colors hover:text-cyan-400 focus:outline-none focus-visible:text-cyan-400"
            >
              {t("sponsorPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
