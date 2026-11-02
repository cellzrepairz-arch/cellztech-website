import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HOLIDAY_END } from './ultra-offers';
import type { SiteLanguage } from './site-copy';
const text = {
  en: ['NOVEMBER AT CELLZTECH','Ultra Mobile offers continue through December 31, 2026.','See offers'],
  pl: ['LISTOPAD W CELLZTECH','Oferty Ultra Mobile trwaj\u0105 do 31 grudnia 2026 r.','Zobacz oferty'],
  es: ['NOVIEMBRE EN CELLZTECH','Las ofertas de Ultra Mobile contin\u00faan hasta el 31 de diciembre de 2026.','Ver ofertas'],
  uk: ['\u041b\u0418\u0421\u0422\u041e\u041f\u0410\u0414 \u0423 CELLZTECH','\u041f\u0440\u043e\u043f\u043e\u0437\u0438\u0446\u0456\u0457 Ultra Mobile \u0434\u0456\u044e\u0442\u044c \u0434\u043e 31 \u0433\u0440\u0443\u0434\u043d\u044f 2026 \u0440\u043e\u043a\u0443.','\u041f\u0435\u0440\u0435\u0433\u043b\u044f\u043d\u0443\u0442\u0438']
};
export function NovemberNotice({lang}:{lang:SiteLanguage}) {
  if(Date.now() >= Date.parse(HOLIDAY_END)) return null;
  const t=text[lang];
  return <div className="novNotice"><div className="oct-container"><strong>{t[0]}</strong><span>{t[1]}</span><a href="/ultra-mobile#holiday">{t[2]}<ArrowRight size={14}/></a></div></div>;
}
