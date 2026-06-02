# CellzTech repair request backend setup

The booking form now posts to `/api/repair-request`.

## What the API can do

1. Send the shop an email with the repair request.
2. Forward the same request to a calendar webhook, such as Google Apps Script, so it can create a pending Google Calendar event.
3. If email/calendar variables are not connected yet, the frontend keeps the text-message fallback.

## Vercel environment variables

Add these in Vercel project settings:

```txt
RESEND_API_KEY=your_resend_api_key
REPAIR_TO_EMAIL=your_shop_email@example.com
RESEND_FROM_EMAIL=CellzTech Repair Requests <requests@yourdomain.com>
REPAIR_CALENDAR_WEBHOOK_URL=https://script.google.com/macros/s/your-web-app-id/exec
```

`RESEND_FROM_EMAIL` must use a domain verified in Resend. For testing only, Resend may allow `onboarding@resend.dev` depending on your account limits.

## Google Calendar option

Use `backend/google-apps-script-calendar.js` as the starting point:

1. Go to script.google.com.
2. Create a new Apps Script project.
3. Paste the file contents.
4. Update `CALENDAR_ID` if you want a specific shop calendar instead of your primary calendar.
5. Deploy as a Web App.
6. Copy the Web App URL into Vercel as `REPAIR_CALENDAR_WEBHOOK_URL`.

Calendar events are intentionally titled as repair requests / pending, because the requested time is not confirmed until the shop contacts the customer.
