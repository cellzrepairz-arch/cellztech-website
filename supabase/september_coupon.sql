-- CellzTech September 2026 coupon signup. Run ONCE in Supabase SQL Editor.
-- Safe to run again. Creates only new website_promo_* tables/functions.
-- Does NOT alter repair requests, RepairDesk tokens, SIM requests, or analytics.
-- Do NOT run the older website_repair_requests.sql for this feature.
begin;

create table if not exists public.website_promo_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(btrim(email)) and length(email) between 3 and 254),
  language text not null check (language in ('en','pl','es','uk')),
  status text not null default 'pending' check (status in ('pending','subscribed','unsubscribed')),
  campaign_id text not null default 'back-to-school-2026-09',
  coupon_code text not null unique,
  coupon_redeemed_at timestamptz,
  coupon_terms_version text not null default '2026-09-v1',
  consent_version text not null,
  consent_text text not null,
  consent_at timestamptz not null default now(),
  consent_nonce uuid not null default gen_random_uuid(),
  signup_request_id uuid not null,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  source text not null default 'september-homepage',
  email_status text not null default 'not_sent' check (email_status in ('not_sent','accepted','failed','not_configured')),
  last_email_attempt_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists website_promo_subscribers_created_idx on public.website_promo_subscribers(created_at desc);
create index if not exists website_promo_subscribers_status_idx on public.website_promo_subscribers(status);

create table if not exists public.website_promo_consent_events (
  id bigint generated always as identity primary key,
  subscriber_id uuid not null references public.website_promo_subscribers(id) on delete cascade,
  event text not null check (event in ('signup','confirmed','unsubscribed','coupon_redeemed')),
  consent_version text,
  consent_text text,
  created_at timestamptz not null default now()
);
create table if not exists public.website_promo_rate_limits (
  key text not null,
  window_start timestamptz not null,
  hits integer not null default 0,
  primary key (key,window_start)
);

-- No public browser access to customer emails or coupons. Vercel uses the service-role key.
alter table public.website_promo_subscribers enable row level security;
alter table public.website_promo_consent_events enable row level security;
alter table public.website_promo_rate_limits enable row level security;
revoke all on public.website_promo_subscribers, public.website_promo_consent_events, public.website_promo_rate_limits from public, anon, authenticated;
grant select,insert,update,delete on public.website_promo_subscribers, public.website_promo_consent_events, public.website_promo_rate_limits to service_role;
revoke all on sequence public.website_promo_consent_events_id_seq from public,anon,authenticated;
grant usage,select on sequence public.website_promo_consent_events_id_seq to service_role;

create or replace function public.cellztech_promo_ready() returns jsonb
language sql security invoker set search_path = '' as $$
  select jsonb_build_object('schemaVersion','2026-09-v1', 'ready',
    to_regclass('public.website_promo_subscribers') is not null and
    to_regclass('public.website_promo_consent_events') is not null and
    to_regclass('public.website_promo_rate_limits') is not null);
$$;

-- Durable rate limiting across Vercel instances; only HMAC identifiers, not raw IPs.
create or replace function public.cellztech_promo_rate_limit(p_key text,p_seconds integer,p_limit integer) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare v_start timestamptz; v_hits integer;
begin
  if p_key is null or p_seconds is null or p_limit is null or length(p_key) > 150 or p_seconds not in (3600,86400) or p_limit not between 1 and 100 then
    raise exception 'invalid rate-limit parameters';
  end if;
  v_start := to_timestamp(floor(extract(epoch from now()) / p_seconds) * p_seconds);
  delete from public.website_promo_rate_limits where window_start < now() - interval '2 days';
  insert into public.website_promo_rate_limits(key,window_start,hits) values(p_key,v_start,1)
    on conflict(key,window_start) do update set hits = public.website_promo_rate_limits.hits + 1
    returning hits into v_hits;
  return v_hits <= p_limit;
end; $$;

