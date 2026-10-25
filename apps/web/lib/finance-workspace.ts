import type { AiFinanceCommandResult, AiFinanceInsight, BillingPlan, BudgetRecord, CashFlowSignal, ExecutiveFinanceSignal, ExpenseRecord, FinanceForecast, FinanceMetric, FinanceWorkspaceData, FinancialAnalyticsMetric, InvoiceRecord, PaymentRecord, RevenueRecord } from '@/types/finance-workspace';

export const financeNavigation = [
  { group: 'Finance', items: ['Revenue', 'Billing', 'Invoices', 'Payments'] },
  { group: 'Planning', items: ['Budgets', 'Forecasts'] },
  { group: 'Analytics', items: ['Reports', 'Dashboards', 'Cash Flow'] },
  { group: 'AI', items: ['Finance Copilot'] },
];

export const billingPlans: BillingPlan[] = [
  { id: 'bill-aurora', customerName: 'Aurora Retail Group', planName: 'Enterprise Annual', cycle: 'annual', amount: 191840, renewalDate: '2027-07-15', status: 'active', history: ['Plan created', 'Approval completed', 'Invoice issued'] },
  { id: 'bill-northstar', customerName: 'Northstar Logistics', planName: 'Automation Suite', cycle: 'quarterly', amount: 66762, renewalDate: '2026-10-01', status: 'trial', history: ['Trial started', 'Procurement review pending'] },
  { id: 'bill-bluepeak', customerName: 'BluePeak Agency', planName: 'Growth Operations', cycle: 'monthly', amount: 8200, renewalDate: '2026-07-18', status: 'active', history: ['Billing profile verified', 'Payment method active'] },
];

export const revenue: RevenueRecord[] = [
  { id: 'rev-platform', category: 'Platform subscriptions', customerName: 'Aurora Retail Group', amount: 191840, recognitionStatus: 'scheduled', period: 'Q3 2026', growthSignal: '+22% enterprise expansion' },
  { id: 'rev-services', category: 'Premium services', customerName: 'Northstar Logistics', amount: 40000, recognitionStatus: 'deferred', period: 'Q3 2026', growthSignal: 'Implementation milestone pending' },
  { id: 'rev-agency', category: 'Monthly subscriptions', customerName: 'BluePeak Agency', amount: 8200, recognitionStatus: 'recognized', period: 'June 2026', growthSignal: 'Stable recurring revenue' },
  { id: 'rev-finance', category: 'AI agents', customerName: 'Lumina Health', amount: 56000, recognitionStatus: 'scheduled', period: 'Q4 2026', growthSignal: 'Compliance approval required' },
];

export const invoices: InvoiceRecord[] = [
  { id: 'inv-1001', customerName: 'Aurora Retail Group', invoiceNumber: 'NX-2026-1001', amount: 191840, dueDate: '2026-07-15', status: 'sent', owner: 'Finance Ops', pdfStatus: 'ready' },
  { id: 'inv-1002', customerName: 'Northstar Logistics', invoiceNumber: 'NX-2026-1002', amount: 66762, dueDate: '2026-07-05', status: 'overdue', owner: 'Finance Ops', pdfStatus: 'ready' },
  { id: 'inv-1003', customerName: 'BluePeak Agency', invoiceNumber: 'NX-2026-1003', amount: 8200, dueDate: '2026-06-30', status: 'paid', owner: 'Revenue Ops', pdfStatus: 'ready' },
  { id: 'inv-1004', customerName: 'Lumina Health', invoiceNumber: 'NX-2026-1004', amount: 56000, dueDate: '2026-08-14', status: 'draft', owner: 'Finance Ops', pdfStatus: 'queued' },
];

export const payments: PaymentRecord[] = [
  { id: 'pay-3001', customerName: 'BluePeak Agency', amount: 8200, status: 'succeeded', method: 'ACH', receivedAt: '2026-06-18', reference: 'ACH-88291' },
  { id: 'pay-3002', customerName: 'Aurora Retail Group', amount: 45000, status: 'pending', method: 'Wire', receivedAt: 'Expected 2026-07-01', reference: 'WIRE-PENDING' },
  { id: 'pay-3003', customerName: 'Northstar Logistics', amount: 12000, status: 'failed', method: 'Card', receivedAt: '2026-06-12', reference: 'CARD-FAILED' },
  { id: 'pay-3004', customerName: 'Pilot Customer', amount: 1800, status: 'refunded', method: 'Stripe', receivedAt: '2026-06-08', reference: 'RFND-9811' },
];

export const budgets: BudgetRecord[] = [
  { id: 'budget-revenue', department: 'Revenue', annualBudget: 620000, quarterlyBudget: 155000, spent: 111000, status: 'healthy', approver: 'CFO' },
  { id: 'budget-product', department: 'Product', annualBudget: 840000, quarterlyBudget: 210000, spent: 198000, status: 'watch', approver: 'CPO' },
  { id: 'budget-people', department: 'People', annualBudget: 320000, quarterlyBudget: 80000, spent: 62500, status: 'healthy', approver: 'CFO' },
  { id: 'budget-ops', department: 'Operations', annualBudget: 420000, quarterlyBudget: 105000, spent: 111500, status: 'over_budget', approver: 'COO' },
];

