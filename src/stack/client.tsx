import { StackClientApp } from "@stackframe/stack";

// Only initialize if Stack Auth is configured
const hasStackAuth = Boolean(process.env.NEXT_PUBLIC_STACK_PROJECT_ID);

// Create the app only if configured, otherwise null
const app = hasStackAuth
  ? new StackClientApp({
      tokenStore: "nextjs-cookie",
    })
  : null;

// Export with proper typing - can be null when not configured
export const stackClientApp = app;
