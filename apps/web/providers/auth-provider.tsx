'use client';
import { apiRequest } from '@/lib/api-client';
import type { AuthResponse } from '@/types/auth';

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import type { AuthUser } from '@/types/auth';

let restoreInFlight: Promise<AuthResponse> | null = null;
function restoreSession() {
  if (!restoreInFlight) restoreInFlight = apiRequest<AuthResponse>('/v1/auth/refresh', { method: 'POST', body: { sessionTransport: 'cookie' } }).finally(() => { restoreInFlight = null; });
  return restoreInFlight;
}

type AuthContextValue = {
  user: AuthUser | null;
  userId: string | null;
  name: string;
  roles: string[];
  authenticated: boolean;
  status: 'unknown' | 'authenticated' | 'anonymous';
  hydrated: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userId: null,
  name: '',
  roles: [],
  authenticated: false,
  status: 'unknown',
  hydrated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const hydrated = useAuthStore((state) => state.hydrated);
  const hydrateFromStorage = useAuthStore((state) => state.hydrateFromStorage);

  useEffect(() => {
    hydrateFromStorage();
    let active = true;
    restoreSession().then(result => { if (active) useAuthStore.getState().setSession(result.user, result.session); }).catch(() => { if (active) useAuthStore.getState().clearSession(); });
    return () => { active = false; };
  }, [hydrateFromStorage]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      userId: user?.id ?? null,
      name: hydrated && user ? user.name : '',
      roles: hydrated ? user?.roles ?? [] : [],
      authenticated: hydrated && status === 'authenticated',
      status,
      hydrated,
    }),
    [hydrated, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
