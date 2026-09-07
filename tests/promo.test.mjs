// Local contract tests only. No network calls, real emails, or live database writes.
// Run with Node 22+: node --test tests/promo.test.mjs
import { test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/promo.js';
import * as core from '../lib/promo-core.js';

const RealDate = Date;
const NOW = RealDate.parse('2026-09-15T12:00:00Z');
globalThis.Date = class extends RealDate { constructor(...args) { super(...(args.length ? args : [NOW])); } static now() { return NOW; } };
const originalFetch = globalThis.fetch;
const oldEnv = { ...process.env };
const ADMIN = 'unit-test-only-not-a-real-secret';
const ID = '11111111-1111-4111-8111-111111111111';
const NONCE = '22222222-2222-4222-8222-222222222222';
const REQUEST = '33333333-3333-4333-8333-333333333333';
const CODE = 'BTS10-ABCDEF123456';
let calls, emailCalls, dbFailure, mailFailure, rateAllowed, rpcResult, rows, preferenceResult, redeemedResult;
function record(overrides = {}) { return { id: ID, email: 'owner@example.com', language: 'en', coupon_code: CODE, status: 'pending', consent_nonce: NONCE, created_at: new Date().toISOString(), last_email_attempt_at: new Date().toISOString(), email_status: 'not_sent', ...overrides }; }
function response(body, status = 200) { return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }); }
function request(action, { method = 'GET', body, headers, query } = {}) { return { method, body, headers: { origin: 'https://cellztech.com', ...(headers || {}) }, query: { action, ...(query || {}) }, socket: { remoteAddress: '192.0.2.1' } }; }
async function invoke(req) {
  const res = { statusCode: 200, headers: {}, body: null, setHeader(k,v) { this.headers[k.toLowerCase()] = v; }, status(n) { this.statusCode=n; return this; }, json(x) { this.body=x; return this; }, send(x) { this.body=x; return this; } };
  await handler(req,res); return res;
}
function signup(overrides = {}, options = {}) { return request('signup', { method: 'POST', body: { email: 'owner@example.com', language: 'en', consent: true, consentVersion: core.VERSION, requestId: REQUEST, website: '', ...overrides }, ...options }); }
function admin(action, options={}) { return request(action, { ...options, headers: { 'x-cellztech-admin-key': ADMIN, ...(options.headers || {}) } }); }
beforeEach(() => {
  process.env.SUPABASE_URL='https://unit-test.invalid';
  process.env.SUPABASE_SERVICE_ROLE_KEY='test-database-key';
  process.env.CELLZTECH_ADMIN_KEY=ADMIN;
  process.env.RESEND_API_KEY='test-email-key';
  process.env.CELLZTECH_FROM_EMAIL='CellzTech <offers@example.com>';
  delete process.env.CELLZTECH_PROMO_SIGNING_KEY;
  delete process.env.VERCEL_URL;
  delete process.env.VERCEL_ENV;
  delete process.env.VERCEL_BRANCH_URL;
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  calls=[];emailCalls=[];dbFailure=false;mailFailure=false;rateAllowed=true;
  rpcResult={record:record(),isNew:true,isReplay:false,shouldSend:true};rows=[];preferenceResult=true;redeemedResult=true;
  globalThis.fetch=async (url, init={}) => {
    const parsed=new URL(url); const body=init.body ? JSON.parse(init.body) : undefined;
    if(parsed.hostname==='api.resend.com') { emailCalls.push({url,init,body}); return mailFailure ? response({message:'testing restriction'},403) : response({id:'test-email-id'}); }
    assert.equal(parsed.hostname,'unit-test.invalid','No unexpected external requests');
    calls.push({url,init,body});
    if(dbFailure) return response({message:'DO_NOT_EXPOSE_owner@example.com'},503);
    if(parsed.pathname.endsWith('/rpc/cellztech_promo_ready')) return response({ready:true,schemaVersion:core.VERSION});
    if(parsed.pathname.endsWith('/rpc/cellztech_promo_rate_limit')) return response(rateAllowed);
    if(parsed.pathname.endsWith('/rpc/cellztech_promo_signup')) return response(rpcResult);
    if(parsed.pathname.endsWith('/rpc/cellztech_promo_preference')) return response(preferenceResult);
    if(parsed.pathname.endsWith('/rpc/cellztech_promo_redeem')) return response(redeemedResult);
    if(init.method==='PATCH') return response('');
    return response(rows);
  };
});
after(() => { globalThis.fetch=originalFetch; globalThis.Date=RealDate; for(const key of Object.keys(process.env)) if(!(key in oldEnv)) delete process.env[key]; Object.assign(process.env,oldEnv); });

