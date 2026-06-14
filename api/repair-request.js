import { repairDeskFetch } from './repairdesk-oauth-utils.js';

const REQUIRED_FIELDS = ['device', 'model', 'issue', 'name', 'phone', 'email', 'requestedDate', 'requestedTime'];

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.length > 1 ? parts.slice(1).join(' ') : ''
  };
}

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined && item !== null && String(item).trim() !== '')
  );
}

function shouldSendCustomerEmailToRepairDesk() {
  return String(process.env.REPAIRDESK_SEND_CUSTOMER_EMAIL || '').toLowerCase() === 'true';
}


async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function findId(payload, keys = ['id', 'customer_id', 'ticket_id']) {
  if (!payload || typeof payload !== 'object') return '';

  for (const key of keys) {
    if (payload[key]) return String(payload[key]);
  }

  const nestedCandidates = [payload.data, payload.customer, payload.ticket, payload.result, payload.response];
  for (const candidate of nestedCandidates) {
    const id = findId(candidate, keys);
    if (id) return id;
  }

  return '';
}

function findValue(payload, keys = []) {
  if (!payload || typeof payload !== 'object') return '';

  for (const key of keys) {
    if (payload[key] !== undefined && payload[key] !== null && String(payload[key]).trim() !== '') {
      return String(payload[key]);
    }
  }

  const nestedCandidates = [payload.data, payload.customer, payload.ticket, payload.result, payload.response, payload.leadResponse];
  for (const candidate of nestedCandidates) {
    const value = findValue(candidate, keys);
    if (value) return value;
  }

  return '';
}


function displayTime(value) {
  if (!value) return '';
  if (String(value).includes('AM') || String(value).includes('PM')) return String(value);
  const [hourText, minuteText] = String(value).split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText || 0);
  if (Number.isNaN(hour)) return String(value);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function timeMinutes(value) {
  const [hourText, minuteText] = String(value || '').split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText || 0);
  if (Number.isNaN(hour)) return null;
  return (hour * 60) + (Number.isNaN(minute) ? 0 : minute);
}

function normalizeStoreTime(dateValue, timeValue) {
  const rawMinutes = timeMinutes(timeValue);
  if (rawMinutes === null) return String(timeValue || '');
  const date = new Date(`${dateValue}T12:00:00`);
  const day = Number.isNaN(date.getTime()) ? 1 : date.getDay();
  const isSaturday = day === 6;
  const isSunday = day === 0;
  const open = isSaturday ? 11 * 60 : 11 * 60;
  const close = isSaturday ? 15 * 60 : 19 * 60;
  if (isSunday) return '';
  const rounded = Math.round(rawMinutes / 30) * 30;
  const clamped = Math.max(open, Math.min(close - 30, rounded));
  return minutesToTime(clamped);
}

function formatTimeWindow(value) {
  const startMinutes = timeMinutes(value);
  if (startMinutes === null) return displayTime(value);
  const endValue = minutesToTime(startMinutes + 30);
  return `${displayTime(value)} - ${displayTime(endValue)}`;
}

function preferredTimeText(body) {
  return body.requestedTimeLabel || (body.requestedTime ? formatTimeWindow(body.requestedTime) : 'Not selected');
}

