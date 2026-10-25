'use client';

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { customerComposition, revenueSeries } from './shop-chart-data';
import { moneyLabel, Overview, Report } from './shop-types';

export function RevenueBars({ report }: { report: Report }) {
  const data = revenueSeries(report);
  if (!report.dailyRevenue.length) return <div className="nx-chart-empty"><span className="nx-empty-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span><strong>Your revenue story starts here</strong><p>Complete a sale to see this month’s activity.</p></div>;
  const format = (value: string) => moneyLabel(value, report.currency, report.precision);
  return <><div className="nx-revenue-chart" role="img" aria-label="Daily net recognized revenue. Negative bars represent net returns. Exact values follow in the data table.">
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <BarChart data={data} margin={{ top: 12, left: 0, right: 8, bottom: 0 }} accessibilityLayer>
        <CartesianGrid stroke="#D8CFBC" strokeDasharray="3 5" vertical={false} />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#565449', fontSize: 11 }} interval={Math.max(0, Math.floor(data.length / 7) - 1)} tickMargin={12} />
        <YAxis axisLine={false} tickLine={false} width={48} tick={{ fill: '#565449', fontSize: 10 }} tickFormatter={value => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value))} />
        <Tooltip cursor={{ fill: '#D8CFBC', fillOpacity: 0.3 }} content={({ active, payload }) => { const row = payload?.[0]?.payload as typeof data[number] | undefined; return active && row ? <div className="nx-chart-tooltip"><small>{row.date} · UTC</small><strong>{format(row.exact)}</strong><span>Net recognized revenue</span></div> : null; }} />
        <Bar dataKey="value" name="Recognized revenue" radius={[4, 4, 0, 0]} maxBarSize={22} isAnimationActive={false}>{data.map(row => <Cell key={row.date} fill={row.value < 0 ? '#9b5745' : '#565449'} />)}</Bar>
      </BarChart>
    </ResponsiveContainer>
  </div><details className="nx-chart-details"><summary>View exact daily values</summary><div className="shop-table-wrap"><table><caption className="sr-only">Daily recognized revenue in {report.currency}</caption><thead><tr><th>Date · UTC</th><th>Recognized revenue</th></tr></thead><tbody>{data.map(row => <tr key={row.date}><td>{row.date}</td><td>{format(row.exact)}</td></tr>)}</tbody></table></div></details></>;
}

export function CustomerDonut({ overview }: { overview?: Overview }) {
  if (!overview || overview.customers === undefined || overview.leads === undefined) return <div className="shop-skeleton">Loading customer composition…</div>;
  const values = customerComposition(overview.customers, overview.leads); const circumference = 2 * Math.PI * 65;
  return <div className="nx-customer-composition"><div className="nx-donut">
    <svg viewBox="0 0 180 180" role="img" aria-label={`${values.total} customer and lead records: ${values.customers} customers, ${values.leads} leads.`}>
      <circle cx="90" cy="90" r="65" fill="none" stroke="#ebe5d9" strokeWidth="23" />
      {values.total > 0 && <><circle cx="90" cy="90" r="65" fill="none" stroke="#D8CFBC" strokeWidth="23" /><circle cx="90" cy="90" r="65" fill="none" stroke="#565449" strokeWidth="23" strokeDasharray={`${values.leadShare * circumference} ${circumference}`} transform="rotate(-90 90 90)" /></>}
    </svg><div><strong>{values.total.toLocaleString()}</strong><span>{values.total ? 'total relationships' : 'no records yet'}</span></div>
  </div><div className="nx-chart-legend"><div><span><i className="nx-legend-olive" />Leads</span><strong>{values.leads.toLocaleString()}</strong><small>{values.total ? Math.round(values.leadShare * 100) : 0}%</small></div><div><span><i className="nx-legend-bone" />Customers</span><strong>{values.customers.toLocaleString()}</strong><small>{values.total ? Math.round((1 - values.leadShare) * 100) : 0}%</small></div></div><p className="nx-chart-note">Saved relationships across your workspace. This is a count breakdown, not a conversion rate.</p></div>;
}

export function FinancialBreakdown({ report }: { report: Report }) {
  const rows = [{ label: 'Revenue', exact: report.recognizedRevenue }, { label: 'Cost of goods', exact: report.costOfGoodsSold }, { label: 'Operating expenses', exact: report.operatingExpenses }, { label: 'Net profit / loss', exact: report.netProfit }];
  const maximum = Math.max(...rows.map(row => Math.abs(Number(row.exact))), 1);
  return <div className="nx-financial-bars">{rows.map(row => <div key={row.label}><div><span>{row.label}</span><strong>{moneyLabel(row.exact, report.currency, report.precision)}</strong></div><span className="nx-financial-track"><i className={Number(row.exact) < 0 ? 'is-negative' : ''} style={{ width: `${Math.abs(Number(row.exact)) / maximum * 100}%` }} /></span></div>)}<p className="nx-chart-note">Compared within this period. Revenue and cash receipts are tracked separately.</p></div>;
}
