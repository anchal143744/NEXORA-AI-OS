'use client';

import { AlertTriangle, FileCheck2, LockKeyhole, ShieldCheck, Vault } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trustMetrics } from '@/lib/enterprise-trust';

const icons = [ShieldCheck, AlertTriangle, AlertTriangle, FileCheck2, Vault];

export function EnterpriseTrustHome() {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {trustMetrics.map((metric, index) => {
        const Icon = icons[index] ?? LockKeyhole;
        return (
          <Card key={metric.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{metric.label}</CardTitle>
                <Icon className="size-4 text-gold-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">{metric.value}</div>
              <p className="mt-2 text-xs leading-5 text-graphite-400">{metric.detail}</p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
