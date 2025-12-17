import "server-only";

import { StackServerApp } from "@stackframe/stack";
import { stackClientApp } from "./client";

const hasStackAuth = Boolean(process.env.NEXT_PUBLIC_STACK_PROJECT_ID);

export const stackServerApp = hasStackAuth && stackClientApp
  ? new StackServerApp({
      inheritsFrom: stackClientApp,
    })
  : (null as unknown as StackServerApp);
