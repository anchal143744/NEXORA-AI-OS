'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BadgeCheck, BarChart3, Bot, CheckCircle2, DatabaseBackup, Gauge, HardDriveDownload, Rocket, Scale, Search, ShieldCheck, Sparkles, TestTube2, TimerReset, TrafficCone, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { productionReadinessApiGroups, productionReadinessCapabilities, releaseCandidateQuestions } from '@/services/production-readiness-api';

const commandCenters = [
  { label: 'Release Candidate Gates', detail: 'Security, dependency, build, test, documentation and approval gates for RC1.', icon: <Rocket className="size-4" /> },
  { label: 'Reliability and Recovery', detail: 'Backup validation, RPO/RTO scoring, failover exercises and disaster recovery evidence.', icon: <DatabaseBackup className="size-4" /> },
  { label: 'Performance and Scale', detail: 'Load tests, stress tests, latency budgets, throughput baselines and regression tracking.', icon: <Gauge className="size-4" /> },
  { label: 'Production Scoring', detail: 'Weighted readiness score, risk register, hardening audit trail and executive release signal.', icon: <CheckCircle2 className="size-4" /> },
];

export function ProductionReadinessWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Production Hardening & Enterprise Release Candidate</h1>
            <Badge>Phase 50</Badge>
            <Badge className="bg-white/80">1.0.0-RC1</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Security hardening, load testing, performance optimization, observability, backup, disaster recovery, deployment readiness, API governance, coverage, documentation and production readiness scoring.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search release evidence"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Open readiness analytics"><BarChart3 className="size-4" />Analytics</Button>
          <Button title="Ask release copilot"><Sparkles className="size-4" />Ask AI</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<ShieldCheck className="size-5" />} label="RC Models" value="36" detail="hardening and evidence entities" tone="primary" />
        <SignalCard icon={<TestTube2 className="size-5" />} label="Validation Gates" value="11" detail="all executed for RC1" tone="green" />
        <SignalCard icon={<Workflow className="size-5" />} label="Domain Events" value="34" detail="release audit ready" tone="amber" />
        <SignalCard icon={<Scale className="size-5" />} label="API Groups" value="12" detail="release governance surfaces" tone="blue" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Rocket className="size-4" />} title="Release Candidate Command Center">
            <div className="grid gap-3 md:grid-cols-2">{commandCenters.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<BadgeCheck className="size-4" />} title="Hardening Modules">
              <div className="grid gap-2">{productionReadinessCapabilities.slice(0, 6).map((item) => <ActionRow key={item} icon={<Activity className="size-4" />} label={item} detail="Backed by Phase 50 Prisma models, validators, services and controllers." />)}</div>
            </DataPanel>
            <DataPanel icon={<Sparkles className="size-4" />} title="Release Modules">
              <div className="grid gap-2">{productionReadinessCapabilities.slice(6).map((item) => <ActionRow key={item} icon={<ArrowRight className="size-4" />} label={item} detail="Connected to deployment gates, API governance, test coverage, documentation and RC scoring." />)}</div>
            </DataPanel>
          </div>
          <DataPanel icon={<Bot className="size-4" />} title="Release Candidate Questions">
            <div className="grid gap-2 md:grid-cols-2">{releaseCandidateQuestions.map((question) => <ActionRow key={question} icon={<Sparkles className="size-4" />} label={question} detail="Natural language request routed through governed release-candidate evidence." />)}</div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<TrafficCone className="size-4" />} title="Readiness Coverage">
            <ActionRow icon={<ShieldCheck className="size-4" />} label="Security and dependencies" detail="High/critical dependency issues remediated; remaining moderate advisories tracked." />
            <ActionRow icon={<TimerReset className="size-4" />} label="Scale and performance" detail="Load, stress, latency, throughput, error-rate and regression evidence." />
            <ActionRow icon={<HardDriveDownload className="size-4" />} label="Recovery posture" detail="Backup, restore, RPO/RTO and failover validation records." />
            <ActionRow icon={<CheckCircle2 className="size-4" />} label="RC approval" detail="Release checklist, validation run, approval and production readiness score." />
          </DataPanel>
          <DataPanel icon={<BarChart3 className="size-4" />} title="API Groups">
            <div className="grid gap-2">{productionReadinessApiGroups.map((apiPath) => <ActionRow key={apiPath} icon={<ArrowRight className="size-4" />} label={apiPath} detail="Versioned, guarded, tenant-aware release-candidate API" />)}</div>
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
