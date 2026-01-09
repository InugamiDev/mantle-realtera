# RealTera Smart Contracts

Smart contracts for RealTera on Mantle Network - Mantle Global Hackathon 2025.

## Overview

The `RealTeraAttestation` contract is an ERC-1155 based multi-token contract that supports:
- **Verification Badges** (Token IDs 1-3): Basic, Standard, Premium verification badges
- **Property NFTs** (Token IDs 1000+): Unique NFTs representing verified projects
- **Developer SBTs** (Token IDs 10000+): Soul-Bound Tokens for developer reputation

## Quick Start

### 1. Install Dependencies
```bash
cd contracts
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add:
```
DEPLOYER_PRIVATE_KEY=your_private_key_here
MANTLE_API_KEY=your_api_key_here  # Optional, for verification
```

### 3. Get Testnet MNT
Visit the Mantle Sepolia faucet:
- https://faucet.sepolia.mantle.xyz/
- https://faucet.quicknode.com/mantle/sepolia

### 4. Compile Contract
```bash
npm run compile
```

### 5. Deploy to Mantle Sepolia
```bash
npm run deploy:sepolia
```

After deployment, you'll see output like:
```
RealTeraAttestation deployed to: 0x...
Add these to your .env.local:
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### 6. Test Minting (Optional)
```bash
CONTRACT_ADDRESS=0x... npm run test-mint
```

## Contract Functions

### Minting
- `mintVerificationBadge(address, badgeType, projectSlug, tier, score, validityDays)`
- `mintPropertyNFT(address, projectSlug, projectName, district, tier, score, pricePerSqm)`
- `mintDeveloperSBT(address, developerSlug, tier, score)`

### Reading
- `verifications(tokenId)` - Get verification data
- `properties(tokenId)` - Get property NFT data
- `isVerificationValid(tokenId)` - Check if verification is still valid
- `balanceOf(address, tokenId)` - Check token balance

## Network Details

| Network | Chain ID | RPC | Explorer |
|---------|----------|-----|----------|
| Mantle Sepolia | 5003 | https://rpc.sepolia.mantle.xyz | https://explorer.sepolia.mantle.xyz |
| Mantle Mainnet | 5000 | https://rpc.mantle.xyz | https://explorer.mantle.xyz |

## Security

- Never commit your `.env` file
- Keep your private keys secure
- Test thoroughly on testnet before mainnet
