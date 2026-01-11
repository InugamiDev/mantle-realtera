// RealTera API Keys Mock Data
// Mock data for API key management and platform API access

// ============================================================================
// TYPES
// ============================================================================

export type ApiPermission =
  | "read:projects"
  | "read:attestations"
  | "read:developers"
  | "read:evidence"
  | "write:attestations"
  | "write:webhooks"
  | "admin:all";

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string; // First 8 chars of the key
  keyHash: string;
  organizationId: string;
  organizationName: string;
  permissions: ApiPermission[];
  rateLimit: number; // Requests per hour
  usageThisMonth: number;
  usageThisHour: number;
  lastUsedAt?: string;
  expiresAt?: string;
  isActive: boolean;
  environment: "production" | "sandbox";
  createdAt: string;
  createdBy: string;
}

export interface ApiUsageLog {
  id: string;
  apiKeyId: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  statusCode: number;
  responseTimeMs: number;
  timestamp: string;
  ipAddress: string;
  userAgent?: string;
}

export interface Webhook {
  id: string;
  organizationId: string;
  name: string;
  url: string;
  secret: string;
  events: WebhookEventType[];
  isActive: boolean;
  failureCount: number;
  lastDeliveryAt?: string;
  lastDeliveryStatus?: "success" | "failed";
  createdAt: string;
}

export type WebhookEventType =
  | "attestation.created"
  | "attestation.updated"
  | "attestation.expired"
  | "attestation.disputed"
  | "attestation.revoked"
  | "project.verified"
  | "project.tier_changed"
  | "document.uploaded"
  | "document.verified"
  | "document.expired";

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: WebhookEventType;
  payload: Record<string, unknown>;
  statusCode?: number;
  responseBody?: string;
  responseTimeMs?: number;
  attempts: number;
  status: "pending" | "delivered" | "failed";
  createdAt: string;
  deliveredAt?: string;
}

// ============================================================================
// MOCK API KEYS
// ============================================================================

// These are demo keys that work in mock mode
export const MOCK_API_KEYS: Record<string, ApiKey> = {
  "demo-key-001": {
    id: "key-001",
    name: "Development Key",
    keyPrefix: "demo-key",
    keyHash: "hash_demo_key_001",
    organizationId: "org-001",
    organizationName: "Demo Corp",
    permissions: ["read:projects", "read:attestations", "read:developers"],
    rateLimit: 1000,
    usageThisMonth: 247,
    usageThisHour: 12,
    lastUsedAt: "2025-01-10T08:45:00Z",
    isActive: true,
    environment: "sandbox",
    createdAt: "2024-06-15T00:00:00Z",
    createdBy: "demo@example.com",
  },
  "rlt_live_abc123xyz": {
    id: "key-002",
    name: "Production API Key",
    keyPrefix: "rlt_live",
    keyHash: "hash_rlt_live_abc123",
    organizationId: "org-002",
    organizationName: "PropertyPro Vietnam",
    permissions: ["read:projects", "read:attestations", "read:evidence", "write:webhooks"],
    rateLimit: 5000,
    usageThisMonth: 1823,
    usageThisHour: 45,
    lastUsedAt: "2025-01-10T09:30:00Z",
    isActive: true,
    environment: "production",
    createdAt: "2024-03-01T00:00:00Z",
    createdBy: "admin@propertypro.vn",
  },
  "rlt_test_def456uvw": {
    id: "key-003",
    name: "Test Environment Key",
    keyPrefix: "rlt_test",
    keyHash: "hash_rlt_test_def456",
    organizationId: "org-002",
    organizationName: "PropertyPro Vietnam",
    permissions: ["read:projects", "read:attestations"],
    rateLimit: 500,
    usageThisMonth: 89,
    usageThisHour: 3,
    lastUsedAt: "2025-01-09T16:20:00Z",
    isActive: true,
    environment: "sandbox",
    createdAt: "2024-03-01T00:00:00Z",
    createdBy: "admin@propertypro.vn",
  },
  "rlt_live_enterprise": {
    id: "key-004",
    name: "Enterprise Full Access",
    keyPrefix: "rlt_live",
    keyHash: "hash_rlt_enterprise",
    organizationId: "org-003",
    organizationName: "CBRE Vietnam",
    permissions: ["read:projects", "read:attestations", "read:developers", "read:evidence", "write:attestations", "write:webhooks"],
    rateLimit: 20000,
    usageThisMonth: 8456,
    usageThisHour: 234,
    lastUsedAt: "2025-01-10T09:58:00Z",
    isActive: true,
    environment: "production",
    createdAt: "2023-06-01T00:00:00Z",
    createdBy: "tech@cbre.com.vn",
  },
};

// List format for UI
export const MOCK_API_KEYS_LIST: ApiKey[] = Object.values(MOCK_API_KEYS);

