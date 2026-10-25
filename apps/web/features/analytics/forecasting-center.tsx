'use client';

import { LineChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { forecasts } from '@/lib/analytics-workspace';

export function ForecastingCenter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forecasting Center</CardTitle>
        <p className="text-sm text-graphite-400">Revenue, hiring, budget, demand and productivity forecasting with clear explanations.</p>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {forecasts.map((forecast) => (
          <article key={forecast.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <LineChart className="mb-3 size-4 text-gold-200" />
            <div className="text-sm font-semibold capitalize text-white">{forecast.type} Forecasting</div>
            <div className="mt-2 text-2xl font-semibold text-white">{forecast.value}</div>
            <Badge className="mt-3">{forecast.confidence}% confidence</Badge>
            <p className="mt-3 text-xs leading-5 text-graphite-400">{forecast.explanation}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
