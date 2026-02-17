# Architecture

**Analysis Date:** 2026-02-17

## Pattern Overview

**Overall:** Single-page landing site built with Next.js App Router (server-rendered shell, client-interactive sections)

**Key Characteristics:**
- Single route (`/`) with section-based navigation via anchor links (`#story`, `#scents`, `#order`)
- No backend API, no database, no authentication — purely a presentational marketing page with a client-side order form
- Server Component root layout (`src/app/layout.tsx`) with Client Component sections for interactivity
- Animation-heavy UI using the `motion` (Framer Motion) library for scroll-driven parallax, viewport reveal, and micro-interactions
- All product data (scents, prices, process steps) is hardcoded inline within component files — no external data source

## Layers

**Layout Layer:**
- Purpose: Provides the HTML shell, metadata, fonts, and global CSS
- Location: `src/app/layout.tsx`
- Contains: Root `<html>` and `<body>` tags, font configuration (Playfair Display serif + DM Sans), metadata/SEO, global CSS import
- Depends on: `src/app/globals.css`, `src/fonts/*.woff2`
- Used by: All pages (only one page exists)

**Page Layer:**
- Purpose: Composes section components into the single-page layout
- Location: `src/app/page.tsx`
- Contains: The `Home` component that renders Navigation, Hero, Story, Scents, OrderForm, and Footer in sequence
- Depends on: All components in `src/components/`
- Used by: Next.js App Router (serves as the `/` route)

**Section Components:**
- Purpose: Self-contained visual sections of the landing page
- Location: `src/components/`
- Contains: `Hero.tsx`, `Story.tsx`, `Scents.tsx`, `OrderForm.tsx`, `Footer.tsx`, `Navigation.tsx`
- Depends on: `AnimateIn.tsx` (shared animation wrapper), `motion/react`, `next/image`
- Used by: `src/app/page.tsx`

**Utility Components:**
- Purpose: Reusable animation primitives shared across sections
- Location: `src/components/AnimateIn.tsx`
- Contains: `AnimateIn` (viewport-triggered reveal), `StaggerContainer`, `StaggerItem`
- Depends on: `motion/react`
- Used by: `Story.tsx`, `Scents.tsx`, `OrderForm.tsx`

**Styling Layer:**
- Purpose: Design system tokens, global styles, custom animations
- Location: `src/app/globals.css`
- Contains: Tailwind v4 `@theme` color tokens, font assignments, CSS keyframe animations (`shimmer`, `float-particle`, `ken-burns`, `sparkle`), texture overlays (`.grain`), scrollbar styling, reduced-motion media queries
- Depends on: Tailwind CSS v4 via PostCSS
- Used by: All components via Tailwind utility classes and custom classes

## Data Flow

**Page Render Flow:**

1. Next.js App Router renders `src/app/layout.tsx` (Server Component) — sets up fonts, metadata, HTML shell
2. `src/app/page.tsx` (Server Component) renders the `Home` function, composing all section components
3. Each section component marked `"use client"` hydrates on the client for interactivity (scroll animations, form state, mobile menu)
4. `Footer.tsx` is the only section component that does NOT use `"use client"` — it renders as a pure Server Component

**Order Form Flow:**

1. User selects scent chips in `src/components/OrderForm.tsx` — each toggles into `selectedScents` state array as `ScentSelection` objects (`{ scent: string, size: "8oz" | "16oz" }`)
2. User can toggle size (8oz/16oz) per selected scent via inline toggle buttons
3. Running total is computed inline: `selectedScents.reduce((sum, s) => sum + PRICES[s.size], 0)`
4. On submit, `handleSubmit` calls `e.preventDefault()` and sets `submitted = true` — there is NO actual form submission to any backend
5. Success state renders a thank-you message with a "Place another order" reset button

**Scroll Animation Flow:**

1. Hero section (`src/components/Hero.tsx`): Uses `motion` `useScroll` + `useTransform` for parallax background movement and content fade-out on scroll
2. Story section (`src/components/Story.tsx`): `ParallaxImage` sub-component applies per-image parallax using `useScroll`/`useTransform`
3. All sections: Use `AnimateIn` wrapper (`src/components/AnimateIn.tsx`) for viewport-triggered entrance animations (`whileInView`)
4. Mobile detection via `useIsMobile()` hook disables parallax effects on screens < 768px

