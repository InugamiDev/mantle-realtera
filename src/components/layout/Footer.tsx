"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");

  return (
    <footer className="relative mt-auto pt-16 border-t border-white/5">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      <div className="container-app relative py-12">
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">RealTera</span>
            </Link>
            <p className="mt-2 text-sm text-white/50">
              {t("tagline")}
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm" aria-label="Footer navigation">
            <Link
              href="/verification"
              className="text-white/50 transition-colors hover:text-cyan-400 focus:outline-none focus-visible:text-cyan-400"
            >
              {t("verification")}
            </Link>
            <Link
              href="/sponsorship"
              className="text-white/50 transition-colors hover:text-cyan-400 focus:outline-none focus-visible:text-cyan-400"
            >
              {t("sponsor")}
            </Link>
            <Link
              href="/methodology"
              className="text-white/50 transition-colors hover:text-cyan-400 focus:outline-none focus-visible:text-cyan-400"
            >
              {t("methodology")}
            </Link>
            <Link
              href="/about"
              className="text-white/50 transition-colors hover:text-cyan-400 focus:outline-none focus-visible:text-cyan-400"
            >
              {t("about")}
            </Link>
            <span
              className="cursor-not-allowed text-white/30"
              title={tCommon("comingSoon")}
            >
              {t("contact")}
            </span>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-white/5 pt-8 text-center text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} RealTera. {t("copyright")}</p>
          <p className="mt-1 text-white/30">{t("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
