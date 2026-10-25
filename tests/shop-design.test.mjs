import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadWebModule } from './helpers/web-contracts.mjs';

const report = { currency: 'INR', precision: 2, from: '2026-10-01T00:00:00Z', to: '2026-11-01T00:00:00Z', dailyRevenue: [{ date: '2026-10-01', amount: '90.00' }, { date: '2026-10-03', amount: '-30.00' }] };
test('revenue bars represent every UTC date, zero-activity days and signed returns', () => {
  const { revenueSeries } = loadWebModule('features/shop/shop-chart-data.ts');
  const data = revenueSeries(report);
  assert.equal(data.length, 31); assert.equal(data[0].date, '2026-10-01'); assert.equal(data.at(-1).date, '2026-10-31');
  assert.equal(data[0].exact, '90.00'); assert.equal(data[1].exact, '0.00'); assert.equal(data[2].exact, '-30.00'); assert.equal(data[2].value, -30);
  assert.equal(data.reduce((sum, row) => sum + row.value, 0), 60);
  assert.deepEqual(revenueSeries({ ...report, to: report.from }), []);
  const leap = revenueSeries({ ...report, from: '2028-02-01T00:00:00Z', to: '2028-03-01T00:00:00Z', precision: 3, dailyRevenue: [] });
  assert.equal(leap.length, 29); assert.equal(leap[0].exact, '0.000');
});

test('customer donut derives its segments from saved relationships without inventing conversion rates', () => {
  const { customerComposition } = loadWebModule('features/shop/shop-chart-data.ts');
  assert.deepEqual(customerComposition(10, 3), { total: 10, leads: 3, customers: 7, leadShare: 0.3 });
  assert.deepEqual(customerComposition(0, 0), { total: 0, leads: 0, customers: 0, leadShare: 0 });
  assert.equal(customerComposition(5, 10).customers, 0);
});

test('sidebar follows the requested hierarchy and hides unavailable modules', () => {
  const { shopNavigation, ShopNavigation } = loadWebModule('features/shop/shop-navigation.tsx', { './shop-auth': { ShopBrand: () => React.createElement('span', null, 'NEXORA') } });
  const expected = {
    Workspace: ['Overview', 'AI Command Center', 'My Tasks', 'Notifications'],
    CRM: ['Leads', 'Contacts', 'Companies', 'Deals', 'Follow-ups'],
    Sales: ['Quotes', 'Orders', 'Invoices', 'Payments', 'Returns'],
    Inventory: ['Products', 'Stock Levels', 'Stock Movements', 'Warehouses', 'Transfers', 'Purchase Orders', 'Suppliers'],
    Finance: ['Financial Overview', 'Income & Expenses', 'Profit & Loss', 'Cash Flow', 'Receivables', 'Payables'],
    Operations: ['Workflows', 'Approvals', 'Integrations'],
    Intelligence: ['Analytics & Reports', 'AI Insights', 'Forecasts'],
    Administration: ['Team & Members', 'Roles & Permissions', 'Organization Settings', 'Workspace Settings', 'Billing & Plans'],
  };
  assert.deepEqual(Object.fromEntries(shopNavigation.map(section => [section.label, section.branches.map(entry => entry.label)])), expected);
  const html = renderToStaticMarkup(React.createElement(ShopNavigation, { active: 'Overview', open: false, organization: 'Synthetic shop', onNavigate() {}, onClose() {} }));
  assert.match(html, /aria-current="page"/); assert.match(html, /aria-expanded="true"/); assert.doesNotMatch(html, /Not available in this retail release|Soon/);
  for (const label of ['Orders', 'Products', 'Financial Overview', 'Help &amp; Support', 'Preferences', 'Profile']) assert.ok(html.includes(label), label);
  for (const label of ['AI Command Center', 'Purchase Orders', 'Roles &amp; Permissions', 'Billing &amp; Plans']) assert.ok(!html.includes(label), label);
  const limited = renderToStaticMarkup(React.createElement(ShopNavigation, { active: 'Overview', capabilities: { crm: false, finance: false, settings: false }, open: false, organization: 'Synthetic shop', onNavigate() {}, onClose() {} }));
  assert.doesNotMatch(limited, /nx-section-crm|nx-section-finance|nx-section-intelligence|Workspace Settings|Preferences/);
});

test('workspace navigation preferences preserve core sections and keep duplicate Overview entries distinct', () => {
  const { ShopNavigation } = loadWebModule('features/shop/shop-navigation.tsx', { './shop-auth': { ShopBrand: () => React.createElement('span', null, 'NEXORA') } });
  const html = renderToStaticMarkup(React.createElement(ShopNavigation, { active: 'finance-overview', modules: ['finance'], open: false, organization: 'Synthetic shop', onNavigate() {}, onClose() {} }));
  assert.ok(html.includes('nx-section-workspace')); assert.ok(html.includes('nx-section-administration')); assert.ok(html.includes('nx-section-finance'));
  assert.ok(!html.includes('nx-section-crm')); assert.ok(!html.includes('nx-section-sales'));
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1);
  const empty = renderToStaticMarkup(React.createElement(ShopNavigation, { active: 'Overview', modules: [], open: false, organization: 'Synthetic shop', onNavigate() {}, onClose() {} }));
  assert.ok(empty.includes('Workspace Settings')); assert.ok(empty.includes('Help &amp; Support'));
});

test('dashboard customization hides detail widgets while retaining exact headline balances', () => {
  const { ShopOverview } = loadWebModule('features/shop/shop-overview.tsx', { './shop-charts': { RevenueBars: () => React.createElement('span', null, 'Revenue chart'), CustomerDonut: () => React.createElement('span', null, 'Customer chart'), FinancialBreakdown: () => React.createElement('span', null, 'Financial chart') } });
  const props = { report: { ...report, recognizedRevenue: '60.00', netProfit: '29.90', cashReceived: '50.00' }, overview: { outstanding: '10.00', customers: 0, leads: 0, dueFollowUps: 0, lowStock: 0 }, currency: 'INR', precision: 2, pending: false, onNavigate() {}, onSale() {}, onFollowUp() {}, followUps: 'Follow-up detail', recentSales: 'Sales detail' };
  const html = renderToStaticMarkup(React.createElement(ShopOverview, { ...props, widgets: [] }));
  assert.match(html, /INR 60.00/); assert.match(html, /INR 29.90/); assert.match(html, /Customize overview/);
  assert.doesNotMatch(html, /Revenue chart|Customer chart|Financial chart|Sales detail|Follow-up detail/);
  const selected = renderToStaticMarkup(React.createElement(ShopOverview, { ...props, widgets: ['customers', 'sales'] }));
  assert.match(selected, /Customer chart/); assert.match(selected, /Sales detail/); assert.doesNotMatch(selected, /Revenue chart|Follow-up detail/);
});

test('donut renders accessible exact counts and a neutral empty state', () => {
  const { CustomerDonut } = loadWebModule('features/shop/shop-charts.tsx');
  const html = renderToStaticMarkup(React.createElement(CustomerDonut, { overview: { customers: 10, leads: 3 } }));
  assert.match(html, /10 customer and lead records: 7 customers, 3 leads/); assert.match(html, /30%/); assert.match(html, /70%/);
  const empty = renderToStaticMarkup(React.createElement(CustomerDonut, { overview: { customers: 0, leads: 0 } }));
  assert.match(empty, /no records yet/); assert.doesNotMatch(empty, /NaN|Infinity/);
});
