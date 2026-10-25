'use client';

import { Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useCrmWorkspaceStore } from '@/stores/crm-workspace-store';

export function CustomerTimeline() {
  const timeline = useCrmWorkspaceStore((state) => state.timeline);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Timeline</CardTitle>
        <CardDescription>360-degree customer view across revenue, proposal, contract and compliance activity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {timeline.length === 0 ? (
          <EmptyState icon={Clock3} title="No customer timeline yet" description="CRM audit and activity events will appear here as customer interactions are recorded." />
        ) : null}
        {timeline.map((event) => (
          <article key={event.id} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="grid size-9 shrink-0 place-items-center rounded-md border border-gold-500/30 bg-gold-500/10">
              <Clock3 className="size-4 text-gold-200" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold text-white">{event.label}</div>
                <Badge variant="neutral">{event.module}</Badge>
              </div>
              <div className="mt-1 text-sm text-graphite-300">{event.accountName}</div>
              <p className="mt-2 text-xs leading-5 text-graphite-400">{event.detail}</p>
            </div>
            <div className="shrink-0 text-xs text-gold-100">{event.timestamp}</div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
