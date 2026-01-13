"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useSafeStackUser } from "@/stack/safe-hooks";

export interface UnifiedUser {
  id: string;
  email: string | null;
  displayName: string | null;
  profileImageUrl: string | null;
  evmWalletAddress: string | null;
  tier: string;
  authMethods: {
    email: boolean;
    wallet: boolean;
  };
}

interface UseUnifiedAuthResult {
  user: UnifiedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authMethods: {
    email: boolean;
    wallet: boolean;
  };
  walletAddress: string | null;
  refetch: () => Promise<void>;
}

/**
 * Unified auth hook that combines Stack Auth and SIWE sessions
 */
export function useUnifiedAuth(): UseUnifiedAuthResult {
  const stackUser = useSafeStackUser();
  const { address: wagmiAddress, isConnected } = useAccount();

  const [sessionData, setSessionData] = useState<{
    user: UnifiedUser | null;
    authMethods: { email: boolean; wallet: boolean };
    walletAddress: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        setSessionData({
          user: data.user,
          authMethods: data.authMethods,
          walletAddress: data.walletAddress,
        });
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch session on mount and when Stack Auth changes
  useEffect(() => {
    fetchSession();
  }, [fetchSession, stackUser?.id]);

  // Merge Stack Auth user with session data
  const user: UnifiedUser | null = sessionData?.user
    ? {
        ...sessionData.user,
        // Prefer Stack Auth data if available
        displayName: stackUser?.displayName || sessionData.user.displayName,
        profileImageUrl: stackUser?.profileImageUrl || sessionData.user.profileImageUrl,
        email: stackUser?.primaryEmail || sessionData.user.email,
      }
    : stackUser
      ? {
          id: stackUser.id,
          email: stackUser.primaryEmail || null,
          displayName: stackUser.displayName || null,
          profileImageUrl: stackUser.profileImageUrl || null,
          evmWalletAddress: wagmiAddress || null,
          tier: "FREE",
          authMethods: { email: true, wallet: isConnected },
        }
      : null;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    authMethods: sessionData?.authMethods || { email: !!stackUser, wallet: false },
    walletAddress: sessionData?.walletAddress || wagmiAddress || null,
    refetch: fetchSession,
  };
}
