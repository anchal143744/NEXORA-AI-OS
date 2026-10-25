'use client';

import { CheckCircle2, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { launchReadinessGates, productionMetrics } from '@/lib/production-deployment';

export function ProductionReadinessDashboard() {
  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {productionMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{metric.label}</CardTitle>
                <Rocket className="size-4 text-gold-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">{metric.value}</div>
              <p className="mt-2 text-xs leading-5 text-graphite-400">{metric.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Launch Readiness Gates</CardTitle>
          <p className="text-sm text-graphite-400">Backend, frontend, security, monitoring, backup and enterprise trial readiness are tracked as production release gates.</p>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-3">
          {launchReadinessGates.map((gate) => (
            <article key={gate.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-semibold text-white"><CheckCircle2 className="size-4 text-gold-200" />{gate.gate}</div>
                <Badge variant={gate.state === 'ready' ? 'success' : 'warning'}>{gate.state}</Badge>
              </div>
              <p className="mt-3 text-xs text-gold-100">{gate.owner}</p>
              <p className="mt-2 text-sm leading-6 text-graphite-300">{gate.evidence}</p>
            </article>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
