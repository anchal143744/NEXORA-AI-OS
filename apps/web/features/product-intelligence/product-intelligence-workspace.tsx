'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BadgeCheck, BarChart3, Beaker, Brain, CheckCircle2, Compass, FlaskConical, Gauge, GitFork, LineChart, MousePointerClick, RefreshCw, Repeat2, Rocket, Search, ShieldAlert, Sparkles, TrendingUp, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const usageRows = [
  { module: 'Workflow Builder', feature: 'AI Generate', adoption: '68%', events: '18.4k', trend: 'Up' },
  { module: 'Contact Center', feature: 'Unified Inbox', adoption: '74%', events: '26.1k', trend: 'Up' },
  { module: 'Customer Success', feature: 'Health Score', adoption: '52%', events: '9.8k', trend: 'Watch' },
];

const funnels = [
  { funnel: 'Signup', conversion: '61%', dropoff: '18%', bottleneck: 'Email verify' },
  { funnel: 'Onboarding', conversion: '48%', dropoff: '31%', bottleneck: 'Workspace setup' },
  { funnel: 'Revenue', conversion: '22%', dropoff: '44%', bottleneck: 'Value proof' },
];

const experiments = [
  { experiment: 'Onboarding CTA', type: 'A/B', status: 'Running', significance: 'Pending' },
  { experiment: 'AI prompt helper', type: 'Multivariate', status: 'Evaluated', significance: 'Yes' },
  { experiment: 'Retention nudge', type: 'A/B', status: 'Draft', significance: '-' },
];

const retention = [
  { cohort: 'Week 1 activation', retention: '71%', churn: '13%', signal: 'Healthy' },
  { cohort: 'Agency teams', retention: '58%', churn: '24%', signal: 'Watch' },
  { cohort: 'Trial workspaces', retention: '39%', churn: '42%', signal: 'Risk' },
];

const copilot = [
  { label: 'Adoption recommendations', detail: 'Identifies low-adoption modules and suggests enablement experiments.', icon: <Rocket className="size-4" /> },
  { label: 'Funnel optimization', detail: 'Finds bottlenecks and proposes conversion improvements.', icon: <GitFork className="size-4" /> },
  { label: 'Retention improvement', detail: 'Analyzes cohorts, churn signals and product stickiness.', icon: <Repeat2 className="size-4" /> },
  { label: 'Experiment recommendations', detail: 'Prioritizes statistically useful tests and variant decisions.', icon: <Beaker className="size-4" /> },
];

const apiSurface = ['/v1/product-intelligence', '/v1/product-health', '/v1/usage-analytics', '/v1/events', '/v1/journeys', '/v1/funnels', '/v1/experiments', '/v1/retention', '/v1/engagement', '/v1/growth-insights'];

