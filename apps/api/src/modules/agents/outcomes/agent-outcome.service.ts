import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { RecordOutcomeDto } from '../dto/agent-execution.dto';
import { AgentAuditTrailService } from '../audit/agent-audit-trail.service';

@Injectable()
export class AgentOutcomeService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly audit: AgentAuditTrailService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId() { return this.context.currentWorkspaceId(); }

  async record(dto: RecordOutcomeDto) {
    const execution = await this.prisma.aiAgentExecution.findFirst({ where: { tenantId: this.tenantId(), id: dto.executionId, deletedAt: null } });
    if (!execution) throw new NotFoundException('Agent execution not found');
    const outcome = await this.prisma.aiAgentOutcome.upsert({ where: { tenantId_executionId: { tenantId: this.tenantId(), executionId: dto.executionId } }, update: { status: dto.status, summary: dto.summary, actualImpact: dto.actualImpact ?? {}, metrics: dto.metrics ?? {}, learnedMemory: dto.learnedMemory ?? {}, completedAt: new Date() }, create: { tenantId: this.tenantId(), workspaceId: execution.workspaceId ?? this.workspaceId(), agentId: execution.agentId, executionId: dto.executionId, status: dto.status, summary: dto.summary, actualImpact: dto.actualImpact ?? {}, metrics: dto.metrics ?? {}, learnedMemory: dto.learnedMemory ?? {} } });
    if (dto.learnedMemory) await this.prisma.aiAgentMemory.create({ data: { tenantId: this.tenantId(), workspaceId: execution.workspaceId ?? this.workspaceId(), agentId: execution.agentId, executionId: execution.id, outcomeId: outcome.id, memoryType: 'outcome_learning', key: `outcome_${outcome.id}`, value: dto.learnedMemory, importance: dto.status === 'success' ? 70 : 90 } });
    await this.prisma.aiAgentExecution.update({ where: { id: execution.id }, data: { status: dto.status, output: { outcomeId: outcome.id, summary: dto.summary }, finishedAt: new Date() } });
    await this.audit.record({ agentId: execution.agentId, executionId: execution.id, action: `ai.agent.outcome_${dto.status}`, riskLevel: execution.riskLevel, after: { outcomeId: outcome.id }, metadata: { summary: dto.summary } });
    return outcome;
  }

  list(executionId?: string) {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    if (executionId) where.executionId = executionId;
    return this.prisma.aiAgentOutcome.findMany({ where, orderBy: { completedAt: 'desc' }, take: 200 });
  }
}