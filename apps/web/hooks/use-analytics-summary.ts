'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsSummaryApi } from '@/services/analytics-summary-api';
import { useAuthStore } from '@/stores/auth-store';

export function useAnalyticsSummary() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);
  return useQuery({
    queryKey: ['analytics-summary', session?.tenantId ?? 'anonymous', session?.organizationId ?? 'no-organization', session?.workspaceId ?? 'no-workspace'],
    queryFn: () => analyticsSummaryApi.getSummary(),
    enabled: hydrated && status === 'authenticated' && Boolean(session?.accessToken),
    staleTime: 30_000,
    retry: 1,
  });
}
