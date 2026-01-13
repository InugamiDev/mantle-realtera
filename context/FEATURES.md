# RealTera Features Documentation

## Overview
RealTera is a Vietnamese real estate intelligence platform with 31 revenue streams organized across 4 phases.

---

## Phase 1: Foundation Features

### 1. Database Schema
**Status:** ✅ Complete
**File:** `prisma/schema.prisma`
**Description:** 50+ PostgreSQL tables covering projects, developers, users, subscriptions, transactions, and all platform data.

### 2. Authentication (Stack Auth)
**Status:** ✅ Complete
**Files:** `src/app/handler/[...stack]/`, `src/components/auth/`
**Description:** Full authentication system with user tiers (FREE, PRO, ENTERPRISE, DEVELOPER). Includes sign in/out, session management, and role-based access.

### 3. Core API Routes
**Status:** ✅ Complete
**Files:** `src/app/api/v1/`
**Endpoints:**
- `GET /api/v1/projects` - List projects with filters (tier, district, developer)
- `GET /api/v1/projects/[slug]` - Single project details
- `GET /api/v1/developers` - List developers
- `GET /api/v1/developers/[slug]` - Developer profile with projects
- `GET /api/v1/search` - Global search across projects/developers
- `GET /api/v1/health` - System health check

### 4. Calculator Suite
**Status:** ✅ Complete
**Files:** `src/app/calculator/`
**Pages:**
- `/calculator` - Main rent vs buy calculator
- `/calculator/rental-yield` - Rental yield calculator
- `/calculator/investment` - Investment ROI calculator
- `/calculator/mortgage` - Mortgage payment calculator

**Description:** Financial tools to help users make informed real estate decisions. All calculators are responsive and support both Vietnamese and English.

### 5. Sponsored Tag Auction
**Status:** ✅ Complete
**File:** `src/app/api/v1/auctions/route.ts`
**Description:** Bidding system for developers to sponsor project tags/badges. Includes auction creation, bidding, and winner determination.

### 6. Watchlist Monitoring
**Status:** ✅ Complete
**Files:** `src/app/api/v1/watchlist/`, `src/contexts/WatchlistContext.tsx`
**Description:** Users can save/watch projects. Includes real-time sync across devices and notification preferences.

---

## Phase 2: Revenue Features

### 7. Stripe Payment Integration
**Status:** ✅ Complete
**Files:** `src/app/api/webhooks/stripe/`, `src/lib/stripe.ts`
**Description:** Full Stripe integration for subscriptions, one-time payments, and webhook handling.

### 8. Verification Service
**Status:** ✅ Complete
**File:** `src/app/api/v1/verification/route.ts`
**Description:** Paid verification service for projects. Tiers: BASIC (1M VND), STANDARD (3M VND), PREMIUM (5M VND). Includes document verification, on-site inspection, and verification badge.

### 9. Subscription Plans
**Status:** ✅ Complete
**File:** `src/app/api/v1/subscriptions/route.ts`
**Plans:**
- FREE: Basic access, limited searches
- PRO (199K/mo): Advanced filters, alerts, portfolio tracking
- ENTERPRISE (999K/mo): API access, bulk exports, priority support

### 10. Due Diligence Reports
**Status:** ✅ Complete
**File:** `src/app/api/v1/reports/route.ts`
**Description:** Comprehensive reports on projects. Types: BASIC (legal check), STANDARD (+ market analysis), COMPREHENSIVE (+ risk assessment, projections).

### 11. Portfolio Tracker
**Status:** ✅ Complete
**Files:** `src/app/api/v1/portfolio/`, `src/app/portfolio/page.tsx`
**Description:** Track owned properties, valuations, rental income, and portfolio performance over time.

### 12. Developer Scorecards
**Status:** ✅ Complete
**File:** `src/components/realtera/DeveloperScorecard.tsx`
**Description:** Detailed developer profiles with scores across: Project Delivery, Financial Health, Customer Satisfaction, Legal Compliance, Innovation.

### 13. Market Data API
**Status:** ✅ Complete
**File:** `src/app/api/v1/market-data/route.ts`
**Description:** Market statistics including: overview stats, district breakdowns, price trends, tier distribution, verification rates.

### 14. Platform Licensing
**Status:** ⏳ Pending (Business setup)
**Description:** White-label solution for real estate agencies to use RealTera's platform with their branding.

### 15. Price Prediction Models
**Status:** ⏳ Pending (Requires ML)
**Description:** Machine learning models to predict property price trends.

---

## Phase 3: Advanced Features

### 16. Buyer Intent Data
**Status:** ✅ Complete
**File:** `src/app/api/v1/intent-data/route.ts`
**Description:** Marketplace for developers to purchase aggregated buyer interest data. Includes search patterns, saved projects, calculator usage by district.

### 17. Developer Consulting
**Status:** ✅ Complete
**File:** `src/app/api/v1/consulting/route.ts`
**Description:** Consulting service to help developers improve their tier ranking. Includes tier improvement roadmaps, gap analysis, and actionable recommendations.

### 18. Embeddable Widgets
**Status:** ✅ Complete
**File:** `src/app/api/v1/widget/[slug]/route.ts`
**Description:** Embed RealTera badges/scores on external websites. Developers can showcase their verification status and tier ranking.

