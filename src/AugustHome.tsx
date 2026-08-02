import React, { useState } from 'react';
import {
  ArrowRight,
  BatteryCharging,
  Cable,
  Camera,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Gift,
  Globe2,
  HardDrive,
  Headphones,
  MapPin,
  MessageCircle,
  Mic,
  Navigation,
  Phone,
  Plug,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  TabletSmartphone,
  Users,
  Wifi,
  Wrench
} from 'lucide-react';
import './august-home.css';

type LanguageKey = 'en' | 'es' | 'pl' | 'uk';
type HomePageKey = 'repairs' | 'ultra' | 'phones' | 'accessories' | 'contact' | 'book' | 'sim';

type Promotion = {
  badge: string;
  title: string;
  price?: string;
  priceSuffix?: string;
  explanation: string;
  bullets: string[];
  cta: string;
};

type FaqItem = { question: string; answer: string };

type AugustCopy = {
  hero: {
    eyebrow: string;
    title: string;
    supporting: string;
    text: string;
    offers: string;
    repair: string;
    call: string;
    visualLabel: string;
    visualFeatured: string;
    visualAction: string;
    visualHint: string;
    visualLocal: string;
    visualOffers: [string, string, string];
  };
  trust: [string, string, string, string];
  offers: {
    eyebrow: string;
    title: string;
    intro: string;
    cards: [Promotion, Promotion, Promotion];
    disclaimer: string;
  };
  bonus: { badge: string; title: string; text: string; cta: string };
  repairs: {
    eyebrow: string;
    title: string;
    intro: string;
    services: string[];
    serviceCta: string;
    diagnosticEyebrow: string;
    diagnosticTitle: string;
    diagnosticText: string;
    ask: string;
    book: string;
    bookingNote: string;
  };
  shop: {
    eyebrow: string;
    title: string;
    text: string;
    categories: string[];
    cta: string;
  };
  transfer: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: [string, string, string, string];
    stepLabel: string;
    warning: string;
    cta: string;
  };
  why: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  faq: { eyebrow: string; title: string; items: FaqItem[] };
  contact: {
    eyebrow: string;
    title: string;
    text: string;
    hoursTitle: string;
    weekdays: string;
    saturday: string;
    sunday: string;
    closed: string;
    call: string;
    directions: string;
    book: string;
    ultra: string;
  };
  final: { eyebrow: string; title: string; text: string; ultra: string; repair: string };
  sticky: { call: string; ultra: string; aria: string };
  accessibility: {
    offers: string;
    services: string;
    categories: string;
    transfer: string;
    why: string;
    faq: string;
  };
};

