import { cpus, loadavg } from 'node:os';

export type MetricLabels = Record<string, string | number | boolean | null | undefined>;
interface CounterMetric { name: string; labels: Record<string, string>; value: number; }
interface GaugeMetric { name: string; labels: Record<string, string>; value: number; }
interface HistogramMetric { name: string; labels: Record<string, string>; buckets: number[]; counts: number[]; sum: number; count: number; }
const DEFAULT_BUCKETS_MS = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 30000];

class TelemetryRegistry {
  private readonly counters = new Map<string, CounterMetric>();
  private readonly gauges = new Map<string, GaugeMetric>();
  private readonly histograms = new Map<string, HistogramMetric>();
  private readonly startedAt = Date.now();
  private lastCpuUsage = process.cpuUsage();
  private lastCpuCheck = process.hrtime.bigint();

  incrementCounter(name: string, value = 1, labels: MetricLabels = {}) {
    const metricName = normalizeMetricName(name); const normalizedLabels = normalizeLabels(labels); const key = metricKey(metricName, normalizedLabels);
    const current = this.counters.get(key) ?? { name: metricName, labels: normalizedLabels, value: 0 };
    current.value += value; this.counters.set(key, current);
  }

  setGauge(name: string, value: number, labels: MetricLabels = {}) {
    const metricName = normalizeMetricName(name); const normalizedLabels = normalizeLabels(labels);
    this.gauges.set(metricKey(metricName, normalizedLabels), { name: metricName, labels: normalizedLabels, value });
  }

  observeHistogram(name: string, value: number, labels: MetricLabels = {}, buckets = DEFAULT_BUCKETS_MS) {
    const metricName = normalizeMetricName(name); const normalizedLabels = normalizeLabels(labels); const key = metricKey(metricName, normalizedLabels);
    const current = this.histograms.get(key) ?? { name: metricName, labels: normalizedLabels, buckets, counts: buckets.map(() => 0), sum: 0, count: 0 };
    current.sum += value; current.count += 1; current.buckets.forEach((bucket, index) => { if (value <= bucket) current.counts[index] += 1; });
    this.histograms.set(key, current);
  }

  recordOperationalMetric(name: string, value: number, unit?: string, labels: MetricLabels = {}) {
    this.setGauge(normalizeMetricName(`nexora_${name.replace(/\./g, '_')}`), value, { ...labels, unit: unit ?? 'count' });
  }

  summary() {
    return { uptimeSeconds: Math.round((Date.now() - this.startedAt) / 1000), counters: Array.from(this.counters.values()), gauges: Array.from(this.gauges.values()), histograms: Array.from(this.histograms.values()).map((m) => ({ name: m.name, labels: m.labels, count: m.count, sum: m.sum, average: m.count ? m.sum / m.count : 0 })) };
  }

  renderPrometheus() {
    this.collectProcessMetrics(); const lines: string[] = []; const emittedTypes = new Set<string>();
    for (const metric of this.counters.values()) { emitType(lines, emittedTypes, metric.name, 'counter'); lines.push(`${metric.name}${formatLabels(metric.labels)} ${metric.value}`); }
    for (const metric of this.gauges.values()) { emitType(lines, emittedTypes, metric.name, 'gauge'); lines.push(`${metric.name}${formatLabels(metric.labels)} ${metric.value}`); }
    for (const metric of this.histograms.values()) {
      emitType(lines, emittedTypes, metric.name, 'histogram');
      metric.buckets.forEach((bucket, index) => lines.push(`${metric.name}_bucket${formatLabels({ ...metric.labels, le: String(bucket) })} ${metric.counts[index]}`));
      lines.push(`${metric.name}_bucket${formatLabels({ ...metric.labels, le: '+Inf' })} ${metric.count}`);
      lines.push(`${metric.name}_sum${formatLabels(metric.labels)} ${metric.sum}`);
      lines.push(`${metric.name}_count${formatLabels(metric.labels)} ${metric.count}`);
    }
    return `${lines.join('\n')}\n`;
  }

  private collectProcessMetrics() {
    const memory = process.memoryUsage();
    this.setGauge('nexora_process_memory_rss_bytes', memory.rss); this.setGauge('nexora_process_memory_heap_used_bytes', memory.heapUsed); this.setGauge('nexora_process_memory_heap_total_bytes', memory.heapTotal);
    this.setGauge('nexora_process_uptime_seconds', process.uptime()); this.setGauge('nexora_process_cpu_count', cpus().length); this.setGauge('nexora_system_load_average_1m', loadavg()[0] ?? 0);
    const currentCpu = process.cpuUsage(); const now = process.hrtime.bigint(); const elapsedMicros = Number(now - this.lastCpuCheck) / 1000; const usedMicros = (currentCpu.user - this.lastCpuUsage.user) + (currentCpu.system - this.lastCpuUsage.system);
    this.setGauge('nexora_process_cpu_usage_percent', elapsedMicros > 0 ? Number(((usedMicros / elapsedMicros) * 100).toFixed(4)) : 0);
    this.lastCpuUsage = currentCpu; this.lastCpuCheck = now;
  }
}

export const telemetryRegistry = new TelemetryRegistry();
export function normalizeLabels(labels: MetricLabels): Record<string, string> { return Object.fromEntries(Object.entries(labels).filter(([, value]) => value !== undefined && value !== null).map(([key, value]) => [normalizeLabelName(key), String(value)])); }
function emitType(lines: string[], emittedTypes: Set<string>, name: string, type: 'counter' | 'gauge' | 'histogram') { if (!emittedTypes.has(name)) { lines.push(`# HELP ${name} NEXORA ${name.replace(/^nexora_/, '').replace(/_/g, ' ')}.`); lines.push(`# TYPE ${name} ${type}`); emittedTypes.add(name); } }
function normalizeMetricName(name: string) { const normalized = name.replace(/[^a-zA-Z0-9_:]/g, '_').replace(/_{2,}/g, '_').replace(/^_+|_+$/g, ''); return normalized.startsWith('nexora_') ? normalized : `nexora_${normalized}`; }
function normalizeLabelName(name: string) { return name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^([0-9])/, '_$1'); }
function metricKey(name: string, labels: Record<string, string>) { return `${name}{${Object.keys(labels).sort().map((key) => `${key}=${labels[key]}`).join(',')}}`; }
function formatLabels(labels: Record<string, string>) { const entries = Object.entries(labels); return entries.length ? `{${entries.map(([key, value]) => `${key}="${escapeLabel(value)}"`).join(',')}}` : ''; }
function escapeLabel(value: string) { return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n'); }