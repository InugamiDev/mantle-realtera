import { getSessionInfo, getUnifiedUser, type UnifiedUser } from "../session";

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}

interface StackUser {
  id: string;
  primaryEmail?: string | null;
  displayName?: string | null;
  profileImageUrl?: string | null;
}

/**
 * Requires authentication via either Stack Auth or SIWE
 * Throws AuthError if not authenticated
 */
export async function requireAuth(
  stackUser: StackUser | null
): Promise<UnifiedUser> {
  const { siweSession } = await getSessionInfo();

  // Check if user is authenticated via either method
  if (!stackUser?.id && !siweSession?.userId) {
    throw new AuthError("Authentication required", 401);
  }

  // Get the unified user
  const user = await getUnifiedUser(stackUser, siweSession);

  if (!user) {
    throw new AuthError("User not found", 401);
  }

  return user;
}

/**
 * Checks if user is authenticated without throwing
 */
export async function isAuthenticated(
  stackUser: StackUser | null
): Promise<boolean> {
  try {
    await requireAuth(stackUser);
    return true;
  } catch {
    return false;
  }
}
