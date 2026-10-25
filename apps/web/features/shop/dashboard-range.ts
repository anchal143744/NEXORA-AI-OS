export type DashboardPeriod = 'today' | '7d' | '30d' | 'quarter' | 'year' | 'custom';
export function dashboardRange(period: DashboardPeriod, now = new Date(), custom?: { from: string; to: string }) {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(today); end.setUTCDate(end.getUTCDate() + 1);
  const start = new Date(today);
  if (period === '7d' || period === '30d') start.setUTCDate(start.getUTCDate() - (period === '7d' ? 6 : 29));
  if (period === 'quarter') start.setUTCMonth(Math.floor(start.getUTCMonth() / 3) * 3, 1);
  if (period === 'year') start.setUTCMonth(0, 1);
  if (period === 'custom') {
    if (!custom || !/^\d{4}-\d{2}-\d{2}$/.test(custom.from) || !/^\d{4}-\d{2}-\d{2}$/.test(custom.to)) throw new Error('Choose both dates.');
    start.setTime(Date.parse(custom.from + 'T00:00:00Z')); end.setTime(Date.parse(custom.to + 'T00:00:00Z'));
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || start.toISOString().slice(0, 10) !== custom.from || end.toISOString().slice(0, 10) !== custom.to) throw new Error('Choose valid calendar dates.');
    end.setUTCDate(end.getUTCDate() + 1);
  }
  const length = end.getTime() - start.getTime();
  if (!Number.isFinite(length) || length <= 0 || length > 366 * 86400000) throw new Error('Choose a valid range of at most 366 days.');
  return { from: start.toISOString(), to: end.toISOString(), previousFrom: new Date(start.getTime() - length).toISOString(), previousTo: start.toISOString() };
}

/** Percentage comparison uses scaled integers; no floating-point money calculations. */
export function periodChange(current?: string, previous?: string) {
  if (current === undefined || previous === undefined) return null;
  const scaled = (value: string) => { if (!/^-?\d+(\.\d{1,4})?$/.test(value)) throw new Error('Invalid report amount'); const negative = value.startsWith('-'); const [whole, fraction = ''] = value.replace(/^-/, '').split('.'); const result = BigInt(whole) * 10000n + BigInt(fraction.padEnd(4, '0')); return negative ? -result : result; };
  const now = scaled(current), before = scaled(previous), delta = now - before;
  if (before === 0n) return { direction: delta > 0n ? 'up' : delta < 0n ? 'down' : 'flat', label: delta === 0n ? 'No change' : 'No non-zero baseline' };
  const hundredths = delta * 10000n / (before < 0n ? -before : before); const magnitude = hundredths < 0n ? -hundredths : hundredths;
  return { direction: delta > 0n ? 'up' : delta < 0n ? 'down' : 'flat', label: `${hundredths > 0n ? '+' : hundredths < 0n ? '−' : ''}${magnitude / 100n}.${String(magnitude % 100n).padStart(2, '0')}%` };
}
