# October seasonal accents

This package updates the previously supplied October preview. It is not a new September build and does not change any offer, eligibility rule, translation string, or backend setting.

## Visual changes

- Warm ivory and very light amber shading on the homepage hero.
- Small outlined autumn leaves and one small, faceless pumpkin around the existing iPhone photograph.
- Copper edging on the homepage offer strip and Ultra plan selector.
- A leaf beside the existing translated October label on both pages.
- Subtle autumn decoration at the edges of the Ultra Mobile hero.
- Fewer decorations on small screens; no falling leaves, popup, audio, or continuous animation.
- Only a small leaf hover effect, disabled when reduced motion is requested.
- Decorations are hidden from screen readers and never receive pointer events.

## Files changed relative to the October preview

- src/OctoberPages.tsx: decorative elements and scoped styling hooks.
- src/october-pages.css: appended seasonal styles, scoped to the two marketing pages.
- src/OctoberSeason.tsx: new lightweight, decorative SVG components.

All other 81 existing files are byte-for-byte unchanged, including the translations, offers, SEO configuration, dependency manifests, Vercel settings, main application (including the Label Creator), and backend code. OCTOBER_FLAIR.md and OCTOBER_FLAIR_QA.json are new release documentation.

## Validation

- All 13 TypeScript source files passed syntax/transpilation checks with the available local TypeScript installation.
- October CSS parsed successfully.
- 32 browser layout checks: homepage and Ultra page, English/Polish/Spanish/Ukrainian, at 320/390/768/1440 pixels.
- No horizontal overflow in the checked layouts and no JavaScript page errors.
- 13 holiday, 25GB duration, and family price-selector interactions passed.
- Repair-link destination and reduced-motion behavior checked.
- 84 existing mocked coupon/SIM API tests passed.

The browser preview renders the actual application source using an available React 18 runtime, an SVG-icon adapter, inline images, and simulated network/storage/location adapters. It is not the pinned Vite production build. No production customer record, email, or deployment was created by these tests.

The production build remains unverified: npm ci could not download packages because registry.npmjs.org resolution failed with EAI_AGAIN. Package files were not changed to bypass that limitation. A successful Vercel preview build is still required before publishing.

## Upload

1. Extract the ZIP and open cellztech-website-main.
2. Upload the contents to the existing october-preview branch, preserving the directories. Do not nest the outer folder inside the repository.
3. Confirm Vercel builds the new commit successfully and shows Ready.
4. Check both pages and the language selector in the preview before merging into main.

No new Supabase SQL, DNS changes, environment variables, or email configuration are needed for this visual update.
