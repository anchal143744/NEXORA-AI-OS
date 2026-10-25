'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Globe2,
  Languages,
  LayoutDashboard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wand2,
} from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select } from '@/components/ui/select';
import { workspaceIntelligenceApi } from '@/services/workspace-intelligence-api';
import type { WorkspaceGenerationResult } from '@/types/discovery';
import { saveGeneratedWorkspaceProfile } from '@/features/workspace/workspace-config-engine';
import {
  accountingMethods,
  aiPreferenceOptions,
  buildLiveWorkspaceIntelligence,
  businessGoalOptions,
  companySizes,
  countries,
  currencies,
  defaultBusinessSetupProfile,
  departmentOptions,
  expansionOptions,
  industries,
  languages,
  taxSystems,
  timezones,
  type AiBusinessSetupProfile,
} from '@/lib/onboarding-intelligence';
import { motionTokens, staggerContainer, staggerItem } from '@/lib/motion';

const storageKey = 'nexora.phase3.ai-business-setup';

const steps = [
  {
    id: 'identity',
    label: 'Business identity',
    context: 'I will start with the minimum identity signals needed to create a trustworthy operating workspace.',
    description: 'Tell NEXORA who is starting the workspace and how the business can be recognized globally.',
  },
  {
    id: 'global',
    label: 'Global context',
    context: 'Country, language, currency and timezone shape compliance, dates, invoices and AI explanations.',
    description: 'Choose the operating context for the first workspace. You can expand this later.',
  },
  {
    id: 'operations',
    label: 'Operating model',
    context: 'Industry, team size and departments tell NEXORA which modules and permissions matter first.',
    description: 'Keep this simple. The operating system will adapt the structure from these signals.',
  },
  {
    id: 'goals',
    label: 'Goals and AI',
    context: 'NEXORA recommends modules, KPIs, reports and AI agents from goals and comfort with automation.',
    description: 'Pick the outcomes and AI behavior that should guide the first workspace.',
  },
  {
    id: 'preview',
    label: 'Preview',
    context: 'Review the generated workspace before anything is sent to the backend.',
    description: 'This is your editable checkpoint. Go back if anything feels off.',
  },
  {
    id: 'generate',
    label: 'Generate',
    context: 'NEXORA will call the adaptive workspace backend and persist the generated blueprint.',
    description: 'If tenant or organization context is missing, generation will stop and show the real error.',
  },
] as const;

type StepId = (typeof steps)[number]['id'];
type Errors = Partial<Record<keyof AiBusinessSetupProfile, string>>;
type GenerationStageStatus = 'waiting' | 'active' | 'done';

const generationStages = [
  'Analyzing business',
  'Generating organization context',
  'Creating workspace blueprint',
  'Generating AI agents',
  'Configuring dashboard',
  'Finalizing',
];

