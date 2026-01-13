"use client";

import { useState, useCallback } from "react";
import { useAccount, useSignMessage, useChainId } from "wagmi";
import { SiweMessage } from "siwe";

export type LinkWalletStep = "idle" | "connecting" | "signing" | "linking" | "success" | "error";

interface UseLinkWalletResult {
  step: LinkWalletStep;
  error: string | null;
  linkWallet: () => Promise<boolean>;
  reset: () => void;
}

/**
 * Hook for linking wallet to existing email account
 */
export function useLinkWallet(): UseLinkWalletResult {
  const [step, setStep] = useState<LinkWalletStep>("idle");
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  const reset = useCallback(() => {
    setStep("idle");
    setError(null);
  }, []);

  const linkWallet = useCallback(async (): Promise<boolean> => {
    if (!isConnected || !address) {
      setError("Wallet not connected");
      setStep("error");
      return false;
    }

    try {
      setError(null);
      setStep("signing");

      // Step 1: Get nonce
      const nonceRes = await fetch(`/api/auth/siwe/nonce?address=${address}`);
      if (!nonceRes.ok) {
        throw new Error("Failed to get nonce");
      }
      const { nonce } = await nonceRes.json();

      // Step 2: Create message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Link this wallet to your RealTera account.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
        issuedAt: new Date().toISOString(),
      });

      const messageToSign = message.prepareMessage();

      // Step 3: Sign
      const signature = await signMessageAsync({ message: messageToSign });

      setStep("linking");

      // Step 4: Link with backend
      const linkRes = await fetch("/api/auth/siwe/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSign, signature }),
      });

      if (!linkRes.ok) {
        const data = await linkRes.json();
        throw new Error(data.error || "Linking failed");
      }

      setStep("success");
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Linking failed";
      setError(errorMessage);
      setStep("error");
      return false;
    }
  }, [address, chainId, isConnected, signMessageAsync]);

  return { step, error, linkWallet, reset };
}
