import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";
import { mockProjects } from "@/data/mockProjects";
import { validateBody, leadSubmitSchema, ValidationError, sanitizeString } from "@/lib/validations";

// Lead Generation API
// Connect verified developers with serious buyers

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
export type LeadSource = "website" | "referral" | "campaign" | "organic";
export type BuyerIntent = "immediate" | "3_months" | "6_months" | "exploring";

interface BuyerLead {
  id: string;
  // Buyer info
  name: string;
  email: string;
  phone?: string;
  // Intent
  intent: BuyerIntent;
  budget: {
    min: number;
    max: number;
  };
  preferences: {
    districts: string[];
    minArea?: number;
    maxArea?: number;
    bedrooms?: number;
    minTier?: string;
  };
  // Tracking
  interestedProjects: string[];
  source: LeadSource;
  status: LeadStatus;
  score: number; // 0-100 lead quality
  createdAt: string;
  lastActivityAt: string;
  notes?: string;
}

interface LeadPackage {
  id: string;
  name: string;
  price: number;
  leadsPerMonth: number;
  features: string[];
  targetAudience: string;
}

// Lead packages for developers
const LEAD_PACKAGES: LeadPackage[] = [
  {
    id: "starter",
    name: "Starter",
    price: 5_000_000, // 5M VND/month
    leadsPerMonth: 10,
    features: [
      "10 leads/tháng",
      "Thông tin cơ bản",
      "Email support",
    ],
    targetAudience: "Dự án nhỏ, CĐT mới",
  },
  {
    id: "growth",
    name: "Growth",
    price: 15_000_000, // 15M VND/month
    leadsPerMonth: 30,
    features: [
      "30 leads/tháng",
      "Thông tin chi tiết + điểm lead",
      "Lọc theo ngân sách & khu vực",
      "Priority support",
      "Dashboard analytics",
    ],
    targetAudience: "CĐT trung bình",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 50_000_000, // 50M VND/month
    leadsPerMonth: 100,
    features: [
      "Unlimited leads",
      "Exclusive leads (không chia sẻ)",
      "Real-time notifications",
      "CRM integration",
      "Dedicated account manager",
      "Custom targeting",
      "Lead nurturing automation",
    ],
    targetAudience: "CĐT lớn, dự án cao cấp",
  },
];

// Mock leads
const mockLeads: BuyerLead[] = [
  {
    id: "lead_1",
    name: "Nguyễn Văn A",
    email: "nva@example.com",
    phone: "0901234567",
    intent: "immediate",
    budget: { min: 3_000_000_000, max: 5_000_000_000 },
    preferences: {
      districts: ["Quận 2", "Thủ Đức"],
      minArea: 70,
      maxArea: 100,
      bedrooms: 2,
      minTier: "A",
    },
    interestedProjects: ["vinhomes-grand-park", "masteri-thao-dien"],
    source: "website",
    status: "new",
    score: 85,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "lead_2",
    name: "Trần Thị B",
    email: "ttb@example.com",
    intent: "3_months",
    budget: { min: 5_000_000_000, max: 8_000_000_000 },
    preferences: {
      districts: ["Quận 7"],
      minArea: 90,
      bedrooms: 3,
      minTier: "S",
    },
    interestedProjects: ["the-global-city"],
    source: "referral",
    status: "qualified",
    score: 92,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivityAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    notes: "Đã tư vấn, quan tâm căn góc view sông",
  },
];

// GET /api/v1/leads - Get leads or packages info
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "packages"; // packages, leads, stats
  const developerSlug = searchParams.get("developer");

  // Public packages info
  if (type === "packages") {
    return NextResponse.json({
      packages: LEAD_PACKAGES,
      benefits: [
        "Leads đã được xác minh và chấm điểm",
        "Chỉ buyer có ngân sách thực",
        "Matching thông minh theo dự án",
        "ROI trung bình 10x",
      ],
      howItWorks: [
        { step: 1, title: "Đăng ký gói", description: "Chọn gói phù hợp với quy mô dự án" },
        { step: 2, title: "Thiết lập targeting", description: "Định nghĩa buyer lý tưởng" },
        { step: 3, title: "Nhận leads", description: "Leads được gửi qua email và dashboard" },
        { step: 4, title: "Chốt deal", description: "Liên hệ và convert leads" },
      ],
      stats: {
        totalLeads: 1250,
        avgConversionRate: "12%",
        avgDealValue: "4.5 tỷ VND",
        satisfactionRate: "94%",
      },
    });
  }

  // Developer's leads (requires auth)
  if (type === "leads") {
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Filter by developer if specified
    let leads = mockLeads;
    if (developerSlug) {
      const devProjects = mockProjects
        .filter((p) => p.developer.slug === developerSlug)
        .map((p) => p.slug);
      leads = leads.filter((l) =>
        l.interestedProjects.some((p) => devProjects.includes(p))
      );
    }

    return NextResponse.json({
      leads,
      summary: {
        total: leads.length,
        new: leads.filter((l) => l.status === "new").length,
        qualified: leads.filter((l) => l.status === "qualified").length,
        avgScore: Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length),
      },
    });
  }

  // Lead stats for developers
  if (type === "stats") {
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      thisMonth: {
        received: 15,
        contacted: 12,
        qualified: 8,
        converted: 2,
        conversionRate: "13.3%",
      },
      lastMonth: {
        received: 18,
        contacted: 16,
        qualified: 10,
        converted: 3,
        conversionRate: "16.7%",
      },
      topSources: [
        { source: "website", count: 45, conversion: "15%" },
        { source: "referral", count: 28, conversion: "22%" },
        { source: "campaign", count: 15, conversion: "8%" },
      ],
      leadQuality: {
        high: 35,
        medium: 42,
        low: 23,
      },
    });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

