# CellzTech Backend Setup

This project uses Vercel API routes for the Book Repair backend.

## Phase 1A flow

Customer submits Book Repair on CellzTech:

1. Vercel API validates the request.
2. RepairDesk OAuth token is loaded/refreshed from Supabase.
3. Backend creates a RepairDesk customer.
4. Backend creates a RepairDesk ticket.
5. Backend saves a backup row in Supabase.
6. Optional email/calendar notifications can run if those variables are configured.

## Vercel Environment Variables

Required:

```text
REPAIRDESK_BASE_URL=https://api.repairdesk.co/api/web/v1
REPAIRDESK_CLIENT_ID=copy from RepairDesk OAuth Client
REPAIRDESK_CLIENT_SECRET=copy from RepairDesk OAuth Client
REPAIRDESK_REDIRECT_URI=https://cellztech-website.vercel.app/api/repairdesk/oauth/callback
SUPABASE_URL=your Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=your Supabase secret/server key
SUPABASE_REPAIR_REQUESTS_TABLE=website_repair_requests
```

Optional:

```text
SUPABASE_REPAIRDESK_TOKENS_TABLE=repairdesk_oauth_tokens
REPAIRDESK_OAUTH_BASE_URL=https://api.repairdesk.co/api/web/v1/oauth2
REPAIRDESK_STORE_ID=
REPAIRDESK_DEFAULT_STATUS_ID=
REPAIRDESK_DEFAULT_EMPLOYEE_ID=
REPAIRDESK_REFERRED_BY=CellzTech website
RESEND_API_KEY=
REPAIR_TO_EMAIL=
RESEND_FROM_EMAIL=
REPAIR_CALENDAR_WEBHOOK_URL=
```

## Supabase SQL

Run:

```text
supabase/website_repair_requests.sql
```

This creates:

- `website_repair_requests`
- `repairdesk_oauth_tokens`

Both tables have RLS enabled. The Vercel backend writes using the Supabase service role key.

## Connect RepairDesk OAuth

After deploying this version and adding the variables, visit:

```text
https://cellztech-website.vercel.app/api/repairdesk/oauth/start
```

Log into RepairDesk and approve access. If successful, the callback page will say RepairDesk is connected.

Check status:

```text
https://cellztech-website.vercel.app/api/repairdesk/oauth/status
```

## Test

After RepairDesk says connected, submit a test Book Repair request on the website. Check:

1. RepairDesk customer list
2. RepairDesk tickets
3. Supabase `website_repair_requests`
4. Vercel function logs if anything fails

If RepairDesk rejects customer or ticket creation, copy the Vercel log error and adjust the RepairDesk field mapping.
