/**
 * Seed Script for Real Vietnamese Real Estate Data
 *
 * Seeds:
 * - 25 real developers across all tiers
 * - 100 real projects across Vietnamese cities
 * - Attestations for verified projects
 *
 * Run with: npx tsx prisma/seed-projects.ts
 */

import { PrismaClient } from "../src/generated/prisma";
import { DEVELOPERS, DeveloperSeed } from "./data/developers";
import { PROJECTS, ProjectSeed } from "./data/projects";
import {
  getPlaceholderLogo,
  getPlaceholderProjectImage,
} from "../scripts/upload-images-pinata";
import * as crypto from "crypto";

const prisma = new PrismaClient();

/**
 * Generate a bytes32 asset ID from a slug
 */
function generateAssetId(slug: string): string {
  const hash = crypto.createHash("sha256").update(slug).digest("hex");
  return `0x${hash}`;
}

/**
 * Generate a pseudo block number from a date
 */
function generatePseudoBlockNumber(date: Date): number {
  // Mantle averages ~2 second blocks, starting from a base
  const baseBlock = 50000000; // Base block number
  const genesisTime = new Date("2024-01-01").getTime();
  const secondsSinceGenesis = (date.getTime() - genesisTime) / 1000;
  return Math.floor(baseBlock + secondsSinceGenesis / 2);
}

/**
 * Generate a pseudo transaction hash
 */
function generatePseudoTxHash(assetId: string): string {
  const hash = crypto
    .createHash("sha256")
    .update(`tx-${assetId}`)
    .digest("hex");
  return `0x${hash}`;
}

/**
 * Seed all developers
 */
async function seedDevelopers(): Promise<Map<string, string>> {
  console.log("\n📊 Seeding developers...");
  const developerIdMap = new Map<string, string>();

  for (const dev of DEVELOPERS) {
    console.log(`  → ${dev.name} (${dev.tier})`);

    // Use placeholder logo for now (can be replaced with IPFS upload later)
    const logoUrl = getPlaceholderLogo(dev.name);

    const developer = await prisma.developer.upsert({
      where: { slug: dev.slug },
      update: {
        name: dev.name,
        nameEn: dev.nameEn,
        tier: dev.tier,
        foundedYear: dev.foundedYear,
        headquarters: dev.headquarters,
        website: dev.website,
        stockCode: dev.stockCode,
        logoUrl,
        description: dev.description,
        financialHealthScore: dev.financialHealthScore,
        deliveryTrackRecord: dev.deliveryTrackRecord,
        legalComplianceScore: dev.legalComplianceScore,
        customerSatisfactionScore: dev.customerSatisfactionScore,
        overallScore: dev.overallScore,
      },
      create: {
        slug: dev.slug,
        name: dev.name,
        nameEn: dev.nameEn,
        tier: dev.tier,
        foundedYear: dev.foundedYear,
        headquarters: dev.headquarters,
        website: dev.website,
        stockCode: dev.stockCode,
        logoUrl,
        description: dev.description,
        financialHealthScore: dev.financialHealthScore,
        deliveryTrackRecord: dev.deliveryTrackRecord,
        legalComplianceScore: dev.legalComplianceScore,
        customerSatisfactionScore: dev.customerSatisfactionScore,
        overallScore: dev.overallScore,
        projectCount: 0,
      },
    });

    developerIdMap.set(dev.slug, developer.id);
  }

  console.log(`  ✅ Seeded ${DEVELOPERS.length} developers`);
  return developerIdMap;
}

/**
 * Seed all projects
 */
async function seedProjects(
  developerIdMap: Map<string, string>
): Promise<void> {
  console.log("\n🏗️ Seeding projects...");

  // Count projects per developer for updating projectCount
  const projectCountMap = new Map<string, number>();

  for (const project of PROJECTS) {
    const developerId = developerIdMap.get(project.developerSlug);

    if (!developerId) {
      console.warn(`  ⚠️ Developer not found for: ${project.name}`);
      continue;
    }

    console.log(`  → ${project.name} (${project.city})`);

    // Use placeholder image for now
    const imageUrl = getPlaceholderProjectImage(project.slug);

    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        name: project.name,
        nameEn: project.nameEn,
        developerId,
        tier: project.tier,
        score: project.score,
        verificationStatus: project.verificationStatus,
        district: project.district,
        city: project.city,
        latitude: project.latitude,
        longitude: project.longitude,
        verdict: project.verdict,
        roiLabel: project.roiLabel,
        sourceCount: project.sourceCount,
        imageUrl,
      },
      create: {
        slug: project.slug,
        name: project.name,
        nameEn: project.nameEn,
        developerId,
        tier: project.tier,
        score: project.score,
        verificationStatus: project.verificationStatus,
        district: project.district,
        city: project.city,
        latitude: project.latitude,
        longitude: project.longitude,
        verdict: project.verdict,
        roiLabel: project.roiLabel,
        sourceCount: project.sourceCount,
        imageUrl,
      },
    });

    // Track project count
    const currentCount = projectCountMap.get(project.developerSlug) || 0;
    projectCountMap.set(project.developerSlug, currentCount + 1);
  }

  // Update project counts for developers
  for (const [slug, count] of projectCountMap) {
    await prisma.developer.update({
      where: { slug },
      data: { projectCount: count },
    });
  }

  console.log(`  ✅ Seeded ${PROJECTS.length} projects`);
}

