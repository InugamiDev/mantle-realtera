import { defineChain } from "viem";

// Local Hardhat Network (for development)
export const localhost = defineChain({
  id: 31337,
  name: "Localhost",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
  },
  testnet: true,
});

// Mantle Sepolia Testnet
export const mantleSepolia = defineChain({
  id: 5003,
  name: "Mantle Sepolia Testnet",
  nativeCurrency: {
    name: "MNT",
    symbol: "MNT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mantle Sepolia Explorer",
      url: "https://explorer.sepolia.mantle.xyz",
    },
  },
  testnet: true,
});

// Mantle Mainnet
export const mantleMainnet = defineChain({
  id: 5000,
  name: "Mantle",
  nativeCurrency: {
    name: "MNT",
    symbol: "MNT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mantle Explorer",
      url: "https://explorer.mantle.xyz",
    },
  },
  testnet: false,
});

// Helper to get explorer URL for a transaction
export function getExplorerTxUrl(txHash: string, chainId: number = 5003): string {
  const explorer =
    chainId === 5000
      ? "https://explorer.mantle.xyz"
      : "https://explorer.sepolia.mantle.xyz";
  return `${explorer}/tx/${txHash}`;
}

// Helper to get explorer URL for an address
export function getExplorerAddressUrl(address: string, chainId: number = 5003): string {
  const explorer =
    chainId === 5000
      ? "https://explorer.mantle.xyz"
      : "https://explorer.sepolia.mantle.xyz";
  return `${explorer}/address/${address}`;
}

// Helper to get explorer URL for a token
export function getExplorerTokenUrl(
  contractAddress: string,
  tokenId: bigint,
  chainId: number = 5003
): string {
  const explorer =
    chainId === 5000
      ? "https://explorer.mantle.xyz"
      : "https://explorer.sepolia.mantle.xyz";
  return `${explorer}/token/${contractAddress}?a=${tokenId}`;
}
