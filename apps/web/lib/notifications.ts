import type { WorkspaceConfiguration } from '@/types/workspace';

export type NotificationTone = 'info' | 'success' | 'warning' | 'critical';
export type UnifiedNotification = {
  id: string;
  title: string;
  detail: string;
  tone: NotificationTone;
  href: string;
  source: 'approval' | 'risk' | 'workflow' | 'ai' | 'system';
  time: string;
  unread: boolean;
};

export function buildUnifiedNotifications(config: WorkspaceConfiguration): UnifiedNotification[] {
  const widgetNotifications = config.widgets
    .filter((widget) => widget.type === 'notifications')
    .flatMap((widget) => extractWidgetNotifications(widget.data.notifications));

  const kpiRisks = config.kpis
    .filter((kpi) => kpi.trend === 'down')
    .map<UnifiedNotification>((kpi) => ({
      id: 'risk.' + kpi.id,
      title: kpi.label + ' needs attention',
      detail: 'The current signal is ' + kpi.value + ' with a change of ' + kpi.change + '.',
      tone: 'warning',
      href: moduleHref(config, kpi.moduleKey),
      source: 'risk',
      time: 'Now',
      unread: true,
    }));

  const reportNotification: UnifiedNotification = {
    id: 'report.executive-ready',
    title: 'Executive operating report ready',
    detail: config.reports.length + ' reports are connected to the active workspace.',
    tone: 'info',
    href: '/analytics/reports',
    source: 'workflow',
    time: 'Today',
    unread: false,
  };

  const aiNotification: UnifiedNotification = {
    id: 'ai.context-ready',
    title: 'AI context is synchronized',
    detail: config.aiAgents.filter((agent) => agent.status === 'active').length + ' active AI agents can use workspace context.',
    tone: 'success',
    href: '/ai-agents/copilot',
    source: 'ai',
    time: 'Live',
    unread: true,
  };

  const securityNotification: UnifiedNotification = {
    id: 'system.security-review',
    title: 'Security preferences available',
    detail: 'Review role access, notification preferences and AI visibility from unified settings.',
    tone: 'info',
    href: '/settings',
    source: 'system',
    time: 'Ready',
    unread: false,
  };

  return [...kpiRisks, ...widgetNotifications, reportNotification, aiNotification, securityNotification].slice(0, 8);
}

function extractWidgetNotifications(value: unknown): UnifiedNotification[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry, index) => {
      if (!entry || typeof entry !== 'object') return null;
      const item = entry as { label?: unknown; level?: unknown };
      const label = typeof item.label === 'string' ? item.label : 'Workspace update';
      const level = item.level === 'warning' || item.level === 'success' || item.level === 'critical' ? item.level : 'info';
      return {
        id: 'widget.notification.' + index,
        title: label,
        detail: 'Generated from the active workspace notification widget.',
        tone: level,
        href: '/launch-readiness/notifications',
        source: level === 'warning' || level === 'critical' ? 'risk' : 'workflow',
        time: index === 0 ? 'Now' : index + 1 + ' min ago',
        unread: index < 2,
      } satisfies UnifiedNotification;
    })
    .filter(Boolean) as UnifiedNotification[];
}

function moduleHref(config: WorkspaceConfiguration, moduleKey: string) {
  return config.modules.find((module) => module.key === moduleKey)?.route ?? '/command-center';
}
