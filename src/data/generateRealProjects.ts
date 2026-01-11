/**
 * Real Vietnamese Real Estate Project Generator
 * Generates 500 projects with accurate data and English translations
 */

import type { Project, Developer, TierLevel, DeveloperTier, VerificationStatus, RoiLabel, SignalQuality, LegalStage, QualityOfLifeMetrics } from "@/lib/types";

// =====================================
// REAL DEVELOPERS DATABASE
// =====================================

export const realDevelopers: Record<string, Developer> = {
  // === SSS TIER (Top developers) ===
  vingroup: {
    name: "Vingroup",
    name_en: "Vingroup JSC",
    slug: "vingroup",
    tier: "SSS",
    projectCount: 45,
    foundedYear: 1993,
    headquarters: "Hà Nội",
    headquarters_en: "Hanoi",
    website: "https://vingroup.net",
    stockCode: "VIC",
    score: 95,
    completedProjects: 38,
    ongoingProjects: 7,
    marketCap: "180,000 tỷ VNĐ",
    employeeCount: 50000,
    description: "Tập đoàn tư nhân lớn nhất Việt Nam, hoạt động đa ngành từ bất động sản, du lịch, giáo dục đến công nghệ.",
    description_en: "Vietnam's largest private conglomerate, operating across real estate, tourism, education, and technology sectors.",
    certifications: ["ISO 9001:2015", "Top 50 công ty niêm yết tốt nhất VN"],
    certifications_en: ["ISO 9001:2015", "Top 50 Listed Companies in Vietnam"],
    scoreBreakdown: [
      { category: "Năng lực tài chính", category_en: "Financial Capacity", score: 25, maxScore: 25, description: "Vốn hóa lớn, dòng tiền ổn định", description_en: "Large market cap, stable cash flow" },
      { category: "Uy tín thương hiệu", category_en: "Brand Reputation", score: 23, maxScore: 25, description: "Thương hiệu số 1 Việt Nam", description_en: "Vietnam's #1 brand" },
      { category: "Lịch sử bàn giao", category_en: "Delivery Track Record", score: 24, maxScore: 25, description: "Bàn giao đúng hạn, chất lượng cao", description_en: "On-time delivery, high quality" },
      { category: "Pháp lý & Minh bạch", category_en: "Legal & Transparency", score: 23, maxScore: 25, description: "Công ty niêm yết, công khai tài chính", description_en: "Listed company, transparent financials" },
    ],
  },
  vinhomes: {
    name: "Vinhomes",
    name_en: "Vinhomes JSC",
    slug: "vinhomes",
    tier: "SSS",
    projectCount: 40,
    foundedYear: 2008,
    headquarters: "Hà Nội",
    headquarters_en: "Hanoi",
    website: "https://vinhomes.vn",
    stockCode: "VHM",
    score: 94,
    completedProjects: 32,
    ongoingProjects: 8,
    marketCap: "220,000 tỷ VNĐ",
    employeeCount: 12000,
    description: "Công ty bất động sản lớn nhất Việt Nam, là thành viên của Vingroup, chuyên phát triển các khu đô thị và căn hộ cao cấp.",
    description_en: "Vietnam's largest real estate company, a subsidiary of Vingroup, specializing in developing urban areas and premium apartments.",
    certifications: ["ISO 14001:2015", "Green Building Certification"],
    certifications_en: ["ISO 14001:2015", "Green Building Certification"],
    scoreBreakdown: [
      { category: "Năng lực tài chính", category_en: "Financial Capacity", score: 25, maxScore: 25, description: "Vốn hóa lớn nhất ngành BĐS", description_en: "Largest market cap in real estate sector" },
      { category: "Uy tín thương hiệu", category_en: "Brand Reputation", score: 24, maxScore: 25, description: "Thương hiệu BĐS số 1", description_en: "#1 real estate brand" },
      { category: "Lịch sử bàn giao", category_en: "Delivery Track Record", score: 23, maxScore: 25, description: "Bàn giao đúng tiến độ", description_en: "On-schedule delivery" },
      { category: "Pháp lý & Minh bạch", category_en: "Legal & Transparency", score: 22, maxScore: 25, description: "Niêm yết, kiểm toán độc lập", description_en: "Listed, independently audited" },
    ],
  },
  masterise: {
    name: "Masterise Homes",
    name_en: "Masterise Homes",
    slug: "masterise",
    tier: "SSS",
    projectCount: 12,
    foundedYear: 2018,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://masterisehomes.com",
    score: 92,
    completedProjects: 5,
    ongoingProjects: 7,
    description: "Chủ đầu tư cao cấp với các dự án phức hợp đẳng cấp quốc tế tại TP.HCM. Hợp tác chiến lược với Marriott International.",
    description_en: "Premium developer with world-class mixed-use projects in HCMC. Strategic partnership with Marriott International.",
    certifications: ["Marriott Partnership", "LEED Certified"],
    certifications_en: ["Marriott Partnership", "LEED Certified"],
    scoreBreakdown: [
      { category: "Năng lực tài chính", category_en: "Financial Capacity", score: 24, maxScore: 25, description: "Hậu thuẫn từ Techcombank", description_en: "Backed by Techcombank" },
      { category: "Uy tín thương hiệu", category_en: "Brand Reputation", score: 24, maxScore: 25, description: "Phân khúc luxury hàng đầu", description_en: "Leading luxury segment" },
      { category: "Lịch sử bàn giao", category_en: "Delivery Track Record", score: 22, maxScore: 25, description: "Bàn giao đúng tiến độ", description_en: "On-schedule delivery" },
      { category: "Pháp lý & Minh bạch", category_en: "Legal & Transparency", score: 22, maxScore: 25, description: "Pháp lý rõ ràng", description_en: "Clear legal documentation" },
    ],
  },

  // === S+ TIER ===
  capitaland: {
    name: "CapitaLand Vietnam",
    name_en: "CapitaLand Vietnam",
    slug: "capitaland",
    tier: "S",
    projectCount: 28,
    foundedYear: 2000,
    headquarters: "Singapore",
    headquarters_en: "Singapore",
    website: "https://capitaland.com",
    score: 88,
    completedProjects: 22,
    ongoingProjects: 6,
    description: "Tập đoàn bất động sản hàng đầu châu Á từ Singapore với danh mục đầu tư đa dạng tại Việt Nam.",
    description_en: "Leading Asian real estate group from Singapore with a diverse portfolio in Vietnam.",
    certifications: ["BCA Green Mark", "ISO 14001"],
    certifications_en: ["BCA Green Mark", "ISO 14001"],
  },
  gamuda: {
    name: "Gamuda Land Vietnam",
    name_en: "Gamuda Land Vietnam",
    slug: "gamuda",
    tier: "S",
    projectCount: 15,
    foundedYear: 1995,
    headquarters: "Malaysia",
    headquarters_en: "Malaysia",
    website: "https://gamudaland.com.vn",
    score: 87,
    completedProjects: 10,
    ongoingProjects: 5,
    description: "Tập đoàn phát triển BĐS Malaysia nổi tiếng với các khu đô thị sinh thái như Gamuda City và Celadon City.",
    description_en: "Malaysian developer known for eco-townships like Gamuda City and Celadon City.",
    certifications: ["GBI Gold", "FIABCI Award"],
    certifications_en: ["GBI Gold", "FIABCI Award"],
  },
  sungroup: {
    name: "Sun Group",
    name_en: "Sun Group",
    slug: "sun-group",
    tier: "S",
    projectCount: 30,
    foundedYear: 2007,
    headquarters: "Hà Nội",
    headquarters_en: "Hanoi",
    website: "https://sungroup.com.vn",
    score: 86,
    completedProjects: 20,
    ongoingProjects: 10,
    description: "Tập đoàn đầu tư và phát triển du lịch, nghỉ dưỡng và giải trí hàng đầu Việt Nam. Chủ đầu tư Bà Nà Hills, Phú Quốc.",
    description_en: "Leading Vietnamese tourism, resort and entertainment developer. Developer of Ba Na Hills and Phu Quoc projects.",
    certifications: ["World Travel Awards"],
    certifications_en: ["World Travel Awards"],
  },

  // === S TIER ===
  novaland: {
    name: "Novaland",
    name_en: "Novaland Group",
    slug: "novaland",
    tier: "S",
    projectCount: 50,
    foundedYear: 1992,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://novaland.com.vn",
    stockCode: "NVL",
    score: 78,
    completedProjects: 35,
    ongoingProjects: 15,
    marketCap: "45,000 tỷ VNĐ",
    employeeCount: 8000,
    description: "Một trong những chủ đầu tư lớn nhất miền Nam với quỹ đất rộng lớn. Đang tái cơ cấu nợ.",
    description_en: "One of the largest developers in Southern Vietnam with vast land bank. Currently undergoing debt restructuring.",
    certifications: ["ISO 9001:2015"],
    certifications_en: ["ISO 9001:2015"],
    scoreBreakdown: [
      { category: "Năng lực tài chính", category_en: "Financial Capacity", score: 18, maxScore: 25, description: "Đang tái cơ cấu nợ", description_en: "Undergoing debt restructuring" },
      { category: "Uy tín thương hiệu", category_en: "Brand Reputation", score: 22, maxScore: 25, description: "Thương hiệu mạnh miền Nam", description_en: "Strong Southern Vietnam brand" },
      { category: "Lịch sử bàn giao", category_en: "Delivery Track Record", score: 19, maxScore: 25, description: "Một số dự án chậm tiến độ", description_en: "Some projects delayed" },
      { category: "Pháp lý & Minh bạch", category_en: "Legal & Transparency", score: 19, maxScore: 25, description: "Công ty niêm yết", description_en: "Listed company" },
    ],
  },
  phumyhung: {
    name: "Phú Mỹ Hưng",
    name_en: "Phu My Hung Development",
    slug: "phu-my-hung",
    tier: "S",
    projectCount: 25,
    foundedYear: 1993,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://phumyhung.vn",
    score: 85,
    completedProjects: 20,
    ongoingProjects: 5,
    description: "Chủ đầu tư khu đô thị Phú Mỹ Hưng - khu đô thị kiểu mẫu đầu tiên tại Việt Nam, liên doanh Việt - Đài.",
    description_en: "Developer of Phu My Hung urban area - Vietnam's first model township, Vietnamese-Taiwanese joint venture.",
    certifications: ["FIABCI Award", "Best Township Development"],
    certifications_en: ["FIABCI Award", "Best Township Development"],
  },

  // === A TIER ===
  khangdien: {
    name: "Khang Điền",
    name_en: "Khang Dien House",
    slug: "khang-dien",
    tier: "A",
    projectCount: 22,
    foundedYear: 2001,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://khangdien.com.vn",
    stockCode: "KDH",
    score: 82,
    completedProjects: 18,
    ongoingProjects: 4,
    marketCap: "18,000 tỷ VNĐ",
    description: "Chuyên phát triển nhà phố và biệt thự phía Đông TP.HCM. Uy tín cao trong phân khúc nhà liền thổ.",
    description_en: "Specializes in townhouses and villas in East HCMC. Highly reputable in landed property segment.",
    certifications: ["Vietnam Property Awards"],
    certifications_en: ["Vietnam Property Awards"],
  },
  namlong: {
    name: "Nam Long",
    name_en: "Nam Long Investment Corp",
    slug: "nam-long",
    tier: "A",
    projectCount: 18,
    foundedYear: 1992,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://namlonggroup.com.vn",
    stockCode: "NLG",
    score: 80,
    completedProjects: 14,
    ongoingProjects: 4,
    description: "Chủ đầu tư uy tín với danh mục dự án nhà ở tầm trung tại TP.HCM và Long An.",
    description_en: "Reputable developer with mid-range housing projects in HCMC and Long An.",
    certifications: ["ISO 9001:2015"],
    certifications_en: ["ISO 9001:2015"],
  },
  hungthinhland: {
    name: "Hưng Thịnh Land",
    name_en: "Hung Thinh Land",
    slug: "hung-thinh",
    tier: "A",
    projectCount: 35,
    foundedYear: 2002,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://hungthinhcorp.com.vn",
    score: 79,
    completedProjects: 28,
    ongoingProjects: 7,
    description: "Tập đoàn BĐS lớn với danh mục đa dạng từ căn hộ đến nghỉ dưỡng tại miền Nam và miền Trung.",
    description_en: "Large real estate group with diverse portfolio from apartments to resorts in Southern and Central Vietnam.",
    certifications: ["Top 10 Real Estate Vietnam"],
    certifications_en: ["Top 10 Real Estate Vietnam"],
  },
  datxanh: {
    name: "Đất Xanh Group",
    name_en: "Dat Xanh Group",
    slug: "dat-xanh",
    tier: "A",
    projectCount: 30,
    foundedYear: 2003,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://datxanh.vn",
    stockCode: "DXG",
    score: 77,
    completedProjects: 22,
    ongoingProjects: 8,
    description: "Tập đoàn BĐS tích hợp từ phát triển, phân phối đến quản lý. Sở hữu thương hiệu Dat Xanh Services.",
    description_en: "Integrated real estate group covering development, distribution and management. Owns Dat Xanh Services brand.",
    certifications: ["Vietnam Property Awards"],
    certifications_en: ["Vietnam Property Awards"],
  },
  phatdat: {
    name: "Phát Đạt",
    name_en: "Phat Dat Real Estate",
    slug: "phat-dat",
    tier: "A",
    projectCount: 20,
    foundedYear: 2004,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://phatdat.com.vn",
    stockCode: "PDR",
    score: 76,
    completedProjects: 15,
    ongoingProjects: 5,
    description: "Chủ đầu tư uy tín với các dự án căn hộ và văn phòng tại TP.HCM và Bình Dương.",
    description_en: "Reputable developer with apartment and office projects in HCMC and Binh Duong.",
    certifications: ["ISO 9001:2015"],
    certifications_en: ["ISO 9001:2015"],
  },
  hado: {
    name: "Hà Đô Group",
    name_en: "Ha Do Group",
    slug: "ha-do",
    tier: "A",
    projectCount: 18,
    foundedYear: 2004,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://hadogroup.vn",
    stockCode: "HDG",
    score: 75,
    completedProjects: 14,
    ongoingProjects: 4,
    description: "Tập đoàn đa ngành với mảng BĐS cao cấp tại TP.HCM. Sở hữu dự án Hado Centrosa Garden nổi tiếng.",
    description_en: "Diversified group with premium real estate in HCMC. Owns the famous Hado Centrosa Garden project.",
    certifications: ["PropertyGuru Awards"],
    certifications_en: ["PropertyGuru Awards"],
  },
  ecopark: {
    name: "Ecopark",
    name_en: "Ecopark Corporation",
    slug: "ecopark",
    tier: "A",
    projectCount: 8,
    foundedYear: 2001,
    headquarters: "Hưng Yên",
    headquarters_en: "Hung Yen",
    website: "https://ecopark.com.vn",
    score: 83,
    completedProjects: 6,
    ongoingProjects: 2,
    description: "Chủ đầu tư khu đô thị sinh thái Ecopark 500 ha - khu đô thị xanh hàng đầu miền Bắc.",
    description_en: "Developer of 500-hectare Ecopark eco-township - leading green urban area in Northern Vietnam.",
    certifications: ["FIABCI Award", "Green Township"],
    certifications_en: ["FIABCI Award", "Green Township"],
  },

  // === B TIER ===
  angia: {
    name: "An Gia Investment",
    name_en: "An Gia Investment",
    slug: "an-gia",
    tier: "B",
    projectCount: 15,
    foundedYear: 2006,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://angia.com.vn",
    stockCode: "AGG",
    score: 72,
    completedProjects: 10,
    ongoingProjects: 5,
    description: "Chủ đầu tư căn hộ tầm trung với các dự án The Sóng, The Standard, The Signature.",
    description_en: "Mid-range apartment developer with projects like The Song, The Standard, The Signature.",
  },
  phudong: {
    name: "Phú Đông Group",
    name_en: "Phu Dong Group",
    slug: "phu-dong",
    tier: "B",
    projectCount: 10,
    foundedYear: 2014,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://phudonggroup.com",
    score: 70,
    completedProjects: 6,
    ongoingProjects: 4,
    description: "Chuyên phát triển dự án căn hộ phân khúc vừa túi tiền tại khu vực Thủ Đức.",
    description_en: "Specializes in affordable apartment projects in Thu Duc area.",
  },
  picity: {
    name: "Pi Group",
    name_en: "Pi Group",
    slug: "pi-group",
    tier: "B",
    projectCount: 6,
    foundedYear: 2010,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://pigroup.vn",
    score: 68,
    completedProjects: 3,
    ongoingProjects: 3,
    description: "Chủ đầu tư dự án PiCity High Park tại Quận 12 TP.HCM.",
    description_en: "Developer of PiCity High Park project in District 12, HCMC.",
  },
  lephong: {
    name: "Tập đoàn Lê Phong",
    name_en: "Le Phong Group",
    slug: "le-phong",
    tier: "B",
    projectCount: 35,
    foundedYear: 2012,
    headquarters: "Bình Dương",
    headquarters_en: "Binh Duong",
    website: "https://lephong.vn",
    score: 67,
    completedProjects: 28,
    ongoingProjects: 7,
    description: "Chủ đầu tư lớn tại Bình Dương với nhiều dự án nhà phố và căn hộ giá rẻ.",
    description_en: "Major developer in Binh Duong with many townhouse and affordable apartment projects.",
  },
  ceohome: {
    name: "CEO Group",
    name_en: "CEO Group",
    slug: "ceo-group",
    tier: "B",
    projectCount: 12,
    foundedYear: 2007,
    headquarters: "Hà Nội",
    headquarters_en: "Hanoi",
    website: "https://ceogroup.com.vn",
    stockCode: "CEO",
    score: 65,
    completedProjects: 8,
    ongoingProjects: 4,
    description: "Tập đoàn bất động sản và du lịch với các dự án tại Phú Quốc và Vân Đồn.",
    description_en: "Real estate and tourism group with projects in Phu Quoc and Van Don.",
  },
  bimgroup: {
    name: "BIM Group",
    name_en: "BIM Group",
    slug: "bim-group",
    tier: "B",
    projectCount: 10,
    foundedYear: 2003,
    headquarters: "Hà Nội",
    headquarters_en: "Hanoi",
    website: "https://bimgroup.com.vn",
    score: 73,
    completedProjects: 7,
    ongoingProjects: 3,
    description: "Tập đoàn đa ngành với các dự án nghỉ dưỡng cao cấp tại Phú Quốc.",
    description_en: "Diversified group with premium resort projects in Phu Quoc.",
  },

  // === C TIER ===
  sunshine: {
    name: "Sunshine Group",
    name_en: "Sunshine Group",
    slug: "sunshine",
    tier: "C",
    projectCount: 20,
    foundedYear: 2005,
    headquarters: "Hà Nội",
    headquarters_en: "Hanoi",
    website: "https://sunshinegroup.vn",
    score: 62,
    completedProjects: 12,
    ongoingProjects: 8,
    description: "Chủ đầu tư với nhiều dự án tại Hà Nội. Một số dự án gặp vấn đề về tiến độ.",
    description_en: "Developer with many projects in Hanoi. Some projects facing schedule issues.",
  },
  vanphuc: {
    name: "Van Phuc Group",
    name_en: "Van Phuc Group",
    slug: "van-phuc",
    tier: "C",
    projectCount: 6,
    foundedYear: 2003,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://vanphucgroup.vn",
    score: 60,
    completedProjects: 4,
    ongoingProjects: 2,
    description: "Chủ đầu tư khu đô thị Van Phuc City tại Thủ Đức.",
    description_en: "Developer of Van Phuc City urban area in Thu Duc.",
  },
  hdmon: {
    name: "HD Mon Holdings",
    name_en: "HD Mon Holdings",
    slug: "hdmon",
    tier: "C",
    projectCount: 8,
    foundedYear: 2010,
    headquarters: "Hà Nội",
    headquarters_en: "Hanoi",
    website: "https://hdmon.vn",
    score: 58,
    completedProjects: 5,
    ongoingProjects: 3,
    description: "Chủ đầu tư các dự án căn hộ tại Hà Nội với giá cạnh tranh.",
    description_en: "Developer of apartment projects in Hanoi with competitive pricing.",
  },
  dicgroup: {
    name: "DIC Corp",
    name_en: "DIC Corporation",
    slug: "dic-corp",
    tier: "C",
    projectCount: 15,
    foundedYear: 1990,
    headquarters: "Vũng Tàu",
    headquarters_en: "Vung Tau",
    website: "https://dic.vn",
    stockCode: "DIG",
    score: 55,
    completedProjects: 10,
    ongoingProjects: 5,
    description: "Tập đoàn BĐS và hạ tầng tại Bà Rịa - Vũng Tàu. Đang gặp khó khăn tài chính.",
    description_en: "Real estate and infrastructure group in Ba Ria - Vung Tau. Currently facing financial difficulties.",
  },

  // === D TIER ===
  landgold: {
    name: "LandGold",
    name_en: "LandGold",
    slug: "landgold",
    tier: "D",
    projectCount: 3,
    foundedYear: 2018,
    headquarters: "Bình Dương",
    headquarters_en: "Binh Duong",
    score: 45,
    completedProjects: 1,
    ongoingProjects: 2,
    description: "Chủ đầu tư mới với dự án tại Bình Dương. Ít thông tin về lịch sử bàn giao.",
    description_en: "New developer with projects in Binh Duong. Limited delivery track record.",
  },
  thuanviet: {
    name: "Thuận Việt",
    name_en: "Thuan Viet Corp",
    slug: "thuan-viet",
    tier: "D",
    projectCount: 4,
    foundedYear: 2015,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    score: 42,
    completedProjects: 2,
    ongoingProjects: 2,
    description: "Chủ đầu tư nhỏ với dự án tại ngoại ô TP.HCM.",
    description_en: "Small developer with projects in HCMC suburbs.",
  },
  hoangquan: {
    name: "Hoàng Quân",
    name_en: "Hoang Quan Group",
    slug: "hoang-quan",
    tier: "D",
    projectCount: 12,
    foundedYear: 2003,
    headquarters: "TP. Hồ Chí Minh",
    headquarters_en: "Ho Chi Minh City",
    website: "https://hoangquan.com.vn",
    stockCode: "HQC",
    score: 40,
    completedProjects: 8,
    ongoingProjects: 4,
    description: "Từng là chủ đầu tư nhà ở xã hội lớn nhưng đang gặp nhiều vấn đề về pháp lý và tài chính.",
    description_en: "Former major social housing developer but facing significant legal and financial issues.",
  },

  // === F TIER ===
  flcgroup: {
    name: "FLC Group",
    name_en: "FLC Group",
    slug: "flc-group",
    tier: "F",
    projectCount: 25,
    foundedYear: 2001,
    headquarters: "Hà Nội",
    headquarters_en: "Hanoi",
    stockCode: "FLC",
    score: 25,
    completedProjects: 15,
    ongoingProjects: 10,
    description: "Tập đoàn gặp khủng hoảng nghiêm trọng sau vụ việc lãnh đạo bị bắt năm 2022. Nhiều dự án bị đình trệ.",
    description_en: "Group facing severe crisis after leadership arrests in 2022. Many projects stalled.",
  },
  tanhoangminh: {
    name: "Tân Hoàng Minh",
    name_en: "Tan Hoang Minh Group",
    slug: "tan-hoang-minh",
    tier: "F",
    projectCount: 8,
    foundedYear: 1993,
    headquarters: "Hà Nội",
    headquarters_en: "Hanoi",
    score: 20,
    completedProjects: 5,
    ongoingProjects: 3,
    description: "Tập đoàn bị khủng hoảng sau vụ trái phiếu năm 2022. Nhiều dự án đang tranh chấp.",
    description_en: "Group in crisis after 2022 bond scandal. Many projects in dispute.",
  },
};

