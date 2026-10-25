'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award, BadgeCheck, BarChart3, BookOpenCheck, Bot, BriefcaseBusiness, CalendarClock, ChartNoAxesCombined, ClipboardCheck, GraduationCap, Network, Search, ShieldCheck, Sparkles, Target, UserRoundCog, UsersRound, WalletCards } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { workforceAiQuestions, workforceApiGroups, workforceCapabilities } from '@/services/workforce-api';

const commandCenters = [
  { label: 'Employee Intelligence', detail: 'Profiles, relationships, skills, lifecycle history and document governance.', icon: <UsersRound className="size-4" /> },
  { label: 'Recruitment ATS', detail: 'Requisitions, postings, candidate pipeline, interviews, offers and hiring analytics.', icon: <BriefcaseBusiness className="size-4" /> },
  { label: 'Performance and Talent', detail: 'Goals, reviews, competency assessment, succession, retention and leadership signals.', icon: <Award className="size-4" /> },
  { label: 'AI HR Copilot', detail: 'Promotion readiness, resignation risk, hiring needs and leadership recommendations.', icon: <Bot className="size-4" /> },
];

export function WorkforceWorkspace() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4 text-neutral-950">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold tracking-normal text-primary-950">Enterprise Workforce & HR Intelligence</h1>
            <Badge>Phase 44</Badge>
            <Badge className="bg-white/80">Workforce OS</Badge>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-neutral-500">Employee management, recruitment, onboarding, attendance, performance, learning, compensation, workforce planning, talent intelligence, employee experience, organizational insights and AI HR copilot.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="subtle" title="Search workforce context"><Search className="size-4" />Search</Button>
          <Button variant="subtle" title="Open workforce analytics"><BarChart3 className="size-4" />Analytics</Button>
          <Button title="Ask HR copilot"><Sparkles className="size-4" />Ask AI</Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SignalCard icon={<UsersRound className="size-5" />} label="Workforce Models" value="63" detail="HR intelligence entities" tone="primary" />
        <SignalCard icon={<ShieldCheck className="size-5" />} label="RBAC Roles" value="6" detail="HR-specific roles" tone="green" />
        <SignalCard icon={<Target className="size-5" />} label="Domain Events" value="12" detail="audit and automation ready" tone="amber" />
        <SignalCard icon={<ChartNoAxesCombined className="size-5" />} label="Dashboards" value="12" detail="module-level dashboards" tone="blue" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<UserRoundCog className="size-4" />} title="Workforce Command Center">
            <div className="grid gap-3 md:grid-cols-2">{commandCenters.map((item) => <ActionRow key={item.label} icon={item.icon} label={item.label} detail={item.detail} />)}</div>
          </DataPanel>
          <div className="grid gap-4 2xl:grid-cols-2">
            <DataPanel icon={<ClipboardCheck className="size-4" />} title="Operating Modules">
              <div className="grid gap-2">{workforceCapabilities.slice(0, 6).map((item) => <ActionRow key={item} icon={<BadgeCheck className="size-4" />} label={item} detail="Backed by Phase 44 Prisma models, validators, services and controllers." />)}</div>
            </DataPanel>
            <DataPanel icon={<Sparkles className="size-4" />} title="Intelligence Modules">
              <div className="grid gap-2">{workforceCapabilities.slice(6).map((item) => <ActionRow key={item} icon={<ArrowRight className="size-4" />} label={item} detail="Connected to workforce analytics, talent scoring, planning and AI recommendations." />)}</div>
            </DataPanel>
          </div>
          <DataPanel icon={<Bot className="size-4" />} title="AI HR Copilot Questions">
            <div className="grid gap-2 md:grid-cols-2">{workforceAiQuestions.map((question) => <ActionRow key={question} icon={<Sparkles className="size-4" />} label={question} detail="Natural language request routed through governed workforce context." />)}</div>
          </DataPanel>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <DataPanel icon={<Network className="size-4" />} title="Readiness Coverage">
            <ActionRow icon={<GraduationCap className="size-4" />} label="Learning and growth" detail="Courses, paths, enrollments, assessments, certifications and skill development plans." />
            <ActionRow icon={<WalletCards className="size-4" />} label="Compensation intelligence" detail="Compensation plans, bands, bonuses, promotions and compensation history." />
            <ActionRow icon={<CalendarClock className="size-4" />} label="Attendance and leave" detail="Attendance, logs, leave, balances, holidays and shift schedules." />
            <ActionRow icon={<BookOpenCheck className="size-4" />} label="Policy and onboarding" detail="Workflows, tasks, checklists, equipment and policy acknowledgements." />
          </DataPanel>
          <DataPanel icon={<BarChart3 className="size-4" />} title="API Groups">
            <div className="grid gap-2">{workforceApiGroups.map((apiPath) => <ActionRow key={apiPath} icon={<ArrowRight className="size-4" />} label={apiPath} detail="Versioned, guarded, tenant-aware workforce API" />)}</div>
          </DataPanel>
        </aside>
      </div>
    </div>
  );
}

function SignalCard({ icon, label, value, detail, tone }: { icon: ReactNode; label: string; value: string; detail: string; tone: 'primary' | 'green' | 'amber' | 'blue' }) {
  const tones = { primary: 'border-primary-200 text-primary-950', green: 'border-emerald-200 text-emerald-950', amber: 'border-amber-200 text-amber-950', blue: 'border-sky-200 text-sky-950' };
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('rounded-lg border bg-white/78 p-4 shadow-subtle backdrop-blur-shell', tones[tone])}><div className="flex items-center justify-between gap-3"><span>{icon}</span><span className="flex size-4 items-center justify-center rounded-full bg-current/10"><span className="size-1.5 rounded-full bg-current" /></span></div><div className="mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-sm font-medium">{label}</div><div className="mt-1 text-xs opacity-70">{detail}</div></motion.div>;
}

function DataPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <section className="rounded-lg border border-neutral-200 bg-white/78 p-4 shadow-subtle backdrop-blur-shell"><div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold text-primary-950">{icon}<span>{title}</span></div><Button variant="icon" size="icon" title={'Open ' + title}><ArrowRight className="size-4" /></Button></div>{children}</section>;
}

function ActionRow({ icon, label, detail }: { icon: ReactNode; label: string; detail: string }) {
  return <div className="flex min-w-0 items-start gap-3 rounded-md border border-neutral-200 bg-white/70 p-3"><span className="mt-0.5 text-primary-700">{icon}</span><div className="min-w-0"><div className="truncate text-sm font-medium text-neutral-950">{label}</div><div className="mt-0.5 text-xs leading-5 text-neutral-500">{detail}</div></div></div>;
}

