import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';

@Injectable()
export class ContextEngineService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  async assemble(input: { workspaceId?: string; businessId?: string; userId?: string }) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = input.workspaceId ?? this.context.currentWorkspaceId();
    const [business, workspace, revenue, kpis, departments, user, workflows, agents, memories] = await Promise.all([
      input.businessId ? this.prisma.business.findFirst({ where: { tenantId, id: input.businessId, deletedAt: null } }) : null,
      workspaceId ? this.prisma.workspace.findFirst({ where: { tenantId, id: workspaceId, deletedAt: null } }) : null,
      this.prisma.financeRevenue.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { recognizedAt: 'desc' }, take: 50 }),
      this.prisma.kpiMetric.findMany({ where: { tenantId, deletedAt: null }, include: { values: { orderBy: { observedAt: 'desc' }, take: 5 } }, take: 50 }),
      this.prisma.department.findMany({ where: { tenantId, workspaceId, deletedAt: null }, take: 50 }),
      input.userId ? this.prisma.user.findFirst({ where: { tenantId, id: input.userId, deletedAt: null } }) : null,
      this.prisma.workflow.findMany({ where: { tenantId, workspaceId, deletedAt: null }, take: 50 }),
      this.prisma.agentTemplate.findMany({ where: { deletedAt: null }, take: 50 }),
      this.prisma.businessMemory.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 50 }),
    ]);
    const context = { business, workspace, revenue, kpis, departments, user, workflows, agents, memories };
    await this.prisma.businessContext.create({ data: { tenantId, workspaceId, businessId: input.businessId, contextType: 'assembled_business_context', payload: context } });
    return context;
  }
}
