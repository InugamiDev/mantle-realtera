"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";
import { AttestationBadge } from "@/components/realtera/AttestationBadge";
import {
  Building2,
  FileCheck,
  AlertTriangle,
  Shield,
  ShieldCheck,
  ArrowRight,
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
  Settings,
  Briefcase,
} from "lucide-react";
import {
  DEMO_DEVELOPER,
  getProjectsByDeveloper,
  getDocumentsExpiringSoon,
  getVerificationRequests,
  type Developer,
  type DeveloperProject,
  type DeveloperDocument,
  type VerificationRequest,
} from "@/lib/mock/developer-data";
import { getAttestationBySlug } from "@/lib/attestation-service";
import type { AttestationSummary } from "@/lib/attestation-registry";
import type { Tier } from "@/lib/tier";

// Map project status to tier for demo
const PROJECT_TIERS: Record<string, Tier> = {
  "vinhomes-grand-park": "S",
  "vinhomes-ocean-park": "S",
  "vinhomes-central-park": "S+",
  "the-global-city": "S",
  "masteri-thao-dien": "S",
  "the-marq": "S+",
  "du-an-tranh-chap": "D",
};

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  color = "amber",
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sublabel?: string;
  color?: string;
  href?: string;
}) {
  const colorClasses = {
    amber: "bg-amber-500/20 text-amber-400",
    blue: "bg-blue-500/20 text-blue-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
    red: "bg-red-500/20 text-red-400",
    cyan: "bg-cyan-500/20 text-cyan-400",
  };

  const content = (
    <GlassCard className={`p-5 ${href ? "hover:bg-white/10 cursor-pointer" : ""}`}>
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="mt-1 text-sm text-white/60">{label}</p>
        {sublabel && <p className="mt-0.5 text-xs text-white/40">{sublabel}</p>}
      </div>
    </GlassCard>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function ProjectCard({
  project,
  attestation,
}: {
  project: DeveloperProject;
  attestation: AttestationSummary | null;
}) {
  const tier = PROJECT_TIERS[project.projectSlug] || "B";

  const statusColors = {
    planning: "text-blue-400 bg-blue-500/10",
    under_construction: "text-amber-400 bg-amber-500/10",
    completed: "text-emerald-400 bg-emerald-500/10",
    on_hold: "text-red-400 bg-red-500/10",
  };

  const statusLabels = {
    planning: "Quy hoạch",
    under_construction: "Đang xây",
    completed: "Hoàn thành",
    on_hold: "Tạm dừng",
  };

  const verificationStatusColors = {
    unverified: "text-gray-400",
    pending: "text-amber-400",
    verified: "text-emerald-400",
    disputed: "text-red-400",
  };

  return (
    <Link href={`/developer/console/${project.projectSlug}`}>
      <GlassCard className="p-4 hover:bg-white/10 transition-all cursor-pointer group">
        <div className="flex items-start gap-4">
          <TierBadge tier={tier} />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white group-hover:text-amber-400 transition-colors">
              {project.name}
            </h3>
            <div className="mt-1 flex items-center gap-3 text-sm">
              <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[project.status]}`}>
                {statusLabels[project.status]}
              </span>
              <span className={`flex items-center gap-1 text-xs ${verificationStatusColors[project.verificationStatus]}`}>
                {project.verificationStatus === "verified" ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : project.verificationStatus === "pending" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : project.verificationStatus === "disputed" ? (
                  <XCircle className="h-3 w-3" />
                ) : (
                  <Shield className="h-3 w-3" />
                )}
                Tier {project.verificationTier}
              </span>
            </div>
          </div>
          {attestation && <AttestationBadge attestation={attestation} size="sm" locale="vi" />}
        </div>

        {/* Document Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-white/60">Hồ sơ pháp lý</span>
            <span className="text-white/80">{project.documentsComplete}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full ${
                project.documentsComplete >= 80 ? "bg-emerald-500" :
                project.documentsComplete >= 50 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${project.documentsComplete}%` }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="mt-3 flex items-center justify-between text-xs text-white/40">
          {project.lastVerified && (
            <span>Xác minh: {new Date(project.lastVerified).toLocaleDateString("vi-VN")}</span>
          )}
          {project.nextReviewDate && (
            <span className="text-amber-400">
              Review: {new Date(project.nextReviewDate).toLocaleDateString("vi-VN")}
            </span>
          )}
        </div>
      </GlassCard>
    </Link>
  );
}

