# Super Admin Dashboard — BACKEND Implementation Plan

> **Status:** 🟡 In Progress (Phases B1–B6 complete, B7 pending)
> **Last Updated:** 2026-03-19
> **Stack:** NestJS, Prisma ORM, PostgreSQL
> **Backend Location:** `ibms-backend/`
> **API Prefix:** All routes are prefixed with `/api/v1/` (set in `main.ts`)

---

## ⚠️ AI INSTRUCTIONS — READ BEFORE CODING

1. **Check boxes** `[x]` as you complete each item.
2. **Do NOT skip items.** Complete them in order within each phase.
3. **Run `npx prisma db push`** after every schema change to sync the database.
4. **Run `npx prisma generate`** after schema changes to update the Prisma client types.
5. **Verify each API endpoint** returns correct data before moving to the next task.
6. **Do NOT touch the frontend.** This plan is backend-only.
7. The existing backend uses NestJS modules. Every new feature needs: Module + Service + Controller + DTOs.
8. Existing auth uses JWT (`JwtAuthGuard`) and role-based access (`RolesGuard` + `@Roles()` decorator).
9. The existing role hierarchy is in `src/common/constants/role-hierarchy.ts`. `PLATFORM_SUPER_ADMIN` is level 8.

---

## PHASE B1: Database Schema Expansion ✅

> **Goal:** Add all missing Prisma models needed by the Super Admin Dashboard.
> **File:** `ibms-backend/prisma/schema.prisma`

### B1.1 — Extend existing `Tenant` model
- [x] Add field `subdomain String? @unique`
- [x] Add field `billingCycle BillingCycle @default(MONTHLY)`
- [x] Add field `tenantStatus TenantStatus @default(ACTIVE)`
- [x] Add field `trialEndsAt DateTime?`
- [x] Add field `adminEmail String?`
- [x] Add field `storageUsedMb Float @default(0)`
- [x] Add field `customOnboardingNotes String?`
- [x] Verify no conflicts with existing fields

### B1.2 — Create `Subscription` model
- [x] Fields: id (uuid), tenantId, plan, billingCycle, amountGhs (Decimal), status, currentPeriodStart, currentPeriodEnd, paystackSubscriptionId?, createdAt, updatedAt
- [x] Relation: `tenant Tenant @relation(fields: [tenantId])`
- [x] Indexes: `tenantId`, `status`

### B1.3 — Create `PlatformPayment` model
- [x] Fields: id (uuid), tenantId, subscriptionId, amountGhs (Decimal), status, paystackReference?, invoiceNumber?, paidAt?, createdAt
- [x] Relations: tenant, subscription
- [x] Indexes: `tenantId`, `subscriptionId`, `status`

### B1.4 — Create `PlatformAuditLog` model
- [x] Full schema with category/severity enums, actor relations, immutable design
- [x] Indexes: `tenantId`, `actorId`, `category`, `severity`, `createdAt`, `status`

### B1.5 — Create `SystemHealthCheck` model
- [x] Fields: id (uuid), serviceName, status, responseTimeMs, checkedAt, errorMessage?

### B1.6 — Create `Incident` model
- [x] Fields: id, title, status, severity, affectedServices, timestamps, createdBy relation

### B1.7 — Create `ErrorLog` model
- [x] Full fields including occurrence tracking and resolution

### B1.8 — Create `BackgroundJob` model
- [x] Full fields with retry logic and priority

### B1.9 — Create `EmailLog` model
- [x] Full fields with delivery status tracking

### B1.10 — Create `Announcement` + `AnnouncementRead` models
- [x] Both models with relations and targeting system

### B1.11 — Create `FeatureFlag` + `FeatureFlagOverride` models
- [x] Plan-level toggles + tenant-specific overrides

### B1.12 — Create `PlatformSetting` model
- [x] Key-value store for platform configuration

### B1.13 — Create `NicCompliance` model
- [x] One-to-one with Tenant, compliance scoring

### B1.14 — Run Migration
- [x] Execute `npx prisma db push` successfully with no errors
- [x] Execute `npx prisma generate` to regenerate client types
- [x] Verify backend compiles and starts without errors

---

## PHASE B2: Core Services & Utilities ✅

> **Goal:** Create shared services that all Super Admin controllers will depend on.

