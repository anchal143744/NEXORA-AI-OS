import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AiInsightCard({
  title,
  insight,
  confidence,
}: {
  title: string;
  insight: string;
  confidence?: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="size-4 text-gold-100" />
          {title}
        </CardTitle>
        {typeof confidence === 'number' ? <Badge variant="info">{confidence}% confidence</Badge> : null}
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-graphite-300">{insight}</p>
      </CardContent>
    </Card>
  );
}
