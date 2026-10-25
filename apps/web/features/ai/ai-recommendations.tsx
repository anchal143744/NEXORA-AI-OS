'use client';

import { ArrowRight, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AiRecommendation } from '@/types/ai-copilot';

export function AiRecommendationList({ recommendations }: { recommendations: AiRecommendation[] }) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/12 bg-white/[0.035] p-4 text-sm leading-6 text-graphite-400">
        No recommendations yet. Ask the copilot for risks, opportunities, forecasts or automations.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recommendations.map((recommendation) => (
        <Card key={recommendation.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lightbulb className="size-4 text-gold-100" />
                {recommendation.title}
              </CardTitle>
              <Badge variant={recommendation.priority === 'critical' ? 'warning' : recommendation.priority === 'high' ? 'default' : 'neutral'}>
                {recommendation.priority}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <p className="text-sm leading-6 text-graphite-400">{recommendation.description}</p>
            <p className="text-xs leading-5 text-graphite-500">{recommendation.impact}</p>
            {recommendation.action?.href ? (
              <Button asChild variant="outline" size="sm" disabled={recommendation.action.status === 'restricted'}>
                <a href={recommendation.action.href}>
                  {recommendation.action.label}
                  <ArrowRight className="size-3.5" />
                </a>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
