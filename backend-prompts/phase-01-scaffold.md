# Phase 1: Project Scaffold & Configuration

## What This Phase Builds
- NestJS 10+ project with TypeScript strict mode
- Global security middleware (helmet, CORS, rate limiting, validation)
- Environment configuration with validation (crashes on missing vars)
- Global exception filter (never leaks internals)
- Common decorators, guards (placeholder), pipes
- Health check endpoint
- Docker Compose for local PostgreSQL + Redis
- Swagger/OpenAPI docs

## Prompt

Create a new NestJS project called `ibms-backend` inside `c:\Users\Owner\Desktop\ibms\ibms-backend\`. Set up:

1. **NestJS 10+ with TypeScript strict mode** — `nest new ibms-backend --strict --package-manager npm`

2. **Install dependencies:**
   - Core: `@nestjs/config`, `@nestjs/throttler`, `@nestjs/swagger`, `@nestjs/passport`, `passport`, `passport-jwt`, `@nestjs/jwt`
   - Validation: `class-validator`, `class-transformer`
   - Database: `prisma`, `@prisma/client`
   - Security: `helmet`, `bcrypt`, `@types/bcrypt`
   - Logging: `nestjs-pino`, `pino-pretty`, `pino-http`
   - Redis: `ioredis`
   - Mail: `@nestjs-modules/mailer`, `nodemailer`, `handlebars`, `@types/nodemailer`
   - Util: `uuid`, `@types/uuid`, `zod`

3. **`src/main.ts`** — bootstrap with:
   - `app.use(helmet())`
   - CORS with whitelist from `CORS_ORIGINS` env var (comma-separated → array)
   - `ValidationPipe` globally: `whitelist: true, forbidNonWhitelisted: true, transform: true`
   - `@nestjs/swagger` setup at `/api/docs` (disabled when `NODE_ENV=production`)
   - Global prefix: `/api/v1`
   - Request body size limit: 10MB default
   - Listen on `PORT` from env (default 3001)

4. **`src/config/env.validation.ts`** — Zod schema that validates ALL required env vars at startup. App CRASHES with clear error listing missing vars. Required: `DATABASE_URL`, `JWT_ACCESS_PRIVATE_KEY_PATH`, `JWT_ACCESS_PUBLIC_KEY_PATH`, `JWT_REFRESH_SECRET`, `CORS_ORIGINS`, `FRONTEND_URL`. Optional with defaults: `PORT=3001`, `NODE_ENV=development`, `LOG_LEVEL=info`, `THROTTLE_TTL=60`, `THROTTLE_LIMIT=100`, `JWT_ACCESS_EXPIRY=15m`, `JWT_REFRESH_EXPIRY=7d`, `SWAGGER_ENABLED=true`

5. **`src/config/configuration.ts`** — typed config factory using `@nestjs/config`, reads validated env vars

6. **`src/common/filters/global-exception.filter.ts`** — catches ALL exceptions, returns `{ statusCode, message, error, timestamp, path }`. NEVER exposes stack traces, DB details, or internal errors. 4xx → logged as warn. 5xx → logged as error (server-side only). Prisma errors mapped to user-friendly messages.

7. **`src/common/guards/jwt-auth.guard.ts`** — placeholder (full implementation in Phase 3). For now, just export the class extending AuthGuard('jwt').
8. **`src/common/guards/roles.guard.ts`** — placeholder (full implementation in Phase 3). For now, export the class.
9. **`src/common/decorators/`**:
   - `@CurrentUser()` — parameter decorator, extracts user from request
   - `@Roles(...roles)` — sets metadata for RolesGuard
   - `@Public()` — sets metadata to skip JwtAuthGuard
   - `@TenantId()` — parameter decorator, extracts tenantId from JWT
10. **`src/common/pipes/validation.pipe.ts`** — global validation pipe configuration
11. **`src/common/dto/pagination.dto.ts`** — shared pagination query DTO: `page` (default 1), `limit` (default 20, max 100), `search` (optional string), `sortBy` (optional), `sortOrder` (asc/desc)
12. **`src/common/types/`**:
    - `jwt-payload.types.ts` — `JwtPayload { sub: string, tenantId: string, role: string }`
    - `request.types.ts` — `AuthenticatedRequest` extending Express Request with user + tenantId

13. **`src/health/health.module.ts` + `health.controller.ts`** — `GET /api/v1/health` returns `{ status: 'ok', timestamp, uptime, environment }`. Marked `@Public()`.

14. **`.env.example`** — all vars with placeholder values and comments explaining each
15. **`.gitignore`** — `.env`, `.env.*`, `!.env.example`, `node_modules`, `dist`, `*.pem`, `*.key`, `keys/`, `uploads/`, `coverage/`
16. **`docker-compose.yml`** — PostgreSQL 15 (port 5432, db: ibms, user: ibms, pass: ibms_dev_password) + Redis 7 (port 6379). Both with named volumes for persistence.
17. **`Dockerfile`** — multi-stage build: Stage 1 (build) installs deps + compiles TS. Stage 2 (production) copies dist + node_modules, runs as non-root user.
18. **`tsconfig.json`** — `strict: true`, `strictNullChecks: true`, path alias `@/*` → `src/*`
19. **`README.md`** — setup instructions including:
    - RS256 key generation: `mkdir keys && openssl genrsa -out keys/access-private.pem 2048 && openssl rsa -in keys/access-private.pem -pubout -out keys/access-public.pem`
    - Docker setup: `docker-compose up -d`
    - Install: `npm install`
    - Run: `npm run start:dev`
    - Swagger: `http://localhost:3001/api/docs`

**DO NOT** build any auth logic, database schema, or domain modules yet.

## Verification Checklist
- [ ] `npm run build` compiles with zero TypeScript errors
- [ ] `docker-compose up -d` starts PostgreSQL and Redis containers
- [ ] `GET http://localhost:3001/api/v1/health` returns `{ status: 'ok' }`
- [ ] `GET http://localhost:3001/api/docs` loads Swagger UI
- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` exists with documented placeholders
- [ ] No `console.log` in any source file
- [ ] No `any` type in any source file
- [ ] No hardcoded secrets anywhere

After all checks pass, update `CHECKPOINT.md`: mark Phase 1 `[x]` and append results to Verification Log.
