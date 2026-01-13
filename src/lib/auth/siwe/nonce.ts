import { randomBytes } from "crypto";
import { db } from "@/lib/db";

const NONCE_EXPIRY_MINUTES = 5;

/**
 * Generates a cryptographically secure nonce
 */
export function generateNonce(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Creates and stores a nonce in the database
 */
export async function createNonce(address: string): Promise<string> {
  const nonce = generateNonce();
  const expiresAt = new Date(Date.now() + NONCE_EXPIRY_MINUTES * 60 * 1000);

  await db.siweNonce.create({
    data: {
      nonce,
      address: address.toLowerCase(),
      expiresAt,
    },
  });

  return nonce;
}

/**
 * Validates a nonce - checks it exists, hasn't expired, and hasn't been used
 */
export async function validateNonce(nonce: string): Promise<boolean> {
  const record = await db.siweNonce.findUnique({
    where: { nonce },
  });

  if (!record) {
    return false;
  }

  // Check if expired
  if (record.expiresAt < new Date()) {
    return false;
  }

  // Check if already used
  if (record.usedAt) {
    return false;
  }

  return true;
}

/**
 * Marks a nonce as used (prevents replay attacks)
 */
export async function consumeNonce(nonce: string): Promise<boolean> {
  try {
    await db.siweNonce.update({
      where: { nonce },
      data: { usedAt: new Date() },
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Cleans up expired nonces (call periodically)
 */
export async function cleanupExpiredNonces(): Promise<number> {
  const result = await db.siweNonce.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
  return result.count;
}