const augustCopy: Record<LanguageKey, AugustCopy> = {
  en: {
    hero: {
      eyebrow: 'AUGUST 2026 • ULTRA MOBILE + PHONE REPAIRS',
      title: 'August savings. Professional repairs. Local help.',
      supporting: 'Ultra Mobile • Phone Repairs • Phones • Accessories',
      text: 'Switch carriers, keep your number, or repair your phone in one trusted local store. We will help you choose a plan, transfer your number, set up your service, and understand your repair options.',
      offers: 'View Ultra Mobile Offers',
      repair: 'Book a Repair',
      call: 'Call: 773-413-7489',
      visualLabel: 'Realistic iPhone product display with interactive Ultra Mobile offers',
      visualFeatured: 'Featured August offer',
      visualAction: 'Ask about this offer',
      visualHint: 'Explore August offers',
      visualLocal: 'Activation and setup in store',
      visualOffers: ['4 lines for $100', 'Every 4th month free', '$25/mo Unlimited']
    },
    trust: ['Free Ultra Mobile activation', 'Help transferring your number', 'Lifetime warranty available on select repairs', 'Local in-store support'],
    offers: {
      eyebrow: 'AUGUST SAVINGS',
      title: 'August Ultra Mobile Offers',
      intro: 'Three simple ways to save — for families, new customers, and customers using qualifying monthly plans.',
      cards: [
        {
          badge: 'FAMILY PLAN',
          title: '4 Unlimited Lines',
          price: '$100',
          priceSuffix: '/mo',
          explanation: 'Combine four Unlimited lines on one plan for a total of $100 per month.',
          bullets: ['Great for families, roommates, and friends', 'Four lines under one plan', 'Tablets may qualify as part of the four-line bundle', 'Powered by the T-Mobile network'],
          cta: 'Ask About the Family Plan'
        },
        {
          badge: 'EVERY 4TH MONTH FREE',
          title: 'Buy 3 Months, Get the 4th Month FREE',
          explanation: 'Renew a qualifying single-month 8GB or higher plan for three consecutive months and receive the fourth month free.',
          bullets: ['Available on qualifying 8GB+ single-month plans', 'Pay for three consecutive months', 'Receive the fourth month free', 'The benefit repeats while the account and plan remain eligible'],
          cta: 'View Qualifying Plans'
        },
        {
          badge: 'NEW CUSTOMERS',
          title: 'Ultra Unlimited',
          price: '$25',
          priceSuffix: '/mo',
          explanation: 'Get 6 months for $150 paid upfront.',
          bullets: ['Unlimited 5G and 4G LTE data with no fixed data cap', 'Unlimited talk and global text', 'Calling to more than 90 international destinations', 'Unlimited talk and text plus 5GB of data in Mexico and Canada'],
          cta: 'Ask About Unlimited for $25'
        }
      ],
      disclaimer: 'Limited-time offer. Eligibility, plan availability, data speeds, taxes, fees, account status, device compatibility, and other restrictions may apply. We will confirm the details before activation.'
    },
    bonus: {
      badge: 'AUGUST CUSTOMER BONUS',
      title: 'Free Tempered Glass for iPhone',
      text: 'With an Ultra Mobile activation or select repairs. Limited-time offer. Ask in store for details.',
      cta: 'Ask About the Bonus'
    },
    repairs: {
      eyebrow: 'CELLZ REPAIRZ',
      title: 'We Repair Phones and Tablets',
      intro: 'From straightforward replacements to more involved diagnostics, we will explain the problem and present the available repair options.',
      services: ['Screen replacement', 'Battery replacement', 'Charging problems', 'Charging ports', 'Back glass', 'Cameras', 'Speakers', 'Microphones', 'Phone diagnostics', 'Data recovery, where possible'],
      serviceCta: 'Start this repair',
      diagnosticEyebrow: 'DIAGNOSTICS',
      diagnosticTitle: 'Not Sure What Is Wrong With Your Phone?',
      diagnosticText: 'Bring it to Cellz Repairz. We will inspect the device, explain the problem, and outline the repair options that may be available.',
      ask: 'Ask About a Repair',
      book: 'Book a Repair',
      bookingNote: 'Online bookings are repair requests. We confirm timing, pricing, and parts availability before the appointment.'
    },
    shop: {
      eyebrow: 'IN-STORE SELECTION',
      title: 'Phones and Accessories',
      text: 'Ask about available phones, protective cases, tempered glass, chargers, and other accessories for popular models.',
      categories: ['Unlocked phones', 'Used and new phones, based on current inventory', 'Protective cases', 'Tempered glass', 'Chargers and cables', 'Headphones', 'Power banks', 'iPhone accessories', 'Samsung accessories', 'Motorola and Google Pixel accessories'],
      cta: 'Ask About Availability'
    },
    transfer: {
      eyebrow: 'KEEP YOUR NUMBER',
      title: 'Want to Transfer Your Number?',
      intro: 'We will help check your phone, transfer your number, and set up your Ultra Mobile service.',
      steps: ['Unlocked phone', 'Account number from your current carrier', 'Transfer PIN', 'Keep the old service active until the transfer is complete'],
      stepLabel: 'Step',
      warning: 'Do not cancel your old service before the number transfer is complete. Closing the account too early may prevent you from keeping your number.',
      cta: 'Start Your Number Transfer'
    },
    why: {
      eyebrow: 'LOCAL HELP THAT STAYS SIMPLE',
      title: 'Why Choose Cellz Repairz?',
      items: ['Free Ultra Mobile activation', 'Help transferring your number', 'Keep your current number', 'Help in English and Polish', 'In-store support', 'Fast, professional service', 'Honest explanation of your options', 'Local Chicago business']
    },
    faq: {
      eyebrow: 'HELPFUL ANSWERS',
      title: 'Frequently Asked Questions',
      items: [
        { question: 'Can I keep my current phone number?', answer: 'Yes, in most cases. Keep your current service active and bring the correct account number and transfer PIN. We can help submit the transfer and verify the information before the old service is canceled.' },
        { question: 'Does my phone need to be unlocked?', answer: 'Usually, yes. The phone should be unlocked and compatible with the network before activation. We can help check the device in store.' },
        { question: 'What do I need to transfer my number?', answer: 'Bring the phone, the account number from your current carrier, the transfer PIN, and any requested account information. Keep the existing line active until the transfer finishes.' },
        { question: 'Is Ultra Mobile activation free?', answer: 'Cellz Repairz provides free Ultra Mobile activation help in store. Taxes, plan costs, and any other applicable charges are separate.' },
        { question: 'Who can get Ultra Unlimited for $25?', answer: 'The August offer is for qualifying new customers who purchase six months of Ultra Unlimited for $150 upfront. We will confirm eligibility before activation.' },
        { question: 'How does the free fourth month offer work?', answer: 'Use a qualifying 8GB-or-higher single-month plan and complete three consecutive paid renewals. The fourth month is free, and the benefit can repeat while the account and plan remain eligible.' },
        { question: 'Do you repair Samsung and Motorola phones?', answer: 'Yes. We work on iPhone, Samsung, Motorola, Google Pixel, iPad, and many other phones and tablets. Parts and repair options depend on the exact model and issue.' },
        { question: 'Can I come in for diagnostics without an appointment?', answer: 'Walk-ins are welcome during business hours. A repair request can still help us prepare, confirm parts, and contact you about the best drop-off time.' }
      ]
    },
    contact: {
      eyebrow: 'VISIT THE STORE',
      title: 'Visit Cellz Repairz',
      text: 'Local help for Ultra Mobile, phone repairs, diagnostics, phones, and accessories.',
      hoursTitle: 'Store hours',
      weekdays: 'Monday–Friday: 11:00 AM–7:00 PM',
      saturday: 'Saturday: 11:00 AM–3:00 PM',
      sunday: 'Sunday: Closed',
      closed: 'Closed',
      call: 'Call Now',
      directions: 'Directions',
      book: 'Book a Repair',
      ultra: 'Ask About Ultra Mobile'
    },
    final: {
      eyebrow: 'ONE LOCAL STORE',
      title: 'Ready to Switch or Repair Your Phone?',
      text: 'Start an Ultra Mobile request, book a repair, call the store, or stop in for help.',
      ultra: 'Start an Ultra Mobile Request',
      repair: 'Book a Repair'
    },
    sticky: { call: 'Call', ultra: 'Ultra Mobile', aria: 'Quick homepage actions' },
    accessibility: {
      offers: 'August Ultra Mobile promotion cards',
      services: 'Phone and tablet repair services',
      categories: 'Phone and accessory categories',
      transfer: 'Number transfer steps',
      why: 'Reasons to choose Cellz Repairz',
      faq: 'Frequently asked questions'
    }
  },
  pl: {
    hero: {
      eyebrow: 'SIERPIEŃ 2026 • ULTRA MOBILE + NAPRAWY TELEFONÓW',
      title: 'Sierpniowe promocje. Profesjonalne naprawy. Lokalna pomoc.',
      supporting: 'Ultra Mobile • Naprawy telefonów • Telefony • Akcesoria',
      text: 'Zmień operatora, zachowaj swój numer lub napraw telefon w jednym zaufanym, lokalnym miejscu. Pomożemy Ci wybrać plan, przenieść numer, skonfigurować usługę i zrozumieć dostępne opcje naprawy.',
      offers: 'Sprawdź promocje Ultra Mobile',
      repair: 'Umów naprawę',
      call: 'Zadzwoń: 773-413-7489',
      visualLabel: 'Realistyczna prezentacja iPhone’a z interaktywnymi ofertami Ultra Mobile',
      visualFeatured: 'Wyróżniona oferta sierpniowa',
      visualAction: 'Zapytaj o tę ofertę',
      visualHint: 'Sprawdź sierpniowe oferty',
      visualLocal: 'Aktywacja i konfiguracja w sklepie',
      visualOffers: ['4 linie za $100', 'Co 4. miesiąc gratis', '$25/mies. Unlimited']
    },
    trust: ['Darmowa aktywacja Ultra Mobile', 'Pomoc przy przeniesieniu numeru', 'Dożywotnia gwarancja przy wybranych naprawach', 'Lokalna pomoc w sklepie'],
    offers: {
      eyebrow: 'SIERPNIOWE OSZCZĘDNOŚCI',
      title: 'Sierpniowe oferty Ultra Mobile',
      intro: 'Trzy proste sposoby na oszczędzanie — dla rodzin, nowych klientów i osób korzystających z kwalifikujących się planów miesięcznych.',
      cards: [
        {
          badge: 'PLAN RODZINNY',
          title: '4 linie Unlimited',
          price: '$100',
          priceSuffix: '/mies.',
          explanation: 'Połącz cztery linie Unlimited w jednym planie za łącznie $100 miesięcznie.',
          bullets: ['Dla rodzin, znajomych i współlokatorów', 'Cztery linie w jednym planie', 'Tablety mogą kwalifikować się jako część pakietu czterech linii', 'Usługa działa w sieci T-Mobile'],
          cta: 'Zapytaj o plan rodzinny'
        },
        {
          badge: 'CO 4. MIESIĄC GRATIS',
          title: 'Kup 3 miesiące, 4. miesiąc GRATIS',
          explanation: 'Korzystaj z kwalifikującego się planu miesięcznego 8GB lub wyższego przez trzy kolejne miesiące, a czwarty miesiąc otrzymasz bezpłatnie.',
          bullets: ['Dotyczy kwalifikujących się planów miesięcznych 8GB lub wyższych', 'Opłać trzy kolejne miesiące', 'Czwarty miesiąc otrzymujesz gratis', 'Korzyść powtarza się, jeśli konto i plan nadal spełniają warunki'],
          cta: 'Sprawdź kwalifikujące się plany'
        },
        {
          badge: 'DLA NOWYCH KLIENTÓW',
          title: 'Ultra Unlimited',
          price: '$25',
          priceSuffix: '/mies.',
          explanation: '6 miesięcy za $150 opłacone z góry.',
          bullets: ['Nielimitowane dane 5G i 4G LTE bez stałego limitu danych', 'Nielimitowane rozmowy i globalne wiadomości tekstowe', 'Rozmowy do ponad 90 międzynarodowych kierunków', 'Rozmowy, SMS-y i 5GB danych w Meksyku i Kanadzie'],
          cta: 'Zapytaj o Unlimited za $25'
        }
      ],
      disclaimer: 'Oferta ograniczona czasowo. Kwalifikacja, dostępność planu, prędkości transmisji, podatki, opłaty, status konta, zgodność urządzenia i inne ograniczenia mogą mieć zastosowanie. Szczegóły potwierdzimy przed aktywacją.'
    },
    bonus: {
      badge: 'SIERPNIOWY BONUS DLA KLIENTA',
      title: 'Darmowe szkło hartowane do iPhone',
      text: 'Przy aktywacji Ultra Mobile lub wybranych naprawach. Oferta ograniczona czasowo. Szczegóły w sklepie.',
      cta: 'Zapytaj o bonus'
    },
    repairs: {
      eyebrow: 'CELLZ REPAIRZ',
      title: 'Naprawiamy telefony i tablety',
      intro: 'Od prostych wymian po bardziej złożoną diagnostykę — wyjaśnimy problem i przedstawimy dostępne opcje naprawy.',
      services: ['Wymiana ekranów', 'Wymiana baterii', 'Problemy z ładowaniem', 'Porty ładowania', 'Tylne szkło', 'Aparaty', 'Głośniki', 'Mikrofony', 'Diagnostyka telefonu', 'Odzyskiwanie danych, tam gdzie jest to możliwe'],
      serviceCta: 'Rozpocznij zgłoszenie',
      diagnosticEyebrow: 'DIAGNOSTYKA',
      diagnosticTitle: 'Nie wiesz, co jest nie tak z telefonem?',
      diagnosticText: 'Przynieś go do Cellz Repairz. Sprawdzimy urządzenie, wyjaśnimy problem i przedstawimy dostępne opcje naprawy.',
      ask: 'Zapytaj o naprawę',
      book: 'Umów naprawę',
      bookingNote: 'Rezerwacja online jest zgłoszeniem naprawy. Przed wizytą potwierdzamy termin, cenę i dostępność części.'
    },
    shop: {
      eyebrow: 'OFERTA W SKLEPIE',
      title: 'Telefony i akcesoria',
      text: 'Sprawdź dostępne telefony, etui, szkła ochronne, ładowarki i inne akcesoria do popularnych modeli.',
      categories: ['Telefony odblokowane', 'Telefony używane i nowe — zależnie od aktualnego stanu magazynowego', 'Etui ochronne', 'Szkła hartowane', 'Ładowarki i kable', 'Słuchawki', 'Powerbanki', 'Akcesoria do iPhone', 'Akcesoria do Samsung', 'Akcesoria do Motorola i Google Pixel'],
      cta: 'Zapytaj o dostępność'
    },
    transfer: {
      eyebrow: 'ZACHOWAJ SWÓJ NUMER',
      title: 'Chcesz przenieść swój numer?',
      intro: 'Pomożemy Ci sprawdzić telefon, przenieść numer i skonfigurować usługę Ultra Mobile.',
      steps: ['Odblokowany telefon', 'Numer konta u obecnego operatora', 'Transfer PIN', 'Aktywna usługa do zakończenia transferu'],
      stepLabel: 'Krok',
      warning: 'Nie anuluj starej usługi przed zakończeniem przenoszenia numeru. Zbyt wczesne zamknięcie konta może uniemożliwić zachowanie numeru.',
      cta: 'Rozpocznij przenoszenie numeru'
    },
    why: {
      eyebrow: 'PROSTA LOKALNA POMOC',
      title: 'Dlaczego Cellz Repairz?',
      items: ['Darmowa aktywacja Ultra Mobile', 'Pomoc przy przeniesieniu numeru', 'Zachowujesz swój obecny numer', 'Pomoc po polsku i po angielsku', 'Wsparcie na miejscu w sklepie', 'Szybka i profesjonalna obsługa', 'Uczciwe wyjaśnienie dostępnych opcji', 'Lokalny biznes w Chicago']
    },
    faq: {
      eyebrow: 'POMOCNE ODPOWIEDZI',
      title: 'Najczęściej zadawane pytania',
      items: [
        { question: 'Czy mogę zachować swój obecny numer?', answer: 'W większości przypadków tak. Nie wyłączaj obecnej usługi i przynieś prawidłowy numer konta oraz Transfer PIN. Pomożemy przesłać transfer i sprawdzić dane przed zamknięciem starej usługi.' },
        { question: 'Czy mój telefon musi być odblokowany?', answer: 'Zazwyczaj tak. Telefon powinien być odblokowany i zgodny z siecią przed aktywacją. Możemy pomóc sprawdzić urządzenie w sklepie.' },
        { question: 'Co jest potrzebne do przeniesienia numeru?', answer: 'Przynieś telefon, numer konta u obecnego operatora, Transfer PIN oraz wymagane dane konta. Stara linia musi pozostać aktywna do zakończenia transferu.' },
        { question: 'Czy aktywacja Ultra Mobile jest darmowa?', answer: 'Cellz Repairz zapewnia darmową pomoc przy aktywacji Ultra Mobile w sklepie. Koszt planu, podatki i inne ewentualne opłaty są oddzielne.' },
        { question: 'Kto może skorzystać z planu Unlimited za $25?', answer: 'Sierpniowa oferta jest przeznaczona dla kwalifikujących się nowych klientów, którzy opłacą sześć miesięcy Ultra Unlimited z góry za $150. Kwalifikację potwierdzimy przed aktywacją.' },
        { question: 'Jak działa oferta czwartego miesiąca gratis?', answer: 'Korzystaj z kwalifikującego się miesięcznego planu 8GB lub wyższego i wykonaj trzy kolejne płatne odnowienia. Czwarty miesiąc jest bezpłatny, a korzyść może się powtarzać, jeśli konto i plan nadal spełniają warunki.' },
        { question: 'Czy naprawiacie telefony Samsung i Motorola?', answer: 'Tak. Naprawiamy iPhone, Samsung, Motorola, Google Pixel, iPad oraz wiele innych telefonów i tabletów. Dostępne części i opcje zależą od dokładnego modelu i usterki.' },
        { question: 'Czy mogę przyjść na diagnostykę bez umówionej wizyty?', answer: 'Tak, przyjmujemy klientów bez wcześniejszej wizyty w godzinach pracy. Zgłoszenie online może jednak pomóc nam przygotować się, sprawdzić części i skontaktować się w sprawie najlepszego terminu.' }
      ]
    },
    contact: {
      eyebrow: 'ODWIEDŹ SKLEP',
      title: 'Odwiedź Cellz Repairz',
      text: 'Lokalna pomoc z Ultra Mobile, naprawami telefonów, diagnostyką, telefonami i akcesoriami.',
      hoursTitle: 'Godziny otwarcia',
      weekdays: 'Poniedziałek–piątek: 11:00 AM–7:00 PM',
      saturday: 'Sobota: 11:00 AM–3:00 PM',
      sunday: 'Niedziela: zamknięte',
      closed: 'Zamknięte',
      call: 'Zadzwoń teraz',
      directions: 'Dojazd',
      book: 'Umów naprawę',
      ultra: 'Zapytaj o Ultra Mobile'
    },
    final: {
      eyebrow: 'JEDEN LOKALNY SKLEP',
      title: 'Gotowy zmienić operatora lub naprawić telefon?',
      text: 'Rozpocznij zgłoszenie Ultra Mobile, umów naprawę, zadzwoń albo odwiedź sklep.',
      ultra: 'Rozpocznij zgłoszenie Ultra Mobile',
      repair: 'Umów naprawę'
    },
    sticky: { call: 'Zadzwoń', ultra: 'Ultra Mobile', aria: 'Szybkie działania na stronie głównej' },
    accessibility: {
      offers: 'Karty sierpniowych promocji Ultra Mobile',
      services: 'Usługi naprawy telefonów i tabletów',
      categories: 'Kategorie telefonów i akcesoriów',
      transfer: 'Kroki przeniesienia numeru',
      why: 'Powody, aby wybrać Cellz Repairz',
      faq: 'Najczęściej zadawane pytania'
    }
  },
  es: {
    hero: {
      eyebrow: 'AGOSTO 2026 • ULTRA MOBILE + REPARACIÓN DE TELÉFONOS',
      title: 'Ahorros de agosto. Reparaciones profesionales. Ayuda local.',
      supporting: 'Ultra Mobile • Reparación de teléfonos • Teléfonos • Accesorios',
      text: 'Cambia de compañía, conserva tu número o repara tu teléfono en una tienda local de confianza. Te ayudaremos a elegir un plan, transferir tu número, configurar el servicio y entender tus opciones de reparación.',
      offers: 'Ver ofertas de Ultra Mobile',
      repair: 'Solicitar reparación',
      call: 'Llamar: 773-413-7489',
      visualLabel: 'Presentación realista de iPhone con ofertas interactivas de Ultra Mobile',
      visualFeatured: 'Oferta destacada de agosto',
      visualAction: 'Preguntar por esta oferta',
      visualHint: 'Explora las ofertas de agosto',
      visualLocal: 'Activación y configuración en tienda',
      visualOffers: ['4 líneas por $100', 'Cada 4.º mes gratis', '$25/mes Unlimited']
    },
    trust: ['Activación gratis de Ultra Mobile', 'Ayuda para transferir tu número', 'Garantía de por vida en reparaciones seleccionadas', 'Soporte local en la tienda'],
    offers: {
      eyebrow: 'AHORROS DE AGOSTO',
      title: 'Ofertas de Ultra Mobile para agosto',
      intro: 'Tres maneras sencillas de ahorrar: para familias, clientes nuevos y clientes con planes mensuales elegibles.',
      cards: [
        {
          badge: 'PLAN FAMILIAR',
          title: '4 líneas Unlimited',
          price: '$100',
          priceSuffix: '/mes',
          explanation: 'Combina cuatro líneas Unlimited en un solo plan por un total de $100 al mes.',
          bullets: ['Ideal para familias, compañeros de casa y amigos', 'Cuatro líneas bajo un solo plan', 'Las tabletas pueden calificar dentro del paquete de cuatro líneas', 'Servicio en la red de T-Mobile'],
          cta: 'Preguntar por el plan familiar'
        },
        {
          badge: 'CADA 4.º MES GRATIS',
          title: 'Compra 3 meses y recibe el 4.º GRATIS',
          explanation: 'Renueva un plan mensual elegible de 8GB o más durante tres meses consecutivos y recibe el cuarto mes gratis.',
          bullets: ['Disponible en planes mensuales elegibles de 8GB o más', 'Paga tres meses consecutivos', 'Recibe el cuarto mes gratis', 'El beneficio se repite mientras la cuenta y el plan sigan siendo elegibles'],
          cta: 'Ver planes elegibles'
        },
        {
          badge: 'CLIENTES NUEVOS',
          title: 'Ultra Unlimited',
          price: '$25',
          priceSuffix: '/mes',
          explanation: 'Obtén 6 meses por $150 pagados por adelantado.',
          bullets: ['Datos 5G y 4G LTE ilimitados sin un límite fijo de datos', 'Llamadas ilimitadas y textos globales', 'Llamadas a más de 90 destinos internacionales', 'Llamadas y textos ilimitados más 5GB de datos en México y Canadá'],
          cta: 'Preguntar por Unlimited a $25'
        }
      ],
      disclaimer: 'Oferta por tiempo limitado. Pueden aplicarse requisitos de elegibilidad, disponibilidad del plan, velocidades de datos, impuestos, cargos, estado de la cuenta, compatibilidad del dispositivo y otras restricciones. Confirmaremos los detalles antes de la activación.'
    },
    bonus: {
      badge: 'BONO DE AGOSTO',
      title: 'Vidrio templado gratis para iPhone',
      text: 'Con una activación de Ultra Mobile o reparaciones seleccionadas. Oferta por tiempo limitado. Pregunta en la tienda.',
      cta: 'Preguntar por el bono'
    },
    repairs: {
      eyebrow: 'CELLZ REPAIRZ',
      title: 'Reparamos teléfonos y tabletas',
      intro: 'Desde reemplazos sencillos hasta diagnósticos más complejos, explicaremos el problema y las opciones de reparación disponibles.',
      services: ['Cambio de pantalla', 'Cambio de batería', 'Problemas de carga', 'Puertos de carga', 'Cristal trasero', 'Cámaras', 'Altavoces', 'Micrófonos', 'Diagnóstico del teléfono', 'Recuperación de datos, cuando sea posible'],
      serviceCta: 'Iniciar esta reparación',
      diagnosticEyebrow: 'DIAGNÓSTICO',
      diagnosticTitle: '¿No sabes qué le pasa a tu teléfono?',
      diagnosticText: 'Tráelo a Cellz Repairz. Revisaremos el equipo, explicaremos el problema y te mostraremos las opciones de reparación disponibles.',
      ask: 'Preguntar por una reparación',
      book: 'Solicitar reparación',
      bookingNote: 'Las reservas en línea son solicitudes de reparación. Confirmamos el horario, el precio y la disponibilidad de piezas antes de la cita.'
    },
    shop: {
      eyebrow: 'SELECCIÓN EN TIENDA',
      title: 'Teléfonos y accesorios',
      text: 'Pregunta por teléfonos, fundas protectoras, vidrio templado, cargadores y otros accesorios para modelos populares.',
      categories: ['Teléfonos desbloqueados', 'Teléfonos usados y nuevos, según el inventario actual', 'Fundas protectoras', 'Vidrio templado', 'Cargadores y cables', 'Audífonos', 'Baterías portátiles', 'Accesorios para iPhone', 'Accesorios para Samsung', 'Accesorios para Motorola y Google Pixel'],
      cta: 'Preguntar por disponibilidad'
    },
    transfer: {
      eyebrow: 'CONSERVA TU NÚMERO',
      title: '¿Quieres transferir tu número?',
      intro: 'Te ayudaremos a revisar tu teléfono, transferir tu número y configurar el servicio de Ultra Mobile.',
      steps: ['Teléfono desbloqueado', 'Número de cuenta de tu compañía actual', 'PIN de transferencia', 'Mantén activo el servicio anterior hasta completar la transferencia'],
      stepLabel: 'Paso',
      warning: 'No canceles el servicio anterior antes de completar la transferencia. Cerrar la cuenta demasiado pronto puede impedir que conserves tu número.',
      cta: 'Iniciar la transferencia de número'
    },
    why: {
      eyebrow: 'AYUDA LOCAL Y SENCILLA',
      title: '¿Por qué elegir Cellz Repairz?',
      items: ['Activación gratis de Ultra Mobile', 'Ayuda para transferir tu número', 'Conservas tu número actual', 'Ayuda en inglés y polaco', 'Soporte en la tienda', 'Servicio rápido y profesional', 'Explicación honesta de tus opciones', 'Negocio local de Chicago']
    },
    faq: {
      eyebrow: 'RESPUESTAS ÚTILES',
      title: 'Preguntas frecuentes',
      items: [
        { question: '¿Puedo conservar mi número actual?', answer: 'Sí, en la mayoría de los casos. Mantén activo el servicio actual y trae el número de cuenta y el PIN de transferencia correctos. Podemos ayudarte a enviar la transferencia antes de cancelar el servicio anterior.' },
        { question: '¿Mi teléfono debe estar desbloqueado?', answer: 'Por lo general, sí. El teléfono debe estar desbloqueado y ser compatible con la red antes de la activación. Podemos ayudarte a revisarlo en la tienda.' },
        { question: '¿Qué necesito para transferir mi número?', answer: 'Trae el teléfono, el número de cuenta de tu compañía actual, el PIN de transferencia y la información de cuenta solicitada. Mantén activa la línea anterior hasta que finalice la transferencia.' },
        { question: '¿La activación de Ultra Mobile es gratis?', answer: 'Cellz Repairz ofrece ayuda gratis con la activación de Ultra Mobile en la tienda. El costo del plan, los impuestos y otros cargos aplicables son separados.' },
        { question: '¿Quién puede obtener Ultra Unlimited por $25?', answer: 'La oferta de agosto es para clientes nuevos elegibles que compren seis meses de Ultra Unlimited por $150 por adelantado. Confirmaremos la elegibilidad antes de la activación.' },
        { question: '¿Cómo funciona el cuarto mes gratis?', answer: 'Usa un plan mensual elegible de 8GB o más y completa tres renovaciones pagadas consecutivas. El cuarto mes es gratis y el beneficio puede repetirse mientras la cuenta y el plan sigan siendo elegibles.' },
        { question: '¿Reparan teléfonos Samsung y Motorola?', answer: 'Sí. Trabajamos con iPhone, Samsung, Motorola, Google Pixel, iPad y muchos otros teléfonos y tabletas. Las piezas y opciones dependen del modelo y el problema.' },
        { question: '¿Puedo ir a diagnóstico sin cita?', answer: 'Aceptamos visitas sin cita durante el horario de la tienda. Una solicitud en línea puede ayudarnos a prepararnos, revisar piezas y contactarte sobre el mejor horario.' }
      ]
    },
    contact: {
      eyebrow: 'VISITA LA TIENDA',
      title: 'Visita Cellz Repairz',
      text: 'Ayuda local con Ultra Mobile, reparaciones, diagnóstico, teléfonos y accesorios.',
      hoursTitle: 'Horario',
      weekdays: 'Lunes–viernes: 11:00 AM–7:00 PM',
      saturday: 'Sábado: 11:00 AM–3:00 PM',
      sunday: 'Domingo: cerrado',
      closed: 'Cerrado',
      call: 'Llamar ahora',
      directions: 'Cómo llegar',
      book: 'Solicitar reparación',
      ultra: 'Preguntar por Ultra Mobile'
    },
    final: {
      eyebrow: 'UNA TIENDA LOCAL',
      title: '¿Listo para cambiar de compañía o reparar tu teléfono?',
      text: 'Inicia una solicitud de Ultra Mobile, solicita una reparación, llama o visítanos.',
      ultra: 'Iniciar solicitud de Ultra Mobile',
      repair: 'Solicitar reparación'
    },
    sticky: { call: 'Llamar', ultra: 'Ultra Mobile', aria: 'Acciones rápidas de la página principal' },
    accessibility: {
      offers: 'Tarjetas de ofertas de Ultra Mobile para agosto',
      services: 'Servicios de reparación de teléfonos y tabletas',
      categories: 'Categorías de teléfonos y accesorios',
      transfer: 'Pasos para transferir el número',
      why: 'Razones para elegir Cellz Repairz',
      faq: 'Preguntas frecuentes'
    }
  },
  uk: {
    hero: {
      eyebrow: 'СЕРПЕНЬ 2026 • ULTRA MOBILE + РЕМОНТ ТЕЛЕФОНІВ',
      title: 'Серпневі заощадження. Професійний ремонт. Місцева допомога.',
      supporting: 'Ultra Mobile • Ремонт телефонів • Телефони • Аксесуари',
      text: 'Змініть оператора, збережіть свій номер або відремонтуйте телефон в одному надійному місцевому магазині. Ми допоможемо вибрати план, перенести номер, налаштувати послугу та зрозуміти варіанти ремонту.',
      offers: 'Переглянути пропозиції Ultra Mobile',
      repair: 'Подати заявку на ремонт',
      call: 'Зателефонувати: 773-413-7489',
      visualLabel: 'Реалістична презентація iPhone з інтерактивними пропозиціями Ultra Mobile',
      visualFeatured: 'Головна пропозиція серпня',
      visualAction: 'Запитати про цю пропозицію',
      visualHint: 'Перегляньте серпневі пропозиції',
      visualLocal: 'Активація та налаштування в магазині',
      visualOffers: ['4 лінії за $100', 'Кожен 4-й місяць безкоштовно', '$25/міс. Unlimited']
    },
    trust: ['Безкоштовна активація Ultra Mobile', 'Допомога з перенесенням номера', 'Довічна гарантія на окремі ремонти', 'Місцева підтримка в магазині'],
    offers: {
      eyebrow: 'СЕРПНЕВІ ЗАОЩАДЖЕННЯ',
      title: 'Серпневі пропозиції Ultra Mobile',
      intro: 'Три прості способи заощадити — для родин, нових клієнтів і користувачів відповідних місячних планів.',
      cards: [
        {
          badge: 'СІМЕЙНИЙ ПЛАН',
          title: '4 лінії Unlimited',
          price: '$100',
          priceSuffix: '/міс.',
          explanation: 'Об’єднайте чотири лінії Unlimited в одному плані за загальну ціну $100 на місяць.',
          bullets: ['Для родин, друзів і сусідів по житлу', 'Чотири лінії в одному плані', 'Планшети можуть відповідати умовам пакета з чотирьох ліній', 'Послуга працює в мережі T-Mobile'],
          cta: 'Запитати про сімейний план'
        },
        {
          badge: 'КОЖЕН 4-Й МІСЯЦЬ БЕЗКОШТОВНО',
          title: 'Купіть 3 місяці — 4-й БЕЗКОШТОВНО',
          explanation: 'Поновлюйте відповідний місячний план 8GB або вище протягом трьох місяців поспіль і отримайте четвертий місяць безкоштовно.',
          bullets: ['Для відповідних місячних планів 8GB або вище', 'Сплатіть три місяці поспіль', 'Отримайте четвертий місяць безкоштовно', 'Перевага повторюється, поки акаунт і план відповідають умовам'],
          cta: 'Переглянути відповідні плани'
        },
        {
          badge: 'ДЛЯ НОВИХ КЛІЄНТІВ',
          title: 'Ultra Unlimited',
          price: '$25',
          priceSuffix: '/міс.',
          explanation: '6 місяців за $150 з передоплатою.',
          bullets: ['Безлімітні дані 5G і 4G LTE без фіксованого ліміту', 'Безлімітні дзвінки та глобальні SMS', 'Дзвінки до понад 90 міжнародних напрямків', 'Безлімітні дзвінки й SMS плюс 5GB даних у Мексиці та Канаді'],
          cta: 'Запитати про Unlimited за $25'
        }
      ],
      disclaimer: 'Пропозиція обмежена в часі. Можуть діяти вимоги щодо участі, доступності плану, швидкості даних, податків, зборів, статусу акаунта, сумісності пристрою та інші обмеження. Деталі підтвердимо перед активацією.'
    },
    bonus: {
      badge: 'СЕРПНЕВИЙ БОНУС',
      title: 'Безкоштовне загартоване скло для iPhone',
      text: 'З активацією Ultra Mobile або окремими ремонтами. Пропозиція обмежена в часі. Деталі в магазині.',
      cta: 'Запитати про бонус'
    },
    repairs: {
      eyebrow: 'CELLZ REPAIRZ',
      title: 'Ремонтуємо телефони та планшети',
      intro: 'Від простих замін до складнішої діагностики — ми пояснимо проблему та доступні варіанти ремонту.',
      services: ['Заміна екрана', 'Заміна батареї', 'Проблеми із заряджанням', 'Порти заряджання', 'Заднє скло', 'Камери', 'Динаміки', 'Мікрофони', 'Діагностика телефону', 'Відновлення даних, коли це можливо'],
      serviceCta: 'Почати заявку',
      diagnosticEyebrow: 'ДІАГНОСТИКА',
      diagnosticTitle: 'Не знаєте, що не так із телефоном?',
      diagnosticText: 'Принесіть його до Cellz Repairz. Ми перевіримо пристрій, пояснимо проблему та доступні варіанти ремонту.',
      ask: 'Запитати про ремонт',
      book: 'Подати заявку на ремонт',
      bookingNote: 'Онлайн-запис є заявкою на ремонт. Перед візитом ми підтверджуємо час, ціну та наявність деталей.'
    },
    shop: {
      eyebrow: 'ВИБІР У МАГАЗИНІ',
      title: 'Телефони та аксесуари',
      text: 'Запитайте про наявні телефони, захисні чохли, загартоване скло, зарядні пристрої та інші аксесуари для популярних моделей.',
      categories: ['Розблоковані телефони', 'Вживані й нові телефони залежно від наявності', 'Захисні чохли', 'Загартоване скло', 'Зарядні пристрої та кабелі', 'Навушники', 'Повербанки', 'Аксесуари для iPhone', 'Аксесуари для Samsung', 'Аксесуари для Motorola та Google Pixel'],
      cta: 'Запитати про наявність'
    },
    transfer: {
      eyebrow: 'ЗБЕРЕЖІТЬ СВІЙ НОМЕР',
      title: 'Хочете перенести свій номер?',
      intro: 'Ми допоможемо перевірити телефон, перенести номер і налаштувати Ultra Mobile.',
      steps: ['Розблокований телефон', 'Номер акаунта у поточного оператора', 'Transfer PIN', 'Залиште стару послугу активною до завершення перенесення'],
      stepLabel: 'Крок',
      warning: 'Не скасовуйте стару послугу до завершення перенесення номера. Надто раннє закриття акаунта може завадити зберегти номер.',
      cta: 'Почати перенесення номера'
    },
    why: {
      eyebrow: 'ПРОСТА МІСЦЕВА ДОПОМОГА',
      title: 'Чому обирають Cellz Repairz?',
      items: ['Безкоштовна активація Ultra Mobile', 'Допомога з перенесенням номера', 'Ви зберігаєте свій номер', 'Допомога англійською та польською', 'Підтримка в магазині', 'Швидке професійне обслуговування', 'Чесне пояснення доступних варіантів', 'Місцевий бізнес у Чикаго']
    },
    faq: {
      eyebrow: 'КОРИСНІ ВІДПОВІДІ',
      title: 'Поширені запитання',
      items: [
        { question: 'Чи можу я зберегти свій номер?', answer: 'У більшості випадків так. Залиште поточну послугу активною та принесіть правильний номер акаунта й Transfer PIN. Ми допоможемо подати запит до скасування старої послуги.' },
        { question: 'Чи має телефон бути розблокованим?', answer: 'Зазвичай так. Перед активацією телефон має бути розблокованим і сумісним із мережею. Ми можемо допомогти перевірити пристрій у магазині.' },
        { question: 'Що потрібно для перенесення номера?', answer: 'Принесіть телефон, номер акаунта у поточного оператора, Transfer PIN та потрібні дані акаунта. Стара лінія має залишатися активною до завершення перенесення.' },
        { question: 'Чи безкоштовна активація Ultra Mobile?', answer: 'Cellz Repairz надає безкоштовну допомогу з активацією Ultra Mobile у магазині. Вартість плану, податки та інші можливі збори оплачуються окремо.' },
        { question: 'Хто може отримати Ultra Unlimited за $25?', answer: 'Серпнева пропозиція діє для відповідних нових клієнтів, які сплачують $150 наперед за шість місяців Ultra Unlimited. Участь підтвердимо перед активацією.' },
        { question: 'Як працює безкоштовний четвертий місяць?', answer: 'Використовуйте відповідний місячний план 8GB або вище та здійсніть три послідовні платні поновлення. Четвертий місяць безкоштовний, і перевага може повторюватися, поки акаунт і план відповідають умовам.' },
        { question: 'Чи ремонтуєте Samsung і Motorola?', answer: 'Так. Ми працюємо з iPhone, Samsung, Motorola, Google Pixel, iPad та багатьма іншими телефонами й планшетами. Деталі та варіанти залежать від моделі й несправності.' },
        { question: 'Чи можна прийти на діагностику без запису?', answer: 'Так, можна прийти без запису в робочі години. Онлайн-заявка може допомогти нам підготуватися, перевірити деталі та зв’язатися щодо найкращого часу.' }
      ]
    },
    contact: {
      eyebrow: 'ВІДВІДАЙТЕ МАГАЗИН',
      title: 'Відвідайте Cellz Repairz',
      text: 'Місцева допомога з Ultra Mobile, ремонтом, діагностикою, телефонами й аксесуарами.',
      hoursTitle: 'Години роботи',
      weekdays: 'Понеділок–п’ятниця: 11:00 AM–7:00 PM',
      saturday: 'Субота: 11:00 AM–3:00 PM',
      sunday: 'Неділя: зачинено',
      closed: 'Зачинено',
      call: 'Зателефонувати',
      directions: 'Маршрут',
      book: 'Подати заявку на ремонт',
      ultra: 'Запитати про Ultra Mobile'
    },
    final: {
      eyebrow: 'ОДИН МІСЦЕВИЙ МАГАЗИН',
      title: 'Готові змінити оператора або відремонтувати телефон?',
      text: 'Почніть заявку Ultra Mobile, подайте заявку на ремонт, зателефонуйте або завітайте до магазину.',
      ultra: 'Почати заявку Ultra Mobile',
      repair: 'Подати заявку на ремонт'
    },
    sticky: { call: 'Дзвінок', ultra: 'Ultra Mobile', aria: 'Швидкі дії на головній сторінці' },
    accessibility: {
      offers: 'Картки серпневих пропозицій Ultra Mobile',
      services: 'Послуги ремонту телефонів і планшетів',
      categories: 'Категорії телефонів і аксесуарів',
      transfer: 'Кроки перенесення номера',
      why: 'Причини обрати Cellz Repairz',
      faq: 'Поширені запитання'
    }
  }
};

