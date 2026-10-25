import { Module } from '@nestjs/common';
import { IamService } from './iam.service';
import { PermissionsGuard } from './guards/permissions.guard';
import { TenantGuard } from './guards/tenant.guard';

@Module({
  providers: [IamService, PermissionsGuard, TenantGuard],
  exports: [IamService, PermissionsGuard, TenantGuard],
})
export class IamModule {}
