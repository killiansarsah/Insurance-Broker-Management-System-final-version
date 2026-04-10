# Brokerium — Insurance Broker Management System
## Comprehensive Technical Overview & System Documentation

> **Prepared for:** Stakeholder Presentation  
> **Date:** April 2026  
> **Version:** Final Edition  
> **Platform:** NIC Act 1061 Compliant | Built for Ghana Insurance Market

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Technology Stack Reference](#3-technology-stack-reference)
4. [Authentication & Security System](#4-authentication--security-system)
5. [Frontend Architecture (Next.js 16)](#5-frontend-architecture-nextjs-16)
6. [State Management (Zustand)](#6-state-management-zustand)
7. [Data Layer — API Client & TanStack Query](#7-data-layer--api-client--tanstack-query)
8. [Backend Architecture (NestJS)](#8-backend-architecture-nestjs)
9. [Role-Based Access Control (RBAC)](#9-role-based-access-control-rbac)
10. [Section-by-Section Module Breakdown](#10-section-by-section-module-breakdown)
    - [Dashboard (Main Hub)](#101-dashboard--main-hub)
    - [Clients & KYC/AML](#102-clients--kycaml)
    - [Policies](#103-policies)
    - [Claims Management](#104-claims-management)
    - [Leads & CRM](#105-leads--crm)
    - [Quotes](#106-quotes)
    - [Renewals](#107-renewals)
    - [Finance Module](#108-finance-module)
    - [Premium Financing](#109-premium-financing)
    - [Commissions](#110-commissions)
    - [Complaints](#111-complaints)
    - [Compliance](#112-compliance)
    - [Documents](#113-documents)
    - [Carriers](#114-carriers)
    - [Calendar](#115-calendar)
    - [Chat](#116-chat)
    - [Tasks (My Desk)](#117-tasks-my-desk)
    - [Approvals](#118-approvals)
    - [Reports](#119-reports)
    - [Audit Log](#120-audit-log)
    - [Team Management](#121-team-management)
    - [Departments](#122-departments)
    - [Notifications](#123-notifications)
    - [Settings](#124-settings)
    - [Data Onboarding / Bulk Import](#125-data-onboarding--bulk-import)
    - [Integrations](#126-integrations)
    - [Admin (Platform)](#127-admin-platform)
11. [UI Component System](#11-ui-component-system)
12. [Data Visualisation (Recharts)](#12-data-visualisation-recharts)
13. [Drag-and-Drop System (@hello-pangea/dnd)](#13-drag-and-drop-system-hello-pangeadnd)
14. [Email & Notification Infrastructure](#14-email--notification-infrastructure)
15. [NIC Compliance Architecture](#15-nic-compliance-architecture)

---

## 1. Executive Summary

**Brokerium** is a full-stack, cloud-ready Insurance Broker Management System (IBMS) purpose-built for the Ghanaian insurance market. It is compliant with the **National Insurance Commission (NIC) Act 1061** and automates the complete insurance brokerage lifecycle — from client onboarding and lead generation through to policy issuance, premium collection, claims settlement, and regulatory reporting.

### Key Capabilities at a Glance

| Capability | Description |
|---|---|
| **Multi-Tenant** | One platform, multiple brokerage workspaces isolated by tenant |
| **NIC Compliant** | Enforces claim acknowledgment (5 days) and processing (30 days) deadlines |
| **Full Lifecycle** | Lead → Quote → Policy → Premium → Claim → Commission → Report |
| **RBAC** | Granular role-based access: 6 roles, 50+ permissions |
| **Real-Time** | Socket.io powered chat and live notifications |
| **Data Intelligence** | Recharts dashboards for premium trends, claims ratio, insurer performance |
| **Google Integration** | Google Calendar sync for renewal and follow-up scheduling |

---

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER / CLIENT                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Next.js 16 (App Router) — React 19          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │   │
│  │  │  Zustand │  │TanStack  │  │  Radix UI +        │ │   │
│  │  │  Stores  │  │  Query   │  │  Tailwind v4 CSS   │ │   │
│  │  └──────────┘  └────┬─────┘  └───────────────────┘ │   │
│  └───────────────────┬─┘────────────────────────────────┘  │
│                      │  Axios HTTP + JWT Bearer Token       │
└──────────────────────┼──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              NestJS Backend API (Port 3001)                  │
│                    /api/v1/...                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Auth    │  │  Guards  │  │ Throttle │  │  Swagger   │  │
│  │  Module  │  │JWT/RBAC  │  │ Rate Lim │  │  API Docs  │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              34 Feature Modules                      │   │
│  │  Clients │ Policies │ Claims │ Finance │ Compliance  │   │
│  │  Leads   │ Quotes   │ Docs   │ Chat    │ Reports     │   │
│  └──────────────────────────────────────────────────────┘   │
│                       │                                      │
│              Prisma ORM (PostgreSQL)                         │
└──────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                         │
│  Multi-tenant schema with full audit logging                │
└─────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐          ┌─────────────────────┐
│  Email Service  │          │  Google Calendar API │
│  (SMTP/Template)│          │  (OAuth 2.0 sync)    │
└─────────────────┘          └─────────────────────┘
```

---

## 3. Technology Stack Reference

### Frontend Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | SSR, routing, layouts, metadata |
| **UI Library** | React 19 | Component model, concurrent rendering |
| **Component Primitives** | Radix UI | Accessible headless components |
| **Styling** | Tailwind CSS v4 + Vanilla CSS | Utility-first design system |
| **State — Auth** | Zustand + sessionStorage | Auth session, user, permissions |
| **State — UI** | Zustand + localStorage | Theme, sidebar, search |
| **Data Fetching** | TanStack Query (React Query v5) | Server state, caching, mutations |
| **HTTP Client** | Axios | API requests, interceptors, token refresh |
| **Animations** | Framer Motion | Page transitions, micro-animations |
| **Charts** | Recharts | Premium trend, policy mix, claims gauge |
| **Drag & Drop** | @hello-pangea/dnd | Kanban task boards, list reordering |
| **Icons** | Lucide React | Consistent icon system throughout |
| **Toasts** | Sonner | Notification toasts |
| **Forms** | React Hook Form + Zod | Form state and schema validation |
| **Real-Time** | socket.io-client | Live chat, notifications |
| **Authentication** | jsonwebtoken + HTTP-only cookies | JWT access + refresh token |

### Backend Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | NestJS (Node.js) | Modular REST API |
| **ORM** | Prisma | Type-safe database access |
| **Database** | PostgreSQL | Relational data store |
| **Auth** | JWT + Passport.js | Token-based authentication |
| **Logging** | Pino (nestjs-pino) | Structured JSON logging |
| **Security** | Helmet, CSRF, Throttler | Production hardening |
| **Documentation** | Swagger / OpenAPI | Auto-generated API docs at `/api/docs` |
| **Scheduling** | @nestjs/schedule | Cron jobs for renewals, reminders |
| **Email** | Nodemailer + Custom templates | Policy, claim, compliance emails |
| **Integration** | Google Calendar API | Calendar sync via OAuth 2.0 |

---

## 4. Authentication & Security System

### How Authentication Works

Brokerium uses a **dual-token authentication system**:

```
LOGIN REQUEST                           SERVER RESPONSE
─────────────────                      ──────────────────────────────────
POST /api/v1/auth/login                ┌─────────────────────────────┐
{                                      │ accessToken (JWT, 15min)    │  ← In response body
  email, password, tenantSlug          │ refreshToken (JWT, 7days)   │  ← In HttpOnly Cookie
}                              ───────►│ user object                 │
                                       └─────────────────────────────┘
```

**Access Token Flow:**
1. User logs in → receives a **15-minute access token** stored in Zustand (sessionStorage)
2. Access token is attached as `Authorization: Bearer <token>` on every API request via Axios interceptor
3. When the access token expires, Axios interceptor catches the **401 Unauthorized** response
4. A **silent token refresh** is automatically triggered (`POST /auth/refresh`) using the HttpOnly refresh cookie
5. The new access token is stored and the original failed request is **automatically retried**
6. If refresh also fails → `auth:session-expired` event is fired → user is logged out

### Multi-Tenant Login
When a user belongs to multiple brokerage tenants, the login endpoint returns a **tenant selection list**. The user selects their workspace, and the login is repeated with the `tenantSlug` parameter to target the correct tenant context.

### Two-Factor Authentication (2FA)
The backend has a `TwoFactorService`. When 2FA is enabled on an account, the login returns `requiresTwoFactor: true` and the frontend shows a 6-digit TOTP verification screen before completing the session.

### Session Storage (Security Choice)
Auth state is persisted to **sessionStorage** (not localStorage) so that sessions automatically expire when the browser tab is closed — a deliberate security decision for financial data.

---

## 5. Frontend Architecture (Next.js 16)

### Route Structure (App Router)

```
src/app/
├── page.tsx                    ← Landing page (public)
├── layout.tsx                  ← Root layout with fonts, theme, providers
├── (auth)/                     ← Auth route group (unauthenticated)
│   ├── login/                  ← Login page
│   ├── forgot-password/        ← Password reset request
│   ├── reset-password/         ← New password form
│   ├── accept-invite/          ← Team member invite acceptance
│   └── start-trial/            ← New brokerage sign-up
└── dashboard/                  ← Protected route group
    ├── layout.tsx              ← Sidebar + Header shell (client component)
    ├── page.tsx                ← Main analytics dashboard
    ├── clients/                ← Client management
    ├── policies/               ← Policy management
    ├── claims/                 ← Claims management
    ├── leads/                  ← Lead CRM
    ├── quotes/                 ← Quotation management
    ├── renewals/               ← Renewal pipeline
    ├── finance/                ← Payments, invoices, commissions
    ├── premium-financing/      ← Installment financing
    ├── complaints/             ← Customer complaints
    ├── compliance/             ← NIC compliance module
    ├── documents/              ← Document management
    ├── carriers/               ← Insurer/carrier management
    ├── calendar/               ← Scheduling & Google Calendar
    ├── chat/                   ← Internal messaging
    ├── tasks/                  ← My Desk / task management
    ├── approvals/              ← Approval workflow queue
    ├── reports/                ← Analytics & NIC reports
    ├── audit/                  ← Audit trail log
    ├── team/                   ← Team / user management
    ├── departments/            ← Department management
    ├── notifications/          ← Notification centre
    ├── settings/               ← Workspace settings
    ├── data-onboarding/        ← Bulk data import
    ├── integrations/           ← Third-party integrations
    ├── admin/                  ← Platform-level admin
    └── results/                ← Global search results
```

### Layout System

The **Dashboard Layout** (`src/app/dashboard/layout.tsx`) is a persistent shell that contains:
- **Sidebar** — collapsible navigation (collapses to icon-only mode on desktop)
- **Header** — fixed top bar with search, notifications, calculator, and profile
- **Main content area** — padding and width adjust based on sidebar state
- **ProtectedRoute** wrapper — redirects unauthenticated users to `/login`

The layout uses **CSS custom properties** (`--sidebar-width`, `--header-height`, `--transition-slow`) for consistent adaptive layout across all 28+ sections.

### Dynamic Imports & Code Splitting

Heavy components (Recharts charts, modals) are **lazy-loaded** using Next.js `dynamic()`:

```typescript
// Chart bundles (~240KB) only load when the dashboard page is rendered
const PremiumTrend = dynamic(
  () => import('@/components/charts/premium-trend'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
```

This dramatically improves the **initial page load** performance.

### Dynamic Page Titles

Each dashboard section exports `metadata` from a server-component layout, producing browser tab titles in the format `Brokerium — [Section]`:

```
Browser Tab: "Brokerium — Policies"   (when on /dashboard/policies)
Browser Tab: "Brokerium — Claims"     (when on /dashboard/claims)
Browser Tab: "Brokerium — Finance"    (when on /dashboard/finance)
```

---

## 6. State Management (Zustand)

Brokerium uses **Zustand** for all client-side global state. There are 5 purpose-built stores:

### `auth-store.ts` — Authentication State
```
Stores: user object, isAuthenticated, accessToken, isLoading
Actions: login(), logout(), checkAuth(), hasRole(), hasPermission()
Persisted: sessionStorage (tab-scoped for security)
```

| Method | Purpose |
|---|---|
| `login(email, password, tenantSlug?)` | Authenticates and sets user + token |
| `logout()` | Clears session and redirects to /login |
| `checkAuth()` | Called on app mount to restore/refresh session |
| `hasRole(roles[])` | Hierarchical role check (ADMIN ≥ MANAGER ≥ AGENT) |
| `hasPermission(permission)` | Granular permission check (e.g. `'policies:create'`) |

**Role Hierarchy (numeric):**
```
PLATFORM_SUPER_ADMIN (10) > WORKSPACE_OWNER (8) > ADMINISTRATOR (7)
  > MANAGER (5) > SUPERVISOR (4) > AGENT (2)
```

### `ui-store.ts` — Interface State
```
Stores: sidebarCollapsed, sidebarMobileOpen, currentTheme, searchOpen
Persisted: localStorage (theme + sidebar preference survive reload)
```

Supports 4 themes: `light`, `dark`, `glass`, `system`. On mount, a non-blocking inline script reads the stored theme and applies it to `<html>` **before React hydrates** — preventing the theme flash.

### `notification-store.ts` — Notification State
Maintains the in-memory list of unread notifications and unread count badge shown in the header bell icon.

### `profile-store.ts` — User Profile
Stores the avatar URL separately from the auth store to allow profile picture updates without re-triggering auth logic.

### `payment-store.ts` — Payment Flow
Manages the active payment modal state when recording policy premium payments.

---

## 7. Data Layer — API Client & TanStack Query

### Axios API Client (`src/lib/api-client.ts`)

A singleton `ApiClient` class wraps Axios with:

**Key Features:**
- **Base URL** from `NEXT_PUBLIC_API_URL` env var (defaults to `localhost:3001/api/v1`)
- **Request interceptor**: Attaches `Authorization: Bearer <token>` on every request
- **Response interceptor**: Catches 401 → attempts silent token refresh → retries original request
- **Refresh deduplication**: If multiple requests fail simultaneously, only **one** refresh request is made (promise-sharing pattern)
- **`auth:session-expired` event**: Broadcast when refresh fails → triggers global logout

**Available methods:** `get()`, `post()`, `patch()`, `put()`, `delete()`, `upload()`, `uploadWithFields()`

### TanStack Query Hooks

All server state flows through **22 custom hook files** under `src/hooks/api/`. Each entity follows a consistent CRUD pattern:

```typescript
// Example: Policies hooks (src/hooks/api/use-policies.ts)

usePolicies(params)          // List with pagination + filters
usePolicyMetrics()           // KPI summary (30s stale time)
usePolicy(id)                // Single record (enabled: !!id guard)
useCreatePolicy()            // POST mutation → invalidates ['policies']
useUpdatePolicy()            // PATCH mutation
useCancelPolicy()            // POST /policies/:id/cancel
useBindPolicy()              // POST /policies/:id/bind
useLapsePolicy()             // POST /policies/:id/lapse
useReinstatePolicy()         // POST /policies/:id/reinstate
useCreateEndorsement()       // POST /policies/:id/endorsements
useInstallments(policyId)    // GET installment schedule
usePayInstallment()          // PATCH payment confirmation
```

**Cache Invalidation Pattern:**
When a mutation succeeds, `queryClient.invalidateQueries()` is called on the relevant cache keys. This ensures all list views, detail views, and KPI cards automatically refresh without any manual state management.

**Paginated responses** follow a consistent contract:
```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; }
}
```

---

## 8. Backend Architecture (NestJS)

The backend is a **NestJS monolith** with clean module boundaries. It runs on port **3001** and serves all API routes under `/api/v1/`.

### Application Bootstrap (`main.ts`)
On startup, the application:
1. Creates the NestJS application with `NestExpressApplication`
2. Serves uploaded files at `/uploads/` (static asset serving)
3. Applies **Helmet** (security headers + HSTS)
4. Enables **cookie-parser** (for refresh token cookies)
5. Configures **CORS** to whitelist approved origins
6. Sets up **global validation pipe** (auto-validates all request DTOs via `class-validator`)
7. Registers **global exception filter** (converts Prisma errors to clean HTTP responses)
8. Registers **decimal serialization interceptor** (converts Prisma `Decimal` types to JSON numbers)
9. Enables **Swagger UI** at `/api/docs` (development only)
10. Checks that at least one **super admin exists** in the database

### Security Middleware Stack
```
Request ──► [Throttler: Rate Limiting]
        ──► [Helmet: Security Headers]
        ──► [CSRF Middleware]
        ──► [JWT Auth Guard]
        ──► [Roles Guard]
        ──► [Permissions Guard]
        ──► [Controller Handler]
        ──► [Decimal Interceptor]
        ──► Response
```

### Backend Modules (34 Total)

| Module | REST Prefix | Key Responsibility |
|---|---|---|
| `AuthModule` | `/auth` | Login, logout, refresh, 2FA, invite |
| `UsersModule` | `/users` | User CRUD, role assignment |
| `ClientsModule` | `/clients` | Client lifecycle, KYC, AML, beneficiaries |
| `PoliciesModule` | `/policies` | Policy CRUD, bind, cancel, endorse |
| `ClaimsModule` | `/claims` | Claim workflow, documents, follow-ups |
| `LeadsModule` | `/leads` | Lead CRM, scoring, pipeline |
| `QuotesModule` | `/quotes` | Quote generation, send, accept/decline |
| `RenewalsModule` | `/renewals` | Renewal pipeline, bulk reminders |
| `FinanceModule` | `/finance` | Payments, invoices, remittances |
| `CarriersModule` | `/carriers` | Insurer / carrier registry |
| `ComplaintsModule` | `/complaints` | Complaint lifecycle, SLA tracking |
| `ComplianceModule` | `/compliance` | NIC compliance records |
| `DocumentsModule` | `/documents` | File upload, version control |
| `CalendarModule` | `/calendar` | Events, Google Calendar sync |
| `ChatModule` | `/chat` | Conversations, Socket.io messaging |
| `TasksModule` | `/tasks` | Task assignment, My Desk |
| `ApprovalsModule` | `/approvals` | Approval workflow queue |
| `ReportsModule` | `/reports` | NIC reports, financial summaries |
| `AuditModule` | `/audit` | Immutable audit trail |
| `NotificationsModule` | `/notifications` | Push notifications, read/archive |
| `DepartmentsModule` | `/departments` | Branch/department management |
| `SettingsModule` | `/settings` | Workspace configuration |
| `ImportsModule` | `/imports` | Bulk CSV/Excel data import |
| `SearchModule` | `/search` | Global full-text search |
| `IntegrationsModule` | `/integrations` | Google, webhook, third-party |
| `PlatformAdminModule` | `/platform-admin` | Cross-tenant administration |
| `EmailModule` | *(internal)* | Email delivery via SMTP templates |
| `PrismaModule` | *(internal)* | Database connection pool |
| `HealthModule` | `/health` | Kubernetes health check endpoint |

---

## 9. Role-Based Access Control (RBAC)

### User Roles (Hierarchy)

```
PLATFORM_SUPER_ADMIN   ──  Full system access across all tenants
       ▼
WORKSPACE_OWNER        ──  Full access within their tenant
       ▼
ADMINISTRATOR          ──  Full operational access
       ▼
MANAGER                ──  Manages team, approves workflows
       ▼
SUPERVISOR             ──  Supervises agents, limited admin
       ▼
AGENT                  ──  Day-to-day operations only
```

### Permission Groups (50+ Granular Permissions)

| Group | Sample Permissions |
|---|---|
| **Dashboard** | `dashboard.revenue`, `dashboard.sales_trends` |
| **Clients & CRM** | `clients.view`, `clients.create`, `clients.kyc` |
| **Policies & Quotes** | `policies.create`, `policies.cancel`, `policies.approve` |
| **Claims** | `claims.submit`, `claims.investigate`, `claims.approve` |
| **Finance** | `payments.collect`, `commissions.manage`, `invoices.create` |
| **Documents** | `documents.upload`, `documents.delete` |
| **Complaints** | `complaints.escalate`, `complaints.resolve` |
| **Management** | `users.manage`, `settings.workspace`, `audit.view` |

### How Permissions Work in the UI

On the frontend, the `useAuthStore` provides `hasPermission(key)` which checks against the user's `permissions[]` array received from the backend. UI elements (buttons, navigation items, action menus) conditionally render based on these checks:

```typescript
// Example: "New Policy" button only shown to users with create permission
{user.hasPermission('policies:create') && (
  <Button>New Policy</Button>
)}
```

---

## 10. Section-by-Section Module Breakdown

---

### 10.1 Dashboard — Main Hub

**Route:** `/dashboard`  
**Purpose:** Real-time business intelligence overview for the brokerage

The dashboard is the primary landing page after login. It gives management and senior staff a comprehensive snapshot of brokerage performance.

**Key UI Sections:**
- **Period Selector** — Toggle between Today, Month-to-Date (MTD), and Year-to-Date (YTD)
- **Filter Bar** — Multi-dimensional filters: Insurer, Product, Client Type, Account Officer, Region
- **KPI Cards (6)** — Total Premium, Active Policies, Claims Ratio, Clients, Renewals Due, Revenue
- **Premium Trend Chart** — Line/area chart showing premium volume over time (Recharts)
- **Policy Mix Chart** — Pie/donut breakdown by insurance type (Recharts)
- **Top Insurers Chart** — Horizontal bar chart ranking insurers by premium volume (Recharts)
- **Claims Ratio Gauge** — Radial gauge showing claims loss ratio (Recharts)
- **Quick Actions** — Shortcut buttons: New Policy, New Claim, New Lead
- **Recent Activity Feed** — Latest transactions and events across the platform

**Data Flow:**
```
useDashboardData(period, filters)
    │
    └─► GET /api/v1/reports/dashboard?period=mtd&...
            │
            └─► Server aggregates across Policies, Claims, Finance tables
                    │
                    └─► Returns KPIs, chart datasets, activity feed
```

---

### 10.2 Clients & KYC/AML

**Route:** `/dashboard/clients`  
**Purpose:** Central client registry with regulatory compliance checks

**Client Types Supported:**
- **Individual** — Personal insurance clients (Ghana Card ID, DOB, occupation)
- **Corporate** — Business clients (TIN, registration number, contact person)

**Core Features:**
- **Client List** — Searchable, filterable paginated data table with server-side pagination
- **KYC Status Tracking** — `PENDING`, `VERIFIED`, `REJECTED`, `EXPIRED` — enforces regulatory verification
- **AML Risk Level** — `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` — flags politically exposed persons (PEPs)
- **Client Detail View** — Tabbed profile: Personal Info | Policies | Claims | Documents | KYC/AML | Beneficiaries | Bank Details
- **Beneficiaries Management** — Percentage allocation among multiple beneficiaries (with guardian info for minors)
- **Next of Kin** — Emergency contact information
- **Bank Details** — For premium refunds and claims settlements

**KYC/AML Workflow:**
```
Client Onboarded (PENDING)
    │
    ├─► Documents submitted → Verified → KYC: VERIFIED
    │
    └─► Risk assessment → AML Level assigned (LOW → CRITICAL)
              │
              └─► EDD (Enhanced Due Diligence) flag for HIGH/CRITICAL
```

---

### 10.3 Policies

**Route:** `/dashboard/policies`  
**Purpose:** Core policy lifecycle management across all classes of business

**Supported Insurance Classes:**
Motor, Fire, Marine, Life, Health, Liability, Engineering, Bonds, Travel, Agriculture, Oil & Gas, Aviation, Professional Indemnity

**Policy Lifecycle States:**
```
DRAFT → COVER_NOTE → PENDING → ACTIVE → [EXPIRED | CANCELLED | LAPSED | SUSPENDED]
```

**Key Features:**
- **Policy List** — KPI cards (Active, Total Premium, Expiring Soon, Pending, Lapsed, New This Month) + sortable data table
- **Type Filtering** — Quick switch between Motor, Non-Motor, and All policies
- **Policy Detail Page** — Tabs: Overview | Endorsements | Installments | Documents | Timeline | Vehicle/Property Details
- **New Policy Form** — Step-by-step creation with class-specific fields (vehicle details for Motor, property details for Fire, etc.)
- **Policy Actions:**
  - **Renew** — Creates a new policy period with automatic date calculation
  - **Cancel** — Records reason, effective date, estimated refund
  - **Endorse** — Midterm coverage modifications with approval workflow
  - **Bind** — Converts Cover Note to Active policy
  - **Lapse** — Non-payment lapse recording
  - **Reinstate** — Reinstates a lapsed policy
- **Installment Management** — Premium payment schedule with per-installment payment tracking
- **Bulk Actions** — Select multiple policies → Assign Officer, Send Renewal Emails, Export to Excel
- **Excel Export** — Formatted workbook with header styling, alternating row colors, frozen header row

**Motor Policy Specifics:**
Vehicle registration, chassis number, engine details, cover type (Comprehensive / Third Party / TPFT / Commercial), sticker generation

**Financial Tracking:**
Each policy tracks: Premium Amount, Sum Insured, Commission Rate, Commission Amount, Payment Status (PENDING / PARTIAL / PAID / OVERDUE), Outstanding Balance, VAT (15%), NHIL (2.5%), GETFund (2.5%)

---

### 10.4 Claims Management

**Route:** `/dashboard/claims`  
**Purpose:** End-to-end claims processing with NIC deadline enforcement

**Claims Lifecycle:**
```
INTIMATED → REGISTERED → DOCUMENTS_PENDING → UNDER_REVIEW
    → ASSESSED → APPROVED → SETTLED → CLOSED
         └───────────────────────────────► REJECTED
```

**NIC Compliance Deadlines Built-In:**
- **Acknowledgment Deadline**: 5 business days from intimation
- **Processing Deadline**: 30 business days from registration
- Claims are automatically flagged as **`isOverdue: true`** when deadlines are breached

**Key Features:**
- **Claim KPI Cards** — Total Claims, Pending, In Progress, Settled This Month, Overdue, Average Settlement Time
- **Claim Registration** — Linked to policy, records incident details, location, description, estimated amount
- **Status Workflow Actions:**
  - `Acknowledge` — Starts the 5-day NIC clock
  - `Investigate` — Assigns investigator and notes
  - `Assess` — Records assessed/surveyor amount
  - `Approve` — Confirms approved settlement amount
  - `Reject` — Records rejection reason
  - `Settle` — Records actual settlement and payment date
  - `Reopen` — Reopens a closed/rejected claim
- **Document Attachment** — Attach claim documents (photos, reports, receipts)
- **Chase Log / Follow-Ups** — Timestamped follow-up notes for claims in progress
- **Claim Status Modal** — Interactive modal with full history timeline

---

### 10.5 Leads & CRM

**Route:** `/dashboard/leads`  
**Purpose:** Sales pipeline and lead management for new business acquisition

**Lead Pipeline Stages:**
```
NEW → CONTACTED → QUALIFIED → QUOTED → NEGOTIATION → CONVERTED
                                                   └────────────► LOST
                                                   └────────────► NURTURING
```

**Lead Properties:**
- Priority: `HOT` / `WARM` / `COLD`
- Source: Referral, Walk-in, Phone, Email, Website, Social Media, Event, Partner
- AI-powered Lead Score (0–100)
- Product Interest (multiple insurance types)
- Estimated Premium & Commission values

**Key Features:**
- **Kanban Board** — Drag-and-drop cards between pipeline stages (powered by `@hello-pangea/dnd`)
- **Lead Scoring** — Numeric score calculated from engagement signals
- **Follow-up Scheduling** — Next follow-up date with calendar integration
- **Conversion** — One-click convert lead → client + policy quotation

---

### 10.6 Quotes

**Route:** `/dashboard/quotes`  
**Purpose:** Quotation generation and management

**Key Features:**
- Create formal quotations linked to leads or existing clients
- Set validity period and premium breakdown
- Send quote via email to client
- Track status: Draft → Sent → Accepted / Declined
- One-click convert accepted quote → new policy

---

### 10.7 Renewals

**Route:** `/dashboard/renewals`  
**Purpose:** Proactive policy renewal pipeline management

**Key Features:**
- **Renewal Dashboard** — Policies expiring in 0–30, 31–60, 61–90 day windows
- **Bulk Renewal Reminders** — Send automated email reminders to multiple clients in one action
- **Renewal Status Tracking** — Notified, Quote Sent, Renewed, Lapsed
- **Google Calendar Sync** — Renewal dates pushed to Google Calendar for account officers
- **Renewal History** — Previous renewal chain with linked policy numbers

---

### 10.8 Finance Module

**Route:** `/dashboard/finance`  
**Purpose:** Complete financial management for the brokerage

**Sub-Modules:**

#### Payments & Receipts
- Record premium payments from clients (Cash, Cheque, Bank Transfer, Mobile Money, Card)
- MoMo networks: MTN, Telecel, AirtelTigo
- Payment reconciliation against policy installment schedules
- Receipt generation

#### Invoices
- Create debit notes and invoices for policy premiums
- Send invoices via email
- Track: Draft → Sent → Paid → Cancelled
- Credit note generation for cancellations/refunds

#### Remittances
- Insurer premium remittance tracking
- Reconcile amount remitted vs. collected
- Generate remittance advices

#### Commissions
- Auto-calculated commission per policy (rate × premium)
- Status tracking: PENDING → PAID → CLAWED_BACK
- Commission statement generation per broker/agent

---

### 10.9 Premium Financing

**Route:** `/dashboard/premium-financing`  
**Purpose:** Installment financing for clients unable to pay full annual premium

**Key Features:**
- Create financing agreements with defined down payment and installment schedule
- Interest rate and fee configuration
- Automated due-date reminders
- Default and arrears management
- Integration with policy payment status

---

### 10.10 Commissions

**Route:** `/dashboard/commissions`  
**Purpose:** Dedicated broker commission management view

**Key Features:**
- Per-agent commission ledger
- Commission accrual calendar (when earned vs. when paid)
- Clawback management for cancelled policies
- Commission disbursement records

---

### 10.11 Complaints

**Route:** `/dashboard/complaints`  
**Purpose:** Customer complaint management with NIC SLA enforcement

**Lifecycle:** `REGISTERED → ASSIGNED → UNDER_INVESTIGATION → RESOLVED → CLOSED`  
**Escalation Levels:** 0 = None, 1 = Manager, 2 = Compliance, 3 = NIC

**Key Features:**
- Register complaints linked to clients, policies, or claims
- Priority levels: LOW, MEDIUM, HIGH, CRITICAL
- SLA deadline tracking — flags `isBreached` when deadline passes
- Assignment to team members with accountability trail
- 3-level escalation path up to NIC regulator
- Resolution notes and closure confirmation

---

### 10.12 Compliance

**Route:** `/dashboard/compliance`  
**Purpose:** NIC regulatory compliance tracking and reporting

**Key Features:**
- NIC class of business mapping for all policies
- Compliance checklist per insurance type
- Regulatory deadline monitoring
- Policy-level compliance annotations (nicClassOfBusiness field)
- Required disclosure tracking
- AML/KYC compliance reporting

---

### 10.13 Documents

**Route:** `/dashboard/documents`  
**Purpose:** Centralised document management system

**Categories:** CLIENT, POLICY, CLAIM, COMPLIANCE, INTERNAL, REPORT, KYC

**Key Features:**
- Upload documents (10MB limit) via multipart/form-data
- Link documents to clients, policies, or claims
- Version control — each document has a `version` number
- Retention date tracking — flags `isExpired` documents
- Document preview and download
- Bulk operations: tag, archive, delete

---

### 10.14 Carriers

**Route:** `/dashboard/carriers`  
**Purpose:** Insurer and carrier registry management

**Key Features:**
- Master list of all insurance companies (carriers/insurers) the brokerage works with
- Commission rate agreements per product per carrier
- Contact persons and relationship managers
- Carrier performance metrics (volume placed, claims settled)
- Products catalogue per carrier

---

### 10.15 Calendar

**Route:** `/dashboard/calendar`  
**Purpose:** Scheduling and event management with Google Calendar integration

**Key Features:**
- Monthly/weekly/daily calendar views
- Create events: renewals, follow-ups, client meetings, claim inspections
- **Google Calendar Sync** — OAuth 2.0 connection to sync events bidirectionally
- Event linking to policies, clients, leads, or claims
- Reminder notifications (in-app + email)

---

### 10.16 Chat

**Route:** `/dashboard/chat`  
**Purpose:** Real-time internal messaging between team members

**Technology:** socket.io-client (WebSocket connection)

**Conversation Types:**
- `direct` — 1-to-1 between team members
- `group` — Department or project channels
- `ai` — AI assistant integration

**Key Features:**
- Message types: TEXT, FILE, IMAGE, VOICE, LINK, SYSTEM
- Read receipts: SENT → DELIVERED → READ
- Context linking — conversations linked to specific POLICY, CLAIM, CLIENT, or COMPLAINT records
- Unread count badge on sidebar icon
- Online/offline presence indicator

---

### 10.17 Tasks (My Desk)

**Route:** `/dashboard/tasks`  
**Purpose:** Personal and team task management (Kanban + List view)

**Key Features:**
- **Kanban Board** — Drag-and-drop tasks between columns: To Do → In Progress → Review → Done
- **List View** — Tabular view with sorting and priority filters
- Task assignment to team members
- Due date, priority (LOW/MEDIUM/HIGH/URGENT), and category labels
- Link tasks to policies, claims, or clients
- Sidebar badge shows count of urgent/overdue tasks
- Filter by: Assigned to Me, Overdue, High Priority, By Category

**Drag-and-Drop Architecture:**
```
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="TODO">
    <Draggable draggableId={task.id}>
      <TaskCard />
    </Draggable>
  </Droppable>
  ... (per column)
</DragDropContext>
```

---

### 10.18 Approvals

**Route:** `/dashboard/approvals`  
**Purpose:** Centralised approval workflow queue

**Approval Types:**
- New policy binding (pending underwriter sign-off)
- Policy endorsements requiring senior approval
- Large claim settlement approvals
- Premium financing agreements
- Refund/credit note approvals

**Key Features:**
- Queue view with priority sorting
- Approve / Reject with comments
- Delegated approval (acting backup for absent staff)
- Approval history and audit trail

---

### 10.19 Reports

**Route:** `/dashboard/reports`  
**Purpose:** Business intelligence, financial, and NIC regulatory reports

**Report Categories:**

| Report Type | Audience | Purpose |
|---|---|---|
| **Revenue Report** | Management | Premium collected, commissions earned |
| **NIC Quarterly Return** | Compliance | Mandatory regulatory submission |
| **Claims Experience** | Management | Loss ratio, settlement analysis |
| **Renewal Pipeline** | Sales | Upcoming renewals by value |
| **Agent Performance** | HR/Management | Policies per agent, conversion rates |
| **Insurer Summary** | Finance | Business placed per insurer |
| **KYC/AML Report** | Compliance | Risk assessment overview |

**Export Formats:** Excel (ExcelJS), PDF

**Charts in Reports:** Recharts bar charts, line charts, and pie charts for visual analytics

---

### 10.20 Audit Log

**Route:** `/dashboard/audit`  
**Purpose:** Immutable system-wide audit trail for compliance and forensics

**What is Logged:**
- All create, update, delete operations on every entity
- Login events (success, failure, IP address)
- Permission changes
- Bulk operations
- Export and data access events

**Key Features:**
- Non-deletable records (append-only)
- Filter by: User, Action Type, Entity Type, Date Range
- Full before/after JSON diff for updates
- Export audit logs for regulatory submission

---

### 10.21 Team Management

**Route:** `/dashboard/team`  
**Purpose:** User and team member management

**Key Features:**
- Invite new team members via email (tokenised invite link)
- Assign roles and custom permission sets
- Deactivate / reactivate accounts
- Delegation management — assign backup officers
- Profile and contact management
- View active sessions

---

### 10.22 Departments

**Route:** `/dashboard/departments`  
**Purpose:** Organisational structure management

**Key Features:**
- Create and manage departments and branches
- Assign team members to departments
- Department-level performance metrics
- Branch code and regional mapping

---

### 10.23 Notifications

**Route:** `/dashboard/notifications`  
**Purpose:** In-app notification centre

**Notification Types:** RENEWAL, CLAIM, COMMISSION, LEAD, FOLLOWUP, COMPLIANCE, FINANCE, SYSTEM, DOCUMENT, APPROVAL

**Priority Levels:** LOW, MEDIUM, HIGH, URGENT

**Key Features:**
- Real-time notification delivery via Socket.io
- Header bell icon with unread count badge (red dot)
- Inline notifications popover (most recent 10)
- Full notification centre with archive and bulk mark-as-read
- Deep-link navigation — clicking a notification goes directly to the related record
- Filter by type or priority

---

### 10.24 Settings

**Route:** `/dashboard/settings`  
**Purpose:** Workspace and platform configuration

**Settings Sections:**

| Section | What it Controls |
|---|---|
| **Workspace** | Brokerage name, logo, registration details, NIC licence number |
| **Users & Roles** | RBAC role definitions, custom permission templates |
| **Email Preferences** | Email notification triggers, templates, from address |
| **Integrations** | Google OAuth, webhook configuration |
| **Branding** | Logo, colour scheme, email template branding |
| **Billing** | Subscription plan and payment method (SaaS tier) |
| **Security** | 2FA enforcement, password policy, session timeout |

---

### 10.25 Data Onboarding / Bulk Import

**Route:** `/dashboard/data-onboarding`  
**Purpose:** Migrate existing data from spreadsheets or legacy systems

**Key Features:**
- Upload CSV or Excel files
- Interactive **column mapping** — drag source columns to target fields
- Smart field detection for common column names
- Validation pass before import: highlights errors row-by-row
- Duplicate detection
- Import result summary: Total Rows / Imported / Skipped / Errors
- Supported entity types: Clients, Policies, Claims, Leads, Universal (mixed)

---

### 10.26 Integrations

**Route:** `/dashboard/integrations`  
**Purpose:** Third-party service connections

**Available Integrations:**

| Integration | Status | Function |
|---|---|---|
| **Google Calendar** | Active | Bidirectional event sync via OAuth 2.0 |
| **Email SMTP** | Active | Automated email delivery |
| **Bulk Import** | Active | Linked from policy and client pages |
| **Webhooks** | Configurable | Push events to external systems |

**Google Calendar Flow:**
```
User clicks "Connect Google Calendar"
    │
    └─► OAuth 2.0 consent screen (Google)
            │
            └─► Access + Refresh tokens stored securely
                    │
                    └─► Calendar events created/updated on:
                        • Policy renewal dates
                        • Claim follow-up dates
                        • Lead next-contact dates
                        • Custom scheduled events
```

---

### 10.27 Admin (Platform)

**Route:** `/dashboard/admin`  
**Purpose:** Cross-tenant platform administration (PLATFORM_SUPER_ADMIN only)

**Key Features:**
- View and manage all tenant workspaces
- Tenant provisioning and deprovisioning
- Cross-tenant audit and monitoring
- Platform-level settings
- Usage metrics and billing overview

---

## 11. UI Component System

### Layout & Primitives (Radix UI)

All interactive, accessible UI components are built on **Radix UI primitives** which provide keyboard navigation, focus management, ARIA attributes, and screen reader support out of the box:

| Radix Component | Used For |
|---|---|
| `Dialog` | Modal dialogs (create/edit forms, confirmations) |
| `Popover` | Notifications panel, filter popovers |
| `Select` | Dropdown selects throughout all forms |
| `Tabs` | Detail page tab navigation (Clients, Policies, Claims) |
| `Toast` (Sonner) | Success/error toast notifications |
| `Switch` | Toggle controls in settings |
| `ScrollArea` | Custom scrollable containers |
| `Separator` | Visual dividers |
| `DropdownMenu` | Action menus (three-dot menus on table rows) |
| `Avatar` | User profile pictures |
| `Label` | Accessible form field labels |

### Tailwind v4 CSS System

Styling is applied using **Tailwind v4 utility classes** combined with **CSS custom properties** for design tokens:

```css
/* Design token examples (globals.css) */
--sidebar-width: 240px;
--sidebar-collapsed-width: 64px;
--header-height: 60px;
--transition-slow: 300ms;
--bg-header: rgba(255,255,255,0.85);
--glass-blur: 12px;
--radius-md: 0.5rem;
```

**Theme System** (4 themes):
- `theme-light` — Clean white/grey professional look
- `theme-dark` — Dark slate with green accents
- `theme-glass` — Frosted glass / backdrop-blur aesthetic
- `system` — Follows OS preference

### Lucide Icons

All icons throughout the application come from **Lucide React** — a consistent, clean icon library:

```
Navigation:  LayoutDashboard, Users, FileText, Shield, Briefcase, Building2
Actions:     Plus, Edit, Trash2, Download, Upload, Eye, RefreshCw
Status:      CheckCircle2, AlertCircle, XCircle, Clock, AlertTriangle
Finance:     DollarSign, TrendingUp, Wallet, BarChart3
UI:          ChevronDown, ChevronLeft, X, Menu, Search, Bell
```

### Key Reusable UI Components

| Component | Location | Purpose |
|---|---|---|
| `DataTable` | `components/data-display/data-table.tsx` | Universal sortable/searchable/paginated table |
| `StatusBadge` | `components/data-display/status-badge.tsx` | Colour-coded status pills |
| `Card / CardHeader` | `components/ui/card.tsx` | Container card with consistent styling |
| `Button` | `components/ui/button.tsx` | Variants: primary, outline, ghost, danger |
| `CustomSelect` | `components/ui/select-custom.tsx` | Enhanced dropdown with clear support |
| `Modal` | `components/ui/modal.tsx` | Base modal wrapper |
| `AppLoader` | `components/ui/AppLoader.tsx` | Fullscreen loading state |
| `DashboardSkeleton` | `components/ui/dashboard-skeleton.tsx` | Loading skeleton for dashboard |
| `GlobalSearch` | `components/features/global-search.tsx` | Cross-module search (Cmd+K) |
| `QuickAddMenu` | `components/features/quick-add.tsx` | Floating quick-action button |
| `NotificationsPopover` | `components/features/notifications.tsx` | Header bell popover |
| `ErrorBoundary` | `components/ui/error-boundary.tsx` | Catches and displays React errors |

### DataTable — The Universal Table Component

The `DataTable` component is the backbone of every list view in the application. It provides:
- Client-side text search across configurable `searchKeys`
- Sortable columns
- Configurable page size
- Server-side pagination mode (`serverSide` prop)
- Row selection with checkbox (bulk operations)
- Custom `headerActions` slot (e.g. Import button)
- Export callback (`onExport`)
- Empty state messaging
- Loading skeleton state

---

## 12. Data Visualisation (Recharts)

All charts are **lazy-loaded** with `next/dynamic` to prevent them from blocking initial page render.

| Chart | Type | What it Shows |
|---|---|---|
| `PremiumTrend` | Area/Line Chart | Monthly premium volume over the selected year |
| `PolicyMix` | Pie/Donut Chart | Distribution of policies by insurance class |
| `TopInsurers` | Horizontal Bar | Top insurers ranked by premium volume placed |
| `ClaimsRatioGauge` | Radial Gauge | Claims loss ratio as a percentage of premium |
| `ReportsCharts` | Multi-chart | Financial and performance charts within Reports section |

**Chart Loading Pattern:**
```
Page renders → ChartSkeleton shown (animated pulse placeholder)
    │
    └─► Recharts bundle downloads asynchronously (~240KB)
            │
            └─► Real chart mounts with animation
```

---

## 13. Drag-and-Drop System (@hello-pangea/dnd)

Used in two primary locations:

### Lead Kanban Board (`/dashboard/leads`)
Leads are displayed as cards in stage columns. Dragging a lead card between columns automatically updates the lead's `status` via a PATCH API call.

### Task Kanban Board (`/dashboard/tasks — My Desk`)
Task cards move between: `To Do → In Progress → Review → Done`. Position is persisted to the database on drop.

**Architecture:**
```
DragDropContext (onDragEnd)
│
├── Droppable ("TODO")
│     └── Draggable (task-1)
│     └── Draggable (task-2)
│
├── Droppable ("IN_PROGRESS")
│     └── Draggable (task-3)
│
└── Droppable ("DONE")
      └── Draggable (task-4)
```

The `onDragEnd` handler:
1. Determines source and destination column
2. Optimistically updates local state
3. Fires `PATCH /tasks/:id` with new status
4. Rolls back on API error

---

## 14. Email & Notification Infrastructure

### Email Service (`ibms-backend/src/email/`)

The backend has three email-related files:
- `email.service.ts` — Core SMTP delivery service
- `enhanced-email.service.ts` — Advanced templating and queuing
- `brokerium-email.template.ts` — Custom branded HTML email templates

**Triggered Events:**
| Trigger | Email Sent |
|---|---|
| Policy created | Policy schedule / cover note to client |
| Policy expiring (30 days) | Renewal reminder to client |
| Claim registered | Acknowledgment letter to client |
| Claim settled | Settlement notification to client |
| Invoice created | Invoice to client |
| New team invite | Invitation link to new user |
| Password reset | Secure reset link |
| 2FA enabled | Security confirmation |

### Real-Time Notifications (Socket.io)

The backend (`ChatModule`, `NotificationsModule`) maintains WebSocket connections:
- Clients connect with their JWT token for authenticated WS sessions
- Events pushed from server: `notification:new`, `chat:message`, `chat:read`, `user:online`
- Frontend notification store is updated in real-time
- Unread badge count updates without page refresh

---

## 15. NIC Compliance Architecture

Brokerium is designed from the ground up to comply with **Ghana's NIC Act 1061**. Compliance is enforced at both the data model and business logic levels:

### Claims Processing Deadlines

| Requirement | NIC Standard | System Implementation |
|---|---|---|
| Claim Acknowledgment | 5 business days | `acknowledgmentDeadline` field auto-calculated on intimation |
| Claim Processing | 30 business days | `processingDeadline` field auto-calculated on registration |
| Overdue Flag | Immediate | `isOverdue: boolean` set by scheduled cron job |

### Policy Classification
Every policy stores `nicClassOfBusiness` — the exact NIC regulatory classification code — used for quarterly NIC returns and solvency calculations.

### KYC & AML Requirements
- Every client must pass KYC before a policy can be bound
- AML risk level is mandatory for all clients
- PEP (Politically Exposed Person) flag triggers enhanced due diligence (EDD) workflow
- Source of funds documentation required for HIGH/CRITICAL AML clients

### NIC Quarterly Returns
The Reports module auto-generates NIC-formatted reports with:
- Premium volumes by class of business
- Claims statistics and loss ratios
- Commission summaries
- Renewal and lapse statistics

### Complaint Escalation to NIC
The Complaints module includes a 3-level escalation mechanism. Level 3 explicitly represents **escalation to the NIC regulator** — aligning with the statutory requirement to report unresolved complaints to the commission.

---

*This document was auto-generated from a live codebase analysis of the Brokerium IBMS Final Edition.*  
*For technical queries, refer to the API documentation at `/api/docs` (development environment).*
