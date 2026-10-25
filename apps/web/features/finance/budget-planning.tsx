'use client';

import { Calculator, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { budgetUtilization, currency } from '@/lib/finance-workspace';
import { useFinanceWorkspaceStore } from '@/stores/finance-workspace-store';
import type { BudgetStatus } from '@/types/finance-workspace';

const statuses: Array<BudgetStatus | 'all'> = ['all', 'healthy', 'watch', 'over_budget', 'pending_approval'];

export function BudgetPlanning() {
  const budgets = useFinanceWorkspaceStore((state) => state.budgets);
  const filter = useFinanceWorkspaceStore((state) => state.budgetStatusFilter);
  const setFilter = useFinanceWorkspaceStore((state) => state.setBudgetStatusFilter);
  const visible = budgets.filter((budget) => filter === 'all' || budget.status === filter);
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Badge><Calculator className="size-3" />Budget Planning</Badge>
          <CardTitle className="mt-2">Department, annual, quarterly and approval-aware budgets.</CardTitle>
          <CardDescription>Budget tracking stays simple: department, plan, spend and action.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button key={status} className={'rounded-md border px-3 py-2 text-xs capitalize transition ' + (filter === status ? 'border-gold-500/45 bg-gold-500/15 text-gold-100' : 'border-white/10 bg-white/[0.05] text-graphite-300 hover:text-white')} onClick={() => setFilter(status)}>
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-4">
        {visible.map((budget) => {
          const utilization = budgetUtilization(budget);
          return (
            <article key={budget.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-white">{budget.department}</div>
                  <div className="mt-1 text-xs text-graphite-400">Approver: {budget.approver}</div>
                </div>
                <Badge variant={budget.status === 'healthy' ? 'success' : budget.status === 'over_budget' ? 'warning' : 'neutral'}>{budget.status.replace('_', ' ')}</Badge>
              </div>
              <div className="mt-4 text-sm text-graphite-300">Quarterly: {currency(budget.quarterlyBudget)}</div>
              <div className="mt-1 text-sm text-graphite-300">Spent: {currency(budget.spent)}</div>
              <div className="mt-4 h-2 rounded-full bg-white/[0.08]"><div className="h-2 rounded-full bg-gold-400" style={{ width: String(Math.min(100, utilization)) + '%' }} /></div>
              <div className="mt-2 text-xs text-graphite-400">{utilization}% utilized</div>
              {budget.status !== 'healthy' ? (
                <Button className="mt-3" size="sm" variant="outline" disabled title="Budget approval is not exposed by the V1 Finance API yet">
                  <CheckCircle2 className="size-4" />
                  Approval unavailable
                </Button>
              ) : null}
            </article>
          );
        })}
      </CardContent>
    </Card>
  );
}
