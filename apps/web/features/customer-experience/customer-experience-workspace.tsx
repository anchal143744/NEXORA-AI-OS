'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BadgeCheck, BarChart3, BellRing, Brain, CheckCircle2, ClipboardCheck, Gauge, HeartPulse, LineChart, MessageSquareHeart, RefreshCw, Rocket, Search, ShieldAlert, Sparkles, Target, TicketCheck, TrendingUp, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const healthRows = [
  { customer: 'Aster Retail', health: '91', band: 'Healthy', risk: 'Low', next: 'Expansion review' },
  { customer: 'Helio SaaS', health: '68', band: 'Watch', risk: 'Medium', next: 'Adoption follow-up' },
  { customer: 'Northline Ops', health: '42', band: 'At risk', risk: 'High', next: 'Executive save plan' },
];

const revenueRows = [
  { account: 'Aster Retail', type: 'Upsell', value: '$84,000', probability: '72%', status: 'Open' },
  { account: 'Helio SaaS', type: 'Renewal', value: '$126,000', probability: '81%', status: 'Ready' },
  { account: 'Northline Ops', type: 'Risk', value: '$55,000', probability: '64%', status: 'Mitigate' },
];

const tickets = [
  { ticket: 'Billing workflow issue', priority: 'High', sla: '1h 20m', status: 'Escalated' },
  { ticket: 'Onboarding checklist', priority: 'Normal', sla: '5h 10m', status: 'Open' },
  { ticket: 'Renewal contract review', priority: 'High', sla: '2h 45m', status: 'In progress' },
];

const journey = [
  { stage: 'Onboard', status: 'Complete', signal: 'Activation achieved' },
  { stage: 'Adopt', status: 'Active', signal: 'Usage expanding' },
  { stage: 'Renew', status: 'Upcoming', signal: 'Value recap due' },
];

const aiInsights = [
  { label: 'Churn prediction', detail: 'Combines health, engagement, tickets, feedback and revenue risk.', icon: <ShieldAlert className="size-4" /> },
  { label: 'Renewal recommendation', detail: 'Ranks renewal actions by value, risk and customer stage.', icon: <Target className="size-4" /> },
  { label: 'Revenue expansion', detail: 'Surfaces upsell, cross-sell and expansion opportunities.', icon: <TrendingUp className="size-4" /> },
  { label: 'Service optimization', detail: 'Connects tickets, SLA breaches and escalations to workflows.', icon: <TicketCheck className="size-4" /> },
];

const apiSurface = ['/v1/customer-experience', '/v1/customer-health', '/v1/customer-success', '/v1/churn-predictions', '/v1/renewals', '/v1/revenue-opportunities', '/v1/service-center', '/v1/service-tickets', '/v1/sla', '/v1/customer-feedback'];

export function CustomerExperienceWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Customer Experience, Service Automation & Revenue Engagement</h1>
            <Badge>Phase 28</Badge>
            <Badge className="bg-white/80">Customer Growth Platform</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Customer health, journeys, success playbooks, churn prevention, service automation, SLA monitoring and revenue expansion intelligence connected into one adaptive operating layer.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search customers"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh customer signals"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Generate AI recommendations"><Sparkles className="size-4" />Copilot</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<HeartPulse className="size-5" />} label="Customer Health" value="84" detail="weighted account score" tone="primary" />
        <SignalCard icon={<Rocket className="size-5" />} label="Success Plans" value="37" detail="playbooks and follow-ups" tone="green" />
        <SignalCard icon={<TicketCheck className="size-5" />} label="Service Tickets" value="112" detail="SLA monitored" tone="amber" />
        <SignalCard icon={<TrendingUp className="size-5" />} label="Revenue Pipeline" value="$2.8M" detail="renewal and expansion" tone="violet" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Gauge className="size-4" />} title="Customer Health Center"><DataTable rows={healthRows} columns={['customer', 'health', 'band', 'risk', 'next']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<TrendingUp className="size-4" />} title="Revenue Opportunity Center"><DataTable rows={revenueRows} columns={['account', 'type', 'value', 'probability', 'status']} /></DataPanel>
            <DataPanel icon={<ClipboardCheck className="size-4" />} title="Service Center"><DataTable rows={tickets} columns={['ticket', 'priority', 'sla', 'status']} /></DataPanel>
          </div>
          <DataPanel icon={<LineChart className="size-4" />} title="Customer Journey Timeline"><DataTable rows={journey} columns={['stage', 'status', 'signal']} /></DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Brain className="size-4" />} title="AI Customer Success Copilot">
            <div className="grid gap-2">{aiInsights.map((item) => <ActionRow key={item.label} {...item} />)}</div>
          </DataPanel>

          <DataPanel icon={<BarChart3 className="size-4" />} title="SLA Monitoring Dashboard">
            <div className="grid gap-2">
              <StateRow label="First response SLA" state="96%" />
              <StateRow label="Resolution SLA" state="91%" />
              <StateRow label="Escalation automation" state="Enabled" />
              <StateRow label="Service workflows" state="Ready" />
            </div>
          </DataPanel>

          <DataPanel icon={<MessageSquareHeart className="size-4" />} title="Feedback Engine">
            <div className="grid gap-2">
              <ActionRow icon={<UsersRound className="size-4" />} label="Satisfaction tracking" detail="NPS, CSAT, CES and sentiment feed health scoring." />
              <ActionRow icon={<BellRing className="size-4" />} label="Follow-up automation" detail="Feedback and risk signals trigger customer success actions." />
              <ActionRow icon={<BadgeCheck className="size-4" />} label="Lifecycle monitoring" detail="Journey stage changes keep revenue and service teams aligned." />
            </div>
          </DataPanel>

          <DataPanel icon={<CheckCircle2 className="size-4" />} title="API Surface">
            <div className="grid gap-2">{apiSurface.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped customer growth API" />)}</div>
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

function DataTable({ rows, columns }: { rows: Array<Record<string, unknown>>; columns: string[] }) {
  return <div className="overflow-hidden rounded-md border border-neutral-200"><table className="w-full border-collapse text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-semibold">{label(column)}</th>)}</tr></thead><tbody className="divide-y divide-neutral-200">{rows.map((row, index) => <tr key={index} className="bg-white/80">{columns.map((column) => <td key={column} className="px-3 py-2 text-neutral-700">{String(row[column] ?? '-')}</td>)}</tr>)}</tbody></table></div>;
}

function label(value: string) { return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()); }
