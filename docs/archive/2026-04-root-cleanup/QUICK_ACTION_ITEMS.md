# IBMS Backend - Quick Action Items

## 🚨 CRITICAL - Fix Immediately (2-4 hours)

### 1. TypeScript Compilation Errors
**Files to fix:**
- `src/carriers/carriers.service.ts` (Lines 20-21)
- `src/carriers/products/carrier-products.service.ts` (Lines 20-21)  
- `src/clients/clients.service.ts` (Lines 34-35)
- `src/policies/policies.controller.ts` (Line 8)
- `src/policies/policies.service.ts` (Multiple lines)

**Fix:**
```typescript
import { Prisma } from '@prisma/client';

// Replace all instances of:
before: null,
after: null,

// With:
before: Prisma.JsonNull,
after: Prisma.JsonNull,

// Remove unused imports in policies.controller.ts
```

### 2. Initialize Database (30 minutes)
```bash
cd ibms-backend
docker-compose up -d
npx prisma migrate dev --name initial_schema
npx prisma db seed
psql -U ibms -d ibms -f prisma/rls.sql
```

---

## ⚠️ HIGH PRIORITY - Next 2 Weeks

### 3. Phase 11: Frontend Connection
**Status:** Not started (0%)

**Tasks:**
- [ ] Create API client (`src/lib/api-client.ts`)
- [ ] Add `.env.local` with API URLs
- [ ] Replace mock auth with real API
- [ ] Connect all 30+ pages to backend
- [ ] Add error handling
- [ ] Add loading states

**Estimated:** 2-3 weeks

### 4. Multi-Tenancy Completion
**Missing:**
- [ ] Tenant resolution middleware (subdomain → tenantId)
- [ ] Tenant context injection
- [ ] Platform Super Admin portal
- [ ] Tenant onboarding flow

**Estimated:** 1-2 weeks

### 5. Email Service Configuration
**Missing:**
- [ ] Configure `@nestjs-modules/mailer`
- [ ] Create email templates (Handlebars)
- [ ] Add SMTP settings to `.env`
- [ ] Implement password reset emails
- [ ] Implement invitation emails

**Estimated:** 1-2 days

---

## 📋 MEDIUM PRIORITY - Next Month

### 6. File Upload Service
- [ ] S3/MinIO integration
- [ ] Virus scanning
- [ ] Tenant-prefixed storage
- [ ] Signed URLs

**Estimated:** 3-5 days

### 7. Mobile Money Integration
- [ ] MTN MoMo API
- [ ] Vodafone Cash API
- [ ] AirtelTigo Money API
- [ ] Payment webhooks

**Estimated:** 1-2 weeks

### 8. Redis Integration
- [ ] Session storage
- [ ] Caching layer
- [ ] Rate limiting
- [ ] WebSocket adapter

**Estimated:** 1-2 days

---

## 🔍 LOW PRIORITY - Next 2-3 Months

### 9. Subscription Billing
- [ ] Plan management
- [ ] Usage tracking
- [ ] Invoice generation
- [ ] Payment collection

**Estimated:** 2 weeks

### 10. Comprehensive Testing
- [ ] Unit tests (80% coverage target)
- [ ] Integration tests
- [ ] E2E tests

**Estimated:** 2-3 weeks

### 11. SMS Service
- [ ] Hubtel/Twilio integration
- [ ] SMS templates
- [ ] Delivery tracking

**Estimated:** 2-3 days

---

## 📊 Current Status

| Component | Status | Completion |
|-----------|--------|------------|
| Backend Modules | ✅ Complete | 100% |
| Database Schema | ✅ Complete | 100% |
| API Endpoints | ✅ Complete | 100% |
| TypeScript Errors | 🔴 Blocking | Fix needed |
| Database Init | ⚠️ Pending | Not run |
| Frontend Connection | ❌ Not started | 0% |
| Multi-Tenancy | ⚠️ Partial | 60% |
| Email Service | ❌ Not configured | 0% |
| Testing | ❌ Minimal | 5% |

---

## 🎯 Recommended Sequence

**Week 1:**
1. Fix TypeScript errors (Day 1)
2. Initialize database (Day 1)
3. Test all endpoints (Day 1-2)
4. Configure email service (Day 2-3)
5. Start Phase 11 (Day 4-5)

**Week 2-3:**
- Complete Phase 11 (frontend connection)
- Implement tenant resolution middleware
- Add file upload service

**Week 4-6:**
- Complete multi-tenancy features
- Integrate mobile money APIs
- Add comprehensive error handling

**Month 2-3:**
- Implement subscription billing
- Add comprehensive testing
- Security audit
- Production deployment

---

## 🚀 Quick Start Commands

```bash
# Fix TypeScript errors (manual)
# Edit the 5 files listed above

# Initialize database
cd ibms-backend
docker-compose up -d
npx prisma migrate dev
npx prisma db seed

# Apply RLS policies
psql -U ibms -d ibms -f prisma/rls.sql

# Test build
npm run build
npm run lint

# Start backend
npm run start:dev

# Test health endpoint
curl http://localhost:3001/api/v1/health

# View Swagger docs
open http://localhost:3001/api/docs
```

---

**Last Updated:** 2026-03-05  
**Next Review:** After Phase 11 completion
