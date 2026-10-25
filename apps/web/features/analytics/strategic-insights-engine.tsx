'use client';

import { Lightbulb, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { strategicInsights } from '@/lib/analytics-workspace';

export function StrategicInsightsEngine() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategic Insights Engine</CardTitle>
        <p className="text-sm text-graphite-400">AI-identified opportunities, bottlenecks, revenue risks, workforce risks and cost optimization options.</p>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-2">
        {strategicInsights.map((insight) => (
          <article key={insight.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white">{insight.severity === 'risk' ? <ShieldAlert className="size-4 text-gold-200" /> : <Lightbulb className="size-4 text-gold-200" />}{insight.title}</div>
              <Badge variant={insight.severity === 'risk' ? 'warning' : 'success'}>{insight.severity}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-400">{insight.summary}</p>
            <p className="mt-3 text-xs text-gold-100">{insight.recommendation}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
