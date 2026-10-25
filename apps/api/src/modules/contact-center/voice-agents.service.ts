import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CompleteVoiceAgentExecutionDto, HumanHandoffDto, StartVoiceAgentExecutionDto } from './dto/contact-center.dto';

@Injectable()
export class VoiceAgentsService {
  private readonly agents = [
    { key: 'customer-support-agent', name: 'Customer Support Agent', capabilities: ['answer_question', 'summarize_case', 'handoff', 'create_follow_up'], riskProfile: 'medium' },
    { key: 'sales-agent', name: 'Sales Agent', capabilities: ['qualify_lead', 'schedule_demo', 'recommend_offer', 'handoff'], riskProfile: 'medium' },
    { key: 'appointment-agent', name: 'Appointment Agent', capabilities: ['check_availability', 'schedule_meeting', 'send_reminder'], riskProfile: 'low' },
    { key: 'follow-up-agent', name: 'Follow-up Agent', capabilities: ['draft_follow_up', 'create_task', 'send_notification'], riskProfile: 'low' },
  ];

  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  listAgents() {
    return this.agents;
  }

  capabilities(agentKey?: string) {
    const agents = agentKey ? this.agents.filter((agent) => agent.key === agentKey) : this.agents;
    return agents.flatMap((agent) => agent.capabilities.map((capability) => ({ agentKey: agent.key, capability, approvalRequired: agent.riskProfile !== 'low' && ['recommend_offer', 'handoff'].includes(capability) })));
  }

  executions(status?: string) {
    return this.prisma.voiceAgentExecution.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { startedAt: 'desc' }, take: 150 });
  }

  async startExecution(dto: StartVoiceAgentExecutionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const agent = this.agents.find((item) => item.key === dto.agentType) ?? { key: dto.agentType, name: dto.agentType, capabilities: [], riskProfile: dto.riskLevel ?? 'medium' };
    const riskLevel = dto.riskLevel ?? agent.riskProfile;
    const execution = await this.prisma.voiceAgentExecution.create({ data: { tenantId, workspaceId, executionKey: dto.executionKey ?? `voice-agent-${randomUUID()}`, agentType: dto.agentType, voiceSessionId: dto.voiceSessionId, conversationId: dto.conversationId, customerIdentityId: dto.customerIdentityId, status: 'running', riskLevel, approvalStatus: dto.approvalStatus ?? (riskLevel === 'low' ? 'not_required' : 'pending'), input: dto.input ?? {}, plan: dto.plan ?? { agent: agent.name, capabilities: agent.capabilities }, actions: dto.actions ?? [], handoffRequired: dto.handoffRequired ?? false, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'voice_agent.execution.started', source: 'voice-agents', subject: { type: 'voice_agent_execution', id: execution.id }, payload: { agentType: execution.agentType, riskLevel: execution.riskLevel, approvalStatus: execution.approvalStatus }, actorUserId: this.context.context()?.userId });
    return execution;
  }

  async getExecution(id: string) {
    const execution = await this.prisma.voiceAgentExecution.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!execution) throw new NotFoundException('Voice agent execution not found');
    return execution;
  }

  async completeExecution(id: string, dto: CompleteVoiceAgentExecutionDto) {
    await this.getExecution(id);
    const execution = await this.prisma.voiceAgentExecution.update({ where: { id }, data: { status: dto.status ?? 'completed', output: dto.output ?? {}, actions: dto.actions ?? [], completedAt: new Date() } });
    await this.events.publish({ tenantId: this.context.currentTenantId(), workspaceId: execution.workspaceId ?? undefined, type: 'voice_agent.execution.completed', source: 'voice-agents', subject: { type: 'voice_agent_execution', id: execution.id }, payload: { agentType: execution.agentType, status: execution.status }, actorUserId: this.context.context()?.userId });
    return execution;
  }

  async requestHandoff(id: string, dto: HumanHandoffDto) {
    const execution = await this.getExecution(id);
    const updated = await this.prisma.voiceAgentExecution.update({ where: { id }, data: { handoffRequired: true, handoffReason: dto.reason, status: 'handoff_requested', metadata: { ...(execution.metadata ?? {}), handoff: { toUserId: dto.toUserId, queueId: dto.queueId, requestedAt: new Date().toISOString() } } } });
    return updated;
  }
}
