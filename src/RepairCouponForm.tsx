import React from 'react';
import { ArrowRight } from 'lucide-react';
import couponCopy from '../shared/coupon-copy.json';

type Props = {
  t: typeof couponCopy.en; id: string; email: string; consent: boolean; website: string;
  saving: boolean; error: string; surface: 'card' | 'dialog';
  emailRef?: React.RefObject<HTMLInputElement>;
  onEmail: (email: string) => void; onConsent: (consent: boolean) => void;
  onWebsite: (website: string) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};
export function RepairCouponForm({t,id,email,consent,website,saving,error,surface,emailRef,onEmail,onConsent,onWebsite,onSubmit}: Props) {
  return <form className="repairCouponForm" data-coupon-surface={surface} onSubmit={onSubmit}>
    <label className="septCouponEmailLabel" htmlFor={`${id}-email`}>{t.email}</label>
    <input ref={emailRef} id={`${id}-email`} type="email" name="email" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} maxLength={254}
      value={email} onChange={event=>onEmail(event.target.value)} placeholder={t.placeholder} required disabled={saving}
      aria-describedby={error ? `${id}-error` : `${id}-note`} aria-invalid={error ? true : undefined} />
    <div className="septCouponHoney" aria-hidden="true"><label htmlFor={`${id}-website`}>Website</label><input id={`${id}-website`} name="website" value={website} onChange={event=>onWebsite(event.target.value)} autoComplete="off" tabIndex={-1} /></div>
    <label className="septCouponConsent"><input type="checkbox" name="marketingOptIn" checked={consent} onChange={event=>onConsent(event.target.checked)} disabled={saving} /><span>{t.consent}</span></label>
    {error && <p id={`${id}-error`} className="septCouponError" role="alert">{error}</p>}
    <button type="submit" className="septCouponSubmit" disabled={saving} aria-busy={saving}>{saving ? t.saving : t.submit}<ArrowRight size={17} aria-hidden="true" /></button>
    <p id={`${id}-note`} className="repairCouponRequestNote">{t.requestNote}</p>
    {surface === 'dialog' && <p className="septCouponConfirmNote">{t.confirmNote}</p>}
  </form>;
}
