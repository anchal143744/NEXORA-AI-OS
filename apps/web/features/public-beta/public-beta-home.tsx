'use client';

import { Activity, Clock, MessageSquareText, Smile, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { publicBetaMetrics } from '@/lib/public-beta';

const icons = [Users, Activity, MessageSquareText, Clock, Smile];

export function PublicBetaHome() {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {publicBetaMetrics.map((metric, index) => {
        const Icon = icons[index] ?? Activity;
        return (
          <Card key={metric.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{metric.label}</CardTitle>
                <Icon className="size-4 text-gold-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">{metric.value}</div>
              <p className="mt-2 text-xs leading-5 text-graphite-400">{metric.detail}</p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
