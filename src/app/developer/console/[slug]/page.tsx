"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";
import { AttestationBadge } from "@/components/realtera/AttestationBadge";
import { AttestationDetails } from "@/components/realtera/AttestationDetails";
import {
  ArrowLeft,
  FileCheck,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  ShieldCheck,
  ExternalLink,
  Eye,
  Download,
  RefreshCw,
  Plus,
  Building2,
  Calendar,
  Hash,
} from "lucide-react";
import {
  DEMO_DEVELOPER,
  getProjectBySlug,
  getDocumentsByProject,
  type DeveloperProject,
  type DeveloperDocument,
} from "@/lib/mock/developer-data";
import { getAttestationBySlug } from "@/lib/attestation-service";
import {
  getEvidenceByProject,
  getEvidencePackSummary,
  EVIDENCE_CATEGORIES,
  EVIDENCE_TYPES,
  formatFileSize,
  type Evidence,
  type EvidencePackSummary,
} from "@/lib/evidence";
import type { AttestationSummary } from "@/lib/attestation-registry";
import type { Tier } from "@/lib/tier";

const PROJECT_TIERS: Record<string, Tier> = {
  "vinhomes-grand-park": "S",
  "vinhomes-ocean-park": "S",
  "vinhomes-central-park": "S+",
  "the-global-city": "S",
  "masteri-thao-dien": "S",
  "the-marq": "S+",
  "du-an-tranh-chap": "D",
};

const PROJECT_NAMES: Record<string, string> = {
  "vinhomes-grand-park": "Vinhomes Grand Park",
  "vinhomes-ocean-park": "Vinhomes Ocean Park",
  "vinhomes-central-park": "Vinhomes Central Park",
  "the-global-city": "The Global City",
  "masteri-thao-dien": "Masteri Thao Dien",
  "the-marq": "The Marq",
  "du-an-tranh-chap": "Dự án Tranh chấp",
};

