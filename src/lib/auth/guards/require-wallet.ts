import { requireAuth, AuthError } from "./require-auth";
import type { UnifiedUser } from "../session";

interface StackUser {
  id: string;
  primaryEmail?: string | null;
  displayName?: string | null;
  profileImageUrl?: string | null;
}

/**
 * Requires authentication AND a linked wallet
 * Throws AuthError if not authenticated or wallet not linked
 */
export async function requireLinkedWallet(
  stackUser: StackUser | null
): Promise<UnifiedUser & { evmWalletAddress: string }> {
  const user = await requireAuth(stackUser);

  if (!user.evmWalletAddress) {
    throw new AuthError("Wallet not linked", 403);
  }

  return user as UnifiedUser & { evmWalletAddress: string };
}

/**
 * Checks if user has a linked wallet without throwing
 */
export async function hasLinkedWallet(
  stackUser: StackUser | null
): Promise<boolean> {
  try {
    await requireLinkedWallet(stackUser);
    return true;
  } catch {
    return false;
  }
}