function formatDisplayDate(value) {
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value || 'Not selected';
  return parsed.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function customerRequestReference(body) {
  const raw = String(body.submittedAt || '').replace(/\D/g, '');
  if (!raw) return 'CT-REQUEST';
  return `CT-${raw.slice(2, 8)}-${raw.slice(8, 12)}`;
}

function formatShopRequestText(body) {
  return [
    `Device: ${body.device}`,
    `Series: ${body.series || 'Not provided'}`,
    `Model: ${body.model}`,
    `Issue: ${body.issue}`,
    `Requested date: ${body.requestedDate}`,
    `Preferred drop-off window: ${preferredTimeText(body)}`,
    '',
    `Name: ${body.name}`,
    `Phone: ${body.phone}`,
    `Email: ${body.email}`,
    `Notes: ${body.notes || 'None'}`,
    '',
    body.repairDeskLeadOrderId ? `RepairDesk lead: ${body.repairDeskLeadOrderId}` : (body.repairDeskLeadId ? `RepairDesk lead: ${body.repairDeskLeadId}` : 'RepairDesk lead: Pending / not connected'),
    body.repairDeskTicketId ? `RepairDesk ticket: ${body.repairDeskTicketId}` : 'RepairDesk ticket: Pending / not connected',
    body.repairDeskCustomerId ? `RepairDesk customer: ${body.repairDeskCustomerId}` : 'RepairDesk customer: Pending / not connected',
    '',
    'This is a repair request, not a confirmed appointment. Contact the customer to confirm price, parts, and availability.'
  ].join('\n');
}

function formatRepairDeskRequestText(body) {
  return [
    `Customer: ${body.name}`,
    `Phone: ${body.phone}`,
    `Email: ${body.email}`,
    '',
    `Device: ${body.device}`,
    `Series: ${body.series || 'Not provided'}`,
    `Model: ${body.model}`,
    `Issue: ${body.issue}`,
    `Requested date: ${body.requestedDate}`,
    `Preferred drop-off window: ${preferredTimeText(body)}`,
    body.notes ? `Notes: ${body.notes}` : ''
  ].filter(Boolean).join('\n');
}

function formatRequest(body) {
  return formatRepairDeskRequestText(body);
}

function shopEmailHtml(body) {
  const rows = [
    ['Device', body.device],
    ['Series', body.series || 'Not provided'],
    ['Model', body.model],
    ['Issue', body.issue],
    ['Requested date', body.requestedDate],
    ['Preferred drop-off window', preferredTimeText(body)],
    ['Name', body.name],
    ['Phone', body.phone],
    ['Email', body.email],
    ['Notes', body.notes || 'None'],
    ['RepairDesk customer', body.repairDeskCustomerId || 'Pending / not connected'],
    ['RepairDesk lead', body.repairDeskLeadOrderId || body.repairDeskLeadId || 'Pending / not connected'],
    ['RepairDesk ticket', body.repairDeskTicketId || 'Pending / not connected']
  ];

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;background:#f8fafc;padding:24px">
      <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #dbeafe;border-radius:18px;overflow:hidden">
        <div style="background:#0f172a;color:#ffffff;padding:22px 26px">
          <h2 style="margin:0;font-size:22px">New CellzTech repair request</h2>
          <p style="margin:8px 0 0;color:#bfdbfe">Internal shop copy with RepairDesk details.</p>
        </div>
        <div style="padding:24px 26px">
          <p style="margin:0 0 16px;color:#475569">This is a repair request, not a confirmed appointment. Contact the customer to confirm time, price, parts, and availability.</p>
          <table cellpadding="9" cellspacing="0" style="border-collapse:collapse;width:100%">
            ${rows.map(([label, value]) => `
              <tr>
                <td style="border:1px solid #dbeafe;background:#f8fafc;font-weight:700;width:190px">${escapeHtml(label)}</td>
                <td style="border:1px solid #dbeafe">${escapeHtml(value)}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      </div>
    </div>
  `;
}

function formatHtml(body) {
  return shopEmailHtml(body);
}

function customerEmailText(body) {
  const reference = customerRequestReference(body);
  return [
    'CellzTech repair request received',
    '',
    `Reference: ${reference}`,
    `Requested visit: ${formatDisplayDate(body.requestedDate)} ${preferredTimeText(body)}`,
    '',
    `Hi ${body.name},`,
    'We received your repair request and a team member will review it shortly.',
    'This is not a confirmed appointment yet. We will contact you to confirm the repair time, price, parts availability, and details before starting any work.',
    '',
    'Request summary',
    `Device: ${body.device}`,
    `Model: ${[body.series, body.model].filter(Boolean).join(' - ') || body.model}`,
    `Issue: ${body.issue}`,
    body.notes ? `Notes: ${body.notes}` : '',
    '',
    'Next steps',
    '1. We review the request.',
    '2. We contact you to confirm the details.',
    '3. We complete the repair after confirmation.',
    '',
    'CellzTech / Cellz Repairz LLC',
    '3412 N Harlem Ave STE A, Chicago, IL 60634',
    '773-413-7489',
    'https://cellztech.com'
  ].filter(Boolean).join('\n');
}


function customerEmailHtml(body) {
  const reference = customerRequestReference(body);
  const rows = [
    ['Device', body.device],
    ['Model', [body.series, body.model].filter(Boolean).join(' - ') || body.model],
    ['Issue', body.issue],
    ['Requested date', formatDisplayDate(body.requestedDate)],
    ['Drop-off window', preferredTimeText(body)]
  ];
  if (body.notes) rows.push(['Notes', body.notes]);

  return `
  <div style="margin:0;padding:0;background:#f3f8ff;font-family:Inter,Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:#f3f8ff;margin:0;padding:24px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;width:100%;background:#ffffff;border:1px solid #dce6f2;border-radius:24px;overflow:hidden;box-shadow:0 18px 40px rgba(14,30,64,.08);">
            <tr>
              <td style="padding:0;"><div style="height:6px;background:linear-gradient(90deg,#2563eb 0%,#0ea5e9 100%);"></div></td>
            </tr>
            <tr>
              <td style="padding:28px 32px 18px;text-align:left;">
                <div style="font-family:Sora,Inter,Arial,sans-serif;font-size:30px;font-weight:800;letter-spacing:-0.05em;line-height:1;"><span style="color:#07111f;">Cellz</span><span style="color:#2563eb;">Tech</span></div>
                <div style="margin-top:6px;font-size:12px;font-weight:700;letter-spacing:.02em;color:#66758c;">Professional phone, tablet, and device repair</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 8px;text-align:left;">
                <div style="display:inline-block;background:#eef5ff;border:1px solid #d6e8ff;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:#1d4ed8;">Repair request received</div>
                <h1 style="margin:16px 0 10px;font-size:31px;line-height:1.15;letter-spacing:-0.03em;color:#07111f;">Thanks, ${escapeHtml(body.name)} — your repair request is in.</h1>
                <p style="margin:0;font-size:16px;line-height:1.7;color:#475569;max-width:610px;">We received your request and a team member will review it shortly. This email is your customer copy and quick summary.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 0;text-align:left;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate;border-spacing:0;background:#f8fbff;border:1px solid #dce6f2;border-radius:18px;overflow:hidden;">
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid #e5edf6;vertical-align:top;text-align:left;">
                      <div style="font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#64748b;">Request reference</div>
                      <div style="margin-top:6px;font-size:24px;font-weight:800;letter-spacing:-0.03em;color:#07111f;">${escapeHtml(reference)}</div>
                    </td>
                    <td style="padding:18px 20px;border-bottom:1px solid #e5edf6;vertical-align:top;text-align:left;">
                      <div style="font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#64748b;">Requested visit</div>
                      <div style="margin-top:6px;font-size:16px;font-weight:800;color:#07111f;">${escapeHtml(formatDisplayDate(body.requestedDate))}</div>
                      <div style="margin-top:3px;font-size:14px;color:#475569;">${escapeHtml(preferredTimeText(body))}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px 0;text-align:left;">
                <h2 style="margin:0 0 14px;font-size:18px;line-height:1.3;color:#07111f;">Request summary</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border:1px solid #dce6f2;border-radius:18px;overflow:hidden;">
                  ${rows.map(([label, value], index) => `
                    <tr>
                      <td style="width:180px;padding:14px 16px;background:${index % 2 === 0 ? '#f8fbff' : '#f3f8ff'};border-bottom:1px solid #e5edf6;font-size:13px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:#64748b;text-align:left;vertical-align:top;">${escapeHtml(label)}</td>
                      <td style="padding:14px 16px;background:#ffffff;border-bottom:1px solid #e5edf6;font-size:15px;line-height:1.6;color:#0f172a;text-align:left;vertical-align:top;">${escapeHtml(value)}</td>
                    </tr>
                  `).join('')}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px 0;text-align:left;">
                <div style="background:linear-gradient(135deg,#07111f 0%,#0b1728 60%,#12324a 100%);border-radius:20px;padding:22px 22px 20px;color:#ffffff;text-align:left;">
                  <h2 style="margin:0 0 12px;font-size:18px;color:#ffffff;">What happens next</h2>
                  <div style="font-size:15px;line-height:1.75;color:#d9e8ff;">
                    <div style="margin:0 0 8px;"><strong style="color:#ffffff;">1.</strong> We review your repair request.</div>
                    <div style="margin:0 0 8px;"><strong style="color:#ffffff;">2.</strong> We contact you to confirm price, parts, and timing.</div>
                    <div style="margin:0;"><strong style="color:#ffffff;">3.</strong> After confirmation, we complete the repair.</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px 32px;text-align:left;">
                <div style="border:1px solid #dce6f2;border-radius:18px;padding:20px;background:#ffffff;text-align:left;">
                  <div style="font-size:16px;font-weight:800;color:#07111f;">CellzTech / Cellz Repairz LLC</div>
                  <div style="margin-top:10px;font-size:14px;line-height:1.75;color:#475569;">3412 N Harlem Ave STE A<br>Chicago, IL 60634<br><strong style="color:#07111f;">Phone:</strong> 773-413-7489<br><strong style="color:#07111f;">Website:</strong> <a href="https://cellztech.com" style="color:#2563eb;text-decoration:none;">cellztech.com</a></div>
                  <p style="margin:14px 0 0;font-size:13px;line-height:1.7;color:#64748b;">This is not a confirmed appointment yet. If you need immediate help, please call the store.</p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
}


async function sendEmail(body) {
  const apiKey = process.env.RESEND_API_KEY;
  const shopTo = process.env.CELLZTECH_NOTIFY_EMAIL || process.env.REPAIR_TO_EMAIL;
  const from = process.env.CELLZTECH_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'CellzTech Repair Requests <onboarding@resend.dev>';

  if (!apiKey || !shopTo) {
    return { skipped: true, reason: 'Missing RESEND_API_KEY or CELLZTECH_NOTIFY_EMAIL' };
  }

  const subjectPrefix = body.repairDeskLeadOrderId ? `RepairDesk Lead ${body.repairDeskLeadOrderId}` : (body.repairDeskLeadId ? `RepairDesk Lead #${body.repairDeskLeadId}` : (body.repairDeskTicketId ? `RepairDesk #${body.repairDeskTicketId}` : 'New repair request'));
  const shopSubject = `${subjectPrefix}: ${body.model} - ${body.issue}`;
  const messages = [
    {
      from,
      to: [shopTo],
      reply_to: body.email,
      subject: shopSubject,
      text: formatShopRequestText(body),
      html: shopEmailHtml(body)
    }
  ];

  if (body.email) {
    messages.push({
      from,
      to: [body.email],
      reply_to: shopTo,
      subject: 'CellzTech repair request received',
      text: customerEmailText(body),
      html: customerEmailHtml(body)
    });
  }

  const results = [];
  for (const message of messages) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Email service error: ${text}`);
    }
    results.push({ to: message.to, subject: message.subject });
  }

  return { skipped: false, sent: results };
}

async function sendCalendarWebhook(body) {
  const webhookUrl = process.env.REPAIR_CALENDAR_WEBHOOK_URL || process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;

  if (!webhookUrl) {
    return { skipped: true, reason: 'Missing REPAIR_CALENDAR_WEBHOOK_URL or GOOGLE_APPS_SCRIPT_WEBHOOK_URL' };
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Calendar webhook error: ${text}`);
  }

  return { skipped: false };
}

async function createRepairDeskCustomer(body) {
  const { firstName, lastName } = splitName(body.name);
  const phoneDigits = onlyDigits(body.phone);
  const payload = compactObject({
    first_name: firstName,
    last_name: lastName,
    name: body.name,
    full_name: body.name,
    ...(shouldSendCustomerEmailToRepairDesk() ? { email: body.email } : {}),
    phone: body.phone,
    mobile: body.phone,
    telephone: body.phone,
    phone_number: body.phone,
    mobile_number: body.phone,
    referred_by: process.env.REPAIRDESK_REFERRED_BY || 'CellzTech website',
    source: 'CellzTech website',
    notes: `Created from CellzTech website repair request. Phone digits: ${phoneDigits}`
  });

  const response = await repairDeskFetch('/customer', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(`RepairDesk customer error: ${JSON.stringify(data).slice(0, 500)}`);
  }

  return {
    skipped: false,
    id: findId(data, ['customer_id', 'cid', 'id', 'code']),
    response: data
  };
}


function asArray(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return [];
  for (const key of ['data', 'devices', 'items', 'results', 'response', 'problems', 'services']) {
    if (Array.isArray(value[key])) return value[key];
    if (value[key] && typeof value[key] === 'object') {
      const nested = asArray(value[key]);
      if (nested.length) return nested;
    }
  }
  return [];
}

function textFromCandidate(candidate) {
  if (!candidate || typeof candidate !== 'object') return '';
  return Object.values(candidate)
    .filter((value) => ['string', 'number'].includes(typeof value))
    .join(' ')
    .toLowerCase();
}

function scoreCandidate(candidate, terms) {
  const text = textFromCandidate(candidate);
  return terms.reduce((score, term) => {
    const normalized = String(term || '').toLowerCase().trim();
    if (!normalized) return score;
    if (text.includes(normalized)) return score + normalized.length;
    return score;
  }, 0);
}

function chooseBestCandidate(items, terms, minimumScore = 1) {
  let best = null;
  let bestScore = 0;
  for (const item of items) {
    const score = scoreCandidate(item, terms);
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  }
  return bestScore >= minimumScore ? best : null;
}

function issueSearchTerms(issue) {
  const value = String(issue || '').toLowerCase();
  const terms = [issue];

  if (value.includes('charg')) terms.push('charging port', 'charge port', 'charger port', 'dock connector', 'usb port', 'lightning port', 'usb-c port', 'charging');
  if (value.includes('screen') || value.includes('display') || value.includes('crack')) terms.push('screen', 'display', 'lcd', 'digitizer', 'glass');
  if (value.includes('batter')) terms.push('battery', 'battery replacement');
  if (value.includes('back')) terms.push('back glass', 'rear glass', 'housing');
  if (value.includes('camera')) terms.push('camera', 'front camera', 'rear camera');
  if (value.includes('speaker') || value.includes('microphone') || value.includes('audio')) terms.push('speaker', 'microphone', 'audio', 'earpiece');
  if (value.includes('water') || value.includes('liquid')) terms.push('water damage', 'liquid damage');
  if (value.includes('data')) terms.push('data recovery', 'data transfer');
  if (value.includes('software')) terms.push('software', 'restore', 'update');

  return Array.from(new Set(terms.filter(Boolean)));
}

function getObjectId(value) {
  return findId(value, ['id', 'device_id', 'deviceId', 'device', 'did', 'model_id', 'modelId', 'product_id', 'problem_id', 'problemId', 'service_id', 'serviceId', 'pid']);
}

function getObjectName(value, fallback = '') {
  if (!value || typeof value !== 'object') return fallback;
  for (const key of ['name', 'title', 'device_name', 'deviceName', 'model', 'model_name', 'problem', 'problem_name', 'service_name', 'display_name']) {
    if (value[key]) return String(value[key]);
  }
  return fallback;
}

function toUnixTimestamp(dateValue, timeValue) {
  const raw = `${dateValue || ''}T${timeValue || '12:00'}`;
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) return Math.floor(parsed.getTime() / 1000);
  return Math.floor((Date.now() + 86400000) / 1000);
}

