import { ethers } from "hardhat";

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Set CONTRACT_ADDRESS in environment");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Testing with account:", deployer.address);

  const RealTeraAttestation = await ethers.getContractFactory("RealTeraAttestation");
  const contract = RealTeraAttestation.attach(contractAddress);

  // Test 1: Mint a Basic Verification Badge
  console.log("\n1. Minting Basic Verification Badge...");
  const tx1 = await contract.mintVerificationBadge(
    deployer.address,
    1, // BADGE_BASIC
    "vinhomes-grand-park",
    "S+",
    92,
    180 // 6 months validity
  );
  await tx1.wait();
  console.log("✅ Badge minted! TX:", tx1.hash);

  // Test 2: Mint a Property NFT
  console.log("\n2. Minting Property NFT...");
  const tx2 = await contract.mintPropertyNFT(
    deployer.address,
    "the-marq",
    "The Marq",
    "Quận 1",
    "SSS",
    98,
    150000000 // 150M VND/sqm
  );
  await tx2.wait();
  console.log("✅ Property NFT minted! TX:", tx2.hash);

  // Test 3: Mint a Developer SBT
  console.log("\n3. Minting Developer SBT...");
  const tx3 = await contract.mintDeveloperSBT(
    deployer.address,
    "vinhomes",
    "SSS",
    95
  );
  await tx3.wait();
  console.log("✅ Developer SBT minted! TX:", tx3.hash);

  // Read back the data
  console.log("\n========================================");
  console.log("Reading on-chain data:");
  console.log("========================================");

  const verification = await contract.verifications(1);
  console.log("Basic Badge Verification:", {
    slug: verification.slug,
    tier: verification.tier,
    score: verification.score.toString(),
    isActive: verification.isActive,
  });

  const propertyTokenId = await contract.projectSlugToTokenId("the-marq");
  const property = await contract.properties(propertyTokenId);
  console.log("Property NFT:", {
    tokenId: propertyTokenId.toString(),
    name: property.projectName,
    district: property.district,
    tier: property.tier,
    score: property.score.toString(),
    pricePerSqm: property.pricePerSqm.toString(),
  });

  const developerSbtId = await contract.developerSbt(deployer.address);
  console.log("Developer SBT ID:", developerSbtId.toString());

  // Check balances
  console.log("\n========================================");
  console.log("Token Balances:");
  console.log("========================================");
  console.log("Basic Badge:", (await contract.balanceOf(deployer.address, 1)).toString());
  console.log("Property NFT:", (await contract.balanceOf(deployer.address, propertyTokenId)).toString());
  console.log("Developer SBT:", (await contract.balanceOf(deployer.address, developerSbtId)).toString());

  console.log("\n✅ All tests passed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
