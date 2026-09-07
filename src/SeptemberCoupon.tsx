import React from 'react';
import { ArrowRight, CheckCircle2, Gift, ShieldCheck, X } from 'lucide-react';
import couponCopy from '../shared/coupon-copy.json';
import './september-coupon.css';

type CouponLanguage = 'en' | 'pl' | 'es' | 'uk';
type CouponResult = { ok: boolean; code?: string; emailStatus?: string; error?: string };
const DISMISS_KEY = 'cellztech-sep26-coupon-dismissed';
const CLAIM_KEY = 'cellztech-sep26-coupon-claimed';
const CODE_KEY = 'cellztech-sep26-coupon-code';
const START = Date.parse('2026-09-01T00:00:00-05:00');
const END = Date.parse('2026-10-01T00:00:00-05:00');

function readLocal(key: string) {
  try { return window.localStorage.getItem(key) || ''; } catch { return ''; }
}
function writeLocal(key: string, value: string) {
  try { window.localStorage.setItem(key, value); } catch { /* Optional browser preferences only. */ }
}
function couponEvent(name: string, language: CouponLanguage) {
  // Deliberately excludes email, coupon code, tokens, and other customer data.
  void fetch('/api/track-visit', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
    body: JSON.stringify({ path: `/event/${name}`, page: name, language, referrer: window.location.origin + '/' })
  }).catch(() => undefined);
}