test('campaign uses September boundaries in Chicago, including entire Sept 30',()=>{
  assert.equal(core.activeCampaign(RealDate.parse('2026-09-01T04:59:59Z')),false);
  assert.equal(core.activeCampaign(RealDate.parse('2026-09-01T05:00:00Z')),true);
  assert.equal(core.activeCampaign(RealDate.parse('2026-10-01T04:59:59Z')),true);
  assert.equal(core.activeCampaign(RealDate.parse('2026-10-01T05:00:00Z')),false);
});
test('all four public and email translations have identical complete keys',()=>{ const keys=Object.keys(core.copy.en).sort();for(const lang of ['en','pl','es','uk']) {assert.deepEqual(Object.keys(core.copy[lang]).sort(),keys);for(const s of Object.values(core.copy[lang])) assert.equal(typeof s,'string');} });
test('ready status tests the new schema without revealing configuration',async()=>{const r=await invoke(request('status'));assert.deepEqual(r.body,{ok:true,ready:true,active:true});assert(!JSON.stringify(r.body).includes('key'));});
test('missing migration leaves coupon unavailable without throwing',async()=>{dbFailure=true;const r=await invoke(request('status'));assert.equal(r.statusCode,200);assert.equal(r.body.ready,false);});
test('missing server variables leaves coupon unavailable',async()=>{delete process.env.SUPABASE_URL;const r=await invoke(request('status'));assert.equal(r.body.ready,false);assert.equal(calls.length,0);});
test('unknown action is 404',async()=>{assert.equal((await invoke(request('unknown'))).statusCode,404);});
test('signup cannot be triggered with a GET',async()=>{const r=await invoke(request('signup'));assert.equal(r.statusCode,405);assert.equal(r.headers.allow,'POST');assert.equal(calls.length,0);});
test('untrusted browser origin is denied before accessing data',async()=>{const r=await invoke(signup({}, {headers:{origin:'https://example.net'}}));assert.equal(r.statusCode,403);assert.equal(calls.length,0);});
test('www origin is supported',async()=>{assert.equal((await invoke(signup({}, {headers:{origin:'https://www.cellztech.com'}}))).statusCode,200);});
test('only the configured Vercel preview hostname is supported',()=>{process.env.VERCEL_URL='cellztech-preview.vercel.app';assert(core.safeOrigin({headers:{origin:'https://cellztech-preview.vercel.app'}}));assert(!core.safeOrigin({headers:{origin:'https://attacker.vercel.app'}}));});
for(const [label,override] of [ ['empty email',{email:''}],['bad email',{email:'bad'}],['HTML in email',{email:'<x>@example.com'}],['too long email',{email:'x'.repeat(255)+'@example.com'}],['unchecked consent',{consent:false}],['string consent',{consent:'true'}],['missing consent version',{consentVersion:''}],['unsupported language',{language:'de'}],['bad request ID',{requestId:'bad'}],['bot honeypot',{website:'https://bot.invalid'}] ]) test(`signup rejects ${label}`,async()=>{const r=await invoke(signup(override));assert.equal(r.statusCode,400);assert.equal(calls.length,0);assert.equal(emailCalls.length,0);});
test('malformed JSON is safely rejected',async()=>{assert.equal((await invoke(signup({}, {body:'{bad'}))).statusCode,400);});
test('oversized JSON is safely rejected',async()=>{assert.equal((await invoke(signup({other:'x'.repeat(9000)}))).statusCode,400);});
test('rate limit returns 429 without saving or sending email',async()=>{rateAllowed=false;const r=await invoke(signup());assert.equal(r.statusCode,429);assert.equal(r.headers['retry-after'],'3600');assert(!calls.some(x=>x.url.endsWith('cellztech_promo_signup')));assert.equal(emailCalls.length,0);});
test('rate-limit keys do not store raw IP or email',async()=>{await invoke(signup());const limits=calls.filter(x=>x.url.endsWith('cellztech_promo_rate_limit'));assert.equal(limits.length,3);for(const call of limits) {assert(!JSON.stringify(call.body).includes('owner@example.com'));assert(!JSON.stringify(call.body).includes('192.0.2.1'));assert.match(call.body.p_key,/:[a-f0-9]{64}$/);} });
test('email is normalized, consent is recorded, database save precedes mail',async()=>{const r=await invoke(signup({email:'  Owner@Example.COM '}));assert.equal(r.statusCode,200);const saved=calls.find(x=>x.url.endsWith('cellztech_promo_signup'));assert.equal(saved.body.p_email,'owner@example.com');assert.equal(saved.body.p_consent_text,core.copy.en.consent);assert.equal(saved.body.p_request_id,REQUEST);assert.equal(r.body.code,CODE);assert.equal(r.body.emailStatus,'accepted');assert.equal(emailCalls.length,1);});
test('database failure never returns a coupon or sends email',async()=>{dbFailure=true;const r=await invoke(signup());assert.equal(r.statusCode,503);assert(!r.body.code);assert(!JSON.stringify(r.body).includes('owner@example.com'));assert.equal(emailCalls.length,0);});
test('invalid database save response is not accepted',async()=>{rpcResult={record:{id:ID,coupon_code:'invalid'}};const r=await invoke(signup());assert.equal(r.statusCode,503);assert.equal(emailCalls.length,0);});
test('email provider rejection preserves the saved coupon',async()=>{mailFailure=true;const r=await invoke(signup());assert.equal(r.statusCode,200);assert.equal(r.body.code,CODE);assert.equal(r.body.emailStatus,'failed');});
test('missing mail settings preserves coupon and marks email unconfigured',async()=>{delete process.env.RESEND_API_KEY;const r=await invoke(signup());assert.equal(r.body.code,CODE);assert.equal(r.body.emailStatus,'not_configured');assert.equal(emailCalls.length,0);});
test('same-request retry returns existing coupon without another message',async()=>{rpcResult={record:record({email_status:'accepted'}),isNew:false,isReplay:true,shouldSend:false};const r=await invoke(signup());assert.equal(r.body.code,CODE);assert.equal(emailCalls.length,0);});
test('a different request cannot read an existing email coupon',async()=>{rpcResult={record:record({email_status:'accepted'}),isNew:false,isReplay:false,shouldSend:false};const r=await invoke(signup());assert.equal(r.body.ok,true);assert.equal(r.body.code,undefined);assert.equal(emailCalls.length,0);assert(!JSON.stringify(r.body).includes('owner@example.com'));});
for(const lang of ['en','pl','es','uk']) test(`${lang} confirmation email uses matching language, terms and opt-out`,async()=>{rpcResult.record.language=lang;await invoke(signup({language:lang}));const msg=emailCalls[0].body;assert.equal(msg.subject,core.copy[lang].emailSubject);assert(msg.html.includes(`lang="${lang}"`));assert(msg.text.includes(core.copy[lang].terms));assert(msg.text.includes('3412 N Harlem'));assert(msg.headers['List-Unsubscribe'].includes('action=unsubscribe'));assert.equal(msg.headers['List-Unsubscribe-Post'],'List-Unsubscribe=One-Click');assert(msg.html.includes('action=confirm'));assert(!msg.html.includes(ADMIN));assert(msg.text.includes(CODE));});
test('signed tokens contain no email or coupon details',()=>{const token=core.makeToken(record(),'confirm');const data=Buffer.from(token.split('.')[0],'base64url').toString();assert(!data.includes('owner@'));assert(!data.includes(CODE));assert.equal(core.readToken(token,'confirm').nonce,NONCE);});
test('tokens are purpose-bound and reject tampering',()=>{const token=core.makeToken(record(),'confirm');assert.equal(core.readToken(token,'unsubscribe'),null);assert.equal(core.readToken(token+'x','confirm'),null);assert.equal(core.readToken('invalid','confirm'),null);assert.equal(core.readToken(token+'.extra','confirm'),null);});
test('confirmation expires in seven days but opt-out does not expire',()=>{const confirm=core.makeToken(record(),'confirm');assert.equal(core.readToken(confirm,'confirm',NOW+7*86400000),null);const unsub=core.makeToken(record(),'unsubscribe');assert(core.readToken(unsub,'unsubscribe',NOW+365*86400000));});
for(const action of ['confirm','unsubscribe']) test(`${action} GET is safe against email-link scanners`,async()=>{const token=core.makeToken(record({language:'pl'}),action);const r=await invoke(request(action,{query:{token}}));assert.equal(r.statusCode,200);assert.equal(calls.length,0);assert(r.body.includes('<html lang="pl">'));assert(r.body.includes('method="post"'));assert(r.body.includes('lang=pl'));});
for(const action of ['confirm','unsubscribe']) test(`${action} POST updates preference with a valid signed token`,async()=>{const token=core.makeToken(record({language:'es'}),action);const r=await invoke(request(action,{method:'POST',body:{token}}));assert.equal(r.statusCode,200);assert(r.body.includes('<html lang="es">'));const call=calls.find(x=>x.url.endsWith('cellztech_promo_preference'));assert.equal(call.body.p_id,ID);assert.equal(call.body.p_action,action);assert.equal(call.body.p_nonce,action==='confirm'?NONCE:null);});
test('one-click unsubscribe form body with token in URL is supported',async()=>{const token=core.makeToken(record(),'unsubscribe');const r=await invoke(request('unsubscribe',{method:'POST',body:'List-Unsubscribe=One-Click',headers:{'content-type':'application/x-www-form-urlencoded'},query:{token}}));assert.equal(r.statusCode,200);});
test('revoked consent nonce cannot confirm',async()=>{preferenceResult=false;const r=await invoke(request('confirm',{method:'POST',body:{token:core.makeToken(record(),'confirm')}}));assert.equal(r.statusCode,400);});
test('preference error retains token language and avoids success message',async()=>{dbFailure=true;const r=await invoke(request('confirm',{method:'POST',body:{token:core.makeToken(record({language:'uk'}),'confirm')}}));assert.equal(r.statusCode,503);assert(r.body.includes('<html lang="uk">'));assert(r.body.includes(core.copy.uk.serviceErrorTitle));});
for(const action of ['admin','export','redeem']) test(`${action} requires existing admin authentication`,async()=>{const r=await invoke(request(action,{method:action==='redeem'?'POST':'GET'}));assert.equal(r.statusCode,401);assert.equal(calls.length,0);});
test('admin list is capped and selects no tokens or signing data',async()=>{rows=Array.from({length:101},(_,i)=>({id:i}));const r=await invoke(admin('admin'));assert.equal(r.body.records.length,100);assert.equal(r.body.hasMore,true);const params=new URL(calls[0].url).searchParams;assert.equal(params.get('limit'),'101');assert(!params.get('select').includes('nonce'));assert(!params.get('select').includes('request_id'));});
test('negative list offset is clamped',async()=>{await invoke(admin('admin',{query:{offset:-10}}));assert.equal(new URL(calls[0].url).searchParams.get('offset'),'0');});
test('export filters ONLY confirmed subscribers and includes opt-out URLs',async()=>{rows=[record({status:'subscribed',confirmed_at:new Date().toISOString()})];const r=await invoke(admin('export'));assert.equal(r.statusCode,200);assert.equal(new URL(calls[0].url).searchParams.get('status'),'eq.subscribed');assert(r.body.includes('owner@example.com'));assert(r.body.includes('unsubscribe_url'));assert(r.body.includes('action=unsubscribe'));assert(!r.body.includes(NONCE));assert(r.headers['content-type'].includes('text/csv'));});
test('CSV export guards spreadsheet formula injection',async()=>{rows=[record({email:'=formula@example.com'})];const r=await invoke(admin('export'));assert(r.body.includes('"\'=formula@example.com"'));});
test('coupon redemption is authenticated and passes only record ID',async()=>{const r=await invoke(admin('redeem',{method:'POST',body:{id:ID}}));assert.equal(r.statusCode,200);assert.deepEqual(calls[0].body,{p_id:ID});});
test('already-used coupon cannot be redeemed twice',async()=>{redeemedResult=false;assert.equal((await invoke(admin('redeem',{method:'POST',body:{id:ID}}))).statusCode,409);});
test('bad redemption ID never reaches database',async()=>{assert.equal((await invoke(admin('redeem',{method:'POST',body:{id:'not-id'}}))).statusCode,400);assert.equal(calls.length,0);});
test('API output is private, uncached and not indexable',async()=>{const r=await invoke(request('status'));assert(r.headers['cache-control'].includes('no-store'));assert.equal(r.headers['x-robots-tag'],'noindex, nofollow');assert.equal(r.headers['referrer-policy'],'no-referrer');assert(r.headers['content-security-policy'].includes("frame-ancestors 'none'"));});
test('HTML escaping prevents reflected markup',()=>{const r=core.pageHtml('en','<script>alert(1)</script>','"><img src=x>');assert(!r.includes('<script>'));assert(r.includes('&lt;script&gt;'));assert(!r.includes('<img src=x>'));});

test('prototype-like action names are rejected as unknown',async()=>{for(const action of ['__proto__','constructor','toString'])assert.equal((await invoke(request(action))).statusCode,404);assert.equal(calls.length,0);});
test('non-string language is rejected, not coerced',async()=>{const r=await invoke(signup({language:{toString:'not a function'}}));assert.equal(r.statusCode,400);assert.equal(calls.length,0);});
test('non-string request ID is rejected, not coerced',async()=>{const r=await invoke(signup({requestId:{toString:'not a function'}}));assert.equal(r.statusCode,400);assert.equal(calls.length,0);});

test('preview emails target the trusted preview endpoint',()=>{process.env.VERCEL_ENV='preview';process.env.VERCEL_URL='cellztech-preview.vercel.app';assert(core.preferenceUrl(record(),'confirm').startsWith('https://cellztech-preview.vercel.app/api/promo?'));});
test('production and untrusted preview origins use CellzTech',()=>{process.env.VERCEL_ENV='production';process.env.VERCEL_URL='cellztech-preview.vercel.app';assert.equal(core.publicOrigin(),core.ORIGIN);process.env.VERCEL_ENV='preview';process.env.VERCEL_URL='attacker.invalid';assert.equal(core.publicOrigin(),core.ORIGIN);});
