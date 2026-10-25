'use client';

import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GrowthStatus } from '@/types/growth-program';

const statusVariant: Record<GrowthStatus, 'default' | 'neutral' | 'success' | 'warning' | 'info'> = {
  healthy: 'success',
  accelerating: 'default',
  watch: 'warning',
  blocked: 'neutral',
};

export function GrowthPanel({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="mt-2 text-sm leading-6 text-graphite-400">{description}</p>
          </div>
          {badge ? <Badge variant="info">{badge}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function GrowthStatusBadge({ status }: { status: GrowthStatus }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}

export function GrowthScoreBar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-white/10">
      <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-primary-300" style={{ width: value + '%' }} />
    </div>
  );
}
