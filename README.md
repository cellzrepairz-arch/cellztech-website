# CellzTech - November 2026, Option C

Full website source with CellzTech blue, subtle November warmth, a high-contrast Ultra hero, larger CT favicon, and graceful coupon readiness/retry handling.

**Read NOVEMBER_RELEASE.md before upload.** This is the complete package, not just a theme patch. It preserves the earlier November promotions and repair-booking updates.

- Extract and upload ALL contents at the existing repository root on a review branch.
- The ZIP contains 100 files. Do not upload the ZIP itself or an enclosing directory.
- Wait for Vercel's test/build result before releasing to main.
- Supabase uses the unchanged v2 manual setup at supabase/november_coupon.sql. Do not run it in CellzTV.
- A visual fix is not database activation: real coupon/email and booking checks are still required.

Local correction checks: 186 automated tests; 70 offline browser assertions. Browser APIs were mocked and no live records or emails were created. A dependency-resolved production build of this correction remains to be verified in Vercel.
