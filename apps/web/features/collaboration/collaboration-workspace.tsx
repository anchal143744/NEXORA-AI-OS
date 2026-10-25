'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BadgeCheck, BookOpenCheck, Brain, CheckCircle2, Clock3, FileText, GitBranch, Layers3, MessageSquare, RefreshCw, Search, ShieldCheck, Sparkles, Users, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const spaces = [
  { space: 'Revenue Ops', type: 'Department', articles: '128', decisions: '12', health: 'Active' },
  { space: 'Manufacturing Launch', type: 'Project', articles: '46', decisions: '7', health: 'Focused' },
  { space: 'Company Knowledge', type: 'Global', articles: '312', decisions: '28', health: 'Governed' },
];

const discussions = [
  { thread: 'Pipeline risk review', replies: '18', mentions: '6', status: 'Open' },
  { thread: 'Q3 hiring plan', replies: '11', mentions: '4', status: 'AI summarized' },
  { thread: 'Invoice approval policy', replies: '23', mentions: '9', status: 'Decision linked' },
];

const decisionRooms = [
  { room: 'Pricing change', votes: '8', approvals: '2/3', outcome: 'Pending' },
  { room: 'New region launch', votes: '12', approvals: '4/4', outcome: 'Approved' },
  { room: 'Vendor consolidation', votes: '6', approvals: '1/2', outcome: 'Review' },
];

const aiSignals = [
  { label: 'Meeting summaries', detail: 'Discussion and decision context compressed into source-linked summaries', icon: <Brain className="size-4" /> },
  { label: 'Action extraction', detail: 'Owners, due dates and follow-ups become tracked action items', icon: <CheckCircle2 className="size-4" /> },
  { label: 'Decision recommendations', detail: 'AI recommendations are stored with risks and source references', icon: <Sparkles className="size-4" /> },
  { label: 'Search integration', detail: 'Articles, messages and decision records are indexed for secure retrieval', icon: <Search className="size-4" /> },
];

const apiSurface = ['/v1/knowledge-spaces', '/v1/discussions', '/v1/decision-rooms', '/v1/collaboration', '/v1/knowledge'];

export function CollaborationWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Collaboration, Knowledge Spaces & Decision Rooms</h1>
            <Badge>Phase 25</Badge>
            <Badge className="bg-white/80">AI Collaboration</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Company knowledge spaces, threaded discussions, decision rooms, AI summaries, action extraction and search-indexed collaboration workflows in one tenant-aware operating layer.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search collaboration knowledge"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh activity"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Generate summary"><Sparkles className="size-4" />Summarize</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<BookOpenCheck className="size-5" />} label="Knowledge Spaces" value="4" detail="team, department, project, global" tone="primary" />
        <SignalCard icon={<MessageSquare className="size-5" />} label="Discussions" value="156" detail="threads, mentions, reactions" tone="green" />
        <SignalCard icon={<BadgeCheck className="size-5" />} label="Decision Rooms" value="31" detail="votes and approvals" tone="amber" />
        <SignalCard icon={<Brain className="size-5" />} label="AI Summaries" value="89" detail="actions and recommendations" tone="violet" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Layers3 className="size-4" />} title="Knowledge Spaces"><DataTable rows={spaces} columns={['space', 'type', 'articles', 'decisions', 'health']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<MessageSquare className="size-4" />} title="Active Discussions"><DataTable rows={discussions} columns={['thread', 'replies', 'mentions', 'status']} /></DataPanel>
            <DataPanel icon={<BadgeCheck className="size-4" />} title="Decision Rooms"><DataTable rows={decisionRooms} columns={['room', 'votes', 'approvals', 'outcome']} /></DataPanel>
          </div>
          <DataPanel icon={<GitBranch className="size-4" />} title="Collaboration Workflow Map">
            <div className="grid gap-3 md:grid-cols-2">
              {['Article to discussion', 'Discussion to decision', 'Decision to approval', 'Summary to action item', 'Decision to search index', 'Action item to activity feed'].map((link) => <WorkflowCard key={link} label={link} />)}
            </div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Brain className="size-4" />} title="AI Collaboration">
            <div className="grid gap-2">{aiSignals.map((item) => <ActionRow key={item.label} {...item} />)}</div>
          </DataPanel>

          <DataPanel icon={<Users className="size-4" />} title="Decision Governance">
            <div className="grid gap-2">
              <StateRow label="Participants" state="Tracked" />
              <StateRow label="Voting" state="Weighted" />
              <StateRow label="Approvals" state="Workflow-ready" />
              <StateRow label="History" state="Immutable record" />
            </div>
          </DataPanel>

          <DataPanel icon={<ShieldCheck className="size-4" />} title="Search Integration">
            <div className="grid gap-2">
              <ActionRow icon={<FileText className="size-4" />} label="Knowledge articles" detail="Published articles indexed into enterprise search" />
              <ActionRow icon={<MessageSquare className="size-4" />} label="Discussions" detail="Messages and threads are searchable with workspace scope" />
              <ActionRow icon={<BadgeCheck className="size-4" />} label="Decision records" detail="Outcomes become searchable evidence for future decisions" />
            </div>
          </DataPanel>

          <DataPanel icon={<Workflow className="size-4" />} title="API Surface">
            <div className="grid gap-2">{apiSurface.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped collaboration API" />)}</div>
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

function StateRow({ label, state }: { label: string; state: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white/80 px-3 py-2"><span className="text-sm font-medium text-neutral-900">{label}</span><span className="rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">{state}</span></div>;
}

function WorkflowCard({ label }: { label: string }) {
  return <div className="rounded-md border border-neutral-200 bg-white/80 p-3"><div className="flex items-center gap-2 text-sm font-semibold text-neutral-950"><Clock3 className="size-4 text-primary-700" />{label}</div><div className="mt-2 text-xs text-neutral-500">Collaboration events, activities and search indexes preserve the operating context.</div></div>;
}

function DataTable({ rows, columns }: { rows: Array<Record<string, unknown>>; columns: string[] }) {
  return <div className="overflow-hidden rounded-md border border-neutral-200"><table className="w-full border-collapse text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-semibold">{label(column)}</th>)}</tr></thead><tbody className="divide-y divide-neutral-200">{rows.map((row, index) => <tr key={index} className="bg-white/80">{columns.map((column) => <td key={column} className="px-3 py-2 text-neutral-700">{String(row[column] ?? '-')}</td>)}</tr>)}</tbody></table></div>;
}

function label(value: string) { return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()); }