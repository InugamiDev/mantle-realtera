"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/realtera/GlassCard";
import {
  ArrowLeft,
  Upload,
  Shield,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Circle,
  ArrowRight,
  Info,
  AlertTriangle,
  Search,
} from "lucide-react";
import { VERIFICATION_TIERS, EVIDENCE_CATEGORIES, EVIDENCE_TYPES } from "@/lib/evidence";

function TierCard({
  tier,
  isSelected,
  onSelect,
  currentTier,
}: {
  tier: typeof VERIFICATION_TIERS[number];
  isSelected: boolean;
  onSelect: () => void;
  currentTier: number;
}) {
  const isAvailable = tier.tier > currentTier;
  const isCurrent = tier.tier === currentTier;

  return (
    <button
      onClick={onSelect}
      disabled={!isAvailable}
      className={`text-left p-4 rounded-xl border transition-all ${
        isSelected
          ? "border-amber-500 bg-amber-500/10"
          : isAvailable
          ? "border-white/10 hover:border-white/30 hover:bg-white/5"
          : "border-white/5 bg-white/5 opacity-50 cursor-not-allowed"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`rounded-lg p-2 ${
          tier.color === "emerald" ? "bg-emerald-500/20 text-emerald-400" :
          tier.color === "amber" ? "bg-amber-500/20 text-amber-400" :
          tier.color === "cyan" ? "bg-cyan-500/20 text-cyan-400" :
          tier.color === "blue" ? "bg-blue-500/20 text-blue-400" :
          "bg-gray-500/20 text-gray-400"
        }`}>
          <ShieldCheck className="h-5 w-5" />
        </div>
        {isSelected ? (
          <CheckCircle2 className="h-5 w-5 text-amber-400" />
        ) : isCurrent ? (
          <span className="text-xs text-white/40">Current</span>
        ) : isAvailable ? (
          <Circle className="h-5 w-5 text-white/20" />
        ) : (
          <span className="text-xs text-white/40">Locked</span>
        )}
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">Tier {tier.tier}</span>
          <span className="text-white/60">-</span>
          <span className="text-white/80">{tier.nameVi}</span>
        </div>
        <p className="mt-1 text-sm text-white/50">{tier.descriptionVi}</p>
      </div>
      {tier.requirementsVi.length > 0 && (
        <ul className="mt-3 space-y-1">
          {tier.requirementsVi.map((req, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-white/40">
              <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
              {req}
            </li>
          ))}
        </ul>
      )}
    </button>
  );
}

function DocumentChecklist({
  selectedTier,
}: {
  selectedTier: number;
}) {
  const requiredDocs = Object.entries(EVIDENCE_TYPES)
    .filter(([, config]) => config.required)
    .map(([type, config]) => ({
      type,
      ...config,
    }));

  const categoryGroups = Object.keys(EVIDENCE_CATEGORIES) as Array<keyof typeof EVIDENCE_CATEGORIES>;

  return (
    <div className="space-y-4">
      {categoryGroups.map((category) => {
        const docs = requiredDocs.filter((d) => d.category === category);
        if (docs.length === 0) return null;

        return (
          <div key={category} className="rounded-xl bg-white/5 p-4">
            <h4 className="font-medium text-white mb-3">
              {EVIDENCE_CATEGORIES[category].nameVi}
              <span className="ml-2 text-xs text-white/40">
                ({Math.round(EVIDENCE_CATEGORIES[category].weight * 100)}%)
              </span>
            </h4>
            <div className="space-y-2">
              {docs.map((doc) => (
                <div key={doc.type} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-white/80">{doc.nameVi}</p>
                    <p className="text-xs text-white/40">{doc.descriptionVi}</p>
                  </div>
                  {doc.required && (
                    <span className="text-xs text-red-400">Bắt buộc</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function VerificationRequestPage() {
  const [step, setStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTier, setSelectedTier] = useState(2);
  const currentTier = 1; // Mock: current tier for selected project

  // Mock projects
  const projects = [
    { slug: "vinhomes-grand-park", name: "Vinhomes Grand Park", currentTier: 4 },
    { slug: "the-global-city", name: "The Global City", currentTier: 3 },
    { slug: "new-project-2025", name: "New Project 2025", currentTier: 0 },
  ];

  const handleSubmit = () => {
    // Mock submission
    alert("Yêu cầu xác minh đã được gửi thành công!");
    // In real app, would call API and redirect
  };

  return (
    <div className="container-app py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/developer/console"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Developer Console
        </Link>
        <h1 className="text-2xl font-bold text-white">Yêu cầu Xác minh</h1>
        <p className="mt-1 text-white/60">
          Nâng cấp tier xác minh cho dự án của bạn
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "Chọn dự án" },
            { num: 2, label: "Chọn tier" },
            { num: 3, label: "Tài liệu" },
            { num: 4, label: "Xác nhận" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s.num
                    ? "bg-amber-500 text-black"
                    : "bg-white/10 text-white/40"
                }`}>
                  {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
                </div>
                <span className={`mt-2 text-xs ${
                  step >= s.num ? "text-white" : "text-white/40"
                }`}>
                  {s.label}
                </span>
              </div>
              {i < 3 && (
                <div className={`w-full h-0.5 mx-2 ${
                  step > s.num ? "bg-amber-500" : "bg-white/10"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <GlassCard className="p-6">
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Chọn dự án cần xác minh
            </h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Tìm kiếm dự án..."
                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-white/40 outline-none focus:border-amber-500/50"
              />
            </div>
            <div className="space-y-3">
              {projects.map((project) => (
                <button
                  key={project.slug}
                  onClick={() => setSelectedProject(project.slug)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedProject === project.slug
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">{project.name}</h3>
                      <p className="text-sm text-white/50">
                        Current: Tier {project.currentTier}
                      </p>
                    </div>
                    {selectedProject === project.slug ? (
                      <CheckCircle2 className="h-5 w-5 text-amber-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-white/20" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Chọn tier xác minh mục tiêu
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {VERIFICATION_TIERS.filter((t) => t.tier > 0).map((tier) => (
                <TierCard
                  key={tier.tier}
                  tier={tier}
                  isSelected={selectedTier === tier.tier}
                  onSelect={() => setSelectedTier(tier.tier)}
                  currentTier={currentTier}
                />
              ))}
            </div>
            <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <div className="text-sm text-white/80">
                  <p className="font-medium text-blue-400">Lưu ý</p>
                  <p className="mt-1">
                    Tier cao hơn yêu cầu nhiều tài liệu hơn và thời gian xác minh lâu hơn.
                    Tier 3-4 yêu cầu đối tác độc lập đồng ký xác nhận.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Tài liệu cần thiết cho Tier {selectedTier}
            </h2>
            <DocumentChecklist selectedTier={selectedTier} />
            <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <Upload className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-400">Tải lên tài liệu</p>
                  <p className="mt-1 text-white/70">
                    Bạn có thể tải lên tài liệu trước hoặc sau khi gửi yêu cầu.
                    Tất cả tài liệu bắt buộc phải được tải lên trước khi xác minh hoàn tất.
                  </p>
                  <Link
                    href={`/developer/console/${selectedProject}`}
                    className="mt-2 inline-flex items-center gap-1 text-amber-400 hover:underline"
                  >
                    Quản lý tài liệu dự án
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Xác nhận yêu cầu
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-sm text-white/50">Dự án</p>
                <p className="font-medium text-white">
                  {projects.find((p) => p.slug === selectedProject)?.name || selectedProject}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-sm text-white/50">Tier mục tiêu</p>
                <p className="font-medium text-white">
                  Tier {selectedTier}: {VERIFICATION_TIERS[selectedTier].nameVi}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-sm text-white/50">Thời gian xử lý ước tính</p>
                <p className="font-medium text-white">
                  {selectedTier <= 2 ? "3-5 ngày làm việc" :
                   selectedTier === 3 ? "7-10 ngày làm việc" :
                   "10-15 ngày làm việc"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-cyan-400">Cam kết</p>
                    <p className="mt-1 text-white/70">
                      Tất cả thông tin được cung cấp là chính xác và đầy đủ.
                      RealTera có quyền từ chối hoặc thu hồi xác minh nếu phát hiện thông tin sai lệch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Quay lại
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !selectedProject}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiếp tục
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium hover:from-cyan-600 hover:to-cyan-700"
            >
              <ShieldCheck className="h-4 w-4" />
              Gửi yêu cầu xác minh
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
