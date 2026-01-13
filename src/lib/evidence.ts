// RealTera Evidence & Verification System
// Types and mock data for document verification

// ============================================================================
// EVIDENCE CATEGORIES & TYPES
// ============================================================================

export type EvidenceCategory = "legal" | "developer" | "construction" | "financial";
export type EvidenceStatus = "pending" | "verified" | "rejected" | "expired";

export interface EvidenceCategoryConfig {
  id: EvidenceCategory;
  name: string;
  nameVi: string;
  weight: number;
  description: string;
  descriptionVi: string;
}

export const EVIDENCE_CATEGORIES: Record<EvidenceCategory, EvidenceCategoryConfig> = {
  legal: {
    id: "legal",
    name: "Legal Documents",
    nameVi: "Hồ sơ Pháp lý",
    weight: 0.35,
    description: "Legal permits, land use rights, and regulatory approvals",
    descriptionVi: "Giấy phép, quyền sử dụng đất và phê duyệt pháp quy",
  },
  developer: {
    id: "developer",
    name: "Developer History",
    nameVi: "Lịch sử Chủ đầu tư",
    weight: 0.25,
    description: "Track record, financial stability, and completed projects",
    descriptionVi: "Thành tích, ổn định tài chính và các dự án đã hoàn thành",
  },
  construction: {
    id: "construction",
    name: "Construction Progress",
    nameVi: "Tiến độ Xây dựng",
    weight: 0.25,
    description: "Build quality, timeline adherence, and site inspections",
    descriptionVi: "Chất lượng xây dựng, tuân thủ tiến độ và kiểm tra công trường",
  },
  financial: {
    id: "financial",
    name: "Financial Health",
    nameVi: "Sức khỏe Tài chính",
    weight: 0.15,
    description: "Bank guarantees, escrow accounts, and payment handling",
    descriptionVi: "Bảo lãnh ngân hàng, tài khoản ký quỹ và xử lý thanh toán",
  },
};

export type EvidenceType =
  | "land_use_right"
  | "construction_permit"
  | "project_approval"
  | "fire_safety"
  | "env_impact"
  | "sales_license"
  | "developer_license"
  | "financial_audit"
  | "bank_guarantee"
  | "escrow_agreement"
  | "construction_contract"
  | "progress_report"
  | "quality_inspection"
  | "completion_certificate";

export interface EvidenceTypeConfig {
  id: EvidenceType;
  category: EvidenceCategory;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  required: boolean;
  validityYears?: number; // How long the document is valid
}

