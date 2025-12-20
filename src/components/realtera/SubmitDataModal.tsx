"use client";

import { useState } from "react";
import { X, FileText, AlertCircle, CheckCircle } from "lucide-react";

interface SubmitDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  projectSlug: string;
}

export function SubmitDataModal({ isOpen, onClose, projectName, projectSlug }: SubmitDataModalProps) {
  const [formData, setFormData] = useState({
    type: "correction",
    contactEmail: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Replace with actual API call
    // The projectSlug identifies which project this submission is for
    console.log("Submitting data for project:", projectSlug, formData);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormData({ type: "correction", contactEmail: "", message: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          // Success state
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle className="h-7 w-7 text-emerald-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Cảm ơn bạn!</h3>
            <p className="mb-6 text-white/60">
              Thông tin đã được gửi. Chúng tôi sẽ xem xét và cập nhật trong 3-5 ngày làm việc.
            </p>
            <button
              onClick={handleClose}
              className="rounded-lg bg-white/10 px-6 py-2.5 font-medium text-white transition-colors hover:bg-white/20"
            >
              Đóng
            </button>
          </div>
        ) : (
          // Form state
          <>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Cập nhật thông tin</h3>
              <p className="mt-1 text-sm text-white/60">
                Dự án: <span className="font-medium text-amber-400">{projectName}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type selection */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "correction" })}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                    formData.type === "correction"
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                      : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Cập nhật
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "report" })}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                    formData.type === "report"
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                      : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                  Báo sai sót
                </button>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="modal-email" className="mb-1.5 block text-sm font-medium text-white">
                  Email liên hệ <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="modal-email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="modal-message" className="mb-1.5 block text-sm font-medium text-white">
                  Nội dung <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="modal-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={
                    formData.type === "correction"
                      ? "Mô tả thông tin cần cập nhật (VD: Đã cấp sổ hồng, giá mới...)"
                      : "Mô tả thông tin sai sót cần báo cáo..."
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-medium text-white transition-colors hover:bg-white/10"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 font-semibold text-black transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi"}
                </button>
              </div>
            </form>

            {/* Link to full form */}
            <p className="mt-4 text-center text-xs text-white/40">
              Cần gửi tài liệu?{" "}
              <a href="/submit-data" className="text-amber-400 hover:underline">
                Sử dụng form đầy đủ
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