export function AiBusinessSetupWizard() {
  const router = useRouter();
  const [profile, setProfile] = useState<AiBusinessSetupProfile>(defaultBusinessSetupProfile);
  const [currentStep, setCurrentStep] = useState<StepId>('identity');
  const [errors, setErrors] = useState<Errors>({});
  const [autosaveStatus, setAutosaveStatus] = useState('Autosave ready');
  const [generationStatus, setGenerationStatus] = useState<Record<string, GenerationStageStatus>>(() => Object.fromEntries(generationStages.map((stage) => [stage, 'waiting'])));
  const [generationResult, setGenerationResult] = useState<WorkspaceGenerationResult | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setProfile({ ...defaultBusinessSetupProfile, ...JSON.parse(raw) });
    } catch {
      setAutosaveStatus('Autosave unavailable');
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(profile));
        setAutosaveStatus('Saved just now');
      } catch {
        setAutosaveStatus('Autosave unavailable');
      }
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [profile]);

  const activeIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = Math.round(((activeIndex + 1) / steps.length) * 100);
  const intelligence = useMemo(() => buildLiveWorkspaceIntelligence(profile), [profile]);

  function update<K extends keyof AiBusinessSetupProfile>(key: K, value: AiBusinessSetupProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function goNext() {
    const stepErrors = validateStep(currentStep, profile);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;
    const next = steps[activeIndex + 1];
    if (next) setCurrentStep(next.id);
  }

  function goBack() {
    const previous = steps[activeIndex - 1];
    if (previous) setCurrentStep(previous.id);
  }

  async function generateWorkspace() {
    const stepErrors = validateAll(profile);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      setCurrentStep('identity');
      return;
    }

    setGenerationError(null);
    setGenerationResult(null);
    setIsGenerating(true);
    setGenerationStatus(Object.fromEntries(generationStages.map((stage) => [stage, 'waiting'])));

    try {
      for (const stage of generationStages.slice(0, -1)) {
        setGenerationStatus((current) => ({ ...current, [stage]: 'active' }));
        await wait(260);
        setGenerationStatus((current) => ({ ...current, [stage]: 'done' }));
      }
      setGenerationStatus((current) => ({ ...current, Finalizing: 'active' }));
      const result = await workspaceIntelligenceApi.generateWorkspace(intelligence.blueprint);
      setGenerationStatus((current) => ({ ...current, Finalizing: 'done' }));
      setGenerationResult(result);
      saveGeneratedWorkspaceProfile(profile);
      window.setTimeout(() => router.push('/dashboard' as Route), 750);
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        /* no-op: clearing local autosave is best effort */
      }
    } catch (error) {
      setGenerationStatus((current) => ({ ...current, Finalizing: 'waiting' }));
      setGenerationError(error instanceof Error ? error.message : 'Workspace generation failed');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="min-h-screen bg-graphite-990 text-graphite-50">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_18%_12%,rgba(216,180,93,0.16),transparent_28rem),radial-gradient(circle_at_82%_10%,rgba(78,142,162,0.18),transparent_34rem),linear-gradient(180deg,#05070B_0%,#0B1220_100%)]">
        <div className="mx-auto flex min-h-[34vh] w-full max-w-7xl flex-col justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-3 rounded-md focus-visible:premium-focus">
              <span className="grid size-10 place-items-center rounded-lg bg-gold-500 text-graphite-990 shadow-gold">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">NEXORA AI OS</span>
                <span className="block text-xs text-graphite-400">AI business setup</span>
              </span>
            </Link>
            <Badge variant="neutral">{autosaveStatus}</Badge>
          </div>

          <motion.div {...motionTokens.page} className="max-w-4xl pb-10 pt-14">
            <Badge><Bot className="size-3" aria-hidden="true" /> Conversational onboarding</Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-6xl">Let NEXORA interview the business, then generate the operating workspace.</h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-graphite-300 md:text-base">
              This is not an ERP form. Answer like you are talking to an intelligent business consultant. NEXORA will translate your profile into modules, KPIs, reports, AI agents, navigation and a backend workspace blueprint.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_360px] lg:px-8">
        <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Setup progress</CardTitle>
              <CardDescription>{steps[activeIndex].label}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progress} label="Workspace readiness" />
              <nav className="space-y-2" aria-label="Onboarding steps">
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isComplete = index < activeIndex || generationResult !== null;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setCurrentStep(step.id)}
                      className={isActive ? 'flex w-full items-center gap-3 rounded-md border border-gold-500/35 bg-gold-500/12 px-3 py-2 text-left text-sm text-gold-100 focus-visible:premium-focus' : 'flex w-full items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-left text-sm text-graphite-300 transition hover:bg-white/[0.07] focus-visible:premium-focus'}
                    >
                      <span className={isComplete ? 'grid size-6 shrink-0 place-items-center rounded-md bg-gold-500 text-graphite-990' : 'grid size-6 shrink-0 place-items-center rounded-md border border-white/10 text-xs text-graphite-400'}>
                        {isComplete ? <Check className="size-3" aria-hidden="true" /> : index + 1}
                      </span>
                      <span>{step.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </aside>

        <section className="min-w-0">
          <motion.div key={currentStep} variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <Badge>{steps[activeIndex].label}</Badge>
                  <CardTitle className="mt-3 text-2xl">{steps[activeIndex].context}</CardTitle>
                  <CardDescription>{steps[activeIndex].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {currentStep === 'identity' ? <IdentityStep profile={profile} errors={errors} update={update} /> : null}
                  {currentStep === 'global' ? <GlobalStep profile={profile} errors={errors} update={update} /> : null}
                  {currentStep === 'operations' ? <OperationsStep profile={profile} errors={errors} update={update} /> : null}
                  {currentStep === 'goals' ? <GoalsStep profile={profile} update={update} /> : null}
                  {currentStep === 'preview' ? <WorkspacePreview profile={profile} intelligence={intelligence} /> : null}
                  {currentStep === 'generate' ? (
                    <GenerationStep
                      profile={profile}
                      intelligence={intelligence}
                      generationStatus={generationStatus}
                      generationResult={generationResult}
                      generationError={generationError}
                      isGenerating={isGenerating}
                      generateWorkspace={generateWorkspace}
                    />
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem} className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="ghost" onClick={goBack} disabled={activeIndex === 0 || isGenerating}>
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back
              </Button>
              {currentStep === 'generate' ? (
                <Button type="button" onClick={() => void generateWorkspace()} disabled={isGenerating || generationResult !== null}>
                  <Wand2 className="size-4" aria-hidden="true" />
                  {isGenerating ? 'Generating workspace' : generationResult ? 'Workspace generated' : 'Generate workspace'}
                </Button>
              ) : (
                <Button type="button" onClick={goNext}>
                  Continue
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              )}
            </motion.div>
          </motion.div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
          <LiveRecommendations intelligence={intelligence} />
        </aside>
      </section>
    </main>
  );
}

function IdentityStep({ profile, errors, update }: StepProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field icon={Building2} label="Business Name" error={errors.businessName}>
        <Input value={profile.businessName} onChange={(event) => update('businessName', event.target.value)} placeholder="Nexora Labs" aria-label="Business Name" invalid={Boolean(errors.businessName)} />
      </Field>
      <Field icon={UserRound} label="Founder" error={errors.founder}>
        <Input value={profile.founder} onChange={(event) => update('founder', event.target.value)} placeholder="Avery Stone" aria-label="Founder" invalid={Boolean(errors.founder)} />
      </Field>
      <Field icon={Mail} label="Business Email" error={errors.businessEmail}>
        <Input value={profile.businessEmail} onChange={(event) => update('businessEmail', event.target.value)} type="email" placeholder="founder@company.com" aria-label="Business Email" invalid={Boolean(errors.businessEmail)} />
      </Field>
      <Field icon={Phone} label="Phone" error={errors.phone}>
        <Input value={profile.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+1 555 0142" aria-label="Phone" invalid={Boolean(errors.phone)} />
      </Field>
      <Field icon={Globe2} label="Website" error={errors.website} className="md:col-span-2">
        <Input value={profile.website} onChange={(event) => update('website', event.target.value)} placeholder="https://company.com" aria-label="Website" invalid={Boolean(errors.website)} />
      </Field>
    </div>
  );
}

function GlobalStep({ profile, errors, update }: StepProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field icon={MapPin} label="Country" error={errors.country}>
        <Select value={profile.country} onChange={(event) => update('country', event.target.value)} options={countries.map(toOption)} aria-label="Country" />
      </Field>
      <Field icon={Languages} label="Language" error={errors.language}>
        <Select value={profile.language} onChange={(event) => update('language', event.target.value)} options={languages.map(toOption)} aria-label="Language" />
      </Field>
      <Field icon={CircleDollarSign} label="Currency" error={errors.currency}>
        <Select value={profile.currency} onChange={(event) => update('currency', event.target.value)} options={currencies.map(toOption)} aria-label="Currency" />
      </Field>
      <Field icon={Globe2} label="Timezone" error={errors.timezone}>
        <Select value={profile.timezone} onChange={(event) => update('timezone', event.target.value)} options={timezones.map(toOption)} aria-label="Timezone" />
      </Field>
      <Field icon={ShieldCheck} label="Tax System" error={errors.taxSystem}>
        <Select value={profile.taxSystem} onChange={(event) => update('taxSystem', event.target.value)} options={taxSystems.map(toOption)} aria-label="Tax System" />
      </Field>
      <Field icon={LayoutDashboard} label="Accounting Method" error={errors.accountingMethod}>
        <Select value={profile.accountingMethod} onChange={(event) => update('accountingMethod', event.target.value)} options={accountingMethods.map(toOption)} aria-label="Accounting Method" />
      </Field>
    </div>
  );
}

