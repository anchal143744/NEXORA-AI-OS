import { Injectable } from '@nestjs/common';
import { tracingBackend, SpanKind, SpanStatus, TelemetrySpan } from '../../../common/observability/tracing-backend';

@Injectable()
export class TracingService {
  startTrace(operation: string, metadata: Record<string, unknown> = {}) { const span = this.startSpan(operation, { kind: 'internal', attributes: metadata }); return { traceId: span.traceId, spanId: span.spanId, operation, startedAt: new Date(), metadata, span }; }
  finishTrace(trace: { traceId: string; operation: string; startedAt: Date; metadata?: Record<string, unknown>; span?: TelemetrySpan }) { const durationMs = Date.now() - trace.startedAt.getTime(); if (trace.span) tracingBackend.finishSpan(trace.span, 'OK', { durationMs }); return { ...trace, finishedAt: new Date(), durationMs }; }
  startSpan(operation: string, options: { kind?: SpanKind; attributes?: Record<string, unknown>; traceId?: string; parentSpanId?: string } = {}) { return tracingBackend.startSpan(operation, options); }
  finishSpan(span: TelemetrySpan, status: SpanStatus = 'OK', attributes: Record<string, unknown> = {}) { return tracingBackend.finishSpan(span, status, attributes); }
  traceparent(traceId?: string, spanId?: string) { return tracingBackend.traceparent(traceId, spanId); }
}