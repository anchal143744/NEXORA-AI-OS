'use client';

import { Gauge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCrmWorkspaceStore } from '@/stores/crm-workspace-store';

export function RevenueOperationsDashboard() {
  const metrics = useCrmWorkspaceStore((state) => state.revOps);
  return (
    <Card>
      <CardHeader>
        <Badge><Gauge className="size-3" />Revenue Operations Dashboard</Badge>
        <CardTitle className="mt-2">Pipeline health, win rate, forecast accuracy and revenue growth.</CardTitle>
        <CardDescription>Operating metrics built for weekly revenue inspection and executive review.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Badge variant={metric.signal === 'positive' ? 'success' : metric.signal === 'watch' ? 'warning' : 'neutral'}>{metric.signal}</Badge>
            <div className="mt-4 text-2xl font-semibold text-white">{metric.value}</div>
            <div className="mt-1 text-sm text-graphite-300">{metric.label}</div>
            <div className="mt-2 text-xs text-graphite-500">{metric.benchmark}</div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
