import { NextRequest, NextResponse } from "next/server";
import { mockProjects } from "@/data/mockProjects";

// Property Valuation API
// Estimate property value based on comparables and market data

interface ValuationInput {
  district: string;
  city: string;
  area: number; // m2
  bedrooms?: number;
  floor?: number;
  facing?: string; // direction
  hasBalcony?: boolean;
  hasParking?: boolean;
  buildingAge?: number; // years
  projectSlug?: string; // if within known project
}

interface ComparableProperty {
  projectName: string;
  district: string;
  area: number;
  pricePerSqm: number;
  totalPrice: number;
  tier: string;
  score: number;
  similarity: number; // 0-100 match score
}

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
  comparables: ComparableProperty[];
  factors: {
    name: string;
    impact: number; // percentage adjustment
    reason: string;
  }[];
  marketContext: {
    districtAvg: number;
    cityAvg: number;
    trend: "up" | "stable" | "down";
    yoyChange: string;
  };
}

// Base prices by district (VND/m2) - mock data
const DISTRICT_BASE_PRICES: Record<string, number> = {
  "Quận 1": 150_000_000,
  "Quận 2": 85_000_000,
  "Quận 3": 120_000_000,
  "Quận 7": 75_000_000,
  "Quận 9": 45_000_000,
  "Bình Thạnh": 70_000_000,
  "Thủ Đức": 55_000_000,
  "Phú Nhuận": 90_000_000,
  "Tân Bình": 65_000_000,
  "Gò Vấp": 50_000_000,
};

// POST /api/v1/valuation - Get property valuation
export async function POST(request: NextRequest) {
  const body = await request.json();
  const input: ValuationInput = body;

  // Validate required fields
  if (!input.district || !input.city || !input.area) {
    return NextResponse.json(
      { error: "district, city, and area are required" },
      { status: 400 }
    );
  }

  if (input.area < 20 || input.area > 500) {
    return NextResponse.json(
      { error: "area must be between 20 and 500 m²" },
      { status: 400 }
    );
  }

  const valuation = calculateValuation(input);

  return NextResponse.json({
    success: true,
    input: {
      district: input.district,
      city: input.city,
      area: input.area,
      bedrooms: input.bedrooms,
      floor: input.floor,
    },
    valuation,
    disclaimer: "Đây là giá trị ước tính dựa trên dữ liệu thị trường. Giá thực tế có thể khác biệt tùy theo nhiều yếu tố.",
    timestamp: new Date().toISOString(),
  });
}

// GET /api/v1/valuation - Get valuation info and supported areas
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district");

  if (district) {
    // Return district-specific pricing info
    const basePrice = DISTRICT_BASE_PRICES[district] || 60_000_000;
    const districtProjects = mockProjects.filter((p) => p.district === district);

    return NextResponse.json({
      district,
      basePrice,
      priceRange: {
        min: Math.round(basePrice * 0.7),
        max: Math.round(basePrice * 1.4),
      },
      projectsInArea: districtProjects.length,
      avgScore: districtProjects.length > 0
        ? Math.round(districtProjects.reduce((sum, p) => sum + p.score, 0) / districtProjects.length)
        : null,
    });
  }

  // Return general info
  return NextResponse.json({
    supportedCities: ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng"],
    supportedDistricts: Object.keys(DISTRICT_BASE_PRICES),
    valuationFactors: [
      { factor: "location", weight: 0.35, description: "Vị trí và quận/huyện" },
      { factor: "project_tier", weight: 0.20, description: "Xếp hạng dự án RealTera" },
      { factor: "area", weight: 0.15, description: "Diện tích căn hộ" },
      { factor: "floor", weight: 0.10, description: "Tầng cao" },
      { factor: "amenities", weight: 0.10, description: "Tiện ích (ban công, bãi đỗ xe)" },
      { factor: "age", weight: 0.10, description: "Tuổi công trình" },
    ],
    priceRanges: Object.entries(DISTRICT_BASE_PRICES)
      .sort((a, b) => b[1] - a[1])
      .map(([district, price]) => ({
        district,
        avgPricePerSqm: price,
        category: price > 100_000_000 ? "premium" : price > 60_000_000 ? "mid" : "affordable",
      })),
  });
}

