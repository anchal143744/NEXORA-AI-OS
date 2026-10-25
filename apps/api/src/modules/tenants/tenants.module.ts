import { Module } from '@nestjs/common';

import { WorkspaceResolver } from '../workspaces/resolvers/workspace.resolver';

import { TenantContextModule } from './tenant-context.module';
import { TenantRepository } from './repositories/tenant.repository';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';

@Module({
  imports: [TenantContextModule],

  controllers: [
    TenantsController,
  ],

  providers: [
    TenantRepository,
    TenantsService,
    WorkspaceResolver,
  ],

  exports: [
    TenantRepository,
    WorkspaceResolver,
  ],
})
export class TenantsModule {}