// RealTera Attestation Registry - Contract Configuration & Mock Mode
// This is the new attestation-first architecture (NOT NFT-based)

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

export const MOCK_BLOCKCHAIN = process.env.NEXT_PUBLIC_MOCK_BLOCKCHAIN === "true";
export const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS as `0x${string}`;
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 5003;

// ============================================================================
// VERIFICATION TIERS
// ============================================================================

export const VERIFICATION_TIERS = {
  UNVERIFIED: 0,
  BASIC: 1,           // Basic document check
  STANDARD: 2,        // Document consistency checks
  CORROBORATED: 3,    // Registry corroboration / partner co-sign
  MONITORED: 4,       // Active monitoring with updates
} as const;

export const TIER_LABELS: Record<number, { vi: string; en: string; color: string }> = {
  0: { vi: "Chưa xác minh", en: "Unverified", color: "gray" },
  1: { vi: "Cơ bản", en: "Basic", color: "blue" },
  2: { vi: "Tiêu chuẩn", en: "Standard", color: "green" },
  3: { vi: "Xác nhận", en: "Corroborated", color: "amber" },
  4: { vi: "Giám sát", en: "Monitored", color: "emerald" },
};

// ============================================================================
// VERIFICATION CHECKS (bitmask values)
// ============================================================================

export const VERIFICATION_CHECKS = {
  LEGAL_STATUS: 1 << 0,
  OWNERSHIP_TITLE: 1 << 1,
  CONSTRUCTION_PERMIT: 1 << 2,
  DEVELOPER_BACKGROUND: 1 << 3,
  FINANCIAL_HEALTH: 1 << 4,
  CONSTRUCTION_PROGRESS: 1 << 5,
  REGISTRY_CORROBORATION: 1 << 6,
  PARTNER_COSIGN: 1 << 7,
} as const;

export const CHECK_LABELS: Record<number, { vi: string; en: string; icon: string }> = {
  [VERIFICATION_CHECKS.LEGAL_STATUS]: {
    vi: "Pháp lý",
    en: "Legal Status",
    icon: "Scale",
  },
  [VERIFICATION_CHECKS.OWNERSHIP_TITLE]: {
    vi: "Quyền sở hữu",
    en: "Ownership Title",
    icon: "FileText",
  },
  [VERIFICATION_CHECKS.CONSTRUCTION_PERMIT]: {
    vi: "Giấy phép xây dựng",
    en: "Construction Permit",
    icon: "Building",
  },
  [VERIFICATION_CHECKS.DEVELOPER_BACKGROUND]: {
    vi: "Chủ đầu tư",
    en: "Developer Background",
    icon: "Users",
  },
  [VERIFICATION_CHECKS.FINANCIAL_HEALTH]: {
    vi: "Tài chính",
    en: "Financial Health",
    icon: "TrendingUp",
  },
  [VERIFICATION_CHECKS.CONSTRUCTION_PROGRESS]: {
    vi: "Tiến độ",
    en: "Construction Progress",
    icon: "HardHat",
  },
  [VERIFICATION_CHECKS.REGISTRY_CORROBORATION]: {
    vi: "Đối chiếu sổ đỏ",
    en: "Registry Corroboration",
    icon: "CheckCircle2",
  },
  [VERIFICATION_CHECKS.PARTNER_COSIGN]: {
    vi: "Đối tác xác nhận",
    en: "Partner Co-sign",
    icon: "Shield",
  },
};

// ============================================================================
// ATTESTATION TYPES
// ============================================================================

export interface Attestation {
  assetId: string;           // bytes32 as hex string
  tier: number;
  checksPassed: number;      // bitmask
  checksFailed: number;      // bitmask
  evidenceHash: string;      // bytes32 as hex string
  encryptedCid: string;      // IPFS CID (optional)
  issuedAt: number;          // Unix timestamp
  expiresAt: number;         // Unix timestamp (0 = never)
  signer: string;            // address
  coSigner: string;          // address (0x0 if none)
  disputed: boolean;
  revoked: boolean;
  revokeReason: string;
}

export interface DisputeRecord {
  assetId: string;
  disputant: string;
  reason: string;
  raisedAt: number;
  resolvedAt: number;
  upheld: boolean;
  resolution: string;
}

export interface AttestationSummary {
  assetId: string;
  tier: number;
  tierLabel: { vi: string; en: string };
  isValid: boolean;
  checksPassed: string[];    // Human-readable check names
  checksFailed: string[];
  issuedAt: Date;
  expiresAt: Date | null;
  disputed: boolean;
  evidenceHash: string;
}

/**
 * Raw attestation data as returned from the smart contract via viem
 * Solidity types map to: bytes32 -> hex string, uint8 -> number, uint256 -> bigint, address -> hex string
 */
