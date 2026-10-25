'use client';

import Link from 'next/link';
import { Bot, Bell, Globe2, LockKeyhole, Settings2, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs } from '@/components/ui/tabs';
import { buildUnifiedNotifications } from '@/lib/notifications';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { useWorkspace } from '@/providers/workspace-provider';

export function UnifiedSettingsWorkspace() {
  const workspace = useWorkspace();
  const notifications = buildUnifiedNotifications(workspace);
  const enabledModules = workspace.modules.filter((module) => module.enabled);
  const activeAgents = workspace.aiAgents.filter((agent) => agent.status === 'active');
  const capabilityCount = Object.values(workspace.featureFlags).filter(Boolean).length;

  return (
    <EnterpriseShell>
      <div className="space-y-5">
        <section className="rounded-xl border border-white/10 bg-white/[0.055] p-5 shadow-hairline">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge><Settings2 className="size-3" />Unified Settings</Badge>
                <Badge variant="success"><ShieldCheck className="size-3" />Workspace scoped</Badge>
                <Badge variant="neutral">{workspace.currentUser.role}</Badge>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-white">One control center for this workspace</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-graphite-300">
                Review organization, access, notification, AI, locale and capability settings from the active workspace configuration.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/onboarding"><SlidersHorizontal className="size-4" />Update setup</Link>
              </Button>
              <Button asChild>
                <Link href="/ai-agents/copilot"><Bot className="size-4" />Ask AI</Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-4">
          <SettingMetric label="Enabled modules" value={String(enabledModules.length)} />
          <SettingMetric label="Permissions" value={String(workspace.permissions.length)} />
          <SettingMetric label="AI agents" value={String(activeAgents.length)} />
          <SettingMetric label="Capabilities" value={String(capabilityCount)} />
        </div>

        <Tabs
          items={[
            {
              value: 'workspace',
              label: 'Workspace',
              content: (
                <div className="grid gap-3 md:grid-cols-2">
                  <SettingLine label="Organization" value={workspace.organizationName} />
                  <SettingLine label="Workspace" value={workspace.workspaceName} />
                  <SettingLine label="Industry" value={workspace.industry} />
                  <SettingLine label="Business type" value={workspace.businessType} />
                  <SettingLine label="Locale" value={workspace.locale} icon={<Globe2 className="size-4" />} />
                  <SettingLine label="Currency" value={workspace.currency} />
                  <SettingLine label="Timezone" value={workspace.timezone} />
                  <SettingLine label="Tenant" value={workspace.tenantName} />
                </div>
              ),
            },
            {
              value: 'access',
              label: 'Access',
              content: (
                <div className="space-y-4">
                  <Alert title="Role-aware rendering is active" variant="success">
                    Navigation, dashboard widgets and command actions are filtered by the active workspace permissions.
                  </Alert>
                  <div className="grid gap-3 md:grid-cols-2">
                    {workspace.permissions.map((permission) => (
                      <SettingLine key={permission} label={permission} value="Allowed" icon={<LockKeyhole className="size-4" />} />
                    ))}
                  </div>
                </div>
              ),
            },
            {
              value: 'notifications',
              label: 'Notifications',
              content: (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <SettingLine key={notification.id} label={notification.title} value={notification.detail} icon={<Bell className="size-4" />} />
                  ))}
                </div>
              ),
            },
            {
              value: 'ai',
              label: 'AI',
              content: (
                <div className="grid gap-3 md:grid-cols-2">
                  {workspace.aiAgents.map((agent) => (
                    <SettingLine key={agent.id} label={agent.label} value={agent.status + ' - ' + agent.moduleKey} icon={<Bot className="size-4" />} />
                  ))}
                </div>
              ),
            },
            {
              value: 'capabilities',
              label: 'Capabilities',
              content: (
                <div className="space-y-4">
                  <Progress value={Math.round((capabilityCount / Math.max(Object.keys(workspace.featureFlags).length, 1)) * 100)} label="Workspace capabilities enabled" />
                  <div className="grid gap-3 md:grid-cols-2">
                    {Object.entries(workspace.featureFlags).map(([flag, enabled]) => (
                      <SettingLine key={flag} label={humanize(flag)} value={enabled ? 'Enabled' : 'Off'} />
                    ))}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </EnterpriseShell>
  );
}

function SettingMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function SettingLine({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-3">
      <div className="flex items-start gap-3">
        {icon ? <div className="mt-0.5 text-gold-200">{icon}</div> : null}
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{label}</div>
          <div className="mt-1 text-sm leading-6 text-graphite-400">{value}</div>
        </div>
      </div>
    </div>
  );
}

function humanize(value: string) {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
}
