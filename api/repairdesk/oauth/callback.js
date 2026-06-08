import { exchangeRepairDeskCodeForTokens, getRepairDeskRedirectUri, saveRepairDeskTokens } from '../../repairdesk-oauth-utils.js';

function htmlPage(title, message, ok = true) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{font-family:Inter,Arial,sans-serif;background:#07182b;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px}.card{max-width:720px;background:#fff;color:#0f172a;border-radius:28px;padding:34px;box-shadow:0 24px 80px rgba(0,0,0,.25)}h1{margin:0 0 12px;font-size:32px}p{font-size:18px;line-height:1.55;color:#475569}.ok{color:#0f8f64}.bad{color:#b42318}a{display:inline-flex;margin-top:14px;background:#0b7cff;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:800}</style></head>
<body><div class="card"><h1 class="${ok ? 'ok' : 'bad'}">${title}</h1><p>${message}</p><a href="/">Back to CellzTech</a></div></body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { code, error, error_description } = req.query || {};

  if (error) {
    return res.status(400).send(htmlPage('RepairDesk connection failed', `${error}: ${error_description || 'Authorization was not completed.'}`, false));
  }

  if (!code) {
    return res.status(400).send(htmlPage('RepairDesk connection failed', 'No authorization code was returned by RepairDesk.', false));
  }

  try {
    const redirectUri = getRepairDeskRedirectUri(req);
    const tokens = await exchangeRepairDeskCodeForTokens(String(code), redirectUri);
    await saveRepairDeskTokens(tokens);
    return res.status(200).send(htmlPage('RepairDesk connected', 'CellzTech can now use RepairDesk OAuth from the secure backend. You can close this tab and test the Book Repair form.'));
  } catch (err) {
    console.error(err);
    return res.status(500).send(htmlPage('RepairDesk connection failed', err instanceof Error ? err.message : 'Unknown OAuth error.', false));
  }
}
