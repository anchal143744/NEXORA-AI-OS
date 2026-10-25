'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ArrowRight, BadgeCheck, CheckCircle2, Clock, Cloud, Gauge, Globe2, LineChart, RefreshCw, Rocket, Search, Server, ShieldCheck, Siren, Sparkles, Workflow, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const incidentRows = [
  { incident: 'API latency breach', severity: 'High', status: 'Mitigating', region: 'us-east-1' },
  { incident: 'Queue saturation', severity: 'Medium', status: 'Open', region: 'eu-west-1' },
  { incident: 'Webhook retries elevated', severity: 'Medium', status: 'Watching', region: 'global' },
];

const uptimeRows = [
  { service: 'API Gateway', uptime: '99.98%', slo: '99.95%', status: 'Ok' },
  { service: 'Workflow Runtime', uptime: '99.91%', slo: '99.90%', status: 'Ok' },
  { service: 'Realtime Gateway', uptime: '99.86%', slo: '99.90%', status: 'Breach' },
];

const scalingRows = [
  { service: 'AI Jobs', mode: 'Automatic', capacity: '18 -> 26', status: 'Running' },
  { service: 'API Workers', mode: 'Automatic', capacity: '32 -> 40', status: 'Completed' },
  { service: 'Report Queue', mode: 'Manual', capacity: '6 -> 10', status: 'Requested' },
];

const regionRows = [
  { region: 'us-east-1', provider: 'AWS', status: 'Healthy', failover: 'No' },
  { region: 'eu-west-1', provider: 'AWS', status: 'Watch', failover: 'No' },
  { region: 'ap-south-1', provider: 'AWS', status: 'Healthy', failover: 'Standby' },
];

const apiSurface = ['/v1/reliability', '/v1/sre', '/v1/incidents', '/v1/recovery', '/v1/uptime', '/v1/scaling', '/v1/global-operations', '/v1/health'];

const operationsItems = [
  { label: 'Reliability Command Center', detail: 'Combines health, incidents, recovery, SLOs, scaling and global region signals.', icon: <ShieldCheck className="size-4" /> },
  { label: 'SRE Operations Dashboard', detail: 'Tracks alerts, error budgets, capacity forecasts and automation recommendations.', icon: <Activity className="size-4" /> },
  { label: 'Recovery Automation Engine', detail: 'Queues recovery actions, records completion and preserves incident timelines.', icon: <Workflow className="size-4" /> },
  { label: 'Global Health Monitoring', detail: 'Maps regional status, failover events and provider-level resilience signals.', icon: <Globe2 className="size-4" /> },
];

export function ReliabilityOperationsWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Reliability, SRE Automation & Global Scale Operations</h1>
            <Badge>Phase 34</Badge>
            <Badge className="bg-white/80">Reliability Command Plane</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Reliability command center, global health monitoring, incident response, recovery automation, uptime intelligence, autoscaling and SRE operations for enterprise scale.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search reliability operations"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh reliability center"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Run reliability review"><Sparkles className="size-4" />Review</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Gauge className="size-5" />} label="Reliability Score" value="97.4" detail="healthy global posture" tone="green" />
        <SignalCard icon={<Siren className="size-5" />} label="Open Incidents" value="7" detail="active response" tone="red" />
        <SignalCard icon={<Clock className="size-5" />} label="Uptime" value="99.94%" detail="rolling 30 days" tone="primary" />
        <SignalCard icon={<Rocket className="size-5" />} label="Scaling Events" value="19" detail="last 24 hours" tone="amber" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<ShieldCheck className="size-4" />} title="Reliability Dashboard"><DataTable rows={incidentRows} columns={['incident', 'severity', 'status', 'region']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Clock className="size-4" />} title="Uptime Monitor"><DataTable rows={uptimeRows} columns={['service', 'uptime', 'slo', 'status']} /></DataPanel>
            <DataPanel icon={<Zap className="size-4" />} title="Scaling Operations Workspace"><DataTable rows={scalingRows} columns={['service', 'mode', 'capacity', 'status']} /></DataPanel>
          </div>
          <DataPanel icon={<Globe2 className="size-4" />} title="Global Regions Dashboard"><DataTable rows={regionRows} columns={['region', 'provider', 'status', 'failover']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Activity className="size-4" />} title="SRE Operations Dashboard">
            <div className="grid gap-2">{operationsItems.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <DataPanel icon={<AlertTriangle className="size-4" />} title="Incident Center">
            <ActionRow icon={<Server className="size-4" />} label="Service health" detail="Service status, latency, error rate, throughput and dependency checks are tenant scoped." />
            <ActionRow icon={<Workflow className="size-4" />} label="Recovery automation" detail="Runbook actions and rollback metadata are tracked against incidents." />
            <ActionRow icon={<Cloud className="size-4" />} label="Global failover" detail="Region health and failover events feed reliability intelligence." />
            <ActionRow icon={<LineChart className="size-4" />} label="Capacity forecasts" detail="Forecasts connect demand signals to scaling policy recommendations." />
          </DataPanel>
          <DataPanel icon={<BadgeCheck className="size-4" />} title="API Surface">
            <div className="grid gap-2">{apiSurface.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped reliability operations API" />)}</div>
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