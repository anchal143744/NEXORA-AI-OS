'use client';

import { Bot, Boxes, Workflow } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDiscoveryStore } from '@/stores/discovery-store';

export function WorkspaceRecommendationPanel() {
  const blueprint = useDiscoveryStore((state) => state.blueprint);

  if (!blueprint) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workspace Recommendations</CardTitle>
          <CardDescription>Run blueprint generation to see module, agent and automation recommendations.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <RecommendationColumn icon={Boxes} title="AI Workspace Recommendation" items={blueprint.modules} />
      <RecommendationColumn icon={Bot} title="AI Agent Recommendation Engine" items={blueprint.agents} />
      <RecommendationColumn icon={Workflow} title="Automation Recommendation Engine" items={blueprint.automations} />
    </div>
  );
}

function RecommendationColumn({ icon: Icon, title, items }: { icon: typeof Bot; title: string; items: { label: string; reason: string; priority: string }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Icon className="size-4 text-gold-300" />{title}</CardTitle>
        <CardDescription>{items.length} recommendations generated from the business profile.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.045] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-white">{item.label}</div>
              <Badge variant={item.priority === 'critical' ? 'warning' : 'neutral'}>{item.priority}</Badge>
            </div>
            <div className="mt-2 text-xs leading-5 text-graphite-400">{item.reason}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
