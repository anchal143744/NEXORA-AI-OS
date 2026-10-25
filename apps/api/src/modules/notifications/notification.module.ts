import { Module } from '@nestjs/common';

import { EmailModule } from '../email/email.module';
import { EventsModule } from '../events/events.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { TenantsModule } from '../tenants/tenants.module';

import { NotificationDispatcher } from './dispatchers/notification.dispatcher';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './repositories/notification.repository';

import { QueueModule } from '../../infrastructure/queues/queue.module';

@Module({
  imports: [
    TenantsModule,
    RealtimeModule,
    EmailModule,
    EventsModule,
    QueueModule,
  ],

  controllers: [NotificationController],

  providers: [
    NotificationRepository,
    NotificationService,
    NotificationDispatcher,
  ],

  exports: [
    NotificationService,
    NotificationDispatcher,
  ],
})
export class NotificationModule {}