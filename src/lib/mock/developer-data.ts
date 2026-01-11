// RealTera Developer Mock Data
// Realistic Vietnamese real estate developer data for demo purposes

// ============================================================================
// TYPES
// ============================================================================

export interface Developer {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  tier: "starter" | "professional" | "enterprise";
  email: string;
  phone: string;
  address: string;
  website?: string;
  businessLicense: string;
  established: number;
  description: string;
  descriptionVi: string;
  stats: {
    totalProjects: number;
    completedProjects: number;
    ongoingProjects: number;
    verifiedProjects: number;
    averageRating: number;
  };
  documents: {
    total: number;
    verified: number;
    pending: number;
    expiringSoon: number; // Within 30 days
  };
  subscription: {
    plan: string;
    expiresAt: string;
    features: string[];
  };
  createdAt: string;
}

export interface DeveloperProject {
  id: string;
  developerId: string;
  projectSlug: string;
  name: string;
  status: "planning" | "under_construction" | "completed" | "on_hold";
  verificationTier: 0 | 1 | 2 | 3 | 4;
  verificationStatus: "unverified" | "pending" | "verified" | "disputed";
  documentsComplete: number; // Percentage
  lastVerified?: string;
  nextReviewDate?: string;
  createdAt: string;
}

export interface DeveloperDocument {
  id: string;
  developerId: string;
  projectSlug?: string; // null for company-level docs
  type: string;
  name: string;
  fileName: string;
  fileSize: number;
  hash: string;
  uploadedAt: string;
  verifiedAt?: string;
  expiresAt?: string;
  status: "pending" | "verified" | "rejected" | "expired";
  notes?: string;
  blockchainRef?: {
    txHash: string;
    blockNumber: number;
  };
}

export interface VerificationRequest {
  id: string;
  developerId: string;
  projectSlug: string;
  requestedTier: 1 | 2 | 3 | 4;
  currentTier: 0 | 1 | 2 | 3 | 4;
  status: "pending" | "in_review" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewer?: string;
  notes?: string;
  requiredDocuments: string[];
  uploadedDocuments: string[];
}

// ============================================================================
// MOCK DEVELOPERS
// ============================================================================

