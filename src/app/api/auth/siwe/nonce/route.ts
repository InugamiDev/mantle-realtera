import { NextRequest, NextResponse } from "next/server";
import { createNonce, cleanupExpiredNonces } from "@/lib/auth/siwe/nonce";

/**
 * GET /api/auth/siwe/nonce
 * Generates a unique nonce for SIWE authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Get address from query params (optional, for tracking)
    const address = request.nextUrl.searchParams.get("address") || "unknown";

    // Clean up expired nonces periodically (1% chance per request)
    if (Math.random() < 0.01) {
      await cleanupExpiredNonces();
    }

    // Generate and store nonce
    const nonce = await createNonce(address.toLowerCase());

    return NextResponse.json({ nonce }, { status: 200 });
  } catch (error) {
    console.error("Nonce generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate nonce" },
      { status: 500 }
    );
  }
}
