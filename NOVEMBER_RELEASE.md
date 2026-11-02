# CellzTech November 2026 - single-upload packaging notes

## Current packaging scope

This package contains 99 files and uses the same November v2 application source
as CellzTech-November-v2-Website-Fresh.zip. Source files, API handlers, assets
retained in this archive, tests, dependency lockfile, build configuration, and
supabase/november_coupon.sql are byte-for-byte unchanged.

The archive has no extra top-level wrapper folder. Extract it, open the extracted
folder, then upload ALL files and folders inside it to the root of a review branch
in the existing repository. Do not upload the ZIP itself. See README.md.

The failed upload supplied in the conversation was missing src/SitePages.tsx and
src/site-seo.ts. Both files, and the other November folders, are in this archive.
A successful Vercel production build still needs to be confirmed. Packaging and
unit tests are not proof of live email delivery or database readiness.

Only documentation is rewritten here. Historical release notes, saved QA logs,
duplicate root robots/sitemap files (public copies remain), older setup SQL, and
five unreferenced older social-sharing images are not needed for this November
in-place update and were omitted to meet the browser upload limit. Keep any
existing copies in GitHub; do not delete the repository or customer data.

No remote GitHub, Vercel, or Supabase changes were made during repackaging. The
historical release/test text below describes the earlier preparation state, not
an independent current check of those services. The v2 readiness/schema rule,
separate marketing consent, controlled live tests, and release gates still apply.

## Historical release notes (from the v2 package)

# CellzTech - November 2026 Website Update

## Status - repair offer revision 2
The November source now contains the approved respectful repair offer. It is NOT live.
No GitHub branch/commit, Vercel deployment, real email, RepairDesk request, or database migration was created by this revision.

GitHub repository `cellzrepairz-arch/cellztech-website` and Vercel project `cellztech-website` were located. The connected Supabase accounts list only CellzTV. Access to the historical CellzTech project was denied, so no database was changed. The live CellzTech database target still needs verified authorized access. Do not run this setup in CellzTV.

177 Node tests and 73 offline browser checks pass. The normal dependency-resolved TypeScript/Vite build, actual SQL execution, and live email/booking delivery are still unverified. Package installation failed in this environment. See `NOVEMBER_TEST_RESULTS.md` for the precise scope. Do not promote to production until the build and live checks below succeed.

The earlier standalone design preview is a demonstration, not deployment source. Screenshots from this revision also use an offline harness with simulated API responses. Never deploy the test harness or treat a demonstrated coupon as issued.

## What changed
- Cleaner white/light-gray layout, blue actions, quieter typography, rounded cards and reduced visual clutter. CellzTech branding and the existing navigation remain.
- November copy and social-sharing image. Public holiday/25GB/family activation offers continue through December 31, 2026. Eligible 2025 holiday-customer renewals remain separately dated through January 31, 2027.
- Four-step repair request: device, issue, visit/contact details, review. Search across the selected brand; six initial model choices on mobile and twelve on desktop; an explicit unknown-device option.
- Preferred drop-off windows use America/Chicago, weekdays 11 AM-7 PM and Saturday 11 AM-3 PM. Sundays, past dates/times, off-grid times and dates over 60 days ahead are rejected. A 30-minute notice rule applies in both client and server. Staff still confirm availability; this is not a real-time appointment reservation or holiday-closure calendar.
- Review-and-edit screen, validation, duplicate-click guard, receipt screen, and clear call/text recovery when receipt cannot be confirmed. A customer record alone no longer counts as a received repair request. One failed notification does not erase success at another provider.
- 10% repair coupon: permanent homepage and repairs-page sections plus an 18-second passive invitation. Desktop gets a small white email card; mobile gets a compact tap-to-open invitation. No auto-opening modal, focus steal, or scroll lock. Dismissals last seven days on the same browser. Claiming stops automatic display. Automatic offers are restricted to home and repairs, not booking, Ultra, internet, phones or admin. A compact booking card remains a second opportunity and can prefill the entered email.
- Explicit exclusion of phone sales, accessories, Ultra Mobile, other wireless plans and internet services. Coupon issuance requires an email and a deliberate coupon request. The separate marketing checkbox is OPTIONAL and initially unchecked; marketing requires its own email confirmation. A normal repair request never enrolls someone in promotional emails. An unchecked box on a later coupon request does not silently change existing email preferences.
- November signup window is November 1-30, Chicago time. Issued coupons retain the existing one-use/no-expiration policy. One coupon record per email; existing unused September coupons remain valid, without granting that email a second coupon. Existing consent, opt-outs and redemption history are not deleted.
- Four-line selector bug fixed: choosing two lines carries two lines and $73 through the inquiry; the corresponding 1/3/4-line prices remain $49/$85/$100 before tax.
- New focused modules and shared campaign/calendar settings. Legacy filename entrypoints forward to the new modules to support in-place uploads.

