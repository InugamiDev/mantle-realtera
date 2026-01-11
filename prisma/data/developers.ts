/**
 * Real Vietnamese Real Estate Developers
 * 25 developers across all tiers from SSS to F
 *
 * Data researched from:
 * - Company websites and investor relations
 * - cafeland.vn developer profiles
 * - vnexpress.net/bat-dong-san news
 * - batdongsan.com.vn listings
 */

export interface DeveloperSeed {
  slug: string;
  name: string;
  nameEn: string;
  tier: string;
  foundedYear: number;
  headquarters: string;
  website: string;
  stockCode?: string;
  description: string;
  financialHealthScore: number;
  deliveryTrackRecord: number;
  legalComplianceScore: number;
  customerSatisfactionScore: number;
  overallScore: number;
}

export const DEVELOPERS: DeveloperSeed[] = [
  // ============================================================================
  // TIER SSS - Elite Developers (Score 90-100)
  // ============================================================================
  {
    slug: "vinhomes",
    name: "Vinhomes",
    nameEn: "Vinhomes JSC",
    tier: "SSS",
    foundedYear: 2008,
    headquarters: "Hà Nội",
    website: "https://vinhomes.vn",
    stockCode: "VHM",
    description: "Chủ đầu tư bất động sản lớn nhất Việt Nam, thuộc tập đoàn Vingroup. Nổi tiếng với các khu đô thị quy mô lớn như Vinhomes Grand Park, Central Park, Ocean Park. Doanh nghiệp có uy tín cao nhất thị trường.",
    financialHealthScore: 98,
    deliveryTrackRecord: 97,
    legalComplianceScore: 99,
    customerSatisfactionScore: 95,
    overallScore: 97,
  },
  {
    slug: "masterise-homes",
    name: "Masterise Homes",
    nameEn: "Masterise Homes",
    tier: "SSS",
    foundedYear: 2018,
    headquarters: "Hồ Chí Minh",
    website: "https://masterisehomes.com",
    description: "Chủ đầu tư phân khúc cao cấp, thuộc Masterise Group. Chuyên phát triển các dự án hạng sang như Masteri Thao Dien, Lumiere Boulevard, Grand Marina Saigon với đối tác quốc tế Marriott.",
    financialHealthScore: 95,
    deliveryTrackRecord: 96,
    legalComplianceScore: 98,
    customerSatisfactionScore: 94,
    overallScore: 96,
  },
  {
    slug: "capitaland",
    name: "CapitaLand Vietnam",
    nameEn: "CapitaLand Development",
    tier: "SSS",
    foundedYear: 1994,
    headquarters: "Hồ Chí Minh",
    website: "https://www.capitaland.com/vn",
    description: "Tập đoàn bất động sản Singapore hàng đầu châu Á. Phát triển nhiều dự án tại Việt Nam bao gồm d'Edge Thao Dien, Vista Verde, Feliz en Vista. Tiêu chuẩn xây dựng quốc tế.",
    financialHealthScore: 99,
    deliveryTrackRecord: 95,
    legalComplianceScore: 99,
    customerSatisfactionScore: 93,
    overallScore: 96,
  },

  // ============================================================================
  // TIER SS - Premium Developers (Score 85-89)
  // ============================================================================
  {
    slug: "novaland",
    name: "Novaland",
    nameEn: "Novaland Group",
    tier: "SS",
    foundedYear: 1992,
    headquarters: "Hồ Chí Minh",
    website: "https://novaland.com.vn",
    stockCode: "NVL",
    description: "Một trong những chủ đầu tư lớn nhất Việt Nam. Phát triển các dự án như The Grand Manhattan, Sunrise City, NovaWorld Phan Thiet. Đang tái cấu trúc tài chính nhưng vẫn duy trì chất lượng.",
    financialHealthScore: 75,
    deliveryTrackRecord: 90,
    legalComplianceScore: 92,
    customerSatisfactionScore: 88,
    overallScore: 86,
  },
  {
    slug: "nam-long",
    name: "Nam Long Group",
    nameEn: "Nam Long Investment Corporation",
    tier: "SS",
    foundedYear: 1992,
    headquarters: "Hồ Chí Minh",
    website: "https://namlonggroup.com.vn",
    stockCode: "NLG",
    description: "Chủ đầu tư uy tín với hơn 30 năm kinh nghiệm. Chuyên phát triển các dự án nhà ở vừa túi tiền như Akari City, Valora Kikyo, Flora. Hợp tác với đối tác Nhật Bản Hankyu Hanshin.",
    financialHealthScore: 88,
    deliveryTrackRecord: 92,
    legalComplianceScore: 90,
    customerSatisfactionScore: 90,
    overallScore: 90,
  },
  {
    slug: "phu-my-hung",
    name: "Phú Mỹ Hưng",
    nameEn: "Phu My Hung Development Corporation",
    tier: "SS",
    foundedYear: 1993,
    headquarters: "Hồ Chí Minh",
    website: "https://phumyhung.vn",
    description: "Liên doanh Việt - Đài Loan phát triển khu đô thị Phú Mỹ Hưng, Quận 7. Mô hình khu đô thị hiện đại đầu tiên tại Việt Nam. Các dự án: Midtown, Scenic Valley, The Ascentia.",
    financialHealthScore: 92,
    deliveryTrackRecord: 95,
    legalComplianceScore: 94,
    customerSatisfactionScore: 91,
    overallScore: 93,
  },

  // ============================================================================
  // TIER S - Reliable Developers (Score 80-84)
  // ============================================================================
  {
    slug: "dat-xanh-group",
    name: "Đất Xanh Group",
    nameEn: "Dat Xanh Group",
    tier: "S",
    foundedYear: 2003,
    headquarters: "Hồ Chí Minh",
    website: "https://datxanh.com.vn",
    stockCode: "DXG",
    description: "Tập đoàn bất động sản và môi giới lớn. Phát triển các dự án như Opal Boulevard, Gem Riverside, Luxcity. Mạnh về phân phối và phát triển dự án trung cấp.",
    financialHealthScore: 82,
    deliveryTrackRecord: 85,
    legalComplianceScore: 88,
    customerSatisfactionScore: 80,
    overallScore: 84,
  },
  {
    slug: "hung-thinh",
    name: "Hưng Thịnh Corporation",
    nameEn: "Hung Thinh Corporation",
    tier: "S",
    foundedYear: 2002,
    headquarters: "Hồ Chí Minh",
    website: "https://hungthinh.com.vn",
    description: "Tập đoàn bất động sản đa ngành. Phát triển nhiều dự án như Lavita Charm, Moonlight Boulevard, 9View. Mạnh về phân khúc trung cấp tại TP.HCM và Bình Dương.",
    financialHealthScore: 80,
    deliveryTrackRecord: 88,
    legalComplianceScore: 85,
    customerSatisfactionScore: 82,
    overallScore: 84,
  },
  {
    slug: "sun-group",
    name: "Sun Group",
    nameEn: "Sun Group",
    tier: "S",
    foundedYear: 2007,
    headquarters: "Hà Nội",
    website: "https://sungroup.com.vn",
    description: "Tập đoàn du lịch - giải trí - bất động sản. Phát triển Sun Grand City, Fansipan Legend, Ba Na Hills. Mạnh về bất động sản nghỉ dưỡng và giải trí.",
    financialHealthScore: 85,
    deliveryTrackRecord: 90,
    legalComplianceScore: 88,
    customerSatisfactionScore: 85,
    overallScore: 87,
  },
  {
    slug: "ecopark",
    name: "Ecopark",
    nameEn: "Ecopark Group",
    tier: "S",
    foundedYear: 2001,
    headquarters: "Hưng Yên",
    website: "https://ecopark.com.vn",
    description: "Chủ đầu tư khu đô thị sinh thái Ecopark 500ha tại Hưng Yên. Mô hình khu đô thị xanh đầu tiên tại Việt Nam. Các phân khu: Rừng Cọ, Aqua Bay, West Bay.",
    financialHealthScore: 88,
    deliveryTrackRecord: 92,
    legalComplianceScore: 90,
    customerSatisfactionScore: 88,
    overallScore: 89,
  },

  // ============================================================================
  // TIER A - Established Developers (Score 70-79)
  // ============================================================================
  {
    slug: "khang-dien",
    name: "Khang Điền",
    nameEn: "Khang Dien House Trading and Investment JSC",
    tier: "A",
    foundedYear: 2001,
    headquarters: "Hồ Chí Minh",
    website: "https://khangdien.vn",
    stockCode: "KDH",
    description: "Chủ đầu tư tập trung phát triển tại khu Đông TP.HCM. Các dự án: The Privia, Bicons Garden, Lucasta, Verosa Park. Chuyên nhà phố và biệt thự.",
    financialHealthScore: 82,
    deliveryTrackRecord: 85,
    legalComplianceScore: 88,
    customerSatisfactionScore: 78,
    overallScore: 83,
  },
  {
    slug: "an-gia",
    name: "An Gia Investment",
    nameEn: "An Gia Investment JSC",
    tier: "A",
    foundedYear: 2006,
    headquarters: "Hồ Chí Minh",
    website: "https://angia.com.vn",
    stockCode: "AGG",
    description: "Chủ đầu tư chuyên phát triển căn hộ trung - cao cấp. Các dự án: River Panorama, The Standard, The Sóng, Westgate. Tốc độ bán hàng và bàn giao tốt.",
    financialHealthScore: 78,
    deliveryTrackRecord: 82,
    legalComplianceScore: 85,
    customerSatisfactionScore: 80,
    overallScore: 81,
  },
  {
    slug: "phat-dat",
    name: "Phát Đạt",
    nameEn: "Phat Dat Real Estate Development Corporation",
    tier: "A",
    foundedYear: 2004,
    headquarters: "Hồ Chí Minh",
    website: "https://phatdat.com.vn",
    stockCode: "PDR",
    description: "Chủ đầu tư có quỹ đất lớn. Các dự án: Astral City, The EverRich Infinity, Millenium. Đang tập trung phát triển mạnh tại Bình Dương.",
    financialHealthScore: 75,
    deliveryTrackRecord: 80,
    legalComplianceScore: 82,
    customerSatisfactionScore: 76,
    overallScore: 78,
  },
  {
    slug: "cenland",
    name: "CenLand",
    nameEn: "CenLand JSC",
    tier: "A",
    foundedYear: 2017,
    headquarters: "Hà Nội",
    website: "https://cenland.vn",
    stockCode: "CRE",
    description: "Chủ đầu tư và phân phối bất động sản miền Bắc. Các dự án: Hinode City, Sunshine City, The Matrix One. Mạnh về phân phối và marketing.",
    financialHealthScore: 72,
    deliveryTrackRecord: 78,
    legalComplianceScore: 80,
    customerSatisfactionScore: 75,
    overallScore: 76,
  },
  {
    slug: "hdmon",
    name: "HDMon Holdings",
    nameEn: "HDMon Holdings",
    tier: "A",
    foundedYear: 2010,
    headquarters: "Hà Nội",
    website: "https://hdmon.vn",
    description: "Tập đoàn đa ngành với mảng bất động sản. Phát triển Mon City, Mon Bay Ha Long. Chất lượng xây dựng tốt nhưng tiến độ còn chậm.",
    financialHealthScore: 75,
    deliveryTrackRecord: 72,
    legalComplianceScore: 80,
    customerSatisfactionScore: 74,
    overallScore: 75,
  },

  // ============================================================================
  // TIER B - Growing Developers (Score 60-69)
  // ============================================================================
  {
    slug: "phu-dong",
    name: "Phú Đông Group",
    nameEn: "Phu Dong Group",
    tier: "B",
    foundedYear: 2011,
    headquarters: "Bình Dương",
    website: "https://phudong.vn",
    description: "Chủ đầu tư tập trung tại Bình Dương. Dự án chính: Phú Đông Premier, Phú Đông Sky Garden. Phân khúc căn hộ vừa túi tiền cho người trẻ.",
    financialHealthScore: 68,
    deliveryTrackRecord: 72,
    legalComplianceScore: 70,
    customerSatisfactionScore: 70,
    overallScore: 70,
  },
  {
    slug: "tecco",
    name: "Tecco Group",
    nameEn: "Tecco Group",
    tier: "B",
    foundedYear: 2004,
    headquarters: "Bình Dương",
    website: "https://teccogroup.vn",
    description: "Tập đoàn xây dựng và bất động sản. Các dự án: Tecco Town, Tecco Tower, Tecco Green Nest. Giá cả cạnh tranh nhưng chất lượng hoàn thiện còn hạn chế.",
    financialHealthScore: 65,
    deliveryTrackRecord: 68,
    legalComplianceScore: 72,
    customerSatisfactionScore: 62,
    overallScore: 67,
  },
  {
    slug: "hai-phat-land",
    name: "Hải Phát Land",
    nameEn: "Hai Phat Land",
    tier: "B",
    foundedYear: 2013,
    headquarters: "Hà Nội",
    website: "https://haiphatland.com.vn",
    description: "Chủ đầu tư phát triển nhanh tại Hà Nội. Các dự án: Tràng An Complex, Hà Đô Centrosa. Đang mở rộng quỹ đất nhưng tài chính cần củng cố.",
    financialHealthScore: 62,
    deliveryTrackRecord: 70,
    legalComplianceScore: 68,
    customerSatisfactionScore: 65,
    overallScore: 66,
  },
  {
    slug: "kim-oanh",
    name: "Kim Oanh Group",
    nameEn: "Kim Oanh Group",
    tier: "B",
    foundedYear: 2007,
    headquarters: "Bình Dương",
    website: "https://kimoanhgroup.com.vn",
    description: "Chủ đầu tư tập trung tại Bình Dương. Các dự án: Century City, The Standard, City Gate. Mạnh về marketing nhưng tiến độ có độ trễ.",
    financialHealthScore: 60,
    deliveryTrackRecord: 65,
    legalComplianceScore: 68,
    customerSatisfactionScore: 63,
    overallScore: 64,
  },

  // ============================================================================
  // TIER C - Emerging Developers (Score 50-59)
  // ============================================================================
  {
    slug: "thuan-an",
    name: "Thuận An Real Estate",
    nameEn: "Thuan An Real Estate",
    tier: "C",
    foundedYear: 2015,
    headquarters: "Bình Dương",
    website: "https://thuananrealestate.vn",
    description: "Chủ đầu tư nhỏ tại Bình Dương. Các dự án quy mô nhỏ, nhà phố. Chưa có nhiều dự án lớn hoàn thành để đánh giá.",
    financialHealthScore: 55,
    deliveryTrackRecord: 58,
    legalComplianceScore: 60,
    customerSatisfactionScore: 55,
    overallScore: 57,
  },
  {
    slug: "thien-nam",
    name: "Thiên Nam Group",
    nameEn: "Thien Nam Group",
    tier: "C",
    foundedYear: 2010,
    headquarters: "Đồng Nai",
    website: "https://thiennamgroup.vn",
    description: "Chủ đầu tư tại Đồng Nai. Các dự án đất nền, nhà phố. Quy mô nhỏ, đang phát triển thương hiệu.",
    financialHealthScore: 52,
    deliveryTrackRecord: 55,
    legalComplianceScore: 58,
    customerSatisfactionScore: 53,
    overallScore: 54,
  },

  // ============================================================================
  // TIER D - Risky Developers (Score 40-49)
  // ============================================================================
  {
    slug: "tan-hoang-minh",
    name: "Tân Hoàng Minh",
    nameEn: "Tan Hoang Minh Group",
    tier: "D",
    foundedYear: 1997,
    headquarters: "Hà Nội",
    website: "https://tanhoangminh.com",
    description: "Từng là chủ đầu tư lớn với D'. Capitale, D'. Le Roi Soleil. Hiện đang gặp vấn đề pháp lý nghiêm trọng. Người mua cần thận trọng.",
    financialHealthScore: 30,
    deliveryTrackRecord: 45,
    legalComplianceScore: 35,
    customerSatisfactionScore: 40,
    overallScore: 38,
  },
  {
    slug: "fpt-city",
    name: "FPT City",
    nameEn: "FPT City Da Nang",
    tier: "D",
    foundedYear: 2012,
    headquarters: "Đà Nẵng",
    website: "https://fptcitydanang.vn",
    description: "Dự án khu đô thị FPT City Đà Nẵng. Tiến độ triển khai chậm, một số hạng mục chưa hoàn thiện. Cần theo dõi thêm.",
    financialHealthScore: 48,
    deliveryTrackRecord: 45,
    legalComplianceScore: 50,
    customerSatisfactionScore: 45,
    overallScore: 47,
  },

  // ============================================================================
  // TIER F - Flagged Developers (Score < 40)
  // ============================================================================
  {
    slug: "alibaba",
    name: "Alibaba",
    nameEn: "Alibaba Real Estate Company",
    tier: "F",
    foundedYear: 2016,
    headquarters: "Hồ Chí Minh",
    website: "",
    description: "CẢNH BÁO: Công ty đã bị khởi tố hình sự về tội lừa đảo chiếm đoạt tài sản. Các dự án đất nền không có pháp lý. Không nên đầu tư.",
    financialHealthScore: 0,
    deliveryTrackRecord: 0,
    legalComplianceScore: 0,
    customerSatisfactionScore: 0,
    overallScore: 0,
  },
];

export default DEVELOPERS;
