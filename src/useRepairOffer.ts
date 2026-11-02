import { useEffect, useState } from 'react';
import { CLAIM_KEY, DISMISS_KEY, OFFER_DELAY_MS, eligibleOfferPath, readPreference, recentlyDismissed } from '../shared/coupon-presentation';

/** A passive offer, never a modal or a focus change. Counts visible, uninterrupted browsing. */
export function useRepairOffer(enabled: boolean) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!enabled || !eligibleOfferPath(window.location.pathname)) { setVisible(false); return; }
    let elapsed = 0;
    let lastTick = Date.now();
    const update = () => {
      const now = Date.now();
      const delta = Math.min(Math.max(0, now - lastTick), 1500);
      lastTick = now;
      const focus = document.activeElement;
      const typingElsewhere = focus?.matches('input,textarea,select,[contenteditable="true"]') && !focus.closest('.repairOfferCard');
      const blocked = document.visibilityState !== 'visible' || typingElsewhere || document.querySelector('dialog[open],[aria-modal="true"],.mobileMenu.open');
      const suppressed = readPreference(CLAIM_KEY) || recentlyDismissed(readPreference(DISMISS_KEY), now);
      if (suppressed || blocked || !eligibleOfferPath(window.location.pathname)) { setVisible(false); return; }
      elapsed += delta;
      if (elapsed >= OFFER_DELAY_MS) setVisible(true);
    };
    const onVisibility = () => { lastTick = Date.now(); update(); };
    const timer = window.setInterval(update, 1000);
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('focusin', update);
    window.addEventListener('storage', update);
    window.addEventListener('cellztech:coupon-preference', update);
    update();
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('focusin', update);
      window.removeEventListener('storage', update);
      window.removeEventListener('cellztech:coupon-preference', update);
    };
  }, [enabled]);
  return visible;
}
