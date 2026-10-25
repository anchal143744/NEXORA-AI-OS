'use client';

import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { scorecards } from '@/lib/analytics-workspace';

export function ExecutiveScorecards() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Executive Scorecards</CardTitle>
        <p className="text-sm text-graphite-400">Revenue performance, customer growth, workforce health, financial health and strategic progress.</p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {scorecards.map((scorecard) => (
          <article key={scorecard.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Trophy className="mb-3 size-4 text-gold-200" />
            <div className="text-sm text-graphite-400">{scorecard.label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{scorecard.value}</div>
            <Badge className="mt-3" variant={scorecard.tone === 'healthy' ? 'success' : 'warning'}>{scorecard.tone}</Badge>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{scorecard.detail}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
