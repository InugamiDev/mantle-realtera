"use client";

import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { useUnifiedAuth, type UnifiedUser } from "@/hooks/auth";
import { AuthModal } from "@/components/auth/modal";

interface UnifiedAuthContextValue {
  user: UnifiedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authMethods: {
    email: boolean;
    wallet: boolean;
  };
  walletAddress: string | null;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  refetch: () => Promise<void>;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextValue | null>(null);

interface UnifiedAuthProviderProps {
  children: ReactNode;
}

/**
 * Provider that wraps the app with unified auth context and modal
 */
export function UnifiedAuthProvider({ children }: UnifiedAuthProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = useUnifiedAuth();

  const openAuthModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const value: UnifiedAuthContextValue = {
    ...auth,
    openAuthModal,
    closeAuthModal,
  };

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
      <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />
    </UnifiedAuthContext.Provider>
  );
}

/**
 * Hook to access unified auth context
 */
export function useAuth(): UnifiedAuthContextValue {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error("useAuth must be used within UnifiedAuthProvider");
  }
  return context;
}
