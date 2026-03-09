# 🎯 MASTER KILLIAN PLAN

## IBMS Full-Stack Security & Production Hardening

**Date:** 2026-03-07
**Sources:** 5 independent audits — My Audit + Kombai AI + Senior Engineer + Comprehensive Security + v4 Plan
**Total Items:** 53 tracked fixes across 5 phases
**Status:** READY TO BUILD

---

## Executive Summary

The IBMS codebase has solid architectural foundations (NestJS + Prisma + Next.js, multi-tenancy, audit logging, role-based access) but contains **critical issues** that prevent production deployment. The backend routes are unreachable (double prefix), the auth integration is broken (role casing, response shape), and there are serious security vulnerabilities (O(n) bcrypt scan, plaintext invitation tokens).

**Overall Health Score: 5.5 / 10**

### Top 5 Blockers
1. **26 controllers have doubled route prefix** — all API routes return 404
2. **O(n) bcrypt scan on refresh/logout/reset** — trivial DoS vector
3. **Frontend/backend role casing mismatch** — all permission checks fail
4. **checkAuth() expects wrong response shape** — auth always fails on page reload
5. **Invitation tokens stored in plaintext** — DB leak exposes all pending invites

---

## PHASE 1 — Unblock Backend + Auth (Day 1–2)

*These are hard blockers: without them the backend serves no routes and auth is broken.*

### 1A. Fix double route prefix (26 controllers)
- **What:** Remove `api/v1/` from `@Controller()` in ALL 26 affected files. `main.ts` already sets `app.setGlobalPrefix('api/v1')`, so controllers should only specify their resource name.
- **Correct files (no change needed):** `auth.controller.ts`, `users.controller.ts`, `invitations.controller.ts`, `health.controller.ts`
- **Files to fix (26):**

| Controller | Current Path | Fix To |
|---|---|---|
| `audit.controller.ts` | `'api/v1/audit'` | `'audit'` |
| `approvals.controller.ts` | `'api/v1/approvals'` | `'approvals'` |
| `tasks.controller.ts` | `'api/v1/tasks'` | `'tasks'` |
| `settings.controller.ts` | `'api/v1/settings'` | `'settings'` |
| `reports.controller.ts` | `'api/v1/reports'` | `'reports'` |
| `clients.controller.ts` | `'api/v1/clients'` | `'clients'` |
| `departments.controller.ts` | `'api/v1/departments'` | `'departments'` |
| `chat.controller.ts` | `'api/v1/chat'` | `'chat'` |
| `compliance.controller.ts` | `'api/v1/compliance'` | `'compliance'` |
| `policies.controller.ts` | `'api/v1/policies'` | `'policies'` |
| `claims.controller.ts` | `'api/v1/claims'` | `'claims'` |
| `carriers.controller.ts` | `'api/v1/carriers'` | `'carriers'` |
| `documents.controller.ts` | `'api/v1/documents'` | `'documents'` |
| `notifications.controller.ts` | `'api/v1/notifications'` | `'notifications'` |
| `leads.controller.ts` | `'api/v1/leads'` | `'leads'` |
| `calendar.controller.ts` | `'api/v1/calendar/events'` | `'calendar/events'` |
| `carrier-products.controller.ts` | `'api/v1/carriers/:carrierId/products'` | `'carriers/:carrierId/products'` |
| `transactions.controller.ts` | `'api/v1/transactions'` | `'transactions'` |
| `expenses.controller.ts` | `'api/v1/expenses'` | `'expenses'` |
| `finance-dashboard.controller.ts` | `'api/v1/finance/dashboard'` | `'finance/dashboard'` |
| `premium-financing.controller.ts` | `'api/v1/premium-financing'` | `'premium-financing'` |
| `commissions.controller.ts` | `'api/v1/commissions'` | `'commissions'` |
| `invoices.controller.ts` | `'api/v1/invoices'` | `'invoices'` |
| `renewals.controller.ts` | `'api/v1'` | `'renewals'` |
| `complaints.controller.ts` | `'api/v1'` | `'complaints'` |

### 1B. Fix missing roles in ROLE_LEVEL
- **File:** `ibms-backend/src/common/constants/role-hierarchy.ts`
- **What:** Add the 4 roles used in `@Roles()` decorators but missing from the hierarchy:
  - `COMPLIANCE_OFFICER: 4`
  - `FINANCE_MANAGER: 4`
  - `UNDERWRITER: 3`
  - `AGENT: 2`

