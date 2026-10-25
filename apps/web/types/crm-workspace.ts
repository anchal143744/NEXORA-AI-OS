export type OpportunityStage = 'lead' | 'qualified' | 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export type LeadStatus = 'new' | 'assigned' | 'qualified' | 'nurture' | 'converted' | 'disqualified';
export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note';
export type ForecastPeriod = 'monthly' | 'quarterly' | 'annual';

export interface CrmMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: string;
  tone: 'healthy' | 'watch' | 'risk';
}

export interface LeadRecord {
  id: string;
  name: string;
  company: string;
  role: string;
  source: string;
  owner: string;
  status: LeadStatus;
  score: number;
  conversionProbability: number;
  value: number;
  nextBestAction: string;
  lifecycle: string[];
  tags: string[];
}

export interface ContactRecord {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  segment: string;
  tags: string[];
  lastTouch: string;
  notes: string;
  communicationHistory: string[];
}

export interface AccountRecord {
  id: string;
  name: string;
  industry: string;
  region: string;
  health: number;
  revenue: number;
  openPipeline: number;
  owner: string;
  risk: string;
}

export interface OpportunityRecord {
  id: string;
  accountId: string;
  accountName: string;
  title: string;
  owner: string;
  stage: OpportunityStage;
  value: number;
  probability: number;
  forecastClose: string;
  risk: 'low' | 'medium' | 'high';
  nextStep: string;
}

export interface SalesActivity {
  id: string;
  type: ActivityType;
  title: string;
  accountName: string;
  owner: string;
  due: string;
  outcome: string;
}

export interface CustomerTimelineEvent {
  id: string;
  accountName: string;
  label: string;
  detail: string;
  timestamp: string;
  module: string;
}

export interface QuoteProposal {
  id: string;
  accountName: string;
  title: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  approvalStatus: 'draft' | 'review' | 'approved';
  validUntil: string;
  lineItems: Array<{ id: string; label: string; quantity: number; price: number }>;
}

export interface RevenueForecast {
  period: ForecastPeriod;
  committed: number;
  bestCase: number;
  pipeline: number;
  weighted: number;
  accuracy: number;
}

export interface RevenueOperationsMetric {
  id: string;
  label: string;
  value: string;
  benchmark: string;
  signal: 'positive' | 'watch' | 'risk';
}

export interface AiSalesInsight {
  id: string;
  title: string;
  summary: string;
  severity: 'opportunity' | 'risk' | 'info';
  action: string;
}

export interface AiSalesCommandResult {
  id: string;
  command: string;
  response: string;
  recommendedActions: string[];
}

export interface CrmWorkspaceData {
  metrics: CrmMetric[];
  leads: LeadRecord[];
  contacts: ContactRecord[];
  accounts: AccountRecord[];
  opportunities: OpportunityRecord[];
  activities: SalesActivity[];
  timeline: CustomerTimelineEvent[];
  proposals: QuoteProposal[];
  forecasts: RevenueForecast[];
  revOps: RevenueOperationsMetric[];
  insights: AiSalesInsight[];
}
