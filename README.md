# Current release: November 2026 repair offer v2

Read `NOVEMBER_RELEASE.md` and `NOVEMBER_TEST_RESULTS.md` before publishing. The current source is not deployed.

# CellzTech website - November 2026

Read **NOVEMBER_RELEASE.md** before uploading or publishing. The older September/October setup documents are retained as history, not current launch instructions.

```sh
npm ci
npm test
npm run build
```

React, TypeScript and Vite frontend with the existing Vercel APIs. The November update keeps the existing business integrations while refreshing the public UI, booking flow and email repair coupon. No new package dependencies were introduced.

Important: the coupon requires `supabase/november_coupon.sql` in the EXISTING CellzTech project and a verified email sender. Never expose server secrets to the browser. This package has not been deployed.

Verification and limitations: **NOVEMBER_TEST_RESULTS.md**. Offer transcription and source discrepancy: **NOVEMBER_SOURCE_NOTES.md**.
