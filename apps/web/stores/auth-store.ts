'use client';

import { create } from 'zustand';
import type { AuthSession, AuthUser } from '@/types/auth';

export const AUTH_STORAGE_KEY = 'nexora.auth.session';

type StoredAuthState = {
  user: AuthUser | null;
  session: AuthSession | null;
};

type AuthStatus = 'unknown' | 'authenticated' | 'anonymous';

type AuthState = StoredAuthState & {
  status: AuthStatus;
  hydrated: boolean;
  scopeError: string;
  setScopeError: (value: string) => void;
  scopeTransition: boolean;
  setScopeTransition: (value: boolean) => void;
  hydrateFromStorage: () => void;
  setSession: (user: AuthUser, session: AuthSession) => void;
  setUser: (user: AuthUser | null) => void;
  clearSession: () => void;
};

const emptyAuthState: StoredAuthState = { user: null, session: null };

function readStoredAuth(): StoredAuthState {
  if (typeof window === 'undefined') return emptyAuthState;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const value = raw ? JSON.parse(raw) : null;
    return value && typeof value === 'object' && !Array.isArray(value) ? { user: value.user ?? null, session: value.session && typeof value.session === 'object' ? value.session : null } : emptyAuthState;
  } catch {
    return emptyAuthState;
  }
}

function writeStoredAuth(value: StoredAuthState) {
  if (typeof window === 'undefined') return;
  // Keep tokens only in memory. The HttpOnly refresh cookie restores a session.
  const { user, session } = value;
  try { window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, session: session ? { id: session.id, tenantId: session.tenantId, organizationId: session.organizationId, workspaceId: session.workspaceId, expiresAt: session.expiresAt } : null })); } catch {}
}

function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem(AUTH_STORAGE_KEY); } catch {}
}

function statusFor(session: AuthSession | null): AuthStatus {
  return session?.accessToken ? 'authenticated' : 'anonymous';
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  status: 'unknown',
  hydrated: false,
  scopeError: '',
  setScopeError: value => set({ scopeError: value }),
  scopeTransition: false,
  setScopeTransition: value => set({ scopeTransition: value }),
  hydrateFromStorage: () => {
    // Stored display metadata is not authentication evidence. Purge legacy tokens.
    const stored = readStoredAuth(); writeStoredAuth(stored);
    set({ user: null, session: null, status: 'unknown', hydrated: false });
  },
  setSession: (user, session) => {
    writeStoredAuth({ user, session });
    set({ user, session, status: statusFor(session), hydrated: true });
  },
  setUser: (user) => {
    const current = get();
    writeStoredAuth({ user, session: current.session });
    set({ user, session: current.session, status: user ? 'authenticated' : 'anonymous', hydrated: true });
  },
  clearSession: () => {
    clearStoredAuth();
    set({ user: null, session: null, status: 'anonymous', hydrated: true, scopeError: '' });
  },
}));
