'use client';

import { Accessibility } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { accessibilityChecks } from '@/lib/production-ui';

export function AccessibilityEnhancement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accessibility Enhancement</CardTitle>
        <p className="text-sm text-graphite-400">WCAG, keyboard navigation, screen reader support and contrast checks for RC1.</p>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-4">
        {accessibilityChecks.map((check) => (
          <article key={check.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Accessibility className="mb-3 size-4 text-gold-200" />
            <div className="text-sm font-semibold text-white">{check.label}</div>
            <Badge className="mt-3" variant="success">{check.standard}</Badge>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{check.evidence}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