export const EVIDENCE_TYPES: Record<EvidenceType, EvidenceTypeConfig> = {
  // Legal Documents
  land_use_right: {
    id: "land_use_right",
    category: "legal",
    name: "Land Use Rights Certificate",
    nameVi: "Giấy chứng nhận Quyền sử dụng đất",
    description: "Certificate proving legal ownership/rights to the land",
    descriptionVi: "Giấy chứng nhận quyền sở hữu/sử dụng đất hợp pháp",
    required: true,
    validityYears: 50,
  },
  construction_permit: {
    id: "construction_permit",
    category: "legal",
    name: "Construction Permit",
    nameVi: "Giấy phép Xây dựng",
    description: "Official permit allowing construction activities",
    descriptionVi: "Giấy phép chính thức cho phép hoạt động xây dựng",
    required: true,
    validityYears: 5,
  },
  project_approval: {
    id: "project_approval",
    category: "legal",
    name: "Project Investment Approval",
    nameVi: "Quyết định Phê duyệt Dự án",
    description: "Government approval for the real estate project",
    descriptionVi: "Phê duyệt của cơ quan nhà nước cho dự án bất động sản",
    required: true,
  },
  fire_safety: {
    id: "fire_safety",
    category: "legal",
    name: "Fire Safety Certificate",
    nameVi: "Giấy chứng nhận Phòng cháy Chữa cháy",
    description: "Certification that fire safety requirements are met",
    descriptionVi: "Chứng nhận đáp ứng yêu cầu phòng cháy chữa cháy",
    required: true,
    validityYears: 3,
  },
  env_impact: {
    id: "env_impact",
    category: "legal",
    name: "Environmental Impact Assessment",
    nameVi: "Báo cáo Đánh giá Tác động Môi trường",
    description: "Assessment of environmental impact of the project",
    descriptionVi: "Đánh giá tác động môi trường của dự án",
    required: true,
    validityYears: 5,
  },
  sales_license: {
    id: "sales_license",
    category: "legal",
    name: "Sales License",
    nameVi: "Giấy phép Mở bán",
    description: "License to sell units in the development",
    descriptionVi: "Giấy phép bán các căn hộ/đơn vị trong dự án",
    required: true,
    validityYears: 2,
  },

  // Developer Documents
  developer_license: {
    id: "developer_license",
    category: "developer",
    name: "Developer Business License",
    nameVi: "Giấy phép Kinh doanh Chủ đầu tư",
    description: "Business license of the property developer",
    descriptionVi: "Giấy phép kinh doanh của chủ đầu tư",
    required: true,
  },
  financial_audit: {
    id: "financial_audit",
    category: "developer",
    name: "Financial Audit Report",
    nameVi: "Báo cáo Kiểm toán Tài chính",
    description: "Audited financial statements of the developer",
    descriptionVi: "Báo cáo tài chính đã kiểm toán của chủ đầu tư",
    required: false,
    validityYears: 1,
  },

  // Financial Documents
  bank_guarantee: {
    id: "bank_guarantee",
    category: "financial",
    name: "Bank Guarantee Letter",
    nameVi: "Thư Bảo lãnh Ngân hàng",
    description: "Bank guarantee for buyer deposits and payments",
    descriptionVi: "Bảo lãnh ngân hàng cho tiền đặt cọc và thanh toán của người mua",
    required: true,
    validityYears: 2,
  },
  escrow_agreement: {
    id: "escrow_agreement",
    category: "financial",
    name: "Escrow Account Agreement",
    nameVi: "Thỏa thuận Tài khoản Ký quỹ",
    description: "Agreement for escrow account holding buyer funds",
    descriptionVi: "Thỏa thuận tài khoản ký quỹ giữ tiền người mua",
    required: false,
  },

  // Construction Documents
  construction_contract: {
    id: "construction_contract",
    category: "construction",
    name: "General Construction Contract",
    nameVi: "Hợp đồng Tổng thầu Xây dựng",
    description: "Main construction contract with the builder",
    descriptionVi: "Hợp đồng xây dựng chính với nhà thầu",
    required: true,
  },
  progress_report: {
    id: "progress_report",
    category: "construction",
    name: "Construction Progress Report",
    nameVi: "Báo cáo Tiến độ Xây dựng",
    description: "Monthly/quarterly construction progress updates",
    descriptionVi: "Cập nhật tiến độ xây dựng hàng tháng/quý",
    required: false,
  },
  quality_inspection: {
    id: "quality_inspection",
    category: "construction",
    name: "Quality Inspection Report",
    nameVi: "Báo cáo Kiểm tra Chất lượng",
    description: "Third-party quality inspection of construction",
    descriptionVi: "Kiểm tra chất lượng xây dựng bởi bên thứ ba",
    required: false,
  },
  completion_certificate: {
    id: "completion_certificate",
    category: "construction",
    name: "Completion Certificate",
    nameVi: "Giấy chứng nhận Hoàn công",
    description: "Certificate of project completion",
    descriptionVi: "Giấy chứng nhận hoàn thành dự án",
    required: false,
  },
};

// ============================================================================
// EVIDENCE INTERFACE
// ============================================================================

