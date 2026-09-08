# CellzTech September corrections

Prepared September 7, 2026. This is a source update for a preview deployment, not a claim that the live coupon database or email delivery is fixed.

## The two reported issues

**Ultra Mobile still said August.** The separate Ultra page's four language records now say the existing offers are extended for September. The three offers and existing plan prices are retained. The copy states that the $25/month offer is $150 prepaid for six months, available through September 30. Fourth-month-free copy includes the 25GB exclusion and uninterrupted-service condition from the supplied September PDF. The two remaining customer-facing August inquiry labels were updated; legacy link IDs were retained.

**The coupon says signup is unavailable.** The original UI displays that when its database-readiness call fails or returns false. A screenshot alone does not identify whether the SQL was not run, failed, was applied to a different project, or the deployed function/settings have a problem. This update does not disguise an unavailable database or generate unsaved coupons.

The coupon now shows a loading state during its initial check, offers a manual retry, and rechecks after 60 seconds, window focus, or restored connectivity. Detailed setup diagnostics appear only inside the authenticated September repair coupons admin panel. Public status exposes only readiness/campaign booleans. Runtime JSON loading was changed to a static Node require so it does not rely on import-attribute syntax.

## What to do

1. Upload this project to the existing September preview branch and wait for Vercel to finish building. Use the contents of `cellztech-website-main`, not the outer folder. Include `lib`, `shared`, `api`, and `src`. Keep existing environment variables unchanged. Do not promote a failed build.
2. Open the existing CellzTech Supabase project, then SQL Editor. If the coupon setup has not already completed, run ONLY `supabase/september_coupon.sql`. It is the same isolated migration from the first September update, with a final read-only check added. The final result should contain `"ready": true` and `"schemaVersion": "2026-09-v1"`. It creates no new repair or RepairDesk tables. Do not rerun old backend setup scripts.
3. Open the preview's `/admin`, sign in normally, and expand **September repair coupons**. Read the setup diagnostic and click **Refresh signups**. It differentiates missing server settings, missing coupon setup, access rejection, and a database connection failure. It never displays secret values. If you already ran the SQL and signup still fails, use this diagnostic rather than changing unrelated tables.
4. Once the panel says the coupon database is ready, test ONE signup using your own real email. Confirm the coupon is saved, then test confirmation and unsubscribe. The email provider still needs its verified sending domain. A coupon can be stored and displayed while email is unavailable; that is not proof that a confirmation email was delivered.
5. Promote only after the Vercel build succeeds and the live service test passes. Keep the prior working deployment for rollback.

## Scope retained

The existing repair page, booking component, RepairDesk APIs, repair backup API, normal admin analytics, Label Creator, Xfinity, buyback, phones, accessories, header, footer, routing and language persistence are unchanged. The existing homepage design/media are unchanged. Only the new coupon feature and the Ultra promotional wording are amended.

No new API keys are included in the files. Do not paste keys or subscriber records into screenshots.

## Validation limit

74 API contract/security tests passed using simulated database/email responses. 21 in-memory React browser scenarios passed at desktop/mobile widths and in all four public languages. 78 source-preservation/syntax checks passed. See SEPTEMBER_QA.md.

The environment cannot download npm dependencies or browse the live site. `npm ci` did not complete and the Vite production build could not be verified. Do not mistake the local React test harness for a Vercel deployment. No live database SQL, email delivery, or live customer signup was performed here.
