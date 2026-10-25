'use client';

import { BarChart3, Globe2, HeartHandshake, Rocket, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { launchMetrics } from '@/lib/public-launch';

const icons = [Rocket, Users, HeartHandshake, TrendingUp, Globe2, BarChart3];

export function PublicLaunchHome() {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      {launchMetrics.map((metric, index) => {
        const Icon = icons[index] ?? Rocket;
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
