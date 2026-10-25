'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Check, MessageSquareText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { departmentOptions, goalOptions, painOptions, softwareOptions } from './discovery-data';
import { useDiscoveryStore } from '@/stores/discovery-store';
import type { DiscoveryAnswerMap } from '@/types/discovery';

const schema = z.object({
  businessModel: z.string().min(4),
  primaryOffer: z.string().min(4),
  industryHint: z.string().min(2),
  teamSize: z.string().min(1),
  automationComfort: z.enum(['low', 'medium', 'high']),
  dataMaturity: z.enum(['early', 'developing', 'advanced']),
});

type FormValues = z.infer<typeof schema>;

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function BusinessDiscoveryWizard() {
  const answers = useDiscoveryStore((state) => state.answers);
  const updateAnswers = useDiscoveryStore((state) => state.updateAnswers);
  const completeStep = useDiscoveryStore((state) => state.completeStep);
  const setCurrentStep = useDiscoveryStore((state) => state.setCurrentStep);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessModel: answers.businessModel,
      primaryOffer: answers.primaryOffer,
      industryHint: answers.industryHint,
      teamSize: answers.teamSize,
      automationComfort: answers.automationComfort,
      dataMaturity: answers.dataMaturity,
    },
  });

  const save = (values: FormValues) => {
    updateAnswers(values);
    completeStep('business');
    completeStep('industry');
    completeStep('team');
    completeStep('software');
    completeStep('goals');
    setCurrentStep('intelligence');
  };

  return (
    <Card>
      <CardHeader>
        <Badge><Bot className="size-3" />Conversational onboarding</Badge>
        <CardTitle className="flex items-center gap-2"><MessageSquareText className="size-4 text-gold-300" />Business Discovery Wizard</CardTitle>
        <CardDescription>Answer in business language. NEXORA converts the profile into industry detection, team intelligence, software discovery and workspace recommendations.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit(save)}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input aria-label="Business model" placeholder="Business model" {...form.register('businessModel')} />
            <Input aria-label="Primary offer" placeholder="Primary offer" {...form.register('primaryOffer')} />
            <Select aria-label="Industry hint" options={[{ label: 'SaaS', value: 'SaaS' }, { label: 'Agency', value: 'Agency' }, { label: 'Ecommerce', value: 'Ecommerce' }, { label: 'Retail', value: 'Retail' }, { label: 'Healthcare', value: 'Healthcare' }, { label: 'Manufacturing', value: 'Manufacturing' }, { label: 'Finance', value: 'Finance' }, { label: 'Logistics', value: 'Logistics' }, { label: 'Consulting', value: 'Consulting' }]} {...form.register('industryHint')} />
            <Select aria-label="Team size" options={[{ label: '1-10', value: '1-10' }, { label: '11-50', value: '11-50' }, { label: '51-200', value: '51-200' }, { label: '201+', value: '201+' }]} {...form.register('teamSize')} />
            <Select aria-label="Automation comfort" options={[{ label: 'Recommend only', value: 'low' }, { label: 'Approval based', value: 'medium' }, { label: 'High automation trust', value: 'high' }]} {...form.register('automationComfort')} />
            <Select aria-label="Data maturity" options={[{ label: 'Early', value: 'early' }, { label: 'Developing', value: 'developing' }, { label: 'Advanced', value: 'advanced' }]} {...form.register('dataMaturity')} />
          </div>

          <DiscoveryMultiSelect title="Departments" options={departmentOptions} values={answers.departments} onChange={(values) => updateAnswers({ departments: values })} />
          <DiscoveryMultiSelect title="Current software" options={softwareOptions} values={answers.currentSoftware} onChange={(values) => updateAnswers({ currentSoftware: values })} />
          <DiscoveryMultiSelect title="Operational pain" options={painOptions} values={answers.operationalPain} onChange={(values) => updateAnswers({ operationalPain: values })} />
          <DiscoveryMultiSelect title="Strategic goals" options={goalOptions} values={answers.strategicGoals} onChange={(values) => updateAnswers({ strategicGoals: values })} />

          {Object.values(form.formState.errors).length ? <p className="text-sm text-red-200">Complete the required discovery fields.</p> : null}
          <Button type="submit">Run AI discovery</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function DiscoveryMultiSelect({ title, options, values, onChange }: { title: string; options: string[]; values: string[]; onChange: (values: string[]) => void }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-graphite-500">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(toggle(values, option))}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-graphite-200 transition hover:bg-white/[0.08] focus-visible:premium-focus"
            >
              <span className="grid size-4 place-items-center rounded-sm border border-gold-500/35 text-gold-300">{selected ? <Check className="size-3" /> : null}</span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
