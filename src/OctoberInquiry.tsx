import React, { useMemo, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Phone, ShieldCheck } from 'lucide-react';
import { octoberCopy, type OctoberLanguage } from './october-copy';
import { getOctoberSelection, holidayPlans, monthly25Plans, money, periodLabel, HOLIDAY_END, RENEWAL_END } from './october-offers';
import { simRequestCopy } from './sim-copy';

const extra = {
  en: { title: 'Let’s find your Ultra plan.', intro: 'Choose an offer or ask a question. We’ll confirm eligibility and the full price before you pay.', help: 'Help me choose / another plan', current: 'Your selected offer', edit: 'Change offer', cards: 'Number of lines', total: 'Estimated plan total before tax', submit: 'Send my request', sent: 'Request received', next: 'We received your request. CellzTech will contact you about eligibility, availability and next steps. This is not a completed activation.', privacy: 'We use these details to respond to this request. This does not subscribe you to promotional emails.', retry: 'We could not confirm your request was saved. Please try again or call 773-413-7489.', comment: 'Question or additional details', request: 'How would you like help?', promo: 'Offer', expiry: 'This advertised offer has ended. Please call for current options.', sending: 'Sending…', selected: 'Selected', contact: 'Your contact details', legacy: 'The earlier promotion has ended. Choose a current offer below or ask us to compare plans.' },
  pl: { title: 'Znajdźmy dla Ciebie plan Ultra.', intro: 'Wybierz ofertę lub zadaj pytanie. Przed płatnością potwierdzimy warunki i pełną cenę.', help: 'Pomóżcie mi wybrać / inny plan', current: 'Wybrana oferta', edit: 'Zmień ofertę', cards: 'Liczba linii', total: 'Szacowana suma za plan przed podatkiem', submit: 'Wyślij zapytanie', sent: 'Otrzymaliśmy zapytanie', next: 'Twoje zapytanie zostało przyjęte. CellzTech skontaktuje się, aby potwierdzić warunki, dostępność i kolejne kroki. To jeszcze nie jest aktywacja.', privacy: 'Wykorzystujemy te dane do odpowiedzi na Twoje zapytanie. Nie oznacza to zapisu na e-maile promocyjne.', retry: 'Nie udało się potwierdzić zapisania zapytania. Spróbuj ponownie lub zadzwoń pod 773-413-7489.', comment: 'Pytanie lub dodatkowe informacje', request: 'Jak możemy pomóc?', promo: 'Oferta', expiry: 'Ta oferta się zakończyła. Zadzwoń i zapytaj o aktualne opcje.', sending: 'Wysyłanie…', selected: 'Wybrano', contact: 'Twoje dane kontaktowe', legacy: 'Poprzednia promocja się zakończyła. Wybierz aktualną ofertę poniżej lub poproś o porównanie planów.' },
  es: { title: 'Encuentra tu plan Ultra.', intro: 'Elige una oferta o haz una pregunta. Confirmaremos la elegibilidad y el precio total antes de que pagues.', help: 'Ayúdame a elegir / otro plan', current: 'Tu oferta seleccionada', edit: 'Cambiar oferta', cards: 'Número de líneas', total: 'Total estimado del plan antes de impuestos', submit: 'Enviar mi solicitud', sent: 'Solicitud recibida', next: 'Recibimos tu solicitud. CellzTech te contactará para confirmar elegibilidad, disponibilidad y próximos pasos. La activación aún no se ha completado.', privacy: 'Usamos estos datos para responder a esta solicitud. Esto no te suscribe a correos promocionales.', retry: 'No pudimos confirmar que se guardó tu solicitud. Inténtalo de nuevo o llama al 773-413-7489.', comment: 'Pregunta o detalles adicionales', request: '¿Cómo podemos ayudarte?', promo: 'Oferta', expiry: 'Esta oferta ha terminado. Llámanos para conocer las opciones actuales.', sending: 'Enviando…', selected: 'Seleccionado', contact: 'Tus datos de contacto', legacy: 'La promoción anterior ha terminado. Elige una oferta actual abajo o pídenos comparar planes.' },
  uk: { title: 'Знайдемо ваш план Ultra.', intro: 'Виберіть пропозицію або поставте запитання. Перед оплатою ми підтвердимо умови та повну ціну.', help: 'Допоможіть вибрати / інший план', current: 'Вибрана пропозиція', edit: 'Змінити пропозицію', cards: 'Кількість ліній', total: 'Орієнтовна сума за план до податків', submit: 'Надіслати запит', sent: 'Запит отримано', next: 'Ваш запит отримано. CellzTech зв’яжеться з вами, щоб підтвердити умови, наявність і наступні кроки. Це ще не завершена активація.', privacy: 'Ми використовуємо ці дані для відповіді на ваш запит. Це не підписує вас на рекламні листи.', retry: 'Не вдалося підтвердити збереження запиту. Спробуйте ще раз або зателефонуйте 773-413-7489.', comment: 'Запитання або додаткова інформація', request: 'Яка допомога вам потрібна?', promo: 'Пропозиція', expiry: 'Ця пропозиція закінчилася. Зателефонуйте, щоб дізнатися актуальні варіанти.', sending: 'Надсилання…', selected: 'Вибрано', contact: 'Ваші контактні дані', legacy: 'Попередня акція закінчилася. Виберіть актуальну пропозицію нижче або попросіть порівняти плани.' }
};

