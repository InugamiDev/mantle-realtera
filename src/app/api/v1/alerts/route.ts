import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session/unified";

// Alert types for real estate monitoring
export type AlertType =
  | "new_launch"      // New project launches
  | "price_change"    // Price changes on watched projects
  | "tier_change"     // Tier upgrades/downgrades
  | "verification"    // Project verification status changes
  | "developer_news"; // News about watched developers

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  projectSlug?: string;
  developerSlug?: string;
  createdAt: string;
  read: boolean;
}

// Mock alerts for demo
const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "new_launch",
    title: "Dự án mới: The Opus One",
    message: "Masterise Homes vừa ra mắt dự án cao cấp tại Quận 2",
    developerSlug: "masterise",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "2",
    type: "tier_change",
    title: "Thay đổi xếp hạng",
    message: "Vinhomes Grand Park được nâng hạng từ S lên S+",
    projectSlug: "vinhomes-grand-park",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "3",
    type: "price_change",
    title: "Biến động giá",
    message: "Giá căn hộ tại Masteri Thảo Điền tăng 5% trong tháng qua",
    projectSlug: "masteri-thao-dien",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "4",
    type: "verification",
    title: "Xác minh hoàn tất",
    message: "The Global City đã được xác minh bởi RealTera",
    projectSlug: "the-global-city",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

// GET /api/v1/alerts - Get user alerts
export async function GET(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // Filter by type
  const unreadOnly = searchParams.get("unread") === "true";

  let alerts = [...mockAlerts];

  if (type) {
    alerts = alerts.filter((a) => a.type === type);
  }

  if (unreadOnly) {
    alerts = alerts.filter((a) => !a.read);
  }

  // Sort by date, newest first
  alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({
    alerts,
    unreadCount: mockAlerts.filter((a) => !a.read).length,
    total: alerts.length,
  });
}

// POST /api/v1/alerts - Create alert subscription
export async function POST(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, filters } = body;

  // Validate alert type
  const validTypes: AlertType[] = ["new_launch", "price_change", "tier_change", "verification", "developer_news"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid alert type" }, { status: 400 });
  }

  // In production, this would save to database
  // For now, return success
  return NextResponse.json({
    success: true,
    subscription: {
      id: `sub_${Date.now()}`,
      userId: user.id,
      type,
      filters: filters || {},
      createdAt: new Date().toISOString(),
      active: true,
    },
  });
}

// PATCH /api/v1/alerts - Mark alerts as read
export async function PATCH(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  const { siweSession } = await getSessionInfo();
  const user = await getUnifiedUser(stackUser, siweSession);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { alertIds, markAllRead } = body;

  if (markAllRead) {
    // Mark all as read
    return NextResponse.json({
      success: true,
      updatedCount: mockAlerts.filter((a) => !a.read).length,
    });
  }

  if (!alertIds || !Array.isArray(alertIds)) {
    return NextResponse.json({ error: "alertIds required" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    updatedCount: alertIds.length,
  });
}
