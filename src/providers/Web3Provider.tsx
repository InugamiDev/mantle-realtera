"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, metaMask } from "wagmi/connectors";
import { ReactNode, useState } from "react";
import { mantleSepolia, mantleMainnet, localhost } from "@/lib/mantle";

// Determine default chain based on environment (reserved for future use)
const _defaultChain =
  process.env.NEXT_PUBLIC_CHAIN_ID === "31337" ? localhost :
  process.env.NEXT_PUBLIC_CHAIN_ID === "5000" ? mantleMainnet : mantleSepolia;

const config = createConfig({
  chains: [localhost, mantleSepolia, mantleMainnet],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [localhost.id]: http(),
    [mantleSepolia.id]: http(),
    [mantleMainnet.id]: http(),
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

// Export config for use in hooks
export { config };
