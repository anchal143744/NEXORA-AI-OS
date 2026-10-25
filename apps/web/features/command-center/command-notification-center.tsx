'use client';

import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommandCenterStore } from '@/stores/command-center-store';

export function CommandNotificationCenter() {
  const notifications = useCommandCenterStore((state) => state.notifications);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bell className="size-4 text-gold-300" />Notification Center</CardTitle>
        <CardDescription>Launch notifications, approval warnings and orchestration updates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-white">{notification.title}</div>
              <Badge variant={notification.tone === 'success' ? 'success' : notification.tone === 'warning' ? 'warning' : 'neutral'}>{notification.tone}</Badge>
            </div>
            <p className="mt-1 text-xs leading-5 text-graphite-400">{notification.detail}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
