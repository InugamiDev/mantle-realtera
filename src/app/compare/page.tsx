"use client";

import { Suspense, useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Loader2, Search, X, ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";
import { CompareTableLite } from "@/components/realtera/CompareTableLite";
import { TierBadge } from "@/components/realtera/TierBadge";
import type { Project } from "@/lib/types";
import type { AttestationSummary } from "@/lib/attestation-registry";
import { useTranslations } from "next-intl";

interface ProjectSearchSelectProps {
  label: string;
  projects: Project[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  pointsText?: string;
}

function ProjectSearchSelect({ label, projects, selectedSlug, onSelect, placeholder, searchPlaceholder, noResultsText, pointsText }: ProjectSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find((p) => p.slug === selectedSlug);

  const filteredProjects = useMemo(() => {
    if (!search) return projects;
    const searchLower = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.district.toLowerCase().includes(searchLower) ||
        p.developer.name.toLowerCase().includes(searchLower)
    );
  }, [projects, search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>

      {/* Selected value / trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background/50 px-4 py-3 text-left text-foreground transition-colors hover:bg-background/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {selectedProject ? (
          <span className="flex items-center gap-2 truncate">
            <TierBadge tier={selectedProject.tier} size="sm" />
            <span className="truncate">{selectedProject.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">({selectedProject.score} {pointsText})</span>
          </span>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
          {/* Search input */}
          <div className="relative border-b border-border p-2">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-border bg-background/50 py-2 pl-10 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-64 overflow-y-auto">
            {filteredProjects.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {noResultsText}
              </div>
            ) : (
              filteredProjects.map((project) => (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => {
                    onSelect(project.slug);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 ${
                    project.slug === selectedSlug ? "bg-primary/10" : ""
                  }`}
                >
                  <TierBadge tier={project.tier} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{project.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {project.district} • {project.developer.name}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">{project.score} {pointsText}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [attestations, setAttestations] = useState<Record<string, AttestationSummary | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("compare");

  // Fetch projects from API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/v1/projects?limit=500");
        const data = await res.json();
        setProjects(data.data || []);
        setAttestations(data.attestations || {});
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Get initial values from URL params
  const initialA = searchParams.get("a") || "";
  const initialB = searchParams.get("b") || "";

  const [slugA, setSlugA] = useState(initialA);
  const [slugB, setSlugB] = useState(initialB);

  // Update slugs when projects load (only if URL params provided)
  useEffect(() => {
    if (projects.length > 0) {
      if (!slugA && initialA) {
        setSlugA(initialA);
      } else if (!slugA && projects[0]) {
        setSlugA(projects[0].slug);
      }
      if (!slugB && initialB) {
        setSlugB(initialB);
      } else if (!slugB && projects[1]) {
        setSlugB(projects[1].slug);
      }
    }
  }, [projects, slugA, slugB, initialA, initialB]);

  // Handle case where same project is selected
  const isSameProject = slugA === slugB && slugA !== "";

  // Auto-pick next project if same is selected
  useEffect(() => {
    if (isSameProject && slugA && projects.length > 1) {
      const otherProject = projects.find((p) => p.slug !== slugA);
      if (otherProject) {
        setSlugB(otherProject.slug);
      }
    }
  }, [slugA, isSameProject, projects]);

  const projectA = useMemo(() => projects.find((p) => p.slug === slugA), [projects, slugA]);
  const projectB = useMemo(() => projects.find((p) => p.slug === slugB), [projects, slugB]);

  // Sort projects for dropdown (by tier, then score)
  const sortedProjects = useMemo(() => {
    const tierOrder = ["SSS", "S+", "S", "A", "B", "C", "D", "F"];
    return [...projects].sort((a, b) => {
      const tierDiff = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
      if (tierDiff !== 0) return tierDiff;
      return b.score - a.score;
    });
  }, [projects]);

  if (isLoading) {
    return (
      <GlassCard className="mb-8 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          <p className="mt-4 text-white/60">{t("loading")}</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <>
      {/* Project selectors with search */}
      <GlassCard className="mb-8 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <ProjectSearchSelect
            label={t("project1")}
            projects={sortedProjects}
            selectedSlug={slugA}
            onSelect={setSlugA}
            placeholder={t("selectFirst")}
            searchPlaceholder={t("searchPlaceholder")}
            noResultsText={t("noProjectFound")}
            pointsText={t("points")}
          />
          <ProjectSearchSelect
            label={t("project2")}
            projects={sortedProjects}
            selectedSlug={slugB}
            onSelect={setSlugB}
            placeholder={t("selectSecond")}
            searchPlaceholder={t("searchPlaceholder")}
            noResultsText={t("noProjectFound")}
            pointsText={t("points")}
          />
        </div>

        {/* Same project warning */}
        {isSameProject && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-400">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>{t("sameProjectWarning")}</span>
          </div>
        )}
      </GlassCard>

      {/* Comparison table */}
      {projectA && projectB && !isSameProject && (
        <>
          <h2 className="mb-4 text-lg font-bold text-foreground">
            {t("comparison")}: <span className="text-primary">{projectA.name}</span> vs{" "}
            <span className="text-primary">{projectB.name}</span>
          </h2>
          <CompareTableLite
            projectA={projectA}
            projectB={projectB}
            attestationA={attestations[slugA] ?? null}
            attestationB={attestations[slugB] ?? null}
          />
        </>
      )}

      {/* No projects selected */}
      {(!projectA || !projectB) && !isLoading && (
        <GlassCard className="p-8 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-foreground">{t("selectToCompare")}</p>
          <p className="mt-2 text-muted-foreground">
            {t("selectToCompareHint")}
          </p>
        </GlassCard>
      )}
    </>
  );
}

function CompareLoading() {
  return (
    <GlassCard className="mb-8 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-20 animate-pulse rounded-xl bg-muted" />
        <div className="h-20 animate-pulse rounded-xl bg-muted" />
      </div>
    </GlassCard>
  );
}

export default function ComparePage() {
  const t = useTranslations("compare");

  return (
    <div className="container-app py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t("backToRanking")}
      </Link>

      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">
          {t("subtitle")}
        </p>
      </header>

      <Suspense fallback={<CompareLoading />}>
        <CompareContent />
      </Suspense>
    </div>
  );
}
