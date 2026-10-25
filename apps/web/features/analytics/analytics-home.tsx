'use client';

import dynamic from 'next/dynamic';
import { Activity, BriefcaseBusiness, HandCoins, LineChart, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { createAnalyticsMetrics, strategicInsights } from '@/lib/analytics-workspace';

const ExecutiveTrendChart = dynamic(() => import('./analytics-charts').then((module) => module.ExecutiveTrendChart), {
  ssr: false,
  loading: () => <Skeleton className="h-72 w-full" />,
});

const icons = [LineChart, Users, BriefcaseBusiness, HandCoins, Activity];

export function AnalyticsHome() {
  const metrics = createAnalyticsMetrics();
  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric, index) => {
          const Icon = icons[index] ?? LineChart;
          return (
            <Card key={metric.id} className="interactive-surface">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-sm">{metric.label}</CardTitle>
                  <Icon className="size-4 shrink-0 text-gold-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-white">{metric.value}</div>
                <p className="mt-2 text-xs leading-5 text-graphite-400">{metric.detail}</p>
                <p className="mt-3 text-xs font-medium text-gold-100">{metric.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <p className="text-sm text-graphite-400">Executive trend line loads after the page shell so navigation stays fast.</p>
          </CardHeader>
          <CardContent><ExecutiveTrendChart /></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {strategicInsights.slice(0, 4).map((insight) => (
              <article key={insight.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
                <div className="text-sm font-semibold text-white">{insight.title}</div>
                <p className="mt-2 text-xs leading-5 text-graphite-400">{insight.summary}</p>
              </article>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
