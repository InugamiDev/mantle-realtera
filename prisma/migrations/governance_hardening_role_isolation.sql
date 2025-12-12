-- ============================================================================
-- GOVERNANCE HARDENING: Database Role Isolation
-- ============================================================================
-- This migration creates database roles that enforce separation between
-- rating computation and commercial data. The rating_compute role has
-- NO ACCESS to commercial schema tables.
--
-- Run this AFTER applying the Prisma schema migration.
-- ============================================================================

-- Create the commercial schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS commercial;

-- ============================================================================
-- 1. Create Rating Compute Role
-- ============================================================================
-- This role is used by the rating computation service.
-- It has READ-ONLY access to rating tables and NO access to commercial tables.

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'rating_compute') THEN
    CREATE ROLE rating_compute WITH LOGIN PASSWORD 'CHANGE_THIS_PASSWORD_IN_PRODUCTION';
  END IF;
END
$$;

-- Grant connect to database
GRANT CONNECT ON DATABASE postgres TO rating_compute;

-- ============================================================================
-- 2. Grant Access to Public Schema (Rating Tables)
-- ============================================================================
-- Rating compute can READ from these tables only

GRANT USAGE ON SCHEMA public TO rating_compute;

-- Core rating tables (READ-ONLY)
GRANT SELECT ON public.projects TO rating_compute;
GRANT SELECT ON public.developers TO rating_compute;
GRANT SELECT ON public.project_signals TO rating_compute;
GRANT SELECT ON public.project_metrics TO rating_compute;
GRANT SELECT ON public.project_score_categories TO rating_compute;
GRANT SELECT ON public.project_evidence TO rating_compute;
GRANT SELECT ON public.project_history TO rating_compute;
GRANT SELECT ON public.project_why_bullets TO rating_compute;
GRANT SELECT ON public.project_key_risks TO rating_compute;
GRANT SELECT ON public.project_best_fors TO rating_compute;

-- Scoring audit tables (READ + WRITE for creating score runs)
GRANT SELECT, INSERT ON public.score_components TO rating_compute;
GRANT SELECT, INSERT ON public.score_runs TO rating_compute;
GRANT SELECT, INSERT ON public.score_run_evidence_links TO rating_compute;
GRANT SELECT, INSERT ON public.score_run_attestation_links TO rating_compute;
GRANT SELECT, INSERT ON public.score_diffs TO rating_compute;

-- Issuer registry (READ-ONLY for verification)
GRANT SELECT ON public.issuers TO rating_compute;
GRANT SELECT ON public.issuer_credentials TO rating_compute;
GRANT SELECT ON public.issuer_keys TO rating_compute;
GRANT SELECT ON public.issuer_members TO rating_compute;
GRANT SELECT ON public.issuer_scopes TO rating_compute;
GRANT SELECT ON public.attestation_schemas TO rating_compute;

-- Attestations (READ-ONLY for scoring inputs)
GRANT SELECT ON public.attestations TO rating_compute;

-- Area/Neighborhood data (READ-ONLY for location scoring)
GRANT SELECT ON public.area_pricings TO rating_compute;
GRANT SELECT ON public.neighborhood_datas TO rating_compute;

-- Construction progress (READ-ONLY for progress scoring)
GRANT SELECT ON public.construction_progresses TO rating_compute;

-- ============================================================================
-- 3. DENY Access to Commercial Schema
-- ============================================================================
-- Rating compute has NO access to commercial tables

REVOKE ALL PRIVILEGES ON SCHEMA commercial FROM rating_compute;
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA commercial FROM rating_compute;

-- Explicitly deny access (belt and suspenders)
-- These will fail silently if tables don't exist yet
DO $$
BEGIN
  EXECUTE 'REVOKE ALL ON commercial.buyer_leads FROM rating_compute';
  EXECUTE 'REVOKE ALL ON commercial.lead_purchases FROM rating_compute';
  EXECUTE 'REVOKE ALL ON commercial.sponsored_slots FROM rating_compute';
  EXECUTE 'REVOKE ALL ON commercial.sponsored_auctions FROM rating_compute';
  EXECUTE 'REVOKE ALL ON commercial.sponsored_bids FROM rating_compute';
  EXECUTE 'REVOKE ALL ON commercial.sponsored_placements FROM rating_compute';
  EXECUTE 'REVOKE ALL ON commercial.consulting_engagements FROM rating_compute';
  EXECUTE 'REVOKE ALL ON commercial.award_categories FROM rating_compute';
  EXECUTE 'REVOKE ALL ON commercial.award_nominations FROM rating_compute';
  EXECUTE 'REVOKE ALL ON commercial.award_winners FROM rating_compute';
EXCEPTION
  WHEN undefined_table THEN
    -- Tables don't exist yet, that's fine
    NULL;
END
$$;

-- ============================================================================
-- 4. Create Application Role (Full Access)
-- ============================================================================
-- This role is used by the main application for all operations.

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'realtera_app') THEN
    CREATE ROLE realtera_app WITH LOGIN PASSWORD 'CHANGE_THIS_PASSWORD_IN_PRODUCTION';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE postgres TO realtera_app;
GRANT USAGE ON SCHEMA public TO realtera_app;
GRANT USAGE ON SCHEMA commercial TO realtera_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO realtera_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA commercial TO realtera_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO realtera_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA commercial TO realtera_app;

-- ============================================================================
-- 5. Default Privileges for Future Tables
-- ============================================================================

-- For rating_compute on public schema (read-only by default)
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO rating_compute;

-- For realtera_app (full access)
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO realtera_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA commercial
  GRANT ALL PRIVILEGES ON TABLES TO realtera_app;

-- ============================================================================
-- 6. Verification Queries
-- ============================================================================
-- Run these to verify the setup is correct:

-- Check rating_compute cannot access commercial tables:
-- SET ROLE rating_compute;
-- SELECT * FROM commercial.sponsored_bids LIMIT 1;  -- Should fail
-- RESET ROLE;

-- Check rating_compute can read rating tables:
-- SET ROLE rating_compute;
-- SELECT * FROM public.projects LIMIT 1;  -- Should succeed
-- RESET ROLE;

-- ============================================================================
-- IMPORTANT: Update these connection strings in your .env:
-- ============================================================================
-- DATABASE_URL=postgresql://realtera_app:password@host/db  (main app)
-- DATABASE_URL_RATING=postgresql://rating_compute:password@host/db  (rating service)
-- ============================================================================
