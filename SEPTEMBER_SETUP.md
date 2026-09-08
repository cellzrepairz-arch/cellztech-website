# CellzTech September 2026 update

**Correction revision:** start with `SEPTEMBER_CORRECTIONS.md` for the two issues reported after the first September package. The full setup below still applies.

**Start here. This update uses the GitHub ZIP supplied for the September build.**

The existing homepage styling and realistic iPhone media are retained. The landing-page copy, offer details and social-sharing image now say September. A separate coupon signup feature has been added. No changes have been deployed to your live accounts.

## Before publishing

The source and local browser/API checks are complete, but this environment could not download the npm dependencies. Consequently, the exact `npm ci` / `npm run build` production pipeline has NOT been verified here. The existing package files, lockfile, Vite configuration and Vercel configuration were not changed to work around that limitation.

Use a Vercel Preview deployment first. Confirm its production build succeeds and test one coupon before promoting the update to the live website. Do not overwrite a working production deployment merely because local mocked tests passed.

## 1. Add the coupon tables to the EXISTING Supabase project

Open the Supabase project used by CellzTech, choose **SQL Editor**, and create a new query. Paste the complete contents of:

`supabase/september_coupon.sql`

Click **Run**. The file is designed to be safe to run again. It creates only:

- `website_promo_subscribers`: email, selected language, consent, coupon and delivery state.
- `website_promo_consent_events`: signup/confirmation/opt-out/redemption history.
- `website_promo_rate_limits`: temporary, hashed abuse-prevention counters.

It also creates the related coupon functions and restricts these new tables/functions to the server service role. It does not alter repair requests, RepairDesk connection tokens, existing SIM requests or traffic data.

**Do NOT rerun `website_repair_requests.sql` or any older backend setup SQL for this update.** The old setup files remain in the repository for historical compatibility; they are not the instructions for this feature.

The new migration has been reviewed, but it has not been executed against your live database. Confirm Supabase reports success. Do not change old tables to resolve an error in this new migration.

If this migration is missing or the connection is unavailable, the coupon area shows a call/in-store fallback and does not pretend to save an email. Existing booking pages remain independent.

## 2. Check the existing Vercel settings

The coupon feature reuses the server-only variables already used by the site:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Existing CellzTech database |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only database access |
| `CELLZTECH_ADMIN_KEY` | Existing private admin login and default link-signing secret |
| `RESEND_API_KEY` | Send the requested coupon/confirmation email |
| `CELLZTECH_FROM_EMAIL` | Sender on a domain verified in your Resend account |

Do not put these values in GitHub, screenshots, client code or variables beginning with `VITE_`.

An optional **`CELLZTECH_PROMO_SIGNING_KEY`** can be a separate strong random secret. Set it before collecting signups and keep it stable. If omitted, the existing private admin key is used. Changing the signing key later invalidates previously emailed confirmation/unsubscribe links, although database coupon records remain intact.

Use Node.js 22 or 24 for the deployment. This feature uses the native Node.js runtime, not an Edge runtime. Only the new coupon API sets a 30-second execution limit; the existing Vercel project configuration is unchanged.

### Resend matters for email delivery

The previous site's Resend account had a testing restriction. This update does not remove a provider restriction.

In Resend, confirm the sending domain is verified and `CELLZTECH_FROM_EMAIL` uses that verified domain. A Gmail address is not a verified CellzTech sending domain. Keep your existing store-notification destination unchanged.

A saved coupon still appears on screen if email fails. The customer is told to save a screenshot and is NOT marked as a confirmed marketing subscriber. “Accepted” in admin means Resend accepted the email request; it does not prove inbox delivery.

Resend's official setup guide: https://resend.com/docs/add-a-domain

## 3. Upload to a preview branch, not straight to the live branch

1. Keep a copy of the currently working GitHub version.
2. In the existing repository, create a branch named `september-preview` from `main`.
3. Extract the new ZIP. Open its `cellztech-website-main` folder.
4. With `september-preview` selected in GitHub, upload **the contents** of that folder to the repository root. Do not upload the outer folder itself or the ZIP.
5. Commit the files and open the resulting Vercel Preview deployment. If automatic previews are disabled, create the preview through your existing Vercel project.
6. Check the deployment shows **Ready** after the unchanged build command, `tsc -b && vite build`.

New folders `lib`, `shared` and `tests` and the new files inside `src`, `api`, `public` and `supabase` must all be included. Uploading only `src/main.tsx` will not include the new feature.

No `node_modules`, `dist`, `.git`, credentials, local preview scripts or temporary build output are included in the ZIP.

## 4. One controlled check before live use

Use your own real email address for a coupon test. Do not use someone else's email or submit duplicate customer repair bookings.

