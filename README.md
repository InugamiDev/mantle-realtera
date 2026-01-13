# RealTera - Vietnamese Real Estate Intelligence Platform

<p align="center">
  <img src="public/realtera-logo.svg" alt="RealTera Logo" width="200"/>
</p>

<p align="center">
  <strong>Transparent real estate rating & verification platform on Mantle Network</strong>
</p>

<p align="center">
  <a href="#problem">Problem</a> •
  <a href="#solution">Solution</a> •
  <a href="#features">Features</a> •
  <a href="#why-mantle">Why Mantle</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#installation">Installation</a>
</p>

---

## Problem

### Vietnam's Real Estate Market Faces a Trust Crisis

| Problem | Reality |
|---------|---------|
| **Lack of transparency** | 70% of buyers don't know if a project has complete legal documentation |
| **Fragmented information** | Data scattered across multiple sources, hard to aggregate |
| **Legal fraud** | Thousands of buyers have lost capital due to unlicensed projects |
| **Unreliable reviews** | Reviews can be bought, rankings based on advertising |
| **No audit trail** | No evidence of verification history |

### Notable Cases

- **Alibaba Tay Bac** - 700+ victims, 2,500 billion VND in losses
- **Dia Oc Phu Hong** - Ghost project, buyers lost everything
- **King Bay** - Built without permits, forced demolition
- **Hundreds of projects** in unclear legal status

---

## Solution

### RealTera: Independent, Transparent, On-Chain Rating Platform

```
┌─────────────────────────────────────────────────────────────────┐
│                         RealTera Stack                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Web App   │  │  Mobile PWA │  │     Developer API       │  │
│  │  (Next.js)  │  │             │  │    (REST + GraphQL)     │  │
│  └──────┬──────┘  └──────┬──────┘  └────────────┬────────────┘  │
│         │                │                      │               │
│  ┌──────┴────────────────┴──────────────────────┴──────────┐    │
│  │                    RealTera Core                        │    │
│  │  • Scoring Engine (0-100 score, SSS-F tier)            │    │
│  │  • Multi-source Data Aggregation                        │    │
│  │  • Due Diligence Workflow                               │    │
│  │  • Evidence Hash Generation (SHA-256)                   │    │
│  └──────────────────────────┬──────────────────────────────┘    │
│                             │                                   │
│  ┌──────────────────────────┴──────────────────────────────┐    │
│  │              Mantle Attestation Layer                   │    │
│  │  • Non-transferable Attestations (Soulbound)           │    │
│  │  • Tiered Verification (0-4)                           │    │
│  │  • Immutable Audit Trail                               │    │
│  │  • Dispute Resolution                                   │    │
│  │  • B2B Event Subscriptions                             │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Key Differentiators

| Criteria | Traditional | RealTera |
|----------|-------------|----------|
| **Rating source** | Paid advertising | Multi-source verification |
| **Evidence** | None / easily faked | On-chain, immutable |
| **Audit trail** | Non-existent | Full history on Mantle |
| **Disputes** | Hard to file complaints | Transparent process |
| **B2B Integration** | Manual / closed API | Events + REST API |

---

## Features

### 1. Tier Rating System

```
┌──────────────────────────────────────────────────────────────┐
│                    RealTera Tier System                       │
├──────────────────────────────────────────────────────────────┤
│  SSS  │ 95-100 │ Exceptional    │ Legendary project          │
│  S+   │ 90-94  │ Outstanding    │ Excellent in all aspects   │
│  S    │ 85-89  │ Excellent      │ High quality               │
│  A    │ 75-84  │ Very Good      │ Reliable                   │
│  B    │ 65-74  │ Good           │ Stable                     │
│  C    │ 55-64  │ Average        │ Needs consideration        │
│  D    │ 45-54  │ Below Average  │ High risk                  │
│  F    │ 0-44   │ Poor           │ Not recommended            │
└──────────────────────────────────────────────────────────────┘
```

### 2. On-Chain Attestation Registry (Mantle)

```solidity
// Smart Contract: RealTeraAttestationRegistry.sol
// Deployed on Mantle Sepolia: 0xF75bc5070702cC1fe5f56dB3d22e4F452D5a40a7