**State Management:**
- No global state management library
- All state is local React `useState` within individual components:
  - `Navigation.tsx`: `scrolled` (boolean), `mobileOpen` (boolean)
  - `Hero.tsx`: `isMobile` (boolean, via custom hook)
  - `OrderForm.tsx`: `selectedScents` (array), `submitted` (boolean)
  - `Story.tsx`: `isMobile` (boolean, via inline hook)

## Key Abstractions

**AnimateIn:**
- Purpose: Declarative viewport-triggered animation wrapper
- Examples: `src/components/AnimateIn.tsx`
- Pattern: Wraps children in a `motion` element with `whileInView` trigger. Supports 5 animation variants: `fadeUp`, `fadeIn`, `slideLeft`, `slideRight`, `scaleIn`. Configurable `delay`, `duration`, `once`, `amount`, and polymorphic `as` prop.

**Scent Data Model:**
- Purpose: Represents a candle product
- Examples: `src/components/Scents.tsx` (interface `Scent` + `scents` array), `src/components/OrderForm.tsx` (`allScents` string array + `ScentSelection` interface)
- Pattern: Product data is duplicated across two components — `Scents.tsx` has the full `Scent` objects with `name`, `tag`, `notes`, `accent` while `OrderForm.tsx` has a flat string array of scent names. `SCENT_IMAGE_MAP` in `Scents.tsx` maps scent names to image paths. The `PRICES` constant in `OrderForm.tsx` maps sizes to dollar amounts.

**useIsMobile Hook:**
- Purpose: Detect mobile viewport for disabling parallax
- Examples: `src/components/Hero.tsx` (defined as local function `useIsMobile`)
- Pattern: Uses `window.matchMedia` with `change` event listener. Not extracted to a shared module — duplicated inline in `Hero.tsx` and reimplemented inline in `Story.tsx`.

**Design Tokens (CSS):**
- Purpose: Brand color palette and typography
- Examples: `src/app/globals.css` `@theme` block
- Pattern: Tailwind v4 `@theme` directive defines custom colors (`burgundy`, `blush`, `parchment`, `gold`, `charcoal`, `rose-gray`) and font families (`display` = Playfair Display, `body` = DM Sans). All components reference these via Tailwind classes like `text-burgundy`, `bg-gold`, `font-display`.

## Entry Points

**Next.js App Router:**
- Location: `src/app/layout.tsx` (root layout), `src/app/page.tsx` (home page)
- Triggers: HTTP request to `/`
- Responsibilities: `layout.tsx` provides HTML structure, fonts, metadata. `page.tsx` composes all section components into the single-page view.

**Navigation (anchor links):**
- Location: `src/components/Navigation.tsx`
- Triggers: User clicks nav links
- Responsibilities: Smooth-scrolls to `#story`, `#scents`, or `#order` sections via native `scroll-behavior: smooth` (set in `globals.css`)

## Error Handling

**Strategy:** Minimal — no error boundaries, no try/catch blocks, no error states

**Patterns:**
- The order form has no validation beyond HTML `required` attributes on `name` and `email` inputs
- No network error handling (form does not submit to a server)
- No image error fallbacks (Next.js `Image` component handles loading states internally)

## Cross-Cutting Concerns

**Logging:** None — no logging framework or console logging in production code

**Validation:** HTML5 native form validation only (`required`, `type="email"`, `type="tel"`) in `src/components/OrderForm.tsx`

**Authentication:** Not applicable — no user accounts or protected content

**SEO:** Metadata defined in `src/app/layout.tsx` — `title`, `description`, `keywords`, `openGraph`

**Accessibility:**
- `aria-label` on mobile menu toggle button in `src/components/Navigation.tsx`
- `aria-hidden="true"` on decorative background images in `src/components/Hero.tsx` and `src/components/Navigation.tsx`
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`, `<blockquote>`, `<cite>`
- `prefers-reduced-motion` media query in `src/app/globals.css` disables animations

**Performance:**
- Next.js `Image` component with AVIF/WebP formats configured in `next.config.ts`
- `priority` prop on above-the-fold images (hero product shot, first story image)
- `sizes` attributes on all `Image` components for responsive loading
- Local fonts (woff2) with `font-display: swap` to avoid FOIT
- Gold particles reduced from 18 to 6 on mobile in `src/components/Hero.tsx`
- Parallax effects disabled on mobile via `useIsMobile` checks

---

*Architecture analysis: 2026-02-17*
