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

function safeDate(value) {
  const parsed = new Date(value || '');
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const CHICAGO_TIME_ZONE = 'America/Chicago';
const chicagoFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: CHICAGO_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  hourCycle: 'h23',
  weekday: 'short'
});

function chicagoParts(value) {
  const date = value instanceof Date ? value : safeDate(value);
  if (!date) return null;
  const parts = Object.fromEntries(chicagoFormatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour || 0),
    weekday: parts.weekday || ''
  };
}

function dateKeyDaysAgo(daysAgo) {
  const date = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000));
  return chicagoParts(date)?.dateKey || date.toISOString().slice(0, 10);
}

function percentageChange(current, previous) {
  if (!previous) return current ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function classifyDevice(userAgent) {
  const ua = String(userAgent || '').toLowerCase();
  if (/ipad|tablet|kindle|silk/.test(ua)) return 'Tablet';
  if (/iphone|ipod|android.*mobile|windows phone|mobile/.test(ua)) return 'Mobile';
  if (/bot|crawler|spider|preview/.test(ua)) return 'Bot / preview';
  return 'Desktop';
}

function classifyBrowser(userAgent) {
  const ua = String(userAgent || '').toLowerCase();
  if (/edg\//.test(ua)) return 'Edge';
  if (/opr\//.test(ua)) return 'Opera';
  if (/firefox\//.test(ua)) return 'Firefox';
  if (/chrome\//.test(ua) && !/edg\//.test(ua)) return 'Chrome';
  if (/safari\//.test(ua) && !/chrome\//.test(ua)) return 'Safari';
  return 'Other';
}

function classifySource(referrer) {
  const raw = String(referrer || '').trim();
  if (!raw) return 'Direct / unknown';
  try {
    const host = new URL(raw).hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'cellztech.com' || host.endsWith('.cellztech.com') || host.endsWith('.vercel.app')) return 'Internal navigation';
    if (host.includes('google.')) return 'Google';
    if (host.includes('facebook.com') || host.includes('fb.com')) return 'Facebook';
    if (host.includes('instagram.com')) return 'Instagram';
    if (host.includes('bing.com')) return 'Bing';
    if (host.includes('yahoo.com')) return 'Yahoo';
    if (host.includes('tiktok.com')) return 'TikTok';
    return host;
  } catch {
    return 'Other referral';
  }
}

function friendlyActionName(path, page) {
  const raw = String(page || path || '').replace(/^\/event\//, '');
  const labels = {
    homepage_august_call_click: 'Call clicks',
    homepage_august_directions_click: 'Directions clicks',
    homepage_august_repair_booking_click: 'Repair booking clicks',
    homepage_august_ultra_inquiry_click: 'Ultra inquiry clicks',
    homepage_august_family_offer_click: 'Family plan clicks',
    homepage_august_fourth_month_click: 'Fourth-month offer clicks',
    homepage_august_25_offer_click: '$25 Unlimited clicks',
    homepage_august_bonus_click: 'Bonus offer clicks'
  };
  if (labels[raw]) return labels[raw];
  return raw
    .replace(/^homepage_august_/, '')
    .replace(/_click$/, ' clicks')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function mapCounts(rows, getKey, limit = 8) {
  const counts = new Map();
  for (const row of rows) {
    const key = getKey(row);
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const total = rows.length || 1;
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count, share: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function estimateSessions(rows, sinceDate) {
  const filtered = rows
    .map((row) => ({ ...row, parsedAt: safeDate(row.created_at) }))
    .filter((row) => row.parsedAt && row.parsedAt >= sinceDate)
    .sort((a, b) => a.parsedAt.getTime() - b.parsedAt.getTime());

  const lastSeen = new Map();
  let sessions = 0;
  for (const row of filtered) {
    const key = [row.user_agent || 'unknown', classifySource(row.referrer), row.language || 'unknown'].join('|');
    const previous = lastSeen.get(key);
    const timestamp = row.parsedAt.getTime();
    if (!previous || timestamp - previous > 30 * 60 * 1000) sessions += 1;
    lastSeen.set(key, timestamp);
  }
  return sessions;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');

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

  const limit = Math.min(Math.max(Number(req.query?.limit || 200), 1), 500);
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    Accept: 'application/json',
    'Cache-Control': 'no-cache'
  };
  const baseUrl = supabaseUrl.replace(/\/+$/, '');

  async function loadTable(table, orderColumn = 'submitted_at') {
    const url = `${baseUrl}/rest/v1/${table}?select=*&order=${orderColumn}.desc&limit=${limit}`;
    const response = await fetch(url, { headers, cache: 'no-store' });
    const data = await parseJsonResponse(response);
    if (!response.ok) return { ok: false, status: response.status, data };
    return { ok: true, data: Array.isArray(data) ? data : [] };
  }

  async function loadVisitRows() {
    const ninetyDaysAgo = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000)).toISOString();
    const pageSize = 1000;
    const maxRows = 5000;
    const rows = [];

    for (let offset = 0; offset < maxRows; offset += pageSize) {
      const params = new URLSearchParams({
        select: 'path,page,language,referrer,user_agent,created_at',
        created_at: `gte.${ninetyDaysAgo}`,
        order: 'created_at.desc',
        limit: String(pageSize),
        offset: String(offset)
      });
      const response = await fetch(`${baseUrl}/rest/v1/${visitTable}?${params.toString()}`, {
        headers,
        cache: 'no-store'
      });
      const data = await parseJsonResponse(response);
      if (!response.ok) return { ok: false, status: response.status, data };
      const batch = Array.isArray(data) ? data : [];
      rows.push(...batch);
      if (batch.length < pageSize) break;
    }

    return { ok: true, data: rows };
  }

  function mapFallbackSimRequests(rows) {
    return rows
      .filter((row) => row.status === 'ultra_sim_request_saved' || row.device === 'Ultra Mobile SIM' || String(row.source || '').includes('Ultra SIM fallback'))
      .map((row) => {
        const raw = row.raw_payload || {};
        return {
          id: `fallback-${row.id}`,
          submitted_at: row.submitted_at || row.created_at,
          status: row.status || 'ultra_sim_request_saved',
          request_type: raw.requestType || raw.request_type || 'shipping',
          plan_interest: raw.planInterest || raw.plan_interest || row.model || 'Ultra Mobile SIM request',
          needs_activation_help: Boolean(raw.needsActivationHelp || raw.needs_activation_help),
          customer_name: row.customer_name,
          customer_phone: row.customer_phone,
          customer_email: row.customer_email,
          shipping_address: raw.shippingAddress || raw.shipping_address || '',
          shipping_city: raw.shippingCity || raw.shipping_city || '',
          shipping_state: raw.shippingState || raw.shipping_state || '',
          shipping_zip: raw.shippingZip || raw.shipping_zip || '',
          notes: row.notes || raw.notes || ''
        };
      });
  }

  function buildVisitorStats(rows, repairRows, simRows) {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDaysAgo = new Date(now.getTime() - (7 * oneDay));
    const fourteenDaysAgo = new Date(now.getTime() - (14 * oneDay));
    const thirtyDaysAgo = new Date(now.getTime() - (30 * oneDay));
    const sixtyDaysAgo = new Date(now.getTime() - (60 * oneDay));
    const todayKey = chicagoParts(now)?.dateKey;

    const normalized = rows
      .map((row) => ({ ...row, parsedAt: safeDate(row.created_at) }))
      .filter((row) => row.parsedAt);
    const pageViews = normalized.filter((row) => !String(row.path || '').startsWith('/event/'));
    const actionRows = normalized.filter((row) => String(row.path || '').startsWith('/event/'));

    const since = (input, date) => input.filter((row) => row.parsedAt >= date);
    const between = (input, start, end) => input.filter((row) => row.parsedAt >= start && row.parsedAt < end);
    const pageViewsToday = pageViews.filter((row) => chicagoParts(row.parsedAt)?.dateKey === todayKey);
    const pageViews7 = since(pageViews, sevenDaysAgo);
    const previous7 = between(pageViews, fourteenDaysAgo, sevenDaysAgo);
    const pageViews30 = since(pageViews, thirtyDaysAgo);
    const previous30 = between(pageViews, sixtyDaysAgo, thirtyDaysAgo);
    const actions30 = since(actionRows, thirtyDaysAgo);

    const topPageMap = new Map();
    for (const row of pageViews30) {
      const key = row.path || row.page || '/';
      topPageMap.set(key, (topPageMap.get(key) || 0) + 1);
    }
    const topPages = Array.from(topPageMap.entries())
      .map(([path, count]) => ({ path, count, share: pageViews30.length ? Math.round((count / pageViews30.length) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const dailyMap = new Map();
    for (let index = 29; index >= 0; index -= 1) dailyMap.set(dateKeyDaysAgo(index), 0);
    for (const row of pageViews30) {
      const key = chicagoParts(row.parsedAt)?.dateKey;
      if (key && dailyMap.has(key)) dailyMap.set(key, dailyMap.get(key) + 1);
    }
    const dailyVisits = Array.from(dailyMap.entries()).map(([date, count]) => ({ date, count }));

    const hourCounts = Array.from({ length: 12 }, (_, index) => ({
      label: `${String(index * 2).padStart(2, '0')}:00`,
      count: 0
    }));
    for (const row of pageViews30) {
      const hour = chicagoParts(row.parsedAt)?.hour;
      if (Number.isFinite(hour)) hourCounts[Math.min(11, Math.floor(hour / 2))].count += 1;
    }

    const weekdayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekdayCounts = weekdayOrder.map((label) => ({ label, count: 0 }));
    for (const row of pageViews30) {
      const weekday = chicagoParts(row.parsedAt)?.weekday;
      const target = weekdayCounts.find((item) => item.label === weekday);
      if (target) target.count += 1;
    }

    const actionCounts = new Map();
    for (const row of actions30) {
      const label = friendlyActionName(row.path, row.page);
      actionCounts.set(label, (actionCounts.get(label) || 0) + 1);
    }
    const actions = Array.from(actionCounts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const recent = pageViews
      .slice()
      .sort((a, b) => b.parsedAt.getTime() - a.parsedAt.getTime())
      .slice(0, 14)
      .map((row) => ({
        path: row.path || '/',
        createdAt: row.created_at,
        language: row.language || 'unknown',
        source: classifySource(row.referrer),
        device: classifyDevice(row.user_agent),
        browser: classifyBrowser(row.user_agent)
      }));

    const repairRows30 = repairRows.filter((row) => {
      const parsed = safeDate(row.submitted_at || row.created_at);
      return parsed && parsed >= thirtyDaysAgo && row.status !== 'ultra_sim_request_saved' && row.device !== 'Ultra Mobile SIM';
    });
    const simRows30 = simRows.filter((row) => {
      const parsed = safeDate(row.submitted_at || row.created_at);
      return parsed && parsed >= thirtyDaysAgo;
    });
    const bookPageViews = pageViews30.filter((row) => row.path === '/book-repair').length;
    const ultraRequestPageViews = pageViews30.filter((row) => row.path === '/ultra-sim').length;

    return {
      generatedAt: now.toISOString(),
      timeZone: CHICAGO_TIME_ZONE,
      today: pageViewsToday.length,
      last7Days: pageViews7.length,
      previous7Days: previous7.length,
      last30Days: pageViews30.length,
      previous30Days: previous30.length,
      trend7Days: percentageChange(pageViews7.length, previous7.length),
      trend30Days: percentageChange(pageViews30.length, previous30.length),
      estimatedSessionsToday: estimateSessions(pageViewsToday, new Date(0)),
      estimatedSessions7Days: estimateSessions(pageViews, sevenDaysAgo),
      estimatedSessions30Days: estimateSessions(pageViews, thirtyDaysAgo),
      topPages,
      dailyVisits,
      hourlyTraffic: hourCounts,
      weekdayTraffic: weekdayCounts,
      devices: mapCounts(pageViews30, (row) => classifyDevice(row.user_agent), 5),
      browsers: mapCounts(pageViews30, (row) => classifyBrowser(row.user_agent), 6),
      languages: mapCounts(pageViews30, (row) => String(row.language || 'unknown').toUpperCase(), 6),
      sources: mapCounts(pageViews30, (row) => classifySource(row.referrer), 8),
      actions,
      actionCount30Days: actions30.length,
      recent,
      conversion: {
        repairRequests30Days: repairRows30.length,
        repairDeskLeads30Days: repairRows30.filter((row) => row.repairdesk_lead_id || row.repairdesk_lead_order_id || row.repairdesk_ticket_id).length,
        bookPageViews30Days: bookPageViews,
        repairRequestRate: bookPageViews ? Math.round((repairRows30.length / bookPageViews) * 1000) / 10 : 0,
        simRequests30Days: simRows30.length,
        ultraRequestPageViews30Days: ultraRequestPageViews,
        simRequestRate: ultraRequestPageViews ? Math.round((simRows30.length / ultraRequestPageViews) * 1000) / 10 : 0
      },
      latestVisitAt: pageViews.length ? pageViews.reduce((latest, row) => row.parsedAt > latest ? row.parsedAt : latest, pageViews[0].parsedAt).toISOString() : null
    };
  }

  const [repairResult, simResult, visitorResult] = await Promise.all([
    loadTable(repairTable),
    loadTable(simTable),
    loadVisitRows()
  ]);

  if (!repairResult.ok) {
    return res.status(repairResult.status).json({ ok: false, message: 'Could not load repair requests.', details: repairResult.data });
  }

  const primarySimRequests = simResult.ok ? simResult.data : [];
  const fallbackSimRequests = mapFallbackSimRequests(repairResult.data);
  const simRequests = [...primarySimRequests, ...fallbackSimRequests]
    .sort((a, b) => new Date(b.submitted_at || 0).getTime() - new Date(a.submitted_at || 0).getTime());

  const requests = repairResult.data.filter((row) => row.status !== 'ultra_sim_request_saved' && row.device !== 'Ultra Mobile SIM');
  const visitorStats = visitorResult.ok
    ? buildVisitorStats(visitorResult.data, requests, simRequests)
    : {
        generatedAt: new Date().toISOString(),
        timeZone: CHICAGO_TIME_ZONE,
        today: 0,
        last7Days: 0,
        previous7Days: 0,
        last30Days: 0,
        previous30Days: 0,
        trend7Days: 0,
        trend30Days: 0,
        estimatedSessionsToday: 0,
        estimatedSessions7Days: 0,
        estimatedSessions30Days: 0,
        topPages: [],
        dailyVisits: [],
        hourlyTraffic: [],
        weekdayTraffic: [],
        devices: [],
        browsers: [],
        languages: [],
        sources: [],
        actions: [],
        actionCount30Days: 0,
        recent: [],
        conversion: {
          repairRequests30Days: 0,
          repairDeskLeads30Days: 0,
          bookPageViews30Days: 0,
          repairRequestRate: 0,
          simRequests30Days: 0,
          ultraRequestPageViews30Days: 0,
          simRequestRate: 0
        },
        latestVisitAt: null
      };

  return res.status(200).json({
    ok: true,
    generatedAt: new Date().toISOString(),
    requests,
    simRequests,
    visitorStats,
    dataHealth: {
      repairBackupConnected: true,
      simBackupConnected: simResult.ok,
      analyticsConnected: visitorResult.ok,
      latestRepairRequestAt: requests[0]?.submitted_at || requests[0]?.created_at || null,
      latestSimRequestAt: simRequests[0]?.submitted_at || simRequests[0]?.created_at || null,
      latestVisitAt: visitorStats.latestVisitAt || null
    },
    simWarning: simResult.ok ? null : {
      message: 'Ultra SIM request table is not connected. New SIM requests will still appear using the fallback storage path.',
      details: simResult.data
    },
    visitorWarning: visitorResult.ok ? null : visitorResult.data
  });
}
