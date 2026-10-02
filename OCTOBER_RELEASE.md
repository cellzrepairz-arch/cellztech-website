# CellzTech October 2026 release

## Status: preview deployment required

This is a complete source package built from `cellztech-website-main (2)(1).zip`, not a deployed website. Keep the current working production deployment until the preview build and live integration checks pass.

Local page, interaction, pricing, language, API and preservation checks passed. The complete production build is **not verified**: this environment could not resolve/download packages from registry.npmjs.org (`EAI_AGAIN`). `npm ci` failed, leaving dependencies unavailable; `npm run build` consequently failed on missing dependency/type files. This is not a claim that the Vercel build has passed.

No new dependencies were added and package.json/package-lock.json are unchanged. The normal build command remains `npm run build` (`tsc -b && vite build`). Do not replace it with the local QA preview runner; that runner is not included in this package.

## What changed

### Homepage

A new light, spacious landing page with the approved realistic iPhone media, repair-first Chicago heading, distinct repair and Ultra actions, an October promotion strip, three readable offer summaries, repair-service links, local store information and concise FAQs. The headline stays focused on phone repair and local wireless help rather than changing the site's identity every month.

### Ultra Mobile

A new page separates different types of offers instead of mixing monthly prices with prepaid totals:

- First-year 50% holiday promotion: five selectable plans, upfront totals, monthly equivalents and standard annual renewal prices.
- 25GB for life: four prepaid durations with conditional ongoing pricing, not another 50% discount.
- Four lines for $100: a 1-4 line cost selector and eligibility for a new fourth line.
- Qualifying 2025 Holiday customers: separate restricted 12-month renewal offer, not a promise that every existing customer gets 50% off.
- Go Roam World Pass: qualified travel information and an inquiry action. Exact destination, pass price, coverage and allowances are confirmed separately.
- Number-transfer checklist and readable terms.

English, Polish, Spanish and Ukrainian have complete new page and inquiry copy. The existing language key and saved preference are retained. English is the first-visit default. Brand names remain brand names. Official device/globe art is cropped so English text embedded in posters does not replace translated HTML.

### Ultra inquiry and API

The old six-month $150 promotion is not carried into new October inquiries. Current offer selections pass plan IDs/durations, and the form derives prices from shared constants. Family requests show four lines with a $100 total, not $100 multiplied by four. Physical-SIM pickup, shipping and eSIM help remain supported. No payment is taken online.

The SIM backend previously could return success when storage and email both threw errors. It now requires a successful storage destination or an accepted shop-notification email. If neither succeeds it returns a failure. If only email succeeds, the response says `saved: false`; the customer copy says the request was received, not that the database definitely saved it. This does not guarantee email inbox delivery.

The form prevents repeated submission while pending and after its success state. It does not implement a new server-wide idempotency service; a new browser session can still send another legitimate request.

### SEO and routing

- Readable Chicago repair and local wireless copy, with no fabricated reviews, ratings or certifications.
- Real header/footer links rather than navigation-only buttons.
- Unique titles and descriptions for 11 public routes.
- Non-www canonicals, matching sitemap and robots files.
- LocalBusiness, page, FAQ and eligible annual offer structured data. Annual totals, not monthly equivalents, are used as the offer prices.
- New 1200 x 630 social-sharing image and responsive phone assets.
- Build-time pre-rendering of the two new React pages using the same components as the interactive site; other public routes receive distinct metadata.
- Permanent redirects for `/contact-us`, `/book-your-repair` and `/activate-july`.
- Known-route rewrites replace the universal homepage fallback. A branded, four-language 404 file is included. Verify its HTTP status in the Vercel preview; local browser QA does not verify Vercel routing.
- Private admin/API noindex headers; new admin-page visits are excluded from customer analytics. Existing historic counts are not rewritten.

No ranking is guaranteed. Search Console and actual customers are the measures of success, not a made-up SEO score.

The Vercel **domain-level www/non-www redirect is not changed automatically**. Canonical tags and sitemap agree on https://cellztech.com. Check the existing project Domains settings before adding a redirect, to avoid a loop with an existing opposite redirect. This remains a deployment-level check.

## Promotions and source notes

The uploaded October retailer explainers were used to extract customer offer facts; the internal PDFs and retailer payout tables are not included in the public website.

| Plan | First 12 months, upfront | Monthly equivalent | Standard annual price | Restricted 2025 renewal offer |
|---|---:|---:|---:|---:|
| 8GB | $102 | $8.50 | $204 | $136 |
| 12GB | $120 | $10 | $240 | $160 |
| 24GB | $162 | $13.50 | $324 | $216 |
| Unlimited | $204 | $17 | $408 | $272 |
| Unlimited+ | $246 | $20.50 | $492 | $328 |

Taxes and fees are additional. The last column is not the standard renewal price for a new 2026 customer.

Holiday promotion: October 1-December 31, 2026; eligible new customers only; number/device 90-day restrictions; fund during the promotion; no 25GB and no combined offers; standard renewal afterward.

