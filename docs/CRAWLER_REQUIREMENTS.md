# RealTera Crawler Requirements Specification

## Overview

This document specifies the exact data requirements for the crawler to properly populate the frontend. The frontend expects specific fields that are currently NULL or missing in the database.

## Current Status (as of Dec 2024)

| Metric | Current | Required |
|--------|---------|----------|
| Projects | 100 | - |
| Projects with slug | 0 | 100 |
| Projects with verdict | 0 | 100 |
| Projects with price | ~10 | 100 |
| Developers | 60 | - |
| Developers with slug | 0 | 60 |
| Developers with tier | 0 (all "Unrated") | 60 |

---

## 1. Projects Table

### 1.1 Required Fields (MUST populate)

```typescript
interface RequiredProjectFields {
  // Identification
  slug: string;              // REQUIRED - URL-safe identifier
  project_name: string;      // Already populated ✓

  // Location (full names, not codes)
  city: string;              // REQUIRED - "Hà Nội", not "HN"
  district: string;          // Already populated ✓
  province: string;          // Already populated ✓ (but as codes)

  // Scoring
  tier: ProjectTier;         // Already populated ✓
  score: number;             // Already populated ✓
  verification_status: VerificationStatus;

  // Content
  verdict: string;           // REQUIRED - 2-3 sentence summary
  roi_label: RoiLabel;       // REQUIRED - "Mạnh" | "Trung bình" | "Yếu" | "Fail"
  source_count: number;      // REQUIRED - number of data sources
}
```

### 1.2 Slug Generation

```typescript
// Vietnamese-safe slug generation
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Remove diacritics
    .replace(/đ/g, "d")               // Handle đ
    .replace(/[^a-z0-9]+/g, "-")      // Replace non-alphanumeric
    .replace(/^-|-$/g, "");           // Trim dashes
}

// Example:
// "The Ambience Hải Phòng" → "the-ambience-hai-phong"
// "Vinhomes Grand Park" → "vinhomes-grand-park"
```

### 1.3 Province Code Mapping

The crawler MUST convert province codes to full Vietnamese names:

```typescript
const PROVINCE_MAP: Record<string, string> = {
  "HN": "Hà Nội",
  "HCM": "TP. Hồ Chí Minh",
  "HP": "Hải Phòng",
  "DN": "Đà Nẵng",
  "CT": "Cần Thơ",
  "BD": "Bình Dương",
  "DL": "Đà Lạt",
  "BR-VT": "Bà Rịa - Vũng Tàu",
  "QN": "Quảng Ninh",
  "TH": "Thanh Hóa",
  "NA": "Nghệ An",
  "TTH": "Thừa Thiên Huế",
  "KH": "Khánh Hòa",
  "GL": "Gia Lai",
  "DKL": "Đắk Lắk",
  "LĐ": "Lâm Đồng",
  "BN": "Bắc Ninh",
  "HD": "Hải Dương",
  "HY": "Hưng Yên",
  "VP": "Vĩnh Phúc",
  "BT": "Bình Thuận",
  "LA": "Long An",
  "TG": "Tiền Giang",
  "AG": "An Giang",
  "KG": "Kiên Giang",
};
```

### 1.4 Verdict Generation

The crawler should generate verdicts using this template:

```typescript
function generateVerdict(project: Project): string {
  const parts: string[] = [];

  // 1. Tier-based intro
  if (project.tier === "SSS" || project.tier === "S+" || project.tier === "S") {
    parts.push(`${project.name} là dự án được đánh giá cao với ${project.score} điểm.`);
  } else if (project.tier === "A" || project.tier === "B") {
    parts.push(`${project.name} là dự án đạt tiêu chuẩn tốt với ${project.score} điểm.`);
  } else if (project.tier === "C") {
    parts.push(`${project.name} đạt mức điểm trung bình ${project.score}/100.`);
  } else {
    parts.push(`${project.name} cần cải thiện với điểm hiện tại ${project.score}/100.`);
  }

  // 2. Location
  parts.push(`Vị trí tại ${project.district}, ${project.city}.`);

  // 3. Scale (if available)
  if (project.total_units) {
    parts.push(`Quy mô ${project.total_units} căn.`);
  }

  // 4. Price (if available)
  if (project.price_from && project.price_to) {
    parts.push(`Giá từ ${formatPrice(project.price_from)} - ${formatPrice(project.price_to)}/m².`);
  }

  // 5. Developer mention
  if (project.developer_name) {
    parts.push(`Chủ đầu tư: ${project.developer_name}.`);
  }

  return parts.join(" ");
}
```

### 1.5 ROI Label Calculation

```typescript
function calculateRoiLabel(score: number): RoiLabel {
  if (score >= 75) return "Mạnh";
  if (score >= 50) return "Trung bình";
  if (score >= 30) return "Yếu";
  return "Fail";
}
```

