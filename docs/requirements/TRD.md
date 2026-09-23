# TRD — Technical Requirements Document
**Product:** Repeato  
**Version:** 0.1 (Documentation Phase)  
**Date:** 2026-09-19  
**Status:** DRAFT — Awaiting review

> This document translates the SRS into technical requirements. Distinguish:  
> **[PRODUCT]** — A product requirement (from SRS)  
> **[TECH]** — A technical implementation requirement

---

## 1. Technical Overview

Repeato is a React single-page application (SPA) with Supabase as the backend.

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript | React 19, TS 6 |
| Build | Vite + ESBuild | Vite 8 |
| Styling | CSS (index.css) + App.css | Vanilla CSS |
| Routing | React Router | v7 |
| Database | Supabase (PostgreSQL) | Latest |
| Auth | Supabase Auth | Latest |
| Storage | Supabase Storage | Latest |
| Realtime | Supabase Realtime | Latest |
| Hosting | Vercel | Latest |
| Source Control | Git + GitHub | — |

---

## 2. Frontend Requirements

**TR-FE-001** [TECH]  
The frontend must be a React SPA using React 19 with TypeScript in strict mode.

**TR-FE-002** [TECH]  
The build must use Vite 8. The Vite config must use `import.meta.dirname` (not `__dirname`).

**TR-FE-003** [TECH]  
All component files must use `.tsx` extension. Utility files must use `.ts`.

**TR-FE-004** [TECH]  
Routing must use React Router v7's `createBrowserRouter` or the `<Routes>` / `<Route>` declarative pattern.

**TR-FE-005** [TECH]  
Protected routes must be wrapped in a `ProtectedRoute` component that checks the current user's role before rendering the route.

**TR-FE-006** [TECH]  
All API calls to Supabase must go through a centralised service layer (`src/services/`), not directly from components.

**TR-FE-007** [TECH]  
TypeScript interfaces for all domain models must be maintained in `src/types/index.ts`.

**TR-FE-008** [TECH]  
The application must handle the case where Supabase is not configured (missing environment variables) gracefully — either showing a configuration error or falling back to mock data in development.

**TR-FE-009** [TECH]  
The Customer product must be a mobile-first responsive design. Minimum tested width: 375px.

**TR-FE-010** [TECH]  
The Business Dashboard must be desktop-first. Minimum tested width: 1024px.

**TR-FE-011** [PRODUCT → TECH]  
The application must not expose Supabase service role keys in the frontend. Only the Supabase anon key may be used in the browser.

---

## 3. Backend Requirements (Supabase)

**TR-BE-001** [TECH]  
The Supabase project must have Row Level Security enabled on ALL tables containing user or business data.

**TR-BE-002** [TECH]  
All database operations must use the Supabase client library (`@supabase/supabase-js`).

**TR-BE-003** [TECH]  
The Supabase client must be instantiated once and exported as a singleton from `src/services/supabase.ts`.

**TR-BE-004** [TECH]  
The Supabase client must read credentials from environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These variables must never be committed to the repository.

**TR-BE-005** [TECH]  
The system must verify Supabase connectivity at startup. If the Supabase URL or anon key is missing, the system must log a clear warning and fall back to development mode.

**TR-BE-006** [TECH]  
All database schema changes must be managed through SQL migration files in `supabase/migrations/`.

**TR-BE-007** [TECH]  
Migrations must be idempotent where possible (use `IF NOT EXISTS`, `ON CONFLICT DO NOTHING`).

---

## 4. Supabase Authentication Requirements

**TR-AUTH-001** [TECH]  
Business Owner authentication must use `supabase.auth.signInWithPassword({ email, password })`.

**TR-AUTH-002** [TECH]  
Business Owner registration must use `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`.

**TR-AUTH-003** [TECH]  
Customer authentication (phone OTP) must use `supabase.auth.signInWithOtp({ phone })`.

**TR-AUTH-004** [TECH]  
Customer authentication (email OTP) must use `supabase.auth.signInWithOtp({ email })`.

**TR-AUTH-005** [TECH]  
Session state must be listened to via `supabase.auth.onAuthStateChange()` in the root `AuthProvider`.

**TR-AUTH-006** [TECH]  
On auth state change to `SIGNED_OUT`, the application must clear all user state and redirect to the login page.

**TR-AUTH-007** [TECH]  
The application must call `supabase.auth.getSession()` on mount to restore an existing session.

---

## 5. Row Level Security Requirements

**TR-RLS-001** [PRODUCT → TECH]  
RLS must be enabled on all tables: `businesses`, `business_members`, `customers`, `business_customers`, `categories`, `products`, `loyalty_rules`, `points_transactions`, `rewards`, `reward_redemptions`, `purchases`, `qr_codes`, `notifications`.

