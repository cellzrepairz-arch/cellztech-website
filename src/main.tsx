import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  ChevronRight,
  Facebook,
  Globe2,
  Instagram,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TabletSmartphone,
  Wifi,
  X,
  Zap
} from 'lucide-react';
import './styles.css';

type PageKey = 'home' | 'repairs' | 'ultra' | 'buyback' | 'phones' | 'accessories' | 'about' | 'contact';
type LanguageKey = 'en' | 'es' | 'pl' | 'uk' | 'cs' | 'ru';

type Copy = {
  nav: Record<PageKey, string>;
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  primaryCta: string;
  secondaryCta: string;
  serviceIntro: string;
  languageLabel: string;
  phoneLabel: string;
};

const languages: { key: LanguageKey; label: string }[] = [
  { key: 'en', label: 'EN' },
  { key: 'es', label: 'ES' },
  { key: 'pl', label: 'PL' },
  { key: 'uk', label: 'UK' },
  { key: 'cs', label: 'CZ' },
  { key: 'ru', label: 'RU' }
];

const copy: Record<LanguageKey, Copy> = {
  en: {
    nav: { home: 'Home', repairs: 'Repairs', ultra: 'Ultra Mobile', buyback: 'Buyback', phones: 'Phones', accessories: 'Accessories', about: 'About', contact: 'Contact' },
    heroEyebrow: 'Chicago phone repair, wireless plans, phones & buyback',
    heroTitle: 'Modern local tech help, built around the way people use phones today.',
    heroText: 'CellzTech helps with phone repairs, Ultra Mobile activations, used phones, accessories, and instant iPhone buyback quotes through Apex Tech Exchange.',
    primaryCta: 'Call CellzTech',
    secondaryCta: 'Explore Services',
    serviceIntro: 'What do you need today?',
    languageLabel: 'Language',
    phoneLabel: 'Call Now'
  },
  es: {
    nav: { home: 'Inicio', repairs: 'Reparaciones', ultra: 'Ultra Mobile', buyback: 'Compra', phones: 'Teléfonos', accessories: 'Accesorios', about: 'Nosotros', contact: 'Contacto' },
    heroEyebrow: 'Reparación de celulares, planes, teléfonos y compra en Chicago',
    heroTitle: 'Ayuda tecnológica local y moderna para tu teléfono.',
    heroText: 'CellzTech ayuda con reparaciones, activaciones Ultra Mobile, teléfonos usados, accesorios y cotizaciones instantáneas de iPhone por Apex Tech Exchange.',
    primaryCta: 'Llamar a CellzTech',
    secondaryCta: 'Ver Servicios',
    serviceIntro: '¿Qué necesitas hoy?',
    languageLabel: 'Idioma',
    phoneLabel: 'Llamar'
  },
  pl: {
    nav: { home: 'Start', repairs: 'Naprawy', ultra: 'Ultra Mobile', buyback: 'Skup', phones: 'Telefony', accessories: 'Akcesoria', about: 'O nas', contact: 'Kontakt' },
    heroEyebrow: 'Naprawa telefonów, plany komórkowe, telefony i skup w Chicago',
    heroTitle: 'Nowoczesna lokalna pomoc technologiczna dla Twojego telefonu.',
    heroText: 'CellzTech pomaga z naprawą telefonów, aktywacją Ultra Mobile, sprzedażą używanych telefonów, akcesoriami oraz natychmiastową wyceną iPhone przez Apex Tech Exchange.',
    primaryCta: 'Zadzwoń do CellzTech',
    secondaryCta: 'Zobacz Usługi',
    serviceIntro: 'Czego potrzebujesz dzisiaj?',
    languageLabel: 'Język',
    phoneLabel: 'Zadzwoń'
  },
  uk: {
    nav: { home: 'Головна', repairs: 'Ремонт', ultra: 'Ultra Mobile', buyback: 'Викуп', phones: 'Телефони', accessories: 'Аксесуари', about: 'Про нас', contact: 'Контакти' },
    heroEyebrow: 'Ремонт телефонів, мобільні плани, телефони та викуп у Чикаго',
    heroTitle: 'Сучасна локальна технічна допомога для вашого телефону.',
    heroText: 'CellzTech допомагає з ремонтом телефонів, активаціями Ultra Mobile, вживаними телефонами, аксесуарами та миттєвою оцінкою iPhone через Apex Tech Exchange.',
    primaryCta: 'Подзвонити',
    secondaryCta: 'Послуги',
    serviceIntro: 'Що вам потрібно сьогодні?',
    languageLabel: 'Мова',
    phoneLabel: 'Дзвінок'
  },
  cs: {
    nav: { home: 'Domů', repairs: 'Opravy', ultra: 'Ultra Mobile', buyback: 'Výkup', phones: 'Telefony', accessories: 'Příslušenství', about: 'O nás', contact: 'Kontakt' },
    heroEyebrow: 'Opravy telefonů, mobilní tarify, telefony a výkup v Chicagu',
    heroTitle: 'Moderní místní technická pomoc pro váš telefon.',
    heroText: 'CellzTech pomáhá s opravami telefonů, aktivací Ultra Mobile, použitými telefony, příslušenstvím a okamžitou cenovou nabídkou iPhonu přes Apex Tech Exchange.',
    primaryCta: 'Zavolat CellzTech',
    secondaryCta: 'Zobrazit služby',
    serviceIntro: 'Co dnes potřebujete?',
    languageLabel: 'Jazyk',
    phoneLabel: 'Zavolat'
  },
  ru: {
    nav: { home: 'Главная', repairs: 'Ремонт', ultra: 'Ultra Mobile', buyback: 'Выкуп', phones: 'Телефоны', accessories: 'Аксессуары', about: 'О нас', contact: 'Контакты' },
    heroEyebrow: 'Ремонт телефонов, мобильные планы, телефоны и выкуп в Чикаго',
    heroTitle: 'Современная локальная техническая помощь для вашего телефона.',
    heroText: 'CellzTech помогает с ремонтом телефонов, активациями Ultra Mobile, подержанными телефонами, аксессуарами и мгновенной оценкой iPhone через Apex Tech Exchange.',
    primaryCta: 'Позвонить',
    secondaryCta: 'Услуги',
    serviceIntro: 'Что вам нужно сегодня?',
    languageLabel: 'Язык',
    phoneLabel: 'Позвонить'
  }
};

