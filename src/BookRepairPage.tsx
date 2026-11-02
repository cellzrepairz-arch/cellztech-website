import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Smartphone, BatteryCharging, Plug, Camera, Wrench, ShieldCheck, Phone, MapPin, Search, ChevronDown } from 'lucide-react';
import { deviceCatalog } from './deviceCatalog';
import { bookText, bookingEnhancementCopy, repairIssues, issueTranslations, type LanguageKey, type BookingField } from './booking-copy';
import { bookingModernCopy } from './booking-modern-copy';
import { bookingSlots, chicagoNow, lastBookingDate, parseCalendarDate, windowLabel, validPhone, validEmail, validateRepairRequest } from '../shared/booking-rules.js';
import { RepairCoupon } from './RepairCoupon';
import './booking-modern.css';

type Booking = Record<BookingField, string>;
const issueIcons = [Smartphone,BatteryCharging,Plug,Smartphone,Camera,Wrench,Smartphone,Wrench,Wrench,Wrench,Wrench];
const locales = {en:'en-US',pl:'pl-PL',es:'es-US',uk:'uk-UA'};
function initialRequest() {
  const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  const brand = deviceCatalog.find(b=>b.brand===params.get('brand')) || deviceCatalog[0];
  const match = brand.series.flatMap(s=>s.models.map(model=>({model,series:s.name}))).find(m=>m.model===params.get('model'));
  const issue = repairIssues.includes(params.get('issue') || '') ? params.get('issue')! : '';
  const booking: Booking = {device:brand.brand,series:match?.series || brand.series[0]?.name || '',model:match?.model || '',issue,name:'',phone:'',email:'',requestedDate:'',requestedTime:'',notes:''};
  return {booking,step:match ? (issue ? 2 : 1) : 0,source:(params.get('source') || 'november-booking').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,80)};
}
function savedCoupon() {
  try {
    const value=localStorage.getItem('cellztech-nov26-coupon-code') || localStorage.getItem('cellztech-sep26-coupon-code') || '';
    return /^(?:NOV10|BTS10)-[A-F0-9]{12}$/.test(value) ? value : '';
  } catch { return ''; }
}
function displayDate(value:string,lang:LanguageKey,short=false) {
  const date=parseCalendarDate(value);
  return date ? new Intl.DateTimeFormat(locales[lang],{timeZone:'UTC',weekday:'short',month:short?'short':'long',day:'numeric',...(!short?{year:'numeric' as const}:{})}).format(date) : '';
}

