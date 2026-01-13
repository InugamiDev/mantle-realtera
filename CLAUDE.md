# Claude Session Context

## Before Starting Any Task

**Always read `/context/PROJECT_PLAN.md` first** to understand:
- What RealTera is (Vietnamese Real Estate Intelligence Platform)
- Current tech stack and architecture decisions
- 31 revenue streams organized in 4 phases
- What's already built vs what's pending
- Key files and their purposes

## Quick Reference

### Project Type
Real Estate Intelligence/Rating Platform - NOT property owners.
Revenue: verification, data, subscriptions, sponsored placements.

### Branch
Working branch: `real-tera`

### Stack
- Next.js 16 + React 19 + Tailwind v4
- PostgreSQL + Prisma ORM
- Stack Auth
- Stripe (Phase 2)
- Solana (Phase 4)

### Design System
Golden Lumière - glassmorphism theme with amber/gold accents.

### Commit Style
Feature-based commits, no Claude attribution:
```
feat(scope): description
```

### Current Phase
**Phase 1 Complete** - Moving to Phase 2 (Stripe, server sync, admin dashboard)

## Context Files
- `/context/PROJECT_PLAN.md` - Full project plan and status
- `/prisma/schema.prisma` - Database schema (50+ tables)
- `/src/lib/types.ts` - TypeScript types
- `/src/lib/tier.ts` - Tier system (SSS to F)
