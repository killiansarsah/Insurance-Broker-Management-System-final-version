# IBMS Backend Build — Checkpoint Tracker

## Current Phase: Phase 1 COMPLETE — Ready for Phase 2

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
- [ ] Phase 2: Database Schema & Migrations
- [ ] Phase 3: Auth Module (Login, JWT, Password Reset)
- [ ] Phase 4: Invitation System & User Management
- [ ] Phase 5: Clients & Carriers Module
- [ ] Phase 6: Policies & Renewals Module
- [ ] Phase 7: Claims, Complaints & Escalations Module
- [ ] Phase 8: Finance Module (Invoices, Payments, Commissions, Expenses, Premium Financing)
- [ ] Phase 9: Leads, Documents, Tasks, Calendar, Approvals, Notifications
- [ ] Phase 10: Chat (WebSocket), Reports, Compliance, Audit, Dashboard Aggregations
- [ ] Phase 11: Frontend Connection (replace mock data with real API calls)

## Verification Log

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
