'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BadgeCheck, Brain, CheckCircle2, ClipboardList, FileSearch, Fingerprint, Gauge, GitBranch, KeyRound, LineChart, LockKeyhole, RefreshCw, Scale, Search, ShieldAlert, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const modelRows = [
  { model: 'Executive Copilot', provider: 'OpenAI', stage: 'Production', risk: 'Medium' },
  { model: 'Revenue Forecaster', provider: 'Azure OpenAI', stage: 'Staging', risk: 'High' },
  { model: 'Support Voice Agent', provider: 'Local', stage: 'Production', risk: 'Medium' },
];

const decisionRows = [
  { decision: 'Workflow approval', confidence: '91%', risk: 'Low', review: 'Auto' },
  { decision: 'Revenue alert', confidence: '76%', risk: 'Medium', review: 'Manager' },
  { decision: 'Customer escalation', confidence: '68%', risk: 'High', review: 'Human' },
];

const auditRows = [
  { event: 'Model deployed', actor: 'AI Ops', severity: 'Info', time: '12m ago' },
  { event: 'Policy exception', actor: 'Governance', severity: 'Warning', time: '39m ago' },
  { event: 'Decision reviewed', actor: 'Manager', severity: 'Info', time: '1h ago' },
];

const riskRows = [
  { risk: 'Drift detected', source: 'Revenue Forecaster', severity: 'High', status: 'Open' },
  { risk: 'Low explainability', source: 'Voice Agent', severity: 'Medium', status: 'Mitigating' },
  { risk: 'Compliance evidence gap', source: 'Executive Copilot', severity: 'Medium', status: 'Open' },
];

const apiSurface = ['/v1/ai-governance', '/v1/model-registry', '/v1/modelops', '/v1/decision-intelligence', '/v1/ai-audit', '/v1/ai-compliance', '/v1/ai-explainability', '/v1/model-performance'];

const centerItems = [
  { label: 'AI Governance Center', detail: 'Unifies policy, model lifecycle, risk, compliance and decision auditability.', icon: <ShieldCheck className="size-4" /> },
  { label: 'Model Registry Dashboard', detail: 'Tracks providers, model versions, deployments, approvals and release stages.', icon: <Brain className="size-4" /> },
  { label: 'Decision Intelligence', detail: 'Stores AI decisions, reasons, risks, confidence and human review state.', icon: <Fingerprint className="size-4" /> },
  { label: 'AI Explainability Layer', detail: 'Captures factors, rationale and counterfactuals for governed AI outcomes.', icon: <FileSearch className="size-4" /> },
];

export function AiGovernanceWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise AI Governance, ModelOps & Decision Intelligence</h1>
            <Badge>Phase 32</Badge>
            <Badge className="bg-white/80">Governed AI Control Plane</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Model registry, lifecycle management, decision intelligence, explainability, risk monitoring, audit trails and compliance records for enterprise AI operations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search AI governance"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh governance center"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Open governance review"><Sparkles className="size-4" />Review AI</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Brain className="size-5" />} label="Registered Models" value="38" detail="providers and versions" tone="primary" />
        <SignalCard icon={<GitBranch className="size-5" />} label="Deployments" value="17" detail="runtime environments" tone="green" />
        <SignalCard icon={<AlertTriangle className="size-5" />} label="Open AI Risks" value="9" detail="requires mitigation" tone="amber" />
        <SignalCard icon={<Scale className="size-5" />} label="Compliance Records" value="124" detail="audit evidence" tone="violet" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_410px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Brain className="size-4" />} title="Model Registry Dashboard"><DataTable rows={modelRows} columns={['model', 'provider', 'stage', 'risk']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Fingerprint className="size-4" />} title="Decision Intelligence Dashboard"><DataTable rows={decisionRows} columns={['decision', 'confidence', 'risk', 'review']} /></DataPanel>
            <DataPanel icon={<ClipboardList className="size-4" />} title="AI Audit Explorer"><DataTable rows={auditRows} columns={['event', 'actor', 'severity', 'time']} /></DataPanel>
          </div>
          <DataPanel icon={<ShieldAlert className="size-4" />} title="AI Risk Monitoring Center"><DataTable rows={riskRows} columns={['risk', 'source', 'severity', 'status']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<ShieldCheck className="size-4" />} title="AI Governance Center">
            <div className="grid gap-2">{centerItems.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <DataPanel icon={<LockKeyhole className="size-4" />} title="Governance Controls">
            <ActionRow icon={<KeyRound className="size-4" />} label="Approval enforcement" detail="Model release and deployment workflows carry risk-tiered approval steps." />
            <ActionRow icon={<Gauge className="size-4" />} label="Performance monitoring" detail="Quality, drift, latency and risk metrics feed governance alerts." />
            <ActionRow icon={<LineChart className="size-4" />} label="Model lifecycle" detail="Versioning, staging, deployment, rollback and retirement stay auditable." />
            <ActionRow icon={<Workflow className="size-4" />} label="Decision traceability" detail="Every AI decision can connect to reasons, risks, explanations and audit logs." />
          </DataPanel>
          <DataPanel icon={<BadgeCheck className="size-4" />} title="API Surface">
            <div className="grid gap-2">{apiSurface.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped AI governance API" />)}</div>
          </DataPanel>
        </aside>
      </div>
    </div>
  );
}

function SignalCard({ icon, label, value, detail, tone }: { icon: ReactNode; label: string; value: string; detail: string; tone: 'primary' | 'green' | 'amber' | 'violet' }) {
  const tones = { primary: 'border-primary-200 text-primary-950', green: 'border-emerald-200 text-emerald-950', amber: 'border-amber-200 text-amber-950', violet: 'border-violet-200 text-violet-950' };
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('rounded-lg border bg-white/78 p-4 shadow-subtle backdrop-blur-shell', tones[tone])}><div className="flex items-center justify-between gap-3"><span>{icon}</span><span className="flex size-4 items-center justify-center rounded-full bg-current/10"><span className="size-1.5 rounded-full bg-current" /></span></div><div className="mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-sm font-medium">{label}</div><div className="mt-1 text-xs opacity-70">{detail}</div></motion.div>;
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