'use client';

import { Brain, Building2, Network, PlugZap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-states';
import { useProfileBusiness } from '@/hooks/use-workspace-intelligence';
import { useDiscoveryStore } from '@/stores/discovery-store';

export function AiBusinessProfilingEngine() {
  const answers = useDiscoveryStore((state) => state.answers);
  const profile = useDiscoveryStore((state) => state.profile);
  const completeStep = useDiscoveryStore((state) => state.completeStep);
  const setCurrentStep = useDiscoveryStore((state) => state.setCurrentStep);
  const profileBusiness = useProfileBusiness();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Brain className="size-4 text-gold-300" />AI Business Profiling Engine</CardTitle>
        <CardDescription>Detects industry, team operating model, software stack and AI maturity from discovery answers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => profileBusiness.mutate(answers, { onSuccess: () => { completeStep('intelligence'); setCurrentStep('preview'); } })}
          disabled={profileBusiness.isPending}
        >
          {profileBusiness.isPending ? <LoadingState variant="ai" label="Profiling" /> : 'Generate AI business profile'}
        </Button>
        {profile ? (
          <div className="grid gap-3 md:grid-cols-3">
            <ProfileCard icon={Building2} title="Industry Detection" value={profile.industry.industry} detail={profile.industry.confidence + '% confidence'} tags={profile.industry.signals} />
            <ProfileCard icon={Network} title="Team Intelligence" value={profile.team.operatingModel} detail={'Risk: ' + profile.team.collaborationRisk} tags={profile.team.recommendedRoles} />
            <ProfileCard icon={PlugZap} title="Software Discovery" value={profile.software.detectedStack.length + ' tools'} detail="Integration priorities mapped" tags={profile.software.integrationPriorities} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ProfileCard({ icon: Icon, title, value, detail, tags }: { icon: typeof Brain; title: string; value: string; detail: string; tags: string[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
      <Icon className="mb-3 size-4 text-gold-300" />
      <div className="text-xs uppercase text-graphite-500">{title}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-graphite-400">{detail}</div>
      <div className="mt-3 flex flex-wrap gap-1.5">{tags.slice(0, 4).map((tag) => <Badge key={tag} variant="neutral">{tag}</Badge>)}</div>
    </div>
  );
}
