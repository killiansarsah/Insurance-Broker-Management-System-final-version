'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';
import { apiClient } from '@/lib/api-client';

interface TenantOption {
    slug: string;
    name: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    accessToken: string | null;
    _justLoggedInAt: number | null;
    login: (email: string, password: string, tenantSlug?: string) => Promise<TenantOption[] | void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    hasRole: (roles: UserRole[]) => boolean;
    hasPermission: (permission: string) => boolean;
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
    PLATFORM_SUPER_ADMIN: 10,
    WORKSPACE_OWNER: 8,
    ADMINISTRATOR: 7,
    MANAGER: 5,
    SUPERVISOR: 4,
    AGENT: 2,
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
            accessToken: null,
            _justLoggedInAt: null,

            login: async (email, password, tenantSlug?) => {
                set({ isLoading: true });
                try {
                    const res = await apiClient.post<{
                        accessToken?: string;
                        user?: User;
                        requiresTenantSelection?: boolean;
                        tenants?: TenantOption[];
                        requiresTwoFactor?: boolean;
                        userId?: string;
                        tenantId?: string;
                    }>(
                        '/auth/login',
                        { email, password, ...(tenantSlug ? { tenantSlug } : {}) },
                    );

                    // Multiple tenants found — return list for selection
                    if (res.requiresTenantSelection && res.tenants) {
                        set({ isLoading: false });
                        return res.tenants;
                    }

                    // Two-factor authentication required
                    if (res.requiresTwoFactor && res.userId) {
                        set({ isLoading: false });
                        throw new Error('TWO_FACTOR_REQUIRED');
                    }

                    if (!res.accessToken) {
                        throw new Error('Invalid response from server');
                    }
                    apiClient.setAccessToken(res.accessToken!);
                    // Mark that we just freshly logged in — checkAuth should skip
                    // its auto-refresh for 30 seconds to avoid using a stale cookie
                    set({ user: res.user!, isAuthenticated: true, isLoading: false, _justLoggedInAt: Date.now(), accessToken: res.accessToken });
                } catch (err: any) {
                    set({ isLoading: false });
                    if (isNetworkError(err)) {
                        throw new Error('Cannot reach the server. Please ensure the backend is running and try again.');
                    }
                    if (err.response?.status === 429) {
                        throw new Error('Too many login attempts. Please wait a minute and try again.');
                    }
                    throw new Error('Invalid email or password');
                }
            },

            logout: async () => {
                try {
                    await apiClient.post('/auth/logout');
                } catch {
                    // ignore logout failures
                }
                apiClient.clearAccessToken();
                set({ user: null, isAuthenticated: false, accessToken: null });

                // Clear persisted storage
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('ibms-auth');
                    window.location.href = '/login';
                }
            },

            checkAuth: async () => {
                if (get().isLoading) return;

                // If already authenticated (from persisted state), try to restore token
                if (get().isAuthenticated && get().user) {
                    // Restore the access token from persisted state
                    const storedToken = get().accessToken;
                    if (storedToken) {
                        apiClient.setAccessToken(storedToken);
                    }

                    // Skip the refresh if the user just logged in within the last 30 seconds.
                    // This prevents the stale pre-reset cookie from immediately logging them out.
                    const justLoggedInAt = get()._justLoggedInAt;
                    if (justLoggedInAt && Date.now() - justLoggedInAt < 30_000) {
                        return;
                    }

                    // Try to refresh token to ensure it's valid
                    try {
                        const { accessToken, user } = await apiClient.refreshSession();
                        set({ user, isAuthenticated: true, _justLoggedInAt: null, accessToken });
                    } catch (err: unknown) {
                        // If refresh fails, clear auth
                        if (!isNetworkError(err)) {
                            apiClient.clearAccessToken();
                            set({ user: null, isAuthenticated: false, _justLoggedInAt: null, accessToken: null });
                        }
                    }
                    return;
                }

                set({ isLoading: true });
                try {
                    const { accessToken, user } = await apiClient.refreshSession();
                    set({ user, isAuthenticated: true, isLoading: false, accessToken });
                } catch (err: unknown) {
                    // If backend unreachable and we have persisted auth, keep it
                    if (isNetworkError(err) && get().user) {
                        set({ isLoading: false });
                        return;
                    }
                    apiClient.clearAccessToken();
                    set({ user: null, isAuthenticated: false, isLoading: false, accessToken: null });
                }
            },

            hasRole: (roles: UserRole[]) => {
                const user = get().user;
                if (!user) return false;
                const userLevel = ROLE_HIERARCHY[user.role] ?? 0;
                return roles.some(r => userLevel >= (ROLE_HIERARCHY[r] ?? 0));
            },

            hasPermission: (permission: string) => {
                const user = get().user;
                if (!user) return false;
                return user.permissions?.includes(permission) || user.permissions?.includes('*:*') || false;
            },
        }),
        {
            name: 'ibms-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            storage: {
                getItem: (name) => {
                    if (typeof window === 'undefined') return null;
                    const value = sessionStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: (name, value) => {
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem(name, JSON.stringify(value));
                    }
                },
                removeItem: (name) => {
                    if (typeof window !== 'undefined') {
                        sessionStorage.removeItem(name);
                    }
                },
            },
        },
    ),
);

export { ROLE_HIERARCHY };

// Listen for session-expired events from the API client
if (typeof window !== 'undefined') {
    window.addEventListener('auth:session-expired', () => {
        const { logout } = useAuthStore.getState();
        void logout();
    });
}
