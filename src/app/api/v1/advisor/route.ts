import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { TIERS, TIER_ORDER } from "@/lib/tier";

// Advisor Chatbot API
// Real estate investment advice and recommendations
// Uses pattern matching and database queries

export type AdvisorIntent =
  | "recommendation"    // Project recommendations
  | "comparison"        // Compare projects
  | "valuation"         // Price estimation
  | "investment"        // Investment advice
  | "market"            // Market insights
  | "developer"         // Developer info
  | "general";          // General questions

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    intent?: AdvisorIntent;
    projects?: string[];
    confidence?: number;
  };
}

interface AdvisorResponse {
  message: string;
  intent: AdvisorIntent;
  suggestions?: string[];
  relatedProjects?: {
    slug: string;
    name: string;
    tier: string;
    reason: string;
  }[];
  followUpQuestions?: string[];
  sources?: string[];
}

// Intent patterns
const INTENT_PATTERNS: Record<AdvisorIntent, RegExp[]> = {
  recommendation: [/recommend|gợi ý|đề xuất|nên mua|phù hợp|tốt nhất/i],
  comparison: [/so sánh|khác nhau|versus|vs|hay là|chọn giữa/i],
  valuation: [/giá|bao nhiêu|định giá|trị giá|m2|mét vuông/i],
  investment: [/đầu tư|roi|lợi nhuận|sinh lời|tăng giá|tiềm năng/i],
  market: [/thị trường|xu hướng|trend|tình hình|dự báo/i],
  developer: [/chủ đầu tư|cđt|developer|vingroup|masterise|novaland/i],
  general: [/.*/],
};

// POST /api/v1/advisor - Chat with advisor
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message, conversationId, context } = body;

  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  // Detect intent
  const intent = detectIntent(message);

  // Generate response using pattern matching and database
  const response = await generateResponse(message, intent, context);

  return NextResponse.json({
    conversationId: conversationId || `conv_${Date.now()}`,
    response,
    usage: {
      questionsToday: 5,
      limit: 10, // Free tier
      remaining: 5,
    },
  });
}

// GET /api/v1/advisor - Get advisor info and suggested questions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  // Get conversation history
  if (conversationId) {
    return NextResponse.json({
      conversationId,
      messages: [],
      createdAt: new Date().toISOString(),
    });
  }

  // Return advisor info
  return NextResponse.json({
    name: "RealTera Advisor",
    capabilities: [
      "Gợi ý dự án phù hợp với ngân sách và nhu cầu",
      "So sánh các dự án BĐS",
      "Phân tích tiềm năng đầu tư",
      "Thông tin chủ đầu tư",
      "Xu hướng thị trường",
      "Định giá căn hộ",
    ],
    suggestedQuestions: [
      "Dự án nào tốt nhất ở Quận 2 dưới 5 tỷ?",
      "So sánh Vinhomes Grand Park và Masteri Thảo Điền",
      "Vingroup có bao nhiêu dự án?",
      "Thị trường BĐS Q4/2024 như thế nào?",
      "Đầu tư căn hộ Quận 7 có tốt không?",
      "Giá căn hộ 2PN ở Thủ Đức khoảng bao nhiêu?",
    ],
    limits: {
      free: 10,
      pro: 100,
      enterprise: "unlimited",
    },
  });
}

function detectIntent(message: string): AdvisorIntent {
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (intent === "general") continue;
    if (patterns.some((p) => p.test(message))) {
      return intent as AdvisorIntent;
    }
  }
  return "general";
}

async function generateResponse(
  message: string,
  intent: AdvisorIntent,
  context?: { budget?: number; district?: string; preferences?: string[] }
): Promise<AdvisorResponse> {
  const lowerMessage = message.toLowerCase();

  switch (intent) {
    case "recommendation":
      return generateRecommendation(lowerMessage, context);

    case "comparison":
      return generateComparison(lowerMessage);

    case "valuation":
      return generateValuation(lowerMessage);

    case "investment":
      return generateInvestmentAdvice(lowerMessage);

    case "market":
      return generateMarketInsight(lowerMessage);

    case "developer":
      return generateDeveloperInfo(lowerMessage);

    default:
      return {
        message: "Tôi có thể giúp bạn tìm hiểu về dự án BĐS, so sánh các dự án, hoặc tư vấn đầu tư. Bạn muốn hỏi về vấn đề gì?",
        intent: "general",
        followUpQuestions: [
          "Bạn đang tìm dự án ở khu vực nào?",
          "Ngân sách của bạn khoảng bao nhiêu?",
          "Bạn mua để ở hay đầu tư?",
        ],
      };
  }
}

