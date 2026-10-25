'use client';

import { Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { responsiveTargets } from '@/lib/production-ui';

export function MobileExperienceOptimization() {
  const targets = responsiveTargets.filter((target) => target.device === 'Small Phones' || target.device === 'Large Phones');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mobile Experience Optimization</CardTitle>
        <p className="text-sm text-graphite-400">CRM, HR, Finance, AI Agents and Analytics optimized for small and large phones.</p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {targets.map((target) => (
          <article key={target.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><Smartphone className="size-4 text-gold-200" />{target.device}</div>
            <Badge className="mt-3" variant="success">{target.focus}</Badge>
            <ul className="mt-3 space-y-2 text-sm text-graphite-400">
              {target.checks.map((check) => <li key={check}>{check}</li>)}
            </ul>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
