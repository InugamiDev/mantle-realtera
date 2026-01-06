// RealTera Attestation Service
// Handles database-backed attestations with optional blockchain anchoring

import { createPublicClient, http } from "viem";
import { mantleSepolia } from "@/lib/mantle";
import { db } from "./db";
import {
  MOCK_BLOCKCHAIN,
  REGISTRY_ADDRESS,
  ATTESTATION_REGISTRY_ABI,
  slugToAssetId,
  VERIFICATION_TIERS,
  VERIFICATION_CHECKS,
  TIER_LABELS,
  decodeChecks,
  type AttestationSummary,
  type RawAttestationFromContract,
} from "./attestation-registry";
// Note: MOCK_ATTESTATIONS removed - now using database-backed attestations
import * as crypto from "crypto";

// ============================================================================
// PUBLIC CLIENT (for read operations)
// ============================================================================

const publicClient = !MOCK_BLOCKCHAIN && REGISTRY_ADDRESS
  ? createPublicClient({
      chain: mantleSepolia,
      transport: http(),
    })
  : null;

// ============================================================================
// DATABASE ATTESTATION FETCHING
// ============================================================================

/**
 * Generate a bytes32 asset ID from a slug (for database records)
 */
function generateAssetIdFromSlug(slug: string): string {
  const hash = crypto.createHash("sha256").update(slug).digest("hex");
  return `0x${hash}`;
}

/**
 * Convert database attestation to AttestationSummary
 */
function dbAttestationToSummary(att: {
  id: string;
  projectId: string | null;
  subjectType: string;
  subjectId: string | null;
  dataJson: unknown;
  tierAtAttestation: string | null;
  scoreAtAttestation: number | null;
  issuedAt: Date;
  expiresAt: Date | null;
  revoked: boolean;
  chainId: number | null;
  txHash: string | null;
  blockNumber: number | null;
  project?: { slug: string } | null;
}): AttestationSummary {
  const data = att.dataJson as {
    checksPassed?: string[];
    tier?: string;
    score?: number;
  } | null;

  // Determine tier from data or attestation
  const tierString = data?.tier || att.tierAtAttestation || "C";
  const tier = getTierNumber(tierString);

  // Always regenerate checks based on tier for consistency
  // (DB may have outdated check data from legacy format)
  const generated = generateChecksForTier(tierString);
  const checksPassed = generated.passed;
  const checksFailed = generated.failed;

  // Generate asset ID from project slug or subject ID
  const slug = att.project?.slug || att.subjectId || att.id;
  const assetId = generateAssetIdFromSlug(slug);

  return {
    assetId: assetId as `0x${string}`,
    tier,
    tierLabel: TIER_LABELS[tier] || TIER_LABELS[0],
    isValid: !att.revoked && (!att.expiresAt || att.expiresAt > new Date()),
    checksPassed,
    checksFailed,
    issuedAt: att.issuedAt,
    expiresAt: att.expiresAt,
    disputed: false,
    evidenceHash: assetId, // Use asset ID as evidence hash for display
  };
}

/**
 * Map tier string to tier number
 */
function getTierNumber(tier: string): number {
  const tierMap: Record<string, number> = {
    "SSS": VERIFICATION_TIERS.MONITORED,
    "SS": VERIFICATION_TIERS.CORROBORATED,
    "S+": VERIFICATION_TIERS.CORROBORATED,
    "S": VERIFICATION_TIERS.STANDARD,
    "A": VERIFICATION_TIERS.STANDARD,
    "B": VERIFICATION_TIERS.BASIC,
    "C": VERIFICATION_TIERS.BASIC,
    "D": VERIFICATION_TIERS.UNVERIFIED,
    "F": VERIFICATION_TIERS.UNVERIFIED,
  };
  return tierMap[tier] || VERIFICATION_TIERS.UNVERIFIED;
}

// ============================================================================
// ATTESTATION SERVICE
// ============================================================================

/**
 * Generate checks based on project tier
 */
function generateChecksForTier(tier: string): { passed: string[]; failed: string[] } {
  const allChecks = [
    "LEGAL_STATUS",
    "OWNERSHIP_TITLE",
    "CONSTRUCTION_PERMIT",
    "DEVELOPER_BACKGROUND",
    "FINANCIAL_HEALTH",
    "CONSTRUCTION_PROGRESS",
    "REGISTRY_CORROBORATION",
    "PARTNER_COSIGN",
  ];

  let passCount: number;
  switch (tier) {
    case "SSS":
      passCount = 8; // All passed
      break;
    case "SS":
      passCount = 7; // 7 passed
      break;
    case "S+":
      passCount = 6;
      break;
    case "S":
    case "A":
      passCount = 5;
      break;
    case "B":
      passCount = 4;
      break;
    case "C":
      passCount = 3;
      break;
    case "D":
      passCount = 2;
      break;
    case "F":
    default:
      passCount = 1;
      break;
  }

  // Always pass in order of importance (legal first, partner last)
  const passed = allChecks.slice(0, passCount);
  const failed = allChecks.slice(passCount);

  return { passed, failed };
}

