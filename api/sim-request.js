function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
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

function clean(value) {
  return String(value || '').trim();
}

const requestTypeLabels = {
  shipping: 'Ship a physical Ultra Mobile SIM card',
  pickup: 'Pick up an Ultra Mobile SIM card at CellzTech',
  esim: 'Ask about Ultra Mobile eSIM help'
};

function formatText(body) {
  return [
    'New CellzTech Ultra Mobile SIM request',
    '',
    `Request type: ${requestTypeLabels[body.request_type] || body.request_type}`,
    `Plan interest: ${body.plan_interest || 'Not selected'}`,
    `Activation help: ${body.needs_activation_help ? 'Yes' : 'No / not sure'}`,
    '',
    `Name: ${body.customer_name}`,
    `Phone: ${body.customer_phone}`,
    `Email: ${body.customer_email}`,
    '',
    `Ship to: ${body.shipping_address || 'Not provided'}`,
    `City: ${body.shipping_city || 'Not provided'}`,
    `State: ${body.shipping_state || 'Not provided'}`,
    `ZIP: ${body.shipping_zip || 'Not provided'}`,
    '',
    `Notes: ${body.notes || 'None'}`,
    '',
    'This is a SIM request, not a completed purchase. Confirm SIM availability, activation details, shipping, and payment before fulfilling.'
  ].join('\n');
}

function formatHtml(body) {
  const rows = [
    ['Request type', requestTypeLabels[body.request_type] || body.request_type],
    ['Plan interest', body.plan_interest || 'Not selected'],
    ['Activation help', body.needs_activation_help ? 'Yes' : 'No / not sure'],
    ['Name', body.customer_name],
    ['Phone', body.customer_phone],
    ['Email', body.customer_email],
    ['Shipping address', body.shipping_address || 'Not provided'],
    ['City', body.shipping_city || 'Not provided'],
    ['State', body.shipping_state || 'Not provided'],
    ['ZIP', body.shipping_zip || 'Not provided'],
    ['Notes', body.notes || 'None']
  ];

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a">
      <h2 style="margin:0 0 10px">New CellzTech Ultra Mobile SIM request</h2>
      <p style="margin:0 0 16px;color:#475569">This is a request, not a completed purchase. Confirm SIM availability, activation details, shipping, and payment before fulfilling.</p>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px">
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
  const to = process.env.CELLZTECH_NOTIFY_EMAIL || process.env.REPAIR_TO_EMAIL;
  const from = process.env.CELLZTECH_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'CellzTech SIM Requests <onboarding@resend.dev>';

  if (!apiKey || !to) {
    return { skipped: true, reason: 'Missing RESEND_API_KEY or CELLZTECH_NOTIFY_EMAIL' };
  }

  const subject = `Ultra SIM Request: ${body.customer_name} - ${requestTypeLabels[body.request_type] || body.request_type}`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: body.customer_email,
      subject,
      text: formatText(body),
      html: formatHtml(body)
    })
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(`Email service error: ${JSON.stringify(data).slice(0, 500)}`);
  }

  return { skipped: false, response: data };
}

async function saveToSupabase(body) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.SUPABASE_SIM_REQUESTS_TABLE || 'ultra_sim_requests';

  if (!supabaseUrl || !serviceKey) {
    return { skipped: true, reason: 'Missing Supabase configuration' };
  }

  const response = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(body)
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(`Supabase SIM request error: ${JSON.stringify(data).slice(0, 500)}`);
  }

  return { skipped: false, response: data, id: Array.isArray(data) && data[0]?.id ? data[0].id : '' };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const input = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const requestType = clean(input.requestType || input.request_type || 'shipping');
    const body = {
      source: 'CellzTech website',
      status: 'sim_request_saved',
      request_type: ['shipping', 'pickup', 'esim'].includes(requestType) ? requestType : 'shipping',
      plan_interest: clean(input.planInterest || input.plan_interest),
      needs_activation_help: Boolean(input.needsActivationHelp || input.needs_activation_help),
      customer_name: clean(input.name || input.customer_name),
      customer_phone: clean(input.phone || input.customer_phone),
      customer_email: clean(input.email || input.customer_email),
      shipping_address: clean(input.shippingAddress || input.shipping_address),
      shipping_city: clean(input.shippingCity || input.shipping_city),
      shipping_state: clean(input.shippingState || input.shipping_state),
      shipping_zip: clean(input.shippingZip || input.shipping_zip),
      notes: clean(input.notes),
      raw_payload: input
    };

    if (!body.customer_name || !body.customer_phone || !body.customer_email) {
      return res.status(400).json({ ok: false, message: 'Please enter your name, phone number, and email.' });
    }

    if (!isEmail(body.customer_email)) {
      return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
    }

    if (body.request_type === 'shipping' && (!body.shipping_address || !body.shipping_city || !body.shipping_state || !body.shipping_zip)) {
      return res.status(400).json({ ok: false, message: 'Please enter the shipping address for a mailed SIM request.' });
    }

    let saveResult = null;
    let emailResult = null;
    const warnings = [];

    try {
      saveResult = await saveToSupabase(body);
    } catch (error) {
      warnings.push({ step: 'supabase', message: error instanceof Error ? error.message : String(error) });
    }

    try {
      emailResult = await sendEmail(body);
    } catch (error) {
      warnings.push({ step: 'email', message: error instanceof Error ? error.message : String(error) });
    }

    if (saveResult?.skipped && emailResult?.skipped) {
      return res.status(503).json({ ok: false, message: 'SIM request backend is not configured yet.' });
    }

    return res.status(200).json({ ok: true, message: 'SIM request sent.', id: saveResult?.id || '', warnings, notification: emailResult });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error instanceof Error ? error.message : 'SIM request failed.' });
  }
}
