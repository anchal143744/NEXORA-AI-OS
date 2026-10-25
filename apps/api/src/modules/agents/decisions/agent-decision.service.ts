import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';

@Injectable()
export class AgentDecisionService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId() { return this.context.currentWorkspaceId(); }

  record(input: { agentId?: string; executionId?: string; decision: string; reasoning: string; context?: Record<string, unknown>; confidenceScore?: number; expectedImpact?: Record<string, unknown>; actualImpact?: Record<string, unknown> }) {
    return this.prisma.aiAgentDecision.create({ data: { tenantId: this.tenantId(), workspaceId: this.workspaceId(), agentId: input.agentId, executionId: input.executionId, decision: input.decision, reasoning: input.reasoning, context: input.context ?? {}, confidenceScore: input.confidenceScore ?? 70, expectedImpact: input.expectedImpact ?? {}, actualImpact: input.actualImpact } });
  }

  list(executionId?: string) {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    if (executionId) where.executionId = executionId;
    return this.prisma.aiAgentDecision.findMany({ where, orderBy: { createdAt: 'desc' }, take: 200 });
  }
}