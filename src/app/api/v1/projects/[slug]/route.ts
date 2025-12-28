import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug, getProjectsByDeveloper } from "@/lib/data";
import { getAttestationBySlug, isMockMode } from "@/lib/attestation-service";

// GET /api/v1/projects/[slug] - Get single project by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Fetch attestation data and related projects in parallel
    const [attestation, developerProjects] = await Promise.all([
      getAttestationBySlug(slug),
      getProjectsByDeveloper(project.developer.slug),
    ]);

    const relatedProjects = developerProjects
      .filter((p) => p.slug !== slug)
      .slice(0, 4);

    return NextResponse.json({
      data: project,
      attestation,
      relatedProjects,
      mockMode: isMockMode(),
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
