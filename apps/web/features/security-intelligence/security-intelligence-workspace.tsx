'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, AlertTriangle, ArrowRight, BadgeCheck, Bell, CheckCircle2, ClipboardList, Eye, FileSearch, Gauge, KeyRound, LockKeyhole, Radar, RefreshCw, Search, ShieldAlert, ShieldCheck, Siren, Sparkles, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const incidentRows = [
  { incident: 'Suspicious admin token reuse', severity: 'Critical', status: 'Open', owner: 'SecOps' },
  { incident: 'Impossible travel pattern', severity: 'High', status: 'Investigating', owner: 'IAM' },
  { incident: 'Compliance evidence gap', severity: 'Medium', status: 'Mitigating', owner: 'GRC' },
];

const threatRows = [
  { threat: 'Credential stuffing', confidence: '89%', source: 'Behavioral', status: 'Active' },
  { threat: 'Webhook replay attempt', confidence: '76%', source: 'Webhook', status: 'Contained' },
  { threat: 'Privilege drift', confidence: '68%', source: 'RBAC', status: 'Watching' },
];

const zeroTrustRows = [
  { policy: 'Executive step-up', mode: 'Enforce', resource: 'Finance', status: 'Active' },
  { policy: 'Unknown device review', mode: 'Monitor', resource: 'All apps', status: 'Active' },
  { policy: 'High-risk API key', mode: 'Enforce', resource: 'Integrations', status: 'Active' },
];

const investigationRows = [
  { case: 'SEC-1042', priority: 'Critical', lead: 'Security Lead', status: 'Open' },
  { case: 'SEC-1037', priority: 'High', lead: 'IAM Lead', status: 'Evidence' },
  { case: 'SEC-1028', priority: 'Medium', lead: 'Compliance', status: 'Review' },
];

const apiSurface = ['/v1/security', '/v1/security-intelligence', '/v1/threat-detection', '/v1/security-audit', '/v1/security-incidents', '/v1/security-alerts', '/v1/zero-trust', '/v1/security-risk'];

const intelligenceItems = [
  { label: 'Security Command Center', detail: 'Coordinates incidents, alerts, investigations, audit signals and compliance posture.', icon: <ShieldCheck className="size-4" /> },
  { label: 'Threat Detection Engine', detail: 'Correlates rules, threat events, indicators, confidence and mitigation guidance.', icon: <Radar className="size-4" /> },
  { label: 'Zero Trust Access Layer', detail: 'Records adaptive access decisions with trust level, risk score and policy evidence.', icon: <LockKeyhole className="size-4" /> },
  { label: 'Risk Assessment Engine', detail: 'Scores security risks, posture changes, remediation plans and executive risk signals.', icon: <Gauge className="size-4" /> },
];

export function SecurityIntelligenceWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Security Intelligence, Threat Detection & Zero Trust Operations</h1>
            <Badge>Phase 33</Badge>
            <Badge className="bg-white/80">Security Command Plane</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Security command center, threat detection, incident management, zero trust access, security audit, risk scoring and compliance monitoring for global enterprise operations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search security intelligence"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh security center"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Run security review"><Sparkles className="size-4" />Review</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Siren className="size-5" />} label="Open Incidents" value="14" detail="triage and response" tone="red" />
        <SignalCard icon={<Radar className="size-5" />} label="Active Threats" value="23" detail="correlated signals" tone="amber" />
        <SignalCard icon={<ShieldCheck className="size-5" />} label="Security Score" value="82" detail="healthy with watch items" tone="green" />
        <SignalCard icon={<UserCheck className="size-5" />} label="Zero Trust Checks" value="9.8k" detail="last 24 hours" tone="primary" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<ShieldAlert className="size-4" />} title="Security Command Center"><DataTable rows={incidentRows} columns={['incident', 'severity', 'status', 'owner']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Radar className="size-4" />} title="Threat Monitoring Dashboard"><DataTable rows={threatRows} columns={['threat', 'confidence', 'source', 'status']} /></DataPanel>
            <DataPanel icon={<LockKeyhole className="size-4" />} title="Zero Trust Policy Manager"><DataTable rows={zeroTrustRows} columns={['policy', 'mode', 'resource', 'status']} /></DataPanel>
          </div>
          <DataPanel icon={<FileSearch className="size-4" />} title="Security Investigation Workspace"><DataTable rows={investigationRows} columns={['case', 'priority', 'lead', 'status']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Eye className="size-4" />} title="Security Intelligence Dashboard">
            <div className="grid gap-2">{intelligenceItems.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <DataPanel icon={<Bell className="size-4" />} title="Security Alerts Panel">
            <ActionRow icon={<AlertOctagon className="size-4" />} label="Critical incident routing" detail="Critical alerts route to command center, executive notifications and investigation queues." />
            <ActionRow icon={<KeyRound className="size-4" />} label="Access verification" detail="Every sensitive action can require risk-based zero trust verification." />
            <ActionRow icon={<ClipboardList className="size-4" />} label="Audit evidence" detail="Security audit and compliance violation events stay tenant and workspace scoped." />
            <ActionRow icon={<AlertTriangle className="size-4" />} label="Risk response" detail="Risk scores drive remediation priorities, monitoring and executive security posture." />
          </DataPanel>
          <DataPanel icon={<BadgeCheck className="size-4" />} title="API Surface">
            <div className="grid gap-2">{apiSurface.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped security operations API" />)}</div>
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