### 1C. Fix frontend/backend role enum mismatch
- **Files:** `src/types/index.ts`, `src/stores/auth-store.ts`
- **What:** Change all `UserRole` values to UPPERCASE to match backend enum. Update `ROLE_HIERARCHY` keys and `PERMISSIONS` keys in auth-store to UPPERCASE. Add missing roles: `COMPLIANCE_OFFICER`, `FINANCE_MANAGER`, `UNDERWRITER`, `AGENT`.

### 1D. Fix checkAuth() response shape mismatch
- **File:** `src/stores/auth-store.ts` — `checkAuth()` method
- **Problem:** Calls `/auth/refresh`, expects `{ accessToken, user }` — backend returns `{ accessToken }` only
- **Fix:** After getting `accessToken`, make a second call to `/auth/me` to get the user object

### 1E. Fix hardcoded tenant slug + add tenant selection UI
- **File:** `src/stores/auth-store.ts` — remove default `'sic-insurance'` from `login()`, require `tenantSlug` parameter
- **File:** `src/components/ui/sign-in.tsx` — add tenant slug text input field to login form

---

## PHASE 2 — Security Critical (Day 2–3)

### 2A. Fix O(n) bcrypt scan — Refresh tokens
- **Files:** `ibms-backend/src/auth/auth.service.ts`, `ibms-backend/prisma/schema.prisma`
- **What:**
  - Add `tokenFamily String?` column to `RefreshToken` model
  - Add `@@index([tokenFamily])` to schema
  - Create Prisma migration
  - Update `issueRefreshToken()` to store `raw.substring(0, 16)` as `tokenFamily`
  - Update `refreshTokens()`, `logout()` to filter by `tokenFamily` before `bcrypt.compare()`

### 2B. Fix O(n) bcrypt scan — Password resets
- **File:** `ibms-backend/src/auth/auth.service.ts`
- **What:**
  - Add `tokenFamily String?` column to `PasswordReset` model + index
  - Update `forgotPassword()` to store prefix
  - Update `resetPassword()` to filter by prefix
  - Add password strength validation in `resetPassword()`: reject if `newPassword.length < 8` (defense-in-depth)

### 2C. Hash invitation tokens at rest
- **File:** `ibms-backend/src/invitations/invitations.service.ts`
- **What:**
  - Generate raw token, `bcrypt.hash()` it, store the hash + `tokenFamily` prefix
  - Update `validate()` and `accept()` to use `bcrypt.compare()` instead of `findFirst({ where: { token } })`
  - Prisma schema: add `tokenFamily` column to `Invitation` model

### 2D. Real email for invitations AND password reset (Resend)
- **What:**
  - `npm install resend` in ibms-backend
  - Add `RESEND_API_KEY` and `EMAIL_FROM` to env schema (`ibms-backend/src/config/env.validation.ts`)
  - Create `ibms-backend/src/notifications/email.service.ts` — wrapper around Resend SDK with methods: `sendInvite()`, `sendPasswordReset()`
  - In `InvitationsService.create()`: call `emailService.sendInvite(email, rawToken, inviteUrl)` — remove `logger.log` of URL
  - In `AuthService.forgotPassword()`: call `emailService.sendPasswordReset(email, rawToken, resetUrl)` — remove `logger.log` of URL + token

### 2E. Remove token URLs from logs
- **File:** `ibms-backend/src/auth/auth.service.ts` — remove raw token from logger; just log `'Password reset email sent to: ' + email`
- **File:** `ibms-backend/src/invitations/invitations.service.ts` — remove raw token from logger; just log `'Invite sent to: ' + email`

### 2F. Restrict WebSocket CORS
- **File:** `ibms-backend/src/chat/chat.gateway.ts`
- **What:** Change `cors: { origin: '*' }` to `cors: { origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'], credentials: true }`

### 2G. Switch auth store to sessionStorage
- **File:** `src/stores/auth-store.ts`
- **What:** Replace the persist storage adapter with a custom `sessionStorage` adapter (data clears when browser tab closes, reducing exposure on shared machines)

### 2H. Remove DEV DEBUG console.error
- **File:** `ibms-backend/src/common/filters/global-exception.filter.ts`
- **What:** Remove both `console.error('*** DEV DEBUG ***', ...)` lines that leak internal exception details to stdout

