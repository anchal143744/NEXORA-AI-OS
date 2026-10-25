import type { ReactNode } from 'react';
import { Stepper, type StepperStep } from '@/components/ui/stepper';

export function SetupWizardLayout({
  steps,
  currentStep,
  children,
}: {
  steps: StepperStep[];
  currentStep: number;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-graphite-990 p-4 text-graphite-50 md:p-6">
      <div className="mx-auto grid w-full max-w-6xl gap-6">
        <Stepper steps={steps} currentStep={currentStep} />
        <section className="rounded-xl border border-white/10 bg-white/[0.055] p-5 shadow-hairline backdrop-blur-shell md:p-7">{children}</section>
      </div>
    </main>
  );
}
