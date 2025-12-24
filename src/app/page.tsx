"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search, X, ChevronDown, ChevronUp, Sparkles, Loader2 } from "lucide-react";
import { TIER_ORDER, TOP_TIERS, LOWER_TIERS } from "@/lib/tier";
import type { TierLevel, VerificationStatus, SortOption, Project, Developer } from "@/lib/types";
import type { AttestationSummary } from "@/lib/attestation-registry";
import { ProjectTierBand } from "@/components/realtera/ProjectTierBand";
import { GlassCard } from "@/components/realtera/GlassCard";

export default function HomePage() {
  const t = useTranslations("home");

  // Data state - fetch from API
  const [projects, setProjects] = useState<Project[]>([]);
  const [attestations, setAttestations] = useState<Record<string, AttestationSummary | null>>({});
  const [districts, setDistricts] = useState<string[]>([]);
  const [developersList, setDevelopersList] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState("");
  const [selectedTiers, setSelectedTiers] = useState<TierLevel[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedVerification, setSelectedVerification] = useState<VerificationStatus | "">("");
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("tier-score");
  const [showLowerTiers, setShowLowerTiers] = useState(false);

  // Fetch data from API on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/v1/projects?limit=500");
        const data = await res.json();
        setProjects(data.data || []);
        setAttestations(data.attestations || {});
        setDistricts(data.filters?.availableDistricts || []);

        // Extract unique developers from projects
        const devMap = new Map<string, Developer>();
        (data.data || []).forEach((p: Project) => {
          if (p.developer && !devMap.has(p.developer.slug)) {
            devMap.set(p.developer.slug, p.developer);
          }
        });
        setDevelopersList(Array.from(devMap.values()));
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.district.toLowerCase().includes(searchLower) ||
          p.city.toLowerCase().includes(searchLower) ||
          p.verdict.toLowerCase().includes(searchLower)
      );
    }

    // Tier filter
    if (selectedTiers.length > 0) {
      result = result.filter((p) => selectedTiers.includes(p.tier));
    }

    // District filter
    if (selectedDistrict) {
      result = result.filter((p) => p.district === selectedDistrict);
    }

    // Verification filter
    if (selectedVerification) {
      result = result.filter((p) => p.verificationStatus === selectedVerification);
    }

    // Developer filter
    if (selectedDeveloper) {
      result = result.filter((p) => p.developer.slug === selectedDeveloper);
    }

    // Price range filter (based on priceMetrics)
    if (priceRange) {
      result = result.filter((p) => {
        const price = p.priceMetrics?.pricePerSqmMin || 50_000_000; // Default 50tr/m²
        switch (priceRange) {
          case "under-30":
            return price < 30_000_000;
          case "30-50":
            return price >= 30_000_000 && price < 50_000_000;
          case "50-80":
            return price >= 50_000_000 && price < 80_000_000;
          case "80-120":
            return price >= 80_000_000 && price < 120_000_000;
          case "over-120":
            return price >= 120_000_000;
          default:
            return true;
        }
      });
    }

    // Sort
    // Governance Hardening: Sponsored status does NOT influence ranking
    // Sponsored badge is displayed for disclosure, but has zero sort priority
    result.sort((a, b) => {
      switch (sortOption) {
        case "tier-score":
          const tierDiff = TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier);
          if (tierDiff !== 0) return tierDiff;
          return b.score - a.score;
        case "updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "sources":
          return b.sourceCount - a.sourceCount;
        default:
          return 0;
      }
    });

    return result;
  }, [projects, search, selectedTiers, selectedDistrict, selectedVerification, selectedDeveloper, priceRange, sortOption]);

  // Group projects by tier
  const projectsByTier = useMemo(() => {
    const grouped: Record<TierLevel, typeof filteredProjects> = {
      SSS: [],
      SS: [],
      "S+": [],
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
      F: [],
    };

    filteredProjects.forEach((project) => {
      grouped[project.tier].push(project);
    });

    return grouped;
  }, [filteredProjects]);

  const hasActiveFilters = search || selectedTiers.length > 0 || selectedDistrict || selectedVerification || selectedDeveloper || priceRange;

  const clearFilters = () => {
    setSearch("");
    setSelectedTiers([]);
    setSelectedDistrict("");
    setSelectedVerification("");
    setSelectedDeveloper("");
    setPriceRange("");
  };

  const toggleTier = (tier: TierLevel) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container-app py-12">
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
          <p className="mt-4 text-white/60">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-12">
      {/* Page Header */}
      <header className="page-header mb-12">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <span className="text-sm font-medium uppercase tracking-wider text-cyan-400">
            {t("badge")}
          </span>
        </div>
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">{t("subtitle")}</p>
      </header>

      {/* Search & Filters */}
      <GlassCard className="mb-10 p-6">
        {/* Search input */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" aria-hidden="true" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder:text-white/40 transition-all focus:border-cyan-500/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            aria-label={t("searchLabel")}
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tier filter chips */}
          <div className="flex flex-wrap gap-2">
            {TIER_ORDER.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => toggleTier(tier)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  selectedTiers.includes(tier)
                    ? "border-cyan-500/50 bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
                }`}
                aria-pressed={selectedTiers.includes(tier)}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* District select */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 transition-all focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            aria-label={t("filterByDistrict")}
          >
            <option value="">{t("allDistricts")}</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>

          {/* Developer select */}
          <select
            value={selectedDeveloper}
            onChange={(e) => setSelectedDeveloper(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 transition-all focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            aria-label={t("filterByDeveloper")}
          >
            <option value="">{t("allDevelopers")}</option>
            {developersList.map((dev) => (
              <option key={dev.slug} value={dev.slug}>
                {dev.name}
              </option>
            ))}
          </select>

          {/* Price range select */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 transition-all focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            aria-label={t("filterByPrice")}
          >
            <option value="">{t("allPrices")}</option>
            <option value="under-30">{t("priceUnder30")}</option>
            <option value="30-50">{t("price30to50")}</option>
            <option value="50-80">{t("price50to80")}</option>
            <option value="80-120">{t("price80to120")}</option>
            <option value="over-120">{t("priceAbove120")}</option>
          </select>

          {/* Verification select */}
          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value as VerificationStatus | "")}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 transition-all focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            aria-label={t("filterByStatus")}
          >
            <option value="">{t("allStatus")}</option>
            <option value="Verified">{t("verified")}</option>
            <option value="Under review">{t("pending")}</option>
            <option value="Unverified">{t("notVerified")}</option>
            <option value="Unrated">{t("notRated")}</option>
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              {t("clearFilters")}
            </button>
          )}
        </div>

        {/* Result count & sorting */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-5">
          <span className="text-sm text-white/50">
            {t("showing")} <span className="font-semibold text-white">{filteredProjects.length}</span> {t("projects")}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/50">{t("sortBy")}</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition-all focus:border-cyan-500/50 focus:outline-none"
              aria-label={t("sortBy")}
            >
              <option value="tier-score">{t("sortTierScore")}</option>
              <option value="updated">{t("sortUpdated")}</option>
              <option value="sources">{t("sortSources")}</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Tier Bands */}
      {filteredProjects.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <Search className="h-8 w-8 text-white/30" />
          </div>
          <p className="text-xl font-semibold text-white">{t("noProjects")}</p>
          <p className="mt-2 text-white/50">{t("noProjectsHint")}</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-secondary mt-6"
            >
              {t("clearFilters")}
            </button>
          )}
        </GlassCard>
      ) : (
        <>
          {/* Top tiers (always visible) */}
          {TOP_TIERS.map((tier) => (
            <ProjectTierBand
              key={tier}
              tier={tier}
              projects={projectsByTier[tier]}
              attestations={attestations}
            />
          ))}

          {/* Lower tiers (collapsible) */}
          {LOWER_TIERS.some((tier) => projectsByTier[tier].length > 0) && (
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowLowerTiers(!showLowerTiers)}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                aria-expanded={showLowerTiers}
              >
                {showLowerTiers ? (
                  <>
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    {t("hideLowTier")}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    {t("viewMore")} ({LOWER_TIERS.map((tierLevel) => `${tierLevel}: ${projectsByTier[tierLevel].length}`).join(", ")})
                  </>
                )}
              </button>

              {showLowerTiers && (
                <div className="space-y-6">
                  {LOWER_TIERS.map((tier) => (
                    <ProjectTierBand
                      key={tier}
                      tier={tier}
                      projects={projectsByTier[tier]}
                      attestations={attestations}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