25GB: $29/1 month; $78/3 months; $138/6 months; $240/12 months. The duration must be chosen at activation. Staying eligible and active is required. The $29 single-month Auto-Renew discount is described separately in the eligibility details.

Family: $49 + $24 + $12 + $15 = $100. New fourth-line eligibility, active plan conditions and December 31 activation deadline apply.

2025 renewal: through January 31, 2027, only qualified customers receiving the renewal credit. Auto-Renew, 25GB and Add-A-Line exclusions are retained.

**Document inconsistency:** the Spanish FAQ on page 6 of the Holiday explainer retains dates from 2025/January 2026. The repeated document headers and English FAQ instead specify October 1-December 31, 2026. This build uses those repeated 2026 dates in all four languages. The family document also mixes original and extension start dates; the page advertises the shared December 31 deadline rather than inventing a new start date.

The separate September $25/month six-month offer ended September 30. It is not advertised as an October deal. The supplied October pack does not contain an updated fourth-month-free explainer, so that older offer is not mixed into the new annual/25GB pricing.

## September coupon handling

New September 10% coupon signup is no longer advertised on the October homepage. The existing campaign ended; it was not silently extended. Existing codes, email confirmation/unsubscribe handlers, consent history and admin redemption tools remain intact. The original `useState(false)` consent default was already unchecked; no unsupported checkbox change was made.

The admin coupon panel retains its historical September name because those records belong to that campaign. Do not run September SQL again. Do not delete coupon tables or change existing customer consent.

## Preserved areas

Byte-for-byte function comparisons confirm that LabelCreatorTool, LabelPreview, SmallDymoLabelPreview, AdminDashboard, RepairsPage, BookRepairPage, XfinityPrepaidPage and the booking-prefill/time helpers are unchanged. Existing repair/RepairDesk APIs, OAuth utilities, coupon API, coupon library/shared JSON, admin request API, existing tracking APIs and Supabase SQL files are unchanged. Phones, buyback and accessories content are not redesigned.

The global header/footer navigation and page metadata are shared improvements; the public page content and working repair form are retained. The only modified existing backend handler is `api/sim-request.js`.

## Deploy safely

1. In the existing GitHub repository, create a branch named `october-preview` from main.
2. Extract this ZIP. Open its `cellztech-website-main` folder and upload the **contents** into the root of that branch. Do not upload the ZIP itself or nest an additional project folder.
3. Include the new `src` files and `public/october` folder, plus index.html, vite.config.ts and vercel.json. Keep all existing api, lib, shared and supabase folders.
4. Let Vercel create a preview deployment. Use the existing project and configuration, not a new production project. Confirm the build is Ready. The build log should report two pre-rendered public pages and 11 metadata files after the Vite build.
5. Check both redesigned pages at desktop and phone widths in all four languages. Check price selections and the Ultra inquiry handoff. Confirm that the repair form, admin and Label Creator still open.
6. Verify sitemap.xml/robots.txt are files, legacy redirects reach their current routes, and an invented URL returns a real 404 rather than the homepage. Check that `/api/promo?action=status` returns JSON, not a function crash.
7. With an authorized test contact, submit one recognizable repair and one SIM request and confirm the actual RepairDesk/admin/shop-email outcome. Preview environments can use live Supabase/RepairDesk credentials; do not send fake requests casually.
8. Only after the preview build and checks pass, merge the preview branch into main and verify production again. Keep the previous deployment available for rollback.

**No new Supabase SQL, environment variables, DNS records, Resend setup or OAuth authorization is required by this update.** Existing credentials must still be present and valid. The `api/promo.js` includeFiles fix for shared/coupon-copy.json is preserved in vercel.json.

The ZIP intentionally excludes node_modules, dist, .git, logs, temporary QA tools and build caches. Old tracked dist files in GitHub should not be used as the deployment source; Vite rebuilds dist from the source.

## QA evidence and limitations

- 74 existing coupon API tests passed with mocked services.
- 10 new SIM handler tests passed with mocked services.
- 29 price, translation-shape, metadata and configuration checks passed.
- 48 page/language/viewport checks passed: 3 pages, 4 languages, widths 320, 390, 768 and 1440 pixels. Checked overflow, image loading, H1, language and canonical.
- 21 local browser interaction checks passed: plan/duration/family selectors, current-offer handoff, form submission/failure/retry, shipping validation, language storage and original repair entry.
- Nine protected functions and 15 protected files verified unchanged.
- Strict semantic TypeScript checks passed for the non-React pricing, copy, SEO and SIM-label modules; all 12 TypeScript/TSX source modules passed syntax transpilation.

Browser screenshots use the actual edited components in an in-memory preview with an available React runtime and simulated navigation/network responses. This was necessary because the managed browser blocks normal navigation here. It is **not** a substitute for the exact npm/Vite dependency build or live production tests. No live leads, emails, coupons or database rows were created during this work.
