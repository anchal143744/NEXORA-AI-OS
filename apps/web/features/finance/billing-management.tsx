'use client';

import { Repeat, WalletCards } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { currency } from '@/lib/finance-workspace';
import { useFinanceWorkspaceStore } from '@/stores/finance-workspace-store';

export function BillingManagement() {
  const billingPlans = useFinanceWorkspaceStore((state) => state.billingPlans);
  return (
    <Card>
      <CardHeader>
        <Badge><WalletCards className="size-3" />Billing Management</Badge>
        <CardTitle className="mt-2">Subscription billing, customer billing, plans and cycles.</CardTitle>
        <CardDescription>Billing history is simple, visible and ready for enterprise approval workflows.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-3">
        {billingPlans.map((plan) => (
          <article key={plan.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Repeat className="size-4 text-gold-200" />
            <div className="mt-3 text-base font-semibold text-white">{plan.customerName}</div>
            <div className="mt-1 text-sm text-graphite-300">{plan.planName}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={plan.status === 'active' ? 'success' : plan.status === 'trial' ? 'warning' : 'neutral'}>{plan.status}</Badge>
              <Badge variant="neutral">{plan.cycle}</Badge>
            </div>
            <div className="mt-4 text-2xl font-semibold text-white">{currency(plan.amount)}</div>
            <div className="mt-1 text-xs text-graphite-400">Next renewal: {plan.renewalDate}</div>
            <div className="mt-3 rounded-md border border-white/10 bg-graphite-950/60 p-3">
              <div className="text-xs font-semibold text-white">Billing history</div>
              <ul className="mt-2 space-y-1 text-xs text-graphite-400">{plan.history.map((item) => <li key={item}>- {item}</li>)}</ul>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
