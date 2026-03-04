# IBMS Backend

Insurance Broker Management System — NestJS Backend API.

## Prerequisites

- Node.js 20 LTS
- Docker & Docker Compose
- OpenSSL (for generating JWT keys)

## Quick Start

### 1. Start Database & Redis

```bash
docker-compose up -d
```

This starts:
- PostgreSQL 15 on port 5432 (db: ibms, user: ibms, pass: ibms_dev_password)
- Redis 7 on port 6379

### 2. Generate RS256 Keys

```bash
mkdir keys
openssl genrsa -out keys/access-private.pem 2048
openssl rsa -in keys/access-private.pem -pubout -out keys/access-public.pem
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings. The app will crash with clear error messages if any required variable is missing.

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Database Migrations (after Phase 2)

```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Start Development Server

```bash
npm run start:dev
```

### 7. Verify

- Health check: [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health)
- Swagger docs: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

## Project Structure

```
src/
├── common/           # Shared utilities
│   ├── decorators/   # @CurrentUser, @Roles, @Public, @TenantId
│   ├── dto/          # PaginationDto
│   ├── filters/      # GlobalExceptionFilter
│   ├── guards/       # JwtAuthGuard, RolesGuard
│   ├── pipes/        # ValidationPipe config
│   └── types/        # JwtPayload, AuthenticatedRequest
├── config/           # Environment validation + configuration
├── health/           # Health check endpoint
├── main.ts           # Application bootstrap
└── app.module.ts     # Root module
```

## Security

- Helmet for HTTP headers
- CORS whitelist
- Rate limiting (100 req/min default)
- Request validation (whitelist: true, forbidNonWhitelisted: true)
- Global exception filter (never leaks internals)
- RS256 JWT authentication (Phase 3+)
- Multi-tenant isolation (Phase 2+)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Development with hot reload |
| `npm run build` | Production build |
| `npm run start:prod` | Run production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run e2e tests |
