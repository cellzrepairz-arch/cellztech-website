# September update validation

## Verified locally

- **62/62 Node API/security contract tests**, using mocked database and email responses. Run: `node --test tests/promo.test.mjs` (Node 22+).
- **30/30 browser scenarios** using the real React runtime and TypeScript-transpiled source rendered in memory, with network requests mocked. This checked all four languages at 390px and 1440px, language persistence, coupon save/failure cases, dismissal, keyboard focus, native dialog closing, admin coupon display, offer keyboard behavior, booking prefill/submission and protected-page comparisons.
- **167/167 static/source-preservation checks**, including a strict TypeScript check of the actual four-language homepage copy against its source types.
- All JavaScript API/helper syntax checks passed.
- New public coupon strings and email/preference screens are supplied in English, Polish, Spanish and Ukrainian.
- No horizontal overflow in the tested homepage/coupon layouts. Final previews were visually reviewed.

The browser environment did not permit URL navigation, so the browser tests loaded compiled source directly into an in-memory document rather than a Vite server. That is not a substitute for testing the deployed Vite build.

## Not verified here

- **`npm ci` could not complete:** the environment cannot reach the npm registry and its cache lacks required packages.
- **`npm run build` did not pass:** React/Vite packages and type declarations were unavailable because dependency installation could not finish. No production Vite bundle is represented as verified.
- The new SQL has not been executed on PostgreSQL/Supabase. SQL safety/structure was reviewed; mocked API tests do not execute SQL function bodies or establish live RLS behavior.
- Actual Resend inbox delivery, new coupon writes to the user's database, production email confirmation/opt-out, and live RepairDesk behavior were not tested. No customer records or production emails were created by this work.

## Existing-file change boundary

Only these existing files changed:

- `src/AugustHome.tsx`: September copy and offer conditions, coupon mount, keyboard offer selection.
- `src/main.tsx`: updated home component import, September home metadata and prefilled inquiry month wording, one collapsed coupon-admin section.
- `index.html`: September metadata/structured-data wording and social image paths.

New source files are isolated coupon components/styles, the `api/promo.js` endpoint, `lib/promo-core.js`, shared four-language copy, a new Supabase migration, two September social images, API tests and September documentation.

The original public stylesheets, realistic iPhone source media, Label Creator implementation, booking implementation, existing API files, package/lock files, Vite/Vercel settings, sitemap and robots files are unchanged. Stale committed `dist` output is intentionally excluded from the new source ZIP so Vercel must generate a fresh build.

## Existing security configuration outside this update

The historical repair setup SQL in the supplied repository contains statements that disable row-level security for some existing tables. This update does not execute or modify that historical script, and it does not establish the live settings of those tables. Do not rerun the old script for this coupon feature. The new coupon migration enables RLS and revokes anonymous/authenticated-browser access for its new tables. A separate authorized review would be needed to assess existing production-table permissions without disrupting the working backend.

## Release gate

Follow `SEPTEMBER_SETUP.md`: apply only the new migration, build a Vercel Preview from a separate branch, review it, and complete the controlled preview email-preference check before promotion. Until that happens, this is a prepared source update, not a verified live release.
