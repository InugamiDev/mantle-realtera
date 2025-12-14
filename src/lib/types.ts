// Import legal types from badge component
import type {
  LegalStage as LegalStageType,
  LegalRiskLevel as LegalRiskLevelType,
  OwnershipStatus as OwnershipStatusType,
  ProjectLegalStatus as ProjectLegalStatusType,
  ConstructionStatus as ConstructionStatusType
} from "@/components/realtera/LegalStageBadge";

// Re-export legal types
export type LegalStage = LegalStageType;
export type LegalRiskLevel = LegalRiskLevelType;
export type OwnershipStatus = OwnershipStatusType;
export type ProjectLegalStatus = ProjectLegalStatusType;
export type ConstructionStatus = ConstructionStatusType;

// Tier levels from best to worst
export type TierLevel = "SSS" | "SS" | "S+" | "S" | "A" | "B" | "C" | "D" | "F";

// Developer tier levels (ranking developers separately)
export type DeveloperTier = "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "F";

// Verification status options
export type VerificationStatus = "Verified" | "Under review" | "Unverified" | "Unrated";

// ROI label options
export type RoiLabel = "Strong" | "Average" | "Weak" | "Fail";

// Signal quality options
export type SignalQuality = "Good" | "Average" | "Poor";

// Developer score breakdown category
export interface DeveloperScoreCategory {
  category: string;
  category_en?: string;
  score: number;
  maxScore: number;
  description?: string;
  description_en?: string;
}

// Developer (chủ đầu tư) information
export interface Developer {
  name: string;
  name_en?: string;
  slug: string;
  tier: DeveloperTier;
  projectCount: number;
  foundedYear?: number;
  headquarters?: string;
  headquarters_en?: string;
  website?: string;
  stockCode?: string; // Mã cổ phiếu nếu niêm yết
  // Scoring
  score?: number; // Overall score 0-100
  scoreBreakdown?: DeveloperScoreCategory[];
  // Extended info
  description?: string;
  description_en?: string;
  completedProjects?: number;
  ongoingProjects?: number;
  marketCap?: string; // Vốn hóa thị trường
  employeeCount?: number;
  certifications?: string[]; // ISO, awards, etc.
  certifications_en?: string[];
}

// Project signals
export interface ProjectSignals {
  legal: SignalQuality;
  price: string;
  liquidity: SignalQuality;
}

// Certificate info for verified projects
export interface Certificate {
  id: string;
  issuedAt: string;
}

// Evidence link
export interface EvidenceLink {
  domain: string;
  title: string;
  title_en?: string;
  url: string;
}

// Score breakdown category
export interface ScoreCategory {
  category: string;
  category_en?: string;
  score: number;
  maxScore: number;
}

// History event
export interface HistoryEvent {
  date: string;
  event: string;
  event_en?: string;
  tierChange?: string;
  scoreChange?: string;
}

// Sales and financial metrics
export interface SalesMetrics {
  totalUnits: number; // Tổng số căn
  soldUnits: number; // Số căn đã bán
  availableUnits: number; // Số căn còn lại
  salesProgress: number; // % tiến độ bán (0-100)
  launchDate?: string; // Ngày mở bán
  estimatedCompletion?: string; // Dự kiến bàn giao
}

// Price metrics
export interface PriceMetrics {
  minPrice: number; // Giá thấp nhất (triệu/m²)
  maxPrice: number; // Giá cao nhất (triệu/m²)
  avgPrice: number; // Giá trung bình (triệu/m²)
  priceChange3M?: number; // % thay đổi giá 3 tháng
  priceChange12M?: number; // % thay đổi giá 12 tháng
  pricePerSqmMin?: number; // Giá tối thiểu theo m²
  pricePerSqmMax?: number; // Giá tối đa theo m²
}