export const MOCK_DEVELOPERS: Developer[] = [
  {
    id: "dev-001",
    name: "Tập đoàn Vingroup",
    slug: "vingroup",
    tier: "enterprise",
    email: "investor@vingroup.net",
    phone: "024 3974 9999",
    address: "Số 7, Đường Bằng Lăng 1, KĐT Vinhomes Riverside, Long Biên, Hà Nội",
    website: "https://vingroup.net",
    businessLicense: "0101245486",
    established: 1993,
    description: "Vietnam's largest private conglomerate with diversified portfolio including real estate, retail, healthcare, and technology",
    descriptionVi: "Tập đoàn tư nhân lớn nhất Việt Nam với danh mục đầu tư đa dạng bao gồm bất động sản, bán lẻ, y tế và công nghệ",
    stats: {
      totalProjects: 78,
      completedProjects: 52,
      ongoingProjects: 26,
      verifiedProjects: 47,
      averageRating: 4.5,
    },
    documents: {
      total: 234,
      verified: 198,
      pending: 12,
      expiringSoon: 5,
    },
    subscription: {
      plan: "Enterprise",
      expiresAt: "2026-12-31T00:00:00Z",
      features: ["Unlimited projects", "Priority verification", "API access", "Dedicated support"],
    },
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "dev-002",
    name: "Tập đoàn Novaland",
    slug: "novaland",
    tier: "enterprise",
    email: "info@novaland.com.vn",
    phone: "028 3821 9999",
    address: "Tòa nhà Novaland, 65 Nguyễn Du, Quận 1, TP.HCM",
    website: "https://novaland.com.vn",
    businessLicense: "0301444753",
    established: 1992,
    description: "Leading real estate developer in Southern Vietnam specializing in residential and integrated townships",
    descriptionVi: "Nhà phát triển bất động sản hàng đầu tại miền Nam Việt Nam chuyên về nhà ở và khu đô thị tích hợp",
    stats: {
      totalProjects: 45,
      completedProjects: 28,
      ongoingProjects: 17,
      verifiedProjects: 23,
      averageRating: 4.2,
    },
    documents: {
      total: 156,
      verified: 134,
      pending: 8,
      expiringSoon: 3,
    },
    subscription: {
      plan: "Enterprise",
      expiresAt: "2026-06-30T00:00:00Z",
      features: ["Unlimited projects", "Priority verification", "API access"],
    },
    createdAt: "2022-03-15T00:00:00Z",
  },
  {
    id: "dev-003",
    name: "Tập đoàn Hưng Thịnh",
    slug: "hung-thinh",
    tier: "professional",
    email: "contact@hungthinhcorp.com.vn",
    phone: "028 7307 7979",
    address: "Tầng 9-11, Tòa nhà Hưng Thịnh, 217A Nguyễn Văn Thủ, Quận 1, TP.HCM",
    website: "https://hungthinhcorp.com.vn",
    businessLicense: "0313088683",
    established: 2002,
    description: "Dynamic real estate developer known for mid-range residential projects in Ho Chi Minh City",
    descriptionVi: "Nhà phát triển bất động sản năng động nổi tiếng với các dự án nhà ở tầm trung tại TP.HCM",
    stats: {
      totalProjects: 32,
      completedProjects: 20,
      ongoingProjects: 12,
      verifiedProjects: 15,
      averageRating: 4.0,
    },
    documents: {
      total: 98,
      verified: 78,
      pending: 10,
      expiringSoon: 2,
    },
    subscription: {
      plan: "Professional",
      expiresAt: "2025-12-31T00:00:00Z",
      features: ["Up to 50 projects", "Standard verification", "Basic API access"],
    },
    createdAt: "2023-01-10T00:00:00Z",
  },
  {
    id: "dev-004",
    name: "Masterise Homes",
    slug: "masterise-homes",
    tier: "enterprise",
    email: "info@masterisehomes.com",
    phone: "028 3822 8888",
    address: "Tầng 15, Tòa nhà Masteri An Phú, Quận 2, TP.HCM",
    website: "https://masterisehomes.com",
    businessLicense: "0314567890",
    established: 2018,
    description: "Premium real estate developer focusing on luxury branded residences",
    descriptionVi: "Nhà phát triển bất động sản cao cấp tập trung vào nhà ở thương hiệu sang trọng",
    stats: {
      totalProjects: 12,
      completedProjects: 5,
      ongoingProjects: 7,
      verifiedProjects: 8,
      averageRating: 4.7,
    },
    documents: {
      total: 67,
      verified: 58,
      pending: 5,
      expiringSoon: 1,
    },
    subscription: {
      plan: "Enterprise",
      expiresAt: "2026-03-31T00:00:00Z",
      features: ["Unlimited projects", "Priority verification", "API access", "White-label reports"],
    },
    createdAt: "2023-06-01T00:00:00Z",
  },
  {
    id: "dev-005",
    name: "Phúc Khang Corporation",
    slug: "phuc-khang",
    tier: "starter",
    email: "info@phuckhangcorp.vn",
    phone: "028 3845 6789",
    address: "Tầng 5, 123 Nguyễn Đình Chiểu, Quận 3, TP.HCM",
    businessLicense: "0315678901",
    established: 2015,
    description: "Emerging developer specializing in green and sustainable residential projects",
    descriptionVi: "Nhà phát triển mới nổi chuyên về các dự án nhà ở xanh và bền vững",
    stats: {
      totalProjects: 5,
      completedProjects: 2,
      ongoingProjects: 3,
      verifiedProjects: 2,
      averageRating: 3.8,
    },
    documents: {
      total: 23,
      verified: 15,
      pending: 6,
      expiringSoon: 0,
    },
    subscription: {
      plan: "Starter",
      expiresAt: "2025-06-30T00:00:00Z",
      features: ["Up to 10 projects", "Basic verification"],
    },
    createdAt: "2024-01-15T00:00:00Z",
  },
];

// ============================================================================
// MOCK DEVELOPER PROJECTS
// ============================================================================

