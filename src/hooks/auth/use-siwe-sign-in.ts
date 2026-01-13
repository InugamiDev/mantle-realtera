"use client";

import { useState, useCallback } from "react";
import { useAccount, useSignMessage, useChainId } from "wagmi";
import { SiweMessage } from "siwe";

export type SiweSignInStep = "idle" | "connecting" | "signing" | "verifying" | "success" | "error";

interface UseSiweSignInResult {
  step: SiweSignInStep;
  error: string | null;
  signIn: () => Promise<boolean>;
  reset: () => void;
}

/**
 * Hook for SIWE sign-in flow
 * Handles: connect wallet -> get nonce -> sign message -> verify
 */
export function useSiweSignIn(): UseSiweSignInResult {
  const [step, setStep] = useState<SiweSignInStep>("idle");
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  const reset = useCallback(() => {
    setStep("idle");
    setError(null);
  }, []);

  const signIn = useCallback(async (): Promise<boolean> => {
    if (!isConnected || !address) {
      setError("Wallet not connected");
      setStep("error");
      return false;
    }

    try {
      setError(null);
      setStep("signing");

      // Step 1: Get nonce from backend
      const nonceRes = await fetch(`/api/auth/siwe/nonce?address=${address}`);
      if (!nonceRes.ok) {
        throw new Error("Failed to get nonce");
      }
      const { nonce } = await nonceRes.json();

      // Step 2: Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to RealTera with your Ethereum wallet.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
        issuedAt: new Date().toISOString(),
      });

      const messageToSign = message.prepareMessage();

      // Step 3: Sign message
      const signature = await signMessageAsync({ message: messageToSign });

      setStep("verifying");

      // Step 4: Verify with backend
      const verifyRes = await fetch("/api/auth/siwe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSign, signature }),
      });

      if (!verifyRes.ok) {
        const data = await verifyRes.json();
        throw new Error(data.error || "Verification failed");
      }

      setStep("success");
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign-in failed";
      setError(errorMessage);
      setStep("error");
      return false;
    }
  }, [address, chainId, isConnected, signMessageAsync]);

  return { step, error, signIn, reset };
}
