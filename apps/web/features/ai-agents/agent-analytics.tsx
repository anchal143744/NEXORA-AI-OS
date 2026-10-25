'use client';

import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createAgentAnalytics } from '@/lib/agent-workspace';

export function AgentAnalytics() {
  const analytics = createAgentAnalytics();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Analytics</CardTitle>
        <p className="text-sm text-graphite-400">Agent utilization, success rate, productivity impact, cost savings and ROI.</p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {analytics.map((metric) => (
          <article key={metric.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <BarChart3 className="mb-3 size-4 text-gold-200" />
            <div className="text-sm text-graphite-400">{metric.label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{metric.value}</div>
            <p className="mt-2 text-xs leading-5 text-graphite-400">{metric.signal}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
