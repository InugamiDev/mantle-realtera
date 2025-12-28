import { NextRequest, NextResponse } from "next/server";
import { mockProjects } from "@/data/mockProjects";

// Neighborhood Intelligence API
// Detailed data about districts and neighborhoods

interface NeighborhoodData {
  district: string;
  city: string;
  // Demographics
  population: number;
  avgIncome: number;
  ageDistribution: {
    young: number;  // 18-35
    middle: number; // 35-55
    senior: number; // 55+
  };
  // Infrastructure
  infrastructure: {
    schools: number;
    hospitals: number;
    malls: number;
    metroStations: number;
    parks: number;
  };
  // Scores
  scores: {
    livability: number;
    investment: number;
    infrastructure: number;
    safety: number;
    transportation: number;
  };
  // Real estate
  realEstate: {
    totalProjects: number;
    avgPricePerSqm: number;
    priceGrowth1Y: number;
    dominantTier: string;
    topDevelopers: string[];
  };
  // Amenities within 2km radius
  nearbyAmenities: {
    category: string;
    count: number;
    notable: string[];
  }[];
}

// Mock neighborhood data
const NEIGHBORHOOD_DATA: Record<string, Partial<NeighborhoodData>> = {
  "Quận 2": {
    population: 180000,
    avgIncome: 25000000,
    ageDistribution: { young: 45, middle: 40, senior: 15 },
    infrastructure: { schools: 45, hospitals: 8, malls: 12, metroStations: 4, parks: 15 },
    scores: { livability: 88, investment: 92, infrastructure: 85, safety: 82, transportation: 78 },
  },
  "Quận 7": {
    population: 350000,
    avgIncome: 22000000,
    ageDistribution: { young: 40, middle: 45, senior: 15 },
    infrastructure: { schools: 65, hospitals: 12, malls: 18, metroStations: 2, parks: 20 },
    scores: { livability: 90, investment: 85, infrastructure: 88, safety: 88, transportation: 72 },
  },
  "Thủ Đức": {
    population: 1100000,
    avgIncome: 18000000,
    ageDistribution: { young: 50, middle: 35, senior: 15 },
    infrastructure: { schools: 120, hospitals: 15, malls: 25, metroStations: 8, parks: 30 },
    scores: { livability: 82, investment: 90, infrastructure: 80, safety: 75, transportation: 85 },
  },
  "Bình Thạnh": {
    population: 500000,
    avgIncome: 20000000,
    ageDistribution: { young: 42, middle: 43, senior: 15 },
    infrastructure: { schools: 80, hospitals: 10, malls: 15, metroStations: 3, parks: 12 },
    scores: { livability: 85, investment: 82, infrastructure: 82, safety: 78, transportation: 80 },
  },
};

