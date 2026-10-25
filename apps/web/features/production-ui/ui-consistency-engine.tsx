'use client';

import { SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { consistencyRules } from '@/lib/production-ui';

export function UiConsistencyEngine() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>UI Consistency Engine</CardTitle>
        <p className="text-sm text-graphite-400">Buttons, cards, inputs, modals, tables, typography, colors and spacing standardized for RC1.</p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {consistencyRules.map((rule) => (
          <article key={rule.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white"><SlidersHorizontal className="size-4 text-gold-200" />{rule.system}</div>
              <Badge>{rule.coverage}%</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-400">{rule.standard}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
