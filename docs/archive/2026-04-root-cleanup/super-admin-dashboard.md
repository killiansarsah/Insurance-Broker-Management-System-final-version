# Super Admin Dashboard Implementation Plan

> **Status:** 🔴 Not Started
> **Last Updated:** 2026-03-18
> **Architecture:** NestJS (Backend), Prisma (DB), Next.js 15 (Frontend), JWT (Auth)

This document serves as the master checklist for building the complete Brokerium Super Admin Dashboard. Any AI assigned to this project MUST read this file, update the checkboxes upon completing a feature, and verify it working before moving to the next phase.

## Phase 1: Database & Foundation (Backend)
- [ ] **Prisma Schema Updates:**
  - [ ] Add `subscriptions` and `payments` tables.
  - [ ] Add `audit_logs` table (immutable, strict schema).
  - [ ] Add `error_logs` and `background_jobs` tables.
  - [ ] Add `system_health_checks` and `incidents` tables.
  - [ ] Add `email_logs`, `announcements`, `feature_flags`, `nic_compliance`.
- [ ] **Database Migration:** Generate and apply `npx prisma db push` or `prisma migrate dev`.
- [ ] **Backend Services & Utilities:**
  - [ ] `AuditLogService` (`logAuditEvent(payload)` synchronous tracking).
  - [ ] `SystemHealthService` (DB pings, job counts).
  - [ ] Global `withErrorTracking` exception filter enhancement for `error_logs`.

## Phase 2: Frontend Layout & Security Shell
- [ ] **Theme Configuration:** Add Dark teal/green palette, Playfair Display & DM fonts to `tailwind.config.ts`.
- [ ] **Design System Utilities:**
  - [ ] `useLiveMetric` polling hook.
  - [ ] Setup `ImpersonationContext` & persistent top banner.
  - [ ] Shared `StatCard`, `StatusPill`, and `DataTable` components with shimmer loaders.
- [ ] **Super Admin Guard:** Create client-side `SuperAdminGuard` verifying JWT role `PLATFORM_SUPER_ADMIN` or `SUPER_ADMIN`.
- [ ] **Sidebar & Layout:** Implement `/app/(super-admin)/super-admin/layout.tsx` with animated collapsible sidebar.

## Phase 3: Core Dashboards
- [ ] **NestJS Controllers:** `OverviewStats` API, `SystemHealth` API.
- [ ] **Frontend - Overview (`/super-admin/overview`):**
  - [ ] Conditional dismissible alerts.
  - [ ] Live System Status Bar (polling every 30s).
  - [ ] Stat Cards Row 1 & 2 (Animated counters).
  - [ ] Charts Section (Chart.js / Recharts).
- [ ] **Frontend - System Health (`/super-admin/system-health`):**
  - [ ] Live health grid cards.
  - [ ] Response time charts.
  - [ ] Database Health & Error Rate panels.
  - [ ] 90-day Uptime History calendar grid.

## Phase 4: Tenant & User Management
- [ ] **NestJS Controllers:** Tenant CRUD, User search across all tenants, Impersonation API.
- [ ] **Frontend - Tenant List (`/super-admin/tenants`):**
  - [ ] Fully filterable data table with suspension/activation actions.
- [ ] **Frontend - Tenant Detail (`/super-admin/tenants/[id]`):**
  - [ ] Multi-tab layout (Overview, Users, Insurance Data, Billing, NIC Compliance).
  - [ ] "Danger Zone" controls.
- [ ] **Frontend - New Tenant (`/super-admin/tenants/new`):**
  - [ ] 4-step wizard for provisioning a new SaaS tenant.
- [ ] **Frontend - User Management (`/super-admin/users`):**
  - [ ] Live "Online Users" polling panel.
  - [ ] Global user table with force-logout and password reset capabilities.

## Phase 5: Billing, Monitoring & Diagnostics
- [ ] **Subscriptions (`/super-admin/subscriptions`):**
  - [ ] Revenue metrics and charts (MRR, ARR).
  - [ ] Management table for Overdue payments and Plan tiers.
- [ ] **NIC Monitoring (`/super-admin/nic-monitoring`):**
  - [ ] Compliance table (segregation, licence expiry).
  - [ ] Generate consolidated NIC report (PDF).
- [ ] **Error Tracker (`/super-admin/error-tracker`):**
  - [ ] Sentry-style error list and stack-trace drawer.
- [ ] **Audit Logs (`/super-admin/audit-logs`):**
  - [ ] Read-only, infinite-scroll, strictly categorised tracking table.

## Phase 6: Operations & Settings
- [ ] **Background Jobs (`/super-admin/jobs`):**
  - [ ] Queue metrics and failed-job retry table.
- [ ] **Email Logs (`/super-admin/email-logs`):**
  - [ ] Delivery status table and HTML preview drawer.
- [ ] **Announcements (`/super-admin/announcements`):**
  - [ ] Broadcast creation tool (targeted by plan/tenant).
- [ ] **Feature Flags (`/super-admin/feature-flags`):**
  - [ ] Global vs tenant-specific override controls.
- [ ] **Settings (`/super-admin/settings`) & Support:**
  - [ ] General, SMTP, and Backup configuration.
  - [ ] Data extraction tools and Force actions `/super-admin/support`.

---
**AI Instructions for Continuing:**
1. Check off tasks as you complete them using `[x]`.
2. Do not combine heavy architectural phases. Complete Backend strictly before Frontend logic.
3. Verify routes returning `200` manually before declaring a feature complete.