// GET /api/v1/neighborhoods - Get neighborhood data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district");
  const city = searchParams.get("city") || "TP. Hồ Chí Minh";
  const compare = searchParams.get("compare")?.split(",");

  // List all neighborhoods
  if (!district && !compare) {
    const neighborhoods = Object.keys(NEIGHBORHOOD_DATA).map((d) => {
      const data = NEIGHBORHOOD_DATA[d];
      const districtProjects = mockProjects.filter((p) => p.district === d);

      return {
        district: d,
        city,
        population: data.population,
        scores: data.scores,
        projectCount: districtProjects.length,
        avgScore: districtProjects.length > 0
          ? Math.round(districtProjects.reduce((sum, p) => sum + p.score, 0) / districtProjects.length)
          : null,
      };
    });

    return NextResponse.json({
      neighborhoods,
      city,
      totalDistricts: neighborhoods.length,
    });
  }

  // Compare multiple districts
  if (compare && compare.length > 1) {
    const comparison = compare.slice(0, 5).map((d) => getNeighborhoodDetail(d.trim(), city));

    const categories = ["livability", "investment", "infrastructure", "safety", "transportation"];
    const rankings: Record<string, string[]> = {};

    categories.forEach((cat) => {
      rankings[cat] = comparison
        .filter((n) => n.scores)
        .sort((a, b) => (b.scores?.[cat as keyof typeof b.scores] || 0) - (a.scores?.[cat as keyof typeof a.scores] || 0))
        .map((n) => n.district);
    });

    return NextResponse.json({
      comparison,
      rankings,
      recommendation: comparison.reduce((best, curr) =>
        (curr.scores?.investment || 0) > (best.scores?.investment || 0) ? curr : best
      ).district,
    });
  }

  // Single district detail
  if (district) {
    const data = getNeighborhoodDetail(district, city);
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

function getNeighborhoodDetail(district: string, city: string): NeighborhoodData {
  const baseData = NEIGHBORHOOD_DATA[district] || {};
  const districtProjects = mockProjects.filter((p) => p.district === district);

  // Calculate real estate stats
  const avgScore = districtProjects.length > 0
    ? Math.round(districtProjects.reduce((sum, p) => sum + p.score, 0) / districtProjects.length)
    : 70;

  const tierCounts: Record<string, number> = {};
  const developerCounts: Record<string, number> = {};

  districtProjects.forEach((p) => {
    tierCounts[p.tier] = (tierCounts[p.tier] || 0) + 1;
    developerCounts[p.developer.slug] = (developerCounts[p.developer.slug] || 0) + 1;
  });

  const dominantTier = Object.entries(tierCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "B";

  const topDevelopers = Object.entries(developerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([slug]) => slug);

  // Generate nearby amenities
  const nearbyAmenities = [
    {
      category: "Giáo dục",
      count: baseData.infrastructure?.schools || 30,
      notable: ["Trường Quốc tế", "Đại học", "Trung tâm anh ngữ"],
    },
    {
      category: "Y tế",
      count: baseData.infrastructure?.hospitals || 5,
      notable: ["Bệnh viện Quốc tế", "Phòng khám đa khoa"],
    },
    {
      category: "Mua sắm",
      count: baseData.infrastructure?.malls || 10,
      notable: ["Vincom", "AEON Mall", "Siêu thị"],
    },
    {
      category: "Giao thông",
      count: baseData.infrastructure?.metroStations || 2,
      notable: ["Ga Metro", "Trạm xe buýt", "Bến phà"],
    },
    {
      category: "Giải trí",
      count: baseData.infrastructure?.parks || 8,
      notable: ["Công viên", "Rạp chiếu phim", "Gym"],
    },
  ];

  return {
    district,
    city,
    population: baseData.population || 200000,
    avgIncome: baseData.avgIncome || 18000000,
    ageDistribution: baseData.ageDistribution || { young: 40, middle: 45, senior: 15 },
    infrastructure: baseData.infrastructure || {
      schools: 40,
      hospitals: 6,
      malls: 8,
      metroStations: 2,
      parks: 10,
    },
    scores: baseData.scores || {
      livability: 75 + Math.floor(avgScore / 10),
      investment: 70 + Math.floor(avgScore / 8),
      infrastructure: 72,
      safety: 78,
      transportation: 70,
    },
    realEstate: {
      totalProjects: districtProjects.length,
      avgPricePerSqm: 60000000 + avgScore * 500000,
      priceGrowth1Y: 5 + Math.random() * 10,
      dominantTier,
      topDevelopers,
    },
    nearbyAmenities,
  };
}

// POST /api/v1/neighborhoods/score - Calculate custom location score
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { latitude, longitude, preferences } = body;

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "latitude and longitude required" },
      { status: 400 }
    );
  }

  // Mock score calculation based on coordinates
  // In production, this would use real geospatial data

  const baseScore = 70 + Math.random() * 20;

  const scores = {
    overall: Math.round(baseScore),
    categories: {
      schools: Math.round(60 + Math.random() * 35),
      healthcare: Math.round(65 + Math.random() * 30),
      shopping: Math.round(70 + Math.random() * 25),
      transportation: Math.round(55 + Math.random() * 40),
      safety: Math.round(70 + Math.random() * 25),
      greenSpace: Math.round(50 + Math.random() * 40),
    },
    // Adjusted based on preferences if provided
    personalizedScore: preferences
      ? Math.round(baseScore + (preferences.prioritizeSchools ? 5 : 0) + (preferences.prioritizeTransport ? 3 : 0))
      : null,
  };

  return NextResponse.json({
    location: { latitude, longitude },
    scores,
    nearestDistrict: "Quận 2", // Would be calculated from coordinates
    recommendation: scores.overall >= 80 ? "Vị trí tuyệt vời để sinh sống" : "Vị trí tốt, cân nhắc một số yếu tố",
  });
}
