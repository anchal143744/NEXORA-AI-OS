import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { DesktopController } from './desktop/desktop.controller';
import { DesktopService } from './desktop/desktop.service';
import { DevicesController } from './devices/devices.controller';
import { DevicesService } from './devices/devices.service';
import { MobileController } from './mobile/mobile.controller';
import { MobileService } from './mobile/mobile.service';
import { OfflineController } from './offline/offline.controller';
import { OfflineService } from './offline/offline.service';
import { SyncController } from './sync/sync.controller';
import { SyncService } from './sync/sync.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [MobileController, DesktopController, OfflineController, SyncController, DevicesController],
  providers: [MobileService, DesktopService, OfflineService, SyncService, DevicesService],
  exports: [MobileService, DesktopService, OfflineService, SyncService, DevicesService],
})
export class OmnichannelModule {}