const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  if (!response.ok) throw new Error(`Product intelligence API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const productIntelligenceApi = {
  dashboard: () => request('/v1/product-intelligence/dashboard'),
  healthScores: () => request('/v1/product-health/scores'),
  usageMetrics: () => request('/v1/usage-analytics/metrics'),
  events: () => request('/v1/events/product'),
  journeys: () => request('/v1/journeys'),
  funnels: () => request('/v1/funnels'),
  experiments: () => request('/v1/experiments'),
  retention: () => request('/v1/retention/cohorts'),
  engagement: () => request('/v1/engagement/scores'),
  growthInsights: () => request('/v1/growth-insights/growth'),
};