### 2I. Docker Compose env var substitution
- **File:** `ibms-backend/docker-compose.yml`
- **What:** Replace hardcoded `POSTGRES_DB/USER/PASSWORD` with env var substitution: `${POSTGRES_DB:-ibms}`, `${POSTGRES_USER:-ibms}`, `${POSTGRES_PASSWORD:?must be set}`

---

## PHASE 3 — High Priority Logic Bugs (Day 3–5)

### 3A. Fix race conditions in all number generators (7 services)
- **Files:**
  - `ibms-backend/src/policies/policies.service.ts`
  - `ibms-backend/src/clients/clients.service.ts`
  - `ibms-backend/src/claims/claims.service.ts`
  - `ibms-backend/src/leads/leads.service.ts`
  - `ibms-backend/src/finance/transactions/transactions.service.ts`
  - `ibms-backend/src/finance/invoices/invoices.service.ts`
  - `ibms-backend/src/finance/commissions/commissions.service.ts`
- **Strategy:** Add a random hex suffix (`crypto.randomBytes(3).toString('hex').toUpperCase()`) to each generated number to prevent collisions under concurrency. Scope all `count()` calls to `tenantId`.

### 3B. Fix renewal number collision
- **File:** `ibms-backend/src/renewals/renewals.service.ts`
- **What:** Change `${oldPolicy.policyNumber}-REN` → `${oldPolicy.policyNumber}-REN-${Date.now().toString(36).slice(-4).toUpperCase()}` to prevent suffix stacking on repeated renewals

### 3C. Wrap lapse() and reinstate() in transactions
- **File:** `ibms-backend/src/policies/policies.service.ts`
- **What:** Wrap `policy.update` + `auditLog.create` in `prisma.$transaction()` for both methods. Currently if audit log fails, the status change persists without a record.

### 3D. Add status validation to reinstate()
- **File:** `ibms-backend/src/policies/policies.service.ts`
- **What:** Check `policy.status` is `LAPSED` or `CANCELLED` before reinstating. Currently any policy status can be "reinstated".

### 3E. Fix sortBy column injection
- **File:** `ibms-backend/src/policies/policies.service.ts`
- **What:** Add `VALID_SORT_COLUMNS` allowlist, replace `[sortBy as keyof...]` with validated value. Prevents schema probing via arbitrary column names.

### 3F. Fix useCancelPolicy missing effectiveDate
- **File:** `src/hooks/api/use-policies.ts`
- **What:** Add `effectiveDate: string` to mutation params and POST body. Backend `CancelPolicyDto` requires it — without it every cancel attempt returns 400.

### 3G. Connect forgot-password page to real API
- **File:** `src/app/(auth)/forgot-password/page.tsx`
- **What:** Replace `setTimeout` simulation with `apiClient.post('/auth/forgot-password', { email })`

### 3H. Connect reset-password page to real API
- **File:** `src/app/(auth)/reset-password/page.tsx`
- **What:** Read `?token=` from searchParams, replace `setTimeout` with `apiClient.post('/auth/reset-password', { token, password })`

### 3I. Remove ignoreBuildErrors from next.config.ts
- **File:** `next.config.ts`
- **What:** Remove the `typescript: { ignoreBuildErrors: true }` block entirely. Fix all resulting TypeScript errors.
- **Note:** Do this LAST in Phase 3, after all other TS-affecting changes are complete.

### 3J. Migrate 20+ frontend pages from mock stubs to real API hooks
- **Source:** v4 plan finding — pages still import from `stubs.ts` instead of real API hooks
- **Files:** Every dashboard page that calls data from stubs (dashboard, clients, policies, claims, leads, finance, tasks, etc.)
- **Strategy:** For each page, replace stub imports with the corresponding real hook from `src/hooks/api/` (`use-policies`, `use-clients`, `use-claims`, `use-leads`, etc.). Handle loading and error states properly.

### 3K. Remove no-op empty update in renewals.service.ts
- **File:** `ibms-backend/src/renewals/renewals.service.ts`
- **What:** Remove the `tx.policy.update({ where: { id: oldPolicy.id }, data: {} })` call — it is a wasted DB round-trip with no effect

### 3L. Integrate notification store with backend API
- **File:** `src/stores/notification-store.ts`
- **What:** Replace client-side-only store with real API calls: `apiClient.get('/notifications')` for fetching, `apiClient.patch('/notifications/:id/read')` for marking read. Currently notifications are lost on page refresh.

---

## PHASE 4 — Medium Priority (Sprint 2)

