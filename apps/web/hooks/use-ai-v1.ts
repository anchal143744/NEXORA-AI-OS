'use client';

import { useQuery } from '@tanstack/react-query';
import { aiV1Api } from '@/services/ai-v1-api';
import { useAuthStore } from '@/stores/auth-store';

export function useAiProviders() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);
  return useQuery({
    queryKey: ['ai-providers', session?.tenantId ?? 'anonymous', session?.organizationId ?? 'no-organization', session?.workspaceId ?? 'no-workspace'],
    queryFn: () => aiV1Api.getProviders(),
    enabled: hydrated && status === 'authenticated' && Boolean(session?.accessToken),
    staleTime: 60_000,
    retry: 1,
  });
}
