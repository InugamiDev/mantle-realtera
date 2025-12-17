"use client";

import { ReactNode, Suspense, lazy } from "react";

// Check if Stack Auth is properly configured at module level
const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
const isStackConfigured =
  projectId &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId) &&
  projectId !== "00000000-0000-0000-0000-000000000000";

// Lazy load the Stack Provider wrapper
const StackAuthWrapper = lazy(() => import("./StackAuthWrapper"));

export function OptionalStackProvider({ children }: { children: ReactNode }) {
  // If Stack Auth is not configured, just render children without the provider
  if (!isStackConfigured) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<>{children}</>}>
      <StackAuthWrapper>{children}</StackAuthWrapper>
    </Suspense>
  );
}
