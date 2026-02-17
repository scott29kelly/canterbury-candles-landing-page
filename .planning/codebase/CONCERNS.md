# Codebase Concerns

**Analysis Date:** 2026-02-17

## Tech Debt

**Duplicated Scent Data Across Components:**
- Issue: The list of 14 scent names is defined independently in two places — `src/components/OrderForm.tsx` (line 7, `allScents` string array) and `src/components/Scents.tsx` (line 30, `scents` array with full metadata). Adding, removing, or renaming a scent requires updates in both files, and they can easily drift out of sync.
- Files: `src/components/OrderForm.tsx`, `src/components/Scents.tsx`
- Impact: A scent name mismatch would silently break the order form or scent gallery. No runtime error would surface the discrepancy.
- Fix approach: Extract a single canonical scent data source (e.g., `src/data/scents.ts`) exporting all scent metadata, and import it in both components.

**Duplicated `useIsMobile` / `isMobile` Pattern:**
- Issue: Mobile detection via `window.matchMedia` is reimplemented three times — once as a named `useIsMobile` hook inside `src/components/Hero.tsx` (line 7), once inline inside `ParallaxImage` in `src/components/Story.tsx` (line 42), and again called a second time in `Hero` itself (line 61). The hook is not extracted to a shared location.
- Files: `src/components/Hero.tsx`, `src/components/Story.tsx`
- Impact: Maintenance burden; any fix to the pattern (e.g., SSR hydration mismatch handling) must be applied in multiple places.
- Fix approach: Extract `useIsMobile` into a shared hook at `src/hooks/useIsMobile.ts` and import everywhere.

**All Components Marked `"use client"`:**
- Issue: 6 of 7 components use the `"use client"` directive. `src/components/Footer.tsx` does not, but it is the only server component. The `Scents.tsx` component uses `"use client"` solely because it imports `AnimateIn` (a client component), even though `Scents` itself has no hooks or event handlers. This means the entire page is essentially client-rendered, negating Next.js SSR benefits.
- Files: `src/components/AnimateIn.tsx`, `src/components/Hero.tsx`, `src/components/Navigation.tsx`, `src/components/OrderForm.tsx`, `src/components/Scents.tsx`, `src/components/Story.tsx`
- Impact: Larger client bundle, slower First Contentful Paint, reduced SEO effectiveness for a landing page that should prioritize SSR.
- Fix approach: Refactor animation wrappers so static content can remain server-rendered. Use composition patterns where only the animation wrapper is a client component wrapping server-rendered children.

**Hardcoded Prices:**
- Issue: Prices ($15 / $25) are hardcoded in three separate locations — the `PRICES` constant in `src/components/OrderForm.tsx` (line 74), the display text in the same file (lines 129-130), and the price callout in `src/components/Scents.tsx` (lines 186-199). Changing prices requires editing all three spots.
- Files: `src/components/OrderForm.tsx`, `src/components/Scents.tsx`
- Impact: Price inconsistency if one location is missed during update.
- Fix approach: Define prices in the shared scent data file and reference them everywhere.

**No ESLint Configuration File:**
- Issue: No `.eslintrc.*` or `eslint.config.*` exists in the project root. The `next lint` script in `package.json` relies on default `eslint-config-next` settings, but there is no project-level ESLint config to customize or extend rules.
- Files: `package.json`
- Impact: No consistent enforcement of code quality rules beyond Next.js defaults. No formatting or style rules enforced.
- Fix approach: Add an `eslint.config.mjs` with project-appropriate rules.

