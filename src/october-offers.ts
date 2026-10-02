import { octoberCopy, type OctoberLanguage } from './october-copy';

// Customer prices only, transcribed from the uploaded October 2026 explainers.
// Keep retailer compensation and internal PDFs out of the public bundle.
export const HOLIDAY_END = '2027-01-01T00:00:00-06:00';
export const RENEWAL_END = '2027-02-01T00:00:00-06:00';
export const holidayPlans = [
  { id: '8gb', name: '8GB', total: 102, monthly: 8.5, standard: 204, renewal: 136 },
  { id: '12gb', name: '12GB', total: 120, monthly: 10, standard: 240, renewal: 160 },
  { id: '24gb', name: '24GB', total: 162, monthly: 13.5, standard: 324, renewal: 216 },
  { id: 'unlimited', name: 'Unlimited', total: 204, monthly: 17, standard: 408, renewal: 272 },
  { id: 'unlimited-plus', name: 'Unlimited+', total: 246, monthly: 20.5, standard: 492, renewal: 328 }
];
export const monthly25Plans = [
  { duration: 1, total: 29, monthly: 29 },
  { duration: 3, total: 78, monthly: 26 },
  { duration: 6, total: 138, monthly: 23 },
  { duration: 12, total: 240, monthly: 20 }
];
export const familyTotals = [49, 73, 85, 100];
export const money = (n: number) => `$${n.toFixed(Number.isInteger(n) ? 0 : 2)}`;
export function periodLabel(n: number, lang: OctoberLanguage) {
  if (lang === 'pl') return `${n} ${n === 1 ? 'miesiąc' : n === 3 ? 'miesiące' : 'miesięcy'}`;
  if (lang === 'uk') return `${n} ${n === 1 ? 'місяць' : n === 3 ? 'місяці' : 'місяців'}`;
  const t = octoberCopy[lang].ui;
  return `${n} ${n === 1 ? t.month : t.months}`;
}
export type OctoberSelection = { plan: string; duration: string; durationKey: '1' | '3' | '6' | '12'; price: string; billed: string; request: string; quantity: string; notes: string };
export function getOctoberSelection(params: URLSearchParams, lang: OctoberLanguage): OctoberSelection | null {
  const kind = params.get('octOffer');
  const t = octoberCopy[lang];
  if (kind === 'holiday') {
    const p = holidayPlans.find(x => x.id === params.get('planId')) || holidayPlans[0];
    return { plan: `Ultra ${p.name} — ${t.holiday.badge}`, duration: periodLabel(12, lang), durationKey: '12', price: `${money(p.monthly)}${t.ui.perMonth} (${t.ui.equivalent})`, billed: `${money(p.total)} ${t.ui.upfront}`, request: 'october-holiday', quantity: '1', notes: `${t.ui.newCustomer}. ${t.holiday.after} ${t.ui.tax} ${t.ui.offerEnds}` };
  }
  if (kind === '25gb') {
    const p = monthly25Plans.find(x => x.duration === Number(params.get('months'))) || monthly25Plans[0];
    return { plan: `Ultra 25GB — ${t.monthly.badge}`, duration: periodLabel(p.duration, lang), durationKey: String(p.duration) as OctoberSelection['durationKey'], price: `${money(p.monthly)}${t.ui.perMonth}`, billed: `${money(p.total)} ${t.ui.upfront}`, request: 'october-25gb', quantity: '1', notes: `${t.ui.newCustomer}. ${t.monthly.separate} ${t.ui.tax} ${t.ui.offerEnds}` };
  }
  if (kind === 'family') return { plan: t.family.title, duration: periodLabel(1, lang), durationKey: '1', price: `$100${t.ui.perMonth}`, billed: `$100 ${t.family.totalLabel}`, request: 'family', quantity: '4', notes: `${t.family.eligibility} ${t.ui.tax}` };
  if (kind === 'renewal' || kind === 'roaming' || kind === 'switch') {
    const title = kind === 'renewal' ? t.renewal.title : kind === 'roaming' ? t.roam.title : t.transfer.title;
    const note = kind === 'renewal' ? t.renewal.rule : kind === 'roaming' ? t.roam.note : t.transfer.warning;
    return { plan: title, duration: '', durationKey: '1', price: '', billed: '', request: `october-${kind}`, quantity: '1', notes: note };
  }
  return null;
}
export function offerHref(kind: string, planId?: string, months?: number) {
  const p = new URLSearchParams({ octOffer: kind, source: 'october-2026' });
  if (planId) p.set('planId', planId);
  if (months) p.set('months', String(months));
  return `/ultra-sim?${p.toString()}`;
}