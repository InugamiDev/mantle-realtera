import type { TierLevel, TierInfo } from "./types";

// Re-export for convenience
export type Tier = TierLevel;
export type { TierLevel, TierInfo };

// ============================================================================
// SCORING COMPONENTS (Governance Hardening v1.0)
// ============================================================================
// IMPORTANT: ROI/Investment Value has been REMOVED from scoring to avoid
// investment-promise territory and advertising misrepresentation risk.
// See: Vietnam Advertising Law (effective 1 Jan 2026)
//
// Scoring is now based on 4 components totaling 100%:
// - Legal (30%): Permits, land use rights, compliance status
// - Developer (30%): Track record, financial health, delivery history
// - Location (25%): Infrastructure, accessibility, neighborhood quality
// - Progress (15%): Construction status, timeline adherence
// ============================================================================

export interface ScoreComponentDef {
  name: string;
  displayName: string;
  displayNameEn: string;
  weight: number; // 0.0-1.0
  maxScore: number;
  description: string;
}

// Score component weights (NO ROI - totals 1.0)
export const SCORE_COMPONENTS: Record<string, ScoreComponentDef> = {
  legal: {
    name: "legal",
    displayName: "Pháp lý",
    displayNameEn: "Legal Status",
    weight: 0.30,
    maxScore: 30,
    description: "Giấy phép xây dựng, quyền sử dụng đất, tuân thủ pháp luật",
  },
  developer: {
    name: "developer",
    displayName: "Chủ đầu tư",
    displayNameEn: "Developer",
    weight: 0.30,
    maxScore: 30,
    description: "Uy tín, lịch sử bàn giao, sức khỏe tài chính",
  },
  location: {
    name: "location",
    displayName: "Vị trí",
    displayNameEn: "Location",
    weight: 0.25,
    maxScore: 25,
    description: "Hạ tầng, giao thông, tiện ích xung quanh",
  },
  progress: {
    name: "progress",
    displayName: "Tiến độ",
    displayNameEn: "Progress",
    weight: 0.15,
    maxScore: 15,
    description: "Tiến độ xây dựng, đúng cam kết",
  },
  // REMOVED: value/ROI component - legal liability risk
  // Investment analysis moved to calculator tools with explicit disclaimers
} as const;

// Component names in display order
export const SCORE_COMPONENT_ORDER = ["legal", "developer", "location", "progress"] as const;

// Methodology version for audit trail
export const SCORING_METHODOLOGY_VERSION = "v1.0";

// Get total weight (should always be 1.0)
export function getTotalWeight(): number {
  return Object.values(SCORE_COMPONENTS).reduce((sum, c) => sum + c.weight, 0);
}

// Calculate weighted score from component scores
export function calculateTotalScore(componentScores: Record<string, number>): number {
  let total = 0;
  for (const [name, component] of Object.entries(SCORE_COMPONENTS)) {
    const score = componentScores[name] ?? 0;
    // Normalize to 0-100 scale and apply weight
    const normalizedScore = Math.min(score, component.maxScore);
    total += (normalizedScore / component.maxScore) * 100 * component.weight;
  }
  return Math.round(total);
}

// ============================================================================
// TIER DEFINITIONS
// ============================================================================

// Tier definitions with Vietnamese labels
export const TIERS: Record<TierLevel, TierInfo> = {
  SSS: {
    level: "SSS",
    label: "Xuất sắc",
    description: "Dự án hàng đầu, đáng tin cậy tuyệt đối",
    minScore: 95,
    maxScore: 100,
  },
  SS: {
    level: "SS",
    label: "Xuất sắc cao",
    description: "Dự án rất tốt, đáng tin cậy cao",
    minScore: 92,
    maxScore: 94,
  },
  "S+": {
    level: "S+",
    label: "Rất đáng mua",
    description: "Cân bằng rủi ro/tăng giá tốt",
    minScore: 90,
    maxScore: 91,
  },
  S: {
    level: "S",
    label: "Đáng mua",
    description: "Dự án tốt, đáng cân nhắc đầu tư",
    minScore: 85,
    maxScore: 89,
  },
  A: {
    level: "A",
    label: "Khá tốt",
    description: "Dự án khá, cần xem xét kỹ một số yếu tố",
    minScore: 75,
    maxScore: 84,
  },
  B: {
    level: "B",
    label: "Trung bình khá",
    description: "Có tiềm năng nhưng cần cân nhắc rủi ro",
    minScore: 65,
    maxScore: 74,
  },
  C: {
    level: "C",
    label: "Trung bình",
    description: "Dự án trung bình, rủi ro đáng kể",
    minScore: 50,
    maxScore: 64,
  },
  D: {
    level: "D",
    label: "Dưới trung bình",
    description: "Rủi ro cao, cần thận trọng",
    minScore: 35,
    maxScore: 49,
  },
  F: {
    level: "F",
    label: "Không khuyến khích",
    description: "Rủi ro rất cao, không nên đầu tư",
    minScore: 0,
    maxScore: 34,
  },
};

// Tier order from best to worst
export const TIER_ORDER: TierLevel[] = ["SSS", "SS", "S+", "S", "A", "B", "C", "D", "F"];

// Top tiers shown by default (before "Xem thêm tier")
export const TOP_TIERS: TierLevel[] = ["SSS", "SS", "S+", "S", "A", "B"];

// Lower tiers hidden by default
export const LOWER_TIERS: TierLevel[] = ["C", "D", "F"];

// Get tier by score
export function getTierByScore(score: number): TierLevel {
  for (const tier of TIER_ORDER) {
    const info = TIERS[tier];
    if (score >= info.minScore && score <= info.maxScore) {
      return tier;
    }
  }
  return "F";
}

// Get tier display name with label
export function getTierDisplayName(tier: TierLevel): string {
  return `${tier} — ${TIERS[tier].label}`;
}

// Compare tiers (returns negative if a is better, positive if b is better)
export function compareTiers(a: TierLevel, b: TierLevel): number {
  return TIER_ORDER.indexOf(a) - TIER_ORDER.indexOf(b);
}

// Get tier CSS class suffix (for tier-sss, tier-splus, etc.)
export function getTierClassSuffix(tier: TierLevel): string {
  return tier.toLowerCase().replace("+", "plus");
}
