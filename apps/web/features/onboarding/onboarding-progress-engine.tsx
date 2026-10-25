'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { onboardingSteps, useOnboardingStore } from '@/stores/onboarding-store';

export function OnboardingProgressEngine() {
  const currentStep = useOnboardingStore((state) => state.currentStep);
  const completedSteps = useOnboardingStore((state) => state.completedSteps);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);

  return (
    <nav aria-label="Onboarding progress" className="rounded-xl border border-white/10 bg-white/[0.055] p-3">
      <ol className="grid gap-2 md:grid-cols-3 xl:grid-cols-9">
        {onboardingSteps.map((step, index) => {
          const active = currentStep === step.key;
          const complete = completedSteps.includes(step.key);
          return (
            <li key={step.key}>
              <button
                type="button"
                onClick={() => setCurrentStep(step.key)}
                className={cn('flex h-full w-full items-start gap-2 rounded-lg border p-3 text-left transition focus-visible:premium-focus', active ? 'border-gold-500/40 bg-gold-500/12' : 'border-white/10 bg-white/[0.035] hover:bg-white/[0.06]')}
              >
                <span className={cn('grid size-6 shrink-0 place-items-center rounded-sm text-xs font-semibold', complete ? 'bg-gold-500 text-graphite-990' : 'bg-white/[0.08] text-graphite-300')}>
                  {complete ? <Check className="size-3" /> : index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-white">{step.label}</span>
                  <span className="hidden text-[11px] leading-4 text-graphite-400 xl:block">{step.description}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