export interface RawAttestationFromContract {
  assetId: `0x${string}`;
  tier: number;  // uint8 is returned as number, not bigint
  checksPassed: bigint;
  checksFailed: bigint;
  evidenceHash: `0x${string}`;
  encryptedCid: string;
  issuedAt: bigint;
  expiresAt: bigint;
  signer: `0x${string}`;
  coSigner: `0x${string}`;
  disputed: boolean;
  revoked: boolean;
  revokeReason: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert project slug to bytes32 asset ID
 */
export function slugToAssetId(slug: string): `0x${string}` {
  // Simple hash - in production use keccak256
  const encoder = new TextEncoder();
  const data = encoder.encode(slug);
  let hash = 0n;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 8n) | BigInt(data[i]);
    if (hash > 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn) {
      hash = hash & 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn;
    }
  }
  return `0x${hash.toString(16).padStart(64, "0")}`;
}

/**
 * Decode checks bitmask to array of check names
 */
export function decodeChecks(bitmask: number): string[] {
  const checks: string[] = [];
  for (const [name, value] of Object.entries(VERIFICATION_CHECKS)) {
    if (bitmask & value) {
      checks.push(name);
    }
  }
  return checks;
}

/**
 * Encode array of check names to bitmask
 */
export function encodeChecks(checks: string[]): number {
  let bitmask = 0;
  for (const check of checks) {
    const value = VERIFICATION_CHECKS[check as keyof typeof VERIFICATION_CHECKS];
    if (value) bitmask |= value;
  }
  return bitmask;
}

/**
 * Convert raw attestation to summary
 */
export function toAttestationSummary(att: Attestation): AttestationSummary {
  return {
    assetId: att.assetId,
    tier: att.tier,
    tierLabel: TIER_LABELS[att.tier] || TIER_LABELS[0],
    isValid: !att.revoked && !att.disputed && (att.expiresAt === 0 || att.expiresAt * 1000 > Date.now()),
    checksPassed: decodeChecks(att.checksPassed),
    checksFailed: decodeChecks(att.checksFailed),
    issuedAt: new Date(att.issuedAt * 1000),
    expiresAt: att.expiresAt > 0 ? new Date(att.expiresAt * 1000) : null,
    disputed: att.disputed,
    evidenceHash: att.evidenceHash,
  };
}

// ============================================================================
// MOCK DATA (for demo without real blockchain)
// ============================================================================

export const MOCK_ATTESTATIONS: Record<string, Attestation> = {
  // Vinhomes Grand Park
  "vinhomes-grand-park": {
    assetId: slugToAssetId("vinhomes-grand-park"),
    tier: VERIFICATION_TIERS.MONITORED,
    checksPassed: VERIFICATION_CHECKS.LEGAL_STATUS |
                  VERIFICATION_CHECKS.OWNERSHIP_TITLE |
                  VERIFICATION_CHECKS.CONSTRUCTION_PERMIT |
                  VERIFICATION_CHECKS.DEVELOPER_BACKGROUND |
                  VERIFICATION_CHECKS.FINANCIAL_HEALTH |
                  VERIFICATION_CHECKS.CONSTRUCTION_PROGRESS |
                  VERIFICATION_CHECKS.REGISTRY_CORROBORATION,
    checksFailed: 0,
    evidenceHash: "0x8f4d2a7e9b1c3f5d6e8a0b2c4d6f8e0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e",
    encryptedCid: "QmX7bVbZAKcGKRTqnVmGmupmxMqR1ySrh8SQKPmfT5TPSY",
    issuedAt: Math.floor(Date.now() / 1000) - 86400 * 30, // 30 days ago
    expiresAt: Math.floor(Date.now() / 1000) + 86400 * 335, // 335 days from now
    signer: "0x1234567890123456789012345678901234567890",
    coSigner: "0x0000000000000000000000000000000000000000",
    disputed: false,
    revoked: false,
    revokeReason: "",
  },
  // Masteri Thao Dien
  "masteri-thao-dien": {
    assetId: slugToAssetId("masteri-thao-dien"),
    tier: VERIFICATION_TIERS.CORROBORATED,
    checksPassed: VERIFICATION_CHECKS.LEGAL_STATUS |
                  VERIFICATION_CHECKS.OWNERSHIP_TITLE |
                  VERIFICATION_CHECKS.DEVELOPER_BACKGROUND |
                  VERIFICATION_CHECKS.CONSTRUCTION_PROGRESS |
                  VERIFICATION_CHECKS.PARTNER_COSIGN,
    checksFailed: VERIFICATION_CHECKS.FINANCIAL_HEALTH,
    evidenceHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    encryptedCid: "QmYp8bVbZAKcGKRTqnVmGmupmxMqR1ySrh8SQKPmfT5TPZ",
    issuedAt: Math.floor(Date.now() / 1000) - 86400 * 60, // 60 days ago
    expiresAt: Math.floor(Date.now() / 1000) + 86400 * 305, // 305 days from now
    signer: "0x1234567890123456789012345678901234567890",
    coSigner: "0xabcdef1234567890abcdef1234567890abcdef12", // Has co-signer
    disputed: false,
    revoked: false,
    revokeReason: "",
  },
  // Example disputed project
  "du-an-tranh-chap": {
    assetId: slugToAssetId("du-an-tranh-chap"),
    tier: VERIFICATION_TIERS.STANDARD,
    checksPassed: VERIFICATION_CHECKS.LEGAL_STATUS |
                  VERIFICATION_CHECKS.CONSTRUCTION_PERMIT,
    checksFailed: VERIFICATION_CHECKS.OWNERSHIP_TITLE,
    evidenceHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    encryptedCid: "",
    issuedAt: Math.floor(Date.now() / 1000) - 86400 * 90, // 90 days ago
    expiresAt: Math.floor(Date.now() / 1000) + 86400 * 275, // 275 days from now
    signer: "0x1234567890123456789012345678901234567890",
    coSigner: "0x0000000000000000000000000000000000000000",
    disputed: true, // Under dispute
    revoked: false,
    revokeReason: "",
  },
};

