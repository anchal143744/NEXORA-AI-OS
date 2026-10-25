import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DigitalTwinStatus } from '@/types/enterprise-digital-twin';

export interface DigitalTwinPanelItem {
  title: string;
  value?: string;
  meta?: string;
  detail: string;
  score?: number;
  status?: DigitalTwinStatus;
}

const statusVariant: Record<DigitalTwinStatus, 'success' | 'warning' | 'info' | 'neutral'> = {
  healthy: 'success',
  accelerating: 'info',
  watch: 'warning',
  critical: 'warning',
};

export function DigitalTwinPanel({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: DigitalTwinPanelItem[];
}) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="info">{eyebrow}</Badge>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.title} className="rounded-md border border-white/10 bg-black/15 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  {item.meta ? <p className="mt-1 text-xs leading-5 text-graphite-400">{item.meta}</p> : null}
                </div>
                {item.status ? <Badge variant={statusVariant[item.status]}>{item.status}</Badge> : null}
              </div>
              {item.value ? <p className="mt-3 text-2xl font-semibold tracking-normal text-gold-100">{item.value}</p> : null}
              {typeof item.score === 'number' ? (
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gold-300" style={{ width: `${item.score}%` }} />
                </div>
              ) : null}
              <p className="mt-3 text-sm leading-6 text-graphite-300">{item.detail}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
