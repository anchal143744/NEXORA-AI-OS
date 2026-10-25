import { Module } from '@nestjs/common';

import { RealtimeModule } from '../realtime/realtime.module';
import { TenantsModule } from '../tenants/tenants.module';

import { QueueModule } from '../../infrastructure/queues/queue.module';

import { ActivityController } from './activity.controller';
import { ActivityRepository } from './repositories/activity.repository';
import { ActivityService } from './activity.service';

@Module({
  imports: [
    TenantsModule,
    RealtimeModule,
    QueueModule,
  ],

  controllers: [ActivityController],

  providers: [
    ActivityRepository,
    ActivityService,
  ],

  exports: [
    ActivityRepository,
    ActivityService,
  ],
})
export class ActivityModule {}