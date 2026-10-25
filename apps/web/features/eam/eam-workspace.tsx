'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ArrowRight, BadgeCheck, BarChart3, Bot, Boxes, CalendarClock, Cpu, FileClock, Gauge, HardHat, Layers3, Search, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { eamAiQuestions, eamApiGroups, eamCapabilities } from '@/services/eam-api';

const commandCenters = [
  { label: 'Asset Registry', detail: 'Assets, categories, locations, tags, serials and ownership context.', icon: <Boxes className="size-4" /> },
  { label: 'Maintenance Operations', detail: 'Plans, schedules, inspections, work orders, parts, labor and approvals.', icon: <Wrench className="size-4" /> },
  { label: 'Asset Health Intelligence', detail: 'Health scores, condition signals, risks and failure predictions.', icon: <Gauge className="size-4" /> },
  { label: 'AI Asset Copilot', detail: 'Natural language asset questions with cost, health, warranty and IoT context.', icon: <Bot className="size-4" /> },
];

export function EamWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Asset Management & Equipment Intelligence</h1>
            <Badge>Phase 45</Badge>
            <Badge className="bg-white/80">EAM OS</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Asset registry, lifecycle, maintenance, work orders, health intelligence, contracts, cost intelligence, IoT monitoring, analytics and AI asset copilot.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search assets"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Open asset analytics"><BarChart3 className="size-4" />Analytics</Button>
          <Button title="Ask asset copilot"><Sparkles className="size-4" />Ask AI</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Boxes className="size-5" />} label="EAM Models" value="39" detail="asset intelligence entities" tone="primary" />
        <SignalCard icon={<ShieldCheck className="size-5" />} label="RBAC Roles" value="7" detail="asset-specific roles" tone="green" />
        <SignalCard icon={<Activity className="size-5" />} label="Domain Events" value="18" detail="audit and automation ready" tone="amber" />
        <SignalCard icon={<Gauge className="size-5" />} label="Dashboards" value="10" detail="module-level dashboards" tone="blue" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<HardHat className="size-4" />} title="Asset Command Center">
            <div className="grid gap-3 md:grid-cols-2">{commandCenters.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Layers3 className="size-4" />} title="Operating Modules">
              <div className="grid gap-2">{eamCapabilities.slice(0, 5).map((item) => <ActionRow key={item} icon={<BadgeCheck className="size-4" />} label={item} detail="Backed by Phase 45 Prisma models, validators, services and controllers." />)}</div>
            </DataPanel>
            <DataPanel icon={<Sparkles className="size-4" />} title="Intelligence Modules">
              <div className="grid gap-2">{eamCapabilities.slice(5).map((item) => <ActionRow key={item} icon={<ArrowRight className="size-4" />} label={item} detail="Connected to asset analytics, IoT signals, costs, risks and AI recommendations." />)}</div>
            </DataPanel>
          </div>
          <DataPanel icon={<Bot className="size-4" />} title="AI Asset Copilot Questions">
            <div className="grid gap-2 md:grid-cols-2">{eamAiQuestions.map((question) => <ActionRow key={question} icon={<Sparkles className="size-4" />} label={question} detail="Natural language request routed through governed EAM context." />)}</div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<FileClock className="size-4" />} title="Readiness Coverage">
            <ActionRow icon={<CalendarClock className="size-4" />} label="Lifecycle and warranties" detail="Assignments, lifecycle records, depreciation, warranties, contracts and renewal reminders." />
            <ActionRow icon={<Wrench className="size-4" />} label="Work order execution" detail="Work orders, tasks, parts, time entries and approvals." />
            <ActionRow icon={<Cpu className="size-4" />} label="IoT monitoring" detail="Devices, telemetry, alerts and sensor calibration foundations." />
            <ActionRow icon={<AlertTriangle className="size-4" />} label="Risk and reliability" detail="Health scores, condition signals, risk assessments and failure predictions." />
          </DataPanel>
          <DataPanel icon={<BarChart3 className="size-4" />} title="API Groups">
            <div className="grid gap-2">{eamApiGroups.map((apiPath) => <ActionRow key={apiPath} icon={<ArrowRight className="size-4" />} label={apiPath} detail="Versioned, guarded, tenant-aware EAM API" />)}</div>
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



