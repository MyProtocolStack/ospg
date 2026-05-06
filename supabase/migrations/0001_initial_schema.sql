-- ============================================================================
-- Lighthouse Protection Group — Initial Schema
-- ----------------------------------------------------------------------------
-- Multi-tenant org model. Every paying entity (school, parish, business,
-- estate) is an "org". Users belong to orgs via memberships. RLS enforces
-- isolation: members can only see their own org's data.
-- ============================================================================

-- ---- ENUMS ----
create type org_type as enum (
  'school', 'parish', 'business', 'estate', 'event', 'gym', 'other'
);

create type plan_tier as enum (
  'free', 'walkthrough', 'shield', 'subscriber', 'enterprise'
);

create type assessment_status as enum (
  'draft', 'analyzing', 'completed', 'archived', 'failed'
);

create type severity as enum ('low', 'medium', 'high', 'critical');

create type grant_status as enum (
  'researching', 'preparing', 'submitted', 'awarded', 'denied', 'withdrawn'
);

create type member_role as enum ('owner', 'admin', 'member', 'viewer');

-- ============================================================================
-- ORGS — top-level tenant
-- ============================================================================
create table orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type org_type not null default 'other',

  -- Address (single primary location)
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text default 'US',
  phone text,

  -- Subscription / plan
  plan plan_tier not null default 'free',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,

  -- Stats / soft data
  est_population integer,           -- students, congregants, employees
  vertical_notes text,
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orgs_plan_idx on orgs(plan);
create index orgs_state_idx on orgs(state);

-- ============================================================================
-- PROFILES — extends auth.users 1:1
-- ============================================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup (trigger)
create or replace function handle_new_user()
returns trigger
language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================================
-- MEMBERSHIPS — users <-> orgs (many-to-many w/ role)
-- ============================================================================
create table memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  org_id uuid not null references orgs(id) on delete cascade,
  role member_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (user_id, org_id)
);

create index memberships_user_idx on memberships(user_id);
create index memberships_org_idx on memberships(org_id);

-- Helper: current user's org IDs
create or replace function current_user_org_ids()
returns setof uuid
language sql stable security definer as $$
  select org_id from memberships where user_id = auth.uid();
$$;

-- Helper: current user's role in a given org
create or replace function current_user_role_in_org(p_org_id uuid)
returns member_role
language sql stable security definer as $$
  select role from memberships
  where user_id = auth.uid() and org_id = p_org_id
  limit 1;
$$;

-- ============================================================================
-- SHIELD AI ASSESSMENTS — photo-based vulnerability analyses
-- ============================================================================
create table assessments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  created_by uuid references auth.users(id),

  title text not null,
  status assessment_status not null default 'draft',
  area_label text,                  -- "Side entrance", "Sanctuary main door", etc.

  -- AI analysis
  model text,                       -- claude-sonnet-4-5-vision, etc.
  analysis_text text,               -- full prose analysis
  summary text,                     -- 1-paragraph executive summary
  overall_severity severity,        -- aggregated highest severity finding
  pdf_url text,                     -- signed URL to generated PDF report

  -- Token / cost tracking
  input_tokens integer,
  output_tokens integer,
  cost_usd numeric(10, 4),

  -- Timestamps
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index assessments_org_idx on assessments(org_id);
create index assessments_status_idx on assessments(status);

