import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySiweSignature, parseSiweMessage } from "@/lib/auth/siwe/verify";
import { validateNonce, consumeNonce } from "@/lib/auth/siwe/nonce";
import { stackServerApp } from "@/stack/server";

interface LinkRequestBody {
  message: string;
  signature: string;
}

/**
 * POST /api/auth/siwe/link
 * Links a wallet to an existing Stack Auth user
 */
export async function POST(request: NextRequest) {
  try {
    // Get current Stack Auth user
    const stackUser = await stackServerApp.getUser();
    if (!stackUser) {
      return NextResponse.json(
        { error: "Must be logged in with email to link wallet" },
        { status: 401 }
      );
    }

    const body: LinkRequestBody = await request.json();
    const { message, signature } = body;

    if (!message || !signature) {
      return NextResponse.json(
        { error: "Message and signature are required" },
        { status: 400 }
      );
    }

    // Parse and verify
    const siweMessage = parseSiweMessage(message);
    const { nonce, address } = siweMessage;

    // Validate nonce
    const isValidNonce = await validateNonce(nonce);
    if (!isValidNonce) {
      return NextResponse.json(
        { error: "Invalid or expired nonce" },
        { status: 400 }
      );
    }

    // Verify signature
    const verifyResult = await verifySiweSignature(message, signature, nonce);
    if (!verifyResult.success) {
      return NextResponse.json(
        { error: verifyResult.error || "Signature verification failed" },
        { status: 400 }
      );
    }

    // Consume nonce
    await consumeNonce(nonce);

    const normalizedAddress = address.toLowerCase();

    // Check if wallet is already linked to another account
    const existingWalletUser = await db.user.findUnique({
      where: { evmWalletAddress: normalizedAddress },
    });

    if (existingWalletUser && existingWalletUser.stackAuthId !== stackUser.id) {
      return NextResponse.json(
        { error: "Wallet is already linked to another account" },
        { status: 409 }
      );
    }

    // Find or create user record by Stack Auth ID
    let user = await db.user.findUnique({
      where: { stackAuthId: stackUser.id },
    });

    if (user) {
      // Update existing user with wallet
      user = await db.user.update({
        where: { id: user.id },
        data: {
          evmWalletAddress: normalizedAddress,
          walletLinkedAt: new Date(),
        },
      });
    } else {
      // Create new user with both Stack Auth and wallet
      user = await db.user.create({
        data: {
          stackAuthId: stackUser.id,
          email: stackUser.primaryEmail,
          displayName: stackUser.displayName,
          profileImageUrl: stackUser.profileImageUrl,
          evmWalletAddress: normalizedAddress,
          primaryAuthMethod: "email",
          walletLinkedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        displayName: user.displayName,
        evmWalletAddress: user.evmWalletAddress,
        email: user.email,
        authMethods: {
          email: !!user.stackAuthId,
          wallet: true,
        },
      },
    });
  } catch (error) {
    console.error("Wallet linking error:", error);
    return NextResponse.json(
      { error: "Failed to link wallet" },
      { status: 500 }
    );
  }
}
