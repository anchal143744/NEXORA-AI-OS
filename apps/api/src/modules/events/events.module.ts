import { Module } from '@nestjs/common';

import { RealtimeModule } from '../realtime/realtime.module';
import { QueueModule } from '../../infrastructure/queues/queue.module';

import { EventBusService } from './event-bus.service';
import { EventsController } from './events.controller';
import { EventProcessor } from './processors/event.processor';
import { EventRegistry } from './registry/event-registry';
import { EventSubscriberRegistry } from './subscribers/event-subscriber.registry';

@Module({
  imports: [
    RealtimeModule,
    QueueModule,
  ],

  controllers: [EventsController],

  providers: [
    EventRegistry,
    EventSubscriberRegistry,
    EventBusService,
    EventProcessor,
  ],

  exports: [
    EventRegistry,
    EventSubscriberRegistry,
    EventBusService,
  ],
})
export class EventsModule {}