import { db } from "@/lib/db";
import { getSiweSession, type SiweSessionData } from "./iron";
import type { User } from "@/generated/prisma";

export interface UnifiedUser {
  id: string;
  email: string | null;
  displayName: string | null;
  profileImageUrl: string | null;
  evmWalletAddress: string | null;
  primaryAuthMethod: string | null;
  tier: string;
  authMethods: {
    email: boolean;
    wallet: boolean;
  };
}

interface StackUser {
  id: string;
  primaryEmail?: string | null;
  displayName?: string | null;
  profileImageUrl?: string | null;
}

/**
 * Gets the unified user from either Stack Auth or SIWE session
 */
export async function getUnifiedUser(
  stackUser: StackUser | null,
  siweSession: SiweSessionData | null
): Promise<UnifiedUser | null> {
  // Try Stack Auth first
  if (stackUser?.id) {
    const user = await db.user.findUnique({
      where: { stackAuthId: stackUser.id },
    });

    if (user) {
      return formatUnifiedUser(user);
    }
  }

  // Fall back to SIWE session
  if (siweSession?.userId) {
    const user = await db.user.findUnique({
      where: { id: siweSession.userId },
    });

    if (user) {
      return formatUnifiedUser(user);
    }
  }

  return null;
}

/**
 * Formats a database user into a unified user object
 */
function formatUnifiedUser(user: User): UnifiedUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    profileImageUrl: user.profileImageUrl,
    evmWalletAddress: user.evmWalletAddress,
    primaryAuthMethod: user.primaryAuthMethod,
    tier: user.tier,
    authMethods: {
      email: !!user.stackAuthId,
      wallet: !!user.evmWalletAddress,
    },
  };
}

/**
 * Gets the current session info (both Stack Auth and SIWE)
 */
export async function getSessionInfo(): Promise<{
  siweSession: SiweSessionData | null;
  hasSiwe: boolean;
}> {
  try {
    const session = await getSiweSession();
    const hasSiwe = !!session.userId && !!session.address;

    return {
      siweSession: hasSiwe
        ? {
            userId: session.userId,
            address: session.address,
            chainId: session.chainId,
            authenticatedAt: session.authenticatedAt,
          }
        : null,
      hasSiwe,
    };
  } catch {
    return { siweSession: null, hasSiwe: false };
  }
}
