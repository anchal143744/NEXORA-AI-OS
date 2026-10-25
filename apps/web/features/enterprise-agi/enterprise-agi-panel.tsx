import { Bot, CheckCircle2, Network, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PanelMetric {
  label: string;
  value: string;
}

interface PanelItem {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  detail: string;
  status: string;
}

export function EnterpriseAgiPanel({
  title,
  description,
  metrics,
  items,
}: {
  title: string;
  description: string;
  metrics: PanelMetric[];
  items: PanelItem[];
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-white/10 bg-white/[0.035]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge variant="info"><Bot className="size-3" />Enterprise AGI</Badge>
            <CardTitle className="mt-3 text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-md border border-white/10 bg-black/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-graphite-400">{metric.label}</p>
                <p className="mt-1 text-sm font-semibold text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 pt-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="neutral"><Network className="size-3" />{item.eyebrow}</Badge>
              <Badge variant={item.status === 'healthy' ? 'success' : item.status === 'watch' ? 'warning' : 'default'}>
                <CheckCircle2 className="size-3" />{item.status}
              </Badge>
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-graphite-300">{item.description}</p>
            <p className="mt-3 rounded-md border border-gold-400/20 bg-gold-400/10 p-3 text-sm leading-6 text-gold-100">
              <Sparkles className="mr-1 inline size-3" />{item.detail}
            </p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
