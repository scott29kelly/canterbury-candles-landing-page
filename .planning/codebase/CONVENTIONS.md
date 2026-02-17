# Coding Conventions

**Analysis Date:** 2026-02-17

## Naming Patterns

**Files:**
- Components: PascalCase `.tsx` files, one component per file (e.g., `Hero.tsx`, `OrderForm.tsx`)
- Page routes: lowercase `page.tsx` and `layout.tsx` (Next.js App Router convention)
- CSS: `globals.css` — single global stylesheet
- Fonts: lowercase-hyphenated `.woff2` files (e.g., `playfair-display-latin-400-normal.woff2`)

**Functions:**
- Components: PascalCase — `export default function Hero()`, `function ScentCard()`
- Hooks: camelCase with `use` prefix — `useIsMobile()`
- Handlers: camelCase with verb prefix — `handleSubmit()`, `toggleScent()`, `toggleSize()`
- Helper sub-components: PascalCase, defined in same file as parent — `GoldParticles()` in `Hero.tsx`, `SuccessState()` in `OrderForm.tsx`, `ParallaxImage()` in `Story.tsx`

**Variables:**
- camelCase for all local variables and state — `scrolled`, `mobileOpen`, `isMobile`, `selectedScents`
- UPPER_SNAKE_CASE for module-level constants — `SCENT_IMAGE_MAP`, `PRICES`
- camelCase for module-level data arrays — `navLinks`, `allScents`, `processSteps`, `scents`

**Types:**
- PascalCase interfaces — `Scent`, `ScentSelection`, `AnimateInProps`
- PascalCase type aliases — `AnimationVariant`
- Inline prop types for simple sub-components: `{ scent: Scent }`, `{ onReset: () => void }`
- Use `interface` for component props; use `type` for union aliases

## Code Style

**Formatting:**
- No explicit Prettier or formatting config detected — relies on editor defaults
- 2-space indentation throughout all `.tsx` and `.css` files
- Double quotes for JSX attribute strings
- Semicolons at end of statements
- Trailing commas in multiline arrays/objects

**Linting:**
- ESLint 9 with `eslint-config-next` — no custom `.eslintrc` file at project root
- Lint via `next lint` script in `package.json`
- No stricter custom rules configured

**TypeScript:**
- Strict mode enabled in `tsconfig.json`
- Use `import type` for type-only imports: `import type { Metadata } from "next"`
- Use `{ type ReactNode }` inline import syntax: `import { type ReactNode } from "react"`
- Generic types with angle brackets: `useRef<HTMLElement>(null)`, `useState<ScentSelection[]>([])`
- `Readonly<>` wrapper for layout props: `Readonly<{ children: React.ReactNode }>`
- `Record<K, V>` for lookup maps: `Record<string, string>`, `Record<"8oz" | "16oz", number>`

## Import Organization

**Order:**
1. `"use client"` directive (first line, when needed)
2. React/Next.js framework imports (`next/image`, `next/font/local`, `react`)
3. Third-party library imports (`motion/react`)
4. Local component imports (`./AnimateIn`, `@/components/Hero`)
5. Local CSS imports (`./globals.css`)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Used in page-level imports: `import Navigation from "@/components/Navigation"`
- Relative imports used within the `components/` directory: `import AnimateIn from "./AnimateIn"`

## Component Patterns

**Client vs Server Components:**
- All interactive components use `"use client"` directive at top of file
- Components with `"use client"`: `Hero.tsx`, `Navigation.tsx`, `Scents.tsx`, `Story.tsx`, `OrderForm.tsx`, `AnimateIn.tsx`
- Server components: `layout.tsx`, `page.tsx`, `Footer.tsx`
- Rule: Add `"use client"` only when the component uses hooks, event handlers, or motion/react animations

**Component Structure:**
- Module-level constants and data arrays at the top, below imports
- Helper sub-components defined as named functions in the same file (not exported)
- Main component exported as `export default function ComponentName()`
- No barrel exports — each component file has one default export

**Props Pattern:**
- Inline destructured props for simple components: `({ scent }: { scent: Scent })`
- Named interface for complex props: `interface AnimateInProps { ... }`
- Default values in destructuring: `variant = "fadeUp"`, `className = ""`

**State Management:**
- Local `useState` only — no global state, no context providers, no state libraries
- State co-located in the component that uses it
- Derived values computed inline: `const total = selectedScents.reduce(...)`

