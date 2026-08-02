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

Vite serves the website at `http://localhost:5173` by default. To preview an existing production build, run `npm run preview`.

## August homepage update

- English-default August homepage with complete English, Polish, Spanish, and Ukrainian content.
- Customer-facing Ultra Mobile August offers only.
- Realistic iPhone product presentation with optimized WebP and PNG fallback assets.
- Subtle pointer-controlled 3D movement on desktop; no looping or cartoon-style phone animation.
- Interactive hero offer selector connected to the existing Ultra Mobile inquiry flow.
- “Lifetime warranty available on select repairs” trust message in all four languages.
- Repair page-to-booking handoff with issue/model prefill.
- Repair request confirmation and preferred drop-off workflow.
- Updated homepage SEO, Open Graph image, structured data, and analytics events.

Existing Vercel rewrites, API routes, Supabase files, booking flows, environment-variable usage, navigation, and non-homepage routes remain in place.
