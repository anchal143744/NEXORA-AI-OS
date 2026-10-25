'use client';

import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCommandCenterStore } from '@/stores/command-center-store';

export function AiInsightCenter() {
  const insights = useCommandCenterStore((state) => state.insights);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><Sparkles className="size-4 text-gold-300" />AI Insight Center</div>
      <div className="grid gap-3 xl:grid-cols-3">
        {insights.map((insight) => (
          <div key={insight.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">{insight.title}</h3>
              <Badge variant={insight.severity === 'risk' ? 'warning' : insight.severity === 'opportunity' ? 'success' : 'neutral'}>{insight.severity}</Badge>
            </div>
            <p className="mt-2 text-xs leading-5 text-graphite-400">{insight.summary}</p>
            <Button className="mt-3" size="sm" variant="outline">{insight.action}</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
