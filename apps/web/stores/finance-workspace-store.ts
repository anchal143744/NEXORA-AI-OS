'use client';

import { create } from 'zustand';
import type { AiFinanceCommandResult, BudgetStatus, ExpenseStatus, FinanceWorkspaceData, InvoiceStatus } from '@/types/finance-workspace';

type FinanceWorkspaceState = FinanceWorkspaceData & {
  invoiceStatusFilter: InvoiceStatus | 'all';
  budgetStatusFilter: BudgetStatus | 'all';
  expenseStatusFilter: ExpenseStatus | 'all';
  searchQuery: string;
  commands: AiFinanceCommandResult[];
  setSearchQuery: (query: string) => void;
  setInvoiceStatusFilter: (status: InvoiceStatus | 'all') => void;
  setBudgetStatusFilter: (status: BudgetStatus | 'all') => void;
  setExpenseStatusFilter: (status: ExpenseStatus | 'all') => void;
  hydrateWorkspace: (data: FinanceWorkspaceData) => void;
  markInvoicePaid: (invoiceId: string) => void;
  approveBudget: (budgetId: string) => void;
  approveExpense: (expenseId: string) => void;
  addCommand: (command: AiFinanceCommandResult) => void;
};

const initial: FinanceWorkspaceData = {
  metrics: [],
  billingPlans: [],
  revenue: [],
  invoices: [],
  payments: [],
  budgets: [],
  expenses: [],
  forecasts: [],
  cashFlow: [],
  analytics: [],
  executiveSignals: [],
  insights: [],
};

export const useFinanceWorkspaceStore = create<FinanceWorkspaceState>((set) => ({
  ...initial,
  invoiceStatusFilter: 'all',
  budgetStatusFilter: 'all',
  expenseStatusFilter: 'all',
  searchQuery: '',
  commands: [],
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setInvoiceStatusFilter: (invoiceStatusFilter) => set({ invoiceStatusFilter }),
  setBudgetStatusFilter: (budgetStatusFilter) => set({ budgetStatusFilter }),
  setExpenseStatusFilter: (expenseStatusFilter) => set({ expenseStatusFilter }),
  hydrateWorkspace: (data) => set({ ...data }),
  markInvoicePaid: (invoiceId) => set((state) => ({ invoices: state.invoices.map((invoice) => (invoice.id === invoiceId ? { ...invoice, status: 'paid' } : invoice)) })),
  approveBudget: (budgetId) => set((state) => ({ budgets: state.budgets.map((budget) => (budget.id === budgetId ? { ...budget, status: 'healthy' } : budget)) })),
  approveExpense: (expenseId) => set((state) => ({ expenses: state.expenses.map((expense) => (expense.id === expenseId ? { ...expense, status: 'approved' } : expense)) })),
  addCommand: (command) => set((state) => ({ commands: [command, ...state.commands].slice(0, 6) })),
}));
