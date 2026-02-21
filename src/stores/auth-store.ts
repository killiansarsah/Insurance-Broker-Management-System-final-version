'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    hasRole: (roles: UserRole[]) => boolean;
    hasPermission: (module: string, action: string) => boolean;
}

// Mock user for development
const MOCK_USER: User = {
    id: '1',
    email: 'admin@ibms.com',
    firstName: 'Kwame',
    lastName: 'Asante',
    role: 'admin',
    phone: '+233241234567',
    branchId: 'branch-1',
    avatarUrl: undefined,
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00Z',
};

// Role hierarchy for permission checks
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

// Module permissions by role
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

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email, password) => {
                set({ isLoading: true });
                // Simulate API call
                console.log(`Logging in ${email}`); // Use vars to avoid lint error
                await new Promise((resolve) => setTimeout(resolve, 800));
                set({ user: MOCK_USER, isAuthenticated: true, isLoading: false });
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
            },

            hasRole: (roles: UserRole[]) => {
                const user = get().user;
                if (!user) return false;
                if (user.role === 'super_admin') return true;
                return roles.includes(user.role);
            },

            hasPermission: (module: string, action: string) => {
                const user = get().user;
                if (!user) return false;

                const rolePerms = PERMISSIONS[user.role];
                if (!rolePerms) return false;

                // Super admin wildcard
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
        }
    )
);
