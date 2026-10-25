'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BadgeCheck, Bell, BookOpenCheck, Brain, CalendarDays, CheckCircle2, Clock3, FileText, Layers3, MessageSquare, RefreshCw, Search, ShieldCheck, Sparkles, Users, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const channels = [
  { channel: 'Executive Ops', type: 'Team', members: '18', unread: '7', state: 'Active' },
  { channel: 'Finance Control', type: 'Department', members: '31', unread: '4', state: 'Governed' },
  { channel: 'Launch Room', type: 'Project', members: '44', unread: '12', state: 'Live' },
];

const meetings = [
  { meeting: 'Revenue review', time: '10:00', participants: '8', intelligence: 'Summary ready' },
  { meeting: 'Hiring sync', time: '13:30', participants: '6', intelligence: 'Actions extracted' },
  { meeting: 'Risk council', time: '16:00', participants: '11', intelligence: 'Decision pending' },
];

const calendarEvents = [
  { event: 'Board prep', calendar: 'Executive', window: '09:00-10:00', status: 'Protected' },
  { event: 'Ops standup', calendar: 'Company', window: '11:00-11:30', status: 'Recurring' },
  { event: 'Client review', calendar: 'Revenue', window: '15:00-16:00', status: 'Optimized' },
];

const intelligence = [
  { label: 'Availability analysis', detail: 'Finds open windows across calendars and participants', icon: <CalendarDays className="size-4" /> },
  { label: 'Conflict detection', detail: 'Detects overlaps, protected time and unavailable windows', icon: <ShieldCheck className="size-4" /> },
  { label: 'Meeting summaries', detail: 'Extracts decisions, actions, risks and follow-up recommendations', icon: <Brain className="size-4" /> },
  { label: 'Reminder engine', detail: 'Schedules in-app, email and channel reminders with preferences', icon: <Bell className="size-4" /> },
];

const apiSurface = ['/v1/communications', '/v1/conversations', '/v1/messages', '/v1/announcements', '/v1/meetings', '/v1/meeting-summaries', '/v1/calendars', '/v1/calendar-events', '/v1/scheduling', '/v1/reminders', '/v1/availability', '/v1/notifications'];

export function CommunicationsWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Communications, Meetings & Calendar Intelligence</h1>
            <Badge>Phase 26</Badge>
            <Badge className="bg-white/80">Scheduling Intelligence</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Tenant-aware channels, conversations, announcements, meeting intelligence, calendars, reminders, availability analysis and AI scheduling recommendations for cross-department coordination.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search communications"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Refresh workspace"><RefreshCw className="size-4" />Refresh</Button>
          <Button title="Optimize schedule"><Sparkles className="size-4" />Optimize</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<MessageSquare className="size-5" />} label="Channels" value="24" detail="team, department, direct" tone="primary" />
        <SignalCard icon={<Video className="size-5" />} label="Meetings" value="63" detail="summaries and actions" tone="green" />
        <SignalCard icon={<CalendarDays className="size-5" />} label="Calendar Events" value="184" detail="personal to company" tone="amber" />
        <SignalCard icon={<Brain className="size-5" />} label="AI Recommendations" value="29" detail="conflicts and follow-ups" tone="violet" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Layers3 className="size-4" />} title="Team Channels"><DataTable rows={channels} columns={['channel', 'type', 'members', 'unread', 'state']} /></DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<Video className="size-4" />} title="Meeting Center"><DataTable rows={meetings} columns={['meeting', 'time', 'participants', 'intelligence']} /></DataPanel>
            <DataPanel icon={<CalendarDays className="size-4" />} title="Calendar Center"><DataTable rows={calendarEvents} columns={['event', 'calendar', 'window', 'status']} /></DataPanel>
          </div>
          <DataPanel icon={<Clock3 className="size-4" />} title="Scheduling Assistant">
            <div className="grid gap-3 md:grid-cols-2">
              {['Availability analysis', 'Conflict detection', 'Resource scheduling', 'Executive scheduling', 'Reminder orchestration', 'Follow-up tracking'].map((label) => <WorkflowCard key={label} label={label} />)}
            </div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Brain className="size-4" />} title="AI Meeting Intelligence">
            <div className="grid gap-2">{intelligence.map((item) => <ActionRow key={item.label} {...item} />)}</div>
          </DataPanel>

          <DataPanel icon={<Bell className="size-4" />} title="Notifications Center">
            <div className="grid gap-2">
              <StateRow label="Reminder rules" state="Scheduled" />
              <StateRow label="Quiet hours" state="Preference based" />
              <StateRow label="Read receipts" state="Tracked" />
              <StateRow label="Announcements" state="Audience scoped" />
            </div>
          </DataPanel>

          <DataPanel icon={<BookOpenCheck className="size-4" />} title="Meeting Summary Panel">
            <div className="grid gap-2">
              <ActionRow icon={<FileText className="size-4" />} label="Decisions" detail="Meeting decisions are extracted and stored as records" />
              <ActionRow icon={<CheckCircle2 className="size-4" />} label="Action items" detail="Owners, deadlines and priorities become follow-up work" />
              <ActionRow icon={<BadgeCheck className="size-4" />} label="Risks" detail="Risks and blockers are surfaced for executive review" />
            </div>
          </DataPanel>

          <DataPanel icon={<Users className="size-4" />} title="API Surface">
            <div className="grid gap-2">{apiSurface.map((path) => <ActionRow key={path} icon={<CheckCircle2 className="size-4" />} label={path} detail="Tenant-scoped communications API" />)}</div>
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
  return <div className="rounded-md border border-neutral-200 bg-white/80 p-3"><div className="flex items-center gap-2 text-sm font-semibold text-neutral-950"><Clock3 className="size-4 text-primary-700" />{label}</div><div className="mt-2 text-xs text-neutral-500">Calendar intelligence links availability, reminders, meetings and follow-up work.</div></div>;
}

function DataTable({ rows, columns }: { rows: Array<Record<string, unknown>>; columns: string[] }) {
  return <div className="overflow-hidden rounded-md border border-neutral-200"><table className="w-full border-collapse text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr>{columns.map((column) => <th key={column} className="px-3 py-2 font-semibold">{label(column)}</th>)}</tr></thead><tbody className="divide-y divide-neutral-200">{rows.map((row, index) => <tr key={index} className="bg-white/80">{columns.map((column) => <td key={column} className="px-3 py-2 text-neutral-700">{String(row[column] ?? '-')}</td>)}</tr>)}</tbody></table></div>;
}

function label(value: string) { return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()); }