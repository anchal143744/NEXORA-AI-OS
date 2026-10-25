'use client';

import { Activity, DollarSign, Rocket, ShieldAlert, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { growthMetrics } from '@/lib/growth-program';
import { GrowthStatusBadge } from './growth-program-panel';

const icons = [Rocket, Users, TrendingUp, DollarSign, ShieldAlert, Activity];

export function GrowthProgramHome() {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      {growthMetrics.map((metric, index) => {
        const Icon = icons[index] ?? TrendingUp;
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
              <div className="mt-3"><GrowthStatusBadge status={metric.status} /></div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