export function OctoberInquiry({ lang }: { lang: OctoberLanguage }) {
  const t = octoberCopy[lang]; const c = simRequestCopy[lang]; const x = extra[lang];
  const initial = useMemo(() => new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search), []);
  const oldRequest = initial.get('request') || '';
  const [kind, setKind] = useState(initial.get('octOffer') || (oldRequest === 'family' || oldRequest === 'august-family-plan' ? 'family' : 'help'));
  const [planId, setPlanId] = useState(initial.get('planId') || '8gb');
  const [months, setMonths] = useState(initial.get('months') || '1');
  const params = new URLSearchParams({ octOffer: kind, planId, months });
  const selection = getOctoberSelection(params, lang);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const sending = useRef(false);
  const [form, setForm] = useState({ requestType: 'pickup', simQuantity: '1', needsActivationHelp: true, name: '', phone: '', email: '', shippingAddress: '', shippingCity: '', shippingState: '', shippingZip: '', notes: '' });
  const update = (key: keyof typeof form, value: string | boolean) => setForm(f => ({ ...f, [key]: value }));
  const quantity = kind === 'family' ? 4 : Math.max(1, Math.min(5, Number(form.simQuantity) || 1));
  const oneTotal = kind === 'holiday' ? (holidayPlans.find(p => p.id === planId) || holidayPlans[0]).total : kind === '25gb' ? (monthly25Plans.find(p => p.duration === Number(months)) || monthly25Plans[0]).total : kind === 'family' ? 100 : 0;
  const total = kind === 'family' ? 100 : oneTotal * quantity;
  const expired = ['holiday','25gb','family'].includes(kind) ? Date.now() >= Date.parse(HOLIDAY_END) : kind === 'renewal' ? Date.now() >= Date.parse(RENEWAL_END) : false;
  const offerOptions = [{ id: 'help', title: x.help }, { id: 'holiday', title: t.brief.holiday }, { id: '25gb', title: t.brief.monthly }, { id: 'family', title: t.brief.family }, { id: 'renewal', title: t.renewal.title }, { id: 'roaming', title: t.roam.title }, { id: 'switch', title: t.transfer.title }];
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending.current || status === 'success' || expired) return;
    sending.current = true; setStatus('sending');
    const plan = selection?.plan || x.help;
    const notes = [selection?.notes, form.notes, `Website source: october-2026; offer=${kind}; language=${lang}.`].filter(Boolean).join('\n');
    try {
      const response = await fetch('/api/sim-request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, simQuantity: String(quantity), planInterest: plan, selectedDuration: selection?.duration || '', selectedDurationKey: selection?.durationKey || '1', selectedPrice: selection?.price || '', selectedBilled: total ? `${money(total)} ${t.ui.tax}` : '', language: lang, request: selection?.request || 'october-general', notes })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error('Request not confirmed');
      setStatus('success');
      void fetch('/api/track-visit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: '/event/october_ultra_request_saved', page: 'october_ultra_request_saved', language: lang }) }).catch(() => undefined);
    } catch { setStatus('error'); } finally { sending.current = false; }
  };
  if (status === 'success') return <main className="oct-page" id="main-content"><section className="oct-section"><div className="oct-container oct-inquiry-success" role="status"><CheckCircle2 size={40}/><h1>{x.sent}</h1><p>{x.next}</p><a className="oct-button" href="/ultra-mobile">{t.ui.compare}<ArrowRight size={18}/></a><a className="oct-call-inline" href="tel:7734137489"><Phone size={16}/>773-413-7489</a></div></section></main>;
  return <main className="oct-page" id="main-content"><section className="oct-section oct-inquiry"><div className="oct-container">
    <span className="oct-eyebrow">ULTRA MOBILE · CELLZTECH</span><h1>{x.title}</h1><p className="oct-lede">{x.intro}</p>
    {oldRequest.includes('august') && oldRequest !== 'august-family-plan' && <p className="oct-notice">{x.legacy}</p>}
    <form className="oct-inquiry-grid" onSubmit={submit}>
      <section className="oct-inquiry-options" aria-labelledby="oct-request-title"><h2 id="oct-request-title">{x.current}</h2>
        <label>{x.promo}<select value={kind} onChange={e => setKind(e.target.value)}>{offerOptions.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}</select></label>
        {kind === 'holiday' && <label>{t.ui.plan}<select value={planId} onChange={e => setPlanId(e.target.value)}>{holidayPlans.map(p => <option key={p.id} value={p.id}>{p.name} — {money(p.total)} / {periodLabel(12,lang)}</option>)}</select></label>}
        {kind === '25gb' && <label>{t.monthly.duration}<select value={months} onChange={e => setMonths(e.target.value)}>{monthly25Plans.map(p => <option key={p.duration} value={p.duration}>{periodLabel(p.duration,lang)} — {money(p.total)}</option>)}</select></label>}
        {kind !== 'family' && oneTotal > 0 && <label>{x.cards}<select value={form.simQuantity} onChange={e => update('simQuantity',e.target.value)}>{[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}</select></label>}
        {selection && <div className="oct-selected-offer"><strong>{selection.plan}</strong><p>{selection.duration} {selection.price}</p>{total > 0 && <><small>{x.total}</small><b>{money(total)}</b><small>{kind === 'family' ? t.family.totalLabel : t.ui.upfront} · {t.ui.tax}</small></>}<p>{selection.notes}</p></div>}
        {kind === '25gb' && <p className="oct-fine-print">{t.monthly.rule}</p>}
        <a className="oct-text-link" href="/ultra-mobile">{t.ui.compare}<ArrowRight size={17}/></a>
        <p className="oct-fine-print"><ShieldCheck size={17}/>{t.ui.noPayment}</p>
      </section>
      <section className="oct-inquiry-fields" aria-labelledby="oct-contact-form"><h2 id="oct-contact-form">{x.contact}</h2>
        <div className="oct-form-row"><label>{c.name}<input name="name" autoComplete="name" maxLength={120} required value={form.name} onChange={e => update('name',e.target.value)}/></label><label>{c.phone}<input name="phone" type="tel" autoComplete="tel" maxLength={32} minLength={7} required value={form.phone} onChange={e => update('phone',e.target.value)}/></label></div>
        <label>{c.email}<input name="email" type="email" autoComplete="email" maxLength={254} required value={form.email} onChange={e => update('email',e.target.value)}/></label>
        <fieldset><legend>{x.request}</legend><div className="oct-sim-options">{c.options.map(o => <label key={o.key}><input type="radio" name="requestType" value={o.key} checked={form.requestType===o.key} onChange={() => update('requestType',o.key)}/><span>{o.title}</span></label>)}</div></fieldset>
        {form.requestType === 'shipping' && <fieldset><legend>{c.shipping}</legend><label>{c.address}<input autoComplete="shipping street-address" required maxLength={240} value={form.shippingAddress} onChange={e => update('shippingAddress',e.target.value)}/></label><div className="oct-form-row"><label>{c.city}<input autoComplete="shipping address-level2" required maxLength={100} value={form.shippingCity} onChange={e => update('shippingCity',e.target.value)}/></label><label>{c.state}<input autoComplete="shipping address-level1" required maxLength={50} value={form.shippingState} onChange={e => update('shippingState',e.target.value)}/></label><label>{c.zip}<input autoComplete="shipping postal-code" required maxLength={12} value={form.shippingZip} onChange={e => update('shippingZip',e.target.value)}/></label></div></fieldset>}
        <label className="oct-check"><input type="checkbox" checked={form.needsActivationHelp} onChange={e => update('needsActivationHelp',e.target.checked)}/><span>{c.activation}</span></label>
        <label>{x.comment}<textarea rows={3} maxLength={2000} value={form.notes} onChange={e => update('notes',e.target.value)}/></label>
        <p className="oct-fine-print">{x.privacy}</p>
        {expired && <p className="oct-form-error" role="alert">{x.expiry}</p>}{status === 'error' && <p className="oct-form-error" role="alert">{x.retry}</p>}
        <button className="oct-button" type="submit" disabled={status === 'sending' || expired}>{status === 'sending' ? x.sending : x.submit}<ArrowRight size={18}/></button><p className="oct-fine-print">{c.disclaimer}</p>
      </section>
    </form>
  </div></section></main>;
}