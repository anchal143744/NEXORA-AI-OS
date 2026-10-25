'use client';

import { motion } from 'framer-motion';
import { Brain, Building2, CheckCircle2, Globe2, LayoutDashboard, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardEngine } from './dashboard-engine';
import { summarizeAiWorkspaceContext } from './ai-workspace-context';
import { buildNavigation, groupNavigation } from '@/features/navigation/navigation-engine';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { useWorkspace, useWorkspaceEngine } from '@/providers/workspace-provider';

export function DynamicWorkspaceEngine() {
  const workspace = useWorkspace();
  const { aiContext } = useWorkspaceEngine();
  const navigation = buildNavigation(workspace);
  const groupedNavigation = groupNavigation(navigation);
  const aiSummary = summarizeAiWorkspaceContext(aiContext);
  const enabledModules = workspace.modules.filter((module) => module.enabled);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
      <motion.section variants={staggerItem} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.09] via-white/[0.055] to-gold-500/[0.08] p-5 shadow-hairline">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Badge>
              <Sparkles className="size-3" />
              Workspace ready
            </Badge>
            <h2 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-white md:text-4xl">
              {workspace.workspaceName}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-graphite-300">
              Your command center brings together the right business areas, KPIs, reports, AI agents and actions for this organization.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 xl:min-w-[420px]">
            <Signal label="Business areas" value={String(enabledModules.length)} />
            <Signal label="Insight cards" value={String(workspace.widgets.length)} />
            <Signal label="AI agents" value={String(workspace.aiAgents.length)} />
          </div>
        </div>
      </motion.section>

      <motion.section variants={staggerItem} className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ConfigurationPanel />
        <AiContextPanel summary={aiSummary} />
      </motion.section>

      <motion.section variants={staggerItem} className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <NavigationPreview groupedNavigation={groupedNavigation} />
        <ModuleRegistryPreview />
      </motion.section>

      <motion.div variants={staggerItem}>
        <DashboardEngine config={workspace} />
      </motion.div>
    </motion.div>
  );
}

function ConfigurationPanel() {
  const workspace = useWorkspace();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="size-4 text-gold-100" />
          Business profile
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <ConfigRow label="Organization" value={workspace.organizationName} />
        <ConfigRow label="Workspace" value={workspace.workspaceName} />
        <ConfigRow label="Industry" value={workspace.industry} />
        <ConfigRow label="Teams" value={workspace.departments.join(', ')} />
        <ConfigRow label="Language" value={workspace.locale} />
        <ConfigRow label="Currency" value={workspace.currency} />
        <ConfigRow label="Timezone" value={workspace.timezone} />
        <ConfigRow label="Capabilities" value={String(Object.values(workspace.featureFlags).filter(Boolean).length) + ' active'} />
      </CardContent>
    </Card>
  );
}

function AiContextPanel({ summary }: { summary: ReturnType<typeof summarizeAiWorkspaceContext> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="size-4 text-gold-100" />
          AI business context
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-6 text-graphite-400">
          NEXORA AI uses your workspace, role, business areas, KPIs and active filters to keep recommendations relevant.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <ConfigRow label="Workspace" value={summary.workspace} />
          <ConfigRow label="Industry" value={summary.industry} />
          <ConfigRow label="Business areas" value={String(summary.moduleCount)} />
          <ConfigRow label="KPIs" value={String(summary.kpiCount)} />
          <ConfigRow label="Currency" value={summary.currency} />
          <ConfigRow label="Timezone" value={summary.timezone} />
        </div>
      </CardContent>
    </Card>
  );
}

function NavigationPreview({ groupedNavigation }: { groupedNavigation: Record<string, ReturnType<typeof buildNavigation>> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutDashboard className="size-4 text-gold-100" />
          Workspace navigation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedNavigation).map(([group, items]) => (
          <div key={group}>
            <div className="text-xs font-semibold uppercase tracking-wide text-graphite-500">{group}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {items.map((item) => (
                <Badge key={item.key} variant="neutral">
                  {item.label}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ModuleRegistryPreview() {
  const workspace = useWorkspace();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="size-4 text-gold-100" />
          Enabled business areas
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {workspace.modules.filter((module) => module.enabled).slice(0, 8).map((module) => {
          const Icon = module.icon;
          return (
            <div key={module.key} className="rounded-md border border-white/10 bg-white/[0.045] p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                {Icon ? <Icon className="size-4 text-gold-100" /> : null}
                {module.label}
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-graphite-400">{module.metadata.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                <Badge variant="success">
                  <CheckCircle2 className="size-3" />
                  {module.widgets.length} insights
                </Badge>
                <Badge variant="neutral">
                  <ShieldCheck className="size-3" />
                  Role-aware
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
      <div className="text-xs font-medium uppercase text-graphite-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
      <div className="flex items-center gap-2 text-xs font-medium uppercase text-graphite-500">
        <Globe2 className="size-3" />
        {label}
      </div>
      <div className="mt-2 truncate text-sm font-medium text-white">{value}</div>
    </div>
  );
}
