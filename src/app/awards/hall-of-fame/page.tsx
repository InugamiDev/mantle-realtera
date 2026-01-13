"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, Trophy, Crown, Award, Calendar } from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";

interface Winner {
  year: number;
  category: string;
  categoryName: string;
  winner: {
    type: "developer" | "project";
    slug: string;
    name: string;
    tier: string;
  };
}

interface YearData {
  year: number;
  ceremony: string;
  winners: Winner[];
}

// Mock data for hall of fame
const HALL_OF_FAME: YearData[] = [
  {
    year: 2024,
    ceremony: "RealTera Awards 2024",
    winners: [
      {
        year: 2024,
        category: "best_developer",
        categoryName: "Chủ đầu tư xuất sắc nhất",
        winner: {
          type: "developer",
          slug: "vingroup",
          name: "Vingroup",
          tier: "SSS",
        },
      },
      {
        year: 2024,
        category: "best_project",
        categoryName: "Dự án xuất sắc nhất",
        winner: {
          type: "project",
          slug: "vinhomes-grand-park",
          name: "Vinhomes Grand Park",
          tier: "S+",
        },
      },
      {
        year: 2024,
        category: "most_innovative",
        categoryName: "Dự án sáng tạo nhất",
        winner: {
          type: "project",
          slug: "the-global-city",
          name: "The Global City",
          tier: "S",
        },
      },
      {
        year: 2024,
        category: "best_value",
        categoryName: "Giá trị tốt nhất",
        winner: {
          type: "project",
          slug: "masteri-centre-point",
          name: "Masteri Centre Point",
          tier: "A",
        },
      },
    ],
  },
  {
    year: 2023,
    ceremony: "RealTera Awards 2023",
    winners: [
      {
        year: 2023,
        category: "best_developer",
        categoryName: "Chủ đầu tư xuất sắc nhất",
        winner: {
          type: "developer",
          slug: "masterise-homes",
          name: "Masterise Homes",
          tier: "S+",
        },
      },
      {
        year: 2023,
        category: "best_project",
        categoryName: "Dự án xuất sắc nhất",
        winner: {
          type: "project",
          slug: "masteri-centre-point",
          name: "Masteri Centre Point",
          tier: "S",
        },
      },
      {
        year: 2023,
        category: "rising_star",
        categoryName: "Chủ đầu tư triển vọng",
        winner: {
          type: "developer",
          slug: "capitaland",
          name: "CapitaLand",
          tier: "A",
        },
      },
    ],
  },
];

export default function HallOfFamePage() {
  const t = useTranslations("common");
  const tAwards = useTranslations("awards");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [data, setData] = useState<YearData[]>(HALL_OF_FAME);
  const [loading, setLoading] = useState(false);

  const selectedYearData = data.find((d) => d.year === selectedYear);
  const years = data.map((d) => d.year);

  return (
    <div className="container-app py-6 sm:py-8">
      <Link
        href="/awards"
        className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Awards
      </Link>

      <header className="page-header">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Crown className="h-5 w-5 text-amber-400" />
          <span className="text-sm font-medium uppercase tracking-wider text-amber-400">
            {tAwards("hallOfFame")}
          </span>
        </div>
        <h1 className="page-title">Hall of Fame</h1>
        <p className="page-subtitle">
          Vinh danh những người chiến thắng qua các năm
        </p>
      </header>

      {/* Year Selector */}
      <div className="mt-8 flex justify-center gap-2">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedYear === year
                ? "bg-amber-500 text-black"
                : "border border-white/10 bg-white/5 text-foreground hover:bg-white/10"
            }`}
          >
            <Calendar className="h-4 w-4" />
            {year}
          </button>
        ))}
      </div>

      {/* Ceremony Info */}
      {selectedYearData && (
        <GlassCard className="mt-8 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-6 text-center">
            <Trophy className="mx-auto h-12 w-12 text-amber-400" />
            <h2 className="mt-4 text-2xl font-bold text-foreground">
              {selectedYearData.ceremony}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {selectedYearData.winners.length} hạng mục giải thưởng
            </p>
          </div>
        </GlassCard>
      )}

      {/* Winners Grid */}
      {selectedYearData && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {selectedYearData.winners.map((winner, index) => (
            <Link
              key={`${winner.category}-${winner.year}`}
              href={`/${winner.winner.type === "developer" ? "developers" : "project"}/${winner.winner.slug}`}
              className="group"
            >
              <GlassCard className="p-4 transition-all hover:border-amber-500/50">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      index === 0
                        ? "bg-amber-500/20"
                        : index === 1
                          ? "bg-gray-400/20"
                          : "bg-orange-500/20"
                    }`}
                  >
                    {index === 0 ? (
                      <Trophy className="h-6 w-6 text-amber-400" />
                    ) : (
                      <Award
                        className={`h-6 w-6 ${
                          index === 1 ? "text-gray-400" : "text-orange-400"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-amber-400 uppercase tracking-wider">
                      {winner.categoryName}
                    </span>
                    <h3 className="mt-1 font-semibold text-foreground group-hover:text-amber-400">
                      {winner.winner.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {winner.winner.type === "developer"
                        ? "Chủ đầu tư"
                        : "Dự án"}
                    </p>
                  </div>
                  <TierBadge
                    tier={
                      winner.winner.tier as
                        | "SSS"
                        | "S+"
                        | "S"
                        | "A"
                        | "B"
                        | "C"
                        | "D"
                        | "F"
                    }
                  />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}

      {/* Stats */}
      <GlassCard className="mt-8 p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Thống kê Hall of Fame
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">{years.length}</p>
            <p className="text-sm text-muted-foreground">Năm tổ chức</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">
              {data.reduce((acc, d) => acc + d.winners.length, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Giải thưởng</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">
              {
                new Set(
                  data.flatMap((d) =>
                    d.winners
                      .filter((w) => w.winner.type === "developer")
                      .map((w) => w.winner.slug)
                  )
                ).size
              }
            </p>
            <p className="text-sm text-muted-foreground">Chủ đầu tư</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">
              {
                new Set(
                  data.flatMap((d) =>
                    d.winners
                      .filter((w) => w.winner.type === "project")
                      .map((w) => w.winner.slug)
                  )
                ).size
              }
            </p>
            <p className="text-sm text-muted-foreground">Dự án</p>
          </div>
        </div>
      </GlassCard>

      {/* CTA */}
      <div className="mt-8 text-center">
        <Link
          href="/awards"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-medium text-black hover:bg-amber-400"
        >
          <Trophy className="h-5 w-5" />
          Xem Awards năm nay
        </Link>
      </div>
    </div>
  );
}
