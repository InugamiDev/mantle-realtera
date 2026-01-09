import { ethers, network } from "hardhat";

async function main() {
  console.log("Deploying RealTeraAttestation to", network.name);

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MNT");

  // Base URI for token metadata
  // In production, this would be your API endpoint
  const baseUri = process.env.METADATA_BASE_URI || "https://realtera.vn/api/metadata/";

  // Deploy the contract
  const RealTeraAttestation = await ethers.getContractFactory("RealTeraAttestation");
  const contract = await RealTeraAttestation.deploy(baseUri);

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("RealTeraAttestation deployed to:", contractAddress);

  // Log deployment info for .env
  console.log("\n========================================");
  console.log("Add these to your .env.local:");
  console.log("========================================");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`NEXT_PUBLIC_CHAIN_ID=${network.config.chainId}`);
  console.log("========================================\n");

  // Verify on block explorer (if not local network)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await contract.deploymentTransaction()?.wait(5);

    console.log("Verifying contract on explorer...");
    try {
      const { run } = await import("hardhat");
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: [baseUri],
      });
      console.log("Contract verified successfully!");
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log("Contract already verified!");
      } else {
        console.log("Verification failed:", error.message);
      }
    }
  }

  return contractAddress;
}

main()
  .then((address) => {
    console.log("Deployment complete! Contract address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
