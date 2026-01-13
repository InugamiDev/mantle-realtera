"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, FileText, AlertCircle, CheckCircle, Upload } from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";

type SubmissionType = "claim" | "correction" | "document" | "report";

interface FormData {
  type: SubmissionType;
  projectName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organization: string;
  role: string;
  message: string;
  documentUrls: string;
}

export default function SubmitDataPage() {
  const [formData, setFormData] = useState<FormData>({
    type: "correction",
    projectName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    organization: "",
    role: "",
    message: "",
    documentUrls: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submissionTypes = [
    {
      id: "claim" as SubmissionType,
      icon: Building2,
      title: "Xác nhận chủ đầu tư",
      description: "Tôi là đại diện chủ đầu tư và muốn xác nhận quyền quản lý thông tin dự án",
    },
    {
      id: "correction" as SubmissionType,
      icon: FileText,
      title: "Cập nhật thông tin",
      description: "Cung cấp thông tin chính xác hoặc cập nhật mới về dự án",
    },
    {
      id: "document" as SubmissionType,
      icon: Upload,
      title: "Gửi tài liệu pháp lý",
      description: "Cung cấp giấy phép xây dựng, sổ đỏ, quy hoạch 1/500 hoặc tài liệu chính thức khác",
    },
    {
      id: "report" as SubmissionType,
      icon: AlertCircle,
      title: "Báo cáo sai sót",
      description: "Báo cáo thông tin không chính xác hoặc gây hiểu lầm",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="container-app py-8">
        <div className="mx-auto max-w-2xl">
          <GlassCard className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">Đã gửi thành công!</h1>
            <p className="mb-6 text-white/60">
              Cảm ơn bạn đã đóng góp thông tin. Đội ngũ RealTera sẽ xem xét và phản hồi trong vòng 3-5 ngày làm việc.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/"
                className="rounded-lg bg-white/10 px-6 py-2.5 font-medium text-white transition-colors hover:bg-white/20"
              >
                Về trang chủ
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    type: "correction",
                    projectName: "",
                    contactName: "",
                    contactEmail: "",
                    contactPhone: "",
                    organization: "",
                    role: "",
                    message: "",
                    documentUrls: "",
                  });
                }}
                className="rounded-lg bg-amber-500 px-6 py-2.5 font-medium text-black transition-colors hover:bg-amber-400"
              >
                Gửi thông tin khác
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Cập nhật thông tin dự án</h1>
        <p className="text-white/60">
          Giúp RealTera cải thiện chất lượng dữ liệu bằng cách cung cấp thông tin chính xác về dự án
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Submission type selection */}
        <div className="lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-white">Loại yêu cầu</h2>
          <div className="space-y-3">
            {submissionTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.type === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.id })}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-amber-500/50 bg-amber-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        isSelected ? "bg-amber-500/20 text-amber-400" : "bg-white/10 text-white/60"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`font-medium ${isSelected ? "text-amber-400" : "text-white"}`}>
                        {type.title}
                      </h3>
                      <p className="mt-1 text-sm text-white/50">{type.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project name */}
              <div>
                <label htmlFor="projectName" className="mb-2 block text-sm font-medium text-white">
                  Tên dự án <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="projectName"
                  required
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="VD: Vinhomes Grand Park"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50 focus:bg-white/10"
                />
              </div>

              {/* Contact info row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contactName" className="mb-2 block text-sm font-medium text-white">
                    Họ và tên <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50 focus:bg-white/10"
                  />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="mb-2 block text-sm font-medium text-white">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50 focus:bg-white/10"
                  />
                </div>
              </div>

              {/* Organization row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="organization" className="mb-2 block text-sm font-medium text-white">
                    Công ty / Tổ chức
                  </label>
                  <input
                    type="text"
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="VD: Công ty CP Vinhomes"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50 focus:bg-white/10"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="mb-2 block text-sm font-medium text-white">
                    Vai trò
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-amber-500/50 focus:bg-white/10"
                  >
                    <option value="">Chọn vai trò</option>
                    <option value="developer">Chủ đầu tư</option>
                    <option value="agent">Môi giới / Đại lý</option>
                    <option value="buyer">Khách hàng / Cư dân</option>
                    <option value="journalist">Nhà báo / Phóng viên</option>
                    <option value="government">Cơ quan nhà nước</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-white">
                  Nội dung chi tiết <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={
                    formData.type === "claim"
                      ? "Mô tả về dự án và lý do bạn muốn xác nhận quyền quản lý..."
                      : formData.type === "document"
                        ? "Mô tả các tài liệu bạn muốn cung cấp (giấy phép xây dựng, sổ đỏ, quy hoạch 1/500...)"
                        : formData.type === "report"
                          ? "Mô tả thông tin sai sót cần báo cáo..."
                          : "Mô tả thông tin cần cập nhật..."
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50 focus:bg-white/10"
                />
              </div>

              {/* Document URLs */}
              {(formData.type === "document" || formData.type === "claim") && (
                <div>
                  <label htmlFor="documentUrls" className="mb-2 block text-sm font-medium text-white">
                    Link tài liệu (Google Drive, Dropbox...)
                  </label>
                  <input
                    type="text"
                    id="documentUrls"
                    value={formData.documentUrls}
                    onChange={(e) => setFormData({ ...formData, documentUrls: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50 focus:bg-white/10"
                  />
                  <p className="mt-1.5 text-xs text-white/40">
                    Vui lòng chia sẻ quyền xem cho email: contact@lethanhdanh.id.vn
                  </p>
                </div>
              )}

              {/* Submit button */}
              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <p className="text-xs text-white/40">
                  Thông tin sẽ được xem xét trong 3-5 ngày làm việc
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-amber-500 px-8 py-3 font-semibold text-black transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
