'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BadgeCheck, BarChart3, CheckCircle2, Cpu, DollarSign, Gauge, LineChart, PieChart, RefreshCw, Search, Sparkles, Target, TrendingDown, TrendingUp, Wallet, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const costRows = [
  { center: 'AI Platform', owner: 'AI Ops', spend: '$42.8k', status: 'Watch' },
  { center: 'Customer Experience', owner: 'CX Ops', spend: '$18.4k', status: 'Healthy' },
  { center: 'Data Platform', owner: 'Analytics', spend: '$31.2k', status: 'Optimize' },
];

const performanceRows = [
  { service: 'Workflow Runtime', latency: '184ms', cost: '$0.018/run', status: 'Healthy' },
  { service: 'AI Jobs', latency: '1.9s', cost: '$0.072/job', status: 'Watch' },
  { service: 'Search Indexing', latency: '420ms', cost: '$0.006/doc', status: 'Optimize' },
];

const optimizationRows = [
  { recommendation: 'Right-size AI workers', savings: '$8.2k', effort: 'Medium', priority: 'High' },
  { recommendation: 'Archive cold telemetry', savings: '$3.6k', effort: 'Low', priority: 'Medium' },
  { recommendation: 'Tune report queue', savings: '$1.7k', effort: 'Low', priority: 'Medium' },
];

const budgetRows = [
  { budget: 'AI Runtime', used: '82%', forecast: '96%', status: 'Tracking' },
  { budget: 'Data Platform', used: '91%', forecast: '108%', status: 'Alert' },
  { budget: 'Integrations', used: '64%', forecast: '78%', status: 'Healthy' },
];

const apiSurface = ['/v1/finops', '/v1/cost-intelligence', '/v1/performance', '/v1/resource-usage', '/v1/cost-forecast', '/v1/optimization', '/v1/budgets', '/v1/efficiency'];

const commandItems = [
  { label: 'FinOps Command Center', detail: 'Combines cost centers, budgets, usage, forecasts, optimization and alerts.', icon: <Wallet className="size-4" /> },
  { label: 'Cost Intelligence Engine', detail: 'Tracks spend metrics, cost forecasts, allocation and department-level ownership.', icon: <DollarSign className="size-4" /> },
  { label: 'Performance Optimization', detail: 'Connects latency, utilization and resource cost into actionable optimization signals.', icon: <Gauge className="size-4" /> },
  { label: 'Savings Opportunities', detail: 'Prioritizes recommendations by savings, effort, confidence and business impact.', icon: <TrendingDown className="size-4" /> },
];

export function FinOpsWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Performance Optimization, Cost Intelligence & FinOps</h1>
            <Badge>Phase 35</Badge>
            <Badge className="bg-white/80">FinOps Command Plane</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Cost intelligence, resource utilization, optimization recommendations, budget governance, performance analytics, cost forecasting and department cost allocation.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search FinOps"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh FinOps center"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Run optimization review"><Sparkles className="size-4" />Optimize</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<DollarSign className="size-5" />} label="Monthly Spend" value="$92.4k" detail="current forecast" tone="primary" />
        <SignalCard icon={<TrendingDown className="size-5" />} label="Savings Pipeline" value="$18.7k" detail="identified opportunities" tone="green" />
        <SignalCard icon={<Gauge className="size-5" />} label="Efficiency Score" value="86" detail="healthy with watch items" tone="amber" />
        <SignalCard icon={<AlertTriangle className="size-5" />} label="Cost Alerts" value="6" detail="open budget signals" tone="red" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Wallet className="size-4" />} title="FinOps Dashboard"><DataTable rows={costRows} columns={['center', 'owner', 'spend', 'status']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Cpu className="size-4" />} title="Performance Monitoring Dashboard"><DataTable rows={performanceRows} columns={['service', 'latency', 'cost', 'status']} /></DataPanel>
            <DataPanel icon={<Zap className="size-4" />} title="Optimization Recommendations Panel"><DataTable rows={optimizationRows} columns={['recommendation', 'savings', 'effort', 'priority']} /></DataPanel>
          </div>
          <DataPanel icon={<BarChart3 className="size-4" />} title="Resource Analytics Center"><DataTable rows={budgetRows} columns={['budget', 'used', 'forecast', 'status']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<PieChart className="size-4" />} title="Cost Intelligence Workspace">
            <div className="grid gap-2">{commandItems.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <DataPanel icon={<Target className="size-4" />} title="Optimization Controls">
            <ActionRow icon={<LineChart className="size-4" />} label="Cost forecasting" detail="Forecasts compare predicted cost, baseline cost, variance and confidence." />
            <ActionRow icon={<Cpu className="size-4" />} label="Resource usage" detail="Usage quantity, unit cost, total cost and performance signals stay connected." />
            <ActionRow icon={<Wallet className="size-4" />} label="Department allocation" detail="Resource allocation maps spend to cost centers and accountable owners." />
            <ActionRow icon={<TrendingUp className="size-4" />} label="Efficiency scoring" detail="Efficiency scores combine cost, performance and utilization quality." />
          </DataPanel>
          <DataPanel icon={<BadgeCheck className="size-4" />} title="API Surface">
            <div className="grid gap-2">{apiSurface.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped FinOps API" />)}</div>
          </DataPanel>
        </aside>
      </div>
    </div>
  );
}

function SignalCard({ icon, label, value, detail, tone }: { icon: ReactNode; label: string; value: string; detail: string; tone: 'primary' | 'green' | 'amber' | 'red' }) {
  const tones = { primary: 'border-primary-200 text-primary-950', green: 'border-emerald-200 text-emerald-950', amber: 'border-amber-200 text-amber-950', red: 'border-red-200 text-red-950' };
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('rounded-lg border bg-white/78 p-4 shadow-subtle backdrop-blur-shell', tones[tone])}><div className="flex items-center justify-between gap-3"><span>{icon}</span><span className="flex size-4 items-center justify-center rounded-full bg-current/10"><span className="size-1.5 rounded-full bg-current" /></span></div><div className="mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-sm font-medium">{label}</div><div className="mt-1 text-xs opacity-70">{detail}</div></motion.div>;
}

function DataPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <section className="rounded-lg border border-neutral-200 bg-white/78 p-4 shadow-subtle backdrop-blur-shell"><div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-primary-950">{icon}<span>{title}</span></div><Button variant="icon" size="icon" title={`Open ${title}`}><ArrowRight className="size-4" /></Button></div>{children}</section>;
}

function DataTable({ rows, columns }: { rows: Record<string, string>[]; columns: string[] }) {
  return <div className="overflow-hidden rounded-md border border-neutral-200"><table className="w-full table-fixed text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-medium">{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row[columns[0]]}-${index}`} className="border-t border-neutral-100">{columns.map((column) => <td key={column} className="truncate px-3 py-2 text-neutral-700">{row[column]}</td>)}</tr>)}</tbody></table></div>;
}

function ActionRow({ icon, label, detail }: { icon: ReactNode; label: string; detail: string }) {
  return <div className="flex min-w-0 items-start gap-3 rounded-md border border-neutral-200 bg-white/70 p-3"><span className="mt-0.5 text-primary-700">{icon}</span><div className="min-w-0"><div className="truncate text-sm font-medium text-neutral-950">{label}</div><div className="mt-0.5 text-xs leading-5 text-neutral-500">{detail}</div></div></div>;
}