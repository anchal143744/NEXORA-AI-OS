'use client';

import { BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePeopleWorkspaceStore } from '@/stores/people-workspace-store';

export function WorkforceAnalytics() {
  const metrics = usePeopleWorkspaceStore((state) => state.workforceMetrics);
  return (
    <Card>
      <CardHeader>
        <Badge><BarChart3 className="size-3" />Workforce Analytics</Badge>
        <CardTitle className="mt-2">Headcount, attrition, attendance, hiring, performance and learning trends.</CardTitle>
        <CardDescription>Executive people intelligence without overwhelming HR dashboards.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {metrics.map((metric) => (
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
