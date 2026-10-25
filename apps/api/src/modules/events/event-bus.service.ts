import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { randomUUID } from 'node:crypto';
import { getTelemetryContext } from '../../common/observability/request-telemetry-context';
import { telemetryRegistry } from '../../common/observability/telemetry-registry';
import { tracingBackend } from '../../common/observability/tracing-backend';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { QUEUES } from '../../infrastructure/queues/queue.constants';
import { RedisEventTransportService } from '../../infrastructure/redis/pubsub/redis-event-transport.service';
import { RealtimeChannelService } from '../realtime/realtime-channel.service';
import { DomainEvent, DomainEventType } from './contracts/domain-event.contract';
import { EventRegistry } from './registry/event-registry';

@Injectable()
export class EventBusService {
  constructor(private readonly prisma: PrismaService, private readonly registry: EventRegistry, private readonly redisTransport: RedisEventTransportService, private readonly realtime: RealtimeChannelService, @InjectQueue(QUEUES.EVENTS) private readonly eventsQueue: Queue) {}

  async publish<TPayload>(event: Omit<DomainEvent<TPayload>, 'id' | 'occurredAt'> & { id?: string; occurredAt?: string }): Promise<DomainEvent<TPayload>> {
    if (!this.registry.has(event.type as DomainEventType)) throw new BadRequestException(`Unregistered event type: ${event.type}`);
    const context = getTelemetryContext();
    const envelope: DomainEvent<TPayload> = { ...event, id: event.id ?? randomUUID(), occurredAt: event.occurredAt ?? new Date().toISOString(), correlationId: event.correlationId ?? context?.traceId ?? context?.correlationId };
    const span = tracingBackend.startSpan('event.publish', { kind: 'producer', attributes: { eventType: envelope.type, eventId: envelope.id, tenantId: envelope.tenantId, workspaceId: envelope.workspaceId } });
    const started = process.hrtime.bigint();
    try {
      await this.prisma.event.create({ data: { id: envelope.id, tenantId: envelope.tenantId, workspaceId: envelope.workspaceId, eventType: envelope.type, source: envelope.source, subjectType: envelope.subject?.type, subjectId: envelope.subject?.id, payload: envelope.payload as object, status: 'PUBLISHED', publishedAt: new Date(envelope.occurredAt) } });
      await this.eventsQueue.add(envelope.type, envelope, { jobId: envelope.id });
      await this.redisTransport.publish(envelope as DomainEvent);
      this.realtime.publishEvent(envelope as DomainEvent);
      recordPublish(envelope as DomainEvent, started, 'ok'); tracingBackend.finishSpan(span, 'OK'); return envelope;
    } catch (error) { recordPublish(envelope as DomainEvent, started, 'error'); tracingBackend.finishSpan(span, 'ERROR', { 'error.message': error instanceof Error ? error.message : 'unknown' }); throw error; }
  }
}

function recordPublish(event: DomainEvent, started: bigint, status: string) { const durationMs = Number(process.hrtime.bigint() - started) / 1_000_000; telemetryRegistry.incrementCounter('nexora_events_published_total', 1, { event_type: event.type, status, tenant_id: event.tenantId }); telemetryRegistry.observeHistogram('nexora_event_publish_duration_ms', durationMs, { event_type: event.type, status }); }