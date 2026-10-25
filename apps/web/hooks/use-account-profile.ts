'use client';

import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/services/auth-api';
import { useAuthStore } from '@/stores/auth-store';

export function useAccountProfile() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);
  return useQuery({
    queryKey: ['account-profile', session?.tenantId ?? 'anonymous', session?.organizationId ?? 'no-organization', session?.workspaceId ?? 'no-workspace'],
    queryFn: () => authApi.me(),
    enabled: hydrated && status === 'authenticated' && Boolean(session?.accessToken),
    staleTime: 60_000,
    retry: 1,
  });
}
