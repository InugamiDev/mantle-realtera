import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";

// Verification API - Developer verification requests and status
// This is a paid service for developers to verify their projects

export type VerificationTier = "basic" | "standard" | "premium";
export type VerificationStatus = "pending" | "in_progress" | "approved" | "rejected" | "expired";

interface VerificationRequest {
  id: string;
  projectSlug: string;
  developerSlug: string;
  tier: VerificationTier;
  status: VerificationStatus;
  requestedAt: string;
  completedAt?: string;
  expiresAt?: string;
  documents: string[];
  notes?: string;
}

// Pricing for verification tiers (VND)
const VERIFICATION_PRICING = {
  basic: {
    price: 5_000_000,
    features: ["Basic document verification", "Legal check", "14-day turnaround"],
    validityMonths: 6,
  },
  standard: {
    price: 15_000_000,
    features: [
      "Full document verification",
      "Legal + financial check",
      "Site visit",
      "7-day turnaround",
      "Verification badge",
    ],
    validityMonths: 12,
  },
  premium: {
    price: 50_000_000,
    features: [
      "Comprehensive audit",
      "Legal + financial + construction check",
      "Multiple site visits",
      "Priority 3-day turnaround",
      "Premium verification badge",
      "Quarterly reviews",
      "RealTera featured placement",
    ],
    validityMonths: 24,
  },
};

// Mock verification requests
const mockRequests: VerificationRequest[] = [
  {
    id: "ver_1",
    projectSlug: "vinhomes-grand-park",
    developerSlug: "vingroup",
    tier: "premium",
    status: "approved",
    requestedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 700 * 24 * 60 * 60 * 1000).toISOString(),
    documents: ["legal_docs.pdf", "financial_report.pdf", "construction_permit.pdf"],
  },
  {
    id: "ver_2",
    projectSlug: "masteri-thao-dien",
    developerSlug: "masterise",
    tier: "standard",
    status: "in_progress",
    requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    documents: ["legal_docs.pdf", "bank_guarantee.pdf"],
    notes: "Awaiting site visit scheduling",
  },
];

// GET /api/v1/verification - Get verification info and pricing
// GET /api/v1/verification?projectSlug=xxx - Get verification status for project
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectSlug = searchParams.get("projectSlug");
  const developerSlug = searchParams.get("developerSlug");

  // Public pricing info
  if (!projectSlug && !developerSlug) {
    return NextResponse.json({
      tiers: VERIFICATION_PRICING,
      process: [
        { step: 1, title: "Submit Request", description: "Choose tier and upload documents" },
        { step: 2, title: "Document Review", description: "Our team reviews submitted documents" },
        { step: 3, title: "Site Verification", description: "Physical site visit (Standard/Premium)" },
        { step: 4, title: "Report & Badge", description: "Receive verification report and badge" },
      ],
      benefits: [
        "Increased buyer trust (+40% engagement)",
        "Higher ranking in search results",
        "Verification badge on project page",
        "Detailed verification report",
        "Priority support",
      ],
    });
  }

  // Project-specific verification status
  if (projectSlug) {
    const verification = mockRequests.find((r) => r.projectSlug === projectSlug);

    if (!verification) {
      return NextResponse.json({
        projectSlug,
        verified: false,
        message: "Project has not been verified",
        availableTiers: Object.keys(VERIFICATION_PRICING),
      });
    }

    return NextResponse.json({
      projectSlug,
      verified: verification.status === "approved",
      verification: {
        id: verification.id,
        tier: verification.tier,
        status: verification.status,
        requestedAt: verification.requestedAt,
        completedAt: verification.completedAt,
        expiresAt: verification.expiresAt,
        tierDetails: VERIFICATION_PRICING[verification.tier],
      },
    });
  }

  // Developer's verification requests
  if (developerSlug) {
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = mockRequests.filter((r) => r.developerSlug === developerSlug);

    return NextResponse.json({
      developerSlug,
      requests,
      summary: {
        total: requests.length,
        approved: requests.filter((r) => r.status === "approved").length,
        pending: requests.filter((r) => r.status === "pending" || r.status === "in_progress").length,
      },
    });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

// POST /api/v1/verification - Create new verification request
export async function POST(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { projectSlug, developerSlug, tier, documents } = body;

  // Validate tier
  if (!tier || !["basic", "standard", "premium"].includes(tier)) {
    return NextResponse.json(
      { error: "Invalid tier. Use: basic, standard, premium" },
      { status: 400 }
    );
  }

  if (!projectSlug || !developerSlug) {
    return NextResponse.json(
      { error: "projectSlug and developerSlug required" },
      { status: 400 }
    );
  }

  // In production, this would:
  // 1. Create Stripe checkout session for payment
  // 2. Save request to database after payment
  // 3. Notify verification team

  const newRequest: VerificationRequest = {
    id: `ver_${Date.now()}`,
    projectSlug,
    developerSlug,
    tier,
    status: "pending",
    requestedAt: new Date().toISOString(),
    documents: documents || [],
  };

  const pricing = VERIFICATION_PRICING[tier as VerificationTier];

  return NextResponse.json({
    success: true,
    request: newRequest,
    payment: {
      amount: pricing.price,
      currency: "VND",
      checkoutUrl: `/checkout/verification?requestId=${newRequest.id}`,
    },
    nextSteps: [
      "Complete payment",
      "Upload required documents",
      "Verification team will contact you within 24 hours",
    ],
  });
}

// PATCH /api/v1/verification - Update verification request (admin only)
export async function PATCH(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Check if user is admin
  // For now, mock the update

  const body = await request.json();
  const { requestId, status, notes } = body;

  if (!requestId || !status) {
    return NextResponse.json(
      { error: "requestId and status required" },
      { status: 400 }
    );
  }

  const validStatuses = ["pending", "in_progress", "approved", "rejected", "expired"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Use: ${validStatuses.join(", ")}` },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    updated: {
      requestId,
      status,
      notes,
      updatedAt: new Date().toISOString(),
    },
  });
}
