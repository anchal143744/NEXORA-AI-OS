'use client';

import { LogOut, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';
import { authApi } from '@/services/auth-api';
import { useAuthStore } from '@/stores/auth-store';

export function ProfileMenu() {
  const auth = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);

  async function signOut() {
    try {
      await authApi.logout();
    } finally {
      queryClient.clear();
      clearSession();
      router.push('/auth/login');
    }
  }

  if (!auth.hydrated || auth.status === 'unknown') {
    return (
      <div className="flex items-center gap-2" aria-label="Loading user profile">
        <div className="h-10 w-32 animate-pulse rounded-md border border-white/10 bg-white/[0.06]" />
      </div>
    );
  }

  const displayName = auth.authenticated ? auth.name : 'Sign in';

  return (
    <div className="flex items-center gap-2">
      <Button variant="subtle" aria-label={auth.authenticated ? 'Current user ' + displayName : 'Sign in'}>
        <UserRound className="size-4" />
        <span className="hidden sm:inline">{displayName}</span>
      </Button>
      {auth.authenticated ? (
        <Button variant="icon" size="icon" onClick={() => void signOut()} aria-label="Sign out">
          <LogOut className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
