# Phase 11: Frontend Integration — Connect Next.js to Real Backend

## What This Phase Builds
- Replace ALL mock data with real API calls
- Create shared API client (`api-client.ts`)
- Update auth store to use real JWT flow
- Create `accept-invite` page
- Add TanStack Query (React Query) for server state management
- Update all dashboard pages to fetch from backend
- Handle loading/error states consistently

## Prerequisites
- Phase 10 ✅ (All backend modules complete)

## Prompt

In the FRONTEND project at `ibms/` (Next.js app):

### Step 1: Install Dependencies

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools axios socket.io-client
```

### Step 2: Create API Client (`src/lib/api-client.ts`)

```typescript
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // sends httpOnly cookie for refresh token
      headers: { 'Content-Type': 'application/json' },
    });

    // Request interceptor: attach access token
    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Response interceptor: handle 401, auto-refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch {
            this.accessToken = null;
            window.location.href = '/login';
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setAccessToken(token: string) { this.accessToken = token; }
  clearAccessToken() { this.accessToken = null; }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.client
        .post('/auth/refresh')
        .then((res) => {
          this.accessToken = res.data.accessToken;
          return res.data.accessToken;
        })
        .finally(() => { this.refreshPromise = null; });
    }
    return this.refreshPromise;
  }

  // CRUD helpers
  async get<T>(url: string, params?: Record<string, unknown>) {
    const res = await this.client.get<T>(url, { params });
    return res.data;
  }
  async post<T>(url: string, data?: unknown) {
    const res = await this.client.post<T>(url, data);
    return res.data;
  }
  async patch<T>(url: string, data?: unknown) {
    const res = await this.client.patch<T>(url, data);
    return res.data;
  }
  async delete<T>(url: string) {
    const res = await this.client.delete<T>(url);
    return res.data;
  }
}

export const apiClient = new ApiClient();
```

### Step 3: Setup React Query (`src/lib/query-client.ts` + Provider)

```typescript
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

Wrap the app in `QueryClientProvider` in `src/app/layout.tsx`:
```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';

// In the layout component:
<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Step 4: Create API Hooks (`src/hooks/api/`)

Create custom hooks for each domain. Example pattern:

```typescript
// src/hooks/api/use-clients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Client, PaginatedResponse } from '@/types';