## Styling Approach

**Primary:** Tailwind CSS v4 via `@import "tailwindcss"` with `@theme` custom tokens

**Custom Design Tokens (in `src/app/globals.css`):**
- Colors: `--color-burgundy`, `--color-blush`, `--color-parchment`, `--color-gold`, `--color-charcoal`, `--color-rose-gray` (and light/muted variants)
- Fonts: `--font-display` (Playfair Display), `--font-body` (DM Sans)
- Use in Tailwind as: `text-burgundy`, `bg-blush`, `font-display`

**Inline Styles:**
- Used only for dynamic/computed values: parallax `y` transforms, particle positions, animation delays
- Never used for static styling — always Tailwind classes for static styles

**CSS Utility Classes (custom in `globals.css`):**
- `.grain` — paper/linen texture overlay
- `.btn-shimmer` — gold gradient shimmer button effect
- `.ken-burns` — slow zoom animation
- `.img-placeholder` — burgundy gradient placeholder

**Responsive Design:**
- Mobile-first with Tailwind breakpoints: `md:`, `lg:`, `xl:`, `2xl:`
- `useIsMobile()` custom hook for JS-dependent responsive behavior (parallax, particle count)
- Common pattern: `className="text-4xl md:text-5xl lg:text-6xl"`
- Max container width: `max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16`

**Accessibility:**
- `prefers-reduced-motion` media query in `globals.css` disables all animations
- `aria-hidden="true"` on decorative images
- `aria-label` on icon-only buttons (hamburger menu)
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`, `<blockquote>`, `<cite>`
- `htmlFor` labels on all form inputs

## Animation Pattern

**Library:** `motion` (Framer Motion) v12 — imported from `motion/react`

**Scroll-driven Animations:**
- `useScroll()` + `useTransform()` for parallax effects in `Hero.tsx` and `Story.tsx`
- Disable parallax on mobile via `useIsMobile()` hook

**Viewport-triggered Reveal:**
- Use the `AnimateIn` wrapper component (`src/components/AnimateIn.tsx`) for scroll-reveal
- Variants: `fadeUp` (default), `fadeIn`, `slideLeft`, `slideRight`, `scaleIn`
- Standard easing: `[0.16, 1, 0.3, 1]` (custom spring-like cubic bezier)

**Enter Animations:**
- Hero section elements use direct `motion.div` with `initial` / `animate` props
- Staggered delays for sequential reveal: `delay: 0.3`, `delay: 0.6`, etc.

**Transition Animations:**
- `AnimatePresence` with `mode="wait"` for form/success state swap in `OrderForm.tsx`
- Mobile nav overlay uses `AnimatePresence` for enter/exit

## Error Handling

**Patterns:**
- No explicit error handling — the application is a static landing page with no API calls
- Form submission is client-side only (no backend): `handleSubmit` calls `e.preventDefault()` and sets state
- No try/catch blocks, no error boundaries, no error state UI

## Logging

**Framework:** None — no logging in the codebase

## Comments

**When to Comment:**
- Section separators within JSX using `{/* Section Name */}` comments
- Example: `{/* Background logo */}`, `{/* Main content */}`, `{/* CTAs */}`
- Used extensively for visual organization of long JSX blocks
- No JSDoc/TSDoc documentation on any functions or interfaces

**Style:**
- JSX comments only: `{/* ... */}`
- CSS comments for section headers: `/* Custom scrollbar */`, `/* Gold shimmer animation */`
- No `//` single-line comments used anywhere

## Function Design

**Size:**
- Components range from 20 lines (`Home` in `page.tsx`) to ~270 lines (`OrderForm`)
- Helper sub-components kept to 40-70 lines
- Custom hooks are very short (5-15 lines)

**Parameters:**
- Components take a single destructured props object
- Event handlers are defined inline or as const arrow functions inside the component

**Return Values:**
- Components return JSX
- Hooks return primitive values: `useIsMobile()` returns `boolean`

## Module Design

**Exports:**
- One default export per component file
- `AnimateIn.tsx` is the only file with additional named exports: `StaggerContainer`, `StaggerItem`
- No barrel files (`index.ts`) — all imports reference specific files

**Data Co-location:**
- Static data arrays (scents, navLinks, processSteps) defined in the same file as the component that uses them
- No separate data files or API layer

---

*Convention analysis: 2026-02-17*
