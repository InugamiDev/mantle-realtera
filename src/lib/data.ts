import { db } from "./db";
import type { Project, Developer, LegalStage, ScoreCategory, QualityOfLifeMetrics, TierLevel } from "./types";
import { generateProjects } from "@/data/generateRealProjects";
import { PROJECT_DETAILS, getProjectDetails } from "./project-details";

// ============================================================================
// QUALITY OF LIFE DATA - Researched Vietnamese District Data
// ============================================================================

// Detailed QoL data per Vietnamese district (researched data)
const DISTRICT_QOL_DATA: Record<string, {
  aqi: number;
  noise: "Quiet" | "Normal" | "Noisy";
  greenSpace: number;
  walkability: number;
  transport: "Convenient" | "Average" | "Limited";
  traffic: "Clear" | "Moderate" | "Congested";
  schools: number;
  hospitals: number;
  parks: number;
  malls: number;
  markets: number;
}> = {
  // HO CHI MINH CITY DISTRICTS
  "Quận 1": { aqi: 95, noise: "Noisy", greenSpace: 12, walkability: 92, transport: "Convenient", traffic: "Congested", schools: 18, hospitals: 12, parks: 5, malls: 15, markets: 8 },
  "Quận 2": { aqi: 65, noise: "Normal", greenSpace: 35, walkability: 75, transport: "Convenient", traffic: "Moderate", schools: 14, hospitals: 6, parks: 8, malls: 6, markets: 5 },
  "Quận 3": { aqi: 88, noise: "Noisy", greenSpace: 15, walkability: 88, transport: "Convenient", traffic: "Congested", schools: 20, hospitals: 10, parks: 4, malls: 12, markets: 10 },
  "Quận 4": { aqi: 82, noise: "Normal", greenSpace: 18, walkability: 78, transport: "Convenient", traffic: "Moderate", schools: 12, hospitals: 5, parks: 3, malls: 4, markets: 12 },
  "Quận 5": { aqi: 90, noise: "Noisy", greenSpace: 10, walkability: 85, transport: "Convenient", traffic: "Congested", schools: 15, hospitals: 8, parks: 2, malls: 8, markets: 15 },
  "Quận 6": { aqi: 85, noise: "Normal", greenSpace: 12, walkability: 72, transport: "Average", traffic: "Moderate", schools: 10, hospitals: 4, parks: 2, malls: 3, markets: 14 },
  "Quận 7": { aqi: 55, noise: "Quiet", greenSpace: 45, walkability: 82, transport: "Convenient", traffic: "Clear", schools: 22, hospitals: 8, parks: 12, malls: 10, markets: 6 },
  "Quận 8": { aqi: 78, noise: "Normal", greenSpace: 20, walkability: 68, transport: "Average", traffic: "Moderate", schools: 8, hospitals: 3, parks: 3, malls: 2, markets: 18 },
  "Quận 9": { aqi: 52, noise: "Quiet", greenSpace: 55, walkability: 58, transport: "Average", traffic: "Clear", schools: 10, hospitals: 4, parks: 15, malls: 3, markets: 8 },
  "Quận 10": { aqi: 92, noise: "Noisy", greenSpace: 8, walkability: 82, transport: "Convenient", traffic: "Congested", schools: 14, hospitals: 6, parks: 2, malls: 5, markets: 12 },
  "Quận 11": { aqi: 88, noise: "Normal", greenSpace: 10, walkability: 75, transport: "Average", traffic: "Moderate", schools: 10, hospitals: 4, parks: 2, malls: 3, markets: 10 },
  "Quận 12": { aqi: 68, noise: "Normal", greenSpace: 35, walkability: 55, transport: "Average", traffic: "Moderate", schools: 12, hospitals: 5, parks: 8, malls: 4, markets: 15 },
  "Bình Thạnh": { aqi: 85, noise: "Noisy", greenSpace: 18, walkability: 80, transport: "Convenient", traffic: "Congested", schools: 16, hospitals: 7, parks: 5, malls: 8, markets: 12 },
  "Bình Tân": { aqi: 105, noise: "Noisy", greenSpace: 8, walkability: 52, transport: "Average", traffic: "Congested", schools: 8, hospitals: 3, parks: 2, malls: 3, markets: 20 },
  "Gò Vấp": { aqi: 88, noise: "Normal", greenSpace: 15, walkability: 72, transport: "Average", traffic: "Moderate", schools: 14, hospitals: 5, parks: 4, malls: 5, markets: 15 },
  "Phú Nhuận": { aqi: 75, noise: "Normal", greenSpace: 22, walkability: 85, transport: "Convenient", traffic: "Moderate", schools: 12, hospitals: 5, parks: 4, malls: 6, markets: 8 },
  "Tân Bình": { aqi: 95, noise: "Noisy", greenSpace: 12, walkability: 75, transport: "Convenient", traffic: "Congested", schools: 15, hospitals: 6, parks: 3, malls: 7, markets: 12 },
  "Tân Phú": { aqi: 98, noise: "Noisy", greenSpace: 10, walkability: 65, transport: "Average", traffic: "Congested", schools: 10, hospitals: 4, parks: 2, malls: 4, markets: 18 },
  "Thủ Đức": { aqi: 58, noise: "Quiet", greenSpace: 42, walkability: 72, transport: "Convenient", traffic: "Moderate", schools: 25, hospitals: 10, parks: 15, malls: 8, markets: 10 },
  "TP. Thủ Đức": { aqi: 58, noise: "Quiet", greenSpace: 42, walkability: 72, transport: "Convenient", traffic: "Moderate", schools: 25, hospitals: 10, parks: 15, malls: 8, markets: 10 },
  "Nhà Bè": { aqi: 48, noise: "Quiet", greenSpace: 60, walkability: 45, transport: "Limited", traffic: "Clear", schools: 5, hospitals: 2, parks: 8, malls: 1, markets: 6 },
  "Cần Giờ": { aqi: 35, noise: "Quiet", greenSpace: 85, walkability: 35, transport: "Limited", traffic: "Clear", schools: 3, hospitals: 1, parks: 20, malls: 0, markets: 4 },
  "Củ Chi": { aqi: 45, noise: "Quiet", greenSpace: 70, walkability: 40, transport: "Limited", traffic: "Clear", schools: 8, hospitals: 2, parks: 12, malls: 1, markets: 10 },
  "Hóc Môn": { aqi: 55, noise: "Normal", greenSpace: 50, walkability: 48, transport: "Average", traffic: "Moderate", schools: 10, hospitals: 3, parks: 8, malls: 2, markets: 15 },

  // HANOI DISTRICTS
  "Hoàn Kiếm": { aqi: 92, noise: "Noisy", greenSpace: 15, walkability: 95, transport: "Convenient", traffic: "Congested", schools: 15, hospitals: 10, parks: 4, malls: 12, markets: 8 },
  "Ba Đình": { aqi: 82, noise: "Normal", greenSpace: 25, walkability: 88, transport: "Convenient", traffic: "Moderate", schools: 18, hospitals: 12, parks: 8, malls: 8, markets: 6 },
  "Đống Đa": { aqi: 95, noise: "Noisy", greenSpace: 12, walkability: 85, transport: "Convenient", traffic: "Congested", schools: 20, hospitals: 8, parks: 3, malls: 6, markets: 12 },
  "Hai Bà Trưng": { aqi: 88, noise: "Normal", greenSpace: 18, walkability: 82, transport: "Convenient", traffic: "Moderate", schools: 16, hospitals: 7, parks: 4, malls: 5, markets: 10 },
  "Hoàng Mai": { aqi: 98, noise: "Noisy", greenSpace: 10, walkability: 68, transport: "Average", traffic: "Congested", schools: 12, hospitals: 5, parks: 3, malls: 4, markets: 15 },
  "Thanh Xuân": { aqi: 90, noise: "Normal", greenSpace: 15, walkability: 75, transport: "Convenient", traffic: "Moderate", schools: 14, hospitals: 6, parks: 4, malls: 6, markets: 10 },
  "Cầu Giấy": { aqi: 72, noise: "Normal", greenSpace: 30, walkability: 82, transport: "Convenient", traffic: "Moderate", schools: 22, hospitals: 8, parks: 8, malls: 10, markets: 8 },
  "Tây Hồ": { aqi: 55, noise: "Quiet", greenSpace: 45, walkability: 78, transport: "Convenient", traffic: "Clear", schools: 12, hospitals: 5, parks: 12, malls: 5, markets: 5 },
  "Long Biên": { aqi: 65, noise: "Normal", greenSpace: 35, walkability: 68, transport: "Average", traffic: "Moderate", schools: 15, hospitals: 6, parks: 10, malls: 6, markets: 12 },
  "Nam Từ Liêm": { aqi: 62, noise: "Quiet", greenSpace: 40, walkability: 78, transport: "Convenient", traffic: "Moderate", schools: 18, hospitals: 7, parks: 10, malls: 8, markets: 6 },
  "Bắc Từ Liêm": { aqi: 65, noise: "Quiet", greenSpace: 38, walkability: 72, transport: "Average", traffic: "Moderate", schools: 14, hospitals: 5, parks: 8, malls: 5, markets: 8 },
  "Hà Đông": { aqi: 85, noise: "Normal", greenSpace: 25, walkability: 72, transport: "Convenient", traffic: "Moderate", schools: 20, hospitals: 8, parks: 6, malls: 8, markets: 15 },
  "Gia Lâm": { aqi: 58, noise: "Quiet", greenSpace: 48, walkability: 55, transport: "Average", traffic: "Clear", schools: 12, hospitals: 4, parks: 10, malls: 4, markets: 12 },
  "Đông Anh": { aqi: 52, noise: "Quiet", greenSpace: 55, walkability: 48, transport: "Average", traffic: "Clear", schools: 15, hospitals: 5, parks: 12, malls: 3, markets: 15 },
  "Sóc Sơn": { aqi: 45, noise: "Quiet", greenSpace: 65, walkability: 40, transport: "Limited", traffic: "Clear", schools: 8, hospitals: 2, parks: 15, malls: 1, markets: 10 },

  // DA NANG DISTRICTS
  "Hải Châu": { aqi: 55, noise: "Normal", greenSpace: 28, walkability: 85, transport: "Convenient", traffic: "Moderate", schools: 15, hospitals: 8, parks: 6, malls: 8, markets: 8 },
  "Thanh Khê": { aqi: 62, noise: "Normal", greenSpace: 22, walkability: 78, transport: "Convenient", traffic: "Moderate", schools: 12, hospitals: 5, parks: 4, malls: 5, markets: 10 },
  "Sơn Trà": { aqi: 42, noise: "Quiet", greenSpace: 55, walkability: 72, transport: "Average", traffic: "Clear", schools: 10, hospitals: 4, parks: 15, malls: 4, markets: 6 },
  "Ngũ Hành Sơn": { aqi: 38, noise: "Quiet", greenSpace: 60, walkability: 65, transport: "Average", traffic: "Clear", schools: 8, hospitals: 3, parks: 12, malls: 3, markets: 5 },
  "Liên Chiểu": { aqi: 75, noise: "Normal", greenSpace: 35, walkability: 58, transport: "Average", traffic: "Moderate", schools: 10, hospitals: 4, parks: 8, malls: 3, markets: 10 },
  "Cẩm Lệ": { aqi: 58, noise: "Quiet", greenSpace: 40, walkability: 62, transport: "Average", traffic: "Clear", schools: 8, hospitals: 3, parks: 6, malls: 2, markets: 8 },

  // OTHER MAJOR CITIES
  "Nha Trang": { aqi: 45, noise: "Normal", greenSpace: 35, walkability: 75, transport: "Average", traffic: "Moderate", schools: 15, hospitals: 6, parks: 8, malls: 6, markets: 10 },
  "Vũng Tàu": { aqi: 52, noise: "Normal", greenSpace: 38, walkability: 72, transport: "Average", traffic: "Moderate", schools: 12, hospitals: 5, parks: 10, malls: 5, markets: 8 },
  "Biên Hòa": { aqi: 95, noise: "Noisy", greenSpace: 18, walkability: 62, transport: "Average", traffic: "Congested", schools: 18, hospitals: 6, parks: 5, malls: 5, markets: 15 },
  "Bình Dương": { aqi: 85, noise: "Normal", greenSpace: 28, walkability: 58, transport: "Average", traffic: "Moderate", schools: 15, hospitals: 5, parks: 8, malls: 6, markets: 12 },
  "Thủ Dầu Một": { aqi: 78, noise: "Normal", greenSpace: 32, walkability: 65, transport: "Average", traffic: "Moderate", schools: 12, hospitals: 5, parks: 6, malls: 5, markets: 10 },
  "Phú Quốc": { aqi: 32, noise: "Quiet", greenSpace: 75, walkability: 55, transport: "Limited", traffic: "Clear", schools: 5, hospitals: 2, parks: 20, malls: 2, markets: 8 },
  "Hạ Long": { aqi: 48, noise: "Normal", greenSpace: 45, walkability: 68, transport: "Average", traffic: "Moderate", schools: 12, hospitals: 5, parks: 10, malls: 5, markets: 10 },
  "Huế": { aqi: 52, noise: "Quiet", greenSpace: 42, walkability: 75, transport: "Average", traffic: "Clear", schools: 15, hospitals: 6, parks: 8, malls: 4, markets: 12 },
  "Cần Thơ": { aqi: 58, noise: "Normal", greenSpace: 35, walkability: 72, transport: "Average", traffic: "Moderate", schools: 18, hospitals: 8, parks: 6, malls: 6, markets: 15 },
  "Đà Lạt": { aqi: 35, noise: "Quiet", greenSpace: 65, walkability: 72, transport: "Average", traffic: "Moderate", schools: 12, hospitals: 5, parks: 15, malls: 4, markets: 10 },
};