**TR-RLS-002** [TECH]  
RLS policies must use `auth.uid()` for user identification.

**TR-RLS-003** [TECH]  
Business isolation must be enforced via a helper pattern: "user is a member of `business_members` for this `business_id`."

**TR-RLS-004** [TECH]  
Customer data isolation must be enforced via: "customer profile's `user_id = auth.uid()`".

**TR-RLS-005** [TECH]  
Public read access must be limited to: Business profile, active Products, active Rewards, and Loyalty Rules. These are required for the join page to render without authentication.

**TR-RLS-006** [TECH]  
RLS policies must prevent a Business from reading or writing another Business's data even if the `business_id` is passed explicitly in a query.

**TR-RLS-007** [TECH]  
All policies must be reviewed as part of pre-launch security audit. See SECURITY_RBAC_RLS.md.

---

## 6. Multi-Tenant Architecture Requirements

**TR-MT-001** [PRODUCT → TECH]  
Every Business-owned table must have a `business_id` column as a foreign key to `businesses.id`.

**TR-MT-002** [PRODUCT → TECH]  
All queries against Business-owned tables must include `WHERE business_id = ?` even when RLS would enforce it, as an additional defence-in-depth layer.

**TR-MT-003** [TECH]  
The `AuthContext` must track the `activeBusiness` for Business Owner and Staff users, and all API calls must use the `activeBusiness.id`.

**TR-MT-004** [TECH]  
When a Business Owner has multiple Businesses, the Business Switcher component must allow switching the `activeBusiness` without logging out.

---

## 7. Storage Requirements

**TR-STOR-001** [TECH]  
A Supabase Storage bucket named `cafe-assets` must exist with public read access.

**TR-STOR-002** [TECH]  
Storage RLS must ensure:
- Public: SELECT from `cafe-assets`
- Authenticated: INSERT, UPDATE to `cafe-assets`

**TR-STOR-003** [TECH]  
Business logo upload must use `supabase.storage.from('cafe-assets').upload(path, file)`.

**TR-STOR-004** [TECH]  
Public URLs for assets must be generated using `supabase.storage.from('cafe-assets').getPublicUrl(path)`.

---

## 8. Realtime Requirements

**TR-RT-001** [TECH]  
The `reward_redemptions` table must be published to the Supabase Realtime publication.

**TR-RT-002** [TECH]  
The Staff Counter terminal may subscribe to Realtime updates on `reward_redemptions` for live status updates (OPEN DECISION — OQ-019: whether Realtime is used for counter UX or polling is sufficient).

---

## 9. API / Service Layer Requirements

**TR-API-001** [TECH]  
All Supabase data access must be encapsulated in `src/services/api.ts`.

**TR-API-002** [TECH]  
A data adapter (`src/services/adapter.ts`) must translate between Supabase snake_case column names and TypeScript camelCase interface properties.

**TR-API-003** [TECH]  
The service layer must support a fallback mock store for development when Supabase is not configured. The mock store must clearly be identified as development-only.

**TR-API-004** [TECH]  
API functions must return typed responses matching the interfaces in `src/types/index.ts`.

**TR-API-005** [TECH]  
Errors from Supabase must be caught and re-thrown with informative messages.

---

## 10. Data Validation Requirements

**TR-VAL-001** [TECH]  
All form inputs must be validated on the client side before submission.

**TR-VAL-002** [TECH]  
Validation rules from SRS Section 7 must be implemented as validation functions or a validation library.

**TR-VAL-003** [TECH]  
Database-level constraints (CHECK constraints, UNIQUE constraints, NOT NULL) must mirror client-side validation rules.

**TR-VAL-004** [TECH]  
Any validation error from Supabase must be caught and surfaced with a user-friendly message.

---

## 11. Error Handling Requirements

**TR-ERR-001** [TECH]  
All `async` functions in the service layer must wrap Supabase calls in try/catch.

**TR-ERR-002** [TECH]  
Errors must be propagated to the component layer where they are displayed to the user via Toast or inline error messages.

**TR-ERR-003** [TECH]  
The application must never display raw Supabase error objects to the end user.

**TR-ERR-004** [TECH]  
A global error boundary must be implemented at the application root to catch unhandled React errors.

---

## 12. Security Requirements

**TR-SEC-001** [TECH]  
The Supabase anon key must be treated as a public key. All security enforcement must happen via RLS, not by keeping the anon key secret.

**TR-SEC-002** [TECH]  
Redemption Ticket codes must be generated using `crypto.getRandomValues()`, not `Math.random()`.

**TR-SEC-003** [TECH]  
The application must not store sensitive user data in localStorage beyond what Supabase Auth manages internally.

**TR-SEC-004** [TECH]  
HTTP security headers must be configured via Vercel's `vercel.json` or `next.config.js`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

