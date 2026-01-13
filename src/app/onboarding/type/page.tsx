"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  TrendingUp,
  Building2,
  HardHat,
  Code2,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountTypeOption {
  id: string;
  icon: React.ReactNode;
  href: string;
}

const ACCOUNT_TYPES: AccountTypeOption[] = [
  {
    id: "investor",
    icon: <TrendingUp className="h-8 w-8" />,
    href: "/onboarding/investor",
  },
  {
    id: "agency",
    icon: <Building2 className="h-8 w-8" />,
    href: "/onboarding/agency",
  },
  {
    id: "developer",
    icon: <HardHat className="h-8 w-8" />,
    href: "/onboarding/developer",
  },
  {
    id: "api",
    icon: <Code2 className="h-8 w-8" />,
    href: "/onboarding/api",
  },
];

export default function OnboardingTypePage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async (type: AccountTypeOption) => {
    setSelectedType(type.id);
    setIsLoading(true);

    try {
      // Save account type selection
      const accountType = type.id === "api" ? "api_user" : type.id;
      const response = await fetch("/api/v1/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountType }),
      });

      if (!response.ok) {
        throw new Error("Failed to save account type");
      }

      // Navigate to profile step
      router.push(type.href);
    } catch (error) {
      console.error("Error saving account type:", error);
      setIsLoading(false);
      setSelectedType(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 text-sm text-white/60">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-bold text-black shadow-lg shadow-amber-500/20">
          1
        </span>
        <span className="w-12 h-0.5 bg-gradient-to-r from-amber-500/50 to-white/10 rounded-full" />
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs text-white/40">
          2
        </span>
        <span className="w-12 h-0.5 bg-white/10 rounded-full" />
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs text-white/40">
          3
        </span>
      </div>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">{t("selectType")}</h2>
        <p className="mt-2 text-white/60">
          {t("selectTypeSubtitle")}
        </p>
      </div>

      {/* Options */}
      <div className="grid gap-4 sm:grid-cols-2">
        {ACCOUNT_TYPES.map((type) => {
          const typeKey = type.id as "investor" | "agency" | "developer" | "api";
          const benefits = t.raw(`types.${typeKey}.benefits`) as string[];

          return (
            <button
              key={type.id}
              onClick={() => handleSelect(type)}
              disabled={isLoading}
              className={cn(
                "group relative overflow-hidden rounded-xl border p-6 text-left transition-all duration-300",
                "hover:border-amber-500/50 hover:bg-white/[0.03] hover:shadow-lg hover:shadow-amber-500/5",
                selectedType === type.id
                  ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                  : "border-white/10 bg-white/[0.02]"
              )}
            >
              {/* Loading overlay */}
              {isLoading && selectedType === type.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
                </div>
              )}

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div
                className={cn(
                  "relative mb-4 inline-flex rounded-xl p-3 transition-all duration-300",
                  selectedType === type.id
                    ? "bg-gradient-to-br from-amber-400/20 to-amber-600/20 text-amber-400"
                    : "bg-white/5 text-white/60 group-hover:bg-amber-500/10 group-hover:text-amber-400"
                )}
              >
                {type.icon}
              </div>

              {/* Content */}
              <h3 className="relative text-lg font-semibold text-white">
                {t(`types.${typeKey}.title`)}
              </h3>
              <p className="relative mt-1 text-sm text-white/60">
                {t(`types.${typeKey}.description`)}
              </p>

              {/* Benefits */}
              <ul className="relative mt-4 space-y-2">
                {benefits.map((benefit: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-white/50"
                  >
                    <ArrowRight className={cn(
                      "h-3 w-3 transition-colors",
                      selectedType === type.id ? "text-amber-400" : "text-white/30 group-hover:text-amber-400"
                    )} />
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* Selected indicator */}
              {selectedType === type.id && (
                <div className="absolute right-4 top-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
                    <CheckCircle2 className="h-4 w-4 text-black" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
