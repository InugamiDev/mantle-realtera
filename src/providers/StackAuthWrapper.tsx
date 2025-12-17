"use client";

import { ReactNode } from "react";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "@/stack/client";
import { StackProviderMarker } from "@/stack/safe-hooks";

interface StackAuthWrapperProps {
  children: ReactNode;
}

export default function StackAuthWrapper({ children }: StackAuthWrapperProps) {
  if (!stackClientApp) {
    return <>{children}</>;
  }

  return (
    <StackProvider app={stackClientApp}>
      <StackTheme>
        <StackProviderMarker>{children}</StackProviderMarker>
      </StackTheme>
    </StackProvider>
  );
}
