// RealTera Agency Mock Data
// Realistic Vietnamese real estate agency data for demo purposes

// ============================================================================
// TYPES
// ============================================================================

export interface Agency {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  tier: "starter" | "pro" | "enterprise";
  email: string;
  phone: string;
  address: string;
  website?: string;
  license: string;
  established: number;
  stats: {
    clients: number;
    collections: number;
    projectsTracked: number;
    transactionsThisYear: number;
  };
  subscription: {
    plan: string;
    expiresAt: string;
    monthlyCredits: number;
    usedCredits: number;
  };
  createdAt: string;
}

export interface AgencyClient {
  id: string;
  agencyId: string;
  name: string;
  email: string;
  phone: string;
  type: "individual" | "corporate";
  budget?: {
    min: number;
    max: number;
  };
  preferences: {
    districts: string[];
    propertyTypes: string[];
    minArea?: number;
    maxArea?: number;
  };
  status: "active" | "inactive" | "closed";
  notes?: string;
  createdAt: string;
  lastActivity: string;
}

export interface AgencyCollection {
  id: string;
  agencyId: string;
  name: string;
  description?: string;
  clientId?: string;
  clientName?: string;
  projects: string[]; // Project slugs
  shareLink?: string;
  shareExpiry?: string;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyActivity {
  id: string;
  agencyId: string;
  type: "collection_created" | "collection_shared" | "client_added" | "project_added" | "report_generated";
  description: string;
  descriptionVi: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ============================================================================
// MOCK AGENCIES
// ============================================================================

export const MOCK_AGENCIES: Agency[] = [
  {
    id: "agency-001",
    name: "PropertyPro Vietnam",
    slug: "propertypro-vietnam",
    tier: "pro",
    email: "contact@propertypro.vn",
    phone: "028 3822 9999",
    address: "Tầng 15, Bitexco Tower, Quận 1, TP.HCM",
    website: "https://propertypro.vn",
    license: "GP-BDS-2018-001234",
    established: 2018,
    stats: {
      clients: 47,
      collections: 12,
      projectsTracked: 156,
      transactionsThisYear: 23,
    },
    subscription: {
      plan: "Pro",
      expiresAt: "2025-12-31T00:00:00Z",
      monthlyCredits: 500,
      usedCredits: 247,
    },
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "agency-002",
    name: "CBRE Vietnam",
    slug: "cbre-vietnam",
    tier: "enterprise",
    email: "info@cbre.com.vn",
    phone: "028 3824 6666",
    address: "Tầng 20, Deutsches Haus, Quận 1, TP.HCM",
    website: "https://cbre.com.vn",
    license: "GP-BDS-2010-000456",
    established: 2010,
    stats: {
      clients: 312,
      collections: 89,
      projectsTracked: 450,
      transactionsThisYear: 156,
    },
    subscription: {
      plan: "Enterprise",
      expiresAt: "2026-06-30T00:00:00Z",
      monthlyCredits: 5000,
      usedCredits: 1823,
    },
    createdAt: "2022-03-01T00:00:00Z",
  },
  {
    id: "agency-003",
    name: "Savills Vietnam",
    slug: "savills-vietnam",
    tier: "enterprise",
    email: "hcmc@savills.com.vn",
    phone: "028 3823 9205",
    address: "Tầng 18, Saigon Tower, Quận 1, TP.HCM",
    website: "https://savills.com.vn",
    license: "GP-BDS-2008-000123",
    established: 2008,
    stats: {
      clients: 278,
      collections: 67,
      projectsTracked: 380,
      transactionsThisYear: 134,
    },
    subscription: {
      plan: "Enterprise",
      expiresAt: "2026-03-31T00:00:00Z",
      monthlyCredits: 5000,
      usedCredits: 2156,
    },
    createdAt: "2022-01-15T00:00:00Z",
  },
];

// ============================================================================
// MOCK CLIENTS
// ============================================================================

export const MOCK_CLIENTS: AgencyClient[] = [
  {
    id: "client-001",
    agencyId: "agency-001",
    name: "Nguyễn Văn An",
    email: "an.nguyen@gmail.com",
    phone: "0903 123 456",
    type: "individual",
    budget: {
      min: 3000000000, // 3 tỷ
      max: 5000000000, // 5 tỷ
    },
    preferences: {
      districts: ["Quận 2", "Thủ Đức", "Quận 9"],
      propertyTypes: ["Căn hộ", "Biệt thự"],
      minArea: 70,
      maxArea: 150,
    },
    status: "active",
    notes: "Đang tìm căn hộ 3PN cho gia đình, ưu tiên gần trường quốc tế",
    createdAt: "2024-06-15T00:00:00Z",
    lastActivity: "2025-01-08T10:30:00Z",
  },
  {
    id: "client-002",
    agencyId: "agency-001",
    name: "Trần Thị Bình",
    email: "binh.tran@company.vn",
    phone: "0908 234 567",
    type: "individual",
    budget: {
      min: 8000000000, // 8 tỷ
      max: 15000000000, // 15 tỷ
    },
    preferences: {
      districts: ["Quận 1", "Quận 3", "Bình Thạnh"],
      propertyTypes: ["Penthouse", "Căn hộ cao cấp"],
      minArea: 150,
    },
    status: "active",
    notes: "Đầu tư bất động sản cao cấp, quan tâm dự án có view sông",
    createdAt: "2024-08-20T00:00:00Z",
    lastActivity: "2025-01-05T14:45:00Z",
  },
  {
    id: "client-003",
    agencyId: "agency-001",
    name: "Công ty TNHH ABC Holdings",
    email: "investment@abcholdings.vn",
    phone: "028 3636 7777",
    type: "corporate",
    budget: {
      min: 50000000000, // 50 tỷ
      max: 200000000000, // 200 tỷ
    },
    preferences: {
      districts: ["Quận 1", "Quận 7", "Thủ Đức"],
      propertyTypes: ["Đất nền", "Cao ốc văn phòng", "Trung tâm thương mại"],
    },
    status: "active",
    notes: "Portfolio đầu tư bất động sản thương mại",
    createdAt: "2024-03-10T00:00:00Z",
    lastActivity: "2025-01-09T09:00:00Z",
  },
  {
    id: "client-004",
    agencyId: "agency-001",
    name: "Lê Minh Cường",
    email: "cuong.le.89@gmail.com",
    phone: "0912 345 678",
    type: "individual",
    budget: {
      min: 2000000000, // 2 tỷ
      max: 3500000000, // 3.5 tỷ
    },
    preferences: {
      districts: ["Quận 9", "Thủ Đức", "Bình Dương"],
      propertyTypes: ["Căn hộ"],
      minArea: 55,
      maxArea: 80,
    },
    status: "inactive",
    notes: "Đã mua căn hộ Vinhomes Grand Park tháng 12/2024",
    createdAt: "2024-09-01T00:00:00Z",
    lastActivity: "2024-12-20T16:30:00Z",
  },
];

// ============================================================================
// MOCK COLLECTIONS
// ============================================================================

export const MOCK_COLLECTIONS: AgencyCollection[] = [
  {
    id: "col-001",
    agencyId: "agency-001",
    name: "Q4 2024 - Đề xuất HCM",
    description: "Các dự án cao cấp tại TP.HCM phù hợp với ngân sách 3-5 tỷ",
    clientId: "client-001",
    clientName: "Nguyễn Văn An",
    projects: ["vinhomes-grand-park", "masteri-thao-dien", "the-sun-avenue"],
    shareLink: "abc123xyz",
    shareExpiry: "2025-02-15T00:00:00Z",
    isPublic: true,
    viewCount: 12,
    createdAt: "2024-11-15T10:00:00Z",
    updatedAt: "2025-01-05T14:30:00Z",
  },
  {
    id: "col-002",
    agencyId: "agency-001",
    name: "Premium Investment Q1 2025",
    description: "Dự án cao cấp cho nhà đầu tư với ngân sách từ 8 tỷ",
    clientId: "client-002",
    clientName: "Trần Thị Bình",
    projects: ["empire-city", "the-marq", "grand-marina"],
    shareLink: "def456uvw",
    shareExpiry: "2025-03-31T00:00:00Z",
    isPublic: true,
    viewCount: 8,
    createdAt: "2024-12-01T09:00:00Z",
    updatedAt: "2025-01-08T11:15:00Z",
  },
  {
    id: "col-003",
    agencyId: "agency-001",
    name: "Commercial Properties 2025",
    description: "Bất động sản thương mại cho ABC Holdings",
    clientId: "client-003",
    clientName: "Công ty TNHH ABC Holdings",
    projects: ["landmark-81-office", "bitexco-financial-tower"],
    isPublic: false,
    viewCount: 3,
    createdAt: "2025-01-02T08:00:00Z",
    updatedAt: "2025-01-09T09:45:00Z",
  },
  {
    id: "col-004",
    agencyId: "agency-001",
    name: "First-time Buyers Guide",
    description: "Hướng dẫn mua nhà lần đầu - dự án giá tốt",
    projects: ["vinhomes-grand-park", "the-origami", "s-premium"],
    isPublic: true,
    viewCount: 156,
    createdAt: "2024-10-01T14:00:00Z",
    updatedAt: "2024-12-15T10:00:00Z",
  },
  {
    id: "col-005",
    agencyId: "agency-002",
    name: "CBRE Q1 2025 Highlights",
    description: "Top dự án nổi bật Q1 2025 theo đánh giá CBRE",
    projects: ["vinhomes-grand-park", "empire-city", "the-global-city"],
    shareLink: "cbre2025q1",
    shareExpiry: "2025-04-30T00:00:00Z",
    isPublic: true,
    viewCount: 423,
    createdAt: "2025-01-05T08:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z",
  },
];

// ============================================================================
// MOCK ACTIVITIES
// ============================================================================

export const MOCK_ACTIVITIES: AgencyActivity[] = [
  {
    id: "act-001",
    agencyId: "agency-001",
    type: "collection_shared",
    description: "Shared collection 'Q4 2024 - Đề xuất HCM' with client",
    descriptionVi: "Chia sẻ bộ sưu tập 'Q4 2024 - Đề xuất HCM' cho khách hàng",
    metadata: { collectionId: "col-001", clientName: "Nguyễn Văn An" },
    createdAt: "2025-01-08T10:30:00Z",
  },
  {
    id: "act-002",
    agencyId: "agency-001",
    type: "project_added",
    description: "Added 'The Global City' to collection",
    descriptionVi: "Thêm 'The Global City' vào bộ sưu tập",
    metadata: { collectionId: "col-002", projectSlug: "the-global-city" },
    createdAt: "2025-01-07T15:45:00Z",
  },
  {
    id: "act-003",
    agencyId: "agency-001",
    type: "client_added",
    description: "Added new client 'Phạm Văn Dũng'",
    descriptionVi: "Thêm khách hàng mới 'Phạm Văn Dũng'",
    metadata: { clientId: "client-005" },
    createdAt: "2025-01-06T09:00:00Z",
  },
  {
    id: "act-004",
    agencyId: "agency-001",
    type: "collection_created",
    description: "Created collection 'Commercial Properties 2025'",
    descriptionVi: "Tạo bộ sưu tập 'Commercial Properties 2025'",
    metadata: { collectionId: "col-003" },
    createdAt: "2025-01-02T08:00:00Z",
  },
  {
    id: "act-005",
    agencyId: "agency-001",
    type: "report_generated",
    description: "Generated attestation report for Vinhomes Grand Park",
    descriptionVi: "Tạo báo cáo xác minh cho Vinhomes Grand Park",
    metadata: { projectSlug: "vinhomes-grand-park" },
    createdAt: "2024-12-28T11:30:00Z",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getAgencyById(id: string): Agency | undefined {
  return MOCK_AGENCIES.find((a) => a.id === id);
}

export function getAgencyBySlug(slug: string): Agency | undefined {
  return MOCK_AGENCIES.find((a) => a.slug === slug);
}

export function getClientsByAgency(agencyId: string): AgencyClient[] {
  return MOCK_CLIENTS.filter((c) => c.agencyId === agencyId);
}

export function getCollectionsByAgency(agencyId: string): AgencyCollection[] {
  return MOCK_COLLECTIONS.filter((c) => c.agencyId === agencyId);
}

export function getCollectionById(id: string): AgencyCollection | undefined {
  return MOCK_COLLECTIONS.find((c) => c.id === id);
}

export function getCollectionByShareLink(shareLink: string): AgencyCollection | undefined {
  return MOCK_COLLECTIONS.find((c) => c.shareLink === shareLink && c.isPublic);
}

export function getActivitiesByAgency(agencyId: string, limit = 10): AgencyActivity[] {
  return MOCK_ACTIVITIES
    .filter((a) => a.agencyId === agencyId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function formatCurrency(amount: number): string {
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(1)} tỷ`;
  }
  if (amount >= 1e6) {
    return `${(amount / 1e6).toFixed(0)} triệu`;
  }
  return new Intl.NumberFormat("vi-VN").format(amount);
}

// Demo agency for unauthenticated users
export const DEMO_AGENCY = MOCK_AGENCIES[0];
