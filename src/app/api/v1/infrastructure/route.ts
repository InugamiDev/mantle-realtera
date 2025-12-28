import { NextRequest, NextResponse } from "next/server";
import { mockProjects } from "@/data/mockProjects";

// Infrastructure Impact Analysis API
// Analyze how infrastructure projects affect property values

export type InfrastructureType =
  | "metro"
  | "highway"
  | "bridge"
  | "airport"
  | "school"
  | "hospital"
  | "mall"
  | "park";

export type InfrastructureStatus = "planned" | "under_construction" | "completed";

interface InfrastructureProject {
  id: string;
  name: string;
  type: InfrastructureType;
  status: InfrastructureStatus;
  location: {
    lat: number;
    lng: number;
    district: string;
    city: string;
  };
  timeline: {
    announced: string;
    startDate?: string;
    expectedCompletion: string;
    actualCompletion?: string;
  };
  impact: {
    radius: number; // km
    estimatedPriceImpact: number; // percentage
    affectedDistricts: string[];
    affectedProjects: number;
  };
  details: {
    investment: number; // VND
    description: string;
    source: string;
  };
}

interface ImpactAnalysis {
  projectSlug: string;
  nearbyInfrastructure: {
    project: InfrastructureProject;
    distance: number; // km
    priceImpact: number; // percentage
    impactType: "positive" | "neutral" | "negative";
  }[];
  totalPriceImpact: number;
  futureOutlook: "bullish" | "stable" | "cautious";
  insights: string[];
}

// Mock infrastructure projects
const INFRASTRUCTURE_PROJECTS: InfrastructureProject[] = [
  {
    id: "metro_1",
    name: "Metro Line 1 (Bến Thành - Suối Tiên)",
    type: "metro",
    status: "under_construction",
    location: { lat: 10.7731, lng: 106.6980, district: "Quận 1", city: "TP. Hồ Chí Minh" },
    timeline: {
      announced: "2012-01-01",
      startDate: "2012-08-28",
      expectedCompletion: "2024-12-31",
    },
    impact: {
      radius: 1.5,
      estimatedPriceImpact: 15,
      affectedDistricts: ["Quận 1", "Quận 2", "Bình Thạnh", "Thủ Đức", "Quận 9"],
      affectedProjects: 45,
    },
    details: {
      investment: 43_600_000_000_000, // 43.6 trillion VND
      description: "Tuyến metro đầu tiên của TP.HCM, dài 19.7km với 14 ga",
      source: "UBND TP.HCM",
    },
  },
  {
    id: "metro_2",
    name: "Metro Line 2 (Bến Thành - Tham Lương)",
    type: "metro",
    status: "planned",
    location: { lat: 10.7731, lng: 106.6980, district: "Quận 1", city: "TP. Hồ Chí Minh" },
    timeline: {
      announced: "2010-01-01",
      expectedCompletion: "2030-12-31",
    },
    impact: {
      radius: 1.2,
      estimatedPriceImpact: 12,
      affectedDistricts: ["Quận 1", "Quận 3", "Quận 10", "Quận 12", "Tân Bình"],
      affectedProjects: 38,
    },
    details: {
      investment: 47_800_000_000_000,
      description: "Tuyến metro thứ 2, dài 11.3km với 10 ga",
      source: "UBND TP.HCM",
    },
  },
  {
    id: "highway_1",
    name: "Vành đai 3 TP.HCM",
    type: "highway",
    status: "under_construction",
    location: { lat: 10.85, lng: 106.75, district: "Thủ Đức", city: "TP. Hồ Chí Minh" },
    timeline: {
      announced: "2020-01-01",
      startDate: "2023-06-15",
      expectedCompletion: "2026-12-31",
    },
    impact: {
      radius: 3,
      estimatedPriceImpact: 20,
      affectedDistricts: ["Thủ Đức", "Quận 9", "Bình Chánh", "Củ Chi"],
      affectedProjects: 25,
    },
    details: {
      investment: 75_400_000_000_000,
      description: "Đường vành đai 3, dài 76km, kết nối 4 tỉnh thành",
      source: "Bộ GTVT",
    },
  },
  {
    id: "bridge_1",
    name: "Cầu Thủ Thiêm 4",
    type: "bridge",
    status: "planned",
    location: { lat: 10.78, lng: 106.73, district: "Quận 2", city: "TP. Hồ Chí Minh" },
    timeline: {
      announced: "2022-01-01",
      expectedCompletion: "2027-12-31",
    },
    impact: {
      radius: 2,
      estimatedPriceImpact: 10,
      affectedDistricts: ["Quận 2", "Quận 7"],
      affectedProjects: 18,
    },
    details: {
      investment: 5_200_000_000_000,
      description: "Cầu nối Quận 2 và Quận 7, dài 2.1km",
      source: "UBND TP.HCM",
    },
  },
];

