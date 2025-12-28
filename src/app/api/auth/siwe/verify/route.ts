import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySiweSignature, parseSiweMessage } from "@/lib/auth/siwe/verify";
import { validateNonce, consumeNonce } from "@/lib/auth/siwe/nonce";
import { setSiweSession } from "@/lib/auth/session/iron";

interface VerifyRequestBody {
  message: string;
  signature: string;
}

/**
 * POST /api/auth/siwe/verify
 * Verifies SIWE signature and creates/returns user session
 */
export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequestBody = await request.json();
    const { message, signature } = body;

    if (!message || !signature) {
      return NextResponse.json(
        { error: "Message and signature are required" },
        { status: 400 }
      );
    }

    // Parse the message to extract nonce
    const siweMessage = parseSiweMessage(message);
    const { nonce, address, chainId } = siweMessage;

    // Validate nonce exists and hasn't been used
    const isValidNonce = await validateNonce(nonce);
    if (!isValidNonce) {
      return NextResponse.json(
        { error: "Invalid or expired nonce" },
        { status: 400 }
      );
    }

    // Verify the signature
    const verifyResult = await verifySiweSignature(message, signature, nonce);
    if (!verifyResult.success) {
      return NextResponse.json(
        { error: verifyResult.error || "Signature verification failed" },
        { status: 400 }
      );
    }

    // Mark nonce as used (prevent replay attacks)
    await consumeNonce(nonce);

    // Find or create user by wallet address
    const normalizedAddress = address.toLowerCase();
    let user = await db.user.findUnique({
      where: { evmWalletAddress: normalizedAddress },
    });

    if (!user) {
      // Create new wallet-only user
      user = await db.user.create({
        data: {
          evmWalletAddress: normalizedAddress,
          primaryAuthMethod: "wallet",
          walletLinkedAt: new Date(),
          displayName: `${normalizedAddress.slice(0, 6)}...${normalizedAddress.slice(-4)}`,
        },
      });
    }

    // Create session
    await setSiweSession({
      userId: user.id,
      address: normalizedAddress,
      chainId: chainId,
      authenticatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        displayName: user.displayName,
        evmWalletAddress: user.evmWalletAddress,
        email: user.email,
        tier: user.tier,
        authMethods: {
          email: !!user.stackAuthId,
          wallet: true,
        },
      },
    });
  } catch (error) {
    console.error("SIWE verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
