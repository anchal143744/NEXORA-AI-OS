'use client';

import { BellRing } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notificationExperiences } from '@/lib/production-ui';

export function NotificationExperience() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Experience</CardTitle>
        <p className="text-sm text-graphite-400">Alerts, approvals, reminders and AI recommendations with clear next actions.</p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {notificationExperiences.map((item) => (
          <article key={item.id} className="rounded-lg border border-white/10 bg-graphite-950/70 p-4">
            <BellRing className="mb-3 size-4 text-gold-200" />
            <div className="text-sm font-semibold text-white">{item.type}</div>
            <p className="mt-2 text-xs leading-5 text-graphite-400">{item.message}</p>
            <Badge className="mt-3">{item.action}</Badge>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
