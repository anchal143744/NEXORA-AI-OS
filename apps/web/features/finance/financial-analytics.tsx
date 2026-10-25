'use client';

import { BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceWorkspaceStore } from '@/stores/finance-workspace-store';

export function FinancialAnalytics() {
  const analytics = useFinanceWorkspaceStore((state) => state.analytics);
  return (
    <Card>
      <CardHeader>
        <Badge><BarChart3 className="size-3" />Financial Analytics</Badge>
        <CardTitle className="mt-2">Revenue growth, profitability, expenses, budgets and collection efficiency.</CardTitle>
        <CardDescription>Executive finance metrics designed for fast review.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {analytics.map((metric) => (
          <article key={metric.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Badge variant={metric.tone === 'healthy' ? 'success' : metric.tone === 'watch' ? 'warning' : 'neutral'}>{metric.tone}</Badge>
            <div className="mt-4 text-2xl font-semibold text-white">{metric.value}</div>
            <div className="mt-1 text-sm text-graphite-300">{metric.label}</div>
            <div className="mt-2 text-xs text-graphite-500">{metric.signal}</div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
