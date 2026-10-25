export type InvoiceStatus = 'draft' | 'sent' | 'issued' | 'overdue' | 'paid' | 'partially_paid' | 'cancelled' | 'refunded' | 'void';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';
export type BudgetStatus = 'healthy' | 'watch' | 'over_budget' | 'pending_approval';
export type ExpenseStatus = 'pending' | 'submitted' | 'approved' | 'reimbursed' | 'rejected';
export type ForecastPeriod = 'monthly' | 'quarterly' | 'annual';

export interface FinanceMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: string;
  tone: 'healthy' | 'watch' | 'risk';
}

export interface BillingPlan {
  id: string;
  customerName: string;
  planName: string;
  cycle: 'monthly' | 'quarterly' | 'annual';
  amount: number;
  renewalDate: string;
  status: 'active' | 'trial' | 'paused';
  history: string[];
}

export interface RevenueRecord {
  id: string;
  category: string;
  customerName: string;
  amount: number;
  recognitionStatus: 'recognized' | 'deferred' | 'scheduled';
  period: string;
  growthSignal: string;
}

export interface InvoiceRecord {
  currency?: string;
  amountPaid?: string;
  amountDue?: string;
  id: string;
  customerName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  owner: string;
  pdfStatus: 'ready' | 'queued' | 'not_generated';
}

export interface PaymentRecord {
  id: string;
  customerName: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  receivedAt: string;
  reference: string;
}

export interface BudgetRecord {
  id: string;
  department: string;
  annualBudget: number;
  quarterlyBudget: number;
  spent: number;
  status: BudgetStatus;
  approver: string;
}

export interface ExpenseRecord {
  currency?: string;
  id: string;
  employeeName: string;
  category: string;
  amount: number;
  submittedAt: string;
  status: ExpenseStatus;
  reimbursementDue: string;
}

export interface FinanceForecast {
  period: ForecastPeriod;
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
  confidence: number;
  scenario: 'base' | 'best_case' | 'conservative';
}

export interface CashFlowSignal {
  id: string;
  label: string;
  amount: number;
  direction: 'inflow' | 'outflow';
  timing: string;
  risk: 'low' | 'medium' | 'high';
}

export interface FinancialAnalyticsMetric {
  id: string;
  label: string;
  value: string;
  signal: string;
  tone: 'healthy' | 'watch' | 'risk';
}

export interface ExecutiveFinanceSignal {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: 'healthy' | 'watch' | 'risk';
}

export interface AiFinanceInsight {
  id: string;
  title: string;
  summary: string;
  severity: 'opportunity' | 'risk' | 'info';
  action: string;
}

export interface AiFinanceCommandResult {
  id: string;
  command: string;
  response: string;
  recommendedActions: string[];
}

export interface FinanceWorkspaceData {
  metrics: FinanceMetric[];
  billingPlans: BillingPlan[];
  revenue: RevenueRecord[];
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
  budgets: BudgetRecord[];
  expenses: ExpenseRecord[];
  forecasts: FinanceForecast[];
  cashFlow: CashFlowSignal[];
  analytics: FinancialAnalyticsMetric[];
  executiveSignals: ExecutiveFinanceSignal[];
  insights: AiFinanceInsight[];
}
