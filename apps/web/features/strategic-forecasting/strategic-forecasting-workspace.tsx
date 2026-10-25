'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BadgeCheck, BarChart3, Brain, BriefcaseBusiness, Calculator, Compass, Gauge, GitBranch, Landmark, LineChart, PieChart, RefreshCw, Search, Sparkles, Target, TrendingUp, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const forecastRows = [
  { forecast: 'Revenue', horizon: 'Q3', value: '$4.8M', confidence: '86%', trend: 'Up' },
  { forecast: 'Sales', horizon: 'Monthly', value: '1.2k deals', confidence: '81%', trend: 'Stable' },
  { forecast: 'Demand', horizon: '90 days', value: '34.5k units', confidence: '78%', trend: 'Up' },
];

const predictionRows = [
  { prediction: 'Customer churn', segment: 'SMB SaaS', score: '0.41', band: 'Medium' },
  { prediction: 'Revenue risk', segment: 'Enterprise', score: '0.27', band: 'Low' },
  { prediction: 'Opportunity expansion', segment: 'Agency', score: '0.72', band: 'High' },
];

const scenarioRows = [
  { scenario: 'Base Case', impact: '+12%', risk: 'Medium', action: 'Monitor variance' },
  { scenario: 'Aggressive Growth', impact: '+28%', risk: 'High', action: 'Increase capacity' },
  { scenario: 'Cost Control', impact: '+7%', risk: 'Low', action: 'Protect pipeline' },
];

const planningRows = [
  { plan: 'FY Strategic Plan', owner: 'Executive', budget: '$2.1M', capacity: '14 FTE gap' },
  { plan: 'Revenue Expansion', owner: 'Sales', budget: '$640k', capacity: '3 FTE gap' },
  { plan: 'AI Automation', owner: 'Operations', budget: '$380k', capacity: 'Healthy' },
];

const apiSurface = ['/v1/forecasting', '/v1/predictions', '/v1/strategic-planning', '/v1/scenarios', '/v1/budget-planning', '/v1/capacity-planning', '/v1/growth-forecast', '/v1/risk-forecast'];

const copilotActions = [
  { label: 'Strategic recommendations', detail: 'Connects forecasts, goals, scenarios and execution constraints.', icon: <Sparkles className="size-4" /> },
  { label: 'Budget recommendations', detail: 'Finds allocation gaps and funding pressure by plan.', icon: <Calculator className="size-4" /> },
  { label: 'Risk alerts', detail: 'Prioritizes risks by probability, impact and confidence.', icon: <AlertTriangle className="size-4" /> },
  { label: 'Forecast explanations', detail: 'Shows drivers, confidence and assumptions behind forecast results.', icon: <Brain className="size-4" /> },
];

export function StrategicForecastingWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Data Science, Forecasting & Strategic Planning</h1>
            <Badge>Phase 30</Badge>
            <Badge className="bg-white/80">AI Strategy Operating Layer</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Revenue, sales, expense, demand, workforce and capacity forecasts connected to predictions, budgets, scenarios and executive strategy recommendations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search forecasts"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh strategy data"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Open AI Strategy Copilot"><Sparkles className="size-4" />Strategy Copilot</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<LineChart className="size-5" />} label="Forecast Models" value="24" detail="revenue to capacity" tone="primary" />
        <SignalCard icon={<Target className="size-5" />} label="Prediction Accuracy" value="84%" detail="active models" tone="green" />
        <SignalCard icon={<GitBranch className="size-5" />} label="Scenarios" value="16" detail="what-if paths" tone="amber" />
        <SignalCard icon={<AlertTriangle className="size-5" />} label="Risk Alerts" value="7" detail="needs review" tone="rose" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<BarChart3 className="size-4" />} title="Forecast Dashboard"><DataTable rows={forecastRows} columns={['forecast', 'horizon', 'value', 'confidence', 'trend']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Gauge className="size-4" />} title="Prediction Center"><DataTable rows={predictionRows} columns={['prediction', 'segment', 'score', 'band']} /></DataPanel>
            <DataPanel icon={<GitBranch className="size-4" />} title="Scenario Modeling Studio"><DataTable rows={scenarioRows} columns={['scenario', 'impact', 'risk', 'action']} /></DataPanel>
          </div>
          <DataPanel icon={<BriefcaseBusiness className="size-4" />} title="Strategic Planning Workspace"><DataTable rows={planningRows} columns={['plan', 'owner', 'budget', 'capacity']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Brain className="size-4" />} title="AI Strategy Copilot">
            <div className="grid gap-2">{copilotActions.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <DataPanel icon={<Compass className="size-4" />} title="Strategic Signals">
            <ActionRow icon={<TrendingUp className="size-4" />} label="Growth forecast" detail="Shows expansion trajectories and confidence across segments." />
            <ActionRow icon={<Landmark className="size-4" />} label="Budget planning" detail="Tracks planned revenue, expenses, allocation and variance." />
            <ActionRow icon={<UsersRound className="size-4" />} label="Capacity planning" detail="Connects workforce, demand and execution readiness." />
            <ActionRow icon={<PieChart className="size-4" />} label="What-if analysis" detail="Compares base, best, worst and stress-test scenarios." />
          </DataPanel>
          <DataPanel icon={<BadgeCheck className="size-4" />} title="API Surface">
            <div className="grid gap-2">{apiSurface.map((path) => <ActionRow key={path} icon={<ArrowRight className="size-4" />} label={path} detail="Tenant-scoped forecasting and planning API" />)}</div>
          </DataPanel>
        </aside>
      </div>
    </div>
  );
}

function SignalCard({ icon, label, value, detail, tone }: { icon: ReactNode; label: string; value: string; detail: string; tone: 'primary' | 'green' | 'amber' | 'rose' }) {
  const tones = { primary: 'border-primary-200 text-primary-950', green: 'border-emerald-200 text-emerald-950', amber: 'border-amber-200 text-amber-950', rose: 'border-rose-200 text-rose-950' };
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('rounded-lg border bg-white/78 p-4 shadow-subtle backdrop-blur-shell', tones[tone])}><div className="flex items-center justify-between gap-3"><span>{icon}</span><ActivityPulse /></div><div className="mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-sm font-medium">{label}</div><div className="mt-1 text-xs opacity-70">{detail}</div></motion.div>;
}

function ActivityPulse() {
  return <span className="flex size-4 items-center justify-center rounded-full bg-current/10"><span className="size-1.5 rounded-full bg-current" /></span>;
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