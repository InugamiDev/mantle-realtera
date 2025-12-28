import { NextRequest, NextResponse } from "next/server";
import { mockProjects, developers } from "@/data/mockProjects";
import { TIER_ORDER } from "@/lib/tier";

// Competitive Intelligence API
// Market positioning, competitor analysis, benchmarks

interface DeveloperIntelligence {
  slug: string;
  name: string;
  tier: string;
  marketPosition: {
    rank: number;
    totalDevelopers: number;
    percentile: number;
  };
  portfolio: {
    totalProjects: number;
    avgScore: number;
    tierDistribution: Record<string, number>;
    topDistricts: string[];
  };
  strengths: string[];
  weaknesses: string[];
  competitors: {
    slug: string;
    name: string;
    tier: string;
    similarity: number;
  }[];
  trends: {
    scoreChange6M: number;
    projectGrowth: string;
    marketShareChange: string;
  };
}

interface MarketIntelligence {
  totalProjects: number;
  totalDevelopers: number;
  marketLeaders: {
    slug: string;
    name: string;
    tier: string;
    projectCount: number;
    avgScore: number;
  }[];
  tierDistribution: {
    tier: string;
    count: number;
    percentage: number;
  }[];
  districtLeaders: {
    district: string;
    topDeveloper: string;
    projectCount: number;
  }[];
  emergingTrends: string[];
}

// GET /api/v1/intelligence - Get competitive intelligence
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const developerSlug = searchParams.get("developer");
  const compareWith = searchParams.get("compare")?.split(",");
  const type = searchParams.get("type") || "market"; // market, developer, comparison

  // Developer-specific intelligence
  if (developerSlug || type === "developer") {
    const slug = developerSlug || Object.keys(developers)[0];
    const intelligence = getDeveloperIntelligence(slug);

    if (!intelligence) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 });
    }

    return NextResponse.json({ intelligence });
  }

  // Compare multiple developers
  if (compareWith && compareWith.length > 1) {
    const comparison = compareWith
      .slice(0, 5)
      .map((slug) => getDeveloperIntelligence(slug.trim()))
      .filter(Boolean) as DeveloperIntelligence[];

    const metrics = ["avgScore", "projectCount", "tierRank"];
    const rankings: Record<string, string[]> = {};

    metrics.forEach((metric) => {
      if (metric === "avgScore") {
        rankings[metric] = comparison
          .sort((a, b) => b.portfolio.avgScore - a.portfolio.avgScore)
          .map((d) => d.slug);
      } else if (metric === "projectCount") {
        rankings[metric] = comparison
          .sort((a, b) => b.portfolio.totalProjects - a.portfolio.totalProjects)
          .map((d) => d.slug);
      } else {
        rankings[metric] = comparison
          .sort((a, b) => a.marketPosition.rank - b.marketPosition.rank)
          .map((d) => d.slug);
      }
    });

    return NextResponse.json({
      developers: comparison,
      rankings,
      insights: generateComparisonInsights(comparison),
    });
  }

  // Market overview intelligence
  const marketIntelligence = getMarketIntelligence();
  return NextResponse.json({ market: marketIntelligence });
}

function getDeveloperIntelligence(slug: string): DeveloperIntelligence | null {
  const developer = Object.values(developers).find((d) => d.slug === slug);
  if (!developer) return null;

  const devProjects = mockProjects.filter((p) => p.developer.slug === slug);
  const allDevelopers = Object.values(developers);

  // Calculate market position
  const sortedDevelopers = allDevelopers.sort((a, b) =>
    TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
  );
  const rank = sortedDevelopers.findIndex((d) => d.slug === slug) + 1;

  // Tier distribution
  const tierDist: Record<string, number> = {};
  devProjects.forEach((p) => {
    tierDist[p.tier] = (tierDist[p.tier] || 0) + 1;
  });

  // Top districts
  const districtCounts: Record<string, number> = {};
  devProjects.forEach((p) => {
    districtCounts[p.district] = (districtCounts[p.district] || 0) + 1;
  });
  const topDistricts = Object.entries(districtCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([d]) => d);

  // Find competitors (similar tier developers)
  const tierIndex = TIER_ORDER.indexOf(developer.tier);
  const competitors = allDevelopers
    .filter((d) => d.slug !== slug)
    .map((d) => ({
      ...d,
      tierDiff: Math.abs(TIER_ORDER.indexOf(d.tier) - tierIndex),
    }))
    .sort((a, b) => a.tierDiff - b.tierDiff)
    .slice(0, 5)
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      tier: d.tier,
      similarity: Math.round((1 - d.tierDiff / TIER_ORDER.length) * 100),
    }));

  // Analyze strengths and weaknesses
  const avgScore = devProjects.length > 0
    ? devProjects.reduce((sum, p) => sum + p.score, 0) / devProjects.length
    : 0;

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (TIER_ORDER.indexOf(developer.tier) <= 2) strengths.push("Xếp hạng cao");
  if (devProjects.length >= 5) strengths.push("Portfolio đa dạng");
  if (avgScore >= 85) strengths.push("Điểm chất lượng cao");
  if (topDistricts.some((d) => ["Quận 1", "Quận 2", "Quận 7"].includes(d))) {
    strengths.push("Vị trí đắc địa");
  }

  if (devProjects.length < 3) weaknesses.push("Portfolio hạn chế");
  if (avgScore < 75) weaknesses.push("Cần cải thiện chất lượng");
  if (TIER_ORDER.indexOf(developer.tier) >= 4) weaknesses.push("Xếp hạng cần nâng cao");

  return {
    slug: developer.slug,
    name: developer.name,
    tier: developer.tier,
    marketPosition: {
      rank,
      totalDevelopers: allDevelopers.length,
      percentile: Math.round((1 - rank / allDevelopers.length) * 100),
    },
    portfolio: {
      totalProjects: devProjects.length,
      avgScore: Math.round(avgScore),
      tierDistribution: tierDist,
      topDistricts,
    },
    strengths,
    weaknesses,
    competitors,
    trends: {
      scoreChange6M: Math.round((Math.random() - 0.3) * 10), // -3 to +7
      projectGrowth: `+${Math.floor(Math.random() * 3)}`,
      marketShareChange: `${Math.random() > 0.5 ? "+" : "-"}${(Math.random() * 2).toFixed(1)}%`,
    },
  };
}

