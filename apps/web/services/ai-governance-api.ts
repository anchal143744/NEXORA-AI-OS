const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  if (!response.ok) throw new Error(`AI governance API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const aiGovernanceApi = {
  center: () => request('/v1/ai-governance/center'),
  riskMonitoring: () => request('/v1/ai-governance/risk-monitoring'),
  modelRegistry: () => request('/v1/model-registry/dashboard'),
  models: () => request('/v1/model-registry/models'),
  deployments: () => request('/v1/modelops/deployments'),
  approvals: () => request('/v1/modelops/approval-workflows'),
  decisions: () => request('/v1/decision-intelligence/decisions'),
  auditTrail: () => request('/v1/ai-audit/trail'),
  compliance: () => request('/v1/ai-compliance/dashboard'),
  explainability: () => request('/v1/ai-explainability/records'),
  performance: () => request('/v1/model-performance/dashboard'),
};