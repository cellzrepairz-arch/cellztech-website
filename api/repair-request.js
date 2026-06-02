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

function formatRequest(body) {
  return [
    `Device: ${body.device}`,
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
    'This is a repair request, not a confirmed appointment. Contact the customer to confirm price, parts, and availability.'
  ].join('\n');
}

function formatHtml(body) {
  const rows = [
    ['Device', body.device],
    ['Model', body.model],
    ['Issue', body.issue],
    ['Requested date', body.requestedDate],
    ['Requested time', body.requestedTime],
    ['Name', body.name],
    ['Phone', body.phone],
    ['Email', body.email],
    ['Notes', body.notes || 'None']
  ];

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a">
      <h2 style="margin:0 0 10px">New CellzTech repair request</h2>
      <p style="margin:0 0 16px;color:#475569">This is a repair request, not a confirmed appointment. Contact the customer to confirm time, price, parts, and availability.</p>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="border:1px solid #dbeafe;background:#f8fafc;font-weight:700;width:170px">${escapeHtml(label)}</td>
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

  const subject = `New repair request: ${body.model} - ${body.issue}`;
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
    model: String(body.model).trim(),
    issue: String(body.issue).trim(),
    name: String(body.name).trim(),
    phone: String(body.phone).trim(),
    email: String(body.email).trim(),
    requestedDate: String(body.requestedDate).trim(),
    requestedTime: String(body.requestedTime).trim(),
    notes: String(body.notes || '').trim(),
    source: String(body.source || 'CellzTech website').trim(),
    submittedAt: new Date().toISOString()
  };

  try {
    const [emailResult, calendarResult] = await Promise.all([
      sendEmail(normalized),
      sendCalendarWebhook(normalized)
    ]);

    if (emailResult.skipped && calendarResult.skipped) {
      return res.status(503).json({
        ok: false,
        message: 'The online backend is ready in the code, but email/calendar environment variables are not connected in Vercel yet. Please use Text instead for now.'
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Repair request sent. We will contact you to confirm the requested date and time.',
      emailSent: !emailResult.skipped,
      calendarSent: !calendarResult.skipped
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: 'We could not send the online request yet. Please use Text instead or call the store.'
    });
  }
}