## Files to use
- `CellzTech-November-2026-Repair-Offer-v2.zip`: complete updated SOURCE, not a compiled deployment.
- `supabase/november_coupon.sql`: required, additive November coupon setup in your EXISTING CellzTech database.
- `NOVEMBER_RELEASE.md`: this guide.
- `NOVEMBER_TEST_RESULTS.md`: exact test scope and limitations.
- `NOVEMBER_SOURCE_NOTES.md`: promotion-source details and an inconsistency identified in the supplied PDF.

The archive intentionally excludes node_modules, the outdated dist folder, credentials, temporary test harnesses and internal retailer PDFs. Old September/October release documents are historical only; this file takes precedence.

## Before publishing
1. Keep the current production deployment available as a rollback. Upload the extracted source contents to a review/non-production branch rather than directly to the production branch. The package root contains package.json, src, api, lib, shared, public, supabase and tests.
2. On a network-enabled development or deployment machine run:

```sh
npm ci
npm test
npm run build
```

The existing Vercel configuration now runs `npm test && npm run build`, so a failing unit test or build stops that deployment. No dependency versions were changed. Review the actual build log; the full TypeScript/Vite production build was not executable in this isolated environment because packages could not be installed.
3. Back up the existing coupon data, then run ONLY `supabase/november_coupon.sql` in the Supabase project used by CellzTech's server environment. Do not run the old September script or the general repair setup script over production. Do not use the separate CellzTV project.
4. The SQL preserves existing rows and RLS, adds no public write permissions, and replaces coupon RPC functions with the November-compatible version. Its final readiness query must show `ready: true` and `schemaVersion: 2026-11-v2`. The live coupon tables/functions were NOT queried or migrated here. Revision 2 adds `marketing_opt_in`, introduces `cellztech_promo_signup_v2`, and restricts marketing exports to confirmed opt-ins. Earlier explicit-consent records retain their subscription/redemption history. The old signup RPC is no longer granted to service_role, preventing older code from implying marketing consent. Coordinate this with the code release: older coupon diagnostics will report a schema-version mismatch after the SQL update.
5. Preserve the current server-side Supabase URL/service-role key, admin key and signing key. A changed signing key can invalidate old email links. Keep service-role and admin credentials out of browser variables and GitHub. For email delivery, the existing RESEND_API_KEY and verified CELLZTECH_FROM_EMAIL must work. Do not paste secrets into chat or the source.
6. Check the authenticated coupon diagnostics in the existing staff admin. Until its server/database check succeeds the UI shows retry/call help, not a fake coupon. Use email addresses you control for controlled signup tests. Check coupon-only delivery without any confirmation invitation, then a separately opted-in signup with confirmation and unsubscribe; verify a previously issued unused coupon is still listed and a redeemed one stays redeemed.
7. Submit one clearly labeled test repair request using your own details. Verify the actual RepairDesk/Supabase/notification destination and no duplicate lead. Test the four-step flow on a phone and check the requested Chicago-time window. Test a two-line Ultra inquiry and confirm quantity 2 and $73.
8. Promote the reviewed deployment only after the production build and those live checks succeed. No payment is collected by these forms. Redeeming a coupon in the staff console marks it used; apply the repair discount to the RepairDesk invoice separately.