-- One coupon per normalized email. All writes are atomic and serialized for that email.
create or replace function public.cellztech_promo_signup(p_email text,p_language text,p_request_id uuid,p_consent_version text,p_consent_text text) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare r public.website_promo_subscribers%rowtype; v_new boolean := false; v_send boolean := false; v_replay boolean := false;
begin
  if now() < timestamptz '2026-09-01 00:00:00 America/Chicago' or now() >= timestamptz '2026-10-01 00:00:00 America/Chicago' then
    raise exception 'campaign_closed';
  end if;
  if p_email is null or p_email <> lower(btrim(p_email)) or length(p_email) not between 3 and 254
     or p_language is null or p_language not in ('en','pl','es','uk') or p_request_id is null
     or p_consent_version is null or p_consent_text is null or p_consent_version <> '2026-09-v1' or length(p_consent_text) not between 10 and 2000 then
    raise exception 'invalid_signup';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(p_email,0));
  select * into r from public.website_promo_subscribers where email = p_email for update;
  if not found then
    insert into public.website_promo_subscribers(email,language,consent_version,consent_text,signup_request_id,coupon_code,last_email_attempt_at)
      values(p_email,p_language,p_consent_version,p_consent_text,p_request_id,'BTS10-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)),now()) returning * into r;
    v_new := true; v_send := true;
    insert into public.website_promo_consent_events(subscriber_id,event,consent_version,consent_text) values(r.id,'signup',p_consent_version,p_consent_text);
  else
    v_replay := r.signup_request_id = p_request_id;
    -- A retry of the same request never re-subscribes an address after an opt-out.
    if r.status = 'unsubscribed' and not v_replay then
      update public.website_promo_subscribers set status='pending',language=p_language,consent_at=now(),consent_version=p_consent_version,
        consent_text=p_consent_text,consent_nonce=gen_random_uuid(),signup_request_id=p_request_id,last_email_attempt_at=now(),email_status='not_sent',updated_at=now()
        where id=r.id returning * into r;
      v_send := true;
      insert into public.website_promo_consent_events(subscriber_id,event,consent_version,consent_text) values(r.id,'signup',p_consent_version,p_consent_text);
    elsif r.status = 'pending' and not v_replay and (r.last_email_attempt_at is null or r.last_email_attempt_at < now() - interval '24 hours'
      or (r.email_status in ('failed','not_configured') and r.last_email_attempt_at < now() - interval '5 minutes')) then
      update public.website_promo_subscribers set last_email_attempt_at=now(),email_status='not_sent',updated_at=now() where id=r.id returning * into r;
      v_send := true;
    end if;
  end if;
  return jsonb_build_object('record',to_jsonb(r),'isNew',v_new,'isReplay',v_replay,'shouldSend',v_send);
end; $$;

create or replace function public.cellztech_promo_preference(p_id uuid,p_action text,p_nonce uuid default null) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare r public.website_promo_subscribers%rowtype;
begin
  select * into r from public.website_promo_subscribers where id=p_id for update;
  if not found then return false; end if;
  if p_action='confirm' then
    if p_nonce is null or r.consent_nonce <> p_nonce or r.status='unsubscribed' then return false; end if;
    if r.status='subscribed' then return true; end if;
    update public.website_promo_subscribers set status='subscribed',confirmed_at=now(),unsubscribed_at=null,updated_at=now() where id=p_id;
    insert into public.website_promo_consent_events(subscriber_id,event,consent_version,consent_text) values(p_id,'confirmed',r.consent_version,r.consent_text);
  elsif p_action='unsubscribe' then
    if r.status='unsubscribed' then return true; end if;
    update public.website_promo_subscribers set status='unsubscribed',unsubscribed_at=now(),consent_nonce=gen_random_uuid(),updated_at=now() where id=p_id;
    insert into public.website_promo_consent_events(subscriber_id,event) values(p_id,'unsubscribed');
  else return false;
  end if;
  return true;
end; $$;

create or replace function public.cellztech_promo_redeem(p_id uuid) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare v_id uuid;
begin
  update public.website_promo_subscribers set coupon_redeemed_at=now(),updated_at=now()
    where id=p_id and coupon_redeemed_at is null returning id into v_id;
  if v_id is null then return false; end if;
  insert into public.website_promo_consent_events(subscriber_id,event) values(v_id,'coupon_redeemed');
  return true;
end; $$;

revoke all on function public.cellztech_promo_ready() from public,anon,authenticated;
revoke all on function public.cellztech_promo_rate_limit(text,integer,integer) from public,anon,authenticated;
revoke all on function public.cellztech_promo_signup(text,text,uuid,text,text) from public,anon,authenticated;
revoke all on function public.cellztech_promo_preference(uuid,text,uuid) from public,anon,authenticated;
revoke all on function public.cellztech_promo_redeem(uuid) from public,anon,authenticated;
grant execute on function public.cellztech_promo_ready() to service_role;
grant execute on function public.cellztech_promo_rate_limit(text,integer,integer) to service_role;
grant execute on function public.cellztech_promo_signup(text,text,uuid,text,text) to service_role;
grant execute on function public.cellztech_promo_preference(uuid,text,uuid) to service_role;
grant execute on function public.cellztech_promo_redeem(uuid) to service_role;
notify pgrst,'reload schema';
commit;

-- Read-only confirmation: the SQL Editor should display ready=true.
select public.cellztech_promo_ready() as coupon_setup;
