'use client';

import Link from 'next/link';
import { BadgeCheck, BarChart3, Brain, Building2, DollarSign, LineChart, RefreshCw, Users } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-states';
import { useAnalyticsSummary } from '@/hooks/use-analytics-summary';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { useAuthStore } from '@/stores/auth-store';
import type { AnalyticsMetricUnit, AnalyticsSummary, AnalyticsSummaryMetric } from '@/types/analytics-summary';

export function V1AnalyticsWorkspace() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const authStatus = useAuthStore((state) => state.status);
  const summaryQuery = useAnalyticsSummary();
  const summary = summaryQuery.data;
  const isSessionLoading = !hydrated || (hydrated && authStatus === 'unknown');

  return (
    <EnterpriseShell>
      <div className="space-y-5">
        <section className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-primary-500/[0.08] p-5 shadow-hairline">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <Badge>
                <BarChart3 className="size-3" />
                V1 Analytics
              </Badge>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">A real operating summary from authorized workspace data.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">
                Analytics is calculated from CRM, Finance, People, Projects and activity records. Empty metrics stay empty instead of being filled with demo numbers.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">
                <BadgeCheck className="size-3" />
                Backend summary
              </Badge>
              <Button asChild variant="outline">
                <Link href="/ai">
                  <Brain className="size-4" />
                  Ask AI
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {isSessionLoading ? (
          <Card>
            <CardContent className="pt-5">
              <LoadingState variant="ai" label="Restoring authenticated analytics session" />
            </CardContent>
          </Card>
        ) : null}

        {hydrated && authStatus === 'anonymous' ? (
          <ErrorState title="Sign in required" description="Analytics are protected business data. Sign in before opening this V1 module." />
        ) : null}

        {summaryQuery.isLoading ? (
          <Card>
            <CardContent className="pt-5">
              <LoadingState variant="ai" label="Loading authorized analytics summary" />
            </CardContent>
          </Card>
        ) : null}

        {summaryQuery.isError ? (
          <ErrorState
            title="Analytics could not load"
            description={summaryQuery.error.message}
            actionLabel="Retry analytics"
            onAction={() => void summaryQuery.refetch()}
          />
        ) : null}

        {summary ? (
          <>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {summary.metrics.map((metric) => (
                <MetricCard key={metric.key} metric={metric} />
              ))}
            </div>

            {summary.empty ? (
              <EmptyState
                title="No analytics source data yet"
                description="Create CRM, finance, people or project records and this dashboard will calculate real workspace metrics from the database."
                icon={LineChart}
              />
            ) : (
              <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                <ModuleCard title="Revenue and pipeline" icon={DollarSign} rows={[
                  ['Revenue', formatValue(summary.modules.finance.revenue, 'currency')],
                  ['Expenses', formatValue(summary.modules.finance.expenses, 'currency')],
                  ['Profit', formatValue(summary.modules.finance.profit, 'currency')],
                  ['Pipeline', formatValue(summary.modules.crm.pipelineValue, 'currency')],
                  ['Weighted pipeline', formatValue(summary.modules.crm.weightedPipeline, 'currency')],
                  ['Win rate', formatValue(summary.modules.crm.winRate, 'percent')],
                ]} />
                <ModuleCard title="Operations footprint" icon={Building2} rows={[
                  ['Leads', String(summary.modules.crm.leads)],
                  ['Customers', String(summary.modules.crm.customers)],
                  ['Opportunities', String(summary.modules.crm.opportunities)],
                  ['Projects', String(summary.modules.projects.projects)],
                  ['Tasks', String(summary.modules.projects.tasks)],
                  ['Activity events', String(summary.modules.activity.volume)],
                ]} />
                <ModuleCard title="People" icon={Users} rows={[
                  ['Employees', String(summary.modules.hr.employees)],
                  ['Departments', String(summary.modules.hr.departments)],
                ]} />
                <Card>
                  <CardHeader>
                    <CardTitle>Data freshness</CardTitle>
                    <CardDescription>Generated from the backend analytics service.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4 text-sm text-graphite-300">
                      Summary generated at {summary.generatedAt.slice(0, 19).replace('T', ' ')} UTC.
                    </div>
                    <Button className="mt-4" variant="outline" onClick={() => void summaryQuery.refetch()} disabled={summaryQuery.isFetching}>
                      <RefreshCw className={'size-4 ' + (summaryQuery.isFetching ? 'animate-spin' : '')} />
                      Refresh metrics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            <Alert title="Analytics V1 boundary" variant="info">
              Report scheduling, custom KPI alerts and advanced forecasting are not exposed as verified V1 workflows yet, so this page only presents database-backed summary analytics.
            </Alert>
          </>
        ) : null}
      </div>
    </EnterpriseShell>
  );
}

function MetricCard({ metric }: { metric: AnalyticsSummaryMetric }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-2xl">{formatValue(metric.value, metric.unit)}</CardTitle>
        <p className="text-xs text-graphite-500">Source: {metric.source}</p>
      </CardHeader>
    </Card>
  );
}

function ModuleCard({ title, icon: Icon, rows }: { title: string; icon: typeof BarChart3; rows: Array<[string, string]> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-4 text-gold-100" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
            <span className="text-graphite-400">{label}</span>
            <span className="font-medium text-white">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function formatValue(value: number, unit: AnalyticsMetricUnit) {
  if (unit === 'currency') return '$' + Math.round(value).toLocaleString('en-US');
  if (unit === 'percent') return String(Math.round(value)) + '%';
  return String(value);
}