### 4A. Fix tenant cache null-miss
- **File:** `ibms-backend/src/tenants/tenants.service.ts`
- **What:** Refactor `getFromCache()` to return `{ found: boolean, value: Tenant | null }` to distinguish cache miss from cached-null. Currently non-existent tenants hit the DB on every request.

### 4B. Fix soft-delete middleware documentation
- **File:** `ibms-backend/src/prisma/prisma.service.ts`
- **What:** Add clear comment explaining `findUnique→findFirst` conversion and its implications. Consider Prisma client extensions as alternative.

### 4C. Fix useClickOutside stale closure
- **File:** `src/hooks/use-click-outside.ts`
- **What:** Use `useRef` for handler, set empty deps array `[]` to prevent listener churn on every render

### 4D. Fix window as any in click-origin.ts
- **File:** `src/lib/click-origin.ts`
- **What:** Replace `(window as any).__ibmsLastClick` with a module-scoped `let lastClick = { x: 0, y: 0 }` variable

### 4E. Fix XSS in generate-receipt.ts
- **File:** `src/lib/generate-receipt.ts`
- **What:** Add `escapeHtml()` utility, wrap all dynamic template literal values before `document.write()` to prevent script injection via client names, descriptions, etc.

### 4F. Fix CSV escaping in dashboard export
- **File:** `src/app/dashboard/page.tsx`
- **What:** Add `escapeCsvCell()` that quotes cells containing commas, quotes, or newlines

### 4G. Fix not-found.tsx duplicate html/body
- **File:** `src/app/not-found.tsx`
- **What:** Replace `<html><body>...</body></html>` wrapper with a plain `<div>`. Next.js root layout already provides document structure.

### 4H. Remove deprecated logger from QueryClient
- **File:** `src/lib/query-client.ts`
- **What:** Remove the `logger: { log, warn, error }` block (removed in TanStack Query v5, this is dead code)

### 4I. Fix RequestWithUser interface duplication
- **Files:** `ibms-backend/src/clients/clients.controller.ts`, `ibms-backend/src/carriers/products/carrier-products.controller.ts`
- **What:** Import `AuthenticatedRequest` from `common/types/request.types.ts` instead of re-declaring the interface (some files have it declared twice)

### 4J. Remove hardcoded Kwame Asante defaults from profile-store
- **File:** `src/stores/profile-store.ts`
- **What:** Replace all hardcoded personal/company defaults ("Kwame Asante", "Asante & Sons Brokerage", etc.) with empty strings or null

### 4K. Remove MOCK_USER from auth-store.ts
- **File:** `src/stores/auth-store.ts`
- **What:** Delete the `MOCK_USER` constant and any remaining references to it

### 4L. Connect MoMo payment to real API
- **File:** `src/stores/payment-store.ts`
- **What:** Replace `setTimeout` simulation with `apiClient.post('/transactions', { ...transactionData, paymentMethod: 'MOBILE_MONEY' })`. Also replaces insecure `Math.random()` IDs.

### 4M. Remove default credentials from .env.example
- **File:** `ibms-backend/.env.example`
- **What:** Replace the `DATABASE_URL` default (`ibms_dev_password`) with a clearly labelled placeholder

### 4N. Change Swagger default to false
- **File:** `ibms-backend/src/main.ts`
- **What:** Change `configService.get<boolean>('swagger.enabled', true)` → default to `false`

### 4O. Add error boundary to dashboard
- **File:** `src/app/dashboard/layout.tsx`
- **What:** Wrap children in a React `ErrorBoundary` component to catch rendering errors gracefully

### 4P. Add HTTPS enforcement via Helmet HSTS
- **File:** `ibms-backend/src/main.ts`
- **What:** Add `hsts: { maxAge: 31536000, includeSubDomains: true }` to helmet config

### 4Q. Implement CSRF protection
- **File:** `ibms-backend/src/main.ts`
- **What:** Add csurf or double-submit cookie pattern for all state-changing endpoints

### 4R. Fix api-client.ts hard redirect on 401
- **File:** `src/lib/api-client.ts`
- **What:** Replace `window.location.href = '/login'` with a call to the auth store's `logout()` / Next.js `router.push()` to handle navigation correctly within the app and avoid errors during SSR

### 4S. Remove remaining console.log statements
- **Files:** `src/components/features/settings/settings-users.tsx` and any others
- **What:** Remove or gate behind `process.env.NODE_ENV === 'development'`

