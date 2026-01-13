"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";
import { AttestationBadge } from "@/components/realtera/AttestationBadge";
import {
  ArrowLeft,
  Plus,
  FolderOpen,
  Share2,
  Copy,
  Check,
  Trash2,
  Edit3,
  Link2,
  Clock,
  Eye,
  Building2,
  X,
  Search,
  Users,
} from "lucide-react";
import {
  DEMO_AGENCY,
  getCollectionsByAgency,
  getCollectionById,
  type AgencyCollection,
} from "@/lib/mock/agency-data";
import { getAttestationBySlug } from "@/lib/attestation-service";
import type { AttestationSummary } from "@/lib/attestation-registry";

// Mock project data for demo
const MOCK_PROJECTS: Record<string, { name: string; tier: string; district: string; city: string }> = {
  "vinhomes-grand-park": { name: "Vinhomes Grand Park", tier: "S", district: "Quận 9", city: "TP.HCM" },
  "masteri-thao-dien": { name: "Masteri Thao Dien", tier: "S", district: "Quận 2", city: "TP.HCM" },
  "the-sun-avenue": { name: "The Sun Avenue", tier: "A", district: "Quận 2", city: "TP.HCM" },
  "empire-city": { name: "Empire City", tier: "S", district: "Thủ Đức", city: "TP.HCM" },
  "the-marq": { name: "The Marq", tier: "S+", district: "Quận 1", city: "TP.HCM" },
  "grand-marina": { name: "Grand Marina", tier: "S", district: "Quận 1", city: "TP.HCM" },
  "the-origami": { name: "The Origami", tier: "A", district: "Quận 9", city: "TP.HCM" },
  "s-premium": { name: "S-Premium", tier: "B", district: "Quận 9", city: "TP.HCM" },
};

