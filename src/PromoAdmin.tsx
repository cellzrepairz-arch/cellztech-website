import React from 'react';
import './promo-admin.css';

type PromoRecord = { id: string; email: string; language: string; status: string; coupon_code: string; coupon_redeemed_at: string | null; email_status: string; created_at: string; confirmed_at: string | null };
type PromoHealth = { ready: boolean; active: boolean; status: string; message: string; missing?: string[]; emailConfigured: boolean; checkedAt: string };
export function PromoAdmin({ adminKey }: { adminKey: string }) {
  const [open, setOpen] = React.useState(false);
  const [records, setRecords] = React.useState<PromoRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [hasMore, setHasMore] = React.useState(false);
  const [emailConfigured, setEmailConfigured] = React.useState(true);
  const [health, setHealth] = React.useState<PromoHealth | null>(null);
  const [search, setSearch] = React.useState('');
  const busy = React.useRef(false);
  const load = React.useCallback(async (offset = 0) => {
    if (busy.current) return;
    busy.current = true; setLoading(true); setError('');
    try {
      const statusResponse = await fetch('/api/promo?action=diagnostics', {
        headers: { 'x-cellztech-admin-key': adminKey }, cache: 'no-store', signal: AbortSignal.timeout(12000)
      });
      const diagnosis = await statusResponse.json().catch(() => null);
      if (!statusResponse.ok || !diagnosis?.ok) throw new Error(statusResponse.status === 401
        ? 'Admin session not authorized. Lock and unlock the console again.'
        : 'The coupon diagnostic could not load. Confirm the corrected api/promo.js, lib and shared files are included in the latest Vercel deployment.');
      setHealth(diagnosis);
      setEmailConfigured(diagnosis.emailConfigured);
      if (!diagnosis.ready) { setHasMore(false); return; }
      const response = await fetch(`/api/promo?action=admin&offset=${offset}`, { headers: { 'x-cellztech-admin-key': adminKey }, cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(response.status === 401 ? 'Admin session not authorized. Lock and unlock the console again.' : 'The coupon check passed, but the signups could not be read. Check the latest coupon function log for a permissions or schema error; do not change repair tables.');
      setRecords((current) => offset ? [...current, ...data.records] : data.records);
      setHasMore(data.hasMore); setEmailConfigured(data.emailConfigured);
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not load coupon signups.'); }
    finally { busy.current = false; setLoading(false); }
  }, [adminKey]);
  React.useEffect(() => {
    if (!open) return;
    void load();
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') void load(); }, 60000);
    return () => window.clearInterval(timer);
  }, [open, load]);
  async function download() {
    setError('');
    try {
      const response = await fetch('/api/promo?action=export', { headers: { 'x-cellztech-admin-key': adminKey }, cache: 'no-store' });
      if (!response.ok) throw new Error('The confirmed-email export could not be downloaded. Please try again.');
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a'); link.href = url; link.download = 'cellztech-confirmed-subscribers.csv'; link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) { setError(err instanceof Error ? err.message : 'Export failed.'); }
  }
  async function redeem(row: PromoRecord) {
    if (!window.confirm(`Mark coupon ${row.coupon_code} as used? Apply the 10% discount in RepairDesk separately. This does not modify an invoice.`)) return;
    if (busy.current) return;
    busy.current = true; setLoading(true); setError('');
    try {
      const response = await fetch('/api/promo?action=redeem', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-cellztech-admin-key': adminKey }, body: JSON.stringify({ id: row.id }) });
      if (!response.ok) throw new Error(response.status === 409 ? 'This coupon has already been used. Refresh the list.' : 'Could not update this coupon.');
      setRecords((rows) => rows.map((item) => item.id === row.id ? { ...item, coupon_redeemed_at: new Date().toISOString() } : item));
    } catch (err) { setError(err instanceof Error ? err.message : 'Coupon update failed.'); }
    finally { busy.current = false; setLoading(false); }
  }
  const filtered = records.filter((row) => `${row.email} ${row.coupon_code}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <details className="promoAdmin" onToggle={(event) => setOpen(event.currentTarget.open)}>
    <summary><span>September repair coupons</span><small>Email signups, consent and coupon use</small></summary>
    {open && <div className="promoAdminContent">
      <p>This is separate from RepairDesk and your repair backups. Only confirmed subscribers appear in the marketing export. No bulk emails are sent by this panel.</p>
      {health && <div className={health.ready ? 'promoAdminHealth' : 'promoAdminHealth promoAdminHealthIssue'} role="status">
        <strong>{health.ready ? 'Coupon database: ready' : 'Coupon setup needs attention'}</strong>
        <p>{health.message}</p>
        {health.missing?.length ? <p>Missing settings: <code>{health.missing.join(', ')}</code></p> : null}
        <small>Check: {health.status} / {new Date(health.checkedAt).toLocaleString('en-US', { timeZone: 'America/Chicago' })} Chicago time</small>
        {!health.active && <p>September signups are closed. Existing coupons and unsubscribe links are unaffected.</p>}
      </div>}
      <div className="promoAdminActions"><button type="button" onClick={() => void load()} disabled={loading}>{loading ? 'Loading...' : 'Refresh signups'}</button><button type="button" onClick={() => void download()} disabled={loading || !health?.ready}>Export confirmed emails</button><input aria-label="Search coupon signups" placeholder="Search email or coupon code" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      {health?.ready && !emailConfigured && <p className="promoAdminWarning">Coupon storage is available, but RESEND_API_KEY or CELLZTECH_FROM_EMAIL is missing. Customers can save an on-screen coupon; email confirmation needs a verified sender.</p>}
      <p className="promoAdminNote">Email status &quot;accepted&quot; means the provider accepted the message, not that it reached the inbox. Pending is not subscribed. Export a fresh list before every campaign and include its unsubscribe link and the store address in every promotional email.</p>
      {error && <p className="promoAdminWarning" role="alert">{error}</p>}
      <div className="promoAdminTableWrap"><table><thead><tr><th>Email / language</th><th>Consent</th><th>Coupon</th><th>Email</th><th>Use</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.id}>
        <td><strong>{row.email}</strong><small>{row.language.toUpperCase()} / {new Date(row.created_at).toLocaleDateString('en-US', { timeZone: 'America/Chicago' })}</small></td><td>{row.status}</td><td><code>{row.coupon_code}</code></td><td>{row.email_status.replace(/_/g, ' ')}</td><td>{row.coupon_redeemed_at ? 'Used' : <button type="button" disabled={loading} onClick={() => void redeem(row)}>Mark used</button>}</td>
      </tr>)}</tbody></table></div>
      {health?.ready && !filtered.length && !loading && !error && <p>No matching coupon signups yet.</p>}
      {hasMore && <button type="button" onClick={() => void load(records.length)} disabled={loading}>Load more signups</button>}
    </div>}
  </details>;
}
