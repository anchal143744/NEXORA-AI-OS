import { Module } from '@nestjs/common';
import { RetailModule } from '../retail/retail.module';

import { TenantsModule } from '../tenants/tenants.module';

import { PermissionService } from './permission.service';
import { RoleService } from './role.service';
import { RbacGuard } from './guards/rbac.guard';
import { PolicyGuard } from './guards/policy.guard';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';

@Module({
  imports: [TenantsModule, RetailModule],

  controllers: [RbacController],

  providers: [
    RoleService,
    PermissionService,
    RbacService,
    RbacGuard,
    PolicyGuard,
  ],

  exports: [
    RoleService,
    PermissionService,
    RbacService,
    RbacGuard,
    PolicyGuard,
  ],
})
export class RbacModule {}
