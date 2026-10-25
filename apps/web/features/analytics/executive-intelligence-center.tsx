'use client';

import { BadgeCheck, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { executiveSignals } from '@/lib/analytics-workspace';

export function ExecutiveIntelligenceCenter() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Executive Intelligence Center</CardTitle>
            <p className="mt-2 text-sm text-graphite-400">Company health, growth trends, strategic risks, opportunities and recommendations.</p>
          </div>
          <Badge variant="success"><BadgeCheck className="size-3" />Leadership-ready</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {executiveSignals.map((signal) => (
          <article key={signal.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Brain className="mb-3 size-4 text-gold-200" />
            <div className="text-sm text-graphite-400">{signal.label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{signal.value}</div>
            <p className="mt-2 text-xs leading-5 text-graphite-400">{signal.explanation}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
