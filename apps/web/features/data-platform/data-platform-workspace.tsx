'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, BarChart3, Boxes, Brain, Database, Filter, Gauge, GitBranch, Layers3, LineChart, Network, RefreshCw, Search, ShieldCheck, Sparkles, Table2, Target, TrendingUp, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const warehouseRows = [
  { asset: 'Enterprise Lake', type: 'Data Lake', status: 'Active', freshness: '15 min' },
  { asset: 'Executive Warehouse', type: 'Warehouse', status: 'Active', freshness: 'Hourly' },
  { asset: 'Revenue Mart', type: 'Data Mart', status: 'Certified', freshness: 'Daily' },
];

const metricRows = [
  { metric: 'Net Revenue Retention', category: 'Revenue', formula: 'ARR retained / ARR start', certified: 'Yes' },
  { metric: 'Workflow Automation Coverage', category: 'Operations', formula: 'Automated / Total', certified: 'Yes' },
  { metric: 'Product Activation Rate', category: 'Product', formula: 'Activated / Signed up', certified: 'Draft' },
];

const kpiRows = [
  { kpi: 'Revenue Growth', target: '18%', actual: '21%', band: 'Exceeded' },
  { kpi: 'Churn Risk', target: '< 6%', actual: '7.4%', band: 'Watch' },
  { kpi: 'Pipeline Coverage', target: '3.5x', actual: '3.2x', band: 'On Track' },
];

const pipelineRows = [
  { pipeline: 'CRM to Warehouse', source: 'CRM', target: 'Warehouse', health: 'Healthy' },
  { pipeline: 'Finance Lake Sync', source: 'Finance', target: 'Lake', health: 'Healthy' },
  { pipeline: 'Product Events Mart', source: 'Events', target: 'Product Mart', health: 'Watch' },
];

const apiSurface = ['/v1/data-lake', '/v1/data-warehouse', '/v1/semantic-layer', '/v1/kpis', '/v1/executive-dashboards', '/v1/data-pipelines', '/v1/data-marts'];

const builderItems = [
  { label: 'Executive Analytics Center', detail: 'Unifies KPIs, dashboards, data marts and cross-module business signals.', icon: <BarChart3 className="size-4" /> },
  { label: 'KPI Studio', detail: 'Defines certified KPIs from semantic metrics and generates tracked results.', icon: <Target className="size-4" /> },
  { label: 'Semantic Layer Manager', detail: 'Curates dimensions, metric formulas, filters and certified business definitions.', icon: <Brain className="size-4" /> },
  { label: 'Dashboard Builder', detail: 'Composes executive dashboards from governed data marts and KPI widgets.', icon: <Layers3 className="size-4" /> },
];

export function DataPlatformWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Data Lake, Warehouse & BI Semantic Layer</h1>
            <Badge>Phase 31</Badge>
            <Badge className="bg-white/80">Executive Analytics Fabric</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Governed data lakes, warehouses, data marts, semantic metrics, KPIs, pipelines and executive dashboards for cross-module business intelligence.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search data assets"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh warehouse status"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Open BI builder"><Sparkles className="size-4" />Build Dashboard</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Database className="size-5" />} label="Data Assets" value="128" detail="lakes, marts, models" tone="primary" />
        <SignalCard icon={<Gauge className="size-5" />} label="Certified Metrics" value="42" detail="semantic layer" tone="green" />
        <SignalCard icon={<Workflow className="size-5" />} label="Pipelines" value="31" detail="active sync paths" tone="amber" />
        <SignalCard icon={<ShieldCheck className="size-5" />} label="Governed KPIs" value="64" detail="executive scorecards" tone="violet" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Database className="size-4" />} title="Data Warehouse Explorer"><DataTable rows={warehouseRows} columns={['asset', 'type', 'status', 'freshness']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Brain className="size-4" />} title="Semantic Layer Manager"><DataTable rows={metricRows} columns={['metric', 'category', 'formula', 'certified']} /></DataPanel>
            <DataPanel icon={<Target className="size-4" />} title="KPI Studio"><DataTable rows={kpiRows} columns={['kpi', 'target', 'actual', 'band']} /></DataPanel>
          </div>
          <DataPanel icon={<GitBranch className="size-4" />} title="Data Pipeline Operations"><DataTable rows={pipelineRows} columns={['pipeline', 'source', 'target', 'health']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<LineChart className="size-4" />} title="Executive Analytics Center">
            <div className="grid gap-2">{builderItems.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <DataPanel icon={<Network className="size-4" />} title="Cross-Module Reporting">
            <ActionRow icon={<TrendingUp className="size-4" />} label="Revenue intelligence" detail="Combines finance, CRM, product and customer success data marts." />
            <ActionRow icon={<Boxes className="size-4" />} label="Operations fabric" detail="Normalizes workflow, project, HR, inventory and service metrics." />
            <ActionRow icon={<Filter className="size-4" />} label="Governed definitions" detail="Certified semantic metrics prevent KPI drift across departments." />
            <ActionRow icon={<Table2 className="size-4" />} label="Data mart architecture" detail="Domain marts expose curated data for dashboards and AI retrieval." />
          </DataPanel>
          <DataPanel icon={<BadgeCheck className="size-4" />} title="API Surface">
            <div className="grid gap-2">{apiSurface.map((path) => <ActionRow key={path} icon={<ArrowRight className="size-4" />} label={path} detail="Tenant-scoped enterprise data platform API" />)}</div>
          </DataPanel>
        </aside>
      </div>
    </div>
  );
}

function SignalCard({ icon, label, value, detail, tone }: { icon: ReactNode; label: string; value: string; detail: string; tone: 'primary' | 'green' | 'amber' | 'violet' }) {
  const tones = { primary: 'border-primary-200 text-primary-950', green: 'border-emerald-200 text-emerald-950', amber: 'border-amber-200 text-amber-950', violet: 'border-violet-200 text-violet-950' };
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('rounded-lg border bg-white/78 p-4 shadow-subtle backdrop-blur-shell', tones[tone])}><div className="flex items-center justify-between gap-3"><span>{icon}</span><span className="flex size-4 items-center justify-center rounded-full bg-current/10"><span className="size-1.5 rounded-full bg-current" /></span></div><div className="mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-sm font-medium">{label}</div><div className="mt-1 text-xs opacity-70">{detail}</div></motion.div>;
}

function DataPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <section className="rounded-lg border border-neutral-200 bg-white/78 p-4 shadow-subtle backdrop-blur-shell"><div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-primary-950">{icon}<span>{title}</span></div><Button variant="icon" size="icon" title={`Open ${title}`}><ArrowRight className="size-4" /></Button></div>{children}</section>;
}

function DataTable({ rows, columns }: { rows: Record<string, string>[]; columns: string[] }) {
  return <div className="overflow-hidden rounded-md border border-neutral-200"><table className="w-full table-fixed text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-medium">{column.replace('-', ' ')}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row[columns[0]]}-${index}`} className="border-t border-neutral-100">{columns.map((column) => <td key={column} className="truncate px-3 py-2 text-neutral-700">{row[column]}</td>)}</tr>)}</tbody></table></div>;
}

function ActionRow({ icon, label, detail }: { icon: ReactNode; label: string; detail: string }) {
  return <div className="flex min-w-0 items-start gap-3 rounded-md border border-neutral-200 bg-white/70 p-3"><span className="mt-0.5 text-primary-700">{icon}</span><div className="min-w-0"><div className="truncate text-sm font-medium text-neutral-950">{label}</div><div className="mt-0.5 text-xs leading-5 text-neutral-500">{detail}</div></div></div>;
}