'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSuperAdminAuth } from '@/hooks/super-admin/useSuperAdminAuth';
import { ShieldAlert } from 'lucide-react';
import { AppLoader } from '@/components/ui/AppLoader';

/**
 * SuperAdminGuard — Ensures the user has Super Admin privileges.
 * If not authenticated, redirects to login.
 * If authenticated but NOT a super admin, shows a hard access denied message.
 */
export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin, user } = useSuperAdminAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Basic timeout to avoid flash of "Access Denied" if zustand is rehydrating
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.replace(`/login?returnUrl=${returnUrl}`);
    }
  }, [isChecking, isAuthenticated, router]);

  if (isChecking) {
    return <AppLoader message="Verifying access level..." isLoading={true} fullScreen={true} />;
  }

  // If we're authenticated but clearly not a super admin, show strict 403
  if (isAuthenticated && !isSuperAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#021a13] text-[#f0f4f3] p-6 selection:bg-[#0c6a55]">
        <div className="max-w-md w-full text-center space-y-4">
          <ShieldAlert size={64} className="mx-auto text-[#b91c1c]" />
          <h1 className="text-3xl font-bold font-serif tracking-tight">Access Restricted</h1>
          <p className="text-[#7a9a8c] text-sm">
            This area is strictly reserved for platform administrators. Ensure you are logged in with the correct credentials.
          </p>
          <div className="pt-6">
            <button
              onClick={() => router.replace('/dashboard')}
              className="px-6 py-2.5 bg-[#ffffff] text-[#021a13] text-sm font-bold rounded-full hover:bg-[#D0F0E4] transition-colors"
            >
              Return to User Dashboard
            </button>
          </div>
          {user?.email && (
            <p className="text-xs text-[#0F6E56] mt-8 font-mono">
              Attempt logged: {user.email} [{user.role}]
            </p>
          )}
        </div>
      </div>
    );
  }

  // Good to go
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  return null;
}