export function useClients(params?: { page?: number; limit?: number; search?: string; status?: string }) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => apiClient.get<PaginatedResponse<Client>>('/clients', params),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => apiClient.get<Client>(`/clients/${id}`),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Client>) => apiClient.post<Client>('/clients', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}
```

Create similar hooks for ALL domains:
- `use-auth.ts` — login, register, invite accept, refresh, logout
- `use-clients.ts` — CRUD + KYC/AML
- `use-policies.ts` — CRUD + bind/cancel/renew + endorsements + installments
- `use-claims.ts` — CRUD + status transitions + documents
- `use-complaints.ts` — CRUD + status transitions
- `use-carriers.ts` — CRUD + products
- `use-finance.ts` — invoices, transactions, commissions, expenses, premium financing, dashboard
- `use-leads.ts` — CRUD + kanban + stage change + convert
- `use-documents.ts` — CRUD
- `use-tasks.ts` — CRUD + status
- `use-calendar.ts` — CRUD + RSVP
- `use-notifications.ts` — list + read + count
- `use-reports.ts` — dashboard, production, claims, renewals, financial, compliance
- `use-users.ts` — CRUD + invite
- `use-chat.ts` — rooms + messages (REST part; WebSocket separate)
- `use-approvals.ts` — list + approve/reject
- `use-settings.ts` — get/update tenant settings + profile + change password

### Step 5: Update Auth Store (`src/stores/auth-store.ts`)

Replace the mock auth store:
- Remove MOCK_USER, remove setTimeout login
- `login()`: call `apiClient.post('/auth/login', { email, password, tenantSlug })`
   → store accessToken via `apiClient.setAccessToken(token)`
   → store user in Zustand
- `logout()`: call `apiClient.post('/auth/logout')` → clear token → redirect to `/login`
- `checkAuth()`: call `apiClient.post('/auth/refresh')` silently on app load
   → if success: set user + token
   → if fail: clear and redirect to login
- Keep `hasRole()` and `hasPermission()` methods (they read from user.role and permissions)

### Step 6: Create Accept Invite Page (`src/app/(auth)/accept-invite/page.tsx`)

```tsx
// Route: /accept-invite?token=xxx
// 1. On load: call GET /api/v1/invitations/validate/:token
// 2. If valid: show form (firstName, lastName, password, confirmPassword)
// 3. On submit: POST /api/v1/invitations/accept → auto-login → redirect to /dashboard
// 4. If invalid: show error message with reason (expired/already used/revoked)
```

### Step 7: Update Dashboard Pages

For each dashboard page, replace mock data imports with React Query hooks:

**Example: Clients page (`src/app/dashboard/clients/page.tsx`)**_

Before:
```tsx
import { MOCK_CLIENTS } from '@/mock/clients';
const clients = MOCK_CLIENTS;
```

After:
```tsx
import { useClients } from '@/hooks/api/use-clients';
const { data, isLoading, error } = useClients({ page, limit: 20, search: searchTerm });
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorState error={error} />;
const clients = data?.items ?? [];
```

Do this for ALL 28 dashboard pages. Each page should:
1. Remove mock data imports
2. Use the appropriate React Query hook
3. Handle loading state (show skeleton or spinner)
4. Handle error state (show error message with retry button)
5. Handle empty state (show "No items found" message)
6. Wire up create/edit/delete forms to mutation hooks

### Step 8: WebSocket Chat Integration

```typescript
// src/hooks/use-chat-socket.ts
import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth-store';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export function useChatSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;
    const socket = io(`${SOCKET_URL}/chat`, {
      auth: { token: accessToken },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => console.log('Chat connected'));
    socket.on('disconnect', () => console.log('Chat disconnected'));

    return () => { socket.disconnect(); };
  }, [accessToken]);

  const joinRoom = useCallback((roomId: string) => {
    socketRef.current?.emit('join_room', { roomId });
  }, []);

  const sendMessage = useCallback((roomId: string, content: string) => {
    socketRef.current?.emit('send_message', { roomId, content });
  }, []);

  const onNewMessage = useCallback((callback: (msg: any) => void) => {
    socketRef.current?.on('new_message', callback);
    return () => { socketRef.current?.off('new_message', callback); };
  }, []);

  return { joinRoom, sendMessage, onNewMessage, socket: socketRef.current };
}
```

### Step 9: Update Protected Route

Update `src/components/auth/protected-route.tsx`:
- On mount: call auth store's `checkAuth()` (which tries token refresh)
- While checking: show full-page loading spinner
- If not authenticated: redirect to `/login`
- If authenticated: render children

### Step 10: Environment Variables

Create `.env.local` (NOT committed to git):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

Add to `.gitignore`:
```
.env.local
.env.production
```

### Step 11: Update PaginatedResponse Type

Add to `src/types/index.ts`:
```typescript
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
```

## Verification Checklist
- [ ] `npm run build` (frontend) — zero errors
- [ ] `npm run dev` (frontend + backend) — both start without errors
- [ ] Login page → calls real backend → JWT returned → redirected to dashboard
- [ ] Dashboard loads → data from real backend (not mock)
- [ ] Navigate to clients → list loads from API
- [ ] Create new client → saved to DB → appears in list
- [ ] Search clients → server-side search works
- [ ] Policies page → shows real policies
- [ ] Claims page → shows real claims with NIC deadlines
- [ ] Finance dashboard → shows real aggregations
- [ ] Accept invite page → validates token → creates account → auto-login
- [ ] Chat → WebSocket connects → messages send and receive in real-time
- [ ] Notifications bell → shows real unread count
- [ ] Token expiry → auto-refresh happens silently
- [ ] Refresh token expired → redirected to login
- [ ] All forms submit to real API
- [ ] Loading states shown while fetching
- [ ] Error states shown on API failure with retry button
- [ ] No remaining references to `@/mock/*` in any page component
- [ ] `.env.local` exists and is gitignored
- [ ] No `console.log` in production code

After all checks pass, update `CHECKPOINT.md`: mark Phase 11 `[x]`.

## 🎉 THE BACKEND IS COMPLETE!

At this point you have:
- ✅ Full NestJS backend with 28+ modules
- ✅ PostgreSQL database with 40+ tables
- ✅ JWT RS256 auth with refresh token rotation
- ✅ Multi-tenant with Row-Level Security
- ✅ Role-based access control (10 roles)
- ✅ Real-time chat via WebSocket
- ✅ Financial management with MoMo support
- ✅ NIC compliance tracking
- ✅ Complete audit trail
- ✅ Frontend connected to real backend
