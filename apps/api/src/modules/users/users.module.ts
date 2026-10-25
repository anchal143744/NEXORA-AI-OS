import { Module } from '@nestjs/common';

import { TenantContextModule } from '../tenants/tenant-context.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TenantContextModule],

  controllers: [
    UsersController,
  ],

  providers: [
    UsersService,
  ],

  exports: [
    UsersService,
  ],
})
export class UsersModule {}