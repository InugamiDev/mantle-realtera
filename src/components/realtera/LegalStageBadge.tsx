"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  Shield,
  FileCheck,
  Home,
  HardHat,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Clock,
  XCircle,
  AlertOctagon,
  Building2,
  Ban
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Risk levels for quick understanding
export type LegalRiskLevel = "safe" | "moderate" | "risky" | "danger" | "unknown";

// I. PHÁP LÝ QUYỀN SỬ DỤNG ĐẤT / SỞ HỮU
export type OwnershipStatus =
  // 1. Hoàn chỉnh – cao nhất
  | "so_do"           // Đã có sổ đỏ
  | "gcn_qsdd"        // Giấy chứng nhận quyền sử dụng đất
  | "so_hong"         // Đã có sổ hồng
  | "gcn_qsdd_qsh"    // GCN QSDĐ & QSH nhà ở
  | "so_rieng"        // Đã ra sổ riêng
  | "so_huu_lau_dai"  // Sở hữu lâu dài
  // 2. Gần hoàn chỉnh / đang làm thủ tục
  | "du_dieu_kien"    // Đủ điều kiện cấp sổ
  | "cho_cap_so"      // Đang chờ cấp sổ
  | "da_nop_ho_so"    // Đã nộp hồ sơ ra sổ
  | "dang_hoan_cong"  // Đang hoàn công
  | "da_hoan_cong"    // Đã hoàn công
  | "cho_chu_dau_tu"  // Chờ chủ đầu tư ra sổ
  // 3. Pháp lý yếu / rủi ro
  | "so_chung"        // Sổ chung
  | "so_tong"         // Sổ tổng
  | "tach_so_sau"     // Tách sổ sau
  | "vi_bang"         // Vi bằng
  | "giay_tay"        // Giấy tay
  | "gop_von"         // Hợp đồng góp vốn
  | "hop_tac_dau_tu"  // Hợp đồng hợp tác đầu tư
  | "dat_coc"         // Hợp đồng đặt cọc
  | "chua_du_dk";     // Chưa đủ điều kiện chuyển nhượng

// II. PHÁP LÝ DỰ ÁN – QUY HOẠCH
export type ProjectLegalStatus =
  // 1. Đã đủ điều kiện triển khai
  | "da_phe_duyet_1_500"    // Đã phê duyệt quy hoạch 1/500
  | "da_giao_dat"           // Đã có quyết định giao đất
  | "da_gpxd"               // Đã có giấy phép xây dựng
  | "du_dk_ban"             // Đủ điều kiện bán nhà HTTTL
  | "sxd_chap_thuan"        // Sở Xây dựng chấp thuận mở bán
  // 2. Đang hoàn thiện pháp lý
  | "cho_1_500"             // Đang chờ 1/500
  | "xin_gpxd"              // Đang xin giấy phép xây dựng
  | "dang_lam_phap_ly"      // Đang làm thủ tục pháp lý
  | "da_chu_truong"         // Đã có chủ trương đầu tư
  | "da_phe_duyet_da"       // Đã có QĐ phê duyệt dự án
  // 3. Pháp lý mập mờ / chưa đủ
  | "qh_1_2000"             // Quy hoạch 1/2000
  | "qh_phan_khu"           // Quy hoạch phân khu
  | "cho_chuyen_muc_dich"   // Đất chờ chuyển mục đích
  | "dat_nong_nghiep"       // Đất nông nghiệp xen kẽ
  | "chua_hoan_chinh"       // Chưa có pháp lý hoàn chỉnh
  | "dang_nghien_cuu";      // Dự án đang trong giai đoạn nghiên cứu

