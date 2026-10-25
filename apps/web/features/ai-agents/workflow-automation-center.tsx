'use client';

import { Workflow, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { workflows } from '@/lib/agent-workspace';

export function WorkflowAutomationCenter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Automation Center</CardTitle>
        <p className="text-sm text-graphite-400">Visual workflow builder foundation with triggers, conditions, schedules and event-based automations.</p>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-2">
        {workflows.map((workflow) => (
          <article key={workflow.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><Workflow className="size-4 text-gold-200" />{workflow.name}</div>
              <Badge variant={workflow.status === 'active' ? 'success' : 'default'}>{workflow.status}</Badge>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-graphite-300 md:grid-cols-2">
              <p><span className="text-graphite-500">Trigger</span><br />{workflow.trigger}</p>
              <p><span className="text-graphite-500">Condition</span><br />{workflow.condition}</p>
              <p><span className="text-graphite-500">Action</span><br />{workflow.action}</p>
              <p><span className="text-graphite-500">Schedule</span><br />{workflow.schedule}</p>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-gold-100"><Zap className="size-3" />Agent-ready automation</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