function toRepairDeskDateTime(dateValue, timeValue, offsetMinutes = 0) {
  const raw = `${dateValue || ''}T${timeValue || '12:00'}`;
  const parsed = new Date(raw);
  const date = Number.isNaN(parsed.getTime()) ? new Date(Date.now() + 86400000) : parsed;
  date.setMinutes(date.getMinutes() + offsetMinutes);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function flattenObjects(value, output = [], depth = 0) {
  if (!value || depth > 8) return output;
  if (Array.isArray(value)) {
    value.forEach((item) => flattenObjects(item, output, depth + 1));
    return output;
  }
  if (typeof value === 'object') {
    output.push(value);
    Object.values(value).forEach((item) => {
      if (item && typeof item === 'object') flattenObjects(item, output, depth + 1);
    });
  }
  return output;
}

function moneyNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : Number(fallback).toFixed(2);
}

function makeRepairDeskTicketLine({ body, deviceId, deviceName, problemId, problemName, requestSummary }) {
  const assignedTo = process.env.REPAIRDESK_DEFAULT_EMPLOYEE_ID;
  const repairCategoryId = process.env.REPAIRDESK_DEFAULT_REPAIR_CATEGORY_ID || process.env.REPAIRDESK_POST_PRE_CATEGORY_ID || process.env.REPAIRDESK_REPAIR_CATEGORY_ID;
  const taxClass = process.env.REPAIRDESK_DEFAULT_TAX_CLASS_ID;
  const warranty = process.env.REPAIRDESK_DEFAULT_WARRANTY || '0';
  const taskType = process.env.REPAIRDESK_DEFAULT_TASK_TYPE || '0';
  const status = process.env.REPAIRDESK_DEFAULT_LINE_STATUS || 'In Progress';
  const dueOn = toUnixTimestamp(body.requestedDate, body.requestedTime);
  const serviceItem = compactObject({
    id: problemId,
    name: problemName || body.issue
  });

  return compactObject({
    imei: '',
    public_comments: `Website repair request: ${body.issue}. ${body.notes || ''}`.trim(),
    public_comment_flag: 1,
    PreConditions: [],
    status,
    PostPreCategory: repairCategoryId,
    task_type: Number.isFinite(Number(taskType)) ? Number(taskType) : taskType,
    device: deviceId || deviceName || body.model,
    staff_comments: requestSummary,
    warranty,
    lineItemId: 0,
    repairProdItems: serviceItem.name ? [serviceItem] : [],
    line_discount: 0,
    taxclass: taxClass,
    device_location: '',
    warranty_timeframe: process.env.REPAIRDESK_DEFAULT_WARRANTY_TIMEFRAME || '',
    Parts: [],
    supplied: [],
    security_code: '',
    network: '',
    serial: '',
    price: Number(process.env.REPAIRDESK_DEFAULT_REPAIR_PRICE || 0),
    due_on: dueOn,
    tax_inclusive: process.env.REPAIRDESK_TAX_INCLUSIVE || '1',
    assigned_to: assignedTo,
    repairCategId: repairCategoryId,
    images: [],
    pre_image_urls: [],
    post_image_urls: []
  });
}

