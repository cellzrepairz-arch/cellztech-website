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
