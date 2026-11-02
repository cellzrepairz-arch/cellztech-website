// No customer email or tracking identifier is stored here: only UI preferences.
export const DISMISS_KEY = 'cellztech-nov26-coupon-dismissed';
export const CLAIM_KEY = 'cellztech-nov26-coupon-claimed';
export const CODE_KEY = 'cellztech-nov26-coupon-code';
export const OFFER_DELAY_MS = 18000;
export const DISMISS_FOR_MS = 7 * 24 * 60 * 60 * 1000;
const memory = new Map();
export function readPreference(key) {
  try { return window.localStorage.getItem(key) || memory.get(key) || ''; }
  catch { return memory.get(key) || ''; }
}
export function writePreference(key, value) {
  memory.set(key, value);
  try { window.localStorage.setItem(key, value); } catch { /* Remains dismissed for this page session. */ }
  window.dispatchEvent(new Event('cellztech:coupon-preference'));
}
export function eligibleOfferPath(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === '/' || path === '/repairs';
}
export function recentlyDismissed(value, now = Date.now()) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && timestamp > 0 && timestamp <= now && now - timestamp < DISMISS_FOR_MS;
}
export function validCouponCode(value) {
  return typeof value === 'string' && /^(?:BTS10|NOV10)-[A-F0-9]{12}$/.test(value);
}