### B2.1 — PlatformAuditLog Service
- [x] Create `src/platform-admin/services/platform-audit.service.ts`
- [x] Method: `log(payload)` — full audit trail recording
- [x] Method: `findAll(params)` — paginated, filterable query
- [x] Injected into every super admin controller

### B2.2 — System Health Service
- [x] Create `src/platform-admin/services/system-health.service.ts`
- [x] Method: `checkAll()` — checks DB, Jobs, Email
- [x] Method: `checkDatabase()` — SELECT 1 + timing
- [x] Method: `getHealthHistory(serviceName, hours)`
- [x] Method: `getUptimeHistory(days)`
- [x] Method: `getDatabaseStats()` — connection count, db size

### B2.3 — Super Admin Guard
- [x] Using existing `@Roles('PLATFORM_SUPER_ADMIN', 'SUPER_ADMIN')` on every controller

### B2.4 — Platform Admin Module
- [x] Create `src/platform-admin/platform-admin.module.ts`
- [x] All 14 controllers + 2 services registered
- [x] Module registered in `app.module.ts`

---

## PHASE B3: Overview & System Health APIs ✅

### B3.1 — Overview Controller
- [x] `GET /platform-admin/overview/stats` — Business metrics (MRR, ARR, tenants, errors, sessions)
- [x] `GET /platform-admin/overview/charts` — 12-month tenant growth, revenue, MRR by plan
- [x] `GET /platform-admin/overview/activity-feed` — Last 20 audit log entries
- [x] `GET /platform-admin/overview/top-tenants` — Top 5 by policy count

### B3.2 — System Health Controller
- [x] `GET /platform-admin/system-health` — All service health checks
- [x] `GET /platform-admin/system-health/db` — Database health + stats
- [x] `GET /platform-admin/system-health/uptime-history` — 90-day history
- [x] `GET /platform-admin/system-health/incidents` — Incident list
- [x] `POST /platform-admin/system-health/incidents` — Create incident
- [x] `PATCH /platform-admin/system-health/incidents/:id` — Update/resolve incident

---

## PHASE B4: Tenant & User Management APIs ✅

### B4.1 — Tenant Management Controller
- [x] `GET /platform-admin/tenants` — Paginated, filterable tenant list
- [x] `POST /platform-admin/tenants` — Create tenant + admin user + subscription + NIC compliance
- [x] `GET /platform-admin/tenants/:id` — Full tenant detail
- [x] `PATCH /platform-admin/tenants/:id` — Update tenant
- [x] `DELETE /platform-admin/tenants/:id` — Delete tenant (with audit)
- [x] `POST /platform-admin/tenants/:id/suspend` — Suspend with reason
- [x] `POST /platform-admin/tenants/:id/activate` — Reactivate
- [x] `GET /platform-admin/tenants/:id/health` — Tenant-specific health
- [x] `POST /platform-admin/tenants/:id/export` — Export tenant data

### B4.2 — User Management Controller
- [x] `GET /platform-admin/users` — Cross-tenant user list
- [x] `POST /platform-admin/users` — Create super admin
- [x] `PATCH /platform-admin/users/:id` — Update role/status
- [x] `DELETE /platform-admin/users/:id` — Soft delete
- [x] `POST /platform-admin/users/:id/reset-password` — Force reset
- [x] `POST /platform-admin/users/:id/force-logout` — Invalidate sessions
- [x] `POST /platform-admin/users/:id/unlock` — Clear lockout
- [x] `GET /platform-admin/users/online` — Online users (last 30min)

### B4.3 — Impersonation Controller
- [x] `POST /platform-admin/impersonate/:tenantId/start` — Generate impersonation token
- [x] `POST /platform-admin/impersonate/exit` — End impersonation

---

## PHASE B5: Billing, NIC & Error APIs ✅

### B5.1 — Billing Controller
- [x] `GET /platform-admin/billing/subscriptions` — Paginated subscription list
- [x] `GET /platform-admin/billing/subscriptions/:id` — Subscription detail + payments
- [x] `PATCH /platform-admin/billing/subscriptions/:id` — Update subscription
- [x] `GET /platform-admin/billing/payments` — Paginated payment list

### B5.2 — NIC Compliance Controller
- [x] `GET /platform-admin/nic-monitoring` — All compliance records
- [x] `PATCH /platform-admin/nic-monitoring/:tenantId` — Update compliance data

