import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";
import { mockProjects, developers } from "@/data/mockProjects";
import { TIER_ORDER } from "@/lib/tier";

// Quarterly Market Reports API
// Automated market intelligence reports

export type ReportPeriod = "Q1" | "Q2" | "Q3" | "Q4";
export type ReportScope = "city" | "district" | "segment";

interface MarketReport {
  id: string;
  title: string;
  period: ReportPeriod;
  year: number;
  scope: ReportScope;
  scopeValue: string; // e.g., "TP. Hồ Chí Minh", "Quận 2", "Luxury"
  publishedAt: string;
  summary: string;
  highlights: string[];
  sections: ReportSection[];
  downloadUrl?: string;
  isPremium: boolean;
}

interface ReportSection {
  title: string;
  content: string;
  data?: Record<string, unknown>;
  charts?: string[];
}

// Mock reports
const MARKET_REPORTS: Omit<MarketReport, "sections">[] = [
  {
    id: "q4_2024_hcm",
    title: "Báo cáo Thị trường BĐS TP.HCM Q4/2024",
    period: "Q4",
    year: 2024,
    scope: "city",
    scopeValue: "TP. Hồ Chí Minh",
    publishedAt: "2025-01-15",
    summary: "Thị trường BĐS TP.HCM Q4/2024 ghi nhận sự phục hồi tích cực với giá tăng 7% so với quý trước.",
    highlights: [
      "Giá căn hộ tăng trung bình 7% QoQ",
      "Giao dịch tăng 15% so với Q3",
      "Phân khúc cao cấp dẫn đầu tăng trưởng",
      "Metro Line 1 thúc đẩy giá khu vực Quận 2, Thủ Đức",
    ],
    isPremium: false,
  },
  {
    id: "q4_2024_q2",
    title: "Báo cáo Thị trường Quận 2 Q4/2024",
    period: "Q4",
    year: 2024,
    scope: "district",
    scopeValue: "Quận 2",
    publishedAt: "2025-01-20",
    summary: "Quận 2 tiếp tục là điểm nóng đầu tư với giá tăng 12% YoY nhờ hạ tầng Metro.",
    highlights: [
      "Giá tăng 12% YoY, dẫn đầu TP.HCM",
      "85% dự án tier S trở lên",
      "Thanh khoản tốt nhất thành phố",
      "Vingroup và Masterise chiếm 60% thị phần",
    ],
    isPremium: true,
  },
  {
    id: "q4_2024_luxury",
    title: "Báo cáo Phân khúc Cao cấp Q4/2024",
    period: "Q4",
    year: 2024,
    scope: "segment",
    scopeValue: "Luxury",
    publishedAt: "2025-01-25",
    summary: "Phân khúc cao cấp (>100 triệu/m²) tăng trưởng 15% với nguồn cầu từ expats và nhà đầu tư.",
    highlights: [
      "Giá trung bình 120 triệu/m²",
      "Tỷ lệ hấp thụ 45% trong quý",
      "Nhu cầu expat tăng 25%",
      "Top dự án: The Opus One, Grand Marina",
    ],
    isPremium: true,
  },
];

// GET /api/v1/market-reports - Get market reports
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get("id");
  const period = searchParams.get("period") as ReportPeriod | null;
  const year = searchParams.get("year");
  const scope = searchParams.get("scope") as ReportScope | null;

  // Single report detail
  if (reportId) {
    const report = MARKET_REPORTS.find((r) => r.id === reportId);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Check premium access
    if (report.isPremium) {
      const stackUser = await stackServerApp.getUser();
      const { siweSession } = await getSessionInfo();
      const user = await getUnifiedUser(stackUser, siweSession);
      if (!user) {
        return NextResponse.json({
          report: {
            ...report,
            sections: [], // Hide content
          },
          requiresPremium: true,
          message: "Đăng ký Pro để xem báo cáo chi tiết",
        });
      }
    }

    // Generate full report with sections
    const fullReport = generateFullReport(report);
    return NextResponse.json({ report: fullReport });
  }

  // Filter reports
  let reports = MARKET_REPORTS;

  if (period) {
    reports = reports.filter((r) => r.period === period);
  }
  if (year) {
    reports = reports.filter((r) => r.year === parseInt(year));
  }
  if (scope) {
    reports = reports.filter((r) => r.scope === scope);
  }

  return NextResponse.json({
    reports: reports.map((r) => ({
      ...r,
      sections: undefined, // Don't include full sections in list
    })),
    availablePeriods: ["Q1", "Q2", "Q3", "Q4"],
    availableYears: [2024, 2023],
    availableScopes: [
      { scope: "city", label: "Theo thành phố" },
      { scope: "district", label: "Theo quận/huyện" },
      { scope: "segment", label: "Theo phân khúc" },
    ],
  });
}