struct Attestation {
    bytes32 assetId;           // Unique property identifier
    uint8 tier;                // 0-4 verification tier
    uint256 checksPassed;      // Bitmask of passed checks
    bytes32 evidenceHash;      // SHA-256 hash of evidence bundle
    uint256 issuedAt;          // Timestamp
    uint256 expiresAt;         // Expiry (0 = never)
    address signer;            // RealTera
    address coSigner;          // Partner co-signature
    bool disputed;             // Under dispute?
    bool revoked;              // Revoked?
}
```

**Verification Checks (Bitmask):**
- `CHECK_LEGAL_STATUS` - Construction permit
- `CHECK_OWNERSHIP_TITLE` - Land use rights certificate
- `CHECK_CONSTRUCTION_PERMIT` - Construction license
- `CHECK_DEVELOPER_BACKGROUND` - Developer history
- `CHECK_FINANCIAL_HEALTH` - Financial health
- `CHECK_CONSTRUCTION_PROGRESS` - Actual progress
- `CHECK_REGISTRY_CORROBORATION` - Registry verification
- `CHECK_PARTNER_COSIGN` - Partner co-signature

### 3. Consumer Features (B2C)

| Feature | Description |
|---------|-------------|
| **Project Rankings** | Project rankings by tier and score |
| **Project Detail** | Legal details, risks, estimated ROI |
| **Compare Tool** | Side-by-side comparison of 2-4 projects |
| **Watchlist** | Track projects of interest |
| **Portfolio Tracker** | Manage investment portfolio |
| **Calculator Suite** | Rental yield, mortgage, investment |
| **Advisor Bot** | Project consultation chatbot |
| **Alerts** | Legal change notifications |
| **Market Heatmaps** | Price heatmaps by area |
| **Comments & Reviews** | Community reviews |

### 4. Business Features (B2B)

| Feature | Description | Pricing Model |
|---------|-------------|---------------|
| **Verification API** | Legal verification API | Per-call |
| **Developer Portal** | Dashboard for developers | Subscription |
| **Agency Workspace** | Tools for agents | Subscription |
| **Embeddable Widget** | Widget for embedding | License |
| **Lead Generation** | Potential customer data | Per-lead |
| **Market Data API** | Market data | Tiered access |
| **White-label** | OEM solutions | Enterprise |

### 5. Revenue Streams (31 total)

```
┌─────────────────────────────────────────────────────────────┐
│                   RealTera Revenue Model                     │
├─────────────────────────────────────────────────────────────┤
│  B2C Subscriptions      │  Pro: $8/mo │ Enterprise: $80/mo  │
│  B2B API Calls          │  $0.5 - $5 per verification       │
│  Sponsored Placements   │  Auction-based, transparent       │
│  Lead Generation        │  Per qualified lead               │
│  Due Diligence Reports  │  $20 - $200 per report            │
│  Market Data Licensing  │  Tiered enterprise licensing      │
│  Consulting Services    │  Project-based                    │
│  Annual Awards          │  Sponsorship + tickets            │
└─────────────────────────────────────────────────────────────┘
```

---

## Why Mantle?

### 1. Low Transaction Costs

| Network | Avg Gas Cost | Suitable for |
|---------|--------------|--------------|
| Ethereum | $5-50 | ❌ Too expensive |
| Polygon | $0.01-0.1 | ⚠️ Okay but limited |
| **Mantle** | **$0.001-0.01** | ✅ Perfect for attestations |
| Solana | $0.001 | ⚠️ Different ecosystem |

**Why it matters:** Each project needs multiple attestation updates. Low cost = sustainable business model.

### 2. EVM Compatibility

```typescript
// Seamless integration with existing tooling
import { mantleSepolia } from "@/lib/mantle";
import { createPublicClient, http } from "viem";

const client = createPublicClient({
  chain: mantleSepolia,
  transport: http(),
});
```

**Why it matters:** Team has Solidity/EVM experience. No need to learn new languages.

### 3. Data Availability (EigenDA)

- **Modular architecture** - Separate DA layer
- **High throughput** - Can handle large volume
- **Future-proof** - Ready to scale

### 4. Growing Ecosystem

- **DeFi protocols** - Can integrate with lending (collateralized by verified property)
- **Enterprise focus** - Mantle targets B2B use cases
- **Grant programs** - Good support for builders

### 5. Technical Alignment

| RealTera Requirement | Mantle Capability |
|---------------------|-------------------|
| Frequent small writes | ✅ Low gas, fast finality |
| B2B event monitoring | ✅ Standard EVM events |
| Long-term storage | ✅ EigenDA + Ethereum settlement |
| Co-signer workflow | ✅ Multi-sig friendly |
| Batch operations | ✅ Efficient batch reads |

---

## What Does Mantle Gain?

### 1. Real World Asset (RWA) Use Case

```
┌─────────────────────────────────────────────────────────────┐
│                 RWA Market Opportunity                       │
├─────────────────────────────────────────────────────────────┤
│  Vietnam Real Estate Market: $50B+ annually                 │
│  Southeast Asia: $300B+ annually                            │
│  Global Real Estate: $300T+ total value                     │
│                                                             │
│  RealTera brings VERIFIED real estate data on-chain         │
│  → Foundation for future RWA tokenization on Mantle         │
└─────────────────────────────────────────────────────────────┘
```

### 2. Enterprise Adoption Driver

| Benefit | Impact |
|---------|--------|
| **Banks integration** | Banks verify property before lending → Mantle txns |
| **Insurance companies** | Verify before issuing policies → Mantle txns |
| **Government agencies** | Query verification status → Mantle txns |
| **Real estate platforms** | Embed verification → Mantle txns |

**Projected volume:** 10,000+ attestations/year = 100,000+ on-chain transactions

### 3. Sticky B2B Revenue

```
Developer pays RealTera
       │
       ▼
RealTera issues attestation on Mantle
       │
       ▼
Banks/Insurers query Mantle
       │
       ▼
Ongoing monitoring = recurring transactions
       │
       ▼
