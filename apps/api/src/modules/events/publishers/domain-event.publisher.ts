import { Injectable } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
import { DomainEvent } from '../contracts/domain-event.contract';

@Injectable()
export class DomainEventPublisher {
  constructor(private readonly eventBus: EventBusService) {}

  publish<TPayload>(event: DomainEvent<TPayload>) {
    return this.eventBus.publish(event);
  }
}
