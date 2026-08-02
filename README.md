# CellzTech Website — August 2026

Production source for CellzTech / Cellz Repairz.

## Build

```bash
npm ci
npm run build
```

The production website is written to `dist/`.

## Local preview

```bash
npm run dev
```

`npm run dev` builds the site and serves it at `http://localhost:5173` by default. To preview an existing build, run `npm run preview`.

## August update

- English-default August homepage with complete English, Polish, Spanish, and Ukrainian content.
- Customer-facing Ultra Mobile August offers only.
- Repair page-to-booking handoff with issue/model prefill.
- Repair request confirmation and preferred drop-off workflow.
- Ultra SIM request prefills for each August promotion and number transfers.
- Updated homepage SEO, Open Graph image, structured data, and analytics events.

The build is self-contained so `npm ci` and `npm run build` do not require external JavaScript package downloads. Existing Vercel rewrites, API routes, Supabase files, and environment-variable usage remain in place.