// ============================================================================
// MOCK API USAGE LOGS
// ============================================================================

export const MOCK_API_USAGE_LOGS: ApiUsageLog[] = [
  {
    id: "log-001",
    apiKeyId: "key-002",
    endpoint: "/api/v1/projects",
    method: "GET",
    statusCode: 200,
    responseTimeMs: 45,
    timestamp: "2025-01-10T09:30:00Z",
    ipAddress: "203.162.xxx.xxx",
    userAgent: "PropertyPro-SDK/1.0",
  },
  {
    id: "log-002",
    apiKeyId: "key-002",
    endpoint: "/api/v1/attestations/vinhomes-grand-park",
    method: "GET",
    statusCode: 200,
    responseTimeMs: 32,
    timestamp: "2025-01-10T09:28:00Z",
    ipAddress: "203.162.xxx.xxx",
    userAgent: "PropertyPro-SDK/1.0",
  },
  {
    id: "log-003",
    apiKeyId: "key-004",
    endpoint: "/api/v1/projects",
    method: "GET",
    statusCode: 200,
    responseTimeMs: 78,
    timestamp: "2025-01-10T09:25:00Z",
    ipAddress: "118.69.xxx.xxx",
    userAgent: "CBRE-Integration/2.1",
  },
  {
    id: "log-004",
    apiKeyId: "key-001",
    endpoint: "/api/v1/projects/invalid-slug",
    method: "GET",
    statusCode: 404,
    responseTimeMs: 12,
    timestamp: "2025-01-10T08:45:00Z",
    ipAddress: "127.0.0.1",
  },
  {
    id: "log-005",
    apiKeyId: "key-004",
    endpoint: "/api/v1/attestations",
    method: "POST",
    statusCode: 201,
    responseTimeMs: 156,
    timestamp: "2025-01-10T08:30:00Z",
    ipAddress: "118.69.xxx.xxx",
    userAgent: "CBRE-Integration/2.1",
  },
];

// ============================================================================
// MOCK WEBHOOKS
// ============================================================================

export const MOCK_WEBHOOKS: Webhook[] = [
  {
    id: "wh-001",
    organizationId: "org-002",
    name: "Attestation Updates",
    url: "https://api.propertypro.vn/webhooks/realtera",
    secret: "whsec_xxx...xxx",
    events: ["attestation.created", "attestation.updated", "attestation.disputed"],
    isActive: true,
    failureCount: 0,
    lastDeliveryAt: "2025-01-10T08:00:00Z",
    lastDeliveryStatus: "success",
    createdAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "wh-002",
    organizationId: "org-002",
    name: "Document Notifications",
    url: "https://api.propertypro.vn/webhooks/documents",
    secret: "whsec_yyy...yyy",
    events: ["document.verified", "document.expired"],
    isActive: true,
    failureCount: 2,
    lastDeliveryAt: "2025-01-09T14:30:00Z",
    lastDeliveryStatus: "failed",
    createdAt: "2024-08-15T00:00:00Z",
  },
  {
    id: "wh-003",
    organizationId: "org-003",
    name: "CBRE All Events",
    url: "https://integrations.cbre.com.vn/realtera/events",
    secret: "whsec_zzz...zzz",
    events: [
      "attestation.created",
      "attestation.updated",
      "attestation.expired",
      "attestation.disputed",
      "project.verified",
      "project.tier_changed",
    ],
    isActive: true,
    failureCount: 0,
    lastDeliveryAt: "2025-01-10T09:15:00Z",
    lastDeliveryStatus: "success",
    createdAt: "2023-09-01T00:00:00Z",
  },
];

// ============================================================================
// MOCK WEBHOOK DELIVERIES
// ============================================================================

export const MOCK_WEBHOOK_DELIVERIES: WebhookDelivery[] = [
  {
    id: "del-001",
    webhookId: "wh-001",
    event: "attestation.updated",
    payload: {
      type: "attestation.updated",
      data: {
        projectSlug: "vinhomes-grand-park",
        previousTier: 3,
        newTier: 4,
        timestamp: "2025-01-10T08:00:00Z",
      },
    },
    statusCode: 200,
    responseTimeMs: 145,
    attempts: 1,
    status: "delivered",
    createdAt: "2025-01-10T08:00:00Z",
    deliveredAt: "2025-01-10T08:00:01Z",
  },
  {
    id: "del-002",
    webhookId: "wh-002",
    event: "document.expired",
    payload: {
      type: "document.expired",
      data: {
        projectSlug: "vinhomes-grand-park",
        documentType: "env_impact",
        documentId: "doc-006",
        expiredAt: "2024-11-20T00:00:00Z",
      },
    },
    statusCode: 500,
    responseBody: "Internal Server Error",
    responseTimeMs: 2000,
    attempts: 3,
    status: "failed",
    createdAt: "2025-01-09T14:30:00Z",
  },
  {
    id: "del-003",
    webhookId: "wh-003",
    event: "project.verified",
    payload: {
      type: "project.verified",
      data: {
        projectSlug: "the-global-city",
        verificationTier: 3,
        verifiedAt: "2025-01-10T09:15:00Z",
      },
    },
    statusCode: 200,
    responseTimeMs: 89,
    attempts: 1,
    status: "delivered",
    createdAt: "2025-01-10T09:15:00Z",
    deliveredAt: "2025-01-10T09:15:01Z",
  },
];

