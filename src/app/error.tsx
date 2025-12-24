"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * Global Error Boundary
 * Catches runtime errors and displays a recovery UI
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center py-12">
      <div className="mx-auto max-w-md text-center">
        {/* Error Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-10 w-10 text-red-400" />
        </div>

        {/* Error Message */}
        <h1 className="mb-2 text-2xl font-bold text-white">
          Đã xảy ra lỗi
        </h1>
        <p className="mb-6 text-white/60">
          Chúng tôi đã ghi nhận lỗi này và đang khắc phục.
          Vui lòng thử lại hoặc quay về trang chủ.
        </p>

        {/* Error Details (dev only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-left">
            <p className="text-xs font-mono text-red-400 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-white/40">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-medium text-black transition-colors hover:bg-amber-400"
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition-colors hover:bg-white/20"
          >
            <Home className="h-4 w-4" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
