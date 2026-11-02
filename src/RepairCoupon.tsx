import React from 'react';
import { ArrowRight, CheckCircle2, Gift, ShieldCheck, X } from 'lucide-react';
import campaign from '../shared/campaign.json';
import couponCopy from '../shared/coupon-copy.json';
import { RepairCouponForm } from './RepairCouponForm';
import { useRepairOffer } from './useRepairOffer';
import { DISMISS_KEY, CLAIM_KEY, CODE_KEY, readPreference as readLocal, writePreference as writeLocal, validCouponCode } from '../shared/coupon-presentation';

type CouponLanguage = 'en' | 'pl' | 'es' | 'uk';
type CouponResult = { ok: boolean; code?: string; emailStatus?: string; error?: string };
const START = Date.parse(campaign.repairCoupon.signupStart);
const END = Date.parse(campaign.repairCoupon.signupEnd);

function couponEvent(name: string, language: CouponLanguage) {
  // Deliberately excludes email, coupon code, tokens, and other customer data.
  void fetch('/api/track-visit', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
    body: JSON.stringify({ path: `/event/${name}`, page: name, language, referrer: window.location.origin + '/' })
  }).catch(() => undefined);
}

export function RepairCoupon({ lang, navigatePath, compact = false, initialEmail = '' }: { lang: CouponLanguage; navigatePath: (path: string) => void; compact?: boolean; initialEmail?: string }) {
  const t = couponCopy[lang];
  const id = React.useId();
  const ticketRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const successRef = React.useRef<HTMLHeadingElement>(null);
  const openerRef = React.useRef<HTMLElement | null>(null);
  const requestRef = React.useRef('');
  const sendingRef = React.useRef(false);
  const controllerRef = React.useRef<AbortController | null>(null);
  const statusControllerRef = React.useRef<AbortController | null>(null);
  const [ready, setReady] = React.useState<boolean | null>(null);
  const [checking, setChecking] = React.useState(true);
  const [active, setActive] = React.useState(() => Date.now() >= START && Date.now() < END);
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState(initialEmail);
  const [consent, setConsent] = React.useState(false);
  const [website, setWebsite] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [copyStatus, setCopyStatus] = React.useState('');
  const [result, setResult] = React.useState<CouponResult | null>(() => {
    // Coupon only; email and authorization tokens are never persisted in the browser.
    const code = readLocal(CODE_KEY) || readLocal('cellztech-sep26-coupon-code');
    return validCouponCode(code) ? { ok: true, code, emailStatus: 'saved' } : null;
  });

  const nudge = useRepairOffer(!compact && ready === true && active && !result && !open);

  const checkAvailability = React.useCallback(async () => {
    if (statusControllerRef.current) return;
    const controller = new AbortController();
    statusControllerRef.current = controller;
    setChecking(true);
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch('/api/promo?action=status', { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error('coupon_status_unavailable');
      const data = await response.json();
      if (data.ok !== true || typeof data.ready !== 'boolean' || typeof data.active !== 'boolean') throw new Error('invalid_coupon_status');
      if (statusControllerRef.current === controller) {
        setReady(data.ready);
        setActive(data.active);
      }
    } catch {
      // A timed-out check can be retried. Never substitute a fake coupon/save.
      if (statusControllerRef.current === controller) setReady(false);
    } finally {
      window.clearTimeout(timeout);
      if (statusControllerRef.current === controller) {
        statusControllerRef.current = null;
        setChecking(false);
      }
    }
  }, []);

  React.useEffect(() => {
    void checkAvailability();
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void checkAvailability();
    };
    const timer = window.setInterval(() => {
      if (Date.now() >= END) setActive(false);
      else refreshWhenVisible();
    }, 60000);
    window.addEventListener('focus', refreshWhenVisible);
    window.addEventListener('online', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      const pending = statusControllerRef.current;
      statusControllerRef.current = null;
      pending?.abort();
      controllerRef.current?.abort();
      window.clearInterval(timer);
      window.removeEventListener('focus', refreshWhenVisible);
      window.removeEventListener('online', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [checkAvailability]);

  React.useEffect(() => {
    if (!active && !result) {
      dialogRef.current?.close();
      setOpen(false);
    }
  }, [active, result]);

  React.useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, [open]);

  React.useEffect(() => {
    const syncClaim = () => {
      const code = readLocal(CODE_KEY) || readLocal('cellztech-sep26-coupon-code');
      if (validCouponCode(code)) setResult(current => current?.code === code ? current : { ok:true, code, emailStatus:'saved' });
    };
    window.addEventListener('storage', syncClaim);
    window.addEventListener('cellztech:coupon-saved', syncClaim);
    return () => { window.removeEventListener('storage', syncClaim); window.removeEventListener('cellztech:coupon-saved', syncClaim); };
  }, []);

  React.useEffect(() => {
    if (open && result) successRef.current?.focus();
  }, [result, open]);

  function dismissNudge() {
    writeLocal(DISMISS_KEY, String(Date.now()));
  }
  function openCoupon(event: React.MouseEvent<HTMLButtonElement>) {
    openerRef.current = event.currentTarget;
    dismissNudge();
    setCopyStatus('');
    dialogRef.current?.showModal();
    setOpen(true);
    if (!result) { if (!email && initialEmail) setEmail(initialEmail); emailRef.current?.focus(); }
    couponEvent('repair_coupon_open', lang);
  }
  function closeCoupon() {
    dialogRef.current?.close();
  }
  function onClosed() {
    setOpen(false);
    dismissNudge();
    const target = openerRef.current?.isConnected ? openerRef.current : ticketRef.current;
    target?.focus({ preventScroll: true });
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
    if (!event.currentTarget.checkValidity() || !email.trim()) { setError(t.validation); return; }
    const fromCard = event.currentTarget.dataset.couponSurface === 'card';
    if (fromCard) openerRef.current = event.currentTarget.querySelector('button[type=submit]');
    sendingRef.current = true;
    setSaving(true); setError('');
    if (!requestRef.current) requestRef.current = crypto.randomUUID();
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch('/api/promo?action=signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ email: email.trim(), language: lang, consent: true, marketingOptIn: consent, website, requestId: requestRef.current, consentVersion: campaign.repairCoupon.consentVersion })
      });
      const data: CouponResult = await response.json();
      if (!response.ok || !data.ok) {
        if (response.status === 429) setError(t.rateError);
        else if (response.status === 410) setError(t.closed);
        else if (response.status === 400) setError(t.validation);
        else setError(t.error);
        return;
      }
      if (fromCard) { dialogRef.current?.showModal(); setOpen(true); }
      setResult(data);
      setEmail('');
      writeLocal(CLAIM_KEY, '1');
      if (data.code && validCouponCode(data.code)) writeLocal(CODE_KEY, data.code);
      window.dispatchEvent(new CustomEvent('cellztech:coupon-saved', { detail: data.code || '' }));
      couponEvent('repair_coupon_saved', lang);
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

  if (!active && !result) return null;
  return (
    <section id="repair-offer" className={`septCouponSection${compact ? ' couponCompact' : ''}`} aria-labelledby={`${id}-heading`}>
      <div className="wrap">
        <div className="septCouponTicket">
          <div className="septCouponAmount" aria-label={t.percentLabel}><strong>10<span>%</span></strong><span>{t.off}</span></div>
          <div className="septCouponTicketCopy"><span>{t.eyebrow}</span><h2 id={`${id}-heading`}>{t.title}</h2><p>{t.intro}</p></div>
          <div className="septCouponTicketAction">
            {ready || result ? <button ref={ticketRef} type="button" onClick={openCoupon}>{result?.code ? t.codeLabel : t.cta}<ArrowRight size={18} aria-hidden="true" /></button>
              : checking ? <button type="button" disabled aria-busy="true">{t.checking}</button>
              : <><p role="status">{t.unavailable}</p><button type="button" onClick={() => void checkAvailability()}>{t.retry}</button><a className="septCouponCallFallback" href="tel:7734137489">{t.call}<ArrowRight size={18} aria-hidden="true" /></a></>}
            <span><ShieldCheck size={14} aria-hidden="true" />{t.termsTitle}</span>
          </div>
        </div>
      </div>
      {nudge && !open && <aside className="repairOfferCard" aria-label={t.percentLabel} onKeyDown={(event)=>{if(event.key==='Escape' && !saving) dismissNudge();}}>
        <div className="repairOfferDesktop">
          <div className="repairOfferTop"><span className="repairOfferIcon"><Gift size={21} aria-hidden="true" /></span><span>{t.nudgeTag}</span></div>
          <h2>{t.nudgeTitle}</h2><p className="repairOfferValue"><strong>10<span>%</span></strong><span>{t.off}</span></p>
          <p className="repairOfferIntro">{t.nudgeText}</p>
          <RepairCouponForm t={t} id={`${id}-card`} surface="card" email={email} consent={consent} website={website} saving={saving} error={error}
            onEmail={(value)=>{setEmail(value);setError('');requestRef.current='';}} onConsent={(value)=>{setConsent(value);requestRef.current='';}} onWebsite={setWebsite} onSubmit={event=>void submit(event)} />
          <button type="button" className="repairOfferTerms" onClick={openCoupon}>{t.termsTitle}<ArrowRight size={13} aria-hidden="true" /></button>
        </div>
        <button type="button" className="repairOfferMobile" onClick={openCoupon}><span className="repairOfferIcon"><Gift size={22} aria-hidden="true" /></span><span><strong>{t.nudgeMobile}</strong><span>{t.nudgeMobileDetail}</span></span><ArrowRight size={18} aria-hidden="true" /></button>
        <button type="button" className="septCouponClose" onClick={dismissNudge} aria-label={t.close} disabled={saving}><X size={19} aria-hidden="true" /></button>
      </aside>}
      <dialog ref={dialogRef} className="septCouponDialog" aria-labelledby={`${id}-title`} onClose={onClosed} onKeyDown={keepDialogFocus}
        onClick={(event) => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeCoupon(); } }}>
        <div className="septCouponDialogInner">
          <button className="septCouponClose" type="button" onClick={closeCoupon} aria-label={t.close}><X size={22} /></button>
          <span className="septCouponDialogBadge"><Gift size={16} aria-hidden="true" />{t.eyebrow}</span>
          {result?.ok ? <div className="septCouponSuccess">
            <CheckCircle2 size={34} aria-hidden="true" />
            <h2 id={`${id}-title`} ref={successRef} tabIndex={-1}>{result.code ? t.successTitle : t.pendingTitle}</h2>
            <p>{result.code ? t.successText : t.duplicate}</p>
            {result.code && <><label htmlFor={`${id}-code`}>{t.codeLabel}</label><div className="septCouponCode"><input id={`${id}-code`} readOnly value={result.code} onFocus={(event) => event.currentTarget.select()} /><button type="button" onClick={() => void copyCode()}>{t.copy}</button></div><p role="status">{copyStatus}</p></>}
            {result.code && result.emailStatus !== 'saved' && <p className="septCouponEmailNote">{result.emailStatus === 'accepted' ? t.emailSent : t.emailNotSent}</p>}
            <p className="septCouponTerms">{t.terms}</p>
            <button type="button" className="septCouponSubmit" onClick={() => { closeCoupon(); navigatePath('/book-repair?source=repair-coupon'); }}>{t.book}<ArrowRight size={18} /></button>
            <button type="button" className="septCouponTextButton" onClick={closeCoupon}>{t.done}</button>
          </div> : <>
            <h2 id={`${id}-title`}>{t.modalTitle}</h2><p>{t.modalIntro}</p><p className="septCouponScope">{t.scope}</p>
            <RepairCouponForm t={t} id={`${id}-dialog`} surface="dialog" emailRef={emailRef} email={email} consent={consent} website={website} saving={saving} error={error}
              onEmail={(value)=>{setEmail(value);setError('');requestRef.current='';}} onConsent={(value)=>{setConsent(value);requestRef.current='';}} onWebsite={setWebsite} onSubmit={event=>void submit(event)} />
            <button type="button" className="septCouponTextButton" onClick={closeCoupon}>{t.notNow}</button>
            <details className="septCouponDetails"><summary>{t.termsTitle}</summary><p>{t.terms}</p></details>
            <details className="septCouponDetails"><summary>{t.privacyTitle}</summary><p>{t.privacy}</p></details>
          </>}
        </div>
      </dialog>
    </section>
  );
}