export const MOCK_DEVELOPER_PROJECTS: DeveloperProject[] = [
  // Vingroup projects
  {
    id: "proj-001",
    developerId: "dev-001",
    projectSlug: "vinhomes-grand-park",
    name: "Vinhomes Grand Park",
    status: "completed",
    verificationTier: 4,
    verificationStatus: "verified",
    documentsComplete: 95,
    lastVerified: "2024-12-15T00:00:00Z",
    nextReviewDate: "2025-03-15T00:00:00Z",
    createdAt: "2020-01-01T00:00:00Z",
  },
  {
    id: "proj-002",
    developerId: "dev-001",
    projectSlug: "vinhomes-ocean-park",
    name: "Vinhomes Ocean Park",
    status: "completed",
    verificationTier: 4,
    verificationStatus: "verified",
    documentsComplete: 92,
    lastVerified: "2024-11-20T00:00:00Z",
    nextReviewDate: "2025-02-20T00:00:00Z",
    createdAt: "2019-06-01T00:00:00Z",
  },
  {
    id: "proj-003",
    developerId: "dev-001",
    projectSlug: "vinhomes-central-park",
    name: "Vinhomes Central Park",
    status: "completed",
    verificationTier: 4,
    verificationStatus: "verified",
    documentsComplete: 100,
    lastVerified: "2024-10-01T00:00:00Z",
    createdAt: "2016-01-01T00:00:00Z",
  },
  {
    id: "proj-004",
    developerId: "dev-001",
    projectSlug: "the-global-city",
    name: "The Global City",
    status: "under_construction",
    verificationTier: 3,
    verificationStatus: "verified",
    documentsComplete: 85,
    lastVerified: "2024-12-20T00:00:00Z",
    nextReviewDate: "2025-03-20T00:00:00Z",
    createdAt: "2023-01-01T00:00:00Z",
  },
  // Masterise projects
  {
    id: "proj-005",
    developerId: "dev-004",
    projectSlug: "masteri-thao-dien",
    name: "Masteri Thao Dien",
    status: "completed",
    verificationTier: 4,
    verificationStatus: "verified",
    documentsComplete: 100,
    lastVerified: "2024-09-15T00:00:00Z",
    createdAt: "2016-01-01T00:00:00Z",
  },
  {
    id: "proj-006",
    developerId: "dev-004",
    projectSlug: "the-marq",
    name: "The Marq",
    status: "under_construction",
    verificationTier: 3,
    verificationStatus: "verified",
    documentsComplete: 78,
    lastVerified: "2024-11-01T00:00:00Z",
    nextReviewDate: "2025-02-01T00:00:00Z",
    createdAt: "2022-06-01T00:00:00Z",
  },
  // Disputed project
  {
    id: "proj-007",
    developerId: "dev-005",
    projectSlug: "du-an-tranh-chap",
    name: "Dự án Tranh chấp",
    status: "on_hold",
    verificationTier: 1,
    verificationStatus: "disputed",
    documentsComplete: 45,
    lastVerified: "2023-08-01T00:00:00Z",
    createdAt: "2021-01-01T00:00:00Z",
  },
];

// ============================================================================
// MOCK DEVELOPER DOCUMENTS
// ============================================================================

export const MOCK_DEVELOPER_DOCUMENTS: DeveloperDocument[] = [
  // Vingroup company-level documents
  {
    id: "doc-001",
    developerId: "dev-001",
    type: "business_license",
    name: "Giấy phép Kinh doanh",
    fileName: "GPKD_Vingroup_2023.pdf",
    fileSize: 1234567,
    hash: "0x123abc456def789",
    uploadedAt: "2023-01-15T00:00:00Z",
    verifiedAt: "2023-01-20T00:00:00Z",
    status: "verified",
    notes: "Updated annual registration",
  },
  {
    id: "doc-002",
    developerId: "dev-001",
    type: "financial_audit",
    name: "Báo cáo Kiểm toán 2023",
    fileName: "Audit_Vingroup_2023.pdf",
    fileSize: 5678901,
    hash: "0x456def789abc123",
    uploadedAt: "2024-03-01T00:00:00Z",
    verifiedAt: "2024-03-10T00:00:00Z",
    expiresAt: "2025-03-01T00:00:00Z",
    status: "verified",
  },
  // Vinhomes Grand Park project documents
  {
    id: "doc-003",
    developerId: "dev-001",
    projectSlug: "vinhomes-grand-park",
    type: "land_use_right",
    name: "Giấy chứng nhận QSDĐ",
    fileName: "GCNQSDD_VGP_2020.pdf",
    fileSize: 2456789,
    hash: "0x789abc123def456",
    uploadedAt: "2020-03-15T00:00:00Z",
    verifiedAt: "2020-03-18T00:00:00Z",
    expiresAt: "2070-03-15T00:00:00Z",
    status: "verified",
    blockchainRef: {
      txHash: "0xabc123def456789abc123def456789abc123def456789abc123def456789abc1",
      blockNumber: 12345678,
    },
  },
  {
    id: "doc-004",
    developerId: "dev-001",
    projectSlug: "vinhomes-grand-park",
    type: "construction_permit",
    name: "Giấy phép Xây dựng",
    fileName: "GPXD_VGP_2020.pdf",
    fileSize: 3456789,
    hash: "0xabc123def456789",
    uploadedAt: "2020-04-01T00:00:00Z",
    verifiedAt: "2020-04-05T00:00:00Z",
    expiresAt: "2025-04-01T00:00:00Z",
    status: "verified",
  },
  {
    id: "doc-005",
    developerId: "dev-001",
    projectSlug: "vinhomes-grand-park",
    type: "progress_report",
    name: "Báo cáo Tiến độ Q4 2024",
    fileName: "Progress_Q4_2024_VGP.pdf",
    fileSize: 8765432,
    hash: "0xdef456789abc123",
    uploadedAt: "2025-01-05T00:00:00Z",
    status: "pending",
    notes: "Awaiting verification",
  },
  {
    id: "doc-006",
    developerId: "dev-001",
    projectSlug: "vinhomes-grand-park",
    type: "env_impact",
    name: "Đánh giá Tác động Môi trường",
    fileName: "DTM_VGP_2019.pdf",
    fileSize: 4567890,
    hash: "0x111222333444555",
    uploadedAt: "2019-11-20T00:00:00Z",
    verifiedAt: "2019-11-25T00:00:00Z",
    expiresAt: "2024-11-20T00:00:00Z",
    status: "expired",
    notes: "Needs renewal",
  },
  // Disputed project documents
  {
    id: "doc-007",
    developerId: "dev-005",
    projectSlug: "du-an-tranh-chap",
    type: "construction_permit",
    name: "Giấy phép Xây dựng",
    fileName: "GPXD_DATC_2021.pdf",
    fileSize: 2987654,
    hash: "0x555666777888999",
    uploadedAt: "2021-09-01T00:00:00Z",
    status: "rejected",
    notes: "Permit validity disputed - under investigation",
  },
];

