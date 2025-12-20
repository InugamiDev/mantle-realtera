"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { AuthOptions } from "./AuthOptions";
import { SiweFlow } from "./SiweFlow";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "choose" | "wallet";

/**
 * Unified auth modal - thin wrapper that composes sub-components
 */
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("choose");

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: reset modal state on open
      setMode("choose");
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSuccess = useCallback(() => {
    onClose();
    // Refresh page to update auth state
    window.location.reload();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          {mode === "choose" && (
            <AuthOptions onWalletSelect={() => setMode("wallet")} />
          )}
          {mode === "wallet" && (
            <SiweFlow onBack={() => setMode("choose")} onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
