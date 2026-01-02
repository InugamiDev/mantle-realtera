"use client";

import { useState, useEffect, useCallback } from "react";
import { useSafeStackUser } from "@/stack/safe-hooks";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";
import type { TierLevel } from "@/lib/types";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  BarChart3,
  Pencil,
  Trash2,
  Building2,
  MapPin,
  Calendar,
  FileText
} from "lucide-react";

interface Holding {
  id: string;
  projectSlug: string;
  project: {
    slug: string;
    name: string;
    tier: string | null;
    score: number | null;
    district: string | null;
    city: string | null;
  };
  purchaseDate: string | null;
  purchasePrice: number | null;
  unitArea: number | null;
  currentValue: number | null;
  notes: string | null;
  createdAt: string;
  gainLoss: number | null;
  gainLossPercent: number | null;
}

interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdingsCount: number;
  holdings: Holding[];
}

function formatCurrency(amount: number | null): string {
  if (amount === null) return "--";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCurrencyShort(amount: number | null): string {
  if (amount === null) return "--";
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)} tỷ`;
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(0)} tr`;
  return formatCurrency(amount);
}

function formatPercent(value: number | null): string {
  if (value === null) return "--";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export default function PortfolioPage() {
  const user = useSafeStackUser();
  const t = useTranslations("portfolio");
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/v1/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio);
      }
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchPortfolio]);

  const handleDelete = async (holdingId: string) => {
    if (!confirm(t("deleteConfirm"))) return;

    try {
      const res = await fetch(`/api/v1/portfolio/holdings/${holdingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPortfolio();
      }
    } catch (error) {
      console.error("Failed to delete holding:", error);
    }
  };

  if (!user) {
    return (
      <div className="container-app py-12">
        <GlassCard className="mx-auto max-w-lg p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <Wallet className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t("loginTitle")}</h1>
          <p className="mt-2 text-white/60">
            {t("loginSubtitle")}
          </p>
          <Link
            href="/handler/sign-in?after_auth_return_to=/portfolio"
            className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 font-medium text-black transition-colors hover:bg-amber-400"
          >
            {t("loginButton")}
          </Link>
        </GlassCard>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-app py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-white/10" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-white/5" />
            ))}
          </div>
          <div className="h-64 rounded-xl bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {portfolio?.name || t("title")}
          </h1>
          <p className="mt-1 text-white/60">
            {t("subtitle")}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 font-medium text-black transition-colors hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" />
          {t("addProperty")}
        </button>
      </div>

      {/* Summary Stats */}
      {portfolio && portfolio.holdingsCount > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/20 p-2.5">
                <Wallet className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">{t("totalValue")}</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrencyShort(portfolio.totalValue)}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/20 p-2.5">
                <PiggyBank className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">{t("totalCost")}</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrencyShort(portfolio.totalCost)}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${portfolio.totalGainLoss >= 0 ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                {portfolio.totalGainLoss >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-white/60">{t("gainLoss")}</p>
                <p className={`text-xl font-bold ${portfolio.totalGainLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {formatCurrencyShort(portfolio.totalGainLoss)}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${portfolio.totalGainLossPercent >= 0 ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                <BarChart3 className={`h-5 w-5 ${portfolio.totalGainLossPercent >= 0 ? "text-emerald-400" : "text-red-400"}`} />
              </div>
              <div>
                <p className="text-sm text-white/60">{t("roi")}</p>
                <p className={`text-xl font-bold ${portfolio.totalGainLossPercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {formatPercent(portfolio.totalGainLossPercent)}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Holdings List */}
      <GlassCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="font-semibold text-white">
            {t("holdingsList")} ({portfolio?.holdingsCount || 0})
          </h2>
          <Link
            href="/submit-data"
            className="flex items-center gap-1.5 text-sm text-amber-400 hover:underline"
          >
            <FileText className="h-4 w-4" />
            {t("updateProjectInfo")}
          </Link>
        </div>

        {!portfolio || portfolio.holdingsCount === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <Building2 className="h-7 w-7 text-white/40" />
            </div>
            <p className="text-white/60">{t("noHoldings")}</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 inline-flex items-center gap-2 text-amber-400 hover:underline"
            >
              <Plus className="h-4 w-4" />
              {t("addFirstHolding")}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {portfolio.holdings.map((holding) => (
              <div
                key={holding.id}
                className="flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {holding.project.tier && (
                      <TierBadge tier={holding.project.tier as TierLevel} size="sm" />
                    )}
                    <Link
                      href={`/project/${holding.projectSlug}`}
                      className="font-medium text-white hover:text-amber-400"
                    >
                      {holding.project.name}
                    </Link>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {holding.project.district}, {holding.project.city}
                    </span>
                    {holding.unitArea && (
                      <span>{holding.unitArea} m²</span>
                    )}
                    {holding.purchaseDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(holding.purchaseDate).toLocaleDateString("vi-VN")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8">
                  <div className="text-right">
                    <p className="text-xs text-white/40">{t("purchasePrice")}</p>
                    <p className="font-medium text-white">
                      {formatCurrencyShort(holding.purchasePrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40">{t("currentValue")}</p>
                    <p className="font-medium text-white">
                      {formatCurrencyShort(holding.currentValue)}
                    </p>
                  </div>
                  <div className="min-w-[70px] text-right">
                    <p className="text-xs text-white/40">{t("roi")}</p>
                    <p className={`font-bold ${(holding.gainLossPercent ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {formatPercent(holding.gainLossPercent)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingId(holding.id)}
                      className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(holding.id)}
                      className="rounded-lg p-2 text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Quick Tips */}
      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-white/50">
          <span className="font-medium text-white/70">{t("tip")}</span> {t("tipText")}
        </p>
      </div>

      {/* Add/Edit Modal */}
      {(showAddForm || editingId) && (
        <HoldingForm
          holdingId={editingId}
          holding={editingId ? portfolio?.holdings.find((h) => h.id === editingId) : undefined}
          onClose={() => {
            setShowAddForm(false);
            setEditingId(null);
          }}
          onSuccess={() => {
            setShowAddForm(false);
            setEditingId(null);
            fetchPortfolio();
          }}
        />
      )}
    </div>
  );
}

function HoldingForm({
  holdingId,
  holding,
  onClose,
  onSuccess,
}: {
  holdingId: string | null;
  holding?: Holding;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const t = useTranslations("portfolio");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    projectSlug: holding?.projectSlug || "",
    purchaseDate: holding?.purchaseDate?.split("T")[0] || "",
    purchasePrice: holding?.purchasePrice?.toString() || "",
    unitArea: holding?.unitArea?.toString() || "",
    currentValue: holding?.currentValue?.toString() || "",
    notes: holding?.notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const url = holdingId
        ? `/api/v1/portfolio/holdings/${holdingId}`
        : "/api/v1/portfolio/holdings";

      const res = await fetch(url, {
        method: holdingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSlug: formData.projectSlug,
          purchaseDate: formData.purchaseDate || null,
          purchasePrice: formData.purchasePrice ? parseInt(formData.purchasePrice) : null,
          unitArea: formData.unitArea ? parseFloat(formData.unitArea) : null,
          currentValue: formData.currentValue ? parseInt(formData.currentValue) : null,
          notes: formData.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white">
          {holdingId ? t("form.editTitle") : t("form.title")}
        </h2>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {!holdingId && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white">
                {t("form.projectSlug")} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.projectSlug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, projectSlug: e.target.value }))
                }
                placeholder={t("form.projectSlugPlaceholder")}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50"
              />
              <p className="mt-1 text-xs text-white/40">
                {t("form.projectSlugHint")}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white">{t("form.purchaseDate")}</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, purchaseDate: e.target.value }))
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none transition-colors focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white">{t("form.area")}</label>
              <input
                type="number"
                step="0.01"
                value={formData.unitArea}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, unitArea: e.target.value }))
                }
                placeholder="75.5"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{t("form.purchasePrice")}</label>
            <input
              type="number"
              value={formData.purchasePrice}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, purchasePrice: e.target.value }))
              }
              placeholder="5000000000"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{t("form.currentValue")}</label>
            <input
              type="number"
              value={formData.currentValue}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, currentValue: e.target.value }))
              }
              placeholder="5500000000"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">{t("form.notes")}</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={2}
              placeholder={t("form.notesPlaceholder")}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-medium text-white transition-colors hover:bg-white/10"
            >
              {t("form.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 font-semibold text-black transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? t("form.saving") : holdingId ? t("form.update") : t("form.add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
