'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';
import { apiClient } from '@/lib/api-client';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, tenantSlug?: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    hasRole: (roles: UserRole[]) => boolean;
    hasPermission: (module: string, action: string) => boolean;
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
    platform_super_admin: 8,
    super_admin: 7,
    tenant_admin: 6,
    admin: 6,
    branch_manager: 5,
    senior_broker: 4,
    broker: 3,
    secretary: 2,
    data_entry: 2,
    viewer: 1,
};

const PERMISSIONS: Record<UserRole, Record<string, string[]>> = {
    platform_super_admin: { '*': ['*'] },
    super_admin: { '*': ['*'] },
    tenant_admin: {
        clients: ['view', 'create', 'edit', 'delete'],
        policies: ['view', 'create', 'edit', 'delete'],
        claims: ['view', 'create', 'edit', 'approve'],
        complaints: ['view', 'create', 'edit', 'resolve'],
        leads: ['view', 'create', 'edit', 'delete'],
        reports: ['view', 'export'],
        settings: ['view', 'edit'],
        users: ['view', 'create', 'edit', 'delete'],
        chat: ['view', 'send'],
        documents: ['view', 'upload', 'delete'],
        compliance: ['view', 'edit'],
    },
    admin: {
        clients: ['view', 'create', 'edit', 'delete'],
        policies: ['view', 'create', 'edit', 'delete'],
        claims: ['view', 'create', 'edit', 'approve'],
        complaints: ['view', 'create', 'edit', 'resolve'],
        leads: ['view', 'create', 'edit', 'delete'],
        reports: ['view', 'export'],
        settings: ['view', 'edit'],
        users: ['view', 'create', 'edit', 'delete'],
        chat: ['view', 'send'],
        documents: ['view', 'upload', 'delete'],
        compliance: ['view', 'edit'],
    },
    branch_manager: {
        clients: ['view', 'create', 'edit'],
        policies: ['view', 'create', 'edit'],
        claims: ['view', 'create', 'edit'],
        complaints: ['view', 'create', 'edit'],
        leads: ['view', 'create', 'edit'],
        reports: ['view', 'export'],
        settings: ['view'],
        chat: ['view', 'send'],
        documents: ['view', 'upload'],
        compliance: ['view'],
    },
    senior_broker: {
        clients: ['view', 'create', 'edit'],
        policies: ['view', 'create', 'edit'],
        claims: ['view', 'create'],
        complaints: ['view', 'create'],
        leads: ['view', 'create', 'edit'],
        reports: ['view'],
        chat: ['view', 'send'],
        documents: ['view', 'upload'],
    },
    broker: {
        clients: ['view', 'create', 'edit'],
        policies: ['view', 'create'],
        claims: ['view', 'create'],
        complaints: ['view', 'create'],
        leads: ['view', 'create', 'edit'],
        chat: ['view', 'send'],
        documents: ['view', 'upload'],
    },
    secretary: {
        clients: ['view', 'create', 'edit'],
        policies: ['view', 'create'],
        leads: ['view', 'create'],
        chat: ['view', 'send'],
        documents: ['view', 'upload'],
    },
    data_entry: {
        clients: ['view', 'create', 'edit'],
        policies: ['view', 'create'],
        leads: ['view', 'create'],
        documents: ['view', 'upload'],
    },
    viewer: {
        clients: ['view'],
        policies: ['view'],
        claims: ['view'],
        reports: ['view'],
        documents: ['view'],
    },
};

// ─── Mock user for fallback when backend is unavailable ──────
const MOCK_USER: User = {
    id: 'mock-user-001',
    tenantId: 'mock-tenant-001',
    email: 'admin@dezag.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    phone: '+233244000001',
    role: 'tenant_admin' as UserRole,
    isActive: true,
    branchId: '',
    createdAt: new Date().toISOString(),
};

function isNetworkError(err: unknown): boolean {
    if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        return msg.includes('network') || msg.includes('econnrefused') || msg.includes('failed to fetch') || msg.includes('err_connection');
    }
    return false;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email, password, tenantSlug = 'sic-insurance') => {
                set({ isLoading: true });
                try {
                    // Try real API first
                    const res = await apiClient.post<{ accessToken: string; user: User }>(
                        '/auth/login',
                        { email, password, tenantSlug },
                    );
                    apiClient.setAccessToken(res.accessToken);
                    set({ user: res.user, isAuthenticated: true, isLoading: false });
                } catch (err: unknown) {
                    // If backend is unreachable, fall back to mock auth
                    if (isNetworkError(err)) {
                        const mockUser: User = {
                            ...MOCK_USER,
                            email,
                            firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                        };
                        set({ user: mockUser, isAuthenticated: true, isLoading: false });
                        return;
                    }
                    set({ isLoading: false });
                    throw new Error('Invalid credentials');
                }
            },

            logout: async () => {
                try {
                    await apiClient.post('/auth/logout');
                } catch {
                    // ignore logout failures
                }
                apiClient.clearAccessToken();
                set({ user: null, isAuthenticated: false });
                
                // Clear persisted storage
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('ibms-auth');
                    window.location.href = '/login';
                }
            },

            checkAuth: async () => {
                if (get().isLoading) return;

                // If already authenticated (from persisted state), don't break the session
                if (get().isAuthenticated && get().user) {
                    return;
                }

                set({ isLoading: true });
                try {
                    const res = await apiClient.post<{ accessToken: string; user: User }>(
                        '/auth/refresh',
                    );
                    apiClient.setAccessToken(res.accessToken);
                    set({ user: res.user, isAuthenticated: true, isLoading: false });
                } catch (err: unknown) {
                    // If backend unreachable and we have persisted auth, keep it
                    if (isNetworkError(err) && get().user) {
                        set({ isLoading: false });
                        return;
                    }
                    apiClient.clearAccessToken();
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },

            hasRole: (roles: UserRole[]) => {
                const user = get().user;
                if (!user) return false;
                if (user.role === 'super_admin' || user.role === 'platform_super_admin') return true;
                return roles.includes(user.role);
            },

            hasPermission: (module: string, action: string) => {
                const user = get().user;
                if (!user) return false;

                const rolePerms = PERMISSIONS[user.role];
                if (!rolePerms) return false;

                if (rolePerms['*']?.includes('*')) return true;

                const modulePerms = rolePerms[module];
                if (!modulePerms) return false;

                return modulePerms.includes(action);
            },
        }),
        {
            name: 'ibms-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
);

export { ROLE_HIERARCHY };