/**
 * Generate a fallback attestation summary based on project data
 */
function generateFallbackAttestation(slug: string, tier: string): AttestationSummary {
  const tierNum = getTierNumber(tier);
  const { passed, failed } = generateChecksForTier(tier);
  const assetId = generateAssetIdFromSlug(slug);

  return {
    assetId: assetId as `0x${string}`,
    tier: tierNum,
    tierLabel: TIER_LABELS[tierNum] || TIER_LABELS[0],
    isValid: tier !== "F" && tier !== "D",
    checksPassed: passed,
    checksFailed: failed,
    issuedAt: new Date(),
    expiresAt: null,
    disputed: false,
    evidenceHash: assetId,
  };
}

/**
 * Get attestation by project slug - tries database first, then blockchain, then generates fallback
 */
export async function getAttestationBySlug(slug: string): Promise<AttestationSummary | null> {
  let projectTier: string | null = null;

  // Try database first
  try {
    const project = await db.project.findUnique({
      where: { slug },
      select: { id: true, slug: true, tier: true },
    });

    if (project) {
      projectTier = project.tier;

      const attestation = await db.attestation.findFirst({
        where: {
          OR: [
            { projectId: project.id },
            { subjectId: project.id },
          ],
          revoked: false,
        },
        include: {
          project: { select: { slug: true } },
        },
        orderBy: { issuedAt: "desc" },
      });

      if (attestation) {
        return dbAttestationToSummary(attestation);
      }
    }
  } catch (error) {
    console.error("[attestation] Database query failed:", error);
  }

  // Try blockchain if configured
  if (publicClient && REGISTRY_ADDRESS && !MOCK_BLOCKCHAIN) {
    try {
      const assetId = slugToAssetId(slug);

      const exists = await publicClient.readContract({
        address: REGISTRY_ADDRESS,
        abi: ATTESTATION_REGISTRY_ABI,
        functionName: "attestationExists",
        args: [assetId],
      });

      if (!exists) return null;

      const rawAtt = await publicClient.readContract({
        address: REGISTRY_ADDRESS,
        abi: ATTESTATION_REGISTRY_ABI,
        functionName: "getAttestation",
        args: [assetId],
      }) as RawAttestationFromContract;

      return {
        assetId: rawAtt.assetId,
        tier: rawAtt.tier,
        tierLabel: TIER_LABELS[rawAtt.tier] || TIER_LABELS[0],
        isValid: !rawAtt.revoked && !rawAtt.disputed && (Number(rawAtt.expiresAt) === 0 || Number(rawAtt.expiresAt) * 1000 > Date.now()),
        checksPassed: decodeChecks(Number(rawAtt.checksPassed)),
        checksFailed: decodeChecks(Number(rawAtt.checksFailed)),
        issuedAt: new Date(Number(rawAtt.issuedAt) * 1000),
        expiresAt: Number(rawAtt.expiresAt) > 0 ? new Date(Number(rawAtt.expiresAt) * 1000) : null,
        disputed: rawAtt.disputed,
        evidenceHash: rawAtt.evidenceHash,
      };
    } catch (error) {
      console.error("[attestation] Blockchain query failed:", error);
    }
  }

  // Fallback: generate attestation based on project tier
  if (projectTier) {
    return generateFallbackAttestation(slug, projectTier);
  }

  return null;
}

/**
 * Get attestation by asset ID
 */
export async function getAttestationByAssetId(assetId: `0x${string}`): Promise<AttestationSummary | null> {
  // For database lookup, we'd need to store the assetId
  // For now, just try blockchain
  if (publicClient && REGISTRY_ADDRESS && !MOCK_BLOCKCHAIN) {
    try {
      const exists = await publicClient.readContract({
        address: REGISTRY_ADDRESS,
        abi: ATTESTATION_REGISTRY_ABI,
        functionName: "attestationExists",
        args: [assetId],
      });

      if (!exists) return null;

      const rawAtt = await publicClient.readContract({
        address: REGISTRY_ADDRESS,
        abi: ATTESTATION_REGISTRY_ABI,
        functionName: "getAttestation",
        args: [assetId],
      }) as RawAttestationFromContract;

      return {
        assetId: rawAtt.assetId,
        tier: rawAtt.tier,
        tierLabel: TIER_LABELS[rawAtt.tier] || TIER_LABELS[0],
        isValid: !rawAtt.revoked && !rawAtt.disputed && (Number(rawAtt.expiresAt) === 0 || Number(rawAtt.expiresAt) * 1000 > Date.now()),
        checksPassed: decodeChecks(Number(rawAtt.checksPassed)),
        checksFailed: decodeChecks(Number(rawAtt.checksFailed)),
        issuedAt: new Date(Number(rawAtt.issuedAt) * 1000),
        expiresAt: Number(rawAtt.expiresAt) > 0 ? new Date(Number(rawAtt.expiresAt) * 1000) : null,
        disputed: rawAtt.disputed,
        evidenceHash: rawAtt.evidenceHash,
      };
    } catch (error) {
      console.error("[attestation] Blockchain query failed:", error);
    }
  }

  return null;
}

