import { NextRequest, NextResponse } from "next/server";
import {
  getAttestationByAssetId,
  getAttestationBySlug,
  isMockMode,
} from "@/lib/attestation-service";
import { slugToAssetId } from "@/lib/attestation-registry";

/**
 * GET /api/v1/attestations/:assetId
 *
 * Get attestation by asset ID (bytes32) or project slug.
 *
 * Supports both:
 * - 0x... (bytes32 asset ID)
 * - project-slug (will be converted to asset ID)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  try {
    const { assetId } = await params;

    if (!assetId) {
      return NextResponse.json(
        { error: "Asset ID or slug is required" },
        { status: 400 }
      );
    }

    let attestation;

    // Check if it's a bytes32 asset ID
    if (assetId.startsWith("0x") && assetId.length === 66) {
      attestation = await getAttestationByAssetId(assetId as `0x${string}`);
    } else {
      // Treat as project slug
      attestation = await getAttestationBySlug(assetId);
    }

    if (!attestation) {
      return NextResponse.json(
        {
          error: "Attestation not found",
          assetId: assetId.startsWith("0x") ? assetId : slugToAssetId(assetId),
          mockMode: isMockMode(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: attestation,
      mockMode: isMockMode(),
    });
  } catch (error) {
    console.error("Attestation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