// GET /api/v1/infrastructure - Get infrastructure projects and impact analysis
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectSlug = searchParams.get("projectSlug");
  const district = searchParams.get("district");
  const type = searchParams.get("type") as InfrastructureType | null;
  const status = searchParams.get("status") as InfrastructureStatus | null;

  // Impact analysis for a specific real estate project
  if (projectSlug) {
    const project = mockProjects.find((p) => p.slug === projectSlug);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const analysis = analyzeImpact(project);
    return NextResponse.json({
      project: {
        slug: project.slug,
        name: project.name,
        district: project.district,
        tier: project.tier,
      },
      analysis,
    });
  }

  // Filter infrastructure projects
  let projects = INFRASTRUCTURE_PROJECTS;

  if (district) {
    projects = projects.filter((p) =>
      p.impact.affectedDistricts.includes(district)
    );
  }
  if (type) {
    projects = projects.filter((p) => p.type === type);
  }
  if (status) {
    projects = projects.filter((p) => p.status === status);
  }

  // Summary
  const summary = {
    total: projects.length,
    byStatus: {
      planned: projects.filter((p) => p.status === "planned").length,
      under_construction: projects.filter((p) => p.status === "under_construction").length,
      completed: projects.filter((p) => p.status === "completed").length,
    },
    byType: Object.fromEntries(
      (["metro", "highway", "bridge", "airport", "school", "hospital", "mall", "park"] as InfrastructureType[])
        .map((t) => [t, projects.filter((p) => p.type === t).length])
    ),
    totalInvestment: projects.reduce((sum, p) => sum + p.details.investment, 0),
    avgPriceImpact: Math.round(
      projects.reduce((sum, p) => sum + p.impact.estimatedPriceImpact, 0) / projects.length
    ),
  };

  return NextResponse.json({
    projects,
    summary,
    types: {
      metro: "Tuyến metro",
      highway: "Đường cao tốc",
      bridge: "Cầu",
      airport: "Sân bay",
      school: "Trường học",
      hospital: "Bệnh viện",
      mall: "TTTM",
      park: "Công viên",
    },
  });
}

function analyzeImpact(project: typeof mockProjects[0]): ImpactAnalysis {
  // Find nearby infrastructure
  const nearby = INFRASTRUCTURE_PROJECTS
    .filter((infra) => infra.impact.affectedDistricts.includes(project.district))
    .map((infra) => {
      // Mock distance calculation (would use real coordinates)
      const distance = 0.5 + Math.random() * 2;
      const priceImpact = Math.round(
        infra.impact.estimatedPriceImpact * (1 - distance / infra.impact.radius) * 0.8
      );

      return {
        project: infra,
        distance: Math.round(distance * 10) / 10,
        priceImpact: Math.max(0, priceImpact),
        impactType: (priceImpact > 5 ? "positive" : priceImpact > 0 ? "neutral" : "negative") as "positive" | "neutral" | "negative",
      };
    })
    .sort((a, b) => a.distance - b.distance);

  const totalPriceImpact = nearby.reduce((sum, n) => sum + n.priceImpact, 0);

  const insights: string[] = [];
  if (nearby.some((n) => n.project.type === "metro")) {
    insights.push("Gần tuyến metro - tăng giá trị dài hạn đáng kể");
  }
  if (nearby.some((n) => n.project.status === "under_construction")) {
    insights.push("Có hạ tầng đang xây dựng - tiềm năng tăng giá khi hoàn thành");
  }
  if (totalPriceImpact > 15) {
    insights.push("Khu vực hưởng lợi lớn từ đầu tư hạ tầng");
  }

  return {
    projectSlug: project.slug,
    nearbyInfrastructure: nearby,
    totalPriceImpact,
    futureOutlook: totalPriceImpact > 20 ? "bullish" : totalPriceImpact > 10 ? "stable" : "cautious",
    insights,
  };
}
