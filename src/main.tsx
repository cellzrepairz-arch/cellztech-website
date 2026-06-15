import React, { useEffect, useMemo, useState } from 'react';
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
  DollarSign,
  Mic
} from 'lucide-react';
import './styles.css';
import { deviceCatalog, getBrandTotalModels } from './deviceCatalog';

type PageKey = 'home' | 'repairs' | 'ultra' | 'xfinity' | 'buyback' | 'phones' | 'accessories' | 'about' | 'contact' | 'book' | 'sim' | 'admin';
type LanguageKey = 'en' | 'es' | 'pl' | 'uk';

const routes: Record<PageKey, string> = {
  home: '/',
  repairs: '/repairs',
  ultra: '/ultra-mobile',
  xfinity: '/xfinity-prepaid',
  buyback: '/buyback',
  phones: '/phones',
  accessories: '/accessories',
  about: '/about',
  contact: '/contact',
  book: '/book-repair',
  sim: '/ultra-sim',
  admin: '/admin'
};

const pathToPage = Object.entries(routes).reduce((acc, [key, value]) => {
  acc[value] = key as PageKey;
  return acc;
}, {} as Record<string, PageKey>);

const languages: { key: LanguageKey; label: string; name: string }[] = [
  { key: 'en', label: 'EN', name: 'English' },
  { key: 'pl', label: 'PL', name: 'Polski' },
  { key: 'es', label: 'ES', name: 'Español' },
  { key: 'uk', label: 'UK', name: 'Українська' }
];

const navLabels: Record<LanguageKey, Record<PageKey, string>> = {
  en: { home: 'Home', repairs: 'Repairs', ultra: 'Ultra Mobile', xfinity: 'Xfinity', buyback: 'Buyback', phones: 'Phones', accessories: 'Accessories', about: 'About', contact: 'Contact', book: 'Book Repair', sim: 'SIM Request', admin: 'Admin' },
  pl: { home: 'Start', repairs: 'Naprawy', ultra: 'Ultra Mobile', xfinity: 'Xfinity', buyback: 'Skup', phones: 'Telefony', accessories: 'Akcesoria', about: 'O nas', contact: 'Kontakt', book: 'Zgłoś naprawę', sim: 'Zamów SIM', admin: 'Admin' },
  es: { home: 'Inicio', repairs: 'Reparaciones', ultra: 'Ultra Mobile', xfinity: 'Xfinity', buyback: 'Compra', phones: 'Teléfonos', accessories: 'Accesorios', about: 'Nosotros', contact: 'Contacto', book: 'Solicitar reparación', sim: 'Pedir SIM', admin: 'Admin' },
  uk: { home: 'Головна', repairs: 'Ремонт', ultra: 'Ultra Mobile', xfinity: 'Xfinity', buyback: 'Викуп', phones: 'Телефони', accessories: 'Аксесуари', about: 'Про нас', contact: 'Контакти', book: 'Заявка на ремонт', sim: 'Запит SIM', admin: 'Admin' }
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
    key: 'xfinity' as PageKey,
    icon: Wifi,
    title: 'Xfinity Prepaid Internet',
    text: 'NOW Internet by Xfinity with 200 Mbps service, unlimited data, and a free gateway available in-store at CellzTech.',
    cta: 'View internet plan'
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
  { icon: Store, title: 'More than repairs', text: 'Repairs, Ultra Mobile, Xfinity Prepaid Internet, phone sales, accessories, and buyback in one place.' }
];


const featuredReviews = [
  {
    name: 'Halina Szczygiel',
    rating: 5,
    text: 'Tom is the best he is really helpful! My phone is working great now!'
  },
  {
    name: 'Andrzej Chmiel',
    rating: 5,
    text: 'Thank you very much my phone is working like new!'
  },
  {
    name: 'Jacek Smagacz',
    rating: 5,
    text: 'Very happy with the service. Thank you.'
  }
];

const pageData: Record<PageKey, { eyebrow: string; title: string; text: string; bullets: string[]; cta?: string; external?: string }> = {
  home: {
    eyebrow: 'Chicago local tech shop',
    title: 'Phone repair, wireless plans, phones, accessories, and buyback in Chicago.',
    text: 'CellzTech brings repair help, Ultra Mobile activations, Xfinity Prepaid Internet, used phones, accessories, and Apex Tech Exchange buyback into one simple local experience.',
    bullets: ['iPhone, Samsung, iPad, Motorola, and Google Pixel repair', 'Ultra Mobile activations, Xfinity Prepaid Internet, and number transfer help', 'Used phones, accessories, and instant iPhone buyback quotes']
  },
  repairs: {
    eyebrow: 'Phone repair in Chicago',
    title: 'Phone repair in Chicago, done right.',
    text: 'Get local help for cracked screens, weak batteries, charging issues, back glass, cameras, tablets, and more. At CellzTech, we explain your options clearly before starting the repair and use high-quality parts whenever available.',
    bullets: ['iPhone, Samsung, iPad, Motorola, Google Pixel, and tablets', 'Screens, batteries, charging ports, back glass, cameras, and diagnostics', 'Clear repair advice before work begins', 'High-quality parts and warranty-focused service'],
    cta: 'Call for repair'
  },
  ultra: {
    eyebrow: 'Ultra Mobile at CellzTech',
    title: 'Stop overpaying for wireless and get local help switching.',
    text: 'We help customers understand Ultra Mobile plans, check phone compatibility, transfer numbers, and activate service in-store.',
    bullets: ['Plans from $29/month', '3 lines Unlimited for $85/month or $80/month with AutoPay', 'International calling to Poland and 90+ countries', 'Works on the T-Mobile network', '$0 activation fee and free SIM card', 'Bring your account number, transfer PIN, and an unlocked compatible phone'],
    cta: 'Ask about Ultra Mobile'
  },
  xfinity: {
    eyebrow: 'Xfinity Prepaid Internet at CellzTech',
    title: 'Fast prepaid home internet with a free gateway available in-store.',
    text: 'Get the NOW Internet by Xfinity 200 Mbps plan at CellzTech. We help with the starter kit, activation basics, and local setup questions.',
    bullets: ['$45/month 200 Mbps prepaid internet', 'Unlimited data included', 'Free gateway with first 30-day purchase, limit one per household', 'No annual contract and no credit check', 'Available in-store now; online modem ordering can be added later'],
    cta: 'Ask about Xfinity Prepaid'
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
  },
  book: {
    eyebrow: 'Book repair',
    title: 'Start a repair request with CellzTech.',
    text: 'Choose your Apple device, model, repair issue, and contact details. This first version opens a ready-to-send text message to the shop while we prepare the full backend later.',
    bullets: ['Apple repairs first', 'Samsung, Motorola, and Google Pixel can be added next', 'No payment is collected online'],
    cta: 'Start repair request'
  },
  sim: {
    eyebrow: 'Ultra Mobile SIM request',
    title: 'Request an Ultra Mobile SIM card for pickup or shipping.',
    text: 'Start a SIM request for store pickup, U.S. shipping, or eSIM help. We will confirm availability, activation details, shipping, and payment before anything is finalized.',
    bullets: ['Physical SIM shipping request', 'Store pickup at CellzTech', 'eSIM help for compatible phones'],
    cta: 'Start SIM request'
  },
  admin: {
    eyebrow: 'Admin',
    title: 'CellzTech repair request dashboard.',
    text: 'Private staff view for website repair requests, RepairDesk leads, and backend status.',
    bullets: ['Staff-only access', 'RepairDesk lead tracking', 'Supabase backup visibility'],
    cta: 'Open admin'
  }
};


const localizedPageData: Record<LanguageKey, typeof pageData> = {
  en: pageData,
  pl: {
    home: { eyebrow: 'Lokalny serwis technologiczny w Chicago', title: 'Naprawa telefonów, plany komórkowe, telefony, akcesoria i skup w Chicago.', text: 'CellzTech łączy naprawy telefonów, aktywacje Ultra Mobile, sprzedaż używanych telefonów, akcesoria oraz wyceny skupu iPhone’ów przez Apex Tech Exchange w jednym, prostym miejscu.', bullets: ['Naprawa iPhone, Samsung, iPad, Motorola i Google Pixel', 'Aktywacje Ultra Mobile oraz pomoc przy przenoszeniu numeru', 'Telefony używane, akcesoria i szybkie wyceny skupu iPhone’ów'] },
    repairs: { eyebrow: 'Naprawa telefonów w Chicago', title: 'Naprawa telefonów w Chicago — zrobiona rzetelnie.', text: 'Pomagamy przy pękniętych ekranach, słabych bateriach, problemach z ładowaniem, tylnej szybce, aparatach, tabletach i wielu innych usterkach. W CellzTech jasno wyjaśniamy dostępne opcje przed rozpoczęciem naprawy.', bullets: ['iPhone, Samsung, iPad, Motorola, Google Pixel i tablety', 'Ekrany, baterie, porty ładowania, tylne szybki, aparaty i diagnostyka', 'Jasna informacja przed rozpoczęciem pracy', 'Dobrej jakości części i podejście nastawione na gwarancję'], cta: 'Zadzwoń w sprawie naprawy' },
    ultra: { eyebrow: 'Ultra Mobile w CellzTech', title: 'Przestań przepłacać za telefon i skorzystaj z lokalnej pomocy przy zmianie operatora.', text: 'Pomagamy porównać plany Ultra Mobile, sprawdzić kompatybilność telefonu, przenieść numer i aktywować usługę w sklepie.', bullets: ['Plany od 15 USD miesięcznie', '4 linie Ultra Unlimited za 100 USD miesięcznie', 'Połączenia międzynarodowe do Polski i ponad 90 krajów', 'Działa w sieci T-Mobile 5G', 'Darmowa karta SIM w CellzTech', 'Przynieś numer konta, transfer PIN i odblokowany kompatybilny telefon'], cta: 'Zapytaj o Ultra Mobile' },
    xfinity: { eyebrow: 'Xfinity Prepaid w CellzTech', title: 'Szybki internet domowy prepaid z darmowym modemem w sklepie.', text: 'Pomagamy klientom z planem NOW Internet by Xfinity 200 Mbps, zestawem startowym i podstawową aktywacją w sklepie.', bullets: ['$45 miesięcznie za 200 Mbps', 'Nielimitowany internet', 'Darmowy gateway/modem przy pierwszym zakupie 30 dni, limit jeden na gospodarstwo domowe', 'Bez rocznej umowy i bez sprawdzania kredytu', 'Dostępne w sklepie CellzTech'], cta: 'Zapytaj o Xfinity Prepaid' },
    buyback: { eyebrow: 'Apex Tech Exchange', title: 'Sprzedaj iPhone’a i otrzymaj szybką wycenę skupu.', text: 'Apex Tech Exchange to nasz system wyceny skupu iPhone’ów. Zacznij online, a następnie skontaktuj się z nami lub odwiedź sklep, aby dokończyć proces.', bullets: ['Natychmiastowa wycena iPhone’a', 'Prosty lokalny proces', 'Obsługiwane przez Apex Tech Exchange'], cta: 'Sprawdź wycenę', external: 'https://www.apextechexchange.com' },
    phones: { eyebrow: 'Telefony na sprzedaż', title: 'Telefony używane i odblokowane dostępne w sklepie.', text: 'Kup lokalnie telefon używany z pomocą przy konfiguracji, przenoszeniu danych i wyborze odpowiedniego planu komórkowego.', bullets: ['Używane iPhone’y i inne telefony zależnie od dostępności', 'Odblokowane modele', 'Lokalna pomoc przy konfiguracji i jasne informacje o gwarancji'], cta: 'Zadzwoń w sprawie telefonów' },
    accessories: { eyebrow: 'Akcesoria', title: 'Codzienne akcesoria do telefonu bez zgadywania.', text: 'W sklepie znajdziesz ładowarki, kable, etui, szkła ochronne i inne praktyczne akcesoria.', bullets: ['Ładowarki i kable', 'Etui i szkła ochronne', 'Lokalna pomoc w dobraniu odpowiedniego produktu'], cta: 'Zadzwoń w sprawie akcesoriów' },
    about: { eyebrow: 'O CellzTech', title: 'Nowoczesna marka prowadzona przez Cellz Repairz LLC.', text: 'CellzTech to nowoczesne centrum usług Cellz Repairz. Cel jest prosty: ułatwić klientom naprawę telefonu, usługę komórkową, zakup telefonu, akcesoria i skup.', bullets: ['Lokalny sklep w Chicago', 'Prowadzone przez Cellz Repairz LLC', 'Praktyczna pomoc zamiast korporacyjnego zamieszania'], cta: 'Skontaktuj się z nami' },
    contact: { eyebrow: 'Odwiedź nas lub zadzwoń', title: 'Wpadnij albo zadzwoń do CellzTech po lokalną pomoc technologiczną.', text: 'Znajdujemy się pod adresem 3412 N Harlem Ave STE A, Chicago, IL 60634. Zadzwoń w sprawie napraw, Ultra Mobile, skupu, telefonów i akcesoriów.', bullets: ['3412 N Harlem Ave STE A, Chicago, IL 60634', '773-413-7489', 'CellzTech jest prowadzone przez Cellz Repairz LLC'], cta: 'Zadzwoń do CellzTech' },
    book: { eyebrow: 'Zgłoszenie naprawy', title: 'Wyślij zgłoszenie naprawy do CellzTech.', text: 'Wybierz markę, model, usterkę oraz preferowane okno czasowe. Skontaktujemy się z Tobą, aby potwierdzić szczegóły, cenę i dostępność części.', bullets: ['Najpierw naprawy Apple', 'Samsung, Motorola i Google Pixel obsługiwane w kolejnym etapie', 'Płatność online nie jest pobierana'], cta: 'Rozpocznij zgłoszenie' },
    sim: { eyebrow: 'Prośba o kartę SIM Ultra Mobile', title: 'Zamów kartę SIM Ultra Mobile do odbioru lub wysyłki.', text: 'Rozpocznij prośbę o kartę SIM do odbioru w sklepie, wysyłki na terenie USA albo pomocy z eSIM. Potwierdzimy dostępność, aktywację, wysyłkę i płatność przed finalizacją.', bullets: ['Prośba o wysyłkę fizycznej karty SIM', 'Odbiór w CellzTech', 'Pomoc z eSIM dla zgodnych telefonów'], cta: 'Rozpocznij prośbę o SIM' },
    admin: pageData.admin
  },
  es: {
    home: { eyebrow: 'Tienda local de tecnología en Chicago', title: 'Reparación de teléfonos, planes móviles, teléfonos, accesorios y recompra en Chicago.', text: 'CellzTech reúne reparación de dispositivos, activaciones de Ultra Mobile, teléfonos usados, accesorios y cotizaciones instantáneas de iPhone mediante Apex Tech Exchange en una experiencia local y sencilla.', bullets: ['Reparación de iPhone, Samsung, iPad, Motorola y Google Pixel', 'Activaciones de Ultra Mobile y ayuda para transferir tu número', 'Teléfonos usados, accesorios y cotizaciones instantáneas para iPhone'] },
    repairs: { eyebrow: 'Reparación de teléfonos en Chicago', title: 'Reparación de teléfonos en Chicago, hecha correctamente.', text: 'Te ayudamos con pantallas rotas, baterías débiles, problemas de carga, cristal trasero, cámaras, tabletas y más. En CellzTech explicamos tus opciones con claridad antes de empezar.', bullets: ['iPhone, Samsung, iPad, Motorola, Google Pixel y tabletas', 'Pantallas, baterías, puertos de carga, cristal trasero, cámaras y diagnóstico', 'Consejo claro antes de comenzar la reparación', 'Piezas de calidad y servicio enfocado en garantía'], cta: 'Llamar por reparación' },
    ultra: { eyebrow: 'Ultra Mobile en CellzTech', title: 'Deja de pagar de más por tu servicio móvil y recibe ayuda local para cambiarte.', text: 'Ayudamos a comparar planes de Ultra Mobile, revisar compatibilidad, transferir tu número y activar el servicio en la tienda.', bullets: ['Planes desde $15 al mes', '4 líneas Ultra Unlimited por $100 al mes', 'Llamadas internacionales a más de 90 destinos', 'Funciona en la red 5G de T-Mobile', 'Tarjeta SIM gratis en CellzTech', 'Trae tu número de cuenta, PIN de transferencia y un teléfono desbloqueado compatible'], cta: 'Preguntar por Ultra Mobile' },
    xfinity: { eyebrow: 'Xfinity Prepaid en CellzTech', title: 'Internet residencial prepago rápido con módem gratis en tienda.', text: 'Ayudamos con el plan NOW Internet by Xfinity de 200 Mbps, el kit inicial y preguntas básicas de activación en tienda.', bullets: ['$45 al mes por 200 Mbps', 'Internet ilimitado incluido', 'Gateway/módem gratis con la primera compra de 30 días, límite uno por hogar', 'Sin contrato anual y sin revisión de crédito', 'Disponible en CellzTech'], cta: 'Preguntar por Xfinity Prepaid' },
    buyback: { eyebrow: 'Apex Tech Exchange', title: 'Vende tu iPhone con una cotización instantánea.', text: 'Apex Tech Exchange es nuestro sistema de recompra para estimaciones rápidas de iPhone. Empieza en línea y luego contáctanos o visita la tienda para completar el proceso.', bullets: ['Cotización instantánea para iPhone', 'Proceso local sencillo', 'Impulsado por Apex Tech Exchange'], cta: 'Obtener cotización', external: 'https://www.apextechexchange.com' },
    phones: { eyebrow: 'Teléfonos en venta', title: 'Teléfonos usados y desbloqueados disponibles en tienda.', text: 'Compra localmente con ayuda para configurar tu dispositivo, transferir información y elegir el plan móvil adecuado.', bullets: ['iPhones usados y otros dispositivos según disponibilidad', 'Opciones de teléfonos desbloqueados', 'Ayuda local de configuración e información clara de garantía'], cta: 'Llamar por teléfonos' },
    accessories: { eyebrow: 'Accesorios', title: 'Accesorios diarios para tu teléfono sin complicaciones.', text: 'Encuentra cargadores, cables, fundas, protectores de pantalla y otros accesorios prácticos en tienda.', bullets: ['Cargadores y cables', 'Fundas y protectores de pantalla', 'Ayuda local para elegir el producto correcto'], cta: 'Llamar por accesorios' },
    about: { eyebrow: 'Acerca de CellzTech', title: 'Una marca moderna operada por Cellz Repairz LLC.', text: 'CellzTech es el centro moderno de servicios de Cellz Repairz. El objetivo es simple: hacer más fácil la reparación, el servicio móvil, la compra de teléfonos, los accesorios y la recompra.', bullets: ['Tienda local en Chicago', 'Operada por Cellz Repairz LLC', 'Ayuda práctica sin confusión corporativa'], cta: 'Contáctanos' },
    contact: { eyebrow: 'Visítanos o llama', title: 'Pasa por la tienda o llama a CellzTech para ayuda local.', text: 'Estamos en 3412 N Harlem Ave STE A, Chicago, IL 60634. Llámanos para reparaciones, Ultra Mobile, recompra, teléfonos y accesorios.', bullets: ['3412 N Harlem Ave STE A, Chicago, IL 60634', '773-413-7489', 'CellzTech es operado por Cellz Repairz LLC'], cta: 'Llamar a CellzTech' },
    book: { eyebrow: 'Solicitud de reparación', title: 'Envía una solicitud de reparación a CellzTech.', text: 'Elige la marca, el modelo, el problema y una ventana preferida para dejar el equipo. Te contactaremos para confirmar detalles, precio y disponibilidad de piezas.', bullets: ['Primero reparaciones Apple', 'Samsung, Motorola y Google Pixel se pueden ampliar después', 'No se cobra ningún pago en línea'], cta: 'Iniciar solicitud' },
    sim: { eyebrow: 'Solicitud de SIM Ultra Mobile', title: 'Solicita una tarjeta SIM Ultra Mobile para recoger o enviar.', text: 'Inicia una solicitud para recoger en tienda, envío dentro de EE. UU. o ayuda con eSIM. Confirmaremos disponibilidad, activación, envío y pago antes de finalizar.', bullets: ['Solicitud de envío de SIM física', 'Recoger en CellzTech', 'Ayuda con eSIM en teléfonos compatibles'], cta: 'Iniciar solicitud de SIM' },
    admin: pageData.admin
  },
  uk: {
    home: { eyebrow: 'Місцева технічна майстерня в Чикаго', title: 'Ремонт телефонів, мобільні плани, телефони, аксесуари та викуп у Чикаго.', text: 'CellzTech поєднує ремонт пристроїв, активації Ultra Mobile, вживані телефони, аксесуари та миттєві оцінки iPhone через Apex Tech Exchange в одному зручному місцевому сервісі.', bullets: ['Ремонт iPhone, Samsung, iPad, Motorola та Google Pixel', 'Активації Ultra Mobile і допомога з перенесенням номера', 'Вживані телефони, аксесуари та швидка оцінка iPhone для викупу'] },
    repairs: { eyebrow: 'Ремонт телефонів у Чикаго', title: 'Ремонт телефонів у Чикаго — якісно та чесно.', text: 'Ми допомагаємо з розбитими екранами, слабкими батареями, проблемами заряджання, заднім склом, камерами, планшетами та іншими несправностями. У CellzTech ми зрозуміло пояснюємо варіанти до початку ремонту.', bullets: ['iPhone, Samsung, iPad, Motorola, Google Pixel і планшети', 'Екрани, батареї, порти заряджання, заднє скло, камери та діагностика', 'Чітка консультація перед початком роботи', 'Якісні деталі та сервіс із увагою до гарантії'], cta: 'Зателефонувати щодо ремонту' },
    ultra: { eyebrow: 'Ultra Mobile у CellzTech', title: 'Не переплачуйте за мобільний зв’язок — отримайте місцеву допомогу з переходом.', text: 'Ми допомагаємо порівняти плани Ultra Mobile, перевірити сумісність телефону, перенести номер і активувати послугу в магазині.', bullets: ['Плани від $15 на місяць', '4 лінії Ultra Unlimited за $100 на місяць', 'Міжнародні дзвінки до понад 90 напрямків', 'Працює в мережі T-Mobile 5G', 'Безкоштовна SIM-картка в CellzTech', 'Принесіть номер облікового запису, transfer PIN і розблокований сумісний телефон'], cta: 'Запитати про Ultra Mobile' },
    xfinity: { eyebrow: 'Xfinity Prepaid у CellzTech', title: 'Швидкий домашній prepaid-інтернет із безкоштовним модемом у магазині.', text: 'Допомагаємо з планом NOW Internet by Xfinity 200 Mbps, стартовим комплектом і базовими питаннями активації в магазині.', bullets: ['$45 на місяць за 200 Mbps', 'Безлімітний інтернет', 'Безкоштовний gateway/модем із першою 30-денною покупкою, один на домогосподарство', 'Без річного контракту і без кредитної перевірки', 'Доступно в CellzTech'], cta: 'Запитати про Xfinity Prepaid' },
    buyback: { eyebrow: 'Apex Tech Exchange', title: 'Продайте свій iPhone з миттєвою оцінкою.', text: 'Apex Tech Exchange — це наша система швидкої оцінки iPhone для викупу. Почніть онлайн, а потім зв’яжіться з нами або завітайте до магазину.', bullets: ['Миттєва оцінка iPhone', 'Простий місцевий процес', 'Працює через Apex Tech Exchange'], cta: 'Отримати оцінку', external: 'https://www.apextechexchange.com' },
    phones: { eyebrow: 'Телефони у продажу', title: 'Вживані та розблоковані телефони доступні в магазині.', text: 'Купуйте локально з допомогою в налаштуванні, перенесенні даних і виборі правильного мобільного плану.', bullets: ['Вживані iPhone та інші пристрої за наявності', 'Розблоковані моделі', 'Місцева допомога з налаштуванням і зрозуміла інформація про гарантію'], cta: 'Зателефонувати щодо телефонів' },
    accessories: { eyebrow: 'Аксесуари', title: 'Щоденні аксесуари для телефону без зайвих сумнівів.', text: 'У магазині є зарядні пристрої, кабелі, чохли, захисне скло та інші практичні аксесуари.', bullets: ['Зарядні пристрої та кабелі', 'Чохли та захисне скло', 'Місцева допомога з вибором потрібного товару'], cta: 'Зателефонувати щодо аксесуарів' },
    about: { eyebrow: 'Про CellzTech', title: 'Сучасний бренд, яким керує Cellz Repairz LLC.', text: 'CellzTech — це сучасний сервісний центр Cellz Repairz. Мета проста: зробити ремонт телефонів, мобільний зв’язок, продаж телефонів, аксесуари та викуп зручнішими для місцевих клієнтів.', bullets: ['Місцевий магазин у Чикаго', 'Керується Cellz Repairz LLC', 'Практична допомога без корпоративної плутанини'], cta: 'Зв’язатися з нами' },
    contact: { eyebrow: 'Завітайте або зателефонуйте', title: 'Завітайте до CellzTech або зателефонуйте для місцевої технічної допомоги.', text: 'Ми знаходимося за адресою 3412 N Harlem Ave STE A, Chicago, IL 60634. Телефонуйте щодо ремонту, Ultra Mobile, викупу, телефонів і аксесуарів.', bullets: ['3412 N Harlem Ave STE A, Chicago, IL 60634', '773-413-7489', 'CellzTech керується Cellz Repairz LLC'], cta: 'Зателефонувати до CellzTech' },
    book: { eyebrow: 'Заявка на ремонт', title: 'Надішліть заявку на ремонт до CellzTech.', text: 'Виберіть бренд, модель, проблему та зручне вікно для здачі пристрою. Ми зв’яжемося з вами, щоб підтвердити деталі, ціну та наявність деталей.', bullets: ['Спочатку ремонт Apple', 'Samsung, Motorola та Google Pixel можна додати далі', 'Оплата онлайн не стягується'], cta: 'Почати заявку' },
    sim: { eyebrow: 'Запит SIM Ultra Mobile', title: 'Замовте SIM-картку Ultra Mobile для самовивозу або доставки.', text: 'Надішліть запит на SIM для самовивозу, доставки по США або допомоги з eSIM. Ми підтвердимо наявність, активацію, доставку та оплату до завершення.', bullets: ['Запит на доставку фізичної SIM-картки', 'Самовивіз у CellzTech', 'Допомога з eSIM для сумісних телефонів'], cta: 'Почати запит SIM' },
    admin: pageData.admin
  }
};

const homeText = {
  en: { eyebrow: 'Chicago local tech shop', title: 'Phone repair, wireless plans, phones, accessories, and buyback in Chicago.', text: 'CellzTech is a modern local hub for repairs, Ultra Mobile activations, used phones, accessories, and instant iPhone buyback quotes through Apex Tech Exchange.', book: 'Book a repair', call: 'Call CellzTech', ultra: 'Switch to Ultra Mobile', sell: 'Sell your iPhone', trust: ['High-quality parts', 'Clear local service', 'Warranty-focused repairs'], start: 'Start here', need: 'What do you need today?', note: 'Fast help for common phone problems, upgrades, and wireless questions.', choose: 'Choose a service', servicesTitle: 'Everything customers ask for most, organized in one place.', servicesText: 'Repairs, wireless savings, buyback, phones, and accessories are separated clearly so customers can get to the right page fast.', why: 'Why customers choose CellzTech', whyTitle: 'Built for practical local service, not corporate store confusion.', whyText: 'The website should feel like the shop: clear, helpful, professional, and focused on getting the customer to the right solution.', visit: 'Visit the store', ready: 'Ready when you are', readyTitle: 'Call or stop in for repair help, Ultra Mobile, buyback, phones, and accessories.' },
  pl: { eyebrow: 'Lokalny serwis technologiczny w Chicago', title: 'Naprawa telefonów, plany komórkowe, telefony, akcesoria i skup w Chicago.', text: 'CellzTech to nowoczesne lokalne miejsce dla napraw, aktywacji Ultra Mobile, telefonów używanych, akcesoriów i natychmiastowych wycen skupu iPhone’ów przez Apex Tech Exchange.', book: 'Zgłoś naprawę', call: 'Zadzwoń do CellzTech', ultra: 'Przejdź na Ultra Mobile', sell: 'Sprzedaj iPhone’a', trust: ['Dobrej jakości części', 'Jasna lokalna obsługa', 'Naprawy z naciskiem na gwarancję'], start: 'Zacznij tutaj', need: 'Czego dziś potrzebujesz?', note: 'Szybka pomoc przy typowych problemach z telefonem, zmianie urządzenia i pytaniach o usługę komórkową.', choose: 'Wybierz usługę', servicesTitle: 'Najczęstsze potrzeby klientów, uporządkowane w jednym miejscu.', servicesText: 'Naprawy, oszczędności na telefonie, skup, telefony i akcesoria są rozdzielone jasno, aby klient szybko trafił na właściwą stronę.', why: 'Dlaczego klienci wybierają CellzTech', whyTitle: 'Stworzone dla praktycznej lokalnej obsługi, nie dla zamieszania jak w korporacyjnym salonie.', whyText: 'Strona powinna działać tak jak sklep: jasno, pomocnie, profesjonalnie i z naciskiem na znalezienie właściwego rozwiązania.', visit: 'Odwiedź sklep', ready: 'Jesteśmy gotowi, kiedy Ty jesteś', readyTitle: 'Zadzwoń lub wpadnij po pomoc z naprawą, Ultra Mobile, skupem, telefonami i akcesoriami.' },
  es: { eyebrow: 'Tienda local de tecnología en Chicago', title: 'Reparación de teléfonos, planes móviles, teléfonos, accesorios y recompra en Chicago.', text: 'CellzTech es un centro local moderno para reparaciones, activaciones de Ultra Mobile, teléfonos usados, accesorios y cotizaciones instantáneas para iPhone mediante Apex Tech Exchange.', book: 'Solicitar reparación', call: 'Llamar a CellzTech', ultra: 'Cambiar a Ultra Mobile', sell: 'Vender tu iPhone', trust: ['Piezas de calidad', 'Servicio local claro', 'Reparaciones enfocadas en garantía'], start: 'Empieza aquí', need: '¿Qué necesitas hoy?', note: 'Ayuda rápida para problemas comunes de teléfonos, cambios de equipo y preguntas sobre servicio móvil.', choose: 'Elige un servicio', servicesTitle: 'Lo que más piden los clientes, organizado en un solo lugar.', servicesText: 'Reparaciones, ahorro móvil, recompra, teléfonos y accesorios están separados claramente para llegar rápido a la página correcta.', why: 'Por qué los clientes eligen CellzTech', whyTitle: 'Creado para un servicio local práctico, no para la confusión de una tienda corporativa.', whyText: 'El sitio debe sentirse como la tienda: claro, útil, profesional y enfocado en llevar al cliente a la solución correcta.', visit: 'Visitar la tienda', ready: 'Listos cuando tú lo estés', readyTitle: 'Llama o visítanos para reparaciones, Ultra Mobile, recompra, teléfonos y accesorios.' },
  uk: { eyebrow: 'Місцева технічна майстерня в Чикаго', title: 'Ремонт телефонів, мобільні плани, телефони, аксесуари та викуп у Чикаго.', text: 'CellzTech — сучасний місцевий центр для ремонту, активацій Ultra Mobile, вживаних телефонів, аксесуарів і миттєвих оцінок iPhone через Apex Tech Exchange.', book: 'Заявка на ремонт', call: 'Зателефонувати до CellzTech', ultra: 'Перейти на Ultra Mobile', sell: 'Продати iPhone', trust: ['Якісні деталі', 'Зрозумілий місцевий сервіс', 'Ремонт із увагою до гарантії'], start: 'Почніть тут', need: 'Що вам потрібно сьогодні?', note: 'Швидка допомога з типовими проблемами телефонів, оновленням пристрою та питаннями мобільного зв’язку.', choose: 'Виберіть послугу', servicesTitle: 'Найпоширеніші запити клієнтів, зібрані в одному місці.', servicesText: 'Ремонт, економія на мобільному зв’язку, викуп, телефони та аксесуари розділені чітко, щоб клієнт швидко знайшов потрібну сторінку.', why: 'Чому клієнти обирають CellzTech', whyTitle: 'Створено для практичного місцевого сервісу, а не для плутанини корпоративного магазину.', whyText: 'Сайт має відчуватися як магазин: зрозуміло, корисно, професійно та з фокусом на правильне рішення.', visit: 'Відвідати магазин', ready: 'Ми готові, коли готові ви', readyTitle: 'Зателефонуйте або завітайте щодо ремонту, Ultra Mobile, викупу, телефонів та аксесуарів.' }
};


