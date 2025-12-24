"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Code2 } from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";

/**
 * Developer Routes Error Boundary
 */
export default function DeveloperError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Developer error:", error);
  }, [error]);

  return (
    <div className="container-app py-12">
      <GlassCard className="mx-auto max-w-lg p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>

        <h1 className="mb-2 text-xl font-bold text-white">
          Lỗi Developer Console
        </h1>
        <p className="mb-6 text-sm text-white/60">
          Không thể tải trang này. Vui lòng thử lại.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-3 text-left">
            <p className="text-xs font-mono text-red-400 break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:bg-cyan-400"
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </button>
          <Link
            href="/developer/console"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
          >
            <Code2 className="h-4 w-4" />
            Developer Home
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