function OperationsStep({ profile, errors, update }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Field icon={Building2} label="Industry" error={errors.industry}>
          <Select value={profile.industry} onChange={(event) => update('industry', event.target.value)} options={industries.map(toOption)} aria-label="Industry" />
        </Field>
        <Field icon={UserRound} label="Company Size" error={errors.companySize}>
          <Select value={profile.companySize} onChange={(event) => update('companySize', event.target.value)} options={companySizes.map(toOption)} aria-label="Company Size" />
        </Field>
        <Field icon={UserRound} label="Employees" error={errors.employees}>
          <Input value={profile.employees} onChange={(event) => update('employees', event.target.value)} placeholder="42" inputMode="numeric" aria-label="Employees" invalid={Boolean(errors.employees)} />
        </Field>
      </div>
      <ChipSelector title="Departments" values={profile.departments} options={departmentOptions} onChange={(values) => update('departments', values)} />
      {errors.departments ? <p className="text-sm text-red-200">{errors.departments}</p> : null}
    </div>
  );
}

function GoalsStep({ profile, update }: { profile: AiBusinessSetupProfile; update: UpdateProfile }) {
  return (
    <div className="space-y-6">
      <ChipSelector title="Business Goals" values={profile.businessGoals} options={businessGoalOptions} onChange={(values) => update('businessGoals', values)} />
      <ChipSelector title="AI Preferences" values={profile.aiPreferences} options={aiPreferenceOptions} onChange={(values) => update('aiPreferences', values)} />
      <ChipSelector title="Future Expansion Plans" values={profile.futureExpansionPlans} options={expansionOptions} onChange={(values) => update('futureExpansionPlans', values)} />
    </div>
  );
}