async function generateRecommendation(message: string, context?: Record<string, unknown>): Promise<AdvisorResponse> {
  // Extract criteria from message
  const districtPatterns = ["quận 2", "quận 7", "thủ đức", "bình thạnh", "quận 9", "quận 1"];
  const matchedDistricts = districtPatterns.filter((d) => message.includes(d));

  // Fetch from database
  const projects = await db.project.findMany({
    take: 10,
    where: matchedDistricts.length > 0
      ? { district: { in: matchedDistricts.map((d) => d.charAt(0).toUpperCase() + d.slice(1)) } }
      : undefined,
    orderBy: { score: "desc" },
    include: { developer: true },
  });

  const recommended = projects.slice(0, 3);

  if (recommended.length === 0) {
    return {
      message: "Không tìm thấy dự án phù hợp với tiêu chí của bạn. Vui lòng thử lại với tiêu chí khác.",
      intent: "recommendation",
      followUpQuestions: [
        "Bạn muốn tìm ở khu vực nào?",
        "Ngân sách của bạn khoảng bao nhiêu?",
      ],
    };
  }

  return {
    message: `Dựa trên tiêu chí của bạn, tôi gợi ý ${recommended.length} dự án sau:\n\n${recommended.map((p, i) => `${i + 1}. **${p.name}** (${p.tier}) - ${p.district}\n   Điểm: ${p.score}/100 | ${TIERS[p.tier as keyof typeof TIERS]?.label || p.tier}`).join("\n\n")}`,
    intent: "recommendation",
    relatedProjects: recommended.map((p) => ({
      slug: p.slug,
      name: p.name,
      tier: p.tier,
      reason: `Tier ${p.tier}, điểm ${p.score}/100`,
    })),
    followUpQuestions: [
      "Bạn muốn biết thêm về dự án nào?",
      "Cần so sánh các dự án này không?",
      "Ngân sách cụ thể của bạn là bao nhiêu?",
    ],
    sources: ["RealTera Database"],
  };
}

async function generateComparison(message: string): Promise<AdvisorResponse> {
  // Fetch top projects for comparison
  const projects = await db.project.findMany({
    take: 2,
    orderBy: { score: "desc" },
    include: { developer: true },
  });

  if (projects.length < 2) {
    return {
      message: "Không đủ dữ liệu để so sánh. Vui lòng thử lại sau.",
      intent: "comparison",
    };
  }

  const [p1, p2] = projects;

  return {
    message: `**So sánh ${p1.name} vs ${p2.name}**\n\n` +
      `| Tiêu chí | ${p1.name} | ${p2.name} |\n` +
      `|----------|------------|------------|\n` +
      `| Tier | ${p1.tier} | ${p2.tier} |\n` +
      `| Điểm | ${p1.score}/100 | ${p2.score}/100 |\n` +
      `| Quận | ${p1.district} | ${p2.district} |\n` +
      `| CĐT | ${p1.developer?.name || "N/A"} | ${p2.developer?.name || "N/A"} |\n\n` +
      `**Kết luận**: ${p1.score > p2.score ? p1.name : p2.name} có điểm đánh giá cao hơn, phù hợp cho đầu tư dài hạn.`,
    intent: "comparison",
    relatedProjects: projects.map((p) => ({
      slug: p.slug,
      name: p.name,
      tier: p.tier,
      reason: `Điểm ${p.score}/100`,
    })),
    followUpQuestions: [
      "Bạn quan tâm đến yếu tố nào nhất?",
      "Muốn xem chi tiết pháp lý của dự án nào?",
    ],
  };
}

function generateValuation(message: string): AdvisorResponse {
  const areaMatch = message.match(/(\d+)\s*(m2|m²|mét)/i);
  const area = areaMatch ? parseInt(areaMatch[1]) : 70;

  const basePrice = 75_000_000; // 75M/m2 average
  const totalPrice = basePrice * area;

  return {
    message: `**Ước tính giá căn hộ ${area}m²**\n\n` +
      `- Giá trung bình: ${(basePrice / 1_000_000).toFixed(0)} triệu/m²\n` +
      `- Tổng giá ước tính: **${(totalPrice / 1_000_000_000).toFixed(1)} tỷ VND**\n\n` +
      `*Lưu ý: Giá thực tế phụ thuộc vào vị trí, tầng, view và tình trạng căn hộ.*`,
    intent: "valuation",
    suggestions: [
      "Sử dụng công cụ định giá chi tiết",
      "Xem báo cáo thị trường khu vực",
    ],
    followUpQuestions: [
      "Căn hộ ở quận/khu vực nào?",
      "Dự án cụ thể là gì?",
      "Căn hộ mấy phòng ngủ?",
    ],
  };
}

