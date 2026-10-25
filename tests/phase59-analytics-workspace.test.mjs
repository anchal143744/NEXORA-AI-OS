import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('Phase 59 Analytics workspace files exist', () => {
  [
    'apps/web/types/analytics-workspace.ts',
    'apps/web/lib/analytics-workspace.ts',
    'apps/web/stores/analytics-workspace-store.ts',
    'apps/web/features/analytics/analytics-workspace.tsx',
    'apps/web/features/analytics/analytics-charts.tsx',
    'apps/web/app/analytics/page.tsx',
    'apps/web/app/workspace/analytics/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Analytics navigation keeps the requested simple grouping', () => {
  const source = read('apps/web/lib/analytics-workspace.ts');
  ['Analytics', 'Dashboards', 'Reports', 'KPIs', 'Intelligence', 'Insights', 'Forecasts', 'Risks', 'Executive', 'Scorecards', 'Strategic Center'].forEach((label) => {
    assert.match(source, new RegExp(label));
  });
});

test('AI Analytics Copilot supports required command intents', () => {
  const source = read('apps/web/lib/analytics-workspace.ts').toLowerCase();
  ['company health', 'forecast next quarter', 'business risks', 'growth opportunities', 'kpi performance', 'strategic actions'].forEach((intent) => {
    assert.match(source, new RegExp(intent));
  });
});

test('Analytics workspace renders all required modules', () => {
  const source = read('apps/web/features/analytics/analytics-workspace.tsx');
  ['AnalyticsHome', 'ExecutiveIntelligenceCenter', 'BusinessIntelligenceDashboards', 'KpiManagement', 'CrossModuleAnalytics', 'ForecastingCenter', 'StrategicInsightsEngine', 'ReportBuilder', 'DataVisualizationStudio', 'ExecutiveScorecards', 'AiAnalyticsCopilot', 'StrategicDecisionCenter'].forEach((name) => {
    assert.match(source, new RegExp(name));
  });
});

test('Analytics workspace uses Recharts primitives', () => {
  const source = read('apps/web/features/analytics/analytics-charts.tsx');
  ['ResponsiveContainer', 'AreaChart', 'BarChart', 'PieChart'].forEach((name) => {
    assert.match(source, new RegExp(name));
  });
});

test('Analytics routes are physically created', () => {
  [
    'apps/web/app/analytics/executive-intelligence/page.tsx',
    'apps/web/app/analytics/dashboards/page.tsx',
    'apps/web/app/analytics/kpis/page.tsx',
    'apps/web/app/analytics/cross-module/page.tsx',
    'apps/web/app/analytics/forecasts/page.tsx',
    'apps/web/app/analytics/insights/page.tsx',
    'apps/web/app/analytics/reports/page.tsx',
    'apps/web/app/analytics/visualization/page.tsx',
    'apps/web/app/analytics/scorecards/page.tsx',
    'apps/web/app/analytics/copilot/page.tsx',
    'apps/web/app/analytics/strategic-center/page.tsx',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});
