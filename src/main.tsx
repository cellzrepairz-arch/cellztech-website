import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  ChevronRight,
  Globe2,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  TabletSmartphone,
  Wifi,
  Wrench,
  X,
  Camera,
  Plug,
  Store,
  Languages,
  Star,
  Search,
  MessageCircle,
  DollarSign
} from 'lucide-react';
import './styles.css';

type PageKey = 'home' | 'repairs' | 'ultra' | 'buyback' | 'phones' | 'accessories' | 'about' | 'contact';
type LanguageKey = 'en' | 'es' | 'pl' | 'uk' | 'cs' | 'ru';

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

const pathToPage = Object.entries(routes).reduce((acc, [key, value]) => {
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

const navLabels: Record<LanguageKey, Record<PageKey, string>> = {
  en: { home: 'Home', repairs: 'Repairs', ultra: 'Ultra Mobile', buyback: 'Buyback', phones: 'Phones', accessories: 'Accessories', about: 'About', contact: 'Contact' },
  es: { home: 'Inicio', repairs: 'Reparaciones', ultra: 'Ultra Mobile', buyback: 'Compra', phones: 'Teléfonos', accessories: 'Accesorios', about: 'Nosotros', contact: 'Contacto' },
  pl: { home: 'Start', repairs: 'Naprawy', ultra: 'Ultra Mobile', buyback: 'Skup', phones: 'Telefony', accessories: 'Akcesoria', about: 'O nas', contact: 'Kontakt' },
  uk: { home: 'Головна', repairs: 'Ремонт', ultra: 'Ultra Mobile', buyback: 'Викуп', phones: 'Телефони', accessories: 'Аксесуари', about: 'Про нас', contact: 'Контакти' },
  cs: { home: 'Domů', repairs: 'Opravy', ultra: 'Ultra Mobile', buyback: 'Výkup', phones: 'Telefony', accessories: 'Příslušenství', about: 'O nás', contact: 'Kontakt' },
  ru: { home: 'Главная', repairs: 'Ремонт', ultra: 'Ultra Mobile', buyback: 'Выкуп', phones: 'Телефоны', accessories: 'Аксессуары', about: 'О нас', contact: 'Контакты' }
};

const serviceCards = [
  {
    key: 'repairs' as PageKey,
    icon: Wrench,
    title: 'Repairs',
    text: 'iPhone, Samsung, iPad, Motorola, Google Pixel, screens, batteries, charging ports, cameras, back glass, and data recovery.',
    cta: 'Repair my device'
  },
  {
    key: 'ultra' as PageKey,
    icon: Wifi,
    title: 'Ultra Mobile',
    text: 'Stop overpaying for wireless. Get local help switching, keeping your number, checking compatibility, and choosing a plan.',
    cta: 'Switch and save'
  },
  {
    key: 'buyback' as PageKey,
    icon: DollarSign,
    title: 'Buyback',
    text: 'Have an iPhone sitting in a drawer? Get an instant quote through Apex Tech Exchange and turn it into cash.',
    cta: 'Get instant quote'
  },
  {
    key: 'phones' as PageKey,
    icon: Smartphone,
    title: 'Phones',
    text: 'Used and unlocked phones available in-store with local support, setup help, and practical warranty information.',
    cta: 'View phones'
  },
  {
    key: 'accessories' as PageKey,
    icon: ShoppingBag,
    title: 'Accessories',
    text: 'Chargers, cables, cases, screen protectors, and everyday phone accessories available locally.',
    cta: 'Shop accessories'
  }
];

const trustItems = [
  { icon: ShieldCheck, title: 'Quality-focused repairs', text: 'We use high-quality parts and offer one of the best warranties on repairs, without overpromising what a repair can do.' },
  { icon: MessageCircle, title: 'Clear local advice', text: 'Straight answers, simple explanations, and practical help from a local shop that works with phones every day.' },
  { icon: Store, title: 'More than repairs', text: 'Repairs, Ultra Mobile, phone sales, accessories, and buyback in one place.' }
];

const pageData: Record<PageKey, { eyebrow: string; title: string; text: string; bullets: string[]; cta?: string; external?: string }> = {
  home: {
    eyebrow: 'Chicago local tech shop',
    title: 'Phone repair, wireless plans, phones, accessories, and buyback in Chicago.',
    text: 'CellzTech brings repair help, Ultra Mobile activations, used phones, accessories, and Apex Tech Exchange buyback into one simple local experience.',
    bullets: ['iPhone, Samsung, iPad, Motorola, and Google Pixel repair', 'Ultra Mobile activations and number transfer help', 'Used phones, accessories, and instant iPhone buyback quotes']
  },
  repairs: {
    eyebrow: 'Repair services',
    title: 'Repairs handled with clear advice and quality-focused work.',
    text: 'Bring your device in for practical repair help. We service common phone and tablet issues including screens, batteries, charging ports, back glass, cameras, and more.',
    bullets: ['iPhone, Samsung, iPad, Motorola, Google Pixel, and tablets', 'Screens, batteries, charging ports, back glass, cameras, and data recovery', 'High-quality parts and warranty-focused service'],
    cta: 'Call about a repair'
  },
  ultra: {
    eyebrow: 'Ultra Mobile at CellzTech',
    title: 'Stop overpaying for wireless and get local help switching.',
    text: 'We help customers understand Ultra Mobile plans, check phone compatibility, transfer numbers, and activate service in-store.',
    bullets: ['Plans from $29/month', '3 lines Unlimited for $85/month or $80/month with AutoPay', 'International calling to Poland and 90+ countries', 'Works on the T-Mobile network', '$0 activation fee and free SIM card', 'Bring your account number, transfer PIN, and an unlocked compatible phone'],
    cta: 'Ask about Ultra Mobile'
  },
  buyback: {
    eyebrow: 'Apex Tech Exchange',
    title: 'Sell your iPhone with an instant buyback quote.',
    text: 'Apex Tech Exchange is our buyback system for quick iPhone estimates. Start online, then contact or visit the store to complete the process.',
    bullets: ['Instant iPhone quote', 'Simple local process', 'Powered by Apex Tech Exchange'],
    cta: 'Get instant quote',
    external: 'https://www.apextechexchange.com'
  },
  phones: {
    eyebrow: 'Phones for sale',
    title: 'Used and unlocked phones available in-store.',
    text: 'Shop local for used phones with help setting up your device, transferring information, and choosing the right wireless plan.',
    bullets: ['Used iPhones and other devices as available', 'Unlocked phone options', 'Local setup help and practical warranty information'],
    cta: 'Call about phones'
  },
  accessories: {
    eyebrow: 'Accessories',
    title: 'Everyday phone accessories without the guesswork.',
    text: 'Find chargers, cables, cases, screen protectors, and other practical accessories in-store.',
    bullets: ['Chargers and cables', 'Cases and screen protectors', 'Local help choosing the right fit'],
    cta: 'Call about accessories'
  },
  about: {
    eyebrow: 'About CellzTech',
    title: 'A modern brand operated by Cellz Repairz LLC.',
    text: 'CellzTech is the modern service hub for Cellz Repairz. The goal is simple: make phone repair, wireless service, phone sales, accessories, and buyback easier for local customers.',
    bullets: ['Local Chicago shop', 'Operated by Cellz Repairz LLC', 'Built around practical help, not corporate store headaches'],
    cta: 'Contact us'
  },
  contact: {
    eyebrow: 'Visit or call',
    title: 'Stop in or call CellzTech for local tech help.',
    text: 'We are located at 3412 N Harlem Ave STE A, Chicago, IL 60634. Call us for repairs, Ultra Mobile, buyback, phones, and accessories.',
    bullets: ['3412 N Harlem Ave STE A, Chicago, IL 60634', '773-413-7489', 'CellzTech is operated by Cellz Repairz LLC'],
    cta: 'Call CellzTech'
  }
};

function goTo(page: PageKey) {
  const path = routes[page];
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function Logo() {
  return (
    <button className="logoWordmark" onClick={() => goTo('home')} aria-label="CellzTech home">
      <span className="logoText">Cellz<span>Tech</span></span>
      <small>Operated by Cellz Repairz LLC</small>
    </button>
  );
}

function Header({ page, setPage, lang, setLang }: { page: PageKey; setPage: (p: PageKey) => void; lang: LanguageKey; setLang: (l: LanguageKey) => void }) {
  const [open, setOpen] = useState(false);
  const labels = navLabels[lang];
  const nav: PageKey[] = ['home', 'repairs', 'ultra', 'buyback', 'phones', 'accessories', 'about', 'contact'];

  const navigate = (p: PageKey) => {
    setPage(p);
    goTo(p);
    setOpen(false);
  };

  return (
    <>
      <div className="topbar">
        <div className="wrap topbarInner">
          <span><MapPin size={14} /> 3412 N Harlem Ave STE A, Chicago IL 60634</span>
          <a href="tel:7734137489"><Phone size={14} /> 773-413-7489</a>
        </div>
      </div>
      <header className="header">
        <div className="wrap headerInner">
          <Logo />
          <nav className="desktopNav">
            {nav.map((item) => (
              <button key={item} className={page === item ? 'active' : ''} onClick={() => navigate(item)}>{labels[item]}</button>
            ))}
          </nav>
          <div className="headerActions">
            <div className="languageSelect">
              <Languages size={17} />
              <select value={lang} onChange={(e) => setLang(e.target.value as LanguageKey)} aria-label="Language">
                {languages.map((language) => <option key={language.key} value={language.key}>{language.label}</option>)}
              </select>
            </div>
            <a className="callButton" href="tel:7734137489">Call</a>
            <button className="menuButton" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        {open && (
          <div className="mobileNav wrap">
            {nav.map((item) => <button key={item} onClick={() => navigate(item)}>{labels[item]}</button>)}
          </div>
        )}
      </header>
    </>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="wrap heroGrid">
        <div className="heroCopy">
          <div className="eyebrow"><Star size={15} /> Chicago local tech shop</div>
          <h1>Phone repair, wireless plans, phones, accessories, and buyback in Chicago.</h1>
          <p>CellzTech is a modern local hub for repairs, Ultra Mobile activations, used phones, accessories, and instant iPhone buyback quotes through Apex Tech Exchange.</p>
          <div className="heroCtas">
            <a className="primaryBtn" href="tel:7734137489">Call CellzTech <ArrowRight size={18} /></a>
            <button className="secondaryBtn" onClick={() => goTo('ultra')}>Switch to Ultra Mobile</button>
            <button className="secondaryBtn ghost" onClick={() => goTo('buyback')}>Sell your iPhone</button>
          </div>
          <div className="miniTrust">
            <span><CheckCircle2 size={16} /> High-quality parts</span>
            <span><CheckCircle2 size={16} /> Clear local service</span>
            <span><CheckCircle2 size={16} /> Warranty-focused repairs</span>
          </div>
        </div>
        <div className="servicePanel" aria-label="Service options">
          <div className="panelHeader">
            <span>Start here</span>
            <strong>What do you need today?</strong>
          </div>
          <div className="panelList">
            {serviceCards.map((service) => {
              const Icon = service.icon;
              return (
                <button key={service.key} onClick={() => goTo(service.key)}>
                  <span className="panelIcon"><Icon size={19} /></span>
                  <span>{service.title}</span>
                  <ChevronRight size={18} />
                </button>
              );
            })}
          </div>
          <div className="panelNote">
            <Search size={16} /> Fast help for common phone problems, upgrades, and wireless questions.
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceGrid() {
  return (
    <section className="section light">
      <div className="wrap">
        <div className="sectionIntro">
          <span>Choose a service</span>
          <h2>Everything customers ask for most, organized in one place.</h2>
          <p>Repairs, wireless savings, buyback, phones, and accessories are separated clearly so customers can get to the right page fast.</p>
        </div>
        <div className="cardsGrid">
          {serviceCards.map((card) => {
            const Icon = card.icon;
            return (
              <article className="serviceCard" key={card.key}>
                <div className="cardIcon"><Icon size={24} /></div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <button onClick={() => goTo(card.key)}>{card.cta} <ArrowRight size={16} /></button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="section">
      <div className="wrap split">
        <div>
          <span className="label">Why customers choose CellzTech</span>
          <h2>Built for practical local service, not corporate store confusion.</h2>
          <p className="lead">The website should feel like the shop: clear, helpful, professional, and focused on getting the customer to the right solution.</p>
          <div className="inlineActions">
            <a className="primaryBtn compact" href="tel:7734137489">Call 773-413-7489</a>
            <button className="secondaryBtn compact" onClick={() => goTo('contact')}>Visit the store</button>
          </div>
        </div>
        <div className="trustStack">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div className="trustItem" key={item.title}>
                <Icon size={22} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PageDetail({ page }: { page: PageKey }) {
  const data = pageData[page];
  const isHome = page === 'home';

  if (isHome) {
    return (
      <>
        <Hero />
        <ServiceGrid />
        <TrustSection />
        <section className="section ctaBand">
          <div className="wrap ctaPanel">
            <div>
              <span className="label">Ready when you are</span>
              <h2>Call or stop in for repair help, Ultra Mobile, buyback, phones, and accessories.</h2>
            </div>
            <a className="primaryBtn" href="tel:7734137489">Call CellzTech <ArrowRight size={18} /></a>
          </div>
        </section>
      </>
    );
  }

  return (
    <main className="pageMain">
      <section className="pageHero">
        <div className="wrap pageGrid">
          <div>
            <div className="eyebrow"><Star size={15} /> {data.eyebrow}</div>
            <h1>{data.title}</h1>
            <p>{data.text}</p>
            <div className="pageActions">
              {data.external ? (
                <a className="primaryBtn" href={data.external} target="_blank" rel="noreferrer">{data.cta} <ArrowRight size={18} /></a>
              ) : (
                <a className="primaryBtn" href="tel:7734137489">{data.cta || 'Call CellzTech'} <ArrowRight size={18} /></a>
              )}
              <button className="secondaryBtn" onClick={() => goTo('contact')}>Visit us</button>
            </div>
          </div>
          <div className="detailCard">
            <h2>Quick details</h2>
            <ul>
              {data.bullets.map((bullet) => <li key={bullet}><CheckCircle2 size={18} /> {bullet}</li>)}
            </ul>
          </div>
        </div>
      </section>
      {page === 'repairs' && <RepairDetails />}
      {page === 'ultra' && <UltraDetails />}
      {page === 'contact' && <ContactDetails />}
    </main>
  );
}

function RepairDetails() {
  const items = [
    { icon: Smartphone, title: 'Screens', text: 'Cracked glass, touch problems, display issues, and common screen repairs.' },
    { icon: BatteryCharging, title: 'Batteries', text: 'Battery replacement when your phone drains too fast, shuts off, or struggles to hold a charge.' },
    { icon: Plug, title: 'Charging ports', text: 'Charging issues, loose connections, and phones that only charge at an angle.' },
    { icon: Camera, title: 'Cameras and back glass', text: 'Camera issues, cracked back glass, and related device repairs.' },
    { icon: TabletSmartphone, title: 'Phones and tablets', text: 'iPhone, Samsung, iPad, Motorola, Google Pixel, and tablet service.' },
    { icon: ShieldCheck, title: 'Warranty-focused service', text: 'High-quality parts and clear warranty information based on the specific repair.' }
  ];

  return <FeatureGrid items={items} />;
}

function UltraDetails() {
  const items = [
    { icon: Wifi, title: 'Plans from $29/month', text: 'A strong option for customers looking to lower their wireless bill.' },
    { icon: Globe2, title: 'International calling', text: 'Calling to Poland and 90+ countries is a major benefit for many local customers.' },
    { icon: CheckCircle2, title: 'Switching help', text: 'Bring your account number, transfer PIN, and unlocked compatible phone.' },
    { icon: ShieldCheck, title: '$0 activation', text: 'We currently offer $0 activation fee and free SIM card.' }
  ];

  return <FeatureGrid items={items} />;
}

function ContactDetails() {
  return (
    <section className="section light">
      <div className="wrap contactGrid">
        <div className="contactBox">
          <h2>Visit CellzTech</h2>
          <p>3412 N Harlem Ave STE A<br />Chicago, IL 60634</p>
          <a className="primaryBtn compact" href="https://maps.google.com/?q=3412+N+Harlem+Ave+STE+A+Chicago+IL+60634" target="_blank" rel="noreferrer">Get directions</a>
        </div>
        <div className="contactBox">
          <h2>Call the shop</h2>
          <p>Questions about a repair, Ultra Mobile, buyback, phones, or accessories?</p>
          <a className="primaryBtn compact" href="tel:7734137489">773-413-7489</a>
        </div>
      </div>
    </section>
  );
}

function FeatureGrid({ items }: { items: { icon: React.ElementType; title: string; text: string }[] }) {
  return (
    <section className="section light">
      <div className="wrap featureGrid">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div className="featureCard" key={item.title}>
              <Icon size={24} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footerGrid">
        <div>
          <div className="footerLogo">Cellz<span>Tech</span></div>
          <p>Phone repair, Ultra Mobile, buyback, phones, and accessories in Chicago.</p>
          <strong>CellzTech is operated by Cellz Repairz LLC.</strong>
        </div>
        <div>
          <h3>Services</h3>
          {(['repairs', 'ultra', 'buyback', 'phones', 'accessories'] as PageKey[]).map((item) => <button key={item} onClick={() => goTo(item)}>{pageData[item].eyebrow}</button>)}
        </div>
        <div>
          <h3>Visit</h3>
          <p>3412 N Harlem Ave STE A<br />Chicago, IL 60634</p>
          <a href="tel:7734137489">773-413-7489</a>
        </div>
        <div>
          <h3>Websites</h3>
          <a href="https://www.cellztech.com">cellztech.com</a>
          <a href="https://www.apextechexchange.com">apextechexchange.com</a>
          <a href="https://www.serwiskomorkowy.com">serwiskomorkowy.com</a>
        </div>
      </div>
      <div className="wrap footerBottom">© 2026 CellzTech. Operated by Cellz Repairz LLC.</div>
    </footer>
  );
}

function App() {
  const [page, setPage] = useState<PageKey>(() => pathToPage[window.location.pathname] || 'home');
  const [lang, setLang] = useState<LanguageKey>('en');

  React.useEffect(() => {
    const handler = () => setPage(pathToPage[window.location.pathname] || 'home');
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  useMemo(() => {
    document.title = page === 'home' ? 'CellzTech | Phone Repair, Ultra Mobile, Buyback & Phones in Chicago' : `${pageData[page].eyebrow} | CellzTech Chicago`;
  }, [page]);

  return (
    <>
      <Header page={page} setPage={setPage} lang={lang} setLang={setLang} />
      <PageDetail page={page} />
      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
