import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const campaign=JSON.parse(read('shared/campaign.json'));
test('holiday activation and renewal deadlines are distinct Chicago dates',()=>{assert.equal(campaign.ultraActivationEnd,'2027-01-01T00:00:00-06:00');assert.equal(campaign.ultraRenewalEnd,'2027-02-01T00:00:00-06:00');});
test('coupon server JSON is traced into the Vercel function',()=>assert(JSON.parse(read('vercel.json')).functions['api/promo.js'].includeFiles.includes('shared/*.json')));
test('November SQL preserves existing rows and keeps privileged access restricted',()=>{const sql=read('supabase/november_coupon.sql');assert(!/truncate|drop table|delete from public.website_promo_subscribers/i.test(sql));assert(sql.includes('enable row level security'));assert(sql.includes('from public,anon,authenticated'));assert(!/security definer/i.test(sql));assert(sql.includes('2026-11-v1'));assert(sql.includes('2026-12-01 00:00:00 America/Chicago'));});
test('new signup explicitly records its November campaign on pre-existing tables',()=>{const sql=read('supabase/november_coupon.sql');assert(sql.includes('last_email_attempt_at,campaign_id,coupon_terms_version,source,marketing_opt_in)'));assert(sql.includes("'repair-email-2026-11','2026-11-v1'"));});
test('canonical image and social image files exist',()=>{assert(fs.existsSync(new URL('../public/november/og-cellztech-november.png',import.meta.url)));for(const f of ['holiday','25gb','family'])assert(fs.existsSync(new URL('../public/november/'+f+'.webp',import.meta.url)));});
test('legacy entrypoints forward to current components',()=>{assert(read('src/OctoberPages.tsx').includes('HomePage as OctoberHome'));assert(read('src/SeptemberCoupon.tsx').includes('RepairCoupon as SeptemberCoupon'));});
test('server-rendered page graph has no direct stylesheet import in coupon component',()=>assert(!/import ['"].*\.css/.test(read('src/RepairCoupon.tsx'))));
test('customer copy clearly excludes retail and wireless purchases',()=>{const c=JSON.parse(read('shared/coupon-copy.json'));for(const lang of ['en','pl','es','uk'])assert(c[lang].scope.includes('Ultra Mobile'));assert(c.en.scope.includes('accessories'));});

test('Vercel runs tests before the production build',()=>assert.equal(JSON.parse(read('vercel.json')).buildCommand,'npm test && npm run build'));

// Option C presentation regressions: no pricing, database or integration changes.
test('browser favicon is versioned and includes SVG plus ICO fallback',()=>{
 const html=read('index.html');assert(html.includes('/favicon.ico?v=nov26c'));assert(html.includes('/brand/cellztech-ct-logo.svg?v=nov26c'));assert(html.includes('sizes="any"'));
 const ico=fs.readFileSync(new URL('../public/favicon.ico',import.meta.url));assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);
});
test('CT favicon uses full-size vector geometry without a font dependency',()=>{
 const svg=read('public/brand/cellztech-ct-logo.svg');assert(svg.includes('viewBox="0 0 64 64"'));assert(svg.includes('width="64" height="64"'));assert(!svg.includes('<text'));assert(svg.includes('stroke="#fff"'));
});
test('Ultra hero no longer combines a pale background with white text',()=>{
 const css=read('src/november-polish.css');assert(!css.includes('.nov-modern .oct-ultra-hero{background:#f8f7fa}'));assert(css.includes('background: #10263d; color: #fff;'));assert(css.includes('.nov-modern .nov-ultra-copy .oct-lede { color: #e0e9f4;'));assert(css.includes('.nov-modern .nov-ultra-copy h1 span { color: #f4cf8b;'));
});
test('seasonal illustrations are decorative, non-interactive and pumpkin-free',()=>{
 const jsx=read('src/SeasonDetails.tsx');assert(jsx.includes('aria-hidden="true"'));assert(!jsx.includes('Pumpkin'));assert(read('src/november-polish.css').includes('pointer-events: none;'));
});
test('coupon support has a real phone link and an independent booking path',()=>{
 const jsx=read('src/RepairCoupon.tsx');assert(jsx.includes('href="tel:7734137489"'));assert(jsx.includes('/book-repair?source=coupon-help'));assert(jsx.includes('className="couponSupportRetry"'));
});
test('unready coupon cannot submit and a 503 does not manufacture a code',()=>{
 const jsx=read('src/RepairCoupon.tsx');assert(jsx.includes('if (ready !== true) { setError(t.unavailable); return; }'));assert(jsx.includes('else if (response.status === 503)'));assert(jsx.includes('setReady(false)'));assert(!jsx.includes("code: 'NOV10-"));
});
test('coupon recovery text exists in every supported language',()=>{
 const copy=JSON.parse(read('shared/coupon-copy.json'));for(const lang of ['en','pl','es','uk'])for(const key of ['unavailableTitle','unavailable','bookingFallback','retry'])assert(copy[lang][key]?.trim());
});
test('coupon details are available even when online signup is not ready',()=>{
 const jsx=read('src/RepairCoupon.tsx');assert(jsx.includes('<details className="couponInlineTerms">'));assert(jsx.includes('<p>{t.terms}</p>'));
});
test('automatic invitation still requires a ready backend and does not interrupt booking',()=>{
 const jsx=read('src/RepairCoupon.tsx');assert(jsx.includes('useRepairOffer(!compact && ready === true && active && !result && !open)'));
});
