'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { financeWorkspaceApi } from '@/services/finance-workspace-api';
import { useAuthStore } from '@/stores/auth-store';
import { useFinanceWorkspaceStore } from '@/stores/finance-workspace-store';
import type { ExpenseRecord, InvoiceRecord } from '@/types/finance-workspace';

function useFinanceWorkspaceQueryKey() {
  const session = useAuthStore((state) => state.session);
  return ['finance-workspace', session?.tenantId ?? 'anonymous', session?.organizationId ?? 'no-organization', session?.workspaceId ?? 'no-workspace'] as const;
}

export function useFinanceWorkspaceQuery() {
  const hydrateWorkspace = useFinanceWorkspaceStore((state) => state.hydrateWorkspace);
  const hydrated = useAuthStore((state) => state.hydrated);
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);
  const queryKey = useFinanceWorkspaceQueryKey();
  return useQuery({
    queryKey,
    queryFn: async () => {
      const data = await financeWorkspaceApi.getWorkspace();
      hydrateWorkspace(data);
      return data;
    },
    enabled: hydrated && status === 'authenticated' && Boolean(session?.accessToken),
    retry: 1,
    staleTime: 30_000,
  });
}

export function useRunFinanceCommand() {
  const addCommand = useFinanceWorkspaceStore((state) => state.addCommand);
  return useMutation({
    mutationFn: (command: string) => financeWorkspaceApi.runFinanceCommand({ command }),
    onSuccess: (result) => addCommand(result),
  });
}

export function useInvoiceActions() {
  const queryClient = useQueryClient();
  const queryKey = useFinanceWorkspaceQueryKey();
  const markInvoicePaid = useFinanceWorkspaceStore((state) => state.markInvoicePaid);
  return {
    markPaid: useMutation({
      mutationFn: (invoice: InvoiceRecord) => financeWorkspaceApi.markInvoicePaid(invoice),
      onSuccess: (invoice) => {
        markInvoicePaid(invoice.id);
        void queryClient.invalidateQueries({ queryKey });
      },
    }),
  };
}

export function useExpenseActions() {
  const queryClient = useQueryClient();
  const queryKey = useFinanceWorkspaceQueryKey();
  const approveExpense = useFinanceWorkspaceStore((state) => state.approveExpense);
  return useMutation({
    mutationFn: (expense: ExpenseRecord) => financeWorkspaceApi.approveExpense(expense),
    onSuccess: (expense) => {
      approveExpense(expense.id);
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}
