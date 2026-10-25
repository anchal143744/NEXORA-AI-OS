'use client';

import type { ReactNode } from 'react';
import { Activity, BarChart3, Bell, CalendarDays, HandCoins, Lightbulb, ListChecks, Package, Pin, PinOff, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { cn } from '@/lib/utils';
import type { WorkspaceConfiguration, WorkspaceWidgetConfig, WorkspaceWidgetSize, WorkspaceWidgetType } from '@/types/workspace';

type WidgetRendererProps = {
  widget: WorkspaceWidgetConfig;
  config: WorkspaceConfiguration;
};

const widgetSizeClasses: Record<WorkspaceWidgetSize, string> = {
  sm: 'lg:col-span-2',
  md: 'lg:col-span-3',
  lg: 'lg:col-span-4',
  xl: 'lg:col-span-6',
};

export const widgetRegistry: Record<WorkspaceWidgetType, (props: WidgetRendererProps) => ReactNode> = {
  kpi: KpiWidget,
  revenue: RevenueWidget,
  sales: SalesWidget,
  inventory: InventoryWidget,
  tasks: TasksWidget,
  calendar: CalendarWidget,
  activity: ActivityWidget,
  'ai-insights': AiInsightsWidget,
  notifications: NotificationsWidget,
  analytics: AnalyticsWidget,
};

export function WorkspaceWidgetCard({
  widget,
  config,
  pinned,
  onTogglePinned,
  onMoveLeft,
  onMoveRight,
}: {
  widget: WorkspaceWidgetConfig;
  config: WorkspaceConfiguration;
  pinned: boolean;
  onTogglePinned: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}) {
  const renderer = widgetRegistry[widget.type];

  return (
    <Card className={cn('min-h-[248px] overflow-hidden', widgetSizeClasses[widget.size])}>
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="neutral">{widget.type}</Badge>
            <CardTitle className="mt-3">{widget.title}</CardTitle>
            <p className="mt-1 text-sm leading-6 text-graphite-400">{widget.description}</p>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button variant="icon" size="icon" aria-label={'Move ' + widget.title + ' earlier'} onClick={onMoveLeft}>
              <span aria-hidden="true">←</span>
            </Button>
            <Button variant="icon" size="icon" aria-label={'Move ' + widget.title + ' later'} onClick={onMoveRight}>
              <span aria-hidden="true">→</span>
            </Button>
            <Button variant="icon" size="icon" aria-label={pinned ? 'Unpin ' + widget.title : 'Pin ' + widget.title} onClick={onTogglePinned}>
              {pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">{renderer({ widget, config })}</CardContent>
    </Card>
  );
}

function KpiWidget({ widget, config }: WidgetRendererProps) {
  const requested = readStringArray(widget.data.kpiIds);
  const kpis = requested.length > 0 ? config.kpis.filter((kpi) => requested.includes(kpi.id)) : config.kpis.slice(0, 4);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} label={kpi.label} value={kpi.value} change={kpi.change} trend={kpi.trend} icon={BarChart3} />
      ))}
    </div>
  );
}

function RevenueWidget({ widget }: WidgetRendererProps) {
  const trend = readStringArray(widget.data.trend);
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase text-graphite-400">Current revenue</p>
          <p className="mt-2 text-3xl font-semibold text-white">{readText(widget.data.current, 'Not connected')}</p>
        </div>
        <HandCoins className="size-6 text-gold-100" />
      </div>
      <div className="mt-5 flex h-28 items-end gap-2" aria-label="Revenue trend">
        {trend.map((value, index) => (
          <div key={String(index)} className="flex flex-1 items-end rounded-t-md bg-gold-500/15">
            <span className="w-full rounded-t-md bg-gold-400" style={{ height: value + '%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SalesWidget({ widget }: WidgetRendererProps) {
  return <MetricList icon={<TrendingUp className="size-4" />} items={readRecords(widget.data.stages)} />;
}

function InventoryWidget({ widget }: WidgetRendererProps) {
  return <MetricList icon={<Package className="size-4" />} items={readRecords(widget.data.stock)} />;
}

function TasksWidget({ widget }: WidgetRendererProps) {
  return <MetricList icon={<ListChecks className="size-4" />} items={readRecords(widget.data.tasks)} />;
}

function CalendarWidget({ widget }: WidgetRendererProps) {
  return <MetricList icon={<CalendarDays className="size-4" />} items={readRecords(widget.data.events).map((item) => ({ label: item.label, value: item.time ?? item.value }))} />;
}

function ActivityWidget({ widget }: WidgetRendererProps) {
  const events = readRecords(widget.data.events);
  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <div key={String(index)} className="flex gap-3 rounded-md border border-white/10 bg-white/[0.045] p-3">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-100">
            <Activity className="size-3.5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-white">{event.title ?? event.label}</span>
            <span className="mt-1 block text-sm leading-6 text-graphite-400">{event.description ?? event.value}</span>
            <span className="mt-1 block text-xs text-graphite-500">{event.time}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function AiInsightsWidget({ widget }: WidgetRendererProps) {
  return (
    <div className="space-y-3">
      {readStringArray(widget.data.insights).map((insight, index) => (
        <div key={String(index)} className="rounded-md border border-gold-500/20 bg-gold-500/10 p-3 text-sm leading-6 text-gold-50">
          <Lightbulb className="mb-2 size-4 text-gold-200" />
          {insight}
        </div>
      ))}
    </div>
  );
}

function NotificationsWidget({ widget }: WidgetRendererProps) {
  return (
    <div className="space-y-3">
      {readRecords(widget.data.notifications).map((notification, index) => (
        <div key={String(index)} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.045] p-3">
          <Bell className="size-4 text-gold-100" />
          <span className="text-sm text-white">{notification.label}</span>
          <Badge className="ml-auto" variant={notification.level === 'success' ? 'success' : notification.level === 'warning' ? 'warning' : 'info'}>
            {notification.level ?? 'info'}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function AnalyticsWidget({ widget }: WidgetRendererProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {readRecords(widget.data.metrics).map((metric, index) => (
        <div key={String(index)} className="rounded-md border border-white/10 bg-white/[0.045] p-4">
          <p className="text-xs font-medium uppercase text-graphite-400">{metric.label}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}

function MetricList({ icon, items }: { icon: ReactNode; items: Array<Record<string, string>> }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={String(index)} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.045] p-3">
          <span className="flex items-center gap-2 text-sm text-graphite-300">
            <span className="grid size-7 place-items-center rounded-full bg-gold-500/15 text-gold-100">{icon}</span>
            {item.label}
          </span>
          <span className="text-sm font-semibold text-white">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function readText(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback;
}

function readStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function readRecords(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, string> => typeof item === 'object' && item !== null)
    : [];
}
