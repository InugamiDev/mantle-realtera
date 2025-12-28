import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";

// Subscription Plans API
// Early access and premium subscription management

export type PlanTier = "free" | "pro" | "enterprise";
export type BillingCycle = "monthly" | "yearly";

interface SubscriptionPlan {
  tier: PlanTier;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  limits: {
    projectViews: number | "unlimited";
    savedProjects: number | "unlimited";
    alerts: number | "unlimited";
    reports: number;
    apiCalls: number | "unlimited";
  };
  highlighted?: boolean;
}

interface UserSubscription {
  id: string;
  userId: string;
  plan: PlanTier;
  billingCycle: BillingCycle;
  status: "active" | "canceled" | "past_due" | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
}

// Subscription plans
const PLANS: Record<PlanTier, SubscriptionPlan> = {
  free: {
    tier: "free",
    name: "Miễn phí",
    description: "Trải nghiệm cơ bản RealTera",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "Xem bảng xếp hạng dự án",
      "Xem thông tin chủ đầu tư",
      "3 dự án trong watchlist",
      "Công cụ tính toán cơ bản",
      "Cảnh báo giới hạn",
    ],
    limits: {
      projectViews: 20,
      savedProjects: 3,
      alerts: 5,
      reports: 0,
      apiCalls: 0,
    },
  },
  pro: {
    tier: "pro",
    name: "Pro",
    description: "Cho nhà đầu tư cá nhân nghiêm túc",
    priceMonthly: 199_000,
    priceYearly: 1_990_000, // ~17% off
    features: [
      "Tất cả tính năng Free",
      "Xem không giới hạn dự án",
      "50 dự án trong watchlist",
      "Cảnh báo không giới hạn",
      "So sánh dự án (tối đa 5)",
      "Portfolio tracker",
      "Báo cáo cơ bản miễn phí (1/tháng)",
      "Ưu tiên hỗ trợ",
      "Early access tính năng mới",
    ],
    limits: {
      projectViews: "unlimited",
      savedProjects: 50,
      alerts: "unlimited",
      reports: 1,
      apiCalls: 0,
    },
    highlighted: true,
  },
  enterprise: {
    tier: "enterprise",
    name: "Enterprise",
    description: "Cho doanh nghiệp và đội ngũ",
    priceMonthly: 2_990_000,
    priceYearly: 29_900_000, // ~17% off
    features: [
      "Tất cả tính năng Pro",
      "API access không giới hạn",
      "White-label widgets",
      "Báo cáo toàn diện (2/tháng)",
      "Market data exports",
      "Dedicated account manager",
      "Custom integrations",
      "Team management (5 seats)",
      "SLA 99.9% uptime",
      "Priority support 24/7",
    ],
    limits: {
      projectViews: "unlimited",
      savedProjects: "unlimited",
      alerts: "unlimited",
      reports: 2,
      apiCalls: "unlimited",
    },
  },
};

// GET /api/v1/subscriptions - Get plans and user subscription
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeUser = searchParams.get("includeUser") === "true";

  const response: {
    plans: SubscriptionPlan[];
    currentSubscription?: UserSubscription | null;
    features?: Record<string, boolean>;
  } = {
    plans: Object.values(PLANS),
  };

  if (includeUser) {
    const stackUser = await stackServerApp.getUser();
    const { siweSession } = await getSessionInfo();
    const user = await getUnifiedUser(stackUser, siweSession);

    if (user) {
      // In production, fetch from database
      // For now, mock as free tier
      response.currentSubscription = {
        id: `sub_${user.id}`,
        userId: user.id,
        plan: "free",
        billingCycle: "monthly",
        status: "active",
        currentPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
      };

      // Feature flags based on plan
      const plan = PLANS[response.currentSubscription.plan];
      response.features = {
        unlimitedViews: plan.limits.projectViews === "unlimited",
        portfolioTracker: response.currentSubscription.plan !== "free",
        apiAccess: response.currentSubscription.plan === "enterprise",
        compareProjects: response.currentSubscription.plan !== "free",
        prioritySupport: response.currentSubscription.plan !== "free",
        whiteLabel: response.currentSubscription.plan === "enterprise",
      };
    } else {
      response.currentSubscription = null;
    }
  }

  return NextResponse.json(response, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}

// POST /api/v1/subscriptions - Create or update subscription
export async function POST(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { plan, billingCycle } = body;

  if (!plan || !["free", "pro", "enterprise"].includes(plan)) {
    return NextResponse.json(
      { error: "Invalid plan. Use: free, pro, enterprise" },
      { status: 400 }
    );
  }

  if (plan !== "free" && !["monthly", "yearly"].includes(billingCycle)) {
    return NextResponse.json(
      { error: "billingCycle required for paid plans" },
      { status: 400 }
    );
  }

  const selectedPlan = PLANS[plan as PlanTier];
  const price = billingCycle === "yearly" ? selectedPlan.priceYearly : selectedPlan.priceMonthly;

  // Free plan - just update user
  if (plan === "free") {
    return NextResponse.json({
      success: true,
      subscription: {
        plan: "free",
        status: "active",
        message: "Đã chuyển về gói miễn phí",
      },
    });
  }

  // Paid plan - create Stripe checkout session
  // In production, this would create actual Stripe session

  return NextResponse.json({
    success: true,
    checkout: {
      plan,
      billingCycle,
      amount: price,
      currency: "VND",
      checkoutUrl: `/checkout/subscription?plan=${plan}&billing=${billingCycle}`,
    },
    trial: {
      available: true,
      days: 7,
      message: "Dùng thử 7 ngày miễn phí, hủy bất cứ lúc nào",
    },
  });
}

// PATCH /api/v1/subscriptions - Update subscription (cancel, reactivate)
export async function PATCH(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;

  switch (action) {
    case "cancel":
      // In production, cancel at period end via Stripe
      return NextResponse.json({
        success: true,
        message: "Subscription will be canceled at period end",
        cancelAtPeriodEnd: true,
      });

    case "reactivate":
      // In production, reactivate via Stripe
      return NextResponse.json({
        success: true,
        message: "Subscription reactivated",
        cancelAtPeriodEnd: false,
      });

    case "change_billing":
      const { billingCycle } = body;
      if (!["monthly", "yearly"].includes(billingCycle)) {
        return NextResponse.json({ error: "Invalid billing cycle" }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: `Billing changed to ${billingCycle}`,
        effectiveDate: new Date().toISOString(),
      });

    default:
      return NextResponse.json(
        { error: "Invalid action. Use: cancel, reactivate, change_billing" },
        { status: 400 }
      );
  }
}

// DELETE /api/v1/subscriptions - Immediately cancel (with refund consideration)
export async function DELETE(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In production:
  // 1. Check refund eligibility
  // 2. Cancel via Stripe
  // 3. Update database

  return NextResponse.json({
    success: true,
    message: "Subscription canceled immediately",
    refund: {
      eligible: true,
      amount: 0, // Prorated amount
      reason: "Within trial period / prorated refund",
    },
  });
}
