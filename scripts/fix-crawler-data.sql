-- =============================================================================
-- RealTera Data Fix Migration
-- Run this script to fix NULL fields and generate missing data
-- =============================================================================

-- 1. GENERATE PROJECT SLUGS
-- =============================================================================
UPDATE projects
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRANSLATE(
        project_name,
        'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ',
        'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD'
      ),
      '[^a-zA-Z0-9]+', '-', 'g'
    ),
    '^-|-$', '', 'g'
  )
)
WHERE slug IS NULL OR slug = '';

-- 2. GENERATE DEVELOPER SLUGS
-- =============================================================================
UPDATE developers
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRANSLATE(
        legal_name,
        'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ',
        'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD'
      ),
      '[^a-zA-Z0-9]+', '-', 'g'
    ),
    '^-|-$', '', 'g'
  )
)
WHERE slug IS NULL OR slug = '';

-- 3. MAP PROVINCE CODES TO CITY NAMES
-- =============================================================================
UPDATE projects SET city = 'Hà Nội' WHERE (province = 'HN' OR province ILIKE '%ha noi%' OR province ILIKE '%hanoi%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'TP. Hồ Chí Minh' WHERE (province = 'HCM' OR province ILIKE '%ho chi minh%' OR province ILIKE '%hcm%' OR province ILIKE '%saigon%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Hải Phòng' WHERE (province = 'HP' OR province ILIKE '%hai phong%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Đà Nẵng' WHERE (province = 'DN' OR province ILIKE '%da nang%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Cần Thơ' WHERE (province = 'CT' OR province ILIKE '%can tho%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Bình Dương' WHERE (province = 'BD' OR province ILIKE '%binh duong%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Bà Rịa - Vũng Tàu' WHERE (province = 'BR-VT' OR province ILIKE '%vung tau%' OR province ILIKE '%ba ria%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Quảng Ninh' WHERE (province = 'QN' OR province ILIKE '%quang ninh%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Thanh Hóa' WHERE (province = 'TH' OR province ILIKE '%thanh hoa%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Nghệ An' WHERE (province = 'NA' OR province ILIKE '%nghe an%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Thừa Thiên Huế' WHERE (province = 'TTH' OR province ILIKE '%hue%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Khánh Hòa' WHERE (province = 'KH' OR province ILIKE '%khanh hoa%' OR province ILIKE '%nha trang%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Lâm Đồng' WHERE (province = 'LD' OR province ILIKE '%lam dong%' OR province ILIKE '%da lat%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Bắc Ninh' WHERE (province = 'BN' OR province ILIKE '%bac ninh%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Hải Dương' WHERE (province = 'HD' OR province ILIKE '%hai duong%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Đồng Nai' WHERE (province ILIKE '%dong nai%') AND (city IS NULL OR city = '');
UPDATE projects SET city = 'Long An' WHERE (province ILIKE '%long an%') AND (city IS NULL OR city = '');

-- Fallback: use province as city if still NULL
UPDATE projects SET city = province WHERE city IS NULL AND province IS NOT NULL;
UPDATE projects SET city = 'Việt Nam' WHERE city IS NULL;

-- 4. SET ROI LABELS FROM SCORES
-- =============================================================================
UPDATE projects SET roi_label = 'Mạnh'::roi_label WHERE score >= 75 AND (roi_label IS NULL OR roi_label::text = '');
UPDATE projects SET roi_label = 'Trung bình'::roi_label WHERE score >= 50 AND score < 75 AND (roi_label IS NULL OR roi_label::text = '');
UPDATE projects SET roi_label = 'Yếu'::roi_label WHERE score >= 30 AND score < 50 AND (roi_label IS NULL OR roi_label::text = '');
UPDATE projects SET roi_label = 'Fail'::roi_label WHERE score < 30 AND (roi_label IS NULL OR roi_label::text = '');

-- 5. SET SOURCE COUNT
-- =============================================================================
UPDATE projects SET source_count = 1 WHERE source_count IS NULL OR source_count = 0;

-- Update source_count from sources JSONB array length
UPDATE projects
SET source_count = COALESCE(jsonb_array_length(sources), 1)
WHERE sources IS NOT NULL AND jsonb_typeof(sources) = 'array';

-- 6. UPDATE DEVELOPER PROJECT COUNTS
-- =============================================================================
UPDATE developers d
SET project_count = sub.cnt
FROM (
  SELECT developer_id, COUNT(*) as cnt
  FROM projects
  WHERE developer_id IS NOT NULL
  GROUP BY developer_id
) sub
WHERE d.id = sub.developer_id;

-- 7. CALCULATE AND SET DEVELOPER TIERS
-- =============================================================================
UPDATE developers d
SET tier = CASE
  WHEN sub.avg_score >= 80 THEN 'SSS'::developer_tier
  WHEN sub.avg_score >= 70 THEN 'S'::developer_tier
  WHEN sub.avg_score >= 60 THEN 'A'::developer_tier
  WHEN sub.avg_score >= 50 THEN 'B'::developer_tier
  WHEN sub.avg_score >= 40 THEN 'C'::developer_tier
  WHEN sub.avg_score >= 30 THEN 'D'::developer_tier
  ELSE 'F'::developer_tier
END
FROM (
  SELECT developer_id, AVG(score) as avg_score
  FROM projects
  WHERE developer_id IS NOT NULL AND score IS NOT NULL
  GROUP BY developer_id
) sub
WHERE d.id = sub.developer_id;

-- Set remaining developers to C tier
UPDATE developers SET tier = 'C'::developer_tier WHERE tier IS NULL OR tier::text = 'Unrated';

-- 8. GENERATE VERDICTS
-- =============================================================================
UPDATE projects
SET verdict = CONCAT(
  project_name,
  CASE
    WHEN tier::text IN ('SSS', 'S+', 'S') THEN ' là dự án được đánh giá cao với '
    WHEN tier::text IN ('A', 'B') THEN ' là dự án đạt tiêu chuẩn tốt với '
    WHEN tier::text = 'C' THEN ' đạt mức điểm trung bình '
    ELSE ' cần cải thiện với điểm hiện tại '
  END,
  COALESCE(score::text, '50'), ' điểm. ',
  CASE WHEN district IS NOT NULL THEN CONCAT('Vị trí tại ', district, ', ', COALESCE(city, 'Việt Nam'), '. ') ELSE '' END,
  CASE WHEN total_units IS NOT NULL AND total_units > 0 THEN CONCAT('Quy mô ', total_units, ' căn. ') ELSE '' END
)
WHERE verdict IS NULL OR verdict = '';

-- 9. CREATE SCORE BREAKDOWN TABLE IF NOT EXISTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS score_breakdown (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('legal', 'developer', 'location', 'progress', 'value')),
  score INTEGER NOT NULL CHECK (score >= 0),
  max_score INTEGER NOT NULL CHECK (max_score > 0),
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, category)
);

