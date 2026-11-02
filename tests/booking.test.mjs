// Isolated unit/contract tests. No live leads, email, calendar or database writes.
import { test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import {chicagoNow,parseCalendarDate,lastBookingDate,bookingSlots,validEmail,validPhone,validateRepairRequest,windowLabel} from '../shared/booking-rules.js';
import handler from '../api/repair-request.js';
const RealDate=Date,NOW=RealDate.parse('2026-11-02T16:00:00Z'); // Monday 10 AM CST
const originalFetch=globalThis.fetch, originalError=console.error,oldEnv={...process.env};
globalThis.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[NOW]));}static now(){return NOW;}};
const body=()=>({device:'Apple',series:'iPhone',model:'iPhone 16',issue:'Battery replacement',name:'Test Customer',phone:'773-555-0123',email:'qa@example.com',requestedDate:'2026-11-03',requestedTime:'11:00',notes:'QA only',website:''});
let calls=[];
function response(data={},status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});}
async function invoke(data=body(),method='POST'){const res={statusCode:200,headers:{},body:null,setHeader(k,v){this.headers[k]=v;},status(n){this.statusCode=n;return this;},json(x){this.body=x;return this;}};await handler({method,body:data,headers:{}},res);return res;}
beforeEach(()=>{calls=[];console.error=()=>{};for(const k of Object.keys(process.env))if(/^(SUPABASE|RESEND|REPAIRDESK|CELLZTECH|REPAIR_|GOOGLE_APPS)/.test(k))delete process.env[k];globalThis.fetch=async(url,init={})=>{calls.push({url,init});throw Error('Network forbidden in unit test');};});
after(()=>{globalThis.Date=RealDate;globalThis.fetch=originalFetch;console.error=originalError;for(const k of Object.keys(process.env))if(!(k in oldEnv))delete process.env[k];Object.assign(process.env,oldEnv);});
test('calendar uses Chicago rather than UTC or visitor timezone',()=>assert.deepEqual(chicagoNow(RealDate.parse('2026-11-03T02:00Z')),{date:'2026-11-02',minutes:1200}));
test('Chicago clock accounts for daylight saving transition',()=>{assert.equal(chicagoNow(RealDate.parse('2026-10-31T16:00Z')).minutes,660);assert.equal(chicagoNow(RealDate.parse('2026-11-02T16:00Z')).minutes,600);});
for(const date of ['2026-02-30','2026-13-01','2026-11-31','11/02/2026','not-a-date','2026-1-01'])test('rejects invalid calendar date '+date,()=>assert.equal(parseCalendarDate(date),null));
test('valid leap date accepted',()=>assert(parseCalendarDate('2028-02-29')));
test('past dates have no slots',()=>assert.deepEqual(bookingSlots('2026-10-31',NOW),[]));
test('Sundays have no slots',()=>assert.deepEqual(bookingSlots('2026-11-08',NOW),[]));
test('weekday closes at 7 PM and Saturday at 3 PM',()=>{assert.equal(bookingSlots('2026-11-03',NOW).at(-1).value,'18:30');assert.equal(bookingSlots('2026-11-07',NOW).at(-1).value,'14:30');});
test('same-day options require thirty minutes notice',()=>{const slots=bookingSlots('2026-11-02',RealDate.parse('2026-11-02T17:01Z'));assert.equal(slots[0].value,'12:00');});
test('exactly thirty minutes notice is allowed',()=>assert.equal(bookingSlots('2026-11-02',RealDate.parse('2026-11-02T17:00Z'))[0].value,'11:30'));
test('after hours offers no same-day slots',()=>assert.deepEqual(bookingSlots('2026-11-02',RealDate.parse('2026-11-03T01:00Z')),[]));
test('booking horizon is 60 Chicago calendar days',()=>{assert.equal(lastBookingDate(NOW),'2027-01-01');assert.deepEqual(bookingSlots('2027-01-02',NOW),[]);});
test('time label is a 30 minute drop-off window',()=>assert.equal(windowLabel('18:30'),'6:30 PM - 7:00 PM'));
for(const phone of ['123','abc7735550123','+1 (773) 555-0123 ext 1','999999999999999999'])test('rejects invalid phone '+phone,()=>assert.equal(validPhone(phone),false));
test('formatted US phone accepted',()=>assert.equal(validPhone('+1 (773) 555-0123'),true));
for(const email of ['bad','x@x','<script>@example.com','a b@example.com'])test('rejects invalid email '+email,()=>assert.equal(validEmail(email),false));
test('valid request validates',()=>assert.equal(validateRepairRequest(body(),NOW),null));
test('unsolicited label cannot change authoritative time',async()=>{process.env.SUPABASE_URL='https://unit.invalid';process.env.SUPABASE_SERVICE_ROLE_KEY='test-only';globalThis.fetch=async(url,init)=>{calls.push({url,init});return response([{id:1}]);};const r=await invoke({...body(),requestedTimeLabel:'12 midnight'});assert.equal(r.statusCode,200);const record=JSON.parse(calls.find(x=>x.url.includes('website_repair_requests')).init.body);assert.equal(record.requested_time,'11:00 AM - 11:30 AM');assert(!JSON.stringify(record).includes('12 midnight'));});
test('API rejects wrong method before integrations',async()=>{const r=await invoke({},'GET');assert.equal(r.statusCode,405);assert.equal(calls.length,0);});
for(const bad of ['{bad','x'.repeat(13000),null,[]])test('API safely rejects invalid body '+String(bad).slice(0,8),async()=>{assert.equal((await invoke(bad)).statusCode,400);assert.equal(calls.length,0);});
for(const update of [{requestedDate:'2026-11-01'},{requestedTime:'23:00'},{requestedTime:'11:15'},{requestedDate:'2026-11-08'},{requestedDate:'2027-04-01'},{email:'nope'},{phone:'1'},{website:'bot.test'},{notes:'x'.repeat(3001)}])test('API rejects bad input '+JSON.stringify(update).slice(0,70),async()=>{assert.equal((await invoke({...body(),...update})).statusCode,400);assert.equal(calls.length,0);});
test('no receiving integration does not claim success',async()=>{const r=await invoke();assert.equal(r.statusCode,503);assert.equal(r.body.ok,false);assert(!('integrations' in r.body));});
test('successful backup is retained when notification fails',async()=>{process.env.SUPABASE_URL='https://unit.invalid';process.env.SUPABASE_SERVICE_ROLE_KEY='test-only';process.env.REPAIR_CALENDAR_WEBHOOK_URL='https://calendar.invalid';globalThis.fetch=async(url,init)=>{calls.push({url,init});return String(url).includes('unit.invalid')?response([{id:1}]):response({error:'DO_NOT_EXPOSE'},500);};const r=await invoke();assert.equal(r.statusCode,200);assert.equal(r.body.backupSaved,true);assert.equal(r.body.calendarSent,false);assert(!JSON.stringify(r.body).includes('DO_NOT_EXPOSE'));});
test('calendar receipt survives failure of email provider',async()=>{process.env.REPAIR_CALENDAR_WEBHOOK_URL='https://calendar.invalid';process.env.RESEND_API_KEY='test-only';process.env.CELLZTECH_NOTIFY_EMAIL='shop@example.com';globalThis.fetch=async(url,init)=>{calls.push({url,init});return String(url).includes('calendar.invalid')?response({ok:true}):response({error:'fail'},500);};const r=await invoke();assert.equal(r.statusCode,200);assert.equal(r.body.calendarSent,true);assert.equal(r.body.emailSent,false);});
test('shop receipt survives failed customer email',async()=>{process.env.RESEND_API_KEY='test-only';process.env.CELLZTECH_NOTIFY_EMAIL='shop@example.com';globalThis.fetch=async(url,init)=>{calls.push({url,init});const to=JSON.parse(init.body).to;return to.includes('shop@example.com')?response({id:'received'}):response({error:'fail'},500);};const r=await invoke();assert.equal(r.statusCode,200);assert.equal(r.body.emailSent,true);assert(r.body.warnings.length);});
