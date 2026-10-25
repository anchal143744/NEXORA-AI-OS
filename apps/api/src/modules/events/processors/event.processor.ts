import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { telemetryRegistry } from '../../../common/observability/telemetry-registry';
import { tracingBackend } from '../../../common/observability/tracing-backend';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { DomainEvent } from '../contracts/domain-event.contract';
import { EventSubscriberRegistry } from '../subscribers/event-subscriber.registry';

@Processor(QUEUES.EVENTS)
export class EventProcessor extends WorkerHost {
  constructor(private readonly subscribers: EventSubscriberRegistry) { super(); }

  async process(job: Job<DomainEvent>) {
    const event = job.data;
    const span = tracingBackend.startSpan('event.process', { kind: 'consumer', traceId: event.correlationId, attributes: { eventType: event.type, eventId: event.id, tenantId: event.tenantId, workspaceId: event.workspaceId } });
    const started = process.hrtime.bigint();
    try { await this.subscribers.dispatch(event); recordEvent(event, started, 'ok'); tracingBackend.finishSpan(span, 'OK'); return { processed: true, eventId: event.id }; }
    catch (error) { recordEvent(event, started, 'error'); tracingBackend.finishSpan(span, 'ERROR', { 'error.message': error instanceof Error ? error.message : 'unknown' }); throw error; }
  }
}

function recordEvent(event: DomainEvent, started: bigint, status: string) { const durationMs = Number(process.hrtime.bigint() - started) / 1_000_000; telemetryRegistry.incrementCounter('nexora_event_processing_total', 1, { event_type: event.type, status, tenant_id: event.tenantId }); telemetryRegistry.observeHistogram('nexora_event_processing_duration_ms', durationMs, { event_type: event.type, status }); }