### 4T. Scope client PII in policy findOne()
- **File:** `ibms-backend/src/policies/policies.service.ts`
- **What:** Replace `client: true` include with a `select` that returns only `id`, `firstName`, `lastName`, `phone`, `email`, `type` — not KYC/AML/PEP/Ghana Card fields

### 4U. Replace `any` types in PolicyDetailResponseDto
- **File:** `ibms-backend/src/policies/dto/policy-response.dto.ts`
- **What:** Replace `any` relation fields with typed interfaces or pick types

### 4V. Add force-password-change for seeded admin user
- **File:** `ibms-backend/prisma/seed.ts`
- **What:** Add a `mustChangePassword: true` flag to the seeded SUPER_ADMIN/TENANT_ADMIN user so they are forced to change the default `Admin@123` password on first login

### 4W. Honor returnUrl on login redirect
- **File:** `src/app/(auth)/login/page.tsx` (or wherever the login success redirect lives)
- **What:** After successful login, read `?returnUrl=` from searchParams and redirect there instead of always going to `/dashboard`

---

## PHASE 5 — Observability & Future (Sprint 3+)

- [ ] Add comprehensive test coverage (unit + integration + e2e)
- [ ] Add two-factor authentication (TOTP)
- [ ] Implement concurrent session limits
- [ ] Add OpenTelemetry tracing + structured JSON logging for production
- [ ] Add health check monitoring for Redis, DB, email service
- [ ] Add request ID tracking across backend logs
- [ ] Add API documentation with rate limit information
- [ ] Add PgBouncer or Prisma connection pooling for production
- [ ] Add Sentry or LogRocket for frontend error reporting

---

## Key Files Modified Per Phase

| Phase | Files |
|---|---|
| **Phase 1** | 26 controller files, `role-hierarchy.ts`, `src/types/index.ts`, `auth-store.ts`, `sign-in.tsx` |
| **Phase 2** | `auth.service.ts`, `invitations.service.ts`, `schema.prisma` (migration), `chat.gateway.ts`, `env.validation.ts`, new `email.service.ts`, `global-exception.filter.ts`, `docker-compose.yml` |
| **Phase 3** | 7 service files for number generators, `renewals.service.ts`, `policies.service.ts`, `use-policies.ts`, `forgot-password/page.tsx`, `reset-password/page.tsx`, `next.config.ts`, `notification-store.ts` |
| **Phase 4** | `tenants.service.ts`, `prisma.service.ts`, `use-click-outside.ts`, `click-origin.ts`, `generate-receipt.ts`, `dashboard/page.tsx`, `not-found.tsx`, `query-client.ts`, `clients.controller.ts`, `carrier-products.controller.ts`, `profile-store.ts`, `payment-store.ts`, `.env.example`, `main.ts`, `dashboard/layout.tsx`, `api-client.ts`, `policy-response.dto.ts`, `seed.ts` |

## Dependencies

- Phase 1 must complete before any frontend testing
- Phase 2A/2B must complete before Phase 2C (same migration batch)
- Phase 2D requires Phase 2E (email service needed before removing log)
- Phase 3I (remove `ignoreBuildErrors`) must come LAST in Phase 3 after all TS errors are resolved

---

## Audit Cross-Reference

This plan consolidates findings from **5 independent audits**:

| Source | Issues Found | False Positives | Unique Contributions |
|---|---|---|---|
| **My Audit** | 26 | 0 | Found all 26 doubled controllers, debug logging, token logging, role casing mismatch |
| **Kombai AI** | 25 | 1 (mock auth claim) | Invitation tokens plaintext, useClickOutside, click-origin, XSS in receipt, CSV escaping |
| **Senior Engineer** | 20 | 0 | WebSocket CORS, missing effectiveDate, QueryClient logger, 401 redirect |
| **Comprehensive Security** | 20 | 1 (mock auth claim) | Tenant selection UI, Docker credentials, Swagger default, CSRF, HSTS |
| **v4 Plan** | 12 | 0 | 20+ pages still on mock stubs, frontend-backend integration gaps |

**False Positive Note:** Two audits (Kombai + Comprehensive) claimed the frontend login is "mock only." This is incorrect — `login()` in `auth-store.ts` makes a real API call via `apiClient.post('/auth/login', ...)`. Their proposed fixes would actually downgrade the existing implementation.

---

*Master Killian Plan — Version 1.0*
*Generated: 2026-03-07*
*Total Items: 53*
*Ready to execute.*
