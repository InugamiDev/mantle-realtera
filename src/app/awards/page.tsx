"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Trophy,
  Award,
  Star,
  Building2,
  Calendar,
  Users,
  ChevronRight,
} from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";

interface AwardCategory {
  category: string;
  name: string;
  description: string;
  forType: "developer" | "project" | "both";
}

interface Nominee {
  type: "developer" | "project";
  slug: string;
  name: string;
  tier: string;
  score: number;
  highlights: string[];
}

interface AwardData {
  id: string;
  category: string;
  name: string;
  year: number;
  winner?: {
    type: string;
    slug: string;
    name: string;
    tier: string;
  };
  nominees: Nominee[];
}

interface Ceremony {
  year: number;
  name: string;
  date: string;
  location: string;
  status: "upcoming" | "voting" | "completed";
  stats: {
    totalNominees: number;
    totalVotes: number;
    categories: number;
  };
}

export default function AwardsPage() {
  const t = useTranslations("awards");
  const tCommon = useTranslations("common");
  const [ceremony, setCeremony] = useState<Ceremony | null>(null);
  const [categories, setCategories] = useState<AwardCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAward, setSelectedAward] = useState<AwardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ceremonyRes, categoriesRes] = await Promise.all([
        fetch("/api/v1/awards?type=ceremony"),
        fetch("/api/v1/awards?type=categories"),
      ]);

      const ceremonyData = await ceremonyRes.json();
      const categoriesData = await categoriesRes.json();

      setCeremony(ceremonyData.ceremony);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error("Failed to fetch awards data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAward = async (category: string) => {
    setSelectedCategory(category);
    try {
      const res = await fetch(`/api/v1/awards?type=category&category=${category}`);
      const data = await res.json();
      setSelectedAward(data.award);
    } catch (error) {
      console.error("Failed to fetch award:", error);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "voting":
        return t("voting");
      case "upcoming":
        return t("upcoming");
      default:
        return t("completed");
    }
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
          <Trophy className="h-5 w-5 text-amber-400" />
          <span className="text-sm font-medium uppercase tracking-wider text-amber-400">
            {t("badge")}
          </span>
        </div>
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">{t("subtitle")}</p>
      </header>

      {/* Ceremony Info */}
      {ceremony && (
        <GlassCard className="mt-6 sm:mt-8 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {ceremony.name}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(ceremony.date).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {ceremony.location}
                  </span>
                </div>
              </div>
              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                  ceremony.status === "voting"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : ceremony.status === "upcoming"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-amber-500/20 text-amber-400"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  {ceremony.status === "voting" && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${
                      ceremony.status === "voting"
                        ? "bg-emerald-400"
                        : ceremony.status === "upcoming"
                          ? "bg-cyan-400"
                          : "bg-amber-400"
                    }`}
                  />
                </span>
                {getStatusText(ceremony.status)}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-amber-400">
                  {ceremony.stats.categories}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">{t("categoriesCount")}</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-amber-400">
                  {ceremony.stats.totalNominees}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">{t("nomineesCount")}</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-amber-400">
                  {ceremony.stats.totalVotes.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">{t("votesCount")}</p>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Categories Grid */}
      <div className="mt-6 sm:mt-8">
        <h2 className="mb-4 text-lg font-bold text-foreground">{t("categories")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl bg-white/10"
                />
              ))
            : categories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => fetchAward(cat.category)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    selectedCategory === cat.category
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <Award
                      className={`h-5 w-5 ${
                        selectedCategory === cat.category
                          ? "text-amber-400"
                          : "text-muted-foreground"
                      }`}
                    />
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="mt-2 font-semibold text-foreground text-sm sm:text-base">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                </button>
              ))}
        </div>
      </div>

      {/* Selected Award Detail */}
      {selectedAward && (
        <GlassCard className="mt-6 p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-amber-400 uppercase tracking-wider">
                {selectedAward.category.replace(/_/g, " ")}
              </span>
              <h2 className="mt-1 text-xl font-bold text-foreground">
                {selectedAward.name}
              </h2>
            </div>
            {selectedAward.winner && (
              <div className="flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">{t("winner")}</span>
              </div>
            )}
          </div>

          {/* Winner */}
          {selectedAward.winner && (
            <Link
              href={`/${selectedAward.winner.type === "developer" ? "developers" : "project"}/${selectedAward.winner.slug}`}
              className="mt-4 block rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/30">
                  <Trophy className="h-6 w-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {selectedAward.winner.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedAward.winner.type === "developer"
                      ? tCommon("backToRanking").split(" ")[0]
                      : "Project"}
                  </p>
                </div>
                <TierBadge tier={selectedAward.winner.tier as "SSS" | "S+" | "S" | "A" | "B" | "C" | "D" | "F"} />
              </div>
            </Link>
          )}

          {/* Nominees */}
          <div className="mt-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Users className="h-4 w-4" />
              {t("nominees")} ({selectedAward.nominees.length})
            </h3>
            <div className="space-y-2">
              {selectedAward.nominees.map((nominee, index) => (
                <Link
                  key={nominee.slug}
                  href={`/${nominee.type === "developer" ? "developers" : "project"}/${nominee.slug}`}
                  className="flex items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {nominee.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {nominee.highlights.slice(0, 2).join(" • ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {nominee.score}/100
                    </span>
                    <TierBadge tier={nominee.tier as "SSS" | "S+" | "S" | "A" | "B" | "C" | "D" | "F"} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Vote CTA */}
          {ceremony?.status === "voting" && (
            <div className="mt-6 flex justify-center">
              <button className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-medium text-black hover:bg-amber-400">
                <Star className="h-5 w-5" />
                {t("voteNow")}
              </button>
            </div>
          )}
        </GlassCard>
      )}

      {/* Hall of Fame CTA */}
      <GlassCard className="mt-6 p-4 sm:p-6 text-center">
        <Trophy className="mx-auto h-10 w-10 text-amber-400/50" />
        <h3 className="mt-3 text-lg font-bold text-foreground">{t("hallOfFame")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("hallOfFameDesc")}
        </p>
        <Link
          href="/awards/hall-of-fame"
          className="mt-4 inline-block rounded-lg border border-amber-500/50 px-6 py-2 text-sm font-medium text-amber-400 hover:bg-amber-500/10"
        >
          {t("viewHallOfFame")}
        </Link>
      </GlassCard>
    </div>
  );
}