**Unused Image Assets in `/public/images/`:**
- Issue: 11 image files in `public/images/` are not referenced by any source code: `candle-product-shot.jpg`, `crafting-supplies.jpg`, `logo-debossed-leather.png` (10.3 MB), `logo-forest-green.png` (5.8 MB), `logo-green.svg`, `logo-leather.svg`, `logo-metallic-bronze.png` (8.0 MB), `logo-metallic-gold.png` (8.1 MB), `melting.svg`, `jars.svg`, `workspace.svg`.
- Files: `public/images/candle-product-shot.jpg`, `public/images/crafting-supplies.jpg`, `public/images/logo-debossed-leather.png`, `public/images/logo-forest-green.png`, `public/images/logo-green.svg`, `public/images/logo-leather.svg`, `public/images/logo-metallic-bronze.png`, `public/images/logo-metallic-gold.png`, `public/images/melting.svg`, `public/images/jars.svg`, `public/images/workspace.svg`
- Impact: ~35 MB of dead weight in the repository. Bloats clone/deploy times.
- Fix approach: Remove unused image files from `public/images/` (verify they are not referenced via any external URLs first).

## Known Bugs

**Order Form Does Not Actually Submit Data:**
- Symptoms: Clicking "Submit Order" shows a success screen, but no data is sent anywhere. The `handleSubmit` in `src/components/OrderForm.tsx` (line 100) only calls `e.preventDefault()` and `setSubmitted(true)`.
- Files: `src/components/OrderForm.tsx`
- Trigger: Fill out the form and submit. Data is lost.
- Workaround: None — orders placed via the form are silently discarded. The success message ("We've received your order request") is misleading.

**Hydration Mismatch Risk with `useIsMobile`:**
- Symptoms: The `useIsMobile` hook initializes `isMobile` to `false` (line 8 in `src/components/Hero.tsx`), then sets it to the real value in a `useEffect`. During SSR, all content renders as "desktop" view. On hydration, if the client is actually mobile, a mismatch can cause a React hydration warning and a visible flash of content layout shift.
- Files: `src/components/Hero.tsx` (lines 7-17), `src/components/Story.tsx` (lines 42-49)
- Trigger: Load the page on a mobile device; the parallax transforms and particle count briefly render as desktop values before switching.
- Workaround: The impact is cosmetic (brief layout shift), but still a React hydration mismatch.

**Typo in Product Image Filename:**
- Symptoms: The file `public/images/product-pumkin-pecan-waffles.jpg` is misspelled ("pumkin" instead of "pumpkin"). The reference in `src/components/Scents.tsx` line 16 matches the misspelled filename, so it works — but this will cause confusion for anyone adding or renaming assets.
- Files: `public/images/product-pumkin-pecan-waffles.jpg`, `src/components/Scents.tsx` (line 16)
- Trigger: Not a runtime bug, but a maintenance hazard.
- Workaround: Both the file and the reference use the same misspelling, so it functions correctly.

## Security Considerations

**No Form Validation or Sanitization:**
- Risk: The order form collects name, email, phone, and free-text message with no input validation beyond HTML `required` attributes. If a backend is ever connected, raw user input would flow through unsanitized.
- Files: `src/components/OrderForm.tsx` (lines 162-206, 293-299)
- Current mitigation: The form does not actually submit anywhere, so this is a latent risk.
- Recommendations: When connecting to a backend, add client-side validation (email format, phone format, message length limits) and ensure server-side sanitization.

**No CSRF Protection:**
- Risk: The form has no CSRF token. If connected to an API endpoint, it would be vulnerable to cross-site request forgery.
- Files: `src/components/OrderForm.tsx`
- Current mitigation: Form does not submit, so no current risk.
- Recommendations: Implement CSRF tokens when adding form submission.

**No Content Security Policy:**
- Risk: No CSP headers are configured in `next.config.ts` or `vercel.json`. The site is vulnerable to XSS via injected scripts if any dynamic content is ever added.
- Files: `next.config.ts`, `vercel.json`
- Current mitigation: The site is fully static with no user-generated content display, limiting the attack surface.
- Recommendations: Add CSP headers in `next.config.ts` via the `headers()` configuration.

## Performance Bottlenecks

