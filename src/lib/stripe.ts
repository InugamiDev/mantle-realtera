import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backwards compatibility - lazy getter
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Auction slot types and their base prices (in VND)
export const AUCTION_SLOTS = {
  homepage_featured: {
    name: "Trang chủ - Vị trí nổi bật",
    description: "Hiển thị ở đầu trang chủ, trên tất cả các dự án khác",
    minBid: 50_000_000, // 50 triệu VND
    duration: 7, // days
  },
  search_top: {
    name: "Kết quả tìm kiếm - Top 3",
    description: "Ưu tiên hiển thị trong top 3 kết quả tìm kiếm",
    minBid: 30_000_000,
    duration: 7,
  },
  category_banner: {
    name: "Banner chuyên mục",
    description: "Banner quảng cáo trong trang chuyên mục",
    minBid: 20_000_000,
    duration: 7,
  },
  developer_spotlight: {
    name: "Chủ đầu tư nổi bật",
    description: "Hiển thị trong mục Chủ đầu tư nổi bật trên trang chủ",
    minBid: 40_000_000,
    duration: 14,
  },
} as const;

export type AuctionSlotType = keyof typeof AUCTION_SLOTS;

// Convert VND to smallest unit (đồng = VND, no decimal)
export function vndToStripeAmount(vnd: number): number {
  return Math.round(vnd);
}

// Convert Stripe amount back to VND
export function stripeAmountToVnd(amount: number): number {
  return amount;
}
