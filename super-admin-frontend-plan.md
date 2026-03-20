# Super Admin Dashboard — FRONTEND Implementation Plan

> **Status:** 🔴 Not Started (Blocked by Backend Plan completion)
> **Last Updated:** 2026-03-19
> **Stack:** Next.js 15 (App Router), React 19, Tailwind CSS, Recharts, Framer Motion
> **Frontend Location:** `src/`
> **Backend API Base:** `http://localhost:3001/api/v1/platform-admin/`

---

## ⚠️ AI INSTRUCTIONS — READ BEFORE CODING

1. **DO NOT START THIS PLAN** until the backend plan (`super-admin-backend-plan.md`) is fully completed with all checkboxes checked.
2. **Check boxes** `[x]` as you complete each item.
3. **Complete items in order** within each phase.
4. **Test each page visually** in the browser before moving to the next.
5. The backend API prefix is `/api/v1/platform-admin/`. All frontend API calls use the existing Axios `apiClient` instance.
6. The existing auth stores JWT tokens and user data. The super admin role is `PLATFORM_SUPER_ADMIN` or `SUPER_ADMIN`.
7. Use the existing project's component patterns (e.g., `Card`, `Button`, `Modal` from `src/components/ui/`).
8. All new pages live under `src/app/(super-admin)/super-admin/`.
9. **Brand:** Dark teal/green theme. Primary palette: `#021a13 · #085041 · #0F6E56 · #1D9E75 · #5DCAA5 · #9FE1CB`.
10. **Fonts:** Playfair Display (headings), DM Sans (body), DM Mono (codes/numbers).

---

## PHASE F1: Design System & Shared Components

> **Goal:** Build all reusable UI primitives before any pages.
> **Status:** 🟢 Done

### F1.1 — Theme & Font Setup
- [x] Add Google Fonts (Playfair Display, DM Sans, DM Mono) to `src/app/layout.tsx` or via `@import` in globals
- [x] Add super admin dark teal color palette to CSS custom properties or Tailwind config
- [x] Create `src/styles/super-admin-theme.css` with dark mode variables

### F1.2 — Shared Components (`src/components/super-admin/`)
- [x] `StatCard` — Animated counter on mount (count up from 0), skeleton shimmer when loading, icon, label, value, change indicator (arrow + percentage), color variants
- [x] `StatusPill` — Maps status string to colored dot + label. Supports: active, suspended, pending, trial, expired, healthy, degraded, down, success, failed, warning
- [x] `DataTable` — Props: columns, data, pagination, loading (skeleton rows), onSort, onPageChange, emptyState, row hover effects, staggered fade-in rows
- [x] `ConfirmModal` — Title, description, confirmText, onConfirm, danger mode. For dangerous actions: `typeToConfirm` prop (user must type exact string)
- [x] `SlideDrawer` — Right-side slide-out panel for detail views (error detail, email preview, user profile). Animated entry/exit
- [x] `SkeletonLoader` — Shimmer animation component for cards, tables, charts
- [x] `AlertBanner` — Dismissible alert strip with severity colors (info/amber/red) and action link
- [x] `LiveDot` — Animated pulsing dot (green/amber/red) for live status indicators
- [x] `PageHeader` — Title + subtitle + breadcrumb + action buttons area
- [x] `EmptyState` — Illustration + message + action button for empty data tables

### F1.3 — Hooks (`src/hooks/super-admin/`)
- [x] `useLiveMetric(endpoint, intervalMs)` — Polls endpoint every N ms. Returns `{ data, loading, error }`. Pauses when tab is hidden (visibilitychange API). Resumes when visible.
- [x] `useSuperAdminAuth()` — Reads JWT/session, checks role is `PLATFORM_SUPER_ADMIN` or `SUPER_ADMIN`, returns user info + `isSuperAdmin` boolean
- [x] `useAnimatedCounter(targetValue, duration)` — Returns current animated number value for stat cards

### F1.4 — ImpersonationContext
- [x] Create `src/contexts/ImpersonationContext.tsx`
- [x] Stores: `isImpersonating`, `targetUser`, `targetTenant`, `originalToken`
- [x] Provides: `startImpersonation(token, user, tenant)`, `exitImpersonation()`
- [x] `ImpersonationBanner` component — amber/red persistent top bar with user info and "Exit" button. Pulse border animation. Slide-down entry. Not dismissible.


---

## PHASE F2: Layout & Navigation Shell

> **Goal:** Build the super admin layout wrapper, sidebar, and security guard.
> **Status:** 🟢 Done