// ============================================================================
// ATTESTATION REGISTRY ABI (for the new contract)
// ============================================================================

export const ATTESTATION_REGISTRY_ABI = [
  // Read functions
  {
    name: "getAttestation",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "assetId", type: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "assetId", type: "bytes32" },
          { name: "tier", type: "uint8" },
          { name: "checksPassed", type: "uint256" },
          { name: "checksFailed", type: "uint256" },
          { name: "evidenceHash", type: "bytes32" },
          { name: "encryptedCid", type: "string" },
          { name: "issuedAt", type: "uint256" },
          { name: "expiresAt", type: "uint256" },
          { name: "signer", type: "address" },
          { name: "coSigner", type: "address" },
          { name: "disputed", type: "bool" },
          { name: "revoked", type: "bool" },
          { name: "revokeReason", type: "string" },
        ],
      },
    ],
  },
  {
    name: "isAttestationValid",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "assetId", type: "bytes32" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "getAttestationTier",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "assetId", type: "bytes32" }],
    outputs: [{ type: "uint8" }],
  },
  {
    name: "attestationExists",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "assetId", type: "bytes32" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "getStats",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "total", type: "uint256" },
      { name: "active", type: "uint256" },
    ],
  },
  {
    name: "batchCheckValidity",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "assetIds", type: "bytes32[]" }],
    outputs: [{ type: "bool[]" }],
  },
  {
    name: "batchGetTiers",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "assetIds", type: "bytes32[]" }],
    outputs: [{ type: "uint8[]" }],
  },
  // Write functions
  {
    name: "issueAttestation",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "assetId", type: "bytes32" },
      { name: "tier", type: "uint8" },
      { name: "checksPassed", type: "uint256" },
      { name: "checksFailed", type: "uint256" },
      { name: "evidenceHash", type: "bytes32" },
      { name: "encryptedCid", type: "string" },
      { name: "validityDays", type: "uint256" },
      { name: "coSigner", type: "address" },
    ],
    outputs: [],
  },
  {
    name: "updateAttestation",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "assetId", type: "bytes32" },
      { name: "newTier", type: "uint8" },
      { name: "newChecksPassed", type: "uint256" },
      { name: "newChecksFailed", type: "uint256" },
      { name: "newEvidenceHash", type: "bytes32" },
      { name: "newEncryptedCid", type: "string" },
      { name: "newValidityDays", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "revokeAttestation",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "assetId", type: "bytes32" },
      { name: "reason", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "raiseDispute",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "assetId", type: "bytes32" },
      { name: "reason", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "resolveDispute",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "assetId", type: "bytes32" },
      { name: "upheld", type: "bool" },
      { name: "resolution", type: "string" },
    ],
    outputs: [],
  },
  // Events
  {
    name: "AttestationIssued",
    type: "event",
    inputs: [
      { name: "assetId", type: "bytes32", indexed: true },
      { name: "tier", type: "uint8", indexed: false },
      { name: "checksPassed", type: "uint256", indexed: false },
      { name: "evidenceHash", type: "bytes32", indexed: false },
      { name: "expiresAt", type: "uint256", indexed: false },
      { name: "signer", type: "address", indexed: true },
      { name: "coSigner", type: "address", indexed: true },
    ],
  },
  {
    name: "AttestationUpdated",
    type: "event",
    inputs: [
      { name: "assetId", type: "bytes32", indexed: true },
      { name: "oldTier", type: "uint8", indexed: false },
      { name: "newTier", type: "uint8", indexed: false },
      { name: "newChecksPassed", type: "uint256", indexed: false },
      { name: "newEvidenceHash", type: "bytes32", indexed: false },
      { name: "newExpiresAt", type: "uint256", indexed: false },
    ],
  },
  {
    name: "DisputeRaised",
    type: "event",
    inputs: [
      { name: "assetId", type: "bytes32", indexed: true },
      { name: "disputant", type: "address", indexed: true },
      { name: "reason", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    name: "DisputeResolved",
    type: "event",
    inputs: [
      { name: "assetId", type: "bytes32", indexed: true },
      { name: "upheld", type: "bool", indexed: false },
      { name: "resolution", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    name: "AttestationRevoked",
    type: "event",
    inputs: [
      { name: "assetId", type: "bytes32", indexed: true },
      { name: "reason", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;
