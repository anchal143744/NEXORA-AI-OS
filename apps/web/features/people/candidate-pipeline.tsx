'use client';

import type { DragEvent } from 'react';
import { LayoutGrid, MoveRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMoveCandidateStage } from '@/hooks/use-people-workspace-actions';
import { candidateStages } from '@/lib/people-workspace';
import { usePeopleWorkspaceStore } from '@/stores/people-workspace-store';
import type { CandidateStage } from '@/types/people-workspace';

export function CandidatePipeline() {
  const candidates = usePeopleWorkspaceStore((state) => state.candidates);
  const filter = usePeopleWorkspaceStore((state) => state.selectedCandidateStage);
  const setFilter = usePeopleWorkspaceStore((state) => state.setSelectedCandidateStage);
  const moveStage = useMoveCandidateStage();
  const onDrop = (event: DragEvent<HTMLDivElement>, stage: CandidateStage) => {
    const candidateId = event.dataTransfer.getData('text/candidate-id');
    if (candidateId) moveStage.mutate({ candidateId, stage });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Badge><LayoutGrid className="size-3" />Candidate Pipeline</Badge>
          <CardTitle className="mt-2">Drag candidates through a simple hiring board.</CardTitle>
          <CardDescription>Applied, Screening, Interview, Assessment, Offer, Hired and Rejected.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter('all')} className={'rounded-md border px-3 py-2 text-xs ' + (filter === 'all' ? 'border-gold-500/45 bg-gold-500/15 text-gold-100' : 'border-white/10 text-graphite-300')}>All</button>
          {candidateStages.map((stage) => (
            <button key={stage.id} onClick={() => setFilter(stage.id)} className={'rounded-md border px-3 py-2 text-xs ' + (filter === stage.id ? 'border-gold-500/45 bg-gold-500/15 text-gold-100' : 'border-white/10 text-graphite-300')}>{stage.label}</button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid min-h-[420px] gap-3 overflow-x-auto pb-1 xl:grid-cols-7">
          {candidateStages.map((stage) => {
            const stageCandidates = candidates.filter((candidate) => candidate.stage === stage.id && (filter === 'all' || filter === stage.id));
            return (
              <div key={stage.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, stage.id)} className="min-w-[220px] rounded-lg border border-white/10 bg-graphite-950/70 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-white">{stage.label}</div>
                    <div className="mt-1 text-[11px] leading-4 text-graphite-500">{stage.description}</div>
                  </div>
                  <Badge variant="neutral">{stageCandidates.length}</Badge>
                </div>
                <div className="mt-3 space-y-2">
                  {stageCandidates.map((candidate) => (
                    <article key={candidate.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/candidate-id', candidate.id)} className="cursor-grab rounded-md border border-white/10 bg-white/[0.06] p-3 active:cursor-grabbing">
                      <div className="text-sm font-medium text-white">{candidate.name}</div>
                      <div className="mt-1 text-xs text-graphite-400">{candidate.role}</div>
                      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                        <span className="text-gold-100">{candidate.score} score</span>
                        <span className="text-graphite-400">{candidate.owner}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-graphite-500"><MoveRight className="size-3" />{candidate.nextStep}</div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
