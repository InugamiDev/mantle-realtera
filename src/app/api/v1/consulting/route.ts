import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";
import { mockProjects, developers } from "@/data/mockProjects";
import { TIER_ORDER, TIERS } from "@/lib/tier";

// Developer Improvement Consulting API
// Help developers improve their tier ratings

export type ConsultingArea =
  | "legal"           // Pháp lý
  | "construction"    // Chất lượng xây dựng
  | "delivery"        // Tiến độ bàn giao
  | "customer_service" // Dịch vụ khách hàng
  | "transparency"    // Minh bạch thông tin
  | "sustainability"; // Bền vững & xanh

interface ImprovementRecommendation {
  area: ConsultingArea;
  currentScore: number;
  maxScore: number;
  priority: "high" | "medium" | "low";
  recommendations: string[];
  potentialImpact: string;
  estimatedCost: string;
  timeframe: string;
}

interface ConsultingPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  includes: string[];
  targetTier: string;
}

interface TierRoadmap {
  currentTier: string;
  targetTier: string;
  gap: number;
  timeline: string;
  phases: {
    phase: number;
    name: string;
    duration: string;
    objectives: string[];
    milestones: string[];
  }[];
  investment: {
    consulting: number;
    implementation: number;
    total: number;
  };
}

// Consulting packages
const CONSULTING_PACKAGES: ConsultingPackage[] = [
  {
    id: "assessment",
    name: "Tier Assessment",
    price: 20_000_000, // 20M VND
    duration: "2 tuần",
    features: [
      "Đánh giá tier hiện tại chi tiết",
      "Gap analysis",
      "Benchmark với đối thủ",
      "Báo cáo 30 trang",
    ],
    includes: [
      "2 buổi workshop",
      "Phỏng vấn stakeholders",
      "Review tài liệu",
    ],
    targetTier: "Tất cả",
  },
  {
    id: "improvement",
    name: "Tier Improvement Program",
    price: 100_000_000, // 100M VND
    duration: "6 tháng",
    features: [
      "Assessment đầy đủ",
      "Lộ trình nâng tier",
      "Coaching hàng tháng",
      "Process improvement",
      "Staff training",
    ],
    includes: [
      "12 buổi coaching",
      "Quarterly reviews",
      "Implementation support",
      "Progress tracking",
    ],
    targetTier: "Nâng 1 tier",
  },
  {
    id: "transformation",
    name: "Tier Transformation",
    price: 300_000_000, // 300M VND
    duration: "12 tháng",
    features: [
      "Tất cả Improvement Program",
      "Restructuring support",
      "Technology upgrade",
      "Brand repositioning",
      "Certification support",
    ],
    includes: [
      "Dedicated consultant",
      "Weekly check-ins",
      "Executive coaching",
      "Crisis management",
      "PR support",
    ],
    targetTier: "Nâng 2+ tier",
  },
];

// Scoring areas
const SCORING_AREAS: Record<ConsultingArea, { label: string; maxScore: number }> = {
  legal: { label: "Pháp lý", maxScore: 20 },
  construction: { label: "Chất lượng xây dựng", maxScore: 25 },
  delivery: { label: "Tiến độ bàn giao", maxScore: 15 },
  customer_service: { label: "Dịch vụ khách hàng", maxScore: 15 },
  transparency: { label: "Minh bạch", maxScore: 15 },
  sustainability: { label: "Bền vững", maxScore: 10 },
};

// GET /api/v1/consulting - Get consulting info or developer assessment
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "packages";
  const developerSlug = searchParams.get("developer");

  // Public packages info
  if (type === "packages") {
    return NextResponse.json({
      packages: CONSULTING_PACKAGES,
      scoringAreas: Object.entries(SCORING_AREAS).map(([key, value]) => ({
        area: key,
        ...value,
      })),
      successStories: [
        {
          developer: "Nova Developer",
          from: "B",
          to: "A",
          duration: "8 tháng",
          testimonial: "Tăng doanh số 40% sau khi nâng tier",
        },
        {
          developer: "Hưng Thịnh Corp",
          from: "A",
          to: "S",
          duration: "12 tháng",
          testimonial: "Cải thiện đáng kể quy trình và chất lượng",
        },
      ],
      benefits: [
        "Tăng niềm tin khách hàng",
        "Giá bán cao hơn 10-20%",
        "Thanh khoản tốt hơn",
        "Ưu tiên trong kết quả tìm kiếm",
        "Eligibility cho Lead Generation",
      ],
    });
  }

  // Developer assessment (requires auth)
  if (type === "assessment" && developerSlug) {
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assessment = generateAssessment(developerSlug);
    if (!assessment) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 });
    }

    return NextResponse.json({ assessment });
  }

  // Tier roadmap (requires auth)
  if (type === "roadmap" && developerSlug) {
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const targetTier = searchParams.get("target");
    const roadmap = generateRoadmap(developerSlug, targetTier);
    if (!roadmap) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 });
    }

    return NextResponse.json({ roadmap });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