function CollectionCard({
  collection,
  onSelect,
  isSelected,
}: {
  collection: AgencyCollection;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (collection.shareLink) {
      navigator.clipboard.writeText(`${window.location.origin}/agency/share/${collection.shareLink}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <GlassCard
      className={`p-4 cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-amber-500 bg-amber-500/10" : "hover:bg-white/10"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{collection.name}</h3>
          {collection.clientName && (
            <p className="mt-1 text-sm text-white/60 truncate flex items-center gap-1">
              <Users className="h-3 w-3" />
              {collection.clientName}
            </p>
          )}
        </div>
        <span className="flex-shrink-0 ml-2 rounded-full bg-amber-500/20 px-2 py-1 text-xs text-amber-400">
          {collection.projects.length} dự án
        </span>
      </div>

      {collection.description && (
        <p className="mt-2 text-sm text-white/50 line-clamp-2">{collection.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-white/40">
          <Clock className="h-3 w-3" />
          {new Date(collection.updatedAt).toLocaleDateString("vi-VN")}
        </span>
        <div className="flex items-center gap-2">
          {collection.isPublic && collection.viewCount > 0 && (
            <span className="flex items-center gap-1 text-white/40">
              <Eye className="h-3 w-3" />
              {collection.viewCount}
            </span>
          )}
          {collection.shareLink && (
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

function ProjectItem({
  slug,
  attestation,
  onRemove,
}: {
  slug: string;
  attestation?: AttestationSummary | null;
  onRemove?: () => void;
}) {
  const project = MOCK_PROJECTS[slug];
  if (!project) return null;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
      <TierBadge tier={project.tier as "S" | "A" | "B" | "C" | "D" | "F"} size="sm" />
      <div className="flex-1 min-w-0">
        <Link href={`/project/${slug}`} className="font-medium text-white hover:text-amber-400">
          {project.name}
        </Link>
        <p className="text-sm text-white/50">
          {project.district}, {project.city}
        </p>
      </div>
      {attestation && <AttestationBadge attestation={attestation} size="sm" locale="vi" />}
      {onRemove && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function CreateCollectionModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, call API to create collection
    console.log("Create collection:", { name, description, clientName, isPublic });
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-lg hover:bg-white/10 text-white/60"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-bold text-white mb-6">Tạo Collection mới</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Tên Collection <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Đề xuất Q1 2025 - Anh An"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Mô tả ngắn về collection này..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Khách hàng</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="VD: Nguyễn Văn An"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="isPublic" className="text-sm text-white/80">
              Cho phép chia sẻ công khai
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-medium text-white hover:bg-white/10"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 font-semibold text-black hover:bg-amber-400"
            >
              Tạo Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AgencyCollectionsPage() {
  const searchParams = useSearchParams();
  const showNew = searchParams.get("new") === "true";
  const selectedId = searchParams.get("id");

  const [collections, setCollections] = useState<AgencyCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<AgencyCollection | null>(null);
  const [attestations, setAttestations] = useState<Record<string, AttestationSummary | null>>({});
  const [showCreateModal, setShowCreateModal] = useState(showNew);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadCollections = useCallback(() => {
    const data = getCollectionsByAgency(DEMO_AGENCY.id);
    setCollections(data);

    // If there's a selected ID, find it
    if (selectedId) {
      const found = data.find((c) => c.id === selectedId);
      if (found) setSelectedCollection(found);
    } else if (data.length > 0) {
      setSelectedCollection(data[0]);
    }

    setIsLoading(false);
  }, [selectedId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: load initial data on mount
    loadCollections();
  }, [loadCollections]);

  // Load attestations for selected collection
  useEffect(() => {
    if (!selectedCollection) return;

    const loadAttestations = async () => {
      const results: Record<string, AttestationSummary | null> = {};
      for (const slug of selectedCollection.projects) {
        results[slug] = await getAttestationBySlug(slug);
      }
      setAttestations(results);
    };

    loadAttestations();
  }, [selectedCollection]);

  const filteredCollections = collections.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateShareLink = () => {
    if (!selectedCollection) return;
    // In real app, call API to generate share link
    alert(`Share link: ${window.location.origin}/agency/share/demo-link`);
  };

  if (isLoading) {
    return (
      <div className="container-app py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-white/10" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-xl bg-white/5" />
              ))}
            </div>
            <div className="lg:col-span-2 h-96 rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/agency"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Agency
          </Link>
          <h1 className="text-2xl font-bold text-white">Collections</h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-black hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" />
          Tạo mới
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Collections List */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm collection..."
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none focus:border-amber-500/50"
            />
          </div>

          {/* List */}
          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {filteredCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                isSelected={selectedCollection?.id === collection.id}
                onSelect={() => setSelectedCollection(collection)}
              />
            ))}
            {filteredCollections.length === 0 && (
              <div className="py-12 text-center">
                <FolderOpen className="mx-auto h-12 w-12 text-white/20" />
                <p className="mt-4 text-white/60">Không tìm thấy collection</p>
              </div>
            )}
          </div>
        </div>

        {/* Collection Detail */}
        <div className="lg:col-span-2">
          {selectedCollection ? (
            <GlassCard className="p-6">
              {/* Collection Header */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedCollection.name}</h2>
                  {selectedCollection.clientName && (
                    <p className="mt-1 text-white/60 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {selectedCollection.clientName}
                    </p>
                  )}
                  {selectedCollection.description && (
                    <p className="mt-2 text-sm text-white/50">{selectedCollection.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Share Section */}
              {selectedCollection.isPublic && (
                <div className="mb-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Link2 className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Chia sẻ Collection</p>
                        {selectedCollection.shareLink ? (
                          <p className="text-xs text-white/50">
                            Hết hạn: {selectedCollection.shareExpiry ? new Date(selectedCollection.shareExpiry).toLocaleDateString("vi-VN") : "Không giới hạn"}
                          </p>
                        ) : (
                          <p className="text-xs text-white/50">Chưa có link chia sẻ</p>
                        )}
                      </div>
                    </div>
                    {selectedCollection.shareLink ? (
                      <Link
                        href={`/agency/share/${selectedCollection.shareLink}`}
                        target="_blank"
                        className="flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-1.5 text-sm font-medium text-black hover:bg-cyan-400"
                      >
                        <Eye className="h-4 w-4" />
                        Xem
                      </Link>
                    ) : (
                      <button
                        onClick={handleGenerateShareLink}
                        className="flex items-center gap-2 rounded-lg bg-cyan-500/20 px-3 py-1.5 text-sm font-medium text-cyan-400 hover:bg-cyan-500/30"
                      >
                        <Share2 className="h-4 w-4" />
                        Tạo link
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Projects List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white">
                    Dự án ({selectedCollection.projects.length})
                  </h3>
                  <Link
                    href="/"
                    className="text-sm text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm dự án
                  </Link>
                </div>
                <div className="space-y-3">
                  {selectedCollection.projects.map((slug) => (
                    <ProjectItem
                      key={slug}
                      slug={slug}
                      attestation={attestations[slug]}
                      onRemove={() => {
                        // In real app, call API to remove project
                        console.log("Remove project:", slug);
                      }}
                    />
                  ))}
                  {selectedCollection.projects.length === 0 && (
                    <div className="py-12 text-center">
                      <Building2 className="mx-auto h-12 w-12 text-white/20" />
                      <p className="mt-4 text-white/60">Chưa có dự án nào</p>
                      <Link
                        href="/"
                        className="mt-4 inline-flex items-center gap-2 text-amber-400 hover:underline"
                      >
                        <Plus className="h-4 w-4" />
                        Thêm dự án đầu tiên
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                <span>Tạo: {new Date(selectedCollection.createdAt).toLocaleDateString("vi-VN")}</span>
                <span>Cập nhật: {new Date(selectedCollection.updatedAt).toLocaleDateString("vi-VN")}</span>
                {selectedCollection.viewCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {selectedCollection.viewCount} lượt xem
                  </span>
                )}
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-12 text-center">
              <FolderOpen className="mx-auto h-16 w-16 text-white/20" />
              <p className="mt-4 text-white/60">Chọn một collection để xem chi tiết</p>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateCollectionModal
          onClose={() => setShowCreateModal(false)}
          onCreated={loadCollections}
        />
      )}
    </div>
  );
}