// III. TIẾN ĐỘ XÂY DỰNG
export type ConstructionStatus =
  // 1. Đã hoàn thiện / gần hoàn thiện
  | "da_ban_giao"       // Đã bàn giao
  | "da_nghiem_thu"     // Đã nghiệm thu
  | "da_su_dung"        // Đã đưa vào sử dụng
  | "nha_hien_huu"      // Nhà ở hiện hữu
  | "o_ngay"            // Nhận nhà ở ngay
  // 2. Đang xây dựng
  | "da_cat_noc"        // Đã cất nóc
  | "dang_hoan_thien"   // Đang hoàn thiện
  | "thi_cong_than"     // Đang thi công phần thân
  | "dang_xay"          // Đang xây dựng
  | "dung_tien_do"      // Thi công đúng tiến độ
  | "da_len_tang"       // Đã lên tầng
  // 3. Mới bắt đầu / rủi ro cao
  | "da_dap_mong"       // Đã đắp móng
  | "da_ep_coc"         // Đã ép cọc
  | "dang_lam_mong"     // Đang làm móng
  | "khoi_cong"         // Khởi công
  | "chuan_bi"          // Chuẩn bị thi công
  | "san_lap"           // San lấp mặt bằng
  | "chua_khoi_cong";   // Chưa khởi công

// Combined legal stage type
export type LegalStage = OwnershipStatus | ProjectLegalStatus | ConstructionStatus | "unknown";

interface LegalStageConfig {
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  color: string;
  riskLevel: LegalRiskLevel;
  description: string;
  category: "ownership" | "project" | "construction";
}

