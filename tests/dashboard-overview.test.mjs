import assert from 'node:assert/strict';
import test from 'node:test';
import { loadWebModule } from './helpers/web-contracts.mjs';
const { dashboardRange, periodChange } = loadWebModule('features/shop/dashboard-range.ts');

test('dashboard presets use UTC calendar boundaries and equal previous periods', () => {
  const now = new Date('2028-03-01T00:30:00Z');
  assert.deepEqual(dashboardRange('today', now), { from: '2028-03-01T00:00:00.000Z', to: '2028-03-02T00:00:00.000Z', previousFrom: '2028-02-29T00:00:00.000Z', previousTo: '2028-03-01T00:00:00.000Z' });
  assert.equal(dashboardRange('7d', now).from, '2028-02-24T00:00:00.000Z');
  assert.equal(dashboardRange('30d', now).from, '2028-02-01T00:00:00.000Z');
  assert.equal(dashboardRange('quarter', new Date('2026-10-16T20:00:00-04:00')).from, '2026-10-01T00:00:00.000Z');
  assert.equal(dashboardRange('year', now).from, '2028-01-01T00:00:00.000Z');
});

test('custom ranges include the through date and reject invalid dates or excessive periods', () => {
  const result = dashboardRange('custom', new Date(), { from: '2028-02-28', to: '2028-02-29' });
  assert.equal(result.to, '2028-03-01T00:00:00.000Z'); assert.equal(result.previousFrom, '2028-02-26T00:00:00.000Z');
  for (const dates of [{ from: '2026-02-30', to: '2026-03-01' }, { from: '2026-10-02', to: '2026-10-01' }, { from: '2025-01-01', to: '2026-01-02' }, { from: 'x', to: '2026-10-01' }]) assert.throws(() => dashboardRange('custom', new Date(), dates));
});

test('financial comparisons retain exact large values, negative baselines and zero states', () => {
  assert.deepEqual(periodChange('112.40', '100.00'), { direction: 'up', label: '+12.40%' });
  assert.deepEqual(periodChange('-40', '-100'), { direction: 'up', label: '+60.00%' });
  assert.deepEqual(periodChange('0', '100'), { direction: 'down', label: '−100.00%' });
  assert.equal(periodChange('200000000000000000.02', '100000000000000000.01').label, '+100.00%');
  assert.equal(periodChange('1', '0').label, 'No non-zero baseline'); assert.equal(periodChange('0', '0').label, 'No change');
  assert.equal(periodChange('10', undefined), null); assert.throws(() => periodChange('NaN', '1'));
});

test('performance chart includes expense-only days and exact negative return profits', () => {
  const { performanceSeries } = loadWebModule('features/shop/shop-chart-data.ts');
  const source = { from: '2026-10-01T00:00:00Z', to: '2026-10-04T00:00:00Z', precision: 2, dailyRevenue: [{ date: '2026-10-01', amount: '-30.00' }], dailyMetrics: [{ date: '2026-10-01', recognizedRevenue: '-30.00', grossProfit: '-20.00', netProfit: '-20.00' }, { date: '2026-10-03', recognizedRevenue: '0.00', grossProfit: '0.00', netProfit: '-10.10' }] };
  assert.deepEqual(performanceSeries(source), [{ date: '2026-10-01', recognizedRevenue: '-30.00', grossProfit: '-20.00', netProfit: '-20.00' }, { date: '2026-10-02', recognizedRevenue: '0.00', grossProfit: '0.00', netProfit: '0.00' }, { date: '2026-10-03', recognizedRevenue: '0.00', grossProfit: '0.00', netProfit: '-10.10' }]);
  assert.equal(performanceSeries({ ...source, dailyMetrics: undefined })[0].grossProfit, undefined);
});

test('workspace search uses encoded server queries and tolerates individually denied sources', async () => {
  const paths = [];
  const { searchWorkspace } = loadWebModule('features/shop/shop-command-palette.tsx', { '@/lib/api-client': { apiRequest: async path => { paths.push(path); if (path.includes('/customers?')) throw new Error('Forbidden'); if (path.includes('/products?')) return { items: [{ id: 'p', name: 'Actual saved product', sku: 'SKU-1' }] }; return { items: [{ id: 's', saleKey: 'actual-sale', invoice: { invoiceNumber: 'INV-1' } }] }; } } });
  const result = await searchWorkspace('a & b');
  assert.equal(result.partial, true); assert.equal(result.results.length, 2); assert.equal(result.results[0].label, 'Actual saved product');
  assert.ok(paths.every(path => path.includes('limit=5&search=a%20%26%20b') && !path.includes('tenantId')));
});

test('workspace search propagates complete source failure instead of showing an empty success', async () => {
  const failure = new Error('Database unavailable');
  const { searchWorkspace } = loadWebModule('features/shop/shop-command-palette.tsx', { '@/lib/api-client': { apiRequest: async () => { throw failure; } } });
  await assert.rejects(searchWorkspace('record'), error => error === failure);
});
