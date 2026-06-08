import { getOAuthBaseUrl, getRepairDeskRedirectUri } from '../../repairdesk-oauth-utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const clientId = process.env.REPAIRDESK_CLIENT_ID;
  if (!clientId) {
    return res.status(500).send('Missing REPAIRDESK_CLIENT_ID in Vercel Environment Variables.');
  }

  const redirectUri = getRepairDeskRedirectUri(req);
  const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const url = new URL(`${getOAuthBaseUrl()}/authorize`);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', state);

  return res.redirect(302, url.toString());
}
