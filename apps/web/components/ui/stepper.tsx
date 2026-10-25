import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StepperStep = {
  id: string;
  label: string;
  description?: string;
};

export function Stepper({
  steps,
  currentStep,
  className,
}: {
  steps: StepperStep[];
  currentStep: number;
  className?: string;
}) {
  return (
    <nav aria-label="Progress" className={cn('grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]', className)}>
      {steps.map((step, index) => {
        const complete = index < currentStep;
        const active = index === currentStep;

        return (
          <div key={step.id} className={cn('rounded-lg border p-3 transition duration-200', active ? 'border-gold-500/35 bg-gold-500/10' : 'border-white/10 bg-white/[0.045]')}>
            <div className="flex items-start gap-3">
              <span className={cn('grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold', complete ? 'border-emerald-400/40 bg-emerald-400/14 text-emerald-100' : active ? 'border-gold-500/40 bg-gold-500 text-graphite-990' : 'border-white/10 bg-white/[0.06] text-graphite-400')}>
                {complete ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">{step.label}</span>
                {step.description ? <span className="mt-1 block text-xs leading-5 text-graphite-400">{step.description}</span> : null}
              </span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