function generateInvestmentAdvice(message: string): AdvisorResponse {
  return {
    message: `**Tư vấn đầu tư BĐS 2024-2025**\n\n` +
      `**Xu hướng tích cực:**\n` +
      `- Metro Line 1 sắp hoàn thành, tăng giá khu vực Quận 2, Thủ Đức\n` +
      `- Nhu cầu ở thực phục hồi mạnh\n` +
      `- Lãi suất ổn định\n\n` +
      `**Lưu ý:**\n` +
      `- Ưu tiên dự án tier S trở lên\n` +
      `- Kiểm tra pháp lý kỹ trước khi mua\n` +
      `- Chọn CĐT uy tín (Vingroup, Masterise...)\n\n` +
      `**Khuyến nghị:** Khu vực Quận 2 và Thủ Đức có tiềm năng tăng giá 15-20% trong 2 năm tới.`,
    intent: "investment",
    suggestions: [
      "Xem danh sách dự án tier S+",
      "Phân tích hạ tầng khu vực",
    ],
    followUpQuestions: [
      "Bạn muốn đầu tư ngắn hạn hay dài hạn?",
      "Ngân sách đầu tư của bạn khoảng bao nhiêu?",
    ],
    sources: ["RealTera Market Report Q4/2024", "Infrastructure Impact Analysis"],
  };
}

function generateMarketInsight(message: string): AdvisorResponse {
  return {
    message: `**Tổng quan thị trường BĐS TP.HCM Q4/2024**\n\n` +
      `**Chỉ số chính:**\n` +
      `- Giá trung bình: 75 triệu/m² (+7% QoQ)\n` +
      `- Giao dịch: +15% so với Q3\n` +
      `- Tỷ lệ hấp thụ: 45%\n\n` +
      `**Khu vực nóng:**\n` +
      `1. Quận 2 - Tăng 12% YoY\n` +
      `2. Thủ Đức - Tăng 10% YoY\n` +
      `3. Quận 7 - Ổn định, thanh khoản tốt\n\n` +
      `**Dự báo Q1/2025:** Tiếp tục tăng 5-8% nhờ hạ tầng và nguồn cung mới.`,
    intent: "market",
    suggestions: [
      "Xem báo cáo chi tiết",
      "Heatmap giá theo quận",
    ],
    followUpQuestions: [
      "Bạn quan tâm khu vực nào cụ thể?",
      "Muốn xem phân tích phân khúc nào?",
    ],
    sources: ["RealTera Market Report Q4/2024", "CBRE Vietnam", "Savills"],
  };
}

async function generateDeveloperInfo(message: string): Promise<AdvisorResponse> {
  // Fetch developers from database
  const developers = await db.developer.findMany({
    take: 10,
    orderBy: { overallScore: "desc" },
  });

  // Find mentioned developer or use first
  const dev = developers.find((d) =>
    message.includes(d.name.toLowerCase()) || message.includes(d.slug)
  ) || developers[0];

  if (!dev) {
    return {
      message: "Không tìm thấy thông tin chủ đầu tư. Vui lòng thử lại.",
      intent: "developer",
    };
  }

  // Get developer's projects
  const devProjects = await db.project.findMany({
    where: { developerId: dev.id },
    take: 5,
    orderBy: { score: "desc" },
  });

  return {
    message: `**${dev.name}**\n\n` +
      `**Thông tin:**\n` +
      `- Xếp hạng RealTera: **${dev.tier}**\n` +
      `- Số dự án: ${dev.projectCount}\n` +
      `- Năm thành lập: ${dev.foundedYear || "N/A"}\n` +
      `- Trụ sở: ${dev.headquarters || "TP.HCM"}\n\n` +
      `**Dự án tiêu biểu:**\n` +
      devProjects.slice(0, 3).map((p) => `- ${p.name} (${p.tier})`).join("\n"),
    intent: "developer",
    relatedProjects: devProjects.slice(0, 3).map((p) => ({
      slug: p.slug,
      name: p.name,
      tier: p.tier,
      reason: `Dự án của ${dev.name}`,
    })),
    followUpQuestions: [
      `Muốn xem chi tiết dự án nào của ${dev.name}?`,
      "So sánh với chủ đầu tư khác?",
    ],
  };
}
