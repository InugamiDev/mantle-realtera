import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";
import { AttestationBadge } from "@/components/realtera/AttestationBadge";
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Hash,
  Calendar,
  Building2,
  Download,
} from "lucide-react";
import { getAttestationBySlug } from "@/lib/attestation-service";
import {
  getEvidenceByProject,
  getEvidencePackSummary,
  EVIDENCE_CATEGORIES,
  EVIDENCE_TYPES,
  VERIFICATION_TIERS,
  formatFileSize,
  type Evidence,
  type EvidenceCategory,
} from "@/lib/evidence";
import type { Tier } from "@/lib/tier";

// Mock project data
const PROJECTS: Record<string, { name: string; tier: Tier; developer: string }> = {
  "vinhomes-grand-park": { name: "Vinhomes Grand Park", tier: "S", developer: "Vingroup" },
  "masteri-thao-dien": { name: "Masteri Thao Dien", tier: "S", developer: "Masterise Homes" },
  "du-an-tranh-chap": { name: "Dự án Tranh chấp", tier: "D", developer: "ABC Development" },
};

function EvidenceCard({ evidence }: { evidence: Evidence }) {
  const typeConfig = EVIDENCE_TYPES[evidence.type];

  const statusStyles = {
    verified: {
      bg: "bg-emerald-500/10 border-emerald-500/30",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      label: "Đã xác minh",
    },
    pending: {
      bg: "bg-amber-500/10 border-amber-500/30",
      icon: Clock,
      iconColor: "text-amber-400",
      label: "Chờ xác minh",
    },
    rejected: {
      bg: "bg-red-500/10 border-red-500/30",
      icon: XCircle,
      iconColor: "text-red-400",
      label: "Từ chối",
    },
    expired: {
      bg: "bg-orange-500/10 border-orange-500/30",
      icon: AlertTriangle,
      iconColor: "text-orange-400",
      label: "Hết hạn",
    },
  };

  const status = statusStyles[evidence.status];
  const StatusIcon = status.icon;

  return (
    <GlassCard className={`p-4 border ${status.bg}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-4 w-4 ${status.iconColor}`} />
            <h4 className="font-medium text-white">{typeConfig.nameVi}</h4>
          </div>
          <p className="mt-1 text-sm text-white/50">{typeConfig.descriptionVi}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${status.iconColor} bg-white/5`}>
          {status.label}
        </span>
      </div>

      {/* Document Info */}
      <div className="mt-4 p-3 rounded-lg bg-slate-800/50">
        <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
          <FileCheck className="h-4 w-4" />
          {evidence.fileName}
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-white/50">
          <div>
            <span className="block text-white/30">Kích thước</span>
            {formatFileSize(evidence.fileSize)}
          </div>
          <div>
            <span className="block text-white/30">Tải lên</span>
            {new Date(evidence.uploadedAt).toLocaleDateString("vi-VN")}
          </div>
          {evidence.verifiedAt && (
            <div>
              <span className="block text-white/30">Xác minh</span>
              {new Date(evidence.verifiedAt).toLocaleDateString("vi-VN")}
            </div>
          )}
          {evidence.expiresAt && (
            <div>
              <span className="block text-white/30">Hết hạn</span>
              <span className={evidence.status === "expired" ? "text-orange-400" : ""}>
                {new Date(evidence.expiresAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      {(evidence.metadata.documentNumber || evidence.metadata.issuingAuthority) && (
        <div className="mt-3 text-xs text-white/50">
          {evidence.metadata.documentNumber && (
            <div className="flex items-center gap-1">
              <span className="text-white/30">Số:</span>
              {evidence.metadata.documentNumber}
            </div>
          )}
          {evidence.metadata.issuingAuthority && (
            <div className="flex items-center gap-1">
              <span className="text-white/30">Cơ quan:</span>
              {evidence.metadata.issuingAuthority}
            </div>
          )}
        </div>
      )}

      {/* Blockchain Reference */}
      {evidence.blockchainRef && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-cyan-400">
            <Hash className="h-3 w-3" />
            <span className="font-mono truncate">
              {evidence.blockchainRef.txHash.slice(0, 20)}...
            </span>
            <a
              href={`https://explorer.sepolia.mantle.xyz/tx/${evidence.blockchainRef.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto hover:text-cyan-300"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

function CategorySection({
  category,
  evidence,
}: {
  category: EvidenceCategory;
  evidence: Evidence[];
}) {
  const config = EVIDENCE_CATEGORIES[category];
  const verified = evidence.filter((e) => e.status === "verified").length;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{config.nameVi}</h2>
          <p className="text-sm text-white/50">{config.descriptionVi}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">{verified}/{evidence.length}</span>
          <p className="text-xs text-white/40">documents verified</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {evidence.map((e) => (
          <EvidenceCard key={e.id} evidence={e} />
        ))}
      </div>
    </div>
  );
}

export default async function EvidencePackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS[slug];

  if (!project) {
    notFound();
  }

  const evidence = getEvidenceByProject(slug);
  const summary = getEvidencePackSummary(slug);
  const attestation = await getAttestationBySlug(slug);

  // Group evidence by category
  const evidenceByCategory = (Object.keys(EVIDENCE_CATEGORIES) as EvidenceCategory[]).reduce(
    (acc, cat) => {
      acc[cat] = evidence.filter((e) => EVIDENCE_TYPES[e.type].category === cat);
      return acc;
    },
    {} as Record<EvidenceCategory, Evidence[]>
  );

  const verificationTier = attestation?.tier || 0;
  const tierInfo = VERIFICATION_TIERS[verificationTier];

  return (
    <div className="container-app py-8">
      {/* Back Link */}
      <Link
        href={`/project/${slug}`}
        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Về trang dự án
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <TierBadge tier={project.tier} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <p className="text-white/60">Evidence Pack - Hồ sơ Pháp lý</p>
            </div>
          </div>
          {attestation && (
            <AttestationBadge attestation={attestation} size="lg" locale="vi" />
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <GlassCard className="p-4 text-center">
          <FileCheck className="mx-auto h-8 w-8 text-amber-400 mb-2" />
          <p className="text-2xl font-bold text-white">{summary?.totalDocuments || 0}</p>
          <p className="text-sm text-white/50">Tổng tài liệu</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
          <p className="text-2xl font-bold text-white">{summary?.verifiedDocuments || 0}</p>
          <p className="text-sm text-white/50">Đã xác minh</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <Shield className="mx-auto h-8 w-8 text-cyan-400 mb-2" />
          <p className="text-2xl font-bold text-white">{summary?.completionPercentage || 0}%</p>
          <p className="text-sm text-white/50">Hoàn thành</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <ShieldCheck className={`mx-auto h-8 w-8 mb-2 ${
            tierInfo.color === "emerald" ? "text-emerald-400" :
            tierInfo.color === "amber" ? "text-amber-400" :
            tierInfo.color === "cyan" ? "text-cyan-400" :
            tierInfo.color === "blue" ? "text-blue-400" :
            "text-gray-400"
          }`} />
          <p className="text-2xl font-bold text-white">Tier {verificationTier}</p>
          <p className="text-sm text-white/50">{tierInfo.nameVi}</p>
        </GlassCard>
      </div>

      {/* Tier Info */}
      {attestation && (
        <GlassCard className="p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className={`rounded-xl p-3 ${
              tierInfo.color === "emerald" ? "bg-emerald-500/20 text-emerald-400" :
              tierInfo.color === "amber" ? "bg-amber-500/20 text-amber-400" :
              tierInfo.color === "cyan" ? "bg-cyan-500/20 text-cyan-400" :
              tierInfo.color === "blue" ? "bg-blue-500/20 text-blue-400" :
              "bg-gray-500/20 text-gray-400"
            }`}>
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">
                {tierInfo.name} - {tierInfo.nameVi}
              </h3>
              <p className="mt-1 text-white/60">{tierInfo.descriptionVi}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {tierInfo.requirementsVi.map((req, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 px-2 py-1 rounded-full"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Evidence by Category */}
      {evidence.length > 0 ? (
        (Object.keys(EVIDENCE_CATEGORIES) as EvidenceCategory[]).map((cat) => {
          const catEvidence = evidenceByCategory[cat];
          if (catEvidence.length === 0) return null;
          return (
            <CategorySection key={cat} category={cat} evidence={catEvidence} />
          );
        })
      ) : (
        <GlassCard className="p-12 text-center">
          <Shield className="mx-auto h-16 w-16 text-white/20 mb-4" />
          <h3 className="text-lg font-bold text-white">Chưa có hồ sơ</h3>
          <p className="mt-2 text-white/60">
            Dự án này chưa có hồ sơ pháp lý được công khai
          </p>
        </GlassCard>
      )}

      {/* Verification Link */}
      <div className="mt-8 text-center">
        <Link
          href={`/verify?q=${slug}`}
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
        >
          <ShieldCheck className="h-5 w-5" />
          Xác minh Attestation trên Blockchain
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
