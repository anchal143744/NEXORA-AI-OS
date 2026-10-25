'use client';

import { BadgeCheck, MonitorSmartphone, Rocket, ShieldCheck, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { metrics, releaseCandidateChecks } from '@/lib/production-ui';

const icons = [BadgeCheck, MonitorSmartphone, ShieldCheck, Timer, Rocket];

export function ProductionUiHome() {
  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric, index) => {
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
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Production UI Release Candidate</CardTitle>
          <p className="text-sm text-graphite-400">Design system, CRM, HR, Finance, AI Agents, Analytics and Command Center are validated for RC1.</p>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-4">
          {releaseCandidateChecks.slice(0, 4).map((check) => (
            <article key={check.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
              <div className="text-sm font-semibold text-white">{check.area}</div>
              <p className="mt-2 text-xs leading-5 text-graphite-400">{check.result}</p>
            </article>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
