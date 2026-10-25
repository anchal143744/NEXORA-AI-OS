'use client';

import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { currency } from '@/lib/finance-workspace';
import { useFinanceWorkspaceStore } from '@/stores/finance-workspace-store';

export function RevenueManagement() {
  const revenue = useFinanceWorkspaceStore((state) => state.revenue);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Management</CardTitle>
        <CardDescription>Revenue tracking, categories, recognition and analytics in plain language.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {revenue.map((record) => (
          <article key={record.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <TrendingUp className="size-4 text-gold-200" />
                <div className="font-semibold text-white">{record.category}</div>
                <Badge variant="neutral">{record.recognitionStatus.replace('_', ' ')}</Badge>
              </div>
              <div className="mt-1 text-sm text-graphite-300">{record.customerName} - {record.period}</div>
              <div className="mt-2 text-xs text-graphite-400">{record.growthSignal}</div>
            </div>
            <div className="text-base font-semibold text-white">{currency(record.amount)}</div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
