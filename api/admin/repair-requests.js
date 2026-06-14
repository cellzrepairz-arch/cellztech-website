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
  const repairTable = process.env.SUPABASE_REPAIR_REQUESTS_TABLE || 'website_repair_requests';
  const simTable = process.env.SUPABASE_SIM_REQUESTS_TABLE || 'ultra_sim_requests';
  const visitTable = process.env.SUPABASE_SITE_VISIT_EVENTS_TABLE || 'site_visit_events';

  if (!supabaseUrl || !serviceKey) {
    return res.status(503).json({ ok: false, message: 'Supabase is not configured.' });
  }

  const limit = Math.min(Math.max(Number(req.query?.limit || 75), 1), 200);
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    Accept: 'application/json'
  };

  async function loadTable(table, orderColumn = 'submitted_at') {
    const url = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/${table}?select=*&order=${orderColumn}.desc&limit=${limit}`;
    const response = await fetch(url, { headers });
    const data = await parseJsonResponse(response);
    if (!response.ok) {
      return { ok: false, status: response.status, data };
    }
    return { ok: true, data: Array.isArray(data) ? data : [] };
  }


  async function loadVisitorStats() {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const params = new URLSearchParams({
      select: 'path,page,language,referrer,user_agent,created_at',
      created_at: `gte.${thirtyDaysAgo.toISOString()}`,
      order: 'created_at.desc',
      limit: '1000'
    });
    const url = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/${visitTable}?${params.toString()}`;
    const response = await fetch(url, { headers });
    const data = await parseJsonResponse(response);
    if (!response.ok) {
      return { ok: false, status: response.status, data };
    }

    const rows = Array.isArray(data) ? data : [];
    const countSince = (date) => rows.filter((row) => {
      const parsed = new Date(row.created_at || '');
      return !Number.isNaN(parsed.getTime()) && parsed >= date;
    }).length;
    const topPageMap = new Map();
    for (const row of rows) {
      const key = row.path || row.page || '/';
      topPageMap.set(key, (topPageMap.get(key) || 0) + 1);
    }
    const topPages = Array.from(topPageMap.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      ok: true,
      data: {
        today: countSince(todayStart),
        last7Days: countSince(sevenDaysAgo),
        last30Days: rows.length,
        topPages,
        recent: rows.slice(0, 10)
      }
    };
  }

  const repairResult = await loadTable(repairTable);
  if (!repairResult.ok) {
    return res.status(repairResult.status).json({ ok: false, message: 'Could not load repair requests.', details: repairResult.data });
  }

  const simResult = await loadTable(simTable);
  const simRequests = simResult.ok ? simResult.data : [];
  const visitorResult = await loadVisitorStats();

  return res.status(200).json({
    ok: true,
    requests: repairResult.data,
    simRequests,
    visitorStats: visitorResult.ok ? visitorResult.data : { today: 0, last7Days: 0, last30Days: 0, topPages: [], recent: [] },
    simWarning: simResult.ok ? null : simResult.data,
    visitorWarning: visitorResult.ok ? null : visitorResult.data
  });
}
