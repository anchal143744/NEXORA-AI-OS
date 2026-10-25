'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BadgeCheck, BarChart3, Bot, CalendarClock, ClipboardCheck, Clock3, MapPinned, Navigation, RadioTower, Route, Search, ShieldCheck, Sparkles, Smartphone, Truck, UserCog, UsersRound, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { fieldServiceAiQuestions, fieldServiceApiGroups, fieldServiceCapabilities } from '@/services/field-service-api';

const commandCenters = [
  { label: 'Field Operations', detail: 'Requests, cases, appointments, territories and regions for enterprise service teams.', icon: <Truck className="size-4" /> },
  { label: 'Dispatch Engine', detail: 'Boards, assignments, rules, exceptions and SLA-aware technician allocation.', icon: <RadioTower className="size-4" /> },
  { label: 'Mobile Workforce', detail: 'Technician sessions, device registration, offline queue and sync events.', icon: <Smartphone className="size-4" /> },
  { label: 'AI Field Copilot', detail: 'Natural language route, SLA, technician, capacity and service-risk recommendations.', icon: <Bot className="size-4" /> },
];

export function FieldServiceWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Field Service & Workforce Operations</h1>
            <Badge>Phase 46</Badge>
            <Badge className="bg-white/80">Field Operations OS</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Field service, work orders, dispatch, technicians, route optimization, mobile workforce, SLA management, customer service intelligence, workforce analytics and AI field service copilot.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search field service"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Open dispatch analytics"><BarChart3 className="size-4" />Analytics</Button>
          <Button title="Ask field copilot"><Sparkles className="size-4" />Ask AI</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Wrench className="size-5" />} label="Field Models" value="42" detail="service operation entities" tone="primary" />
        <SignalCard icon={<ShieldCheck className="size-5" />} label="RBAC Roles" value="7" detail="field-specific roles" tone="green" />
        <SignalCard icon={<Clock3 className="size-5" />} label="Domain Events" value="21" detail="SLA and dispatch ready" tone="amber" />
        <SignalCard icon={<MapPinned className="size-5" />} label="Dashboards" value="10" detail="module-level dashboards" tone="blue" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Navigation className="size-4" />} title="Field Service Command Center">
            <div className="grid gap-3 md:grid-cols-2">{commandCenters.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<ClipboardCheck className="size-4" />} title="Operating Modules">
              <div className="grid gap-2">{fieldServiceCapabilities.slice(0, 5).map((item) => <ActionRow key={item} icon={<BadgeCheck className="size-4" />} label={item} detail="Backed by Phase 46 Prisma models, validators, services and controllers." />)}</div>
            </DataPanel>
            <DataPanel icon={<Sparkles className="size-4" />} title="Intelligence Modules">
              <div className="grid gap-2">{fieldServiceCapabilities.slice(5).map((item) => <ActionRow key={item} icon={<ArrowRight className="size-4" />} label={item} detail="Connected to SLA analytics, route optimization, mobile sync, customer signals and AI recommendations." />)}</div>
            </DataPanel>
          </div>
          <DataPanel icon={<Bot className="size-4" />} title="AI Field Service Copilot Questions">
            <div className="grid gap-2 md:grid-cols-2">{fieldServiceAiQuestions.map((question) => <ActionRow key={question} icon={<Sparkles className="size-4" />} label={question} detail="Natural language request routed through governed field-service context." />)}</div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Route className="size-4" />} title="Readiness Coverage">
            <ActionRow icon={<CalendarClock className="size-4" />} label="Scheduling and SLA" detail="Appointments, commitments, breaches, escalations and service-risk signals." />
            <ActionRow icon={<UserCog className="size-4" />} label="Technician operations" detail="Profiles, skills, certifications, availability and performance." />
            <ActionRow icon={<UsersRound className="size-4" />} label="Customer service intelligence" detail="Visits, feedback, resolutions and service insights." />
            <ActionRow icon={<AlertTriangle className="size-4" />} label="Dispatch risk" detail="Route, travel, SLA and capacity signals for proactive dispatch decisions." />
          </DataPanel>
          <DataPanel icon={<BarChart3 className="size-4" />} title="API Groups">
            <div className="grid gap-2">{fieldServiceApiGroups.map((apiPath) => <ActionRow key={apiPath} icon={<ArrowRight className="size-4" />} label={apiPath} detail="Versioned, guarded, tenant-aware field-service API" />)}</div>
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

