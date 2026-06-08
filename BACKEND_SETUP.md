# CellzTech Backend Setup

This project uses Vercel API routes as the secure backend for CellzTech.

## Current backend workflow

Book Repair form → Vercel API → RepairDesk OAuth → RepairDesk customer + lead/appointment → Supabase backup → optional email notification.

The customer-facing wording must remain honest: this is a repair request, not a confirmed appointment.

## Required Vercel environment variables

- `REPAIRDESK_BASE_URL` — `https://api.repairdesk.co/api/web/v1`
- `REPAIRDESK_CLIENT_ID`
- `REPAIRDESK_CLIENT_SECRET`
- `REPAIRDESK_REDIRECT_URI` — `https://cellztech-website.vercel.app/api/repairdesk/oauth/callback`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_REPAIR_REQUESTS_TABLE` — `website_repair_requests`
- `CELLZTECH_ADMIN_KEY` — private staff key for `/admin`

## Optional notification variables

- `RESEND_API_KEY`
- `CELLZTECH_NOTIFY_EMAIL` — destination inbox for new repair request notifications
- `CELLZTECH_FROM_EMAIL` — verified Resend sender email; falls back to Resend onboarding sender if omitted

## Supabase setup

Run `supabase/website_repair_requests.sql` in the Supabase SQL Editor. It creates:

- `website_repair_requests`
- `repairdesk_oauth_tokens`

It also adds lead tracking columns:

- `repairdesk_lead_id`
- `repairdesk_lead_order_id`
- `repairdesk_lead_response`

## RepairDesk connection

After deployment, connect RepairDesk once by visiting:

`https://cellztech-website.vercel.app/api/repairdesk/oauth/start`

After approval, the OAuth token is stored in Supabase and the Book Repair form can create RepairDesk customers and leads.

## Admin dashboard

Visit:

`https://cellztech-website.vercel.app/admin`

Enter the value from `CELLZTECH_ADMIN_KEY` to view recent website repair requests.
