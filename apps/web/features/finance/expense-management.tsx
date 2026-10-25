'use client';

import { Receipt, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpenseActions } from '@/hooks/use-finance-workspace-actions';
import { currency } from '@/lib/finance-workspace';
import { useFinanceWorkspaceStore } from '@/stores/finance-workspace-store';

export function ExpenseManagement() {
  const expenses = useFinanceWorkspaceStore((state) => state.expenses);
  const approve = useExpenseActions();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Management</CardTitle>
        <CardDescription>Expense tracking, categories, approvals and reimbursement workflow.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-4">
        {expenses.map((expense) => (
          <article key={expense.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Receipt className="size-4 text-gold-200" />
            <div className="mt-3 text-sm font-semibold text-white">{expense.employeeName}</div>
            <div className="mt-1 text-xs text-graphite-400">{expense.category} - {expense.submittedAt}</div>
            <div className="mt-4 text-2xl font-semibold text-white">{currency(expense.amount, expense.currency)}</div>
            <Badge className="mt-3" variant={expense.status === 'approved' || expense.status === 'reimbursed' ? 'success' : expense.status === 'submitted' ? 'warning' : 'neutral'}>{expense.status}</Badge>
            <div className="mt-3 text-xs text-graphite-400">Due: {expense.reimbursementDue}</div>
            {expense.status === 'submitted' ? <Button className="mt-3" size="sm" variant="outline" onClick={() => approve.mutate(expense)}><ShieldCheck className="size-4" />Approve</Button> : null}
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
