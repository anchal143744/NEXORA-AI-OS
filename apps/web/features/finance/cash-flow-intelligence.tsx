'use client';

import { ArrowDownLeft, ArrowUpRight, Waves } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { currency } from '@/lib/finance-workspace';
import { useFinanceWorkspaceStore } from '@/stores/finance-workspace-store';

export function CashFlowIntelligence() {
  const cashFlow = useFinanceWorkspaceStore((state) => state.cashFlow);
  return (
    <Card>
      <CardHeader>
        <Badge><Waves className="size-3" />Cash Flow Intelligence</Badge>
        <CardTitle className="mt-2">Liquidity monitoring, risk detection and cash timing.</CardTitle>
        <CardDescription>Cash flow is shown as clear inflows, outflows, timing and risk.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-4">
        {cashFlow.map((item) => {
          const Icon = item.direction === 'inflow' ? ArrowUpRight : ArrowDownLeft;
          return (
            <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <Icon className="size-4 text-gold-200" />
              <div className="mt-3 text-sm font-semibold text-white">{item.label}</div>
              <div className="mt-4 text-2xl font-semibold text-white">{currency(item.amount)}</div>
              <div className="mt-1 text-xs text-graphite-400">{item.direction} - {item.timing}</div>
              <Badge className="mt-3" variant={item.risk === 'high' ? 'warning' : item.risk === 'medium' ? 'info' : 'success'}>{item.risk} risk</Badge>
            </article>
          );
        })}
      </CardContent>
    </Card>
  );
}
