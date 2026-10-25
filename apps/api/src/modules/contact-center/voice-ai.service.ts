import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { AddVoiceTranscriptDto, CreateVoiceSessionDto, VoiceActionDto, VoiceCommandDto } from './dto/contact-center.dto';

@Injectable()
export class VoiceAiService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  sessions(status?: string) {
    return this.prisma.voiceSession.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { startedAt: 'desc' }, take: 150 });
  }

  async createSession(dto: CreateVoiceSessionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const session = await this.prisma.voiceSession.create({ data: { tenantId, workspaceId, sessionKey: dto.sessionKey ?? `voice-${randomUUID()}`, conversationId: dto.conversationId, customerIdentityId: dto.customerIdentityId, channelId: dto.channelId, queueId: dto.queueId, assignedAgentUserId: dto.assignedAgentUserId, voiceAgentKey: dto.voiceAgentKey, direction: dto.direction ?? 'inbound', provider: dto.provider ?? 'internal', language: dto.language ?? 'en', phoneNumber: dto.phoneNumber, callerId: dto.callerId, audioStorageKey: dto.audioStorageKey, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'voice.session.started', source: 'voice-ai', subject: { type: 'voice_session', id: session.id }, payload: { direction: session.direction, provider: session.provider, status: session.status, customerIdentityId: session.customerIdentityId }, actorUserId: this.context.context()?.userId });
    return session;
  }

  async getSession(id: string) {
    const session = await this.prisma.voiceSession.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!session) throw new NotFoundException('Voice session not found');
    const transcripts = await this.transcripts(id);
    const agentExecutions = await this.prisma.voiceAgentExecution.findMany({ where: { tenantId: this.context.currentTenantId(), voiceSessionId: id, deletedAt: null }, orderBy: { startedAt: 'desc' }, take: 20 });
    return { ...session, transcripts, agentExecutions };
  }

  async addTranscript(voiceSessionId: string, dto: AddVoiceTranscriptDto) {
    const session = await this.requireSession(voiceSessionId);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? session.workspaceId ?? this.context.currentWorkspaceId();
    const transcript = await this.prisma.voiceTranscript.create({ data: { tenantId, workspaceId, voiceSessionId, conversationId: dto.conversationId ?? session.conversationId, speakerType: dto.speakerType ?? 'customer', speakerRef: dto.speakerRef, sequence: dto.sequence ?? 0, transcriptText: dto.transcriptText, confidence: dto.confidence, language: dto.language ?? session.language ?? 'en', startOffsetMs: dto.startOffsetMs, endOffsetMs: dto.endOffsetMs, provider: dto.provider ?? session.provider, metadata: dto.metadata ?? {} } });
    await this.prisma.voiceSession.update({ where: { id: voiceSessionId }, data: { transcriptStatus: 'in_progress', updatedAt: new Date() } });
    await this.events.publish({ tenantId, workspaceId, type: 'voice.transcript.created', source: 'speech-to-text', subject: { type: 'voice_transcript', id: transcript.id }, payload: { voiceSessionId, speakerType: transcript.speakerType, language: transcript.language, confidence: transcript.confidence }, actorUserId: this.context.context()?.userId });
    return transcript;
  }

  transcripts(voiceSessionId: string) {
    return this.prisma.voiceTranscript.findMany({ where: { tenantId: this.context.currentTenantId(), voiceSessionId, deletedAt: null }, orderBy: [{ sequence: 'asc' }, { createdAt: 'asc' }], take: 500 });
  }

  speechToTextProviders() {
    return [
      { provider: 'openai', mode: 'streaming-or-batch', supportedFormats: ['wav', 'mp3', 'webm'], tenantScoped: true },
      { provider: 'azure-speech', mode: 'streaming-or-batch', supportedFormats: ['wav', 'mp3'], tenantScoped: true },
      { provider: 'local', mode: 'batch', supportedFormats: ['wav'], tenantScoped: true },
    ];
  }

  textToSpeechProviders() {
    return [
      { provider: 'openai', voices: ['alloy', 'verse', 'sage'], tenantScoped: true },
      { provider: 'azure-speech', voices: ['regional-neural'], tenantScoped: true },
      { provider: 'local', voices: ['enterprise-default'], tenantScoped: true },
    ];
  }

  async processCommand(dto: VoiceCommandDto) {
    const command = dto.commandText.trim();
    const normalized = command.toLowerCase();
    const intent = normalized.includes('invoice') ? 'finance_action' : normalized.includes('meeting') ? 'schedule_action' : normalized.includes('task') ? 'task_action' : normalized.includes('customer') ? 'customer_action' : 'general_command';
    const riskLevel = normalized.includes('refund') || normalized.includes('delete') || normalized.includes('cancel') ? 'high' : normalized.includes('invoice') || normalized.includes('send') ? 'medium' : 'low';
    const action = { intent, riskLevel, requiresApproval: riskLevel !== 'low', command, context: dto.context ?? {} };
    return { command, intent, riskLevel, action, nextStep: riskLevel === 'low' ? 'execute' : 'approval_required' };
  }

  async executeAction(dto: VoiceActionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    const riskLevel = dto.riskLevel ?? 'low';
    const execution = await this.prisma.voiceAgentExecution.create({ data: { tenantId, workspaceId, executionKey: `voice-command-${randomUUID()}`, agentType: 'voice-command-processor', voiceSessionId: dto.voiceSessionId, conversationId: dto.conversationId, customerIdentityId: dto.customerIdentityId, status: riskLevel === 'low' ? 'completed' : 'approval_required', riskLevel, approvalStatus: riskLevel === 'low' ? 'not_required' : 'pending', input: dto.payload ?? {}, plan: { actionType: dto.actionType, source: 'voice_command' }, actions: [{ actionType: dto.actionType, payload: dto.payload ?? {}, createdAt: new Date().toISOString() }], output: riskLevel === 'low' ? { executed: true } : { executed: false, reason: 'approval_required' }, completedAt: riskLevel === 'low' ? new Date() : undefined } });
    await this.events.publish({ tenantId, workspaceId, type: 'voice.command.executed', source: 'voice-ai', subject: { type: 'voice_agent_execution', id: execution.id }, payload: { actionType: dto.actionType, status: execution.status, riskLevel }, actorUserId: this.context.context()?.userId });
    return execution;
  }

  async endSession(id: string) {
    const session = await this.requireSession(id);
    const endedAt = new Date();
    const durationSeconds = Math.max(0, Math.round((endedAt.getTime() - session.startedAt.getTime()) / 1000));
    return this.prisma.voiceSession.update({ where: { id }, data: { status: 'completed', endedAt, durationSeconds, transcriptStatus: 'completed' } });
  }

  history(customerIdentityId?: string, conversationId?: string) {
    return this.prisma.voiceSession.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerIdentityId: customerIdentityId ?? undefined, conversationId: conversationId ?? undefined, deletedAt: null }, orderBy: { startedAt: 'desc' }, take: 100 });
  }

  private async requireSession(id: string) {
    const session = await this.prisma.voiceSession.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!session) throw new NotFoundException('Voice session not found');
    return session;
  }
}
