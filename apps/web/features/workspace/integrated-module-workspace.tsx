'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight, Bot, FileText, LayoutDashboard, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Progress } from '@/components/ui/progress';
import { getRegisteredModule } from '@/features/workspace/module-registry';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { useWorkspace } from '@/providers/workspace-provider';
import type { ModuleKey } from '@/types/workspace';

export function IntegratedModuleWorkspace({ moduleKey }: { moduleKey: ModuleKey }) {
  const workspace = useWorkspace();
  const configuredModule = workspace.modules.find((module) => module.key === moduleKey) ?? getRegisteredModule(moduleKey);
  const moduleWidgets = workspace.widgets.filter((widget) => widget.moduleKey === moduleKey);
  const moduleReports = workspace.reports.filter((report) => report.moduleKey === moduleKey);
  const moduleAgents = workspace.aiAgents.filter((agent) => agent.moduleKey === moduleKey);
  const moduleKpis = workspace.kpis.filter((kpi) => kpi.moduleKey === moduleKey);
  const enabled = Boolean(configuredModule?.enabled);
  const Icon = configuredModule?.icon ?? LayoutDashboard;

  if (!configuredModule) {
    return (
      <EnterpriseShell>
        <EmptyState
          title="Workspace area unavailable"
          description="This area is not part of the active workspace configuration."
          action={<Button asChild><Link href="/dashboard">Return to dashboard</Link></Button>}
        />
      </EnterpriseShell>
    );
  }

  return (
    <EnterpriseShell>
      <div className="space-y-5">
        <section className="rounded-xl border border-white/10 bg-white/[0.055] p-5 shadow-hairline">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge><Icon className="size-3" />{configuredModule.label}</Badge>
                <Badge variant={enabled ? 'success' : 'neutral'}>{enabled ? 'Enabled' : 'Available'}</Badge>
                <Badge variant="neutral"><ShieldCheck className="size-3" />Permission aware</Badge>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{configuredModule.label} workspace</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-graphite-300">{configuredModule.metadata.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/analytics/reports"><FileText className="size-4" />Reports</Link>
              </Button>
              <Button asChild>
                <Link href="/ai"><Sparkles className="size-4" />Ask AI</Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <Card>
            <CardHeader>
              <CardTitle>Connected operating view</CardTitle>
              <CardDescription>Widgets, KPIs and reports are resolved from the active workspace configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {moduleWidgets.length ? moduleWidgets.map((widget) => (
                <div key={widget.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{widget.title}</div>
                      <div className="mt-1 text-sm leading-6 text-graphite-400">{widget.description}</div>
                    </div>
                    <Badge variant="neutral">{widget.type}</Badge>
                  </div>
                </div>
              )) : (
                <EmptyState
                  title="No dedicated widgets yet"
                  description="This area still participates in search, reports and AI context through the workspace configuration."
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Launch connectivity</CardTitle>
              <CardDescription>LC1 verifies this area is no longer isolated from the command center.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={enabled ? 96 : 72} label="Workspace integration" />
              <div className="grid gap-2">
                <IntegrationLine label="Navigation" value="Active state and mobile shell" />
                <IntegrationLine label="Search" value="Indexed in universal search" />
                <IntegrationLine label="AI context" value={moduleAgents.length ? moduleAgents.map((agent) => agent.label).join(', ') : 'Executive context available'} />
                <IntegrationLine label="Reports" value={moduleReports.length ? moduleReports.map((report) => report.label).join(', ') : 'Executive report coverage'} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SignalCard title="KPIs" value={moduleKpis.length ? String(moduleKpis.length) : 'Shared'} detail={moduleKpis.length ? moduleKpis.map((kpi) => kpi.label).join(', ') : 'Uses executive KPI stack'} />
          <SignalCard title="Reports" value={String(moduleReports.length || 1)} detail={moduleReports.length ? 'Module reports available' : 'Included in executive operating report'} />
          <SignalCard title="AI support" value={moduleAgents.length ? String(moduleAgents.length) : '1'} detail={moduleAgents.length ? moduleAgents.map((agent) => agent.label).join(', ') : 'Executive Advisor can reason over this area'} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recommended next actions</CardTitle>
            <CardDescription>Actions stay inside existing platform workflows and respect workspace permissions.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <ActionLink href="/dashboard" label="Open dashboard" />
            <ActionLink href="/analytics" label="Review analytics" />
            <ActionLink href="/settings" label="Update preferences" />
          </CardContent>
        </Card>
      </div>
    </EnterpriseShell>
  );
}

function IntegrationLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.045] p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-graphite-500">{label}</div>
      <div className="mt-1 text-sm leading-5 text-graphite-200">{value}</div>
    </div>
  );
}

function SignalCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{detail}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg border border-gold-500/30 bg-gold-500/12 text-gold-200">
            <Bot className="size-4" />
          </div>
          <div className="text-2xl font-semibold text-white">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="subtle" className="justify-between">
      <Link href={href as Route}>
        {label}
        <ArrowRight className="size-4" />
      </Link>
    </Button>
  );
}
