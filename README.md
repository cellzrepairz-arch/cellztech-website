# CellzTech November 2026 - complete one-upload package

This is the same November repair-offer v2 application code, repackaged into 99
files for one GitHub browser upload. No application source, tests, dependencies,
build configuration, or November coupon SQL has been changed by this repackaging.
The full November design, Ultra Mobile update, improved booking, desktop repair
coupon card, and mobile repair invitation are included.

## Upload once, without splitting

1. Extract this ZIP with Windows Extract All. Open the extracted folder until you
   see package.json, src, public, api, shared, tests and supabase together.
2. Open the existing cellzrepairz-arch/cellztech-website repository at its root.
   Select or create the november-2026-review branch from the current main.
3. Select Add file > Upload files. In Windows File Explorer, select ALL contents
   INSIDE the extracted folder and drag them onto the GitHub upload page.
   Do not upload the ZIP itself or the enclosing extraction folder.
4. Before committing, verify src/SitePages.tsx and src/site-seo.ts appear as upload
   paths, with no extra parent folder. Commit to the review branch.
5. Check the latest Vercel preview build. It must pass both tests and the actual
   production build before the database setup and live service tests proceed.

GitHub documents a maximum of 100 files in one browser upload:
https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

This is an in-place update to the existing repository. Do not delete the
repository, its history, existing credentials, or production database. Omitted
archival files do not need to be deleted from your existing repository.

## Database and launch

Uploading source does NOT run the coupon database setup. After a successful
preview build, follow NOVEMBER_RELEASE.md and apply only
supabase/november_coupon.sql in the verified EXISTING CellzTech project, not
CellzTV. Test real coupon email and repair-request receipt before publishing.

The expected coupon schema version is 2026-11-v2. Keep existing server-side keys
unchanged and out of the source. This repackaging has not pushed a GitHub commit,
created a deployment, or modified a database.

## Build and test

```sh
npm ci
npm test
npm run build
```

This archive contains complete source, NOT a prebuilt or production-verified
website. See NOVEMBER_RELEASE.md for test scope and remaining release checks.
Current source notes and the earlier test report are consolidated into that same
file. IMAGE_CREDITS.md retains the attribution notices.
