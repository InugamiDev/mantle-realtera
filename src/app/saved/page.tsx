"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Trash2, Bell, BellOff, Loader2 } from "lucide-react";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { ProjectCard } from "@/components/realtera/ProjectCard";
import { GlassCard } from "@/components/realtera/GlassCard";
import type { Project } from "@/lib/types";
import { useTranslations } from "next-intl";

export default function SavedPage() {
  const { items, isInWatchlist, toggleWatchlist, toggleAlert, clearWatchlist, count } = useWatchlist();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("saved");

  // Fetch projects from API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/v1/projects?limit=500");
        const data = await res.json();
        setProjects(data.data || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Get watchlisted projects with their alert status
  const savedProjects = useMemo(() => {
    return projects
      .filter((p) => items.some((item) => item.projectSlug === p.slug))
      .map((p) => ({
        ...p,
        watchlistItem: items.find((item) => item.projectSlug === p.slug),
      }));
  }, [projects, items]);

  if (isLoading) {
    return (
      <div className="container-app py-8">
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
          <p className="mt-4 text-white/60">{t("loading")}</p>
        </div>
      </div>
    );
  }

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
        <div className="mb-4 flex items-center justify-center gap-2">
          <Bookmark className="h-5 w-5 text-amber-400" />
          <span className="text-sm font-medium uppercase tracking-wider text-amber-400">
            {t("badge")}
          </span>
        </div>
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">
          {count > 0
            ? t("subtitle", { count })
            : t("subtitleEmpty")}
        </p>
      </header>

      {savedProjects.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
            <Bookmark className="h-8 w-8 text-amber-400/50" />
          </div>
          <p className="text-xl font-semibold text-foreground">{t("noSavedProjects")}</p>
          <p className="mt-2 text-muted-foreground">
            {t("noSavedProjectsHint")}
          </p>
          <Link href="/" className="btn btn-primary mt-6">
            {t("exploreProjects")}
          </Link>
        </GlassCard>
      ) : (
        <>
          {/* Actions */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t("projectsSaved", { count })}
            </p>
            <button
              onClick={clearWatchlist}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("clearAll")}
            </button>
          </div>

          {/* Projects grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {savedProjects.map((project) => (
              <div key={project.slug} className="relative">
                <ProjectCard
                  project={project}
                  isBookmarked={true}
                  onToggleBookmark={() => toggleWatchlist(project.slug)}
                />
                {/* Alert toggle button */}
                <button
                  onClick={() => toggleAlert(project.slug)}
                  className={`absolute right-12 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                    project.watchlistItem?.alertEnabled
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
                  }`}
                  title={project.watchlistItem?.alertEnabled ? t("disableAlert") : t("enableAlert")}
                >
                  {project.watchlistItem?.alertEnabled ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <BellOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
