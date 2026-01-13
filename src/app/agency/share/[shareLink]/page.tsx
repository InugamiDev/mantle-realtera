import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";
import { AttestationBadge } from "@/components/realtera/AttestationBadge";
import {
  Building2,
  Shield,
  ShieldCheck,
  Calendar,
  MapPin,
  ExternalLink,
  Share2,
  FileCheck,
  Clock,
} from "lucide-react";
import { getCollectionByShareLink } from "@/lib/mock/agency-data";
import { getAttestationBySlug } from "@/lib/attestation-service";
import { getEvidencePackSummary } from "@/lib/evidence";
import type { AttestationSummary } from "@/lib/attestation-registry";
import type { Tier } from "@/lib/tier";

// Mock project data for demo
const MOCK_PROJECTS: Record<string, {
  name: string;
  tier: Tier;
  district: string;
  city: string;
  developer: string;
  status: string;
  image?: string;
}> = {
  "vinhomes-grand-park": {
    name: "Vinhomes Grand Park",
    tier: "S",
    district: "Quận 9",
    city: "TP.HCM",
    developer: "Vingroup",
    status: "Đang bàn giao",
  },
  "masteri-thao-dien": {
    name: "Masteri Thao Dien",
    tier: "S",
    district: "Quận 2",
    city: "TP.HCM",
    developer: "Masterise Homes",
    status: "Đã hoàn thành",
  },
  "the-sun-avenue": {
    name: "The Sun Avenue",
    tier: "A",
    district: "Quận 2",
    city: "TP.HCM",
    developer: "Novaland",
    status: "Đã hoàn thành",
  },
  "empire-city": {
    name: "Empire City",
    tier: "S",
    district: "Thủ Đức",
    city: "TP.HCM",
    developer: "Keppel Land",
    status: "Đang xây dựng",
  },
  "the-marq": {
    name: "The Marq",
    tier: "S+",
    district: "Quận 1",
    city: "TP.HCM",
    developer: "Hongkong Land",
    status: "Đang xây dựng",
  },
};

interface ProjectCardProps {
  slug: string;
  attestation: AttestationSummary | null;
  evidenceCompletion: number;
}

