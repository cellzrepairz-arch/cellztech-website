import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Globe2,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TabletSmartphone,
  Wifi,
  Wrench,
  X,
  Zap,
  Camera,
  Plug,
  Star,
  MessageCircle,
  BadgeCheck,
  Store,
  Languages,
  Search,
  MousePointerClick
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

const routes: Record<PageKey, string> = {
  home: '/',
  repairs: '/repairs',
  ultra: '/ultra-mobile',
  buyback: '/buyback',
  phones: '/phones',
  accessories: '/accessories',
  about: '/about',
  contact: '/contact'
};

const pathToPage: Record<string, PageKey> = Object.entries(routes).reduce((acc, [key, value]) => {
  acc[value] = key as PageKey;
  return acc;
}, {} as Record<string, PageKey>);

const languages: { key: LanguageKey; label: string; name: string }[] = [
  { key: 'en', label: 'EN', name: 'English' },
  { key: 'es', label: 'ES', name: 'Spanish' },
  { key: 'pl', label: 'PL', name: 'Polish' },
  { key: 'uk', label: 'UK', name: 'Ukrainian' },
  { key: 'cs', label: 'CZ', name: 'Czech' },
  { key: 'ru', label: 'RU', name: 'Russian' }
];

const copy: Record<LanguageKey, Copy> = {
  en: {
    nav: { home: 'Home', repairs: 'Repairs', ultra: 'Ultra Mobile', buyback: 'Buyback', phones: 'Phones', accessories: 'Accessories', about: 'About', contact: 'Contact' },
    heroEyebrow: 'Chicago phone repair, wireless plans, phones & buyback',
    heroTitle: 'Fix it. Switch it. Sell it. Upgrade it.',
    heroText: 'CellzTech is your local Chicago tech shop for phone repairs, Ultra Mobile activations, used phones, accessories, and instant iPhone buyback quotes through Apex Tech Exchange.',
    primaryCta: 'Call CellzTech',
    secondaryCta: 'Explore Services',
    serviceIntro: 'What do you need today?',
    languageLabel: 'Language',
    phoneLabel: 'Call Now'
  },
  es: {
    nav: { home: 'Inicio', repairs: 'Reparaciones', ultra: 'Ultra Mobile', buyback: 'Compra', phones: 'Teléfonos', accessories: 'Accesorios', about: 'Nosotros', contact: 'Contacto' },
    heroEyebrow: 'Reparación de celulares, planes, teléfonos y compra en Chicago',
    heroTitle: 'Repáralo. Cámbiate. Véndelo. Mejora.',
    heroText: 'CellzTech ayuda con reparaciones, activaciones Ultra Mobile, teléfonos usados, accesorios y cotizaciones instantáneas de iPhone por Apex Tech Exchange.',
    primaryCta: 'Llamar a CellzTech',
    secondaryCta: 'Ver servicios',
    serviceIntro: '¿Qué necesitas hoy?',
    languageLabel: 'Idioma',
    phoneLabel: 'Llamar'
  },
  pl: {
    nav: { home: 'Start', repairs: 'Naprawy', ultra: 'Ultra Mobile', buyback: 'Skup', phones: 'Telefony', accessories: 'Akcesoria', about: 'O nas', contact: 'Kontakt' },
    heroEyebrow: 'Naprawa telefonów, plany komórkowe, telefony i skup w Chicago',
    heroTitle: 'Napraw. Zmień plan. Sprzedaj. Ulepsz.',
    heroText: 'CellzTech pomaga z naprawą telefonów, aktywacją Ultra Mobile, sprzedażą używanych telefonów, akcesoriami oraz natychmiastową wyceną iPhone przez Apex Tech Exchange.',
    primaryCta: 'Zadzwoń do CellzTech',
    secondaryCta: 'Zobacz usługi',
    serviceIntro: 'Czego potrzebujesz dzisiaj?',
    languageLabel: 'Język',
    phoneLabel: 'Zadzwoń'
  },
  uk: {
    nav: { home: 'Головна', repairs: 'Ремонт', ultra: 'Ultra Mobile', buyback: 'Викуп', phones: 'Телефони', accessories: 'Аксесуари', about: 'Про нас', contact: 'Контакти' },
    heroEyebrow: 'Ремонт телефонів, мобільні плани, телефони та викуп у Чикаго',
    heroTitle: 'Ремонт. Перехід. Продаж. Оновлення.',
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
    heroTitle: 'Opravit. Přepnout. Prodat. Vylepšit.',
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
    heroTitle: 'Починить. Перейти. Продать. Обновить.',
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
  { key: 'repairs' as PageKey, title: 'Repairs', text: 'iPhone, Samsung, iPad, Motorola, Google Pixel, screens, batteries, charging ports, cameras, back glass, and data recovery.', icon: Wrench, cta: 'Fix My Device' },
  { key: 'ultra' as PageKey, title: 'Ultra Mobile', text: 'Stop overpaying for wireless. Get local help switching, keeping your number, checking compatibility, and choosing a plan.', icon: Wifi, cta: 'Switch & Save' },
  { key: 'buyback' as PageKey, title: 'Buyback', text: 'Have an iPhone sitting in a drawer? Get an instant quote through Apex Tech Exchange.', icon: CircleDollarSign, cta: 'Get Instant Quote' },
  { key: 'phones' as PageKey, title: 'Phones', text: 'Used and unlocked phones available in-store with local support and practical warranty information.', icon: Smartphone, cta: 'View Phones' },
  { key: 'accessories' as PageKey, title: 'Accessories', text: 'Chargers, cables, cases, screen protectors, and everyday phone accessories available locally.', icon: ShoppingBag, cta: 'Shop Accessories' }
];

const repairItems = [
  { title: 'Screen repair', icon: Smartphone, text: 'iPhone, Samsung, Pixel, Motorola, and tablet screen replacement options.' },
  { title: 'Battery replacement', icon: BatteryCharging, text: 'Battery service for phones and tablets with clear local support.' },
  { title: 'Charging ports', icon: Plug, text: 'Troubleshooting and charging port repair when your device will not charge correctly.' },
  { title: 'Back glass', icon: ShieldCheck, text: 'Back glass repair options for supported devices.' },
  { title: 'Cameras', icon: Camera, text: 'Camera, lens, and camera-related repair help.' },
  { title: 'Data recovery', icon: BadgeCheck, text: 'Practical help when the device matters and the data matters more.' },
  { title: 'iPad and tablets', icon: TabletSmartphone, text: 'Tablet screen, battery, charging, and common repair service options.' },
  { title: 'Diagnostics', icon: Search, text: 'Clear inspection, practical advice, and honest next steps.' }
];

const trustItems = ['High-quality parts', 'Clear local service', 'Warranty-focused repairs', 'No corporate store headache'];

function pageFromLocation(): PageKey {
  const normalized = window.location.pathname.replace(/\/$/, '') || '/';
  return pathToPage[normalized] || 'home';
}

function App() {
  const [page, setPage] = useState<PageKey>(pageFromLocation());
  const [language, setLanguage] = useState<LanguageKey>('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const t = copy[language];

  const activeTitle = useMemo(() => t.nav[page], [page, t]);

  useEffect(() => {
    const onPopState = () => setPage(pageFromLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const goTo = (next: PageKey) => {
    setPage(next);
    setMenuOpen(false);
    const nextPath = routes[next];
    if (window.location.pathname !== nextPath) window.history.pushState({}, '', nextPath);
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

function CTLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="ct-logo-wrap" aria-label="CellzTech logo">
      <svg className="ct-logo-mark" viewBox="0 0 64 64" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="ctGradient" x1="8" y1="8" x2="58" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="0.55" stopColor="#06B6D4" />
            <stop offset="1" stopColor="#67E8F9" />
          </linearGradient>
          <filter id="ctShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#2563EB" floodOpacity="0.28" />
          </filter>
        </defs>
        <rect x="6" y="6" width="52" height="52" rx="18" fill="url(#ctGradient)" filter="url(#ctShadow)" />
        <path d="M25 20h-5.2A7.8 7.8 0 0 0 12 27.8v8.4A7.8 7.8 0 0 0 19.8 44H25" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />
        <path d="M31 20h19M40.5 20v24" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />
        <path d="M17 32h8" stroke="#CFFAFE" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
        <path d="M48 33l4-4M49 39l6-6" stroke="#CFFAFE" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
      </svg>
      {!compact && (
        <span className="ct-wordmark">
          <strong>CellzTech</strong>
          <small>Operated by Cellz Repairz LLC</small>
        </span>
      )}
    </span>
  );
}

function CTBot() {
  return (
    <div className="bot-card" aria-label="CT Bot mascot">
      <div className="bot-orbit orbit-one" />
      <div className="bot-orbit orbit-two" />
      <svg className="ct-bot" viewBox="0 0 360 360" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="botShell" x1="78" y1="54" x2="282" y2="304" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F8FAFC" />
            <stop offset="1" stopColor="#BFDBFE" />
          </linearGradient>
          <linearGradient id="botBlue" x1="95" y1="82" x2="278" y2="275" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="botDrop" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#020617" floodOpacity="0.32" />
          </filter>
        </defs>
        <path d="M180 36v27" stroke="#67E8F9" strokeWidth="9" strokeLinecap="round" />
        <circle cx="180" cy="28" r="12" fill="#67E8F9" />
        <rect x="86" y="68" width="188" height="194" rx="54" fill="url(#botShell)" filter="url(#botDrop)" />
        <rect x="111" y="95" width="138" height="80" rx="30" fill="#0B1220" />
        <circle cx="152" cy="135" r="11" fill="#67E8F9" />
        <circle cx="208" cy="135" r="11" fill="#67E8F9" />
        <path d="M156 159c13 12 35 12 48 0" stroke="#67E8F9" strokeWidth="7" strokeLinecap="round" fill="none" />
        <rect x="135" y="203" width="90" height="44" rx="18" fill="url(#botBlue)" />
        <path d="M158 226h-9a13 13 0 0 1 0-26h9" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M169 200h42M190 200v46" stroke="white" strokeWidth="7" strokeLinecap="round" />
        <path d="M86 150c-26 5-42 22-44 50" stroke="#60A5FA" strokeWidth="18" strokeLinecap="round" />
        <path d="M274 150c26 5 42 22 44 50" stroke="#60A5FA" strokeWidth="18" strokeLinecap="round" />
        <circle cx="42" cy="204" r="16" fill="#06B6D4" />
        <circle cx="318" cy="204" r="16" fill="#06B6D4" />
        <path d="M126 262l-17 42M234 262l17 42" stroke="#BFDBFE" strokeWidth="16" strokeLinecap="round" />
        <path d="M108 306h45M207 306h45" stroke="#2563EB" strokeWidth="16" strokeLinecap="round" />
      </svg>
      <div className="bot-caption">
        <span>Meet CT Bot</span>
        <strong>Your friendly repair and wireless helper.</strong>
      </div>
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
          <CTLogo />
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
            <span className="eyebrow"><Zap size={16} /> {t.heroEyebrow}</span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>
            <div className="hero-actions">
              <a className="button primary" href="tel:17734137489">{t.primaryCta} <ArrowRight size={18} /></a>
              <button className="button secondary" onClick={() => goTo('repairs')}>{t.secondaryCta}</button>
            </div>
            <div className="trust-row">
              {trustItems.map((item) => <span key={item}><CheckCircle2 size={15} /> {item}</span>)}
            </div>
          </div>
          <div className="hero-visual">
            <CTBot />
            <div className="quick-panel glass-card">
              <span className="status-pill">Open for repairs, wireless & buyback</span>
              <h2>{t.serviceIntro}</h2>
              <div className="quick-list">
                {serviceCards.map(({ key, title, icon: Icon }) => (
                  <button key={key} onClick={() => goTo(key)}>
                    <Icon size={20} />
                    <span>{title}</span>
                    <ChevronRight size={18} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mini-card one"><ShieldCheck size={20} /> Warranty-focused repair service</div>
            <div className="mini-card two"><BatteryCharging size={20} /> Screens, batteries & charging ports</div>
          </div>
        </div>
      </section>

      <section className="section service-hub">
        <div className="section-heading centered">
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

      <section className="section brand-strip-section">
        <div className="brand-system-panel">
          <div>
            <span className="section-kicker dark"><Sparkles size={16} /> New brand direction</span>
            <h2>CellzTech now has a real visual identity.</h2>
            <p>The CT Device Mark keeps the brand clean and serious. CT Bot adds friendly personality for repair tips, wireless help, and social media.</p>
          </div>
          <div className="brand-assets">
            <div className="asset-card"><CTLogo /><small>Main website mark</small></div>
            <div className="asset-card mascot-mini"><CTBot /></div>
          </div>
        </div>
      </section>

      <section className="section split-section bright">
        <div>
          <span className="section-kicker"><Search size={16} /> SEO-ready foundation</span>
          <h2>Built for Chicago searches, not just good looks.</h2>
          <p>This structure is ready to grow into dedicated SEO pages for iPhone repair, Samsung repair, iPad repair, Ultra Mobile, phone buyback, and unlocked phones in Chicago.</p>
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

function PageHero({ title, subtitle, kicker }: { title: string; subtitle: string; kicker: string }) {
  return (
    <section className="page-hero">
      <span>{kicker}</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  );
}

function RepairsPage({ activeTitle, goTo }: { activeTitle: string; goTo: (page: PageKey) => void }) {
  return (
    <>
      <PageHero title="Phone and tablet repair in Chicago." subtitle="Repair help for iPhone, Samsung, iPad, Motorola, Google Pixel, screens, batteries, charging ports, back glass, cameras, and data recovery." kicker={activeTitle} />
      <section className="section">
        <div className="repair-grid">
          {repairItems.map(({ title, text, icon: Icon }) => (
            <article className="repair-tile" key={title}>
              <Icon size={26} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section callout-panel">
        <div>
          <span className="section-kicker dark"><ShieldCheck size={16} /> Quality and warranty focused</span>
          <h2>We use high-quality parts and offer one of the best warranties on repairs.</h2>
          <p>Warranty details can vary by repair, part type, and ticket. Stop in or call and we will explain the best option for your device.</p>
        </div>
        <button className="button primary" onClick={() => goTo('contact')}>Contact the shop <ArrowRight size={18} /></button>
      </section>
    </>
  );
}

function UltraPage({ activeTitle }: { activeTitle: string }) {
  return (
    <>
      <PageHero title="Stop overpaying for wireless." subtitle="Ultra Mobile help from a local Chicago shop. We help you check compatibility, transfer your number, and choose the right plan." kicker={activeTitle} />
      <section className="section ultra-layout">
        <div className="newsletter-panel">
          <span className="section-kicker dark"><Wifi size={16} /> Ultra Mobile at CellzTech</span>
          <h2>Save money, keep your number, and get local help.</h2>
          <p>Plans currently promoted include 25GB from $29/month and 3 lines Unlimited from $85/month, or $80/month with AutoPay. Customers should confirm current plan details before activating.</p>
          <div className="feature-list">
            <span><CheckCircle2 /> $0 activation fee</span>
            <span><CheckCircle2 /> Free SIM card</span>
            <span><CheckCircle2 /> International calling to Poland and 90+ countries</span>
            <span><CheckCircle2 /> Works on the T-Mobile network</span>
          </div>
        </div>
        <div className="info-block stack">
          <h3>Switching checklist</h3>
          <p>Bring your account number, transfer PIN, and an unlocked compatible phone. We help check compatibility and handle the transfer in-store.</p>
          <h3>Monthly update ready</h3>
          <p>This page is designed so future Ultra Mobile newsletter updates can be added cleanly across English, Spanish, Polish, Ukrainian, Czech, and Russian.</p>
          <h3>Roaming add-ons</h3>
          <p>Go Roam World Pass can help customers traveling to Poland, Europe, and other supported countries. Mexico uses a separate roaming pass.</p>
        </div>
      </section>
    </>
  );
}

function BuybackPage({ activeTitle }: { activeTitle: string }) {
  return (
    <>
      <PageHero title="Sell your used iPhone with Apex Tech Exchange." subtitle="Get an instant quote for your iPhone through Apex Tech Exchange, connected with CellzTech." kicker={activeTitle} />
      <section className="section split-section bright">
        <div>
          <span className="section-kicker"><CircleDollarSign size={16} /> Apex buyback</span>
          <h2>Have an iPhone sitting in a drawer?</h2>
          <p>Check your instant quote online and then contact the shop for next steps. Apex Tech Exchange is built to make the buyback process easier and cleaner.</p>
          <a className="button primary" href="https://www.apextechexchange.com" target="_blank" rel="noreferrer">Get Instant Quote <ArrowRight size={18} /></a>
        </div>
        <div className="quote-device">
          <Smartphone size={64} />
          <strong>Instant iPhone quote</strong>
          <span>Powered by Apex Tech Exchange</span>
        </div>
      </section>
    </>
  );
}

function PhonesPage({ activeTitle }: { activeTitle: string }) {
  return (
    <>
      <PageHero title="Used and unlocked phones available in-store." subtitle="Shop local for iPhones and other devices with practical support after the sale." kicker={activeTitle} />
      <section className="section inventory-placeholder">
        <article>
          <Store size={34} />
          <h2>Inventory system coming next.</h2>
          <p>For V1, customers can call or stop in to check current phone availability. Later, this page can connect to a Google Sheet, POS export, or admin inventory system.</p>
          <a className="button primary" href="tel:17734137489">Call for availability <ArrowRight size={18} /></a>
        </article>
      </section>
    </>
  );
}

function AccessoriesPage({ activeTitle }: { activeTitle: string }) {
  return (
    <>
      <PageHero title="Cases, chargers, cables, and screen protectors." subtitle="Everyday phone accessories available locally at CellzTech in Chicago." kicker={activeTitle} />
      <section className="section card-grid four">
        {['Chargers', 'Cables', 'Cases', 'Screen protectors'].map((item) => (
          <article className="service-card compact" key={item}>
            <div className="icon-circle"><ShoppingBag size={24} /></div>
            <h3>{item}</h3>
            <p>Available in-store. Call or stop in to check current options.</p>
          </article>
        ))}
      </section>
    </>
  );
}

function AboutPage({ activeTitle }: { activeTitle: string }) {
  return (
    <>
      <PageHero title="Modern tech help from a local Chicago shop." subtitle="CellzTech is the customer-facing brand operated by Cellz Repairz LLC." kicker={activeTitle} />
      <section className="section about-grid">
        <article className="about-card featured">
          <CTLogo />
          <h2>Repair. Connect. Upgrade.</h2>
          <p>CellzTech brings phone repair, wireless plans, buyback, used phones, and accessories into one cleaner local brand.</p>
        </article>
        <article className="about-card"><h3>Local service</h3><p>Visit the shop at 3412 N Harlem Ave STE A in Chicago, IL 60634.</p></article>
        <article className="about-card"><h3>Practical advice</h3><p>We explain realistic repair, wireless, and phone options without making things more complicated than they need to be.</p></article>
        <article className="about-card"><h3>Future-ready</h3><p>The site is built to grow into SEO pages, inventory, booking, monthly Ultra Mobile updates, and more.</p></article>
      </section>
    </>
  );
}

function ContactPage({ activeTitle }: { activeTitle: string }) {
  return (
    <>
      <PageHero title="Visit CellzTech in Chicago." subtitle="Call, stop in, or use the site to find the service you need." kicker={activeTitle} />
      <section className="section contact-grid">
        <article className="contact-card">
          <MapPin size={30} />
          <h2>Address</h2>
          <p>3412 N Harlem Ave STE A<br />Chicago, IL 60634</p>
        </article>
        <article className="contact-card">
          <Phone size={30} />
          <h2>Phone</h2>
          <p><a href="tel:17734137489">773-413-7489</a></p>
        </article>
        <article className="contact-card">
          <MessageCircle size={30} />
          <h2>Websites</h2>
          <p>cellztech.com<br />apextechexchange.com<br />serwiskomorkowy.com</p>
        </article>
      </section>
    </>
  );
}

function Footer({ t, goTo }: { t: Copy; goTo: (page: PageKey) => void }) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <CTLogo />
          <p>Phone repair, Ultra Mobile, buyback, phones, and accessories in Chicago.</p>
          <strong>CellzTech is operated by Cellz Repairz LLC.</strong>
        </div>
        <div>
          <h3>Services</h3>
          {(['repairs', 'ultra', 'buyback', 'phones', 'accessories'] as PageKey[]).map((p) => <button key={p} onClick={() => goTo(p)}>{t.nav[p]}</button>)}
        </div>
        <div>
          <h3>Visit</h3>
          <p>3412 N Harlem Ave STE A<br />Chicago, IL 60634</p>
          <p><a href="tel:17734137489">773-413-7489</a></p>
        </div>
        <div>
          <h3>Websites</h3>
          <p>cellztech.com</p>
          <p>apextechexchange.com</p>
          <p>serwiskomorkowy.com</p>
        </div>
      </div>
      <div className="footer-bottom">© 2026 CellzTech. Operated by Cellz Repairz LLC.</div>
    </footer>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
