// Google Apps Script webhook for CellzTech repair requests.
// Paste this into script.google.com, deploy as a Web App, then put the Web App URL
// into Vercel as REPAIR_CALENDAR_WEBHOOK_URL.

const CALENDAR_ID = 'primary'; // Or use your shop calendar ID.
const DEFAULT_EVENT_MINUTES = 30;

function doPost(e) {
  const data = JSON.parse(e.postData.contents || '{}');
  const start = new Date(`${data.requestedDate}T${data.requestedTime}:00`);
  const end = new Date(start.getTime() + DEFAULT_EVENT_MINUTES * 60 * 1000);

  const title = `Repair request - ${data.model || data.device} - ${data.issue}`;
  const description = [
    'PENDING REPAIR REQUEST - NOT CONFIRMED YET',
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Device: ${data.device}`,
    `Model: ${data.model}`,
    `Issue: ${data.issue}`,
    `Notes: ${data.notes || 'None'}`,
    `Submitted: ${data.submittedAt || new Date().toISOString()}`
  ].join('\n');

  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  const event = calendar.createEvent(title, start, end, {
    description,
    location: 'Cellz Repairz, 3412 N Harlem Ave STE A, Chicago, IL 60634'
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, eventId: event.getId() }))
    .setMimeType(ContentService.MimeType.JSON);
}
