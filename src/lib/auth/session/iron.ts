import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SiweSessionData {
  userId: string;
  address: string;
  chainId: number;
  authenticatedAt: string;
}

const sessionOptions = {
  password: process.env.SIWE_SESSION_SECRET || "complex_password_at_least_32_characters_long",
  cookieName: "realtera_siwe_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

/**
 * Gets the SIWE session from cookies (server-side)
 */
export async function getSiweSession(): Promise<IronSession<SiweSessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SiweSessionData>(cookieStore, sessionOptions);
}

/**
 * Creates a new SIWE session
 */
export async function setSiweSession(data: SiweSessionData): Promise<void> {
  const session = await getSiweSession();
  session.userId = data.userId;
  session.address = data.address;
  session.chainId = data.chainId;
  session.authenticatedAt = data.authenticatedAt;
  await session.save();
}

/**
 * Destroys the SIWE session
 */
export async function destroySiweSession(): Promise<void> {
  const session = await getSiweSession();
  session.destroy();
}

/**
 * Checks if a SIWE session is valid
 */
export async function hasSiweSession(): Promise<boolean> {
  const session = await getSiweSession();
  return !!session.userId && !!session.address;
}
