# External Integrations

**Analysis Date:** 2026-02-17

## APIs & External Services

**None.** This is a fully static landing page with no external API calls. The order form (`src/components/OrderForm.tsx`) captures user input but does not submit to any backend -- it only toggles a client-side success state via `useState`. No `fetch()`, `axios`, or API route calls exist anywhere in the codebase.

## Data Storage

**Databases:**
- None. No database connections, ORMs, or data persistence of any kind.

**File Storage:**
- Local filesystem only. All images are static files in `public/images/`.

**Caching:**
- None (beyond Next.js default build-time caching and Vercel CDN edge caching).

## Authentication & Identity

**Auth Provider:**
- None. No authentication system exists. The site is a public-facing landing page with no user accounts or protected routes.

## Monitoring & Observability

**Error Tracking:**
- None. No Sentry, LogRocket, or similar error tracking service integrated.

**Analytics:**
- None detected. No Google Analytics, Plausible, Vercel Analytics, or similar tracking scripts.

**Logs:**
- None. No logging framework or service. Standard `console` only (no instances detected in source code).

## CI/CD & Deployment

**Hosting:**
- Vercel (confirmed by `vercel.json` with `"framework": "nextjs"`)
- Deployment is likely automatic via Vercel's GitHub integration (standard Vercel workflow)

**CI Pipeline:**
- No CI configuration files detected (no `.github/workflows/`, no `Jenkinsfile`, no `.circleci/`)
- Linting available via `npm run lint` but not enforced in any pipeline

## Environment Configuration

**Required env vars:**
- None. The application has zero environment variable dependencies.

**Secrets location:**
- Not applicable. No secrets are needed.

**.env files:**
- None present. `.gitignore` includes `.env*.local` entries (standard Next.js template) but no env files exist.

## Webhooks & Callbacks

**Incoming:**
- None. No API routes exist (`src/app/api/` directory does not exist).

**Outgoing:**
- None. No outbound HTTP requests from the application.

## Third-Party Links (non-integration)

**Social Media:**
- Instagram link in footer (`src/components/Footer.tsx`): `https://instagram.com/canterburycandles2025`
- This is a simple external hyperlink, not an API integration.

## Integration Gaps (opportunities)

The following are notable gaps where integrations would typically exist for a site like this:

1. **Order Form Backend** - `src/components/OrderForm.tsx` captures name, email, phone, scent selections, and special instructions but has no submission endpoint. The form's `handleSubmit` only calls `setSubmitted(true)`. A backend integration (e.g., email service, form handler like Formspree/Netlify Forms, or a serverless API route) is needed to actually receive orders.

2. **Analytics** - No page view or event tracking. Consider Vercel Analytics, Google Analytics, or Plausible.

3. **Error Monitoring** - No error boundary or tracking service for production error visibility.

4. **Payment Processing** - Prices are displayed ($15/8oz, $25/16oz) but no payment integration exists (no Stripe, Square, or PayPal).

---

*Integration audit: 2026-02-17*
