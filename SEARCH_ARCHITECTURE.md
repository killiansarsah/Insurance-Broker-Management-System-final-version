# Global Search - Architecture & Flow Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Header Component                                         │  │
│  │  - Search Icon Button                                     │  │
│  │  - Keyboard Shortcut (Cmd/Ctrl + K)                      │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │ Opens                                    │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GlobalSearch Component                                   │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Search Input                                       │  │  │
│  │  │  - Minimum 2 characters                            │  │  │
│  │  │  - Real-time updates                               │  │  │
│  │  └────────────────┬───────────────────────────────────┘  │  │
│  │                   │ Triggers                              │  │
│  │                   ▼                                       │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  useGlobalSearch Hook                              │  │  │
│  │  │  - React Query                                     │  │  │
│  │  │  - Debouncing                                      │  │  │
│  │  │  - Caching (30s)                                   │  │  │
│  │  └────────────────┬───────────────────────────────────┘  │  │
│  │                   │ API Call                              │  │
│  │                   ▼                                       │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  API Client                                        │  │  │
│  │  │  - Adds JWT token                                  │  │  │
│  │  │  - Handles errors                                  │  │  │
│  │  │  - Auto-refresh token                              │  │  │
│  │  └────────────────┬───────────────────────────────────┘  │  │
│  └───────────────────┼───────────────────────────────────────┘  │
└────────────────────┼─────────────────────────────────────────┘
                     │
                     │ HTTP GET /api/v1/search?q=query
                     │ Authorization: Bearer <token>
                     │
┌────────────────────▼─────────────────────────────────────────┐
│                      BACKEND (NestJS)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Guards & Middleware                                  │   │
│  │  - JwtAuthGuard (Verify token)                       │   │
│  │  - RolesGuard (Check permissions)                    │   │
│  │  - ThrottlerGuard (Rate limiting)                    │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │ Authorized                           │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SearchController                                     │   │
│  │  - GET /search?q=query                               │   │
│  │  - GET /search/recent                                │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │ Calls                                │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SearchService                                        │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  globalSearch(tenantId, query, limit)          │  │   │
│  │  │  - Searches 5 entity types                     │  │   │
│  │  │  - Tenant isolation                            │  │   │
│  │  │  - Returns max 20 results                      │  │   │
│  │  └────────────────┬───────────────────────────────┘  │   │
│  │                   │ Queries                           │   │
│  │                   ▼                                   │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Prisma ORM                                    │  │   │
│  │  │  - Type-safe queries                           │  │   │
│  │  │  - SQL injection prevention                    │  │   │
│  │  └────────────────┬───────────────────────────────┘  │   │
│  └───────────────────┼───────────────────────────────────┘   │
└────────────────────┼─────────────────────────────────────┘
                     │
                     │ SQL Queries
                     │
┌────────────────────▼─────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Client     │  │   Policy     │  │    Claim     │      │
│  │   Table      │  │   Table      │  │    Table     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │    Lead      │  │    Quote     │                         │
│  │    Table     │  │    Table     │                         │
│  └──────────────┘  └──────────────┘                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Search Flow Sequence

```
User Action                Frontend                Backend                 Database
    │                         │                       │                       │
    │ Press Cmd+K            │                       │                       │
    ├────────────────────────>│                       │                       │
    │                         │                       │                       │
    │                         │ Open Modal            │                       │
    │                         │ Show Recent Items     │                       │
    │                         │                       │                       │
    │ Type "john"            │                       │                       │
    ├────────────────────────>│                       │                       │
    │                         │                       │                       │
    │                         │ Debounce (300ms)      │                       │
    │                         │                       │                       │
    │                         │ GET /search?q=john    │                       │
    │                         ├──────────────────────>│                       │
    │                         │                       │                       │
    │                         │                       │ Verify JWT            │
    │                         │                       │ Check Tenant          │
    │                         │                       │                       │
    │                         │                       │ Search Clients        │
    │                         │                       ├──────────────────────>│
    │                         │                       │<──────────────────────┤
    │                         │                       │ Results: 2 clients    │
    │                         │                       │                       │
    │                         │                       │ Search Policies       │
    │                         │                       ├──────────────────────>│
    │                         │                       │<──────────────────────┤
    │                         │                       │ Results: 1 policy     │
    │                         │                       │                       │
    │                         │                       │ Search Claims         │
    │                         │                       ├──────────────────────>│
    │                         │                       │<──────────────────────┤
    │                         │                       │ Results: 0 claims     │
    │                         │                       │                       │
    │                         │                       │ Combine Results       │
    │                         │                       │ Format Response       │
    │                         │                       │                       │
    │                         │<──────────────────────┤                       │
    │                         │ 200 OK                │                       │
    │                         │ [3 results]           │                       │
    │                         │                       │                       │
    │                         │ Render Results        │                       │
    │<────────────────────────┤                       │                       │
    │ See 3 results          │                       │                       │
    │                         │                       │                       │
    │ Click result           │                       │                       │
    ├────────────────────────>│                       │                       │
    │                         │                       │                       │
    │                         │ Navigate to page      │                       │
    │<────────────────────────┤                       │                       │
    │                         │                       │                       │
```