async function tryRepairDeskJson(path) {
  try {
    const response = await repairDeskFetch(path);
    const data = await parseJsonResponse(response);
    if (!response.ok) return null;
    return data;
  } catch (error) {
    console.error(`RepairDesk catalog lookup failed for ${path}`, error);
    return null;
  }
}

async function resolveRepairDeskDevice(body) {
  const querySets = [
    `/devices?brand=${encodeURIComponent(body.device)}&type=${encodeURIComponent(body.series || '')}`,
    `/devices?manufacturer=${encodeURIComponent(body.device)}&type=${encodeURIComponent(body.series || '')}`,
    `/devices?brand=${encodeURIComponent(body.device)}&model=${encodeURIComponent(body.model)}`,
    `/devices?keyword=${encodeURIComponent(body.model)}`,
    `/devices`
  ];

  const terms = [body.model, body.series, body.device];
  for (const path of querySets) {
    const data = await tryRepairDeskJson(path);
    const items = asArray(data);
    const match = chooseBestCandidate(items, terms);
    if (match) return match;
  }
  return null;
}

async function resolveRepairDeskProblem(body, deviceObject) {
  const deviceId = getObjectId(deviceObject);
  const candidates = [];
  if (deviceId) candidates.push(`/problems/${encodeURIComponent(deviceId)}`);
  const terms = issueSearchTerms(body.issue);

  for (const path of candidates) {
    const data = await tryRepairDeskJson(path);
    const items = asArray(data);
    const match = chooseBestCandidate(items, terms);
    if (match) return match;
  }
  return null;
}

function buildFallbackDeviceObject(body) {
  return compactObject({
    brand: body.device,
    manufacturer: body.device,
    type: body.series,
    category: body.series,
    model: body.model,
    device_model: body.model,
    device_name: body.model,
    name: body.model,
    title: body.model
  });
}