function ProjectCard({ slug, attestation, evidenceCompletion }: ProjectCardProps) {
  const project = MOCK_PROJECTS[slug];
  if (!project) return null;

  return (
    <GlassCard className="overflow-hidden">
      {/* Project Header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <TierBadge tier={project.tier} />
          <div className="flex-1 min-w-0">
            <Link
              href={`/project/${slug}`}
              className="text-lg font-bold text-white hover:text-amber-400 line-clamp-1"
            >
              {project.name}
            </Link>
            <div className="mt-1 flex items-center gap-3 text-sm text-white/60">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {project.district}, {project.city}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/50">
              Chủ đầu tư: {project.developer}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="px-5 py-4 bg-white/5 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {attestation ? (
              <>
                <AttestationBadge attestation={attestation} size="sm" locale="vi" />
                <div className="text-sm">
                  <p className="text-white/80">
                    Tier {attestation.tier}: {attestation.tier === 4 ? "Giám sát" : attestation.tier === 3 ? "Xác nhận" : attestation.tier === 2 ? "Xác minh" : "Cơ bản"}
                  </p>
                  <p className="text-white/50">
                    {attestation.checksPassed.length}/8 checks passed
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-lg bg-gray-500/20 p-2">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <div className="text-sm">
                  <p className="text-white/60">Chưa xác minh</p>
                  <p className="text-white/40">Attestation pending</p>
                </div>
              </>
            )}
          </div>
          <Link
            href={`/project/${slug}`}
            className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300"
          >
            Chi tiết
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Evidence Progress */}
        {evidenceCompletion > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-white/60 flex items-center gap-1">
                <FileCheck className="h-3 w-3" />
                Hồ sơ pháp lý
              </span>
              <span className="text-white/80">{evidenceCompletion}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                style={{ width: `${evidenceCompletion}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="px-5 py-3 border-t border-white/10">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
          project.status === "Đã hoàn thành" ? "text-emerald-400" :
          project.status === "Đang xây dựng" ? "text-amber-400" :
          "text-blue-400"
        }`}>
          <Clock className="h-3 w-3" />
          {project.status}
        </span>
      </div>
    </GlassCard>
  );
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ shareLink: string }>;
}) {
  const { shareLink } = await params;
  const collection = getCollectionByShareLink(shareLink);

  if (!collection) {
    notFound();
  }

  // Check if share link expired
  if (collection.shareExpiry && new Date(collection.shareExpiry) < new Date()) {
    return (
      <div className="container-app py-12">
        <GlassCard className="mx-auto max-w-lg p-12 text-center">
          <Clock className="mx-auto h-16 w-16 text-orange-400 mb-4" />
          <h1 className="text-2xl font-bold text-white">Link đã hết hạn</h1>
          <p className="mt-2 text-white/60">
            Link chia sẻ này đã hết hạn. Vui lòng liên hệ đại lý để nhận link mới.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 font-medium text-black hover:bg-amber-400"
          >
            Về trang chủ
          </Link>
        </GlassCard>
      </div>
    );
  }

  // Load attestations for all projects
  const attestations: Record<string, AttestationSummary | null> = {};
  const evidenceCompletions: Record<string, number> = {};

  for (const slug of collection.projects) {
    attestations[slug] = await getAttestationBySlug(slug);
    const evidence = getEvidencePackSummary(slug);
    evidenceCompletions[slug] = evidence?.completionPercentage || 0;
  }

  // Count verified projects
  const verifiedCount = Object.values(attestations).filter(
    (a) => a?.isValid && a.tier >= 2
  ).length;

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-4 py-2 text-sm text-cyan-400 mb-4">
          <Share2 className="h-4 w-4" />
          Shared Collection
        </div>
        <h1 className="text-3xl font-bold text-white">{collection.name}</h1>
        {collection.description && (
          <p className="mt-2 text-white/60 max-w-2xl mx-auto">{collection.description}</p>
        )}
        {collection.clientName && (
          <p className="mt-3 text-sm text-white/40">
            Chuẩn bị cho: <span className="text-white/60">{collection.clientName}</span>
          </p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
        <GlassCard className="p-4 text-center">
          <Building2 className="mx-auto h-6 w-6 text-amber-400 mb-2" />
          <p className="text-2xl font-bold text-white">{collection.projects.length}</p>
          <p className="text-sm text-white/60">Dự án</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <ShieldCheck className="mx-auto h-6 w-6 text-emerald-400 mb-2" />
          <p className="text-2xl font-bold text-white">{verifiedCount}</p>
          <p className="text-sm text-white/60">Đã xác minh</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <Calendar className="mx-auto h-6 w-6 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-white">
            {new Date(collection.updatedAt).toLocaleDateString("vi-VN")}
          </p>
          <p className="text-sm text-white/60">Cập nhật</p>
        </GlassCard>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collection.projects.map((slug) => (
          <ProjectCard
            key={slug}
            slug={slug}
            attestation={attestations[slug]}
            evidenceCompletion={evidenceCompletions[slug]}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 text-white/40 text-sm">
          <ShieldCheck className="h-4 w-4" />
          Powered by RealTera Verification
        </div>
        <p className="mt-2 text-xs text-white/30">
          Dữ liệu xác minh được lưu trữ trên Mantle blockchain
        </p>
        <div className="mt-4">
          <Link
            href="/verify"
            className="text-cyan-400 hover:text-cyan-300 text-sm inline-flex items-center gap-1"
          >
            Kiểm tra attestation
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Expiry Warning */}
      {collection.shareExpiry && (
        <div className="mt-8 text-center">
          <p className="text-xs text-white/30">
            Link này hết hạn vào {new Date(collection.shareExpiry).toLocaleDateString("vi-VN")}
          </p>
        </div>
      )}
    </div>
  );
}
