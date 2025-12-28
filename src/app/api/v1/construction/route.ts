import { NextRequest, NextResponse } from "next/server";
import { mockProjects } from "@/data/mockProjects";

// Construction Progress Tracking API
// Monitor construction status and progress of projects

export type ConstructionPhase =
  | "land_clearing"
  | "foundation"
  | "structure"
  | "mep"        // Mechanical, Electrical, Plumbing
  | "finishing"
  | "handover"
  | "completed";

export type ProgressStatus = "on_track" | "delayed" | "ahead" | "paused";

interface ConstructionUpdate {
  id: string;
  date: string;
  phase: ConstructionPhase;
  progress: number; // 0-100
  description: string;
  images?: string[];
  verifiedBy?: string;
}

interface ProjectConstruction {
  projectSlug: string;
  projectName: string;
  developer: string;
  currentPhase: ConstructionPhase;
  overallProgress: number;
  status: ProgressStatus;
  startDate: string;
  expectedCompletion: string;
  actualCompletion?: string;
  phases: {
    phase: ConstructionPhase;
    label: string;
    progress: number;
    startDate?: string;
    endDate?: string;
  }[];
  recentUpdates: ConstructionUpdate[];
  delayDays: number;
  nextMilestone: {
    name: string;
    expectedDate: string;
  };
}

// Phase labels in Vietnamese
const PHASE_LABELS: Record<ConstructionPhase, string> = {
  land_clearing: "Giải phóng mặt bằng",
  foundation: "Móng & Hầm",
  structure: "Kết cấu thân",
  mep: "Cơ điện",
  finishing: "Hoàn thiện",
  handover: "Bàn giao",
  completed: "Hoàn thành",
};

// Mock construction data
function generateConstructionData(project: typeof mockProjects[0]): ProjectConstruction {
  const phases: ProjectConstruction["phases"] = [
    { phase: "land_clearing", label: PHASE_LABELS.land_clearing, progress: 100 },
    { phase: "foundation", label: PHASE_LABELS.foundation, progress: 100 },
    { phase: "structure", label: PHASE_LABELS.structure, progress: 85 + Math.floor(Math.random() * 15) },
    { phase: "mep", label: PHASE_LABELS.mep, progress: 40 + Math.floor(Math.random() * 40) },
    { phase: "finishing", label: PHASE_LABELS.finishing, progress: Math.floor(Math.random() * 50) },
    { phase: "handover", label: PHASE_LABELS.handover, progress: 0 },
    { phase: "completed", label: PHASE_LABELS.completed, progress: 0 },
  ];

  // Determine current phase
  const currentPhaseIndex = phases.findIndex((p) => p.progress < 100);
  const currentPhase = phases[currentPhaseIndex]?.phase || "completed";
  const overallProgress = Math.round(
    phases.reduce((sum, p) => sum + p.progress, 0) / phases.length
  );

  const delayDays = Math.floor(Math.random() * 60) - 20; // -20 to +40 days
  const status: ProgressStatus =
    delayDays > 30 ? "delayed" : delayDays < -10 ? "ahead" : "on_track";

  const startDate = new Date(Date.now() - 18 * 30 * 24 * 60 * 60 * 1000); // 18 months ago
  const expectedCompletion = new Date(Date.now() + 8 * 30 * 24 * 60 * 60 * 1000); // 8 months from now

  return {
    projectSlug: project.slug,
    projectName: project.name,
    developer: project.developer.slug,
    currentPhase,
    overallProgress,
    status,
    startDate: startDate.toISOString(),
    expectedCompletion: expectedCompletion.toISOString(),
    phases,
    recentUpdates: [
      {
        id: `upd_${Date.now()}_1`,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        phase: currentPhase,
        progress: overallProgress,
        description: `Tiến độ ${PHASE_LABELS[currentPhase]} đạt ${phases[currentPhaseIndex]?.progress || 0}%`,
      },
      {
        id: `upd_${Date.now()}_2`,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        phase: currentPhase,
        progress: overallProgress - 5,
        description: "Hoàn thành lắp đặt hệ thống PCCC tầng 15-20",
      },
    ],
    delayDays: Math.max(0, delayDays),
    nextMilestone: {
      name: currentPhaseIndex < phases.length - 1
        ? `Hoàn thành ${PHASE_LABELS[phases[currentPhaseIndex]?.phase || "structure"]}`
        : "Bàn giao đợt 1",
      expectedDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };
}

// GET /api/v1/construction - Get construction progress
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectSlug = searchParams.get("projectSlug");
  const developerSlug = searchParams.get("developer");
  const status = searchParams.get("status") as ProgressStatus | null;
  const phase = searchParams.get("phase") as ConstructionPhase | null;

  // Single project detail
  if (projectSlug) {
    const project = mockProjects.find((p) => p.slug === projectSlug);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const construction = generateConstructionData(project);
    return NextResponse.json({
      construction,
      project: {
        name: project.name,
        tier: project.tier,
        district: project.district,
        developer: project.developer.name,
      },
    });
  }

  // List all projects with construction data
  let projects = mockProjects;

  if (developerSlug) {
    projects = projects.filter((p) => p.developer.slug === developerSlug);
  }

  const constructionList = projects.map((p) => {
    const data = generateConstructionData(p);
    return {
      projectSlug: p.slug,
      projectName: p.name,
      developer: p.developer.slug,
      district: p.district,
      tier: p.tier,
      currentPhase: data.currentPhase,
      overallProgress: data.overallProgress,
      status: data.status,
      expectedCompletion: data.expectedCompletion,
      delayDays: data.delayDays,
    };
  });

  // Filter by status
  let filtered = constructionList;
  if (status) {
    filtered = filtered.filter((c) => c.status === status);
  }
  if (phase) {
    filtered = filtered.filter((c) => c.currentPhase === phase);
  }

  // Summary stats
  const summary = {
    total: filtered.length,
    onTrack: filtered.filter((c) => c.status === "on_track").length,
    delayed: filtered.filter((c) => c.status === "delayed").length,
    ahead: filtered.filter((c) => c.status === "ahead").length,
    avgProgress: Math.round(
      filtered.reduce((sum, c) => sum + c.overallProgress, 0) / filtered.length
    ),
    byPhase: Object.fromEntries(
      Object.keys(PHASE_LABELS).map((phase) => [
        phase,
        filtered.filter((c) => c.currentPhase === phase).length,
      ])
    ),
  };

  return NextResponse.json({
    projects: filtered.sort((a, b) => b.overallProgress - a.overallProgress),
    summary,
    phases: PHASE_LABELS,
  });
}

// POST /api/v1/construction - Add construction update (developer only)
export async function POST(request: NextRequest) {
  // In production, verify developer authentication

  const body = await request.json();
  const { projectSlug, phase, progress, description, images } = body;

  if (!projectSlug || !phase || progress === undefined) {
    return NextResponse.json(
      { error: "projectSlug, phase, and progress required" },
      { status: 400 }
    );
  }

  if (progress < 0 || progress > 100) {
    return NextResponse.json(
      { error: "progress must be 0-100" },
      { status: 400 }
    );
  }

  const update: ConstructionUpdate = {
    id: `upd_${Date.now()}`,
    date: new Date().toISOString(),
    phase,
    progress,
    description: description || `Cập nhật tiến độ ${PHASE_LABELS[phase as ConstructionPhase]}`,
    images: images || [],
  };

  return NextResponse.json({
    success: true,
    update,
    message: "Cập nhật tiến độ thành công. Đang chờ xác minh.",
  });
}