function buildFallbackProblemObject(body) {
  return compactObject({
    name: body.issue,
    title: body.issue,
    problem: body.issue,
    problem_name: body.issue,
    service_name: body.issue,
    issue: body.issue
  });
}

async function buildRepairDeskTicketPayload(body, customerId, customerResponse) {
  const requestSummary = formatRequest({ ...body, repairDeskCustomerId: customerId });
  const preferredStatus = process.env.REPAIRDESK_DEFAULT_STATUS_ID;
  const preferredEmployee = process.env.REPAIRDESK_DEFAULT_EMPLOYEE_ID;
  const preferredStore = process.env.REPAIRDESK_STORE_ID;
  const customerObject = compactObject({
    id: customerId,
    cid: customerId,
    customer_id: customerId,
    name: body.name,
    first_name: splitName(body.name).firstName,
    last_name: splitName(body.name).lastName,
    ...(shouldSendCustomerEmailToRepairDesk() ? { email: body.email } : {}),
    phone: body.phone,
    mobile: body.phone,
    ...(customerResponse?.data && typeof customerResponse.data === 'object' ? customerResponse.data : {})
  });

  const resolvedDevice = await resolveRepairDeskDevice(body);
  const deviceObject = compactObject({
    ...buildFallbackDeviceObject(body),
    ...(resolvedDevice && typeof resolvedDevice === 'object' ? resolvedDevice : {})
  });
  const deviceId = getObjectId(deviceObject);

  const resolvedProblem = await resolveRepairDeskProblem(body, deviceObject);
  const problemObject = compactObject({
    ...buildFallbackProblemObject(body),
    ...(resolvedProblem && typeof resolvedProblem === 'object' ? resolvedProblem : {})
  });
  const problemId = getObjectId(problemObject);

  const ticketLine = compactObject({
    device: deviceObject,
    device_id: deviceId,
    problem: problemObject,
    problem_id: problemId,
    service: problemObject,
    service_id: problemId,
    issue: body.issue,
    notes: requestSummary,
    diagnostic_note: requestSummary
  });

  return compactObject({
    customer_id: customerId,
    customerId,
    cid: customerId,
    customer: customerObject,
    customer_name: body.name,
    ...(shouldSendCustomerEmailToRepairDesk() ? { customer_email: body.email } : {}),
    customer_phone: body.phone,
    name: body.name,
    ...(shouldSendCustomerEmailToRepairDesk() ? { email: body.email } : {}),
    phone: body.phone,
    device: deviceObject,
    device_id: deviceId,
    deviceId: deviceId,
    devices: [deviceObject],
    device_object: deviceObject,
    brand: body.device,
    manufacturer: body.device,
    series: body.series,
    model: body.model,
    device_model: body.model,
    problem: problemObject,
    problem_id: problemId,
    problemId: problemId,
    problems: [problemObject],
    service: problemObject,
    service_id: problemId,
    issue: body.issue,
    repair_problem: body.issue,
    ticket_items: [ticketLine],
    line_items: [ticketLine],
    repair_items: [ticketLine],
    subject: `${body.model} - ${body.issue}`,
    description: requestSummary,
    notes: requestSummary,
    diagnostic_note: requestSummary,
    requested_date: body.requestedDate,
    requested_time: preferredTimeText(body),
    appointment_date: body.requestedDate,
    appointment_time: preferredTimeText(body),
    source: 'CellzTech website',
    status_id: preferredStatus,
    assigned_to: preferredEmployee,
    employee_id: preferredEmployee,
    store_id: preferredStore,
    location_id: preferredStore,
    website_request: {
      requested_date: body.requestedDate,
      requested_time: preferredTimeText(body),
      notes: body.notes,
      selected_device_text: `${body.device} ${body.series} ${body.model}`,
      selected_issue_text: body.issue
    }
  });
}