### F2.1 — Super Admin Guard
- [x] Create `src/app/(super-admin)/super-admin/layout.tsx`
- [x] On mount: check auth token exists → redirect to `/login` if not
- [x] Check user role is `PLATFORM_SUPER_ADMIN` or `SUPER_ADMIN` → render 403 page if not
- [x] Wrap children in `ImpersonationContext` provider
- [x] Include ToastProvider (sonner)

### F2.2 — Sidebar Component (`src/components/super-admin/SuperAdminSidebar.tsx`)
- [x] Logo area: Brokerium text + "Super Admin" badge
- [x] Navigation groups with icons (lucide-react)
- [x] Active item: teal left-border bar (3px) with glow + elevated background
- [x] Collapse/expand: smooth width transition (260px → 64px icon rail, 280ms)
- [x] Footer: Admin avatar (initials), name, "Platform Owner" label, online pulse dot, system status indicator
- [x] Responsive: Desktop=full, Tablet=icon rail, Mobile=hidden+hamburger overlay

### F2.3 — Top Bar (optional, minimal)
- [x] Breadcrumb trail
- [x] Search (global search across tenants/users)
- [x] Notification bell (links to alerts)
- [x] Profile dropdown (Logout, Settings)

### F2.4 — Redirect Route
- [x] `src/app/(super-admin)/super-admin/page.tsx` — Redirects to `/super-admin/overview`

### F2.5 — Error & Loading States
- [x] `src/app/(super-admin)/super-admin/error.tsx` — Graceful error boundary with retry button
- [x] `src/app/(super-admin)/super-admin/loading.tsx` — Full page skeleton loader

---

## PHASE F3: Overview Dashboard Page

> **Goal:** Build the master overview page at `/super-admin/overview`.
> **API Dependencies:** `overview/stats`, `overview/charts`, `overview/activity-feed`, `overview/top-tenants`
> **Status:** 🟢 Done

### F3.1 — Top Alert Strip
- [x] Conditional rendering: only shows if critical alerts exist
- [x] Each alert: one line with severity color, message, action link ("Review →")
- [x] Dismissible per alert
- [x] Types: NIC expiry warnings, overdue payments, failed jobs, system degradation, unresolved errors

### F3.2 — Live System Status Bar
- [x] Horizontal bar: API ● | DB ● | Email ● | Jobs ●
- [x] Each dot: green/amber/red with pulse animation
- [x] Polls every 30s via `useLiveMetric`
- [x] Click any dot → navigates to `/super-admin/system-health`

### F3.3 — Stat Cards Row 1 (Business metrics, 6 cards)
- [x] Total Tenants, Active Tenants, MRR (GHS), ARR (GHS), Churn Rate (%), NIC Compliance Flags
- [x] Animated counters (count up on mount)
- [x] Change indicators (+N this month, % growth, trend arrows)
- [x] Skeleton shimmer during loading

### F3.4 — Stat Cards Row 2 (Platform health, 4 cards)
- [x] API Uptime (%), Avg Response Time (ms), Active Sessions, Errors (24h)
- [x] Same animated counter + skeleton pattern

### F3.5 — Charts Section Row 1 (2 columns)
- [x] Left: Line chart — Tenant growth over 12 months (total vs active, dual line)
- [x] Right: Doughnut chart — MRR breakdown by plan (Starter/Professional/Enterprise) with GHS legend
- [x] Draw/fill animation on mount
- [x] Use Recharts (already installed)

### F3.6 — Charts Section Row 2 (2 columns)
- [x] Left: Bar chart — Monthly revenue last 12 months (GHS)
- [x] Right: Area chart — API request volume last 7 days (success vs failed, stacked)

### F3.7 — Bottom Section (3 columns)
- [x] Col 1 (wide): Recent activity feed — colored dot + actor + action + tenant + time. 10 items. Auto-refresh 30s. "View all →" link
- [x] Col 2: Top 5 tenants by policy count — mini table with rank, name, count, % of total
- [x] Col 3: Plan distribution bars — animated fill bars per plan with tenant count + GHS revenue

### F3.8 — Quick Actions Row
- [x] Icon buttons: + Add Tenant, Export Report, Send Announcement, View NIC Flags, Run Health Check, Manage Feature Flags
- [x] Each links to the corresponding page or opens a modal

---

## PHASE F4: System Health & Error Tracker Pages

> **Goal:** Build the System Health and Error Tracker pages at `/super-admin/system-health` and `/super-admin/error-tracker`.
> **Status:** 🟢 Done

