'use client';

import { CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { currency } from '@/lib/finance-workspace';
import { useFinanceWorkspaceStore } from '@/stores/finance-workspace-store';

export function PaymentsWorkspace() {
  const payments = useFinanceWorkspaceStore((state) => state.payments);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments Workspace</CardTitle>
        <CardDescription>Payment tracking, history, status and refund visibility.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-4">
        {payments.map((payment) => (
          <article key={payment.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <CreditCard className="size-4 text-gold-200" />
            <div className="mt-3 text-sm font-semibold text-white">{payment.customerName}</div>
            <div className="mt-1 text-xs text-graphite-400">{payment.method} - {payment.reference}</div>
            <div className="mt-4 text-2xl font-semibold text-white">{currency(payment.amount)}</div>
            <Badge className="mt-3" variant={payment.status === 'succeeded' ? 'success' : payment.status === 'failed' ? 'warning' : 'neutral'}>{payment.status}</Badge>
            <div className="mt-3 text-xs text-graphite-400">{payment.receivedAt}</div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
