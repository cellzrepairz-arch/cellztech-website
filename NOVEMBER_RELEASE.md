# CellzTech November 2026 - Option C correction (revision 3)

## What this package is
Complete source for the existing CellzTech website, not a compiled site. It replaces the earlier November ZIP for upload purposes and preserves the November Ultra Mobile offers, dates, booking flow and repair coupon API.

Option C keeps CellzTech blue, adds restrained amber/cream accents, and fixes the Ultra hero contrast. The CT favicon is now a larger white monogram on blue, supplied as SVG plus a 16/32/48px ICO fallback. The icon references have a new version query.

## Important status
This correction has NOT been pushed to GitHub, deployed to Vercel, or applied to any database by this revision. No real customer signup, email, booking, or RepairDesk action was sent.

The supplied earlier Vercel log shows the November build at commit a2bbd2e completed. Its database-unavailable/configuration-missing messages occur inside simulated automated tests; they are NOT a diagnosis of the live coupon database.

## Signup behavior
- Existing 18-second passive offer, seven-day dismissal, email requirement, repair-only scope and optional unchecked marketing opt-in remain intact.
- Automatic invitations still require a successful real readiness check. No automatic popup interrupts booking or appears on Ultra/internet pages.
- When readiness fails, the permanent offer provides a store phone link, a smaller Check again action, and an independent booking link. Coupon details remain available.
- A 503 during signup switches the open dialog to help/retry, preserving the entered email and request ID in memory. Successful retry uses the same ID. An unavailable service never creates a client-side coupon or a false success message.
- Updating colors and wording does NOT complete Supabase setup or verify email delivery.

## Database
Use the EXISTING v2 manual setup in supabase/november_coupon.sql only in the verified CellzTech project, NOT CellzTV. It is byte-for-byte unchanged from the prior v2 package. There is no new Option C database migration or credential requirement. If v2 is already installed, this visual correction does not require another migration.

## Verification performed for this correction
- 186 Node automated tests passed, including 9 new presentation/recovery regressions.
- 70 offline browser assertions passed against the current TSX/CSS rendered with React 18.3.1, covering desktop/mobile widths, all four fallback languages, pricing selection, no horizontal page overflow, contrast in the Ultra hero, retry behavior, preserved email/request ID, optional marketing, and delayed/mobile invitations.
- No JavaScript page errors in those checks.
- Six sampled Ultra foreground/background pairs met 4.5:1 or better. This is a focused contrast check, not a complete WCAG audit.
- 28 browser source modules transpiled with zero syntax diagnostics. The isolated browser harness used local assets and mocked service responses; it is NOT included in the upload.
- The dependency-resolved TypeScript/Vite production build could not be run here: npm registry resolution failed (EAI_AGAIN). The normal Vercel build for THIS correction still must pass. No locked package versions were changed.
- ZIP integrity and complete source inclusion were checked. 100 files, including the ICO, fit the browser uploader's 100-file limit.

## Upload and release
1. Extract this ZIP. In the existing repository, use a review branch based on current main.
2. At the repository root, upload ALL files and folders inside the extracted directory together. Do not upload the ZIP or the enclosing folder. src/SitePages.tsx and src/site-seo.ts must stay under src/.
3. Let Vercel run npm test && npm run build on the preview. Review the result before merging to main.
4. Complete/verify the existing v2 database setup manually. Use authenticated staff diagnostics to establish the real readiness issue; do not infer it from simulated build-test messages.
5. Test a real coupon using an email address you control, separately check opted-in confirmation, and verify a clearly labeled repair request reaches the correct system.
6. Merge only after those checks pass; then verify the production deployment. Keep the preceding deployment available for rollback. Do not delete coupon tables or expose credentials.

The full November source is included; older repository files not present in this ZIP are not automatically deleted by a browser upload. The updated entry points use the current modules.