### 19. Lead Generation
**Status:** ✅ Complete
**File:** `src/app/api/v1/leads/route.ts`
**Description:** Connect interested buyers with developers. Includes lead capture forms, qualification, and distribution to verified developers.

### 20. Annual Awards
**Status:** ✅ Complete
**Files:** `src/app/api/v1/awards/route.ts`, `src/app/awards/page.tsx`
**Description:** RealTera Annual Awards celebrating best developers and projects. Includes nominations, voting, and ceremony management.

### 21. Quarterly Market Reports
**Status:** ✅ Complete
**File:** `src/app/api/v1/market-reports/route.ts`
**Description:** Comprehensive quarterly reports covering market trends, price analysis, supply/demand, and forecasts. Premium feature for PRO/ENTERPRISE users.

### 22. Property Valuation
**Status:** ✅ Complete
**Files:** `src/app/api/v1/valuation/route.ts`, `src/app/valuation/page.tsx`
**Description:** AI-powered property valuation based on location, size, amenities, and market data. Provides estimated range and confidence score.

### 23. Construction Progress
**Status:** ✅ Complete
**File:** `src/app/api/v1/construction/route.ts`
**Description:** Track construction progress for ongoing projects. Includes milestones, photo updates, delay tracking, and completion estimates.

### 24. New Launch Alerts
**Status:** ✅ Complete
**File:** `src/app/api/v1/alerts/route.ts`
**Description:** Notification system for new project launches. Users can set preferences by location, price range, developer, and tier.

### 25. Custom Alert Triggers
**Status:** ✅ Complete
**File:** `src/app/api/v1/alerts/triggers/route.ts`
**Description:** Advanced alert system with custom conditions: price changes, tier upgrades, verification status, construction milestones.

### 26. Neighborhood Intelligence
**Status:** ✅ Complete
**File:** `src/app/api/v1/neighborhoods/route.ts`
**Description:** Detailed neighborhood data including: amenities, schools, transport, crime rates, development plans, price trends.

### 27. Market Heatmaps
**Status:** ✅ Complete
**Files:** `src/app/api/v1/heatmaps/route.ts`, `src/app/market/page.tsx`
**Description:** Geographic visualization of market data. Types: project density, average prices, quality tiers, demand levels, growth trends.

### 28. Infrastructure Impact
**Status:** ✅ Complete
**File:** `src/app/api/v1/infrastructure/route.ts`
**Description:** Analysis of how infrastructure projects (metro, highways, airports) affect property values in surrounding areas.

### 29. AI Advisor Chatbot
**Status:** ✅ Complete
**Files:** `src/app/api/v1/advisor/route.ts`, `src/app/advisor/page.tsx`
**Description:** AI-powered real estate advisor. Users can ask questions about projects, compare options, and get personalized recommendations.

### 30. Competitive Intelligence
**Status:** ✅ Complete
**File:** `src/app/api/v1/intelligence/route.ts`
**Description:** Market intelligence for developers. Includes competitor analysis, market positioning, pricing benchmarks, and opportunity identification.

---

## Phase 4: Blockchain Features (Pending)

### 31. Solana Attestations
**Status:** ⏳ Pending
**Description:** On-chain attestations for verification status using Solana blockchain.

### 32. Verification History as SBT
**Status:** ⏳ Pending
**Description:** Soul-bound tokens recording permanent verification history.

### 33. cNFT Project Profiles
**Status:** ⏳ Pending
**Description:** Compressed NFTs representing project profiles with verifiable metadata.

### 34. Switchboard Oracle
**Status:** ⏳ Pending
**Description:** Oracle integration for on-chain price feeds and market data.

### 35. Realms DAO Governance
**Status:** ⏳ Pending
**Description:** Community governance for platform decisions using Solana Realms.

---

## UI Pages Summary

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Home | `/` | ✅ | Project rankings with filters |
| Developers | `/developers` | ✅ | Developer directory |
| Developer Detail | `/developers/[slug]` | ✅ | Developer profile |
| Project Detail | `/project/[slug]` | ✅ | Project details |
| Calculator | `/calculator` | ✅ | Rent vs Buy calculator |
| Rental Yield | `/calculator/rental-yield` | ✅ | Rental yield calculator |
| Investment | `/calculator/investment` | ✅ | Investment ROI |
| Mortgage | `/calculator/mortgage` | ✅ | Mortgage calculator |
| Market | `/market` | ✅ | Market heatmaps |
| AI Advisor | `/advisor` | ✅ | AI chatbot |
| Awards | `/awards` | ✅ | Annual awards |
| Valuation | `/valuation` | ✅ | Property valuation |
| Portfolio | `/portfolio` | ✅ | Portfolio tracker |
| Saved | `/saved` | ✅ | Watchlist |
| Compare | `/compare` | ✅ | Project comparison |
| Methodology | `/methodology` | ✅ | Rating methodology |
| About | `/about` | ✅ | About RealTera |
| Verification | `/verification` | ✅ | Verification info |
| Sponsorship | `/sponsorship` | ✅ | Sponsorship info |
