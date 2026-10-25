const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  if (!response.ok) throw new Error(`Customer experience API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const customerExperienceApi = {
  dashboard: () => request('/v1/customer-experience/dashboard'),
  healthScores: () => request('/v1/customer-health/scores'),
  successPlans: () => request('/v1/customer-success/plans'),
  churnPredictions: () => request('/v1/churn-predictions'),
  renewals: () => request('/v1/renewals'),
  revenueOpportunities: () => request('/v1/revenue-opportunities'),
  serviceTickets: () => request('/v1/service-tickets'),
  slaRecords: () => request('/v1/sla'),
  feedback: () => request('/v1/customer-feedback'),
};