Dispute resolution = more transactions
```

**Network effect:** Each verified project → multiple parties query → more transactions

### 4. Geographic Expansion Template

```
Vietnam (2025)
    │
    ├── Thailand (2026)
    │
    ├── Indonesia (2026)
    │
    ├── Philippines (2027)
    │
    └── India (2028)
```

**Each market = new transaction volume on Mantle**

### 5. Thought Leadership

- **First mover** in on-chain real estate verification
- **Case study** for enterprise blockchain adoption
- **Conference talks** featuring Mantle
- **Media coverage** highlighting Mantle integration

### 6. Metrics for Mantle

| Metric | Year 1 Target | Year 3 Target |
|--------|---------------|---------------|
| Attestations issued | 1,000 | 50,000 |
| B2B API calls | 50,000 | 2,000,000 |
| On-chain transactions | 100,000 | 5,000,000 |
| Active verifiers | 10 | 100 |
| Dispute resolutions | 50 | 1,000 |

---

## Roadmap

### Phase 1: Foundation ✅ COMPLETE

- [x] Database schema (50+ tables)
- [x] Authentication (Stack Auth + SIWE)
- [x] Core API routes (30+ endpoints)
- [x] Calculator Suite (rental-yield, investment, mortgage)
- [x] Watchlist & Portfolio tracking
- [x] i18n (Vietnamese + English)
- [x] Glassmorphism UI (Golden Lumière theme)

### Phase 2: Mantle Integration ✅ COMPLETE

- [x] Smart contract: `RealTeraAttestationRegistry.sol`
- [x] Attestation service (read/write)
- [x] Mantle Sepolia deployment
- [x] UI: AttestationBadge, AttestationDetails
- [x] Mock mode for development
- [x] Evidence hash anchoring

### Phase 3: Revenue Launch (Q2 2025)

- [ ] Stripe payment integration (subscriptions)
- [ ] Developer self-service portal
- [ ] Agency workspace
- [ ] Due diligence report generation
- [ ] Lead generation system
- [ ] Sponsored placement auctions

### Phase 4: Scale (Q3-Q4 2025)

- [ ] Mantle Mainnet deployment
- [ ] Partner co-signer network
- [ ] B2B event subscriptions
- [ ] API marketplace
- [ ] Mobile app (React Native)
- [ ] Automated monitoring

### Phase 5: Expansion (2026+)

- [ ] Thailand market entry
- [ ] Indonesia market entry
- [ ] Cross-border verification
- [ ] DAO governance
- [ ] Property tokenization (RWA)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind v4 |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Database** | PostgreSQL |
| **Auth** | Stack Auth + SIWE (Sign-In with Ethereum) |
| **Blockchain** | Mantle Network (Sepolia → Mainnet) |
| **Smart Contracts** | Solidity 0.8.20, OpenZeppelin |
| **Payments** | Stripe |
| **i18n** | next-intl |
| **Design** | Glassmorphism (Golden Lumière) |

---

## Installation

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- pnpm or npm

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/realtera.git
cd realtera

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Setup database
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=...
STACK_SECRET_SERVER_KEY=...

# Mantle (optional - uses mock mode if not set)
NEXT_PUBLIC_MANTLE_RPC_URL=https://rpc.sepolia.mantle.xyz
NEXT_PUBLIC_REGISTRY_ADDRESS=0xF75bc5070702cC1fe5f56dB3d22e4F452D5a40a7

# Stripe (for payments)
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

---

## Smart Contract

### Deployment (Mantle Sepolia)

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network mantleSepolia
```

### Contract Address

```
Mantle Sepolia: 0xF75bc5070702cC1fe5f56dB3d22e4F452D5a40a7
Mantle Mainnet: TBD
```

### Verification

```bash
npx hardhat verify --network mantleSepolia 0xF75bc5070702cC1fe5f56dB3d22e4F452D5a40a7
```

---

## API Reference

### Public Endpoints

```
GET  /api/v1/projects              # List projects
GET  /api/v1/projects/:slug        # Project details
GET  /api/v1/developers            # List developers
GET  /api/v1/developers/:slug      # Developer details
GET  /api/v1/attestations/:assetId # Get attestation
```

### Protected Endpoints (API Key required)

```
POST /api/v1/verification          # Request verification
GET  /api/v1/market-data           # Market data
GET  /api/v1/leads                 # Lead data (B2B)
```

---

## Team

| Role | Background |
|------|------------|
| **Founder** | Ex-real estate, blockchain enthusiast |
| **Tech Lead** | Full-stack, Solidity, 10+ years |
| **Product** | PropTech, UX research |
| **BD** | Real estate partnerships |

---

## Links

- **Website**: [realtera.vn](https://realtera.vn) (coming soon)
- **Demo**: [demo.realtera.vn](https://demo.realtera.vn)
- **Docs**: [docs.realtera.vn](https://docs.realtera.vn)
- **Contract**: [View on MantleScan](https://sepolia.mantlescan.xyz/address/0xF75bc5070702cC1fe5f56dB3d22e4F452D5a40a7)

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built with love on Mantle Network</strong>
  <br/>
  <sub>Mantle Global Hackathon 2025</sub>
</p>
