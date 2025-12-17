"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from "react";
import { useUser } from "@stackframe/stack";

// Check if Stack Auth is configured at module level
const hasStackAuth = Boolean(process.env.NEXT_PUBLIC_STACK_PROJECT_ID);

// Type for Stack user (extended to match Stack Auth user type)
export interface StackUser {
  id: string;
  primaryEmail: string | null;
  displayName: string | null;
  profileImageUrl: string | null;
  // Extended properties that Stack Auth provides
  primaryEmailVerified?: boolean;
  signedUpAt?: Date;
  clientMetadata?: Record<string, unknown>;
  clientReadOnlyMetadata?: Record<string, unknown>;
  // Methods
  signOut?: () => Promise<void>;
  update?: (data: Partial<{ displayName: string; profileImageUrl: string }>) => Promise<void>;
}

// Context to store user from Stack provider
const StackUserContext = createContext<StackUser | null>(null);

/**
 * Internal component that consumes the Stack user and provides it via context
 */
function StackUserProvider({ children }: { children: ReactNode }) {
  const stackUser = useUser();
  const user = useMemo(() => stackUser as StackUser | null, [stackUser]);

  return (
    <StackUserContext.Provider value={user}>
      {children}
    </StackUserContext.Provider>
  );
}

/**
 * Wrapper component to mark that we're inside a StackProvider
 * This should be used inside StackAuthWrapper
 */
export function StackProviderMarker({ children }: { children: ReactNode }) {
  return (
    <StackUserProvider>
      {children}
    </StackUserProvider>
  );
}

/**
 * Safe hook to get Stack user - handles SSR/hydration properly.
 * Returns null during SSR and before hydration.
 */
export function useSafeStackUser(): StackUser | null {
  const contextUser = useContext(StackUserContext);
  const [mounted, setMounted] = useState(false);

  // Handle hydration - only return user after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR or before hydration, return null
  if (!mounted) {
    return null;
  }

  return contextUser;
}

/**
 * Hook to check if Stack Auth is configured
 */
export function useStackAuthConfigured(): boolean {
  return hasStackAuth;
}

/**
 * Hook to check if we're inside a StackProvider (has context value)
 */
export function useIsInsideStackProvider(): boolean {
  const user = useContext(StackUserContext);
  // If context exists (even null user), we're inside provider
  // This isn't a perfect check, but works for basic cases
  return user !== undefined;
}

/**
 * Provider to wrap the app when Stack Auth might not be configured
 * This is a fallback provider - use the actual StackProvider when Stack Auth is configured
 */
export function SafeStackAuthProvider({ children }: { children: ReactNode }) {
  return (
    <StackUserContext.Provider value={null}>
      {children}
    </StackUserContext.Provider>
  );
}
