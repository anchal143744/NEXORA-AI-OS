'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Factory,
  Globe2,
  GraduationCap,
  HeartPulse,
  Landmark,
  Layers3,
  LockKeyhole,
  MessagesSquare,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Users2,
  Workflow,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { motionTokens, staggerContainer, staggerItem } from '@/lib/motion';

type LandingCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const productPillars: LandingCard[] = [
  {
    title: 'Adaptive workspace generation',
    description: 'NEXORA configures modules, navigation, permissions, KPIs and AI agents around the business profile.',
    icon: Layers3,
  },
  {
    title: 'Connected operating data',
    description: 'CRM, finance, HR, operations, projects and analytics share context through one enterprise intelligence layer.',
    icon: Network,
  },
  {
    title: 'AI execution with governance',
    description: 'Copilots and agents recommend, automate and explain actions while preserving approval, audit and tenant controls.',
    icon: BrainCircuit,
  },
];

const industries: LandingCard[] = [
  { title: 'SaaS', description: 'Pipeline, product usage, renewal and AI agent operations.', icon: Zap },
  { title: 'Agencies', description: 'Clients, projects, profitability, capacity and delivery workflows.', icon: BriefcaseBusiness },
  { title: 'Ecommerce', description: 'Orders, inventory, revenue, support and omnichannel intelligence.', icon: Store },
  { title: 'Manufacturing', description: 'Production, quality, assets, supply chain and planning intelligence.', icon: Factory },
  { title: 'Healthcare', description: 'Workforce, compliance, service operations and secure coordination.', icon: HeartPulse },
  { title: 'Education', description: 'Programs, teams, finances, engagement and knowledge operations.', icon: GraduationCap },
];

const aiCapabilities: LandingCard[] = [
  {
    title: 'Executive reasoning',
    description: 'Ask for risks, opportunities, forecasts and board-ready operating summaries.',
    icon: BarChart3,
  },
  {
    title: 'Workflow generation',
    description: 'Convert natural language into governed automations across business modules.',
    icon: Workflow,
  },
  {
    title: 'Revenue intelligence',
    description: 'Detect at-risk deals, cash flow pressure, upsell paths and expansion timing.',
    icon: CircleDollarSign,
  },
  {
    title: 'Communication intelligence',
    description: 'Summarize meetings, detect decisions, extract actions and coordinate teams.',
    icon: MessagesSquare,
  },
];

const securityControls = [
  'Tenant and workspace isolation',
  'JWT sessions with RBAC-ready APIs',
  'Audit trails and activity streams',
  'Country, privacy and compliance architecture',
  'Secure integration and API key foundations',
];

const customerJourney = [
  { label: 'Create account', detail: 'Sign up with enterprise identity and secure tenant bootstrap.' },
  { label: 'Describe business', detail: 'NEXORA captures industry, team size, goals, country and revenue stage.' },
  { label: 'Generate workspace', detail: 'The OS creates modules, navigation, KPIs, workflows and AI recommendations.' },
  { label: 'Operate with AI', detail: 'Teams use CRM, HR, finance, analytics and agents from one command layer.' },
];

