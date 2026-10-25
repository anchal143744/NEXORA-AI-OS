'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BadgeCheck, CheckCircle2, Database, FileCheck2, Gavel, Globe2, Landmark, LockKeyhole, MapPinned, RefreshCw, Scale, Search, ShieldCheck, Sparkles, TriangleAlert, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const regionRows = [
  { region: 'EU Central', country: 'DE', tier: 'Sovereign', status: 'Active' },
  { region: 'India South', country: 'IN', tier: 'Restricted', status: 'Active' },
  { region: 'US East', country: 'US', tier: 'Standard', status: 'Watch' },
];

const frameworkRows = [
  { framework: 'GDPR', jurisdiction: 'EU', requirements: '42', status: 'Active' },
  { framework: 'DPDP', jurisdiction: 'IN', requirements: '18', status: 'Active' },
  { framework: 'CCPA', jurisdiction: 'US-CA', requirements: '21', status: 'Active' },
];

const sovereigntyRows = [
  { rule: 'EU personal data processing', country: 'DE', mode: 'Enforce', status: 'Active' },
  { rule: 'India financial data storage', country: 'IN', mode: 'Monitor', status: 'Active' },
  { rule: 'US healthcare data routing', country: 'US', mode: 'Enforce', status: 'Review' },
];

const alertRows = [
  { alert: 'Cross-border transfer approval', severity: 'High', region: 'EU', status: 'Open' },
  { alert: 'Residency assignment drift', severity: 'Medium', region: 'IN', status: 'Open' },
  { alert: 'Audit evidence stale', severity: 'Medium', region: 'US', status: 'Review' },
];

const apiSurface = ['/v1/data-residency', '/v1/data-sovereignty', '/v1/regulatory', '/v1/compliance', '/v1/jurisdictions', '/v1/data-regions', '/v1/regulatory-intelligence', '/v1/compliance-alerts'];

const centerItems = [
  { label: 'Data Residency Center', detail: 'Maps data regions, storage locations, residency policies and assignments.', icon: <MapPinned className="size-4" /> },
  { label: 'Data Sovereignty Engine', detail: 'Evaluates country rules, transfer restrictions, safeguards and enforcement modes.', icon: <LockKeyhole className="size-4" /> },
  { label: 'Regulatory Operations', detail: 'Tracks frameworks, requirements, audits, risks and jurisdictional alerts.', icon: <Gavel className="size-4" /> },
  { label: 'Compliance Monitoring', detail: 'Connects regulatory evidence, audits, remediation and risk posture.', icon: <FileCheck2 className="size-4" /> },
];

export function DataResidencyWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Data Residency, Sovereignty & Regulatory Operations</h1>
            <Badge>Phase 36</Badge>
            <Badge className="bg-white/80">Regulatory Command Plane</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Data residency, sovereign processing, jurisdiction management, regional data governance, compliance monitoring and regulatory intelligence for global business operations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search regulatory operations"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh residency center"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Run compliance review"><Sparkles className="size-4" />Review</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Globe2 className="size-5" />} label="Data Regions" value="18" detail="active jurisdictions" tone="primary" />
        <SignalCard icon={<ShieldCheck className="size-5" />} label="Compliant Locations" value="96%" detail="verified storage state" tone="green" />
        <SignalCard icon={<Scale className="size-5" />} label="Frameworks" value="27" detail="regulatory coverage" tone="amber" />
        <SignalCard icon={<TriangleAlert className="size-5" />} label="Regulatory Alerts" value="8" detail="open signals" tone="red" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<MapPinned className="size-4" />} title="Data Residency Dashboard"><DataTable rows={regionRows} columns={['region', 'country', 'tier', 'status']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Landmark className="size-4" />} title="Regulatory Operations Workspace"><DataTable rows={frameworkRows} columns={['framework', 'jurisdiction', 'requirements', 'status']} /></DataPanel>
            <DataPanel icon={<LockKeyhole className="size-4" />} title="Sovereignty Dashboard"><DataTable rows={sovereigntyRows} columns={['rule', 'country', 'mode', 'status']} /></DataPanel>
          </div>
          <DataPanel icon={<AlertTriangle className="size-4" />} title="Compliance Monitoring Center"><DataTable rows={alertRows} columns={['alert', 'severity', 'region', 'status']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Database className="size-4" />} title="Jurisdiction Manager">
            <div className="grid gap-2">{centerItems.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <DataPanel icon={<Workflow className="size-4" />} title="Regulatory Controls">
            <ActionRow icon={<Globe2 className="size-4" />} label="Regional data governance" detail="Policies bind data classes to allowed and restricted regions." />
            <ActionRow icon={<LockKeyhole className="size-4" />} label="Sovereign processing" detail="Country rules define processing, storage, routing and exception controls." />
            <ActionRow icon={<FileCheck2 className="size-4" />} label="Compliance audits" detail="Audits connect frameworks, requirements, data regions, evidence and remediation." />
            <ActionRow icon={<Gavel className="size-4" />} label="Regulatory intelligence" detail="Risk and alert signals prioritize actions for global regulatory operations." />
          </DataPanel>
          <DataPanel icon={<BadgeCheck className="size-4" />} title="API Surface">
            <div className="grid gap-2">{apiSurface.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped regulatory operations API" />)}</div>
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