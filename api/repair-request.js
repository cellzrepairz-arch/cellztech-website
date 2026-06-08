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

function formatRequest(body) {
  return [
    `Device: ${body.device}`,
    `Series: ${body.series || 'Not provided'}`,
    `Model: ${body.model}`,
    `Issue: ${body.issue}`,
    `Requested date: ${body.requestedDate}`,
    `Requested time: ${body.requestedTime}`,
    '',
    `Name: ${body.name}`,
    `Phone: ${body.phone}`,
    `Email: ${body.email}`,
    `Notes: ${body.notes || 'None'}`,
    '',
    body.repairDeskTicketId ? `RepairDesk ticket: ${body.repairDeskTicketId}` : 'RepairDesk ticket: Pending / not connected',
    body.repairDeskCustomerId ? `RepairDesk customer: ${body.repairDeskCustomerId}` : 'RepairDesk customer: Pending / not connected',
    '',
    'This is a repair request, not a confirmed appointment. Contact the customer to confirm price, parts, and availability.'
  ].join('\n');
}

function formatHtml(body) {
  const rows = [
    ['Device', body.device],
    ['Series', body.series || 'Not provided'],
    ['Model', body.model],
    ['Issue', body.issue],
    ['Requested date', body.requestedDate],
    ['Requested time', body.requestedTime],
    ['Name', body.name],
    ['Phone', body.phone],
    ['Email', body.email],
    ['Notes', body.notes || 'None'],
    ['RepairDesk customer', body.repairDeskCustomerId || 'Pending / not connected'],
    ['RepairDesk ticket', body.repairDeskTicketId || 'Pending / not connected']
  ];

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a">
      <h2 style="margin:0 0 10px">New CellzTech repair request</h2>
      <p style="margin:0 0 16px;color:#475569">This is a repair request, not a confirmed appointment. Contact the customer to confirm time, price, parts, and availability.</p>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:680px">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="border:1px solid #dbeafe;background:#f8fafc;font-weight:700;width:180px">${escapeHtml(label)}</td>
            <td style="border:1px solid #dbeafe">${escapeHtml(value)}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  `;
}

async function sendEmail(body) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.REPAIR_TO_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || 'CellzTech Repair Requests <onboarding@resend.dev>';

  if (!apiKey || !to) {
    return { skipped: true, reason: 'Missing RESEND_API_KEY or REPAIR_TO_EMAIL' };
  }

  const subjectPrefix = body.repairDeskTicketId ? `RepairDesk #${body.repairDeskTicketId}` : 'New repair request';
  const subject = `${subjectPrefix}: ${body.model} - ${body.issue}`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: body.email,
      subject,
      text: formatRequest(body),
      html: formatHtml(body)
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Email service error: ${text}`);
  }

  return { skipped: false };
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
    email: body.email,
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
    id: findId(data, ['customer_id', 'id']),
    response: data
  };
}

function buildRepairDeskTicketPayload(body, customerId) {
  const requestSummary = formatRequest({ ...body, repairDeskCustomerId: customerId });
  const preferredStatus = process.env.REPAIRDESK_DEFAULT_STATUS_ID;
  const preferredEmployee = process.env.REPAIRDESK_DEFAULT_EMPLOYEE_ID;
  const preferredStore = process.env.REPAIRDESK_STORE_ID;

  return compactObject({
    customer_id: customerId,
    customerId,
    customer: customerId,
    customer_name: body.name,
    customer_email: body.email,
    customer_phone: body.phone,
    name: body.name,
    email: body.email,
    phone: body.phone,
    device: body.device,
    brand: body.device,
    manufacturer: body.device,
    series: body.series,
    model: body.model,
    device_model: body.model,
    problem: body.issue,
    issue: body.issue,
    repair_problem: body.issue,
    subject: `${body.model} - ${body.issue}`,
    description: requestSummary,
    notes: requestSummary,
    diagnostic_note: requestSummary,
    requested_date: body.requestedDate,
    requested_time: body.requestedTime,
    source: 'CellzTech website',
    status_id: preferredStatus,
    assigned_to: preferredEmployee,
    employee_id: preferredEmployee,
    store_id: preferredStore,
    location_id: preferredStore
  });
}

async function createRepairDeskTicket(body, customerId) {
  const payload = buildRepairDeskTicketPayload(body, customerId);
  const response = await repairDeskFetch('/tickets', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(`RepairDesk ticket error: ${JSON.stringify(data).slice(0, 500)}`);
  }

  return {
    skipped: false,
    id: findId(data, ['ticket_id', 'id']),
    response: data
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

function buildSupabaseRecord(body, status, repairDeskCustomerResult, repairDeskTicketResult, integrationErrors) {
  return {
    submitted_at: body.submittedAt,
    source: body.source,
    device: body.device,
    series: body.series,
    model: body.model,
    issue: body.issue,
    customer_name: body.name,
    customer_phone: body.phone,
    customer_email: body.email,
    requested_date: body.requestedDate,
    requested_time: body.requestedTime,
    notes: body.notes,
    status,
    repairdesk_customer_id: repairDeskCustomerResult?.id || null,
    repairdesk_ticket_id: repairDeskTicketResult?.id || null,
    repairdesk_customer_response: repairDeskCustomerResult?.response || null,
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
    requestedTime: String(body.requestedTime).trim(),
    requestedDateTime: String(body.requestedDateTime || '').trim(),
    notes: String(body.notes || '').trim(),
    source: String(body.source || 'CellzTech website').trim(),
    submittedAt: new Date().toISOString()
  };

  const integrationErrors = [];
  let repairDeskCustomerResult = { skipped: true, reason: 'Not attempted' };
  let repairDeskTicketResult = { skipped: true, reason: 'Not attempted' };
  let supabaseResult = { skipped: true, reason: 'Not attempted' };
  let emailResult = { skipped: true, reason: 'Not attempted' };
  let calendarResult = { skipped: true, reason: 'Not attempted' };

  try {
    try {
      repairDeskCustomerResult = await createRepairDeskCustomer(normalized);
      const customerId = repairDeskCustomerResult.id || process.env.REPAIRDESK_FALLBACK_CUSTOMER_ID || '';
      repairDeskTicketResult = await createRepairDeskTicket(normalized, customerId);
    } catch (error) {
      console.error(error);
      integrationErrors.push(error instanceof Error ? error.message : 'RepairDesk integration failed');
    }

    const status = repairDeskTicketResult?.id ? 'repairdesk_ticket_created' : 'website_request_saved';
    const enriched = {
      ...normalized,
      repairDeskCustomerId: repairDeskCustomerResult?.id || '',
      repairDeskTicketId: repairDeskTicketResult?.id || ''
    };

    try {
      supabaseResult = await insertSupabaseBackup(
        buildSupabaseRecord(normalized, status, repairDeskCustomerResult, repairDeskTicketResult, integrationErrors)
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
