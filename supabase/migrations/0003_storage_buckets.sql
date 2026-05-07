-- ============================================================================
-- 0003_storage_buckets.sql
--
-- Create the two storage buckets SHIELD AI needs:
--   - assessment-photos  (private, 20MB cap, image MIMEs)
--   - assessment-reports (private, 10MB cap, application/pdf)
--
-- Plus RLS policies on storage.objects so members of an org can only access
-- objects scoped to their org's assessments. Path convention enforced by
-- the application layer:
--   assessment-photos/{org_id}/{assessment_id}/{photo_id}.{ext}
--   assessment-reports/{org_id}/{assessment_id}/report.pdf
--
-- Run this against the existing Supabase project. Idempotent via
-- ON CONFLICT DO NOTHING for buckets and DROP POLICY IF EXISTS for policies.
-- ============================================================================

-- 1) Create the buckets (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'assessment-photos',
    'assessment-photos',
    false,
    20971520,                       -- 20 MB
    array[
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
      'image/gif'
    ]
  )
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'assessment-reports',
    'assessment-reports',
    false,
    10485760,                       -- 10 MB
    array['application/pdf']
  )
on conflict (id) do nothing;


-- 2) RLS policies on storage.objects
-- The first path segment (split_part(name, '/', 1)) is the org_id. Members
-- of an org can read/write storage objects whose first path segment matches
-- one of their org IDs.

-- ---------------- assessment-photos ----------------
drop policy if exists "Members can read assessment-photos in own orgs"
  on storage.objects;
create policy "Members can read assessment-photos in own orgs"
  on storage.objects for select
  using (
    bucket_id = 'assessment-photos'
    and (split_part(name, '/', 1))::uuid in (select current_user_org_ids())
  );

drop policy if exists "Members can upload assessment-photos in own orgs"
  on storage.objects;
create policy "Members can upload assessment-photos in own orgs"
  on storage.objects for insert
  with check (
    bucket_id = 'assessment-photos'
    and (split_part(name, '/', 1))::uuid in (select current_user_org_ids())
  );

drop policy if exists "Owners and admins can delete assessment-photos"
  on storage.objects;
create policy "Owners and admins can delete assessment-photos"
  on storage.objects for delete
  using (
    bucket_id = 'assessment-photos'
    and current_user_role_in_org((split_part(name, '/', 1))::uuid) in ('owner', 'admin')
  );


-- ---------------- assessment-reports ----------------
drop policy if exists "Members can read assessment-reports in own orgs"
  on storage.objects;
create policy "Members can read assessment-reports in own orgs"
  on storage.objects for select
  using (
    bucket_id = 'assessment-reports'
    and (split_part(name, '/', 1))::uuid in (select current_user_org_ids())
  );

drop policy if exists "Server-side functions can write assessment-reports"
  on storage.objects;
create policy "Server-side functions can write assessment-reports"
  on storage.objects for insert
  with check (
    bucket_id = 'assessment-reports'
    and (split_part(name, '/', 1))::uuid in (select current_user_org_ids())
  );

drop policy if exists "Owners and admins can delete assessment-reports"
  on storage.objects;
create policy "Owners and admins can delete assessment-reports"
  on storage.objects for delete
  using (
    bucket_id = 'assessment-reports'
    and current_user_role_in_org((split_part(name, '/', 1))::uuid) in ('owner', 'admin')
  );


-- 3) Comment for future maintainers
comment on policy "Members can read assessment-photos in own orgs" on storage.objects is
  'Path convention: {org_id}/{assessment_id}/{photo_id}.{ext}. First segment is the org_id UUID, checked against current_user_org_ids().';
