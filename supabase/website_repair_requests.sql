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
