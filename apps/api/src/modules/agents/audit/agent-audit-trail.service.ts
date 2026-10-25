import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { BusinessAuditService } from '../../audit/business-audit.service';
import { TenantContextService } from '../../tenants/tenant-context.service';

@Injectable()
export class AgentAuditTrailService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly businessAudit: BusinessAuditService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId() { return this.context.currentWorkspaceId(); }
  private userId() { return this.context.context()?.userId; }

  async record(input: { agentId?: string; executionId?: string; action: string; riskLevel?: string; before?: Record<string, unknown>; after?: Record<string, unknown>; metadata?: Record<string, unknown> }) {
    const tenantId = this.tenantId();
    const workspaceId = this.workspaceId();
    const row = await this.prisma.aiAgentAudit.create({ data: { tenantId, workspaceId, agentId: input.agentId, executionId: input.executionId, actorUserId: this.userId(), action: input.action, riskLevel: input.riskLevel, before: input.before, after: input.after, metadata: input.metadata ?? {} } });
    await this.prisma.aiActionLog.create({ data: { tenantId, workspaceId, userId: this.userId(), actionType: input.action, targetType: 'ai_agent_execution', targetId: input.executionId, status: 'completed', payload: input.metadata ?? {}, result: input.after } });
    await this.businessAudit.record({ tenantId, workspaceId, userId: this.userId(), action: 'EXECUTE', resourceType: 'ai.agent', resourceId: input.executionId ?? input.agentId, message: input.action, metadata: input.metadata });
    return row;
  }

  list(executionId?: string) {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    if (executionId) where.executionId = executionId;
    return this.prisma.aiAgentAudit.findMany({ where, orderBy: { createdAt: 'desc' }, take: 200 });
  }
}