// POST /api/v1/consulting - Request consultation
export async function POST(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { packageId, developerSlug, contactName, contactEmail, notes } = body;

  if (!packageId || !developerSlug || !contactEmail) {
    return NextResponse.json(
      { error: "packageId, developerSlug, and contactEmail required" },
      { status: 400 }
    );
  }

  const selectedPackage = CONSULTING_PACKAGES.find((p) => p.id === packageId);
  if (!selectedPackage) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  // In production: save to database, notify consulting team
  const consultationRequest = {
    id: `consult_${Date.now()}`,
    packageId,
    packageName: selectedPackage.name,
    developerSlug,
    contactName,
    contactEmail,
    notes,
    status: "pending",
    createdAt: new Date().toISOString(),
    estimatedPrice: selectedPackage.price,
  };

  return NextResponse.json({
    success: true,
    request: consultationRequest,
    message: "Yêu cầu tư vấn đã được ghi nhận. Chúng tôi sẽ liên hệ trong 24h.",
    nextSteps: [
      "Đội ngũ tư vấn sẽ liên hệ xác nhận",
      "Lên lịch buổi kick-off meeting",
      "Bắt đầu assessment",
    ],
  });
}

function generateAssessment(developerSlug: string) {
  const developer = Object.values(developers).find((d) => d.slug === developerSlug);
  if (!developer) return null;

  const devProjects = mockProjects.filter((p) => p.developer.slug === developerSlug);
  const currentTierIndex = TIER_ORDER.indexOf(developer.tier);

  // Generate scores for each area
  const areaScores: Record<ConsultingArea, number> = {
    legal: Math.round(SCORING_AREAS.legal.maxScore * (0.6 + Math.random() * 0.35)),
    construction: Math.round(SCORING_AREAS.construction.maxScore * (0.5 + Math.random() * 0.4)),
    delivery: Math.round(SCORING_AREAS.delivery.maxScore * (0.55 + Math.random() * 0.35)),
    customer_service: Math.round(SCORING_AREAS.customer_service.maxScore * (0.5 + Math.random() * 0.4)),
    transparency: Math.round(SCORING_AREAS.transparency.maxScore * (0.6 + Math.random() * 0.3)),
    sustainability: Math.round(SCORING_AREAS.sustainability.maxScore * (0.4 + Math.random() * 0.4)),
  };

  const totalScore = Object.values(areaScores).reduce((sum, s) => sum + s, 0);
  const maxTotal = Object.values(SCORING_AREAS).reduce((sum, a) => sum + a.maxScore, 0);

  // Generate recommendations
  const recommendations: ImprovementRecommendation[] = Object.entries(areaScores).map(
    ([area, score]) => {
      const areaInfo = SCORING_AREAS[area as ConsultingArea];
      const gap = areaInfo.maxScore - score;
      const percentage = score / areaInfo.maxScore;

      return {
        area: area as ConsultingArea,
        currentScore: score,
        maxScore: areaInfo.maxScore,
        priority: percentage < 0.6 ? "high" : percentage < 0.8 ? "medium" : "low",
        recommendations: getRecommendations(area as ConsultingArea, percentage),
        potentialImpact: `+${Math.round(gap * 0.7)} điểm`,
        estimatedCost: getCostEstimate(area as ConsultingArea, gap),
        timeframe: gap > 5 ? "6-12 tháng" : gap > 2 ? "3-6 tháng" : "1-3 tháng",
      };
    }
  );

  return {
    developer: {
      name: developer.name,
      slug: developer.slug,
      currentTier: developer.tier,
      projectCount: devProjects.length,
    },
    scores: {
      total: totalScore,
      max: maxTotal,
      percentage: Math.round((totalScore / maxTotal) * 100),
      byArea: areaScores,
    },
    tierAnalysis: {
      current: developer.tier,
      currentRange: TIERS[developer.tier],
      nextTier: currentTierIndex > 0 ? TIER_ORDER[currentTierIndex - 1] : null,
      gapToNext: currentTierIndex > 0 ? TIERS[TIER_ORDER[currentTierIndex - 1]].minScore - totalScore : 0,
    },
    recommendations: recommendations.sort((a, b) =>
      a.priority === "high" ? -1 : b.priority === "high" ? 1 : 0
    ),
    competitorComparison: {
      avgInTier: totalScore - 5 + Math.floor(Math.random() * 10),
      bestInTier: totalScore + 10 + Math.floor(Math.random() * 5),
      rank: Math.floor(Math.random() * 5) + 1,
      totalInTier: 10 + Math.floor(Math.random() * 10),
    },
  };
}

