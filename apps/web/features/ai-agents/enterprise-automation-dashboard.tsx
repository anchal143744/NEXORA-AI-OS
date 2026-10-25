'use client';

import { Gauge, TimerReset } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createAutomationSignals } from '@/lib/agent-workspace';

export function EnterpriseAutomationDashboard() {
  const signals = createAutomationSignals();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enterprise Automation Dashboard</CardTitle>
        <p className="text-sm text-graphite-400">Active automations, saved hours, completed tasks and automation performance.</p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {signals.map((signal) => (
          <article key={signal.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
            <div className="flex items-center justify-between">
              <TimerReset className="size-4 text-gold-200" />
              <Gauge className="size-4 text-graphite-500" />
            </div>
            <div className="mt-4 text-sm text-graphite-400">{signal.label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{signal.value}</div>
            <p className="mt-2 text-xs leading-5 text-graphite-400">{signal.detail}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