### F4.1 — System Health Page (`/super-admin/system-health`)
- [x] Live Health Grid: service cards with status pill, response time, last checked, uptime %
- [x] Auto-refresh every 30s
- [x] Database Health Panel: connection count, db size, last backup
- [x] Error Rate Panel: errors last 1h/24h/7d, top 5 error types
- [x] Background Job Health: queue counts, failed jobs table with Retry/Discard actions
- [x] Uptime History: 90-day calendar grid (green/amber/red squares per day)
- [x] Incident Log: list of incidents with start/end/duration, "Mark resolved" action

### F4.2 — Error Tracker Page (`/super-admin/error-tracker`)
- [x] Error list table: severity, type, message preview, tenant, occurrences, affected users, first/last seen, status, assignee
- [x] Filters: severity, status, tenant, date range, search
- [x] Error detail drawer (SlideDrawer): full stack trace (monospace), request context, user context, breadcrumbs, actions (resolve/ignore/note)
- [x] Error frequency bar chart (last 48 hours)

---

## PHASE F5: Tenant & User Management Pages

> **Goal:** Complete the Tenant Directory, User Directory, Detailed Views, and Provisioning pipelines.
> **Status:** 🟢 Done

### F5.1 — Tenant List Page (`/super-admin/tenants`)
- [x] Filterable data table: search, status tabs, plan dropdown, date range, NIC compliance, CSV export
- [x] Columns: name, NIC, plan pill, user count, policy count, storage, MRR, status, NIC score, last activity, joined, actions
- [x] Row actions: View, Impersonate, Edit, Suspend (with reason modal), Activate, Delete (type-to-confirm)

### F5.2 — Tenant Detail Page (`/super-admin/tenants/[id]`)
- [x] Tab 1 — Overview: company info card, 4 KPI stat cards, activity sparkline
- [x] Tab 2 — Users: tenant's user table with role management
- [x] Tab 3 — Insurance Data: policies by class, claims pipeline, premium YTD, renewals, commissions
- [x] Tab 4 — Billing: current plan, payment history, plan change timeline, overdue balance
- [x] Tab 5 — NIC Compliance: licence status, segregation, remittance history, levy, KYC, compliance score gauge
- [x] Tab 6 — Activity Log: scoped audit log for this tenant only
- [x] Tab 7 — Health & Errors: tenant-specific errors, slow queries, API usage
- [x] Danger Zone: Suspend, Reset data, Delete (all with type-to-confirm modals)

### F5.3 — New Tenant Page (`/super-admin/tenants/new`)
- [x] 4-step wizard form:
  - Step 1: Company Info (name, NIC licence, subdomain with live availability check, address, phone)
  - Step 2: Admin Account (first name, last name, email, phone)
  - Step 3: Subscription (plan card selection, billing cycle, trial toggle)
  - Step 4: Configuration (timezone, currency, welcome email toggle, onboarding notes)
- [x] Progress steps with animated checkmarks on submit
- [x] On success: redirect to tenant detail page

### F5.4 — User Management Page (`/super-admin/users`)
- [x] Online Users Panel: "X users online" with list (name, tenant, last action)
- [x] User table: avatar, name, email, role badge, tenant, status, last login, actions
- [x] Actions: view profile drawer, edit role, reset password, impersonate, deactivate, force logout, delete
- [x] Filters: All / Super Admins / Tenant Admins / Staff / Active / Inactive / Locked / Never logged in
- [x] Create Super Admin form (top-right button)

---

## PHASE F6: Billing, NIC & Logs Pages

> **Goal:** Build the specialized tools for Subscriptions, Regulatory compliance, and system logging.
> **Status:** 🟢 Done

### F6.1 — Subscriptions Page (`/super-admin/subscriptions`)
- [x] Revenue metric cards: MRR, ARR, Churn, Avg Revenue, Overdue Balance, New Revenue
- [x] Revenue bar chart (12 months, toggle: MRR / New / Churned)
- [x] Subscription table: tenant, plan, cycle, amount, status, period, next billing, actions
- [x] Overdue Payments panel: tenant, amount, days overdue, actions (remind/mark paid/suspend)
- [x] Plan Management cards: 3 plans with price, features, tenant count, MRR contribution