// ============================================================================
// MOCK VERIFICATION REQUESTS
// ============================================================================

export const MOCK_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: "vr-001",
    developerId: "dev-001",
    projectSlug: "the-global-city",
    requestedTier: 4,
    currentTier: 3,
    status: "in_review",
    submittedAt: "2024-12-15T00:00:00Z",
    requiredDocuments: ["quality_inspection", "bank_guarantee_renewal", "fire_safety_update"],
    uploadedDocuments: ["quality_inspection", "bank_guarantee_renewal"],
    notes: "Pending fire safety certificate update",
  },
  {
    id: "vr-002",
    developerId: "dev-003",
    projectSlug: "moonlight-boulevard",
    requestedTier: 3,
    currentTier: 2,
    status: "pending",
    submittedAt: "2025-01-08T00:00:00Z",
    requiredDocuments: ["third_party_audit", "co_signer_agreement"],
    uploadedDocuments: [],
  },
  {
    id: "vr-003",
    developerId: "dev-004",
    projectSlug: "the-marq",
    requestedTier: 4,
    currentTier: 3,
    status: "approved",
    submittedAt: "2024-11-01T00:00:00Z",
    reviewedAt: "2024-11-15T00:00:00Z",
    reviewer: "RealTera Verification Team",
    requiredDocuments: ["continuous_monitoring_agreement", "quarterly_report"],
    uploadedDocuments: ["continuous_monitoring_agreement", "quarterly_report"],
    notes: "Approved for Tier 4 monitoring",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getDeveloperById(id: string): Developer | undefined {
  return MOCK_DEVELOPERS.find((d) => d.id === id);
}

export function getDeveloperBySlug(slug: string): Developer | undefined {
  return MOCK_DEVELOPERS.find((d) => d.slug === slug);
}

export function getProjectsByDeveloper(developerId: string): DeveloperProject[] {
  return MOCK_DEVELOPER_PROJECTS.filter((p) => p.developerId === developerId);
}

export function getProjectBySlug(developerId: string, projectSlug: string): DeveloperProject | undefined {
  return MOCK_DEVELOPER_PROJECTS.find(
    (p) => p.developerId === developerId && p.projectSlug === projectSlug
  );
}

export function getDocumentsByDeveloper(developerId: string): DeveloperDocument[] {
  return MOCK_DEVELOPER_DOCUMENTS.filter((d) => d.developerId === developerId);
}

export function getDocumentsByProject(developerId: string, projectSlug: string): DeveloperDocument[] {
  return MOCK_DEVELOPER_DOCUMENTS.filter(
    (d) => d.developerId === developerId && d.projectSlug === projectSlug
  );
}

export function getVerificationRequests(developerId: string): VerificationRequest[] {
  return MOCK_VERIFICATION_REQUESTS.filter((r) => r.developerId === developerId);
}

export function getDocumentsExpiringSoon(developerId: string, days = 30): DeveloperDocument[] {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + days);

  return MOCK_DEVELOPER_DOCUMENTS.filter((d) => {
    if (d.developerId !== developerId || !d.expiresAt) return false;
    const expiryDate = new Date(d.expiresAt);
    return expiryDate <= threshold && expiryDate > new Date();
  });
}

export function getVerificationProgress(developerId: string, projectSlug: string): number {
  const docs = getDocumentsByProject(developerId, projectSlug);
  if (docs.length === 0) return 0;
  const verified = docs.filter((d) => d.status === "verified").length;
  return Math.round((verified / docs.length) * 100);
}

// Demo developer for unauthenticated users
export const DEMO_DEVELOPER = MOCK_DEVELOPERS[0];
