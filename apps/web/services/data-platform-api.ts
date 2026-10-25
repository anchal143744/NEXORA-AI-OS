const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  if (!response.ok) throw new Error(`Data platform API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const dataPlatformApi = {
  dataLakeOverview: () => request('/v1/data-lake/overview'),
  warehouses: () => request('/v1/data-warehouse'),
  warehouseExplorer: () => request('/v1/data-warehouse/explorer'),
  semanticManager: () => request('/v1/semantic-layer/manager'),
  semanticMetrics: () => request('/v1/semantic-layer/metrics'),
  kpis: () => request('/v1/kpis'),
  kpiScorecard: () => request('/v1/kpis/scorecard'),
  executiveAnalytics: () => request('/v1/executive-dashboards/analytics'),
  pipelines: () => request('/v1/data-pipelines'),
  dataMarts: () => request('/v1/data-marts'),
};