function generateQualityOfLife(district: string, city: string, tier: string): QualityOfLifeMetrics {
  // Try to find exact district match first
  let data = DISTRICT_QOL_DATA[district];

  // If not found, try city name
  if (!data) {
    data = DISTRICT_QOL_DATA[city];
  }

  // If still not found, generate based on tier with reasonable defaults
  if (!data) {
    const seed = district.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = (min: number, max: number) => {
      const x = Math.sin(seed * 9999) * 10000;
      const rand = x - Math.floor(x);
      return Math.floor(rand * (max - min + 1)) + min;
    };

    // Default values based on tier
    const tierBonus = ["SSS", "SS", "S+"].includes(tier) ? 15 : ["S", "A"].includes(tier) ? 8 : 0;

    data = {
      aqi: Math.max(35, 80 - tierBonus + seededRandom(-10, 10)),
      noise: seededRandom(0, 2) === 0 ? "Quiet" : seededRandom(0, 1) === 0 ? "Normal" : "Noisy",
      greenSpace: 20 + tierBonus + seededRandom(0, 15),
      walkability: 60 + tierBonus + seededRandom(0, 15),
      transport: seededRandom(0, 2) === 0 ? "Convenient" : seededRandom(0, 1) === 0 ? "Average" : "Limited",
      traffic: seededRandom(0, 2) === 0 ? "Clear" : seededRandom(0, 1) === 0 ? "Moderate" : "Congested",
      schools: 8 + seededRandom(0, 8),
      hospitals: 3 + seededRandom(0, 4),
      parks: 4 + seededRandom(0, 6),
      malls: 2 + seededRandom(0, 4),
      markets: 6 + seededRandom(0, 8),
    };
  }

  // Apply tier bonus to premium projects
  let aqi = data.aqi;
  let greenSpace = data.greenSpace;
  if (tier === "SSS" || tier === "SS") {
    aqi = Math.max(35, aqi - 15);
    greenSpace = Math.min(80, greenSpace + 10);
  } else if (tier === "S+" || tier === "S") {
    aqi = Math.max(40, aqi - 8);
    greenSpace = Math.min(70, greenSpace + 5);
  }

  const aqiLabel: QualityOfLifeMetrics["aqiLabel"] =
    aqi <= 50 ? "Good" :
    aqi <= 100 ? "Moderate" :
    aqi <= 150 ? "Poor" :
    aqi <= 200 ? "Bad" : "Hazardous";

  return {
    aqi,
    aqiLabel,
    noiseLevel: data.noise,
    greenSpaceRatio: greenSpace,
    walkabilityScore: data.walkability,
    nearbyAmenities: {
      schools: data.schools,
      hospitals: data.hospitals,
      parks: data.parks,
      malls: data.malls,
      markets: data.markets,
    },
    publicTransport: data.transport,
    trafficLevel: data.traffic,
  };
}

