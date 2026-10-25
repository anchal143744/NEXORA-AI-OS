'use client';

import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MarketplaceStatus } from '@/types/ecosystem-marketplace';

const statusVariant: Record<MarketplaceStatus, 'default' | 'neutral' | 'success' | 'warning' | 'info'> = {
  featured: 'default',
  verified: 'success',
  active: 'info',
  beta: 'warning',
  review: 'neutral',
};

export function EcosystemPanel({
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

export function StatusBadge({ status }: { status: MarketplaceStatus }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}

export function EcosystemScoreBar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-white/10">
      <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-primary-300" style={{ width: value + '%' }} />
    </div>
  );
}
