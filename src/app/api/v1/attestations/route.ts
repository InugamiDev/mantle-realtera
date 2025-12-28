import { NextRequest, NextResponse } from "next/server";
import {
  getAttestationBySlug,
  getAttestationByAssetId,
  batchCheckValidity,
  getRegistryStats,
  isMockMode,
} from "@/lib/attestation-service";
import { slugToAssetId } from "@/lib/attestation-registry";

/**
 * GET /api/v1/attestations
 *
 * Query attestations by slug, asset ID, or batch.
 *
 * Query Parameters:
 * - slug: Project slug (e.g., "vinhomes-grand-park")
 * - assetId: Bytes32 asset ID (e.g., "0x...")
 * - batch: Comma-separated slugs for batch validity check
 *
 * B2B API - Returns attestation data for integrators
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const slug = searchParams.get("slug");
    const assetId = searchParams.get("assetId");
    const batch = searchParams.get("batch");

    // Batch validity check
    if (batch) {
      const slugs = batch.split(",").map((s) => s.trim()).filter(Boolean);

      if (slugs.length === 0) {
        return NextResponse.json(
          { error: "No slugs provided in batch parameter" },
          { status: 400 }
        );
      }

      if (slugs.length > 100) {
        return NextResponse.json(
          { error: "Batch size exceeds limit (max 100)" },
          { status: 400 }
        );
      }

      const results = await batchCheckValidity(slugs);

      return NextResponse.json({
        data: results,
        count: slugs.length,
        validCount: Object.values(results).filter(Boolean).length,
        mockMode: isMockMode(),
      });
    }

    // Single attestation by slug
    if (slug) {
      const attestation = await getAttestationBySlug(slug);

      if (!attestation) {
        return NextResponse.json(
          {
            error: "Attestation not found",
            slug,
            assetId: slugToAssetId(slug),
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        data: attestation,
        mockMode: isMockMode(),
      });
    }

    // Single attestation by asset ID
    if (assetId) {
      if (!assetId.startsWith("0x") || assetId.length !== 66) {
        return NextResponse.json(
          { error: "Invalid asset ID format. Must be bytes32 (0x + 64 hex chars)" },
          { status: 400 }
        );
      }

      const attestation = await getAttestationByAssetId(assetId as `0x${string}`);

      if (!attestation) {
        return NextResponse.json(
          { error: "Attestation not found", assetId },
          { status: 404 }
        );
      }

      return NextResponse.json({
        data: attestation,
        mockMode: isMockMode(),
      });
    }

    // No query params - return registry stats
    const stats = await getRegistryStats();

    return NextResponse.json({
      message: "RealTera Attestation Registry API",
      stats,
      mockMode: isMockMode(),
      endpoints: {
        "GET /api/v1/attestations?slug=<slug>": "Get attestation by project slug",
        "GET /api/v1/attestations?assetId=<0x...>": "Get attestation by asset ID",
        "GET /api/v1/attestations?batch=<slug1,slug2,...>": "Batch validity check",
        "GET /api/v1/attestations/:assetId": "Get attestation by asset ID (path param)",
      },
    });
  } catch (error) {
    console.error("Attestation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
