import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";
import { mockProjects, developers } from "@/data/mockProjects";

// Buyer Intent Data Marketplace API
// Anonymized buyer behavior and intent data for market research

export type IntentSignal = "high" | "medium" | "low";
export type BuyerSegment = "investor" | "end_user" | "first_time" | "upgrade";

interface IntentDataPoint {
  id: string;
  timestamp: string;
  // Location signals
  location: {
    district: string;
    city: string;
  };
  // Behavior signals
  behavior: {
    searchQueries: string[];
    viewedProjects: number;
    savedProjects: number;
    comparedProjects: number;
    timeSpent: number; // minutes
    returnVisits: number;
  };
  // Intent signals
  intent: {
    signal: IntentSignal;
    score: number; // 0-100
    segment: BuyerSegment;
    budgetRange: {
      min: number;
      max: number;
    };
    timeline: string; // "immediate", "1-3 months", etc.
  };
  // Aggregated (anonymized)
  isAnonymized: true;
}

interface IntentReport {
  period: string;
  district?: string;
  summary: {
    totalSearches: number;
    uniqueVisitors: number;
    avgIntentScore: number;
    topSegment: BuyerSegment;
  };
  trends: {
    searchVolume: { period: string; value: number }[];
    intentScore: { period: string; value: number }[];
  };
  topSearchTerms: { term: string; count: number; growth: string }[];
  demandByDistrict: { district: string; demand: number; growth: string }[];
  budgetDistribution: { range: string; percentage: number }[];
  insights: string[];
}

// Data packages
const DATA_PACKAGES = {
  basic: {
    id: "basic",
    name: "Basic Intent Data",
    price: 10_000_000, // 10M VND/month
    features: [
      "Aggregated search trends",
      "District-level demand",
      "Monthly reports",
      "Top 10 search terms",
    ],
    dataPoints: 1000,
  },
  professional: {
    id: "professional",
    name: "Professional Intent Data",
    price: 30_000_000, // 30M VND/month
    features: [
      "All Basic features",
      "Real-time intent signals",
      "Segment breakdown",
      "Budget distribution",
      "Weekly reports",
      "API access (1000 calls/month)",
    ],
    dataPoints: 5000,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise Intent Data",
    price: 100_000_000, // 100M VND/month
    features: [
      "All Professional features",
      "Raw anonymized data export",
      "Custom segments",
      "Predictive analytics",
      "Daily reports",
      "Unlimited API access",
      "Dedicated analyst support",
    ],
    dataPoints: "unlimited",
  },
};

