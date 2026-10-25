import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { AgentApprovalService } from '../approvals/agent-approval.service';
import { AgentAuditTrailService } from '../audit/agent-audit-trail.service';
import { AgentDecisionService } from '../decisions/agent-decision.service';
import { PlanAgentExecutionDto } from '../dto/agent-execution.dto';
import { AgentOutcomeService } from '../outcomes/agent-outcome.service';

@Injectable()
export class AgentExecutionLayerService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly approvals: AgentApprovalService, private readonly decisions: AgentDecisionService, private readonly outcomes: AgentOutcomeService, private readonly audit: AgentAuditTrailService, @InjectQueue(QUEUES.AGENT_EXECUTION) private readonly queue: Queue) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId(input?: string) { return input ?? this.context.currentWorkspaceId(); }

  async plan(dto: PlanAgentExecutionDto) {
    const tenantId = this.tenantId();
    const workspaceId = this.workspaceId(dto.workspaceId);
    let agent = await this.prisma.aiAgent.findFirst({ where: { tenantId, workspaceId, agentKey: dto.agentKey, deletedAt: null } });
    if (!agent) agent = await this.prisma.aiAgent.create({ data: { tenantId, workspaceId, agentKey: dto.agentKey, name: this.label(dto.agentKey), agentType: dto.agentKey.replace('_agent', ''), capabilities: [dto.capabilityKey], riskPolicy: { low: 'auto_execute', medium: 'manager_approval', high: 'executive_approval', critical: 'multi_step_approval' } } });
    const policy = this.approvals.policyForRisk(dto.riskLevel);
    const execution = await this.prisma.aiAgentExecution.create({ data: { tenantId, workspaceId, agentId: agent.id, executionKey: `${dto.agentKey}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, actionType: dto.actionType, capabilityKey: dto.capabilityKey, riskLevel: dto.riskLevel, status: policy.approvalStatus === 'required' ? 'awaiting_approval' : 'queued', approvalStatus: policy.approvalStatus, input: { objective: dto.objective, payload: dto.input ?? {} }, rollbackStrategy: dto.rollbackStrategy ?? {}, logs: [{ at: new Date().toISOString(), event: 'planned' }] } });
    await this.decisions.record({ agentId: agent.id, executionId: execution.id, decision: `Plan ${dto.actionType}`, reasoning: `Risk ${dto.riskLevel} maps to approval policy ${policy.approvalStatus}.`, context: { dto }, confidenceScore: dto.riskLevel === 'low' ? 85 : 70, expectedImpact: { objective: dto.objective } });
    if (policy.approvalStatus === 'required') await this.approvals.requestApprovals(execution); else await this.queue.add('autonomous-agent-execution', { tenantId, workspaceId, executionId: execution.id });
    await this.audit.record({ agentId: agent.id, executionId: execution.id, action: 'ai.agent.execution_planned', riskLevel: dto.riskLevel, after: { executionId: execution.id }, metadata: { capabilityKey: dto.capabilityKey, approvalStatus: policy.approvalStatus } });
    return this.getExecution(execution.id);
  }

  async execute(id: string) {
    const execution = await this.getExecution(id);
    await this.approvals.assertExecutable(execution);
    await this.prisma.aiAgentExecution.update({ where: { id }, data: { status: 'running', startedAt: new Date(), attempt: Number(execution.attempt ?? 0) + 1, logs: [...(execution.logs ?? []), { at: new Date().toISOString(), event: 'started' }] } });
    try {
      const output = await this.performAction(execution);
      await this.prisma.aiAgentExecution.update({ where: { id }, data: { status: 'completed', output, finishedAt: new Date(), logs: [...(execution.logs ?? []), { at: new Date().toISOString(), event: 'completed' }] } });
      await this.outcomes.record({ executionId: id, status: 'success', summary: 'Agent execution completed successfully', actualImpact: { output }, metrics: { attempt: Number(execution.attempt ?? 0) + 1 }, learnedMemory: { actionType: execution.actionType, outcome: 'success' } });
      await this.audit.record({ agentId: execution.agentId, executionId: id, action: 'ai.agent.execution_completed', riskLevel: execution.riskLevel, after: output });
      return this.getExecution(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await this.prisma.aiAgentExecution.update({ where: { id }, data: { status: 'failed', error: { message }, finishedAt: new Date() } });
      await this.outcomes.record({ executionId: id, status: 'failure', summary: message, actualImpact: {}, metrics: { attempt: Number(execution.attempt ?? 0) + 1 }, learnedMemory: { actionType: execution.actionType, failure: message } });
      await this.audit.record({ agentId: execution.agentId, executionId: id, action: 'ai.agent.execution_failed', riskLevel: execution.riskLevel, metadata: { error: message } });
      throw error;
    }
  }

  async retry(id: string) {
    const execution = await this.getExecution(id);
    if (Number(execution.attempt ?? 0) >= Number(execution.maxAttempts ?? 3)) throw new NotFoundException('Agent execution retry limit reached');
    await this.prisma.aiAgentExecution.update({ where: { id }, data: { status: 'queued', error: undefined, queuedAt: new Date() } });
    await this.queue.add('autonomous-agent-execution-retry', { tenantId: this.tenantId(), workspaceId: execution.workspaceId, executionId: id });
    await this.audit.record({ agentId: execution.agentId, executionId: id, action: 'ai.agent.execution_retry_queued', riskLevel: execution.riskLevel });
    return this.getExecution(id);
  }

  async rollback(id: string) {
    const execution = await this.getExecution(id);
    await this.prisma.aiAgentExecution.update({ where: { id }, data: { status: 'rolled_back', output: { rollbackStrategy: execution.rollbackStrategy }, finishedAt: new Date() } });
    await this.audit.record({ agentId: execution.agentId, executionId: id, action: 'ai.agent.execution_rolled_back', riskLevel: execution.riskLevel, metadata: { rollbackStrategy: execution.rollbackStrategy } });
    return this.getExecution(id);
  }

  list(status?: string) {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    const workspaceId = this.workspaceId();
    if (workspaceId) where.workspaceId = workspaceId;
    if (status) where.status = status;
    return this.prisma.aiAgentExecution.findMany({ where, orderBy: { createdAt: 'desc' }, take: 200 });
  }

  async getExecution(id: string) {
    const row = await this.prisma.aiAgentExecution.findFirst({ where: { tenantId: this.tenantId(), id, deletedAt: null } });
    if (!row) throw new NotFoundException('Agent execution not found');
    return row;
  }

  private async performAction(execution: any) {
    const payload = execution.input?.payload ?? {};
    if (execution.capabilityKey === 'create_task' || execution.capabilityKey === 'assign_task') {
      const task = await this.prisma.aiAgentTask.create({ data: { tenantId: execution.tenantId, workspaceId: execution.workspaceId, executionId: execution.id, agentId: execution.agentId, taskType: execution.capabilityKey, title: payload.title ?? execution.input?.objective ?? 'AI generated task', description: payload.description, assignedToUserId: payload.assignedToUserId, payload } });
      return { taskId: task.id, action: execution.capabilityKey };
    }
    if (['create_workflow','execute_workflow','trigger_automation'].includes(execution.capabilityKey)) {
      const workflow = await this.prisma.aiAgentWorkflow.create({ data: { tenantId: execution.tenantId, workspaceId: execution.workspaceId, executionId: execution.id, agentId: execution.agentId, workflowKey: payload.workflowKey ?? `${execution.capabilityKey}_${execution.id}`, title: payload.title ?? execution.input?.objective ?? 'AI generated workflow', status: execution.capabilityKey === 'execute_workflow' ? 'executed' : 'draft', trigger: payload.trigger ?? { type: 'agent_action' }, steps: payload.steps ?? [], rollbackPlan: execution.rollbackStrategy ?? {} } });
      return { workflowId: workflow.id, action: execution.capabilityKey };
    }
    if (['generate_insight','analyze_kpi','generate_report'].includes(execution.capabilityKey)) {
      const insight = await this.prisma.aiInsight.create({ data: { tenantId: execution.tenantId, title: payload.title ?? this.label(execution.capabilityKey), body: payload.body ?? execution.input?.objective ?? 'AI generated insight', severity: 'INFO', metadata: { executionId: execution.id, payload } } });
      return { insightId: insight.id, action: execution.capabilityKey };
    }
    return { action: execution.capabilityKey, status: 'tracked', payload };
  }

  private label(value: string) { return value.split('_').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' '); }
}