function getMarketIntelligence(): MarketIntelligence {
  const allDevelopers = Object.values(developers);

  // Market leaders
  const developerProjects = allDevelopers.map((d) => {
    const projects = mockProjects.filter((p) => p.developer.slug === d.slug);
    return {
      slug: d.slug,
      name: d.name,
      tier: d.tier,
      projectCount: projects.length,
      avgScore: projects.length > 0
        ? Math.round(projects.reduce((sum, p) => sum + p.score, 0) / projects.length)
        : 0,
    };
  });

  const leaders = developerProjects
    .sort((a, b) => {
      const tierDiff = TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier);
      return tierDiff !== 0 ? tierDiff : b.projectCount - a.projectCount;
    })
    .slice(0, 5);

  // Tier distribution
  const tierCounts: Record<string, number> = {};
  mockProjects.forEach((p) => {
    tierCounts[p.tier] = (tierCounts[p.tier] || 0) + 1;
  });

  const tierDistribution = TIER_ORDER.map((tier) => ({
    tier,
    count: tierCounts[tier] || 0,
    percentage: Math.round(((tierCounts[tier] || 0) / mockProjects.length) * 100),
  }));

  // District leaders
  const districtDevelopers: Record<string, Record<string, number>> = {};
  mockProjects.forEach((p) => {
    if (!districtDevelopers[p.district]) districtDevelopers[p.district] = {};
    districtDevelopers[p.district][p.developer.slug] =
      (districtDevelopers[p.district][p.developer.slug] || 0) + 1;
  });

  const districtLeaders = Object.entries(districtDevelopers)
    .map(([district, devs]) => {
      const [topDev, count] = Object.entries(devs).sort((a, b) => b[1] - a[1])[0];
      return { district, topDeveloper: topDev, projectCount: count };
    })
    .sort((a, b) => b.projectCount - a.projectCount)
    .slice(0, 5);

  return {
    totalProjects: mockProjects.length,
    totalDevelopers: allDevelopers.length,
    marketLeaders: leaders,
    tierDistribution,
    districtLeaders,
    emergingTrends: [
      "Tăng trưởng mạnh phân khúc cao cấp Quận 2",
      "Xu hướng smart home và công nghệ xanh",
      "Nhu cầu cao với dự án gần metro",
      "CĐT tập trung vào chất lượng xây dựng",
      "Giá thuê tăng 8-12% YoY ở các quận trung tâm",
    ],
  };
}

function generateComparisonInsights(developers: DeveloperIntelligence[]): string[] {
  const insights: string[] = [];

  // Best performer
  const bestByScore = developers.reduce((best, curr) =>
    curr.portfolio.avgScore > best.portfolio.avgScore ? curr : best
  );
  insights.push(`${bestByScore.name} dẫn đầu về chất lượng dự án với điểm TB ${bestByScore.portfolio.avgScore}`);

  // Largest portfolio
  const largest = developers.reduce((best, curr) =>
    curr.portfolio.totalProjects > best.portfolio.totalProjects ? curr : best
  );
  insights.push(`${largest.name} có portfolio lớn nhất với ${largest.portfolio.totalProjects} dự án`);

  // Best positioned
  const bestRank = developers.reduce((best, curr) =>
    curr.marketPosition.rank < best.marketPosition.rank ? curr : best
  );
  insights.push(`${bestRank.name} xếp hạng cao nhất trong nhóm (top ${bestRank.marketPosition.percentile}%)`);

  return insights;
}