// GET /api/v1/intent-data - Get intent data or packages
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "packages";
  const district = searchParams.get("district");
  const period = searchParams.get("period") || "7d"; // 7d, 30d, 90d

  // Public packages info
  if (type === "packages") {
    return NextResponse.json({
      packages: Object.values(DATA_PACKAGES),
      useCases: [
        {
          title: "Nghiên cứu thị trường",
          description: "Hiểu nhu cầu thực của người mua",
          icon: "chart",
        },
        {
          title: "Định giá sản phẩm",
          description: "Điều chỉnh giá theo demand",
          icon: "dollar",
        },
        {
          title: "Marketing targeting",
          description: "Nhắm đúng đối tượng khách hàng",
          icon: "target",
        },
        {
          title: "Phát triển sản phẩm",
          description: "Thiết kế sản phẩm theo nhu cầu",
          icon: "lightbulb",
        },
      ],
      sampleMetrics: {
        searchVolume: "50,000+ searches/month",
        coverage: "15 quận TP.HCM",
        accuracy: "95% intent prediction",
        updateFrequency: "Real-time",
      },
    });
  }

  // Intent report (requires auth)
  if (type === "report") {
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Purchase a data package to access reports." },
        { status: 401 }
      );
    }

    const report = generateIntentReport(district, period);
    return NextResponse.json({ report });
  }

  // Real-time signals (premium)
  if (type === "signals") {
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const signals = generateIntentSignals(district);
    return NextResponse.json({
      signals,
      generatedAt: new Date().toISOString(),
      nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
  }

  // Search trends
  if (type === "trends") {
    const trends = generateSearchTrends(district);
    return NextResponse.json({ trends });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

// POST /api/v1/intent-data - Record intent (internal use)
export async function POST(request: NextRequest) {
  // This would be called by frontend to track user behavior
  // In production, validate and store anonymized data

  const body = await request.json();
  const { eventType, data } = body;

  // Validate event type
  const validEvents = ["search", "view", "save", "compare", "contact"];
  if (!validEvents.includes(eventType)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  // In production: anonymize and store
  return NextResponse.json({
    success: true,
    recorded: true,
    timestamp: new Date().toISOString(),
  });
}

function generateIntentReport(district: string | null, period: string): IntentReport {
  const districts = district
    ? [district]
    : ["Quận 2", "Quận 7", "Thủ Đức", "Bình Thạnh", "Quận 1"];

  const periodDays = period === "7d" ? 7 : period === "30d" ? 30 : 90;

  return {
    period: `${periodDays} ngày gần nhất`,
    district: district || undefined,
    summary: {
      totalSearches: 15000 + Math.floor(Math.random() * 5000),
      uniqueVisitors: 8000 + Math.floor(Math.random() * 2000),
      avgIntentScore: 65 + Math.floor(Math.random() * 20),
      topSegment: "investor",
    },
    trends: {
      searchVolume: Array.from({ length: periodDays > 30 ? 12 : 7 }, (_, i) => ({
        period: `Day ${i + 1}`,
        value: 500 + Math.floor(Math.random() * 300),
      })),
      intentScore: Array.from({ length: periodDays > 30 ? 12 : 7 }, (_, i) => ({
        period: `Day ${i + 1}`,
        value: 60 + Math.floor(Math.random() * 25),
      })),
    },
    topSearchTerms: [
      { term: "căn hộ Quận 2", count: 2500, growth: "+15%" },
      { term: "Vinhomes", count: 2100, growth: "+8%" },
      { term: "căn hộ dưới 3 tỷ", count: 1800, growth: "+22%" },
      { term: "căn hộ 2 phòng ngủ", count: 1500, growth: "+5%" },
      { term: "Thủ Đức", count: 1300, growth: "+18%" },
      { term: "Masterise", count: 1100, growth: "+12%" },
      { term: "căn hộ gần metro", count: 950, growth: "+35%" },
      { term: "căn hộ view sông", count: 800, growth: "+10%" },
    ],
    demandByDistrict: districts.map((d) => ({
      district: d,
      demand: 70 + Math.floor(Math.random() * 25),
      growth: `${Math.random() > 0.3 ? "+" : "-"}${(Math.random() * 15).toFixed(1)}%`,
    })),
    budgetDistribution: [
      { range: "Dưới 2 tỷ", percentage: 15 },
      { range: "2-3 tỷ", percentage: 25 },
      { range: "3-5 tỷ", percentage: 35 },
      { range: "5-10 tỷ", percentage: 18 },
      { range: "Trên 10 tỷ", percentage: 7 },
    ],
    insights: [
      "Nhu cầu căn hộ gần metro tăng 35% - cơ hội cho dự án tuyến metro",
      "Phân khúc 3-5 tỷ chiếm tỷ trọng lớn nhất (35%)",
      "Quận 2 và Thủ Đức có intent score cao nhất",
      "Từ khóa 'dưới 3 tỷ' tăng mạnh - demand phân khúc affordable",
      "Investor chiếm 45% tổng buyer intent",
    ],
  };
}

function generateIntentSignals(district: string | null): IntentDataPoint[] {
  const districts = district
    ? [district]
    : ["Quận 2", "Quận 7", "Thủ Đức", "Bình Thạnh"];

  return Array.from({ length: 10 }, (_, i) => ({
    id: `signal_${Date.now()}_${i}`,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    location: {
      district: districts[Math.floor(Math.random() * districts.length)],
      city: "TP. Hồ Chí Minh",
    },
    behavior: {
      searchQueries: ["căn hộ 2PN", "view sông", "gần metro"],
      viewedProjects: 5 + Math.floor(Math.random() * 10),
      savedProjects: Math.floor(Math.random() * 5),
      comparedProjects: Math.floor(Math.random() * 3),
      timeSpent: 10 + Math.floor(Math.random() * 30),
      returnVisits: Math.floor(Math.random() * 5),
    },
    intent: {
      signal: (["high", "medium", "low"] as IntentSignal[])[Math.floor(Math.random() * 3)],
      score: 50 + Math.floor(Math.random() * 45),
      segment: (["investor", "end_user", "first_time", "upgrade"] as BuyerSegment[])[
        Math.floor(Math.random() * 4)
      ],
      budgetRange: {
        min: 2_000_000_000 + Math.floor(Math.random() * 3) * 1_000_000_000,
        max: 5_000_000_000 + Math.floor(Math.random() * 5) * 1_000_000_000,
      },
      timeline: ["immediate", "1-3 months", "3-6 months", "exploring"][
        Math.floor(Math.random() * 4)
      ],
    },
    isAnonymized: true,
  }));
}

function generateSearchTrends(district: string | null) {
  return {
    trending: [
      { term: "căn hộ gần metro", change: "+35%", volume: 950 },
      { term: "căn hộ dưới 3 tỷ", change: "+22%", volume: 1800 },
      { term: "Thủ Đức", change: "+18%", volume: 1300 },
    ],
    declining: [
      { term: "biệt thự", change: "-12%", volume: 200 },
      { term: "đất nền", change: "-8%", volume: 350 },
    ],
    emerging: [
      { term: "smart home", change: "new", volume: 150 },
      { term: "căn hộ xanh", change: "new", volume: 120 },
    ],
  };
}