async function postRepairDeskJson(path, payload) {
  const response = await repairDeskFetch(path, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  const data = await parseJsonResponse(response);
  return { ok: response.ok, status: response.status, data };
}

function buildTicketPayloadAttempts(basePayload, body, customerId, customerResponse) {
  const requestSummary = formatRequest({ ...body, repairDeskCustomerId: customerId });
  const customerData = customerResponse?.data && typeof customerResponse.data === 'object' ? customerResponse.data : {};
  const deviceObject = basePayload.device || buildFallbackDeviceObject(body);
  const problemObject = basePayload.problem || buildFallbackProblemObject(body);
  const deviceId = basePayload.device_id || getObjectId(deviceObject);
  const problemId = basePayload.problem_id || getObjectId(problemObject);
  const deviceName = getObjectName(deviceObject, body.model);
  const problemName = getObjectName(problemObject, body.issue);
  const employeeId = process.env.REPAIRDESK_DEFAULT_EMPLOYEE_ID;

  const customerBlock = compactObject({
    id: customerId,
    cid: customerId,
    customer_id: customerId,
    first_name: splitName(body.name).firstName,
    last_name: splitName(body.name).lastName,
    name: body.name,
    ...(shouldSendCustomerEmailToRepairDesk() ? { email: body.email } : {}),
    phone: body.phone,
    mobile: body.phone,
    ...customerData
  });

  const common = compactObject({
    customer_id: customerId,
    customer: customerBlock,
    cid: customerId,
    name: body.name,
    ...(shouldSendCustomerEmailToRepairDesk() ? { email: body.email } : {}),
    phone: body.phone,
    subject: `${body.model} - ${body.issue}`,
    description: requestSummary,
    notes: requestSummary,
    diagnostic_note: requestSummary,
    source: 'CellzTech website',
    requested_date: body.requestedDate,
    requested_time: preferredTimeText(body),
    appointment_date: body.requestedDate,
    appointment_time: preferredTimeText(body),
    store_id: process.env.REPAIRDESK_STORE_ID,
    location_id: process.env.REPAIRDESK_STORE_ID,
    status_id: process.env.REPAIRDESK_DEFAULT_STATUS_ID,
    employee_id: employeeId
  });

  const docsLine = makeRepairDeskTicketLine({ body, deviceId, deviceName, problemId, problemName, requestSummary });

  const docsPayload = compactObject({
    devices: [docsLine],
    customFields: [
      {
        website_request: {
          label: 'Website Request',
          value: 'CellzTech website'
        },
        requested_time: {
          label: 'Requested Time',
          value: `${body.requestedDate} ${preferredTimeText(body)}`
        }
      }
    ],
    summary: compactObject({
      signature: '',
      how_did_u_find_us: 'CellzTech website',
      customer_id: customerId,
      estimate_id: '',
      employee_id: employeeId
    })
  });

  const line = compactObject({
    device: deviceId || deviceName || body.model,
    device_id: deviceId,
    device_name: deviceName || body.model,
    model: body.model,
    manufacturer: body.device,
    brand: body.device,
    problem: problemId || problemName || body.issue,
    problem_id: problemId,
    service: problemId || problemName || body.issue,
    service_id: problemId,
    issue: body.issue,
    notes: requestSummary
  });

  return [
    // Attempt 1: match the RepairDesk documented /tickets schema exactly.
    { label: 'documented_devices_summary_schema', payload: docsPayload },

    // Attempt 2: same documented schema, but with lightweight text service when no RepairDesk problem id was found.
    {
      label: 'documented_schema_text_service',
      payload: {
        ...docsPayload,
        devices: [
          compactObject({
            ...docsLine,
            device: deviceId || deviceName || body.model,
            repairProdItems: [compactObject({ id: problemId, name: problemName || body.issue })],
            Parts: []
          })
        ]
      }
    },

    // Attempt 3: original rich object. Kept for accounts that accept nested device/problem objects.
    { label: 'rich_object', payload: basePayload },

    // Attempt 4: RepairDesk sometimes validates `device` as a required scalar. Use the device id when found, otherwise model text.
    {
      label: 'flat_scalar_device',
      payload: compactObject({
        ...common,
        device: deviceId || deviceName || body.model,
        device_id: deviceId,
        device_name: deviceName || body.model,
        model: body.model,
        manufacturer: body.device,
        brand: body.device,
        problem: problemId || problemName || body.issue,
        problem_id: problemId,
        service: problemId || problemName || body.issue,
        service_id: problemId,
        issue: body.issue,
        items: [line],
        ticket_items: [line]
      })
    },

    // Attempt 5: Some RepairDesk endpoints expect arrays/line-items and text labels.
    {
      label: 'line_items_text_device',
      payload: compactObject({
        ...common,
        device: deviceId || deviceName || body.model,
        problem: problemId || problemName || body.issue,
        issue: body.issue,
        repairs: [line],
        repair_items: [line],
        line_items: [line],
        devices: [makeRepairDeskTicketLine({ body, deviceId, deviceName, problemId, problemName, requestSummary })],
        problems: [compactObject({ id: problemId, name: problemName || body.issue })]
      })
    }
  ];
}

async function resolveRepairDeskAppointmentCatalog(body) {
  const catalog = { device: null, problem: null, repairType: null, serviceType: null };

  try {
    const inventory = await tryRepairDeskJson('/appointment/inventory');
    const objects = flattenObjects(inventory);
    catalog.device = chooseBestCandidate(objects, [body.model, body.series, body.device]);
    catalog.problem = chooseBestCandidate(objects, issueSearchTerms(body.issue), 4);
  } catch (error) {
    console.error('RepairDesk appointment inventory lookup failed', error);
  }

  try {
    const repairTypes = await tryRepairDeskJson('/appointment/repairtypes');
    const items = flattenObjects(repairTypes);
    catalog.repairType = chooseBestCandidate(items, [body.issue, body.series, body.device, 'repair']);
  } catch (error) {
    console.error('RepairDesk appointment repair type lookup failed', error);
  }

  try {
    const serviceTypes = await tryRepairDeskJson('/appointment/servicetypes');
    const items = flattenObjects(serviceTypes);
    catalog.serviceType = chooseBestCandidate(items, ['walk in', 'drop off', 'in store', 'store', 'repair']);
  } catch (error) {
    console.error('RepairDesk appointment service type lookup failed', error);
  }

  return catalog;
}

async function buildLeadPayloadAttempts(body, customerId, customerResponse, ticketErrorSummary = '') {
  const { firstName, lastName } = splitName(body.name);
  const requestSummary = [
    formatRequest({ ...body, repairDeskCustomerId: customerId }),
    ticketErrorSummary ? `\nTicket API fallback reason: ${ticketErrorSummary}` : ''
  ].join('\n');
  const customerData = customerResponse?.data && typeof customerResponse.data === 'object' ? customerResponse.data : {};
  const catalog = await resolveRepairDeskAppointmentCatalog(body);

  const deviceId = process.env.REPAIRDESK_DEFAULT_APPOINTMENT_DEVICE_ID || getObjectId(catalog.device) || getObjectId(customerData.device) || '';
  const deviceName = getObjectName(catalog.device, body.model);
  const problemId = process.env.REPAIRDESK_DEFAULT_APPOINTMENT_PROBLEM_ID || getObjectId(catalog.problem) || '';
  const matchedProblemName = catalog.problem ? getObjectName(catalog.problem, body.issue) : '';
  const problemName = process.env.REPAIRDESK_DEFAULT_APPOINTMENT_PROBLEM_NAME || matchedProblemName || body.issue;
  const repairType = process.env.REPAIRDESK_DEFAULT_APPOINTMENT_REPAIR_TYPE || getObjectId(catalog.repairType) || '1';
  const serviceType = process.env.REPAIRDESK_DEFAULT_APPOINTMENT_SERVICE_TYPE || getObjectId(catalog.serviceType) || '3';
  const price = moneyNumber(process.env.REPAIRDESK_DEFAULT_LEAD_PRICE || 0);
  const tax = moneyNumber(process.env.REPAIRDESK_DEFAULT_LEAD_TAX || 0);
  const startTime = toRepairDeskDateTime(body.requestedDate, body.requestedTime, 0);
  const endTime = toRepairDeskDateTime(body.requestedDate, body.requestedTime, Number(process.env.REPAIRDESK_DEFAULT_LEAD_MINUTES || 60));

  const documentedDevice = compactObject({
    repairType,
    imei: '',
    serial: '',
    device: deviceId || deviceName || body.model,
    price,
    serviceType,
    tax,
    repairProdItems: [compactObject({ id: problemId, name: problemName || body.issue })].filter((item) => item.name),
    additionalProblem: body.issue,
    customerNotes: requestSummary,
    securityCode: '',
    startTime,
    endTime
  });

  const summary = compactObject({
    firstName: firstName || body.name,
    lastName,
    ...(shouldSendCustomerEmailToRepairDesk() ? { email: body.email } : {}),
    mobile: body.phone,
    zipCode: '',
    address: '',
    referredBy: process.env.REPAIRDESK_REFERRED_BY || 'CellzTech website'
  });

  const customerBlock = compactObject({
    id: customerId,
    cid: customerId,
    customer_id: customerId,
    first_name: firstName,
    last_name: lastName,
    name: body.name,
    ...(shouldSendCustomerEmailToRepairDesk() ? { email: body.email } : {}),
    phone: body.phone,
    mobile: body.phone,
    ...customerData
  });

  const documentedPayload = {
    summary,
    devices: [documentedDevice]
  };

  return [
    { label: 'documented_appointment_schema', payload: documentedPayload },
    {
      label: 'documented_appointment_schema_with_customer_id',
      payload: {
        summary: compactObject({ ...summary, customer_id: customerId, customerId, cid: customerId }),
        devices: [documentedDevice]
      }
    },
    {
      label: 'appointment_schema_text_device',
      payload: {
        summary,
        devices: [
          compactObject({
            ...documentedDevice,
            device: deviceName || body.model,
            repairProdItems: [compactObject({ id: problemId, name: problemName || body.issue })].filter((item) => item.name)
          })
        ]
      }
    },
    {
      label: 'appointment_public_schema',
      payload: compactObject({
        summary,
        customer: customerBlock,
        customer_id: customerId,
        devices: [documentedDevice],
        device: deviceId || deviceName || body.model,
        problem: problemId || problemName || body.issue,
        repair_type: repairType,
        date: body.requestedDate,
        time: preferredTimeText(body),
        notes: requestSummary,
        source: 'CellzTech website'
      })
    }
  ];
}

async function createRepairDeskLead(body, customerId, customerResponse, ticketAttempts) {
  const ticketErrorSummary = JSON.stringify(ticketAttempts || []).slice(0, 700);
  const attempts = await buildLeadPayloadAttempts(body, customerId, customerResponse, ticketErrorSummary);
  const responses = [];

  for (const attempt of attempts) {
    const result = await postRepairDeskJson('/appointment/create', attempt.payload);
    responses.push({ label: attempt.label, ok: result.ok, status: result.status, response: result.data });
    if (result.ok && result.data?.success !== false) {
      return {
        skipped: false,
        type: 'lead',
        id: findId(result.data, ['lead_id', 'appointment_id', 'id', 'aid', 'code', 'ticket_id', 'tid']),
        orderId: findValue(result.data, ['order_id', 'lead_order_id', 'appointment_order_id', 'orderId', 'lead_number', 'appointment_number']),
        response: { createdVia: 'appointment/create', winningAttempt: attempt.label, leadResponse: result.data, ticketAttempts }
      };
    }
  }

  return {
    skipped: false,
    type: 'lead',
    id: '',
    response: { createdVia: 'appointment/create', attempts: responses, ticketAttempts },
    error: `RepairDesk lead error: ${JSON.stringify(responses).slice(0, 1000)}`
  };
}

async function createRepairDeskTicket(body, customerId, customerResponse) {
  const basePayload = await buildRepairDeskTicketPayload(body, customerId, customerResponse);
  const attempts = buildTicketPayloadAttempts(basePayload, body, customerId, customerResponse);
  const responses = [];

  for (const attempt of attempts) {
    const result = await postRepairDeskJson('/tickets', attempt.payload);
    responses.push({ label: attempt.label, ok: result.ok, status: result.status, response: result.data });
    if (result.ok && result.data?.success !== false) {
      return {
        skipped: false,
        type: 'ticket',
        id: findId(result.data, ['ticket_id', 'tid', 'id', 'ticketId', 'ticket_number', 'ticket_no', 'number', 'ticket_code', 'code']),
        response: { createdVia: 'tickets', winningAttempt: attempt.label, ticketResponse: result.data }
      };
    }
  }

  // Launch-safe fallback: if the true ticket endpoint rejects the device payload, create a RepairDesk Lead/Appointment.
  const leadResult = await createRepairDeskLead(body, customerId, customerResponse, responses);
  if (leadResult?.id) return leadResult;

  return {
    skipped: false,
    type: 'ticket',
    id: '',
    response: { createdVia: 'tickets_then_appointment_fallback', ticketAttempts: responses, leadResult: leadResult?.response || null },
    error: `RepairDesk ticket/lead error: ${JSON.stringify({ ticketAttempts: responses, leadResult }).slice(0, 1200)}`
  };
}

async function insertSupabaseBackup(record) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.SUPABASE_REPAIR_REQUESTS_TABLE || 'website_repair_requests';

  if (!supabaseUrl || !serviceKey) {
    return { skipped: true, reason: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' };
  }

  const response = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(record)
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(`Supabase backup error: ${JSON.stringify(data).slice(0, 500)}`);
  }

  return { skipped: false, response: data };
}

