import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";
import { mockProjects } from "@/data/mockProjects";

// Due Diligence Reports API
// Paid reports with detailed analysis for projects

export type ReportType = "basic" | "standard" | "comprehensive";

interface ReportSection {
  title: string;
  included: boolean;
}

interface Report {
  id: string;
  projectSlug: string;
  type: ReportType;
  status: "pending" | "generating" | "ready" | "expired";
  requestedAt: string;
  completedAt?: string;
  expiresAt?: string;
  downloadUrl?: string;
  pageCount?: number;
}

// Report pricing and contents
const REPORT_TYPES = {
  basic: {
    price: 500_000, // 500k VND
    name: "Báo cáo Cơ bản",
    description: "Tổng quan dự án và phân tích cơ bản",
    deliveryTime: "Ngay lập tức",
    pageCount: 8,
    sections: [
      { title: "Tổng quan dự án", included: true },
      { title: "Thông tin chủ đầu tư", included: true },
      { title: "Vị trí & Tiện ích", included: true },
      { title: "Phân tích tier RealTera", included: true },
      { title: "Pháp lý cơ bản", included: true },
      { title: "So sánh giá thị trường", included: false },
      { title: "Phân tích rủi ro", included: false },
      { title: "Dự báo tăng giá", included: false },
      { title: "Tư vấn đầu tư", included: false },
    ] as ReportSection[],
  },
  standard: {
    price: 2_000_000, // 2M VND
    name: "Báo cáo Tiêu chuẩn",
    description: "Phân tích chi tiết với so sánh thị trường",
    deliveryTime: "24 giờ",
    pageCount: 25,
    sections: [
      { title: "Tổng quan dự án", included: true },
      { title: "Thông tin chủ đầu tư", included: true },
      { title: "Vị trí & Tiện ích", included: true },
      { title: "Phân tích tier RealTera", included: true },
      { title: "Pháp lý chi tiết", included: true },
      { title: "So sánh giá thị trường", included: true },
      { title: "Phân tích rủi ro", included: true },
      { title: "Dự báo tăng giá", included: false },
      { title: "Tư vấn đầu tư cá nhân", included: false },
    ] as ReportSection[],
  },
  comprehensive: {
    price: 10_000_000, // 10M VND
    name: "Báo cáo Toàn diện",
    description: "Phân tích chuyên sâu với tư vấn cá nhân",
    deliveryTime: "3-5 ngày",
    pageCount: 50,
    sections: [
      { title: "Tổng quan dự án", included: true },
      { title: "Thông tin chủ đầu tư chi tiết", included: true },
      { title: "Vị trí & Tiện ích", included: true },
      { title: "Phân tích tier RealTera", included: true },
      { title: "Pháp lý toàn diện", included: true },
      { title: "So sánh giá thị trường", included: true },
      { title: "Phân tích rủi ro chi tiết", included: true },
      { title: "Dự báo tăng giá 1-5 năm", included: true },
      { title: "Tư vấn đầu tư cá nhân", included: true },
      { title: "Phân tích tiến độ xây dựng", included: true },
      { title: "Phỏng vấn cư dân hiện hữu", included: true },
      { title: "Đánh giá quản lý vận hành", included: true },
    ] as ReportSection[],
  },
};

// Mock user reports
const mockUserReports: Report[] = [];

// GET /api/v1/reports - Get report types and pricing
// GET /api/v1/reports?projectSlug=xxx - Get available reports for project
// GET /api/v1/reports?mine=true - Get user's purchased reports
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectSlug = searchParams.get("projectSlug");
  const mine = searchParams.get("mine") === "true";

  // User's purchased reports
  if (mine) {
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In production, fetch from database
    return NextResponse.json({
      reports: mockUserReports.filter((r) => r.status === "ready"),
      pending: mockUserReports.filter((r) => r.status === "pending" || r.status === "generating"),
    });
  }

  // Project-specific reports
  if (projectSlug) {
    const project = mockProjects.find((p) => p.slug === projectSlug);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      project: {
        slug: project.slug,
        name: project.name,
        tier: project.tier,
        developer: project.developer.slug,
      },
      availableReports: Object.entries(REPORT_TYPES).map(([type, info]) => ({
        type,
        ...info,
        includedSections: info.sections.filter((s) => s.included).length,
        totalSections: info.sections.length,
      })),
      recommendation: project.score >= 85 ? "basic" : project.score >= 70 ? "standard" : "comprehensive",
      recommendationReason:
        project.score >= 85
          ? "Dự án tier cao, báo cáo cơ bản đủ để xác nhận"
          : project.score >= 70
            ? "Nên xem xét chi tiết với báo cáo tiêu chuẩn"
            : "Khuyến nghị báo cáo toàn diện để đánh giá rủi ro",
    });
  }

  // General pricing info
  return NextResponse.json({
    reportTypes: Object.entries(REPORT_TYPES).map(([type, info]) => ({
      type,
      name: info.name,
      price: info.price,
      description: info.description,
      deliveryTime: info.deliveryTime,
      pageCount: info.pageCount,
      sections: info.sections,
    })),
    features: [
      "Phân tích độc lập, không thiên vị",
      "Dữ liệu từ 50+ nguồn xác minh",
      "Được thực hiện bởi chuyên gia BĐS",
      "Cập nhật mới nhất",
    ],
    guarantee: "Hoàn tiền 100% nếu không hài lòng trong 7 ngày",
  });
}

// POST /api/v1/reports - Purchase a report
export async function POST(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { projectSlug, type } = body;

  if (!projectSlug || !type) {
    return NextResponse.json(
      { error: "projectSlug and type required" },
      { status: 400 }
    );
  }

  if (!["basic", "standard", "comprehensive"].includes(type)) {
    return NextResponse.json(
      { error: "Invalid type. Use: basic, standard, comprehensive" },
      { status: 400 }
    );
  }

  const project = mockProjects.find((p) => p.slug === projectSlug);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const reportType = REPORT_TYPES[type as ReportType];

  // Create report request
  const report: Report = {
    id: `rpt_${Date.now()}`,
    projectSlug,
    type: type as ReportType,
    status: type === "basic" ? "ready" : "pending",
    requestedAt: new Date().toISOString(),
    completedAt: type === "basic" ? new Date().toISOString() : undefined,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    downloadUrl: type === "basic" ? `/api/v1/reports/${projectSlug}/download?id=rpt_${Date.now()}` : undefined,
    pageCount: reportType.pageCount,
  };

  // In production:
  // 1. Create Stripe checkout session
  // 2. After payment, generate or queue report
  // 3. Send email when ready

  return NextResponse.json({
    success: true,
    report,
    payment: {
      amount: reportType.price,
      currency: "VND",
      checkoutUrl: `/checkout/report?reportId=${report.id}`,
    },
    estimatedDelivery: reportType.deliveryTime,
  });
}

// GET /api/v1/reports/[projectSlug]/sample - Get sample report
export async function OPTIONS() {
  return NextResponse.json({
    sampleReports: [
      {
        projectSlug: "sample-project",
        type: "basic",
        previewUrl: "/samples/report-basic-preview.pdf",
        fullSampleUrl: "/samples/report-basic-full.pdf",
      },
    ],
    note: "Sample reports are anonymized versions of real reports",
  });
}
