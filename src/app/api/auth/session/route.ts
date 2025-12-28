import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { getSessionInfo, getUnifiedUser } from "@/lib/auth/session";

/**
 * GET /api/auth/session
 * Returns the current unified session info
 */
export async function GET() {
  try {
    // Get Stack Auth user (only if Stack Auth is configured)
    const stackUser = stackServerApp ? await stackServerApp.getUser() : null;

    // Get SIWE session
    const { siweSession, hasSiwe } = await getSessionInfo();

    // Get unified user
    const user = await getUnifiedUser(
      stackUser
        ? {
            id: stackUser.id,
            primaryEmail: stackUser.primaryEmail,
            displayName: stackUser.displayName,
            profileImageUrl: stackUser.profileImageUrl,
          }
        : null,
      siweSession
    );

    return NextResponse.json({
      authenticated: !!user,
      user,
      authMethods: {
        email: !!stackUser,
        wallet: hasSiwe,
      },
      walletAddress: siweSession?.address || user?.evmWalletAddress || null,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        authMethods: { email: false, wallet: false },
        walletAddress: null,
      },
      { status: 200 }
    );
  }
}
