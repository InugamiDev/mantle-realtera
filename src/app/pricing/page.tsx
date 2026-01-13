"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Check,
  Sparkles,
  Building2,
  Zap,
  Crown,
} from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";

interface Plan {
  tier: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  highlighted?: boolean;
}

export default function PricingPage() {
  const t = useTranslations("common");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/subscriptions")
      .then((res) => res.json())
      .then((data) => {
        setPlans(data.plans || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    return `${(price / 1000).toLocaleString()}K`;
  };

  const getIcon = (tier: string) => {
    switch (tier) {
      case "free":
        return Building2;
      case "pro":
        return Zap;
      case "enterprise":
        return Crown;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="container-app py-6 sm:py-8">
      <Link
        href="/"
        className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToRanking")}
      </Link>

      <header className="page-header">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span className="text-sm font-medium uppercase tracking-wider text-amber-400">
            Pricing
          </span>
        </div>
        <h1 className="page-title">Chọn gói phù hợp</h1>
        <p className="page-subtitle">
          Nâng cấp để truy cập đầy đủ tính năng RealTera
        </p>
      </header>

      {/* Billing Toggle */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              billing === "monthly"
                ? "bg-amber-500 text-black"
                : "text-foreground hover:bg-white/10"
            }`}
          >
            Hàng tháng
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              billing === "yearly"
                ? "bg-amber-500 text-black"
                : "text-foreground hover:bg-white/10"
            }`}
          >
            Hàng năm
            <span className="ml-1 text-xs opacity-75">-17%</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-2xl bg-white/10"
              />
            ))
          : plans.map((plan) => {
              const Icon = getIcon(plan.tier);
              const price =
                billing === "yearly" ? plan.priceYearly : plan.priceMonthly;

              return (
                <GlassCard
                  key={plan.tier}
                  className={`relative overflow-hidden p-6 ${
                    plan.highlighted
                      ? "border-amber-500/50 ring-2 ring-amber-500/20"
                      : ""
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -right-8 top-6 rotate-45 bg-amber-500 px-10 py-1 text-xs font-bold text-black">
                      PHỔ BIẾN
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        plan.tier === "enterprise"
                          ? "bg-purple-500/20"
                          : plan.tier === "pro"
                            ? "bg-amber-500/20"
                            : "bg-cyan-500/20"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          plan.tier === "enterprise"
                            ? "text-purple-400"
                            : plan.tier === "pro"
                              ? "text-amber-400"
                              : "text-cyan-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="text-3xl font-bold text-foreground">
                      {formatPrice(price)}
                    </span>
                    {price > 0 && (
                      <span className="text-sm text-muted-foreground">
                        /{billing === "yearly" ? "năm" : "tháng"}
                      </span>
                    )}
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`mt-6 w-full rounded-lg py-3 font-medium transition-colors ${
                      plan.tier === "free"
                        ? "border border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                        : plan.highlighted
                          ? "bg-amber-500 text-black hover:bg-amber-400"
                          : "bg-white/10 text-foreground hover:bg-white/20"
                    }`}
                  >
                    {plan.tier === "free"
                      ? "Gói hiện tại"
                      : plan.tier === "enterprise"
                        ? "Liên hệ"
                        : "Bắt đầu dùng thử"}
                  </button>
                </GlassCard>
              );
            })}
      </div>

      {/* FAQ */}
      <GlassCard className="mt-12 p-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">
          Câu hỏi thường gặp
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium text-foreground">
              Tôi có thể hủy bất cứ lúc nào?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Có, bạn có thể hủy subscription bất cứ lúc nào. Dịch vụ sẽ tiếp
              tục đến hết chu kỳ thanh toán.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">
              Có dùng thử miễn phí không?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Có, gói Pro có 7 ngày dùng thử miễn phí. Bạn sẽ không bị tính phí
              cho đến khi hết thời gian dùng thử.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">
              Thanh toán như thế nào?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Chúng tôi chấp nhận thẻ Visa, Mastercard, và chuyển khoản ngân
              hàng cho gói Enterprise.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">
              Có hỗ trợ hoàn tiền không?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Có, nếu bạn không hài lòng trong 14 ngày đầu, chúng tôi sẽ hoàn
              tiền 100%.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