### F6.2 — NIC Monitoring Page (`/super-admin/nic-monitoring`)
- [x] 4 summary cards: Fully Compliant, Licence Expiring <30d, Licence Expired, Behind on Remittance
- [x] Compliance table: tenant, NIC#, expiry, days remaining (color-coded), segregation, remittance, levy, KYC, score, actions
- [x] Remittance calendar view (monthly, overdue in red, on-time in green)
- [x] NIC Report Generator: tenant multi-select, date range, "Generate Report" button
- [x] Regulation Reference Panel (collapsible)

### F6.3 — Audit Logs Page (`/super-admin/audit-logs`)
- [x] Log table: timestamp (DM Mono), severity, category pill, actor + role, tenant, action, resource, IP, status, expand
- [x] Filters: text search, date range, severity, category, tenant, actor, status, sort
- [x] Detail drawer: full JSON, before/after states, user agent, related events
- [x] Auto-refresh toggle ("X new entries" banner)
- [x] Export to CSV
- [x] 50 per page pagination
- [x] **No delete/edit** anywhere

### F6.4 — Background Jobs Page (`/super-admin/jobs`)
- [x] Summary cards: Queued, Processing, Completed (24h), Failed (24h), Avg Duration, Oldest Job
- [x] Job table: name, tenant, status, priority, enqueued, started, completed, duration, attempts, error, actions
- [x] Status colors: queued=blue, processing=amber (pulse), completed=green, failed=red, retrying=orange
- [x] Actions: view error drawer, retry, discard, prioritise
- [x] Scheduled Jobs table: name, schedule, last run, status, next run, actions (Run now / Disable)

### F6.5 — Email Logs Page (`/super-admin/email-logs`)
- [x] Email table: sent at, template, recipient, tenant, subject, status, provider ID, actions
- [x] Status colors: delivered=green, sent=amber, bounced=red, failed=red, spam=dark-red
- [x] Detail drawer: HTML email preview (sanitised iframe), metadata, delivery timeline, re-send button
- [x] Filters: status, date range, recipient, template, tenant
- [x] Delivery Rate Panel: delivery %, bounce %, spam % + daily volume mini chart

---

## PHASE F7: Operations & Settings Pages

> **Goal:** Create settings configurations and powerful support utilities for platform operators.
> **Status:** 🟢 Done

### F7.1 — Announcements Page (`/super-admin/announcements`)
- [x] Compose form: title, body (rich text), type (info/warning/critical/maintenance), target (all/by_plan/specific), delivery (in-app/email/both), schedule (now/later), pinned toggle
- [x] Live preview panel
- [x] "Send test to myself" button
- [x] Sent list: title, type pill, target, delivery, sent at, read rate, actions (view/resend/delete)
- [x] Detail view: content + delivery stats + per-tenant read list

### F7.2 — Feature Flags Page (`/super-admin/feature-flags`)
- [x] Flags table: key, label, description, global toggle, starter toggle, pro toggle, enterprise toggle, override count badge, last changed, changed by
- [x] Inline toggle switches for quick enable/disable
- [x] Tenant Override drawer: search tenant, toggle flags per tenant, show which differ from plan default, remove override button
- [x] All changes logged (visual confirmation toast)

### F7.3 — Settings Page (`/super-admin/settings`)
- [x] Tab 1 — General: platform name, support email/phone, timezone, currency, date format, maintenance mode toggle
- [x] Tab 2 — NIC Regulations: levy rate, remittance period, two-account enforcement, NIC contact details
- [x] Tab 3 — Email/SMTP: provider, host, port, from name/email, "Send test email" button, email template list
- [x] Tab 4 — Billing: Paystack keys (masked), webhook URL (copy), invoice prefix/number
- [x] Tab 5 — Security: session timeout, max failed attempts, lockout duration, MFA enforcement, IP allowlist
- [x] Tab 6 — Backups: last backup info, frequency, "Run backup now", cache clear, rebuild indexes, log retention
- [x] Sticky "Save changes" bar when unsaved changes exist

### F7.4 — Support Tools Page (`/super-admin/support`)
- [x] Impersonation Centre: search user, result card with info, "Login as" button
- [x] Tenant Health Check: select tenant, "Run health check", animated progress, result panel with health score gauge
- [x] Data Tools: export tenant data (JSON), raw row counts, orphaned record check
- [x] User Tools: force password reset (search by email), unlock account, force logout

---

## PHASE F8: Animations & Polish

> **Goal:** Ensure every required animation is implemented and fluid.
> **Status:** 🟢 Done

### F8.1 — Page-level Animations
- [x] Staggered fade + slide-up on all sections (0.05s delay increments) — Custom pure CSS
- [x] Table rows fade-in staggered when data loads
- [x] Slide drawers: custom slide-in-right transform animation, 250ms smooth curve

