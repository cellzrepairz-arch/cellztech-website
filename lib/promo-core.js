import { createHmac, timingSafeEqual, createHash } from 'node:crypto';
import copy from '../shared/coupon-copy.json' with { type: 'json' };

export { copy };
export const ORIGIN = 'https://cellztech.com';
export const VERSION = '2026-09-v1';
// Email links on a staff-only preview should exercise that preview endpoint,
// never an untrusted request Host header. Live customer links stay on CellzTech.
export function publicOrigin() {
  const host = process.env.VERCEL_URL;
  return process.env.VERCEL_ENV === 'preview' && typeof host === 'string' && /^[a-z0-9][a-z0-9.-]*\.vercel\.app$/i.test(host)
    ? `https://${host}` : ORIGIN;
}
export const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
export const SIGNUP_START = Date.parse('2026-09-01T00:00:00-05:00');
export const SIGNUP_END = Date.parse('2026-10-01T00:00:00-05:00');
export function activeCampaign(now = Date.now()) { return now >= SIGNUP_START && now < SIGNUP_END; }
export function language(value) { return typeof value === 'string' && Object.hasOwn(copy, value) ? value : 'en'; }
export function signingKey() {
  const key = process.env.CELLZTECH_PROMO_SIGNING_KEY || process.env.CELLZTECH_ADMIN_KEY;
  if (!key) throw new Error('promo_not_configured');
  return key;
}
export function configured() { return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && (process.env.CELLZTECH_PROMO_SIGNING_KEY || process.env.CELLZTECH_ADMIN_KEY)); }
export function secureEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || !a || !b) return false;
  return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
}
export function isAdmin(req) { return secureEqual(req.headers?.['x-cellztech-admin-key'], process.env.CELLZTECH_ADMIN_KEY); }
export function safeOrigin(req) {
  const origin = req.headers?.origin;
  if (!origin) return true; // Non-browser clients are still authenticated / rate limited.
  const allow = [ORIGIN, 'https://www.cellztech.com'];
  for (const key of ['VERCEL_URL', 'VERCEL_BRANCH_URL', 'VERCEL_PROJECT_PRODUCTION_URL']) {
    if (process.env[key]) allow.push(`https://${process.env[key]}`);
  }
  if (process.env.NODE_ENV === 'test') allow.push('http://localhost:5173');
  return allow.includes(origin);
}
export function rateKey(value) { return createHmac('sha256', signingKey()).update(`coupon-rate:${value}`).digest('hex'); }
export async function database(path, { method = 'GET', body, prefer } = {}) {
  const base = process.env.SUPABASE_URL?.replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error('promo_not_configured');
  const response = await fetch(`${base}/rest/v1/${path}`, {
    method, cache: 'no-store', signal: AbortSignal.timeout(4500),
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(prefer ? { Prefer: prefer } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
  const text = await response.text();
  if (!response.ok) {
    // Provider response bodies can contain emails; never log or return those bodies.
    const error = new Error(`promo_database_${response.status}`);
    error.status = response.status;
    throw error;
  }
  return text ? JSON.parse(text) : null;
}
export const rpc = (name, body = {}) => database(`rpc/${name}`, { method: 'POST', body });
export function makeToken(row, kind) {
  const payload = { id: row.id, kind, lang: language(row.language) };
  if (kind === 'confirm') {
    payload.nonce = row.consent_nonce;
    payload.exp = Date.parse(row.last_email_attempt_at || row.created_at) + 7 * 86400000;
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', signingKey()).update(`cellztech-promo-v1.${encoded}`).digest('base64url');
  return `${encoded}.${signature}`;
}
export function readToken(token, kind, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 1500) return null;
  const [encoded, signature, extra] = token.split('.');
  if (!encoded || !signature || extra) return null;
  const expected = createHmac('sha256', signingKey()).update(`cellztech-promo-v1.${encoded}`).digest('base64url');
  if (!secureEqual(signature, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!UUID.test(payload.id || '') || payload.kind !== kind || !Object.hasOwn(copy, payload.lang)) return null;
    if (kind === 'confirm' && (!UUID.test(payload.nonce || '') || !Number.isFinite(payload.exp) || payload.exp <= now)) return null;
    return payload;
  } catch { return null; }
}
export function preferenceUrl(row, action) { return `${publicOrigin()}/api/promo?action=${action}&token=${encodeURIComponent(makeToken(row, action))}&lang=${language(row.language)}`; }
export function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
export function pageHtml(lang, title, body, form = '') {
  const t = copy[language(lang)];
  return `<!doctype html><html lang="${language(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escapeHtml(title)} | CellzTech</title><style>body{margin:0;padding:32px 18px;background:#eef4fc;color:#142d4b;font:16px/1.6 system-ui,sans-serif}main{max-width:540px;margin:7vh auto;background:#fff;border:1px solid #d3e2f5;border-radius:22px;padding:30px}h1{font-size:27px;line-height:1.25}a{color:#155fcf}button{border:0;background:#1565dc;color:white;font:inherit;font-weight:700;border-radius:10px;padding:14px 22px;cursor:pointer;max-width:100%}.brand{font-weight:800;font-size:22px}small{display:block;margin-top:28px;color:#596d88}button:focus-visible,a:focus-visible{outline:3px solid #376def;outline-offset:4px}</style></head><body><main><div class="brand">CellzTech</div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(body)}</p>${form}<p><a href="${publicOrigin()}/">${escapeHtml(t.back)}</a></p><small>Cellz Repairz &middot; 3412 N Harlem Ave, STE A, Chicago, IL 60634<br>773-413-7489</small></main></body></html>`;
}
export function preferenceForm(action, token, label, lang = 'en') {
  return `<form method="post" action="/api/promo?action=${action}&amp;lang=${language(lang)}"><input type="hidden" name="token" value="${escapeHtml(token)}"><button type="submit">${escapeHtml(label)}</button></form>`;
}
export async function sendCouponEmail(row) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CELLZTECH_FROM_EMAIL;
  if (!apiKey || !from) return 'not_configured';
  const t = copy[language(row.language)];
  const confirm = preferenceUrl(row, 'confirm');
  const unsubscribe = preferenceUrl(row, 'unsubscribe');
  const html = `<!doctype html><html lang="${language(row.language)}"><body style="margin:0;background:#f1f5fb;color:#172b45;font-family:Arial,sans-serif;padding:28px"><div style="max-width:550px;margin:auto;background:#fff;padding:30px;border-radius:18px"><strong style="font-size:24px">CellzTech</strong><h1 style="font-size:28px">${escapeHtml(t.emailHeading)}</h1><p style="line-height:1.7">${escapeHtml(t.emailBody)}</p><p style="font-size:25px;font-family:monospace;padding:18px;background:#edf5ff;border:1px dashed #a5c5ef">${escapeHtml(row.coupon_code)}</p><p><a href="${escapeHtml(confirm)}" style="display:inline-block;padding:14px 20px;background:#1665dc;color:#fff;border-radius:8px;text-decoration:none">${escapeHtml(t.verifyButton)}</a></p><p style="font-size:12px;line-height:1.7">${escapeHtml(t.terms)}</p><hr style="border:0;border-top:1px solid #d9e3f0"><p style="font-size:12px;line-height:1.7">${escapeHtml(t.emailDisclosure)}<br>Cellz Repairz &middot; 3412 N Harlem Ave, STE A, Chicago, IL 60634<br>773-413-7489 &middot; cellztech.com<br><a href="${escapeHtml(unsubscribe)}">${escapeHtml(t.unsubscribe)}</a></p></div></body></html>`;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(6500),
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `sep26-${row.id}-${Date.parse(row.last_email_attempt_at)}` },
      body: JSON.stringify({ from, to: [row.email], subject: t.emailSubject, html,
        text: `${t.emailBody}\n\n${row.coupon_code}\n\n${t.verifyButton}: ${confirm}\n\n${t.terms}\n\n${t.emailDisclosure}\nCellz Repairz, 3412 N Harlem Ave, STE A, Chicago, IL 60634\n773-413-7489\n${t.unsubscribe}: ${unsubscribe}`,
        headers: { 'List-Unsubscribe': `<${unsubscribe}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } })
    });
    const data = await response.json().catch(() => ({}));
    return response.ok && data.id ? 'accepted' : 'failed';
  } catch { return 'failed'; }
}
