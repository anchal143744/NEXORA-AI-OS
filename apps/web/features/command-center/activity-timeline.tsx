'use client';

import { Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommandCenterStore } from '@/stores/command-center-store';

export function ActivityTimeline() {
  const activity = useCommandCenterStore((state) => state.activity);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock3 className="size-4 text-gold-300" />Activity Timeline</CardTitle>
        <CardDescription>Recent workspace launch and orchestration activity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {activity.map((event) => (
          <div key={event.id} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-3">
            <div className="mt-1 size-2 rounded-full bg-gold-500" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white">{event.action}</div>
              <div className="mt-1 text-xs text-graphite-400">{event.actor} - {event.timestamp}</div>
            </div>
            <Badge variant="neutral">{event.module}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
