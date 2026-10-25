import { CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function TaskCard({
  title,
  owner,
  due,
  complete = false,
}: {
  title: string;
  owner?: string;
  due?: string;
  complete?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        {complete ? <CheckCircle2 className="mt-0.5 size-5 text-emerald-200" /> : <Circle className="mt-0.5 size-5 text-graphite-500" />}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {owner ? <Badge variant="neutral">{owner}</Badge> : null}
            {due ? <Badge variant="info">{due}</Badge> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
