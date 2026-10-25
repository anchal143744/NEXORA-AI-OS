'use client';

import { Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePeopleWorkspaceStore } from '@/stores/people-workspace-store';

export function GoalsReviews() {
  const goals = usePeopleWorkspaceStore((state) => state.goals);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Goals and Reviews</CardTitle>
        <CardDescription>Employee goals, team goals, review cycles and progress tracking.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-4">
        {goals.map((goal) => (
          <article key={goal.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Target className="size-4 text-gold-200" />
            <div className="mt-3 text-sm font-semibold text-white">{goal.title}</div>
            <div className="mt-1 text-xs text-graphite-400">{goal.owner} - {goal.cycle}</div>
            <Badge className="mt-3" variant="neutral">{goal.scope}</Badge>
            <div className="mt-4 h-2 rounded-full bg-white/[0.08]">
              <div className="h-2 rounded-full bg-gold-400" style={{ width: String(goal.progress) + '%' }} />
            </div>
            <div className="mt-2 text-xs text-graphite-400">{goal.progress}% complete</div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
