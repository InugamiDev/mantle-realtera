"use client";

import { useLocale } from "next-intl";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();

  const switchLocale = (newLocale: string) => {
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    window.location.reload();
  };

  return (
    <button
      onClick={() => switchLocale(locale === "vi" ? "en" : "vi")}
      className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-amber-500/10 hover:text-amber-300"
      aria-label={locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
    >
      <Globe className="h-4 w-4" />
      <span>{locale === "vi" ? "EN" : "VI"}</span>
    </button>
  );
}
