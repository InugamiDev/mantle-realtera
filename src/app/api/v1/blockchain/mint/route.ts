import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mantleSepolia } from "@/lib/mantle";
import {
  REALTERA_ATTESTATION_ABI,
  TOKEN_TYPES,
  BADGE_VALIDITY,
} from "@/lib/contracts";

// Server-side minting for admin/automated flows
// This uses the admin wallet to mint tokens on behalf of users

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as `0x${string}`;
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY as `0x${string}`;

// Rate limiting (simple in-memory, use Redis in production)
const mintRequests = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const lastRequest = mintRequests.get(ip) || 0;

  if (now - lastRequest < RATE_LIMIT_WINDOW / MAX_REQUESTS) {
    return false;
  }

  mintRequests.set(ip, now);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    // Validate environment
    if (!CONTRACT_ADDRESS || !ADMIN_PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Blockchain not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      type,
      recipientAddress,
      projectSlug,
      projectName,
      developerSlug,
      district,
      tier,
      score,
      pricePerSqm,
      verificationTier,
    } = body;

    // Validate required fields
    if (!type || !recipientAddress) {
      return NextResponse.json(
        { error: "Missing required fields: type, recipientAddress" },
        { status: 400 }
      );
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      return NextResponse.json(
        { error: "Invalid recipient address format" },
        { status: 400 }
      );
    }

    // Setup wallet client
    const account = privateKeyToAccount(ADMIN_PRIVATE_KEY);

    const walletClient = createWalletClient({
      account,
      chain: mantleSepolia,
      transport: http(),
    });

    const publicClient = createPublicClient({
      chain: mantleSepolia,
      transport: http(),
    });

    let hash: `0x${string}`;
    let tokenType: string;

    // Mint based on type
    if (type === "verification_badge") {
      if (!projectSlug || !tier || score === undefined || !verificationTier) {
        return NextResponse.json(
          { error: "Missing fields for verification badge" },
          { status: 400 }
        );
      }

      const badgeTypeMap: Record<string, bigint> = {
        basic: TOKEN_TYPES.BADGE_BASIC,
        standard: TOKEN_TYPES.BADGE_STANDARD,
        premium: TOKEN_TYPES.BADGE_PREMIUM,
      };

      hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: REALTERA_ATTESTATION_ABI,
        functionName: "mintVerificationBadge",
        args: [
          recipientAddress as `0x${string}`,
          badgeTypeMap[verificationTier],
          projectSlug,
          tier,
          BigInt(score),
          BADGE_VALIDITY[verificationTier as keyof typeof BADGE_VALIDITY],
        ],
      });
      tokenType = "BADGE";
    } else if (type === "property_nft") {
      if (!projectSlug || !projectName || !district || !tier || score === undefined) {
        return NextResponse.json(
          { error: "Missing fields for property NFT" },
          { status: 400 }
        );
      }

      hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: REALTERA_ATTESTATION_ABI,
        functionName: "mintPropertyNFT",
        args: [
          recipientAddress as `0x${string}`,
          projectSlug,
          projectName,
          district,
          tier,
          BigInt(score),
          BigInt(pricePerSqm || 0),
        ],
      });
      tokenType = "PROPERTY_NFT";
    } else if (type === "developer_sbt") {
      if (!developerSlug || !tier || score === undefined) {
        return NextResponse.json(
          { error: "Missing fields for developer SBT" },
          { status: 400 }
        );
      }

      hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: REALTERA_ATTESTATION_ABI,
        functionName: "mintDeveloperSBT",
        args: [
          recipientAddress as `0x${string}`,
          developerSlug,
          tier,
          BigInt(score),
        ],
      });
      tokenType = "SBT";
    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be: verification_badge, property_nft, or developer_sbt" },
        { status: 400 }
      );
    }

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 1,
    });

    return NextResponse.json({
      success: true,
      txHash: hash,
      blockNumber: receipt.blockNumber.toString(),
      tokenType,
      explorerUrl: `https://explorer.sepolia.mantle.xyz/tx/${hash}`,
    });
  } catch (error) {
    console.error("Blockchain mint error:", error);

    const errorMessage = error instanceof Error ? error.message : "Failed to mint token";

    // Handle specific errors
    if (errorMessage.includes("insufficient funds")) {
      return NextResponse.json(
        { error: "Insufficient MNT balance for gas" },
        { status: 500 }
      );
    }

    if (errorMessage.includes("already minted")) {
      return NextResponse.json(
        { error: "Token already minted for this project/developer" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// GET: Check minting status or contract info
export async function GET() {
  try {
    if (!CONTRACT_ADDRESS) {
      return NextResponse.json(
        { error: "Blockchain not configured" },
        { status: 500 }
      );
    }

    const publicClient = createPublicClient({
      chain: mantleSepolia,
      transport: http(),
    });

    // Get contract info
    const [currentPropertyId, currentSbtId] = await Promise.all([
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: REALTERA_ATTESTATION_ABI,
        functionName: "getCurrentPropertyTokenId",
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: REALTERA_ATTESTATION_ABI,
        functionName: "getCurrentSbtTokenId",
      }),
    ]).catch(() => [null, null] as const);

    return NextResponse.json({
      configured: true,
      contractAddress: CONTRACT_ADDRESS,
      chainId: mantleSepolia.id,
      network: "Mantle Sepolia Testnet",
      explorerUrl: `https://explorer.sepolia.mantle.xyz/address/${CONTRACT_ADDRESS}`,
      stats: {
        propertyNFTsMinted: currentPropertyId ? Number(currentPropertyId) - 1000 : 0,
        developerSBTsMinted: currentSbtId ? Number(currentSbtId) - 10000 : 0,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to get contract info";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
