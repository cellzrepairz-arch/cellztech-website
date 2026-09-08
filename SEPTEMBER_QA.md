# September corrections validation

## Checks performed on this revision

- 74/74 Node API contract/security tests passed. Command: `node --test tests/promo.test.mjs`. All external database and email responses were simulated. No production writes or emails occurred.
- 21/21 in-memory React browser scenarios passed, with no JavaScript page errors. They cover the Ultra page's September text in English/Polish/Spanish/Ukrainian at 1440px and 390px, coupon submission/consent in those combinations, initial loading, manual recovery after setup, focus recovery, an email failure with a stored coupon, and private diagnostic recovery. The original Label Creator opened normally.
- 78/78 TypeScript syntax/source-preservation assertions passed. These are not a full dependency-backed TypeScript/Vite production build. `src/main.tsx` changed only in the Ultra promotional copy and two prefilled month labels. Existing functions, other public stylesheets, booking/RepairDesk/repair-backup APIs, package files, Vercel/Vite configuration, and sitemap/robots files match the first September ZIP.
- `api/promo.js` and `lib/promo-core.js` passed `node --check`.
- The coupon migration transaction is unchanged from the first September ZIP. Only a read-only final readiness SELECT was appended.
- Rendered desktop/mobile preview screenshots were inspected. The local preview substitutes a provided React runtime and icon definitions, omits blocked external font loads, renders source-transpiled React in memory, and simulates service responses. It is for UI checks, not deployment certification.

## Not verified

- The exact `npm ci` pipeline could not complete: the container cannot resolve/download from the npm registry, and the cache lacks required packages.
- `npm run build` stopped on missing type dependencies. No successful Vite production build is claimed.
- The SQL has not been run against the user's Supabase project or a local PostgreSQL server. Mock tests do not execute SQL bodies or prove live database permissions.
- Actual coupon storage, Resend delivery, confirmation/unsubscribe on the deployed site, and the production coupon API status are not verified.
- The supplied screenshots show an unavailable signup but do not establish its exact server-side cause.

## Deployment gate

Use a preview branch. Confirm Vercel's real build succeeds. Apply only the isolated coupon SQL to the existing CellzTech project if it is not already installed. Review the authenticated coupon diagnostic. Complete one test with the store owner's email before live promotion. Do not alter the working RepairDesk configuration to fix the coupon feature.
