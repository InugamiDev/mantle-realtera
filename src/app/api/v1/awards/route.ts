import { NextRequest, NextResponse } from "next/server";
import { mockProjects, developers } from "@/data/mockProjects";
import { TIER_ORDER } from "@/lib/tier";

// RealTera Annual Awards API
// Recognition and awards for top developers and projects

export type AwardCategory =
  | "developer_of_year"      // Chủ đầu tư của năm
  | "project_of_year"        // Dự án của năm
  | "best_luxury"            // Dự án cao cấp xuất sắc
  | "best_affordable"        // Dự án bình dân xuất sắc
  | "best_construction"      // Chất lượng xây dựng xuất sắc
  | "best_customer_service"  // Dịch vụ khách hàng xuất sắc
  | "best_sustainability"    // Dự án xanh/bền vững
  | "rising_star"            // Chủ đầu tư triển vọng
  | "most_improved"          // Cải thiện ấn tượng nhất
  | "peoples_choice";        // Bình chọn của cộng đồng

interface Award {
  id: string;
  category: AwardCategory;
  name: string;
  description: string;
  year: number;
  winner?: {
    type: "developer" | "project";
    slug: string;
    name: string;
    tier: string;
  };
  nominees: {
    type: "developer" | "project";
    slug: string;
    name: string;
    tier: string;
    score: number;
    highlights: string[];
  }[];
  criteria: string[];
  prize: {
    badge: string;
    benefits: string[];
  };
}

interface AwardCeremony {
  year: number;
  name: string;
  date: string;
  location: string;
  status: "upcoming" | "voting" | "completed";
  categories: AwardCategory[];
  sponsors: string[];
  stats: {
    totalNominees: number;
    totalVotes: number;
    categories: number;
  };
}

// Award categories config
const AWARD_CATEGORIES: Record<AwardCategory, { name: string; description: string; forType: "developer" | "project" | "both" }> = {
  developer_of_year: {
    name: "Chủ đầu tư của năm",
    description: "Chủ đầu tư xuất sắc nhất với danh mục dự án chất lượng",
    forType: "developer",
  },
  project_of_year: {
    name: "Dự án của năm",
    description: "Dự án xuất sắc nhất về tổng thể",
    forType: "project",
  },
  best_luxury: {
    name: "Dự án Cao cấp Xuất sắc",
    description: "Dự án cao cấp tốt nhất (>100 triệu/m²)",
    forType: "project",
  },
  best_affordable: {
    name: "Dự án Bình dân Xuất sắc",
    description: "Dự án bình dân tốt nhất (<50 triệu/m²)",
    forType: "project",
  },
  best_construction: {
    name: "Chất lượng Xây dựng Xuất sắc",
    description: "Dự án có chất lượng xây dựng tốt nhất",
    forType: "project",
  },
  best_customer_service: {
    name: "Dịch vụ Khách hàng Xuất sắc",
    description: "Chủ đầu tư có dịch vụ khách hàng tốt nhất",
    forType: "developer",
  },
  best_sustainability: {
    name: "Dự án Xanh Xuất sắc",
    description: "Dự án thân thiện môi trường nhất",
    forType: "project",
  },
  rising_star: {
    name: "Chủ đầu tư Triển vọng",
    description: "Chủ đầu tư mới nổi đáng chú ý",
    forType: "developer",
  },
  most_improved: {
    name: "Cải thiện Ấn tượng nhất",
    description: "Chủ đầu tư có sự cải thiện tier lớn nhất",
    forType: "developer",
  },
  peoples_choice: {
    name: "Bình chọn của Cộng đồng",
    description: "Dự án được cộng đồng yêu thích nhất",
    forType: "project",
  },
};

