# Technology Stack

**Analysis Date:** 2026-02-17

## Languages

**Primary:**
- TypeScript ^5.0.0 - All application code (components, config, layout)
- CSS - Global styles via Tailwind CSS v4 (`src/app/globals.css`)

**Secondary:**
- None (no server-side scripts, no other languages)

## Runtime

**Environment:**
- Node.js v24.13.0

**Package Manager:**
- npm v11.7.0
- Lockfile: `package-lock.json` (present, 218KB)

## Frameworks

**Core:**
- Next.js ^15.1.0 - React meta-framework, App Router (no `pages/` directory)
- React ^19.0.0 - UI library
- React DOM ^19.0.0 - DOM rendering

**Animation:**
- Motion (Framer Motion) ^12.34.0 - Scroll-driven parallax, viewport reveal animations, page transitions

**Styling:**
- Tailwind CSS ^4.0.0 - Utility-first CSS framework (v4 with `@import "tailwindcss"` syntax)
- PostCSS ^8.4.0 - CSS processing pipeline
- @tailwindcss/postcss ^4.0.0 - Tailwind v4 PostCSS plugin

**Build/Dev:**
- next dev / next build / next start - Dev server, production build, production server
- ESLint ^9.0.0 - Linting (flat config era, but no project-level config file; relies on `eslint-config-next`)
- eslint-config-next ^15.1.0 - Next.js ESLint preset

## Key Dependencies

**Critical (runtime):**
- `next` ^15.1.0 - App Router SSR/SSG framework; handles routing, image optimization, font loading
- `react` ^19.0.0 - Component rendering (React 19 with concurrent features)
- `motion` ^12.34.0 - All scroll-driven animations, viewport-triggered reveals, AnimatePresence transitions
- `@fontsource/dm-sans` ^5.2.8 - Self-hosted body font (woff2 files extracted to `src/fonts/`)
- `@fontsource/playfair-display` ^5.2.8 - Self-hosted display/heading font (woff2 files extracted to `src/fonts/`)

**Infrastructure (dev-only):**
- `typescript` ^5.0.0 - Type checking
- `@types/node` ^22.0.0 - Node.js type definitions
- `@types/react` ^19.0.0 - React type definitions
- `@types/react-dom` ^19.0.0 - React DOM type definitions
- `tailwindcss` ^4.0.0 - CSS utility generation
- `postcss` ^8.4.0 - CSS transformation
- `eslint` ^9.0.0 - Code linting

## Configuration

**TypeScript (`tsconfig.json`):**
- Target: ES2017
- Module resolution: bundler
- Strict mode: enabled
- JSX: preserve (Next.js handles compilation)
- Path alias: `@/*` maps to `./src/*`
- Incremental compilation: enabled

**Next.js (`next.config.ts`):**
- `transpilePackages: ["motion"]` - Ensures motion library is compiled
- `images.formats: ['image/avif', 'image/webp']` - Modern image format optimization

**PostCSS (`postcss.config.mjs`):**
- Single plugin: `@tailwindcss/postcss` (Tailwind v4 integration)

**Tailwind (`src/app/globals.css` via `@theme`):**
- Custom color tokens: burgundy, blush, parchment, gold, charcoal, rose-gray (with light/muted variants)
- Custom font families: `--font-display` (Playfair Display), `--font-body` (DM Sans)
- No separate `tailwind.config.js` - Tailwind v4 uses CSS-first configuration via `@theme` directive

**Vercel (`vercel.json`):**
- Framework: nextjs (minimal config, Vercel auto-detects settings)

**Environment Variables:**
- No `.env` files detected
- No environment variables referenced in application code
- No API keys or secrets required

## Fonts

**Loading Strategy:**
- Self-hosted via `next/font/local` in `src/app/layout.tsx`
- Font files stored at `src/fonts/*.woff2`
- CSS custom properties: `--font-playfair`, `--font-dm-sans`
- Display: swap (prevents FOIT)
- Fallback chains defined for both font families

**Font Files:**
- `src/fonts/dm-sans-latin-400-normal.woff2`
- `src/fonts/dm-sans-latin-500-normal.woff2`
- `src/fonts/dm-sans-latin-700-normal.woff2`
- `src/fonts/playfair-display-latin-400-normal.woff2`
- `src/fonts/playfair-display-latin-400-italic.woff2`
- `src/fonts/playfair-display-latin-700-normal.woff2`

## Images

**Strategy:**
- Next.js `<Image>` component used throughout for automatic optimization
- All images served from `public/images/`
- Formats: AVIF and WebP (configured in `next.config.ts`)
- 14 product photos (one per scent), plus logo variants and process photos
- Responsive `sizes` attributes specified on all images

## Scripts

```bash
npm run dev       # Start Next.js dev server with hot reload
npm run build     # Production build (SSG/SSR)
npm run start     # Start production server
npm run lint      # Run ESLint via next lint
```

## Platform Requirements

**Development:**
- Node.js v24+ (current environment)
- npm v11+
- No database or external services required
- No environment variables required

**Production:**
- Deployed to Vercel (confirmed by `vercel.json`)
- Static/SSG landing page (no API routes, no server actions)
- No backend infrastructure needed

---

*Stack analysis: 2026-02-17*