function ExpiringDocumentAlert({ documents }: { documents: DeveloperDocument[] }) {
  if (documents.length === 0) return null;

  return (
    <GlassCard className="p-4 border-l-4 border-l-orange-500 bg-orange-500/5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-white">Tài liệu sắp hết hạn</h3>
          <p className="mt-1 text-sm text-white/60">
            {documents.length} tài liệu sẽ hết hạn trong 30 ngày tới
          </p>
          <div className="mt-2 space-y-1">
            {documents.slice(0, 3).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between text-sm">
                <span className="text-white/80">{doc.name}</span>
                <span className="text-orange-400">
                  {doc.expiresAt && new Date(doc.expiresAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            ))}
          </div>
          {documents.length > 3 && (
            <p className="mt-2 text-xs text-white/40">
              +{documents.length - 3} tài liệu khác
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

function VerificationRequestCard({ request }: { request: VerificationRequest }) {
  const statusColors = {
    pending: "bg-blue-500/20 text-blue-400",
    in_review: "bg-amber-500/20 text-amber-400",
    approved: "bg-emerald-500/20 text-emerald-400",
    rejected: "bg-red-500/20 text-red-400",
  };

  const statusLabels = {
    pending: "Chờ xử lý",
    in_review: "Đang xem xét",
    approved: "Đã duyệt",
    rejected: "Từ chối",
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{request.projectSlug}</p>
        <p className="text-xs text-white/50">
          Tier {request.currentTier} → Tier {request.requestedTier}
        </p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[request.status]}`}>
        {statusLabels[request.status]}
      </span>
    </div>
  );
}

export default function DeveloperConsolePage() {
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [projects, setProjects] = useState<DeveloperProject[]>([]);
  const [attestations, setAttestations] = useState<Record<string, AttestationSummary | null>>({});
  const [expiringDocs, setExpiringDocs] = useState<DeveloperDocument[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: load initial demo data on mount
    setDeveloper(DEMO_DEVELOPER);
    const devProjects = getProjectsByDeveloper(DEMO_DEVELOPER.id);
    setProjects(devProjects);
    setExpiringDocs(getDocumentsExpiringSoon(DEMO_DEVELOPER.id));
    setVerificationRequests(getVerificationRequests(DEMO_DEVELOPER.id));

    // Load attestations for all projects
    const loadAttestations = async () => {
      const results: Record<string, AttestationSummary | null> = {};
      for (const project of devProjects) {
        results[project.projectSlug] = await getAttestationBySlug(project.projectSlug);
      }
      setAttestations(results);
      setIsLoading(false);
    };

    loadAttestations();
  }, []);

  if (isLoading) {
    return (
      <div className="container-app py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 rounded bg-white/10" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="container-app py-12">
        <GlassCard className="mx-auto max-w-lg p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <Briefcase className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Developer Console</h1>
          <p className="mt-2 text-white/60">
            Đăng nhập để truy cập bảng điều khiển chủ đầu tư
          </p>
          <Link
            href="/handler/sign-in?after_auth_return_to=/developer/console"
            className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 font-medium text-black transition-colors hover:bg-amber-400"
          >
            Đăng nhập
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{developer.name}</h1>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-medium text-cyan-400 uppercase">
              {developer.tier}
            </span>
          </div>
          <p className="mt-1 text-white/60">Developer Console</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/developer/verify"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:from-cyan-600 hover:to-cyan-700"
          >
            <ShieldCheck className="h-4 w-4" />
            Yêu cầu xác minh
          </Link>
          <Link
            href="/developer/api"
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20"
          >
            <Settings className="h-4 w-4" />
            API
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Building2}
          label="Tổng dự án"
          value={developer.stats.totalProjects}
          sublabel={`${developer.stats.ongoingProjects} đang triển khai`}
          color="blue"
        />
        <StatCard
          icon={ShieldCheck}
          label="Đã xác minh"
          value={developer.stats.verifiedProjects}
          sublabel={`${Math.round((developer.stats.verifiedProjects / developer.stats.totalProjects) * 100)}% tổng dự án`}
          color="emerald"
        />
        <StatCard
          icon={FileCheck}
          label="Tài liệu"
          value={`${developer.documents.verified}/${developer.documents.total}`}
          sublabel={`${developer.documents.pending} đang chờ duyệt`}
          color="cyan"
        />
        <StatCard
          icon={AlertTriangle}
          label="Sắp hết hạn"
          value={developer.documents.expiringSoon}
          sublabel="Trong 30 ngày tới"
          color="red"
          href="/developer/console?filter=expiring"
        />
      </div>

      {/* Alerts */}
      {expiringDocs.length > 0 && (
        <div className="mb-8">
          <ExpiringDocumentAlert documents={expiringDocs} />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Projects List */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Dự án của bạn</h2>
              <span className="text-sm text-white/50">{projects.length} dự án</span>
            </div>
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  attestation={attestations[project.projectSlug]}
                />
              ))}
            </div>
            {projects.length === 0 && (
              <div className="py-12 text-center">
                <Building2 className="mx-auto h-12 w-12 text-white/20" />
                <p className="mt-4 text-white/60">Chưa có dự án nào</p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Verification Requests */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Yêu cầu xác minh</h2>
              <Link
                href="/developer/verify"
                className="text-sm text-amber-400 hover:underline flex items-center gap-1"
              >
                Tạo mới
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div>
              {verificationRequests.slice(0, 3).map((request) => (
                <VerificationRequestCard key={request.id} request={request} />
              ))}
              {verificationRequests.length === 0 && (
                <p className="py-4 text-center text-white/40 text-sm">
                  Chưa có yêu cầu xác minh
                </p>
              )}
            </div>
          </GlassCard>

          {/* Subscription Info */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-cyan-400" />
              <h2 className="font-semibold text-white">Subscription</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Gói</span>
                <span className="font-medium text-white">{developer.subscription.plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Hết hạn</span>
                <span className="text-white">
                  {new Date(developer.subscription.expiresAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-white/50 mb-2">Tính năng:</p>
                <ul className="space-y-1">
                  {developer.subscription.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/70">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard className="p-6">
            <h2 className="font-semibold text-white mb-4">Hành động nhanh</h2>
            <div className="space-y-2">
              <Link
                href="/developer/verify"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Upload className="h-5 w-5 text-amber-400" />
                <span className="text-sm text-white/80">Tải lên tài liệu</span>
              </Link>
              <Link
                href="/developer/api"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Settings className="h-5 w-5 text-cyan-400" />
                <span className="text-sm text-white/80">Quản lý API Keys</span>
              </Link>
              <Link
                href="/governance"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                <FileCheck className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-white/80">Xem tiêu chuẩn xác minh</span>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
