'use client';

import { Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { useOnboardingStore } from '@/stores/onboarding-store';

const agents = ['Executive Agent', 'Sales Agent', 'Finance Agent', 'Operations Agent', 'HR Agent', 'Customer Success Agent'];

export function AiSetupExperience() {
  const aiProfile = useOnboardingStore((state) => state.aiProfile);
  const setAiProfile = useOnboardingStore((state) => state.setAiProfile);
  const completeStep = useOnboardingStore((state) => state.completeStep);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot className="size-4 text-gold-300" />AI Setup Experience</CardTitle>
        <CardDescription>Choose the first AI posture and agent coverage. Execution remains bound by approvals and tenant permissions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Select
            value={aiProfile.copilotTone}
            onChange={(event) => setAiProfile({ ...aiProfile, copilotTone: event.target.value as typeof aiProfile.copilotTone })}
            options={[{ label: 'Executive', value: 'executive' }, { label: 'Operator', value: 'operator' }, { label: 'Analyst', value: 'analyst' }]}
            aria-label="Copilot tone"
          />
          <Select
            value={aiProfile.automationLevel}
            onChange={(event) => setAiProfile({ ...aiProfile, automationLevel: event.target.value as typeof aiProfile.automationLevel })}
            options={[{ label: 'Recommend only', value: 'recommend' }, { label: 'Approval required', value: 'approval_required' }, { label: 'Auto execute low risk', value: 'auto_low_risk' }]}
            aria-label="Automation level"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {agents.map((agent) => {
            const selected = aiProfile.enabledAgents.includes(agent);
            return (
              <button
                key={agent}
                type="button"
                onClick={() => setAiProfile({ ...aiProfile, enabledAgents: selected ? aiProfile.enabledAgents.filter((item) => item !== agent) : [...aiProfile.enabledAgents, agent] })}
                className="rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-graphite-200 transition hover:bg-white/[0.07] focus-visible:premium-focus"
              >
                {selected ? <Badge>{agent}</Badge> : agent}
              </button>
            );
          })}
        </div>
        <Button onClick={() => { completeStep('ai'); setCurrentStep('workspace'); }}><Sparkles className="size-4" />Continue to workspace generation</Button>
      </CardContent>
    </Card>
  );
}
