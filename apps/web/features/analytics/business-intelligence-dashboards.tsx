'use client';

import dynamic from 'next/dynamic';
import { LayoutDashboard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboards } from '@/lib/analytics-workspace';

const ModuleHealthChart = dynamic(() => import('./analytics-charts').then((module) => module.ModuleHealthChart), {
  ssr: false,
  loading: () => <Skeleton className="h-72 w-full" />,
});

export function BusinessIntelligenceDashboards() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Intelligence Dashboards</CardTitle>
        <p className="text-sm text-graphite-400">Dashboards for CRM, HR, Finance, Operations, Projects, AI Agents and Customer Success.</p>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-3 md:grid-cols-2">
          {dashboards.map((dashboard) => (
            <article key={dashboard.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2 font-semibold text-white"><LayoutDashboard className="size-4 shrink-0 text-gold-200" /><span className="truncate">{dashboard.domain}</span></div>
                <Badge>{dashboard.health}%</Badge>
              </div>
              <p className="mt-2 text-sm text-gold-100">{dashboard.metric}</p>
              <p className="mt-2 text-xs leading-5 text-graphite-400">{dashboard.summary}</p>
            </article>
          ))}
        </div>
        <ModuleHealthChart />
      </CardContent>
    </Card>
  );
}
