// RealTeraAttestation Contract ABI and Address

export const REALTERA_ATTESTATION_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 5003;

// Token type constants (matching contract)
export const TOKEN_TYPES = {
  BADGE_BASIC: 1n,
  BADGE_STANDARD: 2n,
  BADGE_PREMIUM: 3n,
  PROPERTY_NFT_START: 1000n,
  SBT_DEVELOPER_START: 10000n,
} as const;

// Badge validity in days
export const BADGE_VALIDITY = {
  basic: 180n, // 6 months
  standard: 365n, // 12 months
  premium: 730n, // 24 months
} as const;

// Simplified ABI for the functions we need
export const REALTERA_ATTESTATION_ABI = [
  // Read functions
  {
    name: "verifications",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "slug", type: "string" },
      { name: "tier", type: "string" },
      { name: "score", type: "uint256" },
      { name: "timestamp", type: "uint256" },
      { name: "expiresAt", type: "uint256" },
      { name: "isActive", type: "bool" },
    ],
  },
  {
    name: "properties",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "projectSlug", type: "string" },
      { name: "projectName", type: "string" },
      { name: "district", type: "string" },
      { name: "tier", type: "string" },
      { name: "score", type: "uint256" },
      { name: "pricePerSqm", type: "uint256" },
      { name: "mintedAt", type: "uint256" },
    ],
  },
  {
    name: "projectSlugToTokenId",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "slug", type: "string" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "developerSlugToSbtId",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "slug", type: "string" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "isVerificationValid",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "getBadgesOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256[]" }],
  },
  {
    name: "getPropertyNFTsOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256[]" }],
  },
  {
    name: "isSoulbound",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "getCurrentPropertyTokenId",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "getCurrentSbtTokenId",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  // Write functions
  {
    name: "mintVerificationBadge",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "badgeType", type: "uint256" },
      { name: "projectSlug", type: "string" },
      { name: "tier", type: "string" },
      { name: "score", type: "uint256" },
      { name: "validityDays", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "mintPropertyNFT",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "projectSlug", type: "string" },
      { name: "projectName", type: "string" },
      { name: "district", type: "string" },
      { name: "tier", type: "string" },
      { name: "score", type: "uint256" },
      { name: "pricePerSqm", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "mintDeveloperSBT",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "developerSlug", type: "string" },
      { name: "tier", type: "string" },
      { name: "score", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  // Events
  {
    name: "VerificationBadgeMinted",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "recipient", type: "address", indexed: true },
      { name: "projectSlug", type: "string", indexed: false },
      { name: "tier", type: "string", indexed: false },
      { name: "score", type: "uint256", indexed: false },
      { name: "expiresAt", type: "uint256", indexed: false },
    ],
  },
  {
    name: "PropertyNFTMinted",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "recipient", type: "address", indexed: true },
      { name: "projectSlug", type: "string", indexed: false },
      { name: "projectName", type: "string", indexed: false },
      { name: "tier", type: "string", indexed: false },
      { name: "score", type: "uint256", indexed: false },
    ],
  },
  {
    name: "DeveloperSBTMinted",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "developer", type: "address", indexed: true },
      { name: "developerSlug", type: "string", indexed: false },
      { name: "tier", type: "string", indexed: false },
      { name: "score", type: "uint256", indexed: false },
    ],
  },
] as const;
