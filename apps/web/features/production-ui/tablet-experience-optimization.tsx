'use client';

import { TabletSmartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { responsiveTargets } from '@/lib/production-ui';

export function TabletExperienceOptimization() {
  const target = responsiveTargets.find((item) => item.device === 'Tablets');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tablet Experience Optimization</CardTitle>
        <p className="text-sm text-graphite-400">Premium tablet layouts support two-column reading, compact navigation and overflow-safe dashboards.</p>
      </CardHeader>
      <CardContent>
        <article className="rounded-lg border border-white/10 bg-graphite-950/70 p-5">
          <div className="flex items-center gap-2 font-semibold text-white"><TabletSmartphone className="size-4 text-gold-200" />{target?.focus}</div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {target?.checks.map((check) => (
              <div key={check} className="rounded-lg border border-white/10 bg-white/[0.045] p-4 text-sm text-graphite-300">{check}</div>
            ))}
          </div>
        </article>
      </CardContent>
    </Card>
  );
}
