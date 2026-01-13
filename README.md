# RealTera - Vietnamese Real Estate Intelligence Platform

<p align="center">
  <img src="public/realtera-logo.svg" alt="RealTera Logo" width="200"/>
</p>

<p align="center">
  <strong>Nền tảng xếp hạng & xác minh bất động sản minh bạch trên Mantle Network</strong>
</p>

<p align="center">
  <a href="#vấn-đề">Vấn đề</a> •
  <a href="#giải-pháp">Giải pháp</a> •
  <a href="#chức-năng">Chức năng</a> •
  <a href="#tại-sao-mantle">Tại sao Mantle</a> •
  <a href="#lộ-trình">Lộ trình</a> •
  <a href="#cài-đặt">Cài đặt</a>
</p>

---

## Vấn đề

### Thị trường BĐS Việt Nam đang đối mặt với khủng hoảng niềm tin

| Vấn đề | Thực trạng |
|--------|------------|
| **Thiếu minh bạch** | 70% người mua không biết dự án có đầy đủ pháp lý hay không |
| **Thông tin phân mảnh** | Dữ liệu nằm rải rác trên nhiều nguồn, khó tổng hợp |
| **Gian lận pháp lý** | Hàng nghìn người mua bị "chôn vốn" vì dự án không có giấy phép |
| **Đánh giá không đáng tin** | Reviews có thể bị mua, xếp hạng dựa trên quảng cáo |
| **Không có audit trail** | Không có bằng chứng về lịch sử xác minh |

### Các vụ việc điển hình

- **Alibaba Tây Bắc** - 700+ nạn nhân, thiệt hại 2,500 tỷ VNĐ
- **Địa ốc Phú Hồng** - Dự án ma, người mua mất trắng
- **King Bay** - Xây không phép, bị cưỡng chế
- **Hàng trăm dự án** đang trong tình trạng pháp lý không rõ ràng

---

## Giải pháp

### RealTera: Nền tảng xếp hạng độc lập, minh bạch, on-chain

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

### Điểm khác biệt

| Tiêu chí | Truyền thống | RealTera |
|----------|--------------|----------|
| **Nguồn đánh giá** | Quảng cáo trả tiền | Multi-source verification |
| **Bằng chứng** | Không có / dễ giả mạo | On-chain, immutable |
| **Audit trail** | Không tồn tại | Full history on Mantle |
| **Dispute** | Khó khiếu nại | Quy trình minh bạch |
| **B2B Integration** | Manual / API đóng | Events + REST API |

---

## Chức năng

### 1. Hệ thống xếp hạng AI (Tier System)

```
┌──────────────────────────────────────────────────────────────┐
│                    RealTera Tier System                       │
├──────────────────────────────────────────────────────────────┤
│  SSS  │ 95-100 │ Exceptional    │ Dự án huyền thoại         │
│  S+   │ 90-94  │ Outstanding    │ Xuất sắc toàn diện        │
│  S    │ 85-89  │ Excellent      │ Chất lượng cao            │
│  A    │ 75-84  │ Very Good      │ Đáng tin cậy              │
│  B    │ 65-74  │ Good           │ Ổn định                   │
│  C    │ 55-64  │ Average        │ Cần cân nhắc              │
│  D    │ 45-54  │ Below Average  │ Rủi ro cao                │
│  F    │ 0-44   │ Poor           │ Không khuyến nghị         │
└──────────────────────────────────────────────────────────────┘
```

### 2. On-Chain Attestation Registry (Mantle)

