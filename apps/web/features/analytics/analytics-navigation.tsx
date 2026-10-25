'use client';

import { BarChart3, Brain, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { analyticsNavigation } from '@/lib/analytics-workspace';

const icons = [BarChart3, Brain, Trophy];

export function AnalyticsNavigation() {
  return (
    <Card>
      <CardContent className="grid gap-3 p-3 md:grid-cols-3">
        {analyticsNavigation.map((group, index) => {
          const Icon = icons[index] ?? BarChart3;
          return (
            <section key={group.group} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Icon className="size-4 text-gold-200" />
                {group.group}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded-sm border border-white/10 bg-graphite-950/70 px-2 py-1 text-xs text-graphite-300">{item}</span>
                ))}
              </div>
            </section>
          );
        })}
      </CardContent>
    </Card>
  );
}
