/**
 * Pinata IPFS Upload Utilities
 *
 * This script provides utilities for uploading images to IPFS via Pinata.
 * Used during seeding to store developer logos and project images.
 *
 * Environment variables required:
 * - PINATA_API_KEY
 * - PINATA_API_SECRET
 * - PINATA_JWT (optional, for faster auth)
 */

import PinataSDK from "@pinata/sdk";
import * as fs from "fs";
import * as path from "path";

// Initialize Pinata client
const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY || "",
  pinataSecretApiKey: process.env.PINATA_API_SECRET || "",
});

export interface IPFSUploadResult {
  cid: string;
  url: string;
  size: number;
}

/**
 * Upload a local file to IPFS via Pinata
 */
export async function uploadFileToIPFS(
  filePath: string,
  name: string
): Promise<IPFSUploadResult> {
  const readableStream = fs.createReadStream(filePath);
  const stats = fs.statSync(filePath);

  const result = await pinata.pinFileToIPFS(readableStream, {
    pinataMetadata: {
      name,
    },
    pinataOptions: {
      cidVersion: 1,
    },
  });

  return {
    cid: result.IpfsHash,
    url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    size: stats.size,
  };
}

/**
 * Upload an image from URL to IPFS via Pinata
 */
export async function uploadFromURL(
  imageUrl: string,
  name: string
): Promise<IPFSUploadResult> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "RealTera/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Determine content type
    const contentType = response.headers.get("content-type") || "image/png";
    const extension = contentType.includes("jpeg")
      ? "jpg"
      : contentType.includes("png")
        ? "png"
        : contentType.includes("webp")
          ? "webp"
          : "jpg";

    // Upload to Pinata
    const result = await pinata.pinFileToIPFS(buffer, {
      pinataMetadata: {
        name: `${name}.${extension}`,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    });

    return {
      cid: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      size: buffer.length,
    };
  } catch (error) {
    console.error(`Failed to upload from URL ${imageUrl}:`, error);
    throw error;
  }
}

/**
 * Upload JSON metadata to IPFS
 */
export async function uploadJSONToIPFS(
  data: object,
  name: string
): Promise<IPFSUploadResult> {
  const result = await pinata.pinJSONToIPFS(data, {
    pinataMetadata: {
      name,
    },
    pinataOptions: {
      cidVersion: 1,
    },
  });

  return {
    cid: result.IpfsHash,
    url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    size: JSON.stringify(data).length,
  };
}

/**
 * Generate a placeholder image URL for development
 * Uses UI Avatars or placeholder services
 */
export function getPlaceholderLogo(name: string): string {
  const encodedName = encodeURIComponent(name.slice(0, 2).toUpperCase());
  return `https://ui-avatars.com/api/?name=${encodedName}&size=256&background=0D8ABC&color=fff&bold=true`;
}

/**
 * Generate a placeholder project image
 * Uses Unsplash source for real estate images
 */
export function getPlaceholderProjectImage(slug: string): string {
  // Use a consistent hash for each project to get reproducible images
  const hash = slug.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return `https://source.unsplash.com/800x600/?building,apartment,${hash}`;
}

/**
 * Test Pinata connection
 */
export async function testPinataConnection(): Promise<boolean> {
  try {
    const result = await pinata.testAuthentication();
    console.log("Pinata connection successful:", result);
    return true;
  } catch (error) {
    console.error("Pinata connection failed:", error);
    return false;
  }
}

// CLI usage
if (require.main === module) {
  (async () => {
    console.log("Testing Pinata connection...");
    const connected = await testPinataConnection();
    if (connected) {
      console.log("Pinata is ready for uploads!");
    } else {
      console.log("Please check your Pinata credentials.");
      process.exit(1);
    }
  })();
}

export default {
  uploadFileToIPFS,
  uploadFromURL,
  uploadJSONToIPFS,
  getPlaceholderLogo,
  getPlaceholderProjectImage,
  testPinataConnection,
};