export const expenses: ExpenseRecord[] = [
  { id: 'exp-travel', employeeName: 'Ava Martinez', category: 'Travel', amount: 2400, submittedAt: '2026-06-17', status: 'submitted', reimbursementDue: '2026-06-28' },
  { id: 'exp-software', employeeName: 'Noah Williams', category: 'Software', amount: 11800, submittedAt: '2026-06-14', status: 'approved', reimbursementDue: 'Vendor payment' },
  { id: 'exp-training', employeeName: 'Sophia Nguyen', category: 'Training', amount: 3200, submittedAt: '2026-06-12', status: 'reimbursed', reimbursementDue: 'Complete' },
  { id: 'exp-events', employeeName: 'Iris Kapoor', category: 'Events', amount: 5800, submittedAt: '2026-06-10', status: 'submitted', reimbursementDue: '2026-06-26' },
];

export const forecasts: FinanceForecast[] = [
  { period: 'monthly', revenue: 312000, expenses: 184000, profit: 128000, cashFlow: 104000, confidence: 86, scenario: 'base' },
  { period: 'quarterly', revenue: 940000, expenses: 552000, profit: 388000, cashFlow: 315000, confidence: 81, scenario: 'base' },
  { period: 'annual', revenue: 4120000, expenses: 2410000, profit: 1710000, cashFlow: 1380000, confidence: 74, scenario: 'conservative' },
];

export const cashFlow: CashFlowSignal[] = [
  { id: 'cash-aurora', label: 'Aurora invoice collection', amount: 191840, direction: 'inflow', timing: '25 days', risk: 'low' },
  { id: 'cash-payroll', label: 'Payroll cycle', amount: 142000, direction: 'outflow', timing: '10 days', risk: 'low' },
  { id: 'cash-northstar', label: 'Northstar overdue collection', amount: 66762, direction: 'inflow', timing: 'overdue', risk: 'high' },
  { id: 'cash-vendors', label: 'Vendor obligations', amount: 64000, direction: 'outflow', timing: '18 days', risk: 'medium' },
];

export function currency(value: number, code = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(value);
}

