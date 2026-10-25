import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { RetailAccessService } from '../retail/retail-access.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { AssignPermissionDto, AssignRoleDto, CreatePermissionDto, CreateRoleDto, PermissionCheckDto } from './dto';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService, private readonly tenantContext: TenantContextService, private readonly access: RetailAccessService) {}

  async createRole(dto: CreateRoleDto) {
    await this.access.require('rbac', 'manage');
    return this.prisma.role.create({ data: { tenantId: this.tenantContext.currentTenantId(), name: dto.name, slug: dto.slug, description: dto.description } });
  }

  async assignRole(dto: AssignRoleDto) {
    const scope = await this.access.require('rbac', 'manage');
    if (!await this.prisma.database.role.findFirst({ where: { id: dto.roleId, tenantId: scope.tenantId, deletedAt: null } })) throw new NotFoundException('Role not found');
    if (dto.membershipId && !await this.prisma.database.membership.findFirst({ where: { id: dto.membershipId, tenantId: scope.tenantId, organizationId: scope.organizationId, deletedAt: null } })) throw new NotFoundException('Membership not found');
    if (dto.workspaceMemberId && !await this.prisma.database.workspaceMember.findFirst({ where: { id: dto.workspaceMemberId, tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null } })) throw new NotFoundException('Workspace member not found');
    return this.prisma.roleAssignment.create({ data: { tenantId: this.tenantContext.currentTenantId(), roleId: dto.roleId, membershipId: dto.membershipId, workspaceMemberId: dto.workspaceMemberId } });
  }

  async createPermission(dto: CreatePermissionDto) {
    await this.access.require('rbac', 'manage');
    return this.prisma.permission.create({ data: { tenantId: this.tenantContext.currentTenantId(), resource: dto.resource, action: dto.action, scope: dto.scope, effect: 'ALLOW' } });
  }

  async assignPermission(dto: AssignPermissionDto) {
    const scope = await this.access.require('rbac', 'manage');
    if (!await this.prisma.database.role.findFirst({ where: { id: dto.roleId, tenantId: scope.tenantId, deletedAt: null } }) || !await this.prisma.database.permission.findFirst({ where: { id: dto.permissionId, tenantId: scope.tenantId, deletedAt: null } })) throw new NotFoundException('Role or permission not found');
    return this.prisma.rolePermission.create({ data: { tenantId: this.tenantContext.currentTenantId(), roleId: dto.roleId, permissionId: dto.permissionId } });
  }

  check(dto: PermissionCheckDto) {
    const allowed = dto.required.every((permission) => dto.permissions.includes(permission));
    return { allowed, missing: dto.required.filter((permission) => !dto.permissions.includes(permission)) };
  }
}