const localizedServiceCards: Record<LanguageKey, typeof serviceCards> = {
  en: serviceCards,
  pl: [
    { key: 'repairs', icon: Wrench, title: 'Naprawy', text: 'iPhone, Samsung, iPad, Motorola, Google Pixel, ekrany, baterie, porty ładowania, aparaty, tylne szybki i odzyskiwanie danych.', cta: 'Napraw moje urządzenie' },
    { key: 'ultra', icon: Wifi, title: 'Ultra Mobile', text: 'Przestań przepłacać za telefon. Pomagamy zmienić operatora, zachować numer, sprawdzić kompatybilność i wybrać plan.', cta: 'Zmień i oszczędzaj' },
    { key: 'xfinity', icon: Wifi, title: 'Xfinity Prepaid', text: 'Internet domowy prepaid 200 Mbps za $45/mies. z darmowym modemem dostępnym w sklepie.', cta: 'Zobacz internet' },
    { key: 'buyback', icon: DollarSign, title: 'Skup', text: 'Masz iPhone’a, który leży w szufladzie? Sprawdź natychmiastową wycenę przez Apex Tech Exchange.', cta: 'Sprawdź wycenę' },
    { key: 'phones', icon: Smartphone, title: 'Telefony', text: 'Używane i odblokowane telefony dostępne w sklepie z pomocą przy konfiguracji i praktyczną informacją o gwarancji.', cta: 'Zobacz telefony' },
    { key: 'accessories', icon: ShoppingBag, title: 'Akcesoria', text: 'Ładowarki, kable, etui, szkła ochronne i codzienne akcesoria do telefonu dostępne lokalnie.', cta: 'Zobacz akcesoria' }
  ],
  es: [
    { key: 'repairs', icon: Wrench, title: 'Reparaciones', text: 'iPhone, Samsung, iPad, Motorola, Google Pixel, pantallas, baterías, puertos de carga, cámaras, cristal trasero y recuperación de datos.', cta: 'Reparar mi dispositivo' },
    { key: 'ultra', icon: Wifi, title: 'Ultra Mobile', text: 'Deja de pagar de más. Te ayudamos a cambiarte, conservar tu número, revisar compatibilidad y elegir un plan.', cta: 'Cambiar y ahorrar' },
    { key: 'xfinity', icon: Wifi, title: 'Xfinity Prepaid', text: 'Internet prepago residencial de 200 Mbps por $45/mes con módem gratis en tienda.', cta: 'Ver internet' },
    { key: 'buyback', icon: DollarSign, title: 'Recompra', text: '¿Tienes un iPhone guardado en un cajón? Obtén una cotización instantánea con Apex Tech Exchange.', cta: 'Obtener cotización' },
    { key: 'phones', icon: Smartphone, title: 'Teléfonos', text: 'Teléfonos usados y desbloqueados disponibles en tienda con ayuda local de configuración y garantía práctica.', cta: 'Ver teléfonos' },
    { key: 'accessories', icon: ShoppingBag, title: 'Accesorios', text: 'Cargadores, cables, fundas, protectores de pantalla y accesorios diarios disponibles localmente.', cta: 'Ver accesorios' }
  ],
  uk: [
    { key: 'repairs', icon: Wrench, title: 'Ремонт', text: 'iPhone, Samsung, iPad, Motorola, Google Pixel, екрани, батареї, порти заряджання, камери, заднє скло та відновлення даних.', cta: 'Відремонтувати пристрій' },
    { key: 'ultra', icon: Wifi, title: 'Ultra Mobile', text: 'Не переплачуйте за зв’язок. Ми допоможемо перейти, зберегти номер, перевірити сумісність і вибрати план.', cta: 'Перейти й заощадити' },
    { key: 'xfinity', icon: Wifi, title: 'Xfinity Prepaid', text: 'Домашній prepaid-інтернет 200 Mbps за $45/міс. із безкоштовним модемом у магазині.', cta: 'Переглянути інтернет' },
    { key: 'buyback', icon: DollarSign, title: 'Викуп', text: 'Маєте iPhone, який лежить без діла? Отримайте миттєву оцінку через Apex Tech Exchange.', cta: 'Отримати оцінку' },
    { key: 'phones', icon: Smartphone, title: 'Телефони', text: 'Вживані й розблоковані телефони в магазині з місцевою допомогою в налаштуванні та гарантії.', cta: 'Переглянути телефони' },
    { key: 'accessories', icon: ShoppingBag, title: 'Аксесуари', text: 'Зарядні пристрої, кабелі, чохли, захисне скло та щоденні аксесуари доступні локально.', cta: 'Переглянути аксесуари' }
  ]
};

const localizedTrustItems: Record<LanguageKey, typeof trustItems> = {
  en: trustItems,
  pl: [
    { icon: ShieldCheck, title: 'Naprawy nastawione na jakość', text: 'Używamy dobrych części i jasno tłumaczymy gwarancję, bez obiecywania rzeczy nierealnych.' },
    { icon: MessageCircle, title: 'Jasna lokalna pomoc', text: 'Proste odpowiedzi i praktyczne wyjaśnienia od sklepu, który codziennie pracuje z telefonami.' },
    { icon: Store, title: 'Więcej niż naprawy', text: 'Naprawy, Ultra Mobile, sprzedaż telefonów, akcesoria i skup w jednym miejscu.' }
  ],
  es: [
    { icon: ShieldCheck, title: 'Reparaciones enfocadas en calidad', text: 'Usamos piezas de calidad y explicamos la garantía con claridad, sin prometer lo imposible.' },
    { icon: MessageCircle, title: 'Consejo local claro', text: 'Respuestas directas y explicaciones prácticas de una tienda que trabaja con teléfonos todos los días.' },
    { icon: Store, title: 'Más que reparaciones', text: 'Reparaciones, Ultra Mobile, teléfonos, accesorios y recompra en un solo lugar.' }
  ],
  uk: [
    { icon: ShieldCheck, title: 'Ремонт із фокусом на якість', text: 'Ми використовуємо якісні деталі та чітко пояснюємо гарантію, без нереалістичних обіцянок.' },
    { icon: MessageCircle, title: 'Зрозуміла місцева порада', text: 'Прямі відповіді та практичні пояснення від майстерні, яка щодня працює з телефонами.' },
    { icon: Store, title: 'Більше ніж ремонт', text: 'Ремонт, Ultra Mobile, продаж телефонів, аксесуари та викуп в одному місці.' }
  ]
};

