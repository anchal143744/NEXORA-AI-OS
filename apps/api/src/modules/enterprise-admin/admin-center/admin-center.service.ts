import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../events/event-bus.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateAdminOperationDto } from '../dto/enterprise-admin.dto';

@Injectable()
export class AdminCenterService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  async overview() {
    const tenantId = this.context.currentTenantId();
    const [organizations, workspaces, users, subscriptions, aiCalls, activeIncidents, featureFlags] = await Promise.all([
      this.prisma.organization.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.workspace.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.user.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.subscription.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.aiToolCall.count({ where: { tenantId } }),
      this.prisma.adminIncident.count({ where: { tenantId, status: { in: ['open', 'acknowledged'] }, deletedAt: null } }),
      this.prisma.featureFlag.count({ where: { tenantId, deletedAt: null } }),
    ]);
    return { organizations, workspaces, users, subscriptions, aiCalls, activeIncidents, featureFlags };
  }

  organizations() { return this.prisma.organization.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, include: { businesses: true, workspaces: true }, orderBy: { createdAt: 'desc' } }); }
  workspaces() { return this.prisma.workspace.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, include: { business: true, members: true }, orderBy: { createdAt: 'desc' } }); }
  users() { return this.prisma.user.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, select: { id: true, email: true, displayName: true, status: true, timezone: true, locale: true, createdAt: true, updatedAt: true, memberships: true, workspaceMembers: true }, orderBy: { createdAt: 'desc' } }); }
  subscriptions() { return this.prisma.subscription.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, include: { plan: true, billingAccount: true, usageRecords: true }, orderBy: { currentPeriodEnd: 'asc' } }); }

  async aiUsage() {
    const tenantId = this.context.currentTenantId();
    const [snapshots, toolCalls, conversations, recommendations, insights] = await Promise.all([
      this.prisma.aiUsageSnapshot.findMany({ where: { tenantId, deletedAt: null }, orderBy: { periodStart: 'desc' }, take: 30 }),
      this.prisma.aiToolCall.count({ where: { tenantId } }),
      this.prisma.aiConversation.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.aiRecommendation.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.aiInsight.count({ where: { tenantId, deletedAt: null } }),
    ]);
    return { snapshots, totals: { toolCalls, conversations, recommendations, insights } };
  }

  adminOperations(status?: string) { return this.prisma.adminOperation.findMany({ where: { tenantId: this.context.currentTenantId(), status: status ?? undefined, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 }); }

  async createOperation(dto: CreateAdminOperationDto) {
    const tenantId = this.context.currentTenantId();
    const operation = await this.prisma.adminOperation.create({ data: { tenantId, workspaceId: this.context.currentWorkspaceId(), operationType: dto.operationType, targetType: dto.targetType, targetId: dto.targetId, requestedByUserId: this.context.context()?.userId, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId: operation.workspaceId ?? undefined, type: 'admin.operation.created', source: 'admin-center', subject: { type: 'admin_operation', id: operation.id }, payload: { operationType: operation.operationType, targetType: operation.targetType, targetId: operation.targetId }, actorUserId: this.context.context()?.userId });
    return operation;
  }
}