CREATE INDEX IF NOT EXISTS idx_score_breakdown_project ON score_breakdown(project_id);

-- 10. POPULATE SCORE BREAKDOWNS
-- =============================================================================
-- Insert score breakdowns for all projects
INSERT INTO score_breakdown (project_id, category, score, max_score)
SELECT
  p.id,
  'legal',
  LEAST(ROUND(COALESCE(p.score, 50) * 0.25), 25)::int,
  25
FROM projects p
WHERE NOT EXISTS (SELECT 1 FROM score_breakdown sb WHERE sb.project_id = p.id AND sb.category = 'legal')
ON CONFLICT (project_id, category) DO NOTHING;

INSERT INTO score_breakdown (project_id, category, score, max_score)
SELECT
  p.id,
  'developer',
  LEAST(ROUND(COALESCE(p.score, 50) * 0.20), 20)::int,
  20
FROM projects p
WHERE NOT EXISTS (SELECT 1 FROM score_breakdown sb WHERE sb.project_id = p.id AND sb.category = 'developer')
ON CONFLICT (project_id, category) DO NOTHING;

INSERT INTO score_breakdown (project_id, category, score, max_score)
SELECT
  p.id,
  'location',
  LEAST(ROUND(COALESCE(p.score, 50) * 0.20), 20)::int,
  20
FROM projects p
WHERE NOT EXISTS (SELECT 1 FROM score_breakdown sb WHERE sb.project_id = p.id AND sb.category = 'location')
ON CONFLICT (project_id, category) DO NOTHING;

INSERT INTO score_breakdown (project_id, category, score, max_score)
SELECT
  p.id,
  'progress',
  LEAST(ROUND(COALESCE(p.score, 50) * 0.20), 20)::int,
  20
FROM projects p
WHERE NOT EXISTS (SELECT 1 FROM score_breakdown sb WHERE sb.project_id = p.id AND sb.category = 'progress')
ON CONFLICT (project_id, category) DO NOTHING;

INSERT INTO score_breakdown (project_id, category, score, max_score)
SELECT
  p.id,
  'value',
  LEAST(ROUND(COALESCE(p.score, 50) * 0.15), 15)::int,
  15
FROM projects p
WHERE NOT EXISTS (SELECT 1 FROM score_breakdown sb WHERE sb.project_id = p.id AND sb.category = 'value')
ON CONFLICT (project_id, category) DO NOTHING;

-- 11. SET DEVELOPER HEADQUARTERS FROM ADDRESS
-- =============================================================================
UPDATE developers
SET headquarters = address
WHERE headquarters IS NULL AND address IS NOT NULL;

-- 12. VERIFICATION REPORT
-- =============================================================================
SELECT
  'Projects' as table_name,
  COUNT(*) as total,
  COUNT(slug) as with_slug,
  COUNT(city) as with_city,
  COUNT(verdict) as with_verdict,
  COUNT(roi_label) as with_roi,
  COUNT(CASE WHEN source_count > 0 THEN 1 END) as with_sources
FROM projects

UNION ALL

SELECT
  'Developers' as table_name,
  COUNT(*) as total,
  COUNT(slug) as with_slug,
  COUNT(headquarters) as with_city,
  COUNT(description) as with_verdict,
  COUNT(CASE WHEN tier::text != 'Unrated' AND tier IS NOT NULL THEN 1 END) as with_roi,
  COUNT(website) as with_sources
FROM developers;
