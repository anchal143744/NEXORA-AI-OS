import { apiRequest } from '@/lib/api-client';
import type { AiFinanceCommandResult, ExpenseRecord, FinanceWorkspaceData, InvoiceRecord } from '@/types/finance-workspace';

const base = '/v1/finance';

export const financeWorkspaceApi = {
  getWorkspace: () => apiRequest<FinanceWorkspaceData>(base + '/workspace'),
  runFinanceCommand: (payload: { command: string }) => apiRequest<AiFinanceCommandResult, { command: string }>(base + '/ai-finance-copilot', { method: 'POST', body: payload }),
  markInvoicePaid: (invoice: InvoiceRecord) => apiRequest<InvoiceRecord, { idempotencyKey: string }>(base + '/invoices/' + invoice.id + '/mark-paid', { method: 'POST', body: { idempotencyKey: 'manual-settlement:' + crypto.randomUUID() } }),
  approveExpense: (expense: ExpenseRecord) => apiRequest<ExpenseRecord, ExpenseRecord>(base + '/expenses/' + expense.id + '/approve', { method: 'POST', body: expense }),
};