function DocumentCard({ document }: { document: DeveloperDocument }) {
  const statusColors = {
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    verified: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    expired: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };

  const statusIcons = {
    pending: Clock,
    verified: CheckCircle2,
    rejected: XCircle,
    expired: AlertTriangle,
  };

  const StatusIcon = statusIcons[document.status];

  return (
    <GlassCard className="p-4">
      <div className="flex items-start gap-4">
        <div className={`rounded-lg border p-2 ${statusColors[document.status]}`}>
          <StatusIcon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white">{document.name}</h4>
          <p className="mt-0.5 text-sm text-white/50">{document.fileName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40">
            <span>{formatFileSize(document.fileSize)}</span>
            <span>Tải lên: {new Date(document.uploadedAt).toLocaleDateString("vi-VN")}</span>
            {document.expiresAt && (
              <span className={document.status === "expired" ? "text-orange-400" : ""}>
                Hết hạn: {new Date(document.expiresAt).toLocaleDateString("vi-VN")}
              </span>
            )}
          </div>
          {document.blockchainRef && (
            <div className="mt-2 flex items-center gap-1 text-xs text-cyan-400">
              <Hash className="h-3 w-3" />
              <span className="truncate max-w-[200px]">{document.blockchainRef.txHash}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white">
            <Download className="h-4 w-4" />
          </button>
          {document.status === "expired" && (
            <button className="p-2 rounded-lg hover:bg-amber-500/10 text-amber-400">
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {document.notes && (
        <p className="mt-3 text-sm text-white/50 italic">{document.notes}</p>
      )}
    </GlassCard>
  );
}

function EvidenceCard({ evidence }: { evidence: Evidence }) {
  const statusColors = {
    pending: "bg-amber-500/20 text-amber-400",
    verified: "bg-emerald-500/20 text-emerald-400",
    rejected: "bg-red-500/20 text-red-400",
    expired: "bg-orange-500/20 text-orange-400",
  };

  const typeConfig = EVIDENCE_TYPES[evidence.type];

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{typeConfig.nameVi}</p>
        <p className="text-xs text-white/50">{evidence.fileName}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[evidence.status]}`}>
        {evidence.status === "verified" ? "Đã xác minh" :
         evidence.status === "pending" ? "Chờ duyệt" :
         evidence.status === "rejected" ? "Từ chối" : "Hết hạn"}
      </span>
    </div>
  );
}

function CategoryProgress({
  category,
  data,
}: {
  category: keyof typeof EVIDENCE_CATEGORIES;
  data: { total: number; verified: number; required: number; requiredVerified: number };
}) {
  const config = EVIDENCE_CATEGORIES[category];
  const percentage = data.required > 0 ? Math.round((data.requiredVerified / data.required) * 100) : 0;

  return (
    <div className="py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white/80">{config.nameVi}</span>
        <span className="text-xs text-white/50">
          {data.verified}/{data.total} docs ({Math.round(config.weight * 100)}%)
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full ${
            percentage >= 80 ? "bg-emerald-500" :
            percentage >= 50 ? "bg-amber-500" : "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function ProjectDossierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [project, setProject] = useState<DeveloperProject | null>(null);
  const [documents, setDocuments] = useState<DeveloperDocument[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [evidenceSummary, setEvidenceSummary] = useState<EvidencePackSummary | null>(null);
  const [attestation, setAttestation] = useState<AttestationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "evidence">("overview");

  useEffect(() => {
    const loadData = async () => {
      // Load project data
      const projectData = getProjectBySlug(DEMO_DEVELOPER.id, slug);
      setProject(projectData || null);

      // Load documents
      setDocuments(getDocumentsByProject(DEMO_DEVELOPER.id, slug));

      // Load evidence
      setEvidence(getEvidenceByProject(slug));
      setEvidenceSummary(getEvidencePackSummary(slug));

      // Load attestation
      const att = await getAttestationBySlug(slug);
      setAttestation(att);

      setIsLoading(false);
    };

    loadData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container-app py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 rounded bg-white/10" />
          <div className="h-48 rounded-xl bg-white/5" />
        </div>
      </div>
    );
  }

  const tier = PROJECT_TIERS[slug] || "B";
  const name = PROJECT_NAMES[slug] || slug;

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/developer/console"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Developer Console
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <TierBadge tier={tier} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-white">{name}</h1>
              <p className="mt-1 text-white/60">Project Dossier</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/project/${slug}`}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20"
            >
              <ExternalLink className="h-4 w-4" />
              Xem công khai
            </Link>
            <button className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-black hover:bg-amber-400">
              <Upload className="h-4 w-4" />
              Tải lên tài liệu
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-white/5 p-1">
        {[
          { id: "overview", label: "Tổng quan" },
          { id: "documents", label: "Tài liệu" },
          { id: "evidence", label: "Bằng chứng" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Attestation Card */}
          <div className="lg:col-span-2">
            {attestation ? (
              <AttestationDetails
                attestation={attestation}
                projectName={name}
                locale="vi"
              />
            ) : (
              <GlassCard className="p-8 text-center">
                <Shield className="mx-auto h-16 w-16 text-white/20 mb-4" />
                <h3 className="text-lg font-bold text-white">Chưa có Attestation</h3>
                <p className="mt-2 text-white/60">
                  Dự án này chưa được xác minh trên blockchain
                </p>
                <Link
                  href="/developer/verify"
                  className="mt-4 inline-flex items-center gap-2 text-amber-400 hover:underline"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Yêu cầu xác minh
                </Link>
              </GlassCard>
            )}
          </div>

          {/* Evidence Summary */}
          <div>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">Tiến độ Hồ sơ</h2>
                {evidenceSummary && (
                  <span className="text-2xl font-bold text-white">
                    {evidenceSummary.completionPercentage}%
                  </span>
                )}
              </div>

              {evidenceSummary ? (
                <div>
                  {(Object.keys(EVIDENCE_CATEGORIES) as Array<keyof typeof EVIDENCE_CATEGORIES>).map(
                    (cat) => (
                      <CategoryProgress
                        key={cat}
                        category={cat}
                        data={evidenceSummary.categories[cat]}
                      />
                    )
                  )}
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm">
                    <div className="flex justify-between text-white/60">
                      <span>Tổng tài liệu</span>
                      <span>{evidenceSummary.totalDocuments}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>Đã xác minh</span>
                      <span>{evidenceSummary.verifiedDocuments}</span>
                    </div>
                    <div className="flex justify-between text-amber-400">
                      <span>Chờ duyệt</span>
                      <span>{evidenceSummary.pendingDocuments}</span>
                    </div>
                    <div className="flex justify-between text-orange-400">
                      <span>Hết hạn</span>
                      <span>{evidenceSummary.expiredDocuments}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <FileCheck className="mx-auto h-12 w-12 text-white/20" />
                  <p className="mt-4 text-white/60">Chưa có hồ sơ nào</p>
                  <button className="mt-4 inline-flex items-center gap-2 text-amber-400 hover:underline">
                    <Plus className="h-4 w-4" />
                    Tải lên tài liệu đầu tiên
                  </button>
                </div>
              )}
            </GlassCard>

            {/* Project Info */}
            {project && (
              <GlassCard className="mt-6 p-6">
                <h2 className="font-semibold text-white mb-4">Thông tin dự án</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Trạng thái</span>
                    <span className="text-white capitalize">
                      {project.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Verification Tier</span>
                    <span className="text-white">Tier {project.verificationTier}</span>
                  </div>
                  {project.lastVerified && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Xác minh lần cuối</span>
                      <span className="text-white">
                        {new Date(project.lastVerified).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  )}
                  {project.nextReviewDate && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Review tiếp theo</span>
                      <span className="text-amber-400">
                        {new Date(project.nextReviewDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Tài liệu ({documents.length})
            </h2>
            <button className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-400">
              <Upload className="h-4 w-4" />
              Tải lên
            </button>
          </div>
          <div className="space-y-4">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
            {documents.length === 0 && (
              <GlassCard className="p-12 text-center">
                <FileCheck className="mx-auto h-16 w-16 text-white/20" />
                <p className="mt-4 text-white/60">Chưa có tài liệu nào</p>
                <button className="mt-4 inline-flex items-center gap-2 text-amber-400 hover:underline">
                  <Plus className="h-4 w-4" />
                  Tải lên tài liệu đầu tiên
                </button>
              </GlassCard>
            )}
          </div>
        </div>
      )}

      {activeTab === "evidence" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Bằng chứng xác minh ({evidence.length})
            </h2>
            <Link
              href={`/project/${slug}/evidence`}
              className="flex items-center gap-1 text-sm text-amber-400 hover:underline"
            >
              Xem công khai
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {(Object.keys(EVIDENCE_CATEGORIES) as Array<keyof typeof EVIDENCE_CATEGORIES>).map(
            (category) => {
              const categoryEvidence = evidence.filter(
                (e) => EVIDENCE_TYPES[e.type].category === category
              );
              if (categoryEvidence.length === 0) return null;

              return (
                <GlassCard key={category} className="mb-4 p-4">
                  <h3 className="font-medium text-white mb-3">
                    {EVIDENCE_CATEGORIES[category].nameVi}
                  </h3>
                  {categoryEvidence.map((e) => (
                    <EvidenceCard key={e.id} evidence={e} />
                  ))}
                </GlassCard>
              );
            }
          )}

          {evidence.length === 0 && (
            <GlassCard className="p-12 text-center">
              <Shield className="mx-auto h-16 w-16 text-white/20" />
              <p className="mt-4 text-white/60">Chưa có bằng chứng xác minh</p>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}