// Comprehensive configuration for all legal stages
const LEGAL_STAGE_CONFIG: Record<string, LegalStageConfig> = {
  // === I. OWNERSHIP - SAFE ===
  so_do: {
    label: "Đã có sổ đỏ",
    shortLabel: "Sổ đỏ",
    icon: FileCheck,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Giấy chứng nhận quyền sử dụng đất đã được cấp",
    category: "ownership",
  },
  gcn_qsdd: {
    label: "GCN quyền sử dụng đất",
    shortLabel: "GCN QSDĐ",
    icon: FileCheck,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Giấy chứng nhận quyền sử dụng đất",
    category: "ownership",
  },
  so_hong: {
    label: "Đã có sổ hồng",
    shortLabel: "Sổ hồng",
    icon: Home,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Giấy chứng nhận quyền sở hữu nhà ở / căn hộ",
    category: "ownership",
  },
  gcn_qsdd_qsh: {
    label: "GCN QSDĐ & QSH nhà ở",
    shortLabel: "GCN đầy đủ",
    icon: CheckCircle2,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Đã cấp đầy đủ GCN quyền sử dụng đất và quyền sở hữu nhà",
    category: "ownership",
  },
  so_rieng: {
    label: "Đã ra sổ riêng",
    shortLabel: "Sổ riêng",
    icon: FileCheck,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Sổ đã được tách riêng, có thể giao dịch độc lập",
    category: "ownership",
  },
  so_huu_lau_dai: {
    label: "Sở hữu lâu dài",
    shortLabel: "Lâu dài",
    icon: Shield,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Quyền sở hữu không thời hạn",
    category: "ownership",
  },

  // === I. OWNERSHIP - MODERATE ===
  du_dieu_kien: {
    label: "Đủ điều kiện cấp sổ",
    shortLabel: "Đủ ĐK",
    icon: Clock,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    riskLevel: "moderate",
    description: "Đã đủ điều kiện, đang chờ thủ tục cấp sổ",
    category: "ownership",
  },
  cho_cap_so: {
    label: "Đang chờ cấp sổ",
    shortLabel: "Chờ sổ",
    icon: Clock,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    riskLevel: "moderate",
    description: "Hồ sơ đã hoàn tất, đang chờ cơ quan cấp sổ",
    category: "ownership",
  },
  da_nop_ho_so: {
    label: "Đã nộp hồ sơ ra sổ",
    shortLabel: "Đã nộp HS",
    icon: Clock,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    riskLevel: "moderate",
    description: "Hồ sơ đã được nộp, đang trong quá trình xử lý",
    category: "ownership",
  },
  dang_hoan_cong: {
    label: "Đang hoàn công",
    shortLabel: "Hoàn công",
    icon: HardHat,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    riskLevel: "moderate",
    description: "Đang làm thủ tục hoàn công để ra sổ",
    category: "ownership",
  },
  da_hoan_cong: {
    label: "Đã hoàn công",
    shortLabel: "Đã HC",
    icon: CheckCircle2,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    riskLevel: "moderate",
    description: "Đã hoàn công, chuẩn bị thủ tục ra sổ",
    category: "ownership",
  },
  cho_chu_dau_tu: {
    label: "Chờ CĐT ra sổ",
    shortLabel: "Chờ CĐT",
    icon: Clock,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    riskLevel: "moderate",
    description: "Đang chờ chủ đầu tư hoàn tất thủ tục",
    category: "ownership",
  },

  // === I. OWNERSHIP - RISKY ===
  so_chung: {
    label: "Sổ chung",
    shortLabel: "Sổ chung",
    icon: AlertTriangle,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    riskLevel: "risky",
    description: "⚠️ Không thể giao dịch độc lập, cần tất cả đồng sở hữu",
    category: "ownership",
  },
  so_tong: {
    label: "Sổ tổng",
    shortLabel: "Sổ tổng",
    icon: AlertTriangle,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    riskLevel: "risky",
    description: "⚠️ Sổ chung của cả dự án, chưa tách riêng",
    category: "ownership",
  },
  tach_so_sau: {
    label: "Tách sổ sau",
    shortLabel: "Tách sau",
    icon: AlertTriangle,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    riskLevel: "risky",
    description: "⚠️ Cam kết tách sổ sau, không đảm bảo",
    category: "ownership",
  },
  vi_bang: {
    label: "Vi bằng",
    shortLabel: "Vi bằng",
    icon: AlertOctagon,
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    riskLevel: "danger",
    description: "🚫 KHÔNG xác lập quyền sở hữu, chỉ là văn bản ghi nhận",
    category: "ownership",
  },
  giay_tay: {
    label: "Giấy tay",
    shortLabel: "Giấy tay",
    icon: XCircle,
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    riskLevel: "danger",
    description: "🚫 Không có giá trị pháp lý, rủi ro rất cao",
    category: "ownership",
  },
  gop_von: {
    label: "Hợp đồng góp vốn",
    shortLabel: "Góp vốn",
    icon: AlertOctagon,
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    riskLevel: "danger",
    description: "🚫 KHÔNG phải mua bán, bạn là nhà đầu tư chịu rủi ro",
    category: "ownership",
  },
  hop_tac_dau_tu: {
    label: "HĐ hợp tác đầu tư",
    shortLabel: "HTĐT",
    icon: AlertOctagon,
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    riskLevel: "danger",
    description: "🚫 Không phải mua bán BĐS, mang tính chất đầu tư",
    category: "ownership",
  },
  dat_coc: {
    label: "Hợp đồng đặt cọc",
    shortLabel: "Đặt cọc",
    icon: AlertTriangle,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    riskLevel: "risky",
    description: "⚠️ Chỉ là đặt cọc, chưa có quyền sở hữu",
    category: "ownership",
  },
  chua_du_dk: {
    label: "Chưa đủ ĐK chuyển nhượng",
    shortLabel: "Chưa đủ ĐK",
    icon: Ban,
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    riskLevel: "danger",
    description: "🚫 Không thể chuyển nhượng hợp pháp",
    category: "ownership",
  },

  // === II. PROJECT LEGAL - SAFE ===
  da_phe_duyet_1_500: {
    label: "Đã phê duyệt QH 1/500",
    shortLabel: "QH 1/500",
    icon: FileCheck,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Quy hoạch chi tiết 1/500 đã được phê duyệt",
    category: "project",
  },
  da_giao_dat: {
    label: "Đã có QĐ giao đất",
    shortLabel: "Giao đất",
    icon: FileCheck,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Đã có quyết định giao đất cho dự án",
    category: "project",
  },
  da_gpxd: {
    label: "Đã có GPXD",
    shortLabel: "GPXD",
    icon: Shield,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Đã được cấp giấy phép xây dựng",
    category: "project",
  },
  du_dk_ban: {
    label: "Đủ ĐK bán nhà HTTTL",
    shortLabel: "Đủ ĐK bán",
    icon: CheckCircle2,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Đủ điều kiện bán nhà hình thành trong tương lai",
    category: "project",
  },
  sxd_chap_thuan: {
    label: "SXD chấp thuận mở bán",
    shortLabel: "SXD OK",
    icon: CheckCircle2,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Sở Xây dựng đã chấp thuận mở bán - pháp lý tốt nhất",
    category: "project",
  },

  // === II. PROJECT LEGAL - MODERATE ===
  cho_1_500: {
    label: "Đang chờ QH 1/500",
    shortLabel: "Chờ 1/500",
    icon: Clock,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    riskLevel: "moderate",
    description: "Đang chờ phê duyệt quy hoạch chi tiết",
    category: "project",
  },
  xin_gpxd: {
    label: "Đang xin GPXD",
    shortLabel: "Xin GPXD",
    icon: Clock,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    riskLevel: "moderate",
    description: "Đang trong quá trình xin giấy phép xây dựng",
    category: "project",
  },
  dang_lam_phap_ly: {
    label: "Đang làm thủ tục pháp lý",
    shortLabel: "Đang PL",
    icon: Clock,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    riskLevel: "moderate",
    description: "Đang hoàn thiện các thủ tục pháp lý",
    category: "project",
  },
  da_chu_truong: {
    label: "Đã có chủ trương ĐT",
    shortLabel: "Chủ trương",
    icon: FileCheck,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    riskLevel: "moderate",
    description: "Đã được chấp thuận chủ trương đầu tư",
    category: "project",
  },
  da_phe_duyet_da: {
    label: "Đã phê duyệt dự án",
    shortLabel: "PD dự án",
    icon: FileCheck,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    riskLevel: "moderate",
    description: "Đã có quyết định phê duyệt dự án",
    category: "project",
  },

  // === II. PROJECT LEGAL - RISKY ===
  qh_1_2000: {
    label: "Mới có QH 1/2000",
    shortLabel: "QH 1/2000",
    icon: AlertTriangle,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    riskLevel: "risky",
    description: "⚠️ Chỉ có quy hoạch phân khu, chưa có quy hoạch chi tiết",
    category: "project",
  },
  qh_phan_khu: {
    label: "Quy hoạch phân khu",
    shortLabel: "QH phân khu",
    icon: AlertTriangle,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    riskLevel: "risky",
    description: "⚠️ Mới ở giai đoạn quy hoạch phân khu",
    category: "project",
  },
  cho_chuyen_muc_dich: {
    label: "Chờ chuyển mục đích",
    shortLabel: "Chờ CMD",
    icon: AlertTriangle,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    riskLevel: "risky",
    description: "⚠️ Đất chưa được chuyển đổi mục đích sử dụng",
    category: "project",
  },
  dat_nong_nghiep: {
    label: "Đất nông nghiệp xen kẽ",
    shortLabel: "Đất NN",
    icon: AlertOctagon,
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    riskLevel: "danger",
    description: "🚫 Có đất nông nghiệp xen kẽ, pháp lý phức tạp",
    category: "project",
  },
  chua_hoan_chinh: {
    label: "Pháp lý chưa hoàn chỉnh",
    shortLabel: "Chưa PL",
    icon: AlertTriangle,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    riskLevel: "risky",
    description: "⚠️ Pháp lý dự án chưa đầy đủ",
    category: "project",
  },
  dang_nghien_cuu: {
    label: "Đang nghiên cứu",
    shortLabel: "Nghiên cứu",
    icon: AlertOctagon,
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    riskLevel: "danger",
    description: "🚫 Dự án còn ở giai đoạn nghiên cứu, rủi ro rất cao",
    category: "project",
  },

  // === III. CONSTRUCTION - SAFE ===
  da_ban_giao: {
    label: "Đã bàn giao",
    shortLabel: "Bàn giao",
    icon: CheckCircle2,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Nhà đã được bàn giao cho cư dân",
    category: "construction",
  },
  da_nghiem_thu: {
    label: "Đã nghiệm thu",
    shortLabel: "Nghiệm thu",
    icon: CheckCircle2,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Công trình đã được nghiệm thu hoàn thành",
    category: "construction",
  },
  da_su_dung: {
    label: "Đã đưa vào sử dụng",
    shortLabel: "Đang ở",
    icon: Home,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Công trình đã có cư dân sinh sống",
    category: "construction",
  },
  nha_hien_huu: {
    label: "Nhà hiện hữu",
    shortLabel: "Hiện hữu",
    icon: Home,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Nhà đã xây xong, có thể kiểm tra thực tế",
    category: "construction",
  },
  o_ngay: {
    label: "Nhận nhà ở ngay",
    shortLabel: "Ở ngay",
    icon: Home,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    riskLevel: "safe",
    description: "Có thể dọn vào ở ngay sau khi mua",
    category: "construction",
  },

  // === III. CONSTRUCTION - MODERATE ===
  da_cat_noc: {
    label: "Đã cất nóc",
    shortLabel: "Cất nóc",
    icon: Building2,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    riskLevel: "moderate",
    description: "Phần thô đã hoàn thành, đang hoàn thiện",
    category: "construction",
  },
  dang_hoan_thien: {
    label: "Đang hoàn thiện",
    shortLabel: "Hoàn thiện",
    icon: HardHat,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    riskLevel: "moderate",
    description: "Đang hoàn thiện nội thất và tiện ích",
    category: "construction",
  },
  thi_cong_than: {
    label: "Đang thi công phần thân",
    shortLabel: "Phần thân",
    icon: HardHat,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    riskLevel: "moderate",
    description: "Đang xây dựng phần thân tòa nhà",
    category: "construction",
  },
  dang_xay: {
    label: "Đang xây dựng",
    shortLabel: "Đang xây",
    icon: HardHat,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    riskLevel: "moderate",
    description: "Dự án đang trong quá trình thi công",
    category: "construction",
  },
  dung_tien_do: {
    label: "Thi công đúng tiến độ",
    shortLabel: "Đúng TĐ",
    icon: CheckCircle2,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    riskLevel: "moderate",
    description: "Tiến độ xây dựng đang theo kế hoạch",
    category: "construction",
  },
  da_len_tang: {
    label: "Đã lên tầng",
    shortLabel: "Lên tầng",
    icon: Building2,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    riskLevel: "moderate",
    description: "Đã xây xong phần móng, đang lên tầng",
    category: "construction",
  },

  // === III. CONSTRUCTION - RISKY ===
  da_dap_mong: {
    label: "Đã đắp móng",
    shortLabel: "Đắp móng",
    icon: AlertTriangle,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    riskLevel: "risky",
    description: "⚠️ Mới hoàn thành phần móng, còn lâu mới xong",
    category: "construction",
  },
  da_ep_coc: {
    label: "Đã ép cọc",
    shortLabel: "Ép cọc",
    icon: AlertTriangle,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    riskLevel: "risky",
    description: "⚠️ Mới ép cọc, tiến độ còn rất sớm",
    category: "construction",
  },
  dang_lam_mong: {
    label: "Đang làm móng",
    shortLabel: "Làm móng",
    icon: AlertTriangle,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    riskLevel: "risky",
    description: "⚠️ Đang thi công phần móng",
    category: "construction",
  },
  khoi_cong: {
    label: "Mới khởi công",
    shortLabel: "Khởi công",
    icon: AlertTriangle,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    riskLevel: "risky",
    description: "⚠️ Dự án mới khởi công, tiến độ còn xa",
    category: "construction",
  },
  chuan_bi: {
    label: "Chuẩn bị thi công",
    shortLabel: "Chuẩn bị",
    icon: AlertOctagon,
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    riskLevel: "danger",
    description: "🚫 Chưa thực sự thi công, rủi ro cao",
    category: "construction",
  },
  san_lap: {
    label: "San lấp mặt bằng",
    shortLabel: "San lấp",
    icon: AlertOctagon,
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    riskLevel: "danger",
    description: "🚫 Mới ở giai đoạn san lấp, rất sớm",
    category: "construction",
  },
  chua_khoi_cong: {
    label: "Chưa khởi công",
    shortLabel: "Chưa KC",
    icon: XCircle,
    color: "text-red-400 bg-red-500/10 border-red-500/30",
    riskLevel: "danger",
    description: "🚫 Dự án chưa khởi công xây dựng",
    category: "construction",
  },

  // Unknown
  unknown: {
    label: "Chưa rõ",
    shortLabel: "N/A",
    icon: HelpCircle,
    color: "text-slate-400 bg-slate-500/10 border-slate-500/30",
    riskLevel: "unknown",
    description: "Chưa có thông tin pháp lý",
    category: "ownership",
  },
};