// POST /api/v1/market-reports/generate - Generate custom report (premium)
export async function POST(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { scope, scopeValue, period, year, includeForecasts } = body;

  if (!scope || !scopeValue) {
    return NextResponse.json(
      { error: "scope and scopeValue required" },
      { status: 400 }
    );
  }

  // Generate custom report
  const report = generateCustomReport(scope, scopeValue, period, year, includeForecasts);

  return NextResponse.json({
    success: true,
    report,
    message: "Báo cáo đã được tạo. Bạn có thể tải về trong 24 giờ.",
    estimatedReadyAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  });
}

function generateFullReport(baseReport: Omit<MarketReport, "sections">): MarketReport {
  const sections: ReportSection[] = [
    {
      title: "Tổng quan thị trường",
      content: `Trong ${baseReport.period}/${baseReport.year}, thị trường BĐS ${baseReport.scopeValue} ghi nhận nhiều biến động tích cực. ${baseReport.summary}`,
      data: {
        totalProjects: mockProjects.length,
        avgPrice: "75 triệu/m²",
        priceChange: "+7%",
        transactionVolume: 1250,
      },
    },
    {
      title: "Phân tích giá",
      content: "Giá BĐS tiếp tục xu hướng tăng với tốc độ ổn định. Phân khúc cao cấp dẫn đầu tăng trưởng.",
      data: {
        priceBySegment: {
          luxury: { avg: 120_000_000, change: "+15%" },
          midEnd: { avg: 70_000_000, change: "+8%" },
          affordable: { avg: 40_000_000, change: "+5%" },
        },
      },
    },
    {
      title: "Phân bổ theo tier",
      content: "Chất lượng dự án tiếp tục được cải thiện với tỷ lệ tier S+ trở lên tăng.",
      data: generateTierDistribution(),
    },
    {
      title: "Top chủ đầu tư",
      content: "Các chủ đầu tư lớn tiếp tục dẫn dắt thị trường với danh mục đa dạng.",
      data: {
        leaders: Object.values(developers)
          .slice(0, 5)
          .map((d) => ({
            name: d.name,
            tier: d.tier,
            marketShare: `${10 + Math.floor(Math.random() * 15)}%`,
          })),
      },
    },
    {
      title: "Dự báo",
      content: "Thị trường được dự báo tiếp tục tăng trưởng trong quý tới nhờ hạ tầng và nhu cầu ở thực.",
      data: {
        priceForecast: "+5-8%",
        demandForecast: "Tăng",
        risks: ["Lãi suất", "Pháp lý"],
        opportunities: ["Metro hoàn thành", "Nguồn cung mới"],
      },
    },
  ];

  return {
    ...baseReport,
    sections,
    downloadUrl: `/reports/${baseReport.id}.pdf`,
  };
}

function generateCustomReport(
  scope: ReportScope,
  scopeValue: string,
  period?: ReportPeriod,
  year?: number,
  includeForecasts?: boolean
): MarketReport {
  const currentPeriod = period || "Q4";
  const currentYear = year || 2024;

  return {
    id: `custom_${Date.now()}`,
    title: `Báo cáo ${scope === "city" ? scopeValue : scope === "district" ? `Quận ${scopeValue}` : `Phân khúc ${scopeValue}`} ${currentPeriod}/${currentYear}`,
    period: currentPeriod,
    year: currentYear,
    scope,
    scopeValue,
    publishedAt: new Date().toISOString(),
    summary: `Báo cáo phân tích chi tiết thị trường ${scopeValue} trong ${currentPeriod}/${currentYear}.`,
    highlights: [
      "Phân tích giá chi tiết",
      "So sánh với quý trước",
      "Top dự án và chủ đầu tư",
      includeForecasts ? "Dự báo 6 tháng" : "Xu hướng hiện tại",
    ],
    sections: [
      {
        title: "Tổng quan",
        content: `Phân tích thị trường ${scopeValue}`,
      },
    ],
    isPremium: true,
    downloadUrl: `/reports/custom_${Date.now()}.pdf`,
  };
}

function generateTierDistribution(): Record<string, unknown> {
  const distribution: Record<string, number> = {};
  mockProjects.forEach((p) => {
    distribution[p.tier] = (distribution[p.tier] || 0) + 1;
  });

  return {
    distribution,
    topTier: TIER_ORDER.find((t) => distribution[t] > 0) || "S",
    avgScore: Math.round(mockProjects.reduce((sum, p) => sum + p.score, 0) / mockProjects.length),
  };
}
