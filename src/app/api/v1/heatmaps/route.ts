import { NextRequest, NextResponse } from "next/server";
import { mockProjects } from "@/data/mockProjects";
import { TIER_ORDER } from "@/lib/tier";

// Market Heatmaps API
// Geographic visualization data for projects, prices, demand

export type HeatmapType = "projects" | "prices" | "tiers" | "demand" | "growth";

interface HeatmapCell {
  district: string;
  city: string;
  lat: number;
  lng: number;
  value: number;
  intensity: number; // 0-1 normalized
  label: string;
  details?: Record<string, unknown>;
}

interface HeatmapData {
  type: HeatmapType;
  cells: HeatmapCell[];
  legend: {
    min: number;
    max: number;
    unit: string;
    colors: string[];
  };
  summary: {
    hottest: string;
    coldest: string;
    avgValue: number;
  };
}

// Mock coordinates for districts (center points)
const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  "Quận 1": { lat: 10.7756, lng: 106.7019 },
  "Quận 2": { lat: 10.7873, lng: 106.7515 },
  "Quận 3": { lat: 10.7843, lng: 106.6867 },
  "Quận 7": { lat: 10.7340, lng: 106.7218 },
  "Quận 9": { lat: 10.8414, lng: 106.8295 },
  "Bình Thạnh": { lat: 10.8105, lng: 106.7091 },
  "Thủ Đức": { lat: 10.8522, lng: 106.7595 },
  "Phú Nhuận": { lat: 10.7995, lng: 106.6804 },
  "Tân Bình": { lat: 10.8015, lng: 106.6528 },
  "Gò Vấp": { lat: 10.8388, lng: 106.6652 },
};

// Base prices for heatmap (VND/m2)
const DISTRICT_PRICES: Record<string, number> = {
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

// GET /api/v1/heatmaps?type=projects|prices|tiers|demand|growth
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get("type") || "projects") as HeatmapType;
  const city = searchParams.get("city") || "TP. Hồ Chí Minh";

  const validTypes: HeatmapType[] = ["projects", "prices", "tiers", "demand", "growth"];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: `Invalid type. Use: ${validTypes.join(", ")}` },
      { status: 400 }
    );
  }

  const heatmapData = generateHeatmap(type, city);

  return NextResponse.json({
    ...heatmapData,
    bounds: {
      north: 10.88,
      south: 10.70,
      east: 106.85,
      west: 106.62,
    },
    center: { lat: 10.79, lng: 106.73 },
    zoom: 12,
    timestamp: new Date().toISOString(),
  }, {
    headers: { "Cache-Control": "public, max-age=1800" },
  });
}

