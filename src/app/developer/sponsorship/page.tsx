"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSafeStackUser } from "@/stack/safe-hooks";
import {
  ArrowLeft,
  Sparkles,
  Clock,
  TrendingUp,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  CreditCard,
} from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";
import { getAllDevelopers, getProjectsByDeveloper } from "@/data/mockProjects";

interface Auction {
  id: string;
  slotType: string;
  slotName: string;
  description: string;
  startTime: string;
  endTime: string;
  minBid: number;
  currentBid: number | null;
  currentBidder: { name: string; slug: string } | null;
  bidCount: number;
  status: string;
  duration: string;
}

function SponsorshipContent() {
  const user = useSafeStackUser();
  const searchParams = useSearchParams();
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check for success/cancel from Stripe redirect
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      setMessage({
        type: "success",
        text: "Thanh toán thành công! Bid của bạn đã được ghi nhận.",
      });
    } else if (canceled === "true") {
      setMessage({
        type: "error",
        text: "Thanh toán đã bị hủy. Bạn có thể thử lại.",
      });
    }
  }, [searchParams]);

  // Fetch auctions from API
  useEffect(() => {
    async function fetchAuctions() {
      try {
        const res = await fetch("/api/v1/auctions?status=active");
        if (res.ok) {
          const data = await res.json();
          setAuctions(data.auctions);
        } else {
          // Fall back to mock data if API fails
          setAuctions(getMockAuctions());
        }
      } catch {
        // Fall back to mock data
        setAuctions(getMockAuctions());
      } finally {
        setIsLoading(false);
      }
    }

    fetchAuctions();
  }, []);

  // Get developer's projects
  const developers = getAllDevelopers();
  const mockDeveloper = developers[0];
  const developerProjects = getProjectsByDeveloper(mockDeveloper.slug);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeRemaining = (endTime: string) => {
    const remaining = new Date(endTime).getTime() - Date.now();
    if (remaining < 0) return "Đã kết thúc";

    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

    if (days > 0) return `${days} ngày ${hours} giờ`;
    return `${hours} giờ`;
  };

  const handleBid = async (auctionId: string) => {
    if (!bidAmount || !selectedProject) {
      setMessage({ type: "error", text: "Vui lòng chọn dự án và nhập số tiền đấu giá" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/v1/auctions/${auctionId}/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSlug: selectedProject,
          amount: parseInt(bidAmount),
          userId: user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.error || "Có lỗi xảy ra. Vui lòng thử lại.",
        });
        return;
      }

      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setMessage({ type: "error", text: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container-app py-8">
        <GlassCard className="p-12 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-amber-400" />
          <h2 className="text-xl font-semibold text-foreground">Đăng nhập để tiếp tục</h2>
          <p className="mt-2 text-muted-foreground">
            Bạn cần đăng nhập với tài khoản Chủ đầu tư để tham gia đấu giá
          </p>
          <Link href="/handler/sign-in" className="btn btn-primary mt-6">
            Đăng nhập
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Trang chủ
      </Link>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`mb-6 rounded-lg p-4 ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="page-header">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span className="text-sm font-medium uppercase tracking-wider text-amber-400">
            Dành cho Chủ đầu tư
          </span>
        </div>
        <h1 className="page-title">Đấu giá Vị trí Sponsored</h1>
        <p className="page-subtitle">
          Đấu giá vị trí hiển thị ưu tiên cho dự án của bạn
        </p>
      </header>

      {/* How it works */}
      <GlassCard className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Cách thức hoạt động</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              1
            </div>
            <div>
              <div className="font-medium text-foreground">Chọn slot</div>
              <div className="text-sm text-muted-foreground">
                Chọn vị trí hiển thị phù hợp
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              2
            </div>
            <div>
              <div className="font-medium text-foreground">Đặt giá</div>
              <div className="text-sm text-muted-foreground">
                Đấu giá cao hơn giá hiện tại
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              3
            </div>
            <div>
              <div className="font-medium text-foreground">Thanh toán</div>
              <div className="text-sm text-muted-foreground">
                Thanh toán qua Stripe an toàn
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              4
            </div>
            <div>
              <div className="font-medium text-foreground">Thắng thầu</div>
              <div className="text-sm text-muted-foreground">
                Dự án hiển thị ưu tiên
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Available Auctions */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Các phiên đấu giá</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Cập nhật realtime
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {auctions.map((auction) => (
            <GlassCard key={auction.id} className="relative overflow-hidden">
              {/* Status badge */}
              <div className="absolute right-4 top-4">
                {auction.status === "active" ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Đang diễn ra
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-400">
                    Sắp mở
                  </span>
                )}
              </div>

              <h3 className="mb-2 text-lg font-semibold text-foreground">{auction.slotName}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{auction.description}</p>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Giá khởi điểm</div>
                  <div className="font-semibold text-foreground">
                    {formatCurrency(auction.minBid)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Giá hiện tại</div>
                  <div className="font-semibold text-amber-400">
                    {auction.currentBid ? formatCurrency(auction.currentBid) : "Chưa có"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Thời gian còn lại</div>
                  <div className="font-semibold text-foreground">
                    {getTimeRemaining(auction.endTime)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Số lượt đấu giá</div>
                  <div className="font-semibold text-foreground">{auction.bidCount}</div>
                </div>
              </div>

              {selectedAuction === auction.id ? (
                <div className="space-y-4 rounded-lg bg-white/5 p-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Chọn dự án
                    </label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-foreground focus:border-amber-500 focus:outline-none"
                    >
                      <option value="">-- Chọn dự án --</option>
                      {developerProjects.map((project) => (
                        <option key={project.slug} value={project.slug}>
                          {project.name} ({project.tier})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Số tiền đấu giá (VND)
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Tối thiểu ${formatCurrency((auction.currentBid || auction.minBid) + 1000000)}`}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-foreground placeholder-white/30 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBid(auction.id)}
                      disabled={isSubmitting}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 font-semibold text-amber-900 transition-all hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4" />
                      )}
                      {isSubmitting ? "Đang xử lý..." : "Thanh toán với Stripe"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAuction(null);
                        setBidAmount("");
                        setSelectedProject("");
                      }}
                      className="rounded-lg border border-white/10 px-4 py-2 text-foreground transition-colors hover:bg-white/5"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedAuction(auction.id)}
                  disabled={auction.status !== "active"}
                  className="w-full rounded-lg bg-amber-500/10 px-4 py-2 font-semibold text-amber-400 transition-all hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {auction.status === "active" ? "Đấu giá ngay" : "Chưa mở"}
                </button>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {/* Benefits */}
      <div className="mt-12">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Lợi ích khi Sponsored</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GlassCard className="p-4">
            <Eye className="mb-2 h-5 w-5 text-amber-400" />
            <div className="font-medium text-foreground">Tăng độ hiển thị</div>
            <div className="text-sm text-muted-foreground">
              Dự án xuất hiện ở vị trí nổi bật nhất
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <TrendingUp className="mb-2 h-5 w-5 text-emerald-400" />
            <div className="font-medium text-foreground">Tăng lượt click</div>
            <div className="text-sm text-muted-foreground">
              Trung bình tăng 3-5x so với vị trí thường
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <CheckCircle className="mb-2 h-5 w-5 text-blue-400" />
            <div className="font-medium text-foreground">Minh bạch</div>
            <div className="text-sm text-muted-foreground">
              Tier và điểm không bị ảnh hưởng
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <Sparkles className="mb-2 h-5 w-5 text-purple-400" />
            <div className="font-medium text-foreground">Badge Sponsored</div>
            <div className="text-sm text-muted-foreground">
              Hiển thị rõ ràng, không gây hiểu nhầm
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="container-app flex min-h-[60vh] items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
    </div>
  );
}

export default function SponsorshipPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SponsorshipContent />
    </Suspense>
  );
}

// Mock auctions fallback
function getMockAuctions(): Auction[] {
  return [
    {
      id: "mock-1",
      slotType: "homepage_featured",
      slotName: "Trang chủ - Vị trí nổi bật",
      description: "Hiển thị ở đầu trang chủ, trên tất cả các dự án khác",
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      minBid: 50000000,
      currentBid: 75000000,
      currentBidder: null,
      bidCount: 3,
      status: "active",
      duration: "7 ngày",
    },
    {
      id: "mock-2",
      slotType: "search_top",
      slotName: "Kết quả tìm kiếm - Top 3",
      description: "Ưu tiên hiển thị trong top 3 kết quả tìm kiếm",
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      minBid: 30000000,
      currentBid: 45000000,
      currentBidder: null,
      bidCount: 5,
      status: "active",
      duration: "7 ngày",
    },
    {
      id: "mock-3",
      slotType: "category_banner",
      slotName: "Banner chuyên mục",
      description: "Banner quảng cáo trong trang chuyên mục",
      startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      minBid: 20000000,
      currentBid: null,
      currentBidder: null,
      bidCount: 0,
      status: "pending",
      duration: "7 ngày",
    },
  ];
}
