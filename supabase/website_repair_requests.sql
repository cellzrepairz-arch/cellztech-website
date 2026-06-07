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
  repairdesk_ticket_id text,
  repairdesk_customer_response jsonb,
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

-- This table is written from the Vercel API route with the Supabase service role key.
-- Do not expose SUPABASE_SERVICE_ROLE_KEY in browser/front-end code.
