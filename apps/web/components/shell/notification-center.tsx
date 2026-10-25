'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Bell, CheckCircle2, CircleAlert, ShieldAlert, Sparkles, Workflow, type LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { buildUnifiedNotifications, type NotificationTone } from '@/lib/notifications';
import { useWorkspace } from '@/providers/workspace-provider';
import { useShellStore } from '@/stores/shell-store';

const toneIcons = {
  info: Workflow,
  success: CheckCircle2,
  warning: ShieldAlert,
  critical: CircleAlert,
} satisfies Record<NotificationTone, LucideIcon>;

export function NotificationCenter() {
  const workspace = useWorkspace();
  const open = useShellStore((state) => state.notificationsOpen);
  const setOpen = useShellStore((state) => state.setNotificationsOpen);
  const notifications = useMemo(() => buildUnifiedNotifications(workspace), [workspace]);
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  return (
    <div className="relative">
      <Button variant="icon" size="icon" onClick={() => setOpen(!open)} aria-label={'Notifications' + (unreadCount ? ', ' + unreadCount + ' unread' : '')}>
        <Bell className="size-4" />
        {unreadCount ? <span className="absolute right-2 top-2 size-2 rounded-full bg-gold-400 shadow-gold" aria-hidden="true" /> : null}
      </Button>
      {open ? (
        <div className="absolute right-0 top-12 z-40 w-[min(390px,calc(100vw-2rem))] rounded-xl border border-white/10 bg-graphite-950 p-3 shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Notification Center</div>
              <div className="mt-0.5 text-xs text-graphite-500">Approvals, risks and AI recommendations</div>
            </div>
            <Badge variant={unreadCount ? 'success' : 'neutral'}>{unreadCount || notifications.length} active</Badge>
          </div>
          <div className="mt-3 space-y-2">
            {notifications.map((notification) => {
              const Icon = toneIcons[notification.tone];
              return (
                <Link
                  key={notification.id}
                  href={notification.href as Route}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg border border-white/10 bg-white/[0.055] p-3 transition hover:bg-white/[0.085] focus-visible:premium-focus"
                >
                  <div className="flex gap-3">
                    <Icon className="mt-0.5 size-4 shrink-0 text-gold-300" />
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center justify-between gap-2">
                        <div className="truncate text-sm font-medium text-graphite-100">{notification.title}</div>
                        {notification.unread ? <Sparkles className="size-3.5 shrink-0 text-gold-300" aria-label="Unread" /> : null}
                      </div>
                      <div className="mt-1 text-xs leading-5 text-graphite-400">{notification.detail}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="neutral">{notification.source}</Badge>
                        <span className="text-xs text-graphite-500">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
