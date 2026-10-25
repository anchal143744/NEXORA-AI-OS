import { Module, forwardRef } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { EventsModule } from '../events/events.module';
import { NotificationModule } from '../notifications/notification.module';
import { TenantsModule } from '../tenants/tenants.module';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { BusinessAuditService } from './business-audit.service';

@Module({
  imports: [TenantsModule, ActivityModule, EventsModule, NotificationModule],
  controllers: [AuditController],
  providers: [AuditService, BusinessAuditService],
  exports: [AuditService, BusinessAuditService],
})
export class AuditModule {}
