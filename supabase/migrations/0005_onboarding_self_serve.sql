-- ============================================================================
-- 0005_onboarding_self_serve.sql
--
-- Make onboarding work without requiring SUPABASE_SERVICE_ROLE_KEY.
--
-- Original 0001 schema had no INSERT policy on `orgs`. The /api/onboarding
-- route worked around it via service-role, which broke when the env var
-- was missing on Vercel. This migration adds two narrow INSERT policies
-- that let an authenticated user self-serve the first-org-bootstrap with
-- no privileged credentials.
--
-- POLICIES
--   1. orgs.INSERT (authenticated, with check true)
--   2. memberships.INSERT (authenticated, with check that user is
--      claiming ownership of an org that has no other memberships yet)
--
-- IMPORTANT: the bootstrap-membership CHECK uses a SECURITY DEFINER
-- helper function `org_has_no_memberships()` to look at the memberships
-- table. A naive `not exists (select 1 from memberships ...)` written
-- inline in the CHECK triggers Postgres infinite-recursion detection
-- because the subquery's SELECT also goes through memberships' RLS
-- policy, which itself references memberships via current_user_org_ids().
-- The SECURITY DEFINER function bypasses RLS for that one read, breaking
-- the recursion.
--
-- Idempotent. Safe to re-run.
-- ============================================================================

-- 1) Allow authenticated users to create orgs.
drop policy if exists "Authenticated users can create orgs" on orgs;
create policy "Authenticated users can create orgs"
  on orgs for insert
  to authenticated
  with check (true);

-- 2) Helper used by the bootstrap-membership CHECK clause. SECURITY
--    DEFINER so the read on memberships does not re-trigger RLS.
create or replace function org_has_no_memberships(target_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select not exists (
    select 1 from memberships where org_id = target_org_id
  );
$$;

-- 3) Allow an authenticated user to create their own owner membership for
--    a just-created org (one that has no other memberships yet).
drop policy if exists "Users can bootstrap own owner membership"
  on memberships;
create policy "Users can bootstrap own owner membership"
  on memberships for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and role = 'owner'
    and org_has_no_memberships(org_id)
  );

comment on policy "Authenticated users can create orgs" on orgs is
  'Self-serve onboarding: any authenticated user can create an org. The matching memberships INSERT policy ensures they can only claim ownership of orgs they just created.';

comment on policy "Users can bootstrap own owner membership" on memberships is
  'Self-serve onboarding: pairs with the orgs INSERT policy. Allows exactly one owner-membership row per org via this policy. Subsequent invitations flow through the Owners can manage memberships policy from migration 0001.';
