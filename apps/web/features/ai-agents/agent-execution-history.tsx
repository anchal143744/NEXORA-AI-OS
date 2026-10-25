'use client';

import { History, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { executions } from '@/lib/agent-workspace';

export function AgentExecutionHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Execution History</CardTitle>
        <p className="text-sm text-graphite-400">Track runs, decisions, outputs, errors and success signals.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {executions.map((execution) => (
          <article key={execution.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <History className="size-4 text-gold-200" />
                <h3 className="font-semibold text-white">{execution.agentName}</h3>
              </div>
              <Badge variant={execution.status === 'failed' ? 'warning' : execution.status === 'success' ? 'success' : 'default'}>{execution.status}</Badge>
            </div>
            <div className="mt-3 grid gap-3 text-sm text-graphite-300 lg:grid-cols-4">
              <p><span className="text-graphite-500">Run</span><br />{execution.process}</p>
              <p><span className="text-graphite-500">Decision</span><br />{execution.decision}</p>
              <p><span className="text-graphite-500">Output</span><br />{execution.output}</p>
              <p><span className="text-graphite-500">Timing</span><br />{execution.startedAt} · {execution.duration}</p>
            </div>
            {execution.error ? <p className="mt-3 flex items-center gap-2 text-xs text-red-200"><ShieldAlert className="size-3" />{execution.error}</p> : null}
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
