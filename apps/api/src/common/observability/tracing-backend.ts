import { randomBytes } from 'node:crypto';
import { getTelemetryContext } from './request-telemetry-context';
import { redactSensitive } from './redaction.util';
import { telemetryRegistry } from './telemetry-registry';

export type SpanKind = 'server' | 'client' | 'producer' | 'consumer' | 'internal';
export type SpanStatus = 'OK' | 'ERROR';
export interface TelemetrySpan { traceId: string; spanId: string; parentSpanId?: string; name: string; kind: SpanKind; startedAt: bigint; startedAtUnixNano: string; attributes: Record<string, unknown>; }

class TracingBackend {
  private readonly serviceName = process.env.OTEL_SERVICE_NAME ?? 'nexora-api';
  private readonly serviceVersion = process.env.npm_package_version ?? '3.1.0';

  startSpan(name: string, options: { kind?: SpanKind; attributes?: Record<string, unknown>; traceId?: string; parentSpanId?: string } = {}): TelemetrySpan {
    const context = getTelemetryContext();
    return { traceId: normalizeTraceId(options.traceId ?? context?.traceId ?? randomHex(16)), spanId: randomHex(8), parentSpanId: options.parentSpanId ?? context?.spanId, name, kind: options.kind ?? 'internal', startedAt: process.hrtime.bigint(), startedAtUnixNano: unixNanoNow(), attributes: redactSensitive({ requestId: context?.requestId, correlationId: context?.correlationId, tenantId: context?.tenantId, workspaceId: context?.workspaceId, userId: context?.userId, ...options.attributes }) };
  }

  finishSpan(span: TelemetrySpan, status: SpanStatus = 'OK', attributes: Record<string, unknown> = {}) {
    const durationMs = Number(process.hrtime.bigint() - span.startedAt) / 1_000_000;
    telemetryRegistry.incrementCounter('nexora_otel_spans_total', 1, { name: span.name, kind: span.kind, status });
    telemetryRegistry.observeHistogram('nexora_otel_span_duration_ms', durationMs, { name: span.name, kind: span.kind, status });
    this.exportSpan({ ...span, attributes: redactSensitive({ ...span.attributes, ...attributes }), status, durationMs, endedAtUnixNano: unixNanoNow() });
    return { traceId: span.traceId, spanId: span.spanId, name: span.name, status, durationMs };
  }

  traceparent(traceId?: string, spanId?: string) {
    const context = getTelemetryContext();
    return `00-${normalizeTraceId(traceId ?? context?.traceId ?? randomHex(16))}-${spanId ?? context?.spanId ?? randomHex(8)}-01`;
  }

  parseTraceparent(value: unknown) {
    const traceparent = Array.isArray(value) ? value[0] : value;
    const match = typeof traceparent === 'string' ? traceparent.match(/^00-([a-f0-9]{32})-([a-f0-9]{16})-[a-f0-9]{2}$/i) : null;
    return match ? { traceId: match[1].toLowerCase(), parentSpanId: match[2].toLowerCase() } : undefined;
  }

  private exportSpan(span: TelemetrySpan & { status: SpanStatus; durationMs: number; endedAtUnixNano: string }) {
    const endpoint = process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ?? process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    if (!endpoint) return;
    const url = endpoint.endsWith('/v1/traces') ? endpoint : `${endpoint.replace(/\/$/, '')}/v1/traces`;
    const payload = { resourceSpans: [{ resource: { attributes: [stringAttr('service.name', this.serviceName), stringAttr('service.version', this.serviceVersion), stringAttr('deployment.environment', process.env.NODE_ENV ?? 'development')] }, scopeSpans: [{ scope: { name: 'nexora.internal.telemetry', version: this.serviceVersion }, spans: [{ traceId: span.traceId, spanId: span.spanId, parentSpanId: span.parentSpanId, name: span.name, kind: spanKindNumber(span.kind), startTimeUnixNano: span.startedAtUnixNano, endTimeUnixNano: span.endedAtUnixNano, attributes: attributesToOtlp(span.attributes), status: { code: span.status === 'ERROR' ? 2 : 1 } }] }] }] };
    void fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => undefined);
  }
}

export const tracingBackend = new TracingBackend();
export function randomTraceId() { return randomHex(16); }
export function randomSpanId() { return randomHex(8); }
function randomHex(bytes: number) { return randomBytes(bytes).toString('hex'); }
function normalizeTraceId(traceId: string) { const clean = traceId.replace(/[^a-fA-F0-9]/g, '').toLowerCase(); return clean.length === 32 ? clean : randomHex(16); }
function unixNanoNow() { return `${BigInt(Date.now()) * 1_000_000n}`; }
function spanKindNumber(kind: SpanKind) { return { internal: 1, server: 2, client: 3, producer: 4, consumer: 5 }[kind]; }
function attributesToOtlp(attributes: Record<string, unknown>) { return Object.entries(attributes).filter(([, value]) => value !== undefined && value !== null).map(([key, value]) => typeof value === 'number' ? (Number.isInteger(value) ? intAttr(key, value) : doubleAttr(key, value)) : typeof value === 'boolean' ? boolAttr(key, value) : stringAttr(key, typeof value === 'string' ? value : JSON.stringify(value))); }
function stringAttr(key: string, value: string) { return { key, value: { stringValue: value } }; }
function intAttr(key: string, value: number) { return { key, value: { intValue: String(value) } }; }
function doubleAttr(key: string, value: number) { return { key, value: { doubleValue: value } }; }
function boolAttr(key: string, value: boolean) { return { key, value: { boolValue: value } }; }