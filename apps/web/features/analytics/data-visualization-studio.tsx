'use client';

import dynamic from 'next/dynamic';
import { Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { visualizationOptions } from '@/lib/analytics-workspace';

const KpiPortfolioChart = dynamic(() => import('./analytics-charts').then((module) => module.KpiPortfolioChart), {
  ssr: false,
  loading: () => <Skeleton className="h-72 w-full" />,
});

export function DataVisualizationStudio() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Visualization Studio</CardTitle>
        <p className="text-sm text-graphite-400">Line charts, bar charts, pie charts, heat maps, KPI cards and trend analysis.</p>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-3 md:grid-cols-2">
          {visualizationOptions.map((option) => (
            <article key={option.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white"><Palette className="size-4 shrink-0 text-gold-200" />{option.label}</div>
              <p className="mt-2 text-xs leading-5 text-graphite-400">{option.useCase}</p>
            </article>
          ))}
        </div>
        <KpiPortfolioChart />
      </CardContent>
    </Card>
  );
}