export function totalRevenue(items = revenue) {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function totalExpenses(items = expenses) {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function outstandingInvoices(items = invoices) {
  return items.filter((invoice) => ['sent', 'overdue', 'partially_paid'].includes(invoice.status)).reduce((sum, invoice) => sum + invoice.amount, 0);
}

export function budgetUtilization(item: BudgetRecord) {
  return Math.round((item.spent / item.quarterlyBudget) * 100);
}

export function createFinanceMetrics(): FinanceMetric[] {
  const revenueTotal = totalRevenue();
  const invoiceTotal = outstandingInvoices();
  const expenseTotal = totalExpenses();
  const budgetHealth = Math.round(budgets.reduce((sum, budget) => sum + Math.min(100, budgetUtilization(budget)), 0) / budgets.length);
  return [
    { id: 'revenue-overview', label: 'Revenue Overview', value: currency(revenueTotal), detail: 'Recognized, scheduled and deferred revenue', trend: '+18% quarter trend', tone: 'healthy' },
    { id: 'cash-position', label: 'Cash Position', value: currency(1260000), detail: 'Available operating cash', trend: '7.4 months runway', tone: 'healthy' },
    { id: 'outstanding-invoices', label: 'Outstanding Invoices', value: currency(invoiceTotal), detail: 'Sent, overdue and partially paid invoices', trend: '1 overdue risk', tone: 'watch' },
    { id: 'expenses', label: 'Expenses', value: currency(expenseTotal), detail: 'Submitted and approved expenses', trend: '-6% vs plan', tone: 'healthy' },
    { id: 'budget-health', label: 'Budget Health', value: String(budgetHealth) + '%', detail: 'Average quarterly utilization', trend: 'Ops over budget', tone: 'watch' },
  ];
}

export function createAnalytics(): FinancialAnalyticsMetric[] {
  return [
    { id: 'revenue-growth', label: 'Revenue Growth', value: '+18%', signal: 'Enterprise subscriptions are expanding', tone: 'healthy' },
    { id: 'profitability', label: 'Profitability', value: '41%', signal: 'Healthy operating margin', tone: 'healthy' },
    { id: 'expense-trends', label: 'Expense Trends', value: '-6%', signal: 'Expenses are below plan except operations', tone: 'healthy' },
    { id: 'budget-utilization', label: 'Budget Utilization', value: '86%', signal: 'Operations needs review', tone: 'watch' },
    { id: 'collection-efficiency', label: 'Collection Efficiency', value: '79%', signal: 'One overdue enterprise invoice', tone: 'watch' },
  ];
}

export function createExecutiveSignals(): ExecutiveFinanceSignal[] {
  const quarterly = forecasts.find((forecast) => forecast.period === 'quarterly') ?? forecasts[0];
  return [
    { id: 'exec-revenue', label: 'Revenue', value: currency(quarterly.revenue), detail: 'Quarterly finance forecast', tone: 'healthy' },
    { id: 'exec-profit', label: 'Profit', value: currency(quarterly.profit), detail: 'Profit forecast at base case', tone: 'healthy' },
    { id: 'exec-cash-flow', label: 'Cash Flow', value: currency(quarterly.cashFlow), detail: 'Quarterly net cash movement', tone: 'healthy' },
    { id: 'exec-forecast', label: 'Forecasts', value: String(quarterly.confidence) + '%', detail: 'Forecast confidence', tone: 'healthy' },
    { id: 'exec-risk', label: 'Financial Risks', value: '3', detail: 'Collections, budget and vendor timing', tone: 'watch' },
    { id: 'exec-budget', label: 'Budget Status', value: '86%', detail: 'Average budget utilization', tone: 'watch' },
  ];
}

export function createFinanceInsights(): AiFinanceInsight[] {
  return [
    { id: 'cash-risk', title: 'Cash position is healthy but collection risk needs action', summary: 'Runway remains strong, but Northstar has an overdue invoice that affects near-term cash timing.', severity: 'risk', action: 'Escalate Northstar collection plan.' },
    { id: 'budget-watch', title: 'Operations budget is above quarterly plan', summary: 'Operations is at 106% utilization and should review vendor commitments before the next approval cycle.', severity: 'risk', action: 'Review operations vendor obligations.' },
    { id: 'revenue-growth', title: 'Enterprise subscription revenue is growing', summary: 'Annual and quarterly plans are driving the strongest revenue signal this month.', severity: 'opportunity', action: 'Prioritize enterprise billing renewals.' },
    { id: 'cost-optimization', title: 'Software and vendor spend can be optimized', summary: 'Consolidating software vendors can reduce planned outflows without slowing core teams.', severity: 'info', action: 'Create cost optimization review.' },
  ];
}

export function createFinanceWorkspaceData(): FinanceWorkspaceData {
  return {
    metrics: createFinanceMetrics(),
    billingPlans,
    revenue,
    invoices,
    payments,
    budgets,
    expenses,
    forecasts,
    cashFlow,
    analytics: createAnalytics(),
    executiveSignals: createExecutiveSignals(),
    insights: createFinanceInsights(),
  };
}

export function runAiFinanceCommand(command: string, data = createFinanceWorkspaceData()): AiFinanceCommandResult {
  const normalized = command.toLowerCase();
  const overdue = data.invoices.filter((invoice) => invoice.status === 'overdue');
  const outstanding = data.invoices.filter((invoice) => ['sent', 'overdue', 'partially_paid'].includes(invoice.status));
  const quarterly = data.forecasts.find((forecast) => forecast.period === 'quarterly') ?? data.forecasts[0];
  const budgetWatch = data.budgets.filter((budget) => budget.status === 'watch' || budget.status === 'over_budget');
  let response = 'I reviewed revenue, billing, invoices, payments, budgets, expenses, forecasts and cash flow.';
  let recommendedActions = data.insights.map((insight) => insight.action);

  if (normalized.includes('cash flow')) {
    response = 'Cash flow forecast is ' + currency(quarterly.cashFlow) + ' for the quarter with ' + String(quarterly.confidence) + '% confidence.';
    recommendedActions = ['Collect overdue Northstar invoice', 'Review vendor obligations', 'Confirm Aurora collection timing'];
  } else if (normalized.includes('outstanding invoice')) {
    response = 'Outstanding invoices total ' + currency(outstanding.reduce((sum, invoice) => sum + invoice.amount, 0)) + ', including ' + String(overdue.length) + ' overdue invoice.';
    recommendedActions = outstanding.map((invoice) => 'Follow up on ' + invoice.invoiceNumber + ' for ' + invoice.customerName).slice(0, 4);
  } else if (normalized.includes('next quarter revenue') || normalized.includes('forecast')) {
    response = 'Next quarter revenue forecast is ' + currency(quarterly.revenue) + ' with profit forecast at ' + currency(quarterly.profit) + '.';
    recommendedActions = ['Lock enterprise renewals', 'Confirm revenue recognition schedule', 'Review conservative scenario'];
  } else if (normalized.includes('risk')) {
    response = 'Financial risks: overdue invoice, operations over budget and vendor cash timing.';
    recommendedActions = ['Escalate collections', 'Pause non-critical operations spend', 'Sequence vendor payments'];
  } else if (normalized.includes('budget')) {
    response = 'Budget performance is healthy overall, but ' + budgetWatch.map((budget) => budget.department).join(', ') + ' needs review.';
    recommendedActions = budgetWatch.map((budget) => 'Review ' + budget.department + ' budget utilization');
  } else if (normalized.includes('cost optimization')) {
    response = 'Cost optimization opportunity exists in software, vendor commitments and event spend.';
    recommendedActions = ['Consolidate software vendors', 'Review operations commitments', 'Route event spend through approval'];
  }

  return {
    id: 'finance-command-' + Date.now(),
    command,
    response,
    recommendedActions: recommendedActions.slice(0, 4),
  };
}