```solidity
// Smart Contract: RealTeraAttestationRegistry.sol
// Deployed on Mantle Sepolia

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
- `CHECK_LEGAL_STATUS` - Giấy phép xây dựng
- `CHECK_OWNERSHIP_TITLE` - Giấy chứng nhận quyền sử dụng đất
- `CHECK_CONSTRUCTION_PERMIT` - Giấy phép thi công
- `CHECK_DEVELOPER_BACKGROUND` - Lịch sử chủ đầu tư
- `CHECK_FINANCIAL_HEALTH` - Sức khỏe tài chính
- `CHECK_CONSTRUCTION_PROGRESS` - Tiến độ thực tế
- `CHECK_REGISTRY_CORROBORATION` - Đối chiếu cơ quan đăng ký
- `CHECK_PARTNER_COSIGN` - Đồng ký kết từ đối tác

### 3. Consumer Features (B2C)

| Feature | Mô tả |
|---------|-------|
| **Project Rankings** | Bảng xếp hạng dự án theo tier, điểm số |
| **Project Detail** | Chi tiết pháp lý, rủi ro, ROI ước tính |
| **Compare Tool** | So sánh song song 2-4 dự án |
| **Watchlist** | Theo dõi dự án quan tâm |
| **Portfolio Tracker** | Quản lý danh mục đầu tư |
| **Calculator Suite** | Rental yield, mortgage, investment |
| **Advisor Bot** | Chatbot tư vấn dự án |
| **Alerts** | Thông báo thay đổi pháp lý |
| **Market Heatmaps** | Bản đồ nhiệt giá theo khu vực |
| **Comments & Reviews** | Đánh giá từ cộng đồng |

### 4. Business Features (B2B)

| Feature | Mô tả | Pricing Model |
|---------|-------|---------------|
| **Verification API** | API xác minh pháp lý | Per-call |
| **Developer Portal** | Dashboard cho chủ đầu tư | Subscription |
| **Agency Workspace** | Công cụ cho đại lý | Subscription |
| **Embeddable Widget** | Widget nhúng vào website | License |
| **Lead Generation** | Dữ liệu khách hàng tiềm năng | Per-lead |
| **Market Data API** | Dữ liệu thị trường | Tiered access |
| **White-label** | Giải pháp OEM | Enterprise |

### 5. Revenue Streams (31 total)

```
┌─────────────────────────────────────────────────────────────┐
│                   RealTera Revenue Model                     │
├─────────────────────────────────────────────────────────────┤
│  B2C Subscriptions      │  Pro: 199k/mo │ Enterprise: 2M/mo │
│  B2B API Calls          │  0.5$ - 5$ per verification       │
│  Sponsored Placements   │  Auction-based, transparent       │
│  Lead Generation        │  Per qualified lead               │
│  Due Diligence Reports  │  500k - 5M per report             │
│  Market Data Licensing  │  Tiered enterprise licensing      │
│  Consulting Services    │  Project-based                    │
│  Annual Awards          │  Sponsorship + tickets            │
└─────────────────────────────────────────────────────────────┘
```

---

## Tại sao Mantle?

### 1. Chi phí giao dịch thấp

| Network | Avg Gas Cost | Suitable for |
|---------|--------------|--------------|
| Ethereum | $5-50 | ❌ Too expensive |
| Polygon | $0.01-0.1 | ⚠️ Okay but limited |
| **Mantle** | **$0.001-0.01** | ✅ Perfect for attestations |
| Solana | $0.001 | ⚠️ Different ecosystem |

**Why it matters:** Mỗi dự án cần nhiều attestation updates. Chi phí thấp = sustainable business model.

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

**Why it matters:** Team có kinh nghiệm Solidity/EVM. Không cần học ngôn ngữ mới.

### 3. Data Availability (EigenDA)

- **Modular architecture** - DA layer tách biệt
- **High throughput** - Xử lý được volume lớn
- **Future-proof** - Sẵn sàng cho scale

### 4. Growing Ecosystem

- **DeFi protocols** - Có thể tích hợp với lending (collateralized by verified property)
- **Enterprise focus** - Mantle đang nhắm vào B2B use cases
- **Grant programs** - Hỗ trợ tốt cho builders

### 5. Technical Alignment

| RealTera Requirement | Mantle Capability |
|---------------------|-------------------|
| Frequent small writes | ✅ Low gas, fast finality |
| B2B event monitoring | ✅ Standard EVM events |
| Long-term storage | ✅ EigenDA + Ethereum settlement |
| Co-signer workflow | ✅ Multi-sig friendly |
| Batch operations | ✅ Efficient batch reads |

---

## Mantle được lợi gì?

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

**Network effect:** Mỗi dự án được xác minh → nhiều bên query → nhiều giao dịch hơn

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

## Lộ trình

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

## Cài đặt

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
NEXT_PUBLIC_REGISTRY_ADDRESS=0x...

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
Mantle Sepolia: 0x... (pending deployment)
Mantle Mainnet: TBD
```

### Verification

```bash
npx hardhat verify --network mantleSepolia <CONTRACT_ADDRESS>
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
- **Contract**: [Mantle Explorer](https://explorer.sepolia.mantle.xyz)

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built with love on Mantle Network</strong>
  <br/>
  <sub>Mantle Global Hackathon 2025</sub>
</p>
