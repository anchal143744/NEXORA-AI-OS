import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TenantContextService } from '../tenants/tenant-context.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';

export type RetailScope = { tenantId: string; organizationId: string; workspaceId: string; userId: string };
@Injectable()
export class RetailAccessService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}
  private async membership(tx: Prisma.TransactionClient) {
    const ctx = this.context.context();
    if (!ctx?.userId || !ctx.tenantId || !ctx.organizationId || !ctx.workspaceId) throw new ForbiddenException('Authenticated organization and workspace are required');
    const scope = { tenantId: ctx.tenantId, organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, userId: ctx.userId };
    const workspace = await tx.workspace.findFirst({ where: { id: scope.workspaceId, tenantId: scope.tenantId, organizationId: scope.organizationId, deletedAt: null, organization: { tenantId: scope.tenantId, deletedAt: null } } });
    const member = await tx.workspaceMember.findFirst({ where: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, userId: scope.userId, status: 'ACTIVE', deletedAt: null, user: { tenantId: scope.tenantId, deletedAt: null, status: 'ACTIVE' } } });
    const orgMember = await tx.membership.findFirst({ where: { tenantId: scope.tenantId, organizationId: scope.organizationId, userId: scope.userId, deletedAt: null } });
    if (!workspace || !member || !orgMember) throw new ForbiddenException('Workspace membership is required');
    return { scope, member, orgMember };
  }

  async scope(tx: Prisma.TransactionClient = this.prisma.database): Promise<RetailScope> { return (await this.membership(tx)).scope; }

  async require(resource: string, action: string, tx: Prisma.TransactionClient = this.prisma.database): Promise<RetailScope> {
    const { scope, member, orgMember } = await this.membership(tx);
    // Existing owner membership is persisted by first-tenant signup, not taken from JWT roles.
    if (orgMember.title === 'Organization Owner') return scope;
    const now = new Date();
    const assignments = await tx.roleAssignment.findMany({ where: { tenantId: scope.tenantId, deletedAt: null, OR: [{ workspaceMemberId: member.id }, { membershipId: orgMember.id }], AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: now } }] }, { OR: [{ endsAt: null }, { endsAt: { gt: now } }] }], role: { tenantId: scope.tenantId, deletedAt: null } }, include: { role: { include: { rolePermissions: { where: { tenantId: scope.tenantId, deletedAt: null }, include: { permission: true } } } } } });
    const rules = assignments.flatMap(a => a.role.rolePermissions).filter(r => r.permission.tenantId === scope.tenantId && !r.permission.deletedAt && ['tenant', 'workspace'].includes(r.permission.scope) && [resource, '*'].includes(r.permission.resource) && [action, 'manage'].includes(r.permission.action));
    if (rules.some(r => r.permission.effect === 'DENY') || !rules.some(r => r.permission.effect === 'ALLOW' && r.conditions !== null && typeof r.conditions === 'object' && !Array.isArray(r.conditions) && Object.keys(r.conditions).length === 0)) throw new ForbiddenException('Insufficient retail permissions');
    return scope;
  }
}
