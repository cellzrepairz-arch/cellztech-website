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
  DollarSign,
  Mic
} from 'lucide-react';
import './styles.css';
import { deviceCatalog, getBrandTotalModels } from './deviceCatalog';

type PageKey = 'home' | 'repairs' | 'ultra' | 'buyback' | 'phones' | 'accessories' | 'about' | 'contact' | 'book' | 'admin';
type LanguageKey = 'en' | 'es' | 'pl' | 'uk';

const routes: Record<PageKey, string> = {
  home: '/',
  repairs: '/repairs',
  ultra: '/ultra-mobile',
  buyback: '/buyback',
  phones: '/phones',
  accessories: '/accessories',
  about: '/about',
  contact: '/contact',
  book: '/book-repair',
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
  en: { home: 'Home', repairs: 'Repairs', ultra: 'Ultra Mobile', buyback: 'Buyback', phones: 'Phones', accessories: 'Accessories', about: 'About', contact: 'Contact', book: 'Book Repair', admin: 'Admin' },
  pl: { home: 'Start', repairs: 'Naprawy', ultra: 'Ultra Mobile', buyback: 'Skup', phones: 'Telefony', accessories: 'Akcesoria', about: 'O nas', contact: 'Kontakt', book: 'Zgłoś naprawę', admin: 'Admin' },
  es: { home: 'Inicio', repairs: 'Reparaciones', ultra: 'Ultra Mobile', buyback: 'Compra', phones: 'Teléfonos', accessories: 'Accesorios', about: 'Nosotros', contact: 'Contacto', book: 'Solicitar reparación', admin: 'Admin' },
  uk: { home: 'Головна', repairs: 'Ремонт', ultra: 'Ultra Mobile', buyback: 'Викуп', phones: 'Телефони', accessories: 'Аксесуари', about: 'Про нас', contact: 'Контакти', book: 'Заявка на ремонт', admin: 'Admin' }
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
    text: 'CellzTech brings repair help, Ultra Mobile activations, used phones, accessories, and Apex Tech Exchange buyback into one simple local experience.',
    bullets: ['iPhone, Samsung, iPad, Motorola, and Google Pixel repair', 'Ultra Mobile activations and number transfer help', 'Used phones, accessories, and instant iPhone buyback quotes']
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
    buyback: { eyebrow: 'Apex Tech Exchange', title: 'Sprzedaj iPhone’a i otrzymaj szybką wycenę skupu.', text: 'Apex Tech Exchange to nasz system wyceny skupu iPhone’ów. Zacznij online, a następnie skontaktuj się z nami lub odwiedź sklep, aby dokończyć proces.', bullets: ['Natychmiastowa wycena iPhone’a', 'Prosty lokalny proces', 'Obsługiwane przez Apex Tech Exchange'], cta: 'Sprawdź wycenę', external: 'https://www.apextechexchange.com' },
    phones: { eyebrow: 'Telefony na sprzedaż', title: 'Telefony używane i odblokowane dostępne w sklepie.', text: 'Kup lokalnie telefon używany z pomocą przy konfiguracji, przenoszeniu danych i wyborze odpowiedniego planu komórkowego.', bullets: ['Używane iPhone’y i inne telefony zależnie od dostępności', 'Odblokowane modele', 'Lokalna pomoc przy konfiguracji i jasne informacje o gwarancji'], cta: 'Zadzwoń w sprawie telefonów' },
    accessories: { eyebrow: 'Akcesoria', title: 'Codzienne akcesoria do telefonu bez zgadywania.', text: 'W sklepie znajdziesz ładowarki, kable, etui, szkła ochronne i inne praktyczne akcesoria.', bullets: ['Ładowarki i kable', 'Etui i szkła ochronne', 'Lokalna pomoc w dobraniu odpowiedniego produktu'], cta: 'Zadzwoń w sprawie akcesoriów' },
    about: { eyebrow: 'O CellzTech', title: 'Nowoczesna marka prowadzona przez Cellz Repairz LLC.', text: 'CellzTech to nowoczesne centrum usług Cellz Repairz. Cel jest prosty: ułatwić klientom naprawę telefonu, usługę komórkową, zakup telefonu, akcesoria i skup.', bullets: ['Lokalny sklep w Chicago', 'Prowadzone przez Cellz Repairz LLC', 'Praktyczna pomoc zamiast korporacyjnego zamieszania'], cta: 'Skontaktuj się z nami' },
    contact: { eyebrow: 'Odwiedź nas lub zadzwoń', title: 'Wpadnij albo zadzwoń do CellzTech po lokalną pomoc technologiczną.', text: 'Znajdujemy się pod adresem 3412 N Harlem Ave STE A, Chicago, IL 60634. Zadzwoń w sprawie napraw, Ultra Mobile, skupu, telefonów i akcesoriów.', bullets: ['3412 N Harlem Ave STE A, Chicago, IL 60634', '773-413-7489', 'CellzTech jest prowadzone przez Cellz Repairz LLC'], cta: 'Zadzwoń do CellzTech' },
    book: { eyebrow: 'Zgłoszenie naprawy', title: 'Wyślij zgłoszenie naprawy do CellzTech.', text: 'Wybierz markę, model, usterkę oraz preferowane okno czasowe. Skontaktujemy się z Tobą, aby potwierdzić szczegóły, cenę i dostępność części.', bullets: ['Najpierw naprawy Apple', 'Samsung, Motorola i Google Pixel obsługiwane w kolejnym etapie', 'Płatność online nie jest pobierana'], cta: 'Rozpocznij zgłoszenie' },
    admin: pageData.admin
  },
  es: {
    home: { eyebrow: 'Tienda local de tecnología en Chicago', title: 'Reparación de teléfonos, planes móviles, teléfonos, accesorios y recompra en Chicago.', text: 'CellzTech reúne reparación de dispositivos, activaciones de Ultra Mobile, teléfonos usados, accesorios y cotizaciones instantáneas de iPhone mediante Apex Tech Exchange en una experiencia local y sencilla.', bullets: ['Reparación de iPhone, Samsung, iPad, Motorola y Google Pixel', 'Activaciones de Ultra Mobile y ayuda para transferir tu número', 'Teléfonos usados, accesorios y cotizaciones instantáneas para iPhone'] },
    repairs: { eyebrow: 'Reparación de teléfonos en Chicago', title: 'Reparación de teléfonos en Chicago, hecha correctamente.', text: 'Te ayudamos con pantallas rotas, baterías débiles, problemas de carga, cristal trasero, cámaras, tabletas y más. En CellzTech explicamos tus opciones con claridad antes de empezar.', bullets: ['iPhone, Samsung, iPad, Motorola, Google Pixel y tabletas', 'Pantallas, baterías, puertos de carga, cristal trasero, cámaras y diagnóstico', 'Consejo claro antes de comenzar la reparación', 'Piezas de calidad y servicio enfocado en garantía'], cta: 'Llamar por reparación' },
    ultra: { eyebrow: 'Ultra Mobile en CellzTech', title: 'Deja de pagar de más por tu servicio móvil y recibe ayuda local para cambiarte.', text: 'Ayudamos a comparar planes de Ultra Mobile, revisar compatibilidad, transferir tu número y activar el servicio en la tienda.', bullets: ['Planes desde $15 al mes', '4 líneas Ultra Unlimited por $100 al mes', 'Llamadas internacionales a más de 90 destinos', 'Funciona en la red 5G de T-Mobile', 'Tarjeta SIM gratis en CellzTech', 'Trae tu número de cuenta, PIN de transferencia y un teléfono desbloqueado compatible'], cta: 'Preguntar por Ultra Mobile' },
    buyback: { eyebrow: 'Apex Tech Exchange', title: 'Vende tu iPhone con una cotización instantánea.', text: 'Apex Tech Exchange es nuestro sistema de recompra para estimaciones rápidas de iPhone. Empieza en línea y luego contáctanos o visita la tienda para completar el proceso.', bullets: ['Cotización instantánea para iPhone', 'Proceso local sencillo', 'Impulsado por Apex Tech Exchange'], cta: 'Obtener cotización', external: 'https://www.apextechexchange.com' },
    phones: { eyebrow: 'Teléfonos en venta', title: 'Teléfonos usados y desbloqueados disponibles en tienda.', text: 'Compra localmente con ayuda para configurar tu dispositivo, transferir información y elegir el plan móvil adecuado.', bullets: ['iPhones usados y otros dispositivos según disponibilidad', 'Opciones de teléfonos desbloqueados', 'Ayuda local de configuración e información clara de garantía'], cta: 'Llamar por teléfonos' },
    accessories: { eyebrow: 'Accesorios', title: 'Accesorios diarios para tu teléfono sin complicaciones.', text: 'Encuentra cargadores, cables, fundas, protectores de pantalla y otros accesorios prácticos en tienda.', bullets: ['Cargadores y cables', 'Fundas y protectores de pantalla', 'Ayuda local para elegir el producto correcto'], cta: 'Llamar por accesorios' },
    about: { eyebrow: 'Acerca de CellzTech', title: 'Una marca moderna operada por Cellz Repairz LLC.', text: 'CellzTech es el centro moderno de servicios de Cellz Repairz. El objetivo es simple: hacer más fácil la reparación, el servicio móvil, la compra de teléfonos, los accesorios y la recompra.', bullets: ['Tienda local en Chicago', 'Operada por Cellz Repairz LLC', 'Ayuda práctica sin confusión corporativa'], cta: 'Contáctanos' },
    contact: { eyebrow: 'Visítanos o llama', title: 'Pasa por la tienda o llama a CellzTech para ayuda local.', text: 'Estamos en 3412 N Harlem Ave STE A, Chicago, IL 60634. Llámanos para reparaciones, Ultra Mobile, recompra, teléfonos y accesorios.', bullets: ['3412 N Harlem Ave STE A, Chicago, IL 60634', '773-413-7489', 'CellzTech es operado por Cellz Repairz LLC'], cta: 'Llamar a CellzTech' },
    book: { eyebrow: 'Solicitud de reparación', title: 'Envía una solicitud de reparación a CellzTech.', text: 'Elige la marca, el modelo, el problema y una ventana preferida para dejar el equipo. Te contactaremos para confirmar detalles, precio y disponibilidad de piezas.', bullets: ['Primero reparaciones Apple', 'Samsung, Motorola y Google Pixel se pueden ampliar después', 'No se cobra ningún pago en línea'], cta: 'Iniciar solicitud' },
    admin: pageData.admin
  },
  uk: {
    home: { eyebrow: 'Місцева технічна майстерня в Чикаго', title: 'Ремонт телефонів, мобільні плани, телефони, аксесуари та викуп у Чикаго.', text: 'CellzTech поєднує ремонт пристроїв, активації Ultra Mobile, вживані телефони, аксесуари та миттєві оцінки iPhone через Apex Tech Exchange в одному зручному місцевому сервісі.', bullets: ['Ремонт iPhone, Samsung, iPad, Motorola та Google Pixel', 'Активації Ultra Mobile і допомога з перенесенням номера', 'Вживані телефони, аксесуари та швидка оцінка iPhone для викупу'] },
    repairs: { eyebrow: 'Ремонт телефонів у Чикаго', title: 'Ремонт телефонів у Чикаго — якісно та чесно.', text: 'Ми допомагаємо з розбитими екранами, слабкими батареями, проблемами заряджання, заднім склом, камерами, планшетами та іншими несправностями. У CellzTech ми зрозуміло пояснюємо варіанти до початку ремонту.', bullets: ['iPhone, Samsung, iPad, Motorola, Google Pixel і планшети', 'Екрани, батареї, порти заряджання, заднє скло, камери та діагностика', 'Чітка консультація перед початком роботи', 'Якісні деталі та сервіс із увагою до гарантії'], cta: 'Зателефонувати щодо ремонту' },
    ultra: { eyebrow: 'Ultra Mobile у CellzTech', title: 'Не переплачуйте за мобільний зв’язок — отримайте місцеву допомогу з переходом.', text: 'Ми допомагаємо порівняти плани Ultra Mobile, перевірити сумісність телефону, перенести номер і активувати послугу в магазині.', bullets: ['Плани від $15 на місяць', '4 лінії Ultra Unlimited за $100 на місяць', 'Міжнародні дзвінки до понад 90 напрямків', 'Працює в мережі T-Mobile 5G', 'Безкоштовна SIM-картка в CellzTech', 'Принесіть номер облікового запису, transfer PIN і розблокований сумісний телефон'], cta: 'Запитати про Ultra Mobile' },
    buyback: { eyebrow: 'Apex Tech Exchange', title: 'Продайте свій iPhone з миттєвою оцінкою.', text: 'Apex Tech Exchange — це наша система швидкої оцінки iPhone для викупу. Почніть онлайн, а потім зв’яжіться з нами або завітайте до магазину.', bullets: ['Миттєва оцінка iPhone', 'Простий місцевий процес', 'Працює через Apex Tech Exchange'], cta: 'Отримати оцінку', external: 'https://www.apextechexchange.com' },
    phones: { eyebrow: 'Телефони у продажу', title: 'Вживані та розблоковані телефони доступні в магазині.', text: 'Купуйте локально з допомогою в налаштуванні, перенесенні даних і виборі правильного мобільного плану.', bullets: ['Вживані iPhone та інші пристрої за наявності', 'Розблоковані моделі', 'Місцева допомога з налаштуванням і зрозуміла інформація про гарантію'], cta: 'Зателефонувати щодо телефонів' },
    accessories: { eyebrow: 'Аксесуари', title: 'Щоденні аксесуари для телефону без зайвих сумнівів.', text: 'У магазині є зарядні пристрої, кабелі, чохли, захисне скло та інші практичні аксесуари.', bullets: ['Зарядні пристрої та кабелі', 'Чохли та захисне скло', 'Місцева допомога з вибором потрібного товару'], cta: 'Зателефонувати щодо аксесуарів' },
    about: { eyebrow: 'Про CellzTech', title: 'Сучасний бренд, яким керує Cellz Repairz LLC.', text: 'CellzTech — це сучасний сервісний центр Cellz Repairz. Мета проста: зробити ремонт телефонів, мобільний зв’язок, продаж телефонів, аксесуари та викуп зручнішими для місцевих клієнтів.', bullets: ['Місцевий магазин у Чикаго', 'Керується Cellz Repairz LLC', 'Практична допомога без корпоративної плутанини'], cta: 'Зв’язатися з нами' },
    contact: { eyebrow: 'Завітайте або зателефонуйте', title: 'Завітайте до CellzTech або зателефонуйте для місцевої технічної допомоги.', text: 'Ми знаходимося за адресою 3412 N Harlem Ave STE A, Chicago, IL 60634. Телефонуйте щодо ремонту, Ultra Mobile, викупу, телефонів і аксесуарів.', bullets: ['3412 N Harlem Ave STE A, Chicago, IL 60634', '773-413-7489', 'CellzTech керується Cellz Repairz LLC'], cta: 'Зателефонувати до CellzTech' },
    book: { eyebrow: 'Заявка на ремонт', title: 'Надішліть заявку на ремонт до CellzTech.', text: 'Виберіть бренд, модель, проблему та зручне вікно для здачі пристрою. Ми зв’яжемося з вами, щоб підтвердити деталі, ціну та наявність деталей.', bullets: ['Спочатку ремонт Apple', 'Samsung, Motorola та Google Pixel можна додати далі', 'Оплата онлайн не стягується'], cta: 'Почати заявку' },
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
    { key: 'buyback', icon: DollarSign, title: 'Skup', text: 'Masz iPhone’a, który leży w szufladzie? Sprawdź natychmiastową wycenę przez Apex Tech Exchange.', cta: 'Sprawdź wycenę' },
    { key: 'phones', icon: Smartphone, title: 'Telefony', text: 'Używane i odblokowane telefony dostępne w sklepie z pomocą przy konfiguracji i praktyczną informacją o gwarancji.', cta: 'Zobacz telefony' },
    { key: 'accessories', icon: ShoppingBag, title: 'Akcesoria', text: 'Ładowarki, kable, etui, szkła ochronne i codzienne akcesoria do telefonu dostępne lokalnie.', cta: 'Zobacz akcesoria' }
  ],
  es: [
    { key: 'repairs', icon: Wrench, title: 'Reparaciones', text: 'iPhone, Samsung, iPad, Motorola, Google Pixel, pantallas, baterías, puertos de carga, cámaras, cristal trasero y recuperación de datos.', cta: 'Reparar mi dispositivo' },
    { key: 'ultra', icon: Wifi, title: 'Ultra Mobile', text: 'Deja de pagar de más. Te ayudamos a cambiarte, conservar tu número, revisar compatibilidad y elegir un plan.', cta: 'Cambiar y ahorrar' },
    { key: 'buyback', icon: DollarSign, title: 'Recompra', text: '¿Tienes un iPhone guardado en un cajón? Obtén una cotización instantánea con Apex Tech Exchange.', cta: 'Obtener cotización' },
    { key: 'phones', icon: Smartphone, title: 'Teléfonos', text: 'Teléfonos usados y desbloqueados disponibles en tienda con ayuda local de configuración y garantía práctica.', cta: 'Ver teléfonos' },
    { key: 'accessories', icon: ShoppingBag, title: 'Accesorios', text: 'Cargadores, cables, fundas, protectores de pantalla y accesorios diarios disponibles localmente.', cta: 'Ver accesorios' }
  ],
  uk: [
    { key: 'repairs', icon: Wrench, title: 'Ремонт', text: 'iPhone, Samsung, iPad, Motorola, Google Pixel, екрани, батареї, порти заряджання, камери, заднє скло та відновлення даних.', cta: 'Відремонтувати пристрій' },
    { key: 'ultra', icon: Wifi, title: 'Ultra Mobile', text: 'Не переплачуйте за зв’язок. Ми допоможемо перейти, зберегти номер, перевірити сумісність і вибрати план.', cta: 'Перейти й заощадити' },
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
    } catch (err) {
      setAdminKey('');
      setRequests([]);
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

  const leadCount = requests.filter((request) => request.repairdesk_lead_id || request.repairdesk_lead_order_id).length;
  const failedCount = requests.filter((request) => request.integration_errors).length;

  const submitKey = (event: React.FormEvent) => {
    event.preventDefault();
    loadRequests(inputKey);
  };

  const signOut = () => {
    setAdminKey('');
    setInputKey('');
    setRequests([]);
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
    <main className="adminShell">
      <section className="adminHero">
        <div className="wrap adminHeroGrid">
          <div>
            <span className="adminEyebrow">CellzTech private admin</span>
            <h1>Repair requests, RepairDesk leads, and backend status in one clean view.</h1>
            <p>Review website submissions, confirm customer details, and match requests to RepairDesk leads before the customer arrives.</p>
          </div>
          <div className="adminStatsCard">
            <div><span>Total requests</span><strong>{requests.length}</strong></div>
            <div><span>RepairDesk leads</span><strong>{leadCount}</strong></div>
            <div><span>Needs review</span><strong>{failedCount}</strong></div>
          </div>
        </div>
      </section>

      <section className="section adminSection">
        <div className="wrap adminPanel">
          {error && <div className="adminNotice error">{error}</div>}

          <div className="adminToolbar">
            <div className="adminSearch">
              <Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, phone, email, model, issue, or lead ID" />
            </div>
            <button className="secondaryBtn compact" onClick={() => loadRequests(adminKey)} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
            <button className="secondaryBtn compact" onClick={signOut}>Lock console</button>
          </div>

          <div className="adminRequestGrid">
            {filteredRequests.map((request) => {
              const hasLead = Boolean(request.repairdesk_lead_id || request.repairdesk_lead_order_id);
              const needsReview = Boolean(request.integration_errors);
              return (
                <article className="adminRequestCard" key={request.id}>
                  <div className="adminRequestTop">
                    <div>
                      <span className="adminTimestamp">{formatAdminDate(request.submitted_at)}</span>
                      <h2>{request.customer_name || 'Unknown customer'}</h2>
                      <p>{request.customer_phone || 'No phone'} · {request.customer_email || 'No email'}</p>
                    </div>
                    <span className={needsReview ? 'adminStatus warning' : hasLead ? 'adminStatus success' : 'adminStatus'}>
                      {needsReview ? 'Review' : hasLead ? 'Lead created' : 'Saved'}
                    </span>
                  </div>

                  <div className="adminDeviceLine">
                    <strong>{request.model || 'Unknown model'}</strong>
                    <span>{request.issue || 'Issue not provided'}</span>
                  </div>

                  <div className="adminMetaGrid">
                    <div><span>Requested</span><strong>{request.requested_date || 'No date'} {request.requested_time || ''}</strong></div>
                    <div><span>RepairDesk lead</span><strong>{request.repairdesk_lead_order_id || request.repairdesk_lead_id || 'Not created'}</strong></div>
                    <div><span>Customer ID</span><strong>{request.repairdesk_customer_id || 'Not saved'}</strong></div>
                    <div><span>Status</span><strong>{request.status || 'Saved'}</strong></div>
                  </div>

                  {request.notes && <p className="adminNotes">{request.notes}</p>}
                  {needsReview && <p className="adminErrorText">Integration warning saved. Check Supabase for the full JSON response.</p>}
                </article>
              );
            })}
          </div>

          {!loading && filteredRequests.length === 0 && (
            <div className="adminEmptyState">
              <h2>No repair requests found.</h2>
              <p>Once a customer submits the Book Repair form, the request will appear here after the backend saves it.</p>
            </div>
          )}
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

  if (page === 'repairs') {
    return <RepairsPage lang={lang} />;
  }

  if (page === 'book') {
    return <BookRepairPage lang={lang} />;
  }

  if (page === 'admin') {
    return <AdminDashboard />;
  }

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

function RepairsPage({ lang }: { lang: LanguageKey }) {
  const data = localizedPageData[lang].repairs;
  const repairServices = [
    { icon: Smartphone, title: 'iPhone Repair', text: 'Screens, batteries, charging ports, back glass, cameras, speakers, and common iPhone repairs.' },
    { icon: TabletSmartphone, title: 'Samsung Repair', text: 'Screen replacement, battery service, charging problems, camera issues, and common Samsung repairs.' },
    { icon: TabletSmartphone, title: 'iPad & Tablet Repair', text: 'Cracked screens, battery problems, charging ports, and tablet diagnostics.' },
    { icon: BatteryCharging, title: 'Charging & Battery Issues', text: 'If your phone charges slowly, dies fast, or only works at an angle, stop in for help.' },
    { icon: Camera, title: 'Back Glass & Camera Repair', text: 'Repair options for cracked back glass, broken camera lens glass, and camera-related issues.' },
    { icon: Search, title: 'Diagnostics & Data Recovery', text: 'If your phone will not turn on or you need important data, we can inspect the device and explain possible options.' }
  ];

  const repairTrust = [
    { icon: MessageCircle, title: 'Clear repair advice', text: 'We explain what is wrong with your device and your repair options before starting any work.' },
    { icon: ShieldCheck, title: 'High-quality parts', text: 'We use high-quality parts and offer one of the best warranties on repairs.' },
    { icon: Store, title: 'Local Chicago service', text: 'You are working with a local shop, not a corporate call center.' },
    { icon: DollarSign, title: 'Fair, practical pricing', text: 'We give clear pricing before the repair so you know what to expect.' },
    { icon: Wrench, title: 'Experienced repair help', text: 'We work on iPhones, Samsung devices, iPads, tablets, Motorola, Google Pixel, and more.' },
    { icon: CheckCircle2, title: 'Warranty-focused repairs', text: 'We stand behind our work and explain warranty coverage clearly.' }
  ];

  const commonProblems = [
    'Cracked screen or touch problems',
    'Weak battery or random shutdowns',
    'Phone not charging or loose charging port',
    'Broken back glass or camera lens glass',
    'Camera, speaker, microphone, or button problems',
    'Device will not turn on or needs diagnostics'
  ];

  return (
    <main className="pageMain repairsPage">
      <section className="repairHero">
        <div className="wrap repairHeroGrid">
          <div>
            <div className="eyebrow"><Wrench size={15} /> Phone repair in Chicago</div>
            <h1>Phone repair in Chicago, done right.</h1>
            <p>Get local help for cracked screens, weak batteries, charging issues, back glass, cameras, tablets, and more. At CellzTech, we explain your options clearly before starting the repair and use high-quality parts whenever available.</p>
            <div className="pageActions">
              <button className="primaryBtn" onClick={() => goTo('book')}>Book repair <ArrowRight size={18} /></button>
              <a className="secondaryBtn" href="tel:7734137489">Call for repair</a>
              <a className="secondaryBtn" href="https://maps.google.com/?q=3412+N+Harlem+Ave+STE+A+Chicago+IL+60634" target="_blank" rel="noreferrer">Get directions</a>
            </div>
          </div>
          <div className="repairSummaryCard">
            <span>Repair help for</span>
            <ul>
              <li><CheckCircle2 size={18} /> iPhone, Samsung, iPad, Motorola, Google Pixel, and tablets</li>
              <li><CheckCircle2 size={18} /> Screens, batteries, charging ports, back glass, cameras, and diagnostics</li>
              <li><CheckCircle2 size={18} /> High-quality parts and warranty-focused service</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section light">
        <div className="wrap">
          <div className="sectionIntro centeredIntro">
            <span>Repair services</span>
            <h2>Common repairs and device problems we help with.</h2>
            <p>Start with the repair category that matches your issue. If you are not sure what is wrong, call or stop in and we can inspect the device.</p>
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
            <span className="label">Do not ignore the small signs</span>
            <h2>Small phone problems often turn into bigger repairs.</h2>
            <p className="lead">Charging at an angle, fast battery drain, ghost touch, camera blur, or a cracked screen can get worse over time. We can help you understand what is happening before you spend money on the wrong solution.</p>
            <div className="inlineActions">
              <button className="primaryBtn compact" onClick={() => goTo('book')}>Start repair request</button>
              <a className="secondaryBtn compact" href="tel:7734137489">Call 773-413-7489</a>
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
            <span>Why customers choose CellzTech</span>
            <h2>Clear advice, practical pricing, and repair work we stand behind.</h2>
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
            <span>What to expect</span>
            <h2>A simple repair process from start to finish.</h2>
          </div>
          <div className="processSteps">
            <div><strong>1</strong><h3>Tell us the issue</h3><p>Bring the device in or call the shop and explain what is happening.</p></div>
            <div><strong>2</strong><h3>We check options</h3><p>We explain the likely repair, pricing, timing, and warranty information.</p></div>
            <div><strong>3</strong><h3>We repair the device</h3><p>Once approved, we complete the repair using the right parts and tools.</p></div>
            <div><strong>4</strong><h3>You test before leaving</h3><p>We want you to understand the repair and leave with confidence.</p></div>
          </div>
        </div>
      </section>

      <section className="section ctaBand">
        <div className="wrap ctaPanel repairCtaPanel">
          <div>
            <span className="label">Ready when you are</span>
            <h2>Do not wait. Get your phone checked today.</h2>
            <p>Cracked screen? Weak battery? Charging problem? Stop by CellzTech or call us and we will help you figure out the best repair option.</p>
            <p><strong>CellzTech</strong><br />3412 N Harlem Ave STE A, Chicago, IL 60634</p>
          </div>
          <div className="ctaButtonsStack">
            <button className="primaryBtn" onClick={() => goTo('book')}>Book repair <ArrowRight size={18} /></button>
            <a className="secondaryBtn" href="tel:7734137489">Call now</a>
            <a className="secondaryBtn" href="https://maps.google.com/?q=3412+N+Harlem+Ave+STE+A+Chicago+IL+60634" target="_blank" rel="noreferrer">Get directions</a>
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
  en: { eyebrow: 'Book repair', title: 'Book your repair.', intro: 'Choose your brand, model, issue, and preferred drop-off window. We will confirm the final schedule, pricing, and parts availability before you come in.', current: 'Current request', repairRequest: 'repair request', steps: ['Brand', 'Model', 'Issue', 'Contact', 'Send'], step: 'Step', brandTitle: 'What brand needs repair?', brandHint: 'Start with the device family. We support the major phone brands customers ask for most, plus an “Other” path when the model is not listed.', modelTitle: 'Find your model.', modelHint: 'Search, tap a popular model, or choose a series. We can identify the exact model in-store if you are not sure.', searchPlaceholder: 'Search model or model number', clear: 'Clear', searchResults: 'Search results', matching: 'matching models', selected: 'Selected', notListed: 'Device not listed', helpIdentify: 'We will help identify it', popular: 'Popular models', common: 'Most common', browse: 'Browse by series', chooseSeries: 'Choose a series', notSure: '{b.notSure}', issueTitle: 'What needs to be fixed?', issueHint: 'Choose the main issue. The visual panel will react to the selected problem.', contactTitle: 'Your contact details.', contactHint: 'Choose a preferred drop-off window during posted store hours. This is a request only — we will contact you to confirm the repair schedule.', name: 'Name', phone: 'Phone', email: 'Email', required: 'Required', date: 'Requested date', window: 'Preferred drop-off window', chooseWindow: 'Select an available store-hour window', chooseDate: 'Choose a date first', notes: 'Notes', notesPlaceholder: 'Example: Screen is cracked but touch still works.', consent: 'By sending this request, you agree that CellzTech / Cellz Repairz LLC may contact you about your repair request. This does not guarantee a confirmed appointment, repair price, part availability, or completion time.', finalTitle: 'Ready to send your repair request.', finalHint: 'This will send the request to CellzTech. We will contact you to confirm the drop-off window, price, and parts availability.', brand: 'Brand', series: 'Series', model: 'Model', issue: 'Issue', notSelected: 'Not selected', notProvided: 'Not provided', submit: 'Submit repair request', sending: 'Sending request...', textInstead: 'Text instead', callInstead: 'Call instead', backendNote: 'Your request is sent to CellzTech so we can review the device, issue, parts, and timing before confirming the repair details.', back: 'Back', next: 'Next step', startOver: 'Start over' },
  pl: { eyebrow: 'Zgłoszenie naprawy', title: 'Zgłoś naprawę.', intro: 'Wybierz markę, model, usterkę i preferowane okno oddania urządzenia. Przed wizytą potwierdzimy termin, cenę i dostępność części.', current: 'Aktualne zgłoszenie', repairRequest: 'zgłoszenie naprawy', steps: ['Marka', 'Model', 'Usterka', 'Kontakt', 'Wyślij'], step: 'Krok', brandTitle: 'Jaka marka wymaga naprawy?', brandHint: 'Zacznij od rodzaju urządzenia. Obsługujemy najpopularniejsze marki telefonów, a jeśli modelu nie ma na liście, wybierz ścieżkę „Inne”.', modelTitle: 'Znajdź swój model.', modelHint: 'Wyszukaj, wybierz popularny model albo serię. Jeśli nie masz pewności, pomożemy ustalić dokładny model w sklepie.', searchPlaceholder: 'Szukaj modelu lub numeru modelu', clear: 'Wyczyść', searchResults: 'Wyniki wyszukiwania', matching: 'pasujących modeli', selected: 'Wybrano', notListed: 'Urządzenia nie ma na liście', helpIdentify: 'Pomożemy je rozpoznać', popular: 'Popularne modele', common: 'Najczęstsze', browse: 'Przeglądaj według serii', chooseSeries: 'Wybierz serię', notSure: 'Nie widzę modelu / nie mam pewności', issueTitle: 'Co trzeba naprawić?', issueHint: 'Wybierz główną usterkę. Panel wizualny dopasuje się do wybranego problemu.', contactTitle: 'Dane kontaktowe.', contactHint: 'Wybierz preferowane okno oddania urządzenia w godzinach pracy. To jest zgłoszenie — skontaktujemy się z Tobą, aby potwierdzić termin.', name: 'Imię i nazwisko', phone: 'Telefon', email: 'E-mail', required: 'Wymagane', date: 'Preferowana data', window: 'Preferowane okno oddania', chooseWindow: 'Wybierz dostępne okno w godzinach pracy', chooseDate: 'Najpierw wybierz datę', notes: 'Uwagi', notesPlaceholder: 'Przykład: Ekran jest pęknięty, ale dotyk działa.', consent: 'Wysyłając zgłoszenie, zgadzasz się, że CellzTech / Cellz Repairz LLC może skontaktować się z Tobą w sprawie naprawy. To nie gwarantuje potwierdzonej wizyty, ceny, dostępności części ani czasu ukończenia.', finalTitle: 'Gotowe do wysłania zgłoszenia.', finalHint: 'Zgłoszenie trafi do CellzTech. Skontaktujemy się, aby potwierdzić okno oddania, cenę i dostępność części.', brand: 'Marka', series: 'Seria', model: 'Model', issue: 'Usterka', notSelected: 'Nie wybrano', notProvided: 'Nie podano', submit: 'Wyślij zgłoszenie', sending: 'Wysyłanie zgłoszenia...', textInstead: 'Wyślij SMS', callInstead: 'Zadzwoń', backendNote: 'Zgłoszenie trafia do CellzTech, abyśmy mogli sprawdzić urządzenie, usterkę, części i termin przed potwierdzeniem szczegółów naprawy.', back: 'Wstecz', next: 'Dalej', startOver: 'Zacznij od nowa' },
  es: { eyebrow: 'Solicitud de reparación', title: 'Solicita tu reparación.', intro: 'Elige la marca, el modelo, el problema y una ventana preferida para dejar el equipo. Confirmaremos el horario, el precio y la disponibilidad de piezas antes de que vengas.', current: 'Solicitud actual', repairRequest: 'solicitud de reparación', steps: ['Marca', 'Modelo', 'Problema', 'Contacto', 'Enviar'], step: 'Paso', brandTitle: '¿Qué marca necesita reparación?', brandHint: 'Empieza con la familia del dispositivo. Atendemos las marcas más solicitadas y también tenemos una opción “Otro” si el modelo no aparece.', modelTitle: 'Encuentra tu modelo.', modelHint: 'Busca, toca un modelo popular o elige una serie. Si no estás seguro, podemos identificar el modelo exacto en la tienda.', searchPlaceholder: 'Buscar modelo o número de modelo', clear: 'Borrar', searchResults: 'Resultados de búsqueda', matching: 'modelos encontrados', selected: 'Seleccionado', notListed: 'Dispositivo no listado', helpIdentify: 'Te ayudaremos a identificarlo', popular: 'Modelos populares', common: 'Más comunes', browse: 'Buscar por serie', chooseSeries: 'Elige una serie', notSure: 'No veo mi modelo / no estoy seguro', issueTitle: '¿Qué se necesita reparar?', issueHint: 'Elige el problema principal. El panel visual reaccionará al problema seleccionado.', contactTitle: 'Tus datos de contacto.', contactHint: 'Elige una ventana preferida para dejar el equipo durante el horario publicado. Es una solicitud; te contactaremos para confirmar.', name: 'Nombre', phone: 'Teléfono', email: 'Correo electrónico', required: 'Requerido', date: 'Fecha solicitada', window: 'Ventana preferida para dejar el equipo', chooseWindow: 'Selecciona una ventana disponible', chooseDate: 'Primero elige una fecha', notes: 'Notas', notesPlaceholder: 'Ejemplo: La pantalla está rota, pero el táctil funciona.', consent: 'Al enviar esta solicitud, aceptas que CellzTech / Cellz Repairz LLC pueda contactarte sobre tu reparación. Esto no garantiza una cita confirmada, precio, disponibilidad de piezas ni tiempo de finalización.', finalTitle: 'Listo para enviar tu solicitud.', finalHint: 'Esto enviará la solicitud a CellzTech. Te contactaremos para confirmar la ventana, el precio y la disponibilidad de piezas.', brand: 'Marca', series: 'Serie', model: 'Modelo', issue: 'Problema', notSelected: 'No seleccionado', notProvided: 'No proporcionado', submit: 'Enviar solicitud', sending: 'Enviando solicitud...', textInstead: 'Enviar texto', callInstead: 'Llamar', backendNote: 'Tu solicitud se envía a CellzTech para revisar el dispositivo, el problema, las piezas y el horario antes de confirmar los detalles.', back: 'Atrás', next: 'Siguiente', startOver: 'Empezar de nuevo' },
  uk: { eyebrow: 'Заявка на ремонт', title: 'Надішліть заявку на ремонт.', intro: 'Виберіть бренд, модель, проблему та зручне вікно для здачі пристрою. Перед вашим візитом ми підтвердимо час, ціну та наявність деталей.', current: 'Поточна заявка', repairRequest: 'заявка на ремонт', steps: ['Бренд', 'Модель', 'Проблема', 'Контакт', 'Надіслати'], step: 'Крок', brandTitle: 'Який бренд потребує ремонту?', brandHint: 'Почніть із типу пристрою. Ми підтримуємо найпопулярніші бренди, а якщо моделі немає в списку, виберіть “Інше”.', modelTitle: 'Знайдіть свою модель.', modelHint: 'Скористайтеся пошуком, виберіть популярну модель або серію. Якщо не впевнені, ми визначимо точну модель у магазині.', searchPlaceholder: 'Пошук моделі або номера моделі', clear: 'Очистити', searchResults: 'Результати пошуку', matching: 'збігів моделей', selected: 'Вибрано', notListed: 'Пристрою немає в списку', helpIdentify: 'Ми допоможемо визначити модель', popular: 'Популярні моделі', common: 'Найчастіші', browse: 'Перегляд за серією', chooseSeries: 'Виберіть серію', notSure: 'Не бачу моделі / не впевнений', issueTitle: 'Що потрібно відремонтувати?', issueHint: 'Виберіть основну проблему. Візуальна панель зміниться відповідно до вибраної несправності.', contactTitle: 'Ваші контактні дані.', contactHint: 'Виберіть зручне вікно для здачі пристрою в робочі години. Це заявка — ми зв’яжемося з вами для підтвердження.', name: 'Ім’я', phone: 'Телефон', email: 'Електронна пошта', required: 'Обов’язково', date: 'Бажана дата', window: 'Зручне вікно для здачі', chooseWindow: 'Виберіть доступне вікно', chooseDate: 'Спочатку виберіть дату', notes: 'Примітки', notesPlaceholder: 'Приклад: Екран розбитий, але сенсор працює.', consent: 'Надсилаючи заявку, ви погоджуєтеся, що CellzTech / Cellz Repairz LLC може зв’язатися з вами щодо ремонту. Це не гарантує підтвердженого запису, ціни, наявності деталей або часу виконання.', finalTitle: 'Готово до надсилання заявки.', finalHint: 'Заявка буде надіслана до CellzTech. Ми зв’яжемося з вами, щоб підтвердити час, ціну та наявність деталей.', brand: 'Бренд', series: 'Серія', model: 'Модель', issue: 'Проблема', notSelected: 'Не вибрано', notProvided: 'Не вказано', submit: 'Надіслати заявку', sending: 'Надсилання заявки...', textInstead: 'Надіслати SMS', callInstead: 'Зателефонувати', backendNote: 'Ваша заявка надсилається до CellzTech, щоб ми перевірили пристрій, проблему, деталі та час перед підтвердженням ремонту.', back: 'Назад', next: 'Далі', startOver: 'Почати спочатку' }
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
                    {b.notSure}
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

function UltraPlanStoreCard({ plan }: { plan: UltraPlan }) {
  const [duration, setDuration] = useState<DurationKey>('1');
  const selected = plan.durations[duration] || plan.durations['1'];
  const smsPlanText = encodeURIComponent(`Hi CellzTech, I am interested in Ultra Mobile. Plan: ${plan.name}. Duration: ${selected?.label || 'Not selected'}. Price shown: ${selected?.monthly || plan.basePrice + '/mo'}. Please help me activate or transfer my number.`);

  return (
    <article className={`ultraStorePlan ${plan.badge === 'Most Popular' ? 'bestPlan' : ''}`}>
      <div className="ultraPlanTop">
        <div>
          <span className="planDataPill">{plan.data}</span>
          <h3>{plan.name}</h3>
          <p>{plan.highlight}</p>
        </div>
        <div className="planBadges">
          {plan.promoEligible && <strong className="dealPill promoOnlyPill">1-month promo eligible</strong>}
          {plan.badge && <strong className="dealPill">{plan.badge}</strong>}
        </div>
      </div>

      <div className="planBuilder">
        <aside className="planIncludes">
          <strong>Plan Includes:</strong>
          <ul>{plan.includes.map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="activationDetails">
            <strong>Activation help:</strong>
            <ul>
              <li>$0 activation fee at CellzTech</li>
              <li>Free SIM card</li>
              <li>We help transfer your number in-store</li>
            </ul>
          </div>
        </aside>

        <div className="planPurchasePanel">
          <div className="durationTabs" role="tablist" aria-label={`${plan.name} duration options`}>
            {durationTabs.map((tab) => {
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
                  <small>{option ? (plan.promoEligible && tab.key === '1' ? '4th month free eligible' : tab.sublabel) : 'Ask in store'}</small>
                </button>
              );
            })}
          </div>

          {plan.promoEligible && (
            <div className={`promoRuleNote ${duration === '1' ? 'activePromoRule' : ''}`}>
              <strong>{duration === '1' ? '4th month free promo applies here.' : 'Multi-month pricing selected.'}</strong>
              <span>{duration === '1' ? 'For eligible new customers on 1-month 8GB+ plans, the 4th monthly renewal can be free when the line remains eligible.' : 'The 3, 6, and 12 month choices are prepaid multi-month rates. They are not the 4th-month-free monthly promo.'}</span>
            </div>
          )}

          <div className="simSelectorPreview">
            <div>
              <strong>SIM Card</strong>
              <span>Free SIM card at CellzTech</span>
            </div>
            <div>
              <strong>eSIM</strong>
              <span>Available on select compatible phones</span>
            </div>
          </div>

          <div className="planSubtotal">
            <span>Subtotal preview:</span>
            <strong>{selected?.monthly || `${plan.basePrice}/mo`}</strong>
            <small>{selected?.billed || 'Ask in store for current pricing'}<br />Taxes and fees may apply.</small>
          </div>

          <div className="planCtas">
            <a className="primaryBtn" href={`sms:7734137489?&body=${smsPlanText}`}>Start purchase <ShoppingBag size={18} /></a>
            <a className="secondaryBtn" href="tel:7734137489">Call about this plan</a>
          </div>
        </div>
      </div>
    </article>
  );
}

function UltraDetails({ lang }: { lang: LanguageKey }) {
  const quickDetails = [
    'Plans from $15/month, with monthly and multi-month options.',
    '4 Ultra Unlimited lines for $100/month.',
    'International calling to Poland and 90+ destinations.',
    'Free SIM card at CellzTech, with eSIM available on supported phones.',
    'Bring your account number, transfer PIN, and an unlocked compatible phone.'
  ];

  return (
    <>
      <section className="section ultraStoreHero">
        <div className="wrap ultraHeroStack">
          <div className="ultraHeroGrid">
            <div className="ultraHeroCopy">
              <span className="summerLabel">Ultra Mobile authorized activation help</span>
              <h1>Ultra Mobile plans, family savings, and travel-ready service at CellzTech.</h1>
              <p>We help customers compare monthly and multi-month plans, family promos, number transfers, Go Roam passes, and compatibility before they pay.</p>
              <div className="ultraHeroButtons">
                <a className="primaryBtn" href="tel:7734137489">Call for Ultra Mobile <ArrowRight size={18} /></a>
                <button className="secondaryBtn" onClick={() => goTo('contact')}>Visit the store</button>
              </div>
            </div>
            <div className="familyShowcaseCard">
              <div className="sunBadge">Family<br />Deal</div>
              <span>Featured promo</span>
              <strong>4 FOR $100</strong>
              <h3>4 Ultra Unlimited lines for $100/mo</h3>
              <p>Bring up to four lines onto one Ultra Unlimited account and get international features included with each line.</p>
              <div className="familyPromoDetails" aria-label="Ultra 4 for 100 promotion details">
                <div>
                  <small>1 line</small>
                  <b>$49/mo</b>
                </div>
                <div>
                  <small>2 lines</small>
                  <b>$73/mo</b>
                </div>
                <div>
                  <small>3 lines</small>
                  <b>$85/mo</b>
                </div>
                <div className="highlight">
                  <small>4 lines</small>
                  <b>$100/mo</b>
                </div>
              </div>
              <ul className="promoChecklist">
                <li>No data cap on Ultra Unlimited</li>
                <li>Unlimited nationwide talk and global text</li>
                <li>Talk to 90+ international destinations</li>
                <li>Hotspot included on supported plans</li>
              </ul>
              <a className="primaryBtn compact" href="sms:7734137489?&body=Hi%20CellzTech%2C%20I%20am%20interested%20in%20the%20Ultra%20Mobile%204%20lines%20for%20%24100%20promo.%20Please%20send%20me%20details.">Ask about 4 for $100</a>
            </div>
          </div>

          <div className="ultraHeroInfoBand">
            <article className="ultraInfoCard ultraQuickCard">
              <span>Quick details</span>
              <h3>What customers usually want to know first.</h3>
              <ul>
                {quickDetails.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="ultraInfoCard">
              <Globe2 size={26} />
              <span>International roaming</span>
              <h3>New 5-day and 15-day Go Roam Passes</h3>
              <p>Built for quick trips and longer vacations when customers need talk, text, and data abroad.</p>
            </article>

            <article className="ultraInfoCard">
              <CheckCircle2 size={26} />
              <span>Limited time offer</span>
              <h3>Eligible 1-month 8GB+ plans can earn a free 4th month.</h3>
              <p>This offer applies to eligible monthly plans only. Multi-month 3, 6, and 12 month rates are separate prepaid options.</p>
            </article>

            <article className="ultraInfoCard">
              <Wifi size={26} />
              <span>Network</span>
              <h3>On the T-Mobile 5G network</h3>
              <p>Plans include nationwide talk and global text, international calling features, and hotspot on supported plans.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section ultraFeatureSection light">
        <div className="wrap ultraFeatureGrid">
          <article className="ultraFeatureCard familyPricingCard">
            <span>Family plan math</span>
            <h2>Unlimited lines get stronger as you add more.</h2>
            <p>The current 4-line showcase starts from one Ultra Unlimited line and adds savings as the account grows.</p>
            <div className="familyPriceGrid">
              {familyLinePrices.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.price}</strong>
                </div>
              ))}
            </div>
            <small>Promo eligibility, taxes, fees, account status, and plan availability must be confirmed before activation.</small>
          </article>

          <article className="ultraFeatureCard roamCard">
            <span>Go Roam World Pass</span>
            <h2>Travel support without guessing.</h2>
            <p>Customers can add a pass by texting <strong>ACTIVATE</strong> to <strong>6700</strong>. Up to 3 passes can be stored, but only one can be active at a time.</p>
            <div className="roamPassGrid">
              {goRoamPasses.map((pass) => (
                <div key={pass.name}>
                  <strong>{pass.name}</strong>
                  <span>{pass.duration}</span>
                  <p>{pass.talk} • {pass.texts} • {pass.data}</p>
                </div>
              ))}
            </div>
            <small>After high-speed data is used, speeds reduce to 512 kbps until the pass expires. Works in many countries, but not all. Mexico uses a separate roaming pass.</small>
          </article>
        </div>
      </section>

      <section className="section ultraStorePlansSection light">
        <div className="wrap">
          <div className="sectionIntro centeredIntro">
            <span>Plan showcase</span>
            <h2>Compare Ultra Mobile monthly and multi-month pricing.</h2>
            <p>Pick a plan and duration to preview the advertised monthly price and total upfront amount. We confirm taxes, fees, current promos, and compatibility before activation.</p>
          </div>
          <div className="ultraStorePlans">
            {ultraPlans.map((plan) => <UltraPlanStoreCard key={plan.name} plan={plan} />)}
          </div>
          <p className="ultraFinePrint">Final pricing, taxes, fees, promo eligibility, plan terms, network management, eSIM compatibility, roaming availability, and plan availability may vary. Heavy data users may notice reduced speeds during congestion. Video may stream around 480p. We will confirm everything before activation.</p>
        </div>
      </section>

      <section className="section ultraSimSection">
        <div className="wrap ultraSimGrid">
          <div className="ultraSimCopy">
            <span className="summerLabel">SIM cards and activation help</span>
            <h2>Get an Ultra Mobile SIM shipped or activated in-store.</h2>
            <p>Whether you are switching today, transferring a number, helping a family member, or asking about eSIM, CellzTech can guide you through the cleanest option before you pay.</p>
          </div>
          <div className="simStoreCards">
            {simStarterOptions.map((option) => (
              <article key={option.title}>
                <ShoppingBag size={24} />
                <h3>{option.title}</h3>
                <p>{option.text}</p>
                <a href={`sms:7734137489?&body=${encodeURIComponent(`Hi CellzTech, I want to ask about Ultra Mobile. ${option.title}.`)}`}>{option.cta}</a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
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
          {(['repairs', 'ultra', 'buyback', 'phones', 'accessories'] as PageKey[]).map((item) => <button key={item} onClick={() => goTo(item)}>{localizedPageData[lang][item].eyebrow}</button>)}
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