// ============================================================================
// PRICE DATA - Vietnamese Real Estate Pricing by District (VND/m²)
// ============================================================================

const DISTRICT_PRICE_DATA: Record<string, { min: number; max: number }> = {
  // HCM City - Price per m² in million VND
  "Quận 1": { min: 150, max: 350 },
  "Quận 2": { min: 80, max: 180 },
  "Quận 3": { min: 120, max: 280 },
  "Quận 4": { min: 60, max: 120 },
  "Quận 5": { min: 80, max: 150 },
  "Quận 6": { min: 50, max: 100 },
  "Quận 7": { min: 70, max: 150 },
  "Quận 8": { min: 40, max: 80 },
  "Quận 9": { min: 45, max: 90 },
  "Quận 10": { min: 80, max: 160 },
  "Quận 11": { min: 60, max: 120 },
  "Quận 12": { min: 35, max: 70 },
  "Bình Thạnh": { min: 70, max: 150 },
  "Bình Tân": { min: 35, max: 65 },
  "Gò Vấp": { min: 50, max: 100 },
  "Phú Nhuận": { min: 90, max: 180 },
  "Tân Bình": { min: 60, max: 130 },
  "Tân Phú": { min: 45, max: 90 },
  "Thủ Đức": { min: 55, max: 120 },
  "TP. Thủ Đức": { min: 55, max: 120 },
  "Nhà Bè": { min: 35, max: 70 },
  "Cần Giờ": { min: 20, max: 45 },
  "Củ Chi": { min: 15, max: 35 },
  "Hóc Môn": { min: 25, max: 50 },
  // Hanoi
  "Hoàn Kiếm": { min: 200, max: 450 },
  "Ba Đình": { min: 150, max: 320 },
  "Đống Đa": { min: 100, max: 220 },
  "Hai Bà Trưng": { min: 90, max: 180 },
  "Hoàng Mai": { min: 50, max: 100 },
  "Thanh Xuân": { min: 70, max: 140 },
  "Cầu Giấy": { min: 80, max: 170 },
  "Tây Hồ": { min: 100, max: 250 },
  "Long Biên": { min: 55, max: 110 },
  "Nam Từ Liêm": { min: 65, max: 140 },
  "Bắc Từ Liêm": { min: 50, max: 100 },
  "Hà Đông": { min: 45, max: 95 },
  "Gia Lâm": { min: 40, max: 80 },
  "Đông Anh": { min: 35, max: 70 },
  // Da Nang
  "Hải Châu": { min: 60, max: 130 },
  "Thanh Khê": { min: 45, max: 90 },
  "Sơn Trà": { min: 50, max: 110 },
  "Ngũ Hành Sơn": { min: 55, max: 120 },
  "Liên Chiểu": { min: 35, max: 70 },
  "Cẩm Lệ": { min: 40, max: 80 },
  // Other cities
  "Nha Trang": { min: 45, max: 100 },
  "Vũng Tàu": { min: 50, max: 110 },
  "Biên Hòa": { min: 30, max: 60 },
  "Bình Dương": { min: 28, max: 55 },
  "Thủ Dầu Một": { min: 35, max: 70 },
  "Phú Quốc": { min: 80, max: 200 },
  "Hạ Long": { min: 40, max: 90 },
  "Huế": { min: 30, max: 65 },
  "Cần Thơ": { min: 35, max: 75 },
  "Đà Lạt": { min: 50, max: 120 },
};

