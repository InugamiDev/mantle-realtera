"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Calculator,
  MapPin,
  Home,
  TrendingUp,
  ChevronDown,
  Loader2,
  Info,
} from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";

interface ValuationResult {
  estimatedValue: {
    low: number;
    mid: number;
    high: number;
  };
  pricePerSqm: {
    low: number;
    mid: number;
    high: number;
  };
  confidence: "high" | "medium" | "low";
  factors: {
    name: string;
    impact: number;
    reason: string;
  }[];
  marketContext: {
    districtAvg: number;
    cityAvg: number;
    trend: string;
    yoyChange: string;
  };
}

const DISTRICT_KEYS = [
  "quan1",
  "quan2",
  "quan3",
  "quan7",
  "quan9",
  "binhThanh",
  "thuDuc",
  "phuNhuan",
  "tanBinh",
  "goVap",
] as const;

export default function ValuationPage() {
  const t = useTranslations("valuation");
  const tCommon = useTranslations("common");
  const tUnits = useTranslations("units");
  const [formData, setFormData] = useState({
    district: "",
    city: "TP. Hồ Chí Minh",
    area: "",
    bedrooms: "",
    floor: "",
    hasBalcony: false,
    hasParking: false,
    buildingAge: "",
  });
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.district || !formData.area) {
      setError(tCommon("error"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district: formData.district,
          city: formData.city,
          area: parseFloat(formData.area),
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
          floor: formData.floor ? parseInt(formData.floor) : undefined,
          hasBalcony: formData.hasBalcony,
          hasParking: formData.hasParking,
          buildingAge: formData.buildingAge
            ? parseInt(formData.buildingAge)
            : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get valuation");
      }

      setResult(data.valuation);
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon("error"));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)} ${tUnits("billion")}`;
    }
    return `${(value / 1_000_000).toFixed(0)} ${tUnits("million")}`;
  };

  const formatPricePerSqm = (value: number) => {
    return `${(value / 1_000_000).toFixed(0)} ${t("pricePerSqmUnit")}`;
  };

  return (
    <div className="container-app py-6 sm:py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">{tCommon("backToRanking")}</span>
        <span className="sm:hidden">{tCommon("backToRanking").split(" ")[0]}</span>
      </Link>

      {/* Header */}
      <header className="page-header">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Calculator className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium uppercase tracking-wider text-emerald-400">
            {t("badge")}
          </span>
        </div>
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">{t("subtitle")}</p>
      </header>

      <div className="mt-6 sm:mt-8 grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <GlassCard className="p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">
            {t("propertyInfo")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* District */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {t("district")} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-foreground focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">{t("selectDistrict")}</option>
                  {DISTRICT_KEYS.map((key) => (
                    <option key={key} value={t(`districts.${key}`)}>
                      {t(`districts.${key}`)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Area */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {t("area")} ({tUnits("sqm")}) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  placeholder="VD: 70"
                  min="20"
                  max="500"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Bedrooms & Floor */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("bedrooms")}
                </label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) =>
                    setFormData({ ...formData, bedrooms: e.target.value })
                  }
                  className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 py-3 px-4 text-foreground focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">{t("select")}</option>
                  <option value="1">{t("bedroomOptions.1")}</option>
                  <option value="2">{t("bedroomOptions.2")}</option>
                  <option value="3">{t("bedroomOptions.3")}</option>
                  <option value="4">{t("bedroomOptions.4")}</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("floor")}
                </label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) =>
                    setFormData({ ...formData, floor: e.target.value })
                  }
                  placeholder="VD: 15"
                  min="1"
                  max="50"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-3 px-4 text-foreground placeholder-muted-foreground focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Building Age */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {t("buildYear")} ({tUnits("years")})
              </label>
              <input
                type="number"
                value={formData.buildingAge}
                onChange={(e) =>
                  setFormData({ ...formData, buildingAge: e.target.value })
                }
                placeholder="VD: 2"
                min="0"
                max="30"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 px-4 text-foreground placeholder-muted-foreground focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                {t("amenities")}
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.hasBalcony}
                    onChange={(e) =>
                      setFormData({ ...formData, hasBalcony: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-foreground">{t("balcony")}</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.hasParking}
                    onChange={(e) =>
                      setFormData({ ...formData, hasParking: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-foreground">{t("parking")}</span>
                </label>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 font-medium text-black transition-colors hover:bg-emerald-400 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {tCommon("loading")}
                </>
              ) : (
                <>
                  <Calculator className="h-5 w-5" />
                  {t("calculate")}
                </>
              )}
            </button>
          </form>
        </GlassCard>

        {/* Result */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Main Result */}
              <GlassCard className="overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("estimatedValue")}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        result.confidence === "high"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : result.confidence === "medium"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {t("confidence")}: {result.confidence}
                    </span>
                  </div>
                  <p className="mt-2 text-3xl sm:text-4xl font-bold text-emerald-400">
                    {formatCurrency(result.estimatedValue.mid)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("priceRange")}: {formatCurrency(result.estimatedValue.low)} -{" "}
                    {formatCurrency(result.estimatedValue.high)}
                  </p>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {formatPricePerSqm(result.pricePerSqm.low)}
                      </p>
                      <p className="text-xs text-muted-foreground">{t("low")}</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-emerald-400">
                        {formatPricePerSqm(result.pricePerSqm.mid)}
                      </p>
                      <p className="text-xs text-muted-foreground">{t("mid")}</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {formatPricePerSqm(result.pricePerSqm.high)}
                      </p>
                      <p className="text-xs text-muted-foreground">{t("high")}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Factors */}
              {result.factors.length > 0 && (
                <GlassCard className="p-4 sm:p-6">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    {t("factors")}
                  </h3>
                  <div className="space-y-2">
                    {result.factors.map((factor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-white/5 p-3"
                      >
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {factor.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {factor.reason}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            factor.impact > 0
                              ? "text-emerald-400"
                              : factor.impact < 0
                                ? "text-red-400"
                                : "text-muted-foreground"
                          }`}
                        >
                          {factor.impact > 0 ? "+" : ""}
                          {factor.impact}%
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Market Context */}
              <GlassCard className="p-4 sm:p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                  {t("marketComparison")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("avgDistrict")}</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatPricePerSqm(result.marketContext.districtAvg)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("avgCity")}</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatPricePerSqm(result.marketContext.cityAvg)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("trend")}</p>
                    <p className="text-lg font-bold text-emerald-400">
                      {result.marketContext.trend === "up" ? t("trendUp") : t("trendStable")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("yoy")}</p>
                    <p className="text-lg font-bold text-emerald-400">
                      {result.marketContext.yoyChange}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </>
          ) : (
            <GlassCard className="flex h-full min-h-[300px] flex-col items-center justify-center p-6 text-center">
              <Calculator className="h-12 w-12 text-emerald-400/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {t("propertyInfo")}
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {t("subtitle")}
              </p>
            </GlassCard>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>{t("disclaimer")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