/**
 * Create attestations for verified projects
 */
async function seedAttestations(): Promise<void> {
  console.log("\n🔐 Creating attestations for verified projects...");

  // Get all verified projects
  const verifiedProjects = await prisma.project.findMany({
    where: {
      verificationStatus: "Verified",
    },
    include: {
      developer: true,
    },
  });

  console.log(`  Found ${verifiedProjects.length} verified projects`);

  for (const project of verifiedProjects) {
    const assetId = generateAssetId(project.slug);
    const issuedAt = new Date(
      Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000
    ); // Random date in last 180 days
    const expiresAt = new Date(issuedAt.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from issue
    const blockNumber = generatePseudoBlockNumber(issuedAt);
    const txHash = generatePseudoTxHash(assetId);

    // Determine checks passed based on tier
    const checksMap: Record<string, string[]> = {
      SSS: ["legal", "developer", "financial", "construction", "documentation"],
      SS: ["legal", "developer", "financial", "construction"],
      S: ["legal", "developer", "financial"],
      A: ["legal", "developer"],
      B: ["legal"],
      C: [],
      D: [],
      F: [],
    };

    const checksPassed = checksMap[project.tier] || [];

    console.log(`  → ${project.name} (${checksPassed.length} checks)`);

    await prisma.attestation.upsert({
      where: {
        id: `attest-${project.slug}`,
      },
      update: {
        dataJson: {
          projectSlug: project.slug,
          projectName: project.name,
          developerName: project.developer.name,
          tier: project.tier,
          score: project.score,
          checksPassed,
          verifiedAt: issuedAt.toISOString(),
        },
        tierAtAttestation: project.tier,
        scoreAtAttestation: project.score,
        issuedAt,
        expiresAt,
        chainId: 5003, // Mantle Sepolia
        blockNumber,
        txHash,
        anchoredAt: issuedAt,
      },
      create: {
        id: `attest-${project.slug}`,
        subjectType: "project",
        subjectId: project.id,
        projectId: project.id,
        attestationType: "project_verified",
        dataJson: {
          projectSlug: project.slug,
          projectName: project.name,
          developerName: project.developer.name,
          tier: project.tier,
          score: project.score,
          checksPassed,
          verifiedAt: issuedAt.toISOString(),
        },
        tierAtAttestation: project.tier,
        scoreAtAttestation: project.score,
        issuedAt,
        expiresAt,
        chainId: 5003, // Mantle Sepolia
        blockNumber,
        txHash,
        anchoredAt: issuedAt,
        signatureType: "database", // Database-backed, displayed as blockchain
      },
    });
  }

  console.log(`  ✅ Created ${verifiedProjects.length} attestations`);
}

/**
 * Main seed function
 */
async function main(): Promise<void> {
  console.log("🌱 Starting RealTera seed...\n");
  console.log("=" + "=".repeat(49));

  try {
    // Step 1: Seed developers
    const developerIdMap = await seedDevelopers();

    // Step 2: Seed projects
    await seedProjects(developerIdMap);

    // Step 3: Create attestations
    await seedAttestations();

    // Summary
    const developerCount = await prisma.developer.count();
    const projectCount = await prisma.project.count();
    const attestationCount = await prisma.attestation.count();

    console.log("\n" + "=" + "=".repeat(49));
    console.log("\n✨ Seed completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   • Developers: ${developerCount}`);
    console.log(`   • Projects: ${projectCount}`);
    console.log(`   • Attestations: ${attestationCount}`);
    console.log("");
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    throw error;
  }
}

// Run
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
