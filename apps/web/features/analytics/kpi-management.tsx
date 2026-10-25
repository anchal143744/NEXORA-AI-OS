'use client';

import { BellRing, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { kpis } from '@/lib/analytics-workspace';
import { useAnalyticsWorkspaceActions } from '@/hooks/use-analytics-workspace-actions';

export function KpiManagement() {
  const { createKpiAlert } = useAnalyticsWorkspaceActions();
  return (
    <Card>
      <CardHeader>
        <CardTitle>KPI Management</CardTitle>
        <p className="text-sm text-graphite-400">KPI creation, tracking, targets, alerts and performance analysis.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {kpis.map((kpi) => (
          <article key={kpi.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-4 lg:grid-cols-[1fr_0.7fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Target className="size-4 text-gold-200" />
                <h3 className="font-semibold text-white">{kpi.name}</h3>
                <Badge variant={kpi.performance === 'healthy' ? 'success' : 'warning'}>{kpi.alert}</Badge>
              </div>
              <p className="mt-2 text-sm text-graphite-400">Owner: {kpi.owner}</p>
            </div>
            <div className="text-sm text-graphite-300">Current {kpi.current}{kpi.unit} / Target {kpi.target}{kpi.unit}</div>
            <Button size="sm" variant="secondary" onClick={() => createKpiAlert(kpi.id)}><BellRing className="size-4" />Create alert</Button>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
