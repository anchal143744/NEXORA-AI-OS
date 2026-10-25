'use client';

import { BarChart3, Bot, Code2, DollarSign, Store, UsersRound } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ecosystemMetrics } from '@/lib/ecosystem-marketplace';

const icons = [Store, Bot, UsersRound, BarChart3, DollarSign, Code2];

export function EcosystemMarketplaceHome() {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      {ecosystemMetrics.map((metric, index) => {
        const Icon = icons[index] ?? Store;
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
