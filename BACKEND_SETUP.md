# CellzTech Phase 1A Backend Setup

Phase 1A connects the public Book Repair form to a server-side Vercel API route.

Flow:

1. Customer submits Book Repair on CellzTech.
2. `/api/repair-request` validates the request.
3. The backend creates a customer in RepairDesk.
4. The backend creates a RepairDesk ticket.
5. The backend saves a backup copy in Supabase.
6. Optional notifications can still go to Resend email and Google Calendar webhook.

## Vercel environment variables

Add these in Vercel under Project Settings > Environment Variables.

### RepairDesk

```txt
REPAIRDESK_API_KEY=your_repairdesk_api_key
REPAIRDESK_BASE_URL=https://api.repairdesk.co/api/web/v1
```

Optional, if your account requires defaults for ticket creation:

```txt
REPAIRDESK_STORE_ID=
REPAIRDESK_DEFAULT_STATUS_ID=
REPAIRDESK_DEFAULT_EMPLOYEE_ID=
REPAIRDESK_REFERRED_BY=CellzTech website
REPAIRDESK_FALLBACK_CUSTOMER_ID=
```

RepairDesk docs say API keys are generated from Store > General Settings > Other Information, the base URL is `https://api.repairdesk.co/api/web/v1/`, responses are JSON, and the request rate is 50 requests per minute.

### Supabase backup

```txt
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_REPAIR_REQUESTS_TABLE=website_repair_requests
```

Run this SQL in Supabase before enabling backup:

```txt
supabase/website_repair_requests.sql
```

Important: only use the service role key in Vercel server-side environment variables. Never place it in React/front-end code.

### Optional Resend email notification

```txt
RESEND_API_KEY=
REPAIR_TO_EMAIL=
RESEND_FROM_EMAIL=CellzTech Repair Requests <requests@yourdomain.com>
```

### Optional calendar webhook

```txt
REPAIR_CALENDAR_WEBHOOK_URL=
```

## Testing checklist

1. Deploy to Vercel with the environment variables.
2. Submit a test repair request from the live site.
3. Confirm the API returns success.
4. Confirm a RepairDesk customer was created.
5. Confirm a RepairDesk ticket was created.
6. Confirm the row appears in Supabase `website_repair_requests`.
7. Confirm the customer-facing success message does not say the appointment is confirmed.

## Notes

The RepairDesk public API exposes customer and ticket endpoints, but individual accounts may require specific field IDs/defaults. If RepairDesk rejects a ticket payload, the API route logs the exact response in Vercel logs and still tries to save the website request backup in Supabase.
