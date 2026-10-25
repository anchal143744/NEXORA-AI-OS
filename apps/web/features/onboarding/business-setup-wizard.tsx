'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useSaveBusinessProfile } from '@/hooks/use-onboarding-actions';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { businessProfileSchema, type BusinessProfileFormValues } from './onboarding-schemas';

const goalOptions = ['Revenue growth', 'Operational automation', 'Customer retention', 'Cost optimization', 'Global expansion'];

export function BusinessSetupWizard() {
  const businessProfile = useOnboardingStore((state) => state.businessProfile);
  const setBusinessProfile = useOnboardingStore((state) => state.setBusinessProfile);
  const completeStep = useOnboardingStore((state) => state.completeStep);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const saveProfile = useSaveBusinessProfile();
  const form = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      organizationName: businessProfile.organizationName ?? '',
      businessType: businessProfile.businessType ?? 'Enterprise',
      industry: businessProfile.industry ?? 'SaaS',
      country: businessProfile.country ?? 'United States',
      revenueRange: businessProfile.revenueRange ?? '1M-10M',
      teamSize: businessProfile.teamSize ?? '51-200',
      goals: businessProfile.goals ?? ['Revenue growth'],
    },
  });

  const selectedGoals = form.watch('goals');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Building2 className="size-4 text-gold-300" />Business Setup Wizard</CardTitle>
        <CardDescription>Classify the company so NEXORA can generate modules, KPIs, navigation, workflows and agents.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            setBusinessProfile(values);
            saveProfile.mutate(values, {
              onSuccess: () => {
                completeStep('business');
                setCurrentStep('ai');
              },
            });
          })}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Organization name" {...form.register('organizationName')} invalid={Boolean(form.formState.errors.organizationName)} />
            <Select options={[{ label: 'Enterprise', value: 'Enterprise' }, { label: 'Startup', value: 'Startup' }, { label: 'Agency', value: 'Agency' }, { label: 'Manufacturing', value: 'Manufacturing' }]} {...form.register('businessType')} />
            <Select options={[{ label: 'SaaS', value: 'SaaS' }, { label: 'Retail', value: 'Retail' }, { label: 'Healthcare', value: 'Healthcare' }, { label: 'Manufacturing', value: 'Manufacturing' }, { label: 'Finance', value: 'Finance' }]} {...form.register('industry')} />
            <Select options={[{ label: 'United States', value: 'United States' }, { label: 'India', value: 'India' }, { label: 'United Kingdom', value: 'United Kingdom' }, { label: 'United Arab Emirates', value: 'United Arab Emirates' }]} {...form.register('country')} />
            <Select options={[{ label: '0-250K', value: '0-250K' }, { label: '250K-1M', value: '250K-1M' }, { label: '1M-10M', value: '1M-10M' }, { label: '10M+', value: '10M+' }]} {...form.register('revenueRange')} />
            <Select options={[{ label: '1-10', value: '1-10' }, { label: '11-50', value: '11-50' }, { label: '51-200', value: '51-200' }, { label: '201+', value: '201+' }]} {...form.register('teamSize')} />
          </div>
          <div>
            <div className="mb-2 text-xs font-medium text-graphite-400">Business goals</div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {goalOptions.map((goal) => {
                const checked = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => form.setValue('goals', checked ? selectedGoals.filter((item) => item !== goal) : [...selectedGoals, goal], { shouldValidate: true })}
                    className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.045] p-3 text-left text-sm text-graphite-200 transition hover:bg-white/[0.07] focus-visible:premium-focus"
                  >
                    <span className="grid size-5 place-items-center rounded-sm border border-gold-500/35 text-gold-300">{checked ? <Check className="size-3" /> : null}</span>
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>
          {Object.values(form.formState.errors).length ? <p className="text-xs text-red-200">Complete the required business profile fields.</p> : null}
          {saveProfile.error ? <p className="text-xs text-red-200">{saveProfile.error.message}</p> : null}
          <Button type="submit" disabled={saveProfile.isPending}>{saveProfile.isPending ? 'Saving business profile' : 'Continue to AI setup'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
