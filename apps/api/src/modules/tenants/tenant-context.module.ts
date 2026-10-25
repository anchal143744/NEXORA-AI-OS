import { Global, Module } from '@nestjs/common';

import { CommonModule } from '../../common/common.module';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { TenantContextService } from './tenant-context.service';

@Global()
@Module({
  imports: [
    CommonModule,
    DatabaseModule,
  ],

  providers: [
    TenantContextService,
  ],

  exports: [
    TenantContextService,
  ],
})
export class TenantContextModule {}