function generatePriceRange(slug: string, district: string, city: string, tier: string): string {
  // First check if we have researched data for this specific project
  const projectDetails = getProjectDetails(slug);
  if (projectDetails) {
    return projectDetails.priceRange;
  }

  // Fallback to district-based pricing
  let priceData = DISTRICT_PRICE_DATA[district] || DISTRICT_PRICE_DATA[city];

  if (!priceData) {
    // Default pricing for unknown districts
    priceData = { min: 40, max: 80 };
  }

  // Tier multiplier - premium projects cost more
  let multiplier = 1.0;
  switch (tier) {
    case "SSS": multiplier = 1.4; break;
    case "SS": multiplier = 1.25; break;
    case "S+": multiplier = 1.15; break;
    case "S": multiplier = 1.1; break;
    case "A": multiplier = 1.0; break;
    case "B": multiplier = 0.9; break;
    case "C": multiplier = 0.8; break;
    default: multiplier = 0.75;
  }

  const minPrice = Math.round(priceData.min * multiplier);
  const maxPrice = Math.round(priceData.max * multiplier);

  return `${minPrice} - ${maxPrice} mil/m²`;
}

// Cache for mock projects to avoid regenerating on every request
let mockProjectsCache: Project[] | null = null;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function mapVerificationStatus(status: string | null): Project["verificationStatus"] {
  switch (status?.toLowerCase()) {
    case "verified": return "Verified";
    case "under_review":
    case "under review": return "Under review";
    case "unverified": return "Unverified";
    default: return "Unrated";
  }
}