function calculateValuation(input: ValuationInput): ValuationResult {
  // Get base price for district
  let basePrice = DISTRICT_BASE_PRICES[input.district] || 60_000_000;

  // Find comparables from mock data
  const districtProjects = mockProjects.filter(
    (p) => p.district === input.district || p.city === input.city
  );

  const comparables: ComparableProperty[] = districtProjects
    .slice(0, 5)
    .map((p) => {
      const projectBasePrice = DISTRICT_BASE_PRICES[p.district] || basePrice;
      const tierMultiplier = getTierMultiplier(p.tier);
      const pricePerSqm = Math.round(projectBasePrice * tierMultiplier);

      return {
        projectName: p.name,
        district: p.district,
        area: 70 + Math.random() * 50, // Mock area
        pricePerSqm,
        totalPrice: Math.round(pricePerSqm * (70 + Math.random() * 50)),
        tier: p.tier,
        score: p.score,
        similarity: Math.round(60 + Math.random() * 35),
      };
    })
    .sort((a, b) => b.similarity - a.similarity);

  // Calculate adjustments
  const factors: ValuationResult["factors"] = [];

  // Project tier adjustment if within known project
  if (input.projectSlug) {
    const project = mockProjects.find((p) => p.slug === input.projectSlug);
    if (project) {
      const tierMultiplier = getTierMultiplier(project.tier);
      const adjustment = Math.round((tierMultiplier - 1) * 100);
      factors.push({
        name: `Tier ${project.tier}`,
        impact: adjustment,
        reason: `Dự án được xếp hạng ${project.tier} (điểm ${project.score}/100)`,
      });
      basePrice = Math.round(basePrice * tierMultiplier);
    }
  }

  // Floor adjustment
  if (input.floor) {
    const floorImpact = input.floor <= 3 ? -5 : input.floor >= 15 ? 8 : input.floor >= 10 ? 4 : 0;
    if (floorImpact !== 0) {
      factors.push({
        name: "Tầng cao",
        impact: floorImpact,
        reason: input.floor >= 15 ? "Tầng cao, view đẹp" : input.floor <= 3 ? "Tầng thấp" : "Tầng trung",
      });
      basePrice = Math.round(basePrice * (1 + floorImpact / 100));
    }
  }

  // Balcony adjustment
  if (input.hasBalcony) {
    factors.push({
      name: "Ban công",
      impact: 3,
      reason: "Có ban công/logia",
    });
    basePrice = Math.round(basePrice * 1.03);
  }

  // Parking adjustment
  if (input.hasParking) {
    factors.push({
      name: "Chỗ đỗ xe",
      impact: 2,
      reason: "Có chỗ đỗ xe riêng",
    });
    basePrice = Math.round(basePrice * 1.02);
  }

  // Building age adjustment
  if (input.buildingAge) {
    const ageImpact = input.buildingAge <= 2 ? 5 : input.buildingAge >= 10 ? -10 : input.buildingAge >= 5 ? -5 : 0;
    if (ageImpact !== 0) {
      factors.push({
        name: "Tuổi công trình",
        impact: ageImpact,
        reason: input.buildingAge <= 2 ? "Mới bàn giao" : `${input.buildingAge} năm tuổi`,
      });
      basePrice = Math.round(basePrice * (1 + ageImpact / 100));
    }
  }

  // Calculate final values
  const midPrice = basePrice;
  const variance = 0.12; // 12% variance

  const pricePerSqm = {
    low: Math.round(midPrice * (1 - variance)),
    mid: midPrice,
    high: Math.round(midPrice * (1 + variance)),
  };

  const estimatedValue = {
    low: Math.round(pricePerSqm.low * input.area),
    mid: Math.round(pricePerSqm.mid * input.area),
    high: Math.round(pricePerSqm.high * input.area),
  };

  // Determine confidence
  const confidence: "high" | "medium" | "low" =
    comparables.length >= 4 && input.projectSlug
      ? "high"
      : comparables.length >= 2
        ? "medium"
        : "low";

  // Market context
  const cityAvg = Math.round(
    Object.values(DISTRICT_BASE_PRICES).reduce((a, b) => a + b, 0) /
    Object.keys(DISTRICT_BASE_PRICES).length
  );

  return {
    estimatedValue,
    pricePerSqm,
    confidence,
    comparables,
    factors,
    marketContext: {
      districtAvg: DISTRICT_BASE_PRICES[input.district] || cityAvg,
      cityAvg,
      trend: basePrice > cityAvg * 1.1 ? "up" : basePrice < cityAvg * 0.9 ? "down" : "stable",
      yoyChange: "+7.5%",
    },
  };
}

function getTierMultiplier(tier: string): number {
  const multipliers: Record<string, number> = {
    SSS: 1.35,
    "S+": 1.25,
    S: 1.15,
    A: 1.08,
    B: 1.0,
    C: 0.92,
    D: 0.85,
    F: 0.75,
  };
  return multipliers[tier] || 1.0;
}
