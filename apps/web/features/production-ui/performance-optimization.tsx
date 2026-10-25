'use client';

import { Gauge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { performanceTargets } from '@/lib/production-ui';

export function PerformanceOptimization() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Optimization</CardTitle>
        <p className="text-sm text-graphite-400">Bundle size, rendering, page load speed and dashboard performance reviewed for launch.</p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {performanceTargets.map((target) => (
          <article key={target.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
            <Gauge className="mb-3 size-4 text-gold-200" />
            <div className="text-sm font-semibold text-white">{target.label}</div>
            <Badge className="mt-3">{target.target}</Badge>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{target.measured}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