### 1.6 Price Fields

Extract and store prices in VND:

```typescript
interface PriceFields {
  price_from: number | null;   // Min price per m² in VND
  price_to: number | null;     // Max price per m² in VND
}

// Examples:
// "35 triệu/m²" → 35000000
// "2.5 tỷ" (total for 80m²) → 31250000 per m²
// "45-55 triệu/m²" → price_from: 45000000, price_to: 55000000
```

### 1.7 Construction Status

Map to standardized values:

```typescript
type ConstructionStatus =
  | "completed"           // Đã bàn giao
  | "under_construction"  // Đang xây dựng
  | "planning"           // Chuẩn bị khởi công
  | "foundation"         // Đang làm móng
  | "topping_out";       // Đã cất nóc
```

---

## 2. Developers Table

### 2.1 Required Fields

```typescript
interface RequiredDeveloperFields {
  legal_name: string;        // Already populated ✓
  slug: string;              // REQUIRED - URL-safe identifier
  tier: DeveloperTier;       // REQUIRED - calculated from projects
  project_count: number;     // REQUIRED - count of projects
  headquarters: string;      // REQUIRED - main office address
  description: string;       // REQUIRED - company description
}
```

### 2.2 Developer Tier Calculation

Calculate tier based on average project scores:

```typescript
function calculateDeveloperTier(projects: Project[]): DeveloperTier {
  if (projects.length === 0) return "C";

  const avgScore = projects.reduce((sum, p) => sum + p.score, 0) / projects.length;
  const topTierCount = projects.filter(p => ["SSS", "S+", "S", "A"].includes(p.tier)).length;
  const topTierRatio = topTierCount / projects.length;

  // Weighted calculation
  const weightedScore = avgScore * 0.6 + (topTierRatio * 100) * 0.4;

  if (weightedScore >= 85) return "SSS";
  if (weightedScore >= 75) return "S";
  if (weightedScore >= 65) return "A";
  if (weightedScore >= 55) return "B";
  if (weightedScore >= 45) return "C";
  if (weightedScore >= 35) return "D";
  return "F";
}
```

---

## 3. Score Breakdown Table (NEW)

Create a new table to store score breakdown:

```sql
CREATE TABLE IF NOT EXISTS score_breakdown (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(project_id, category)
);

CREATE INDEX idx_score_breakdown_project ON score_breakdown(project_id);
```

### 3.1 Score Categories

```typescript
interface ScoreCategory {
  category: "legal" | "developer" | "location" | "progress" | "value";
  score: number;
  maxScore: number;
  reasoning?: string;
}

const SCORE_WEIGHTS = {
  legal: 25,      // Pháp lý (25 points max)
  developer: 20,  // Chủ đầu tư (20 points max)
  location: 20,   // Vị trí (20 points max)
  progress: 20,   // Tiến độ (20 points max)
  value: 15,      // Giá trị (15 points max)
};
```

### 3.2 Scoring Criteria

#### Legal (25 points)
- Sổ đỏ/Sổ hồng đầy đủ: 25
- GPXD + chấp thuận đầu tư: 20
- Chỉ có GPXD: 15
- Đang hoàn thiện pháp lý: 10
- Có vấn đề pháp lý: 5
- Chưa rõ: 8

#### Developer (20 points)
- SSS/S+ tier developer: 20
- S/A tier: 16
- B tier: 12
- C tier: 8
- D/F tier: 4
- Unknown: 6

#### Location (20 points)
- Central district, excellent connectivity: 20
- Good district, good connectivity: 16
- Average location: 12
- Remote but developing: 8
- Poor accessibility: 4

#### Progress (20 points)
- Completed, delivered: 20
- Near completion (>80%): 17
- Under construction (50-80%): 14
- Early construction (<50%): 10
- Planning stage: 6

#### Value (15 points)
- Below market price, high ROI potential: 15
- Fair price, good value: 12
- Market price: 9
- Above market: 6
- Overpriced: 3

---

## 4. Enrichment Evidence

### 4.1 Legal Claims Format

```typescript
interface LegalClaim {
  claim_type: "land_use_right" | "construction_permit" | "sales_approval" | "legal_issue";
  claim_value: {
    certificateType?: string;  // "sổ đỏ", "sổ hồng", etc.
    documentNumber?: string;
    issueDate?: string;
    status?: "issued" | "pending" | "rejected";
    issueType?: "dispute" | "violation" | "pending";
  };
  source_url: string;
  confidence_score: number;  // 0.0 - 1.0
}
```

---

## 5. Image Cleaning

Remove placeholder/app store images:

```typescript
function cleanImages(images: string[]): string[] {
  const BLACKLIST = [
    "app-store.png",
    "g-play.png",
    "empty-state.svg",
    "placeholder",
    "default",
    "no-image",
  ];

  return images.filter(url =>
    !BLACKLIST.some(blocked => url.toLowerCase().includes(blocked))
  );
}
```