const repairIcons = [Smartphone, BatteryCharging, Plug, Cable, TabletSmartphone, Camera, Headphones, Mic, CircleHelp, HardDrive];
const repairIssues = ['Cracked screen', 'Battery replacement', 'Charging port issue', 'Charging port issue', 'Back glass', 'Camera issue', 'Speaker or microphone', 'Speaker or microphone', 'Other / not sure', 'Data recovery'];
const shopIcons = [Smartphone, Smartphone, ShieldCheck, Sparkles, Cable, Headphones, BatteryCharging, Smartphone, Smartphone, Smartphone];
const trustIcons = [Wifi, Users, Smartphone, MessageCircle, Store, Wrench, CheckCircle2, MapPin];

function trackHomepageAction(eventName: string) {
  const payload = JSON.stringify({
    path: `/event/${eventName}`,
    page: eventName,
    language: document.documentElement.lang || 'en',
    referrer: window.location.href
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track-visit', new Blob([payload], { type: 'application/json' }));
      return;
    }
  } catch {
    // Action tracking must never interrupt navigation.
  }

  void fetch('/api/track-visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true
  }).catch(() => undefined);
}

function AugustFaq({ items, ariaLabel }: { items: FaqItem[]; ariaLabel: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="augustFaq" aria-label={ariaLabel}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `august-faq-panel-${index}`;
        const buttonId = `august-faq-button-${index}`;
        return (
          <article className={isOpen ? 'augustFaqItem open' : 'augustFaqItem'} key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{item.question}</span>
                <ChevronDown size={21} aria-hidden="true" />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p>{item.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function AugustHome({
  lang,
  navigate,
  navigatePath
}: {
  lang: LanguageKey;
  navigate: (page: HomePageKey) => void;
  navigatePath: (path: string) => void;
}) {
  const copy = augustCopy[lang] || augustCopy.en;
  const directionsUrl = 'https://maps.google.com/?q=3412+N+Harlem+Ave+STE+A+Chicago+IL+60634';
  const [activeHeroOffer, setActiveHeroOffer] = useState(2);

  const handleHeroPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty('--hero-rotate-y', `${horizontal * 3.6}deg`);
    event.currentTarget.style.setProperty('--hero-rotate-x', `${vertical * -2.8}deg`);
    event.currentTarget.style.setProperty('--hero-shift-x', `${horizontal * 8}px`);
    event.currentTarget.style.setProperty('--hero-shift-y', `${vertical * 6}px`);
    event.currentTarget.style.setProperty('--hero-light-x', `${56 + horizontal * 18}%`);
    event.currentTarget.style.setProperty('--hero-light-y', `${40 + vertical * 15}%`);
  };

  const resetHeroPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--hero-rotate-y', '0deg');
    event.currentTarget.style.setProperty('--hero-rotate-x', '0deg');
    event.currentTarget.style.setProperty('--hero-shift-x', '0px');
    event.currentTarget.style.setProperty('--hero-shift-y', '0px');
    event.currentTarget.style.setProperty('--hero-light-x', '56%');
    event.currentTarget.style.setProperty('--hero-light-y', '40%');
  };

  const scrollToOffers = () => {
    trackHomepageAction('homepage_august_ultra_inquiry_click');
    document.getElementById('august-offers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const startRepair = (issue?: string) => {
    trackHomepageAction('homepage_august_repair_booking_click');
    const query = issue ? `?issue=${encodeURIComponent(issue)}&source=homepage-august` : '?source=homepage-august';
    navigatePath(`/book-repair${query}`);
  };

  const startUltra = (request: string, plan: string, eventName: string) => {
    trackHomepageAction(eventName);
    navigatePath(`/ultra-sim?request=${encodeURIComponent(request)}&plan=${encodeURIComponent(plan)}&source=homepage-august`);
  };

  const openSelectedHeroOffer = () => {
    if (activeHeroOffer === 0) {
      startUltra('august-family-plan', '4 Unlimited Lines for $100', 'homepage_august_family_offer_click');
    } else if (activeHeroOffer === 1) {
      startUltra('august-fourth-month', 'Every 4th Month Free', 'homepage_august_fourth_month_click');
    } else {
      startUltra('august-25-unlimited', 'Ultra Unlimited 6 Months for $150', 'homepage_august_25_offer_click');
    }
  };

  return (
    <main className="augustHome">
      <section className="augustHero">
        <div className="augustHeroGlow augustHeroGlowOne" aria-hidden="true" />
        <div className="augustHeroGlow augustHeroGlowTwo" aria-hidden="true" />
        <div className="wrap augustHeroGrid">
          <div className="augustHeroCopy">
            <span className="augustEyebrow"><Sparkles size={16} /> {copy.hero.eyebrow}</span>
            <h1>{copy.hero.title}</h1>
            <p className="augustHeroSupporting">{copy.hero.supporting}</p>
            <p className="augustHeroText">{copy.hero.text}</p>
            <div className="augustHeroActions">
              <button className="primaryBtn" type="button" onClick={scrollToOffers}>{copy.hero.offers} <ArrowRight size={18} /></button>
              <button className="secondaryBtn" type="button" onClick={() => startRepair()}>{copy.hero.repair}</button>
              <a className="secondaryBtn augustCallBtn" href="tel:7734137489" onClick={() => trackHomepageAction('homepage_august_call_click')}><Phone size={17} /> {copy.hero.call}</a>
            </div>
          </div>

          <div className="augustHeroVisual" aria-label={copy.hero.visualLabel}>
            <div className="augustProductScene" onPointerMove={handleHeroPointerMove} onPointerLeave={resetHeroPointer}>
              <div className="augustStudioLight" aria-hidden="true" />
              <div className="augustDeviceShadow" aria-hidden="true" />

              <figure className="augustPhoneProduct">
                <picture>
                  <source srcSet="/iphone-pro-realistic.webp" type="image/webp" />
                  <img
                    src="/iphone-pro-realistic.png"
                    alt={copy.hero.visualLabel}
                    width="1306"
                    height="1828"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </picture>
              </figure>

              <aside className="augustHeroOfferPanel">
                <div className="augustHeroOfferHeader">
                  <div>
                    <strong>Ultra Mobile</strong>
                    <span>{copy.hero.visualFeatured}</span>
                  </div>
                  <small>{copy.hero.visualLocal}</small>
                </div>

                <div className="augustHeroOfferTabs" role="tablist" aria-label={copy.hero.visualHint}>
                  {copy.hero.visualOffers.map((offer, index) => (
                    <button
                      key={offer}
                      id={`august-hero-offer-tab-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={activeHeroOffer === index}
                      aria-controls="august-hero-offer-panel"
                      className={activeHeroOffer === index ? 'active' : ''}
                      onClick={() => setActiveHeroOffer(index)}
                    >
                      {offer}
                    </button>
                  ))}
                </div>

                <div
                  className="augustHeroOfferBody"
                  id="august-hero-offer-panel"
                  role="tabpanel"
                  aria-labelledby={`august-hero-offer-tab-${activeHeroOffer}`}
                  aria-live="polite"
                  key={`${lang}-${activeHeroOffer}`}
                >
                  <div className="augustHeroOfferCopy">
                    <span className="augustHeroOfferBadge">{copy.offers.cards[activeHeroOffer].badge}</span>
                    <div className="augustHeroOfferTitleRow">
                      <h2>{copy.offers.cards[activeHeroOffer].title}</h2>
                      {copy.offers.cards[activeHeroOffer].price && (
                        <p className="augustHeroOfferPrice">
                          <strong>{copy.offers.cards[activeHeroOffer].price}</strong>
                          <span>{copy.offers.cards[activeHeroOffer].priceSuffix}</span>
                        </p>
                      )}
                    </div>
                    <p>{copy.offers.cards[activeHeroOffer].explanation}</p>
                  </div>
                  <button type="button" onClick={openSelectedHeroOffer}>
                    {copy.hero.visualAction} <ArrowRight size={15} />
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="augustTrustStrip">
        <div className="wrap augustTrustGrid">
          {[Wifi, Users, ShieldCheck, Store].map((Icon, index) => (
            <div key={copy.trust[index]}><Icon size={21} /><span>{copy.trust[index]}</span></div>
          ))}
        </div>
      </section>

      <section className="augustSection augustOffersSection" id="august-offers">
        <div className="wrap">
          <div className="augustSectionHeading centered">
            <span>{copy.offers.eyebrow}</span>
            <h2>{copy.offers.title}</h2>
            <p>{copy.offers.intro}</p>
          </div>
          <div className="augustOfferGrid" aria-label={copy.accessibility.offers}>
            {copy.offers.cards.map((card, index) => (
              <article className={`augustOfferCard augustOfferCard-${index + 1}`} key={card.badge}>
                <div className="augustOfferTopline">
                  <span className="augustOfferBadge">{card.badge}</span>
                  {index === 0 ? <Users size={22} /> : index === 1 ? <Gift size={22} /> : <Sparkles size={22} />}
                </div>
                <h3>{card.title}</h3>
                {card.price && <p className="augustOfferPrice"><strong>{card.price}</strong><span>{card.priceSuffix}</span></p>}
                <p className="augustOfferExplanation">{card.explanation}</p>
                <ul>
                  {card.bullets.map((bullet) => <li key={bullet}><CheckCircle2 size={17} /> <span>{bullet}</span></li>)}
                </ul>
                <button
                  className="primaryBtn"
                  type="button"
                  onClick={() => {
                    if (index === 0) startUltra('august-family-plan', '4 Unlimited Lines for $100', 'homepage_august_family_offer_click');
                    else if (index === 1) startUltra('august-fourth-month', 'Every 4th Month Free', 'homepage_august_fourth_month_click');
                    else startUltra('august-25-unlimited', 'Ultra Unlimited 6 Months for $150', 'homepage_august_25_offer_click');
                  }}
                >
                  {card.cta} <ArrowRight size={17} />
                </button>
              </article>
            ))}
          </div>
          <p className="augustOfferDisclaimer">{copy.offers.disclaimer}</p>
        </div>
      </section>

      <section className="augustBonusSection">
        <div className="wrap augustBonusPanel">
          <div className="augustBonusIcon"><Gift size={28} /></div>
          <div>
            <span>{copy.bonus.badge}</span>
            <h2>{copy.bonus.title}</h2>
            <p>{copy.bonus.text}</p>
          </div>
          <button
            type="button"
            className="secondaryBtn"
            onClick={() => startUltra('august-tempered-glass-bonus', 'Free Tempered Glass Bonus', 'homepage_august_bonus_click')}
          >
            {copy.bonus.cta} <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <section className="augustSection augustRepairsSection">
        <div className="wrap">
          <div className="augustSectionHeading">
            <span>{copy.repairs.eyebrow}</span>
            <h2>{copy.repairs.title}</h2>
            <p>{copy.repairs.intro}</p>
          </div>
          <div className="augustRepairGrid" aria-label={copy.accessibility.services}>
            {copy.repairs.services.map((service, index) => {
              const Icon = repairIcons[index];
              return (
                <button className="augustRepairService" type="button" key={service} onClick={() => startRepair(repairIssues[index])}>
                  <span className="augustRepairServiceIcon"><Icon size={22} /></span>
                  <strong>{service}</strong>
                  <small>{copy.repairs.serviceCta} <ArrowRight size={14} /></small>
                </button>
              );
            })}
          </div>

          <div className="augustDiagnosticPanel">
            <div className="augustDiagnosticArt" aria-hidden="true">
              <div className="augustDiagnosticPhone"><span /><i /></div>
              <div className="augustDiagnosticScan"><SearchGlyph /></div>
            </div>
            <div className="augustDiagnosticCopy">
              <span>{copy.repairs.diagnosticEyebrow}</span>
              <h3>{copy.repairs.diagnosticTitle}</h3>
              <p>{copy.repairs.diagnosticText}</p>
              <small><CircleHelp size={16} /> {copy.repairs.bookingNote}</small>
            </div>
            <div className="augustDiagnosticActions">
              <button type="button" className="secondaryBtn" onClick={() => navigate('repairs')}>{copy.repairs.ask}</button>
              <button type="button" className="primaryBtn" onClick={() => startRepair('Other / not sure')}>{copy.repairs.book} <ArrowRight size={17} /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="augustSection augustShopSection">
        <div className="wrap augustShopLayout">
          <div className="augustSectionHeading">
            <span>{copy.shop.eyebrow}</span>
            <h2>{copy.shop.title}</h2>
            <p>{copy.shop.text}</p>
            <button type="button" className="primaryBtn" onClick={() => navigate('phones')}>{copy.shop.cta} <ArrowRight size={17} /></button>
          </div>
          <div className="augustShopGrid" aria-label={copy.accessibility.categories}>
            {copy.shop.categories.map((category, index) => {
              const Icon = shopIcons[index];
              return <div key={category}><span><Icon size={19} /></span><strong>{category}</strong></div>;
            })}
          </div>
        </div>
      </section>

      <section className="augustSection augustTransferSection">
        <div className="wrap augustTransferPanel">
          <div className="augustTransferHeading">
            <span>{copy.transfer.eyebrow}</span>
            <h2>{copy.transfer.title}</h2>
            <p>{copy.transfer.intro}</p>
          </div>
          <div className="augustTransferSteps" aria-label={copy.accessibility.transfer}>
            {copy.transfer.steps.map((step, index) => (
              <div key={step}>
                <span>{copy.transfer.stepLabel} {index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
          <div className="augustTransferWarning"><ShieldCheck size={21} /><p>{copy.transfer.warning}</p></div>
          <button type="button" className="primaryBtn" onClick={() => startUltra('number-transfer', 'Ultra Mobile Number Transfer', 'homepage_august_ultra_inquiry_click')}>{copy.transfer.cta} <ArrowRight size={17} /></button>
        </div>
      </section>

      <section className="augustSection augustWhySection">
        <div className="wrap">
          <div className="augustSectionHeading centered">
            <span>{copy.why.eyebrow}</span>
            <h2>{copy.why.title}</h2>
          </div>
          <div className="augustWhyGrid" aria-label={copy.accessibility.why}>
            {copy.why.items.map((item, index) => {
              const Icon = trustIcons[index];
              return <div key={item}><span><Icon size={21} /></span><strong>{item}</strong></div>;
            })}
          </div>
        </div>
      </section>

      <section className="augustSection augustFaqSection">
        <div className="wrap augustFaqLayout">
          <div className="augustSectionHeading">
            <span>{copy.faq.eyebrow}</span>
            <h2>{copy.faq.title}</h2>
          </div>
          <AugustFaq items={copy.faq.items} ariaLabel={copy.accessibility.faq} />
        </div>
      </section>

      <section className="augustSection augustContactSection">
        <div className="wrap augustContactPanel">
          <div className="augustContactMain">
            <span>{copy.contact.eyebrow}</span>
            <h2>{copy.contact.title}</h2>
            <p>{copy.contact.text}</p>
            <div className="augustAddress"><MapPin size={20} /><p><strong>Cellz Repairz</strong><br />3412 N Harlem Ave, STE A<br />Chicago, IL 60634<br /><a href="tel:7734137489">773-413-7489</a><br /><a href="https://www.cellztech.com">www.CellzTech.com</a></p></div>
          </div>
          <div className="augustHoursCard">
            <span><Store size={18} /> {copy.contact.hoursTitle}</span>
            <p>{copy.contact.weekdays}</p>
            <p>{copy.contact.saturday}</p>
            <p>{copy.contact.sunday}</p>
          </div>
          <div className="augustContactActions">
            <a className="primaryBtn" href="tel:7734137489" onClick={() => trackHomepageAction('homepage_august_call_click')}><Phone size={17} /> {copy.contact.call}</a>
            <a className="secondaryBtn" href={directionsUrl} target="_blank" rel="noreferrer" onClick={() => trackHomepageAction('homepage_august_directions_click')}><Navigation size={17} /> {copy.contact.directions}</a>
            <button className="secondaryBtn" type="button" onClick={() => startRepair()}>{copy.contact.book}</button>
            <button className="secondaryBtn" type="button" onClick={() => startUltra('general-august-inquiry', 'August Ultra Mobile Offers', 'homepage_august_ultra_inquiry_click')}>{copy.contact.ultra}</button>
          </div>
        </div>
      </section>

      <section className="augustFinalSection">
        <div className="wrap augustFinalPanel">
          <div>
            <span>{copy.final.eyebrow}</span>
            <h2>{copy.final.title}</h2>
            <p>{copy.final.text}</p>
          </div>
          <div>
            <button className="primaryBtn" type="button" onClick={() => startUltra('general-august-inquiry', 'August Ultra Mobile Offers', 'homepage_august_ultra_inquiry_click')}>{copy.final.ultra} <ArrowRight size={17} /></button>
            <button className="secondaryBtn" type="button" onClick={() => startRepair()}>{copy.final.repair}</button>
          </div>
        </div>
      </section>

      <nav className="augustMobileSticky" aria-label={copy.sticky.aria}>
        <a href="tel:7734137489" onClick={() => trackHomepageAction('homepage_august_call_click')}><Phone size={19} /><span>{copy.sticky.call}</span></a>
        <button type="button" onClick={() => startUltra('general-august-inquiry', 'August Ultra Mobile Offers', 'homepage_august_ultra_inquiry_click')}><Wifi size={19} /><span>{copy.sticky.ultra}</span></button>
      </nav>
    </main>
  );
}

function SearchGlyph() {
  return (
    <svg viewBox="0 0 64 64" role="presentation" aria-hidden="true">
      <circle cx="27" cy="27" r="15" fill="none" stroke="currentColor" strokeWidth="5" />
      <path d="M39 39L54 54" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