// GET /api/v1/awards - Get awards info
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "ceremony";
  const year = parseInt(searchParams.get("year") || "2024");
  const category = searchParams.get("category") as AwardCategory | null;

  // Current ceremony info
  if (type === "ceremony") {
    const ceremony = generateCeremony(year);
    return NextResponse.json({ ceremony });
  }

  // All categories
  if (type === "categories") {
    return NextResponse.json({
      categories: Object.entries(AWARD_CATEGORIES).map(([key, value]) => ({
        category: key,
        ...value,
      })),
    });
  }

  // Specific category with nominees
  if (type === "category" && category) {
    const award = generateAward(category, year);
    return NextResponse.json({ award });
  }

  // Winners by year
  if (type === "winners") {
    const winners = generateWinners(year);
    return NextResponse.json({ year, winners });
  }

  // Hall of fame
  if (type === "hall-of-fame") {
    const hallOfFame = generateHallOfFame();
    return NextResponse.json({ hallOfFame });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

// POST /api/v1/awards - Submit vote (public voting)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { category, nomineeSlug, voterEmail } = body;

  if (!category || !nomineeSlug || !voterEmail) {
    return NextResponse.json(
      { error: "category, nomineeSlug, and voterEmail required" },
      { status: 400 }
    );
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(voterEmail)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // In production: validate category, nominee, check duplicate votes, save to database
  return NextResponse.json({
    success: true,
    message: "Cảm ơn bạn đã bình chọn!",
    vote: {
      id: `vote_${Date.now()}`,
      category,
      nomineeSlug,
      timestamp: new Date().toISOString(),
    },
    shareMessage: `Tôi vừa bình chọn cho ${nomineeSlug} tại RealTera Awards 2024! #RealTeraAwards`,
  });
}

function generateCeremony(year: number): AwardCeremony {
  const isCurrentYear = year === new Date().getFullYear();

  return {
    year,
    name: `RealTera Awards ${year}`,
    date: `${year}-12-15`,
    location: "Gem Center, TP. Hồ Chí Minh",
    status: isCurrentYear ? "voting" : "completed",
    categories: Object.keys(AWARD_CATEGORIES) as AwardCategory[],
    sponsors: ["VietinBank", "Savills Vietnam", "PropertyGuru"],
    stats: {
      totalNominees: 45,
      totalVotes: isCurrentYear ? 12500 : 35000,
      categories: 10,
    },
  };
}

function generateAward(category: AwardCategory, year: number): Award {
  const categoryInfo = AWARD_CATEGORIES[category];
  const isProjectAward = categoryInfo.forType === "project";

  // Generate nominees
  const nominees = isProjectAward
    ? mockProjects
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((p) => ({
          type: "project" as const,
          slug: p.slug,
          name: p.name,
          tier: p.tier,
          score: p.score,
          highlights: [
            `Tier ${p.tier}`,
            `Điểm: ${p.score}/100`,
            p.district,
          ],
        }))
    : Object.values(developers)
        .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier))
        .slice(0, 5)
        .map((d) => ({
          type: "developer" as const,
          slug: d.slug,
          name: d.name,
          tier: d.tier,
          score: d.score || 80,
          highlights: [
            `Tier ${d.tier}`,
            `${d.projectCount} dự án`,
          ],
        }));

  const winner = nominees[0];

  return {
    id: `award_${category}_${year}`,
    category,
    name: categoryInfo.name,
    description: categoryInfo.description,
    year,
    winner: year < new Date().getFullYear() ? {
      type: winner.type,
      slug: winner.slug,
      name: winner.name,
      tier: winner.tier,
    } : undefined,
    nominees,
    criteria: [
      "Điểm RealTera tier",
      "Chất lượng dự án",
      "Phản hồi khách hàng",
      "Bình chọn cộng đồng",
    ],
    prize: {
      badge: `RealTera ${categoryInfo.name} ${year}`,
      benefits: [
        "Badge trên tất cả dự án",
        "Featured placement 3 tháng",
        "PR & Media coverage",
        "Certificate & Trophy",
      ],
    },
  };
}

function generateWinners(year: number): Award[] {
  return (Object.keys(AWARD_CATEGORIES) as AwardCategory[]).map((category) =>
    generateAward(category, year)
  );
}

function generateHallOfFame() {
  const years = [2024, 2023, 2022];

  return {
    title: "RealTera Hall of Fame",
    description: "Vinh danh các chủ đầu tư và dự án xuất sắc qua các năm",
    entries: years.flatMap((year) => {
      const topDev = Object.values(developers)[0];
      const topProject = mockProjects[0];

      return [
        {
          year,
          category: "developer_of_year",
          winner: {
            type: "developer",
            name: topDev.name,
            slug: topDev.slug,
            tier: topDev.tier,
          },
        },
        {
          year,
          category: "project_of_year",
          winner: {
            type: "project",
            name: topProject.name,
            slug: topProject.slug,
            tier: topProject.tier,
          },
        },
      ];
    }),
    multipleWinners: [
      {
        name: Object.values(developers)[0].name,
        wins: 3,
        categories: ["Chủ đầu tư của năm (2x)", "Dịch vụ KH xuất sắc"],
      },
    ],
  };
}