function generateHeatmap(type: HeatmapType, city: string): HeatmapData {
  const cityProjects = mockProjects.filter((p) => p.city === city);

  // Group by district
  const districtData: Record<string, typeof cityProjects> = {};
  cityProjects.forEach((p) => {
    if (!districtData[p.district]) districtData[p.district] = [];
    districtData[p.district].push(p);
  });

  let cells: HeatmapCell[] = [];
  let legend: HeatmapData["legend"];
  const values: number[] = [];

  switch (type) {
    case "projects":
      // Project density heatmap
      cells = Object.entries(districtData).map(([district, projects]) => {
        const coords = DISTRICT_COORDS[district] || { lat: 10.79, lng: 106.73 };
        values.push(projects.length);
        return {
          district,
          city,
          lat: coords.lat,
          lng: coords.lng,
          value: projects.length,
          intensity: 0, // Will normalize later
          label: `${projects.length} dự án`,
          details: {
            topTier: projects.sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier))[0]?.tier,
          },
        };
      });
      legend = {
        min: Math.min(...values),
        max: Math.max(...values),
        unit: "dự án",
        colors: ["#f0fdf4", "#22c55e", "#15803d"],
      };
      break;

    case "prices":
      // Price heatmap
      cells = Object.keys(DISTRICT_COORDS).map((district) => {
        const coords = DISTRICT_COORDS[district];
        const price = DISTRICT_PRICES[district] || 60_000_000;
        values.push(price);
        return {
          district,
          city,
          lat: coords.lat,
          lng: coords.lng,
          value: price,
          intensity: 0,
          label: `${Math.round(price / 1_000_000)}M/m²`,
          details: {
            trend: price > 80_000_000 ? "hot" : price > 60_000_000 ? "warm" : "cool",
          },
        };
      });
      legend = {
        min: Math.min(...values),
        max: Math.max(...values),
        unit: "VND/m²",
        colors: ["#dbeafe", "#3b82f6", "#1e40af"],
      };
      break;

    case "tiers":
      // Average tier quality heatmap
      cells = Object.entries(districtData).map(([district, projects]) => {
        const coords = DISTRICT_COORDS[district] || { lat: 10.79, lng: 106.73 };
        const avgTierIndex = projects.reduce((sum, p) =>
          sum + TIER_ORDER.indexOf(p.tier), 0) / projects.length;
        const score = Math.round((1 - avgTierIndex / TIER_ORDER.length) * 100);
        values.push(score);
        return {
          district,
          city,
          lat: coords.lat,
          lng: coords.lng,
          value: score,
          intensity: 0,
          label: `Chất lượng: ${score}/100`,
          details: {
            dominantTier: getMostCommonTier(projects),
            projectCount: projects.length,
          },
        };
      });
      legend = {
        min: 0,
        max: 100,
        unit: "điểm",
        colors: ["#fef3c7", "#f59e0b", "#b45309"],
      };
      break;

    case "demand":
      // Demand/interest heatmap (mock based on project count and tier)
      cells = Object.entries(districtData).map(([district, projects]) => {
        const coords = DISTRICT_COORDS[district] || { lat: 10.79, lng: 106.73 };
        const demand = Math.round(projects.length * 15 + Math.random() * 30);
        values.push(demand);
        return {
          district,
          city,
          lat: coords.lat,
          lng: coords.lng,
          value: demand,
          intensity: 0,
          label: `${demand} lượt quan tâm/ngày`,
          details: {
            growth: `+${Math.round(5 + Math.random() * 15)}%`,
          },
        };
      });
      legend = {
        min: Math.min(...values),
        max: Math.max(...values),
        unit: "lượt/ngày",
        colors: ["#fce7f3", "#ec4899", "#9d174d"],
      };
      break;

    case "growth":
      // Price growth heatmap
      cells = Object.keys(DISTRICT_COORDS).map((district) => {
        const coords = DISTRICT_COORDS[district];
        const growth = 3 + Math.random() * 12; // 3-15% growth
        values.push(growth);
        return {
          district,
          city,
          lat: coords.lat,
          lng: coords.lng,
          value: Math.round(growth * 10) / 10,
          intensity: 0,
          label: `+${growth.toFixed(1)}% YoY`,
          details: {
            forecast: growth > 8 ? "bullish" : growth > 5 ? "stable" : "cautious",
          },
        };
      });
      legend = {
        min: Math.min(...values),
        max: Math.max(...values),
        unit: "% YoY",
        colors: ["#f0fdf4", "#4ade80", "#166534"],
      };
      break;
  }

  // Normalize intensity values
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  cells = cells.map((cell) => ({
    ...cell,
    intensity: maxVal > minVal ? (cell.value - minVal) / (maxVal - minVal) : 0.5,
  }));

  // Find hottest and coldest
  const sorted = [...cells].sort((a, b) => b.value - a.value);

  return {
    type,
    cells,
    legend,
    summary: {
      hottest: sorted[0]?.district || "",
      coldest: sorted[sorted.length - 1]?.district || "",
      avgValue: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    },
  };
}

function getMostCommonTier(projects: typeof mockProjects): string {
  const counts: Record<string, number> = {};
  projects.forEach((p) => {
    counts[p.tier] = (counts[p.tier] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "B";
}
