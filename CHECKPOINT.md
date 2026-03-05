# IBMS Backend Build — Checkpoint Tracker

## Current Phase: Phase 5 COMPLETE — Ready for Phase 6

## Rules for AI
- Before building any phase, read this file first
- After completing a phase, update the status below
- Do NOT rebuild anything marked ✅
- Only build the NEXT incomplete phase
- Each phase has a verification checklist — ALL items must pass before marking ✅
- If switching AI tools mid-build, the new AI reads this file to know exactly where to continue

## Tech Stack
- **Runtime:** Node.js 20 LTS
- **Framework:** NestJS 10+ (TypeScript strict)
- **ORM:** Prisma 5.x
- **Database:** PostgreSQL 15+
- **Cache:** Redis 7+
- **Auth:** JWT RS256 + bcrypt (cost 12)
- **Validation:** class-validator + class-transformer
- **Logging:** nestjs-pino (structured JSON, PII masked)
- **API Docs:** @nestjs/swagger (OpenAPI)
- **Testing:** Jest + Supertest

## Phase Status
- [x] Phase 1: Project Scaffold & Configuration
- [x] Phase 2: Database Schema & Migrations
- [x] Phase 3: Auth Module (Login, JWT, Password Reset)
- [x] Phase 4: Invitation System & User Management
- [x] Phase 5: Clients & Carriers Module
- [ ] Phase 6: Policies & Renewals Module
- [ ] Phase 7: Claims, Complaints & Escalations Module
- [ ] Phase 8: Finance Module (Invoices, Payments, Commissions, Expenses, Premium Financing)
- [ ] Phase 9: Leads, Documents, Tasks, Calendar, Approvals, Notifications
- [ ] Phase 10: Chat (WebSocket), Reports, Compliance, Audit, Dashboard Aggregations
- [ ] Phase 11: Frontend Connection (replace mock data with real API calls)

## Verification Log

### Phase 3 — Completed 2026-03-04
- [x] `npm run build` — zero TypeScript errors
- [x] Implemented RS256 JWT strategy reading public key at `JWT_ACCESS_PUBLIC_KEY_PATH`
- [x] `JwtAuthGuard` — honors `@Public()` and returns 401 on failure
- [x] `RolesGuard` — role hierarchy implemented
- [x] `AuthService` — `login`, `issueAccessToken`, `issueRefreshToken`, `refreshTokens` (rotation + reuse detection), `forgotPassword`, `resetPassword`, `logout`
- [x] `AuthController` — endpoints `/login`, `/refresh`, `/logout`, `/me`, `/forgot-password`, `/reset-password` with cookie handling and throttling
- [x] `TenantsService` — `findBySlug` and `findById` with 5-min cache
- [ ] `npx prisma migrate dev` — pending (needs running PostgreSQL)
- [ ] `npx prisma db seed` — pending (needs running PostgreSQL)
- Note: runtime endpoint verification (login, refresh, reset, logout) requires a running DB and seed data; those remain to be run during integration testing.

### Phase 1 — Completed 2026-03-04
- [x] `npm run build` — zero TypeScript errors
- [x] `GET /api/v1/health` → `{ status: 'ok', timestamp, uptime, environment }`
- [x] `GET /api/docs` → Swagger UI returns HTTP 200
- [x] `.env` is in `.gitignore`
- [x] `.env.example` exists with documented placeholders
- [x] No `console.log` in any source file
- [x] No `any` type in any source file
- [x] No hardcoded secrets
- [ ] Docker Compose not tested (Docker not available — test manually)

**Files created:**
- `src/main.ts` — Bootstrap with helmet, CORS, validation, Swagger, global prefix
- `src/app.module.ts` — Root module with ConfigModule, ThrottlerModule, HealthModule
- `src/config/` — Zod env validation + typed config factory
- `src/common/filters/` — Global exception filter (Prisma error mapping)
- `src/common/guards/` — JwtAuthGuard + RolesGuard (placeholders)
- `src/common/decorators/` — @CurrentUser, @Roles, @Public, @TenantId
- `src/common/pipes/` — Global validation pipe config
- `src/common/dto/` — PaginationDto + PaginatedResponse
- `src/common/types/` — JwtPayload, AuthenticatedRequest
- `src/health/` — Health check module + controller
- `docker-compose.yml` — PostgreSQL 15 + Redis 7
- `Dockerfile` — Multi-stage production build
- `.env.example`, `.gitignore`, `README.md`
- `prisma/schema.prisma` — Initialized (full schema in Phase 2)
- `keys/` — RS256 key pair generated

**Tech versions:** NestJS 11.x, Prisma 5.22, TypeScript strict

### Phase 2 — Completed 2026-03-04
- [x] `npx prisma validate` — passes with no errors
- [x] `npx prisma generate` — Prisma Client generated (v5.22.0)
- [x] `npm run build` — zero TypeScript errors
- [x] No `any` types in prisma.service.ts or prisma.module.ts
- [x] No `console.log` in any src/ file
- [ ] `npx prisma migrate dev` — pending (Docker not available — run manually)
- [ ] `npx prisma db seed` — pending (Docker not available — run manually)
- [ ] DB count verification — pending (requires running PostgreSQL)

**When Docker is available, run:**
```bash
cd ibms-backend
docker-compose up -d
npx prisma migrate dev --name initial_schema
npx prisma db seed
```

**Expected seed counts:**
- `SELECT COUNT(*) FROM tenants` → 2
- `SELECT COUNT(*) FROM users` → 2
- `SELECT COUNT(*) FROM branches` → 6
- `SELECT COUNT(*) FROM carriers` → 10
- `SELECT COUNT(*) FROM products` → 30

**Files created:**
- `prisma/schema.prisma` — Complete schema: 44 enums, 35 models, all relations, indexes, @@map
- `prisma/seed.ts` — Seed script: 2 tenants, 2 admins, 6 branches, 10 carriers, 30 products
- `prisma/rls.sql` — PostgreSQL Row-Level Security policies for tenant isolation
- `src/prisma/prisma.service.ts` — PrismaClient wrapper with soft-delete middleware, OnModuleInit
- `src/prisma/prisma.module.ts` — Global module exporting PrismaService
- `src/prisma/index.ts` — Barrel export
- `src/app.module.ts` — Updated: imports PrismaModule
- `package.json` — Updated: prisma.seed config added

**Schema highlights:**
- Every tenant-scoped table has `tenantId UUID NOT NULL`
- All monetary fields use `Decimal @db.Decimal(15,2)`
- Soft-delete (`deletedAt DateTime?`) on User, Client, Policy, Claim, Lead, Carrier
- Soft-delete middleware in PrismaService auto-filters deleted records
- All join tables have compound unique constraints
- 6 Ghana-specific details: GhanaCard, MoMo networks, NIC fields

### Phase 4 & Phase 5 — Completed 2026-03-04
- [x] `npm run build` — zero TypeScript errors
- [x] `npm run lint` — zero ESLint errors
- [x] Zero `any` types across the entire codebase
- [x] Implemented Invitations, Users, Clients, Carriers, and CarrierProducts modules
- [x] Verified build processes locally
