'use client';

import { Calendar, Mail, Phone, StickyNote, CheckSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useCrmWorkspaceStore } from '@/stores/crm-workspace-store';

const icons = { call: Phone, email: Mail, meeting: Calendar, task: CheckSquare, note: StickyNote };

export function ActivityCenter() {
  const activities = useCrmWorkspaceStore((state) => state.activities);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Center</CardTitle>
        <CardDescription>Calls, emails, meetings, tasks and notes tied to revenue execution.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-5">
        {activities.length === 0 ? (
          <EmptyState className="xl:col-span-5" icon={CheckSquare} title="No CRM activity yet" description="Lead, account, opportunity and proposal actions will automatically populate this activity center." />
        ) : null}
        {activities.map((activity) => {
          const Icon = icons[activity.type];
          return (
            <article key={activity.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <Icon className="size-4 text-gold-200" />
              <div className="mt-3 text-sm font-semibold text-white">{activity.title}</div>
              <div className="mt-1 text-xs text-graphite-400">{activity.accountName}</div>
              <Badge className="mt-3" variant="neutral">{activity.due}</Badge>
              <p className="mt-3 text-xs leading-5 text-graphite-300">{activity.outcome}</p>
            </article>
          );
        })}
      </CardContent>
    </Card>
  );
}
