'use client';

import { Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { navigationRefinements } from '@/lib/production-ui';

export function NavigationRefinement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation Refinement</CardTitle>
        <p className="text-sm text-graphite-400">Sidebar UX, search UX, command palette and workspace navigation refined for RC1.</p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {navigationRefinements.map((item) => (
          <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Navigation className="mb-3 size-4 text-gold-200" />
            <div className="text-sm font-semibold text-white">{item.area}</div>
            <p className="mt-2 text-xs leading-5 text-graphite-400">{item.improvement}</p>
            <Badge className="mt-3" variant="success">{item.status}</Badge>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