function mapTier(tier: string | null): string {
  if (!tier || tier === "Unrated") return "C";
  const validTiers = ["SSS", "SS", "S+", "S", "A", "B", "C", "D", "F"];
  if (validTiers.includes(tier)) return tier;
  const tierMap: Record<string, string> = {
    "sss": "SSS", "ss": "SS", "s_plus": "S+", "s": "S", "a": "A",
    "b": "B", "c": "C", "d": "D", "f": "F",
  };
  return tierMap[tier.toLowerCase()] || "C";
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateScoreBreakdown(score: number): ScoreCategory[] {
  // Governance Hardening v1.0: 4 components, NO ROI/Value
  // ROI removed to avoid investment-promise territory and legal liability
  // Weights: Legal 30%, Developer 30%, Location 25%, Progress 15%
  const legalScore = Math.round(score * 0.30 * (0.8 + Math.random() * 0.4));
  const developerScore = Math.round(score * 0.30 * (0.8 + Math.random() * 0.4));
  const locationScore = Math.round(score * 0.25 * (0.8 + Math.random() * 0.4));
  const progressScore = Math.round(score * 0.15 * (0.8 + Math.random() * 0.4));

  return [
    { category: "Legal", score: Math.min(legalScore, 30), maxScore: 30 },
    { category: "Developer", score: Math.min(developerScore, 30), maxScore: 30 },
    { category: "Location", score: Math.min(locationScore, 25), maxScore: 25 },
    { category: "Progress", score: Math.min(progressScore, 15), maxScore: 15 },
  ];
}

function generateRoiLabel(score: number | null): Project["roiLabel"] {
  const s = score || 50;
  if (s >= 75) return "Strong";
  if (s >= 50) return "Average";
  if (s >= 30) return "Weak";
  return "Fail";
}

function mapRoiLabel(dbValue: string | null): Project["roiLabel"] | undefined {
  if (!dbValue) return undefined;
  const mapping: Record<string, Project["roiLabel"]> = {
    "Manh": "Strong",
    "Mạnh": "Strong",
    "Strong": "Strong",
    "TrungBinh": "Average",
    "Trung bình": "Average",
    "Average": "Average",
    "Yeu": "Weak",
    "Yếu": "Weak",
    "Weak": "Weak",
    "Fail": "Fail",
  };
  return mapping[dbValue] || undefined;
}

// ============================================================================
// TYPE DEFINITIONS (Prisma to Frontend mapping)
// ============================================================================

interface PrismaProject {
  id: string;
  slug: string;
  name: string;
  nameEn: string | null;
  tier: string;
  score: number;
  verificationStatus: string;
  sponsored: boolean;
  district: string;
  city: string;
  verdict: string | null;
  roiLabel: string | null;
  sourceCount: number;
  imageUrl: string | null;
  latitude: unknown;
  longitude: unknown;
  updatedAt: Date;
  developer: {
    id: string;
    slug: string;
    name: string;
    nameEn: string | null;
    tier: string;
    projectCount: number;
    foundedYear: number | null;
    headquarters: string | null;
    website: string | null;
    stockCode: string | null;
    description: string | null;
    overallScore: number | null;
  };
  signals: {
    legalStatus: string | null;
    priceRange: string | null;
    liquidityStatus: string | null;
  } | null;
  metrics: {
    totalUnits: number | null;
    soldUnits: number | null;
    availableUnits: number | null;
    salesProgress: unknown;
    minPricePerSqm: bigint | null;
    maxPricePerSqm: bigint | null;
    avgPricePerSqm: bigint | null;
    minArea: number | null;
    maxArea: number | null;
    avgArea: number | null;
    totalLandArea: unknown;
  } | null;
}

interface PrismaDeveloper {
  id: string;
  slug: string;
  name: string;
  nameEn: string | null;
  tier: string;
  projectCount: number;
  foundedYear: number | null;
  headquarters: string | null;
  website: string | null;
  stockCode: string | null;
  description: string | null;
  financialHealthScore: number | null;
  deliveryTrackRecord: number | null;
  legalComplianceScore: number | null;
  customerSatisfactionScore: number | null;
  overallScore: number | null;
}

// ============================================================================
// MAPPING FUNCTIONS
// ============================================================================

function mapPrismaToProject(p: PrismaProject): Project {
  const score = p.score || 50;
  const developerSlug = p.developer?.slug || generateSlug(p.developer?.name || "unknown");

  return {
    slug: p.slug,
    name: p.name,
    name_en: p.nameEn || undefined,
    tier: mapTier(p.tier) as Project["tier"],
    score,
    verificationStatus: mapVerificationStatus(p.verificationStatus),
    sponsored: p.sponsored || false,
    district: p.district || "Unknown",
    city: p.city || "Vietnam",
    verdict: p.verdict || `Project ${p.name} information is being updated.`,
    signals: {
      legal: (p.signals?.legalStatus as Project["signals"]["legal"]) || "Average",
      price: p.signals?.priceRange || generatePriceRange(p.slug, p.district || "", p.city || "", mapTier(p.tier)),
      liquidity: (p.signals?.liquidityStatus as Project["signals"]["liquidity"]) || (score >= 60 ? "Good" : score >= 40 ? "Average" : "Poor"),
    },
    updatedAt: p.updatedAt ? p.updatedAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    sourceCount: p.sourceCount || 1,
    developer: {
      name: p.developer?.name || "Unknown",
      slug: developerSlug,
      tier: mapTier(p.developer?.tier) as Developer["tier"],
      projectCount: p.developer?.projectCount || 1,
      foundedYear: p.developer?.foundedYear || undefined,
      headquarters: p.developer?.headquarters || undefined,
      website: p.developer?.website || undefined,
      stockCode: p.developer?.stockCode || undefined,
      description: p.developer?.description || undefined,
      score: p.developer?.overallScore || undefined,
    },
    whyBullets: [],
    keyRisks: [],
    roiLabel: mapRoiLabel(p.roiLabel) || generateRoiLabel(score) || "Average",
    bestForBullets: [],
    evidenceLinks: [],
    scoreBreakdown: generateScoreBreakdown(score),
    history: [],
    // Sales metrics if available
    salesMetrics: p.metrics?.totalUnits ? {
      totalUnits: p.metrics.totalUnits,
      soldUnits: p.metrics.soldUnits || 0,
      availableUnits: p.metrics.availableUnits || 0,
      salesProgress: p.metrics.salesProgress ? Number(p.metrics.salesProgress) : 0,
    } : undefined,
    // Price metrics if available
    priceMetrics: p.metrics?.minPricePerSqm || p.metrics?.maxPricePerSqm ? {
      minPrice: p.metrics.minPricePerSqm ? Number(p.metrics.minPricePerSqm) : 0,
      maxPrice: p.metrics.maxPricePerSqm ? Number(p.metrics.maxPricePerSqm) : 0,
      avgPrice: p.metrics.avgPricePerSqm ? Number(p.metrics.avgPricePerSqm) : 0,
    } : undefined,
    // Area metrics if available
    areaMetrics: p.metrics?.minArea ? {
      minArea: p.metrics.minArea,
      maxArea: p.metrics.maxArea || p.metrics.minArea,
      avgArea: p.metrics.avgArea || p.metrics.minArea,
      totalLandArea: p.metrics.totalLandArea ? Number(p.metrics.totalLandArea) : undefined,
    } : undefined,
    // Generate quality of life data based on district and tier
    qualityOfLife: generateQualityOfLife(p.district || "Unknown", p.city || "Vietnam", mapTier(p.tier)),
    // Add researched project details if available
    projectDetails: (() => {
      const details = getProjectDetails(p.slug);
      if (details) {
        return {
          totalUnits: details.totalUnits,
          towers: details.towers,
          floors: details.floors,
          unitSizes: details.unitSizes,
          bedrooms: details.bedrooms,
          completionYear: details.completionYear,
          status: details.status,
          amenities: details.amenities,
          highlights: details.highlights,
        };
      }
      return undefined;
    })(),
  };
}

function mapPrismaToDeveloper(d: PrismaDeveloper): Developer {
  const tier = mapTier(d.tier);

  return {
    name: d.name,
    name_en: d.nameEn || undefined,
    slug: d.slug,
    tier: tier as Developer["tier"],
    projectCount: d.projectCount || 0,
    foundedYear: d.foundedYear || undefined,
    headquarters: d.headquarters || undefined,
    website: d.website || undefined,
    stockCode: d.stockCode || undefined,
    description: d.description || undefined,
    score: d.overallScore || (
      d.financialHealthScore || d.deliveryTrackRecord
        ? Math.round(((d.financialHealthScore || 50) + (d.deliveryTrackRecord || 50) + (d.legalComplianceScore || 50) + (d.customerSatisfactionScore || 50)) / 4)
        : undefined
    ),
  };
}

// ============================================================================
// DATA FETCHING FUNCTIONS
// ============================================================================

/**
 * Fetch all projects from database, with fallback to mock data
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const projects = await db.project.findMany({
      include: {
        developer: true,
        signals: true,
        metrics: true,
      },
      orderBy: [
        { tier: "asc" },
        { score: "desc" },
      ],
    });

    // If database has projects, use them
    if (projects.length > 0) {
      return projects.map(mapPrismaToProject);
    }

    // Fallback to mock data when database is empty
    console.log("[data] Database empty, using generated mock data");
    if (!mockProjectsCache) {
      mockProjectsCache = generateProjects(500);
    }
    return mockProjectsCache;
  } catch (error) {
    console.error("[data] Failed to fetch projects, using mock data:", error);
    // Fallback to mock data on error
    if (!mockProjectsCache) {
      mockProjectsCache = generateProjects(500);
    }
    return mockProjectsCache;
  }
}

/**
 * Fetch a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const project = await db.project.findUnique({
      where: { slug },
      include: {
        developer: true,
        signals: true,
        metrics: true,
        scoreCategories: true,
        evidenceLinks: true,
        history: true,
        whyBullets: { orderBy: { order: "asc" } },
        keyRisks: { orderBy: { order: "asc" } },
        bestForBullets: { orderBy: { order: "asc" } },
      },
    });

    if (!project) {
      // Try mock data fallback
      if (!mockProjectsCache) {
        mockProjectsCache = generateProjects(500);
      }
      return mockProjectsCache.find(p => p.slug === slug) || null;
    }

    const baseProject = mapPrismaToProject(project);

    // Add additional data from relations
    return {
      ...baseProject,
      whyBullets: project.whyBullets?.map(b => b.content) || [],
      keyRisks: project.keyRisks?.map(r => r.content) || [],
      bestForBullets: project.bestForBullets?.map(b => b.content) || [],
      evidenceLinks: project.evidenceLinks?.map(e => ({
        domain: e.domain,
        title: e.title,
        url: e.url,
      })) || [],
      scoreBreakdown: project.scoreCategories?.length
        ? project.scoreCategories.map(c => ({
            category: c.category,
            score: c.score,
            maxScore: c.maxScore,
          }))
        : generateScoreBreakdown(project.score),
      history: project.history?.map(h => ({
        date: h.eventDate.toISOString().split("T")[0],
        event: h.description,
        tierChange: h.tierChange || undefined,
        scoreChange: h.scoreChange || undefined,
      })) || [],
    };
  } catch (error) {
    console.error(`[data] Failed to fetch project "${slug}", trying mock data:`, error);
    // Fallback to mock data
    if (!mockProjectsCache) {
      mockProjectsCache = generateProjects(500);
    }
    return mockProjectsCache.find(p => p.slug === slug) || null;
  }
}

/**
 * Fetch projects by developer slug
 */
export async function getProjectsByDeveloper(developerSlug: string): Promise<Project[]> {
  try {
    const developer = await db.developer.findUnique({
      where: { slug: developerSlug },
    });

    if (!developer) return [];

    const projects = await db.project.findMany({
      where: { developerId: developer.id },
      include: {
        developer: true,
        signals: true,
        metrics: true,
      },
      orderBy: { score: "desc" },
    });

    return projects.map(mapPrismaToProject);
  } catch (error) {
    console.error(`[data] Failed to fetch projects for developer "${developerSlug}":`, error);
    return [];
  }
}

/**
 * Fetch all developers from database
 */
export async function getAllDevelopers(): Promise<Developer[]> {
  try {
    const developers = await db.developer.findMany({
      orderBy: { projectCount: "desc" },
    });

    return developers.map(mapPrismaToDeveloper);
  } catch (error) {
    console.error("[data] Failed to fetch developers:", error);
    return [];
  }
}

/**
 * Fetch a single developer by slug
 */
export async function getDeveloperBySlug(slug: string): Promise<Developer | null> {
  try {
    const developer = await db.developer.findUnique({
      where: { slug },
    });

    if (!developer) return null;

    return mapPrismaToDeveloper(developer);
  } catch (error) {
    console.error(`[data] Failed to fetch developer "${slug}":`, error);
    return null;
  }
}

/**
 * Get all unique districts from projects
 */
export async function getAllDistricts(): Promise<string[]> {
  try {
    const projects = await db.project.findMany({
      select: { district: true },
      distinct: ["district"],
      orderBy: { district: "asc" },
    });

    return projects.map(p => p.district).filter(Boolean);
  } catch (error) {
    console.error("[data] Failed to fetch districts:", error);
    return [];
  }
}

/**
 * Search projects by query
 */
export async function searchProjects(searchQuery: string): Promise<Project[]> {
  try {
    const projects = await db.project.findMany({
      where: {
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { nameEn: { contains: searchQuery, mode: "insensitive" } },
          { district: { contains: searchQuery, mode: "insensitive" } },
          { city: { contains: searchQuery, mode: "insensitive" } },
          { developer: { name: { contains: searchQuery, mode: "insensitive" } } },
          { developer: { nameEn: { contains: searchQuery, mode: "insensitive" } } },
        ],
      },
      include: {
        developer: true,
        signals: true,
        metrics: true,
      },
      orderBy: { score: "desc" },
      take: 50,
    });

    return projects.map(mapPrismaToProject);
  } catch (error) {
    console.error("[data] Failed to search projects:", error);
    return [];
  }
}

/**
 * Get project count
 */
export async function getProjectCount(): Promise<number> {
  try {
    return await db.project.count();
  } catch (error) {
    console.error("[data] Failed to count projects:", error);
    return 0;
  }
}

/**
 * Get developer count
 */
export async function getDeveloperCount(): Promise<number> {
  try {
    return await db.developer.count();
  } catch (error) {
    console.error("[data] Failed to count developers:", error);
    return 0;
  }
}
