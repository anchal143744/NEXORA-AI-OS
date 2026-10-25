export type AnalyticsMetricUnit = 'count' | 'currency' | 'percent';

export interface AnalyticsSummaryMetric {
  key: string;
  label: string;
  value: number;
  unit: AnalyticsMetricUnit;
  source: string;
  scope: 'workspace';
}

export interface AnalyticsSummaryModules {
  crm: {
    leads: number;
    customers: number;
    opportunities: number;
    pipelineValue: number;
    weightedPipeline: number;
    winRate: number;
  };
  finance: {
    revenue: number;
    expenses: number;
    profit: number;
    invoices: number;
    outstandingInvoices: number;
    paidInvoices: number;
    invoiceTotal: number;
  };
  hr: {
    employees: number;
    departments: number;
  };
  projects: {
    projects: number;
    tasks: number;
  };
  activity: {
    volume: number;
  };
}

export interface AnalyticsSummary {
  scope: {
    tenantId: string;
    workspaceId: string | null;
  };
  generatedAt: string;
  empty: boolean;
  metrics: AnalyticsSummaryMetric[];
  modules: AnalyticsSummaryModules;
}
