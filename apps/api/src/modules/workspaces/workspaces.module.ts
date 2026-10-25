import { Module } from '@nestjs/common';

import { AdaptiveWorkspaceModule } from '../adaptive-workspace/adaptive-workspace.module';
import { TenantsModule } from '../tenants/tenants.module';

import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';

@Module({
  imports: [
    TenantsModule,
    AdaptiveWorkspaceModule,
  ],

  controllers: [
    WorkspacesController,
  ],

  providers: [
    WorkspacesService,
  ],

  exports: [
    WorkspacesService,
  ],
})
export class WorkspacesModule {}