**Massive Image Assets (104 MB total):**
- Problem: The `public/images/` directory contains 104 MB of image files. Logo PNGs alone account for ~50 MB (`logo-burgundy-pink.png` is 8.6 MB, `logo-embossed-paper.png` is 7.1 MB, etc.). The 14 product images average ~3 MB each (~42 MB total). While Next.js `<Image>` optimizes on-the-fly, the source files are far larger than necessary.
- Files: `public/images/logo-burgundy-pink.png` (8.6 MB), `public/images/logo-embossed-paper.png` (7.1 MB), `public/images/workspace-candle-making.png` (7.7 MB), `public/images/empty-jars-prepped.jpg` (2.4 MB), all 14 `product-*.jpg` files (~3 MB each)
- Cause: Source images are unoptimized high-resolution originals. The logo PNGs appear to be 4000x4000+ pixel originals.
- Improvement path: Resize source images to maximum display dimensions (e.g., product images to ~800px wide, logos to ~400px). Convert PNGs to WebP/AVIF at source. This would reduce the repo from 104 MB to ~5-10 MB for images.

**18 Gold Particles Rendered with Individual DOM Elements:**
- Problem: The `GoldParticles` component in `src/components/Hero.tsx` (line 19) creates 18 individual `<span>` elements with CSS animations. Each has `radial-gradient` backgrounds and infinite animations, causing continuous GPU compositing.
- Files: `src/components/Hero.tsx` (lines 19-57)
- Cause: DOM-based particle effects instead of canvas-based rendering.
- Improvement path: For 18 particles the impact is modest, but if scaling up, use a canvas element or CSS `background-image` approach. Mobile already limits to 6 particles.

**Heavy Parallax Scroll Transforms on Hero:**
- Problem: The Hero component creates 3 `useTransform` hooks tied to scroll position (`bgY`, `contentOpacity`, `contentY`), recalculating on every scroll frame. Combined with the `GoldParticles` animation, the hero section is GPU-intensive.
- Files: `src/components/Hero.tsx` (lines 62-68)
- Cause: Multiple motion transforms driven by scroll on a section with gradient overlays and particle effects.
- Improvement path: The transforms are disabled on mobile (values set to static), which helps. Desktop performance is acceptable for modern hardware but could degrade on low-end machines.

**All Product Images Load Eagerly:**
- Problem: The Scents section renders 14 product images. None use `loading="lazy"` explicitly, though Next.js `<Image>` defaults to lazy loading for images without `priority`. However, the `AnimateIn` viewport animation wrapper may trigger image loading before the images are actually visible, depending on the viewport intersection margin.
- Files: `src/components/Scents.tsx` (lines 124-129)
- Cause: Interaction between `whileInView` animation triggers and image lazy loading.
- Improvement path: Verify that product images are genuinely lazy-loaded by testing with network throttling. Consider adding explicit `loading="lazy"` or using `placeholder="blur"` with `blurDataURL` for perceived performance.

## Fragile Areas

**OrderForm Component (348 lines):**
- Files: `src/components/OrderForm.tsx`
- Why fragile: This is the largest component at 348 lines. It contains the scent data array, the `SuccessState` sub-component, the `ScentSelection` interface, the `PRICES` constant, all form state management, and the full form UI. Any change to scent data, pricing, form fields, or UI layout requires editing this single file.
- Safe modification: Extract `SuccessState` into its own component. Move scent and price data to a shared data file. Break the form into smaller sub-components (ContactFields, ScentSelector, SpecialInstructions).
- Test coverage: No tests exist.

**CSS Custom Properties and Animation Keyframes:**
- Files: `src/app/globals.css`
- Why fragile: All color definitions, texture overlays, button animations, particle keyframes, and scrollbar styles live in a single 167-line CSS file. The `grain` texture class uses an inline SVG data URI that is difficult to modify. CSS keyframes (`float-particle`, `float-particle-alt`, `sparkle`, `shimmer`, `ken-burns`) are referenced by string name in JSX `style` props and Tailwind classes, creating implicit coupling.
- Safe modification: Changes to color values are safe (lines 4-14). Do not rename keyframe animation names without searching all JSX files for string references. The `grain` class is used in 4 components.
- Test coverage: No visual regression tests.

