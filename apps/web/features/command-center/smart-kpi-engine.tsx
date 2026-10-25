'use client';

import { ArrowUpRight, Gauge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCommandCenterStore } from '@/stores/command-center-store';

export function SmartKpiEngine() {
  const kpis = useCommandCenterStore((state) => state.kpis);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><Gauge className="size-4 text-gold-300" />Smart KPI Engine</div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs uppercase text-graphite-500">{kpi.label}</div>
              <Badge variant={kpi.status === 'healthy' ? 'success' : 'warning'}>{kpi.status}</Badge>
            </div>
            <div className="mt-3 text-3xl font-semibold text-white">{kpi.value}</div>
            <div className="mt-2 flex items-center gap-1 text-xs text-gold-200"><ArrowUpRight className="size-3" />{kpi.trend}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
