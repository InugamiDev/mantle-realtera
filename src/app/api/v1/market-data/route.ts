import { NextRequest, NextResponse } from "next/server";
import { mockProjects, developers } from "@/data/mockProjects";
import { TIER_ORDER, TIERS } from "@/lib/tier";
import type { TierLevel } from "@/lib/types";

// Market Data API - Public market statistics and trends
// GET /api/v1/market-data?type=overview|districts|tiers|trends

interface DistrictStats {
  district: string;
  city: string;
  projectCount: number;
  avgScore: number;
  tierDistribution: Record<string, number>;
  priceRange: { min: number; max: number };
  trend: "up" | "stable" | "down";
}

interface MarketOverview {
  totalProjects: number;
  totalDevelopers: number;
  avgMarketScore: number;
  tierDistribution: Record<string, number>;
  topDistricts: { district: string; projectCount: number }[];
  verificationRate: number;
  lastUpdated: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "overview";
  const district = searchParams.get("district");
  const city = searchParams.get("city") || "TP. Hồ Chí Minh";

  const projectList = mockProjects;
  const developerList = Object.values(developers);

  switch (type) {
    case "overview":
      return NextResponse.json(getMarketOverview(projectList, developerList), {
        headers: { "Cache-Control": "public, max-age=3600" },
      });

    case "districts":
      return NextResponse.json(
        { districts: getDistrictStats(projectList, city) },
        { headers: { "Cache-Control": "public, max-age=3600" } }
      );

    case "tiers":
      return NextResponse.json(
        { tiers: getTierBreakdown(projectList) },
        { headers: { "Cache-Control": "public, max-age=3600" } }
      );

    case "trends":
      return NextResponse.json(
        { trends: getPriceTrends(district) },
        { headers: { "Cache-Control": "public, max-age=3600" } }
      );

    case "district-detail":
      if (!district) {
        return NextResponse.json(
          { error: "district parameter required" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        getDistrictDetail(projectList, district, city),
        { headers: { "Cache-Control": "public, max-age=3600" } }
      );

    default:
      return NextResponse.json(
        { error: "Invalid type. Use: overview, districts, tiers, trends, district-detail" },
        { status: 400 }
      );
  }
}

function getMarketOverview(
  projectList: typeof mockProjects,
  developerList: typeof developers[keyof typeof developers][]
): MarketOverview {
  // Calculate tier distribution
  const tierDistribution: Record<string, number> = {};
  TIER_ORDER.forEach((tier) => (tierDistribution[tier] = 0));

  let totalScore = 0;
  let verifiedCount = 0;

  projectList.forEach((project) => {
    tierDistribution[project.tier] = (tierDistribution[project.tier] || 0) + 1;
    totalScore += project.score;
    if (project.verificationStatus === "Verified") verifiedCount++;
  });

  // Top districts by project count
  const districtCount: Record<string, number> = {};
  projectList.forEach((project) => {
    districtCount[project.district] = (districtCount[project.district] || 0) + 1;
  });

  const topDistricts = Object.entries(districtCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([district, count]) => ({ district, projectCount: count }));

  return {
    totalProjects: projectList.length,
    totalDevelopers: developerList.length,
    avgMarketScore: Math.round(totalScore / projectList.length),
    tierDistribution,
    topDistricts,
    verificationRate: Math.round((verifiedCount / projectList.length) * 100),
    lastUpdated: new Date().toISOString(),
  };
}

function getDistrictStats(
  projectList: typeof mockProjects,
  city: string
): DistrictStats[] {
  const filteredProjects = projectList.filter((p) => p.city === city);

  const districtMap: Record<string, typeof filteredProjects> = {};
  filteredProjects.forEach((project) => {
    if (!districtMap[project.district]) {
      districtMap[project.district] = [];
    }
    districtMap[project.district].push(project);
  });

  return Object.entries(districtMap).map(([district, districtProjects]) => {
    const tierDist: Record<string, number> = {};
    let totalScore = 0;

    districtProjects.forEach((p) => {
      tierDist[p.tier] = (tierDist[p.tier] || 0) + 1;
      totalScore += p.score;
    });

    // Mock price range based on tier distribution
    const avgTierIndex = districtProjects.reduce((sum, p) =>
      sum + TIER_ORDER.indexOf(p.tier as TierLevel), 0) / districtProjects.length;

    const basePrice = 80_000_000; // 80M VND/m2
    const priceMultiplier = 1 - (avgTierIndex * 0.1);

    return {
      district,
      city,
      projectCount: districtProjects.length,
      avgScore: Math.round(totalScore / districtProjects.length),
      tierDistribution: tierDist,
      priceRange: {
        min: Math.round(basePrice * priceMultiplier * 0.7),
        max: Math.round(basePrice * priceMultiplier * 1.3),
      },
      trend: (avgTierIndex < 2 ? "up" : avgTierIndex < 4 ? "stable" : "down") as "up" | "stable" | "down",
    };
  }).sort((a, b) => b.avgScore - a.avgScore);
}

function getTierBreakdown(projectList: typeof mockProjects) {
  return TIER_ORDER.map((tier) => {
    const tierProjects = projectList.filter((p) => p.tier === tier);
    const tierInfo = TIERS[tier];

    return {
      tier,
      label: tierInfo.label,
      description: tierInfo.description,
      scoreRange: { min: tierInfo.minScore, max: tierInfo.maxScore },
      projectCount: tierProjects.length,
      percentage: Math.round((tierProjects.length / projectList.length) * 100),
      avgScore: tierProjects.length > 0
        ? Math.round(tierProjects.reduce((sum, p) => sum + p.score, 0) / tierProjects.length)
        : 0,
    };
  });
}

function getPriceTrends(district: string | null) {
  // Mock price trend data - in production this would come from database
  const months = ["T7/24", "T8/24", "T9/24", "T10/24", "T11/24", "T12/24"];
  const basePrice = district ? 75_000_000 : 70_000_000;

  return {
    period: "6 tháng gần nhất",
    district: district || "Toàn thị trường",
    dataPoints: months.map((month, i) => ({
      month,
      avgPricePerSqm: Math.round(basePrice * (1 + i * 0.02 + Math.random() * 0.03)),
      transactionVolume: Math.round(150 + Math.random() * 100),
    })),
    summary: {
      priceChange6M: "+8.5%",
      avgGrowthRate: "+1.4%/tháng",
      hottest: district || "Quận 2",
      momentum: "tăng",
    },
  };
}

function getDistrictDetail(
  projectList: typeof mockProjects,
  district: string,
  city: string
) {
  const districtProjects = projectList.filter(
    (p) => p.district === district && p.city === city
  );

  if (districtProjects.length === 0) {
    return { error: "District not found", district, city };
  }

  // Group by tier
  const byTier: Record<string, typeof districtProjects> = {};
  districtProjects.forEach((p) => {
    if (!byTier[p.tier]) byTier[p.tier] = [];
    byTier[p.tier].push(p);
  });

  // Group by developer
  const byDeveloper: Record<string, number> = {};
  districtProjects.forEach((p) => {
    byDeveloper[p.developer.slug] = (byDeveloper[p.developer.slug] || 0) + 1;
  });

  const topDevelopers = Object.entries(byDeveloper)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([slug, count]) => ({ slug, projectCount: count }));

  return {
    district,
    city,
    projectCount: districtProjects.length,
    avgScore: Math.round(
      districtProjects.reduce((sum, p) => sum + p.score, 0) / districtProjects.length
    ),
    tierBreakdown: Object.entries(byTier).map(([tier, projects]) => ({
      tier,
      count: projects.length,
      projects: projects.map((p) => ({
        slug: p.slug,
        name: p.name,
        score: p.score,
        developer: p.developer.slug,
      })),
    })),
    topDevelopers,
    marketMetrics: {
      avgPricePerSqm: 75_000_000 + Math.round(Math.random() * 20_000_000),
      avgRentPerSqm: 350_000 + Math.round(Math.random() * 100_000),
      priceToRentRatio: 17.5,
      yoyPriceChange: "+7.2%",
    },
  };
}
