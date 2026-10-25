'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, Archive, ArrowRight, BadgeCheck, BookOpenCheck, CheckCircle2, ClipboardCheck, Database, FileClock, Fingerprint, Gauge, GitBranch, KeyRound, Layers3, LockKeyhole, RefreshCw, Scale, Search, ShieldCheck, Sparkles, Trash2, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const catalog = [
  { asset: 'CRM Customers', type: 'Table', class: 'PII', owner: 'Revenue Ops', quality: '97%' },
  { asset: 'Invoices', type: 'Financial', class: 'Confidential', owner: 'Finance', quality: '94%' },
  { asset: 'Employee Profiles', type: 'HR', class: 'Sensitive', owner: 'People Ops', quality: '91%' },
];

const privacyRequests = [
  { request: 'GDPR access', subject: 'customer', status: 'Open', due: '18d', verification: 'Pending' },
  { request: 'Deletion', subject: 'lead', status: 'Running', due: '11d', verification: 'Verified' },
  { request: 'Consent review', subject: 'customer', status: 'Complete', due: '-', verification: 'Verified' },
];

const lifecycle = [
  { record: 'CRM Lead', action: 'Archive', status: 'Scheduled', recovery: '30d' },
  { record: 'Invoice Audit', action: 'Retain', status: 'Active', recovery: '90d' },
  { record: 'Import Error', action: 'Delete', status: 'Ready', recovery: '14d' },
];

const compliance = [
  { framework: 'GDPR', controls: '5/6', risk: 'Low', status: 'Ready' },
  { framework: 'CCPA', controls: '4/6', risk: 'Medium', status: 'Attention' },
  { framework: 'SOC2', controls: '6/6', risk: 'Low', status: 'Ready' },
];

const capabilities = [
  { title: 'Data classification', detail: 'PII, sensitive, confidential and internal data tiers', icon: <Fingerprint className="size-4" /> },
  { title: 'Data ownership', detail: 'Business owner, steward and department assignments', icon: <UserCheck className="size-4" /> },
  { title: 'Lineage tracking', detail: 'Upstream and downstream asset dependency graph', icon: <GitBranch className="size-4" /> },
  { title: 'Quality monitoring', detail: 'Completeness, validity, consistency and freshness checks', icon: <Gauge className="size-4" /> },
];

const privacyControls = [
  { label: 'Right to access', state: 'Automated' },
  { label: 'Right to deletion', state: 'Workflow gated' },
  { label: 'Consent management', state: 'Tracked' },
  { label: 'Privacy evidence', state: 'Generated' },
];

