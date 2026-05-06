-- ============================================================================
-- Leads table — public inquiries (walkthrough requests, contact form, etc.)
-- Insert via service role only. Read by admins.
-- ============================================================================

create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  org text,
  type text,
  notes text,
  source text,                          -- walkthrough_form | contact_form | brochure_download | etc.
  status text not null default 'new',   -- new | contacted | qualified | converted | declined
  created_at timestamptz not null default now()
);

create index leads_status_idx on leads(status);
create index leads_source_idx on leads(source);
create index leads_created_idx on leads(created_at desc);

alter table leads enable row level security;

-- Only service role can read/write. No policies for authenticated/anon.
