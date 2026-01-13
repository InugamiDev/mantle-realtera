import { SiweMessage } from "siwe";

export interface CreateSiweMessageParams {
  address: string;
  chainId: number;
  nonce: string;
  domain?: string;
  uri?: string;
  statement?: string;
}

/**
 * Creates a SIWE message for the user to sign
 */
export function createSiweMessage({
  address,
  chainId,
  nonce,
  domain,
  uri,
  statement = "Sign in to RealTera with your Ethereum wallet.",
}: CreateSiweMessageParams): string {
  const message = new SiweMessage({
    domain: domain || (typeof window !== "undefined" ? window.location.host : ""),
    address,
    statement,
    uri: uri || (typeof window !== "undefined" ? window.location.origin : ""),
    version: "1",
    chainId,
    nonce,
    issuedAt: new Date().toISOString(),
    expirationTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
  });

  return message.prepareMessage();
}
