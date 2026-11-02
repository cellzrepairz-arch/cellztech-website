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
