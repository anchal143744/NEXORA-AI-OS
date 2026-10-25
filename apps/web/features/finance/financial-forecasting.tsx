'use client';

import { LineChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { currency } from '@/lib/finance-workspace';
import { useFinanceWorkspaceStore } from '@/stores/finance-workspace-store';

export function FinancialForecasting() {
  const forecasts = useFinanceWorkspaceStore((state) => state.forecasts);
  return (
    <Card>
      <CardHeader>
        <Badge><LineChart className="size-3" />Financial Forecasting</Badge>
        <CardTitle className="mt-2">Monthly, quarterly and annual forecast scenarios.</CardTitle>
        <CardDescription>Revenue, expenses, profit and cash flow explained simply.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-3">
        {forecasts.map((forecast) => (
          <article key={forecast.period} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between">
              <div className="capitalize text-sm font-semibold text-white">{forecast.period}</div>
              <Badge variant="success">{forecast.confidence}% confidence</Badge>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-graphite-300">
              <div className="flex justify-between"><span>Revenue</span><span className="text-white">{currency(forecast.revenue)}</span></div>
              <div className="flex justify-between"><span>Expenses</span><span className="text-white">{currency(forecast.expenses)}</span></div>
              <div className="flex justify-between"><span>Profit</span><span className="text-white">{currency(forecast.profit)}</span></div>
              <div className="flex justify-between"><span>Cash Flow</span><span className="text-white">{currency(forecast.cashFlow)}</span></div>
            </div>
            <Badge className="mt-3" variant="neutral">{forecast.scenario.replace('_', ' ')}</Badge>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
