import { NextRequest, NextResponse } from "next/server";
import { getAllDevelopers, getProjectsByDeveloper } from "@/data/mockProjects";

// GET /api/v1/developers/[slug] - Get single developer by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const developers = getAllDevelopers();
    const developer = developers.find((d) => d.slug === slug);

    if (!developer) {
      return NextResponse.json(
        { error: "Developer not found" },
        { status: 404 }
      );
    }

    // Get all projects by this developer
    const projects = getProjectsByDeveloper(slug);

    // Calculate stats
    const stats = {
      totalProjects: projects.length,
      verifiedProjects: projects.filter(
        (p) => p.verificationStatus === "Verified"
      ).length,
      averageScore:
        projects.length > 0
          ? Math.round(
              projects.reduce((sum, p) => sum + p.score, 0) / projects.length
            )
          : 0,
      tierDistribution: projects.reduce(
        (acc, p) => {
          acc[p.tier] = (acc[p.tier] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      cities: [...new Set(projects.map((p) => p.city))],
      districts: [...new Set(projects.map((p) => p.district))],
    };

    return NextResponse.json({
      data: developer,
      projects,
      stats,
    });
  } catch (error) {
    console.error("Error fetching developer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