## 📊 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Search Query: "john"                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Processing                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Validate Query                                           │
│     ✓ Length >= 2 characters                                │
│     ✓ Sanitize input                                        │
│                                                               │
│  2. Search Clients                                           │
│     WHERE (firstName ILIKE '%john%'                          │
│         OR lastName ILIKE '%john%'                           │
│         OR email ILIKE '%john%')                             │
│     AND tenantId = 'user-tenant-id'                          │
│     LIMIT 5                                                  │
│     ➜ Found: 2 clients                                       │
│                                                               │
│  3. Search Policies                                          │
│     WHERE policyNumber ILIKE '%john%'                        │
│        OR client.firstName ILIKE '%john%'                    │
│     AND tenantId = 'user-tenant-id'                          │
│     LIMIT 5                                                  │
│     ➜ Found: 1 policy                                        │
│                                                               │
│  4. Search Claims                                            │
│     WHERE claimNumber ILIKE '%john%'                         │
│        OR policy.client.firstName ILIKE '%john%'             │
│     AND tenantId = 'user-tenant-id'                          │
│     LIMIT 5                                                  │
│     ➜ Found: 0 claims                                        │
│                                                               │
│  5. Search Leads                                             │
│     WHERE firstName ILIKE '%john%'                           │
│        OR lastName ILIKE '%john%'                            │
│        OR company ILIKE '%john%'                             │
│     AND tenantId = 'user-tenant-id'                          │
│     LIMIT 5                                                  │
│     ➜ Found: 0 leads                                         │
│                                                               │
│  6. Search Quotes                                            │
│     WHERE quoteNumber ILIKE '%john%'                         │
│        OR client.firstName ILIKE '%john%'                    │
│     AND tenantId = 'user-tenant-id'                          │
│     LIMIT 5                                                  │
│     ➜ Found: 0 quotes                                        │
│                                                               │
│  7. Combine & Format Results                                 │
│     Total: 3 results                                         │
│                                                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Response Format                           │
├─────────────────────────────────────────────────────────────┤
│  [                                                           │
│    {                                                         │
│      id: "uuid-1",                                          │
│      type: "client",                                        │
│      title: "John Doe",                                     │
│      subtitle: "john.doe@example.com",                      │
│      href: "/dashboard/clients/uuid-1"                      │
│    },                                                        │
│    {                                                         │
│      id: "uuid-2",                                          │
│      type: "client",                                        │
│      title: "Johnson Smith",                                │
│      subtitle: "INDIVIDUAL",                                │
│      href: "/dashboard/clients/uuid-2"                      │
│    },                                                        │
│    {                                                         │
│      id: "uuid-3",                                          │
│      type: "policy",                                        │
│      title: "POL-2026-001",                                 │
│      subtitle: "Motor Insurance - John Doe",                │
│      href: "/dashboard/policies/uuid-3",                    │
│      metadata: { status: "ACTIVE" }                         │
│    }                                                         │
│  ]                                                           │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Authentication                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  JwtAuthGuard                                        │   │
│  │  - Verify JWT token                                  │   │
│  │  - Check token expiry                                │   │
│  │  - Extract user info                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                    │
│                         ▼                                    │
│  Layer 2: Authorization                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  RolesGuard                                          │   │
│  │  - Check user role                                   │   │
│  │  - Verify permissions                                │   │
│  │  - Allow: ADMIN, TENANT_ADMIN, BROKER, VIEWER       │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                    │
│                         ▼                                    │
│  Layer 3: Tenant Isolation                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SearchService                                       │   │
│  │  - Filter by tenantId                                │   │
│  │  - User only sees their org's data                   │   │
│  │  - Prevent cross-tenant access                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                    │
│                         ▼                                    │
│  Layer 4: Input Validation                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Query Validation                                    │   │
│  │  - Minimum 2 characters                              │   │
│  │  - Sanitize input                                    │   │
│  │  - Prevent SQL injection (Prisma)                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                    │
│                         ▼                                    │
│  Layer 5: Rate Limiting                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ThrottlerGuard                                      │   │
│  │  - Limit: 100 requests per 60 seconds               │   │
│  │  - Prevent abuse                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📈 Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                  Performance Strategy                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend Optimization                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • Debouncing (300ms)                                │   │
│  │  • React Query caching (30s)                         │   │
│  │  • Lazy loading results                              │   │
│  │  • Virtual scrolling (future)                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  Backend Optimization                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • Limit results (5 per type, 20 total)             │   │
│  │  • Parallel queries (Promise.all)                    │   │
│  │  • Database indexes (recommended)                    │   │
│  │  • Query optimization                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  Database Optimization                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • Indexes on search fields                          │   │
│  │  • Partial indexes for active records                │   │
│  │  • Query plan analysis                               │   │
│  │  • Connection pooling                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

**Legend:**
- `│` = Flow direction
- `▼` = Next step
- `├─>` = API call
- `<─┤` = Response
- `✓` = Validation passed
- `➜` = Result