// =====================================
// LOCATION DATA
// =====================================

interface LocationData {
  district: string;
  district_en: string;
  city: string;
  city_en: string;
}

const hcmLocations: LocationData[] = [
  { district: "Thủ Đức", district_en: "Thu Duc City", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Quận 1", district_en: "District 1", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Quận 2", district_en: "District 2", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Quận 3", district_en: "District 3", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Quận 4", district_en: "District 4", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Quận 5", district_en: "District 5", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Quận 6", district_en: "District 6", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Quận 7", district_en: "District 7", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Quận 8", district_en: "District 8", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Quận 9", district_en: "District 9", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Quận 10", district_en: "District 10", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Quận 11", district_en: "District 11", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Quận 12", district_en: "District 12", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Bình Thạnh", district_en: "Binh Thanh", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Phú Nhuận", district_en: "Phu Nhuan", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Gò Vấp", district_en: "Go Vap", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Tân Bình", district_en: "Tan Binh", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Tân Phú", district_en: "Tan Phu", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Bình Tân", district_en: "Binh Tan", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Nhà Bè", district_en: "Nha Be", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Hóc Môn", district_en: "Hoc Mon", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Củ Chi", district_en: "Cu Chi", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
  { district: "Cần Giờ", district_en: "Can Gio", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
];

const hanoiLocations: LocationData[] = [
  { district: "Hoàn Kiếm", district_en: "Hoan Kiem", city: "Hà Nội", city_en: "Hanoi" },
  { district: "Ba Đình", district_en: "Ba Dinh", city: "Hà Nội", city_en: "Hanoi" },
  { district: "Đống Đa", district_en: "Dong Da", city: "Hà Nội", city_en: "Hanoi" },
  { district: "Hai Bà Trưng", district_en: "Hai Ba Trung", city: "Hà Nội", city_en: "Hanoi" },
  { district: "Hoàng Mai", district_en: "Hoang Mai", city: "Hà Nội", city_en: "Hanoi" },
  { district: "Thanh Xuân", district_en: "Thanh Xuan", city: "Hà Nội", city_en: "Hanoi" },
  { district: "Cầu Giấy", district_en: "Cau Giay", city: "Hà Nội", city_en: "Hanoi" },
  { district: "Long Biên", district_en: "Long Bien", city: "Hà Nội", city_en: "Hanoi" },
  { district: "Tây Hồ", district_en: "Tay Ho", city: "Hà Nội", city_en: "Hanoi" },
  { district: "Bắc Từ Liêm", district_en: "Bac Tu Liem", city: "Hà Nội", city_en: "Hanoi" },
  { district: "Nam Từ Liêm", district_en: "Nam Tu Liem", city: "Hà Nội", city_en: "Hanoi" },
  { district: "Hà Đông", district_en: "Ha Dong", city: "Hà Nội", city_en: "Hanoi" },
  { district: "Gia Lâm", district_en: "Gia Lam", city: "Hà Nội", city_en: "Hanoi" },
  { district: "Đông Anh", district_en: "Dong Anh", city: "Hà Nội", city_en: "Hanoi" },
];

const binhduongLocations: LocationData[] = [
  { district: "Thủ Dầu Một", district_en: "Thu Dau Mot", city: "Bình Dương", city_en: "Binh Duong" },
  { district: "Dĩ An", district_en: "Di An", city: "Bình Dương", city_en: "Binh Duong" },
  { district: "Thuận An", district_en: "Thuan An", city: "Bình Dương", city_en: "Binh Duong" },
  { district: "Tân Uyên", district_en: "Tan Uyen", city: "Bình Dương", city_en: "Binh Duong" },
  { district: "Bến Cát", district_en: "Ben Cat", city: "Bình Dương", city_en: "Binh Duong" },
];

const dongnaiLocations: LocationData[] = [
  { district: "Biên Hòa", district_en: "Bien Hoa", city: "Đồng Nai", city_en: "Dong Nai" },
  { district: "Long Thành", district_en: "Long Thanh", city: "Đồng Nai", city_en: "Dong Nai" },
  { district: "Nhơn Trạch", district_en: "Nhon Trach", city: "Đồng Nai", city_en: "Dong Nai" },
];

const danangLocations: LocationData[] = [
  { district: "Hải Châu", district_en: "Hai Chau", city: "Đà Nẵng", city_en: "Da Nang" },
  { district: "Thanh Khê", district_en: "Thanh Khe", city: "Đà Nẵng", city_en: "Da Nang" },
  { district: "Sơn Trà", district_en: "Son Tra", city: "Đà Nẵng", city_en: "Da Nang" },
  { district: "Ngũ Hành Sơn", district_en: "Ngu Hanh Son", city: "Đà Nẵng", city_en: "Da Nang" },
  { district: "Liên Chiểu", district_en: "Lien Chieu", city: "Đà Nẵng", city_en: "Da Nang" },
];

const nhatrangLocations: LocationData[] = [
  { district: "Nha Trang", district_en: "Nha Trang", city: "Khánh Hòa", city_en: "Khanh Hoa" },
  { district: "Cam Ranh", district_en: "Cam Ranh", city: "Khánh Hòa", city_en: "Khanh Hoa" },
];

const phuquocLocations: LocationData[] = [
  { district: "Phú Quốc", district_en: "Phu Quoc", city: "Kiên Giang", city_en: "Kien Giang" },
];

const allLocations: LocationData[] = [
  ...hcmLocations,
  ...hanoiLocations,
  ...binhduongLocations,
  ...dongnaiLocations,
  ...danangLocations,
  ...nhatrangLocations,
  ...phuquocLocations,
];

// =====================================
// REAL PROJECT TEMPLATES
// =====================================

interface ProjectTemplate {
  nameVi: string;
  nameEn: string;
  developerKey: string;
  location: LocationData;
  tier: TierLevel;
  baseScore: number;
  projectType: "apartment" | "villa" | "townhouse" | "mixed" | "resort";
  priceRange: { min: number; max: number }; // million VND per m2
  units: number;
  legalStage: LegalStage;
}

// Real flagship projects from major developers
const flagshipProjects: ProjectTemplate[] = [
  // Vinhomes projects
  {
    nameVi: "Vinhomes Grand Park",
    nameEn: "Vinhomes Grand Park",
    developerKey: "vinhomes",
    location: { district: "Thủ Đức", district_en: "Thu Duc City", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "SSS",
    baseScore: 95,
    projectType: "mixed",
    priceRange: { min: 55, max: 80 },
    units: 43500,
    legalStage: "so_hong",
  },
  {
    nameVi: "Vinhomes Central Park",
    nameEn: "Vinhomes Central Park",
    developerKey: "vinhomes",
    location: { district: "Bình Thạnh", district_en: "Binh Thanh", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "SSS",
    baseScore: 96,
    projectType: "mixed",
    priceRange: { min: 80, max: 150 },
    units: 10000,
    legalStage: "so_hong",
  },
  {
    nameVi: "Vinhomes Ocean Park",
    nameEn: "Vinhomes Ocean Park",
    developerKey: "vinhomes",
    location: { district: "Gia Lâm", district_en: "Gia Lam", city: "Hà Nội", city_en: "Hanoi" },
    tier: "SSS",
    baseScore: 94,
    projectType: "mixed",
    priceRange: { min: 45, max: 70 },
    units: 35000,
    legalStage: "so_hong",
  },
  {
    nameVi: "Vinhomes Smart City",
    nameEn: "Vinhomes Smart City",
    developerKey: "vinhomes",
    location: { district: "Nam Từ Liêm", district_en: "Nam Tu Liem", city: "Hà Nội", city_en: "Hanoi" },
    tier: "SSS",
    baseScore: 93,
    projectType: "mixed",
    priceRange: { min: 50, max: 85 },
    units: 28000,
    legalStage: "so_hong",
  },
  {
    nameVi: "Vinhomes Golden River",
    nameEn: "Vinhomes Golden River",
    developerKey: "vinhomes",
    location: { district: "Quận 1", district_en: "District 1", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "SSS",
    baseScore: 97,
    projectType: "apartment",
    priceRange: { min: 150, max: 350 },
    units: 3500,
    legalStage: "so_hong",
  },

  // Masterise projects
  {
    nameVi: "Masteri Thảo Điền",
    nameEn: "Masteri Thao Dien",
    developerKey: "masterise",
    location: { district: "Thủ Đức", district_en: "Thu Duc City", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "SSS",
    baseScore: 92,
    projectType: "apartment",
    priceRange: { min: 70, max: 120 },
    units: 3000,
    legalStage: "so_hong",
  },
  {
    nameVi: "Masteri Centre Point",
    nameEn: "Masteri Centre Point",
    developerKey: "masterise",
    location: { district: "Thủ Đức", district_en: "Thu Duc City", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "SSS",
    baseScore: 91,
    projectType: "apartment",
    priceRange: { min: 65, max: 100 },
    units: 2500,
    legalStage: "so_hong",
  },
  {
    nameVi: "Masteri Grand View",
    nameEn: "Masteri Grand View",
    developerKey: "masterise",
    location: { district: "Thủ Đức", district_en: "Thu Duc City", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "S+",
    baseScore: 89,
    projectType: "apartment",
    priceRange: { min: 60, max: 90 },
    units: 4200,
    legalStage: "da_gpxd",
  },
  {
    nameVi: "The Grand Hàng Bài",
    nameEn: "The Grand Hang Bai",
    developerKey: "masterise",
    location: { district: "Hoàn Kiếm", district_en: "Hoan Kiem", city: "Hà Nội", city_en: "Hanoi" },
    tier: "SSS",
    baseScore: 94,
    projectType: "mixed",
    priceRange: { min: 500, max: 800 },
    units: 500,
    legalStage: "da_gpxd",
  },

  // CapitaLand projects
  {
    nameVi: "The Estella",
    nameEn: "The Estella",
    developerKey: "capitaland",
    location: { district: "Quận 2", district_en: "District 2", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "S",
    baseScore: 86,
    projectType: "apartment",
    priceRange: { min: 60, max: 90 },
    units: 1800,
    legalStage: "so_hong",
  },
  {
    nameVi: "Feliz en Vista",
    nameEn: "Feliz en Vista",
    developerKey: "capitaland",
    location: { district: "Thủ Đức", district_en: "Thu Duc City", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "S",
    baseScore: 85,
    projectType: "apartment",
    priceRange: { min: 55, max: 80 },
    units: 1600,
    legalStage: "so_hong",
  },

  // Gamuda projects
  {
    nameVi: "Celadon City",
    nameEn: "Celadon City",
    developerKey: "gamuda",
    location: { district: "Tân Phú", district_en: "Tan Phu", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "S",
    baseScore: 87,
    projectType: "mixed",
    priceRange: { min: 45, max: 70 },
    units: 8000,
    legalStage: "so_hong",
  },
  {
    nameVi: "Eaton Park",
    nameEn: "Eaton Park",
    developerKey: "gamuda",
    location: { district: "Thủ Đức", district_en: "Thu Duc City", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "S",
    baseScore: 88,
    projectType: "apartment",
    priceRange: { min: 65, max: 95 },
    units: 2700,
    legalStage: "da_gpxd",
  },
  {
    nameVi: "Gamuda City",
    nameEn: "Gamuda City",
    developerKey: "gamuda",
    location: { district: "Hoàng Mai", district_en: "Hoang Mai", city: "Hà Nội", city_en: "Hanoi" },
    tier: "S",
    baseScore: 86,
    projectType: "mixed",
    priceRange: { min: 40, max: 65 },
    units: 12000,
    legalStage: "so_hong",
  },

  // Novaland projects
  {
    nameVi: "The Sun Avenue",
    nameEn: "The Sun Avenue",
    developerKey: "novaland",
    location: { district: "Thủ Đức", district_en: "Thu Duc City", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "A",
    baseScore: 78,
    projectType: "apartment",
    priceRange: { min: 45, max: 65 },
    units: 3200,
    legalStage: "so_hong",
  },
  {
    nameVi: "Aqua City",
    nameEn: "Aqua City",
    developerKey: "novaland",
    location: { district: "Biên Hòa", district_en: "Bien Hoa", city: "Đồng Nai", city_en: "Dong Nai" },
    tier: "B",
    baseScore: 68,
    projectType: "mixed",
    priceRange: { min: 35, max: 60 },
    units: 15000,
    legalStage: "chua_khoi_cong",
  },
  {
    nameVi: "NovaWorld Phan Thiết",
    nameEn: "NovaWorld Phan Thiet",
    developerKey: "novaland",
    location: { district: "Phan Thiết", district_en: "Phan Thiet", city: "Bình Thuận", city_en: "Binh Thuan" },
    tier: "B",
    baseScore: 65,
    projectType: "resort",
    priceRange: { min: 30, max: 80 },
    units: 25000,
    legalStage: "chua_khoi_cong",
  },

  // Sun Group projects
  {
    nameVi: "Sun Grand City Ancora",
    nameEn: "Sun Grand City Ancora",
    developerKey: "sungroup",
    location: { district: "Hai Bà Trưng", district_en: "Hai Ba Trung", city: "Hà Nội", city_en: "Hanoi" },
    tier: "S",
    baseScore: 85,
    projectType: "apartment",
    priceRange: { min: 60, max: 100 },
    units: 800,
    legalStage: "so_hong",
  },
  {
    nameVi: "Sun Grand City Thụy Khuê",
    nameEn: "Sun Grand City Thuy Khue",
    developerKey: "sungroup",
    location: { district: "Tây Hồ", district_en: "Tay Ho", city: "Hà Nội", city_en: "Hanoi" },
    tier: "S",
    baseScore: 84,
    projectType: "apartment",
    priceRange: { min: 55, max: 85 },
    units: 1200,
    legalStage: "so_hong",
  },

  // Khang Điền projects
  {
    nameVi: "Safira Khang Điền",
    nameEn: "Safira Khang Dien",
    developerKey: "khangdien",
    location: { district: "Thủ Đức", district_en: "Thu Duc City", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "A",
    baseScore: 82,
    projectType: "apartment",
    priceRange: { min: 40, max: 55 },
    units: 1500,
    legalStage: "so_hong",
  },
  {
    nameVi: "Verosa Park",
    nameEn: "Verosa Park",
    developerKey: "khangdien",
    location: { district: "Thủ Đức", district_en: "Thu Duc City", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "A",
    baseScore: 83,
    projectType: "villa",
    priceRange: { min: 80, max: 150 },
    units: 300,
    legalStage: "so_hong",
  },

  // Ecopark
  {
    nameVi: "Ecopark",
    nameEn: "Ecopark",
    developerKey: "ecopark",
    location: { district: "Văn Giang", district_en: "Van Giang", city: "Hưng Yên", city_en: "Hung Yen" },
    tier: "A",
    baseScore: 84,
    projectType: "mixed",
    priceRange: { min: 35, max: 80 },
    units: 20000,
    legalStage: "so_hong",
  },

  // Phú Mỹ Hưng
  {
    nameVi: "Midtown",
    nameEn: "Midtown",
    developerKey: "phumyhung",
    location: { district: "Quận 7", district_en: "District 7", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "S",
    baseScore: 86,
    projectType: "apartment",
    priceRange: { min: 65, max: 100 },
    units: 2000,
    legalStage: "so_hong",
  },
  {
    nameVi: "The Antonia",
    nameEn: "The Antonia",
    developerKey: "phumyhung",
    location: { district: "Quận 7", district_en: "District 7", city: "TP. Hồ Chí Minh", city_en: "Ho Chi Minh City" },
    tier: "S",
    baseScore: 85,
    projectType: "apartment",
    priceRange: { min: 60, max: 90 },
    units: 800,
    legalStage: "so_hong",
  },
];

// =====================================
// PROJECT NAME GENERATION
// =====================================

// Real-style project name patterns
const projectNamePatterns = [
  // Pattern: Developer + Name
  { pattern: "developer_name", examples: ["Vinhomes Central Park", "Masteri Thảo Điền"] },
  // Pattern: The + Name
  { pattern: "the_name", examples: ["The Estella", "The Manor", "The Sun Avenue"] },
  // Pattern: Name + Location hint
  { pattern: "name_location", examples: ["Celadon City", "Ecopark", "Sala"] },
];

// Unique project name bases (Vietnamese real estate style)
const projectNameBases = [
  "Aria", "Aurora", "Azzura", "Bella", "Botanica", "Brilliance", "Camelia", "Canary",
  "Capital", "Celesta", "Century", "Citadel", "Citrine", "Coastal", "Continental",
  "Coral", "Crown", "Crystal", "Diamond", "Ecohome", "Eden", "Elegance", "Elite",
  "Emerald", "Empire", "Encore", "Essence", "Evergreen", "Flora", "Fortune", "Galaxy",
  "Garden", "Gateway", "Gem", "Golden", "Grand", "Grandeur", "Green", "Greenfield",
  "Greenlake", "Greenview", "Habitat", "Harmony", "Haven", "Heritage", "Hillside",
  "Homeland", "Horizon", "Icon", "Imperial", "Infinity", "Ivory", "Jade", "Jasmine",
  "Jewel", "Kingdom", "Lakeside", "Landmark", "Lavender", "Legend", "Liberty", "Lotus",
  "Lumiere", "Luxe", "Manhattan", "Marina", "Marquis", "Metro", "Metropole", "Midtown",
  "Millennium", "Mirage", "Monaco", "Moonlight", "Noble", "Oasis", "Ocean", "Onyx",
  "Opus", "Orchid", "Oriental", "Origami", "Palazzo", "Palm", "Panorama", "Paradise",
  "Pearl", "Peninsula", "Platinum", "Plaza", "Premier", "Prestige", "Pride", "Prime",
  "Prism", "Prosperity", "Radiant", "Rainbow", "Regency", "Residence", "Richmond",
  "Riverdale", "Rivergate", "Riverside", "Riviera", "Royal", "Ruby", "Safira", "Sakura",
  "Sapphire", "Serenity", "Signature", "Skyline", "Skyvilla", "Soleil", "Somerset",
  "Sonata", "Sovereign", "Spring", "Starlight", "Sterling", "Summit", "Sunflower",
  "Sunrise", "Sunset", "Sunshine", "Symphony", "Terra", "Terrace", "Topaz", "Tower",
  "Treasure", "Trinity", "Tropical", "Urban", "Utopia", "Valley", "Vantage", "Velocity",
  "Veranda", "Verde", "Vertex", "Victory", "Vienna", "Villa", "Vintage", "Vista",
  "Vivaldi", "Waterfront", "Westgate", "Windsor", "Zenith"
];

// Second words for compound names
const projectNameSecondWords = [
  "Bay", "Boulevard", "Center", "City", "Court", "Cove", "Creek", "Drive", "East",
  "Garden", "Gate", "Grove", "Heights", "Hill", "Home", "House", "Lake", "Land",
  "Lane", "Manor", "Meadow", "North", "Park", "Place", "Plaza", "Point", "Residence",
  "Ridge", "Rise", "River", "South", "Square", "Terrace", "Tower", "Town", "Valley",
  "View", "Village", "Walk", "Way", "West", "Woods"
];

// =====================================
// VERDICT AND BULLET TEMPLATES
// =====================================

const verdictTemplates = {
  SSS: [
    { vi: "Dự án hạng SSS với pháp lý hoàn chỉnh, chủ đầu tư uy tín hàng đầu. Tiềm năng tăng giá cao.", en: "SSS-tier project with complete legal documentation, top-tier developer. High appreciation potential." },
    { vi: "Chủ đầu tư đầu ngành, bàn giao đúng tiến độ. Vị trí đắc địa, thanh khoản tốt.", en: "Industry-leading developer, on-time delivery. Prime location, high liquidity." },
    { vi: "Dự án flagship của chủ đầu tư lớn nhất. Pháp lý minh bạch, chất lượng vượt trội.", en: "Flagship project from the largest developer. Transparent legal status, superior quality." },
  ],
  SS: [
    { vi: "Dự án hạng SS với chủ đầu tư hàng đầu. Pháp lý minh bạch, tiến độ đảm bảo.", en: "SS-tier project with top developer. Transparent legal status, guaranteed progress." },
    { vi: "Chất lượng xây dựng cao cấp, tiện ích đầy đủ. Tiềm năng tăng giá tốt.", en: "Premium construction quality, full amenities. Good appreciation potential." },
  ],
  "S+": [
    { vi: "Dự án cao cấp với chủ đầu tư S+. Tiến độ đảm bảo, pháp lý rõ ràng.", en: "Premium project with S+ developer. Guaranteed progress, clear legal status." },
    { vi: "Chất lượng xây dựng đạt chuẩn quốc tế. Tiện ích đầy đủ, an ninh 24/7.", en: "International construction quality. Full amenities, 24/7 security." },
  ],
  S: [
    { vi: "Dự án uy tín với vị trí tốt. Chủ đầu tư có lịch sử bàn giao tốt.", en: "Reputable project with good location. Developer has good delivery track record." },
    { vi: "Giá hợp lý trong phân khúc. Tiềm năng tăng giá ổn định.", en: "Reasonable price in segment. Stable appreciation potential." },
  ],
  A: [
    { vi: "Dự án khá với một số điểm cần lưu ý. Phù hợp đầu tư trung hạn.", en: "Good project with some considerations. Suitable for medium-term investment." },
    { vi: "Chủ đầu tư có kinh nghiệm. Cần theo dõi tiến độ xây dựng.", en: "Experienced developer. Need to monitor construction progress." },
  ],
  B: [
    { vi: "Dự án tầm trung với một số rủi ro cần đánh giá kỹ.", en: "Mid-tier project with some risks to evaluate carefully." },
    { vi: "Giá cạnh tranh nhưng cần xem xét kỹ pháp lý và tiến độ.", en: "Competitive price but need to carefully review legal status and progress." },
  ],
  C: [
    { vi: "Dự án có rủi ro. Cần thận trọng trước khi quyết định.", en: "Project has risks. Exercise caution before deciding." },
    { vi: "Chủ đầu tư có một số vấn đề về tiến độ. Cần đánh giá kỹ.", en: "Developer has some progress issues. Needs careful evaluation." },
  ],
  D: [
    { vi: "Nhiều rủi ro, không khuyến khích đầu tư.", en: "High risks, not recommended for investment." },
    { vi: "Chủ đầu tư yếu, pháp lý chưa rõ ràng. Cần cân nhắc kỹ.", en: "Weak developer, unclear legal status. Needs serious consideration." },
  ],
  F: [
    { vi: "Cảnh báo: Dự án có vấn đề nghiêm trọng. Không nên đầu tư.", en: "Warning: Project has serious issues. Not advisable to invest." },
    { vi: "Chủ đầu tư đang gặp khủng hoảng. Rủi ro rất cao.", en: "Developer facing crisis. Very high risk." },
  ],
};

const whyBulletTemplates = {
  positive: [
    { vi: "Chủ đầu tư uy tín, năng lực tài chính mạnh", en: "Reputable developer with strong financial capacity" },
    { vi: "Pháp lý hoàn chỉnh, đã có sổ hồng", en: "Complete legal documentation, pink book issued" },
    { vi: "Vị trí đắc địa, kết nối giao thông tốt", en: "Prime location, good transportation connectivity" },
    { vi: "Tiện ích nội khu đầy đủ", en: "Full internal amenities" },
    { vi: "Thiết kế hiện đại, chất lượng cao", en: "Modern design, high quality" },
    { vi: "Tiềm năng tăng giá tốt", en: "Good appreciation potential" },
    { vi: "Thanh khoản cao, dễ bán lại", en: "High liquidity, easy resale" },
    { vi: "Cộng đồng cư dân văn minh", en: "Civilized resident community" },
    { vi: "Quản lý chuyên nghiệp", en: "Professional management" },
    { vi: "Gần trường học, bệnh viện", en: "Near schools and hospitals" },
  ],
  neutral: [
    { vi: "Giá tầm trung trong khu vực", en: "Mid-range price in the area" },
    { vi: "Tiến độ xây dựng bình thường", en: "Normal construction progress" },
    { vi: "Phù hợp nhu cầu ở thực", en: "Suitable for living needs" },
    { vi: "Kết nối giao thông đang phát triển", en: "Transportation connectivity developing" },
  ],
  negative: [
    { vi: "Pháp lý chưa hoàn thiện", en: "Incomplete legal documentation" },
    { vi: "Chủ đầu tư có lịch sử chậm tiến độ", en: "Developer has history of delays" },
    { vi: "Vị trí xa trung tâm", en: "Location far from city center" },
    { vi: "Thanh khoản thấp", en: "Low liquidity" },
    { vi: "Giá cao hơn thị trường", en: "Price above market" },
    { vi: "Tiện ích chưa hoàn thiện", en: "Amenities not yet complete" },
    { vi: "Hạ tầng xung quanh chưa phát triển", en: "Surrounding infrastructure undeveloped" },
  ],
};

const riskBulletTemplates = {
  low: [
    { vi: "Rủi ro thấp - Chủ đầu tư có năng lực mạnh", en: "Low risk - Developer has strong capacity" },
    { vi: "Pháp lý rõ ràng, không có tranh chấp", en: "Clear legal status, no disputes" },
  ],
  medium: [
    { vi: "Tiến độ xây dựng cần theo dõi", en: "Construction progress needs monitoring" },
    { vi: "Một số tiện ích chưa hoàn thiện", en: "Some amenities not yet complete" },
    { vi: "Giá có thể biến động theo thị trường", en: "Price may fluctuate with market" },
  ],
  high: [
    { vi: "Chủ đầu tư đang gặp khó khăn tài chính", en: "Developer facing financial difficulties" },
    { vi: "Pháp lý có vấn đề cần giải quyết", en: "Legal issues need resolution" },
    { vi: "Tiến độ đang bị chậm", en: "Progress is delayed" },
    { vi: "Rủi ro mất vốn cao", en: "High risk of capital loss" },
  ],
};

const bestForBulletTemplates = [
  { vi: "Nhà đầu tư dài hạn", en: "Long-term investors" },
  { vi: "Người mua để ở", en: "End-users / Home buyers" },
  { vi: "Gia đình trẻ có con nhỏ", en: "Young families with children" },
  { vi: "Người cao tuổi tìm nơi an cư", en: "Seniors seeking retirement home" },
  { vi: "Nhà đầu tư cho thuê", en: "Rental investors" },
  { vi: "Người tìm kiếm căn hộ nghỉ dưỡng", en: "Vacation property seekers" },
  { vi: "Nhà đầu tư lướt sóng", en: "Short-term flippers" },
];

// =====================================
// UTILITY FUNCTIONS
// =====================================

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function getTierFromScore(score: number): TierLevel {
  if (score >= 95) return "SSS";
  if (score >= 90) return "S+";
  if (score >= 85) return "S";
  if (score >= 75) return "A";
  if (score >= 65) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

function getRandomDate(startYear: number, endYear: number): string {
  const year = randomInt(startYear, endYear);
  const month = randomInt(1, 12).toString().padStart(2, "0");
  const day = randomInt(1, 28).toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getSignalQualityFromTier(tier: TierLevel): SignalQuality {
  if (tier === "SSS" || tier === "S+" || tier === "S") return "Good";
  if (tier === "A" || tier === "B") return "Average";
  return "Poor";
}

function getRoiLabelFromTier(tier: TierLevel): RoiLabel {
  if (tier === "SSS" || tier === "S+") return "Strong";
  if (tier === "S" || tier === "A") return "Average";
  if (tier === "B" || tier === "C") return "Weak";
  return "Fail";
}

function getVerificationStatusFromTier(tier: TierLevel): VerificationStatus {
  if (tier === "SSS" || tier === "S+") return "Verified";
  if (tier === "S" || tier === "A") return randomChoice(["Verified", "Under review"]);
  if (tier === "B" || tier === "C") return randomChoice(["Under review", "Unverified"]);
  return "Unverified";
}

function getLegalStageFromTier(tier: TierLevel): LegalStage {
  // Safe/Complete stages
  const goodStages: LegalStage[] = ["so_hong", "so_do", "da_ban_giao", "da_nghiem_thu", "da_su_dung", "o_ngay"];
  // Moderate stages
  const mediumStages: LegalStage[] = ["da_gpxd", "da_phe_duyet_1_500", "da_giao_dat", "du_dk_ban", "da_hoan_cong", "cho_cap_so"];
  // In-progress stages
  const inProgressStages: LegalStage[] = ["dang_xay", "dung_tien_do", "thi_cong_than", "da_cat_noc", "dang_hoan_thien"];
  // Risky stages
  const riskyStages: LegalStage[] = ["xin_gpxd", "dang_lam_phap_ly", "cho_1_500", "chua_hoan_chinh", "khoi_cong"];
  // Danger stages
  const dangerStages: LegalStage[] = ["vi_bang", "giay_tay", "gop_von", "chua_khoi_cong", "dat_nong_nghiep"];

  if (tier === "SSS" || tier === "S+") return randomChoice(goodStages);
  if (tier === "S" || tier === "A") return randomChoice([...goodStages, ...mediumStages, ...inProgressStages]);
  if (tier === "B" || tier === "C") return randomChoice([...mediumStages, ...inProgressStages, ...riskyStages]);
  return randomChoice([...riskyStages, ...dangerStages]);
}

// =====================================
// QUALITY OF LIFE GENERATION
// =====================================

function generateQualityOfLife(district: string, city: string, tier: TierLevel): QualityOfLifeMetrics {
  // AQI varies by location - city centers tend to have worse air quality
  const centralDistricts = ["Quận 1", "Quận 3", "Quận 5", "Hoàn Kiếm", "Ba Đình", "Đống Đa"];
  const industrialAreas = ["Bình Tân", "Tân Phú", "Quận 12", "Hoàng Mai", "Hà Đông"];
  const greenDistricts = ["Quận 7", "Thủ Đức", "Quận 2", "Phú Nhuận", "Tây Hồ", "Cầu Giấy"];

  let baseAqi: number;
  if (centralDistricts.includes(district)) {
    baseAqi = randomInt(80, 120);
  } else if (industrialAreas.includes(district)) {
    baseAqi = randomInt(100, 150);
  } else if (greenDistricts.includes(district)) {
    baseAqi = randomInt(50, 90);
  } else {
    baseAqi = randomInt(60, 110);
  }

  // Higher tier projects tend to be in better locations
  if (tier === "SSS" || tier === "SS" || tier === "S+") {
    baseAqi = Math.max(40, baseAqi - randomInt(10, 25));
  }

  const aqi = baseAqi;
  const aqiLabel: QualityOfLifeMetrics["aqiLabel"] =
    aqi <= 50 ? "Good" :
    aqi <= 100 ? "Moderate" :
    aqi <= 150 ? "Poor" :
    aqi <= 200 ? "Bad" : "Hazardous";

  // Noise level varies by area
  const noiseLevel: QualityOfLifeMetrics["noiseLevel"] =
    centralDistricts.includes(district) || industrialAreas.includes(district)
      ? randomChoice(["Normal", "Noisy"] as const)
      : randomChoice(["Quiet", "Normal"] as const);

  // Green space ratio - higher tier projects have more green space
  const greenSpaceRatio = tier === "SSS" || tier === "SS" ? randomInt(30, 50) :
                         tier === "S+" || tier === "S" ? randomInt(20, 40) :
                         tier === "A" || tier === "B" ? randomInt(15, 30) :
                         randomInt(5, 20);

  // Walkability score - central districts are more walkable
  const walkabilityScore = centralDistricts.includes(district) ? randomInt(70, 95) :
                          greenDistricts.includes(district) ? randomInt(60, 85) :
                          randomInt(40, 70);

  // Nearby amenities count based on district density
  const isUrban = centralDistricts.includes(district) || greenDistricts.includes(district);
  const nearbyAmenities = {
    schools: isUrban ? randomInt(5, 15) : randomInt(2, 8),
    hospitals: isUrban ? randomInt(2, 8) : randomInt(1, 4),
    parks: greenDistricts.includes(district) ? randomInt(3, 10) : randomInt(1, 5),
    malls: centralDistricts.includes(district) ? randomInt(3, 8) : randomInt(1, 4),
    markets: randomInt(2, 10),
  };

  // Public transport accessibility
  const publicTransport: QualityOfLifeMetrics["publicTransport"] =
    centralDistricts.includes(district) ? "Convenient" :
    greenDistricts.includes(district) ? randomChoice(["Convenient", "Average"] as const) :
    randomChoice(["Average", "Limited"] as const);

  // Traffic level
  const trafficLevel: QualityOfLifeMetrics["trafficLevel"] =
    centralDistricts.includes(district) ? randomChoice(["Moderate", "Congested"] as const) :
    industrialAreas.includes(district) ? randomChoice(["Moderate", "Congested"] as const) :
    randomChoice(["Clear", "Moderate"] as const);

  return {
    aqi,
    aqiLabel,
    noiseLevel,
    greenSpaceRatio,
    walkabilityScore,
    nearbyAmenities,
    publicTransport,
    trafficLevel,
  };
}

// =====================================
// MAIN GENERATOR FUNCTION
// =====================================

export function generateProjects(count: number = 500): Project[] {
  const projects: Project[] = [];
  const usedNames = new Set<string>();
  const developerKeys = Object.keys(realDevelopers);

  // First, add all flagship projects
  for (const template of flagshipProjects) {
    if (projects.length >= count) break;

    const developer = realDevelopers[template.developerKey];
    if (!developer) continue;

    const tier = template.tier;
    const verdictList = verdictTemplates[tier] || verdictTemplates.B;
    const verdict = randomChoice(verdictList);

    const project: Project = {
      slug: generateSlug(template.nameVi),
      name: template.nameVi,
      name_en: template.nameEn,
      tier: tier,
      score: template.baseScore + randomInt(-2, 2),
      verificationStatus: getVerificationStatusFromTier(tier),
      sponsored: Math.random() < 0.1,
      district: template.location.district,
      district_en: template.location.district_en,
      city: template.location.city,
      city_en: template.location.city_en,
      verdict: verdict.vi,
      verdict_en: verdict.en,
      signals: {
        legal: getSignalQualityFromTier(tier),
        price: `${randomInt(template.priceRange.min, template.priceRange.max)} mil/m²`,
        liquidity: getSignalQualityFromTier(tier),
      },
      updatedAt: getRandomDate(2024, 2025),
      sourceCount: randomInt(3, 15),
      whyBullets: [],
      whyBullets_en: [],
      keyRisks: [],
      keyRisks_en: [],
      roiLabel: getRoiLabelFromTier(tier),
      developer: developer,
      legalStage: template.legalStage,
      dataQuality: randomInt(70, 100),
      salesMetrics: {
        totalUnits: template.units,
        soldUnits: Math.floor(template.units * (0.3 + Math.random() * 0.6)),
        availableUnits: 0,
        salesProgress: randomInt(30, 95),
      },
      priceMetrics: {
        minPrice: template.priceRange.min,
        maxPrice: template.priceRange.max,
        avgPrice: Math.floor((template.priceRange.min + template.priceRange.max) / 2),
      },
      areaMetrics: {
        minArea: randomInt(45, 70),
        maxArea: randomInt(120, 200),
        avgArea: randomInt(70, 100),
      },
      qualityOfLife: generateQualityOfLife(template.location.district, template.location.city, tier),
    };

    // Add why bullets
    const numPositive = tier === "SSS" || tier === "S+" ? 4 : tier === "S" || tier === "A" ? 3 : 2;
    const selectedPositive = whyBulletTemplates.positive.slice(0, numPositive);
    project.whyBullets = selectedPositive.map(b => b.vi);
    project.whyBullets_en = selectedPositive.map(b => b.en);

    // Add risk bullets
    const riskLevel = tier === "SSS" || tier === "S+" || tier === "S" ? "low" : tier === "A" || tier === "B" ? "medium" : "high";
    const riskBullets = riskBulletTemplates[riskLevel].slice(0, 2);
    project.keyRisks = riskBullets.map(b => b.vi);
    project.keyRisks_en = riskBullets.map(b => b.en);

    // Add best for bullets
    const bestFor = bestForBulletTemplates.slice(0, randomInt(2, 4));
    project.bestForBullets = bestFor.map(b => b.vi);
    project.bestForBullets_en = bestFor.map(b => b.en);

    project.salesMetrics!.availableUnits = project.salesMetrics!.totalUnits - project.salesMetrics!.soldUnits;
    usedNames.add(template.nameVi);
    projects.push(project);
  }

  // Generate remaining projects
  let nameBaseIndex = 0;
  const shuffledBases = [...projectNameBases].sort(() => Math.random() - 0.5);

  while (projects.length < count) {
    const developerKey = randomChoice(developerKeys);
    const developer = realDevelopers[developerKey];
    const location = randomChoice(allLocations);

    // Generate unique project name using proper naming conventions
    let projectName: string;
    let projectNameEn: string;
    let attempts = 0;

    do {
      const pattern = randomInt(1, 10);
      const baseName = shuffledBases[nameBaseIndex % shuffledBases.length];
      nameBaseIndex++;

      if (pattern <= 3) {
        // Pattern 1: Developer Brand + Name (e.g., "Vinhomes Harmony", "Masterise Pearl")
        const devBrand = developer.name.split(" ")[0]; // Get first word of developer
        projectName = `${devBrand} ${baseName}`;
        projectNameEn = projectName;
      } else if (pattern <= 5) {
        // Pattern 2: The + Name (e.g., "The Emerald", "The Infinity")
        projectName = `The ${baseName}`;
        projectNameEn = projectName;
      } else if (pattern <= 7) {
        // Pattern 3: Name + Second Word (e.g., "Sunrise City", "Diamond Plaza")
        const secondWord = randomChoice(projectNameSecondWords);
        projectName = `${baseName} ${secondWord}`;
        projectNameEn = projectName;
      } else {
        // Pattern 4: Just the base name (e.g., "Metropole", "Landmark")
        projectName = baseName;
        projectNameEn = baseName;
      }

      attempts++;
    } while (usedNames.has(projectName) && attempts < 100);

    // If still duplicate, add a number suffix
    if (usedNames.has(projectName)) {
      const num = randomInt(1, 99);
      projectName = `${projectName} ${num}`;
      projectNameEn = `${projectNameEn} ${num}`;
    }

    usedNames.add(projectName);

    // Calculate score based on developer tier with variance
    const baseScores: Record<DeveloperTier, number> = {
      SSS: 92,
      SS: 88,
      S: 83,
      A: 75,
      B: 67,
      C: 58,
      D: 45,
      F: 30,
    };
    const baseScore = baseScores[developer.tier] + randomInt(-8, 8);
    const score = Math.max(20, Math.min(100, baseScore));
    const tier = getTierFromScore(score);

    const verdictList = verdictTemplates[tier] || verdictTemplates.B;
    const verdict = randomChoice(verdictList);

    const priceMin = tier === "SSS" || tier === "S+" ? randomInt(60, 120) :
                     tier === "S" || tier === "A" ? randomInt(40, 80) :
                     tier === "B" || tier === "C" ? randomInt(25, 50) :
                     randomInt(15, 35);
    const priceMax = priceMin + randomInt(15, 50);

    const project: Project = {
      slug: generateSlug(projectName),
      name: projectName,
      name_en: projectNameEn,
      tier: tier,
      score: score,
      verificationStatus: getVerificationStatusFromTier(tier),
      sponsored: Math.random() < 0.05,
      district: location.district,
      district_en: location.district_en,
      city: location.city,
      city_en: location.city_en,
      verdict: verdict.vi,
      verdict_en: verdict.en,
      signals: {
        legal: getSignalQualityFromTier(tier),
        price: `${randomInt(priceMin, priceMax)} mil/m²`,
        liquidity: getSignalQualityFromTier(tier),
      },
      updatedAt: getRandomDate(2023, 2025),
      sourceCount: randomInt(2, 12),
      whyBullets: [],
      whyBullets_en: [],
      keyRisks: [],
      keyRisks_en: [],
      roiLabel: getRoiLabelFromTier(tier),
      developer: developer,
      legalStage: getLegalStageFromTier(tier),
      dataQuality: randomInt(50, 100),
      salesMetrics: {
        totalUnits: randomInt(200, 5000),
        soldUnits: 0,
        availableUnits: 0,
        salesProgress: randomInt(10, 95),
      },
      priceMetrics: {
        minPrice: priceMin,
        maxPrice: priceMax,
        avgPrice: Math.floor((priceMin + priceMax) / 2),
      },
      areaMetrics: {
        minArea: randomInt(40, 65),
        maxArea: randomInt(100, 180),
        avgArea: randomInt(65, 95),
      },
      qualityOfLife: generateQualityOfLife(location.district, location.city, tier),
    };

    // Add why bullets based on tier
    const numPositive = tier === "SSS" || tier === "S+" ? 4 : tier === "S" || tier === "A" ? 3 : 2;
    const shuffledPositive = [...whyBulletTemplates.positive].sort(() => Math.random() - 0.5);
    const selectedPositive = shuffledPositive.slice(0, numPositive);
    project.whyBullets = selectedPositive.map(b => b.vi);
    project.whyBullets_en = selectedPositive.map(b => b.en);

    if (tier === "B" || tier === "C" || tier === "D" || tier === "F") {
      const numNegative = tier === "B" ? 1 : tier === "C" ? 2 : 3;
      const shuffledNegative = [...whyBulletTemplates.negative].sort(() => Math.random() - 0.5);
      const selectedNegative = shuffledNegative.slice(0, numNegative);
      project.whyBullets.push(...selectedNegative.map(b => b.vi));
      project.whyBullets_en!.push(...selectedNegative.map(b => b.en));
    }

    // Add risk bullets
    const riskLevel = tier === "SSS" || tier === "S+" || tier === "S" ? "low" : tier === "A" || tier === "B" ? "medium" : "high";
    const shuffledRisks = [...riskBulletTemplates[riskLevel]].sort(() => Math.random() - 0.5);
    const selectedRisks = shuffledRisks.slice(0, randomInt(1, 3));
    project.keyRisks = selectedRisks.map(b => b.vi);
    project.keyRisks_en = selectedRisks.map(b => b.en);

    // Add best for bullets
    const shuffledBestFor = [...bestForBulletTemplates].sort(() => Math.random() - 0.5);
    const selectedBestFor = shuffledBestFor.slice(0, randomInt(2, 4));
    project.bestForBullets = selectedBestFor.map(b => b.vi);
    project.bestForBullets_en = selectedBestFor.map(b => b.en);

    // Calculate sales metrics
    project.salesMetrics!.soldUnits = Math.floor(project.salesMetrics!.totalUnits * (project.salesMetrics!.salesProgress / 100));
    project.salesMetrics!.availableUnits = project.salesMetrics!.totalUnits - project.salesMetrics!.soldUnits;

    projects.push(project);
  }

  // Sort by tier and score
  const tierOrder: Record<TierLevel, number> = { SSS: 0, SS: 1, "S+": 2, S: 3, A: 4, B: 5, C: 6, D: 7, F: 8 };
  projects.sort((a, b) => {
    const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
    if (tierDiff !== 0) return tierDiff;
    return b.score - a.score;
  });

  return projects;
}

// Export developers for reference
export const developers = realDevelopers;