export function BookRepairPage({lang}:{lang:LanguageKey}) {
  const b=bookText[lang], x=bookingModernCopy[lang], e=bookingEnhancementCopy[lang];
  const initial=useMemo(initialRequest,[]);
  const [booking,setBooking]=useState<Booking>(initial.booking);
  const [step,setStep]=useState(initial.step);
  const [search,setSearch]=useState('');
  const [showAll,setShowAll]=useState(false);
  const [visibleLimit,setVisibleLimit]=useState(12);
  useEffect(()=>{const query=window.matchMedia('(max-width: 600px)');const update=()=>setVisibleLimit(query.matches?6:12);update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
  const [now,setNow]=useState(Date.now);
  const [touched,setTouched]=useState<Record<string,boolean>>({});
  const [confirmed,setConfirmed]=useState(false);
  const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const [message,setMessage]=useState('');
  const [website,setWebsite]=useState('');
  const [coupon,setCoupon]=useState(savedCoupon);
  const heading=useRef<HTMLHeadingElement>(null);
  const sending=useRef(false);
  const firstRender=useRef(true);
  const submitted=useRef(false);
  useEffect(()=>{const timer=window.setInterval(()=>setNow(Date.now()),30000);return()=>clearInterval(timer);},[]);
  useEffect(()=>{const onSaved=()=>setCoupon(savedCoupon());window.addEventListener('cellztech:coupon-saved',onSaved);return()=>window.removeEventListener('cellztech:coupon-saved',onSaved);},[]);
  useEffect(()=>{
    if(firstRender.current){firstRender.current=false;return;}
    heading.current?.focus({preventScroll:true});
    heading.current?.scrollIntoView({block:'start',behavior:'auto'});
  },[step,status==='success']);
  const brand=deviceCatalog.find(item=>item.brand===booking.device) || deviceCatalog[0];
  const models=useMemo(()=>{
    const term=search.toLowerCase().replace(/\s+/g,'');
    return brand.series.flatMap(series=>series.models.map(model=>({model,series:series.name}))).filter(item=>term ? `${brand.brand}${item.series}${item.model}`.toLowerCase().replace(/\s+/g,'').includes(term) : item.series===booking.series);
  },[brand,search,booking.series]);
  const slots=bookingSlots(booking.requestedDate,now);
  const timeValid=slots.some(s=>s.value===booking.requestedTime);
  const validContact=Boolean(booking.name.trim() && validPhone(booking.phone) && validEmail(booking.email) && timeValid);
  const completed=[Boolean(booking.model),Boolean(booking.issue),validContact];
  const canReach=(index:number)=>completed.slice(0,index).every(Boolean);
  const quickDates=useMemo(()=>{
    const dates:string[]=[];const day=parseCalendarDate(chicagoNow(now).date)!;
    for(let i=0;i<8 && dates.length<3;i++){const date=day.toISOString().slice(0,10);if(bookingSlots(date,now).length)dates.push(date);day.setUTCDate(day.getUTCDate()+1);}
    return dates;
  },[now]);
  const field=(key:BookingField,value:string)=>{setBooking(old=>({...old,[key]:value}));setConfirmed(false);};
  const setDate=(value:string)=>{setBooking(old=>({...old,requestedDate:value,requestedTime:bookingSlots(value,now).some(s=>s.value===old.requestedTime)?old.requestedTime:''}));setConfirmed(false);};
  const move=(next:number)=>{if(sending.current)return;setStep(next);setMessage('');setStatus('idle');};
  const chooseBrand=(value:string)=>{const item=deviceCatalog.find(d=>d.brand===value)!;setBooking(old=>({...old,device:value,series:item.series[0]?.name || '',model:''}));setSearch('');setShowAll(false);setConfirmed(false);};
  const issueLabel=issueTranslations[booking.issue]?.[lang] || booking.issue;
  const summary=[{label:b.model,value:booking.model,to:0},{label:b.issue,value:issueLabel,to:1},{label:b.date,value:displayDate(booking.requestedDate,lang),to:2},{label:b.window,value:windowLabel(booking.requestedTime),to:2}];
  const sms=`sms:7734137489?&body=${encodeURIComponent(`Hi CellzTech, I would like help with ${booking.model || booking.device}. Issue: ${booking.issue || 'Not sure'}. Preferred visit: ${booking.requestedDate} ${windowLabel(booking.requestedTime)}. Name: ${booking.name}. Phone: ${booking.phone}. Email: ${booking.email}. ${booking.notes}`)}`;
  const errors={name:!booking.name.trim()?x.nameError:'',phone:!validPhone(booking.phone)?x.phoneError:'',email:!validEmail(booking.email)?x.emailError:''};
  const handleSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    if(sending.current || submitted.current)return;
    if(step<3){if(canReach(step+1))move(step+1);return;}
    const invalid=validateRepairRequest(booking);
    if(invalid){move(2);setMessage(invalid.code==='invalid_window'?x.changed:x.dateError);return;}
    if(!confirmed)return;
    sending.current=true;setStatus('sending');setMessage('');
    try {
      const response=await fetch('/api/repair-request',{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(45000),body:JSON.stringify({...booking,website,language:lang,contactConsent:true,requestedTimeLabel:windowLabel(booking.requestedTime),notes:[booking.notes,coupon?`Repair coupon supplied: ${coupon}. Staff must verify and redeem; no automatic invoice discount.`:''].filter(Boolean).join('\n'),source:`CellzTech website: ${initial.source}`})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok || data.ok!==true){if(data.error==='invalid_window'){sending.current=false;move(2);setMessage(x.changed);return;}throw new Error('receipt_not_confirmed');}
      submitted.current=true;setStatus('success');
    } catch {setStatus('error');setMessage(x.error);}
    finally {sending.current=false;}
  };
  if(status==='success') return <main id="main-content" className="bookingModern"><div className="bmWrap bmSuccess"><CheckCircle2 className="bmSuccessIcon" size={54}/><span className="bmEyebrow">CELLZTECH</span><h1 ref={heading} tabIndex={-1}>{x.success}</h1><p className="bmIntro">{x.successText}</p><div className="bmSuccessReceipt"><strong>{booking.model}</strong><span>{issueLabel}</span><span>{displayDate(booking.requestedDate,lang)} &middot; {windowLabel(booking.requestedTime)}</span><small>3412 N Harlem Ave, STE A &middot; Chicago, IL 60634</small></div><h2>{x.next}</h2><ol className="bmNextSteps">{x.nextSteps.map((text,i)=><li key={text}><span>{i+1}</span>{text}</li>)}</ol><div className="bmSuccessActions"><a className="bmPrimary" href="/">{x.home}<ArrowRight size={17}/></a><a className="bmTextLink" href="tel:7734137489"><Phone size={16}/>773-413-7489</a></div><RepairCoupon lang={lang} compact initialEmail={booking.email} navigatePath={path=>window.location.assign(path)}/></div></main>;
  return <main id="main-content" className="bookingModern"><div className="bmWrap">
    <div className="bmHeader"><div><span className="bmEyebrow"><Wrench size={15}/>{x.source}</span><h1>{b.title}</h1><p className="bmIntro">{x.subtitle}</p></div><span className="bmLocation"><MapPin size={16}/>3412 N Harlem Ave &middot; Chicago</span></div>
    <nav className="bmProgress" aria-label={e.progressAria}>{x.steps.map((label,index)=><button type="button" key={label} disabled={!canReach(index) || status==='sending'} aria-current={step===index?'step':undefined} onClick={()=>move(index)} className={step===index?'isActive':completed[index] && index<step?'isDone':''}><span>{completed[index] && index<step ? <CheckCircle2 size={17}/> : index+1}</span>{label}</button>)}</nav>
    <div className="bmLayout"><form className="bmCard" onSubmit={handleSubmit} aria-busy={status==='sending'}>
      <div className="bmCardBody"><div className="bmStepLabel">{b.step} {step+1} / 4</div>
        <h2 ref={heading} tabIndex={-1}>{[b.modelTitle,b.issueTitle,b.contactTitle,b.finalTitle][step]}</h2>
        <p className="bmHint">{[b.modelHint,x.issueHint,b.contactHint,b.finalHint][step]}</p>
        {step===0 && <>
          <div className="bmBrands" role="group" aria-label={b.brand}>{deviceCatalog.map(item=><button type="button" key={item.brand} aria-pressed={booking.device===item.brand} onClick={()=>chooseBrand(item.brand)}><Smartphone size={19}/><span>{item.brand==='Other / not sure'?b.notSure:item.shortLabel}</span></button>)}</div>
          <label className="bmSearch" htmlFor="bm-model-search"><Search size={19}/><input id="bm-model-search" type="search" autoComplete="off" value={search} onChange={ev=>{setSearch(ev.target.value);setShowAll(false);}} placeholder={b.searchPlaceholder} aria-label={b.searchPlaceholder}/></label>
          {!search && <div className="bmSeries" role="group" aria-label={b.series}>{brand.series.map(series=><button type="button" key={series.name} aria-pressed={series.name===booking.series} onClick={()=>{field('series',series.name);setShowAll(false);}}>{series.name}</button>)}</div>}
          <div className="bmModelCount" aria-live="polite">{search?b.searchResults:b.browse}<span>{models.length}</span></div>
          <div className="bmModels">{(showAll?models:models.slice(0,visibleLimit)).map(item=><button type="button" key={item.series+item.model} aria-pressed={booking.model===item.model} onClick={()=>{setBooking(old=>({...old,model:item.model,series:item.series}));setConfirmed(false);}}><span>{item.model}</span>{booking.model===item.model?<CheckCircle2 size={17}/>:<span className="bmRadio"/>}</button>)}</div>
          {models.length>visibleLimit && <button type="button" className="bmTextLink bmShowAll" onClick={()=>setShowAll(!showAll)}>{showAll?x.less:x.all}<ChevronDown size={15}/></button>}
          <button type="button" className="bmNotSure" aria-pressed={booking.model==='Device not listed'} onClick={()=>field('model','Device not listed')}>{b.notSure}<ArrowRight size={16}/></button>
          {booking.model && <p className="bmSelection" role="status"><CheckCircle2 size={16}/>{b.selected}: {booking.model==='Device not listed'?b.notListed:booking.model}</p>}
        </>}
        {step===1 && <div className="bmIssues" role="group" aria-label={b.issue}>{repairIssues.map((issue,index)=>{const Icon=issueIcons[index];return <button type="button" key={issue} aria-pressed={issue===booking.issue} onClick={()=>field('issue',issue)}><Icon size={22} strokeWidth={1.5}/><span>{issueTranslations[issue]?.[lang] || issue}</span>{booking.issue===issue && <CheckCircle2 size={17}/>}</button>;})}</div>}
        {step===2 && <><div className="bmFields">
          {(['name','phone','email'] as const).map(key=><label key={key} className={key==='email'?'bmFull':''} htmlFor={`bm-${key}`}>{b[key]}<input id={`bm-${key}`} name={key} type={key==='phone'?'tel':key==='email'?'email':'text'} autoComplete={key==='phone'?'tel':key} inputMode={key==='phone'?'tel':key==='email'?'email':'text'} maxLength={key==='email'?254:key==='phone'?32:120} required value={booking[key]} onChange={ev=>field(key,ev.target.value)} onBlur={()=>setTouched(old=>({...old,[key]:true}))} aria-invalid={touched[key] && Boolean(errors[key])} aria-describedby={touched[key] && errors[key]?`bm-${key}-error`:undefined}/>{touched[key] && errors[key] && <small id={`bm-${key}-error`} className="bmFieldError">{errors[key]}</small>}</label>)}
          <div className="bmFull bmDateChoices" role="group" aria-label={b.date}>{quickDates.map(date=><button type="button" key={date} aria-pressed={date===booking.requestedDate} onClick={()=>setDate(date)}>{displayDate(date,lang,true)}</button>)}</div>
          <label htmlFor="bm-date">{b.date}<input id="bm-date" type="date" name="requestedDate" min={chicagoNow(now).date} max={lastBookingDate(now)} required value={booking.requestedDate} onChange={ev=>setDate(ev.target.value)}/></label>
          <label htmlFor="bm-time">{b.window}<select id="bm-time" name="requestedTime" disabled={!slots.length} value={timeValid?booking.requestedTime:''} required onChange={ev=>field('requestedTime',ev.target.value)}><option value="">{booking.requestedDate?b.chooseWindow:b.chooseDate}</option>{slots.map(slot=><option key={slot.value} value={slot.value}>{slot.label}</option>)}</select></label>
          <p className="bmFull bmTimeNote">{booking.requestedDate && !slots.length ? x.noSlots : x.clock}</p>
          <label className="bmFull" htmlFor="bm-notes">{b.notes}<span className="bmOptional">{x.optional}</span><textarea id="bm-notes" name="notes" value={booking.notes} maxLength={2500} onChange={ev=>field('notes',ev.target.value)} placeholder={b.notesPlaceholder} rows={3}/></label>
        </div><p className="bmPrivacy"><ShieldCheck size={16}/>{x.privacy}</p></>}
        {step===3 && <><div className="bmReview">{[...summary,{label:b.name,value:booking.name,to:2},{label:b.phone,value:booking.phone,to:2},{label:b.email,value:booking.email,to:2},...(booking.notes?[{label:b.notes,value:booking.notes,to:2}]:[])].map(item=><div key={item.label}><span>{item.label}</span><strong>{item.value}</strong><button type="button" disabled={status==='sending'} aria-label={`${x.edit}: ${item.label}`} onClick={()=>move(item.to)}>{x.edit}</button></div>)}</div>
          {coupon && <p className="bmSelection"><CheckCircle2 size={17}/>{x.coupon}</p>}
          <label className="bmConfirm"><input type="checkbox" checked={confirmed} onChange={ev=>setConfirmed(ev.target.checked)} required disabled={status==='sending'}/><span>{x.confirm}</span></label><p className="bmDisclaimer">{b.consent}</p>
          {!timeValid && <p className="bmError" role="alert">{x.changed}<button className="bmTextLink" type="button" onClick={()=>move(2)}>{x.edit}</button></p>}
        </>}
        <div className="bmHoneypot" aria-hidden="true"><label>Website<input name="website" value={website} onChange={ev=>setWebsite(ev.target.value)} autoComplete="off" tabIndex={-1}/></label></div>
        {message && <div className="bmError" role="alert">{message}<div><a href={sms}>{b.textInstead}</a><a href="tel:7734137489">773-413-7489</a></div></div>}
      </div>
      <div className="bmControls"><button type="button" className="bmBack" disabled={step===0 || status==='sending'} onClick={()=>move(step-1)}>{b.back}</button><button type="submit" className="bmPrimary" disabled={step<3?!canReach(step+1):!canReach(3) || !confirmed || status==='sending'}>{step===3?(status==='sending'?b.sending:b.submit):step===2?x.review:b.next}<ArrowRight size={17}/></button></div>
    </form>
    <aside className="bmSidebar"><div className="bmSummary"><div className="bmSummaryIcon"><Smartphone size={30} strokeWidth={1.3}/></div><span className="bmEyebrow">{x.requestSummary}</span><h2>{booking.model==='Device not listed'?b.notListed:booking.model || booking.device}</h2><p>{issueLabel || x.choose}</p><dl>{summary.slice(2).filter(item=>item.value).map(item=><div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl><div className="bmSummaryFoot"><ShieldCheck size={18}/><span>{x.safe}</span></div></div><div className="bmHelp"><strong>{x.contact}</strong><p>{x.help}</p><a href="tel:7734137489"><Phone size={17}/>773-413-7489</a><small>{e.hoursSummary}</small></div><RepairCoupon lang={lang} compact initialEmail={booking.email} navigatePath={path=>{if(path.startsWith('/book-repair'))return;window.location.assign(path);}}/></aside>
    </div><p className="bmBottomNote">{e.noticeText}</p>
  </div></main>;
}