## Next monthly update
- `shared/campaign.json`: shared campaign identifiers, cutoff timestamps and coupon consent version.
- `src/site-copy.ts`: public copy in English, Polish, Spanish and Ukrainian.
- `src/ultra-offers.ts`: one customer-price table and inquiry selection logic.
- `src/NovemberNotice.tsx`, `src/site-seo.ts`, `index.html`, sitemaps and the social-sharing image: current campaign presentation.
- `shared/coupon-copy.json` and a reviewed SQL setup: update signup dates/terms consistently. Do not simply change the frontend date; the API and database also enforce the offer.
- `shared/booking-rules.js`: booking-window policy shared by browser and server. Keep holiday closures/actual availability separate from advertised store hours.
- Update boundary tests when dates change; run the full test/build sequence again.

## Rollback note
The website can be rolled back to the previous deployment. Do not roll back customer data by deleting coupon tables. A return to older coupon code requires coordinating its schema-version expectation and the v2 RPC permission change; booking and customer records should remain intact.


## Consolidated source notes (NOVEMBER_SOURCE_NOTES.md)

# November offer source notes

Source of truth: the four retailer explainers and the November social-image ZIP supplied in this conversation, not older business memories. Internal retailer documents and compensation information are not copied into public/ or exposed by the frontend.

## Customer-facing terms retained
- Ultra Mobile Holiday Promo, 10/01/26-12/31/26, pages 1-3: new-customer eligible annual plans, 50% off; 8GB $102 ($8.50 equivalent/month), 12GB $120 ($10), 24GB $162 ($13.50), Unlimited $204 ($17), Unlimited+ $246 ($20.50). Upfront payment. Taxes/fees extra. The promotional 25GB plan is excluded. Number and device must meet the 90-day rules. Later renewals use standard pricing.
- Ultra 25GB extension explainer, pages 1-4: new-customer activations through 12/31/26, 1/3/6/12-month totals $29/$78/$138/$240. The 12-month total is NOT $204. Lifetime language is conditional on remaining active on the eligible plan. Duration is chosen at activation; do not promise free switching between promotional durations. The single-month Auto-Renew discount is separate.
- 4 for $100 extension, English pages 1-2: $49 + $24 + $12 + $15 = $100. New and eligible existing customers adding a NEW fourth line by 12/31/26; continued pricing requires staying active on the qualifying plan. One/two/three-line totals are $49/$73/$85. Tablets can be included. This is not an unconditional price guarantee for every current four-line account.
- Holiday renewal explainer, English pages 1-3: eligible 2025 holiday customers can receive 33% off/four months free on eligible renewals through 01/31/27. Renewal totals $136/$160/$216/$272/$328. Excludes promotional 25GB/Add-A-Line, and the first-page small print excludes Auto-Renew. Do not advertise this as an offer for every existing customer.

## Source discrepancy explicitly resolved
The Holiday Promo PDF's Spanish FAQ on page 6 contains an older 10/27/2025-1/31/2026 date range. Its current page headers, English overview and English FAQ consistently specify 10/1/2026-12/31/2026. The website follows that current 2026 range in every language; the inconsistent Spanish FAQ date was not silently copied.

## Existing copy not re-certified
The older site contained a specific 35GB congestion threshold in its network footnotes. These uploaded explainers do not substantiate that threshold, so the active November pages use general plan/network-policy disclosures instead of extending an unverified numeric claim. Store hours, phone inventory/catalog entries, repair warranty policy, Xfinity content and other unchanged business copy were retained from the supplied repository; they were not independently re-certified as part of this update.

## New store-owned offer
The 10% repair coupon is CellzTech's offer, not an Ultra promotion. Email required; repairs only; retail phones/accessories/wireless/internet excluded. November signup, one coupon per email/customer, one use, no combining, applied before tax. Existing no-expiration treatment and prior coupon/consent records are preserved. This policy should be reviewed by the owner before launch.


## Consolidated earlier test report (NOVEMBER_TEST_RESULTS.md)