export interface Evidence {
  id: string;
  projectSlug: string;
  type: EvidenceType;
  documentHash: string;
  fileName: string;
  fileSize: number; // bytes
  uploadedAt: string; // ISO date
  uploadedBy: string;
  verifiedAt?: string;
  verifiedBy?: string;
  expiresAt?: string;
  status: EvidenceStatus;
  metadata: {
    documentNumber?: string;
    issuingAuthority?: string;
    issueDate?: string;
    expiryDate?: string;
    notes?: string;
  };
  blockchainRef?: {
    txHash: string;
    blockNumber: number;
    timestamp: number;
  };
}

export interface EvidencePackSummary {
  projectSlug: string;
  totalDocuments: number;
  verifiedDocuments: number;
  pendingDocuments: number;
  expiredDocuments: number;
  completionPercentage: number;
  lastUpdated: string;
  categories: {
    [key in EvidenceCategory]: {
      total: number;
      verified: number;
      required: number;
      requiredVerified: number;
    };
  };
}

// ============================================================================
// VERIFICATION TIERS
// ============================================================================

export interface VerificationTier {
  tier: number;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  requirements: string[];
  requirementsVi: string[];
  color: string;
  icon: string;
}

export const VERIFICATION_TIERS: VerificationTier[] = [
  {
    tier: 0,
    name: "Unverified",
    nameVi: "Chưa xác minh",
    description: "No verification performed",
    descriptionVi: "Chưa thực hiện xác minh",
    requirements: [],
    requirementsVi: [],
    color: "gray",
    icon: "shield",
  },
  {
    tier: 1,
    name: "Basic",
    nameVi: "Cơ bản",
    description: "Document consistency check",
    descriptionVi: "Kiểm tra tính nhất quán hồ sơ",
    requirements: ["Document completeness check", "Basic data validation"],
    requirementsVi: ["Kiểm tra đầy đủ hồ sơ", "Xác thực dữ liệu cơ bản"],
    color: "blue",
    icon: "shield",
  },
  {
    tier: 2,
    name: "Verified",
    nameVi: "Đã xác minh",
    description: "Legal document verification",
    descriptionVi: "Xác minh hồ sơ pháp lý",
    requirements: [
      "All required legal documents",
      "Cross-reference with government records",
      "Developer history check",
    ],
    requirementsVi: [
      "Tất cả hồ sơ pháp lý bắt buộc",
      "Đối chiếu với hồ sơ nhà nước",
      "Kiểm tra lịch sử chủ đầu tư",
    ],
    color: "cyan",
    icon: "shield-check",
  },
  {
    tier: 3,
    name: "Confirmed",
    nameVi: "Đã xác nhận",
    description: "Third-party co-signature",
    descriptionVi: "Đồng ký bởi bên thứ ba",
    requirements: [
      "All Tier 2 requirements",
      "Independent third-party verification",
      "Co-signer attestation",
    ],
    requirementsVi: [
      "Tất cả yêu cầu Tier 2",
      "Xác minh bởi bên thứ ba độc lập",
      "Chứng thực đồng ký",
    ],
    color: "amber",
    icon: "shield-check",
  },
  {
    tier: 4,
    name: "Monitored",
    nameVi: "Giám sát",
    description: "Continuous monitoring",
    descriptionVi: "Giám sát liên tục",
    requirements: [
      "All Tier 3 requirements",
      "Real-time monitoring",
      "Quarterly re-verification",
      "Instant alerts on changes",
    ],
    requirementsVi: [
      "Tất cả yêu cầu Tier 3",
      "Giám sát thời gian thực",
      "Xác minh lại hàng quý",
      "Cảnh báo tức thì khi có thay đổi",
    ],
    color: "emerald",
    icon: "shield-check",
  },
];

// ============================================================================
// MOCK EVIDENCE DATA
// ============================================================================

