"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

/**
 * Toast notification wrapper using Sonner
 * Golden Lumiere theme compatible
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        style: {
          background: "rgba(15, 15, 20, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          color: "rgba(255, 255, 255, 0.9)",
        },
        classNames: {
          success: "!border-emerald-500/30 !bg-emerald-950/80",
          error: "!border-red-500/30 !bg-red-950/80",
          warning: "!border-amber-500/30 !bg-amber-950/80",
          info: "!border-cyan-500/30 !bg-cyan-950/80",
        },
      }}
    />
  );
}

// Re-export toast functions for convenience
export { toast };

/**
 * Toast utility functions with consistent styling
 */
export const showToast = {
  success: (message: string, description?: string) =>
    toast.success(message, { description }),

  error: (message: string, description?: string) =>
    toast.error(message, { description }),

  warning: (message: string, description?: string) =>
    toast.warning(message, { description }),

  info: (message: string, description?: string) =>
    toast.info(message, { description }),

  loading: (message: string) =>
    toast.loading(message),

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => toast.promise(promise, messages),

  dismiss: (id?: string | number) =>
    toast.dismiss(id),
};
