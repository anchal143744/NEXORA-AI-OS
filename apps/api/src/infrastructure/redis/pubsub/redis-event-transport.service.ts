import { Injectable } from '@nestjs/common';
import { telemetryRegistry } from '../../../common/observability/telemetry-registry';
import { DomainEvent } from '../../../modules/events/contracts/domain-event.contract';
import { RedisPubSubService } from './redis-pubsub.service';

@Injectable()
export class RedisEventTransportService {
  constructor(private readonly pubsub: RedisPubSubService) {}
  channel(tenantId: string) { return `nexora:events:tenant:${tenantId}`; }
  async publish(event: DomainEvent) { telemetryRegistry.incrementCounter('nexora_event_transport_published_total', 1, { event_type: event.type, tenant_id: event.tenantId }); return this.pubsub.publish(this.channel(event.tenantId), event); }
  subscribe(tenantId: string, handler: (event: DomainEvent) => Promise<void> | void) { return this.pubsub.subscribe<DomainEvent>(this.channel(tenantId), handler); }
}