export type AnalyticsTone = 'healthy' | 'watch' | 'risk';
export type DashboardDomain = 'CRM' | 'HR' | 'Finance' | 'Operations' | 'Projects' | 'AI Agents' | 'Customer Success';
export type ForecastType = 'revenue' | 'hiring' | 'budget' | 'demand' | 'productivity';
export type InsightSeverity = 'opportunity' | 'risk' | 'info';

export interface AnalyticsMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: string;
  tone: AnalyticsTone;
}

export interface TrendPoint {
  period: string;
  revenue: number;
  customers: number;
  workforce: number;
  operations: number;
}

export interface ExecutiveIntelligenceSignal {
  id: string;
  label: string;
  value: string;
  explanation: string;
  tone: AnalyticsTone;
}

export interface BiDashboard {
  id: string;
  domain: DashboardDomain;
  title: string;
  metric: string;
  health: number;
  summary: string;
}

export interface KpiRecord {
  id: string;
  name: string;
  owner: string;
  current: number;
  target: number;
  unit: string;
  alert: string;
  performance: AnalyticsTone;
}

export interface CrossModuleInsight {
  id: string;
  title: string;
  modules: DashboardDomain[];
  summary: string;
  businessImpact: string;
}

export interface ForecastRecord {
  id: string;
  type: ForecastType;
  period: string;
  value: string;
  confidence: number;
  explanation: string;
}

export interface StrategicInsight {
  id: string;
  title: string;
  severity: InsightSeverity;
  summary: string;
  recommendation: string;
}

export interface ReportDefinition {
  id: string;
  name: string;
  format: 'PDF' | 'Excel' | 'Dashboard';
  schedule: string;
  sections: string[];
}

export interface VisualizationOption {
  id: string;
  label: string;
  useCase: string;
}

export interface ExecutiveScorecard {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: AnalyticsTone;
}

export interface DecisionScenario {
  id: string;
  title: string;
  expectedImpact: string;
  riskAssessment: string;
  recommendation: string;
}

export interface AiAnalyticsCommandResult {
  id: string;
  command: string;
  response: string;
  recommendedActions: string[];
}

export interface AnalyticsWorkspaceData {
  metrics: AnalyticsMetric[];
  trends: TrendPoint[];
  executiveSignals: ExecutiveIntelligenceSignal[];
  dashboards: BiDashboard[];
  kpis: KpiRecord[];
  crossModuleInsights: CrossModuleInsight[];
  forecasts: ForecastRecord[];
  strategicInsights: StrategicInsight[];
  reports: ReportDefinition[];
  visualizationOptions: VisualizationOption[];
  scorecards: ExecutiveScorecard[];
  decisionScenarios: DecisionScenario[];
}