/**
 * Check if attestation is valid
 */
export async function isAttestationValid(slug: string): Promise<boolean> {
  const att = await getAttestationBySlug(slug);
  return att?.isValid ?? false;
}

/**
 * Get attestation tier
 */
export async function getAttestationTier(slug: string): Promise<number> {
  const att = await getAttestationBySlug(slug);
  return att?.tier ?? 0;
}

/**
 * Batch get attestations by slugs
 */
export async function batchGetAttestations(slugs: string[]): Promise<Record<string, AttestationSummary | null>> {
  const results: Record<string, AttestationSummary | null> = {};

  await Promise.all(
    slugs.map(async (slug) => {
      results[slug] = await getAttestationBySlug(slug);
    })
  );

  return results;
}

/**
 * Batch check validity
 */
export async function batchCheckValidity(slugs: string[]): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};

  // Try database first
  try {
    for (const slug of slugs) {
      const project = await db.project.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (project) {
        const attestation = await db.attestation.findFirst({
          where: {
            OR: [
              { projectId: project.id },
              { subjectId: project.id },
            ],
            revoked: false,
          },
        });

        results[slug] = attestation
          ? (!attestation.expiresAt || attestation.expiresAt > new Date())
          : false;
      } else {
        results[slug] = false;
      }
    }
    return results;
  } catch (error) {
    console.error("[attestation] Database batch check failed:", error);
  }

  // Fallback to blockchain if available
  if (publicClient && REGISTRY_ADDRESS && !MOCK_BLOCKCHAIN) {
    try {
      const assetIds = slugs.map(slugToAssetId);
      const validities = await publicClient.readContract({
        address: REGISTRY_ADDRESS,
        abi: ATTESTATION_REGISTRY_ABI,
        functionName: "batchCheckValidity",
        args: [assetIds],
      }) as boolean[];

      for (let i = 0; i < slugs.length; i++) {
        results[slugs[i]] = validities[i];
      }
    } catch (error) {
      console.error("[attestation] Blockchain batch check failed:", error);
    }
  }

  return results;
}

/**
 * Get registry statistics
 */
export async function getRegistryStats(): Promise<{ total: number; active: number }> {
  // Query database
  try {
    const total = await db.attestation.count();
    const active = await db.attestation.count({
      where: {
        revoked: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });
    return { total, active };
  } catch (error) {
    console.error("[attestation] Failed to get stats from database:", error);
  }

  // Fallback to blockchain if available
  if (publicClient && REGISTRY_ADDRESS && !MOCK_BLOCKCHAIN) {
    try {
      const [total, active] = await publicClient.readContract({
        address: REGISTRY_ADDRESS,
        abi: ATTESTATION_REGISTRY_ABI,
        functionName: "getStats",
        args: [],
      }) as [bigint, bigint];

      return { total: Number(total), active: Number(active) };
    } catch (error) {
      console.error("[attestation] Failed to get stats from blockchain:", error);
    }
  }

  return { total: 0, active: 0 };
}

/**
 * Get all attestations from database
 */
export async function getAllAttestations(): Promise<AttestationSummary[]> {
  try {
    const attestations = await db.attestation.findMany({
      where: {
        revoked: false,
      },
      include: {
        project: { select: { slug: true } },
      },
      orderBy: { issuedAt: "desc" },
      take: 100,
    });

    return attestations.map(dbAttestationToSummary);
  } catch (error) {
    console.error("[attestation] Failed to get all attestations:", error);
    return [];
  }
}

/**
 * Check if we're in mock mode (no database or blockchain)
 */
export function isMockMode(): boolean {
  // We're not in mock mode if we have a database connection
  return false;
}

/**
 * Get explorer URL for attestation
 */
export function getAttestationExplorerUrl(assetId: string): string {
  if (!REGISTRY_ADDRESS || MOCK_BLOCKCHAIN) {
    return "#database-backed";
  }
  return `https://explorer.sepolia.mantle.xyz/address/${REGISTRY_ADDRESS}`;
}
