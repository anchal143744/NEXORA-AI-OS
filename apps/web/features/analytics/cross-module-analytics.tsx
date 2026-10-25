'use client';

import { Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { crossModuleInsights } from '@/lib/analytics-workspace';

export function CrossModuleAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cross-Module Analytics</CardTitle>
        <p className="text-sm text-graphite-400">Unified insights across CRM, HR, Finance, Projects, Operations and AI Agents.</p>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-3">
        {crossModuleInsights.map((insight) => (
          <article key={insight.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white"><Network className="size-4 text-gold-200" />{insight.title}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {insight.modules.map((moduleName) => (
                <span key={moduleName} className="rounded-sm border border-white/10 bg-white/[0.045] px-2 py-1 text-xs text-graphite-300">{moduleName}</span>
              ))}
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-400">{insight.summary}</p>
            <p className="mt-3 text-xs text-gold-100">{insight.businessImpact}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
