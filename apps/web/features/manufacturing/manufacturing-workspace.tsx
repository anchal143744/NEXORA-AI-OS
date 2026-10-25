'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BarChart3, Bot, BrainCircuit, Boxes, CalendarClock, CheckCircle2, ClipboardCheck, ClipboardList, Factory, Gauge, GitBranch, HardHat, Layers3, Microscope, PackageCheck, PlayCircle, Search, Settings2, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { manufacturingApiGroups, manufacturingCapabilities } from '@/services/manufacturing-api';

const commandCenters = [
  { label: 'Production Planning', detail: 'Plans, schedules, material requirements and production orders from governed API state.', icon: <CalendarClock className="size-4" /> },
  { label: 'MES Operations', detail: 'Execution runs, operations, telemetry, order status and shop-floor events.', icon: <PlayCircle className="size-4" /> },
  { label: 'Quality Intelligence', detail: 'Inspections, issues, corrective action trails and quality analytics.', icon: <Microscope className="size-4" /> },
  { label: 'Digital Twin', detail: 'Factory models, snapshots, simulation context and anomaly signals.', icon: <GitBranch className="size-4" /> },
];

export function ManufacturingWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Manufacturing, Production Planning & Quality Intelligence</h1>
            <Badge>Phase 43</Badge>
            <Badge className="bg-white/80">Manufacturing OS</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Tenant-scoped manufacturing foundation with BOM, production planning, MES, QMS, predictive maintenance, cost intelligence, analytics, risk, digital twin and AI copilot modules.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search manufacturing context"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Open manufacturing controls"><Settings2 className="size-4" />Controls</Button>
          <Button title="Ask manufacturing copilot"><Sparkles className="size-4" />Ask AI</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Factory className="size-5" />} label="Manufacturing Modules" value="12" detail="operational domains" tone="primary" />
        <SignalCard icon={<GitBranch className="size-5" />} label="CQRS Surface" value="On" detail="commands and queries separated" tone="green" />
        <SignalCard icon={<Gauge className="size-5" />} label="Analytics Coverage" value="OEE" detail="yield, cost, risk and quality ready" tone="amber" />
        <SignalCard icon={<ShieldCheck className="size-5" />} label="Governance" value="RBAC" detail="tenant and workspace scoped" tone="blue" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Factory className="size-4" />} title="Manufacturing Command Center">
            <div className="grid gap-3 md:grid-cols-2">{commandCenters.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<ClipboardList className="size-4" />} title="Operational Modules">
              <div className="grid gap-2">{manufacturingCapabilities.slice(0, 6).map((item) => <ActionRow key={item} icon={<CheckCircle2 className="size-4" />} label={item} detail="Backed by Phase 43 Prisma models, services and OpenAPI controllers." />)}</div>
            </DataPanel>
            <DataPanel icon={<BrainCircuit className="size-4" />} title="Intelligence Modules">
              <div className="grid gap-2">{manufacturingCapabilities.slice(6).map((item) => <ActionRow key={item} icon={<Sparkles className="size-4" />} label={item} detail="Connected to manufacturing analytics, events, digital twin and AI context." />)}</div>
            </DataPanel>
          </div>
          <DataPanel icon={<BarChart3 className="size-4" />} title="Analytics Coverage">
            <div className="grid gap-3 md:grid-cols-3">
              <MetricTile icon={<Gauge className="size-4" />} label="OEE" detail="Availability, performance and quality calculations." />
              <MetricTile icon={<PackageCheck className="size-4" />} label="Yield" detail="Completed versus scrapped production quantities." />
              <MetricTile icon={<AlertTriangle className="size-4" />} label="Risk" detail="Probability, impact and mitigation signal tracking." />
            </div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<HardHat className="size-4" />} title="Factory Readiness">
            <ActionRow icon={<Layers3 className="size-4" />} label="BOM and routing ready" detail="BillOfMaterial, BomComponent, ProductionPlan, ProductionSchedule and ProductionOrder models created." />
            <ActionRow icon={<Wrench className="size-4" />} label="Maintenance intelligence" detail="MaintenanceAsset and MaintenancePrediction APIs support risk-aware maintenance workflows." />
            <ActionRow icon={<ClipboardCheck className="size-4" />} label="Quality system" detail="QualityInspection and QualityIssue controllers enforce tenant-scoped QMS access." />
            <ActionRow icon={<Bot className="size-4" />} label="AI manufacturing copilot" detail="Queries persist with manufacturing context, recommendations and audited event publication." />
          </DataPanel>
          <DataPanel icon={<Boxes className="size-4" />} title="API Groups">
            <div className="grid gap-2">{manufacturingApiGroups.map((apiPath) => <ActionRow key={apiPath} icon={<ArrowRight className="size-4" />} label={apiPath} detail="Versioned, guarded, tenant-aware manufacturing API" />)}</div>
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

function MetricTile({ icon, label, detail }: { icon: ReactNode; label: string; detail: string }) {
  return <div className="rounded-md border border-neutral-200 bg-white/70 p-3"><div className="flex items-center gap-2 text-sm font-semibold text-primary-950">{icon}<span>{label}</span></div><p className="mt-2 text-xs leading-5 text-neutral-500">{detail}</p></div>;
}

