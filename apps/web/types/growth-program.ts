export type GrowthStatus = 'healthy' | 'accelerating' | 'watch' | 'blocked';

export interface GrowthMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  status: GrowthStatus;
}

export interface AdoptionSignal {
  id: string;
  signal: string;
  segment: string;
  value: string;
  businessImpact: string;
  status: GrowthStatus;
}

export interface ExpansionOpportunity {
  id: string;
  account: string;
  opportunity: string;
  value: string;
  recommendation: string;
  status: GrowthStatus;
}

export interface EnterpriseAccount {
  id: string;
  account: string;
  renewal: string;
  executiveRelationship: string;
  growthPlan: string;
  status: GrowthStatus;
}

export interface AiExpansionCapability {
  id: string;
  capability: string;
  scope: string;
  businessImpact: string;
  status: GrowthStatus;
}

export interface AgentNetworkSignal {
  id: string;
  network: string;
  collaboration: string;
  sharedMemory: string;
  workflow: string;
  status: GrowthStatus;
}

export interface UsageMetric {
  id: string;
  metric: string;
  value: string;
  trend: string;
  interpretation: string;
}

export interface RevenueExpansionMetric {
  id: string;
  metric: string;
  value: string;
  forecast: string;
  action: string;
}

export interface RetentionSignal {
  id: string;
  customer: string;
  healthScore: string;
  churnRisk: string;
  playbook: string;
  status: GrowthStatus;
}

export interface ScaleReadinessCheck {
  id: string;
  domain: string;
  readiness: number;
  validation: string;
  status: GrowthStatus;
}

export interface EnterpriseSuccessMetric {
  id: string;
  metric: string;
  value: string;
  impact: string;
}

export interface ExecutiveGrowthCommand {
  id: string;
  command: string;
  response: string;
}

export interface GrowthProgramRoute {
  path: string;
  module: string;
  marker: string;
}
