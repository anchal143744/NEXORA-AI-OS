'use client';

import { motion } from 'framer-motion';
import { Activity, ArrowRight, Bot, Building2, CheckCircle2, ClipboardCheck, Database, FileSpreadsheet, Flag, Gauge, GitPullRequestArrow, Layers3, LockKeyhole, RefreshCw, Search, ServerCog, ShieldAlert, Sparkles, UploadCloud, UsersRound, WalletCards } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const organizations = [
  { name: 'Nexora Global Holdings', region: 'US / EU', workspaces: 18, status: 'Active' },
  { name: 'Retail Pilot Group', region: 'APAC', workspaces: 6, status: 'Onboarding' },
  { name: 'Healthcare Operations Co', region: 'EU', workspaces: 9, status: 'Compliance review' },
];

const workspaces = [
  { name: 'Executive OS', industry: 'SaaS', modules: 'CRM, Finance, AI', health: 'Healthy' },
  { name: 'Retail Ops', industry: 'Retail', modules: 'Inventory, Finance', health: 'Watch' },
  { name: 'Clinical Admin', industry: 'Healthcare', modules: 'HR, Documents', health: 'Healthy' },
];

const users = [
  { name: 'Ari Morgan', role: 'Organization Owner', status: 'Active', lastSeen: '4m' },
  { name: 'Sana Rao', role: 'Admin', status: 'Active', lastSeen: '18m' },
  { name: 'Jon Bell', role: 'Manager', status: 'Invite pending', lastSeen: '-' },
];

const subscriptions = [
  { plan: 'Global Enterprise', usage: '82%', renewal: '2026-08-01', state: 'Current' },
  { plan: 'Business', usage: '61%', renewal: '2026-07-14', state: 'Current' },
  { plan: 'Growth', usage: '94%', renewal: '2026-06-28', state: 'Review' },
];

const aiUsage = [
  { label: 'Copilot requests', value: '48.2k', trend: '+12%' },
  { label: 'Agent executions', value: '7.4k', trend: '+9%' },
  { label: 'Insight generations', value: '3.1k', trend: '+18%' },
  { label: 'Estimated spend', value: '$1,284', trend: '-3%' },
];

const imports = [
  { source: 'CSV customers', target: 'CRM Customers', rows: '12,840', status: 'Validated' },
  { source: 'Excel invoices', target: 'Finance Invoices', rows: '2,190', status: 'Processing' },
  { source: 'HubSpot contacts', target: 'CRM Leads', rows: '8,430', status: 'Ready' },
];

const onboardingSteps = [
  { label: 'Business profile', state: 'Complete' },
  { label: 'Industry selection', state: 'Complete' },
  { label: 'Workspace generation', state: 'Running' },
  { label: 'Module recommendations', state: 'Ready' },
  { label: 'Migration plan', state: 'Ready' },
];

export function AdminConsoleWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Admin Console</h1>
            <Badge>Phase 20</Badge>
            <Badge className="bg-white/80">Global Operations</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Operate onboarding, imports, migrations, organizations, workspaces, users, subscriptions and AI usage from one tenant-aware admin layer.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search admin records"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh console"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Start onboarding"><Sparkles className="size-4" />Onboard Business</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Building2 className="size-5" />} label="Organizations" value="3" detail="33 workspaces" tone="primary" />
        <SignalCard icon={<UsersRound className="size-5" />} label="Users" value="128" detail="7 pending invites" tone="green" />
        <SignalCard icon={<WalletCards className="size-5" />} label="Subscriptions" value="94%" detail="highest tenant usage" tone="amber" />
        <SignalCard icon={<Bot className="size-5" />} label="AI Usage" value="58.7k" detail="monthly requests" tone="violet" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="flex min-w-0 flex-col gap-4">
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Building2 className="size-4" />} title="Organization Management"><AdminTable rows={organizations} columns={['name', 'region', 'workspaces', 'status']} /></DataPanel>
            <DataPanel icon={<Layers3 className="size-4" />} title="Workspace Management"><AdminTable rows={workspaces} columns={['name', 'industry', 'modules', 'health']} /></DataPanel>
            <DataPanel icon={<UsersRound className="size-4" />} title="User Management"><AdminTable rows={users} columns={['name', 'role', 'status', 'lastSeen']} /></DataPanel>
            <DataPanel icon={<WalletCards className="size-4" />} title="Subscription Monitoring"><AdminTable rows={subscriptions} columns={['plan', 'usage', 'renewal', 'state']} /></DataPanel>
          </div>

          <DataPanel icon={<FileSpreadsheet className="size-4" />} title="Data Import & Migration Operations">
            <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
              <AdminTable rows={imports} columns={['source', 'target', 'rows', 'status']} />
              <div className="flex flex-col gap-2 rounded-md border border-neutral-200 bg-neutral-50 p-3">
                <ActionRow icon={<UploadCloud className="size-4" />} title="CSV import" detail="Validation, mapping, bulk records" />
                <ActionRow icon={<FileSpreadsheet className="size-4" />} title="Excel import" detail="Workbook sheet ingestion" />
                <ActionRow icon={<GitPullRequestArrow className="size-4" />} title="Migration adapters" detail="Salesforce, HubSpot, Zoho, Monday, Notion" />
              </div>
            </div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Gauge className="size-4" />} title="AI Usage Monitoring">
            <div className="grid gap-2">
              {aiUsage.map((item) => <MetricRow key={item.label} {...item} />)}
            </div>
          </DataPanel>

          <DataPanel icon={<ClipboardCheck className="size-4" />} title="Customer Onboarding">
            <div className="flex flex-col gap-2">
              {onboardingSteps.map((step, index) => <StepRow key={step.label} index={index + 1} label={step.label} state={step.state} />)}
            </div>
            <div className="mt-3 rounded-md border border-primary-300/70 bg-primary-100/45 p-3 text-sm text-primary-950">
              <div className="flex items-center gap-2 font-semibold"><Bot className="size-4" />AI onboarding assistant</div>
              <p className="mt-2 text-xs text-neutral-600">Recommends modules, migration mappings, workspace structure and setup risks from the business profile.</p>
            </div>
          </DataPanel>

          <DataPanel icon={<ServerCog className="size-4" />} title="Production Readiness">
            <div className="grid gap-2">
              <ActionRow icon={<Database className="size-4" />} title="Import queue" detail="3 active jobs" />
              <ActionRow icon={<Flag className="size-4" />} title="Feature flags" detail="12 tenant-scoped flags" />
              <ActionRow icon={<ShieldAlert className="size-4" />} title="Incidents" detail="No critical incidents" />
              <ActionRow icon={<LockKeyhole className="size-4" />} title="Security controls" detail="Emergency controls inactive" />
            </div>
          </DataPanel>
        </aside>
      </div>
    </div>
  );
}

