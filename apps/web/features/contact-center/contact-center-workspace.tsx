'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BadgeCheck, BellRing, Bot, Brain, CalendarClock, CheckCircle2, Headphones, Inbox, Layers3, MessageCircle, Mic2, PhoneCall, Radar, RefreshCw, Route, Search, ShieldCheck, Sparkles, UserRoundCheck, UsersRound, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const inboxItems = [
  { customer: 'Aster Retail', channel: 'WhatsApp', intent: 'refund risk', status: 'Escalated', owner: 'Priority' },
  { customer: 'Helio SaaS', channel: 'Voice', intent: 'upgrade', status: 'AI assisted', owner: 'Sales' },
  { customer: 'Northline Ops', channel: 'Email', intent: 'support', status: 'Queued', owner: 'Support' },
];

const voiceSessions = [
  { session: 'VS-1048', direction: 'Inbound', language: 'EN', status: 'Live transcript', agent: 'Support AI' },
  { session: 'VS-1049', direction: 'Outbound', language: 'ES', status: 'Human handoff', agent: 'Sales AI' },
  { session: 'VS-1050', direction: 'Inbound', language: 'HI', status: 'Summary ready', agent: 'Follow-up AI' },
];

const queues = [
  { queue: 'Priority Support', channels: 'Voice, WhatsApp', sla: '94%', waiting: '12' },
  { queue: 'Sales Desk', channels: 'Email, Live Chat', sla: '98%', waiting: '7' },
  { queue: 'Appointments', channels: 'Voice, SMS', sla: '99%', waiting: '3' },
];

const intelligence = [
  { label: 'Sentiment analysis', detail: 'Scores conversation tone and urgency by tenant and workspace.', icon: <Radar className="size-4" /> },
  { label: 'Intent detection', detail: 'Classifies billing, support, sales, retention and scheduling intent.', icon: <Brain className="size-4" /> },
  { label: 'Action extraction', detail: 'Turns commitments into governed tasks and follow-up suggestions.', icon: <CheckCircle2 className="size-4" /> },
  { label: 'Escalation routing', detail: 'Recommends queue, severity and handoff path for risky conversations.', icon: <Route className="size-4" /> },
];

const apiSurface = ['/v1/voice-ai', '/v1/contact-center', '/v1/conversations', '/v1/messages', '/v1/communication-channels', '/v1/customer-identity', '/v1/conversation-intelligence', '/v1/voice-agents'];

export function ContactCenterWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Voice AI, Contact Center & Omnichannel Engagement</h1>
            <Badge>Phase 27</Badge>
            <Badge className="bg-white/80">AI Communication Platform</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Unified inbox, voice sessions, contact-center queues, customer identity resolution, conversation intelligence and governed AI voice agents for customer communication operations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search conversations"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh operations"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Start voice assistant"><Mic2 className="size-4" />Voice AI</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<Inbox className="size-5" />} label="Unified Inbox" value="128" detail="email, SMS, WhatsApp, voice" tone="primary" />
        <SignalCard icon={<PhoneCall className="size-5" />} label="Voice Sessions" value="41" detail="live transcripts and actions" tone="green" />
        <SignalCard icon={<Headphones className="size-5" />} label="Contact Queues" value="9" detail="SLA and routing governed" tone="amber" />
        <SignalCard icon={<Bot className="size-5" />} label="Voice Agents" value="4" detail="support, sales, appointments" tone="violet" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Inbox className="size-4" />} title="Unified Inbox"><DataTable rows={inboxItems} columns={['customer', 'channel', 'intent', 'status', 'owner']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Mic2 className="size-4" />} title="Voice Session Monitor"><DataTable rows={voiceSessions} columns={['session', 'direction', 'language', 'status', 'agent']} /></DataPanel>
            <DataPanel icon={<Headphones className="size-4" />} title="Contact Center Dashboard"><DataTable rows={queues} columns={['queue', 'channels', 'sla', 'waiting']} /></DataPanel>
          </div>
          <DataPanel icon={<Layers3 className="size-4" />} title="Conversation Timeline">
            <div className="grid gap-3 md:grid-cols-3">
              <WorkflowCard icon={<MessageCircle className="size-4" />} label="Cross-channel context" detail="Messages, calls, summaries and escalations attach to one customer identity." />
              <WorkflowCard icon={<UserRoundCheck className="size-4" />} label="Identity resolution" detail="Email, phone, WhatsApp, SMS and chat identities are unified per tenant." />
              <WorkflowCard icon={<ShieldCheck className="size-4" />} label="Access controls" detail="Conversation, calendar and contact-center access stay workspace scoped." />
            </div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Brain className="size-4" />} title="Conversation Intelligence">
            <div className="grid gap-2">{intelligence.map((item) => <ActionRow key={item.label} {...item} />)}</div>
          </DataPanel>

          <DataPanel icon={<Bot className="size-4" />} title="AI Voice Agents">
            <div className="grid gap-2">
              <StateRow label="Customer Support Agent" state="Handoff aware" />
              <StateRow label="Sales Agent" state="Approval aware" />
              <StateRow label="Appointment Agent" state="Calendar aware" />
              <StateRow label="Follow-up Agent" state="Task aware" />
            </div>
          </DataPanel>

          <DataPanel icon={<Volume2 className="size-4" />} title="Voice AI Layer">
            <div className="grid gap-2">
              <ActionRow icon={<Mic2 className="size-4" />} label="Speech to text" detail="Provider contracts support streaming and batch transcript capture." />
              <ActionRow icon={<Volume2 className="size-4" />} label="Text to speech" detail="Voice provider contracts are tenant-scoped and approval-aware." />
              <ActionRow icon={<Sparkles className="size-4" />} label="Command execution" detail="Voice commands become risk-scored governed action executions." />
            </div>
          </DataPanel>

          <DataPanel icon={<BellRing className="size-4" />} title="Communication Analytics">
            <div className="grid gap-2">
              <StateRow label="SLA monitoring" state="Enabled" />
              <StateRow label="Escalation risk" state="Tracked" />
              <StateRow label="Customer sentiment" state="Scored" />
              <StateRow label="Follow-up suggestions" state="Generated" />
            </div>
          </DataPanel>

          <DataPanel icon={<BadgeCheck className="size-4" />} title="API Surface">
            <div className="grid gap-2">{apiSurface.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped engagement API" />)}</div>
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

function WorkflowCard({ icon, label, detail }: { icon: ReactNode; label: string; detail: string }) {
  return <div className="rounded-md border border-neutral-200 bg-white/80 p-3"><div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">{icon}{label}</div><div className="mt-2 text-xs text-neutral-500">{detail}</div></div>;
}

function DataTable({ rows, columns }: { rows: Array<Record<string, unknown>>; columns: string[] }) {
  return <div className="overflow-hidden rounded-md border border-neutral-200"><table className="w-full border-collapse text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-semibold">{label(column)}</th>)}</tr></thead><tbody className="divide-y divide-neutral-200">{rows.map((row, index) => <tr key={index} className="bg-white/80">{columns.map((column) => <td key={column} className="px-3 py-2 text-neutral-700">{String(row[column] ?? '-')}</td>)}</tr>)}</tbody></table></div>;
}

function label(value: string) { return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()); }
