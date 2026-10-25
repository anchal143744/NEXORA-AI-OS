'use client';

import { ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uxAudit } from '@/lib/production-ui';

export function GlobalUxAudit() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global UX Audit</CardTitle>
        <p className="text-sm text-graphite-400">CRM, HR, Finance, AI Agents, Analytics and Command Center reviewed for consistent, premium usability.</p>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-3">
        {uxAudit.map((item) => (
          <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><ClipboardCheck className="size-4 text-gold-200" />{item.workspace}</div>
              <Badge variant="success">{item.score}%</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{item.finding}</p>
            <p className="mt-3 text-xs text-gold-100">{item.action}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
