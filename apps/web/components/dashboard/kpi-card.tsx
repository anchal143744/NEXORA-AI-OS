import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function KpiCard({
  label,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
}) {
  const positive = trend === 'up';
  const negative = trend === 'down';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase text-graphite-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
          </div>
          {Icon ? <Icon className="size-5 text-gold-100" /> : null}
        </div>
        {change ? (
          <div className={cn('mt-4 inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-xs', positive && 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100', negative && 'border-red-400/20 bg-red-400/10 text-red-100', trend === 'neutral' && 'border-white/10 bg-white/[0.06] text-graphite-300')}>
            {positive ? <ArrowUpRight className="size-3" /> : negative ? <ArrowDownRight className="size-3" /> : null}
            {change}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
