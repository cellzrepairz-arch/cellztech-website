import { getSavedRepairDeskTokens } from '../../repairdesk-oauth-utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const saved = await getSavedRepairDeskTokens();
    if (!saved?.access_token) {
      return res.status(200).json({ ok: true, connected: false, message: 'RepairDesk OAuth is not connected yet.' });
    }

    return res.status(200).json({
      ok: true,
      connected: true,
      tokenType: saved.token_type || 'Bearer',
      expiresAt: saved.expires_at || null,
      updatedAt: saved.updated_at || null
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, connected: false, message: err instanceof Error ? err.message : 'Could not read RepairDesk OAuth status.' });
  }
}
