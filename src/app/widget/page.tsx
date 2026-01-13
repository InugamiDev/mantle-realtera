"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Code, Image, FileCode } from "lucide-react";
import { developers } from "@/data/mockProjects";
import { GlassCard } from "@/components/realtera/GlassCard";
import { TierBadge } from "@/components/realtera/TierBadge";

type Theme = "dark" | "light";
type Size = "sm" | "md" | "lg";
type Format = "iframe" | "image" | "markdown";

const developerList = Object.values(developers);

export default function WidgetPage() {
  const [selectedDeveloper, setSelectedDeveloper] = useState(developerList[0]?.slug || "");
  const [theme, setTheme] = useState<Theme>("dark");
  const [size, setSize] = useState<Size>("md");
  const [format, setFormat] = useState<Format>("iframe");
  const [embedCodes, setEmbedCodes] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    if (!selectedDeveloper) return;

    const fetchWidgetData = async () => {
      try {
        const res = await fetch(
          `/api/v1/widget/${selectedDeveloper}?type=developer&theme=${theme}&size=${size}`
        );
        const data = await res.json();
        setEmbedCodes(data.embedCodes || {});
        setPreviewUrl(data.previewUrl || "");
      } catch (error) {
        console.error("Failed to fetch widget data:", error);
      }
    };

    fetchWidgetData();
  }, [selectedDeveloper, theme, size]);

  const currentCode = format === "iframe"
    ? embedCodes.iframe
    : format === "image"
    ? embedCodes.image
    : embedCodes.markdown;

  const copyToClipboard = () => {
    if (currentCode) {
      navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const selectedDev = developerList.find(d => d.slug === selectedDeveloper);

  const sizes = {
    sm: { width: 120, height: 40 },
    md: { width: 180, height: 60 },
    lg: { width: 240, height: 80 },
  };

  return (
    <div className="container-app py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Bảng Xếp Hạng
      </Link>

      {/* Header */}
      <header className="page-header">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Code className="h-5 w-5 text-cyan-400" />
          <span className="text-sm font-medium uppercase tracking-wider text-cyan-400">
            Embeddable Widgets
          </span>
        </div>
        <h1 className="page-title">Widget nhúng xếp hạng</h1>
        <p className="page-subtitle">
          Nhúng badge xếp hạng RealTera vào website của bạn
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Configuration Panel */}
        <GlassCard className="p-6">
          <h2 className="mb-6 text-lg font-bold text-foreground">Cấu hình Widget</h2>

          {/* Developer Select */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Chọn chủ đầu tư
            </label>
            <select
              value={selectedDeveloper}
              onChange={(e) => setSelectedDeveloper(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-foreground"
            >
              {developerList.map((dev) => (
                <option key={dev.slug} value={dev.slug}>
                  {dev.name} ({dev.tier})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Select */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Giao diện
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                  theme === "dark"
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                    : "border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                }`}
              >
                🌙 Tối
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                  theme === "light"
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                    : "border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                }`}
              >
                ☀️ Sáng
              </button>
            </div>
          </div>

          {/* Size Select */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Kích thước
            </label>
            <div className="flex gap-3">
              {(["sm", "md", "lg"] as Size[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                    size === s
                      ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                      : "border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                  }`}
                >
                  {s === "sm" ? "Nhỏ" : s === "md" ? "Vừa" : "Lớn"}
                </button>
              ))}
            </div>
          </div>

          {/* Format Select */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Định dạng
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setFormat("iframe")}
                className={`flex-1 rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
                  format === "iframe"
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                    : "border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                }`}
              >
                <FileCode className="mx-auto mb-1 h-4 w-4" />
                iFrame
              </button>
              <button
                onClick={() => setFormat("image")}
                className={`flex-1 rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
                  format === "image"
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                    : "border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                }`}
              >
                <Image className="mx-auto mb-1 h-4 w-4" />
                Image
              </button>
              <button
                onClick={() => setFormat("markdown")}
                className={`flex-1 rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
                  format === "markdown"
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                    : "border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                }`}
              >
                <Code className="mx-auto mb-1 h-4 w-4" />
                Markdown
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Preview & Code Panel */}
        <div className="space-y-6">
          {/* Preview */}
          <GlassCard className="p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">Xem trước</h2>
            <div
              className={`flex items-center justify-center rounded-lg p-8 ${
                theme === "dark" ? "bg-[#0f0c19]" : "bg-white"
              }`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Widget preview"
                  width={sizes[size].width}
                  height={sizes[size].height}
                />
              ) : (
                <div className="text-muted-foreground">Loading...</div>
              )}
            </div>
            {selectedDev && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedDev.name}
                </span>
                <TierBadge tier={selectedDev.tier} size="sm" />
              </div>
            )}
          </GlassCard>

          {/* Embed Code */}
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Mã nhúng</h2>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/30"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Đã sao chép!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Sao chép
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-black/50 p-4 text-sm text-emerald-400">
              <code>{currentCode || "Loading..."}</code>
            </pre>
          </GlassCard>
        </div>
      </div>

      {/* Usage Guide */}
      <GlassCard className="mt-8 p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">Hướng dẫn sử dụng</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold text-cyan-400">iFrame</h3>
            <p className="text-sm text-muted-foreground">
              Dán mã HTML vào website của bạn. Widget sẽ tự động cập nhật khi xếp hạng thay đổi.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-cyan-400">Image</h3>
            <p className="text-sm text-muted-foreground">
              Sử dụng cho email signatures, forum posts, hoặc nơi không hỗ trợ iFrame.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-cyan-400">Markdown</h3>
            <p className="text-sm text-muted-foreground">
              Dùng cho GitHub README, documentation, hoặc các platform hỗ trợ Markdown.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
