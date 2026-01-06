"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Search,
  ArrowLeft,
  Shield,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";
import { AttestationDetails } from "@/components/realtera/AttestationDetails";
import { AttestationBadge } from "@/components/realtera/AttestationBadge";
import {
  getRegistryStats,
  isMockMode,
  getAllAttestations,
} from "@/lib/attestation-service";
import { slugToAssetId } from "@/lib/attestation-registry";
import type { AttestationSummary } from "@/lib/attestation-registry";

export default function VerifyPage() {
  const t = useTranslations("verify");
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || searchParams.get("asset") || "";

  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [attestation, setAttestation] = useState<AttestationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [copied, setCopied] = useState(false);

  // Load stats on mount
  useEffect(() => {
    getRegistryStats().then(setStats);
  }, []);

  // Auto-search if query param provided
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setError(null);
    setSearched(true);

    try {
      // Use API endpoint for attestation lookup
      const params = new URLSearchParams();

      // Check if it's a bytes32 asset ID (starts with 0x and is 66 chars)
      if (q.startsWith("0x") && q.length === 66) {
        params.set("assetId", q);
      } else {
        // Treat as project slug
        params.set("slug", q.toLowerCase().trim());
      }

      const response = await fetch(`/api/v1/attestations?${params}`);
      const json = await response.json();

      if (response.ok && json.data) {
        setAttestation(json.data);
      } else {
        setAttestation(null);
        setError(t("notFoundError"));
      }
    } catch (err) {
      setError(t("notFoundError"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAssetId = () => {
    if (attestation?.assetId) {
      navigator.clipboard.writeText(attestation.assetId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Sample attestations for demo
  const [sampleAttestations, setSampleAttestations] = useState<AttestationSummary[]>([]);

  // Load sample attestations on mount
  useEffect(() => {
    getAllAttestations().then(setSampleAttestations);
  }, []);

  return (
    <div className="container-app py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToHome")}
      </Link>

      {/* Page Header */}
      <header className="page-header mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ShieldCheck className="h-8 w-8 text-cyan-400" />
        </div>
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">{t("subtitle")}</p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-400">
          <span>
            <strong className="text-white">{stats.total}</strong> {t("stats.attestations")}
          </span>
          <span>
            <strong className="text-emerald-400">{stats.active}</strong> {t("stats.active")}
          </span>
          {isMockMode() && (
            <span className="text-amber-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {t("demoMode")}
            </span>
          )}
        </div>
      </header>

      {/* Search Box */}
      <GlassCard className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={isLoading || !query.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-3.5 font-medium text-white hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            {t("verifyButton")}
          </button>
        </div>

        {/* Quick examples for demo mode */}
        {isMockMode() && !searched && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-slate-400 mb-2">{t("tryWithSamples")}</p>
            <div className="flex flex-wrap gap-2">
              {["vinhomes-grand-park", "masteri-thao-dien", "du-an-tranh-chap"].map(
                (slug) => (
                  <button
                    key={slug}
                    onClick={() => {
                      setQuery(slug);
                      handleSearch(slug);
                    }}
                    className="px-3 py-1 rounded-full bg-slate-700/50 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    {slug}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Results */}
      {searched && (
        <>
          {isLoading ? (
            <GlassCard className="p-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto" />
              <p className="mt-4 text-slate-400">{t("searching")}</p>
            </GlassCard>
          ) : error ? (
            <GlassCard className="p-8 text-center">
              <Shield className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {t("notFound")}
              </h3>
              <p className="text-slate-400 mb-4">{error}</p>
              <p className="text-sm text-slate-500">
                Asset ID: <code className="text-cyan-400">{slugToAssetId(query)}</code>
              </p>
            </GlassCard>
          ) : attestation ? (
            <div className="space-y-6">
              {/* Attestation Details */}
              <AttestationDetails
                attestation={attestation}
                projectName={query}
                locale="vi"
              />

              {/* Actions */}
              <GlassCard className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">{t("assetIdLabel")}</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-cyan-400 bg-slate-800/50 px-2 py-1 rounded">
                        {attestation.assetId.slice(0, 10)}...{attestation.assetId.slice(-8)}
                      </code>
                      <button
                        onClick={handleCopyAssetId}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                        title={t("copyAssetId")}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {!isMockMode() && (
                    <a
                      href={`https://explorer.sepolia.mantle.xyz/address/${process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {t("viewOnExplorer")}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </GlassCard>

              {/* Share link */}
              <div className="text-center">
                <p className="text-xs text-slate-500">
                  {t("shareLink")}:{" "}
                  <code className="text-cyan-400">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/verify?q=${query}`
                      : `/verify?q=${query}`}
                  </code>
                </p>
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* Info section */}
      {!searched && (
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <GlassCard className="p-6">
            <Shield className="h-8 w-8 text-blue-400 mb-4" />
            <h3 className="font-bold text-white mb-2">{t("tiers.tier1_2.title")}</h3>
            <p className="text-sm text-slate-400">
              {t("tiers.tier1_2.description")}
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <ShieldCheck className="h-8 w-8 text-amber-400 mb-4" />
            <h3 className="font-bold text-white mb-2">{t("tiers.tier3.title")}</h3>
            <p className="text-sm text-slate-400">
              {t("tiers.tier3.description")}
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <ShieldCheck className="h-8 w-8 text-emerald-400 mb-4" />
            <h3 className="font-bold text-white mb-2">{t("tiers.tier4.title")}</h3>
            <p className="text-sm text-slate-400">
              {t("tiers.tier4.description")}
            </p>
          </GlassCard>
        </div>
      )}

      {/* Sample attestations list */}
      {!searched && sampleAttestations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">
            {t("sampleAttestations")}
          </h2>
          <div className="grid gap-4">
            {sampleAttestations.slice(0, 10).map((att) => (
              <GlassCard
                key={att.assetId}
                className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => {
                  // Use the assetId to search
                  setQuery(att.assetId);
                  handleSearch(att.assetId);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AttestationBadge attestation={att} size="sm" locale="vi" />
                    <div>
                      <p className="text-sm text-white font-medium">
                        {att.assetId.slice(0, 20)}...
                      </p>
                      <p className="text-xs text-slate-400">
                        {att.checksPassed.length} {t("checksPassed")}
                        {att.disputed && ` • ${t("disputed")}`}
                      </p>
                    </div>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
