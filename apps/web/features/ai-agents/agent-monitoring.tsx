'use client';

import { Activity, AlertTriangle, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { monitoring } from '@/lib/agent-workspace';

export function AgentMonitoring() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Monitoring</CardTitle>
        <p className="text-sm text-graphite-400">Live status, execution health, token usage, runtime metrics and errors.</p>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-4">
        {monitoring.map((signal) => (
          <article key={signal.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">{signal.agentName}</h3>
              <Badge variant={signal.liveStatus === 'failed' ? 'warning' : 'success'}>{signal.liveStatus}</Badge>
            </div>
            <div className="mt-4 space-y-3 text-xs text-graphite-300">
              <p className="flex justify-between"><span className="flex items-center gap-2"><Activity className="size-3 text-gold-200" />Health</span><span>{signal.executionHealth}%</span></p>
              <p className="flex justify-between"><span className="flex items-center gap-2"><Cpu className="size-3 text-gold-200" />Tokens</span><span>{signal.tokenUsage.toLocaleString()}</span></p>
              <p className="flex justify-between"><span>Runtime</span><span>{signal.runtimeMs}ms</span></p>
              <p className="flex justify-between"><span className="flex items-center gap-2"><AlertTriangle className="size-3 text-gold-200" />Error rate</span><span>{signal.errorRate}%</span></p>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
