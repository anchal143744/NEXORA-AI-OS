'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BadgeCheck, Bot, BookOpenCheck, Brain, CheckCircle2, Database, FileText, Filter, GitBranch, KeyRound, Layers3, LockKeyhole, RefreshCw, Search, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const indexCoverage = [
  { source: 'CRM', records: '42k', status: 'Indexed', freshness: '4m' },
  { source: 'Finance', records: '18k', status: 'Indexed', freshness: '7m' },
  { source: 'HR', records: '9k', status: 'Policy gated', freshness: '12m' },
  { source: 'Documents', records: '31k', status: 'Chunked', freshness: '18m' },
];

const retrievalSessions = [
  { session: 'Copilot context', query: 'pipeline risk', sources: '17', status: 'AI ready' },
  { session: 'Agent retrieval', query: 'cash flow risk', sources: '12', status: 'Scoped' },
  { session: 'Graph lookup', query: 'invoice drivers', sources: '23', status: 'Linked' },
];

const securePolicies = [
  { layer: 'Tenant isolation', state: 'Required' },
  { layer: 'Workspace isolation', state: 'Required' },
  { layer: 'RBAC filters', state: 'Enabled' },
  { layer: 'Sensitive masking', state: 'Enabled' },
];

const semanticPipelines = [
  { label: 'Business entities', detail: 'Organizations, workspaces, customers, employees and suppliers', icon: <Database className="size-4" /> },
  { label: 'Operating modules', detail: 'CRM, finance, HR, workflows, documents and AI memory', icon: <Layers3 className="size-4" /> },
  { label: 'Knowledge graph', detail: 'Entity relationships, KPI dependencies and revenue drivers', icon: <GitBranch className="size-4" /> },
  { label: 'AI context', detail: 'Copilot and agent retrieval packs with auditable citations', icon: <Brain className="size-4" /> },
];

const apiSurface = ['/v1/search', '/v1/search/semantic', '/v1/search/context', '/v1/search/retrieval', '/v1/search/indexes'];

export function KnowledgeSearchWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Knowledge Search & Secure Retrieval</h1>
            <Badge>Phase 24</Badge>
            <Badge className="bg-white/80">Semantic Indexing</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Unified tenant-aware search across business records, documents, workflow state, knowledge graph context and AI memory with secure retrieval for Copilot and autonomous agents.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Run global search"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh indexes"><RefreshCw className="size-4" />Reindex</Button>
          <Button title="Assemble AI context"><Sparkles className="size-4" />AI Context</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Search className="size-5" />} label="Search Indexes" value="8" detail="global, module and semantic" tone="primary" />
        <SignalCard icon={<FileText className="size-5" />} label="Indexed Records" value="100k+" detail="entities, memory and documents" tone="green" />
        <SignalCard icon={<ShieldCheck className="size-5" />} label="Secure Filters" value="4" detail="tenant, workspace, RBAC, masking" tone="amber" />
        <SignalCard icon={<Bot className="size-5" />} label="AI Retrieval" value="3" detail="Copilot, agents and context APIs" tone="violet" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<BookOpenCheck className="size-4" />} title="Semantic Index Coverage"><DataTable rows={indexCoverage} columns={['source', 'records', 'status', 'freshness']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Brain className="size-4" />} title="Retrieval Sessions"><DataTable rows={retrievalSessions} columns={['session', 'query', 'sources', 'status']} /></DataPanel>
            <DataPanel icon={<LockKeyhole className="size-4" />} title="Secure Access Layer"><div className="grid gap-2">{securePolicies.map((policy) => <StateRow key={policy.layer} {...policy} />)}</div></DataPanel>
          </div>
          <DataPanel icon={<Workflow className="size-4" />} title="Cross-Module Discovery">
            <div className="grid gap-3 md:grid-cols-2">
              {['Customers to invoices', 'Revenue to KPIs', 'Employees to projects', 'Tasks to workflows', 'Documents to decisions', 'AI memory to recommendations'].map((link) => <DiscoveryCard key={link} label={link} />)}
            </div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Layers3 className="size-4" />} title="Indexing Pipelines">
            <div className="grid gap-2">{semanticPipelines.map((item) => <ActionRow key={item.label} {...item} />)}</div>
          </DataPanel>

          <DataPanel icon={<KeyRound className="size-4" />} title="Secure Retrieval Controls">
            <div className="grid gap-2">
              <ActionRow icon={<Filter className="size-4" />} label="RBAC-aware ranking" detail="Result sets honor roles, permissions and policy thresholds" />
              <ActionRow icon={<LockKeyhole className="size-4" />} label="Sensitive masking" detail="Confidential summaries are masked unless policy permits access" />
              <ActionRow icon={<BadgeCheck className="size-4" />} label="Audit logging" detail="Queries, retrieval sessions and filtered counts are persisted" />
            </div>
          </DataPanel>

          <DataPanel icon={<Bot className="size-4" />} title="AI Search Integration">
            <div className="grid gap-2">
              <ActionRow icon={<Sparkles className="size-4" />} label="Copilot retrieval" detail="AI-ready context packages with citations and source metadata" />
              <ActionRow icon={<Brain className="size-4" />} label="Agent retrieval" detail="Autonomous agents read scoped context before execution" />
              <ActionRow icon={<GitBranch className="size-4" />} label="Graph retrieval" detail="KPI, revenue and workflow dependencies flow into context" />
            </div>
          </DataPanel>

          <DataPanel icon={<Database className="size-4" />} title="API Surface">
            <div className="grid gap-2">{apiSurface.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped enterprise search API" />)}</div>
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

function ActionRow({ icon, label, detail }: { icon: ReactNode; label: string; detail: string }) {
  return <div className="flex items-start gap-3 rounded-md border border-neutral-200 bg-white/80 p-3"><span className="mt-0.5 text-primary-700">{icon}</span><div><div className="text-sm font-semibold text-neutral-950">{label}</div><div className="text-xs text-neutral-500">{detail}</div></div></div>;
}

function StateRow({ layer, state }: { layer: string; state: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white/80 px-3 py-2"><span className="text-sm font-medium text-neutral-900">{layer}</span><span className="rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">{state}</span></div>;
}

function DiscoveryCard({ label }: { label: string }) {
  return <div className="rounded-md border border-neutral-200 bg-white/80 p-3"><div className="flex items-center gap-2 text-sm font-semibold text-neutral-950"><GitBranch className="size-4 text-primary-700" />{label}</div><div className="mt-2 text-xs text-neutral-500">Relationship-aware retrieval path available for search ranking and AI context assembly.</div></div>;
}

function DataTable({ rows, columns }: { rows: Array<Record<string, unknown>>; columns: string[] }) {
  return <div className="overflow-hidden rounded-md border border-neutral-200"><table className="w-full border-collapse text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-semibold">{label(column)}</th>)}</tr></thead><tbody className="divide-y divide-neutral-200">{rows.map((row, index) => <tr key={index} className="bg-white/80">{columns.map((column) => <td key={column} className="px-3 py-2 text-neutral-700">{String(row[column] ?? '-')}</td>)}</tr>)}</tbody></table></div>;
}

function label(value: string) { return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()); }