const navItems = [
  { label: 'Product', href: '#product' },
  { label: 'Industries', href: '#industries' },
  { label: 'AI', href: '#ai' },
  { label: 'Security', href: '#security' },
];

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-graphite-990 text-graphite-50">
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <OperatingSystemScene />
        <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-3 rounded-md focus-visible:premium-focus" aria-label="NEXORA AI OS home">
            <span className="grid size-10 place-items-center rounded-lg bg-gold-500 text-graphite-990 shadow-gold">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">NEXORA AI OS</span>
              <span className="block text-xs text-graphite-400">Adaptive AI Business Operating System</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-graphite-300 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="rounded-sm transition hover:text-white focus-visible:premium-focus">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/signup">
                Start
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl px-4 pb-16 pt-14 sm:px-6 md:pt-24 lg:px-8">
          <motion.div {...motionTokens.page} className="max-w-3xl">
            <Badge>Global enterprise AI business operating system</Badge>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] text-white md:text-7xl">
              NEXORA AI OS
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-graphite-200 md:text-lg">
              The adaptive operating layer for modern organizations. NEXORA turns business profile, country, roles, goals and enabled modules into a connected workspace with AI copilots, agents, workflows and executive intelligence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl">
                <Link href="/auth/signup">
                  Create your operating system
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="#product">Explore the platform</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {[
                ['70+', 'Platform phases consolidated'],
                ['226', 'Production web routes built'],
                ['1 OS', 'CRM, HR, finance, analytics and AI'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.055] p-4 backdrop-blur-shell">
                  <dt className="text-2xl font-semibold text-white">{value}</dt>
                  <dd className="mt-1 text-xs leading-5 text-graphite-400">{label}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>

      <section id="product" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Product overview"
          title="One adaptive business operating system, not another static dashboard."
          description="NEXORA is designed as the enterprise command layer where each workspace is generated from metadata, permissions, operating context and AI-ready business intelligence."
        />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mt-10 grid gap-4 lg:grid-cols-3">
          {productPillars.map((pillar) => (
            <motion.div key={pillar.title} variants={staggerItem}>
              <FeatureCard item={pillar} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="industries" className="border-y border-white/10 bg-white/[0.025] py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Industry showcase"
            title="Industry-aware by architecture."
            description="The industry showcase is data-ready. As backend templates mature, these surfaces can render recommended modules, KPIs, automations and AI agents from workspace intelligence APIs."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <FeatureCard key={industry.title} item={industry} compact />
            ))}
          </div>
        </div>
      </section>

      <section id="ai" className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div>
          <SectionHeader
            eyebrow="AI capabilities"
            title="Copilots and agents that understand the enterprise context."
            description="NEXORA is structured for natural-language commands, workflow generation, decision intelligence and governed autonomous action."
          />
          <div className="mt-8 rounded-lg border border-gold-500/20 bg-gold-500/10 p-5 text-sm leading-7 text-gold-100">
            Example commands: Create CRM workflow. Hire employee. Forecast revenue. Generate quarterly report. Create automation.
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {aiCapabilities.map((capability) => (
            <FeatureCard key={capability.title} item={capability} compact />
          ))}
        </div>
      </section>

      <section id="security" className="border-y border-white/10 bg-graphite-950/60 py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <SectionHeader
            eyebrow="Enterprise security"
            title="Built for multi-tenant enterprise trust from the first login."
            description="Authentication, authorization, request context and workspace isolation are treated as platform infrastructure instead of feature-level afterthoughts."
          />
          <Card className="self-start">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-gold-300" aria-hidden="true" />
                Security posture
              </CardTitle>
              <CardDescription>Production-grade controls prepared for enterprise teams.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {securityControls.map((control) => (
                  <li key={control} className="flex gap-3 text-sm text-graphite-200">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden="true" />
                    {control}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Customer journey"
          title="From account creation to operating workspace in one guided flow."
          description="Phase 2 connects the public identity, authentication entry points and onboarding path so the product feels coherent before business modules open."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-4">
          {customerJourney.map((step, index) => (
            <li key={step.label} className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
              <div className="grid size-9 place-items-center rounded-md bg-gold-500 text-sm font-semibold text-graphite-990">{index + 1}</div>
              <h3 className="mt-5 text-base font-semibold text-white">{step.label}</h3>
              <p className="mt-2 text-sm leading-6 text-graphite-400">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Verified proof"
            title="Prepared for real customer stories, not invented logos."
            description="NEXORA will render verified testimonials and case studies from trusted backend data when customer proof is available."
          />
          <EmptyState
            icon={BadgeCheck}
            title="Verified customer stories will appear here"
            description="This production section is ready for future testimonial data without fabricating customer claims."
            action={
              <Button asChild variant="outline">
                <Link href="/contact-sales">Talk to the NEXORA team</Link>
              </Button>
            }
          />
        </div>
      </section>

      <footer className="border-t border-white/10 bg-graphite-990">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-graphite-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="font-semibold text-white">NEXORA AI OS</div>
            <div className="mt-1">Adaptive enterprise intelligence for global teams.</div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/security" className="hover:text-white">Security</Link>
            <Link href="/developers" className="hover:text-white">Developers</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <Link href="/auth/login" className="hover:text-white">Login</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <Badge variant="neutral">{eyebrow}</Badge>
      <h2 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-graphite-300 md:text-base">{description}</p>
    </div>
  );
}

function FeatureCard({ item, compact = false }: { item: LandingCard; compact?: boolean }) {
  const Icon = item.icon;
  return (
    <Card className="group h-full transition duration-200 ease-premium hover:-translate-y-0.5 hover:border-gold-500/28 hover:bg-white/[0.085] hover:shadow-glow">
      <CardHeader className={compact ? 'p-4' : undefined}>
        <div className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/[0.07] text-gold-200 transition group-hover:border-gold-500/40 group-hover:bg-gold-500/12">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <CardTitle className="mt-4">{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function OperatingSystemScene() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,11,0.36),rgba(5,7,11,0.9)),radial-gradient(circle_at_78%_18%,rgba(216,180,93,0.22),transparent_28rem),radial-gradient(circle_at_18%_30%,rgba(78,142,162,0.2),transparent_32rem)]" />
      <div className="absolute left-1/2 top-28 hidden w-[760px] -translate-x-[4%] rounded-xl border border-white/10 bg-graphite-950/70 p-4 shadow-shell backdrop-blur-shell lg:block">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-xs text-graphite-400">
            <span className="size-2 rounded-full bg-red-300/80" />
            <span className="size-2 rounded-full bg-gold-300/80" />
            <span className="size-2 rounded-full bg-primary-300/80" />
          </div>
          <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-graphite-300">
            <Search className="size-3.5" />
            Ask NEXORA: forecast next quarter revenue
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[180px_1fr] gap-4">
          <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            {['Command', 'CRM', 'Finance', 'People', 'Analytics', 'AI Agents'].map((item, index) => (
              <div key={item} className={index === 0 ? 'rounded-md bg-gold-500 px-3 py-2 text-xs font-semibold text-graphite-990' : 'rounded-md px-3 py-2 text-xs text-graphite-300'}>
                {item}
              </div>
            ))}
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Pipeline', '$4.8M'],
                ['Cash runway', '14 mo'],
                ['AI savings', '612 h'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                  <div className="text-xs text-graphite-400">{label}</div>
                  <div className="mt-2 text-xl font-semibold text-white">{value}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[1fr_0.8fr] gap-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <div className="flex items-center justify-between text-xs text-graphite-400">
                  <span>Enterprise health</span>
                  <span>Live</span>
                </div>
                <div className="mt-5 flex h-36 items-end gap-2">
                  {[40, 58, 50, 72, 66, 82, 74, 91].map((height, index) => (
                    <span key={index} className="flex-1 rounded-t-sm bg-gradient-to-t from-primary-700 to-gold-300" style={{ height: height + '%' }} />
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-gold-500/20 bg-gold-500/10 p-4">
                <BrainCircuit className="size-5 text-gold-200" />
                <div className="mt-4 text-sm font-semibold text-white">AI recommendation</div>
                <p className="mt-2 text-xs leading-5 text-gold-100/85">Prioritize enterprise renewals and trigger finance review for delayed invoices.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-graphite-990 to-transparent" />
    </div>
  );
}
