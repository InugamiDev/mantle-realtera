"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Loader2, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const USE_CASES = ["property_portal", "fintech", "market_research", "crm", "mobile_app", "other"];
const EXPECTED_VOLUMES = ["low", "medium", "high", "very_high"];

export default function ApiUserOnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    useCase: "",
    useCaseDescription: "",
    expectedVolume: "",
    website: "",
  });

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
          <Code2 className="h-4 w-4" />
          {t("api.profileTitle")}
        </div>
        <h2 className="text-2xl font-bold text-white">{t("api.profileSubtitle")}</h2>
        <p className="mt-2 text-white/60">
          {t("api.optional")}
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
          {t("api.companyName")} <span className="text-amber-400">*</span>
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) =>
            setFormData((p) => ({ ...p, companyName: e.target.value }))
          }
          placeholder={t("api.companyNamePlaceholder")}
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
        />
      </div>

      {/* Website */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          {t("api.website")}
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) =>
            setFormData((p) => ({ ...p, website: e.target.value }))
          }
          placeholder={t("api.websitePlaceholder")}
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
        />
      </div>

      {/* Use Case */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white">
          {t("api.useCase")} <span className="text-amber-400">*</span>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {USE_CASES.map((uc) => (
            <button
              key={uc}
              onClick={() => setFormData((p) => ({ ...p, useCase: uc }))}
              className={cn(
                "rounded-lg border p-4 text-left transition-all duration-200",
                formData.useCase === uc
                  ? "border-amber-500 bg-amber-500/10 shadow-sm shadow-amber-500/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              )}
            >
              <p className={cn(
                "font-medium",
                formData.useCase === uc ? "text-amber-400" : "text-white"
              )}>
                {t(`api.useCases.${uc}.label`)}
              </p>
              <p className="text-sm text-white/50">{t(`api.useCases.${uc}.description`)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Use Case Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          {t("api.useCaseDescription")}{" "}
          <span className="text-white/40 text-xs">({t("api.useCaseOptional")})</span>
        </label>
        <textarea
          value={formData.useCaseDescription}
          onChange={(e) =>
            setFormData((p) => ({ ...p, useCaseDescription: e.target.value }))
          }
          placeholder={t("api.useCaseDescriptionPlaceholder")}
          rows={3}
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
        />
      </div>

      {/* Expected Volume */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white">
          {t("api.expectedVolume")}
        </label>
        <div className="grid gap-2 sm:grid-cols-4">
          {EXPECTED_VOLUMES.map((vol) => (
            <button
              key={vol}
              onClick={() => setFormData((p) => ({ ...p, expectedVolume: vol }))}
              className={cn(
                "rounded-lg border p-3 text-center transition-all duration-200",
                formData.expectedVolume === vol
                  ? "border-amber-500 bg-amber-500/10 shadow-sm shadow-amber-500/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              )}
            >
              <p className={cn(
                "text-sm font-medium",
                formData.expectedVolume === vol ? "text-amber-400" : "text-white"
              )}>
                {t(`api.volumes.${vol}.label`)}
              </p>
              <p className="text-xs text-white/50">{t(`api.volumes.${vol}.description`)}</p>
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
          disabled={isLoading || !formData.companyName || !formData.useCase}
          className={cn(
            "flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all duration-200",
            isLoading || !formData.companyName || !formData.useCase
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