// ============================================================================
// WEBHOOK EVENT DEFINITIONS
// ============================================================================

export const WEBHOOK_EVENT_DEFINITIONS: Record<WebhookEventType, { name: string; nameVi: string; description: string }> = {
  "attestation.created": {
    name: "Attestation Created",
    nameVi: "Attestation được tạo",
    description: "Triggered when a new attestation is created for a project",
  },
  "attestation.updated": {
    name: "Attestation Updated",
    nameVi: "Attestation được cập nhật",
    description: "Triggered when an existing attestation is updated",
  },
  "attestation.expired": {
    name: "Attestation Expired",
    nameVi: "Attestation hết hạn",
    description: "Triggered when an attestation expires",
  },
  "attestation.disputed": {
    name: "Attestation Disputed",
    nameVi: "Attestation bị tranh chấp",
    description: "Triggered when an attestation is marked as disputed",
  },
  "attestation.revoked": {
    name: "Attestation Revoked",
    nameVi: "Attestation bị thu hồi",
    description: "Triggered when an attestation is revoked",
  },
  "project.verified": {
    name: "Project Verified",
    nameVi: "Dự án được xác minh",
    description: "Triggered when a project passes verification",
  },
  "project.tier_changed": {
    name: "Project Tier Changed",
    nameVi: "Thay đổi Tier dự án",
    description: "Triggered when a project's verification tier changes",
  },
  "document.uploaded": {
    name: "Document Uploaded",
    nameVi: "Tài liệu được tải lên",
    description: "Triggered when a new document is uploaded",
  },
  "document.verified": {
    name: "Document Verified",
    nameVi: "Tài liệu được xác minh",
    description: "Triggered when a document passes verification",
  },
  "document.expired": {
    name: "Document Expired",
    nameVi: "Tài liệu hết hạn",
    description: "Triggered when a document expires",
  },
};

// ============================================================================
// PERMISSION DEFINITIONS
// ============================================================================

export const PERMISSION_DEFINITIONS: Record<ApiPermission, { name: string; description: string }> = {
  "read:projects": {
    name: "Read Projects",
    description: "Access project listings, details, and ratings",
  },
  "read:attestations": {
    name: "Read Attestations",
    description: "Access verification attestations and status",
  },
  "read:developers": {
    name: "Read Developers",
    description: "Access developer profiles and history",
  },
  "read:evidence": {
    name: "Read Evidence",
    description: "Access evidence packs and document metadata",
  },
  "write:attestations": {
    name: "Write Attestations",
    description: "Create and update attestations (requires authorization)",
  },
  "write:webhooks": {
    name: "Manage Webhooks",
    description: "Create, update, and delete webhook endpoints",
  },
  "admin:all": {
    name: "Admin Access",
    description: "Full administrative access to all resources",
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function validateApiKey(key: string): ApiKey | null {
  return MOCK_API_KEYS[key] || null;
}

export function getApiKeysByOrganization(organizationId: string): ApiKey[] {
  return MOCK_API_KEYS_LIST.filter((k) => k.organizationId === organizationId);
}

export function getWebhooksByOrganization(organizationId: string): Webhook[] {
  return MOCK_WEBHOOKS.filter((w) => w.organizationId === organizationId);
}

export function getWebhookDeliveries(webhookId: string): WebhookDelivery[] {
  return MOCK_WEBHOOK_DELIVERIES.filter((d) => d.webhookId === webhookId);
}

export function getApiUsageLogs(apiKeyId: string, limit = 100): ApiUsageLog[] {
  return MOCK_API_USAGE_LOGS
    .filter((l) => l.apiKeyId === apiKeyId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export function hasPermission(apiKey: ApiKey, permission: ApiPermission): boolean {
  if (apiKey.permissions.includes("admin:all")) return true;
  return apiKey.permissions.includes(permission);
}

export function generateApiKey(environment: "production" | "sandbox"): string {
  const prefix = environment === "production" ? "rlt_live_" : "rlt_test_";
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}${random}`;
}

export function maskApiKey(key: string): string {
  if (key.length < 12) return key;
  return `${key.substring(0, 12)}...${key.substring(key.length - 4)}`;
}

// Demo organization for unauthenticated users
export const DEMO_ORGANIZATION = {
  id: "org-001",
  name: "Demo Corp",
};