---

## 6. Migration Script

Run this to fix existing data:

```sql
-- 1. Generate slugs for projects
UPDATE projects
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRANSLATE(
        NORMALIZE(project_name, NFD),
        'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ',
        'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'
      ),
      '[^a-z0-9]+', '-', 'g'
    ),
    '^-|-$', '', 'g'
  )
)
WHERE slug IS NULL;

-- 2. Generate slugs for developers
UPDATE developers
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRANSLATE(
        NORMALIZE(legal_name, NFD),
        'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ',
        'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'
      ),
      '[^a-z0-9]+', '-', 'g'
    ),
    '^-|-$', '', 'g'
  )
)
WHERE slug IS NULL;

-- 3. Map province codes to city names
UPDATE projects SET city = 'Hà Nội' WHERE province = 'HN' AND city IS NULL;
UPDATE projects SET city = 'TP. Hồ Chí Minh' WHERE province = 'HCM' AND city IS NULL;
UPDATE projects SET city = 'Hải Phòng' WHERE province = 'HP' AND city IS NULL;
UPDATE projects SET city = 'Đà Nẵng' WHERE province = 'DN' AND city IS NULL;
UPDATE projects SET city = 'Cần Thơ' WHERE province = 'CT' AND city IS NULL;
UPDATE projects SET city = 'Bình Dương' WHERE province = 'BD' AND city IS NULL;

-- 4. Set ROI labels based on score
UPDATE projects SET roi_label = 'Mạnh' WHERE score >= 75 AND roi_label IS NULL;
UPDATE projects SET roi_label = 'Trung bình' WHERE score >= 50 AND score < 75 AND roi_label IS NULL;
UPDATE projects SET roi_label = 'Yếu' WHERE score >= 30 AND score < 50 AND roi_label IS NULL;
UPDATE projects SET roi_label = 'Fail' WHERE score < 30 AND roi_label IS NULL;

-- 5. Set source_count
UPDATE projects SET source_count = 1 WHERE source_count IS NULL OR source_count = 0;

-- 6. Update developer tiers (run after calculating from projects)
UPDATE developers d
SET tier = CASE
  WHEN avg_score >= 85 THEN 'SSS'
  WHEN avg_score >= 75 THEN 'S'
  WHEN avg_score >= 65 THEN 'A'
  WHEN avg_score >= 55 THEN 'B'
  WHEN avg_score >= 45 THEN 'C'
  WHEN avg_score >= 35 THEN 'D'
  ELSE 'F'
END
FROM (
  SELECT developer_id, AVG(score) as avg_score
  FROM projects
  WHERE developer_id IS NOT NULL
  GROUP BY developer_id
) p
WHERE d.id = p.developer_id;

-- 7. Update project counts
UPDATE developers d
SET project_count = (
  SELECT COUNT(*) FROM projects p WHERE p.developer_id = d.id
);
```

---

## 7. API Contract

The frontend expects this response format:

```typescript
interface ProjectResponse {
  slug: string;
  name: string;
  tier: "SSS" | "S+" | "S" | "A" | "B" | "C" | "D" | "F";
  score: number;
  verificationStatus: "Verified" | "Under review" | "Unverified" | "Unrated";
  sponsored: boolean;
  district: string;
  city: string;
  verdict: string;
  signals: {
    legal: "Tốt" | "Trung bình" | "Yếu";
    price: string;
    liquidity: "Tốt" | "Trung bình" | "Yếu";
  };
  updatedAt: string;  // ISO date
  sourceCount: number;
  developer: {
    name: string;
    slug: string;
    tier: "SSS" | "S" | "A" | "B" | "C" | "D" | "F";
    projectCount: number;
  };
  roiLabel?: "Mạnh" | "Trung bình" | "Yếu" | "Fail";
  scoreBreakdown?: Array<{
    category: string;
    score: number;
    maxScore: number;
  }>;
  legalStage?: string;
  dataQuality?: number;
  priceMetrics?: {
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
  };
  salesMetrics?: {
    totalUnits: number;
    soldUnits: number;
    availableUnits: number;
    salesProgress: number;
  };
}
```

---

## Summary Checklist

### Immediate (DB Migration)
- [ ] Generate slugs for all projects
- [ ] Generate slugs for all developers
- [ ] Map province codes to city names
- [ ] Set ROI labels from scores
- [ ] Set source_count to 1 minimum
- [ ] Calculate developer tiers from projects

### Crawler Updates
- [ ] Generate slug on insert
- [ ] Store full city name, not code
- [ ] Generate verdict from template
- [ ] Extract price_from/price_to
- [ ] Store construction_status
- [ ] Clean image URLs
- [ ] Calculate and store score breakdown
- [ ] Update developer tier on project insert/update

### New Tables
- [ ] Create score_breakdown table
- [ ] Populate from existing scores