function goTo(page: PageKey) {
  const path = routes[page];
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPath(path: string) {
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
  const nav: PageKey[] = ['home', 'repairs', 'ultra', 'xfinity', 'buyback', 'phones', 'accessories', 'about', 'contact'];

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
            <button className="bookHeaderButton" onClick={() => navigate('book')}>{labels.book}</button>
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

function Hero({ lang }: { lang: LanguageKey }) {
  const copy = homeText[lang];
  const cards = localizedServiceCards[lang];
  return (
    <section className="hero">
      <div className="wrap heroGrid">
        <div className="heroCopy">
          <div className="eyebrow"><Star size={15} /> {copy.eyebrow}</div>
          <h1>{copy.title}</h1>
          <p>{copy.text}</p>
          <div className="heroCtas">
            <button className="primaryBtn" onClick={() => goTo('book')}>{copy.book} <ArrowRight size={18} /></button>
            <a className="secondaryBtn" href="tel:7734137489">{copy.call}</a>
            <button className="secondaryBtn" onClick={() => goTo('ultra')}>{copy.ultra}</button>
            <button className="secondaryBtn ghost" onClick={() => goTo('buyback')}>{copy.sell}</button>
          </div>
          <div className="miniTrust">
            <span><CheckCircle2 size={16} /> {copy.trust[0]}</span>
            <span><CheckCircle2 size={16} /> {copy.trust[1]}</span>
            <span><CheckCircle2 size={16} /> {copy.trust[2]}</span>
          </div>
        </div>
        <div className="servicePanel" aria-label="Service options">
          <div className="panelHeader">
            <span>{copy.start}</span>
            <strong>{copy.need}</strong>
          </div>
          <div className="panelList">
            {cards.map((service) => {
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
            <Search size={16} /> {copy.note}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceGrid({ lang }: { lang: LanguageKey }) {
  const copy = homeText[lang];
  const cards = localizedServiceCards[lang];
  return (
    <section className="section light">
      <div className="wrap">
        <div className="sectionIntro">
          <span>{copy.choose}</span>
          <h2>{copy.servicesTitle}</h2>
          <p>{copy.servicesText}</p>
        </div>
        <div className="cardsGrid">
          {cards.map((card) => {
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

function TrustSection({ lang }: { lang: LanguageKey }) {
  const copy = homeText[lang];
  const items = localizedTrustItems[lang];
  return (
    <section className="section">
      <div className="wrap split">
        <div>
          <span className="label">{copy.why}</span>
          <h2>{copy.whyTitle}</h2>
          <p className="lead">{copy.whyText}</p>
          <div className="inlineActions">
            <a className="primaryBtn compact" href="tel:7734137489">Call 773-413-7489</a>
            <button className="secondaryBtn compact" onClick={() => goTo('contact')}>{copy.visit}</button>
          </div>
        </div>
        <div className="trustStack">
          {items.map((item) => {
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


type AdminRepairRequest = {
  id: string;
  submitted_at?: string;
  status?: string;
  source?: string;
  device?: string;
  series?: string;
  model?: string;
  issue?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  requested_date?: string;
  requested_time?: string;
  notes?: string;
  repairdesk_customer_id?: string | null;
  repairdesk_lead_id?: string | null;
  repairdesk_lead_order_id?: string | null;
  repairdesk_ticket_id?: string | null;
  integration_errors?: unknown;
};

type AdminVisitStats = {
  today: number;
  last7Days: number;
  last30Days: number;
  topPages: { path: string; count: number }[];
  dailyVisits?: { date: string; count: number }[];
};

type AdminSimRequest = {
  id: string;
  submitted_at?: string;
  status?: string;
  request_type?: string;
  plan_interest?: string;
  needs_activation_help?: boolean;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
  notes?: string;
};

function formatAdminDate(value?: string) {
  if (!value) return 'Not available';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function AdminDashboard() {
  const [adminKey, setAdminKey] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [requests, setRequests] = useState<AdminRepairRequest[]>([]);
  const [simRequests, setSimRequests] = useState<AdminSimRequest[]>([]);
  const [visitorStats, setVisitorStats] = useState<AdminVisitStats>({ today: 0, last7Days: 0, last30Days: 0, topPages: [], dailyVisits: [] });
  const [adminView, setAdminView] = useState<'repairs' | 'sim'>('repairs');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const loadRequests = React.useCallback(async (key: string) => {
    if (!key.trim()) {
      setError('Enter the CellzTech admin access key to continue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/repair-requests', {
        headers: { 'x-cellztech-admin-key': key.trim() }
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Access denied. Check the admin key and try again.');
      }
      setAdminKey(key.trim());
      setInputKey('');
      setRequests(data.requests || []);
      setSimRequests(data.simRequests || []);
      setVisitorStats(data.visitorStats || { today: 0, last7Days: 0, last30Days: 0, topPages: [], dailyVisits: [] });
    } catch (err) {
      setAdminKey('');
      setRequests([]);
      setSimRequests([]);
      setVisitorStats({ today: 0, last7Days: 0, last30Days: 0, topPages: [], dailyVisits: [] });
      setError(err instanceof Error ? err.message : 'Access denied. Check the admin key and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredRequests = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return requests;
    return requests.filter((request) => [
      request.customer_name,
      request.customer_phone,
      request.customer_email,
      request.model,
      request.issue,
      request.repairdesk_lead_order_id,
      request.status
    ].some((value) => String(value || '').toLowerCase().includes(term)));
  }, [requests, query]);

  const filteredSimRequests = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return simRequests;
    return simRequests.filter((request) => [
      request.customer_name,
      request.customer_phone,
      request.customer_email,
      request.request_type,
      request.plan_interest,
      request.shipping_city,
      request.shipping_state,
      request.status
    ].some((value) => String(value || '').toLowerCase().includes(term)));
  }, [simRequests, query]);

  const leadCount = requests.filter((request) => request.repairdesk_lead_id || request.repairdesk_lead_order_id).length;
  const failedCount = requests.filter((request) => request.integration_errors).length;
  const activeRequests = requests.filter((request) => request.status !== 'completed' && request.status !== 'closed').length;
  const dailyVisits = visitorStats.dailyVisits || [];
  const maxDailyVisits = Math.max(1, ...dailyVisits.map((item) => item.count));
  const topPages = visitorStats.topPages || [];
  const maxTopPageViews = Math.max(1, ...topPages.map((item) => item.count));
  const formatVisitDay = (value: string) => {
    const parsed = new Date(`${value}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) return value.slice(5);
    return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const submitKey = (event: React.FormEvent) => {
    event.preventDefault();
    loadRequests(inputKey);
  };

  const signOut = () => {
    setAdminKey('');
    setInputKey('');
    setRequests([]);
    setSimRequests([]);
    setQuery('');
    setError('');
  };

  if (!adminKey) {
    return (
      <main className="adminLoginShell">
        <section className="adminAccessPanel" aria-label="CellzTech admin login">
          <div className="adminMatrixGlow" aria-hidden="true" />
          <div className="adminTerminalCard">
            <div className="terminalTopBar">
              <span />
              <span />
              <span />
              <strong>classified.cellztech.local</strong>
            </div>

            <div className="terminalScreen">
              <div className="spyLoginHeader">
                <span className="terminalEyebrow"><ShieldCheck size={16} /> Secure staff access</span>
                <span className="classifiedStamp">CLASSIFIED</span>
              </div>
              <h1>Agent Console</h1>
              <p className="terminalCopy">Private CellzTech repair intelligence terminal. Authorized staff only.</p>

              <div className="spyConsoleGrid" aria-hidden="true">
                <div className="terminalLines pixelPanel">
                  <code>&gt; BOOTING CELLZTECH OS/1987...</code>
                  <code>&gt; REPAIRDESK LINK: ARMED</code>
                  <code>&gt; SUPABASE VAULT: SEALED</code>
                  <code>&gt; CUSTOMER DATA: HIDDEN</code>
                  <code>&gt; AGENT KEY REQUIRED<span className="terminalCursor">_</span></code>
                </div>
                <div className="radarPanel pixelPanel">
                  <div className="radarScope">
                    <span className="radarSweep" />
                    <i className="radarDot one" />
                    <i className="radarDot two" />
                    <i className="radarDot three" />
                  </div>
                  <small>SCAN MODE</small>
                </div>
              </div>

              <div className="missionStrip" aria-hidden="true">
                <span>MISSION: LEADS</span>
                <span>CHANNEL: SECURE</span>
                <span>TRACE: OFF</span>
              </div>

              <form className="terminalLoginForm" onSubmit={submitKey}>
                <label htmlFor="adminKey">Enter agent access key</label>
                <div className="terminalInputWrap pixelInput">
                  <span>KEY</span>
                  <input
                    id="adminKey"
                    type="password"
                    value={inputKey}
                    onChange={(event) => setInputKey(event.target.value)}
                    placeholder="••••••••••••••"
                    autoComplete="current-password"
                    autoFocus
                  />
                </div>
                <button className="terminalButton pixelButton" type="submit" disabled={loading}>{loading ? 'Decrypting…' : 'Authenticate agent'}</button>
              </form>

              {error && <div className="terminalError">{error}</div>}
              <p className="terminalFootnote">This route reveals no repair data until the private key is verified.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="adminShell compactAdminShell">
      <section className="adminDashboardTop">
        <div className="wrap adminDashboardHeader">
          <div>
            <span className="adminEyebrow">CellzTech private admin</span>
            <h1>Admin dashboard</h1>
            <p>Repair requests, RepairDesk leads, SIM requests, and website traffic in one compact view.</p>
          </div>
          <div className="adminHeaderActions">
            <button className="secondaryBtn compact" onClick={() => loadRequests(adminKey)} disabled={loading}>{loading ? 'Loading…' : 'Refresh data'}</button>
            <button className="secondaryBtn compact dark" onClick={signOut}>Lock console</button>
          </div>
        </div>
      </section>

      <section className="adminDashboardSection">
        <div className="wrap">
          {error && <div className="adminNotice error">{error}</div>}

          <div className="adminMetricGrid" aria-label="Admin summary metrics">
            <article><span>Total requests</span><strong>{requests.length}</strong><small>{activeRequests} active / open</small></article>
            <article><span>RepairDesk leads</span><strong>{leadCount}</strong><small>{requests.length ? Math.round((leadCount / requests.length) * 100) : 0}% connected</small></article>
            <article><span>Needs review</span><strong>{failedCount}</strong><small>{failedCount ? 'Check integration errors' : 'No integration errors'}</small></article>
            <article><span>Visitors today</span><strong>{visitorStats.today}</strong><small>{visitorStats.last7Days} visits in 7 days</small></article>
            <article><span>Last 30 days</span><strong>{visitorStats.last30Days}</strong><small>Tracked page visits</small></article>
          </div>

          <div className="adminAnalyticsGrid">
            <section className="adminChartCard">
              <div className="adminCardHeader">
                <div>
                  <span>Traffic analytics</span>
                  <h2>Daily visits</h2>
                </div>
                <strong>Last 14 days</strong>
              </div>
              {dailyVisits.length ? (
                <div className="adminDailyChart" aria-label="Daily visits bar chart">
                  {dailyVisits.map((item) => (
                    <div className="adminDailyBarItem" key={item.date}>
                      <b>{item.count}</b>
                      <span style={{ height: `${Math.max(8, Math.round((item.count / maxDailyVisits) * 120))}px` }} />
                      <em>{formatVisitDay(item.date)}</em>
                    </div>
                  ))}
                </div>
              ) : <p className="adminMutedText">No daily traffic data yet.</p>}
            </section>

            <section className="adminChartCard">
              <div className="adminCardHeader">
                <div>
                  <span>Top pages</span>
                  <h2>Most viewed pages</h2>
                </div>
                <strong>{topPages.reduce((sum, item) => sum + item.count, 0)} views</strong>
              </div>
              {topPages.length ? (
                <div className="adminPageBars" aria-label="Top pages viewed bar chart">
                  {topPages.map((item) => (
                    <div className="adminPageBarRow" key={item.path}>
                      <div><b>{item.path}</b><span>{item.count}</span></div>
                      <i><span style={{ width: `${Math.max(6, Math.round((item.count / maxTopPageViews) * 100))}%` }} /></i>
                    </div>
                  ))}
                </div>
              ) : <p className="adminMutedText">No page view data yet.</p>}
            </section>
          </div>

          <section className="adminWorkPanel">
            <div className="adminWorkHeader">
              <div>
                <span>Request management</span>
                <h2>Customer submissions</h2>
              </div>
              <p>Use search, tabs, and status badges to review requests before the customer arrives.</p>
            </div>
          <div className="adminToolbar">
            <div className="adminTabs" aria-label="Admin request type">
              <button className={adminView === 'repairs' ? 'active' : ''} onClick={() => setAdminView('repairs')}>Repair requests ({requests.length})</button>
              <button className={adminView === 'sim' ? 'active' : ''} onClick={() => setAdminView('sim')}>Ultra SIM requests ({simRequests.length})</button>
            </div>
            <div className="adminSearch">
              <Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, phone, email, model, issue, or lead ID" />
            </div>
          </div>

          {adminView === 'repairs' ? (
            <div className="adminRequestGrid">
              {filteredRequests.map((request) => {
                const hasLead = Boolean(request.repairdesk_lead_order_id || request.repairdesk_lead_id);
                const needsReview = Boolean(request.integration_errors);
                return (
                  <article className="adminRequestCard" key={request.id}>
                    <div className="adminRequestTop">
                      <div>
                        <span className="adminTimestamp">{formatAdminDate(request.submitted_at)}</span>
                        <h3>{request.customer_name || 'Unnamed customer'}</h3>
                        <p>{request.customer_phone || 'No phone'} • {request.customer_email || 'No email'}</p>
                      </div>
                      <span className={needsReview ? 'adminStatus warning' : hasLead ? 'adminStatus success' : 'adminStatus'}>
                        {needsReview ? 'Needs review' : hasLead ? 'Lead created' : 'Saved'}
                      </span>
                    </div>
                    <div className="adminDeviceLine">
                      <strong>{request.model || 'Unknown model'}</strong>
                      <span>{request.issue || 'No issue listed'}</span>
                    </div>
                    <div className="adminMetaGrid">
                      <div><span>Requested</span><strong>{request.requested_date || 'Not set'} {request.requested_time || ''}</strong></div>
                      <div><span>RepairDesk lead</span><strong>{request.repairdesk_lead_order_id || request.repairdesk_lead_id || 'Not created'}</strong></div>
                      <div><span>Customer ID</span><strong>{request.repairdesk_customer_id || 'Not created'}</strong></div>
                      <div><span>Status</span><strong>{request.status || 'Saved'}</strong></div>
                    </div>
                    {request.notes && <p className="adminNotes">{request.notes}</p>}
                    {needsReview && <p className="adminErrorText">Integration warning saved. Check Supabase for the full JSON response.</p>}
                  </article>
                );
              })}
              {!filteredRequests.length && (
                <div className="adminEmptyState">
                  <h3>No repair requests found</h3>
                  <p>Try another search or submit a test repair request from the booking page.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="adminRequestGrid">
              {filteredSimRequests.map((request) => {
                const typeLabel = request.request_type === 'shipping' ? 'Ship SIM' : request.request_type === 'pickup' ? 'Pickup SIM' : 'eSIM help';
                const address = [request.shipping_address, request.shipping_city, request.shipping_state, request.shipping_zip].filter(Boolean).join(', ');
                return (
                  <article className="adminRequestCard simAdminCard" key={request.id}>
                    <div className="adminRequestTop">
                      <div>
                        <span className="adminTimestamp">{formatAdminDate(request.submitted_at)}</span>
                        <h3>{request.customer_name || 'Unnamed customer'}</h3>
                        <p>{request.customer_phone || 'No phone'} • {request.customer_email || 'No email'}</p>
                      </div>
                      <span className="adminStatus success">SIM request</span>
                    </div>
                    <div className="adminDeviceLine">
                      <strong>{typeLabel}</strong>
                      <span>{request.plan_interest || 'No plan selected'}</span>
                    </div>
                    <div className="adminMetaGrid">
                      <div><span>Activation help</span><strong>{request.needs_activation_help ? 'Yes' : 'No / not sure'}</strong></div>
                      <div><span>Status</span><strong>{request.status || 'Saved'}</strong></div>
                      <div className="wide"><span>Shipping</span><strong>{address || 'Not needed / not provided'}</strong></div>
                    </div>
                    {request.notes && <p className="adminNotes">{request.notes}</p>}
                  </article>
                );
              })}
              {!filteredSimRequests.length && (
                <div className="adminEmptyState">
                  <h3>No SIM requests found</h3>
                  <p>Try another search or submit a test Ultra SIM request.</p>
                </div>
              )}
            </div>
          )}
          </section>
        </div>
      </section>
    </main>
  );
}




function PageDetail({ page, lang }: { page: PageKey; lang: LanguageKey }) {
  const data = localizedPageData[lang][page];
  const copy = homeText[lang];
  const isHome = page === 'home';

  if (isHome) {
    return (
      <>
        <Hero lang={lang} />
        <ServiceGrid lang={lang} />
        <TrustSection lang={lang} />
        <section className="section ctaBand">
          <div className="wrap ctaPanel">
            <div>
              <span className="label">{copy.ready}</span>
              <h2>{copy.readyTitle}</h2>
            </div>
            <a className="primaryBtn" href="tel:7734137489">Call CellzTech <ArrowRight size={18} /></a>
          </div>
        </section>
      </>
    );
  }

  if (page === 'repairs') return <RepairsPage lang={lang} />;
  if (page === 'book') return <BookRepairPage lang={lang} />;
  if (page === 'admin') return <AdminDashboard />;
  if (page === 'sim') return <UltraSimRequestPage lang={lang} />;
  if (page === 'xfinity') return <XfinityPrepaidPage lang={lang} />;
  if (page === 'ultra') {
    return (
      <main className="pageMain">
        <UltraDetails lang={lang} />
      </main>
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
              <button className="secondaryBtn" onClick={() => goTo('contact')}>{homeText[lang].visit}</button>
            </div>
          </div>
          <div className="detailCard">
            <h2>{lang === 'en' ? 'Quick details' : lang === 'pl' ? 'Najważniejsze informacje' : lang === 'es' ? 'Detalles rápidos' : 'Коротко'}</h2>
            <ul>
              {data.bullets.map((bullet) => <li key={bullet}><CheckCircle2 size={18} /> {bullet}</li>)}
            </ul>
          </div>
        </div>
      </section>
      {page === 'about' && <FeaturedReviews />}
      {page === 'contact' && <ContactDetails />}
    </main>
  );
}

function FeaturedReviews() {
  const shuffledReviews = useMemo(() => [...featuredReviews].sort(() => Math.random() - 0.5), []);

  return (
    <section className="section reviewSection">
      <div className="wrap">
        <div className="reviewHeader">
          <div>
            <span className="label">Google reviews</span>
            <h2>Trusted by local customers who needed real repair help.</h2>
            <p>Featured 5-star reviews from customers who trusted Cellz Repairz for phone repair and local tech help.</p>
          </div>
          <a className="secondaryBtn compact" href="https://www.google.com/search?q=Cellz+Repairz+3412+N+Harlem+Ave+Chicago+reviews" target="_blank" rel="noreferrer">View on Google</a>
        </div>

        <div className="reviewRail" aria-label="Featured 5-star reviews">
          {shuffledReviews.map((review) => (
            <article className="reviewCard" key={review.name}>
              <div className="reviewTopline">
                <div className="reviewAvatar" aria-hidden="true">{review.name.charAt(0)}</div>
                <div>
                  <strong>{review.name}</strong>
                  <span>Google customer</span>
                </div>
                <div className="googleMark" aria-label="Google review">G</div>
              </div>
              <div className="stars" aria-label="5 star review">
                {Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={17} fill="currentColor" />)}
              </div>
              <p>“{review.text}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const localizedRepairContent = {
  en: {
    heroCta: 'Book repair', call: 'Call for repair', directions: 'Get directions', summaryLabel: 'Repair help for', servicesLabel: 'Repair services', servicesTitle: 'Common repairs and device problems we help with.', servicesText: 'Start with the repair category that matches your issue. If you are not sure what is wrong, call or stop in and we can inspect the device.', smallSigns: 'Do not ignore the small signs', smallTitle: 'Small phone problems often turn into bigger repairs.', smallText: 'Charging at an angle, fast battery drain, ghost touch, camera blur, or a cracked screen can get worse over time. We can help you understand what is happening before you spend money on the wrong solution.', startRequest: 'Start repair request', callNumber: 'Call 773-413-7489', whyLabel: 'Why customers choose CellzTech', whyTitle: 'Clear advice, practical pricing, and repair work we stand behind.', processLabel: 'What to expect', processTitle: 'A simple repair process from start to finish.', readyLabel: 'Ready when you are', ctaTitle: 'Do not wait. Get your phone checked today.', ctaText: 'Cracked screen? Weak battery? Charging problem? Stop by CellzTech or call us and we will help you figure out the best repair option.', callNow: 'Call now',
    services: [
      ['iPhone Repair', 'Screens, batteries, charging ports, back glass, cameras, speakers, and common iPhone repairs.'],
      ['Samsung Repair', 'Screen replacement, battery service, charging problems, camera issues, and common Samsung repairs.'],
      ['iPad & Tablet Repair', 'Cracked screens, battery problems, charging ports, and tablet diagnostics.'],
      ['Charging & Battery Issues', 'If your phone charges slowly, dies fast, or only works at an angle, stop in for help.'],
      ['Back Glass & Camera Repair', 'Repair options for cracked back glass, broken camera lens glass, and camera-related issues.'],
      ['Diagnostics & Data Recovery', 'If your phone will not turn on or you need important data, we can inspect the device and explain possible options.']
    ],
    trust: [
      ['Clear repair advice', 'We explain what is wrong with your device and your repair options before starting any work.'],
      ['High-quality parts', 'We use high-quality parts and offer one of the best warranties on repairs.'],
      ['Local Chicago service', 'You are working with a local shop, not a corporate call center.'],
      ['Fair, practical pricing', 'We give clear pricing before the repair so you know what to expect.'],
      ['Experienced repair help', 'We work on iPhones, Samsung devices, iPads, tablets, Motorola, Google Pixel, and more.'],
      ['Warranty-focused repairs', 'We stand behind our work and explain warranty coverage clearly.']
    ],
    problems: ['Cracked screen or touch problems', 'Weak battery or random shutdowns', 'Phone not charging or loose charging port', 'Broken back glass or camera lens glass', 'Camera, speaker, microphone, or button problems', 'Device will not turn on or needs diagnostics'],
    steps: [['1','Tell us the issue','Bring the device in or call the shop and explain what is happening.'], ['2','We check options','We explain the likely repair, pricing, timing, and warranty information.'], ['3','We repair the device','Once approved, we complete the repair using the right parts and tools.'], ['4','You test before leaving','We want you to understand the repair and leave with confidence.']]
  },
  pl: {
    heroCta: 'Zgłoś naprawę', call: 'Zadzwoń w sprawie naprawy', directions: 'Pokaż trasę', summaryLabel: 'Pomagamy przy naprawie', servicesLabel: 'Usługi naprawcze', servicesTitle: 'Najczęstsze naprawy i problemy z urządzeniami.', servicesText: 'Wybierz kategorię, która najlepiej pasuje do usterki. Jeśli nie masz pewności, zadzwoń lub odwiedź sklep — sprawdzimy urządzenie i jasno wyjaśnimy możliwości.', smallSigns: 'Nie ignoruj drobnych objawów', smallTitle: 'Małe problemy z telefonem często przeradzają się w większe naprawy.', smallText: 'Ładowanie tylko pod kątem, szybkie rozładowywanie baterii, samoczynny dotyk, zamazany obraz z aparatu albo pęknięty ekran mogą z czasem się pogarszać. Pomożemy ustalić, co się dzieje, zanim wydasz pieniądze na niewłaściwe rozwiązanie.', startRequest: 'Rozpocznij zgłoszenie', callNumber: 'Zadzwoń 773-413-7489', whyLabel: 'Dlaczego klienci wybierają CellzTech', whyTitle: 'Jasna porada, uczciwe podejście do ceny i naprawy, za którymi stoimy.', processLabel: 'Jak wygląda proces', processTitle: 'Prosty przebieg naprawy od początku do końca.', readyLabel: 'Jesteśmy gotowi, kiedy Ty jesteś', ctaTitle: 'Nie czekaj. Sprawdź swój telefon już dziś.', ctaText: 'Pęknięty ekran? Słaba bateria? Problem z ładowaniem? Odwiedź CellzTech albo zadzwoń, a pomożemy dobrać najlepszą opcję naprawy.', callNow: 'Zadzwoń teraz',
    services: [
      ['Naprawa iPhone’a', 'Ekrany, baterie, porty ładowania, tylne szybki, aparaty, głośniki i typowe naprawy iPhone’ów.'],
      ['Naprawa Samsung', 'Wymiana ekranu, serwis baterii, problemy z ładowaniem, aparatem i typowe naprawy urządzeń Samsung.'],
      ['Naprawa iPada i tabletów', 'Pęknięte ekrany, problemy z baterią, porty ładowania i diagnostyka tabletów.'],
      ['Problemy z ładowaniem i baterią', 'Jeśli telefon ładuje się wolno, szybko się rozładowuje albo działa tylko pod odpowiednim kątem, przyjdź po pomoc.'],
      ['Tylna szybka i aparat', 'Opcje naprawy pękniętej tylnej szybki, szkła aparatu oraz usterek związanych z kamerą.'],
      ['Diagnostyka i odzyskiwanie danych', 'Jeśli telefon się nie włącza albo potrzebujesz ważnych danych, sprawdzimy urządzenie i wyjaśnimy możliwe rozwiązania.']
    ],
    trust: [
      ['Jasna porada naprawcza', 'Wyjaśniamy, co dzieje się z urządzeniem i jakie są opcje przed rozpoczęciem pracy.'],
      ['Dobrej jakości części', 'Używamy dobrej jakości części i oferujemy jedną z najlepszych gwarancji na naprawy.'],
      ['Lokalna obsługa w Chicago', 'Rozmawiasz z lokalnym serwisem, a nie z anonimowym centrum obsługi.'],
      ['Uczciwa, praktyczna wycena', 'Podajemy jasną cenę przed naprawą, aby klient wiedział, czego się spodziewać.'],
      ['Doświadczona pomoc serwisowa', 'Pracujemy z iPhone’ami, Samsungami, iPadami, tabletami, Motorolą, Google Pixel i innymi urządzeniami.'],
      ['Naprawy z naciskiem na gwarancję', 'Stoimy za swoją pracą i jasno wyjaśniamy zakres gwarancji.']
    ],
    problems: ['Pęknięty ekran lub problemy z dotykiem', 'Słaba bateria albo losowe wyłączanie', 'Telefon nie ładuje się lub port ładowania jest luźny', 'Pęknięta tylna szybka albo szkło aparatu', 'Problemy z aparatem, głośnikiem, mikrofonem lub przyciskami', 'Urządzenie się nie włącza albo wymaga diagnostyki'],
    steps: [['1','Opisz usterkę','Przynieś urządzenie lub zadzwoń i powiedz, co się dzieje.'], ['2','Sprawdzamy opcje','Wyjaśniamy możliwą naprawę, cenę, czas i informacje o gwarancji.'], ['3','Naprawiamy urządzenie','Po akceptacji wykonujemy naprawę z użyciem odpowiednich części i narzędzi.'], ['4','Testujesz przed wyjściem','Chcemy, aby klient rozumiał naprawę i wychodził z pewnością.']]
  },
  es: {
    heroCta: 'Solicitar reparación', call: 'Llamar por reparación', directions: 'Cómo llegar', summaryLabel: 'Ayuda de reparación para', servicesLabel: 'Servicios de reparación', servicesTitle: 'Reparaciones comunes y problemas de dispositivos.', servicesText: 'Elige la categoría que coincida con tu problema. Si no estás seguro, llama o visita la tienda y podemos revisar el equipo.', smallSigns: 'No ignores las señales pequeñas', smallTitle: 'Los problemas pequeños del teléfono pueden convertirse en reparaciones más grandes.', smallText: 'Cargar solo en cierto ángulo, batería que se descarga rápido, toques fantasma, cámara borrosa o una pantalla rota pueden empeorar con el tiempo. Te ayudamos a entender qué pasa antes de gastar dinero en la solución equivocada.', startRequest: 'Iniciar solicitud', callNumber: 'Llamar 773-413-7489', whyLabel: 'Por qué los clientes eligen CellzTech', whyTitle: 'Consejo claro, precios prácticos y reparaciones respaldadas.', processLabel: 'Qué esperar', processTitle: 'Un proceso de reparación simple de principio a fin.', readyLabel: 'Listos cuando tú lo estés', ctaTitle: 'No esperes. Revisa tu teléfono hoy.', ctaText: '¿Pantalla rota? ¿Batería débil? ¿Problema de carga? Visita CellzTech o llámanos y te ayudaremos a encontrar la mejor opción de reparación.', callNow: 'Llamar ahora',
    services: [
      ['Reparación de iPhone', 'Pantallas, baterías, puertos de carga, cristal trasero, cámaras, altavoces y reparaciones comunes de iPhone.'],
      ['Reparación de Samsung', 'Cambio de pantalla, servicio de batería, problemas de carga, cámara y reparaciones comunes de Samsung.'],
      ['Reparación de iPad y tabletas', 'Pantallas rotas, problemas de batería, puertos de carga y diagnóstico de tabletas.'],
      ['Carga y batería', 'Si tu teléfono carga lento, se apaga rápido o solo carga en cierto ángulo, ven por ayuda.'],
      ['Cristal trasero y cámara', 'Opciones para cristal trasero roto, vidrio de cámara dañado y problemas relacionados con la cámara.'],
      ['Diagnóstico y recuperación de datos', 'Si tu teléfono no enciende o necesitas datos importantes, podemos revisar el equipo y explicar las opciones.']
    ],
    trust: [
      ['Consejo claro', 'Explicamos qué le pasa al dispositivo y las opciones antes de comenzar cualquier trabajo.'],
      ['Piezas de calidad', 'Usamos piezas de calidad y ofrecemos una de las mejores garantías en reparaciones.'],
      ['Servicio local en Chicago', 'Trabajas con una tienda local, no con un centro corporativo.'],
      ['Precios claros y prácticos', 'Damos el precio antes de la reparación para que sepas qué esperar.'],
      ['Experiencia en reparación', 'Trabajamos con iPhone, Samsung, iPad, tabletas, Motorola, Google Pixel y más.'],
      ['Reparaciones con garantía', 'Respaldamos nuestro trabajo y explicamos claramente la cobertura de garantía.']
    ],
    problems: ['Pantalla rota o problemas táctiles', 'Batería débil o apagados inesperados', 'El teléfono no carga o el puerto está flojo', 'Cristal trasero o vidrio de cámara roto', 'Problemas de cámara, altavoz, micrófono o botones', 'El dispositivo no enciende o necesita diagnóstico'],
    steps: [['1','Cuéntanos el problema','Trae el equipo o llama a la tienda y explica qué está pasando.'], ['2','Revisamos las opciones','Explicamos la posible reparación, precio, tiempo e información de garantía.'], ['3','Reparamos el equipo','Cuando apruebas, completamos la reparación con las piezas y herramientas correctas.'], ['4','Pruebas antes de salir','Queremos que entiendas la reparación y salgas con confianza.']]
  },
  uk: {
    heroCta: 'Заявка на ремонт', call: 'Зателефонувати щодо ремонту', directions: 'Маршрут', summaryLabel: 'Допомога з ремонтом', servicesLabel: 'Послуги ремонту', servicesTitle: 'Поширені ремонти та проблеми з пристроями.', servicesText: 'Виберіть категорію, яка найкраще відповідає вашій проблемі. Якщо ви не впевнені, зателефонуйте або завітайте — ми перевіримо пристрій.', smallSigns: 'Не ігноруйте невеликі ознаки', smallTitle: 'Невеликі проблеми з телефоном часто перетворюються на більший ремонт.', smallText: 'Заряджання лише під кутом, швидке розряджання, самовільні натискання, розмиття камери або тріщина на екрані можуть погіршитися з часом. Ми допоможемо зрозуміти проблему перед тим, як витрачати гроші на неправильне рішення.', startRequest: 'Почати заявку', callNumber: 'Зателефонувати 773-413-7489', whyLabel: 'Чому клієнти обирають CellzTech', whyTitle: 'Зрозуміла порада, практичні ціни та ремонт, за який ми відповідаємо.', processLabel: 'Чого очікувати', processTitle: 'Простий процес ремонту від початку до кінця.', readyLabel: 'Ми готові, коли готові ви', ctaTitle: 'Не чекайте. Перевірте телефон сьогодні.', ctaText: 'Розбитий екран? Слабка батарея? Проблема із заряджанням? Завітайте до CellzTech або зателефонуйте, і ми допоможемо обрати найкращий варіант ремонту.', callNow: 'Зателефонувати зараз',
    services: [
      ['Ремонт iPhone', 'Екрани, батареї, порти заряджання, заднє скло, камери, динаміки та типові ремонти iPhone.'],
      ['Ремонт Samsung', 'Заміна екрана, обслуговування батареї, проблеми із заряджанням, камерою та типові ремонти Samsung.'],
      ['Ремонт iPad і планшетів', 'Розбиті екрани, проблеми з батареєю, порти заряджання та діагностика планшетів.'],
      ['Проблеми із заряджанням і батареєю', 'Якщо телефон заряджається повільно, швидко розряджається або працює лише під кутом, зверніться по допомогу.'],
      ['Заднє скло та камера', 'Варіанти ремонту тріснутого заднього скла, скла камери та проблем, пов’язаних із камерою.'],
      ['Діагностика та відновлення даних', 'Якщо телефон не вмикається або потрібні важливі дані, ми перевіримо пристрій і пояснимо можливі варіанти.']
    ],
    trust: [
      ['Зрозуміла порада', 'Ми пояснюємо, що сталося з пристроєм і які є варіанти перед початком роботи.'],
      ['Якісні деталі', 'Ми використовуємо якісні деталі та пропонуємо одну з найкращих гарантій на ремонт.'],
      ['Місцевий сервіс у Чикаго', 'Ви працюєте з місцевою майстернею, а не з корпоративним кол-центром.'],
      ['Чесні та практичні ціни', 'Ми повідомляємо ціну перед ремонтом, щоб ви знали, чого очікувати.'],
      ['Досвідчена допомога з ремонтом', 'Ми працюємо з iPhone, Samsung, iPad, планшетами, Motorola, Google Pixel та іншими пристроями.'],
      ['Ремонт із гарантією', 'Ми відповідаємо за свою роботу та чітко пояснюємо гарантійне покриття.']
    ],
    problems: ['Розбитий екран або проблеми з сенсором', 'Слабка батарея або раптове вимкнення', 'Телефон не заряджається або порт заряджання розхитаний', 'Розбите заднє скло або скло камери', 'Проблеми з камерою, динаміком, мікрофоном або кнопками', 'Пристрій не вмикається або потребує діагностики'],
    steps: [['1','Опишіть проблему','Принесіть пристрій або зателефонуйте до магазину й поясніть, що відбувається.'], ['2','Ми перевіряємо варіанти','Пояснюємо можливий ремонт, ціну, час і гарантійну інформацію.'], ['3','Ми ремонтуємо пристрій','Після підтвердження виконуємо ремонт з відповідними деталями та інструментами.'], ['4','Ви тестуєте перед виходом','Ми хочемо, щоб ви розуміли ремонт і виходили впевнено.']]
  }
} as const;

function RepairsPage({ lang }: { lang: LanguageKey }) {
  const data = localizedPageData[lang].repairs;
  const rt = localizedRepairContent[lang];
  const serviceIcons = [Smartphone, TabletSmartphone, TabletSmartphone, BatteryCharging, Camera, Search];
  const repairServices = rt.services.map(([title, text], index) => ({ icon: serviceIcons[index], title, text }));
  const trustIcons = [MessageCircle, ShieldCheck, Store, DollarSign, Wrench, CheckCircle2];
  const repairTrust = rt.trust.map(([title, text], index) => ({ icon: trustIcons[index], title, text }));
  const commonProblems = rt.problems;

  return (
    <main className="pageMain repairsPage">
      <section className="repairHero">
        <div className="wrap repairHeroGrid">
          <div>
            <div className="eyebrow"><Wrench size={15} /> {data.eyebrow}</div>
            <h1>{data.title}</h1>
            <p>{data.text}</p>
            <div className="pageActions">
              <button className="primaryBtn" onClick={() => goTo('book')}>{rt.heroCta} <ArrowRight size={18} /></button>
              <a className="secondaryBtn" href="tel:7734137489">{rt.call}</a>
              <a className="secondaryBtn" href="https://maps.google.com/?q=3412+N+Harlem+Ave+STE+A+Chicago+IL+60634" target="_blank" rel="noreferrer">{rt.directions}</a>
            </div>
          </div>
          <div className="repairSummaryCard">
            <span>{rt.summaryLabel}</span>
            <ul>
              {data.bullets.slice(0, 3).map((bullet) => <li key={bullet}><CheckCircle2 size={18} /> {bullet}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section light">
        <div className="wrap">
          <div className="sectionIntro centeredIntro">
            <span>{rt.servicesLabel}</span>
            <h2>{rt.servicesTitle}</h2>
            <p>{rt.servicesText}</p>
          </div>
          <div className="repairCardsGrid">
            {repairServices.map((item) => {
              const Icon = item.icon;
              return (
                <article className="repairServiceCard" key={item.title}>
                  <div className="cardIcon"><Icon size={24} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section repairProblems">
        <div className="wrap split repairProblemSplit">
          <div>
            <span className="label">{rt.smallSigns}</span>
            <h2>{rt.smallTitle}</h2>
            <p className="lead">{rt.smallText}</p>
            <div className="inlineActions">
              <button className="primaryBtn compact" onClick={() => goTo('book')}>{rt.startRequest}</button>
              <a className="secondaryBtn compact" href="tel:7734137489">{rt.callNumber}</a>
            </div>
          </div>
          <div className="problemList">
            {commonProblems.map((problem) => <div key={problem}><CheckCircle2 size={18} /> {problem}</div>)}
          </div>
        </div>
      </section>

      <section className="section light">
        <div className="wrap">
          <div className="sectionIntro centeredIntro">
            <span>{rt.whyLabel}</span>
            <h2>{rt.whyTitle}</h2>
          </div>
          <div className="trustGridExpanded">
            {repairTrust.map((item) => {
              const Icon = item.icon;
              return (
                <div className="trustItem cleanTrust" key={item.title}>
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

      <section className="section repairProcess">
        <div className="wrap">
          <div className="sectionIntro centeredIntro">
            <span>{rt.processLabel}</span>
            <h2>{rt.processTitle}</h2>
          </div>
          <div className="processSteps">
            {rt.steps.map(([number, title, text]) => <div key={number}><strong>{number}</strong><h3>{title}</h3><p>{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section ctaBand">
        <div className="wrap ctaPanel repairCtaPanel">
          <div>
            <span className="label">{rt.readyLabel}</span>
            <h2>{rt.ctaTitle}</h2>
            <p>{rt.ctaText}</p>
            <p><strong>CellzTech</strong><br />3412 N Harlem Ave STE A, Chicago, IL 60634</p>
          </div>
          <div className="ctaButtonsStack">
            <button className="primaryBtn" onClick={() => goTo('book')}>{rt.heroCta} <ArrowRight size={18} /></button>
            <a className="secondaryBtn" href="tel:7734137489">{rt.callNow}</a>
            <a className="secondaryBtn" href="https://maps.google.com/?q=3412+N+Harlem+Ave+STE+A+Chicago+IL+60634" target="_blank" rel="noreferrer">{rt.directions}</a>
          </div>
        </div>
      </section>
    </main>
  );
}


type BookingField = 'device' | 'series' | 'model' | 'issue' | 'name' | 'phone' | 'email' | 'requestedDate' | 'requestedTime' | 'notes';

const repairIssues = ['Cracked screen', 'Battery replacement', 'Charging port issue', 'Back glass', 'Camera issue', 'Speaker or microphone', 'Device will not turn on', 'Water damage', 'Data recovery', 'Software issue', 'Other / not sure'];

const issueTranslations: Record<string, Record<LanguageKey, string>> = {
  'Cracked screen': { en: 'Cracked screen', pl: 'Pęknięty ekran', es: 'Pantalla rota', uk: 'Розбитий екран' },
  'Battery replacement': { en: 'Battery replacement', pl: 'Wymiana baterii', es: 'Cambio de batería', uk: 'Заміна батареї' },
  'Charging port issue': { en: 'Charging port issue', pl: 'Problem z portem ładowania', es: 'Problema con el puerto de carga', uk: 'Проблема з портом заряджання' },
  'Back glass': { en: 'Back glass', pl: 'Tylna szybka', es: 'Cristal trasero', uk: 'Заднє скло' },
  'Camera issue': { en: 'Camera issue', pl: 'Problem z aparatem', es: 'Problema con la cámara', uk: 'Проблема з камерою' },
  'Speaker or microphone': { en: 'Speaker or microphone', pl: 'Głośnik lub mikrofon', es: 'Altavoz o micrófono', uk: 'Динамік або мікрофон' },
  'Device will not turn on': { en: 'Device will not turn on', pl: 'Urządzenie się nie włącza', es: 'El dispositivo no enciende', uk: 'Пристрій не вмикається' },
  'Water damage': { en: 'Water damage', pl: 'Zalanie', es: 'Daño por agua', uk: 'Пошкодження водою' },
  'Data recovery': { en: 'Data recovery', pl: 'Odzyskiwanie danych', es: 'Recuperación de datos', uk: 'Відновлення даних' },
  'Software issue': { en: 'Software issue', pl: 'Problem z oprogramowaniem', es: 'Problema de software', uk: 'Проблема з програмним забезпеченням' },
  'Other / not sure': { en: 'Other / not sure', pl: 'Inne / nie wiem', es: 'Otro / no estoy seguro', uk: 'Інше / не впевнений' }
};

const bookText: Record<LanguageKey, any> = {
  en: { eyebrow: 'Book repair', title: 'Book your repair.', intro: 'Choose your brand, model, issue, and preferred drop-off window. We will confirm the final schedule, pricing, and parts availability before you come in.', current: 'Current request', repairRequest: 'repair request', steps: ['Brand', 'Model', 'Issue', 'Contact', 'Send'], step: 'Step', brandTitle: 'What brand needs repair?', brandHint: 'Start with the device family. We support the major phone brands customers ask for most, plus an “Other” path when the model is not listed.', modelTitle: 'Find your model.', modelHint: 'Search, tap a popular model, or choose a series. We can identify the exact model in-store if you are not sure.', searchPlaceholder: 'Search model or model number', clear: 'Clear', searchResults: 'Search results', matching: 'matching models', selected: 'Selected', notListed: 'Device not listed', helpIdentify: 'We will help identify it', popular: 'Popular models', common: 'Most common', browse: 'Browse by series', chooseSeries: 'Choose a series', notSure: 'Not sure', issueTitle: 'What needs to be fixed?', issueHint: 'Choose the main issue. The visual panel will react to the selected problem.', contactTitle: 'Your contact details.', contactHint: 'Choose a preferred drop-off window during posted store hours. This is a request only — we will contact you to confirm the repair schedule.', name: 'Name', phone: 'Phone', email: 'Email', required: 'Required', date: 'Requested date', window: 'Preferred drop-off window', chooseWindow: 'Select an available store-hour window', chooseDate: 'Choose a date first', notes: 'Notes', notesPlaceholder: 'Example: Screen is cracked but touch still works.', consent: 'By sending this request, you agree that CellzTech / Cellz Repairz LLC may contact you about your repair request. This does not guarantee a confirmed appointment, repair price, part availability, or completion time.', finalTitle: 'Ready to send your repair request.', finalHint: 'This will send the request to CellzTech. We will contact you to confirm the drop-off window, price, and parts availability.', brand: 'Brand', series: 'Series', model: 'Model', issue: 'Issue', notSelected: 'Not selected', notProvided: 'Not provided', submit: 'Submit repair request', sending: 'Sending request...', textInstead: 'Text instead', callInstead: 'Call instead', backendNote: 'Your request is sent to CellzTech so we can review the device, issue, parts, and timing before confirming the repair details.', back: 'Back', next: 'Next step', startOver: 'Start over' },
  pl: { eyebrow: 'Zgłoszenie naprawy', title: 'Zgłoś naprawę.', intro: 'Wybierz markę, model, usterkę i preferowane okno oddania urządzenia. Przed wizytą potwierdzimy termin, cenę i dostępność części.', current: 'Aktualne zgłoszenie', repairRequest: 'zgłoszenie naprawy', steps: ['Marka', 'Model', 'Usterka', 'Kontakt', 'Wyślij'], step: 'Krok', brandTitle: 'Jaka marka wymaga naprawy?', brandHint: 'Zacznij od rodzaju urządzenia. Obsługujemy najpopularniejsze marki telefonów, a jeśli modelu nie ma na liście, wybierz ścieżkę „Inne”.', modelTitle: 'Znajdź swój model.', modelHint: 'Wyszukaj, wybierz popularny model albo serię. Jeśli nie masz pewności, pomożemy ustalić dokładny model w sklepie.', searchPlaceholder: 'Szukaj modelu lub numeru modelu', clear: 'Wyczyść', searchResults: 'Wyniki wyszukiwania', matching: 'pasujących modeli', selected: 'Wybrano', notListed: 'Urządzenia nie ma na liście', helpIdentify: 'Pomożemy je rozpoznać', popular: 'Popularne modele', common: 'Najczęstsze', browse: 'Przeglądaj według serii', chooseSeries: 'Wybierz serię', notSure: 'Nie wiem / nie mam pewności', issueTitle: 'Co trzeba naprawić?', issueHint: 'Wybierz główną usterkę. Panel wizualny dopasuje się do wybranego problemu.', contactTitle: 'Dane kontaktowe.', contactHint: 'Wybierz preferowane okno oddania urządzenia w godzinach pracy. To jest zgłoszenie — skontaktujemy się z Tobą, aby potwierdzić termin.', name: 'Imię i nazwisko', phone: 'Telefon', email: 'E-mail', required: 'Wymagane', date: 'Preferowana data', window: 'Preferowane okno oddania', chooseWindow: 'Wybierz dostępne okno w godzinach pracy', chooseDate: 'Najpierw wybierz datę', notes: 'Uwagi', notesPlaceholder: 'Przykład: Ekran jest pęknięty, ale dotyk działa.', consent: 'Wysyłając zgłoszenie, zgadzasz się, że CellzTech / Cellz Repairz LLC może skontaktować się z Tobą w sprawie naprawy. To nie gwarantuje potwierdzonej wizyty, ceny, dostępności części ani czasu ukończenia.', finalTitle: 'Gotowe do wysłania zgłoszenia.', finalHint: 'Zgłoszenie trafi do CellzTech. Skontaktujemy się, aby potwierdzić okno oddania, cenę i dostępność części.', brand: 'Marka', series: 'Seria', model: 'Model', issue: 'Usterka', notSelected: 'Nie wybrano', notProvided: 'Nie podano', submit: 'Wyślij zgłoszenie', sending: 'Wysyłanie zgłoszenia...', textInstead: 'Wyślij SMS', callInstead: 'Zadzwoń', backendNote: 'Zgłoszenie trafia do CellzTech, abyśmy mogli sprawdzić urządzenie, usterkę, części i termin przed potwierdzeniem szczegółów naprawy.', back: 'Wstecz', next: 'Dalej', startOver: 'Zacznij od nowa' },
  es: { eyebrow: 'Solicitud de reparación', title: 'Solicita tu reparación.', intro: 'Elige la marca, el modelo, el problema y una ventana preferida para dejar el equipo. Confirmaremos el horario, el precio y la disponibilidad de piezas antes de que vengas.', current: 'Solicitud actual', repairRequest: 'solicitud de reparación', steps: ['Marca', 'Modelo', 'Problema', 'Contacto', 'Enviar'], step: 'Paso', brandTitle: '¿Qué marca necesita reparación?', brandHint: 'Empieza con la familia del dispositivo. Atendemos las marcas más solicitadas y también tenemos una opción “Otro” si el modelo no aparece.', modelTitle: 'Encuentra tu modelo.', modelHint: 'Busca, toca un modelo popular o elige una serie. Si no estás seguro, podemos identificar el modelo exacto en la tienda.', searchPlaceholder: 'Buscar modelo o número de modelo', clear: 'Borrar', searchResults: 'Resultados de búsqueda', matching: 'modelos encontrados', selected: 'Seleccionado', notListed: 'Dispositivo no listado', helpIdentify: 'Te ayudaremos a identificarlo', popular: 'Modelos populares', common: 'Más comunes', browse: 'Buscar por serie', chooseSeries: 'Elige una serie', notSure: 'No estoy seguro', issueTitle: '¿Qué se necesita reparar?', issueHint: 'Elige el problema principal. El panel visual reaccionará al problema seleccionado.', contactTitle: 'Tus datos de contacto.', contactHint: 'Elige una ventana preferida para dejar el equipo durante el horario publicado. Es una solicitud; te contactaremos para confirmar.', name: 'Nombre', phone: 'Teléfono', email: 'Correo electrónico', required: 'Requerido', date: 'Fecha solicitada', window: 'Ventana preferida para dejar el equipo', chooseWindow: 'Selecciona una ventana disponible', chooseDate: 'Primero elige una fecha', notes: 'Notas', notesPlaceholder: 'Ejemplo: La pantalla está rota, pero el táctil funciona.', consent: 'Al enviar esta solicitud, aceptas que CellzTech / Cellz Repairz LLC pueda contactarte sobre tu reparación. Esto no garantiza una cita confirmada, precio, disponibilidad de piezas ni tiempo de finalización.', finalTitle: 'Listo para enviar tu solicitud.', finalHint: 'Esto enviará la solicitud a CellzTech. Te contactaremos para confirmar la ventana, el precio y la disponibilidad de piezas.', brand: 'Marca', series: 'Serie', model: 'Modelo', issue: 'Problema', notSelected: 'No seleccionado', notProvided: 'No proporcionado', submit: 'Enviar solicitud', sending: 'Enviando solicitud...', textInstead: 'Enviar texto', callInstead: 'Llamar', backendNote: 'Tu solicitud se envía a CellzTech para revisar el dispositivo, el problema, las piezas y el horario antes de confirmar los detalles.', back: 'Atrás', next: 'Siguiente', startOver: 'Empezar de nuevo' },
  uk: { eyebrow: 'Заявка на ремонт', title: 'Надішліть заявку на ремонт.', intro: 'Виберіть бренд, модель, проблему та зручне вікно для здачі пристрою. Перед вашим візитом ми підтвердимо час, ціну та наявність деталей.', current: 'Поточна заявка', repairRequest: 'заявка на ремонт', steps: ['Бренд', 'Модель', 'Проблема', 'Контакт', 'Надіслати'], step: 'Крок', brandTitle: 'Який бренд потребує ремонту?', brandHint: 'Почніть із типу пристрою. Ми підтримуємо найпопулярніші бренди, а якщо моделі немає в списку, виберіть “Інше”.', modelTitle: 'Знайдіть свою модель.', modelHint: 'Скористайтеся пошуком, виберіть популярну модель або серію. Якщо не впевнені, ми визначимо точну модель у магазині.', searchPlaceholder: 'Пошук моделі або номера моделі', clear: 'Очистити', searchResults: 'Результати пошуку', matching: 'збігів моделей', selected: 'Вибрано', notListed: 'Пристрою немає в списку', helpIdentify: 'Ми допоможемо визначити модель', popular: 'Популярні моделі', common: 'Найчастіші', browse: 'Перегляд за серією', chooseSeries: 'Виберіть серію', notSure: 'Не впевнений', issueTitle: 'Що потрібно відремонтувати?', issueHint: 'Виберіть основну проблему. Візуальна панель зміниться відповідно до вибраної несправності.', contactTitle: 'Ваші контактні дані.', contactHint: 'Виберіть зручне вікно для здачі пристрою в робочі години. Це заявка — ми зв’яжемося з вами для підтвердження.', name: 'Ім’я', phone: 'Телефон', email: 'Електронна пошта', required: 'Обов’язково', date: 'Бажана дата', window: 'Зручне вікно для здачі', chooseWindow: 'Виберіть доступне вікно', chooseDate: 'Спочатку виберіть дату', notes: 'Примітки', notesPlaceholder: 'Приклад: Екран розбитий, але сенсор працює.', consent: 'Надсилаючи заявку, ви погоджуєтеся, що CellzTech / Cellz Repairz LLC може зв’язатися з вами щодо ремонту. Це не гарантує підтвердженого запису, ціни, наявності деталей або часу виконання.', finalTitle: 'Готово до надсилання заявки.', finalHint: 'Заявка буде надіслана до CellzTech. Ми зв’яжемося з вами, щоб підтвердити час, ціну та наявність деталей.', brand: 'Бренд', series: 'Серія', model: 'Модель', issue: 'Проблема', notSelected: 'Не вибрано', notProvided: 'Не вказано', submit: 'Надіслати заявку', sending: 'Надсилання заявки...', textInstead: 'Надіслати SMS', callInstead: 'Зателефонувати', backendNote: 'Ваша заявка надсилається до CellzTech, щоб ми перевірили пристрій, проблему, деталі та час перед підтвердженням ремонту.', back: 'Назад', next: 'Далі', startOver: 'Почати спочатку' }
};

const storeHoursByDay = [
  { label: 'Sunday', closed: true, note: 'Closed' },
  { label: 'Monday', open: '11:00', close: '19:00', note: '11:00 AM - 7:00 PM' },
  { label: 'Tuesday', open: '11:00', close: '19:00', note: '11:00 AM - 7:00 PM' },
  { label: 'Wednesday', open: '11:00', close: '19:00', note: '11:00 AM - 7:00 PM' },
  { label: 'Thursday', open: '11:00', close: '19:00', note: '11:00 AM - 7:00 PM' },
  { label: 'Friday', open: '11:00', close: '19:00', note: '11:00 AM - 7:00 PM' },
  { label: 'Saturday', open: '11:00', close: '15:00', note: '11:00 AM - 3:00 PM' }
] as const;

function localDateFromInput(value: string) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function minutesFromTime(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  return (hours * 60) + (minutes || 0);
}

function timeFromMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function formatTimeLabel(value: string) {
  const [hourText, minuteText] = value.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText || 0);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`;
}

function formatTimeWindowLabel(value: string) {
  const start = minutesFromTime(value);
  const end = start + 30;
  return `${formatTimeLabel(value)} - ${formatTimeLabel(timeFromMinutes(end))}`;
}

function getBookingTimeSlots(dateValue: string) {
  const date = localDateFromInput(dateValue);
  if (!date) return [];
  const dayHours = storeHoursByDay[date.getDay()];
  if ('closed' in dayHours && dayHours.closed) return [];
  if (!('open' in dayHours) || !dayHours.open || !dayHours.close) return [];

  const open = minutesFromTime(dayHours.open);
  const close = minutesFromTime(dayHours.close);
  const lastSlot = close - 30;
  const slots: { value: string; label: string }[] = [];

  for (let minutes = open; minutes <= lastSlot; minutes += 30) {
    const value = timeFromMinutes(minutes);
    slots.push({ value, label: formatTimeWindowLabel(value) });
  }

  return slots;
}

function getStoreHoursNote(dateValue: string) {
  const date = localDateFromInput(dateValue);
  if (!date) return 'Choose a date to see available request windows. Store hours: Mon-Fri 11:00 AM-7:00 PM, Sat 11:00 AM-3:00 PM, Sun closed.';
  const dayHours = storeHoursByDay[date.getDay()];
  return `${dayHours.label}: ${dayHours.note}. Times are request windows and still need confirmation from CellzTech.`;
}

function todayInputValue() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getIssueVisual(issue: string) {
  const lower = issue.toLowerCase();
  if (lower.includes('screen')) return 'screen';
  if (lower.includes('battery')) return 'battery';
  if (lower.includes('charging')) return 'charging';
  if (lower.includes('back glass')) return 'glass';
  if (lower.includes('camera')) return 'camera';
  if (lower.includes('speaker') || lower.includes('microphone')) return 'audio';
  if (lower.includes('water')) return 'water';
  if (lower.includes('data')) return 'data';
  if (lower.includes('turn on')) return 'power';
  if (lower.includes('software')) return 'software';
  if (lower.includes('other') || lower.includes('not sure')) return 'other';
  return 'default';
}

function BookingVisual({ issue }: { issue: string }) {
  const visual = getIssueVisual(issue);
  return (
    <div className={`bookingVisual ${visual}`} aria-hidden="true">
      <div className="deviceFrame">
        <div className="deviceSpeaker" />
        <div className="deviceScreen">
          {visual === 'screen' && <div className="crackLayer"><span /><span /><span /><span /><span /></div>}
          {visual === 'battery' && <div className="batteryLayer"><div><span /></div><p>LOW BATTERY</p></div>}
          {visual === 'charging' && <div className="chargingLayer"><Plug size={62} /><X size={44} /></div>}
          {visual === 'glass' && <div className="glassLayer"><span /><span /><span /></div>}
          {visual === 'camera' && (
            <div className="cameraLayer">
              <div className="miniCameraModule">
                <span className="miniCameraLens" />
                <span className="miniCameraLens" />
                <span className="miniCameraLens" />
                <span className="miniCameraFlash" />
              </div>
              <span className="miniFocusRing" />
              <span className="miniFocusCrosshair" />
            </div>
          )}
          {visual === 'audio' && (
            <div className="audioLayer">
              <div className="miniAudioBadge">
                <Mic size={46} strokeWidth={1.9} />
                <span />
              </div>
              <div className="miniAudioBars">
                <span /><span /><span /><span /><span />
              </div>
            </div>
          )}
          {visual === 'water' && (
            <div className="waterLayer">
              <div className="miniWaterPhone">
                <span className="miniWaterSpeaker" />
                <span className="miniWaterCondensation" />
                <span className="miniWaterStreak miniWaterStreakOne" />
                <span className="miniWaterStreak miniWaterStreakTwo" />
                <div className="miniWaterDroplets">
                  {Array.from({ length: 6 }).map((_, index) => <span key={index} />)}
                </div>
                <span className="miniWaterDrop miniWaterDropOne" />
                <span className="miniWaterDrop miniWaterDropTwo" />
                <span className="miniWaterDrop miniWaterDropThree" />
                <span className="miniWaterWave" />
              </div>
            </div>
          )}
          {visual === 'data' && (
            <div className="dataLayer">
              <div className="miniDataPanel">
                <span className="miniDataGlow" />
                <div className="miniDataGrid">
                  <span /><span /><span />
                  <span /><span /><span />
                </div>
                <div className="miniDataSearch">
                  <Search size={34} strokeWidth={2.1} />
                  <span className="miniDataHandle" />
                </div>
              </div>
              <div className="miniDataTrail">
                <span /><span /><span /><span /><span />
              </div>
            </div>
          )}
          {visual === 'software' && (
            <div className="softwareLayer">
              <div className="miniSoftwarePanel">
                <span className="miniSoftwareGlow" />
                <div className="miniSoftwareHeader">
                  <span /><span /><span />
                </div>
                <div className="miniSoftwareCode">
                  <span /><span /><span /><span />
                </div>
                <div className="miniSoftwareNodes">
                  <span /><span /><span /><span />
                </div>
                <span className="miniSoftwareAlert">!</span>
              </div>
            </div>
          )}
          {visual === 'other' && (
            <div className="otherLayer">
              <div className="miniOtherPanel">
                <span className="miniOtherGlow" />
                <span className="miniOtherRing" />
                <span className="miniOtherQuestion">?</span>
                <div className="miniOtherDots">
                  <span /><span /><span /><span />
                </div>
              </div>
              <div className="miniOtherTrail">
                <span /><span /><span />
              </div>
            </div>
          )}
          {visual === 'power' && (
            <div className="powerLayer">
              <div className="miniPowerBadge">
                <span className="miniPowerRing" />
                <span className="miniPowerStem" />
                <span className="miniPowerSlash" />
              </div>
              <div className="miniPowerBars">
                <span /><span /><span /><span />
              </div>
            </div>
          )}
          {visual === 'default' && <div className="defaultLayer"><Wrench size={70} /><p>Repair request</p></div>}
        </div>
        <div className="deviceHome" />
      </div>
      <div className="visualCopy">
        <span>{issue || 'Choose a repair issue'}</span>
        <strong>{issue ? 'We will include this in your repair request.' : 'The background reacts to the issue you select.'}</strong>
      </div>
    </div>
  );
}

function BookRepairPage({ lang }: { lang: LanguageKey }) {
  const b = bookText[lang];
  const [step, setStep] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [booking, setBooking] = useState<Record<BookingField, string>>({
    device: 'Apple',
    series: 'iPhone',
    model: '',
    issue: '',
    name: '',
    phone: '',
    email: '',
    requestedDate: '',
    requestedTime: '',
    notes: ''
  });

  const [modelSearch, setModelSearch] = useState('');

  const selectedBrand = useMemo(() => deviceCatalog.find((brand) => brand.brand === booking.device) || deviceCatalog[0], [booking.device]);
  const selectedSeries = useMemo(() => selectedBrand.series.find((series) => series.name === booking.series) || selectedBrand.series[0], [booking.series, selectedBrand]);
  const modelSearchTerm = modelSearch.trim().toLowerCase();
  const visibleModels = useMemo(() => {
    const source = modelSearchTerm
      ? selectedBrand.series.flatMap((series) => series.models.map((model) => ({ model, series: series.name })))
      : (selectedSeries?.models || []).map((model) => ({ model, series: selectedSeries?.name || '' }));

    if (!modelSearchTerm) return source;

    return source.filter(({ model, series }) => {
      const haystack = `${selectedBrand.brand} ${series} ${model}`.toLowerCase();
      return haystack.includes(modelSearchTerm);
    });
  }, [modelSearchTerm, selectedBrand, selectedSeries]);

  const popularModels = useMemo(() => {
    const preferred: Record<string, string[]> = {
      Apple: ['iPhone 17 Pro Max', 'iPhone 16 Pro Max', 'iPhone 15 Pro Max', 'iPhone 14 Pro Max', 'iPhone 13', 'iPhone 12'],
      Samsung: ['Galaxy S24 Ultra', 'Galaxy S23 Ultra', 'Galaxy S22 Ultra', 'A15 5G (A156 / 2023)', 'A14 5G (A146 / 2023)', 'Galaxy Z Flip 5 5G'],
      Motorola: ['G Stylus 5G (XT2517 / 2025)', 'G Power (XT2515 / 2025)', 'G 5G (XT2513 / 2025)', 'G Power 5G (XT2415 / 2024)', 'G Stylus 5G (XT2419 / 2024)', 'Razr 50 Ultra, Razr Plus (XT2451 / 2024)'],
      'Google Pixel': ['Pixel 10 Pro XL', 'Pixel 10 Pro', 'Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 8 Pro', 'Pixel 8'],
      'Other / not sure': ['Other phone / not sure', 'Other tablet / not sure', 'Device not listed']
    };

    const allModels = selectedBrand.series.flatMap((series) => series.models.map((model) => ({ model, series: series.name })));
    const preferredNames = preferred[selectedBrand.brand] || [];
    const preferredMatches = preferredNames
      .map((name) => allModels.find((item) => item.model === name))
      .filter(Boolean) as { model: string; series: string }[];

    const fallback = allModels.filter((item) => !preferredMatches.some((match) => match.model === item.model)).slice(0, 6 - preferredMatches.length);
    return [...preferredMatches, ...fallback].slice(0, 6);
  }, [selectedBrand]);

  const selectBrand = (brandName: string) => {
    const brand = deviceCatalog.find((item) => item.brand === brandName) || deviceCatalog[0];
    setBooking((current) => ({
      ...current,
      device: brand.brand,
      series: brand.series[0]?.name || '',
      model: ''
    }));
    setModelSearch('');
  };

  const selectSeries = (seriesName: string) => {
    setBooking((current) => ({ ...current, series: seriesName, model: '' }));
    setModelSearch('');
  };

  const selectModel = (model: string, seriesName?: string) => {
    setBooking((current) => ({ ...current, series: seriesName || current.series, model }));
  };

  const setField = (field: BookingField, value: string) => {
    setBooking((current) => ({ ...current, [field]: value }));
  };

  const requestedTimeSlots = useMemo(() => getBookingTimeSlots(booking.requestedDate), [booking.requestedDate]);
  const storeHoursNote = useMemo(() => getStoreHoursNote(booking.requestedDate), [booking.requestedDate]);
  const minimumRequestDate = useMemo(() => todayInputValue(), []);

  const setRequestedDate = (value: string) => {
    const nextSlots = getBookingTimeSlots(value);
    setBooking((current) => ({
      ...current,
      requestedDate: value,
      requestedTime: nextSlots.some((slot) => slot.value === current.requestedTime) ? current.requestedTime : ''
    }));
  };

  const visualType = getIssueVisual(booking.issue);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email.trim());
  const hasContactDetails = !!(booking.name.trim() && booking.phone.trim() && isEmailValid && booking.requestedDate && booking.requestedTime);
  const requestedTimeLabel = booking.requestedTime ? formatTimeWindowLabel(booking.requestedTime) : '';
  const requestedDateTime = booking.requestedDate && booking.requestedTime ? `${booking.requestedDate} at ${requestedTimeLabel}` : 'Not provided';
  const requestMessage = `Hi CellzTech, I would like to start a repair request.

Device: ${booking.device || 'Not selected'}
Series: ${booking.series || 'Not selected'}
Model: ${booking.model || 'Not selected'}
Issue: ${booking.issue || 'Not selected'}
Requested date/time: ${requestedDateTime}

Name: ${booking.name || 'Not provided'}
Phone: ${booking.phone || 'Not provided'}
Email: ${booking.email || 'Not provided'}
Notes: ${booking.notes || 'None'}

I understand this is a repair request and CellzTech will contact me to confirm the time, price, parts, and availability.`;
  const smsLink = `sms:7734137489?&body=${encodeURIComponent(requestMessage)}`;
  const canSubmit = !!(booking.model && booking.issue && hasContactDetails);

  const submitRepairRequest = async () => {
    if (!canSubmit || submissionStatus === 'sending') return;

    setSubmissionStatus('sending');
    setSubmissionMessage('Sending your repair request...');

    try {
      const response = await fetch('/api/repair-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...booking,
          requestedDateTime,
          requestedTimeLabel,
          source: 'CellzTech website'
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'The repair request could not be sent online yet.');
      }

      setSubmissionStatus('sent');
      setSubmissionMessage(result.message || 'Repair request sent. We will contact you to confirm the date, time, parts, and pricing.');
    } catch (error) {
      setSubmissionStatus('error');
      setSubmissionMessage(error instanceof Error ? error.message : 'We could not send the online request yet. Please use the text fallback or call the store.');
    }
  };

  const steps = [
    { label: b.steps[0], done: !!booking.device },
    { label: b.steps[1], done: !!booking.model },
    { label: b.steps[2], done: !!booking.issue },
    { label: b.steps[3], done: hasContactDetails },
    { label: b.steps[4], done: canSubmit }
  ];

  const canGoNext =
    step === 0 ? !!booking.device :
    step === 1 ? !!booking.model :
    step === 2 ? !!booking.issue :
    step === 3 ? hasContactDetails :
    true;

  const goNext = () => { if (canGoNext) setStep((current) => Math.min(current + 1, steps.length - 1)); };
  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  return (
    <main className="pageMain bookingPage bookingSlidePage">
      <section className={`bookingSingleHero ambient-${visualType}`}>
        <div className="issueAmbient" aria-hidden="true">{Array.from({ length: 17 }).map((_, index) => <span key={index} />)}</div>
        {visualType === 'battery' && (
          <div className="batteryDrainOverlay" key={`battery-drain-${booking.issue}`} aria-hidden="true">
            <div className="batteryGhost batteryGhostOne">
              <span className="batteryCap" />
              <span className="batteryFill" />
              <span className="batteryBolt">!</span>
            </div>
            <div className="batteryGhost batteryGhostTwo">
              <span className="batteryCap" />
              <span className="batteryFill" />
              <span className="batteryBolt">!</span>
            </div>
            <div className="batteryDrainLines">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="batteryWarningPulse" />
          </div>
        )}
        {visualType === 'charging' && (
          <div className="chargingFailOverlay" key={`charging-fail-${booking.issue}`} aria-hidden="true">
            <div className="chargingPhoneGhost">
              <span className="chargingPhoneSpeaker" />
              <span className="chargingPhonePort" />
              <span className="chargingPhoneReflection" />
            </div>
            <div className="chargingCableGhost">
              <span className="chargingCableLine" />
              <span className="chargingCableHead">
                <span className="chargingCableMetal" />
              </span>
            </div>
            <div className="chargingErrorSignal">
              <span className="chargingErrorBolt">⚡</span>
              <span className="chargingErrorSlash" />
            </div>
            <div className="chargingFailRipples">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        {visualType === 'audio' && (
          <div className="audioIssueOverlay" key={`audio-issue-${booking.issue}`} aria-hidden="true">
            <div className="audioPhoneGhost">
              <span className="audioPhoneInner" />
              <span className="audioPhoneSpeaker" />
              <span className="audioPhonePort" />
              <span className="audioPhoneReflection" />
              <div className="audioMicBadge">
                <Mic size={88} strokeWidth={1.8} />
                <span className="audioMicSlash" />
              </div>
              <div className="audioWaveRings">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="audioSignalLine">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="audioFloorRings">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        {visualType === 'data' && (
          <div className="dataRecoveryOverlay" key={`data-recovery-${booking.issue}`} aria-hidden="true">
            <div className="dataBinaryCloud">
              <span>010101</span>
              <span>RECOVER</span>
              <span>110010</span>
            </div>
            <div className="dataPhoneGhost">
              <span className="dataPhoneSpeaker" />
              <span className="dataPhoneReflection" />
              <div className="dataChipCore">
                <span className="dataChipInner" />
                <div className="dataBlockGrid">
                  {Array.from({ length: 9 }).map((_, index) => <span key={index} />)}
                </div>
                <div className="dataScanLens">
                  <Search size={62} strokeWidth={1.9} />
                  <span className="dataScanHandle" />
                  <span className="dataScanPing" />
                </div>
              </div>
              <div className="dataRecoveryBars">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="dataTransferRail">
              <span className="dataTransferLine" />
              <div className="dataPackets">
                <span /><span /><span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {visualType === 'software' && (
          <div className="softwareIssueOverlay" key={`software-issue-${booking.issue}`} aria-hidden="true">
            <div className="softwareStreamText">
              <span>SYSTEM</span>
              <span>PATCH</span>
              <span>ERROR</span>
            </div>
            <div className="softwarePhoneGhost">
              <span className="softwarePhoneSpeaker" />
              <span className="softwarePhoneReflection" />
              <div className="softwareWindow">
                <div className="softwareWindowHeader">
                  <span /><span /><span />
                </div>
                <div className="softwareCodeRows">
                  <span /><span /><span /><span /><span />
                </div>
                <div className="softwareNodeGrid">
                  {Array.from({ length: 6 }).map((_, index) => <span key={index} />)}
                </div>
                <span className="softwareWarningDot">!</span>
              </div>
              <div className="softwarePulseRings">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="softwareScanWave">
              <span /><span /><span /><span /><span />
            </div>
          </div>
        )}

        {visualType === 'other' && (
          <div className="otherIssueOverlay" key={`other-issue-${booking.issue}`} aria-hidden="true">
            <div className="otherOrbitLabels">
              <span>CHECK</span>
              <span>DIAGNOSE</span>
              <span>HELP</span>
            </div>
            <div className="otherPhoneGhost">
              <span className="otherPhoneSpeaker" />
              <span className="otherPhoneReflection" />
              <div className="otherQuestionCore">
                <span className="otherQuestionRing" />
                <span className="otherQuestionMark">?</span>
                <div className="otherQuestionPulse">
                  <span />
                  <span />
                </div>
              </div>
              <div className="otherOptionNodes">
                {Array.from({ length: 6 }).map((_, index) => <span key={index} />)}
              </div>
            </div>
            <div className="otherSearchSweep">
              <span className="otherSearchLine" />
              <div className="otherPackets">
                <span /><span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {visualType === 'power' && (
          <div className="powerIssueOverlay" key={`power-issue-${booking.issue}`} aria-hidden="true">
            <div className="powerPhoneGhost">
              <span className="powerPhoneScreen" />
              <span className="powerPhoneSpeaker" />
              <span className="powerPhonePort" />
              <div className="powerSymbol">
                <span className="powerSymbolRing" />
                <span className="powerSymbolStem" />
                <span className="powerSymbolSlash" />
              </div>
              <div className="powerRippleSet">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="powerFlatline">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {visualType === 'water' && (
          <div className="waterDamageOverlay" key={`water-damage-${booking.issue}`} aria-hidden="true">
            <div className="waterPhoneGhost">
              <span className="waterPhoneSpeaker" />
              <span className="waterPhoneCondensation" />
              <span className="waterPhoneReflection" />
              <span className="waterPhoneStreak waterPhoneStreakOne" />
              <span className="waterPhoneStreak waterPhoneStreakTwo" />
              <span className="waterPhoneWave" />
              <div className="waterBubbleField">
                {Array.from({ length: 6 }).map((_, index) => <span key={index} />)}
              </div>
              <div className="waterDropField">
                {Array.from({ length: 12 }).map((_, index) => <span key={index} />)}
              </div>
            </div>
            <div className="outerWaterDrops">
              {Array.from({ length: 6 }).map((_, index) => <span key={index} />)}
            </div>
            <div className="waterSplashRings">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {visualType === 'screen' && (
          <div className="screenShatterOverlay" key={`screen-shatter-${booking.issue}`} aria-hidden="true">
            <svg viewBox="0 0 1440 760" preserveAspectRatio="none">
              <defs>
                <filter id="shatterGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g className="shatterVeil">
                <polygon points="610,290 688,330 650,405 545,420" />
                <polygon points="688,330 845,255 815,410 650,405" />
                <polygon points="650,405 815,410 915,560 690,515" />
                <polygon points="545,420 650,405 690,515 445,610" />
                <polygon points="610,290 545,420 365,330 510,205" />
                <polygon points="845,255 1035,170 970,390 815,410" />
              </g>
              <g className="impactRings">
                <circle cx="650" cy="390" r="38" />
                <circle cx="650" cy="390" r="72" />
              </g>
              <g className="primaryCracks" filter="url(#shatterGlow)">
                <path d="M650 390 L515 184 L425 72" />
                <path d="M650 390 L815 142 L1030 40" />
                <path d="M650 390 L1055 315 L1405 225" />
                <path d="M650 390 L1040 558 L1325 710" />
                <path d="M650 390 L690 610 L760 760" />
                <path d="M650 390 L470 595 L285 760" />
                <path d="M650 390 L330 455 L0 520" />
                <path d="M650 390 L315 245 L0 112" />
              </g>
              <g className="branchCracks">
                <path d="M515 184 L610 155 L672 58" />
                <path d="M540 220 L450 230 L390 160" />
                <path d="M815 142 L785 250 L875 310" />
                <path d="M960 75 L925 178 L1005 205" />
                <path d="M1055 315 L1125 385 L1248 382" />
                <path d="M1110 300 L1185 245 L1295 248" />
                <path d="M1040 558 L1120 535 L1195 590" />
                <path d="M960 520 L985 635 L1085 678" />
                <path d="M690 610 L610 650 L585 740" />
                <path d="M470 595 L500 690 L420 725" />
                <path d="M330 455 L260 385 L160 395" />
                <path d="M315 245 L250 275 L175 225" />
                <path d="M650 390 L592 340 L555 298" />
                <path d="M650 390 L715 362 L770 342" />
                <path d="M650 390 L615 455 L590 505" />
                <path d="M650 390 L720 470 L790 498" />
              </g>
              <g className="microCracks">
                <path d="M565 315 L590 305 L612 274" />
                <path d="M740 330 L785 292 L842 286" />
                <path d="M755 455 L828 468 L875 525" />
                <path d="M570 480 L505 520 L485 585" />
                <path d="M600 382 L528 375 L465 408" />
                <path d="M698 386 L760 382 L825 360" />
              </g>
            </svg>
          </div>
        )}

        {visualType === 'camera' && (
          <div className="cameraIssueOverlay" key={`camera-issue-${booking.issue}`} aria-hidden="true">
            <svg viewBox="0 0 1440 760" preserveAspectRatio="none">
              <defs>
                <radialGradient id="cameraLensGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,.74)" />
                  <stop offset="42%" stopColor="rgba(56,189,248,.32)" />
                  <stop offset="100%" stopColor="rgba(15,23,42,.08)" />
                </radialGradient>
                <filter id="cameraSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g className="cameraPhoneBody">
                <rect x="88" y="116" width="435" height="560" rx="76" />
                <rect x="126" y="158" width="184" height="184" rx="46" className="cameraBumpLarge" />
                <circle cx="184" cy="216" r="38" className="cameraLensLarge" />
                <circle cx="250" cy="282" r="38" className="cameraLensLarge" />
                <circle cx="184" cy="282" r="38" className="cameraLensLarge" />
                <circle cx="252" cy="216" r="15" className="cameraFlashLarge" />
                <circle cx="286" cy="248" r="11" className="cameraSensorLarge" />
              </g>
              <g className="cameraFocusBox" filter="url(#cameraSoftGlow)">
                <path d="M760 224 h-118 v118" />
                <path d="M995 224 h118 v118" />
                <path d="M760 536 h-118 v-118" />
                <path d="M995 536 h118 v-118" />
                <circle cx="878" cy="380" r="98" />
                <circle cx="878" cy="380" r="44" />
              </g>
              <g className="cameraWarning">
                <path d="M842 380 h72" />
                <path d="M878 344 v72" />
                <path d="M785 285 L972 478" />
              </g>
              <g className="cameraScanLines">
                <path d="M620 180 H1165" />
                <path d="M620 280 H1165" />
                <path d="M620 480 H1165" />
                <path d="M620 580 H1165" />
              </g>
              <g className="cameraDust">
                <circle cx="680" cy="305" r="4" />
                <circle cx="1040" cy="255" r="5" />
                <circle cx="1110" cy="470" r="3.5" />
                <circle cx="735" cy="535" r="3" />
                <circle cx="960" cy="610" r="4" />
              </g>
            </svg>
          </div>
        )}

        {visualType === 'glass' && (
          <div className="backGlassOverlay" key={`back-glass-${booking.issue}`} aria-hidden="true">
            <svg viewBox="0 0 1440 760" preserveAspectRatio="none">
              <defs>
                <linearGradient id="backGlassGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(186,230,253,.30)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,.08)" />
                </linearGradient>
                <filter id="backGlassBlur" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g className="glassPhoneBody">
                <rect x="84" y="126" rx="72" ry="72" width="430" height="545" />
                <rect x="122" y="168" rx="52" ry="52" width="140" height="140" className="cameraBump" />
                <circle cx="168" cy="214" r="29" className="cameraLens" />
                <circle cx="228" cy="274" r="29" className="cameraLens" />
                <circle cx="168" cy="274" r="29" className="cameraLens" />
                <circle cx="228" cy="214" r="14" className="cameraFlash" />
                <circle cx="258" cy="244" r="11" className="cameraSensor" />
                <circle cx="165" cy="625" r="4" className="bodyMark" />
                <circle cx="205" cy="625" r="4" className="bodyMark" />
                <circle cx="245" cy="625" r="4" className="bodyMark" />
              </g>
              <g className="glassImpactHalo">
                <circle cx="405" cy="470" r="28" />
                <circle cx="405" cy="470" r="56" />
              </g>
              <g className="glassShards">
                <polygon points="364,432 438,446 428,520 352,504" />
                <polygon points="432,449 500,420 548,486 428,520" />
                <polygon points="352,504 428,520 402,606 320,580" />
                <polygon points="404,520 486,548 452,628 392,604" />
              </g>
              <g className="glassCracksPrimary" filter="url(#backGlassBlur)">
                <path d="M405 470 L300 348 L218 232" />
                <path d="M405 470 L465 324 L510 188" />
                <path d="M405 470 L542 474 L725 458" />
                <path d="M405 470 L515 584 L658 700" />
                <path d="M405 470 L330 590 L255 668" />
                <path d="M405 470 L232 490 L64 522" />
              </g>
              <g className="glassCracksBranch">
                <path d="M300 348 L342 320 L354 270" />
                <path d="M280 388 L214 372 L168 402" />
                <path d="M465 324 L434 272 L460 222" />
                <path d="M510 188 L478 214 L446 182" />
                <path d="M542 474 L600 432 L686 430" />
                <path d="M575 472 L628 522 L705 532" />
                <path d="M515 584 L560 614 L598 664" />
                <path d="M330 590 L358 650 L334 704" />
                <path d="M232 490 L188 448 L132 446" />
                <path d="M405 470 L356 438 L320 444" />
                <path d="M405 470 L450 458 L490 430" />
                <path d="M405 470 L424 516 L454 548" />
              </g>
              <g className="glassCracksMicro">
                <path d="M376 452 L350 430 L326 432" />
                <path d="M430 446 L468 436 L496 418" />
                <path d="M434 516 L466 536 L486 566" />
                <path d="M374 530 L346 558 L344 594" />
                <path d="M417 400 L428 368 L454 346" />
              </g>
              <g className="glassDust">
                <circle cx="565" cy="468" r="4" />
                <circle cx="602" cy="438" r="3" />
                <circle cx="622" cy="498" r="3" />
                <circle cx="475" cy="632" r="3.5" />
                <circle cx="518" cy="662" r="2.5" />
              </g>
            </svg>
          </div>
        )}
        <div className="wrap bookingShell">
          <div className="bookingTopline">
            <div>
              <div className="eyebrow"><Wrench size={15} /> {b.eyebrow}</div>
              <h1>{b.title}</h1>
              <p>{b.intro}</p>
            </div>
            <div className="bookingMiniSummary">
              <span>{b.current}</span>
              <strong>{booking.model || booking.series || booking.device}</strong>
              <small>{booking.issue ? issueTranslations[booking.issue]?.[lang] || booking.issue : `${booking.device} ${b.repairRequest}`}</small>
            </div>
          </div>

          <div className="stepTracker" aria-label="Repair request progress">
            {steps.map((item, index) => (
              <button key={item.label} className={`${index === step ? 'active' : ''} ${item.done ? 'done' : ''}`} onClick={() => setStep(index)} type="button">
                <span>{index + 1}</span>{item.label}
              </button>
            ))}
          </div>

          <div className="bookingStage">
            <div className={`bookingSlideCard bookingStepCard-${step + 1}`}> 
              <div className="slideFrame dynamicSlideFrame">
                <section className={step === 0 ? 'slidePanel activeSlidePanel' : 'slidePanel'}>
                  <span className="slideStep">{b.step} 1</span>
                  <h2>{b.brandTitle}</h2>
                  <p className="slideHint">{b.brandHint}</p>
                  <div className="brandGrid">
                    {deviceCatalog.map((brand) => (
                      <button type="button" key={brand.brand} className={booking.device === brand.brand ? 'brandChoice selected' : 'brandChoice'} onClick={() => selectBrand(brand.brand)}>
                        <span className="brandIcon"><Smartphone size={22} /></span>
                        <strong>{brand.label}</strong>
                        <small>{brand.description}</small>
                        <em>{getBrandTotalModels(brand)} {lang === 'en' ? 'models' : lang === 'pl' ? 'modeli' : lang === 'es' ? 'modelos' : 'моделей'}</em>
                      </button>
                    ))}
                  </div>
                </section>

                <section className={step === 1 ? 'slidePanel catalogSlide guidedCatalogSlide modelFitSlide activeSlidePanel' : 'slidePanel catalogSlide guidedCatalogSlide modelFitSlide'}>
                  <div className="modelFitHeader">
                    <div>
                      <span className="slideStep">{b.step} 2</span>
                      <h2>{b.modelTitle}</h2>
                    </div>
                    <p className="slideHint">{b.modelHint}</p>
                  </div>

                  <label className="modelFitSearch">
                    <Search size={20} />
                    <input value={modelSearch} onChange={(e) => setModelSearch(e.target.value)} placeholder={`${b.searchPlaceholder}`}  />
                    {modelSearchTerm && <button type="button" onClick={() => setModelSearch('')}>{b.clear}</button>}
                  </label>

                  {modelSearchTerm ? (
                    <section className="modelFitResultsOnly">
                      <div className="modelFitSectionHeader">
                        <span>{b.searchResults}</span>
                        <strong>{visibleModels.length} {b.matching}</strong>
                        {booking.model && <em>{b.selected}: {booking.model}</em>}
                      </div>
                      <div className="modelFitModelGrid searchMode">
                        {visibleModels.slice(0, 12).map(({ model, series }) => (
                          <button type="button" key={`${series}-${model}`} className={booking.model === model && booking.series === series ? 'modelFitChoice selected' : 'modelFitChoice'} onClick={() => selectModel(model, series)}>
                            <span>{model}</span>
                            <small>{series}</small>
                          </button>
                        ))}
                        {!visibleModels.length && (
                          <button type="button" className="modelFitChoice selected" onClick={() => selectModel('Device not listed', selectedBrand.series[0]?.name)}>
                            <span>{b.notListed}</span>
                            <small>{b.helpIdentify}</small>
                          </button>
                        )}
                      </div>
                    </section>
                  ) : (
                    <div className="modelFitLayout">
                      <section className="modelFitPopular">
                        <div className="modelFitSectionHeader">
                          <span>{b.popular}</span>
                          <strong>{b.common}</strong>
                          <small>{selectedBrand.label}</small>
                        </div>
                        <div className="modelFitPopularGrid">
                          {popularModels.map(({ model, series }) => (
                            <button type="button" key={`popular-${series}-${model}`} className={booking.model === model && booking.series === series ? 'modelFitChoice selected' : 'modelFitChoice'} onClick={() => selectModel(model, series)}>
                              <span>{model}</span>
                              <small>{series}</small>
                            </button>
                          ))}
                        </div>
                      </section>

                      <section className="modelFitBrowse">
                        <div className="modelFitSectionHeader">
                          <span>{b.browse}</span>
                          <strong>{selectedSeries?.name || b.chooseSeries}</strong>
                          {booking.model && <em>{b.selected}: {booking.model}</em>}
                        </div>
                        <div className="modelFitSeriesPills">
                          {selectedBrand.series.map((series) => (
                            <button type="button" key={series.name} className={booking.series === series.name ? 'selected' : ''} onClick={() => selectSeries(series.name)}>
                              {series.name}
                            </button>
                          ))}
                        </div>
                        <div className="modelFitModelGrid">
                          {visibleModels.slice(0, 4).map(({ model, series }) => (
                            <button type="button" key={`${series}-${model}`} className={booking.model === model && booking.series === series ? 'modelFitChoice selected' : 'modelFitChoice'} onClick={() => selectModel(model, series)}>
                              <span>{model}</span>
                              <small>{selectedBrand.shortLabel}</small>
                            </button>
                          ))}
                        </div>
                      </section>
                    </div>
                  )}

                  <button type="button" className="modelFitNotSure" onClick={() => selectModel('Device not listed', selectedBrand.series[0]?.name)}>
                    {b.notSure || (lang === 'pl' ? 'Nie wiem / nie mam pewności' : lang === 'es' ? 'No estoy seguro' : lang === 'uk' ? 'Не впевнений' : 'Not sure')}
                  </button>
                </section>

                <section className={step === 2 ? 'slidePanel activeSlidePanel' : 'slidePanel'}>
                  <span className="slideStep">{b.step} 3</span>
                  <h2>{b.issueTitle}</h2>
                  <p className="slideHint">{b.issueHint}</p>
                  <div className="issueGrid compactIssueGrid">
                    {repairIssues.map((issue) => (
                      <button type="button" key={issue} className={booking.issue === issue ? 'issueChoice selected' : 'issueChoice'} onClick={() => setField('issue', issue)}>{issueTranslations[issue]?.[lang] || issue}</button>
                    ))}
                  </div>
                </section>

                <section className={step === 3 ? 'slidePanel activeSlidePanel' : 'slidePanel'}>
                  <span className="slideStep">{b.step} 4</span>
                  <h2>{b.contactTitle}</h2>
                  <p className="slideHint">{b.contactHint}</p>
                  <div className="formGrid slideFormGrid">
                    <label><span className="fieldLabel">{b.name} <span className="requiredTag">{b.required}</span></span><input value={booking.name} onChange={(e) => setField('name', e.target.value)} placeholder={b.name} required /></label>
                    <label><span className="fieldLabel">{b.phone} <span className="requiredTag">{b.required}</span></span><input value={booking.phone} onChange={(e) => setField('phone', e.target.value)} placeholder={b.phone} required /></label>
                    <label><span className="fieldLabel">{b.email} <span className="requiredTag">{b.required}</span></span><input type="email" value={booking.email} onChange={(e) => setField('email', e.target.value)} placeholder="you@example.com" required /></label>
                    <label><span className="fieldLabel">{b.date} <span className="requiredTag">{b.required}</span></span><input type="date" min={minimumRequestDate} value={booking.requestedDate} onChange={(e) => setRequestedDate(e.target.value)} required /></label>
                    <label className="fullField bookingTimeField">
                      <span className="fieldLabel">{b.window} <span className="requiredTag">{b.required}</span></span>
                      <select value={booking.requestedTime} onChange={(e) => setField('requestedTime', e.target.value)} disabled={!booking.requestedDate || requestedTimeSlots.length === 0} required>
                        <option value="">{booking.requestedDate ? b.chooseWindow : b.chooseDate}</option>
                        {requestedTimeSlots.map((slot) => <option key={slot.value} value={slot.value}>{slot.label}</option>)}
                      </select>
                      <small className={requestedTimeSlots.length ? 'storeHoursNote' : 'storeHoursNote closed'}>{storeHoursNote}</small>
                    </label>
                    <label className="fullField">{b.notes}<textarea value={booking.notes} onChange={(e) => setField('notes', e.target.value)} placeholder={b.notesPlaceholder} /></label>
                  </div>
                  <p className="bookingConsent">{b.consent}</p>
                </section>

                <section className={step === 4 ? 'slidePanel finalSlide activeSlidePanel' : 'slidePanel finalSlide'}>
                  <span className="slideStep">{b.step} 5</span>
                  <h2>{b.finalTitle}</h2>
                  <p className="slideHint">{b.finalHint}</p>
                  <div className="finalSummaryBox">
                    <div><strong>{b.brand}</strong><span>{booking.device}</span></div>
                    <div><strong>{b.series}</strong><span>{booking.series || b.notSelected}</span></div>
                    <div><strong>{b.model}</strong><span>{booking.model || b.notSelected}</span></div>
                    <div><strong>{b.issue}</strong><span>{booking.issue ? issueTranslations[booking.issue]?.[lang] || booking.issue : b.notSelected}</span></div>
                    <div><strong>{b.date}</strong><span>{booking.requestedDate || b.notSelected}</span></div>
                    <div><strong>{b.window}</strong><span>{requestedTimeLabel || b.notSelected}</span></div>
                    <div><strong>{b.name}</strong><span>{booking.name || b.notProvided}</span></div>
                    <div><strong>{b.phone}</strong><span>{booking.phone || b.notProvided}</span></div>
                    <div><strong>{b.email}</strong><span>{booking.email || b.notProvided}</span></div>
                  </div>
                  <div className="finalActions">
                    <button type="button" className={canSubmit ? 'primaryBtn' : 'primaryBtn disabled'} onClick={submitRepairRequest} disabled={!canSubmit || submissionStatus === 'sending'}>
                      {submissionStatus === 'sending' ? b.sending : b.submit} <ArrowRight size={18} />
                    </button>
                    <a className="secondaryBtn" href={canSubmit ? smsLink : undefined} aria-disabled={!canSubmit}>{b.textInstead}</a>
                    <a className="secondaryBtn" href="tel:7734137489">{b.callInstead}</a>
                  </div>
                  {submissionMessage && (
                    <p className={`submissionNotice ${submissionStatus}`}>{submissionMessage}</p>
                  )}
                  <p className="backendNote">{b.backendNote}</p>
                </section>
              </div>

              <div className="slideControls">
                <button type="button" className="secondaryBtn compact" onClick={goBack} disabled={step === 0}>{b.back}</button>
                {step < steps.length - 1 ? (
                  <button type="button" className="primaryBtn compact" onClick={goNext} disabled={!canGoNext}>{b.next} <ArrowRight size={16} /></button>
                ) : (
                  <button type="button" className="secondaryBtn compact" onClick={() => setStep(0)}>{b.startOver}</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
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


type DurationKey = '1' | '3' | '6' | '12';

type UltraPlan = {
  name: string;
  badge?: string;
  promoEligible?: boolean;
  basePrice: string;
  data: string;
  highlight: string;
  includes: string[];
  durations: Partial<Record<DurationKey, { label: string; monthly: string; billed: string; note?: string; badge?: string }>>;
};

const durationTabs: { key: DurationKey; label: string; sublabel: string }[] = [
  { key: '1', label: '1 Month', sublabel: 'Monthly' },
  { key: '3', label: '3 Months', sublabel: 'Save more' },
  { key: '6', label: '6 Months', sublabel: 'Better value' },
  { key: '12', label: '12 Months', sublabel: 'Best value' }
];

const ultraPlans: UltraPlan[] = [
  {
    name: '500MB Plan',
    basePrice: '$15',
    data: '500MB',
    highlight: 'A simple starter plan for light data, talk, and text.',
    includes: ['500MB of 5G / 4G LTE data per month', 'Unlimited nationwide talk and global text', 'International calling support', 'Mobile hotspot included'],
    durations: {
      '1': { label: '1 Month', monthly: '$15/mo', billed: '$15 total' },
      '3': { label: '3 Months', monthly: '$13/mo', billed: '$39 total' },
      '6': { label: '6 Months', monthly: '$11/mo', billed: '$66 total' },
      '12': { label: '12 Months', monthly: '$10/mo', billed: '$120 total', badge: 'Lowest monthly' }
    }
  },
  {
    name: '4GB Plan',
    basePrice: '$19',
    data: '4GB',
    highlight: 'Affordable everyday service with international calling features.',
    includes: ['4GB of 5G / 4G LTE data per month', 'Unlimited nationwide talk and global text', 'Talk to 90+ international destinations', 'Talk and text in Mexico and Canada', 'Mobile hotspot included'],
    durations: {
      '1': { label: '1 Month', monthly: '$19/mo', billed: '$19 total' },
      '3': { label: '3 Months', monthly: '$16/mo', billed: '$48 total' },
      '6': { label: '6 Months', monthly: '$15/mo', billed: '$90 total' },
      '12': { label: '12 Months', monthly: '$13/mo', billed: '$156 total', badge: 'Best annual value' }
    }
  },
  {
    name: '8GB Plan',
    promoEligible: true,
    basePrice: '$24',
    data: '8GB',
    highlight: 'A smart choice for customers who want more data and strong value.',
    includes: ['8GB of 5G / 4G LTE data per month', 'Unlimited nationwide talk and global text', 'Talk to 90+ international destinations', 'Talk and text in Mexico and Canada', 'Mobile hotspot included'],
    durations: {
      '1': { label: '1 Month', monthly: '$24/mo', billed: '$24 total', badge: 'Promo eligible' },
      '3': { label: '3 Months', monthly: '$22/mo', billed: '$66 total' },
      '6': { label: '6 Months', monthly: '$19/mo', billed: '$114 total' },
      '12': { label: '12 Months', monthly: '$17/mo', billed: '$204 total' }
    }
  },
  {
    name: '12GB Plan',
    promoEligible: true,
    basePrice: '$29',
    data: '12GB',
    highlight: 'More high-speed data for maps, social apps, messaging, and video.',
    includes: ['12GB of 5G / 4G LTE data per month', 'Unlimited nationwide talk and global text', 'Talk to 90+ international destinations', 'Talk and text in Mexico and Canada', 'Mobile hotspot included'],
    durations: {
      '1': { label: '1 Month', monthly: '$29/mo', billed: '$29 total', badge: 'Promo eligible' },
      '3': { label: '3 Months', monthly: '$26/mo', billed: '$78 total' },
      '6': { label: '6 Months', monthly: '$23/mo', billed: '$138 total' },
      '12': { label: '12 Months', monthly: '$20/mo', billed: '$240 total' }
    }
  },
  {
    name: '24GB Plan',
    promoEligible: true,
    basePrice: '$39',
    data: '24GB',
    highlight: 'For heavier monthly data use without jumping to unlimited.',
    includes: ['24GB of 5G / 4G LTE data per month', 'Unlimited nationwide talk and global text', 'Talk to 90+ international destinations', 'Talk and text in Mexico and Canada', 'Mobile hotspot included'],
    durations: {
      '1': { label: '1 Month', monthly: '$39/mo', billed: '$39 total', badge: 'Promo eligible' },
      '3': { label: '3 Months', monthly: '$35/mo', billed: '$105 total' },
      '6': { label: '6 Months', monthly: '$31/mo', billed: '$186 total' },
      '12': { label: '12 Months', monthly: '$27/mo', billed: '$324 total' }
    }
  },
  {
    name: 'Ultra Unlimited Plan',
    badge: 'Most Popular',
    promoEligible: true,
    basePrice: '$49',
    data: 'Unlimited',
    highlight: 'Unlimited data with hotspot and family-line savings available.',
    includes: ['Unlimited 5G / 4G LTE data per month', 'No data cap', 'Unlimited nationwide talk and global text', 'Talk to 90+ international destinations', 'Talk and text in Mexico and Canada', 'Up to 10GB mobile hotspot'],
    durations: {
      '1': { label: '1 Month', monthly: '$49/mo', billed: '$49 total', badge: 'Family promo base' },
      '3': { label: '3 Months', monthly: '$44/mo', billed: '$132 total' },
      '6': { label: '6 Months', monthly: '$39/mo', billed: '$234 total' },
      '12': { label: '12 Months', monthly: '$34/mo', billed: '$408 total' }
    }
  },
  {
    name: 'Ultra Unlimited+ Plan',
    badge: 'Premium',
    promoEligible: true,
    basePrice: '$59',
    data: 'Unlimited+',
    highlight: 'Premium unlimited with more hotspot for customers who use more.',
    includes: ['Unlimited 5G / 4G LTE data per month', 'No data cap', 'Unlimited nationwide talk and global text', 'Talk to 90+ international destinations', 'Talk and text in Mexico and Canada', 'Up to 25GB mobile hotspot'],
    durations: {
      '1': { label: '1 Month', monthly: '$59/mo', billed: '$59 total' },
      '3': { label: '3 Months', monthly: '$53/mo', billed: '$159 total' },
      '6': { label: '6 Months', monthly: '$47/mo', billed: '$282 total' },
      '12': { label: '12 Months', monthly: '$41/mo', billed: '$492 total' }
    }
  }
];

const familyLinePrices = [
  { label: '1 line', price: '$49/mo' },
  { label: '2 lines', price: '$73/mo' },
  { label: '3 lines', price: '$85/mo' },
  { label: '4 lines', price: '$100/mo' }
];

const goRoamPasses = [
  { name: '$5 Go Roam Pass', duration: '5 days', talk: '100 minutes', texts: '100 SMS', data: '1GB high-speed data' },
  { name: '$10 Go Roam Pass', duration: '15 days', talk: '300 minutes', texts: '300 SMS', data: '5GB high-speed data' }
];

const simStarterOptions = [
  { title: 'Ship a SIM card', text: 'Need service outside Chicago? Start a request and we can help with a physical Ultra Mobile SIM shipped in the USA.', cta: 'Start SIM request' },
  { title: 'Pick up in Chicago', text: 'Visit CellzTech for SIM setup, number transfer help, plan selection, and activation support.', cta: 'Get store directions' },
  { title: 'Ask about eSIM', text: 'Have a compatible phone? We can check eSIM support before activation and explain your options.', cta: 'Check eSIM options' }
];


const ultraCopy: Record<LanguageKey, {
  hero: { label: string; title: string; text: string; call: string; visit: string };
  family: { badge: string; label: string; title: string; text: string; cta: string; checklist: string[]; lineLabels: string[] };
  quick: { label: string; title: string; items: string[] };
  infoCards: { icon: 'globe' | 'check' | 'wifi'; label: string; title: string; text: string }[];
  familyFeature: { label: string; title: string; text: string; fine: string };
  roamFeature: { label: string; title: string; textPrefix: string; textMiddle: string; textSuffix: string; fine: string };
  planSection: { label: string; title: string; text: string; finePrint: string };
  simSection: { label: string; title: string; text: string; options: { title: string; text: string; cta: string }[] };
  planCard: {
    promoEligible: string;
    includes: string;
    activation: string;
    activationItems: string[];
    promoApplyTitle: string;
    promoApplyText: string;
    multiTitle: string;
    multiText: string;
    simTitle: string;
    simText: string;
    esimTitle: string;
    esimText: string;
    subtotal: string;
    askPricing: string;
    taxes: string;
    startPurchase: string;
    callPlan: string;
    askStore: string;
    fourthFree: string;
  };
  durationTabs: { key: DurationKey; label: string; sublabel: string }[];
  passes: typeof goRoamPasses;
  plans: Record<string, { name: string; badge?: string; highlight: string; includes: string[] }>;
}> = {
  en: {
    hero: { label: 'Ultra Mobile authorized activation help', title: 'Ultra Mobile plans, family savings, and travel-ready service at CellzTech.', text: 'We help customers compare monthly and multi-month plans, family promos, number transfers, Go Roam passes, and compatibility before they pay.', call: 'Call for Ultra Mobile', visit: 'Visit the store' },
    family: { badge: 'Family\nDeal', label: 'Featured promo', title: '4 Ultra Unlimited lines for $100/mo', text: 'Bring up to four lines onto one Ultra Unlimited account and get international features included with each line.', cta: 'Ask about 4 for $100', checklist: ['No data cap on Ultra Unlimited', 'Unlimited nationwide talk and global text', 'Talk to 90+ international destinations', 'Hotspot included on supported plans'], lineLabels: ['1 line', '2 lines', '3 lines', '4 lines'] },
    quick: { label: 'Quick details', title: 'What customers usually want to know first.', items: ['Plans from $15/month, with monthly and multi-month options.', '4 Ultra Unlimited lines for $100/month.', 'International calling to Poland and 90+ destinations.', 'Free SIM card at CellzTech, with eSIM available on supported phones.', 'Bring your account number, transfer PIN, and an unlocked compatible phone.'] },
    infoCards: [
      { icon: 'globe', label: 'International roaming', title: 'New 5-day and 15-day Go Roam Passes', text: 'Built for quick trips and longer vacations when customers need talk, text, and data abroad.' },
      { icon: 'check', label: 'Limited time offer', title: 'Eligible 1-month 8GB+ plans can earn a free 4th month.', text: 'This offer applies to eligible monthly plans only. Multi-month 3, 6, and 12 month rates are separate prepaid options.' },
      { icon: 'wifi', label: 'Network', title: 'On the T-Mobile 5G network', text: 'Plans include nationwide talk and global text, international calling features, and hotspot on supported plans.' }
    ],
    familyFeature: { label: 'Family plan math', title: 'Unlimited lines get stronger as you add more.', text: 'The current 4-line showcase starts from one Ultra Unlimited line and adds savings as the account grows.', fine: 'Promo eligibility, taxes, fees, account status, and plan availability must be confirmed before activation.' },
    roamFeature: { label: 'Go Roam World Pass', title: 'Travel support without guessing.', textPrefix: 'Customers can add a pass by texting', textMiddle: 'to', textSuffix: 'Up to 3 passes can be stored, but only one can be active at a time.', fine: 'After high-speed data is used, speeds reduce to 512 kbps until the pass expires. Works in many countries, but not all. Mexico uses a separate roaming pass.' },
    planSection: { label: 'Plan showcase', title: 'Compare Ultra Mobile monthly and multi-month pricing.', text: 'Pick a plan and duration to preview the advertised monthly price and total upfront amount. We confirm taxes, fees, current promos, and compatibility before activation.', finePrint: 'Final pricing, taxes, fees, promo eligibility, plan terms, network management, eSIM compatibility, roaming availability, and plan availability may vary. Heavy data users may notice reduced speeds during congestion. Video may stream around 480p. We will confirm everything before activation.' },
    simSection: { label: 'SIM cards and activation help', title: 'Get an Ultra Mobile SIM shipped or activated in-store.', text: 'Whether you are switching today, transferring a number, helping a family member, or asking about eSIM, CellzTech can guide you through the cleanest option before you pay.', options: simStarterOptions },
    planCard: { promoEligible: '1-month promo eligible', includes: 'Plan Includes:', activation: 'Activation help:', activationItems: ['$0 activation fee at CellzTech', 'Free SIM card', 'We help transfer your number in-store'], promoApplyTitle: '4th month free promo applies here.', promoApplyText: 'For eligible new customers on 1-month 8GB+ plans, the 4th monthly renewal can be free when the line remains eligible.', multiTitle: 'Multi-month pricing selected.', multiText: 'The 3, 6, and 12 month choices are prepaid multi-month rates. They are not the 4th-month-free monthly promo.', simTitle: 'SIM Card', simText: 'Free SIM card at CellzTech', esimTitle: 'eSIM', esimText: 'Available on select compatible phones', subtotal: 'Subtotal preview:', askPricing: 'Ask in store for current pricing', taxes: 'Taxes and fees may apply.', startPurchase: 'Start purchase', callPlan: 'Call about this plan', askStore: 'Ask in store', fourthFree: '4th month free eligible' },
    durationTabs,
    passes: goRoamPasses,
    plans: {
      '500MB Plan': { name: '500MB Plan', highlight: 'A simple starter plan for light data, talk, and text.', includes: ['500MB of 5G / 4G LTE data per month', 'Unlimited nationwide talk and global text', 'International calling support', 'Mobile hotspot included'] },
      '4GB Plan': { name: '4GB Plan', highlight: 'Affordable everyday service with international calling features.', includes: ['4GB of 5G / 4G LTE data per month', 'Unlimited nationwide talk and global text', 'Talk to 90+ international destinations', 'Talk and text in Mexico and Canada', 'Mobile hotspot included'] },
      '8GB Plan': { name: '8GB Plan', highlight: 'A smart choice for customers who want more data and strong value.', includes: ['8GB of 5G / 4G LTE data per month', 'Unlimited nationwide talk and global text', 'Talk to 90+ international destinations', 'Talk and text in Mexico and Canada', 'Mobile hotspot included'] },
      '12GB Plan': { name: '12GB Plan', highlight: 'More high-speed data for maps, social apps, messaging, and video.', includes: ['12GB of 5G / 4G LTE data per month', 'Unlimited nationwide talk and global text', 'Talk to 90+ international destinations', 'Talk and text in Mexico and Canada', 'Mobile hotspot included'] },
      '24GB Plan': { name: '24GB Plan', highlight: 'For heavier monthly data use without jumping to unlimited.', includes: ['24GB of 5G / 4G LTE data per month', 'Unlimited nationwide talk and global text', 'Talk to 90+ international destinations', 'Talk and text in Mexico and Canada', 'Mobile hotspot included'] },
      'Ultra Unlimited Plan': { name: 'Ultra Unlimited Plan', badge: 'Most Popular', highlight: 'Unlimited data with hotspot and family-line savings available.', includes: ['Unlimited 5G / 4G LTE data per month', 'No data cap', 'Unlimited nationwide talk and global text', 'Talk to 90+ international destinations', 'Talk and text in Mexico and Canada', 'Up to 10GB mobile hotspot'] },
      'Ultra Unlimited+ Plan': { name: 'Ultra Unlimited+ Plan', badge: 'Premium', highlight: 'Premium unlimited with more hotspot for customers who use more.', includes: ['Unlimited 5G / 4G LTE data per month', 'No data cap', 'Unlimited nationwide talk and global text', 'Talk to 90+ international destinations', 'Talk and text in Mexico and Canada', 'Up to 25GB mobile hotspot'] }
    }
  },
  pl: {
    hero: { label: 'Autoryzowana pomoc przy aktywacji Ultra Mobile', title: 'Plany Ultra Mobile, oszczędności rodzinne i obsługa gotowa na podróże w CellzTech.', text: 'Pomagamy porównać plany miesięczne i wielomiesięczne, promocje rodzinne, przeniesienie numeru, pakiety Go Roam oraz zgodność telefonu — zanim klient zapłaci.', call: 'Zadzwoń w sprawie Ultra Mobile', visit: 'Odwiedź sklep' },
    family: { badge: 'Oferta\nrodzinna', label: 'Wyróżniona promocja', title: '4 linie Ultra Unlimited za $100/mies.', text: 'Dodaj do czterech linii na jednym koncie Ultra Unlimited i korzystaj z funkcji międzynarodowych na każdej linii.', cta: 'Zapytaj o 4 linie za $100', checklist: ['Brak limitu danych w Ultra Unlimited', 'Nielimitowane rozmowy krajowe i wiadomości globalne', 'Rozmowy do ponad 90 kierunków międzynarodowych', 'Hotspot w wybranych planach'], lineLabels: ['1 linia', '2 linie', '3 linie', '4 linie'] },
    quick: { label: 'Najważniejsze informacje', title: 'To, o co klienci pytają najczęściej.', items: ['Plany od $15 miesięcznie, z opcjami miesięcznymi i wielomiesięcznymi.', '4 linie Ultra Unlimited za $100 miesięcznie.', 'Rozmowy międzynarodowe do Polski i ponad 90 kierunków.', 'Darmowa karta SIM w CellzTech; eSIM dostępny w wybranych kompatybilnych telefonach.', 'Przynieś numer konta, transfer PIN oraz odblokowany, kompatybilny telefon.'] },
    infoCards: [
      { icon: 'globe', label: 'Roaming międzynarodowy', title: 'Nowe pakiety Go Roam na 5 i 15 dni', text: 'Dla krótkich wyjazdów i dłuższych wakacji, gdy klienci potrzebują rozmów, SMS-ów i danych za granicą.' },
      { icon: 'check', label: 'Oferta czasowa', title: 'Wybrane miesięczne plany 8GB+ mogą otrzymać 4. miesiąc gratis.', text: 'Oferta dotyczy tylko kwalifikujących się planów miesięcznych. Pakiety 3-, 6- i 12-miesięczne to osobne opcje przedpłacone.' },
      { icon: 'wifi', label: 'Sieć', title: 'W sieci 5G T-Mobile', text: 'Plany obejmują rozmowy krajowe, wiadomości globalne, funkcje rozmów międzynarodowych oraz hotspot w wybranych planach.' }
    ],
    familyFeature: { label: 'Ceny rodzinne', title: 'Im więcej linii Unlimited, tym większa wartość.', text: 'Aktualna promocja zaczyna się od jednej linii Ultra Unlimited i daje większe oszczędności po dodaniu kolejnych linii.', fine: 'Kwalifikacja do promocji, podatki, opłaty, status konta i dostępność planu muszą zostać potwierdzone przed aktywacją.' },
    roamFeature: { label: 'Go Roam World Pass', title: 'Pomoc w podróży bez zgadywania.', textPrefix: 'Klienci mogą dodać pakiet, wysyłając SMS', textMiddle: 'na numer', textSuffix: 'Można przechowywać do 3 pakietów, ale aktywny może być tylko jeden naraz.', fine: 'Po wykorzystaniu szybkich danych prędkość spada do 512 kbps do końca ważności pakietu. Usługa działa w wielu krajach, ale nie we wszystkich. Meksyk korzysta z osobnego pakietu roamingowego.' },
    planSection: { label: 'Porównanie planów', title: 'Porównaj miesięczne i wielomiesięczne ceny Ultra Mobile.', text: 'Wybierz plan i okres, aby zobaczyć reklamowaną cenę miesięczną oraz kwotę płatną z góry. Przed aktywacją potwierdzamy podatki, opłaty, aktualne promocje i zgodność telefonu.', finePrint: 'Ostateczna cena, podatki, opłaty, kwalifikacja do promocji, warunki planu, zarządzanie siecią, zgodność eSIM, roaming i dostępność planów mogą się różnić. Użytkownicy zużywający dużo danych mogą zauważyć niższe prędkości podczas przeciążenia sieci. Wideo może być odtwarzane w jakości około 480p. Wszystko potwierdzimy przed aktywacją.' },
    simSection: { label: 'Karty SIM i pomoc przy aktywacji', title: 'Zamów kartę SIM Ultra Mobile lub aktywuj usługę w sklepie.', text: 'Niezależnie od tego, czy przenosisz numer, pomagasz członkowi rodziny czy pytasz o eSIM, CellzTech pomoże wybrać najprostsze rozwiązanie przed płatnością.', options: [
      { title: 'Wysyłka karty SIM', text: 'Potrzebujesz usługi poza Chicago? Rozpocznij zapytanie, a pomożemy z fizyczną kartą SIM Ultra Mobile wysyłaną na terenie USA.', cta: 'Rozpocznij zapytanie o SIM' },
      { title: 'Odbiór w Chicago', text: 'Odwiedź CellzTech, aby uzyskać pomoc z kartą SIM, przeniesieniem numeru, wyborem planu i aktywacją.', cta: 'Pokaż dojazd do sklepu' },
      { title: 'Zapytaj o eSIM', text: 'Masz kompatybilny telefon? Sprawdzimy obsługę eSIM przed aktywacją i wyjaśnimy dostępne opcje.', cta: 'Sprawdź opcje eSIM' }
    ] },
    planCard: { promoEligible: 'Promocja dla planu 1-miesięcznego', includes: 'Plan obejmuje:', activation: 'Pomoc przy aktywacji:', activationItems: ['Aktywacja $0 w CellzTech', 'Darmowa karta SIM', 'Pomagamy przenieść numer w sklepie'], promoApplyTitle: 'Tutaj obowiązuje promocja 4. miesiąc gratis.', promoApplyText: 'Dla nowych kwalifikujących się klientów na miesięcznych planach 8GB+ czwarta miesięczna odnowa może być gratis, jeśli linia nadal spełnia warunki.', multiTitle: 'Wybrano cenę wielomiesięczną.', multiText: 'Opcje 3, 6 i 12 miesięcy to przedpłacone pakiety wielomiesięczne. Nie są częścią promocji 4. miesiąc gratis.', simTitle: 'Karta SIM', simText: 'Darmowa karta SIM w CellzTech', esimTitle: 'eSIM', esimText: 'Dostępny w wybranych kompatybilnych telefonach', subtotal: 'Podgląd ceny:', askPricing: 'Zapytaj w sklepie o aktualną cenę', taxes: 'Mogą obowiązywać podatki i opłaty.', startPurchase: 'Rozpocznij zakup', callPlan: 'Zadzwoń w sprawie planu', askStore: 'Zapytaj w sklepie', fourthFree: 'Możliwy 4. miesiąc gratis' },
    durationTabs: [{ key: '1', label: '1 miesiąc', sublabel: 'Miesięcznie' }, { key: '3', label: '3 miesiące', sublabel: 'Większa oszczędność' }, { key: '6', label: '6 miesięcy', sublabel: 'Lepsza wartość' }, { key: '12', label: '12 miesięcy', sublabel: 'Najlepsza wartość' }],
    passes: [{ name: '$5 Go Roam Pass', duration: '5 dni', talk: '100 minut', texts: '100 SMS', data: '1GB szybkich danych' }, { name: '$10 Go Roam Pass', duration: '15 dni', talk: '300 minut', texts: '300 SMS', data: '5GB szybkich danych' }],
    plans: {}
  },
  es: {
    hero: { label: 'Ayuda autorizada con activaciones Ultra Mobile', title: 'Planes Ultra Mobile, ahorros familiares y servicio listo para viajar en CellzTech.', text: 'Ayudamos a comparar planes mensuales y de varios meses, promociones familiares, transferencias de número, pases Go Roam y compatibilidad antes de pagar.', call: 'Llamar sobre Ultra Mobile', visit: 'Visitar la tienda' },
    family: { badge: 'Oferta\nfamiliar', label: 'Promoción destacada', title: '4 líneas Ultra Unlimited por $100/mes', text: 'Agrega hasta cuatro líneas en una cuenta Ultra Unlimited y recibe funciones internacionales incluidas en cada línea.', cta: 'Preguntar por 4 por $100', checklist: ['Sin límite de datos en Ultra Unlimited', 'Llamadas nacionales ilimitadas y mensajes globales', 'Llamadas a más de 90 destinos internacionales', 'Hotspot incluido en planes compatibles'], lineLabels: ['1 línea', '2 líneas', '3 líneas', '4 líneas'] },
    quick: { label: 'Detalles rápidos', title: 'Lo que los clientes suelen preguntar primero.', items: ['Planes desde $15 al mes, con opciones mensuales y de varios meses.', '4 líneas Ultra Unlimited por $100 al mes.', 'Llamadas internacionales a Polonia y más de 90 destinos.', 'Tarjeta SIM gratis en CellzTech; eSIM disponible en teléfonos compatibles seleccionados.', 'Trae tu número de cuenta, PIN de transferencia y un teléfono desbloqueado compatible.'] },
    infoCards: [
      { icon: 'globe', label: 'Roaming internacional', title: 'Nuevos pases Go Roam de 5 y 15 días', text: 'Pensados para viajes cortos y vacaciones más largas cuando necesitas llamadas, textos y datos en el extranjero.' },
      { icon: 'check', label: 'Oferta por tiempo limitado', title: 'Planes mensuales elegibles de 8GB+ pueden recibir el 4.º mes gratis.', text: 'Esta oferta aplica solo a planes mensuales elegibles. Los planes prepagados de 3, 6 y 12 meses son opciones separadas.' },
      { icon: 'wifi', label: 'Red', title: 'En la red 5G de T-Mobile', text: 'Los planes incluyen llamadas nacionales, mensajes globales, funciones de llamadas internacionales y hotspot en planes compatibles.' }
    ],
    familyFeature: { label: 'Cálculo familiar', title: 'Las líneas Unlimited tienen más valor al agregar más.', text: 'La promoción actual empieza con una línea Ultra Unlimited y aumenta los ahorros a medida que crece la cuenta.', fine: 'La elegibilidad de la promoción, impuestos, cargos, estado de la cuenta y disponibilidad del plan deben confirmarse antes de la activación.' },
    roamFeature: { label: 'Go Roam World Pass', title: 'Ayuda para viajar sin adivinar.', textPrefix: 'Los clientes pueden agregar un pase enviando', textMiddle: 'al', textSuffix: 'Se pueden guardar hasta 3 pases, pero solo uno puede estar activo a la vez.', fine: 'Después de usar los datos de alta velocidad, la velocidad baja a 512 kbps hasta que expire el pase. Funciona en muchos países, pero no en todos. México usa un pase de roaming separado.' },
    planSection: { label: 'Comparación de planes', title: 'Compara precios mensuales y de varios meses de Ultra Mobile.', text: 'Elige un plan y duración para ver el precio mensual anunciado y el total por adelantado. Confirmamos impuestos, cargos, promociones actuales y compatibilidad antes de activar.', finePrint: 'El precio final, impuestos, cargos, elegibilidad de promoción, términos del plan, administración de red, compatibilidad eSIM, disponibilidad de roaming y planes pueden variar. Los usuarios con alto consumo de datos pueden notar velocidades reducidas durante congestión. El video puede transmitirse alrededor de 480p. Confirmaremos todo antes de la activación.' },
    simSection: { label: 'Tarjetas SIM y ayuda de activación', title: 'Recibe una SIM Ultra Mobile por envío o actívala en la tienda.', text: 'Ya sea que cambies hoy, transfieras un número, ayudes a un familiar o preguntes por eSIM, CellzTech te guía hacia la opción más clara antes de pagar.', options: [
      { title: 'Enviar una tarjeta SIM', text: '¿Necesitas servicio fuera de Chicago? Inicia una solicitud y podemos ayudar con una SIM física de Ultra Mobile enviada dentro de EE. UU.', cta: 'Iniciar solicitud de SIM' },
      { title: 'Recoger en Chicago', text: 'Visita CellzTech para ayuda con SIM, transferencia de número, selección de plan y activación.', cta: 'Ver cómo llegar' },
      { title: 'Preguntar por eSIM', text: '¿Tienes un teléfono compatible? Podemos verificar eSIM antes de la activación y explicar tus opciones.', cta: 'Ver opciones de eSIM' }
    ] },
    planCard: { promoEligible: 'Promoción para plan de 1 mes', includes: 'El plan incluye:', activation: 'Ayuda de activación:', activationItems: ['Activación de $0 en CellzTech', 'Tarjeta SIM gratis', 'Ayudamos a transferir tu número en la tienda'], promoApplyTitle: 'Aquí aplica la promoción del 4.º mes gratis.', promoApplyText: 'Para clientes nuevos elegibles en planes mensuales de 8GB+, la cuarta renovación mensual puede ser gratis si la línea sigue cumpliendo los requisitos.', multiTitle: 'Precio de varios meses seleccionado.', multiText: 'Las opciones de 3, 6 y 12 meses son tarifas prepagadas de varios meses. No forman parte de la promoción del 4.º mes gratis.', simTitle: 'Tarjeta SIM', simText: 'Tarjeta SIM gratis en CellzTech', esimTitle: 'eSIM', esimText: 'Disponible en teléfonos compatibles seleccionados', subtotal: 'Vista previa del subtotal:', askPricing: 'Pregunta en tienda por el precio actual', taxes: 'Pueden aplicar impuestos y cargos.', startPurchase: 'Iniciar compra', callPlan: 'Llamar sobre este plan', askStore: 'Pregunta en tienda', fourthFree: 'Elegible para 4.º mes gratis' },
    durationTabs: [{ key: '1', label: '1 mes', sublabel: 'Mensual' }, { key: '3', label: '3 meses', sublabel: 'Más ahorro' }, { key: '6', label: '6 meses', sublabel: 'Mejor valor' }, { key: '12', label: '12 meses', sublabel: 'Mejor valor anual' }],
    passes: [{ name: 'Pase Go Roam de $5', duration: '5 días', talk: '100 minutos', texts: '100 SMS', data: '1GB de datos de alta velocidad' }, { name: 'Pase Go Roam de $10', duration: '15 días', talk: '300 minutos', texts: '300 SMS', data: '5GB de datos de alta velocidad' }],
    plans: {}
  },
  uk: {
    hero: { label: 'Авторизована допомога з активацією Ultra Mobile', title: 'Плани Ultra Mobile, сімейна економія та зв’язок для подорожей у CellzTech.', text: 'Ми допомагаємо порівняти місячні та багатомісячні плани, сімейні акції, перенесення номера, пакети Go Roam і сумісність телефону до оплати.', call: 'Зателефонувати щодо Ultra Mobile', visit: 'Відвідати магазин' },
    family: { badge: 'Сімейна\nпропозиція', label: 'Головна акція', title: '4 лінії Ultra Unlimited за $100/міс.', text: 'Додайте до чотирьох ліній в один обліковий запис Ultra Unlimited і отримайте міжнародні функції для кожної лінії.', cta: 'Запитати про 4 за $100', checklist: ['Без ліміту даних в Ultra Unlimited', 'Безлімітні дзвінки по США та глобальні SMS', 'Дзвінки до понад 90 міжнародних напрямків', 'Hotspot у підтримуваних планах'], lineLabels: ['1 лінія', '2 лінії', '3 лінії', '4 лінії'] },
    quick: { label: 'Коротко', title: 'Що клієнти зазвичай хочуть знати спочатку.', items: ['Плани від $15 на місяць, з місячними та багатомісячними варіантами.', '4 лінії Ultra Unlimited за $100 на місяць.', 'Міжнародні дзвінки до Польщі та понад 90 напрямків.', 'Безкоштовна SIM-карта в CellzTech; eSIM доступна на вибраних сумісних телефонах.', 'Принесіть номер акаунта, transfer PIN та розблокований сумісний телефон.'] },
    infoCards: [
      { icon: 'globe', label: 'Міжнародний роумінг', title: 'Нові пакети Go Roam на 5 і 15 днів', text: 'Для коротких поїздок і довших відпусток, коли потрібні дзвінки, SMS і дані за кордоном.' },
      { icon: 'check', label: 'Обмежена пропозиція', title: 'Вибрані місячні плани 8GB+ можуть отримати 4-й місяць безкоштовно.', text: 'Пропозиція діє лише для відповідних місячних планів. 3-, 6- і 12-місячні варіанти є окремими передплаченими планами.' },
      { icon: 'wifi', label: 'Мережа', title: 'У мережі 5G T-Mobile', text: 'Плани включають дзвінки по США, глобальні SMS, міжнародні дзвінки та hotspot у підтримуваних планах.' }
    ],
    familyFeature: { label: 'Сімейний розрахунок', title: 'Лінії Unlimited стають вигіднішими, коли їх більше.', text: 'Поточна пропозиція починається з однієї лінії Ultra Unlimited і дає більше економії, коли додаються нові лінії.', fine: 'Участь в акції, податки, збори, статус акаунта та доступність плану потрібно підтвердити перед активацією.' },
    roamFeature: { label: 'Go Roam World Pass', title: 'Підтримка в подорожах без здогадок.', textPrefix: 'Клієнти можуть додати пакет, надіславши SMS', textMiddle: 'на номер', textSuffix: 'Можна зберігати до 3 пакетів, але активним може бути лише один.', fine: 'Після використання швидкісних даних швидкість знижується до 512 kbps до завершення дії пакета. Працює в багатьох країнах, але не в усіх. Для Мексики використовується окремий роумінговий пакет.' },
    planSection: { label: 'Огляд планів', title: 'Порівняйте місячні та багатомісячні ціни Ultra Mobile.', text: 'Виберіть план і тривалість, щоб побачити рекламовану місячну ціну та суму до оплати наперед. Ми підтвердимо податки, збори, актуальні акції та сумісність перед активацією.', finePrint: 'Кінцева ціна, податки, збори, участь в акціях, умови плану, керування мережею, сумісність eSIM, доступність роумінгу та планів можуть відрізнятися. Користувачі з великим обсягом даних можуть помітити нижчу швидкість під час навантаження мережі. Відео може транслюватися приблизно у 480p. Ми все підтвердимо перед активацією.' },
    simSection: { label: 'SIM-карти та допомога з активацією', title: 'Отримайте SIM Ultra Mobile поштою або активуйте в магазині.', text: 'Якщо ви переходите сьогодні, переносите номер, допомагаєте родичу або питаєте про eSIM, CellzTech підкаже найзручніший варіант перед оплатою.', options: [
      { title: 'Надіслати SIM-карту', text: 'Потрібен сервіс поза Чикаго? Почніть запит, і ми допоможемо з фізичною SIM Ultra Mobile з доставкою по США.', cta: 'Почати запит SIM' },
      { title: 'Забрати в Чикаго', text: 'Відвідайте CellzTech для допомоги з SIM, перенесенням номера, вибором плану та активацією.', cta: 'Показати маршрут' },
      { title: 'Запитати про eSIM', text: 'Маєте сумісний телефон? Ми перевіримо підтримку eSIM перед активацією та пояснимо варіанти.', cta: 'Перевірити eSIM' }
    ] },
    planCard: { promoEligible: 'Акція для плану на 1 місяць', includes: 'План включає:', activation: 'Допомога з активацією:', activationItems: ['Активація $0 у CellzTech', 'Безкоштовна SIM-карта', 'Допомагаємо перенести номер у магазині'], promoApplyTitle: 'Тут діє акція 4-й місяць безкоштовно.', promoApplyText: 'Для нових відповідних клієнтів на місячних планах 8GB+ четверте місячне поновлення може бути безкоштовним, якщо лінія надалі відповідає умовам.', multiTitle: 'Вибрано багатомісячну ціну.', multiText: 'Варіанти 3, 6 і 12 місяців — це передплачені багатомісячні тарифи. Вони не є частиною акції 4-го місяця безкоштовно.', simTitle: 'SIM-карта', simText: 'Безкоштовна SIM-карта в CellzTech', esimTitle: 'eSIM', esimText: 'Доступна на вибраних сумісних телефонах', subtotal: 'Попередній підсумок:', askPricing: 'Запитайте в магазині про актуальну ціну', taxes: 'Можуть застосовуватися податки та збори.', startPurchase: 'Почати покупку', callPlan: 'Зателефонувати про цей план', askStore: 'Запитайте в магазині', fourthFree: 'Можливий 4-й місяць безкоштовно' },
    durationTabs: [{ key: '1', label: '1 місяць', sublabel: 'Щомісяця' }, { key: '3', label: '3 місяці', sublabel: 'Більша економія' }, { key: '6', label: '6 місяців', sublabel: 'Краща вартість' }, { key: '12', label: '12 місяців', sublabel: 'Найкраща вартість' }],
    passes: [{ name: 'Go Roam Pass за $5', duration: '5 днів', talk: '100 хвилин', texts: '100 SMS', data: '1GB швидкісних даних' }, { name: 'Go Roam Pass за $10', duration: '15 днів', talk: '300 хвилин', texts: '300 SMS', data: '5GB швидкісних даних' }],
    plans: {}
  }
};

['pl', 'es', 'uk'].forEach((key) => {
  const lang = key as LanguageKey;
  ultraCopy[lang].plans = ultraCopy.en.plans;
});

ultraCopy.pl.plans = {
  '500MB Plan': { name: 'Plan 500MB', highlight: 'Prosty plan startowy dla osób, które używają niewielkiej ilości danych oraz potrzebują rozmów i SMS-ów.', includes: ['500MB danych 5G / 4G LTE miesięcznie', 'Nielimitowane rozmowy krajowe i wiadomości globalne', 'Obsługa rozmów międzynarodowych', 'Hotspot mobilny w cenie'] },
  '4GB Plan': { name: 'Plan 4GB', highlight: 'Przystępna cenowo codzienna usługa z funkcjami rozmów międzynarodowych.', includes: ['4GB danych 5G / 4G LTE miesięcznie', 'Nielimitowane rozmowy krajowe i wiadomości globalne', 'Rozmowy do ponad 90 kierunków międzynarodowych', 'Rozmowy i SMS-y w Meksyku oraz Kanadzie', 'Hotspot mobilny w cenie'] },
  '8GB Plan': { name: 'Plan 8GB', highlight: 'Rozsądny wybór dla klientów, którzy chcą więcej danych i dobrej ceny.', includes: ['8GB danych 5G / 4G LTE miesięcznie', 'Nielimitowane rozmowy krajowe i wiadomości globalne', 'Rozmowy do ponad 90 kierunków międzynarodowych', 'Rozmowy i SMS-y w Meksyku oraz Kanadzie', 'Hotspot mobilny w cenie'] },
  '12GB Plan': { name: 'Plan 12GB', highlight: 'Więcej szybkich danych na mapy, komunikatory, media społecznościowe i wideo.', includes: ['12GB danych 5G / 4G LTE miesięcznie', 'Nielimitowane rozmowy krajowe i wiadomości globalne', 'Rozmowy do ponad 90 kierunków międzynarodowych', 'Rozmowy i SMS-y w Meksyku oraz Kanadzie', 'Hotspot mobilny w cenie'] },
  '24GB Plan': { name: 'Plan 24GB', highlight: 'Dla osób, które zużywają więcej danych, ale nie potrzebują jeszcze planu Unlimited.', includes: ['24GB danych 5G / 4G LTE miesięcznie', 'Nielimitowane rozmowy krajowe i wiadomości globalne', 'Rozmowy do ponad 90 kierunków międzynarodowych', 'Rozmowy i SMS-y w Meksyku oraz Kanadzie', 'Hotspot mobilny w cenie'] },
  'Ultra Unlimited Plan': { name: 'Plan Ultra Unlimited', badge: 'Najpopularniejszy', highlight: 'Nielimitowane dane, hotspot i możliwość oszczędności przy liniach rodzinnych.', includes: ['Nielimitowane dane 5G / 4G LTE miesięcznie', 'Brak limitu danych', 'Nielimitowane rozmowy krajowe i wiadomości globalne', 'Rozmowy do ponad 90 kierunków międzynarodowych', 'Rozmowy i SMS-y w Meksyku oraz Kanadzie', 'Do 10GB hotspotu mobilnego'] },
  'Ultra Unlimited+ Plan': { name: 'Plan Ultra Unlimited+', badge: 'Premium', highlight: 'Plan premium z większym hotspotem dla klientów, którzy używają telefonu intensywniej.', includes: ['Nielimitowane dane 5G / 4G LTE miesięcznie', 'Brak limitu danych', 'Nielimitowane rozmowy krajowe i wiadomości globalne', 'Rozmowy do ponad 90 kierunków międzynarodowych', 'Rozmowy i SMS-y w Meksyku oraz Kanadzie', 'Do 25GB hotspotu mobilnego'] }
};

ultraCopy.es.plans = {
  '500MB Plan': { name: 'Plan 500MB', highlight: 'Un plan sencillo para uso ligero de datos, llamadas y mensajes.', includes: ['500MB de datos 5G / 4G LTE al mes', 'Llamadas nacionales ilimitadas y mensajes globales', 'Soporte para llamadas internacionales', 'Hotspot móvil incluido'] },
  '4GB Plan': { name: 'Plan 4GB', highlight: 'Servicio diario económico con funciones de llamadas internacionales.', includes: ['4GB de datos 5G / 4G LTE al mes', 'Llamadas nacionales ilimitadas y mensajes globales', 'Llamadas a más de 90 destinos internacionales', 'Llamadas y mensajes en México y Canadá', 'Hotspot móvil incluido'] },
  '8GB Plan': { name: 'Plan 8GB', highlight: 'Una opción inteligente para clientes que quieren más datos y buen valor.', includes: ['8GB de datos 5G / 4G LTE al mes', 'Llamadas nacionales ilimitadas y mensajes globales', 'Llamadas a más de 90 destinos internacionales', 'Llamadas y mensajes en México y Canadá', 'Hotspot móvil incluido'] },
  '12GB Plan': { name: 'Plan 12GB', highlight: 'Más datos de alta velocidad para mapas, redes sociales, mensajes y video.', includes: ['12GB de datos 5G / 4G LTE al mes', 'Llamadas nacionales ilimitadas y mensajes globales', 'Llamadas a más de 90 destinos internacionales', 'Llamadas y mensajes en México y Canadá', 'Hotspot móvil incluido'] },
  '24GB Plan': { name: 'Plan 24GB', highlight: 'Para mayor uso de datos mensual sin pasar todavía a un plan ilimitado.', includes: ['24GB de datos 5G / 4G LTE al mes', 'Llamadas nacionales ilimitadas y mensajes globales', 'Llamadas a más de 90 destinos internacionales', 'Llamadas y mensajes en México y Canadá', 'Hotspot móvil incluido'] },
  'Ultra Unlimited Plan': { name: 'Plan Ultra Unlimited', badge: 'Más popular', highlight: 'Datos ilimitados con hotspot y ahorros disponibles para líneas familiares.', includes: ['Datos ilimitados 5G / 4G LTE al mes', 'Sin límite de datos', 'Llamadas nacionales ilimitadas y mensajes globales', 'Llamadas a más de 90 destinos internacionales', 'Llamadas y mensajes en México y Canadá', 'Hasta 10GB de hotspot móvil'] },
  'Ultra Unlimited+ Plan': { name: 'Plan Ultra Unlimited+', badge: 'Premium', highlight: 'Ilimitado premium con más hotspot para clientes que usan más datos.', includes: ['Datos ilimitados 5G / 4G LTE al mes', 'Sin límite de datos', 'Llamadas nacionales ilimitadas y mensajes globales', 'Llamadas a más de 90 destinos internacionales', 'Llamadas y mensajes en México y Canadá', 'Hasta 25GB de hotspot móvil'] }
};

ultraCopy.uk.plans = {
  '500MB Plan': { name: 'План 500MB', highlight: 'Простий стартовий план для невеликого використання даних, дзвінків і повідомлень.', includes: ['500MB даних 5G / 4G LTE на місяць', 'Безлімітні дзвінки по США та глобальні SMS', 'Підтримка міжнародних дзвінків', 'Мобільний hotspot включено'] },
  '4GB Plan': { name: 'План 4GB', highlight: 'Доступний щоденний сервіс із функціями міжнародних дзвінків.', includes: ['4GB даних 5G / 4G LTE на місяць', 'Безлімітні дзвінки по США та глобальні SMS', 'Дзвінки до понад 90 міжнародних напрямків', 'Дзвінки та SMS у Мексиці й Канаді', 'Мобільний hotspot включено'] },
  '8GB Plan': { name: 'План 8GB', highlight: 'Розумний вибір для клієнтів, яким потрібно більше даних і вигідна ціна.', includes: ['8GB даних 5G / 4G LTE на місяць', 'Безлімітні дзвінки по США та глобальні SMS', 'Дзвінки до понад 90 міжнародних напрямків', 'Дзвінки та SMS у Мексиці й Канаді', 'Мобільний hotspot включено'] },
  '12GB Plan': { name: 'План 12GB', highlight: 'Більше швидкісних даних для карт, соцмереж, повідомлень і відео.', includes: ['12GB даних 5G / 4G LTE на місяць', 'Безлімітні дзвінки по США та глобальні SMS', 'Дзвінки до понад 90 міжнародних напрямків', 'Дзвінки та SMS у Мексиці й Канаді', 'Мобільний hotspot включено'] },
  '24GB Plan': { name: 'План 24GB', highlight: 'Для більшого щомісячного використання даних без переходу на Unlimited.', includes: ['24GB даних 5G / 4G LTE на місяць', 'Безлімітні дзвінки по США та глобальні SMS', 'Дзвінки до понад 90 міжнародних напрямків', 'Дзвінки та SMS у Мексиці й Канаді', 'Мобільний hotspot включено'] },
  'Ultra Unlimited Plan': { name: 'План Ultra Unlimited', badge: 'Найпопулярніший', highlight: 'Безлімітні дані з hotspot і сімейною економією для додаткових ліній.', includes: ['Безлімітні дані 5G / 4G LTE на місяць', 'Без ліміту даних', 'Безлімітні дзвінки по США та глобальні SMS', 'Дзвінки до понад 90 міжнародних напрямків', 'Дзвінки та SMS у Мексиці й Канаді', 'До 10GB мобільного hotspot'] },
  'Ultra Unlimited+ Plan': { name: 'План Ultra Unlimited+', badge: 'Premium', highlight: 'Преміальний безлімітний план із більшим hotspot для активніших користувачів.', includes: ['Безлімітні дані 5G / 4G LTE на місяць', 'Без ліміту даних', 'Безлімітні дзвінки по США та глобальні SMS', 'Дзвінки до понад 90 міжнародних напрямків', 'Дзвінки та SMS у Мексиці й Канаді', 'До 25GB мобільного hotspot'] }
};

function localizeMonthly(value: string, lang: LanguageKey) {
  if (lang === 'pl') return value.replace('/mo', '/mies.');
  if (lang === 'es') return value.replace('/mo', '/mes');
  if (lang === 'uk') return value.replace('/mo', '/міс.');
  return value;
}

function localizeBilled(value: string, lang: LanguageKey) {
  if (lang === 'pl') return value.replace('total', 'razem');
  if (lang === 'es') return value.replace('total', 'total');
  if (lang === 'uk') return value.replace('total', 'разом');
  return value;
}


const xfinityPageContent = {
  en: {
    heroEyebrow: 'Prepaid home internet at CellzTech',
    heroTitleTop: 'Live online for less.',
    heroTitleHighlight: '200 Mbps for $45/mo.',
    heroText: 'Fast prepaid home internet with unlimited data, no annual contract, no credit check, and a free gateway/modem available in-store with your first 30-day purchase.',
    call: 'Call 773-413-7489',
    visit: 'Visit CellzTech',
    heroImageAlt: 'Xfinity Prepaid Internet modem kit box',
    heroImageCaption: 'Actual modem kit style',
    chooseSpeed: 'Choose your speed',
    availableNow: 'Available in store now',
    availableIntro: 'CellzTech currently carries the 200 Mbps NOW Internet by Xfinity prepaid option.',
    mutedAria: '100 Mbps plan not carried at CellzTech',
    mutedButton: 'Not currently sold here',
    mutedText: 'Shown only as a style reference. CellzTech is focused on the 200 Mbps option.',
    featuredAria: '200 Mbps Xfinity prepaid internet plan',
    featuredBadge: 'Available at CellzTech',
    askNow: 'Ask in store / call now',
    pricingLink: 'Pricing & other info',
    planBullets: ['Unlimited internet included', 'Free gateway/modem with first 30-day purchase', 'Works with smart TVs, phones, tablets, laptops, and more', 'No annual contract and no credit check'],
    localHelp: 'Local prepaid internet help',
    storeTitle: 'Walk in, pick up the modem, and get simple help before you buy.',
    storeText: 'The $45 plan is a strong option for apartments, families, students, streaming, school work, smart TVs, phones, tablets, and everyday home use. Many customers like it because it is prepaid, simple, and fast enough for multiple devices at home.',
    deviceCloud: ['Smart TVs', 'iPhones', 'Samsung phones', 'Tablets', 'Laptops', 'Streaming', 'School work', 'Apartments'],
    productCardTitle: 'In-store modem kit',
    productCardText: 'This is the Xfinity Prepaid Internet modem kit style customers can expect in-store. The modem itself is black and the gateway is included with the first 30-day purchase.',
    step1Title: 'Pick up in store',
    step1Text: 'Ask CellzTech about the available 200 Mbps prepaid internet kit and modem availability.',
    step2Title: 'Set up at home',
    step2Text: 'Self-install the gateway and connect your devices to your Wi-Fi network.',
    step3Title: 'Future shipping',
    step3Text: 'Later, customers will be able to request modem ordering and shipping directly from the site.',
    factsLabel: 'Broadband Facts',
    factsTitle: 'NOW Internet 200 Mbps',
    factsSubtitle: 'Fixed broadband consumer disclosure summary',
    factsRows: [
      ['Monthly price', '$45/mo'],
      ['Plan speed', '200 Mbps'],
      ['Typical download', '234 Mbps'],
      ['Typical upload', '24 Mbps'],
      ['Typical latency', '21 ms'],
      ['Data included', 'Unlimited'],
      ['Gateway', 'Included with first 30-day purchase'],
      ['Contract', 'No annual term contract']
    ],
    factsFinePrint: 'This summary is based on the plan details provided for the NOW by Xfinity 200 Mbps prepaid internet option. Price, availability, equipment, and terms are subject to change and should be confirmed before purchase.',
    finePrintLabel: 'Pricing & other info',
    finePrintTitle: 'Important details before buying',
    finePrintItems: [
      'Restrictions apply and service is not available in all areas.',
      'Limited to NOW Internet service with speeds up to 200 Mbps download / 20 Mbps upload. Actual speeds vary and are not guaranteed.',
      'Requires self-installation and activation of a refurbished gateway.',
      'Payments are made online with credit, debit, or prepaid card. Autopay and paperless billing required.',
      'Government taxes are included, data is unlimited, and additional data usage charge is listed as $0 for the plan details provided.'
    ],
    ctaLabel: 'Available at CellzTech',
    ctaTitle: 'Need prepaid home internet?',
    ctaText: 'Call or stop by the store to ask about the $45 NOW Internet 200 Mbps prepaid plan and free gateway/modem availability.',
    storeInfo: 'Store info'
  },
  pl: {
    heroEyebrow: 'Internet domowy prepaid w CellzTech',
    heroTitleTop: 'Bądź online taniej.',
    heroTitleHighlight: '200 Mbps za $45/mies.',
    heroText: 'Szybki internet domowy prepaid z nielimitowanymi danymi, bez rocznej umowy, bez sprawdzania kredytu i z darmowym gateway/modemem dostępnym w sklepie przy pierwszym zakupie 30 dni.',
    call: 'Zadzwoń 773-413-7489',
    visit: 'Odwiedź CellzTech',
    heroImageAlt: 'Pudełko zestawu modemowego Xfinity Prepaid Internet',
    heroImageCaption: 'Rzeczywisty wygląd zestawu',
    chooseSpeed: 'Wybierz prędkość',
    availableNow: 'Dostępne teraz w sklepie',
    availableIntro: 'CellzTech oferuje obecnie prepaid NOW Internet by Xfinity 200 Mbps.',
    mutedAria: 'Plan 100 Mbps niedostępny w CellzTech',
    mutedButton: 'Obecnie niedostępny u nas',
    mutedText: 'Pokazane tylko jako odniesienie stylu. CellzTech skupia się na opcji 200 Mbps.',
    featuredAria: 'Plan prepaid Xfinity 200 Mbps',
    featuredBadge: 'Dostępne w CellzTech',
    askNow: 'Zapytaj w sklepie / zadzwoń teraz',
    pricingLink: 'Cennik i inne informacje',
    planBullets: ['Internet bez limitu w cenie', 'Darmowy gateway/modem przy pierwszym zakupie 30 dni', 'Działa ze Smart TV, telefonami, tabletami, laptopami i innymi urządzeniami', 'Bez rocznej umowy i bez sprawdzania kredytu'],
    localHelp: 'Lokalna pomoc z internetem prepaid',
    storeTitle: 'Wejdź do sklepu, odbierz modem i uzyskaj prostą pomoc przed zakupem.',
    storeText: 'Plan za $45 to bardzo dobra opcja do mieszkań, rodzin, studentów, streamingu, nauki, Smart TV, telefonów, tabletów i codziennego użytku domowego. Klienci lubią go, bo jest prepaid, prosty i wystarczająco szybki dla wielu urządzeń w domu.',
    deviceCloud: ['Smart TV', 'iPhone’y', 'Telefony Samsung', 'Tablety', 'Laptopy', 'Streaming', 'Nauka', 'Mieszkania'],
    productCardTitle: 'Zestaw modemowy w sklepie',
    productCardText: 'To jest styl zestawu Xfinity Prepaid Internet, którego klienci mogą oczekiwać w sklepie. Sam modem jest czarny, a gateway jest wliczony przy pierwszym zakupie 30 dni.',
    step1Title: 'Odbierz w sklepie',
    step1Text: 'Zapytaj w CellzTech o dostępny zestaw prepaid 200 Mbps i dostępność modemu.',
    step2Title: 'Skonfiguruj w domu',
    step2Text: 'Samodzielnie zainstaluj gateway i połącz swoje urządzenia z siecią Wi‑Fi.',
    step3Title: 'Wysyłka w przyszłości',
    step3Text: 'W przyszłości klienci będą mogli zamawiać modem i wysyłkę bezpośrednio ze strony.',
    factsLabel: 'Fakty o usłudze',
    factsTitle: 'NOW Internet 200 Mbps',
    factsSubtitle: 'Podsumowanie ujawnienia dla konsumenta',
    factsRows: [
      ['Cena miesięczna', '$45/mies.'],
      ['Prędkość planu', '200 Mbps'],
      ['Typowe pobieranie', '234 Mbps'],
      ['Typowe wysyłanie', '24 Mbps'],
      ['Typowe opóźnienie', '21 ms'],
      ['Dane w cenie', 'Bez limitu'],
      ['Gateway', 'Wliczony przy pierwszym zakupie 30 dni'],
      ['Umowa', 'Bez rocznej umowy']
    ],
    factsFinePrint: 'To podsumowanie opiera się na podanych szczegółach planu NOW by Xfinity 200 Mbps prepaid internet. Cena, dostępność, sprzęt i warunki mogą się zmienić i powinny zostać potwierdzone przed zakupem.',
    finePrintLabel: 'Cennik i inne informacje',
    finePrintTitle: 'Ważne szczegóły przed zakupem',
    finePrintItems: ['Obowiązują ograniczenia, a usługa nie jest dostępna we wszystkich lokalizacjach.', 'Usługa ograniczona do NOW Internet z prędkościami do 200 Mbps pobierania / 20 Mbps wysyłania. Rzeczywiste prędkości są różne i nie są gwarantowane.', 'Wymaga samodzielnej instalacji i aktywacji odnowionego gatewaya.', 'Płatności są dokonywane online kartą kredytową, debetową lub prepaid. Wymagany autopay i paperless billing.', 'Podatki są wliczone, dane są bez limitu, a opłata za dodatkowe dane w podanych szczegółach planu wynosi $0.'],
    ctaLabel: 'Dostępne w CellzTech',
    ctaTitle: 'Potrzebujesz domowego internetu prepaid?',
    ctaText: 'Zadzwoń lub odwiedź sklep, aby zapytać o plan NOW Internet 200 Mbps za $45 i dostępność darmowego gateway/modemu.',
    storeInfo: 'Informacje o sklepie'
  },
  es: {
    heroEyebrow: 'Internet residencial prepago en CellzTech',
    heroTitleTop: 'Conéctate por menos.',
    heroTitleHighlight: '200 Mbps por $45/mes.',
    heroText: 'Internet residencial prepago rápido con datos ilimitados, sin contrato anual, sin revisión de crédito y con gateway/módem gratis disponible en tienda con tu primera compra de 30 días.',
    call: 'Llama al 773-413-7489',
    visit: 'Visita CellzTech',
    heroImageAlt: 'Caja del kit de módem Xfinity Prepaid Internet',
    heroImageCaption: 'Estilo real del kit de módem',
    chooseSpeed: 'Elige tu velocidad',
    availableNow: 'Disponible ahora en tienda',
    availableIntro: 'CellzTech actualmente ofrece la opción prepaga NOW Internet by Xfinity de 200 Mbps.',
    mutedAria: 'Plan de 100 Mbps no disponible en CellzTech',
    mutedButton: 'No se vende aquí actualmente',
    mutedText: 'Se muestra solo como referencia de estilo. CellzTech está enfocado en la opción de 200 Mbps.',
    featuredAria: 'Plan de internet prepago Xfinity de 200 Mbps',
    featuredBadge: 'Disponible en CellzTech',
    askNow: 'Pregunta en tienda / llama ahora',
    pricingLink: 'Precio y otra información',
    planBullets: ['Internet ilimitado incluido', 'Gateway/módem gratis con la primera compra de 30 días', 'Funciona con Smart TVs, teléfonos, tabletas, laptops y más', 'Sin contrato anual y sin revisión de crédito'],
    localHelp: 'Ayuda local con internet prepago',
    storeTitle: 'Entra a la tienda, recoge el módem y recibe ayuda sencilla antes de comprar.',
    storeText: 'El plan de $45 es una buena opción para apartamentos, familias, estudiantes, streaming, tareas escolares, Smart TVs, teléfonos, tabletas y uso diario en casa. A muchos clientes les gusta porque es prepago, simple y lo suficientemente rápido para varios dispositivos en casa.',
    deviceCloud: ['Smart TVs', 'iPhones', 'Teléfonos Samsung', 'Tabletas', 'Laptops', 'Streaming', 'Tareas escolares', 'Apartamentos'],
    productCardTitle: 'Kit de módem en tienda',
    productCardText: 'Este es el estilo del kit Xfinity Prepaid Internet que los clientes pueden esperar en tienda. El módem es negro y el gateway está incluido con la primera compra de 30 días.',
    step1Title: 'Recógelo en tienda',
    step1Text: 'Pregunta en CellzTech por el kit de internet prepago de 200 Mbps y la disponibilidad del módem.',
    step2Title: 'Instálalo en casa',
    step2Text: 'Instala el gateway por tu cuenta y conecta tus dispositivos a tu red Wi‑Fi.',
    step3Title: 'Envíos en el futuro',
    step3Text: 'Más adelante, los clientes podrán pedir el módem y el envío directamente desde el sitio.',
    factsLabel: 'Datos de banda ancha',
    factsTitle: 'NOW Internet 200 Mbps',
    factsSubtitle: 'Resumen de divulgación para el consumidor',
    factsRows: [
      ['Precio mensual', '$45/mes'],
      ['Velocidad del plan', '200 Mbps'],
      ['Descarga típica', '234 Mbps'],
      ['Carga típica', '24 Mbps'],
      ['Latencia típica', '21 ms'],
      ['Datos incluidos', 'Ilimitados'],
      ['Gateway', 'Incluido con la primera compra de 30 días'],
      ['Contrato', 'Sin contrato anual']
    ],
    factsFinePrint: 'Este resumen se basa en los detalles proporcionados para la opción prepaga NOW by Xfinity Internet de 200 Mbps. El precio, la disponibilidad, el equipo y las condiciones pueden cambiar y deben confirmarse antes de comprar.',
    finePrintLabel: 'Precio y otra información',
    finePrintTitle: 'Detalles importantes antes de comprar',
    finePrintItems: ['Aplican restricciones y el servicio no está disponible en todas las áreas.', 'Limitado al servicio NOW Internet con velocidades de hasta 200 Mbps de descarga / 20 Mbps de carga. Las velocidades reales varían y no están garantizadas.', 'Requiere auto instalación y activación de un gateway reacondicionado.', 'Los pagos se hacen en línea con tarjeta de crédito, débito o prepago. Se requiere autopay y facturación sin papel.', 'Los impuestos están incluidos, los datos son ilimitados y el cargo por uso adicional de datos aparece como $0 en los detalles del plan proporcionados.'],
    ctaLabel: 'Disponible en CellzTech',
    ctaTitle: '¿Necesitas internet residencial prepago?',
    ctaText: 'Llama o visita la tienda para preguntar por el plan prepago NOW Internet 200 Mbps de $45 y la disponibilidad del gateway/módem gratis.',
    storeInfo: 'Información de la tienda'
  },
  uk: {
    heroEyebrow: 'Домашній prepaid-інтернет у CellzTech',
    heroTitleTop: 'Будьте онлайн дешевше.',
    heroTitleHighlight: '200 Mbps за $45/міс.',
    heroText: 'Швидкий prepaid-інтернет для дому з безлімітними даними, без річного контракту, без перевірки кредиту та з безкоштовним gateway/модемом у магазині при першій 30-денній покупці.',
    call: 'Подзвонити 773-413-7489',
    visit: 'Відвідати CellzTech',
    heroImageAlt: 'Коробка комплекту модема Xfinity Prepaid Internet',
    heroImageCaption: 'Реальний вигляд комплекту',
    chooseSpeed: 'Оберіть швидкість',
    availableNow: 'Зараз доступно в магазині',
    availableIntro: 'CellzTech зараз пропонує prepaid-опцію NOW Internet by Xfinity 200 Mbps.',
    mutedAria: 'План 100 Mbps не продається в CellzTech',
    mutedButton: 'Зараз у нас не продається',
    mutedText: 'Показано лише як стильовий приклад. CellzTech зосереджується на варіанті 200 Mbps.',
    featuredAria: 'План prepaid-інтернету Xfinity 200 Mbps',
    featuredBadge: 'Доступно в CellzTech',
    askNow: 'Запитайте в магазині / подзвоніть зараз',
    pricingLink: 'Ціни та інша інформація',
    planBullets: ['Безлімітний інтернет включено', 'Безкоштовний gateway/модем із першою 30-денною покупкою', 'Працює зі Smart TV, телефонами, планшетами, ноутбуками та іншими пристроями', 'Без річного контракту і без кредитної перевірки'],
    localHelp: 'Локальна допомога з prepaid-інтернетом',
    storeTitle: 'Зайдіть у магазин, заберіть модем і отримайте просту допомогу перед покупкою.',
    storeText: 'План за $45 — це хороший варіант для квартир, сімей, студентів, стримінгу, навчання, Smart TV, телефонів, планшетів і щоденного домашнього використання. Багатьом клієнтам він подобається, бо це prepaid, просто і достатньо швидко для кількох пристроїв удома.',
    deviceCloud: ['Smart TV', 'iPhone', 'Телефони Samsung', 'Планшети', 'Ноутбуки', 'Стримінг', 'Навчання', 'Квартири'],
    productCardTitle: 'Комплект модема в магазині',
    productCardText: 'Це стиль комплекту Xfinity Prepaid Internet, який клієнти можуть очікувати в магазині. Сам модем чорний, а gateway включений при першій 30-денній покупці.',
    step1Title: 'Заберіть у магазині',
    step1Text: 'Запитайте в CellzTech про доступний prepaid-комплект 200 Mbps і наявність модема.',
    step2Title: 'Налаштуйте вдома',
    step2Text: 'Самостійно встановіть gateway і підключіть свої пристрої до мережі Wi‑Fi.',
    step3Title: 'Доставка в майбутньому',
    step3Text: 'Пізніше клієнти зможуть замовляти модем і доставку безпосередньо з сайту.',
    factsLabel: 'Факти про інтернет',
    factsTitle: 'NOW Internet 200 Mbps',
    factsSubtitle: 'Підсумок споживчого розкриття',
    factsRows: [
      ['Місячна ціна', '$45/міс.'],
      ['Швидкість плану', '200 Mbps'],
      ['Типове завантаження', '234 Mbps'],
      ['Типове відвантаження', '24 Mbps'],
      ['Типова затримка', '21 мс'],
      ['Дані в плані', 'Безлімітні'],
      ['Gateway', 'Включено з першою 30-денною покупкою'],
      ['Контракт', 'Без річного контракту']
    ],
    factsFinePrint: 'Це резюме базується на наданих деталях prepaid-варіанту NOW by Xfinity Internet 200 Mbps. Ціна, доступність, обладнання та умови можуть змінюватися і мають бути підтверджені перед покупкою.',
    finePrintLabel: 'Ціни та інша інформація',
    finePrintTitle: 'Важливі деталі перед покупкою',
    finePrintItems: ['Діють обмеження, і послуга доступна не в усіх районах.', 'Обмежено послугою NOW Internet зі швидкістю до 200 Mbps завантаження / 20 Mbps відвантаження. Фактичні швидкості відрізняються і не гарантуються.', 'Потрібна самостійна установка та активація відновленого gateway.', 'Оплати здійснюються онлайн кредитною, дебетовою або prepaid-карткою. Потрібні autopay і paperless billing.', 'Податки включені, дані безлімітні, а плата за додаткове використання даних у наданих деталях плану вказана як $0.'],
    ctaLabel: 'Доступно в CellzTech',
    ctaTitle: 'Потрібен домашній prepaid-інтернет?',
    ctaText: 'Подзвоніть або завітайте до магазину, щоб дізнатися про prepaid-план NOW Internet 200 Mbps за $45 і наявність безкоштовного gateway/модема.',
    storeInfo: 'Інформація про магазин'
  }
} satisfies Record<LanguageKey, {
  heroEyebrow: string;
  heroTitleTop: string;
  heroTitleHighlight: string;
  heroText: string;
  call: string;
  visit: string;
  heroImageAlt: string;
  heroImageCaption: string;
  chooseSpeed: string;
  availableNow: string;
  availableIntro: string;
  mutedAria: string;
  mutedButton: string;
  mutedText: string;
  featuredAria: string;
  featuredBadge: string;
  askNow: string;
  pricingLink: string;
  planBullets: string[];
  localHelp: string;
  storeTitle: string;
  storeText: string;
  deviceCloud: string[];
  productCardTitle: string;
  productCardText: string;
  step1Title: string;
  step1Text: string;
  step2Title: string;
  step2Text: string;
  step3Title: string;
  step3Text: string;
  factsLabel: string;
  factsTitle: string;
  factsSubtitle: string;
  factsRows: [string, string][];
  factsFinePrint: string;
  finePrintLabel: string;
  finePrintTitle: string;
  finePrintItems: string[];
  ctaLabel: string;
  ctaTitle: string;
  ctaText: string;
  storeInfo: string;
}>;

function XfinityPrepaidPage({ lang }: { lang: LanguageKey }) {
  const copy = xfinityPageContent[lang];

  return (
    <main className="xfinityPage">
      <section className="xfinityNowHero">
        <div className="wrap">
          <div className="xfinityNowHeroPanel">
            <div className="nowBrandMark" aria-label="NOW by Xfinity"><span>NOW</span><small>by Xfinity</small></div>
            <div className="xfinityHeroLayout">
              <div className="xfinityHeroContent">
                <p className="nowEyebrow">{copy.heroEyebrow}</p>
                <h1>{copy.heroTitleTop}<br /><span>{copy.heroTitleHighlight}</span></h1>
                <p className="nowHeroText">{copy.heroText}</p>
                <div className="nowHeroActions">
                  <a className="xfinityPrimary" href="tel:7734137489">{copy.call}</a>
                  <button className="xfinitySecondary" type="button" onClick={() => goTo('contact')}>{copy.visit}</button>
                </div>
              </div>
              <div className="xfinityHeroVisual">
                <div className="xfinityProductCard">
                  <span className="xfinityProductTag">{copy.heroImageCaption}</span>
                  <img src="/xfinity-prepaid-modem-kit.png" alt={copy.heroImageAlt} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section xfinitySpeedSection">
        <div className="wrap">
          <div className="xfinitySectionHeader centered">
            <span className="xfinityLabel">{copy.chooseSpeed}</span>
            <h2>{copy.availableNow}</h2>
            <p>{copy.availableIntro}</p>
          </div>

          <div className="xfinityPlanShowcase">
            <article className="xfinityOfficialCard mutedPlan" aria-label={copy.mutedAria}>
              <div className="planTopLine">
                <h3>100 <span>Mbps</span></h3>
                <strong>$30/mo</strong>
              </div>
              <button className="xfinityGhostButton" type="button" disabled>{copy.mutedButton}</button>
              <p>{copy.mutedText}</p>
            </article>

            <article className="xfinityOfficialCard featuredPlan" aria-label={copy.featuredAria}>
              <span className="featuredBadge">{copy.featuredBadge}</span>
              <div className="planTopLine">
                <h3>200 <span>Mbps</span></h3>
                <strong>$45/mo</strong>
              </div>
              <a className="xfinityAddCart" href="tel:7734137489">{copy.askNow}</a>
              <button className="pricingLink" type="button" onClick={() => document.getElementById('xfinity-facts')?.scrollIntoView({ behavior: 'smooth' })}>{copy.pricingLink}</button>
              <ul className="xfinityPlanBullets">
                {copy.planBullets.map((item: string) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section xfinityStoreSection refined">
        <div className="wrap xfinityStoreGrid">
          <div className="xfinityStoreCopy">
            <span className="xfinityLabel">{copy.localHelp}</span>
            <h2>{copy.storeTitle}</h2>
            <p>{copy.storeText}</p>
            <div className="xfinityDeviceCloud">
              {copy.deviceCloud.map((item: string) => <span key={item}>{item}</span>)}
            </div>
          </div>
          <div className="xfinityStepCards refinedSteps">
            <article className="xfinityModemFeatureCard">
              <div className="xfinityModemImageWrap">
                <img src="/xfinity-prepaid-modem-kit.png" alt={copy.heroImageAlt} />
              </div>
              <h3>{copy.productCardTitle}</h3>
              <p>{copy.productCardText}</p>
            </article>
            <article><Store size={25} /><h3>{copy.step1Title}</h3><p>{copy.step1Text}</p></article>
            <article><Wifi size={25} /><h3>{copy.step2Title}</h3><p>{copy.step2Text}</p></article>
            <article><MessageCircle size={25} /><h3>{copy.step3Title}</h3><p>{copy.step3Text}</p></article>
          </div>
        </div>
      </section>

      <section className="section xfinityFactsSection" id="xfinity-facts">
        <div className="wrap xfinityFactsGrid">
          <div className="xfinityFactsCard nowFactsCard">
            <div className="factsHeader">
              <span>{copy.factsLabel}</span>
              <h2>{copy.factsTitle}</h2>
              <p>{copy.factsSubtitle}</p>
            </div>
            <div className="factsRows">
              {copy.factsRows.map(([label, value]: [string, string]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <p className="factsFinePrint">{copy.factsFinePrint}</p>
          </div>
          <aside className="xfinityFinePrintCard">
            <span className="xfinityLabel">{copy.finePrintLabel}</span>
            <h3>{copy.finePrintTitle}</h3>
            <ul>
              {copy.finePrintItems.map((item: string) => <li key={item}>{item}</li>)}
            </ul>
          </aside>
        </div>
      </section>

      <section className="section xfinityCtaSection">
        <div className="wrap xfinityCtaPanel nowCtaPanel">
          <div>
            <span className="xfinityLabel">{copy.ctaLabel}</span>
            <h2>{copy.ctaTitle}</h2>
            <p>{copy.ctaText}</p>
          </div>
          <div className="xfinityCtaButtons">
            <a className="xfinityPrimary" href="tel:7734137489">{copy.call}</a>
            <button className="xfinitySecondary" type="button" onClick={() => goTo('contact')}>{copy.storeInfo}</button>
          </div>
        </div>
      </section>
    </main>
  );
}


function UltraIcon({ icon }: { icon: 'globe' | 'check' | 'wifi' }) {
  if (icon === 'globe') return <Globe2 size={26} />;
  if (icon === 'check') return <CheckCircle2 size={26} />;
  return <Wifi size={26} />;
}


type SavingsCalculatorCopy = {
  open: string;
  eyebrow: string;
  title: string;
  text: string;
  currentBill: string;
  currentPlaceholder: string;
  choosePlan: string;
  monthlySavings: string;
  yearlySavings: string;
  noSavings: string;
  helper: string;
  close: string;
  call: string;
  start: string;
  note: string;
};

const savingsCalculatorCopy: Record<LanguageKey, SavingsCalculatorCopy> = {
  en: {
    open: 'Calculate savings',
    eyebrow: 'Ultra Mobile savings calculator',
    title: 'See how much you could save by switching.',
    text: 'Enter what you pay now, choose an Ultra Mobile plan, and preview estimated monthly and yearly savings.',
    currentBill: 'What do you pay now each month?',
    currentPlaceholder: 'Example: 85',
    choosePlan: 'Choose an Ultra Mobile option',
    monthlySavings: 'Estimated monthly savings',
    yearlySavings: 'Estimated yearly savings',
    noSavings: 'This plan may not save money based on that number, but it may still offer features you want.',
    helper: 'Savings are estimates only. Taxes, fees, promos, plan availability, and account details must be confirmed before activation.',
    close: 'Close',
    call: 'Call CellzTech',
    start: 'Start SIM request',
    note: 'Tip: many customers are surprised when they see the yearly number.'
  },
  pl: {
    open: 'Oblicz oszczędności',
    eyebrow: 'Kalkulator oszczędności Ultra Mobile',
    title: 'Sprawdź, ile możesz zaoszczędzić po zmianie.',
    text: 'Wpisz, ile płacisz teraz, wybierz plan Ultra Mobile i zobacz szacunkową oszczędność miesięczną oraz roczną.',
    currentBill: 'Ile płacisz teraz miesięcznie?',
    currentPlaceholder: 'Przykład: 85',
    choosePlan: 'Wybierz opcję Ultra Mobile',
    monthlySavings: 'Szacunkowa oszczędność miesięczna',
    yearlySavings: 'Szacunkowa oszczędność roczna',
    noSavings: 'Ten plan może nie dawać oszczędności przy tej kwocie, ale nadal może mieć funkcje, których potrzebujesz.',
    helper: 'Oszczędności są szacunkowe. Podatki, opłaty, promocje, dostępność planu i szczegóły konta muszą zostać potwierdzone przed aktywacją.',
    close: 'Zamknij',
    call: 'Zadzwoń do CellzTech',
    start: 'Zamów SIM',
    note: 'Wskazówka: wielu klientów jest zaskoczonych, gdy widzi kwotę roczną.'
  },
  es: {
    open: 'Calcular ahorros',
    eyebrow: 'Calculadora de ahorros Ultra Mobile',
    title: 'Mira cuánto podrías ahorrar al cambiarte.',
    text: 'Ingresa lo que pagas ahora, elige un plan Ultra Mobile y mira un estimado de ahorro mensual y anual.',
    currentBill: '¿Cuánto pagas ahora cada mes?',
    currentPlaceholder: 'Ejemplo: 85',
    choosePlan: 'Elige una opción de Ultra Mobile',
    monthlySavings: 'Ahorro mensual estimado',
    yearlySavings: 'Ahorro anual estimado',
    noSavings: 'Este plan quizá no ahorre dinero con ese monto, pero aún puede tener funciones que quieres.',
    helper: 'Los ahorros son estimados. Impuestos, cargos, promociones, disponibilidad del plan y detalles de la cuenta deben confirmarse antes de activar.',
    close: 'Cerrar',
    call: 'Llamar a CellzTech',
    start: 'Solicitar SIM',
    note: 'Consejo: muchos clientes se sorprenden cuando ven el número anual.'
  },
  uk: {
    open: 'Порахувати економію',
    eyebrow: 'Калькулятор економії Ultra Mobile',
    title: 'Подивіться, скільки можна заощадити після переходу.',
    text: 'Введіть, скільки ви платите зараз, виберіть план Ultra Mobile і перегляньте орієнтовну щомісячну та річну економію.',
    currentBill: 'Скільки ви платите зараз щомісяця?',
    currentPlaceholder: 'Наприклад: 85',
    choosePlan: 'Виберіть опцію Ultra Mobile',
    monthlySavings: 'Орієнтовна щомісячна економія',
    yearlySavings: 'Орієнтовна річна економія',
    noSavings: 'Цей план може не заощадити гроші при цій сумі, але може мати потрібні вам функції.',
    helper: 'Економія є орієнтовною. Податки, збори, акції, доступність плану та деталі акаунта потрібно підтвердити перед активацією.',
    close: 'Закрити',
    call: 'Подзвонити CellzTech',
    start: 'Запит SIM',
    note: 'Порада: багатьох клієнтів дивує річна сума.'
  }
};

function moneyFromPlan(value: string) {
  const match = String(value || '').match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function UltraSavingsCalculator({ lang, open, onClose }: { lang: LanguageKey; open: boolean; onClose: () => void }) {
  const copy = savingsCalculatorCopy[lang] || savingsCalculatorCopy.en;
  const planOptions = [
    ...ultraPlans.map((plan) => ({
      label: `${plan.name} - ${plan.durations['1']?.monthly || `${plan.basePrice}/mo`}`,
      price: moneyFromPlan(plan.durations['1']?.monthly || plan.basePrice)
    })),
    { label: '4 Ultra Unlimited lines - $100/mo', price: 100 }
  ];
  const [currentBill, setCurrentBill] = useState('85');
  const [selectedIndex, setSelectedIndex] = useState(() => Math.max(0, planOptions.findIndex((plan) => plan.price === 39)));
  const selectedPlan = planOptions[selectedIndex] || planOptions[0];
  const current = Math.max(0, Number(currentBill) || 0);
  const monthlySavings = Math.max(0, current - selectedPlan.price);
  const yearlySavings = monthlySavings * 12;
  const savingsPercent = current ? Math.min(100, Math.round((monthlySavings / current) * 100)) : 0;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('modalOpen');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('modalOpen');
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="savingsModalBackdrop" role="presentation" onMouseDown={onClose}>
      <section className="savingsModal" role="dialog" aria-modal="true" aria-labelledby="savingsCalculatorTitle" onMouseDown={(event) => event.stopPropagation()}>
        <button className="savingsClose" type="button" onClick={onClose} aria-label={copy.close}><X size={22} /></button>
        <div className="savingsModalHeader">
          <span>{copy.eyebrow}</span>
          <h2 id="savingsCalculatorTitle">{copy.title}</h2>
          <p>{copy.text}</p>
        </div>

        <div className="savingsCalculatorGrid">
          <div className="savingsInputsCard">
            <label>
              <span>{copy.currentBill}</span>
              <div className="moneyInputWrap">
                <b>$</b>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={currentBill}
                  onChange={(event) => setCurrentBill(event.target.value)}
                  placeholder={copy.currentPlaceholder}
                />
              </div>
            </label>

            <label>
              <span>{copy.choosePlan}</span>
              <select value={selectedIndex} onChange={(event) => setSelectedIndex(Number(event.target.value))}>
                {planOptions.map((plan, index) => <option key={plan.label} value={index}>{plan.label}</option>)}
              </select>
            </label>

            <div className="savingsCompareMini">
              <div><small>Current</small><strong>${current || 0}/mo</strong></div>
              <div><small>Ultra</small><strong>${selectedPlan.price}/mo</strong></div>
            </div>
          </div>

          <div className="savingsResultsCard">
            <div className="savingsGauge" style={{ '--savePercent': `${savingsPercent}%` } as React.CSSProperties}>
              <strong>{savingsPercent}%</strong>
              <span>possible reduction</span>
            </div>
            <div className="savingsResultNumbers">
              <div>
                <span>{copy.monthlySavings}</span>
                <strong>${monthlySavings.toLocaleString()}/mo</strong>
              </div>
              <div className="yearlySavingsHighlight">
                <span>{copy.yearlySavings}</span>
                <strong>${yearlySavings.toLocaleString()}/yr</strong>
              </div>
            </div>
            {monthlySavings <= 0 ? <p className="savingsNoSavings">{copy.noSavings}</p> : <p className="savingsNote">{copy.note}</p>}
          </div>
        </div>

        <div className="savingsModalFooter">
          <p>{copy.helper}</p>
          <div>
            <a className="secondaryBtn compact" href="tel:7734137489">{copy.call}</a>
            <button className="primaryBtn compact" type="button" onClick={() => { onClose(); goTo('sim'); }}>{copy.start}</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function UltraPlanStoreCard({ plan, lang }: { plan: UltraPlan; lang: LanguageKey }) {
  const [duration, setDuration] = useState<DurationKey>('1');
  const copy = ultraCopy[lang] || ultraCopy.en;
  const planText = copy.plans[plan.name] || ultraCopy.en.plans[plan.name];
  const selected = plan.durations[duration] || plan.durations['1'];
  const selectedTab = copy.durationTabs.find((tab) => tab.key === duration);
  const selectedLabel = selectedTab?.label || selected?.label || 'Not selected';
  const selectedMonthly = selected?.monthly ? localizeMonthly(selected.monthly, lang) : `${plan.basePrice}/mo`;
  const selectedBilled = selected?.billed ? localizeBilled(selected.billed, lang) : copy.planCard.askPricing;
  const purchasePath = `${routes.sim}?plan=${encodeURIComponent(plan.name)}&duration=${encodeURIComponent(selectedLabel)}&durationKey=${encodeURIComponent(duration)}&price=${encodeURIComponent(selectedMonthly)}&billed=${encodeURIComponent(selectedBilled)}`;

  return (
    <article className={`ultraStorePlan ${plan.badge === 'Most Popular' ? 'bestPlan' : ''}`}>
      <div className="ultraPlanTop">
        <div>
          <span className="planDataPill">{plan.data}</span>
          <h3>{planText.name}</h3>
          <p>{planText.highlight}</p>
        </div>
        <div className="planBadges">
          {plan.promoEligible && <strong className="dealPill promoOnlyPill">{copy.planCard.promoEligible}</strong>}
          {(planText.badge || plan.badge) && <strong className="dealPill">{planText.badge || plan.badge}</strong>}
        </div>
      </div>

      <div className="planBuilder">
        <aside className="planIncludes">
          <strong>{copy.planCard.includes}</strong>
          <ul>{planText.includes.map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="activationDetails">
            <strong>{copy.planCard.activation}</strong>
            <ul>
              {copy.planCard.activationItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </aside>

        <div className="planPurchasePanel">
          <div className="durationTabs" role="tablist" aria-label={`${planText.name} duration options`}>
            {copy.durationTabs.map((tab) => {
              const option = plan.durations[tab.key];
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={duration === tab.key ? 'active' : ''}
                  onClick={() => option && setDuration(tab.key)}
                  disabled={!option}
                >
                  <span>{tab.label}</span>
                  <small>{option ? (plan.promoEligible && tab.key === '1' ? copy.planCard.fourthFree : tab.sublabel) : copy.planCard.askStore}</small>
                </button>
              );
            })}
          </div>

          {plan.promoEligible && (
            <div className={`promoRuleNote ${duration === '1' ? 'activePromoRule' : ''}`}>
              <strong>{duration === '1' ? copy.planCard.promoApplyTitle : copy.planCard.multiTitle}</strong>
              <span>{duration === '1' ? copy.planCard.promoApplyText : copy.planCard.multiText}</span>
            </div>
          )}

          <div className="simSelectorPreview">
            <div>
              <strong>{copy.planCard.simTitle}</strong>
              <span>{copy.planCard.simText}</span>
            </div>
            <div>
              <strong>{copy.planCard.esimTitle}</strong>
              <span>{copy.planCard.esimText}</span>
            </div>
          </div>

          <div className="planSubtotal">
            <span>{copy.planCard.subtotal}</span>
            <strong>{selectedMonthly}</strong>
            <small>{selectedBilled}<br />{copy.planCard.taxes}</small>
          </div>

          <div className="planCtas">
            <button
              className="primaryBtn"
              type="button"
              onClick={() => goToPath(purchasePath)}
            >
              {copy.planCard.startPurchase} <ShoppingBag size={18} />
            </button>
            <a className="secondaryBtn" href="tel:7734137489">{copy.planCard.callPlan}</a>
          </div>
        </div>
      </div>
    </article>
  );
}

function UltraDetails({ lang }: { lang: LanguageKey }) {
  const copy = ultraCopy[lang] || ultraCopy.en;
  const [savingsOpen, setSavingsOpen] = useState(false);
  const calcCopy = savingsCalculatorCopy[lang] || savingsCalculatorCopy.en;

  return (
    <>
      <section className="section ultraStoreHero">
        <div className="wrap ultraHeroStack">
          <div className="ultraHeroGrid">
            <div className="ultraHeroCopy">
              <span className="summerLabel">{copy.hero.label}</span>
              <h1>{copy.hero.title}</h1>
              <p>{copy.hero.text}</p>
              <div className="ultraHeroButtons">
                <a className="primaryBtn" href="tel:7734137489">{copy.hero.call} <ArrowRight size={18} /></a>
                <button className="secondaryBtn savingsTriggerBtn" type="button" onClick={() => setSavingsOpen(true)}>{calcCopy.open}</button>
                <button className="secondaryBtn" onClick={() => goTo('contact')}>{copy.hero.visit}</button>
              </div>
            </div>
            <div className="familyShowcaseCard">
              <div className="sunBadge">{copy.family.badge.split('\n').map((part) => <React.Fragment key={part}>{part}<br /></React.Fragment>)}</div>
              <span>{copy.family.label}</span>
              <strong>4 FOR $100</strong>
              <h3>{copy.family.title}</h3>
              <p>{copy.family.text}</p>
              <div className="familyPromoDetails" aria-label="Ultra 4 for 100 promotion details">
                {familyLinePrices.map((item, index) => (
                  <div key={item.label} className={index === 3 ? 'highlight' : ''}>
                    <small>{copy.family.lineLabels[index] || item.label}</small>
                    <b>{localizeMonthly(item.price, lang)}</b>
                  </div>
                ))}
              </div>
              <ul className="promoChecklist">
                {copy.family.checklist.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <a className="primaryBtn compact" href={`${routes.sim}?request=family&plan=${encodeURIComponent('4 for $100 Family Promo')}&duration=${encodeURIComponent('Monthly family offer')}&price=${encodeURIComponent('$100/mo')}`}>{copy.family.cta}</a>
            </div>
          </div>

          <div className="ultraHeroInfoBand">
            <article className="ultraInfoCard ultraQuickCard">
              <span>{copy.quick.label}</span>
              <h3>{copy.quick.title}</h3>
              <ul>
                {copy.quick.items.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            {copy.infoCards.map((card) => (
              <article className="ultraInfoCard" key={card.title}>
                <UltraIcon icon={card.icon} />
                <span>{card.label}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section ultraFeatureSection light">
        <div className="wrap ultraFeatureGrid">
          <article className="ultraFeatureCard familyPricingCard">
            <span>{copy.familyFeature.label}</span>
            <h2>{copy.familyFeature.title}</h2>
            <p>{copy.familyFeature.text}</p>
            <div className="familyPriceGrid">
              {familyLinePrices.map((item, index) => (
                <div key={item.label}>
                  <span>{copy.family.lineLabels[index] || item.label}</span>
                  <strong>{localizeMonthly(item.price, lang)}</strong>
                </div>
              ))}
            </div>
            <small>{copy.familyFeature.fine}</small>
          </article>

          <article className="ultraFeatureCard roamCard">
            <span>{copy.roamFeature.label}</span>
            <h2>{copy.roamFeature.title}</h2>
            <p>{copy.roamFeature.textPrefix} <strong>ACTIVATE</strong> {copy.roamFeature.textMiddle} <strong>6700</strong>. {copy.roamFeature.textSuffix}</p>
            <div className="roamPassGrid">
              {copy.passes.map((pass) => (
                <div key={pass.name}>
                  <strong>{pass.name}</strong>
                  <span>{pass.duration}</span>
                  <p>{pass.talk} • {pass.texts} • {pass.data}</p>
                </div>
              ))}
            </div>
            <small>{copy.roamFeature.fine}</small>
          </article>
        </div>
      </section>

      <section className="section ultraSavingsBannerSection light">
        <div className="wrap">
          <div className="ultraSavingsBanner">
            <div>
              <span>{calcCopy.eyebrow}</span>
              <h2>{calcCopy.title}</h2>
              <p>{calcCopy.text}</p>
            </div>
            <button className="primaryBtn" type="button" onClick={() => setSavingsOpen(true)}>{calcCopy.open} <DollarSign size={18} /></button>
          </div>
        </div>
      </section>

      <section className="section ultraStorePlansSection light">
        <div className="wrap">
          <div className="sectionIntro centeredIntro">
            <span>{copy.planSection.label}</span>
            <h2>{copy.planSection.title}</h2>
            <p>{copy.planSection.text}</p>
          </div>
          <div className="ultraStorePlans">
            {ultraPlans.map((plan) => <UltraPlanStoreCard key={plan.name} plan={plan} lang={lang} />)}
          </div>
          <p className="ultraFinePrint">{copy.planSection.finePrint}</p>
        </div>
      </section>

      <section className="section ultraSimSection">
        <div className="wrap ultraSimGrid">
          <div className="ultraSimCopy">
            <span className="summerLabel">{copy.simSection.label}</span>
            <h2>{copy.simSection.title}</h2>
            <p>{copy.simSection.text}</p>
          </div>
          <div className="simStoreCards">
            {copy.simSection.options.map((option) => (
              <article key={option.title}>
                <ShoppingBag size={24} />
                <h3>{option.title}</h3>
                <p>{option.text}</p>
                <button type="button" onClick={() => goTo('sim')}>{option.cta}</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <UltraSavingsCalculator lang={lang} open={savingsOpen} onClose={() => setSavingsOpen(false)} />
    </>
  );
}

const simRequestCopy = {
  en: {
    badge: 'Ultra Mobile SIM request',
    title: 'Request an Ultra Mobile SIM card.',
    text: 'Choose shipping, store pickup, or eSIM help. This is not checkout yet — we will confirm SIM availability, activation details, shipping, and payment before anything is finalized.',
    options: [
      { key: 'shipping', title: 'Ship a physical SIM', text: 'Request a physical Ultra Mobile SIM card shipped anywhere in the USA.' },
      { key: 'pickup', title: 'Pick up in Chicago', text: 'Reserve a SIM for pickup and activation help at CellzTech.' },
      { key: 'esim', title: 'Ask about eSIM', text: 'Check whether your compatible phone can use Ultra Mobile eSIM.' }
    ],
    plan: 'Plan you are interested in', choosePlan: 'Choose a plan or select not sure', activation: 'I need help activating or transferring my number', contact: 'Contact details', name: 'Full name', phone: 'Phone number', email: 'Email address', shipping: 'Shipping address', address: 'Street address', city: 'City', state: 'State', zip: 'ZIP code', notes: 'Notes', notesPlaceholder: 'Example: I need a SIM for a family member in another state.', submit: 'Send SIM request', sending: 'Sending request...', success: 'SIM request sent. We will contact you to confirm availability, shipping, activation, and payment details.', error: 'Please check the form and try again.', disclaimer: 'SIM shipping and activation are not confirmed until CellzTech contacts you. Taxes, shipping, plan pricing, promo eligibility, and activation details may vary.', selectedLabel: 'Selected Ultra option', familyLabel: 'Featured family offer', noPlanSelected: 'Choose a plan below', confirmPricing: 'We will confirm pricing', offerNote: 'Submit the request below and CellzTech will confirm SIM availability, plan details, shipping or pickup, and payment options before anything is finalized.', promiseSimTitle: 'SIM', promiseSim: 'Physical SIM shipping, pickup, or eSIM help', promisePickupTitle: 'Pickup', promisePickup: 'Local setup help at CellzTech Chicago', promiseConfirmTitle: 'Confirm', promiseConfirm: 'We contact you before payment or activation'
  },
  pl: {
    badge: 'Prośba o kartę SIM Ultra Mobile', title: 'Zamów kartę SIM Ultra Mobile.', text: 'Wybierz wysyłkę, odbiór w sklepie albo pomoc z eSIM. To jeszcze nie jest płatność online — potwierdzimy dostępność SIM, aktywację, wysyłkę i płatność przed finalizacją.',
    options: [
      { key: 'shipping', title: 'Wyślij fizyczną kartę SIM', text: 'Poproś o wysyłkę fizycznej karty SIM Ultra Mobile na terenie USA.' },
      { key: 'pickup', title: 'Odbiór w Chicago', text: 'Zarezerwuj SIM do odbioru i pomocy przy aktywacji w CellzTech.' },
      { key: 'esim', title: 'Zapytaj o eSIM', text: 'Sprawdź, czy Twój zgodny telefon może użyć eSIM Ultra Mobile.' }
    ],
    plan: 'Plan, który Cię interesuje', choosePlan: 'Wybierz plan albo zaznacz, że nie masz pewności', activation: 'Potrzebuję pomocy z aktywacją lub przeniesieniem numeru', contact: 'Dane kontaktowe', name: 'Imię i nazwisko', phone: 'Numer telefonu', email: 'Adres e-mail', shipping: 'Adres wysyłki', address: 'Ulica i numer', city: 'Miasto', state: 'Stan', zip: 'Kod ZIP', notes: 'Uwagi', notesPlaceholder: 'Przykład: Potrzebuję SIM dla członka rodziny w innym stanie.', submit: 'Wyślij prośbę o SIM', sending: 'Wysyłanie...', success: 'Prośba o SIM została wysłana. Skontaktujemy się, aby potwierdzić dostępność, wysyłkę, aktywację i płatność.', error: 'Sprawdź formularz i spróbuj ponownie.', disclaimer: 'Wysyłka SIM i aktywacja nie są potwierdzone, dopóki CellzTech się z Tobą nie skontaktuje. Podatki, wysyłka, ceny planów, uprawnienia do promocji i szczegóły aktywacji mogą się różnić.', selectedLabel: 'Wybrana opcja Ultra', familyLabel: 'Promocja rodzinna', noPlanSelected: 'Wybierz plan poniżej', confirmPricing: 'Potwierdzimy cenę', offerNote: 'Wyślij formularz, a CellzTech potwierdzi dostępność SIM, szczegóły planu, wysyłkę lub odbiór oraz opcje płatności przed finalizacją.', promiseSimTitle: 'SIM', promiseSim: 'Wysyłka fizycznej SIM, odbiór w sklepie albo pomoc z eSIM', promisePickupTitle: 'Odbiór', promisePickup: 'Pomoc przy konfiguracji w CellzTech w Chicago', promiseConfirmTitle: 'Potwierdzenie', promiseConfirm: 'Kontaktujemy się przed płatnością lub aktywacją'
  },
  es: {
    badge: 'Solicitud de SIM Ultra Mobile', title: 'Solicita una tarjeta SIM Ultra Mobile.', text: 'Elige envío, recogida en tienda o ayuda con eSIM. Todavía no es un pago en línea; confirmaremos disponibilidad, activación, envío y pago antes de finalizar.',
    options: [
      { key: 'shipping', title: 'Enviar una SIM física', text: 'Solicita una tarjeta SIM física de Ultra Mobile enviada dentro de EE. UU.' },
      { key: 'pickup', title: 'Recoger en Chicago', text: 'Reserva una SIM para recogerla y recibir ayuda de activación en CellzTech.' },
      { key: 'esim', title: 'Preguntar por eSIM', text: 'Revisa si tu teléfono compatible puede usar eSIM de Ultra Mobile.' }
    ],
    plan: 'Plan que te interesa', choosePlan: 'Elige un plan o selecciona no estoy seguro', activation: 'Necesito ayuda para activar o transferir mi número', contact: 'Datos de contacto', name: 'Nombre completo', phone: 'Teléfono', email: 'Correo electrónico', shipping: 'Dirección de envío', address: 'Dirección', city: 'Ciudad', state: 'Estado', zip: 'Código postal', notes: 'Notas', notesPlaceholder: 'Ejemplo: Necesito una SIM para un familiar en otro estado.', submit: 'Enviar solicitud de SIM', sending: 'Enviando...', success: 'Solicitud de SIM enviada. Te contactaremos para confirmar disponibilidad, envío, activación y pago.', error: 'Revisa el formulario e inténtalo de nuevo.', disclaimer: 'El envío de SIM y la activación no quedan confirmados hasta que CellzTech te contacte. Impuestos, envío, precio del plan, elegibilidad de promociones y detalles de activación pueden variar.', selectedLabel: 'Opción Ultra seleccionada', familyLabel: 'Oferta familiar destacada', noPlanSelected: 'Elige un plan abajo', confirmPricing: 'Confirmaremos el precio', offerNote: 'Envía la solicitud y CellzTech confirmará disponibilidad de SIM, detalles del plan, envío o recogida, y opciones de pago antes de finalizar.', promiseSimTitle: 'SIM', promiseSim: 'Envío de SIM física, recogida o ayuda con eSIM', promisePickupTitle: 'Recogida', promisePickup: 'Ayuda local de configuración en CellzTech Chicago', promiseConfirmTitle: 'Confirmar', promiseConfirm: 'Te contactamos antes del pago o la activación'
  },
  uk: {
    badge: 'Запит SIM Ultra Mobile', title: 'Надішліть запит на SIM-картку Ultra Mobile.', text: 'Виберіть доставку, самовивіз із магазину або допомогу з eSIM. Це ще не онлайн-оплата — ми підтвердимо наявність SIM, активацію, доставку й оплату до завершення.',
    options: [
      { key: 'shipping', title: 'Надіслати фізичну SIM', text: 'Запит на доставку фізичної SIM-картки Ultra Mobile по США.' },
      { key: 'pickup', title: 'Самовивіз у Чикаго', text: 'Зарезервуйте SIM для самовивозу та допомоги з активацією в CellzTech.' },
      { key: 'esim', title: 'Запитати про eSIM', text: 'Перевірте, чи сумісний телефон може використовувати eSIM Ultra Mobile.' }
    ],
    plan: 'План, який вас цікавить', choosePlan: 'Виберіть план або позначте, що не впевнені', activation: 'Потрібна допомога з активацією або перенесенням номера', contact: 'Контактні дані', name: 'Повне ім’я', phone: 'Телефон', email: 'Електронна пошта', shipping: 'Адреса доставки', address: 'Вулиця та номер', city: 'Місто', state: 'Штат', zip: 'ZIP-код', notes: 'Примітки', notesPlaceholder: 'Приклад: Потрібна SIM для родича в іншому штаті.', submit: 'Надіслати запит SIM', sending: 'Надсилання...', success: 'Запит SIM надіслано. Ми зв’яжемося, щоб підтвердити наявність, доставку, активацію й оплату.', error: 'Перевірте форму та спробуйте ще раз.', disclaimer: 'Доставка SIM і активація не підтверджені, доки CellzTech не зв’яжеться з вами. Податки, доставка, ціна плану, умови акцій і деталі активації можуть відрізнятися.', selectedLabel: 'Вибрана опція Ultra', familyLabel: 'Сімейна пропозиція', noPlanSelected: 'Виберіть план нижче', confirmPricing: 'Ми підтвердимо ціну', offerNote: 'Надішліть запит, і CellzTech підтвердить наявність SIM, деталі плану, доставку або самовивіз та варіанти оплати до завершення.', promiseSimTitle: 'SIM', promiseSim: 'Доставка фізичної SIM, самовивіз або допомога з eSIM', promisePickupTitle: 'Самовивіз', promisePickup: 'Місцева допомога з налаштуванням у CellzTech Chicago', promiseConfirmTitle: 'Підтвердження', promiseConfirm: 'Ми зв’яжемося перед оплатою або активацією'
  }
} as const;

function UltraSimRequestPage({ lang }: { lang: LanguageKey }) {
  const copy = simRequestCopy[lang] || simRequestCopy.en;
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [selectedOffer, setSelectedOffer] = useState({ plan: '', duration: '', durationKey: '1' as DurationKey, price: '', billed: '', request: '' });
  const [form, setForm] = useState({
    requestType: 'shipping',
    planInterest: '',
    selectedDuration: '1 Month',
    selectedDurationKey: '1',
    selectedPrice: '',
    selectedBilled: '',
    simQuantity: '1',
    needsActivationHelp: true,
    name: '',
    phone: '',
    email: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    notes: ''
  });

  const familyOptionValue = '4 for $100 Family Promo';
  const selectedPlanDetails = ultraPlans.find((plan) => plan.name === form.planInterest);
  const selectedDurationKey = (form.selectedDurationKey || '1') as DurationKey;
  const selectedDurationOption = selectedPlanDetails?.durations[selectedDurationKey];
  const quantity = Math.max(1, Math.min(Number(form.simQuantity || '1') || 1, 10));

  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const chooseDuration = (key: DurationKey) => {
    if (!selectedPlanDetails?.durations[key]) return;
    const option = selectedPlanDetails.durations[key]!;
    setSelectedOffer((current) => ({ ...current, duration: option.label, durationKey: key, price: option.monthly, billed: option.billed }));
    setForm((current) => ({
      ...current,
      selectedDuration: option.label,
      selectedDurationKey: key,
      selectedPrice: option.monthly,
      selectedBilled: option.billed
    }));
  };

  const parseMoney = (value: string) => {
    const match = String(value || '').match(/\$([0-9]+(?:\.[0-9]+)?)/);
    return match ? Number(match[1]) : 0;
  };

  const requestedSubtotal = (() => {
    const total = parseMoney(form.selectedBilled) * quantity;
    return total ? `$${total.toFixed(total % 1 ? 2 : 0)} estimated request subtotal` : 'Pricing confirmed before payment';
  })();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan') || '';
    const durationKeyParam = (params.get('durationKey') || '1') as DurationKey;
    const request = params.get('request') || '';
    const selectedPlan = ultraPlans.find((item) => item.name === plan);
    const safeDurationKey = selectedPlan?.durations[durationKeyParam] ? durationKeyParam : '1';
    const durationOption = selectedPlan?.durations[safeDurationKey];
    const planInterest = request === 'family' ? familyOptionValue : (selectedPlan?.name || plan);
    const duration = request === 'family' ? 'Family promo' : (durationOption?.label || params.get('duration') || '1 Month');
    const price = request === 'family' ? '$100/mo' : (durationOption?.monthly || params.get('price') || '');
    const billed = request === 'family' ? '$100 monthly family offer' : (durationOption?.billed || params.get('billed') || '');

    setSelectedOffer({ plan: planInterest, duration, durationKey: safeDurationKey, price, billed, request });
    setForm((current) => ({
      ...current,
      requestType: request === 'esim' ? 'esim' : current.requestType,
      planInterest: planInterest || current.planInterest,
      selectedDuration: duration,
      selectedDurationKey: safeDurationKey,
      selectedPrice: price,
      selectedBilled: billed,
      simQuantity: request === 'family' ? '4' : current.simQuantity,
      notes: request === 'family' && !current.notes ? 'Interested in the Ultra Mobile 4 for $100 family plan promotion.' : current.notes
    }));
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('sending');
    setMessage('');
    const planLine = form.planInterest
      ? `${form.planInterest} | ${form.selectedDuration || 'Duration not selected'} | ${form.selectedPrice || 'Price to confirm'} | ${form.selectedBilled || 'Total to confirm'} | Qty ${quantity}`
      : `Ultra SIM request | Qty ${quantity}`;
    try {
      const response = await fetch('/api/sim-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, planInterest: planLine, simQuantity: String(quantity) })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.message || copy.error);
      setStatus('success');
      setMessage(copy.success);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : copy.error);
    }
  };

  return (
    <main className="pageMain">
      <section className="section ultraSimRequestHero salesRequestHero">
        <div className="wrap simCheckoutGrid">
          <div className="simCheckoutMain">
            <span className="summerLabel">{copy.badge}</span>
            <h1>{copy.title}</h1>
            <p>{copy.text}</p>

            <div className="simSelectedPlanCard">
              <div className="ultraPlanTop simSelectedPlanTop">
                <div>
                  <span className="planDataPill">{selectedPlanDetails?.data || 'Ultra'}</span>
                  <h2>{selectedOffer.request === 'family' ? '4 for $100 Family Promo' : (selectedPlanDetails ? (ultraCopy[lang]?.plans[selectedPlanDetails.name]?.name || selectedPlanDetails.name) : (selectedOffer.plan || copy.noPlanSelected))}</h2>
                  <p>{selectedOffer.request === 'family' ? 'A dedicated request for the Ultra Mobile family promotion. CellzTech will confirm line eligibility before activation.' : (selectedPlanDetails ? (ultraCopy[lang]?.plans[selectedPlanDetails.name]?.highlight || selectedPlanDetails.highlight) : copy.offerNote)}</p>
                </div>
                {selectedOffer.request === 'family' && <strong className="dealPill">4 lines</strong>}
              </div>

              {selectedOffer.request !== 'family' && selectedPlanDetails ? (
                <div className="simDurationCheckoutTabs" role="tablist" aria-label="Selected plan duration options">
                  {durationTabs.map((tab) => {
                    const option = selectedPlanDetails.durations[tab.key];
                    return (
                      <button key={tab.key} type="button" className={form.selectedDurationKey === tab.key ? 'active' : ''} onClick={() => chooseDuration(tab.key)} disabled={!option}>
                        <span>{tab.label}</span>
                        <small>{option ? option.monthly : 'Ask in store'}</small>
                        {option?.billed && <b>{option.billed}</b>}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="familyCheckoutBanner">
                  <strong>4 Ultra Unlimited lines for $100/mo</strong>
                  <span>We will confirm promo eligibility, taxes, fees, and activation details before payment.</span>
                </div>
              )}

              <div className="simSelectedIncludes">
                {(selectedOffer.request === 'family'
                  ? ['4 Ultra Unlimited lines for $100/mo', 'International calling features included', 'CellzTech confirms eligibility before activation']
                  : (selectedPlanDetails?.includes || ['Choose a plan on the Ultra Mobile page first.'])
                ).slice(0, 5).map((item) => <div key={item}><CheckCircle2 size={17} /><span>{item}</span></div>)}
              </div>
            </div>
          </div>

          <form className="simRequestForm simCheckoutForm" onSubmit={submit}>
            <div className="simCartSummary">
              <div>
                <span>Request cart</span>
                <strong>{selectedOffer.request === 'family' ? 'Family promo request' : (form.planInterest || copy.noPlanSelected)}</strong>
                <small>{form.selectedDuration} • {form.selectedPrice || copy.confirmPricing}</small>
              </div>
              <label className="simQuantityControl">SIM cards
                <select value={form.simQuantity} onChange={(event) => update('simQuantity', event.target.value)} disabled={selectedOffer.request === 'family'}>
                  {[1, 2, 3, 4, 5].map((item) => <option key={item} value={String(item)}>{item}</option>)}
                </select>
              </label>
              <b>{selectedOffer.request === 'family' ? '$100/mo promo request' : requestedSubtotal}</b>
            </div>

            <div className="simOptionGrid" role="radiogroup" aria-label="SIM request type">
              {copy.options.map((option) => (
                <button key={option.key} type="button" className={form.requestType === option.key ? 'selected' : ''} onClick={() => update('requestType', option.key)}>
                  <strong>{option.title}</strong>
                  <span>{option.text}</span>
                </button>
              ))}
            </div>

            <label className="checkboxLine">
              <input type="checkbox" checked={form.needsActivationHelp} onChange={(event) => update('needsActivationHelp', event.target.checked)} />
              <span>{copy.activation}</span>
            </label>

            <h2>{copy.contact}</h2>
            <div className="simFieldGrid">
              <label>{copy.name}<input required value={form.name} onChange={(event) => update('name', event.target.value)} /></label>
              <label>{copy.phone}<input required value={form.phone} onChange={(event) => update('phone', event.target.value)} /></label>
              <label>{copy.email}<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label>
            </div>

            {form.requestType === 'shipping' && (
              <>
                <h2>{copy.shipping}</h2>
                <div className="simFieldGrid">
                  <label className="wide">{copy.address}<input required value={form.shippingAddress} onChange={(event) => update('shippingAddress', event.target.value)} /></label>
                  <label>{copy.city}<input required value={form.shippingCity} onChange={(event) => update('shippingCity', event.target.value)} /></label>
                  <label>{copy.state}<input required value={form.shippingState} onChange={(event) => update('shippingState', event.target.value)} /></label>
                  <label>{copy.zip}<input required value={form.shippingZip} onChange={(event) => update('shippingZip', event.target.value)} /></label>
                </div>
              </>
            )}

            <label>{copy.notes}<textarea value={form.notes} placeholder={copy.notesPlaceholder} onChange={(event) => update('notes', event.target.value)} /></label>
            <p className="simFinePrint">{copy.disclaimer}</p>
            {message && <div className={status === 'success' ? 'formSuccess' : 'formError'}>{message}</div>}
            <button className="primaryBtn" type="submit" disabled={status === 'sending'}>{status === 'sending' ? copy.sending : copy.submit} <ArrowRight size={18} /></button>
          </form>
        </div>
      </section>
    </main>
  );
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

function Footer({ lang }: { lang: LanguageKey }) {
  const footerText = {
    en: { desc: 'Phone repair, Ultra Mobile, buyback, phones, and accessories in Chicago.', services: 'Services', visit: 'Visit', websites: 'Websites' },
    pl: { desc: 'Naprawa telefonów, Ultra Mobile, skup, telefony i akcesoria w Chicago.', services: 'Usługi', visit: 'Odwiedź nas', websites: 'Strony' },
    es: { desc: 'Reparación de teléfonos, Ultra Mobile, recompra, teléfonos y accesorios en Chicago.', services: 'Servicios', visit: 'Visítanos', websites: 'Sitios web' },
    uk: { desc: 'Ремонт телефонів, Ultra Mobile, викуп, телефони та аксесуари в Чикаго.', services: 'Послуги', visit: 'Адреса', websites: 'Сайти' }
  }[lang];
  return (
    <footer className="footer">
      <div className="wrap footerGrid">
        <div>
          <div className="footerLogo">Cellz<span>Tech</span></div>
          <p>{footerText.desc}</p>
          <strong>CellzTech is operated by Cellz Repairz LLC.</strong>
        </div>
        <div>
          <h3>{footerText.services}</h3>
          {(['repairs', 'ultra', 'xfinity', 'buyback', 'phones', 'accessories'] as PageKey[]).map((item) => <button key={item} onClick={() => goTo(item)}>{localizedPageData[lang][item].eyebrow}</button>)}
        </div>
        <div>
          <h3>{footerText.visit}</h3>
          <p>3412 N Harlem Ave STE A<br />Chicago, IL 60634</p>
          <a href="tel:7734137489">773-413-7489</a>
        </div>
        <div>
          <h3>{footerText.websites}</h3>
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

  React.useEffect(() => {
    const controller = new AbortController();
    const trackVisit = async () => {
      try {
        await fetch('/api/track-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            path: window.location.pathname,
            page: document.title,
            language: document.documentElement.lang || lang,
            referrer: document.referrer || ''
          })
        });
      } catch {
        // Visitor analytics should never affect the website experience.
      }
    };
    trackVisit();
    return () => controller.abort();
  }, [page, lang]);

  useMemo(() => {
    document.title = page === 'home' ? 'CellzTech | Phone Repair, Ultra Mobile, Buyback & Phones in Chicago' : `${pageData[page].eyebrow} | CellzTech Chicago`;
  }, [page]);

  return (
    <>
      <Header page={page} setPage={setPage} lang={lang} setLang={setLang} />
      <PageDetail page={page} lang={lang} />
      <Footer lang={lang} />
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
