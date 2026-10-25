import { apiRequest } from '@/lib/api-client';
import type { AnalyticsSummary } from '@/types/analytics-summary';

export const analyticsSummaryApi = {
  getSummary: () => apiRequest<AnalyticsSummary>('/v1/analytics/summary'),
};