### F8.2 — Interactive Animations
- [x] Stat counters: count up from 0, 1.2s ease-out cubic custom hook
- [x] Progress/bar fills: width transitions smoothly
- [x] Live status dots: pulse glow (`sa-pulse-green`)
- [x] Buttons: hover lift (translateY -1px), active press (scale 0.97)
- [x] Sidebar collapse: width transition 280ms
- [x] Sidebar active state: glowing teal left border

---

## 🎯 FINAL COMPLETION CHECKLIST
- [x] Sidebar correctly maps to ALL 13 active routes
- [x] All Type errors resolved inside the App Router framework
- [x] Dark Teal "Noir" design language fully integrated across all elements
- [x] Charts: draw/fill animation on mount (`animationDuration=1500`)
- [x] Number changes: count-up interpolation in `StatCard`
- [x] Impersonation banner: slide down + shake on entry `sa-shake, sa-reveal`
- [x] Alert banners: pulse animation for critical context
- [x] Toast: `sonner` library seamlessly integrated

### F8.3 — Skeleton Loaders
- [x] Every data card, table, and chart has shimmer skeleton during loading state
- [x] No blank screens — always shimmer or spinner

### F8.4 — Responsive
- [x] Desktop (≥1280px): Full sidebar (260px) + main content
- [x] Tablet (768–1279px): Collapsed icon rail (64px) + main content
- [x] Mobile (<768px): Hidden sidebar + hamburger → overlay drawer

### F8.5 — Accessibility
- [x] ARIA labels on all interactive elements
- [x] Escape to close Slide Drawers and modals
- [x] Focus rings on all focusable elements
- [x] Keyboard navigable sidebar (arrow keys + Enter)
- [x] Screen reader friendly stat cards (aria-live for updates)

---

## FILE MAP (What gets created)

```
src/
├── app/
│   └── (super-admin)/
│       └── super-admin/
│           ├── layout.tsx                     (NEW — guard + sidebar + providers)
│           ├── page.tsx                       (NEW — redirect to /overview)
│           ├── loading.tsx                    (NEW)
│           ├── error.tsx                      (NEW)
│           ├── overview/
│           │   └── page.tsx                   (NEW)
│           ├── system-health/
│           │   └── page.tsx                   (NEW)
│           ├── error-tracker/
│           │   └── page.tsx                   (NEW)
│           ├── tenants/
│           │   ├── page.tsx                   (NEW — list)
│           │   ├── new/
│           │   │   └── page.tsx               (NEW — creation wizard)
│           │   └── [id]/
│           │       └── page.tsx               (NEW — detail tabs)
│           ├── users/
│           │   └── page.tsx                   (NEW)
│           ├── subscriptions/
│           │   └── page.tsx                   (NEW)
│           ├── nic-monitoring/
│           │   └── page.tsx                   (NEW)
│           ├── audit-logs/
│           │   └── page.tsx                   (NEW)
│           ├── jobs/
│           │   └── page.tsx                   (NEW)
│           ├── email-logs/
│           │   └── page.tsx                   (NEW)
│           ├── announcements/
│           │   └── page.tsx                   (NEW)
│           ├── feature-flags/
│           │   └── page.tsx                   (NEW)
│           ├── settings/
│           │   └── page.tsx                   (NEW)
│           └── support/
│               └── page.tsx                   (NEW)
├── components/
│   └── super-admin/
│       ├── SuperAdminSidebar.tsx               (NEW)
│       ├── StatCard.tsx                        (NEW)
│       ├── StatusPill.tsx                      (NEW)
│       ├── DataTable.tsx                       (NEW)
│       ├── ConfirmModal.tsx                    (NEW)
│       ├── SlideDrawer.tsx                     (NEW)
│       ├── SkeletonLoader.tsx                  (NEW)
│       ├── AlertBanner.tsx                     (NEW)
│       ├── LiveDot.tsx                         (NEW)
│       ├── PageHeader.tsx                      (NEW)
│       ├── EmptyState.tsx                      (NEW)
│       └── ImpersonationBanner.tsx             (NEW)
├── hooks/
│   └── super-admin/
│       ├── useLiveMetric.ts                   (NEW)
│       ├── useSuperAdminAuth.ts               (NEW)
│       └── useAnimatedCounter.ts              (NEW)
├── contexts/
│   └── ImpersonationContext.tsx                (NEW)
└── styles/
    └── super-admin-theme.css                  (NEW)
```