export function SeptemberCoupon({ lang, navigatePath }: { lang: CouponLanguage; navigatePath: (path: string) => void }) {
  const t = couponCopy[lang];
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const successRef = React.useRef<HTMLHeadingElement>(null);
  const openerRef = React.useRef<HTMLElement | null>(null);
  const requestRef = React.useRef('');
  const sendingRef = React.useRef(false);
  const controllerRef = React.useRef<AbortController | null>(null);
  const [ready, setReady] = React.useState(false);
  const [active, setActive] = React.useState(() => Date.now() >= START && Date.now() < END);
  const [nudge, setNudge] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [website, setWebsite] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [copyStatus, setCopyStatus] = React.useState('');
  const [result, setResult] = React.useState<CouponResult | null>(() => {
    // Coupon only; email and authorization tokens are never persisted in the browser.
    const code = readLocal(CODE_KEY);
    return /^BTS10-[A-F0-9]{12}$/.test(code) ? { ok: true, code, emailStatus: 'saved' } : null;
  });

  React.useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/promo?action=status', { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        if (!controller.signal.aborted) {
          setReady(data.ready === true);
          setActive(data.active === true);
        }
      }).catch(() => { /* Booking and browsing remain available if signup is offline. */ });
    const expiryTimer = window.setInterval(() => {
      if (Date.now() >= END) setActive(false);
    }, 60000);
    return () => { controller.abort(); controllerRef.current?.abort(); window.clearInterval(expiryTimer); };
  }, []);

  React.useEffect(() => {
    if (!ready || !active || result || readLocal(CLAIM_KEY)) return;
    const dismissedAt = Number(readLocal(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    // Only a small non-modal invitation appears automatically. No focus stealing or page blocking.
    const timer = window.setTimeout(() => {
      if (document.visibilityState === 'visible' && !dialogRef.current?.open) setNudge(true);
    }, 18000);
    return () => window.clearTimeout(timer);
  }, [ready, active, result]);

  React.useEffect(() => {
    if (!active) {
      dialogRef.current?.close();
      setOpen(false);
      setNudge(false);
    }
  }, [active]);

  React.useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, [open]);

  React.useEffect(() => {
    if (open && result) successRef.current?.focus();
  }, [result, open]);

  function dismissNudge() {
    setNudge(false);
    writeLocal(DISMISS_KEY, String(Date.now()));
  }
  function openCoupon(event: React.MouseEvent<HTMLButtonElement>) {
    openerRef.current = event.currentTarget;
    dismissNudge();
    setCopyStatus('');
    dialogRef.current?.showModal();
    setOpen(true);
    if (!result) emailRef.current?.focus();
    couponEvent('september_coupon_open', lang);
  }
  function closeCoupon() {
    dialogRef.current?.close();
  }
  function onClosed() {
    setOpen(false);
    dismissNudge();
    openerRef.current?.focus();
  }
  function keepDialogFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, textarea, summary, [tabindex]'
    )).filter((item) => item.tabIndex >= 0 && !item.hasAttribute('disabled') && item.getClientRects().length > 0 && !item.closest('[aria-hidden="true"]'));
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) { event.preventDefault(); return; }
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current || result?.ok) return;
    if (!consent || !emailRef.current?.checkValidity()) { setError(t.validation); return; }
    sendingRef.current = true;
    setSaving(true); setError('');
    if (!requestRef.current) requestRef.current = crypto.randomUUID();
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch('/api/promo?action=signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ email: email.trim(), language: lang, consent, website, requestId: requestRef.current, consentVersion: '2026-09-v1' })
      });
      const data: CouponResult = await response.json();
      if (!response.ok || !data.ok) {
        if (response.status === 429) setError(t.rateError);
        else if (response.status === 410) setError(t.closed);
        else if (response.status === 400) setError(t.validation);
        else setError(t.error);
        return;
      }
      setResult(data);
      setEmail('');
      writeLocal(CLAIM_KEY, '1');
      if (data.code && /^BTS10-[A-F0-9]{12}$/.test(data.code)) writeLocal(CODE_KEY, data.code);
      couponEvent('september_coupon_saved', lang);
    } catch {
      // No success state is shown without an acknowledged database save.
      setError(t.error);
    } finally {
      window.clearTimeout(timeout);
      sendingRef.current = false;
      setSaving(false);
    }
  }
  async function copyCode() {
    if (!result?.code) return;
    try { await navigator.clipboard.writeText(result.code); setCopyStatus(t.copied); }
    catch { setCopyStatus(t.copyFallback); }
  }

  if (!active) return null;
  return (
    <section className="septCouponSection" aria-labelledby="sept-coupon-heading">
      <div className="wrap">
        <div className="septCouponTicket">
          <div className="septCouponAmount" aria-label={t.percentLabel}><strong>10<span>%</span></strong><span>{t.off}</span></div>
          <div className="septCouponTicketCopy"><span>{t.eyebrow}</span><h2 id="sept-coupon-heading">{t.title}</h2><p>{t.intro}</p></div>
          <div className="septCouponTicketAction">
            {ready || result ? <button type="button" onClick={openCoupon}>{result?.code ? t.codeLabel : t.cta}<ArrowRight size={18} aria-hidden="true" /></button>
              : <><p>{t.unavailable}</p><a href="tel:7734137489">{t.call}<ArrowRight size={18} aria-hidden="true" /></a></>}
            <span><ShieldCheck size={14} aria-hidden="true" />{t.termsTitle}</span>
          </div>
        </div>
      </div>
      {nudge && !open && <aside className="septCouponNudge" aria-label={t.percentLabel}>
        <Gift size={24} aria-hidden="true" /><div><strong>{t.nudgeCta}</strong><span>{t.nudge}</span></div>
        <button type="button" className="septCouponNudgeAction" onClick={openCoupon}>{t.cta}</button>
        <button type="button" className="septCouponClose" onClick={dismissNudge} aria-label={t.close}><X size={20} /></button>
      </aside>}
      <dialog ref={dialogRef} className="septCouponDialog" aria-labelledby="sept-coupon-title" onClose={onClosed} onKeyDown={keepDialogFocus}
        onClick={(event) => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeCoupon(); } }}>
        <div className="septCouponDialogInner">
          <button className="septCouponClose" type="button" onClick={closeCoupon} aria-label={t.close}><X size={22} /></button>
          <span className="septCouponDialogBadge"><Gift size={16} aria-hidden="true" />{t.eyebrow}</span>
          {result?.ok ? <div className="septCouponSuccess">
            <CheckCircle2 size={34} aria-hidden="true" />
            <h2 id="sept-coupon-title" ref={successRef} tabIndex={-1}>{result.code ? t.successTitle : t.pendingTitle}</h2>
            <p>{result.code ? t.successText : t.duplicate}</p>
            {result.code && <><label htmlFor="sept-coupon-code">{t.codeLabel}</label><div className="septCouponCode"><input id="sept-coupon-code" readOnly value={result.code} onFocus={(event) => event.currentTarget.select()} /><button type="button" onClick={() => void copyCode()}>{t.copy}</button></div><p role="status">{copyStatus}</p></>}
            {result.code && result.emailStatus !== 'saved' && <p className="septCouponEmailNote">{result.emailStatus === 'accepted' ? t.emailSent : t.emailNotSent}</p>}
            <p className="septCouponTerms">{t.terms}</p>
            <button type="button" className="septCouponSubmit" onClick={() => { closeCoupon(); navigatePath('/book-repair'); }}>{t.book}<ArrowRight size={18} /></button>
            <button type="button" className="septCouponTextButton" onClick={closeCoupon}>{t.done}</button>
          </div> : <>
            <h2 id="sept-coupon-title">{t.modalTitle}</h2><p>{t.modalIntro}</p>
            <form onSubmit={(event) => void submit(event)}>
              <label className="septCouponEmailLabel" htmlFor="sept-coupon-email">{t.email}</label>
              <input ref={emailRef} id="sept-coupon-email" type="email" name="email" autoComplete="email" inputMode="email" maxLength={254} value={email} onChange={(event) => { setEmail(event.target.value); requestRef.current = ''; }} placeholder={t.placeholder} required disabled={saving} />
              <div className="septCouponHoney" aria-hidden="true"><label htmlFor="sept-website">Website</label><input id="sept-website" name="website" value={website} onChange={(event) => setWebsite(event.target.value)} autoComplete="off" tabIndex={-1} /></div>
              <label className="septCouponConsent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required disabled={saving} /><span>{t.consent}</span></label>
              <p className="septCouponConfirmNote">{t.confirmNote}</p>
              {error && <p className="septCouponError" role="alert">{error}</p>}
              <button type="submit" className="septCouponSubmit" disabled={saving || !consent}>{saving ? t.saving : t.submit}<ArrowRight size={18} aria-hidden="true" /></button>
              <button type="button" className="septCouponTextButton" onClick={closeCoupon}>{t.notNow}</button>
            </form>
            <details className="septCouponDetails"><summary>{t.termsTitle}</summary><p>{t.terms}</p></details>
            <details className="septCouponDetails"><summary>{t.privacyTitle}</summary><p>{t.privacy}</p></details>
          </>}
        </div>
      </dialog>
    </section>
  );
}