// Risk level configuration - labelKey is used for i18n
const RISK_LEVEL_CONFIG: Record<LegalRiskLevel, { labelKey: string; color: string; bgColor: string }> = {
  safe: { labelKey: "safe", color: "text-emerald-400", bgColor: "bg-emerald-500" },
  moderate: { labelKey: "moderate", color: "text-blue-400", bgColor: "bg-blue-500" },
  risky: { labelKey: "risky", color: "text-orange-400", bgColor: "bg-orange-500" },
  danger: { labelKey: "danger", color: "text-red-400", bgColor: "bg-red-500" },
  unknown: { labelKey: "unknown", color: "text-slate-400", bgColor: "bg-slate-500" },
};

interface LegalStageBadgeProps {
  stage: LegalStage;
  className?: string;
  showTooltip?: boolean;
  compact?: boolean;
  showRiskLevel?: boolean;
}

export function LegalStageBadge({
  stage,
  className,
  showTooltip = true,
  compact = false,
  showRiskLevel = false,
}: LegalStageBadgeProps) {
  const t = useTranslations("legalRisk");
  const config = LEGAL_STAGE_CONFIG[stage] || LEGAL_STAGE_CONFIG.unknown;
  const riskConfig = RISK_LEVEL_CONFIG[config.riskLevel];
  const Icon = config.icon;
  const riskLabel = t(riskConfig.labelKey);

  return (
    <div
      className={cn(
        "group relative flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        config.color,
        className
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span className="truncate">{compact ? config.shortLabel : config.label}</span>

      {showRiskLevel && (
        <span className={cn("ml-1 h-2 w-2 shrink-0 rounded-full", riskConfig.bgColor)} />
      )}

      {/* Tooltip - positioned to the right */}
      {showTooltip && (
        <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 hidden w-64 -translate-y-1/2 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
          <div className="flex items-center gap-2 font-medium">
            <span className={cn("h-2 w-2 shrink-0 rounded-full", riskConfig.bgColor)} />
            <span className="truncate">{config.label}</span>
            <span className={cn("ml-auto shrink-0", riskConfig.color)}>{riskLabel}</span>
          </div>
          <div className="mt-1 text-white/60">{config.description}</div>
          <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-slate-800" />
        </div>
      )}
    </div>
  );
}

// Risk level indicator component
export function LegalRiskIndicator({
  riskLevel,
  className
}: {
  riskLevel: LegalRiskLevel;
  className?: string;
}) {
  const t = useTranslations("legalRisk");
  const config = RISK_LEVEL_CONFIG[riskLevel];
  const riskLabel = t(config.labelKey);

  return (
    <div className={cn("flex shrink-0 items-center gap-1.5", className)}>
      <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", config.bgColor)} />
      <span className={cn("text-xs font-medium truncate", config.color)}>{riskLabel}</span>
    </div>
  );
}

// Helper to get risk level from legal stage
export function getLegalRiskLevel(stage: LegalStage): LegalRiskLevel {
  const config = LEGAL_STAGE_CONFIG[stage];
  return config?.riskLevel || "unknown";
}

// Helper to get all stages by category
export function getStagesByCategory(category: "ownership" | "project" | "construction") {
  return Object.entries(LEGAL_STAGE_CONFIG)
    .filter(([, config]) => config.category === category)
    .map(([key, config]) => ({ key: key as LegalStage, ...config }));
}

// Export config for use elsewhere
export { LEGAL_STAGE_CONFIG, RISK_LEVEL_CONFIG };