Check the preview homepage in English, Polish, Spanish and Ukrainian. The selected language should remain selected when you navigate. Fresh visits should default to English.

Click the coupon banner, enter your email and tick the unchecked consent box. Submit once. Confirm a unique `BTS10-...` code appears, and that `/admin` -> **September repair coupons** shows the matching signup as **pending**.

If email is configured, confirm that the coupon/confirmation message arrives. Preview-deployment emails link to that preview's own endpoint, using Vercel's trusted deployment hostname. You may need to sign into Vercel to open a protected preview link. Use only your own email for preview testing. Production emails use the public `cellztech.com` domain.

Confirm the email link and check the preview admin changes to **subscribed**. Open its unsubscribe link and click the unsubscribe button; admin should show **unsubscribed**, and a new confirmed-email export should exclude that email. An unused coupon remains valid.

Finally, verify the existing repair booking, Xfinity, buyback, phones, accessories and Label Creator open normally. The new popup must never appear on those pages.

Only after the preview build is successful and these checks are satisfactory should September be used for customer promotion. If the Vercel build fails, retain the working live deployment and inspect the actual build error; do not repeatedly redeploy the same failed commit.

## Coupon experience and the rules included

The homepage contains a visible 10% coupon strip. A small dismissible invitation can appear after 18 seconds. It does not take focus or cover the whole page. The full signup dialog opens only after a click. X, Escape and clicking the backdrop close the dialog. Dismissal is remembered for seven days; claimed coupons do not keep prompting.

The included coupon terms are explicit:

**10% off the next repair price before tax; one use per customer; not combinable with another discount; not for phones, accessories or wireless service. Show the code before payment. Signup is offered during September 2026; an issued coupon has no redemption expiry date.**

These are the implementation's proposed business rules for the user's “10% off the next repair” offer. Review them before publication. They are identical in substance in all four languages and in the requested coupon email.

New online claims stop at midnight going into October 1, in Chicago time. Opt-out links and the private coupon records continue to work after signup closes.

## How to apply a coupon in store

Open `/admin` and expand **September repair coupons**. Search for the customer's code or email. Confirm it exists and is not already marked used. A screenshot alone is not proof that a code is valid.

Apply the 10% discount manually to the repair in RepairDesk, then click **Mark used** in the coupon panel. The website does not edit RepairDesk invoices or alter the existing repair-ticket process. Code reuse is blocked when marked used; staff must still enforce the one-customer rule if someone uses multiple email addresses.

## Promotional email list

The signup requests express consent with an unchecked box. The requested coupon is issued after the database save. Future marketing consent is activated only after the email confirmation link is explicitly confirmed.

Existing repair customers are not automatically added. Pending and opted-out emails are excluded from **Export confirmed emails**. Confirmation links expire after seven days; opt-out links do not have that expiry. GET requests do not change email preferences, so email-link scanners cannot confirm or unsubscribe a customer just by opening a URL. Supported one-click unsubscribe POST requests do perform the opt-out.

This update collects and exports the list; it does not automatically send bulk promotional campaigns. Export a fresh list before each campaign. Include the per-recipient unsubscribe URL from the export and the store's mailing address in promotional emails. If you later use a separate email platform, synchronize unsubscribes with that platform rather than repeatedly importing an old CSV or sending to an old scheduled list.

## Scope preserved

The repair page and booking component are unchanged. Existing repair-request, RepairDesk OAuth, SIM-request, admin-data and visitor APIs are byte-for-byte unchanged. Xfinity, buyback, phones, accessories, About and Contact retain their existing content and layout. The Label Creator source and rendered markup were compared against the supplied ZIP and match.

Existing admin charts/request panels are not redesigned; the new coupon panel is separate and collapsed by default. Existing language storage, public routes, canonical settings, sitemap, robots file, package files and Vercel configuration are unchanged.

The old `AugustHome.tsx` filename, CSS names, offer request aliases and existing `homepage_august_*` event IDs are deliberately retained internally so booking prefill, links and admin historical analytics continue to work. The displayed homepage copy is September. Necessary prefilled Ultra inquiry notes now say September; form layout, plan prices and behavior are retained.

## Offer source

The supplied September Ultra Mobile PDF, physical pages 3-4, supports continuing the existing three homepage offers. The $25 offer is six months for $150 upfront and runs through September 30, 2026. The fourth-month-free promotion excludes the 25GB plan and requires uninterrupted eligible service. The new 25GB offer was not added as a fourth homepage card, in keeping with the request to retain the current offers. Dealer compensation and other internal material are not published.

## Rollback

Retain the previous Vercel production deployment. Rolling the website back does not require deleting the new coupon tables or any existing data. Keep all existing RepairDesk/Supabase credentials unchanged. Do not delete subscribers to hide a setup error; preserve their consent and opt-out records.
