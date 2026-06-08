function parseJsonResponse(response) {
  return response.text().then((text) => {
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  });
}

function getProvidedKey(req) {
  const headerKey = req.headers['x-cellztech-admin-key'];
  const auth = req.headers.authorization || '';
  const bearer = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7) : '';
  const queryKey = req.query?.key;
  return String(headerKey || bearer || queryKey || '').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const adminKey = process.env.CELLZTECH_ADMIN_KEY;
  if (!adminKey) {
    return res.status(503).json({ ok: false, message: 'Admin access is not configured yet.' });
  }

  if (getProvidedKey(req) !== adminKey) {
    return res.status(401).json({ ok: false, message: 'Invalid admin key.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.SUPABASE_REPAIR_REQUESTS_TABLE || 'website_repair_requests';

  if (!supabaseUrl || !serviceKey) {
    return res.status(503).json({ ok: false, message: 'Supabase is not configured.' });
  }

  const limit = Math.min(Math.max(Number(req.query?.limit || 75), 1), 200);
  const url = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/${table}?select=*&order=submitted_at.desc&limit=${limit}`;

  const response = await fetch(url, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Accept: 'application/json'
    }
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    return res.status(response.status).json({ ok: false, message: 'Could not load repair requests.', details: data });
  }

  return res.status(200).json({ ok: true, requests: Array.isArray(data) ? data : [] });
}