**TR-SEC-005** [TECH]  
CORS for the Supabase project must be configured to allow only the production domain and localhost in development.

---

## 13. Performance Requirements

**TR-PERF-001** [TECH]  
The Vite build must use code splitting (React Router lazy loading) to avoid a single large bundle.

**TR-PERF-002** [TECH]  
Images in the Business Dashboard and Customer app must be loaded with appropriate size constraints.

**TR-PERF-003** [TECH]  
Supabase queries must use `.select()` with explicit column lists rather than `*` where possible, to minimise payload size.

**TR-PERF-004** [TECH]  
The `points_transactions` table must be indexed on `(customer_id, business_id)` and `(business_id)` for efficient queries.

**TR-PERF-005** [TECH]  
The `reward_redemptions` table must be indexed on `code` for fast code lookup during verification.

---

## 14. Environment Configuration

**TR-ENV-001** [TECH]  
Environment variables must follow the Vite convention: prefixed with `VITE_` for client-accessible variables.

**TR-ENV-002** [TECH]  
A `.env.example` file must be maintained in the repository with placeholder values. The actual `.env` must be in `.gitignore`.

**TR-ENV-003** [TECH]  
The production environment must be configured on Vercel with the following variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**TR-ENV-004** [TECH]  
The development environment must be defined in `.env.local` (not `.env`).

---

## 15. Deployment Requirements

**TR-DEPLOY-001** [TECH]  
The production deployment must be on Vercel, connected to the main branch of the GitHub repository.

**TR-DEPLOY-002** [TECH]  
Preview deployments must be automatically created for all pull requests.

**TR-DEPLOY-003** [TECH]  
The build command is: `npm run build` (or `vite build`).

**TR-DEPLOY-004** [TECH]  
The output directory is: `dist`.

**TR-DEPLOY-005** [TECH]  
Vercel must be configured to serve `index.html` for all routes (SPA fallback) to support client-side routing.

---

## 16. Logging / Monitoring

> **OPEN DECISION — OQ-015**

**TR-LOG-001** [TECH]  
Development-mode errors must be logged to the browser console via `console.error`.

**TR-LOG-002** [TECH]  
Production error monitoring must use a third-party service. Candidates: Sentry, LogRocket. (DECISION REQUIRED — OQ-015.)

**TR-LOG-003** [TECH]  
Supabase logs (Auth, Database, API) are available in the Supabase Dashboard and must be monitored by the platform team.

---

## 17. Backup and Recovery

**TR-BCK-001** [TECH]  
Supabase Pro tier provides automatic daily backups. If on the free tier, manual backup strategy must be documented. (DECISION REQUIRED — OQ-020: Supabase plan selection.)

**TR-BCK-002** [TECH]  
The migration SQL files in `supabase/migrations/` serve as the authoritative schema definition and must be kept up to date.

**TR-BCK-003** [TECH]  
The `points_transactions` ledger is append-only; no delete policy is required. Data in this table is the authoritative points history.

---

## 18. External Integrations

**None confirmed for MVP.**

> **OPEN REQUIREMENT — OQ-001:** POS integration is explicitly deferred.  
> **OPEN REQUIREMENT — OQ-021:** SMS OTP delivery is handled by Supabase Auth (Twilio or similar). The plan and cost model must be confirmed.

---

## 19. Technical Dependencies

| Dependency | Purpose | Version |
|-----------|---------|---------|
| `react` | UI framework | 19.x |
| `react-dom` | DOM rendering | 19.x |
| `react-router-dom` | Client-side routing | 7.x |
| `typescript` | Type safety | 6.x |
| `vite` | Build tool | 8.x |
| `@supabase/supabase-js` | Supabase client | Latest |
| `lucide-react` | Icon library | Latest |
| `qrcode.react` | QR code generation | Latest |
| `oxlint` | Linting | Latest |

---

## 20. Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| TR-RISK-001: Supabase free tier limits | Service outage if request limits hit | Monitor usage; plan upgrade path |
| TR-RISK-002: SMS OTP cost and delivery reliability | Customer join flow fails | Have email OTP as confirmed fallback |
| TR-RISK-003: RLS misconfiguration | Data leak between tenants | Pre-launch security audit; automated RLS test suite |
| TR-RISK-004: Points balance desync | `total_points` in `business_customers` diverges from ledger sum | Scheduled reconciliation job or recompute-from-ledger approach |
| TR-RISK-005: Redemption double-submission | Customer charged twice | Idempotency check at ticket creation; database UNIQUE constraint on code |
| TR-RISK-006: Missing mock-to-production migration | Features work in mock mode but fail with real Supabase | All features must be tested against real Supabase before release |

---

*Document version 0.1 — Documentation-first phase.*
