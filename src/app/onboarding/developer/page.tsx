"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Loader2, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";

const PROJECT_COUNTS = ["1_5", "6_20", "21_50", "over_50"];
const DEVELOPMENT_TYPES = ["residential", "commercial", "mixed", "hospitality", "industrial"];

export default function DeveloperOnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    stockCode: "",
    foundedYear: "",
    projectCount: "",
    developmentTypes: [] as string[],
    website: "",
  });

  const toggleDevelopmentType = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      developmentTypes: prev.developmentTypes.includes(id)
        ? prev.developmentTypes.filter((t) => t !== id)
        : [...prev.developmentTypes, id],
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          profile: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete onboarding");
      }

      router.push(data.redirectTo || "/onboarding/complete");
    } catch (err) {
      console.error("Error completing onboarding:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 text-sm text-white/60">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/20 text-xs font-medium text-amber-400">
          1
        </span>
        <span className="w-12 h-0.5 bg-gradient-to-r from-amber-500 to-amber-500/50 rounded-full" />
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-bold text-black shadow-lg shadow-amber-500/20">
          2
        </span>
        <span className="w-12 h-0.5 bg-gradient-to-r from-amber-500/50 to-white/10 rounded-full" />
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs text-white/40">
          3
        </span>
      </div>

      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-400 mb-3">
          <HardHat className="h-4 w-4" />
          {t("developer.profileTitle")}
        </div>
        <h2 className="text-2xl font-bold text-white">{t("developer.profileSubtitle")}</h2>
        <p className="mt-2 text-white/60">
          {t("developer.optional")}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Company Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          {t("developer.companyName")} <span className="text-amber-400">*</span>
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) =>
            setFormData((p) => ({ ...p, companyName: e.target.value }))
          }
          placeholder={t("developer.companyNamePlaceholder")}
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
        />
      </div>

      {/* Stock Code & Founded Year */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">
            {t("developer.stockCode")}{" "}
            <span className="text-white/40 text-xs">({t("developer.stockCodeIfListed")})</span>
          </label>
          <input
            type="text"
            value={formData.stockCode}
            onChange={(e) =>
              setFormData((p) => ({ ...p, stockCode: e.target.value }))
            }
            placeholder={t("developer.stockCodePlaceholder")}
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">
            {t("developer.established")}
          </label>
          <input
            type="number"
            value={formData.foundedYear}
            onChange={(e) =>
              setFormData((p) => ({ ...p, foundedYear: e.target.value }))
            }
            placeholder={t("developer.establishedPlaceholder")}
            min="1900"
            max={new Date().getFullYear()}
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Website */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          {t("developer.website")}
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) =>
            setFormData((p) => ({ ...p, website: e.target.value }))
          }
          placeholder={t("developer.websitePlaceholder")}
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
        />
      </div>

      {/* Project Count */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white">
          {t("developer.portfolio")}
        </label>
        <div className="grid gap-2 sm:grid-cols-4">
          {PROJECT_COUNTS.map((count) => (
            <button
              key={count}
              onClick={() => setFormData((p) => ({ ...p, projectCount: count }))}
              className={cn(
                "rounded-lg border p-3 text-sm transition-all duration-200",
                formData.projectCount === count
                  ? "border-amber-500 bg-amber-500/10 text-amber-400 shadow-sm shadow-amber-500/10"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/[0.04]"
              )}
            >
              {t(`developer.projectCounts.${count}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Development Types */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white">
          {t("developer.developmentTypes")}
        </label>
        <div className="flex flex-wrap gap-2">
          {DEVELOPMENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleDevelopmentType(type)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-all duration-200",
                formData.developmentTypes.includes(type)
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/[0.04]"
              )}
            >
              {t(`developer.types.${type}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <button
          onClick={() => router.push("/onboarding/type")}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </button>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !formData.companyName}
          className={cn(
            "flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all duration-200",
            isLoading || !formData.companyName
              ? "bg-amber-500/50 text-black/50 cursor-not-allowed"
              : "bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:from-amber-300 hover:to-amber-500 shadow-lg shadow-amber-500/20"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("completing")}
            </>
          ) : (
            <>
              {t("completeSetup")}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