# November repair offer revision 2 - verification report

Verified locally November 1, 2026 (America/Chicago).

| Check | Result | Scope |
| --- | --- | --- |
| Node unit/contract/source tests | 177 passed, 0 failed | Coupon API, optional marketing, email templates, authorization, privacy, rate limits, redemption, repair/inquiry validation, calendar/DST, campaign assets and presentation preferences |
| Offline browser assertions | 73 passed, 0 failed | Delayed desktop card, compact mobile invitation at 320/390px, home/repairs eligibility, booking second opportunity, seven-day dismissal, claimed visitor suppression, all four languages, dialog focus/Escape, required email, optional marketing, unavailable/error/retry states and layout |
| Active graph transpilation | 28 source/style/data modules, 0 reported syntax errors | Not a dependency-resolved type check |
| Modified JavaScript parse checks | Passed | api/promo.js, lib/promo-core.js, shared/coupon-presentation.js |
| Full TypeScript/Vite production build | NOT VERIFIED | npm ci could not complete in this environment; packages were not available |
| SQL execution / live RLS verification | NOT RUN | Connected Supabase accounts expose CellzTV, not verified CellzTech database access |
| Actual Resend email, RepairDesk, calendar delivery | NOT RUN | Tests use fabricated example.com addresses and mocked external responses |
| GitHub commit, preview or production deployment | NOT DONE | No remote source, deployment or customer data was changed |

## Browser harness limitations
The browser disallows URL navigation. Tests rendered the current source in memory with an existing React runtime and local SVG icon adapters from the prior preview. Navigation, storage and fetch were controlled test adapters. No browser network restriction was disabled. No real email, repair lead or coupon was created.

These checks verify the exercised component behavior and visible layout, not the Vite output, SSR execution, real network routing, database atomicity, or production integration. The shipping source uses its existing React/Lucide/Vite dependencies. No offline test harness or simulated runtime is included in the deployment source.

## Required release gates
1. Verify the actual CellzTech Supabase target and authorize access; never substitute CellzTV.
2. Apply the reviewed v2 coupon setup in that target with a data backup. Verify ready=true and schemaVersion=2026-11-v2; verify RLS and role permissions.
3. Run npm ci, npm test and npm run build on the exact source, with a successful Vercel build log.
4. In a controlled deployment, verify a requested coupon-only receipt, separate optional marketing confirmation/opt-out, and an actual test repair/inquiry receipt. Do not send test emails to customers.
5. Promote only after all gates pass and retain the prior production deployment for rollback.

## Evidence
- qa/repair-offer-unit-tests.log
- qa/repair-offer-browser-results.json
- qa/repair-offer-syntax-results.json

Older qa/november-* evidence belongs to the previous November revision and does not replace these checks.


## Files omitted from this upload package

These omissions change packaging only. Existing repository copies may remain.

- `BACKEND_SETUP.md`
- `GITHUB_UPLOAD_NOTE.txt`
- `NOVEMBER_FILE_MANIFEST.json`
- `NOVEMBER_SOURCE_NOTES.md`
- `NOVEMBER_TEST_RESULTS.md`
- `OCTOBER_FLAIR.md`
- `OCTOBER_FLAIR_QA.json`
- `OCTOBER_QA.json`
- `OCTOBER_RELEASE.md`
- `SEPTEMBER_CORRECTIONS.md`
- `SEPTEMBER_QA.md`
- `SEPTEMBER_SETUP.md`
- `public-placeholder.txt`
- `public/october/og-cellztech-october.png`
- `public/og-august-2026.png`
- `public/og-august-2026.webp`
- `public/og-september-2026.png`
- `public/og-september-2026.webp`
- `qa/november-api-tests.log`
- `qa/november-browser-results.json`
- `qa/november-syntax-results.json`
- `qa/repair-offer-browser-results.json`
- `qa/repair-offer-syntax-results.json`
- `qa/repair-offer-unit-tests.log`
- `robots.txt`
- `sitemap.xml`
- `supabase/september_coupon.sql`
- `supabase/website_repair_requests.sql`
