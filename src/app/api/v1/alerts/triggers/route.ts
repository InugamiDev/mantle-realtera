import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";

// Custom Alert Triggers API
// User-defined conditions for automated alerts

export type TriggerType =
  | "price_threshold"    // Alert when price crosses threshold
  | "tier_change"        // Alert when project tier changes
  | "new_in_district"    // Alert when new project in district
  | "developer_launch"   // Alert when developer launches new project
  | "score_change"       // Alert when score changes by X points
  | "verification"       // Alert when project gets verified
  | "custom";            // Custom expression trigger

export type TriggerCondition = "above" | "below" | "equals" | "changes" | "any";

interface AlertTrigger {
  id: string;
  userId: string;
  name: string;
  type: TriggerType;
  condition: TriggerCondition;
  value?: number | string;
  filters: {
    districts?: string[];
    cities?: string[];
    developers?: string[];
    minTier?: string;
    maxTier?: string;
    projectSlugs?: string[];
  };
  channels: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  active: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
  triggerCount: number;
}

// Trigger templates for quick setup
const TRIGGER_TEMPLATES = {
  price_drop: {
    name: "Giá giảm",
    type: "price_threshold" as TriggerType,
    condition: "below" as TriggerCondition,
    description: "Nhận thông báo khi giá giảm dưới ngưỡng đặt",
    icon: "trending-down",
  },
  new_launch: {
    name: "Dự án mới",
    type: "new_in_district" as TriggerType,
    condition: "any" as TriggerCondition,
    description: "Nhận thông báo khi có dự án mới trong quận/huyện",
    icon: "rocket",
  },
  tier_upgrade: {
    name: "Nâng hạng",
    type: "tier_change" as TriggerType,
    condition: "above" as TriggerCondition,
    description: "Nhận thông báo khi dự án được nâng hạng",
    icon: "arrow-up",
  },
  developer_watch: {
    name: "Theo dõi CĐT",
    type: "developer_launch" as TriggerType,
    condition: "any" as TriggerCondition,
    description: "Nhận thông báo khi chủ đầu tư ra mắt dự án mới",
    icon: "building",
  },
  verification_alert: {
    name: "Xác minh",
    type: "verification" as TriggerType,
    condition: "any" as TriggerCondition,
    description: "Nhận thông báo khi dự án được xác minh",
    icon: "shield-check",
  },
};

// Mock user triggers
const mockTriggers: AlertTrigger[] = [
  {
    id: "trg_1",
    userId: "user_1",
    name: "Giảm giá Quận 2",
    type: "price_threshold",
    condition: "below",
    value: 70000000, // 70M/m2
    filters: {
      districts: ["Quận 2", "Thủ Đức"],
      minTier: "A",
    },
    channels: { email: true, push: true, inApp: true },
    active: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    triggerCount: 3,
  },
  {
    id: "trg_2",
    userId: "user_1",
    name: "Dự án mới Vingroup",
    type: "developer_launch",
    condition: "any",
    filters: {
      developers: ["vingroup"],
    },
    channels: { email: true, push: false, inApp: true },
    active: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastTriggeredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    triggerCount: 1,
  },
];

// GET /api/v1/alerts/triggers - Get user's triggers or templates
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const templates = searchParams.get("templates") === "true";

  // Return templates for creating triggers
  if (templates) {
    return NextResponse.json({
      templates: Object.entries(TRIGGER_TEMPLATES).map(([key, template]) => ({
        key,
        ...template,
      })),
      triggerTypes: [
        { type: "price_threshold", label: "Ngưỡng giá", requiresValue: true },
        { type: "tier_change", label: "Thay đổi tier", requiresValue: false },
        { type: "new_in_district", label: "Dự án mới trong quận", requiresValue: false },
        { type: "developer_launch", label: "CĐT ra mắt mới", requiresValue: false },
        { type: "score_change", label: "Thay đổi điểm", requiresValue: true },
        { type: "verification", label: "Xác minh", requiresValue: false },
      ],
      conditions: [
        { condition: "above", label: "Trên" },
        { condition: "below", label: "Dưới" },
        { condition: "equals", label: "Bằng" },
        { condition: "changes", label: "Thay đổi" },
        { condition: "any", label: "Bất kỳ" },
      ],
    });
  }

  // Get user's triggers
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In production, fetch from database
  const userTriggers = mockTriggers.filter((t) => t.userId === "user_1"); // Mock

  return NextResponse.json({
    triggers: userTriggers,
    summary: {
      total: userTriggers.length,
      active: userTriggers.filter((t) => t.active).length,
      totalTriggered: userTriggers.reduce((sum, t) => sum + t.triggerCount, 0),
    },
    limits: {
      maxTriggers: 10, // Free tier
      used: userTriggers.length,
    },
  });
}

// POST /api/v1/alerts/triggers - Create new trigger
export async function POST(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, type, condition, value, filters, channels, templateKey } = body;

  // If using template, apply defaults
  let triggerConfig = { name, type, condition, value, filters, channels };

  if (templateKey && TRIGGER_TEMPLATES[templateKey as keyof typeof TRIGGER_TEMPLATES]) {
    const template = TRIGGER_TEMPLATES[templateKey as keyof typeof TRIGGER_TEMPLATES];
    triggerConfig = {
      name: name || template.name,
      type: template.type,
      condition: template.condition,
      value,
      filters: filters || {},
      channels: channels || { email: true, push: true, inApp: true },
    };
  }

  // Validate required fields
  if (!triggerConfig.name || !triggerConfig.type) {
    return NextResponse.json(
      { error: "name and type are required" },
      { status: 400 }
    );
  }

  // Check trigger limit
  const userTriggerCount = mockTriggers.filter((t) => t.userId === user.id).length;
  if (userTriggerCount >= 10) {
    return NextResponse.json(
      { error: "Trigger limit reached. Upgrade to Pro for unlimited triggers." },
      { status: 403 }
    );
  }

  const newTrigger: AlertTrigger = {
    id: `trg_${Date.now()}`,
    userId: user.id,
    name: triggerConfig.name,
    type: triggerConfig.type as TriggerType,
    condition: triggerConfig.condition as TriggerCondition || "any",
    value: triggerConfig.value,
    filters: triggerConfig.filters || {},
    channels: triggerConfig.channels || { email: true, push: true, inApp: true },
    active: true,
    createdAt: new Date().toISOString(),
    triggerCount: 0,
  };

  return NextResponse.json({
    success: true,
    trigger: newTrigger,
  });
}

// PATCH /api/v1/alerts/triggers - Update trigger
export async function PATCH(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { triggerId, updates } = body;

  if (!triggerId) {
    return NextResponse.json({ error: "triggerId required" }, { status: 400 });
  }

  // In production, update in database
  const allowedUpdates = ["name", "condition", "value", "filters", "channels", "active"];
  const sanitizedUpdates = Object.fromEntries(
    Object.entries(updates || {}).filter(([key]) => allowedUpdates.includes(key))
  );

  return NextResponse.json({
    success: true,
    updated: {
      triggerId,
      ...sanitizedUpdates,
      updatedAt: new Date().toISOString(),
    },
  });
}

// DELETE /api/v1/alerts/triggers - Delete trigger
export async function DELETE(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const triggerId = searchParams.get("triggerId");

  if (!triggerId) {
    return NextResponse.json({ error: "triggerId required" }, { status: 400 });
  }

  // In production, delete from database

  return NextResponse.json({
    success: true,
    deleted: triggerId,
  });
}
