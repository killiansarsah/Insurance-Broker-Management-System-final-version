'use client';

import { useAuthStore } from '@/stores/auth-store';

/**
 * Quick hook to confirm the current user is a Super Admin.
 * Returns the user info plus a boolean guard.
 */
export function useSuperAdminAuth() {
  const { user, isAuthenticated } = useAuthStore();

  const isSuperAdmin =
    isAuthenticated &&
    !!user &&
    (user.role === 'PLATFORM_SUPER_ADMIN' || user.role === 'WORKSPACE_OWNER');

  return {
    user,
    isAuthenticated,
    isSuperAdmin,
    role: user?.role ?? null,
  };
}
