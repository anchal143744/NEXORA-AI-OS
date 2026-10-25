import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('Phase 57 Finance workspace files exist', () => {
  [
    'apps/web/types/finance-workspace.ts',
    'apps/web/lib/finance-workspace.ts',
    'apps/web/stores/finance-workspace-store.ts',
    'apps/web/features/finance/finance-workspace.tsx',
    'apps/web/app/finance/page.tsx',
    'apps/web/app/workspace/finance/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Finance navigation keeps the requested simple grouping', () => {
  const source = read('apps/web/lib/finance-workspace.ts');
  ['Finance', 'Revenue', 'Billing', 'Invoices', 'Payments', 'Planning', 'Budgets', 'Forecasts', 'Analytics', 'Reports', 'Dashboards', 'Cash Flow', 'AI', 'Finance Copilot'].forEach((label) => {
    assert.match(source, new RegExp(label));
  });
});

test('AI Finance Copilot supports required command intents', () => {
  const source = read('apps/web/lib/finance-workspace.ts');
  ['cash flow', 'outstanding invoice', 'next quarter revenue', 'risk', 'budget', 'cost optimization'].forEach((intent) => {
    assert.match(source, new RegExp(intent));
  });
});

test('Finance workspace renders all required modules', () => {
  const source = read('apps/web/features/finance/finance-workspace.tsx');
  ['FinanceHome', 'BillingManagement', 'RevenueManagement', 'InvoicesWorkspace', 'PaymentsWorkspace', 'BudgetPlanning', 'ExpenseManagement', 'FinancialForecasting', 'CashFlowIntelligence', 'FinancialAnalytics', 'ExecutiveFinanceDashboard', 'AiFinanceCopilot'].forEach((name) => {
    assert.match(source, new RegExp(name));
  });
});

test('Finance routes are physically created', () => {
  [
    'apps/web/app/finance/revenue/page.tsx',
    'apps/web/app/finance/billing/page.tsx',
    'apps/web/app/finance/invoices/page.tsx',
    'apps/web/app/finance/payments/page.tsx',
    'apps/web/app/finance/budgets/page.tsx',
    'apps/web/app/finance/forecasts/page.tsx',
    'apps/web/app/finance/cash-flow/page.tsx',
    'apps/web/app/finance/analytics/page.tsx',
    'apps/web/app/finance/copilot/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});
