import { autonomousOperationsNavigation } from '@/lib/autonomous-operations';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function AutonomousOperationsNavigation() {
  return (
    <Card>
      <CardContent className="grid gap-3 pt-5 md:grid-cols-2 xl:grid-cols-4">
        {autonomousOperationsNavigation.map((group) => (
          <div key={group.group} className="rounded-md border border-white/10 bg-black/15 p-4">
            <Badge variant="neutral">{group.group}</Badge>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="rounded-sm border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-graphite-200">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