-- ============================================================================
-- ASSESSMENT PHOTOS — photos uploaded for an assessment
-- ============================================================================
create table assessment_photos (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  storage_path text not null,                -- supabase storage path
  display_url text,                          -- signed URL
  filename text,
  size_bytes integer,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create index assessment_photos_a_idx on assessment_photos(assessment_id);

-- ============================================================================
-- ASSESSMENT FINDINGS — structured findings per assessment
-- ============================================================================
create table assessment_findings (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references assessments(id) on delete cascade,

  finding_number integer not null,           -- 1, 2, 3...
  severity severity not null,
  title text not null,
  description text,
  recommendation text,

  -- Geometry on photo (for annotation overlay)
  photo_id uuid references assessment_photos(id) on delete set null,
  bbox_x numeric(5,4),                       -- 0..1 normalized
  bbox_y numeric(5,4),
  bbox_w numeric(5,4),
  bbox_h numeric(5,4),

  -- Costing
  est_cost_low integer,                      -- USD
  est_cost_high integer,
  vendor_suggestions text,
  nsgp_eligible boolean default false,

  created_at timestamptz not null default now()
);

create index assessment_findings_a_idx on assessment_findings(assessment_id);
create index assessment_findings_sev_idx on assessment_findings(severity);

-- ============================================================================
-- GRANT APPLICATIONS — FEMA NSGP and others
-- ============================================================================
create table grant_applications (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,

  program text not null default 'FEMA NSGP-NSI',  -- NSGP-UA, NSGP-S, etc.
  cycle text,                                      -- "FY2026 Round 1"
  status grant_status not null default 'researching',

  -- Generated artifacts
  threat_narrative text,
  investment_justification text,
  mission_statement text,
  vulnerability_assessment_url text,         -- link to assessments table or upload

  -- Submission tracking
  amount_requested integer,                  -- USD
  amount_awarded integer,
  state_saa text,                            -- State Administrative Agency
  state_deadline date,
  fema_submission_id text,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index grant_apps_org_idx on grant_applications(org_id);

-- ============================================================================
-- COURSES — training content
-- ============================================================================
create table courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  cover_url text,
  duration_minutes integer,
  difficulty text default 'foundational',    -- foundational | intermediate | advanced
  free boolean default false,                -- include in subscriber tier?
  price_usd integer,                         -- one-time purchase price (cents)
  published boolean default false,
  ordering integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  ordering integer not null,
  title text not null,
  kind text not null default 'video',        -- video | written | scenario | quiz | live
  duration_minutes integer,
  body_md text,                              -- markdown for written lessons
  video_url text,                            -- mux / youtube / vimeo URL
  scenario_data jsonb,                       -- for scenario lessons
  free_preview boolean default false,
  created_at timestamptz not null default now(),
  unique (course_id, ordering)
);

-- ============================================================================
-- COURSE PROGRESS — per user per course
-- ============================================================================
create table course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  lesson_id uuid references course_lessons(id) on delete set null,
  percent_complete integer default 0,
  last_seen_at timestamptz default now(),
  completed_at timestamptz,
  unique (user_id, course_id, lesson_id)
);

-- ============================================================================
-- COURSE PURCHASES — orgs / users buying courses
-- ============================================================================
create table course_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  org_id uuid references orgs(id),
  course_id uuid not null references courses(id),
  stripe_payment_id text,
  amount_usd integer,                       -- cents
  created_at timestamptz not null default now()
);

-- ============================================================================
-- SECURITY DETAIL BOOKINGS
-- ============================================================================
create table detail_bookings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id),
  requested_by uuid references auth.users(id),

  start_at timestamptz not null,
  end_at timestamptz not null,
  hours numeric(6,2),
  rate_per_hour integer,                    -- cents
  total_amount integer,                     -- cents
  officer_count integer default 1,

  location_address text,
  event_description text,
  threat_level severity default 'low',

  status text default 'requested',          -- requested | confirmed | in_progress | completed | cancelled
  notes text,

  stripe_payment_id text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- PILOT CHAT THREADS
