create table if not exists public.website_repair_requests (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  source text,
  device text not null,
  series text,
  model text not null,
  issue text not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  requested_date date,
  requested_time text,
  notes text,
  status text not null default 'website_request_saved',
  repairdesk_customer_id text,
  repairdesk_lead_id text,
  repairdesk_lead_order_id text,
  repairdesk_ticket_id text,
  repairdesk_customer_response jsonb,
  repairdesk_lead_response jsonb,
  repairdesk_ticket_response jsonb,
  integration_errors jsonb,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists website_repair_requests_submitted_at_idx
  on public.website_repair_requests (submitted_at desc);

create index if not exists website_repair_requests_customer_email_idx
  on public.website_repair_requests (customer_email);

create index if not exists website_repair_requests_repairdesk_ticket_id_idx
  on public.website_repair_requests (repairdesk_ticket_id);

alter table public.website_repair_requests enable row level security;

create table if not exists public.repairdesk_oauth_tokens (
  id text primary key default 'primary',
  access_token text not null,
  refresh_token text,
  token_type text default 'Bearer',
  expires_at timestamptz,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.repairdesk_oauth_tokens enable row level security;

-- Safe updates for existing CellzTech projects created before lead/appointment support.
alter table public.website_repair_requests
  add column if not exists repairdesk_lead_id text;

alter table public.website_repair_requests
  add column if not exists repairdesk_lead_response jsonb;

create index if not exists website_repair_requests_repairdesk_lead_id_idx
  on public.website_repair_requests (repairdesk_lead_id);

-- These tables are written from Vercel API routes with the Supabase service role key.
-- Do not expose SUPABASE_SERVICE_ROLE_KEY in browser/front-end code.


alter table public.website_repair_requests
  add column if not exists repairdesk_lead_order_id text;

create index if not exists website_repair_requests_repairdesk_lead_order_id_idx
  on public.website_repair_requests (repairdesk_lead_order_id);

-- CellzTech writes these tables through secure Vercel API routes, not directly from the public browser.
-- RLS is disabled here to prevent server-side service-key writes from being blocked by Supabase project defaults.
alter table public.website_repair_requests disable row level security;
alter table public.repairdesk_oauth_tokens disable row level security;

-- Ultra Mobile SIM card request intake for Phase 3.
create table if not exists public.ultra_sim_requests (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  source text,
  status text not null default 'sim_request_saved',
  request_type text not null,
  plan_interest text,
  needs_activation_help boolean default true,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  shipping_address text,
  shipping_city text,
  shipping_state text,
  shipping_zip text,
  notes text,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ultra_sim_requests_submitted_at_idx
  on public.ultra_sim_requests (submitted_at desc);

create index if not exists ultra_sim_requests_customer_email_idx
  on public.ultra_sim_requests (customer_email);

create index if not exists ultra_sim_requests_request_type_idx
  on public.ultra_sim_requests (request_type);

alter table public.ultra_sim_requests disable row level security;