const pages: PageKey[] = ['home', 'repairs', 'ultra', 'buyback', 'phones', 'accessories', 'about', 'contact'];

const serviceCards = [
  { key: 'repairs' as PageKey, title: 'Repairs', text: 'iPhone, Samsung, iPad, Motorola, Google Pixel, screens, batteries, charging ports, cameras, back glass, and data recovery.', icon: TabletSmartphone, cta: 'Fix My Device' },
  { key: 'ultra' as PageKey, title: 'Ultra Mobile', text: 'Stop overpaying for wireless. Get local help switching, keeping your number, checking compatibility, and choosing a plan.', icon: Wifi, cta: 'Switch & Save' },
  { key: 'buyback' as PageKey, title: 'Buyback', text: 'Have an iPhone sitting in a drawer? Get an instant quote through Apex Tech Exchange.', icon: Sparkles, cta: 'Get Instant Quote' },
  { key: 'phones' as PageKey, title: 'Phones', text: 'Used and unlocked phones available in-store with local support and practical warranty information.', icon: Smartphone, cta: 'View Phones' },
  { key: 'accessories' as PageKey, title: 'Accessories', text: 'Chargers, cables, cases, screen protectors, and everyday phone accessories available locally.', icon: ShoppingBag, cta: 'Shop Accessories' }
];

const repairItems = ['iPhone screen repair', 'Samsung repair', 'iPad and tablet repair', 'Battery replacement', 'Charging port repair', 'Back glass repair', 'Camera repair', 'Data recovery', 'Motorola repair', 'Google Pixel repair'];
const trustItems = ['High-quality parts', 'Clear local service', 'Warranty-focused repairs', 'No corporate store headache'];

