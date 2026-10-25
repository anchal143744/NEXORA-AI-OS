'use client';

import { BarChart3, RefreshCw, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-states';
import type { ExecutiveBriefing } from '@/types/ai-copilot';

export function ExecutiveBriefingCard({
  briefing,
  loading,
  onRefresh,
}: {
  briefing?: ExecutiveBriefing;
  loading: boolean;
  onRefresh: () => void;
}) {
  if (loading && !briefing) {
    return (
      <Card>
        <CardContent className="p-4">
          <LoadingState variant="ai" label="Generating executive briefing" />
        </CardContent>
      </Card>
    );
  }

  if (!briefing) {
    return (
      <Alert title="Executive briefing unavailable" variant="warning">
        Connect workspace context or retry once backend AI services are reachable.
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge>
              <Sparkles className="size-3" />
              {briefing.source === 'backend' ? 'Backend AI' : 'Workspace context'}
            </Badge>
            <CardTitle className="mt-3 text-sm">{briefing.title}</CardTitle>
          </div>
          <Button variant="icon" size="icon" onClick={onRefresh} aria-label="Refresh executive briefing">
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="rounded-lg border border-gold-500/20 bg-gold-500/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-gold-50">Business health score</span>
            <span className="text-3xl font-semibold text-white">{briefing.healthScore ?? 'Not scored'}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-gold-50/82">{briefing.summary}</p>
        </div>
        <BriefingList icon={<TrendingUp className="size-4" />} title="Highlights" items={briefing.highlights} />
        <BriefingList icon={<ShieldCheck className="size-4" />} title="Risks" items={briefing.risks} />
        <BriefingList icon={<BarChart3 className="size-4" />} title="Opportunities" items={briefing.opportunities} />
      </CardContent>
    </Card>
  );
}

function BriefingList({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-graphite-500">
        <span className="text-gold-100">{icon}</span>
        {title}
      </div>
      <div className="mt-2 space-y-2">
        {items.map((item, index) => (
          <div key={String(index)} className="rounded-md border border-white/10 bg-white/[0.045] p-3 text-sm leading-6 text-graphite-300">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
