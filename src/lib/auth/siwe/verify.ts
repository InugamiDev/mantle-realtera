import { SiweMessage } from "siwe";

export interface VerifyResult {
  success: boolean;
  address?: string;
  chainId?: number;
  error?: string;
}

/**
 * Verifies a SIWE signature and returns the recovered address
 */
export async function verifySiweSignature(
  message: string,
  signature: string,
  expectedNonce?: string
): Promise<VerifyResult> {
  try {
    const siweMessage = new SiweMessage(message);

    // Verify the signature
    const result = await siweMessage.verify({
      signature,
      nonce: expectedNonce,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error?.type || "Verification failed",
      };
    }

    return {
      success: true,
      address: siweMessage.address,
      chainId: siweMessage.chainId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown verification error",
    };
  }
}

/**
 * Parses a SIWE message string to extract fields
 */
export function parseSiweMessage(message: string): SiweMessage {
  return new SiweMessage(message);
}
