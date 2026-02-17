# Codebase Structure

**Analysis Date:** 2026-02-17

## Directory Layout

```
canterbury-candles-landing-page/
├── .git/                       # Git repository
├── .next/                      # Next.js build output (generated, gitignored)
├── .planning/                  # Project planning documents
│   └── codebase/               # Codebase analysis docs (this file lives here)
├── node_modules/               # Dependencies (gitignored)
├── public/                     # Static assets served at root URL
│   └── images/                 # All product photos, logos, SVGs, process photos
├── src/                        # Application source code
│   ├── app/                    # Next.js App Router — layouts, pages, global CSS
│   │   ├── globals.css         # Tailwind v4 theme tokens, animations, global styles
│   │   ├── layout.tsx          # Root layout — HTML shell, fonts, metadata
│   │   └── page.tsx            # Home page — composes all section components
│   ├── components/             # React section and utility components
│   │   ├── AnimateIn.tsx       # Reusable viewport-triggered animation wrapper
│   │   ├── Footer.tsx          # Footer section (Server Component)
│   │   ├── Hero.tsx            # Hero section with parallax and particles
│   │   ├── Navigation.tsx      # Fixed navbar with mobile menu overlay
│   │   ├── OrderForm.tsx       # Order form with scent selection and size toggle
│   │   ├── Scents.tsx          # Product grid showing all 14 scents
│   │   └── Story.tsx           # "Our Process" section with parallax images
│   └── fonts/                  # Self-hosted woff2 font files
│       ├── dm-sans-latin-400-normal.woff2
│       ├── dm-sans-latin-500-normal.woff2
│       ├── dm-sans-latin-700-normal.woff2
│       ├── playfair-display-latin-400-italic.woff2
│       ├── playfair-display-latin-400-normal.woff2
│       └── playfair-display-latin-700-normal.woff2
├── .gitignore                  # Git ignore rules
├── Frontend-design-skill.txt   # AI assistant design guidelines (prompt context)
├── next.config.ts              # Next.js config — motion transpile, image formats
├── next-env.d.ts               # Next.js TypeScript declarations (generated)
├── package.json                # Dependencies and scripts
├── package-lock.json           # Lockfile
├── postcss.config.mjs          # PostCSS config — Tailwind v4 plugin
├── tsconfig.json               # TypeScript config with @/* path alias
└── vercel.json                 # Vercel deployment config (framework: nextjs)
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router directory — contains the root layout, the single page, and global styles
- Contains: `layout.tsx`, `page.tsx`, `globals.css`
- Key files: `page.tsx` is the sole route; `globals.css` defines the entire design token system and custom CSS animations

**`src/components/`:**
- Purpose: All React components for the landing page — both full-page sections and shared utilities
- Contains: 7 `.tsx` files — 5 section components (Hero, Story, Scents, OrderForm, Footer), 1 layout component (Navigation), 1 utility component (AnimateIn)
- Key files: `AnimateIn.tsx` is the shared animation primitive used by Story, Scents, and OrderForm

**`src/fonts/`:**
- Purpose: Self-hosted font files loaded via `next/font/local` in `layout.tsx`
- Contains: 6 woff2 files for Playfair Display (serif, display headings) and DM Sans (sans-serif, body text)
- Key files: All consumed by font declarations in `src/app/layout.tsx`

**`public/images/`:**
- Purpose: All static images — product photography, brand logos, process photos, decorative SVGs
- Contains: 33 files — 14 product photos (`product-*.jpg`), multiple logo variants (`logo-*.png`, `logo-*.svg`), 3 process photos, decorative SVGs (`jars.svg`, `melting.svg`, `workspace.svg`)
- Key files: `logo-header-hero-shot.jpeg` (hero image), `logo-burgundy-pink.png` (nav logo, hero background, mobile menu background), `product-*.jpg` (scent product grid)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout — fonts, metadata, HTML shell
- `src/app/page.tsx`: Home page — the only route, composes all sections

**Configuration:**
- `next.config.ts`: Next.js config (motion transpile, AVIF/WebP image formats)
- `tsconfig.json`: TypeScript config with `@/*` path alias mapping to `./src/*`
- `postcss.config.mjs`: PostCSS with `@tailwindcss/postcss` plugin
- `vercel.json`: Deployment target declaration

**Design System:**
- `src/app/globals.css`: Color tokens (`@theme` block), font assignments, custom keyframe animations, texture overlays, scrollbar styles, reduced-motion handling

**Core Sections (render order on page):**
- `src/components/Navigation.tsx`: Fixed top navbar (scroll-aware styling, mobile hamburger overlay)
- `src/components/Hero.tsx`: Full-screen hero with parallax background, gold particles, product shot
- `src/components/Story.tsx`: "Our Process" — 3-step alternating layout with parallax images
- `src/components/Scents.tsx`: Product grid — 14 scent cards with hover overlays
- `src/components/OrderForm.tsx`: Order form — scent chip selection, size toggle, contact fields
- `src/components/Footer.tsx`: Footer with brand, links, Instagram

**Shared Utilities:**
- `src/components/AnimateIn.tsx`: Viewport-triggered animation wrapper (exports `AnimateIn`, `StaggerContainer`, `StaggerItem`)

**Product Data (hardcoded):**
- `src/components/Scents.tsx`: `SCENT_IMAGE_MAP` (name-to-image mapping), `scents` array (full product data with tags, notes, accent colors)
- `src/components/OrderForm.tsx`: `allScents` (name list), `PRICES` record (`8oz: $15`, `16oz: $25`)

## Naming Conventions

**Files:**
- PascalCase for React components: `Hero.tsx`, `OrderForm.tsx`, `AnimateIn.tsx`
- lowercase for Next.js App Router conventions: `page.tsx`, `layout.tsx`, `globals.css`
- kebab-case for assets: `logo-burgundy-pink.png`, `product-aspen-woods.jpg`
- kebab-case for font files: `dm-sans-latin-400-normal.woff2`

**Directories:**
- lowercase: `app/`, `components/`, `fonts/`, `images/`

**Components:**
- Default export function matching file name: `export default function Hero()` in `Hero.tsx`
- Sub-components defined as local functions within the same file: `GoldParticles` in `Hero.tsx`, `ParallaxImage` in `Story.tsx`, `ScentCard` in `Scents.tsx`, `SuccessState` in `OrderForm.tsx`

**CSS Classes:**
- Tailwind utility classes as primary styling method
- Custom utility classes in `globals.css`: `.grain`, `.btn-shimmer`, `.ken-burns`, `.img-placeholder`
- Custom CSS variables via Tailwind v4 `@theme`: `--color-burgundy`, `--font-display`, etc.

**Imports:**
- Use `@/*` path alias for all local imports: `import Hero from "@/components/Hero"`
- Relative imports only for sibling files: `import AnimateIn from "./AnimateIn"`

## Where to Add New Code

**New Section Component:**
- Create `src/components/SectionName.tsx` (PascalCase)
- Add `"use client"` directive at top if it needs interactivity (animations, state, event handlers)
- Import and place in render order within `src/app/page.tsx`
- Use `AnimateIn` wrapper for viewport reveal animations
- Follow the existing section pattern: `<section id="section-id" className="py-16 md:py-24 lg:py-36 bg-{color} relative">` with a `max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16` inner container

**New Reusable Component/Utility:**
- Create in `src/components/` with PascalCase naming
- Export as default export
- If it is an animation utility, consider adding to `src/components/AnimateIn.tsx` as a named export

**New Page Route:**
- Create `src/app/route-name/page.tsx` per Next.js App Router conventions
- Currently only one route exists (`/`)

**New Static Assets:**
- Images: Add to `public/images/` with kebab-case naming
- Product photos: Use naming pattern `product-{scent-name}.jpg`
- Logo variants: Use naming pattern `logo-{variant-description}.{ext}`

**New Font Weights/Styles:**
- Add `.woff2` file to `src/fonts/`
- Register in the `localFont` call in `src/app/layout.tsx`

**New Design Tokens:**
- Add custom colors/fonts to the `@theme` block in `src/app/globals.css`
- They become immediately available as Tailwind classes (e.g., `--color-coral` becomes `text-coral`, `bg-coral`)

**New CSS Animations:**
- Add `@keyframes` rule and utility class to `src/app/globals.css`
- Add `prefers-reduced-motion` fallback if the animation is non-trivial

**New Product/Scent:**
- Add product photo to `public/images/product-{scent-name}.jpg`
- Add entry to `SCENT_IMAGE_MAP` in `src/components/Scents.tsx`
- Add `Scent` object to `scents` array in `src/components/Scents.tsx`
- Add scent name string to `allScents` array in `src/components/OrderForm.tsx`

## Special Directories

**`.next/`:**
- Purpose: Next.js build cache and output
- Generated: Yes
- Committed: No (gitignored)

**`.planning/`:**
- Purpose: Project planning and codebase analysis documents
- Generated: No (manually created)
- Committed: Yes

**`public/`:**
- Purpose: Static files served at root URL by Next.js (e.g., `/images/logo.png`)
- Generated: No
- Committed: Yes
- Note: Contains ~108MB of image assets — many logo variants are 6-11MB PNGs

**`src/fonts/`:**
- Purpose: Self-hosted woff2 font files loaded via `next/font/local`
- Generated: No (extracted from `@fontsource` packages)
- Committed: Yes

---

*Structure analysis: 2026-02-17*
