'use client';

import { LineChart, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { currency } from '@/lib/crm-workspace';
import { useCrmWorkspaceStore } from '@/stores/crm-workspace-store';

export function RevenueForecasting() {
  const forecasts = useCrmWorkspaceStore((state) => state.forecasts);
  return (
    <Card>
      <CardHeader>
        <Badge><LineChart className="size-3" />Revenue Forecasting</Badge>
        <CardTitle className="mt-2">Monthly, quarterly and annual forecast intelligence.</CardTitle>
        <CardDescription>Forecasts combine committed, best case, open pipeline and weighted revenue.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-3">
        {forecasts.map((forecast) => (
          <article key={forecast.period} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between">
              <div className="capitalize text-sm font-semibold text-white">{forecast.period} forecast</div>
              <Badge variant="success">{forecast.accuracy}% accuracy</Badge>
            </div>
            <div className="mt-4 text-2xl font-semibold text-white">{currency(forecast.weighted)}</div>
            <div className="mt-3 grid gap-2 text-sm text-graphite-300">
              <div className="flex justify-between"><span>Committed</span><span>{currency(forecast.committed)}</span></div>
              <div className="flex justify-between"><span>Best case</span><span>{currency(forecast.bestCase)}</span></div>
              <div className="flex justify-between"><span>Pipeline</span><span>{currency(forecast.pipeline)}</span></div>
            </div>
            <div className="mt-3 text-xs leading-5 text-graphite-400"><TrendingUp className="mr-1 inline size-3 text-gold-200" />AI forecast weighs stage probability, risk and deal velocity.</div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
