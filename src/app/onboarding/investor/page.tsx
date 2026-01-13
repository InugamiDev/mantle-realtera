"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Loader2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const BUDGET_RANGES = ["under_1b", "1b_3b", "3b_5b", "5b_10b", "over_10b"];
const INTERESTS = ["apartment", "villa", "townhouse", "land", "commercial"];
const CITIES = ["hcm", "hanoi", "danang", "other"];

export default function InvestorOnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    budgetRange: "",
    interests: [] as string[],
    preferredCities: [] as string[],
  });

  const toggleInterest = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const toggleCity = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredCities: prev.preferredCities.includes(id)
        ? prev.preferredCities.filter((c) => c !== id)
        : [...prev.preferredCities, id],
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Complete onboarding
      const response = await fetch("/api/v1/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
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
          <TrendingUp className="h-4 w-4" />
          {t("investor.profileTitle")}
        </div>
        <h2 className="text-2xl font-bold text-white">{t("investor.profileSubtitle")}</h2>
        <p className="mt-2 text-white/60">
          {t("investor.optional")}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Budget Range */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white">
          {t("investor.budget")}
        </label>
        <div className="grid gap-2 sm:grid-cols-3">
          {BUDGET_RANGES.map((range) => (
            <button
              key={range}
              onClick={() => setFormData((p) => ({ ...p, budgetRange: range }))}
              className={cn(
                "rounded-lg border p-3 text-sm transition-all duration-200",
                formData.budgetRange === range
                  ? "border-amber-500 bg-amber-500/10 text-amber-400 shadow-sm shadow-amber-500/10"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/[0.04]"
              )}
            >
              {t(`investor.budgetRanges.${range}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Property Interests */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white">
          {t("investor.interests")}
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-all duration-200",
                formData.interests.includes(interest)
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/[0.04]"
              )}
            >
              {t(`investor.propertyTypes.${interest}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Cities */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white">
          {t("investor.locations")}
        </label>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => toggleCity(city)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-all duration-200",
                formData.preferredCities.includes(city)
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/[0.04]"
              )}
            >
              {t(`investor.cities.${city}`)}
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
          disabled={isLoading}
          className={cn(
            "flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all duration-200",
            isLoading
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
