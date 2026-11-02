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
