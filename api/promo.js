import {
  copy, VERSION, UUID, activeCampaign, language, configured, isAdmin, safeOrigin,
  rateKey, database, rpc, couponHealth, readToken, preferenceUrl, pageHtml, preferenceForm, sendCouponEmail
} from '../lib/promo-core.js';

// Limits only this new coupon function; existing routes/configuration are unchanged.
export const config = { maxDuration: 30 };

const PUBLIC_COLUMNS = 'id,email,language,status,campaign_id,coupon_code,coupon_redeemed_at,email_status,consent_at,confirmed_at,unsubscribed_at,created_at';
function json(res, status, body) { return res.status(status).json(body); }
function html(res, status, body) { res.setHeader('Content-Type', 'text/html; charset=utf-8'); return res.status(status).send(body); }
function parseBody(req) {
  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body) > 8192) throw new Error('bad_body');
    if (String(req.headers?.['content-type'] || '').includes('application/x-www-form-urlencoded')) return Object.fromEntries(new URLSearchParams(req.body));
    try { return JSON.parse(req.body); } catch { throw new Error('bad_body'); }
  }
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return {};
  if (Buffer.byteLength(JSON.stringify(req.body)) > 8192) throw new Error('bad_body');
  return req.body;
}
function validEmail(value) {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@<>,;\\"]+@[a-z0-9.-]+\.[a-z]{2,63}$/i.test(value);
}
function csvCell(value) {
  let text = String(value ?? '');
  if (/^[=+\-@\t\r\n]/.test(text.trimStart())) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
async function rateLimit(req, email) {
  const ip = String(req.headers?.['x-vercel-forwarded-for'] || req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim().slice(0, 80);
  const scopes = [[`ip-hour:${rateKey(ip)}`, 3600, 10], [`ip-day:${rateKey(ip)}`, 86400, 40], [`email:${rateKey(email)}`, 3600, 3]];
  const results = await Promise.all(scopes.map(([p_key, p_seconds, p_limit]) =>
    rpc('cellztech_promo_rate_limit', { p_key, p_seconds, p_limit })
  ));
  return results.every((result) => result === true);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
  const action = typeof req.query?.action === 'string' ? req.query.action : 'status';
  const method = req.method || 'GET';
  const allowed = { status: ['GET'], diagnostics: ['GET'], signup: ['POST'], confirm: ['GET', 'POST'], unsubscribe: ['GET', 'POST'], admin: ['GET'], export: ['GET'], redeem: ['POST'] };
  if (!Object.hasOwn(allowed, action)) return json(res, 404, { ok: false, error: 'not_found' });
  if (!allowed[action].includes(method)) { res.setHeader('Allow', allowed[action].join(', ')); return json(res, 405, { ok: false, error: 'method_not_allowed' }); }
  if (!safeOrigin(req)) return json(res, 403, { ok: false, error: 'origin_not_allowed' });
  if (['admin', 'export', 'redeem', 'diagnostics'].includes(action) && !isAdmin(req)) return json(res, 401, { ok: false, error: 'unauthorized' });
  let body = {};
  if (method === 'POST') {
    try { body = parseBody(req); } catch { return json(res, 400, { ok: false, error: 'invalid_body' }); }
  }
  let lang = language(body.language || req.query?.lang);
  try {
    if (action === 'status' || action === 'diagnostics') {
      const health = await couponHealth();
      if (!health.ready) console.warn('cellztech_coupon_not_ready', { reason: health.status });
      if (action === 'diagnostics') return json(res, 200, { ok: true, ...health, active: activeCampaign() });
      return json(res, 200, { ok: true, ready: health.ready, active: activeCampaign() });
    }
    if (action === 'signup') {
      if (!activeCampaign()) return json(res, 410, { ok: false, error: 'campaign_closed' });
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      if (!validEmail(email) || body.consent !== true || body.consentVersion !== VERSION || typeof body.requestId !== 'string' || !UUID.test(body.requestId)
        || (body.website !== undefined && body.website !== '') || typeof body.language !== 'string' || !Object.hasOwn(copy, body.language)) {
        return json(res, 400, { ok: false, error: 'invalid_signup' });
      }
      if (!configured()) return json(res, 503, { ok: false, error: 'temporarily_unavailable' });
      if (!await rateLimit(req, email)) { res.setHeader('Retry-After', '3600'); return json(res, 429, { ok: false, error: 'rate_limited' }); }
      const saved = await rpc('cellztech_promo_signup', {
        p_email: email, p_language: lang, p_request_id: body.requestId,
        p_consent_version: VERSION, p_consent_text: copy[lang].consent
      });
      const row = saved?.record;
      if (!row?.id || !/^BTS10-[A-F0-9]{12}$/.test(row.coupon_code || '')) throw new Error('invalid_save_response');
      let emailStatus = row.email_status;
      if (saved.shouldSend === true) {
        emailStatus = await sendCouponEmail(row);
        try {
          await database(`website_promo_subscribers?id=eq.${row.id}`, {
            method: 'PATCH', body: { email_status: emailStatus, updated_at: new Date().toISOString() }, prefer: 'return=minimal'
          });
        } catch { console.warn('coupon_email_status_update_failed'); }
      }
      // A mail outage does not invalidate the already-saved coupon. Existing third-party
      // submissions never reveal stored email details or the original coupon code.
      return json(res, 200, { ok: true, ...(saved.isNew || saved.isReplay ? { code: row.coupon_code } : {}), emailStatus });
    }
    if (action === 'confirm' || action === 'unsubscribe') {
      const token = method === 'POST' ? (body.token || req.query?.token) : req.query?.token;
      const payload = readToken(token, action);
      if (payload) lang = payload.lang;
      const t = copy[lang];
      if (!payload) return html(res, 400, pageHtml(lang, t.invalidTitle, t.invalidText));
      if (method === 'GET') {
        // GET never changes subscriptions: mail scanners/prefetchers cannot confirm or unsubscribe.
        return html(res, 200, pageHtml(payload.lang, action === 'confirm' ? t.verifiedTitle : t.unsubscribeTitle,
          action === 'confirm' ? t.verifiedIntro : t.unsubscribeIntro,
          preferenceForm(action, token, action === 'confirm' ? t.verifyButton : t.unsubscribeButton, payload.lang)));
      }
      const changed = await rpc('cellztech_promo_preference', { p_id: payload.id, p_action: action, p_nonce: action === 'confirm' ? payload.nonce : null });
      if (changed !== true) return html(res, 400, pageHtml(payload.lang, t.invalidTitle, t.invalidText));
      return html(res, 200, pageHtml(payload.lang, action === 'confirm' ? t.confirmedTitle : t.unsubscribedTitle, action === 'confirm' ? t.confirmedText : t.unsubscribedText));
    }
    if (action === 'admin') {
      const offset = Math.max(0, Math.min(100000, Number(req.query?.offset) || 0));
      const rows = await database(`website_promo_subscribers?select=${PUBLIC_COLUMNS}&order=created_at.desc,id.desc&limit=101&offset=${Math.floor(offset)}`);
      return json(res, 200, { ok: true, records: rows.slice(0, 100), hasMore: rows.length > 100, emailConfigured: Boolean(process.env.RESEND_API_KEY && process.env.CELLZTECH_FROM_EMAIL) });
    }
    if (action === 'export') {
      const all = [];
      for (let offset = 0; offset <= 10000; offset += 1000) {
        const rows = await database(`website_promo_subscribers?select=id,email,language,confirmed_at&status=eq.subscribed&order=created_at.asc,id.asc&limit=1000&offset=${offset}`);
        if (offset === 10000 && rows.length) return json(res, 413, { ok: false, error: 'export_too_large' });
        all.push(...rows);
        if (rows.length < 1000) break;
      }
      // Pending and opted-out emails are never included in the marketing export.
      const csv = [['email', 'language', 'confirmed_at', 'unsubscribe_url'].map(csvCell).join(','), ...all.map((row) => [row.email, row.language, row.confirmed_at, preferenceUrl(row, 'unsubscribe')].map(csvCell).join(','))].join('\r\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="cellztech-confirmed-subscribers.csv"');
      return res.status(200).send('\uFEFF' + csv);
    }
    if (action === 'redeem') {
      if (typeof body.id !== 'string' || !UUID.test(body.id)) return json(res, 400, { ok: false, error: 'invalid_id' });
      const redeemed = await rpc('cellztech_promo_redeem', { p_id: body.id });
      return json(res, redeemed === true ? 200 : 409, { ok: redeemed === true, ...(redeemed === true ? {} : { error: 'already_used_or_not_found' }) });
    }
  } catch (error) {
    console.warn('cellztech_coupon_operation_failed', { action, reason: /^promo_database_\d+$/.test(error?.message || '') ? error.message : 'unavailable' });
    if (action === 'confirm' || action === 'unsubscribe') {
      const t = copy[lang];
      return html(res, 503, pageHtml(lang, t.serviceErrorTitle, t.serviceErrorText));
    }
    return json(res, 503, { ok: false, error: ['admin', 'export', 'redeem', 'diagnostics'].includes(action) ? 'coupon_storage_unavailable_check_migration' : 'temporarily_unavailable' });
  }
  return json(res, 404, { ok: false, error: 'not_found' });
}
