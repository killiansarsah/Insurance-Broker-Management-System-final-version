'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/**
 * ImpersonationContext — Manages the "Login as" flow for Super Admin.
 * Stores the original token + the impersonated user/tenant info.
 */

interface ImpersonationTarget {
  userId: string;
  userName: string;
  email: string;
  tenantName: string;
  tenantId: string;
  role: string;
}

interface ImpersonationState {
  isImpersonating: boolean;
  target: ImpersonationTarget | null;
  originalToken: string | null;
  startImpersonation: (token: string, target: ImpersonationTarget) => void;
  exitImpersonation: () => void;
}

const ImpersonationCtx = createContext<ImpersonationState>({
  isImpersonating: false,
  target: null,
  originalToken: null,
  startImpersonation: () => {},
  exitImpersonation: () => {},
});

export function useImpersonation() {
  return useContext(ImpersonationCtx);
}

export function ImpersonationProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<ImpersonationTarget | null>(null);
  const [originalToken, setOriginalToken] = useState<string | null>(null);

  const startImpersonation = useCallback((token: string, t: ImpersonationTarget) => {
    setOriginalToken(token);
    setTarget(t);
  }, []);

  const exitImpersonation = useCallback(() => {
    // Restore original token
    if (originalToken) {
      const { apiClient } = require('@/lib/api-client');
      apiClient.setAccessToken(originalToken);
    }
    setOriginalToken(null);
    setTarget(null);
  }, [originalToken]);

  return (
    <ImpersonationCtx.Provider
      value={{
        isImpersonating: !!target,
        target,
        originalToken,
        startImpersonation,
        exitImpersonation,
      }}
    >
      {children}
    </ImpersonationCtx.Provider>
  );
}
