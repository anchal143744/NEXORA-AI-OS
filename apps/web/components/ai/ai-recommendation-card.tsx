import { ArrowRight, Lightbulb } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AiRecommendationCard({
  title,
  recommendation,
  action,
}: {
  title: string;
  recommendation: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-gold-500/18 bg-gold-500/8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Lightbulb className="size-4 text-gold-100" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-graphite-300">{recommendation}</p>
        {action ?? (
          <Button className="mt-4" variant="outline" size="sm">
            Review recommendation
            <ArrowRight className="size-3.5" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