export function ProductIntelligenceWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Product Intelligence, Usage Analytics & Growth Experimentation</h1>
            <Badge>Phase 29</Badge>
            <Badge className="bg-white/80">Growth Analytics Platform</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Product health, usage analytics, feature adoption, funnels, experiments, retention cohorts and AI growth recommendations connected to customer and revenue context.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search product data"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh product intelligence"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Generate growth insights"><Sparkles className="size-4" />Product Copilot</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Gauge className="size-5" />} label="Product Health" value="88" detail="adoption and reliability" tone="primary" />
        <SignalCard icon={<MousePointerClick className="size-5" />} label="Tracked Events" value="2.4M" detail="workspace activity" tone="green" />
        <SignalCard icon={<GitFork className="size-5" />} label="Funnels" value="18" detail="conversion paths" tone="amber" />
        <SignalCard icon={<FlaskConical className="size-5" />} label="Experiments" value="11" detail="growth tests" tone="violet" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<BarChart3 className="size-4" />} title="Usage Analytics Dashboard"><DataTable rows={usageRows} columns={['module', 'feature', 'adoption', 'events', 'trend']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<GitFork className="size-4" />} title="Funnel Analytics Center"><DataTable rows={funnels} columns={['funnel', 'conversion', 'dropoff', 'bottleneck']} /></DataPanel>
            <DataPanel icon={<Beaker className="size-4" />} title="Growth Experimentation Center"><DataTable rows={experiments} columns={['experiment', 'type', 'status', 'significance']} /></DataPanel>
          </div>
          <DataPanel icon={<Repeat2 className="size-4" />} title="Retention Dashboard"><DataTable rows={retention} columns={['cohort', 'retention', 'churn', 'signal']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Brain className="size-4" />} title="Product Copilot Workspace">
            <div className="grid gap-2">{copilot.map((item) => <ActionRow key={item.label} {...item} />)}</div>
          </DataPanel>

          <DataPanel icon={<Compass className="size-4" />} title="Product Intelligence Dashboard">
            <div className="grid gap-2">
              <StateRow label="Feature adoption engine" state="Enabled" />
              <StateRow label="User behavior tracking" state="Live" />
              <StateRow label="Product risk detection" state="Active" />
              <StateRow label="Success metrics" state="Scored" />
            </div>
          </DataPanel>

          <DataPanel icon={<LineChart className="size-4" />} title="Growth Signals">
            <div className="grid gap-2">
              <ActionRow icon={<TrendingUp className="size-4" />} label="Conversion optimization" detail="Drop-off and bottleneck analysis create growth recommendations." />
              <ActionRow icon={<ShieldAlert className="size-4" />} label="Churn signals" detail="Retention cohorts and engagement scores reveal product risk." />
              <ActionRow icon={<UsersRound className="size-4" />} label="User stickiness" detail="Activity, active days and adoption feed engagement scoring." />
            </div>
          </DataPanel>

          <DataPanel icon={<BadgeCheck className="size-4" />} title="API Surface">
            <div className="grid gap-2">{apiSurface.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped product intelligence API" />)}</div>
          </DataPanel>
        </aside>
      </div>
    </div>
  );
}

function SignalCard({ icon, label, value, detail, tone }: { icon: ReactNode; label: string; value: string; detail: string; tone: 'primary' | 'green' | 'amber' | 'violet' }) {
  const tones = { primary: 'bg-primary-100/70 text-primary-950 border-primary-300/70', green: 'bg-emerald-50 text-emerald-800 border-emerald-200', amber: 'bg-amber-50 text-amber-800 border-amber-200', violet: 'bg-violet-50 text-violet-800 border-violet-200' };
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('rounded-lg border bg-white/78 p-4 shadow-subtle backdrop-blur-shell', tones[tone])}><div className="flex items-center justify-between gap-3"><span>{icon}</span><Activity className="size-4 opacity-60" /></div><div className="mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-sm font-medium">{label}</div><div className="mt-1 text-xs opacity-70">{detail}</div></motion.div>;
}

function DataPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <section className="rounded-lg border border-neutral-200 bg-white/78 p-4 shadow-subtle backdrop-blur-shell"><div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-primary-950">{icon}<span>{title}</span></div><Button variant="icon" size="icon" title={`Open ${title}`}><ArrowRight className="size-4" /></Button></div>{children}</section>;
}

function ActionRow({ icon, label, detail }: { icon: ReactNode; label: string; detail: string }) {
  return <div className="flex items-start gap-3 rounded-md border border-neutral-200 bg-white/80 p-3"><span className="mt-0.5 text-primary-700">{icon}</span><div><div className="text-sm font-semibold text-neutral-950">{label}</div><div className="text-xs text-neutral-500">{detail}</div></div></div>;
}

function StateRow({ label, state }: { label: string; state: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white/80 px-3 py-2"><span className="text-sm font-medium text-neutral-900">{label}</span><span className="rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">{state}</span></div>;
}

function DataTable({ rows, columns }: { rows: Array<Record<string, unknown>>; columns: string[] }) {
  return <div className="overflow-hidden rounded-md border border-neutral-200"><table className="w-full border-collapse text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-semibold">{label(column)}</th>)}</tr></thead><tbody className="divide-y divide-neutral-200">{rows.map((row, index) => <tr key={index} className="bg-white/80">{columns.map((column) => <td key={column} className="px-3 py-2 text-neutral-700">{String(row[column] ?? '-')}</td>)}</tr>)}</tbody></table></div>;
}

function label(value: string) { return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()); }
