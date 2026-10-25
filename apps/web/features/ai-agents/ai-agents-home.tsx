'use client';

import { Activity, Bot, Clock3, Gauge, PiggyBank } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createAgentMetrics, createAgentInsights } from '@/lib/agent-workspace';

const icons = [Bot, Activity, Gauge, Clock3, PiggyBank];

export function AiAgentsHome() {
  const metrics = createAgentMetrics();
  const insights = createAgentInsights();
  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric, index) => {
          const Icon = icons[index] ?? Bot;
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
                <p className="mt-3 text-xs font-medium text-gold-100">{metric.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-4">
          {insights.map((insight) => (
            <article key={insight.id} className="rounded-lg border border-white/10 bg-graphite-950/60 p-4">
              <div className="text-sm font-semibold text-white">{insight.title}</div>
              <p className="mt-2 text-xs leading-5 text-graphite-400">{insight.summary}</p>
              <p className="mt-3 text-xs text-gold-100">{insight.action}</p>
            </article>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
