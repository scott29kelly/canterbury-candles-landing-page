# Testing Patterns

**Analysis Date:** 2026-02-17

## Test Framework

**Runner:**
- No test framework is installed or configured
- No test runner dependencies in `package.json` (no Jest, Vitest, Playwright, or Cypress)
- No test configuration files present in the project root
- No `test` script in `package.json`

**Assertion Library:**
- None installed

**Run Commands:**
```bash
npm run lint             # Only available quality check (runs next lint)
npm run build            # Type-checking via TypeScript strict mode during build
```

## Test File Organization

**Location:**
- No test files exist anywhere in `src/`
- No `__tests__/` directories
- No `*.test.*` or `*.spec.*` files in the project (only in `node_modules/`)

**Current Source Files (all untested):**
- `src/app/layout.tsx` (83 lines)
- `src/app/page.tsx` (21 lines)
- `src/app/globals.css` (166 lines)
- `src/components/AnimateIn.tsx` (131 lines)
- `src/components/Footer.tsx` (92 lines)
- `src/components/Hero.tsx` (222 lines)
- `src/components/Navigation.tsx` (185 lines)
- `src/components/OrderForm.tsx` (348 lines)
- `src/components/Scents.tsx` (222 lines)
- `src/components/Story.tsx` (175 lines)

## Test Structure

No tests exist. If tests were to be added, the recommended setup based on the stack (Next.js 15, React 19, TypeScript) would be:

**Recommended Framework:**
- Vitest + React Testing Library for unit/component tests
- Playwright for E2E tests (Next.js officially recommends this)

**Recommended Structure (co-located):**
```
src/
├── components/
│   ├── AnimateIn.tsx
│   ├── AnimateIn.test.tsx      # Co-located test
│   ├── OrderForm.tsx
│   ├── OrderForm.test.tsx      # Co-located test
│   └── ...
```

**Recommended Test Pattern:**
```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the brand name", () => {
    render(<Footer />);
    expect(screen.getByText("Canterbury Candles")).toBeInTheDocument();
  });
});
```

## Mocking

**Framework:** Not applicable — no tests exist

**What Would Need Mocking:**
- `next/image` — Next.js Image component (standard mock in Next.js test setups)
- `motion/react` — Framer Motion animations (mock to avoid animation timing in tests)
- `window.matchMedia` — used by `useIsMobile()` hook in `Hero.tsx` and `Story.tsx`
- `window.scrollY` — used by scroll listener in `Navigation.tsx`
- `IntersectionObserver` — used internally by motion's `whileInView`

**Recommended `window.matchMedia` Mock:**
```typescript
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
```

## Fixtures and Factories

**Test Data:**
- Not applicable — no test infrastructure exists

**Existing Static Data (usable as fixture reference):**
- Scent data: 14-item `scents` array in `src/components/Scents.tsx`
- Scent image map: `SCENT_IMAGE_MAP` in `src/components/Scents.tsx`
- Nav links: `navLinks` array in `src/components/Navigation.tsx`
- Process steps: `processSteps` array in `src/components/Story.tsx`
- Scent names: `allScents` array in `src/components/OrderForm.tsx`
- Price map: `PRICES` record in `src/components/OrderForm.tsx`

## Coverage

**Requirements:** None enforced — no coverage tooling configured

**Recommended Setup:**
```bash
# Add to package.json scripts
"test": "vitest",
"test:coverage": "vitest --coverage"
```

## Test Types

**Unit Tests:**
- Not present. Priority targets for unit tests:
  - `useIsMobile()` hook in `src/components/Hero.tsx` (responsive logic)
  - `toggleScent()` / `toggleSize()` state logic in `src/components/OrderForm.tsx`
  - Price calculation (`total` derived state) in `src/components/OrderForm.tsx`

**Integration Tests:**
- Not present. Priority targets:
  - `OrderForm.tsx` — full form flow: select scents, toggle sizes, submit, see success state
  - `Navigation.tsx` — scroll behavior, mobile menu open/close

**E2E Tests:**
- Not present. Priority targets:
  - Full page scroll through all sections
  - Order form happy path: fill contact info, select scents, submit
  - Mobile navigation overlay open/close
  - Anchor link navigation (`#scents`, `#order`, `#story`)

## Quality Checks Available

**Linting:**
```bash
npm run lint             # Runs next lint (ESLint with eslint-config-next)
```

**Type Checking:**
```bash
npm run build            # TypeScript strict mode catches type errors during build
```

**No Other Quality Gates:**
- No pre-commit hooks (no husky, lint-staged)
- No CI/CD pipeline detected
- No automated testing in any form

## Recommendations for Adding Tests

**Step 1 — Install dependencies:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

**Step 2 — Create `vitest.config.ts`:**
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
```

**Step 3 — Create `vitest.setup.ts`:**
```typescript
import "@testing-library/jest-dom/vitest";
```

**Step 4 — Add test script to `package.json`:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Priority Test Targets (by impact):**
1. `src/components/OrderForm.tsx` — most complex component (348 lines), state logic, form handling
2. `src/components/AnimateIn.tsx` — reusable utility component, used across all sections
3. `src/components/Navigation.tsx` — scroll behavior, mobile toggle, body overflow side effect
4. `src/components/Scents.tsx` — data rendering, image mapping

---

*Testing analysis: 2026-02-17*