// ROI and investment metrics
export interface InvestmentMetrics {
  estimatedRoiMin: number; // ROI tối thiểu dự kiến (%)
  estimatedRoiMax: number; // ROI tối đa dự kiến (%)
  rentalYield?: number; // Tỷ suất cho thuê (% / năm)
  avgRentPrice?: number; // Giá thuê trung bình (triệu/tháng)
  capitalGrowth1Y?: number; // Tăng trưởng vốn 1 năm (%)
  capitalGrowth3Y?: number; // Tăng trưởng vốn 3 năm (%)
  paybackPeriod?: number; // Thời gian hoàn vốn (năm)
  breakEvenPoint?: string; // Điểm hòa vốn
}

// Area metrics
export interface AreaMetrics {
  minArea: number; // Diện tích nhỏ nhất (m²)
  maxArea: number; // Diện tích lớn nhất (m²)
  avgArea: number; // Diện tích trung bình (m²)
  totalLandArea?: number; // Tổng diện tích đất (ha)
  greenSpaceRatio?: number; // Tỷ lệ cây xanh (%)
  buildingDensity?: number; // Mật độ xây dựng (%)
}

// Quality of Life metrics
export interface QualityOfLifeMetrics {
  aqi: number;              // 0-500 (Air Quality Index)
  aqiLabel: "Good" | "Moderate" | "Poor" | "Bad" | "Hazardous";
  noiseLevel: "Quiet" | "Normal" | "Noisy";
  greenSpaceRatio: number;  // 0-100%
  walkabilityScore: number; // 0-100
  nearbyAmenities: {
    schools: number;
    hospitals: number;
    parks: number;
    malls: number;
    markets: number;
  };
  publicTransport: "Convenient" | "Average" | "Limited";
  trafficLevel: "Clear" | "Moderate" | "Congested";
}

// Legal stage types imported at top of file from LegalStageBadge
// See LegalStageBadge.tsx for full taxonomy with 50+ legal statuses

// Main Project interface
export interface Project {
  slug: string;
  name: string;
  name_en?: string;
  tier: TierLevel;
  score: number;
  verificationStatus: VerificationStatus;
  sponsored: boolean;
  district: string;
  district_en?: string;
  city: string;
  city_en?: string;
  verdict: string;
  verdict_en?: string;
  signals: ProjectSignals;
  updatedAt: string;
  sourceCount: number;
  whyBullets: string[];
  whyBullets_en?: string[];
  keyRisks: string[];
  keyRisks_en?: string[];
  roiLabel: RoiLabel;
  developer: Developer; // Required - chủ đầu tư
  certificate?: Certificate;
  bestForBullets?: string[];
  bestForBullets_en?: string[];
  evidenceLinks?: EvidenceLink[];
  scoreBreakdown?: ScoreCategory[];
  history?: HistoryEvent[];
  // Financial and sales metrics (optional)
  salesMetrics?: SalesMetrics;
  priceMetrics?: PriceMetrics;
  investmentMetrics?: InvestmentMetrics;
  areaMetrics?: AreaMetrics;
  // Data quality and legal stage (from enrichment)
  dataQuality?: number;      // 0-100, from enrichment confidence
  legalStage?: LegalStage;   // Detailed legal status
  // Quality of life metrics
  qualityOfLife?: QualityOfLifeMetrics;
  // Detailed project info (from researched data)
  projectDetails?: {
    totalUnits?: number;
    towers?: number;
    floors?: number;
    unitSizes?: { min: number; max: number };
    bedrooms?: string;
    completionYear?: number | null;
    status?: string;
    amenities?: string[];
    highlights?: string[];
  };
}

// Tier info for display
export interface TierInfo {
  level: TierLevel;
  label: string;
  description: string;
  minScore: number;
  maxScore: number;
}

// Filter state for tier list
export interface FilterState {
  search: string;
  tiers: TierLevel[];
  districts: string[];
  verificationStatus: VerificationStatus | null;
}

// Sort options
export type SortOption = "tier-score" | "updated" | "sources";
