-- ============================================================================
-- 0006_org_plan.sql  (CORRECTED)
--
-- The orgs table already has a `plan` column typed as the existing
-- `plan_tier` enum from migration 0001 (values: free, walkthrough, shield,
-- subscriber, enterprise). This migration's earlier draft created a
-- redundant `org_plan` enum and a function that tried to return it -
-- which produced the 42P13 'return type mismatch' error because
-- orgs.plan is plan_tier, not org_plan.
--
-- Corrected version:
--   - Drops the rogue org_plan enum if a previous run created it
--   - Adds plan_updated_at + plan_updated_by audit columns (idempotent)
--   - Defines current_user_org_plan() returning plan_tier (the real type)
--
-- Tier semantics (used by app code):
--   free / walkthrough  : evaluator tier - PRAESIDIUM 2-cap, courses
--                         preview only, no detail bookings
--   shield / subscriber / enterprise : engaged client tier - everything
--                                       unlocked
--
-- Idempotent. Safe to re-run.
-- ============================================================================

-- 1) Clean up the rogue org_plan enum if it was created by a prior failed
--    attempt at this migration. Type can only be dropped if nothing
--    references it; orgs.plan does not (it's plan_tier), and the function
--    that referenced it never got created, so the drop is safe.
drop type if exists org_plan;

-- 2) Audit columns - idempotent
alter table orgs
  add column if not exists plan_updated_at timestamptz not null default now();

alter table orgs
  add column if not exists plan_updated_by uuid references auth.users(id);

-- 3) Helper: current user's primary org plan, returning the existing
--    plan_tier enum.
create or replace function current_user_org_plan()
returns plan_tier
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select o.plan
  from orgs o
  join memberships m on m.org_id = o.id
  where m.user_id = auth.uid()
  order by m.created_at asc
  limit 1;
$$;

comment on column orgs.plan is
  'Engagement tier (plan_tier enum). free / walkthrough = evaluator. shield / subscriber / enterprise = active client. Updated manually by OSPG admin after paid engagement is delivered.';
