'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, BarChart3, Bot, Briefcase, ClipboardList, FlaskConical, Gauge, LayoutDashboard, LineChart, Network, Search, ShieldCheck, Sparkles, Target, Users, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { planningApiGroups, planningCapabilities, strategyCopilotQuestions } from '@/services/planning-api';

const commandCenters = [
  { label: 'OKR Operating System', detail: 'Objectives, key results, initiatives, check-ins and alignment across teams.', icon: <Target className="size-4" /> },
  { label: 'Portfolio Command', detail: 'Portfolios, programs, projects, investments, dependencies and risk decisions.', icon: <Briefcase className="size-4" /> },
  { label: 'Planning Intelligence', detail: 'Resource, capacity, budget and scenario planning for executive tradeoffs.', icon: <LineChart className="size-4" /> },
  { label: 'AI Strategy Copilot', detail: 'Natural language strategic questions, recommendations and risk signals.', icon: <Bot className="size-4" /> },
];

export function PlanningWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Planning, OKRs & Portfolio Intelligence</h1>
            <Badge>Phase 47</Badge>
            <Badge className="bg-white/80">Strategy Operating Layer</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">OKR management, strategic planning, portfolio management, resource planning, capacity planning, budget planning, scenario modeling, executive dashboards, portfolio analytics and AI strategy copilot.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search planning"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Open portfolio analytics"><BarChart3 className="size-4" />Analytics</Button>
          <Button title="Ask strategy copilot"><Sparkles className="size-4" />Ask AI</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<ClipboardList className="size-5" />} label="Planning Models" value="41" detail="strategy and portfolio entities" tone="primary" />
        <SignalCard icon={<ShieldCheck className="size-5" />} label="RBAC Roles" value="7" detail="strategy governance roles" tone="green" />
        <SignalCard icon={<Network className="size-5" />} label="Domain Events" value="21" detail="OKR and portfolio ready" tone="amber" />
        <SignalCard icon={<LayoutDashboard className="size-5" />} label="Dashboards" value="10" detail="module-level dashboards" tone="blue" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Target className="size-4" />} title="Strategy Command Center">
            <div className="grid gap-3 md:grid-cols-2">{commandCenters.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<BadgeCheck className="size-4" />} title="Planning Modules">
              <div className="grid gap-2">{planningCapabilities.slice(0, 5).map((item) => <ActionRow key={item} icon={<Gauge className="size-4" />} label={item} detail="Backed by Phase 47 Prisma models, validators, services and controllers." />)}</div>
            </DataPanel>
            <DataPanel icon={<Sparkles className="size-4" />} title="Intelligence Modules">
              <div className="grid gap-2">{planningCapabilities.slice(5).map((item) => <ActionRow key={item} icon={<ArrowRight className="size-4" />} label={item} detail="Connected to OKR progress, portfolio health, resource capacity, budget variance and scenario outcomes." />)}</div>
            </DataPanel>
          </div>
          <DataPanel icon={<Bot className="size-4" />} title="AI Strategy Copilot Questions">
            <div className="grid gap-2 md:grid-cols-2">{strategyCopilotQuestions.map((question) => <ActionRow key={question} icon={<Sparkles className="size-4" />} label={question} detail="Natural language strategy request routed through governed planning context." />)}</div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<FlaskConical className="size-4" />} title="Readiness Coverage">
            <ActionRow icon={<Target className="size-4" />} label="OKR alignment" detail="Cycles, objectives, key results, initiatives, check-ins and alignment records." />
            <ActionRow icon={<Users className="size-4" />} label="Resource capacity" detail="Resource pools, demand, allocations, constraints and forecast signals." />
            <ActionRow icon={<Wallet className="size-4" />} label="Budget control" detail="Budget plans, line items, scenarios and variance intelligence." />
            <ActionRow icon={<Briefcase className="size-4" />} label="Portfolio governance" detail="Programs, projects, investments, dependencies, health scores and strategic risks." />
          </DataPanel>
          <DataPanel icon={<BarChart3 className="size-4" />} title="API Groups">
            <div className="grid gap-2">{planningApiGroups.map((apiPath) => <ActionRow key={apiPath} icon={<ArrowRight className="size-4" />} label={apiPath} detail="Versioned, guarded, tenant-aware planning API" />)}</div>
          </DataPanel>
        </aside>
      </div>
    </div>
  );
}

function SignalCard({ icon, label, value, detail, tone }: { icon: ReactNode; label: string; value: string; detail: string; tone: 'primary' | 'green' | 'amber' | 'blue' }) {
  const tones = { primary: 'border-primary-200 text-primary-950', green: 'border-emerald-200 text-emerald-950', amber: 'border-amber-200 text-amber-950', blue: 'border-sky-200 text-sky-950' };
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('rounded-lg border bg-white/78 p-4 shadow-subtle backdrop-blur-shell', tones[tone])}><div className="flex items-center justify-between gap-3"><span>{icon}</span><span className="flex size-4 items-center justify-center rounded-full bg-current/10"><span className="size-1.5 rounded-full bg-current" /></span></div><div className="mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-sm font-medium">{label}</div><div className="mt-1 text-xs opacity-70">{detail}</div></motion.div>;
}

function DataPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <section className="rounded-lg border border-neutral-200 bg-white/78 p-4 shadow-subtle backdrop-blur-shell"><div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-primary-950">{icon}<span>{title}</span></div><Button variant="icon" size="icon" title={'Open ' + title}><ArrowRight className="size-4" /></Button></div>{children}</section>;
}

function ActionRow({ icon, label, detail }: { icon: ReactNode; label: string; detail: string }) {
  return <div className="flex min-w-0 items-start gap-3 rounded-md border border-neutral-200 bg-white/70 p-3"><span className="mt-0.5 text-primary-700">{icon}</span><div className="min-w-0"><div className="truncate text-sm font-medium text-neutral-950">{label}</div><div className="mt-0.5 text-xs leading-5 text-neutral-500">{detail}</div></div></div>;
}