**Scent Card Responsive Grid Layout:**
- Files: `src/components/Scents.tsx` (line 213)
- Why fragile: The product grid uses a complex `calc()` expression for responsive widths: `w-[calc(50%-0.625rem)] sm:w-[calc(33.333%-0.834rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] xl:w-[calc(20%-1.2rem)] 2xl:w-[calc(14.285%-1.286rem)]`. The gap subtraction values are manually calculated magic numbers that must stay in sync with the `gap-5 md:gap-6` class on the parent container.
- Safe modification: If changing the gap value, recalculate all `calc()` width values across all breakpoints. Alternatively, replace with CSS Grid `auto-fill` + `minmax()`.
- Test coverage: No tests; visual verification required at all breakpoints.

## Scaling Limits

**Single-Page Architecture:**
- Current capacity: 1 page with 5 sections (Hero, Story, Scents, Order, Footer).
- Limit: Adding multiple pages (e.g., About, FAQ, individual scent detail pages) would require routing infrastructure. The current architecture has no shared layout beyond `RootLayout`, no navigation that supports multi-page routing, and scent data is not structured for individual pages.
- Scaling path: Convert to Next.js App Router multi-page structure with `app/scents/[slug]/page.tsx` pattern. Extract shared navigation and footer into the root layout.

**No Backend / No CMS:**
- Current capacity: All content is hardcoded in component files.
- Limit: Any content update (scent descriptions, prices, process steps, images) requires a code change and redeployment.
- Scaling path: Add a headless CMS (e.g., Sanity, Contentful) or at minimum a JSON data layer that can be updated without code changes.

## Dependencies at Risk

**`motion` (v12.34.0):**
- Risk: The `motion` package (formerly `framer-motion`) underwent a major rename/restructure. Import paths use `motion/react` which is the newer API. The package is a heavy dependency (~30 KB gzipped) for what amounts to fade-in animations and parallax effects on a landing page.
- Impact: If `motion` introduces breaking changes to the `motion/react` import path or the `useScroll`/`useTransform` API, 4 components would break.
- Migration plan: For a static landing page, CSS animations and `IntersectionObserver` could replace most uses, reducing bundle size significantly. The `AnimateIn` component already wraps all animation concerns.

## Missing Critical Features

**No Form Backend:**
- Problem: The order form is entirely decorative. It collects user data and discards it. Users who submit the form believe their order was received.
- Blocks: The entire purpose of the landing page (taking orders) is non-functional.

**No SEO Metadata for OG Image:**
- Problem: The OpenGraph metadata in `src/app/layout.tsx` (lines 65-70) defines `title` and `description` but no `image` property. Social media shares will not have a preview image.
- Files: `src/app/layout.tsx`
- Blocks: Social media marketing effectiveness.

**No Favicon or App Icons:**
- Problem: No `favicon.ico`, `apple-touch-icon.png`, or `manifest.json` detected in the `public/` directory or `app/` directory.
- Files: `public/` (missing files)
- Blocks: Professional appearance in browser tabs and mobile bookmarks.

## Test Coverage Gaps

**No Tests Exist:**
- What's not tested: The entire application. There are zero test files in the `src/` directory. No test framework is configured (no `jest.config.*`, `vitest.config.*`, or `@testing-library/*` in dependencies).
- Files: All files in `src/`
- Risk: Any refactoring (e.g., extracting shared scent data, splitting OrderForm) has no safety net. Regressions in form logic, scent selection state management, or responsive behavior would go undetected.
- Priority: Medium — for a static landing page the risk is manageable, but the OrderForm state logic (toggle scent, toggle size, price calculation) should have unit tests before adding a real backend.

---

*Concerns audit: 2026-02-17*
