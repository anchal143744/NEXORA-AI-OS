const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  if (!response.ok) throw new Error(`Strategic forecasting API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const strategicForecastingApi = {
  dashboard: () => request('/v1/forecasting/dashboard'),
  forecastModels: () => request('/v1/forecasting/models'),
  forecastResults: () => request('/v1/forecasting/results'),
  predictions: () => request('/v1/predictions/results'),
  strategicPlans: () => request('/v1/strategic-planning/plans'),
  scenarios: () => request('/v1/scenarios'),
  budgetPlans: () => request('/v1/budget-planning'),
  capacityPlans: () => request('/v1/capacity-planning'),
  growthForecasts: () => request('/v1/growth-forecast'),
  riskAlerts: () => request('/v1/risk-forecast/alerts'),
  strategyRecommendations: () => request('/v1/strategic-planning/recommendations'),
};