function buildSupabaseRecord(body, status, repairDeskCustomerResult, repairDeskLeadResult, repairDeskTicketResult, integrationErrors) {
  return {
    submitted_at: body.submittedAt,
    source: body.source,
    device: body.device,
    series: body.series,
    model: body.model,
    issue: body.issue,
    customer_name: body.name,
    customer_phone: body.phone,
    ...(shouldSendCustomerEmailToRepairDesk() ? { customer_email: body.email } : {}),
    requested_date: body.requestedDate,
    requested_time: preferredTimeText(body),
    notes: body.notes,
    status,
    repairdesk_customer_id: repairDeskCustomerResult?.id || null,
    repairdesk_lead_id: repairDeskLeadResult?.id || null,
    repairdesk_lead_order_id: repairDeskLeadResult?.orderId || null,
    repairdesk_ticket_id: repairDeskTicketResult?.id || null,
    repairdesk_customer_response: repairDeskCustomerResult?.response || null,
    repairdesk_lead_response: repairDeskLeadResult?.response || null,
    repairdesk_ticket_response: repairDeskTicketResult?.response || null,
    integration_errors: integrationErrors.length ? integrationErrors : null,
    raw_payload: body
  };
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const missing = REQUIRED_FIELDS.filter((field) => !String(body[field] || '').trim());

  if (missing.length || !isEmail(body.email)) {
    return res.status(400).json({
      ok: false,
      message: 'Please complete name, phone, email, requested date, and requested time before submitting.'
    });
  }

  const normalized = {
    device: String(body.device).trim(),
    series: String(body.series || '').trim(),
    model: String(body.model).trim(),
    issue: String(body.issue).trim(),
    name: String(body.name).trim(),
    phone: String(body.phone).trim(),
    email: String(body.email).trim().toLowerCase(),
    requestedDate: String(body.requestedDate).trim(),
    requestedTime: normalizeStoreTime(String(body.requestedDate).trim(), String(body.requestedTime).trim()),
    requestedTimeLabel: '',
    requestedDateTime: String(body.requestedDateTime || '').trim(),
    notes: String(body.notes || '').trim(),
    source: String(body.source || 'CellzTech website').trim(),
    submittedAt: new Date().toISOString()
  };
  normalized.requestedTimeLabel = String(body.requestedTimeLabel || '').trim() || formatTimeWindow(normalized.requestedTime);
  normalized.requestedDateTime = normalized.requestedDate && normalized.requestedTimeLabel
    ? `${normalized.requestedDate} at ${normalized.requestedTimeLabel}`
    : normalized.requestedDateTime;

  const integrationErrors = [];
  let repairDeskCustomerResult = { skipped: true, reason: 'Not attempted' };
  let repairDeskLeadResult = { skipped: true, reason: 'Not attempted' };
  let repairDeskTicketResult = { skipped: true, reason: 'Not attempted' };
  let supabaseResult = { skipped: true, reason: 'Not attempted' };
  let emailResult = { skipped: true, reason: 'Not attempted' };
  let calendarResult = { skipped: true, reason: 'Not attempted' };

  try {
    try {
      repairDeskCustomerResult = await createRepairDeskCustomer(normalized);
      const customerId = repairDeskCustomerResult.id || process.env.REPAIRDESK_FALLBACK_CUSTOMER_ID || '';

      // Website repair requests are leads first. Staff can convert the lead to a ticket in RepairDesk after confirming parts, price, and timing.
      repairDeskLeadResult = await createRepairDeskLead(normalized, customerId, repairDeskCustomerResult.response, []);
      if (repairDeskLeadResult?.error) integrationErrors.push(repairDeskLeadResult.error);

      // Optional: still attempt a true RepairDesk ticket if enabled. Lead creation remains the launch-safe primary workflow.
      if (String(process.env.REPAIRDESK_CREATE_TICKET_TOO || '').toLowerCase() === 'true') {
        repairDeskTicketResult = await createRepairDeskTicket(normalized, customerId, repairDeskCustomerResult.response);
        if (repairDeskTicketResult?.error) integrationErrors.push(repairDeskTicketResult.error);
      }
    } catch (error) {
      console.error(error);
      integrationErrors.push(error instanceof Error ? error.message : 'RepairDesk integration failed');
    }

    const status = repairDeskTicketResult?.id ? 'repairdesk_ticket_created' : (repairDeskLeadResult?.id ? 'repairdesk_lead_created' : 'website_request_saved');
    const enriched = {
      ...normalized,
      repairDeskCustomerId: repairDeskCustomerResult?.id || '',
      repairDeskLeadId: repairDeskLeadResult?.id || '',
      repairDeskLeadOrderId: repairDeskLeadResult?.orderId || '',
      repairDeskTicketId: repairDeskTicketResult?.id || ''
    };

    try {
      supabaseResult = await insertSupabaseBackup(
        buildSupabaseRecord(normalized, status, repairDeskCustomerResult, repairDeskLeadResult, repairDeskTicketResult, integrationErrors)
      );
    } catch (error) {
      console.error(error);
      integrationErrors.push(error instanceof Error ? error.message : 'Supabase backup failed');
    }

    try {
      [emailResult, calendarResult] = await Promise.all([
        sendEmail(enriched),
        sendCalendarWebhook(enriched)
      ]);
    } catch (error) {
      console.error(error);
      integrationErrors.push(error instanceof Error ? error.message : 'Notification failed');
    }

    const anyIntegrationWorked = !!(
      repairDeskLeadResult?.id ||
      repairDeskTicketResult?.id ||
      repairDeskCustomerResult?.id ||
      !supabaseResult?.skipped ||
      !emailResult?.skipped ||
      !calendarResult?.skipped
    );

    if (!anyIntegrationWorked) {
      return res.status(503).json({
        ok: false,
        message: 'The online backend is installed, but RepairDesk/Supabase is not fully connected yet. Please text or call the store for now.',
        integrations: {
          repairDeskCustomer: repairDeskCustomerResult,
          repairDeskLead: repairDeskLeadResult,
          repairDeskTicket: repairDeskTicketResult,
          supabase: supabaseResult,
          email: emailResult,
          calendar: calendarResult
        }
      });
    }

    return res.status(200).json({
      ok: true,
      message: repairDeskTicketResult?.id
        ? 'Repair request sent. We will contact you to confirm the requested date, time, price, and parts availability.'
        : 'Repair request sent. We will contact you to confirm the requested date, time, price, and parts availability.',
      repairDeskLeadId: repairDeskLeadResult?.id || null,
      repairDeskLeadOrderId: repairDeskLeadResult?.orderId || null,
      repairDeskTicketId: repairDeskTicketResult?.id || null,
      repairDeskCustomerId: repairDeskCustomerResult?.id || null,
      backupSaved: !supabaseResult?.skipped,
      emailSent: !emailResult?.skipped,
      calendarSent: !calendarResult?.skipped,
      warnings: integrationErrors
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: 'We could not send the online request yet. Please use Text instead or call the store.'
    });
  }
}