function generateRoadmap(developerSlug: string, targetTier: string | null): TierRoadmap | null {
  const developer = Object.values(developers).find((d) => d.slug === developerSlug);
  if (!developer) return null;

  const currentIndex = TIER_ORDER.indexOf(developer.tier);
  const target = (targetTier || (currentIndex > 0 ? TIER_ORDER[currentIndex - 1] : developer.tier)) as typeof TIER_ORDER[number];
  const targetIndex = TIER_ORDER.indexOf(target);
  const tierGap = currentIndex - targetIndex;

  const phases = Array.from({ length: Math.max(1, tierGap * 2) }, (_, i) => ({
    phase: i + 1,
    name: i === 0 ? "Foundation" : i === 1 ? "Implementation" : i === 2 ? "Optimization" : "Excellence",
    duration: "3 tháng",
    objectives: [
      i === 0 ? "Gap analysis và planning" : "",
      i === 0 ? "Process documentation" : "",
      i === 1 ? "Implement improvements" : "",
      i === 1 ? "Staff training" : "",
      i >= 2 ? "Fine-tune processes" : "",
      i >= 2 ? "Prepare for assessment" : "",
    ].filter(Boolean),
    milestones: [
      `Hoàn thành phase ${i + 1}`,
      i === 0 ? "Roadmap approved" : "",
      i === tierGap * 2 - 1 ? "Tier assessment" : "",
    ].filter(Boolean),
  }));

  return {
    currentTier: developer.tier,
    targetTier: target,
    gap: tierGap,
    timeline: `${tierGap * 6} tháng`,
    phases,
    investment: {
      consulting: tierGap * 50_000_000,
      implementation: tierGap * 100_000_000,
      total: tierGap * 150_000_000,
    },
  };
}

function getRecommendations(area: ConsultingArea, percentage: number): string[] {
  const recs: Record<ConsultingArea, string[]> = {
    legal: [
      "Hoàn thiện hồ sơ pháp lý dự án",
      "Công khai giấy phép xây dựng",
      "Minh bạch hợp đồng mẫu",
    ],
    construction: [
      "Áp dụng tiêu chuẩn ISO 9001",
      "Tăng cường giám sát chất lượng",
      "Sử dụng vật liệu cao cấp hơn",
    ],
    delivery: [
      "Cải thiện quản lý tiến độ",
      "Buffer time cho rủi ro",
      "Transparent progress reporting",
    ],
    customer_service: [
      "Đào tạo nhân viên CSKH",
      "Hotline 24/7",
      "Quy trình giải quyết khiếu nại",
    ],
    transparency: [
      "Công bố báo cáo tiến độ định kỳ",
      "Website thông tin chi tiết",
      "Open house events",
    ],
    sustainability: [
      "Chứng chỉ xanh (LEED, EDGE)",
      "Energy efficient design",
      "Waste management program",
    ],
  };

  return percentage < 0.7 ? recs[area] : recs[area].slice(0, 2);
}

function getCostEstimate(area: ConsultingArea, gap: number): string {
  const baseCosts: Record<ConsultingArea, number> = {
    legal: 50_000_000,
    construction: 200_000_000,
    delivery: 80_000_000,
    customer_service: 30_000_000,
    transparency: 20_000_000,
    sustainability: 150_000_000,
  };

  const cost = baseCosts[area] * (gap / 10);
  return `${(cost / 1_000_000).toFixed(0)}M - ${((cost * 1.5) / 1_000_000).toFixed(0)}M VND`;
}
