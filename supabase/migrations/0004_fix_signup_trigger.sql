-- ============================================================================
-- 0004_fix_signup_trigger.sql
--
-- Fix "Database error saving new user" during signup.
--
-- Root cause: the original handle_new_user() trigger function (in 0001) does
-- not set an explicit search_path, does not schema-qualify its table
-- references, and has no exception handler. When the function runs as part
-- of a Supabase Auth signup, any schema-resolution issue or row-level
-- failure cascades back to the auth API as "Database error saving new user"
-- and blocks the entire signup.
--
-- This migration replaces the function with the canonical Supabase pattern:
--   - SECURITY DEFINER + explicit SET search_path
--   - schema-qualified public.profiles reference
--   - ON CONFLICT DO NOTHING for idempotency
--   - EXCEPTION block so a profile-row failure does NOT block account
--     creation (logs a warning instead)
--
-- Idempotent: safe to run multiple times.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;

  return new;
exception
  when others then
    -- Never block account creation on a profile-row failure. Log and continue.
    -- Profile can be repaired later by the application layer if needed.
    raise warning 'handle_new_user failed for user %: %', new.id, sqlerrm;
    return new;
end;
$$;

-- Recreate the trigger to make sure it points at the new function definition.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Make sure authenticated and service_role can read/write profiles via the
-- function. SECURITY DEFINER runs as the owner, but explicit grants belt-and-suspenders.
grant usage on schema public to authenticated, service_role;
grant select, insert, update on public.profiles to authenticated, service_role;
