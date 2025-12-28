import { NextRequest, NextResponse } from "next/server";
import { mockProjects, getAllDevelopers } from "@/data/mockProjects";

// GET /api/v1/search - Full-text search across projects and developers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase();
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.length < 2) {
      return NextResponse.json({
        projects: [],
        developers: [],
      });
    }

    // Search projects
    const matchingProjects = mockProjects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.district.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.developer.name.toLowerCase().includes(query) ||
          p.verdict?.toLowerCase().includes(query)
      )
      .slice(0, limit)
      .map((p) => ({
        type: "project" as const,
        slug: p.slug,
        name: p.name,
        tier: p.tier,
        score: p.score,
        district: p.district,
        city: p.city,
        developer: p.developer.name,
      }));

    // Search developers
    const matchingDevelopers = getAllDevelopers()
      .filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.slug.toLowerCase().includes(query) ||
          d.headquarters?.toLowerCase().includes(query)
      )
      .slice(0, limit)
      .map((d) => ({
        type: "developer" as const,
        slug: d.slug,
        name: d.name,
        tier: d.tier,
        projectCount: d.projectCount,
        headquarters: d.headquarters,
      }));

    return NextResponse.json({
      projects: matchingProjects,
      developers: matchingDevelopers,
      query,
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