export const MOCK_EVIDENCE: Record<string, Evidence[]> = {
  "vinhomes-grand-park": [
    {
      id: "ev-vgp-001",
      projectSlug: "vinhomes-grand-park",
      type: "land_use_right",
      documentHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      fileName: "GCNQSDD_VGP_2020.pdf",
      fileSize: 2456789,
      uploadedAt: "2020-03-15T08:30:00Z",
      uploadedBy: "Vingroup Legal",
      verifiedAt: "2020-03-18T14:22:00Z",
      verifiedBy: "RealTera Verification Team",
      expiresAt: "2070-03-15T00:00:00Z",
      status: "verified",
      metadata: {
        documentNumber: "QSD-2020-VGP-001",
        issuingAuthority: "Sở Tài nguyên và Môi trường TP.HCM",
        issueDate: "2020-03-10",
        expiryDate: "2070-03-10",
      },
      blockchainRef: {
        txHash: "0xabc123def456789abc123def456789abc123def456789abc123def456789abc1",
        blockNumber: 12345678,
        timestamp: 1584532320,
      },
    },
    {
      id: "ev-vgp-002",
      projectSlug: "vinhomes-grand-park",
      type: "construction_permit",
      documentHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      fileName: "GPXD_VGP_2020.pdf",
      fileSize: 3456789,
      uploadedAt: "2020-04-01T10:00:00Z",
      uploadedBy: "Vingroup Legal",
      verifiedAt: "2020-04-05T09:15:00Z",
      verifiedBy: "RealTera Verification Team",
      expiresAt: "2025-04-01T00:00:00Z",
      status: "verified",
      metadata: {
        documentNumber: "GPXD-2020-VGP-001",
        issuingAuthority: "Sở Xây dựng TP.HCM",
        issueDate: "2020-03-28",
        expiryDate: "2025-03-28",
      },
    },
    {
      id: "ev-vgp-003",
      projectSlug: "vinhomes-grand-park",
      type: "project_approval",
      documentHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
      fileName: "QDPD_VGP_2019.pdf",
      fileSize: 1234567,
      uploadedAt: "2019-12-15T14:30:00Z",
      uploadedBy: "Vingroup Legal",
      verifiedAt: "2019-12-20T11:45:00Z",
      verifiedBy: "RealTera Verification Team",
      status: "verified",
      metadata: {
        documentNumber: "QD-2019-VGP-001",
        issuingAuthority: "UBND TP.HCM",
        issueDate: "2019-12-10",
      },
    },
    {
      id: "ev-vgp-004",
      projectSlug: "vinhomes-grand-park",
      type: "fire_safety",
      documentHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      fileName: "PCCC_VGP_2023.pdf",
      fileSize: 987654,
      uploadedAt: "2023-06-10T09:00:00Z",
      uploadedBy: "Vingroup Safety",
      verifiedAt: "2023-06-15T16:30:00Z",
      verifiedBy: "RealTera Verification Team",
      expiresAt: "2026-06-10T00:00:00Z",
      status: "verified",
      metadata: {
        documentNumber: "PCCC-2023-VGP-001",
        issuingAuthority: "Cảnh sát PCCC TP.HCM",
        issueDate: "2023-06-05",
        expiryDate: "2026-06-05",
      },
    },
    {
      id: "ev-vgp-005",
      projectSlug: "vinhomes-grand-park",
      type: "bank_guarantee",
      documentHash: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
      fileName: "BaoLanh_Vietcombank_VGP.pdf",
      fileSize: 567890,
      uploadedAt: "2023-01-15T11:00:00Z",
      uploadedBy: "Vingroup Finance",
      verifiedAt: "2023-01-18T10:00:00Z",
      verifiedBy: "RealTera Verification Team",
      expiresAt: "2025-01-15T00:00:00Z",
      status: "verified",
      metadata: {
        documentNumber: "BL-VCB-2023-VGP-001",
        issuingAuthority: "Ngân hàng Vietcombank",
        issueDate: "2023-01-10",
        expiryDate: "2025-01-10",
      },
    },
    {
      id: "ev-vgp-006",
      projectSlug: "vinhomes-grand-park",
      type: "progress_report",
      documentHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
      fileName: "TienDo_Q4_2024_VGP.pdf",
      fileSize: 8765432,
      uploadedAt: "2025-01-05T08:00:00Z",
      uploadedBy: "Vingroup PMO",
      status: "pending",
      metadata: {
        notes: "Q4 2024 progress report - awaiting verification",
      },
    },
    {
      id: "ev-vgp-007",
      projectSlug: "vinhomes-grand-park",
      type: "env_impact",
      documentHash: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
      fileName: "DTM_VGP_2019.pdf",
      fileSize: 4567890,
      uploadedAt: "2019-11-20T15:00:00Z",
      uploadedBy: "Vingroup Environment",
      verifiedAt: "2019-11-25T14:00:00Z",
      verifiedBy: "RealTera Verification Team",
      expiresAt: "2024-11-20T00:00:00Z",
      status: "expired",
      metadata: {
        documentNumber: "DTM-2019-VGP-001",
        issuingAuthority: "Bộ Tài nguyên và Môi trường",
        issueDate: "2019-11-15",
        expiryDate: "2024-11-15",
      },
    },
  ],
  "masteri-thao-dien": [
    {
      id: "ev-mtd-001",
      projectSlug: "masteri-thao-dien",
      type: "land_use_right",
      documentHash: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
      fileName: "GCNQSDD_MTD_2016.pdf",
      fileSize: 2345678,
      uploadedAt: "2016-05-10T09:00:00Z",
      uploadedBy: "Thao Dien Investment",
      verifiedAt: "2016-05-15T11:30:00Z",
      verifiedBy: "RealTera Verification Team",
      expiresAt: "2066-05-10T00:00:00Z",
      status: "verified",
      metadata: {
        documentNumber: "QSD-2016-MTD-001",
        issuingAuthority: "Sở Tài nguyên và Môi trường TP.HCM",
        issueDate: "2016-05-05",
        expiryDate: "2066-05-05",
      },
    },
    {
      id: "ev-mtd-002",
      projectSlug: "masteri-thao-dien",
      type: "construction_permit",
      documentHash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
      fileName: "GPXD_MTD_2016.pdf",
      fileSize: 3234567,
      uploadedAt: "2016-06-01T10:00:00Z",
      uploadedBy: "Thao Dien Investment",
      verifiedAt: "2016-06-05T14:00:00Z",
      verifiedBy: "RealTera Verification Team",
      status: "verified",
      metadata: {
        documentNumber: "GPXD-2016-MTD-001",
        issuingAuthority: "Sở Xây dựng TP.HCM",
        issueDate: "2016-05-28",
      },
    },
    {
      id: "ev-mtd-003",
      projectSlug: "masteri-thao-dien",
      type: "completion_certificate",
      documentHash: "0xa0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
      fileName: "HoanCong_MTD_2018.pdf",
      fileSize: 1876543,
      uploadedAt: "2018-12-20T15:30:00Z",
      uploadedBy: "Thao Dien Investment",
      verifiedAt: "2018-12-28T10:00:00Z",
      verifiedBy: "RealTera Verification Team",
      status: "verified",
      metadata: {
        documentNumber: "HC-2018-MTD-001",
        issuingAuthority: "Sở Xây dựng TP.HCM",
        issueDate: "2018-12-15",
        notes: "Project completed and handed over",
      },
    },
  ],
  "du-an-tranh-chap": [
    {
      id: "ev-datc-001",
      projectSlug: "du-an-tranh-chap",
      type: "land_use_right",
      documentHash: "0xb1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
      fileName: "GCNQSDD_DATC_2021.pdf",
      fileSize: 2123456,
      uploadedAt: "2021-08-10T09:00:00Z",
      uploadedBy: "ABC Development",
      verifiedAt: "2021-08-15T11:00:00Z",
      verifiedBy: "RealTera Verification Team",
      status: "verified",
      metadata: {
        documentNumber: "QSD-2021-DATC-001",
        issuingAuthority: "Sở Tài nguyên và Môi trường Bình Dương",
        issueDate: "2021-08-05",
        notes: "Under legal dispute since 2023",
      },
    },
    {
      id: "ev-datc-002",
      projectSlug: "du-an-tranh-chap",
      type: "construction_permit",
      documentHash: "0xc2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3",
      fileName: "GPXD_DATC_2021.pdf",
      fileSize: 2987654,
      uploadedAt: "2021-09-01T10:00:00Z",
      uploadedBy: "ABC Development",
      status: "rejected",
      metadata: {
        documentNumber: "GPXD-2021-DATC-001",
        issuingAuthority: "Sở Xây dựng Bình Dương",
        notes: "Permit validity disputed - under investigation",
      },
    },
    {
      id: "ev-datc-003",
      projectSlug: "du-an-tranh-chap",
      type: "bank_guarantee",
      documentHash: "0xd3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
      fileName: "BaoLanh_BIDV_DATC.pdf",
      fileSize: 654321,
      uploadedAt: "2021-10-15T14:00:00Z",
      uploadedBy: "ABC Development",
      expiresAt: "2023-10-15T00:00:00Z",
      status: "expired",
      metadata: {
        documentNumber: "BL-BIDV-2021-DATC-001",
        issuingAuthority: "Ngân hàng BIDV",
        issueDate: "2021-10-10",
        expiryDate: "2023-10-10",
        notes: "Guarantee expired - not renewed due to dispute",
      },
    },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getEvidenceByProject(slug: string): Evidence[] {
  return MOCK_EVIDENCE[slug] || [];
}

export function getEvidencePackSummary(slug: string): EvidencePackSummary | null {
  const evidence = MOCK_EVIDENCE[slug];
  if (!evidence) return null;

  const categories = Object.keys(EVIDENCE_CATEGORIES) as EvidenceCategory[];
  const categorySummary = {} as EvidencePackSummary["categories"];

  for (const cat of categories) {
    const catEvidence = evidence.filter((e) => EVIDENCE_TYPES[e.type].category === cat);
    const requiredTypes = Object.values(EVIDENCE_TYPES).filter(
      (t) => t.category === cat && t.required
    );

    categorySummary[cat] = {
      total: catEvidence.length,
      verified: catEvidence.filter((e) => e.status === "verified").length,
      required: requiredTypes.length,
      requiredVerified: catEvidence.filter(
        (e) => e.status === "verified" && EVIDENCE_TYPES[e.type].required
      ).length,
    };
  }

  const totalDocs = evidence.length;
  const verifiedDocs = evidence.filter((e) => e.status === "verified").length;
  const pendingDocs = evidence.filter((e) => e.status === "pending").length;
  const expiredDocs = evidence.filter((e) => e.status === "expired").length;

  const requiredTypes = Object.values(EVIDENCE_TYPES).filter((t) => t.required);
  const requiredVerified = evidence.filter(
    (e) => e.status === "verified" && EVIDENCE_TYPES[e.type].required
  ).length;
  const completionPercentage = Math.round((requiredVerified / requiredTypes.length) * 100);

  return {
    projectSlug: slug,
    totalDocuments: totalDocs,
    verifiedDocuments: verifiedDocs,
    pendingDocuments: pendingDocs,
    expiredDocuments: expiredDocs,
    completionPercentage,
    lastUpdated: evidence.reduce((latest, e) => {
      return e.uploadedAt > latest ? e.uploadedAt : latest;
    }, "1970-01-01"),
    categories: categorySummary,
  };
}

export function getVerificationTier(tier: number): VerificationTier {
  return VERIFICATION_TIERS[tier] || VERIFICATION_TIERS[0];
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isEvidenceExpired(evidence: Evidence): boolean {
  if (!evidence.expiresAt) return false;
  return new Date(evidence.expiresAt) < new Date();
}

export function getEvidenceStatusColor(status: EvidenceStatus): string {
  switch (status) {
    case "verified":
      return "emerald";
    case "pending":
      return "amber";
    case "rejected":
      return "red";
    case "expired":
      return "orange";
    default:
      return "gray";
  }
}
