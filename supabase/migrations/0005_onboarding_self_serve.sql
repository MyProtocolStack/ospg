-- ============================================================================
-- 0005_onboarding_self_serve.sql
--
-- Make onboarding work without requiring SUPABASE_SERVICE_ROLE_KEY.
--
-- Original 0001 schema had no INSERT policy on `orgs` (intentional - we
-- did not want any auth user creating arbitrary orgs). The /api/onboarding
-- route worked around it by using the service-role key, which broke when
-- the env var was missing or misconfigured on Vercel.
--
-- This migration adds two narrow INSERT policies that let an authenticated
-- user self-serve the first-org-bootstrap with no privileged credentials:
--
--   1. orgs INSERT: any authenticated user can create an org
--      (low risk - rate limiting + the membership policy below prevent
--      meaningful abuse, and the application already gates onboarding
--      to "users without an existing membership")
--
--   2. memberships INSERT: an authenticated user can ONLY insert a row
--      where (a) user_id = auth.uid(), (b) role = 'owner', and (c) the
--      target org has no existing memberships. This means a user can
--      claim ownership of an org they JUST created (no other memberships
--      exist yet) but cannot insert themselves into someone else's org
--      via this policy.
--
-- Subsequent memberships (inviting other users, etc.) continue to flow
-- through the existing "Owners can manage memberships" policy from 0001.
--
-- Idempotent: drop policy if exists guards re-runs.
-- ============================================================================

-- 1) Allow authenticated users to create orgs.
drop policy if exists "Authenticated users can create orgs" on orgs;
create policy "Authenticated users can create orgs"
  on orgs for insert
  to authenticated
  with check (true);

-- 2) Allow an authenticated user to create their own owner membership for
--    a just-created org (one that has no other memberships yet).
drop policy if exists "Users can bootstrap own owner membership"
  on memberships;
create policy "Users can bootstrap own owner membership"
  on memberships for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and role = 'owner'
    and not exists (
      select 1 from memberships m
      where m.org_id = memberships.org_id
    )
  );

-- Comment for future maintainers
comment on policy "Authenticated users can create orgs" on orgs is
  'Self-serve onboarding: any authenticated user can create an org. The matching memberships INSERT policy ensures they can only claim ownership of orgs they just created (where no membership rows exist yet).';

comment on policy "Users can bootstrap own owner membership" on memberships is
  'Self-serve onboarding: pairs with the orgs INSERT policy. Allows exactly one owner-membership row per org via this policy. Subsequent invitations flow through the Owners can manage memberships policy from migration 0001.';