function SignalCard({ icon, label, value, detail, tone }: { icon: React.ReactNode; label: string; value: string; detail: string; tone: 'primary' | 'green' | 'amber' | 'violet' }) {
  const tones = { primary: 'bg-primary-100/70 text-primary-950 border-primary-300/70', green: 'bg-emerald-50 text-emerald-800 border-emerald-200', amber: 'bg-amber-50 text-amber-800 border-amber-200', violet: 'bg-violet-50 text-violet-800 border-violet-200' };
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('rounded-lg border bg-white/78 p-4 shadow-subtle backdrop-blur-shell', tones[tone])}><div className="flex items-center justify-between gap-3"><span>{icon}</span><Activity className="size-4 opacity-60" /></div><div className="mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-sm font-medium">{label}</div><div className="mt-1 text-xs opacity-70">{detail}</div></motion.div>;
}

function DataPanel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-neutral-200 bg-white/78 p-4 shadow-subtle backdrop-blur-shell"><div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-primary-950">{icon}<span>{title}</span></div><Button variant="icon" size="icon" title={`Open ${title}`}><ArrowRight className="size-4" /></Button></div>{children}</section>;
}

function AdminTable({ rows, columns }: { rows: Array<Record<string, unknown>>; columns: string[] }) {
  return <div className="overflow-hidden rounded-md border border-neutral-200"><table className="w-full border-collapse text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-semibold">{label(column)}</th>)}</tr></thead><tbody className="divide-y divide-neutral-200">{rows.map((row, index) => <tr key={index} className="bg-white/80">{columns.map((column) => <td key={column} className="px-3 py-2 text-neutral-700">{String(row[column] ?? '-')}</td>)}</tr>)}</tbody></table></div>;
}

function MetricRow({ label, value, trend }: { label: string; value: string; trend: string }) {
  return <div className="flex items-center justify-between rounded-md border border-neutral-200 bg-white/80 px-3 py-2"><div><div className="text-sm font-medium text-neutral-900">{label}</div><div className="text-xs text-neutral-500">Current period</div></div><div className="text-right"><div className="font-semibold text-primary-950">{value}</div><div className={cn('text-xs', trend.startsWith('-') ? 'text-emerald-600' : 'text-primary-700')}>{trend}</div></div></div>;
}

function StepRow({ index, label, state }: { index: number; label: string; state: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white/80 px-3 py-2"><div className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-md bg-primary-100 text-xs font-semibold text-primary-950">{index}</span><span className="text-sm font-medium text-neutral-900">{label}</span></div><span className={cn('rounded-sm px-2 py-0.5 text-xs font-semibold', state === 'Complete' ? 'bg-emerald-50 text-emerald-700' : state === 'Running' ? 'bg-primary-100 text-primary-950' : 'bg-neutral-100 text-neutral-600')}>{state}</span></div>;
}

function ActionRow({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return <div className="flex items-start gap-3 rounded-md border border-neutral-200 bg-white/80 p-3"><span className="mt-0.5 text-primary-700">{icon}</span><div><div className="text-sm font-semibold text-neutral-950">{title}</div><div className="text-xs text-neutral-500">{detail}</div></div></div>;
}

function label(value: string) { return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()); }
