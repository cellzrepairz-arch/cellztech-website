import { octoberCopy, type OctoberLanguage } from './october-copy';
import { holidayPlans } from './october-offers';
export const SITE_ORIGIN = 'https://cellztech.com';
export const SEO_IMAGE = `${SITE_ORIGIN}/october/og-cellztech-october.png`;
export const publicSeoPages: Record<string, { title: string; description: string }> = {
  '/': { title: octoberCopy.en.seo.homeTitle, description: octoberCopy.en.seo.homeDescription },
  '/ultra-mobile': { title: octoberCopy.en.seo.ultraTitle, description: octoberCopy.en.seo.ultraDescription },
  '/repairs': { title: 'iPhone, Samsung & Tablet Repair in Chicago | CellzTech', description: 'Screen, battery, charging port and back glass repairs in Chicago. Visit Cellz Repairz on N Harlem Ave or request a repair. We confirm price and timing first.' },
  '/book-repair': { title: 'Request a Phone Repair in Chicago | CellzTech', description: 'Tell CellzTech your device, repair issue and preferred drop-off time. Our Chicago team confirms parts, price and availability before your repair.' },
  '/ultra-sim': { title: 'Ultra Mobile SIM & Activation Help in Chicago | CellzTech', description: 'Ask about Ultra Mobile plans, SIM pickup, shipping or eSIM at CellzTech. Compare eligible offers and get local help transferring your number.' },
  '/xfinity-prepaid': { title: 'Xfinity Prepaid Internet in Chicago | CellzTech', description: 'Get local help with Xfinity Prepaid Internet at CellzTech, 3412 N Harlem Ave, Chicago. Ask about current plans, setup and equipment.' },
  '/buyback': { title: 'Sell Your Phone | CellzTech Chicago', description: 'Explore phone buyback options with CellzTech in Chicago. Get a quote and find out what your device may be worth.' },
  '/phones': { title: 'Used & Unlocked Phones in Chicago | CellzTech', description: 'Explore used and unlocked phone options at CellzTech on N Harlem Ave in Chicago. Contact the store for current stock and setup help.' },
  '/accessories': { title: 'Phone Cases, Chargers & Accessories | CellzTech Chicago', description: 'Find phone cases, chargers, cables and screen protection at CellzTech in Chicago. Ask our local team about accessories for your device.' },
  '/about': { title: 'About Cellz Repairz & CellzTech | Chicago', description: 'Meet your local Chicago destination for phone repair, wireless plans, phone sales and accessories. CellzTech is operated by Cellz Repairz LLC.' },
  '/contact': { title: 'Contact Cellz Repairz | N Harlem Ave, Chicago', description: 'Visit Cellz Repairz at 3412 N Harlem Ave, STE A, Chicago, IL 60634. Call 773-413-7489. Open Monday–Friday 11–7 and Saturday 11–3.' }
};
export function schemaFor(path: string, lang: OctoberLanguage) {
  const t=octoberCopy[lang]; const url=SITE_ORIGIN+path;
  const business = { '@type':'LocalBusiness', '@id':`${SITE_ORIGIN}/#business`, name:'Cellz Repairz', alternateName:'CellzTech', legalName:'Cellz Repairz LLC', url:`${SITE_ORIGIN}/`, telephone:'+1-773-413-7489', image:SEO_IMAGE, address:{ '@type':'PostalAddress',streetAddress:'3412 N Harlem Ave STE A',addressLocality:'Chicago',addressRegion:'IL',postalCode:'60634',addressCountry:'US'}, openingHoursSpecification:[{ '@type':'OpeningHoursSpecification', dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday'], opens:'11:00',closes:'19:00' },{ '@type':'OpeningHoursSpecification',dayOfWeek:'Saturday',opens:'11:00',closes:'15:00'}] };
  const graph: unknown[]=[business,{ '@type':'WebPage','@id':`${url}#webpage`,url,inLanguage:lang,about:{'@id':`${SITE_ORIGIN}/#business`} }];
  if(path==='/' || path==='/ultra-mobile') {
    const faq=path==='/'?[t.faq[5],t.faq[0],t.faq[2]]:t.faq;
    graph.push({'@type':'FAQPage','@id':`${url}#faq`,mainEntity:faq.map(x=>({'@type':'Question',name:x.q,acceptedAnswer:{'@type':'Answer',text:x.a}}))});
    if(path==='/ultra-mobile' && Date.now()<Date.parse('2027-01-01T00:00:00-06:00')) graph.push({'@type':'OfferCatalog',name:t.holiday.subtitle,'@id':`${url}#holiday`,itemListElement:holidayPlans.map(p=>({'@type':'Offer',name:`Ultra ${p.name} — 12 months`,description:`${t.ui.newCustomer}. ${t.holiday.eligibility} ${t.ui.tax}`,price:p.total,priceCurrency:'USD',validFrom:'2026-10-01',validThrough:'2026-12-31',url:`${url}#holiday`,seller:{'@id':`${SITE_ORIGIN}/#business`},itemOffered:{'@type':'Service',name:`Ultra Mobile ${p.name} 12-month plan`}}))});
  }
  return {'@context':'https://schema.org','@graph':graph};
}
export function applyOctoberSeo(path: string, lang: OctoberLanguage, fallback: { title:string; description:string }) {
  const t=octoberCopy[lang];
  const data=path==='/'?{title:t.seo.homeTitle,description:t.seo.homeDescription}:path==='/ultra-mobile'?{title:t.seo.ultraTitle,description:t.seo.ultraDescription}:lang==='en'?(publicSeoPages[path]||fallback):fallback;
  document.documentElement.lang=lang;document.title=data.title;
  const meta=(key:string,value:string,property=false)=>{let node=document.head.querySelector<HTMLMetaElement>(`meta[${property?'property':'name'}="${key}"]`);if(!node){node=document.createElement('meta');node.setAttribute(property?'property':'name',key);document.head.appendChild(node);}node.content=value;};
  meta('description',data.description);meta('og:title',data.title,true);meta('og:description',data.description,true);meta('og:url',SITE_ORIGIN+path,true);meta('og:image',SEO_IMAGE,true);meta('og:locale',({en:'en_US',pl:'pl_PL',es:'es_US',uk:'uk_UA'})[lang],true);
  meta('twitter:title',data.title);meta('twitter:description',data.description);meta('twitter:image',SEO_IMAGE);
  meta('robots',path==='/admin'?'noindex, nofollow':'index, follow');
  let canonical=document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical);}canonical.href=SITE_ORIGIN+path;
  let schema=document.getElementById('cellztech-schema');if(!schema){schema=document.createElement('script');schema.id='cellztech-schema';schema.setAttribute('type','application/ld+json');document.head.appendChild(schema);}schema.textContent=JSON.stringify(path==='/admin'?{}:schemaFor(path,lang));
}