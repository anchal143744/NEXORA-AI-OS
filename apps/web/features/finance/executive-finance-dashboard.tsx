'use client';

import { Gauge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceWorkspaceStore } from '@/stores/finance-workspace-store';

export function ExecutiveFinanceDashboard() {
  const signals = useFinanceWorkspaceStore((state) => state.executiveSignals);
  return (
    <Card>
      <CardHeader>
        <Badge><Gauge className="size-3" />Executive Finance Dashboard</Badge>
        <CardTitle className="mt-2">Revenue, profit, cash flow, forecasts, risks and budget status.</CardTitle>
        <CardDescription>A board-ready finance snapshot with no spreadsheet hunting.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {signals.map((signal) => (
          <article key={signal.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Badge variant={signal.tone === 'healthy' ? 'success' : signal.tone === 'watch' ? 'warning' : 'neutral'}>{signal.tone}</Badge>
            <div className="mt-4 text-2xl font-semibold text-white">{signal.value}</div>
            <div className="mt-1 text-sm text-graphite-300">{signal.label}</div>
            <div className="mt-2 text-xs text-graphite-500">{signal.detail}</div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