### B5.3 — Error Tracking Controller
- [x] `GET /platform-admin/errors` — Paginated, filterable error log list
- [x] `PATCH /platform-admin/errors/:id` — Resolve/add notes

### B5.4 — Audit Logs Controller
- [x] `GET /platform-admin/audit-logs` — Full audit log query with all filters
- [x] `GET /platform-admin/audit-logs/:id` — Single log entry detail
- [x] **NO PUT/PATCH/DELETE** — immutable

---

## PHASE B6: Operations APIs ✅

### B6.1 — Background Jobs Controller
- [x] `GET /platform-admin/jobs` — Filterable job list
- [x] `POST /platform-admin/jobs/:id/retry` — Re-queue failed job
- [x] `DELETE /platform-admin/jobs/:id/discard` — Discard job

### B6.2 — Email Logs Controller
- [x] `GET /platform-admin/email-logs` — Filterable email log list
- [x] `POST /platform-admin/email-logs/:id/resend` — Resend failed email

### B6.3 — Announcements Controller
- [x] `GET /platform-admin/announcements` — List announcements
- [x] `POST /platform-admin/announcements` — Create announcement
- [x] `DELETE /platform-admin/announcements/:id` — Delete announcement

### B6.4 — Feature Flags Controller
- [x] `GET /platform-admin/feature-flags` — List all flags with override counts
- [x] `POST /platform-admin/feature-flags` — Create new flag
- [x] `PATCH /platform-admin/feature-flags/:id` — Toggle flags
- [x] `DELETE /platform-admin/feature-flags/:id` — Delete flag

### B6.5 — Settings Controller
- [x] `GET /platform-admin/settings` — Read all platform settings
- [x] `PATCH /platform-admin/settings` — Update settings (key-value batch)

---

## PHASE B7: Seed Data & Final Verification

> **Status:** 🟢 Done

### B7.1 — Seed Script Updates
- [x] Update `prisma/seed.ts` to create sample data for new tables:
  - [x] 2-3 subscriptions (one per tenant)
  - [x] 5-10 sample payments
  - [x] 15-20 sample platform audit log entries
  - [x] 5-10 sample error logs
  - [x] 10-15 sample background jobs (mix of statuses)
  - [x] 5-10 sample email logs
  - [x] 2-3 sample announcements
  - [x] 10-15 feature flags with default toggles
  - [x] NIC compliance records (one per tenant)
  - [x] 2-3 sample system health checks
  - [x] Sample platform settings (SMTP config, NIC rates, etc.)

### B7.2 — Final Backend Verification
- [x] Backend compiles without TypeScript errors
- [x] Backend starts successfully
- [x] All new API routes are accessible (test with curl/Postman)
- [x] All routes return proper JSON structure: `{ data: ..., meta?: { page, total } }`
- [x] All mutation routes create audit log entries
- [x] Error tracking captures exceptions in `ErrorLog` table

---

## FILE MAP (What was created)

```
ibms-backend/
├── prisma/
│   └── schema.prisma                          (MODIFIED — 13 new models, 6 new enums, Tenant extended)
├── src/
│   ├── platform-admin/
│   │   ├── platform-admin.module.ts           (NEW ✅)
│   │   ├── guards/                            (directory created)
│   │   ├── services/
│   │   │   ├── platform-audit.service.ts      (NEW ✅)
│   │   │   └── system-health.service.ts       (NEW ✅)
│   │   └── controllers/
│   │       ├── overview.controller.ts         (NEW ✅)
│   │       ├── system-health.controller.ts    (NEW ✅)
│   │       ├── tenant-management.controller.ts(NEW ✅)
│   │       ├── user-management.controller.ts  (NEW ✅)
│   │       ├── impersonation.controller.ts    (NEW ✅)
│   │       ├── billing.controller.ts          (NEW ✅)
│   │       ├── nic-compliance.controller.ts   (NEW ✅)
│   │       ├── error-tracking.controller.ts   (NEW ✅)
│   │       ├── audit-logs.controller.ts       (NEW ✅)
│   │       ├── background-jobs.controller.ts  (NEW ✅)
│   │       ├── email-logs.controller.ts       (NEW ✅)
│   │       ├── announcements.controller.ts    (NEW ✅)
│   │       ├── feature-flags.controller.ts    (NEW ✅)
│   │       └── settings.controller.ts         (NEW ✅)
│   └── app.module.ts                          (MODIFIED ✅ — PlatformAdminModule registered)
```