function App() {
  const [page, setPage] = useState<PageKey>('home');
  const [language, setLanguage] = useState<LanguageKey>('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const t = copy[language];

  const activeTitle = useMemo(() => t.nav[page], [page, t]);

  const goTo = (next: PageKey) => {
    setPage(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      <Header t={t} page={page} goTo={goTo} language={language} setLanguage={setLanguage} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        {page === 'home' && <HomePage t={t} goTo={goTo} />}
        {page === 'repairs' && <RepairsPage activeTitle={activeTitle} goTo={goTo} />}
        {page === 'ultra' && <UltraPage activeTitle={activeTitle} />}
        {page === 'buyback' && <BuybackPage activeTitle={activeTitle} />}
        {page === 'phones' && <PhonesPage activeTitle={activeTitle} />}
        {page === 'accessories' && <AccessoriesPage activeTitle={activeTitle} />}
        {page === 'about' && <AboutPage activeTitle={activeTitle} />}
        {page === 'contact' && <ContactPage activeTitle={activeTitle} />}
      </main>
      <Footer t={t} goTo={goTo} />
      <a className="floating-call" href="tel:17734137489" aria-label="Call CellzTech">
        <Phone size={18} />
        {t.phoneLabel}
      </a>
    </div>
  );
}

function Header({ t, page, goTo, language, setLanguage, menuOpen, setMenuOpen }: {
  t: Copy;
  page: PageKey;
  goTo: (page: PageKey) => void;
  language: LanguageKey;
  setLanguage: (language: LanguageKey) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  return (
    <header className="site-header">
      <div className="top-strip">
        <div><MapPin size={14} /> 3412 N Harlem Ave STE A, Chicago IL 60634</div>
        <a href="tel:17734137489"><Phone size={14} /> 773-413-7489</a>
      </div>
      <nav className="nav-bar">
        <button className="brand" onClick={() => goTo('home')} aria-label="CellzTech Home">
          <span className="brand-mark">CT</span>
          <span>
            <strong>CellzTech</strong>
            <small>Operated by Cellz Repairz LLC</small>
          </span>
        </button>
        <div className="desktop-nav">
          {pages.map((p) => (
            <button key={p} className={page === p ? 'active' : ''} onClick={() => goTo(p)}>{t.nav[p]}</button>
          ))}
        </div>
        <div className="nav-actions">
          <label className="language-select">
            <Globe2 size={16} />
            <select aria-label={t.languageLabel} value={language} onChange={(event) => setLanguage(event.target.value as LanguageKey)}>
              {languages.map((lang) => <option key={lang.key} value={lang.key}>{lang.label}</option>)}
            </select>
          </label>
          <a className="nav-call" href="tel:17734137489">Call</a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="mobile-menu">
          {pages.map((p) => <button key={p} onClick={() => goTo(p)}>{t.nav[p]}</button>)}
        </div>
      )}
    </header>
  );
}

function HomePage({ t, goTo }: { t: Copy; goTo: (page: PageKey) => void }) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><Zap size={16} /> {t.heroEyebrow}</div>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>
            <div className="hero-actions">
              <a className="button primary" href="tel:17734137489">{t.primaryCta}<ArrowRight size={18} /></a>
              <button className="button secondary" onClick={() => goTo('repairs')}>{t.secondaryCta}</button>
            </div>
            <div className="trust-row">
              {trustItems.map((item) => <span key={item}><CheckCircle2 size={16} /> {item}</span>)}
            </div>
          </div>
          <div className="hero-device-card">
            <div className="glass-card main-device">
              <div className="status-pill">Open for repairs, wireless & buyback</div>
              <h2>What do you need today?</h2>
              <div className="quick-list">
                {serviceCards.map(({ key, title, icon: Icon }) => (
                  <button key={key} onClick={() => goTo(key)}>
                    <Icon size={19} />
                    {title}
                    <ChevronRight size={18} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mini-card one"><ShieldCheck size={20} /> Warranty-focused repair service</div>
            <div className="mini-card two"><BatteryCharging size={20} /> Batteries, screens & charging ports</div>
          </div>
        </div>
      </section>
      <section className="section service-hub">
        <div className="section-heading">
          <span>{t.serviceIntro}</span>
          <h2>Choose a service and get local help fast.</h2>
          <p>CellzTech is built as a clean hub for repairs, wireless savings, buyback, phones, accessories, and future online features.</p>
        </div>
        <div className="card-grid five">
          {serviceCards.map(({ key, title, text, icon: Icon, cta }) => (
            <article className="service-card" key={title}>
              <div className="icon-circle"><Icon size={24} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <button onClick={() => goTo(key)}>{cta} <ArrowRight size={16} /></button>
            </article>
          ))}
        </div>
      </section>
      <section className="section split-section">
        <div>
          <span className="section-kicker">SEO-ready foundation</span>
          <h2>Built for Chicago searches, not just good looks.</h2>
          <p>This V1 structure is ready to grow into dedicated SEO pages for iPhone repair, Samsung repair, iPad repair, Ultra Mobile, phone buyback, and unlocked phones in Chicago.</p>
        </div>
        <div className="seo-list">
          <span>LocalBusiness schema</span>
          <span>Fast Vite/React build</span>
          <span>Mobile-first layout</span>
          <span>Multi-language framework</span>
          <span>Clear conversion buttons</span>
        </div>
      </section>
    </>
  );
}

function PageHero({ title, kicker, text }: { title: string; kicker: string; text: string }) {
  return (
    <section className="page-hero">
      <span>{kicker}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

function RepairsPage({ activeTitle, goTo }: { activeTitle: string; goTo: (page: PageKey) => void }) {
  return (
    <>
      <PageHero title={activeTitle} kicker="Device repair" text="Professional phone, tablet, and device repair with high-quality parts, clear communication, and local support in Chicago." />
      <section className="section">
        <div className="repair-grid">
          {repairItems.map((item) => (
            <article className="repair-tile" key={item}>
              <CheckCircle2 size={20} />
              <h3>{item}</h3>
              <p>Stop in or call us so we can check the device and explain the best repair option.</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section callout-panel">
        <div>
          <h2>Not sure what is wrong with the device?</h2>
          <p>Bring it in. We can inspect the issue, explain the repair path, and help you decide if it is worth fixing.</p>
        </div>
        <button className="button primary" onClick={() => goTo('contact')}>Visit CellzTech <ArrowRight size={18} /></button>
      </section>
    </>
  );
}

function UltraPage({ activeTitle }: { activeTitle: string }) {
  return (
    <>
      <PageHero title={activeTitle} kicker="Wireless savings" text="If you are overpaying for your wireless bill, CellzTech can help you switch, keep your number, and save money with Ultra Mobile." />
      <section className="section ultra-layout">
        <div className="plan-card featured">
          <span>Popular talking points</span>
          <h2>Ultra Mobile at CellzTech</h2>
          <p>Plans from $29/month, unlimited talk and text, international calling to Poland and 90+ countries, T-Mobile network coverage, $0 activation fee, and a free SIM card.</p>
          <a className="button primary" href="tel:17734137489">Call for Ultra Mobile <ArrowRight size={18} /></a>
        </div>
        <div className="stacked-info">
          <InfoBlock title="Switching checklist" items={['Account number', 'Transfer PIN', 'Unlocked compatible phone', 'We help check compatibility in-store']} />
          <InfoBlock title="Go Roam World Pass" items={['Great for Poland, Europe, and international travel', '$5 pass: 5 days, 100 minutes, 100 SMS, 1GB high-speed data', '$10 pass: 15 days, 300 minutes, 300 SMS, 5GB high-speed data', 'Activate by texting ACTIVATE to 6700']} />
        </div>
      </section>
      <section className="section newsletter-panel">
        <span>Monthly update system</span>
        <h2>Ready for monthly Ultra Mobile newsletter updates.</h2>
        <p>This page is designed so new monthly promos from your Ultra PDF/newsletter can be rewritten, translated, and updated in the site ZIP before pushing to GitHub.</p>
      </section>
    </>
  );
}

function BuybackPage({ activeTitle }: { activeTitle: string }) {
  return (
    <>
      <PageHero title={activeTitle} kicker="Apex Tech Exchange" text="Sell your used iPhone with an instant quote powered by Apex Tech Exchange." />
      <section className="section split-section bright">
        <div>
          <h2>Have an iPhone sitting in a drawer?</h2>
          <p>Get an instant quote online through Apex Tech Exchange, then contact or visit CellzTech to complete the process.</p>
          <p className="polish-line">Masz iPhone, który leży w szufladzie? Sprawdź natychmiastową wycenę na www.apextechexchange.com.</p>
        </div>
        <a className="button primary" href="https://www.apextechexchange.com" target="_blank" rel="noreferrer">Get Instant Quote <ArrowRight size={18} /></a>
      </section>
    </>
  );
}

function PhonesPage({ activeTitle }: { activeTitle: string }) {
  return (
    <>
      <PageHero title={activeTitle} kicker="Used and unlocked phones" text="Shop used and unlocked phones available locally at CellzTech. Inventory can be added as a live store section in a future version." />
      <section className="section inventory-placeholder">
        {['Used iPhones', 'Unlocked phones', 'Budget phones', 'Future live inventory'].map((item) => (
          <article key={item}>
            <Smartphone size={28} />
            <h3>{item}</h3>
            <p>Call or stop in to check availability. Future versions can connect this section to inventory, Google Sheets, or an admin dashboard.</p>
          </article>
        ))}
      </section>
    </>
  );
}

function AccessoriesPage({ activeTitle }: { activeTitle: string }) {
  return (
    <>
      <PageHero title={activeTitle} kicker="Everyday phone essentials" text="Cases, chargers, screen protectors, cables, and useful accessories available in-store." />
      <section className="section card-grid four">
        {['Chargers', 'Cases', 'Screen protectors', 'Cables'].map((item) => (
          <article className="service-card compact" key={item}>
            <ShoppingBag size={26} />
            <h3>{item}</h3>
            <p>Available in-store. Stop by or call to check what is currently in stock.</p>
          </article>
        ))}
      </section>
    </>
  );
}

function AboutPage({ activeTitle }: { activeTitle: string }) {
  return (
    <>
      <PageHero title={activeTitle} kicker="Local Chicago tech shop" text="CellzTech is the modern customer-facing brand operated by Cellz Repairz LLC." />
      <section className="section split-section">
        <div>
          <h2>Local service with real repair experience.</h2>
          <p>CellzTech exists to make phone repair, wireless service, buyback, and used phone shopping simpler for local customers. The goal is practical help, clear options, and a better experience than the average repair or carrier store.</p>
        </div>
        <div className="about-card">
          <h3>Operated by Cellz Repairz LLC</h3>
          <p>3412 N Harlem Ave STE A<br />Chicago, IL 60634</p>
          <p>Phone: 773-413-7489</p>
        </div>
      </section>
    </>
  );
}

function ContactPage({ activeTitle }: { activeTitle: string }) {
  return (
    <>
      <PageHero title={activeTitle} kicker="Visit or call" text="Stop in for repairs, Ultra Mobile activations, phone sales, accessories, and buyback help." />
      <section className="section contact-grid">
        <div className="contact-card">
          <MapPin size={28} />
          <h2>CellzTech</h2>
          <p>3412 N Harlem Ave STE A<br />Chicago, IL 60634</p>
          <a className="button primary" href="https://maps.google.com/?q=3412+N+Harlem+Ave+STE+A+Chicago+IL+60634" target="_blank" rel="noreferrer">Get Directions</a>
        </div>
        <div className="contact-card">
          <Phone size={28} />
          <h2>Call us</h2>
          <p>Questions about repairs, Ultra Mobile, phones, accessories, or buyback?</p>
          <a className="button secondary" href="tel:17734137489">773-413-7489</a>
        </div>
        <div className="contact-card">
          <Instagram size={28} />
          <h2>Social</h2>
          <p>Add your Facebook and Instagram URLs in the code when ready.</p>
          <div className="social-row"><Facebook /> <Instagram /></div>
        </div>
      </section>
    </>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="info-block">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}
      </ul>
    </article>
  );
}

function Footer({ t, goTo }: { t: Copy; goTo: (page: PageKey) => void }) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">CellzTech</div>
          <p>Phone repair, Ultra Mobile, buyback, phones, and accessories in Chicago.</p>
          <p className="legal-line">CellzTech is operated by Cellz Repairz LLC.</p>
        </div>
        <div>
          <h4>Services</h4>
          {['repairs', 'ultra', 'buyback', 'phones', 'accessories'].map((p) => <button key={p} onClick={() => goTo(p as PageKey)}>{t.nav[p as PageKey]}</button>)}
        </div>
        <div>
          <h4>Visit</h4>
          <p>3412 N Harlem Ave STE A<br />Chicago, IL 60634</p>
          <a href="tel:17734137489">773-413-7489</a>
        </div>
        <div>
          <h4>Websites</h4>
          <a href="https://www.cellztech.com">cellztech.com</a>
          <a href="https://www.apextechexchange.com">apextechexchange.com</a>
          <a href="https://www.serwiskomorkowy.com">serwiskomorkowy.com</a>
        </div>
      </div>
      <div className="footer-bottom">© 2026 CellzTech. Operated by Cellz Repairz LLC.</div>
    </footer>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