-- ============================================================================
create table pilot_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  org_id uuid references orgs(id),
  title text default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pilot_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references pilot_threads(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index pilot_messages_thread_idx on pilot_messages(thread_id, created_at);

-- ============================================================================
-- ROW-LEVEL SECURITY
-- ============================================================================
alter table orgs enable row level security;
alter table profiles enable row level security;
alter table memberships enable row level security;
alter table assessments enable row level security;
alter table assessment_photos enable row level security;
alter table assessment_findings enable row level security;
alter table grant_applications enable row level security;
alter table course_progress enable row level security;
alter table course_purchases enable row level security;
alter table detail_bookings enable row level security;
alter table pilot_threads enable row level security;
alter table pilot_messages enable row level security;

-- Courses + lessons are public-readable (marketing); auth required to enroll
alter table courses enable row level security;
alter table course_lessons enable row level security;

-- ===== PROFILES =====
create policy "Users can read their own profile"
  on profiles for select using (id = auth.uid());
create policy "Users can update their own profile"
  on profiles for update using (id = auth.uid());

-- ===== ORGS =====
create policy "Members can read their orgs"
  on orgs for select using (id in (select current_user_org_ids()));
create policy "Owners and admins can update orgs"
  on orgs for update using (
    current_user_role_in_org(id) in ('owner', 'admin')
  );

-- ===== MEMBERSHIPS =====
create policy "Members can read own org memberships"
  on memberships for select using (
    org_id in (select current_user_org_ids())
  );
create policy "Owners can manage memberships"
  on memberships for all using (
    current_user_role_in_org(org_id) = 'owner'
  );

-- ===== ASSESSMENTS =====
create policy "Members can read own org assessments"
  on assessments for select using (
    org_id in (select current_user_org_ids())
  );
create policy "Members can create assessments in own orgs"
  on assessments for insert with check (
    org_id in (select current_user_org_ids())
  );
create policy "Members can update assessments in own orgs"
  on assessments for update using (
    org_id in (select current_user_org_ids())
  );

-- ===== ASSESSMENT PHOTOS / FINDINGS — inherit via assessment =====
create policy "Members read photos via assessment"
  on assessment_photos for select using (
    assessment_id in (
      select id from assessments where org_id in (select current_user_org_ids())
    )
  );
create policy "Members write photos via assessment"
  on assessment_photos for insert with check (
    assessment_id in (
      select id from assessments where org_id in (select current_user_org_ids())
    )
  );

create policy "Members read findings via assessment"
  on assessment_findings for select using (
    assessment_id in (
      select id from assessments where org_id in (select current_user_org_ids())
    )
  );
create policy "Members write findings via assessment"
  on assessment_findings for all using (
    assessment_id in (
      select id from assessments where org_id in (select current_user_org_ids())
    )
  );

-- ===== GRANTS =====
create policy "Members read own org grants"
  on grant_applications for select using (
    org_id in (select current_user_org_ids())
  );
create policy "Members write own org grants"
  on grant_applications for all using (
    org_id in (select current_user_org_ids())
  );

-- ===== COURSES (public marketing) =====
create policy "Anyone can read published courses"
  on courses for select using (published = true);
create policy "Anyone can read published lessons"
  on course_lessons for select using (
    course_id in (select id from courses where published = true)
  );

-- ===== COURSE PROGRESS =====
create policy "Users read own progress"
  on course_progress for select using (user_id = auth.uid());
create policy "Users write own progress"
  on course_progress for all using (user_id = auth.uid());

-- ===== COURSE PURCHASES =====
create policy "Users read own purchases"
  on course_purchases for select using (user_id = auth.uid());

-- ===== DETAIL BOOKINGS =====
create policy "Members read own org bookings"
  on detail_bookings for select using (
    org_id in (select current_user_org_ids())
  );
create policy "Members create own org bookings"
  on detail_bookings for insert with check (
    org_id in (select current_user_org_ids())
  );

-- ===== PILOT THREADS / MESSAGES =====
create policy "Users read own threads"
  on pilot_threads for select using (user_id = auth.uid());
create policy "Users write own threads"
  on pilot_threads for all using (user_id = auth.uid());
create policy "Users read messages in own threads"
  on pilot_messages for select using (
    thread_id in (select id from pilot_threads where user_id = auth.uid())
  );
create policy "Users write messages in own threads"
  on pilot_messages for insert with check (
    thread_id in (select id from pilot_threads where user_id = auth.uid())
  );

-- ============================================================================
-- STORAGE BUCKETS (managed via Supabase Storage UI/API; documented here)
-- ============================================================================
-- bucket: 'assessment-photos'   — private, 50MB limit, image/* only
-- bucket: 'assessment-reports'  — private, signed URLs only
-- bucket: 'course-videos'       — managed via Mux, not Supabase
-- bucket: 'public-assets'       — public, brand images, course covers
