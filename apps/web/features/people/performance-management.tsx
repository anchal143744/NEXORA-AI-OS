'use client';

import { Star, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePeopleWorkspaceStore } from '@/stores/people-workspace-store';

export function PerformanceManagement() {
  const reviews = usePeopleWorkspaceStore((state) => state.reviews);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Management</CardTitle>
        <CardDescription>Performance reviews, feedback, ratings and development plans.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-3">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Star className="size-4 text-gold-200" />
            <div className="mt-3 text-sm font-semibold text-white">{review.employeeName}</div>
            <div className="mt-1 text-xs text-graphite-400">{review.role} - {review.cycle}</div>
            <Badge className="mt-3" variant={review.rating === 'exceptional' ? 'success' : review.rating === 'strong' ? 'info' : 'neutral'}>{review.rating.replace('_', ' ')}</Badge>
            <p className="mt-3 text-xs leading-5 text-graphite-300">{review.feedback}</p>
            <div className="mt-3 rounded-md border border-white/10 bg-graphite-950/60 p-3 text-xs text-graphite-400"><TrendingUp className="mr-1 inline size-3 text-gold-200" />{review.developmentPlan}</div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
