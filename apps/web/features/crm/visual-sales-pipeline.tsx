'use client';

import type { DragEvent } from 'react';
import { LayoutGrid, MoveRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { currency, opportunityStages } from '@/lib/crm-workspace';
import { useMoveOpportunityStage } from '@/hooks/use-crm-workspace-actions';
import { useCrmWorkspaceStore } from '@/stores/crm-workspace-store';
import type { OpportunityStage } from '@/types/crm-workspace';

export function VisualSalesPipeline() {
  const opportunities = useCrmWorkspaceStore((state) => state.opportunities);
  const stageFilter = useCrmWorkspaceStore((state) => state.selectedStage);
  const setStage = useCrmWorkspaceStore((state) => state.setSelectedStage);
  const moveStage = useMoveOpportunityStage();

  const onDrop = (event: DragEvent<HTMLDivElement>, stage: OpportunityStage) => {
    const opportunityId = event.dataTransfer.getData('text/opportunity-id');
    if (opportunityId) moveStage.mutate({ opportunityId, stage });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Badge><LayoutGrid className="size-3" />Visual Sales Pipeline</Badge>
          <CardTitle className="mt-2">Drag opportunities across revenue stages.</CardTitle>
          <CardDescription>Kanban pipeline with real-time local state updates and stage-aware forecast calculations.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setStage('all')} className={'rounded-md border px-3 py-2 text-xs ' + (stageFilter === 'all' ? 'border-gold-500/45 bg-gold-500/15 text-gold-100' : 'border-white/10 text-graphite-300')}>All</button>
          {opportunityStages.map((stage) => (
            <button key={stage.id} onClick={() => setStage(stage.id)} className={'rounded-md border px-3 py-2 text-xs ' + (stageFilter === stage.id ? 'border-gold-500/45 bg-gold-500/15 text-gold-100' : 'border-white/10 text-graphite-300')}>
              {stage.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {opportunities.length === 0 ? (
          <EmptyState icon={LayoutGrid} title="No opportunities in the pipeline" description="Create opportunities from qualified leads to activate drag-and-drop stages, weighted forecast and pipeline health." />
        ) : (
        <div className="grid min-h-[420px] gap-3 overflow-x-auto pb-1 xl:grid-cols-7">
          {opportunityStages.map((stage) => {
            const stageDeals = opportunities.filter((opportunity) => opportunity.stage === stage.id && (stageFilter === 'all' || stageFilter === stage.id));
            const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
            return (
              <div key={stage.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, stage.id)} className="min-w-[220px] rounded-lg border border-white/10 bg-graphite-950/70 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-white">{stage.label}</div>
                    <div className="mt-1 text-[11px] leading-4 text-graphite-500">{stage.description}</div>
                  </div>
                  <Badge variant="neutral">{stageDeals.length}</Badge>
                </div>
                <div className="mt-2 text-xs text-gold-100">{currency(stageValue)}</div>
                <div className="mt-3 space-y-2">
                  {stageDeals.map((deal) => (
                    <article key={deal.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/opportunity-id', deal.id)} className="cursor-grab rounded-md border border-white/10 bg-white/[0.06] p-3 active:cursor-grabbing">
                      <div className="text-sm font-medium text-white">{deal.title}</div>
                      <div className="mt-1 text-xs text-graphite-400">{deal.accountName}</div>
                      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                        <span className="text-gold-100">{currency(deal.value)}</span>
                        <span className="text-graphite-400">{deal.probability}%</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-graphite-500"><MoveRight className="size-3" />{deal.nextStep}</div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </CardContent>
    </Card>
  );
}