export function GovernanceWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Data Governance & Privacy Automation</h1>
            <Badge>Phase 23</Badge>
            <Badge className="bg-white/80">Records Lifecycle</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Govern data assets, privacy requests, consent, retention schedules, records lifecycle actions and compliance evidence from one tenant-aware operating layer.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search governed records"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh governance posture"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Generate evidence"><Sparkles className="size-4" />Evidence</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Database className="size-5" />} label="Catalog Assets" value="128" detail="classified and owned" tone="primary" />
        <SignalCard icon={<LockKeyhole className="size-5" />} label="Privacy Requests" value="12" detail="4 due this month" tone="amber" />
        <SignalCard icon={<FileClock className="size-5" />} label="Retention Policies" value="34" detail="records lifecycle active" tone="green" />
        <SignalCard icon={<Scale className="size-5" />} label="Compliance Evidence" value="76" detail="GDPR, CCPA, SOC2" tone="violet" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<BookOpenCheck className="size-4" />} title="Data Catalog Foundation"><DataTable rows={catalog} columns={['asset', 'type', 'class', 'owner', 'quality']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<LockKeyhole className="size-4" />} title="Privacy Automation"><DataTable rows={privacyRequests} columns={['request', 'subject', 'status', 'due', 'verification']} /></DataPanel>
            <DataPanel icon={<Archive className="size-4" />} title="Records Lifecycle"><DataTable rows={lifecycle} columns={['record', 'action', 'status', 'recovery']} /></DataPanel>
          </div>
          <DataPanel icon={<Scale className="size-4" />} title="Compliance Monitoring"><DataTable rows={compliance} columns={['framework', 'controls', 'risk', 'status']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Layers3 className="size-4" />} title="Governance Engine">
            <div className="grid gap-2">{capabilities.map((item) => <ActionRow key={item.title} {...item} />)}</div>
          </DataPanel>

          <DataPanel icon={<ShieldCheck className="size-4" />} title="Privacy Controls">
            <div className="grid gap-2">{privacyControls.map((control) => <StateRow key={control.label} {...control} />)}</div>
          </DataPanel>

          <DataPanel icon={<ClipboardCheck className="size-4" />} title="Records Automation">
            <div className="grid gap-2">
              <ActionRow icon={<FileClock className="size-4" />} title="Retention schedules" detail="Policy driven retain, archive and delete dates" />
              <ActionRow icon={<Archive className="size-4" />} title="Archiving workflows" detail="Evidence-backed archive jobs and manifests" />
              <ActionRow icon={<Trash2 className="size-4" />} title="Deletion workflows" detail="Recovery windows and legal hold checks" />
              <ActionRow icon={<KeyRound className="size-4" />} title="Audit evidence" detail="Generated evidence packages for framework controls" />
            </div>
          </DataPanel>

          <DataPanel icon={<BadgeCheck className="size-4" />} title="API Surface">
            <div className="grid gap-2">
              {['/v1/data-governance', '/v1/privacy', '/v1/retention', '/v1/records', '/v1/compliance'].map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} title={path} detail="Tenant-scoped governance automation APIs" />)}
            </div>
          </DataPanel>
        </aside>
      </div>
    </div>
  );
}

function SignalCard({ icon, label, value, detail, tone }: { icon: ReactNode; label: string; value: string; detail: string; tone: 'primary' | 'green' | 'amber' | 'violet' }) {
  const tones = { primary: 'bg-primary-100/70 text-primary-950 border-primary-300/70', green: 'bg-emerald-50 text-emerald-800 border-emerald-200', amber: 'bg-amber-50 text-amber-800 border-amber-200', violet: 'bg-violet-50 text-violet-800 border-violet-200' };
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('rounded-lg border bg-white/78 p-4 shadow-subtle backdrop-blur-shell', tones[tone])}><div className="flex items-center justify-between gap-3"><span>{icon}</span><Activity className="size-4 opacity-60" /></div><div className="mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-sm font-medium">{label}</div><div className="mt-1 text-xs opacity-70">{detail}</div></motion.div>;
}

function DataPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <section className="rounded-lg border border-neutral-200 bg-white/78 p-4 shadow-subtle backdrop-blur-shell"><div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-primary-950">{icon}<span>{title}</span></div><Button variant="icon" size="icon" title={`Open ${title}`}><ArrowRight className="size-4" /></Button></div>{children}</section>;
}

function ActionRow({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return <div className="flex items-start gap-3 rounded-md border border-neutral-200 bg-white/80 p-3"><span className="mt-0.5 text-primary-700">{icon}</span><div><div className="text-sm font-semibold text-neutral-950">{title}</div><div className="text-xs text-neutral-500">{detail}</div></div></div>;
}

function StateRow({ label, state }: { label: string; state: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white/80 px-3 py-2"><span className="text-sm font-medium text-neutral-900">{label}</span><span className="rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">{state}</span></div>;
}

function DataTable({ rows, columns }: { rows: Array<Record<string, unknown>>; columns: string[] }) {
  return <div className="overflow-hidden rounded-md border border-neutral-200"><table className="w-full border-collapse text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-semibold">{label(column)}</th>)}</tr></thead><tbody className="divide-y divide-neutral-200">{rows.map((row, index) => <tr key={index} className="bg-white/80">{columns.map((column) => <td key={column} className="px-3 py-2 text-neutral-700">{String(row[column] ?? '-')}</td>)}</tr>)}</tbody></table></div>;
}

function label(value: string) { return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()); }