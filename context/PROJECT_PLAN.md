# RealTera - Vietnamese Real Estate Intelligence Platform

## Quick Links
- [Features Documentation](./FEATURES.md) - All 31 features with descriptions
- [Development Progress](./PROGRESS.md) - Current status and completion
- [Roadmap](./ROADMAP.md) - Future plans and timeline
- [API Reference](./API_REFERENCE.md) - Full API documentation

---

## Vision
A tier-ranking platform for Vietnamese real estate that prioritizes transparency over advertising. We are an **intelligence/rating platform** - NOT property owners. Revenue comes from verification, data, subscriptions, and sponsored placements.

## Mission
1. **Transparency First** - Ratings based on data, not advertising spend
2. **Buyer Empowerment** - Give home buyers tools to make informed decisions
3. **Quality Recognition** - Help good developers stand out through merit
4. **Market Intelligence** - Provide actionable real estate insights

---

## Tech Stack
- **Frontend**: Next.js 16 + React 19 + Tailwind v4
- **Database**: PostgreSQL + Prisma ORM (50+ tables)
- **Auth**: Stack Auth (user tiers: FREE, PRO, ENTERPRISE, DEVELOPER)
- **Payments**: Stripe
- **i18n**: next-intl (Vietnamese default, English)
- **Blockchain**: Solana (Phase 4 - future)
- **Design**: Golden Lumière glassmorphism theme

---

## AI-Determined Fields
These fields are computed by AI, not user input:
- `tier` (SSS, S+, S, A, B, C, D, F)
- `score` (0-100)
- `verdict`
- `signals`
- `roiLabel`
- `whyBullets`
- `keyRisks`
- `scoreBreakdown`

---

## Project Status Overview

| Phase | Status | Features |
|-------|--------|----------|
| Phase 1: Foundation | ✅ Complete | 6/6 |
| Phase 2: Revenue | ✅ Complete* | 13/15 |
| Phase 3: Advanced | ✅ Complete | 15/15 |
| Phase 4: Blockchain | ⏳ Pending | 0/5 |

*2 items pending: Platform Licensing (business), Price Prediction (ML)

---

## Phase 1: Foundation ✅ COMPLETE
1. ✅ Database schema (Prisma - 50+ tables)
2. ✅ Authentication (Stack Auth)
3. ✅ Core API routes (projects, developers, search)
4. ✅ Calculator Suite (rental-yield, investment, mortgage)
5. ✅ Sponsored Tag Auction
6. ✅ Watchlist Monitoring

## Phase 2: Core Revenue ✅ COMPLETE
7. ✅ Stripe payment integration
8. ✅ Verification API (`/api/v1/verification`)
9. ✅ Subscriptions API (`/api/v1/subscriptions`)
10. ✅ Due Diligence Reports (`/api/v1/reports`)
11. ✅ Portfolio Tracker (`/api/v1/portfolio`)
12. ✅ Developer Scorecards (component + data)
13. ✅ Market Data API (`/api/v1/market-data`)
14. ⏳ Platform Licensing (white-label) - business setup
15. ⏳ Price Prediction Models - requires ML

## Phase 3: Advanced Features ✅ COMPLETE
16. ✅ Buyer Intent Data (`/api/v1/intent-data`)
17. ✅ Developer Consulting (`/api/v1/consulting`)
18. ✅ Embeddable Widgets (`/api/v1/widget/[slug]`)
19. ✅ Lead Generation (`/api/v1/leads`)
20. ✅ RealTera Annual Awards (`/api/v1/awards`)
21. ✅ Quarterly Market Reports (`/api/v1/market-reports`)
22. ✅ Property Valuation (`/api/v1/valuation`)
23. ✅ Construction Progress (`/api/v1/construction`)
24. ✅ New Launch Alerts (`/api/v1/alerts`)
25. ✅ Custom Alert Triggers (`/api/v1/alerts/triggers`)
26. ✅ Neighborhood Intelligence (`/api/v1/neighborhoods`)
27. ✅ Market Heatmaps (`/api/v1/heatmaps`)
28. ✅ Infrastructure Impact (`/api/v1/infrastructure`)
29. ✅ AI Advisor Chatbot (`/api/v1/advisor`)
30. ✅ Competitive Intelligence (`/api/v1/intelligence`)

## Phase 4: Blockchain Integration ⏳ PENDING
31. ⏳ Solana Attestations
32. ⏳ Verification History as SBT
33. ⏳ cNFT Project Profiles
34. ⏳ Switchboard Oracle
35. ⏳ Realms DAO governance

---

## UI Pages (17 total)

| Page | Route | i18n | Description |
|------|-------|------|-------------|
| Home | `/` | ✅ | Project rankings with filters |
| Developers | `/developers` | ✅ | Developer directory |
| Developer Detail | `/developers/[slug]` | ✅ | Developer profile |
| Project Detail | `/project/[slug]` | ✅ | Project details |
| Calculator | `/calculator` | ✅ | Rent vs Buy calculator |
| Rental Yield | `/calculator/rental-yield` | ✅ | Rental yield tool |
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

---

## What's Next

### Immediate Priority
1. **Database Integration** - Replace mock data with Prisma queries
2. **Testing** - Add unit, integration, and E2E tests
3. **Auth Guards** - Protect premium routes by user tier
4. **Admin Dashboard** - Project/developer management

### Short Term
- Email notifications (Resend/SendGrid)
- PDF report generation
- Map integration (Mapbox/Google Maps)
- Image upload (Cloudinary/S3)

### Medium Term
- Mobile PWA optimization
- AI improvements (real OpenAI integration, RAG)
- Developer self-service portal

### Long Term
- Phase 4 Blockchain integration
- Mobile app (React Native)
- Real ML models for price prediction
- Multi-language expansion

---

## Key Files

| File | Description |
|------|-------------|
| `prisma/schema.prisma` | Database schema (50+ tables) |
| `src/lib/types.ts` | TypeScript type definitions |
| `src/lib/tier.ts` | Tier system logic |
| `src/data/mockProjects.ts` | Mock data for development |
| `src/locales/vi.json` | Vietnamese translations |
| `src/locales/en.json` | English translations |
| `src/app/api/v1/` | All API routes |
| `src/components/realtera/` | RealTera-specific components |

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npx ts-node scripts/translate-local.ts` | Auto-translate with local LLM |
| `npx prisma db push` | Push schema to database |
| `npx prisma generate` | Generate Prisma client |

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=...
STACK_SECRET_SERVER_KEY=...

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Optional: For auto-translate
OPENAI_API_KEY=...
LLM_BASE_URL=http://localhost:11434/v1
LLM_MODEL=llama3.2
```

---

## Current Branch: `real-tera`

## Last Updated: December 2024
