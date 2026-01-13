"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Loader2, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TEAM_SIZES = ["solo", "small", "medium", "large"];
const SPECIALIZATIONS = ["residential", "commercial", "luxury", "industrial", "land"];

export default function AgencyOnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    licenseNumber: "",
    teamSize: "",
    specializations: [] as string[],
  });

  const toggleSpecialization = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(id)
        ? prev.specializations.filter((s) => s !== id)
        : [...prev.specializations, id],
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
          <Building2 className="h-4 w-4" />
          {t("agency.profileTitle")}
        </div>
        <h2 className="text-2xl font-bold text-white">{t("agency.profileSubtitle")}</h2>
        <p className="mt-2 text-white/60">
          {t("agency.optional")}
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
          {t("agency.companyName")} <span className="text-amber-400">*</span>
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) =>
            setFormData((p) => ({ ...p, companyName: e.target.value }))
          }
          placeholder={t("agency.companyNamePlaceholder")}
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
        />
      </div>

      {/* License Number */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          {t("agency.licenseNumber")}{" "}
          <span className="text-white/40 text-xs">({t("agency.licenseOptional")})</span>
        </label>
        <input
          type="text"
          value={formData.licenseNumber}
          onChange={(e) =>
            setFormData((p) => ({ ...p, licenseNumber: e.target.value }))
          }
          placeholder={t("agency.licenseNumberPlaceholder")}
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
        />
      </div>

      {/* Team Size */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white">
          {t("agency.teamSize")}
        </label>
        <div className="grid gap-2 sm:grid-cols-4">
          {TEAM_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setFormData((p) => ({ ...p, teamSize: size }))}
              className={cn(
                "rounded-lg border p-3 text-sm transition-all duration-200",
                formData.teamSize === size
                  ? "border-amber-500 bg-amber-500/10 text-amber-400 shadow-sm shadow-amber-500/10"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/[0.04]"
              )}
            >
              {t(`agency.teamSizes.${size}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Specializations */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white">
          {t("agency.specialization")}
        </label>
        <div className="flex flex-wrap gap-2">
          {SPECIALIZATIONS.map((spec) => (
            <button
              key={spec}
              onClick={() => toggleSpecialization(spec)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-all duration-200",
                formData.specializations.includes(spec)
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/[0.04]"
              )}
            >
              {t(`agency.specializations.${spec}`)}
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