// POST /api/v1/leads - Submit buyer interest (public)
export async function POST(request: NextRequest) {
  // Parse and validate request body
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, email, phone, intent, budget, preferences, interestedProjects, source } = body;

  // Validate required fields
  if (!name || typeof name !== "string" || name.trim().length < 1 || name.length > 100) {
    return NextResponse.json(
      { error: "name is required and must be 1-100 characters" },
      { status: 400 }
    );
  }

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { error: "email is required" },
      { status: 400 }
    );
  }

  // Validate email format with stricter regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email) || email.length > 255) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  // Validate phone if provided
  if (phone && (typeof phone !== "string" || !/^\+?[0-9]{10,15}$/.test(phone))) {
    return NextResponse.json({ error: "Invalid phone format" }, { status: 400 });
  }

  // Validate intent
  const validIntents: BuyerIntent[] = ["immediate", "3_months", "6_months", "exploring"];
  if (!intent || !validIntents.includes(intent)) {
    return NextResponse.json(
      { error: `intent must be one of: ${validIntents.join(", ")}` },
      { status: 400 }
    );
  }

  // Validate budget
  if (!budget || typeof budget !== "object" || typeof budget.min !== "number" || typeof budget.max !== "number") {
    return NextResponse.json(
      { error: "budget must have min and max numbers" },
      { status: 400 }
    );
  }

  if (budget.min < 0 || budget.max < budget.min || budget.max > 999999999999) {
    return NextResponse.json(
      { error: "Invalid budget range" },
      { status: 400 }
    );
  }

  // Sanitize string inputs
  const sanitizedName = sanitizeString(name);

  // Calculate lead score
  let score = 50;
  if (intent === "immediate") score += 30;
  else if (intent === "3_months") score += 20;
  else if (intent === "6_months") score += 10;

  if (budget.min >= 5_000_000_000) score += 15;
  else if (budget.min >= 3_000_000_000) score += 10;

  if (phone) score += 5;
  if (preferences?.districts?.length) score += 5;
  if (interestedProjects?.length) score += 5;

  const newLead: BuyerLead = {
    id: `lead_${Date.now()}`,
    name: sanitizedName,
    email: email.toLowerCase().trim(),
    phone,
    intent,
    budget,
    preferences: preferences || {},
    interestedProjects: interestedProjects || [],
    source: source || "website",
    status: "new",
    score: Math.min(100, score),
    createdAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
  };

  // In production: save to database, notify matching developers

  return NextResponse.json({
    success: true,
    message: "Cảm ơn bạn đã đăng ký. Chúng tôi sẽ liên hệ trong 24h.",
    leadId: newLead.id,
    matchedProjects: findMatchingProjects(newLead),
  });
}

// PATCH /api/v1/leads - Update lead status (developer only)
export async function PATCH(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { leadId, status, notes } = body;

  if (!leadId || !status) {
    return NextResponse.json({ error: "leadId and status required" }, { status: 400 });
  }

  const validStatuses: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Use: ${validStatuses.join(", ")}` },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    updated: {
      leadId,
      status,
      notes,
      updatedAt: new Date().toISOString(),
    },
  });
}

function findMatchingProjects(lead: BuyerLead): { slug: string; name: string; matchScore: number }[] {
  return mockProjects
    .filter((p) => {
      // Filter by district preference
      if (lead.preferences.districts?.length) {
        if (!lead.preferences.districts.includes(p.district)) return false;
      }
      // Filter by tier preference
      if (lead.preferences.minTier) {
        const tiers = ["SSS", "S+", "S", "A", "B", "C", "D", "F"];
        const minIndex = tiers.indexOf(lead.preferences.minTier);
        const projIndex = tiers.indexOf(p.tier);
        if (projIndex > minIndex) return false;
      }
      return true;
    })
    .slice(0, 5)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      matchScore: 70 + Math.floor(Math.random() * 25),
    }));
}
