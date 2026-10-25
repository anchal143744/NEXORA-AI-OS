import type { Report } from './shop-types';

/** Numbers are for drawing only. Labels and accounting retain exact decimal strings. */
export function revenueSeries(report: Report) {
  const amounts = new Map(report.dailyRevenue.map(row => [row.date.slice(0, 10), row.amount]));
  const start = new Date(report.from); const end = new Date(report.to);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) return [];
  const rows: { date: string; label: string; exact: string; value: number }[] = [];
  for (const day = new Date(start); day < end && rows.length < 366; day.setUTCDate(day.getUTCDate() + 1)) {
    const date = day.toISOString().slice(0, 10); const exact = amounts.get(date) ?? (0).toFixed(report.precision);
    rows.push({ date, label: String(day.getUTCDate()).padStart(2, '0'), exact, value: Number(exact) });
  }
  return rows;
}

export function customerComposition(customers: number, leads: number) {
  const total = Math.max(0, customers); const leadCount = Math.min(total, Math.max(0, leads));
  return { total, leads: leadCount, customers: total - leadCount, leadShare: total ? leadCount / total : 0 };
}

export function performanceSeries(report: Report) {
  const metrics = new Map(report.dailyMetrics?.map(row => [row.date.slice(0, 10), row]));
  return revenueSeries(report).map(row => {
    const metric = metrics.get(row.date), zero = (0).toFixed(report.precision);
    return { date: row.date, recognizedRevenue: metric?.recognizedRevenue ?? row.exact, grossProfit: metric?.grossProfit ?? (report.dailyMetrics ? zero : undefined), netProfit: metric?.netProfit ?? (report.dailyMetrics ? zero : undefined) };
  });
}
