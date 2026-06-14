function json(res, statusCode, data) {
  res.status(statusCode).setHeader('Cache-Control', 'no-store');
  return res.json(data);
}

function safeText(value, fallback = '', max = 500) {
  return String(value || fallback).slice(0, max);
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

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return json(res, 405, { ok: false, error: 'Method not allowed' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return json(res, 500, {
        ok: false,
        error: 'Missing Supabase environment variables',
        hasUrl: Boolean(supabaseUrl),
        hasServiceKey: Boolean(serviceKey)
      });
    }

    let body = req.body || {};
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body || '{}');
      } catch {
        body = {};
      }
    }

    const payload = {
      path: safeText(body.path, '/', 500),
      page: safeText(body.page, '', 500),
      language: safeText(body.language, 'en', 20),
      referrer: safeText(body.referrer, '', 1000),
      user_agent: safeText(req.headers['user-agent'], '', 1000)
    };

    const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/site_visit_events`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    const data = await parseJsonResponse(response);

    if (!response.ok) {
      return json(res, 500, {
        ok: false,
        error: 'Supabase insert failed',
        statusCode: response.status,
        details: data
      });
    }

    return json(res, 200, { ok: true, tracked: true });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown visitor tracking error'
    });
  }
}
