import { NextRequest, NextResponse } from "next/server";
import { getAllDevelopers, getProjectsByDeveloper } from "@/data/mockProjects";
import type { Developer } from "@/lib/types";

// GET /api/v1/developers - List developers with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search")?.toLowerCase();
    const tiers = searchParams.get("tiers")?.split(",").filter(Boolean);
    const listed = searchParams.get("listed"); // true = has stockCode

    // Sorting
    const sortBy = searchParams.get("sortBy") || "tier";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    // Get all developers
    let developers = getAllDevelopers();

    // Filter
    if (search) {
      developers = developers.filter(
        (d) =>
          d.name.toLowerCase().includes(search) ||
          d.slug.toLowerCase().includes(search) ||
          d.headquarters?.toLowerCase().includes(search)
      );
    }

    if (tiers && tiers.length > 0) {
      developers = developers.filter((d) => tiers.includes(d.tier));
    }

    if (listed === "true") {
      developers = developers.filter((d) => d.stockCode);
    } else if (listed === "false") {
      developers = developers.filter((d) => !d.stockCode);
    }

    // Sort
    const tierOrder = ["SSS", "S", "A", "B", "C", "D", "F"];

    developers.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "tier":
          comparison = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
          break;
        case "projectCount":
          comparison = b.projectCount - a.projectCount;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name, "vi");
          break;
        case "foundedYear":
          comparison = (b.foundedYear || 0) - (a.foundedYear || 0);
          break;
        default:
          comparison = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    // Pagination
    const totalCount = developers.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedDevelopers = developers.slice(offset, offset + limit);

    // Stats
    const stats = {
      totalDevelopers: getAllDevelopers().length,
      highTierCount: getAllDevelopers().filter((d) =>
        ["SSS", "S", "A"].includes(d.tier)
      ).length,
      listedCount: getAllDevelopers().filter((d) => d.stockCode).length,
      totalProjects: getAllDevelopers().reduce(
        (sum, d) => sum + d.projectCount,
        0
      ),
    };

    return NextResponse.json({
      data: paginatedDevelopers,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      stats,
    });
  } catch (error) {
    console.error("Error fetching developers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
