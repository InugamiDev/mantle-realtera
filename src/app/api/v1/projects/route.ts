import { NextRequest, NextResponse } from "next/server";
import { getAllProjects } from "@/lib/data";
import { batchGetAttestations, isMockMode } from "@/lib/attestation-service";
import { validateSearchParams, projectFilterSchema, ValidationError } from "@/lib/validations";

// GET /api/v1/projects - List projects with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate query params with Zod
    let params;
    try {
      params = validateSearchParams(searchParams, projectFilterSchema);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(error.toJSON(), { status: 400 });
      }
      return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
    }

    // Extract validated params
    const { page, limit, search, tier, district, developer, verified, sortBy, sortOrder } = params;
    const offset = (page - 1) * limit;

    // Parse comma-separated values for arrays (validated as strings in schema)
    const tiers = tier ? [tier] : searchParams.get("tiers")?.split(",").filter(Boolean);
    const districts = district ? [district] : searchParams.get("districts")?.split(",").filter(Boolean);
    const developers = developer ? [developer] : searchParams.get("developers")?.split(",").filter(Boolean);
    const verificationStatus = verified ? (verified ? "Verified" : "Unverified") : searchParams.get("verificationStatus");
    const sponsored = searchParams.get("sponsored");
    const minScore = searchParams.get("minScore");
    const maxScore = searchParams.get("maxScore");

    // Fetch projects from database using shared data layer
    const allProjects = await getAllProjects();

    // Filter projects
    let filteredProjects = allProjects;

    if (search) {
      filteredProjects = filteredProjects.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.district.toLowerCase().includes(search) ||
          p.city.toLowerCase().includes(search) ||
          p.developer.name.toLowerCase().includes(search)
      );
    }

    if (tiers && tiers.length > 0) {
      filteredProjects = filteredProjects.filter((p) => tiers.includes(p.tier));
    }

    if (districts && districts.length > 0) {
      filteredProjects = filteredProjects.filter((p) =>
        districts.includes(p.district)
      );
    }

    if (developers && developers.length > 0) {
      filteredProjects = filteredProjects.filter((p) =>
        developers.includes(p.developer.slug)
      );
    }

    if (verificationStatus) {
      filteredProjects = filteredProjects.filter(
        (p) => p.verificationStatus === verificationStatus
      );
    }

    if (sponsored === "true") {
      filteredProjects = filteredProjects.filter((p) => p.sponsored);
    } else if (sponsored === "false") {
      filteredProjects = filteredProjects.filter((p) => !p.sponsored);
    }

    if (minScore) {
      filteredProjects = filteredProjects.filter(
        (p) => p.score >= parseInt(minScore)
      );
    }

    if (maxScore) {
      filteredProjects = filteredProjects.filter(
        (p) => p.score <= parseInt(maxScore)
      );
    }

    // Sort projects
    // Governance Hardening: Sponsored status does NOT influence ranking
    // Sponsored badge is displayed for disclosure, but has zero sort priority
    const tierOrder = ["SSS", "S+", "S", "A", "B", "C", "D", "F"];

    filteredProjects.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "tier-score":
          comparison = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
          if (comparison === 0) {
            comparison = b.score - a.score;
          }
          // REMOVED: Sponsored sort priority (Governance Hardening)
          break;
        case "score":
          comparison = b.score - a.score;
          break;
        case "updated":
          comparison =
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        case "sources":
          comparison = b.sourceCount - a.sourceCount;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name, "vi");
          break;
        default:
          comparison = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
      }

      return sortOrder === "asc" ? -comparison : comparison;
    });

    // Pagination
    const totalCount = filteredProjects.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedProjects = filteredProjects.slice(offset, offset + limit);

    // Batch fetch attestations for paginated projects
    const slugs = paginatedProjects.map((p) => p.slug);
    const attestationsMap = await batchGetAttestations(slugs);

    // Get available filter options
    const availableDistricts = [...new Set(allProjects.map((p) => p.district))].sort();
    const availableTiers = [...new Set(allProjects.map((p) => p.tier))];

    return NextResponse.json({
      data: paginatedProjects,
      attestations: attestationsMap,
      source: "database",
      mockMode: isMockMode(),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        availableDistricts,
        availableTiers,
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