function WorkspacePreview({ profile, intelligence }: { profile: AiBusinessSetupProfile; intelligence: ReturnType<typeof buildLiveWorkspaceIntelligence> }) {
  const rows = [
    ['Modules', intelligence.blueprint.modules.map((item) => item.label)],
    ['KPIs', intelligence.blueprint.kpis.map((item) => item.label)],
    ['Reports', intelligence.reports.map((item) => item.label)],
    ['AI Agents', intelligence.blueprint.agents.map((item) => item.label)],
  ];

  return (
    <div className="space-y-5">
      <Alert title="Workspace summary" variant="info">{intelligence.summary}</Alert>
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="rounded-lg border border-white/10 bg-graphite-950/70 p-3">
          <div className="mb-3 text-xs font-semibold uppercase text-graphite-500">Generated sidebar</div>
          <div className="space-y-2">
            {intelligence.blueprint.navigation.map((item, index) => (
              <div key={item} className={index === 0 ? 'rounded-md bg-gold-500 px-3 py-2 text-sm font-semibold text-graphite-990' : 'rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-graphite-300'}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
          <div className="flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-semibold text-white">{intelligence.blueprint.workspaceName}</div>
              <div className="text-sm text-graphite-400">{profile.industry} in {profile.country} - {profile.currency} - {profile.timezone}</div>
            </div>
            <Badge>{intelligence.readiness.level}</Badge>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ['Health Score', String(intelligence.readiness.score)],
              ['Modules', String(intelligence.blueprint.modules.length)],
              ['Agents', String(intelligence.blueprint.agents.length)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/[0.055] p-3">
                <div className="text-xs text-graphite-400">{label}</div>
                <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {rows.map(([label, items]) => (
              <div key={label as string} className="rounded-md border border-white/10 bg-graphite-950/50 p-3">
                <div className="text-xs font-semibold uppercase text-graphite-500">{label}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(items as string[]).map((item) => <Badge key={item} variant="neutral">{item}</Badge>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm leading-6 text-graphite-400">Need to change anything? Use Back to edit the business profile before generation.</p>
    </div>
  );
}

function GenerationStep({
  profile,
  intelligence,
  generationStatus,
  generationResult,
  generationError,
  isGenerating,
  generateWorkspace,
}: {
  profile: AiBusinessSetupProfile;
  intelligence: ReturnType<typeof buildLiveWorkspaceIntelligence>;
  generationStatus: Record<string, GenerationStageStatus>;
  generationResult: WorkspaceGenerationResult | null;
  generationError: string | null;
  isGenerating: boolean;
  generateWorkspace: () => void;
}) {
  if (generationResult) {
    return (
      <div className="space-y-5">
        <Alert title="Congratulations" variant="success">
          {generationResult.workspaceName} was generated from the adaptive workspace backend at {new Date(generationResult.generatedAt).toLocaleString()}.
        </Alert>
        <Card className="bg-gold-500/10">
          <CardHeader>
            <CardTitle>{profile.businessName}</CardTitle>
            <CardDescription>{profile.industry} workspace with {intelligence.blueprint.modules.length} modules, {intelligence.blueprint.kpis.length} KPIs and {intelligence.blueprint.agents.length} AI agents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">{intelligence.blueprint.modules.map((module) => <Badge key={module.label}>{module.label}</Badge>)}</div>
            <Button asChild>
              <Link href={'/dashboard' as Route}>
                Open Dashboard
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3">
        {generationStages.map((stage) => {
          const status = generationStatus[stage];
          return (
            <div key={stage} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <span className={status === 'done' ? 'grid size-8 place-items-center rounded-md bg-gold-500 text-graphite-990' : status === 'active' ? 'grid size-8 place-items-center rounded-md border border-gold-500/35 text-gold-200' : 'grid size-8 place-items-center rounded-md border border-white/10 text-graphite-500'}>
                {status === 'done' ? <CheckCircle2 className="size-4" aria-hidden="true" /> : status === 'active' ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
              </span>
              <div>
                <div className="text-sm font-semibold text-white">{stage}</div>
                <div className="text-xs text-graphite-400">{status === 'active' ? 'Working now' : status === 'done' ? 'Complete' : 'Waiting'}</div>
              </div>
            </div>
          );
        })}
      </div>
      {generationError ? (
        <Alert title="Workspace generation stopped" variant="danger">
          {generationError}. Sign in with an organization-backed account, then try again.
        </Alert>
      ) : null}
      {!isGenerating && !generationError ? (
        <EmptyState
          icon={Wand2}
          title="Ready to generate"
          description="NEXORA will now send this workspace blueprint to the adaptive workspace backend. Success is only shown after the backend responds."
          action={<Button onClick={generateWorkspace}>Generate workspace</Button>}
        />
      ) : null}
    </div>
  );
}

function LiveRecommendations({ intelligence }: { intelligence: ReturnType<typeof buildLiveWorkspaceIntelligence> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot className="size-4 text-gold-300" aria-hidden="true" />Live AI recommendations</CardTitle>
        <CardDescription>Generated from the business profile as you type.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RecommendationGroup title="Recommended Modules" items={intelligence.blueprint.modules.map((item) => item.label)} />
        <RecommendationGroup title="Recommended KPIs" items={intelligence.blueprint.kpis.map((item) => item.label)} />
        <RecommendationGroup title="Recommended AI Agents" items={intelligence.blueprint.agents.map((item) => item.label)} />
        <RecommendationGroup title="Recommended Reports" items={intelligence.reports.map((item) => item.label)} />
        <RecommendationGroup title="Recommended Permissions" items={intelligence.permissions.map((item) => item.label)} />
        <div className="rounded-lg border border-gold-500/20 bg-gold-500/10 p-3">
          <div className="text-xs text-gold-100/70">AI readiness</div>
          <div className="mt-1 text-2xl font-semibold text-white">{intelligence.readiness.score}</div>
          <div className="text-xs text-gold-100">{intelligence.readiness.level}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase text-graphite-500">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.slice(0, 5).map((item) => <Badge key={item} variant="neutral">{item}</Badge>)}
      </div>
    </div>
  );
}

type UpdateProfile = <K extends keyof AiBusinessSetupProfile>(key: K, value: AiBusinessSetupProfile[K]) => void;
type StepProps = { profile: AiBusinessSetupProfile; errors: Errors; update: UpdateProfile };

function Field({ icon: Icon, label, error, children, className }: { icon: typeof Building2; label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-2 flex items-center gap-2 text-xs font-medium text-graphite-400">
        <Icon className="size-3.5 text-gold-300" aria-hidden="true" />
        {label}
      </label>
      {children}
      {error ? <p className="mt-2 text-xs text-red-200">{error}</p> : null}
    </div>
  );
}

function ChipSelector({ title, values, options, onChange }: { title: string; values: string[]; options: string[]; onChange: (values: string[]) => void }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase text-graphite-500">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(selected ? values.filter((item) => item !== option) : [...values, option])}
              className={selected ? 'inline-flex items-center gap-2 rounded-md border border-gold-500/35 bg-gold-500/12 px-3 py-2 text-sm text-gold-100 transition focus-visible:premium-focus' : 'inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-graphite-200 transition hover:bg-white/[0.08] focus-visible:premium-focus'}
            >
              <span className="grid size-4 place-items-center rounded-sm border border-gold-500/35 text-gold-300">{selected ? <Check className="size-3" aria-hidden="true" /> : null}</span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function validateStep(step: StepId, profile: AiBusinessSetupProfile): Errors {
  if (step === 'identity') {
    const errors: Errors = {};
    if (profile.businessName.trim().length < 2) errors.businessName = 'Enter the business name.';
    if (profile.founder.trim().length < 2) errors.founder = 'Enter the founder or primary operator.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.businessEmail)) errors.businessEmail = 'Enter a valid business email.';
    if (profile.phone.trim().length < 6) errors.phone = 'Enter a reachable phone number.';
    if (profile.website && !/^https?:\/\/.+\..+/.test(profile.website)) errors.website = 'Use a full website URL such as https://company.com.';
    return errors;
  }
  if (step === 'operations') {
    const errors: Errors = {};
    if (!profile.industry) errors.industry = 'Select an industry.';
    if (!profile.companySize) errors.companySize = 'Select a company size.';
    if (!profile.employees || Number(profile.employees) < 1) errors.employees = 'Enter the current employee count.';
    if (profile.departments.length === 0) errors.departments = 'Choose at least one department.';
    return errors;
  }
  if (step === 'goals') {
    const errors: Errors = {};
    if (profile.businessGoals.length === 0) errors.businessGoals = 'Choose at least one business goal.';
    if (profile.aiPreferences.length === 0) errors.aiPreferences = 'Choose at least one AI preference.';
    return errors;
  }
  return {};
}

function validateAll(profile: AiBusinessSetupProfile): Errors {
  return { ...validateStep('identity', profile), ...validateStep('operations', profile), ...validateStep('goals', profile) };
}

function toOption(value: string) {
  return { label: value, value };
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
