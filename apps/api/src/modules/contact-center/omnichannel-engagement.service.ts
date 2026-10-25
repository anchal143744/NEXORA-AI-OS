import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CommunicationsIndexService } from '../communications/communications-index.service';
import { CreateChannelDto } from '../communications/dto/communications.dto';
import { AddConversationParticipantDto, CreateCustomerIdentityDto, ResolveCustomerIdentityDto, SyncOmnichannelMessageDto } from './dto/contact-center.dto';

@Injectable()
export class OmnichannelEngagementService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly indexer: CommunicationsIndexService) {}

  channels(channelType?: string) {
    return this.prisma.communicationChannel.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, channelType: channelType ?? undefined, deletedAt: null }, include: { _count: { select: { conversations: true, messages: true, members: true } } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createChannel(dto: CreateChannelDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const channel = await this.prisma.communicationChannel.create({ data: { tenantId, workspaceId, channelKey: dto.channelKey ?? `omni-${randomUUID()}`, name: dto.name, description: dto.description, channelType: dto.channelType, visibility: dto.visibility ?? 'workspace', createdByUserId: dto.createdByUserId ?? this.context.context()?.userId, permissions: dto.permissions ?? {}, metadata: { ...(dto.metadata ?? {}), omnichannel: true } } });
    await this.events.publish({ tenantId, workspaceId, type: 'communication.channel.created', source: 'omnichannel-engine', subject: { type: 'communication_channel', id: channel.id }, payload: { name: channel.name, channelType: channel.channelType }, actorUserId: this.context.context()?.userId });
    return channel;
  }

  channelHealth(id: string) {
    return Promise.all([
      this.prisma.communicationChannel.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } }),
      this.prisma.message.count({ where: { tenantId: this.context.currentTenantId(), channelId: id, deletedAt: null } }),
      this.prisma.conversation.count({ where: { tenantId: this.context.currentTenantId(), channelId: id, deletedAt: null } }),
    ]).then(([channel, messageCount, conversationCount]) => {
      if (!channel) throw new NotFoundException('Communication channel not found');
      return { channelId: id, status: channel.status, channelType: channel.channelType, messageCount, conversationCount, syncState: 'ready' };
    });
  }

  identities(query?: string) {
    const value = query?.trim();
    return this.prisma.customerIdentity.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null, OR: value ? [{ primaryName: { contains: value, mode: 'insensitive' } }, { email: { contains: value, mode: 'insensitive' } }, { phone: { contains: value, mode: 'insensitive' } }, { company: { contains: value, mode: 'insensitive' } }] : undefined }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createIdentity(dto: CreateCustomerIdentityDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    return this.prisma.customerIdentity.create({ data: { tenantId, workspaceId, identityKey: dto.identityKey ?? `identity-${randomUUID()}`, customerId: dto.customerId, leadId: dto.leadId, primaryName: dto.primaryName, email: dto.email, phone: dto.phone, company: dto.company, externalRefs: dto.externalRefs ?? {}, channelIdentities: dto.channelIdentities ?? [], lifecycleStage: dto.lifecycleStage ?? 'unknown', riskLevel: dto.riskLevel ?? 'normal', metadata: dto.metadata ?? {} } });
  }

  async getIdentity(id: string) {
    const identity = await this.prisma.customerIdentity.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!identity) throw new NotFoundException('Customer identity not found');
    return identity;
  }

  async resolveIdentity(dto: ResolveCustomerIdentityDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const existing = await this.prisma.customerIdentity.findFirst({ where: { tenantId, deletedAt: null, OR: [{ email: dto.email ?? undefined }, { phone: dto.phone ?? undefined }, { identityKey: dto.identityKey ?? undefined }] } });
    const channelIdentity = dto.channel && dto.channelUserId ? [{ channel: dto.channel, channelUserId: dto.channelUserId, resolvedAt: new Date().toISOString() }] : [];
    const identity = existing ? await this.prisma.customerIdentity.update({ where: { id: existing.id }, data: { lastInteractionAt: new Date(), channelIdentities: [...(Array.isArray(existing.channelIdentities) ? existing.channelIdentities : []), ...channelIdentity], metadata: { ...(existing.metadata ?? {}), ...(dto.metadata ?? {}) } } }) : await this.prisma.customerIdentity.create({ data: { tenantId, workspaceId, identityKey: dto.identityKey ?? `identity-${randomUUID()}`, customerId: dto.customerId, leadId: dto.leadId, primaryName: dto.primaryName, email: dto.email, phone: dto.phone, company: dto.company, externalRefs: dto.externalRefs ?? {}, channelIdentities: channelIdentity, lifecycleStage: dto.lifecycleStage ?? 'unknown', riskLevel: dto.riskLevel ?? 'normal', lastInteractionAt: new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'omnichannel.identity.resolved', source: 'customer-identity', subject: { type: 'customer_identity', id: identity.id }, payload: { email: identity.email, phone: identity.phone, lifecycleStage: identity.lifecycleStage }, actorUserId: this.context.context()?.userId });
    return identity;
  }

  async addParticipant(conversationId: string, dto: AddConversationParticipantDto) {
    await this.requireConversation(conversationId);
    return this.prisma.conversationParticipant.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), conversationId, customerIdentityId: dto.customerIdentityId, userId: dto.userId, participantType: dto.participantType, displayName: dto.displayName, email: dto.email, phone: dto.phone, channelRef: dto.channelRef, metadata: dto.metadata ?? {} } });
  }

  participants(conversationId: string) {
    return this.prisma.conversationParticipant.findMany({ where: { tenantId: this.context.currentTenantId(), conversationId, deletedAt: null }, orderBy: { joinedAt: 'asc' }, take: 100 });
  }

  async timeline(conversationId: string) {
    await this.requireConversation(conversationId);
    const [participants, messages, summaries, sentiment, intents, escalations] = await Promise.all([
      this.participants(conversationId),
      this.prisma.message.findMany({ where: { tenantId: this.context.currentTenantId(), conversationId, deletedAt: null }, orderBy: { sentAt: 'asc' }, take: 300 }),
      this.prisma.conversationSummary.findMany({ where: { tenantId: this.context.currentTenantId(), conversationId, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 20 }),
      this.prisma.sentimentRecord.findMany({ where: { tenantId: this.context.currentTenantId(), conversationId, deletedAt: null }, orderBy: { detectedAt: 'desc' }, take: 20 }),
      this.prisma.intentRecord.findMany({ where: { tenantId: this.context.currentTenantId(), conversationId, deletedAt: null }, orderBy: { detectedAt: 'desc' }, take: 20 }),
      this.prisma.escalationEvent.findMany({ where: { tenantId: this.context.currentTenantId(), conversationId, deletedAt: null }, orderBy: { escalatedAt: 'desc' }, take: 20 }),
    ]);
    return { conversationId, participants, messages, summaries, sentiment, intents, escalations };
  }

  async identityTimeline(customerIdentityId: string) {
    await this.getIdentity(customerIdentityId);
    const [conversations, voiceSessions, summaries, assignments, escalations] = await Promise.all([
      this.prisma.conversationParticipant.findMany({ where: { tenantId: this.context.currentTenantId(), customerIdentityId, deletedAt: null }, orderBy: { joinedAt: 'desc' }, take: 100 }),
      this.prisma.voiceSession.findMany({ where: { tenantId: this.context.currentTenantId(), customerIdentityId, deletedAt: null }, orderBy: { startedAt: 'desc' }, take: 100 }),
      this.prisma.conversationSummary.findMany({ where: { tenantId: this.context.currentTenantId(), customerIdentityId, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 50 }),
      this.prisma.agentAssignment.findMany({ where: { tenantId: this.context.currentTenantId(), customerIdentityId, deletedAt: null }, orderBy: { assignedAt: 'desc' }, take: 50 }),
      this.prisma.escalationEvent.findMany({ where: { tenantId: this.context.currentTenantId(), customerIdentityId, deletedAt: null }, orderBy: { escalatedAt: 'desc' }, take: 50 }),
    ]);
    return { customerIdentityId, conversations, voiceSessions, summaries, assignments, escalations };
  }

  async syncMessage(messageId: string, dto: SyncOmnichannelMessageDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const message = messageId === 'new' ? await this.prisma.message.create({ data: { tenantId, workspaceId, channelId: dto.channelId, conversationId: dto.conversationId, messageType: dto.sourceChannel, body: dto.body, content: dto.content ?? {}, metadata: { ...(dto.metadata ?? {}), externalMessageId: dto.externalMessageId, customerIdentityId: dto.customerIdentityId, synchronized: true } } }) : await this.prisma.message.update({ where: { id: messageId }, data: { metadata: { ...(dto.metadata ?? {}), externalMessageId: dto.externalMessageId, sourceChannel: dto.sourceChannel, synchronized: true } } });
    await this.indexer.indexRecord({ sourceType: 'omnichannel_message', sourceId: message.id, moduleKey: 'omnichannel', title: dto.body?.slice(0, 120) || `${dto.sourceChannel} message`, summary: dto.body, searchableText: [dto.sourceChannel, dto.body].filter(Boolean).join(' '), workspaceId, metadata: { conversationId: dto.conversationId, customerIdentityId: dto.customerIdentityId } });
    await this.events.publish({ tenantId, workspaceId, type: 'omnichannel.message.synced', source: 'omnichannel-engine', subject: { type: 'message', id: message.id }, payload: { sourceChannel: dto.sourceChannel, conversationId: message.conversationId, customerIdentityId: dto.customerIdentityId }, actorUserId: this.context.context()?.userId });
    return message;
  }

  messageContext(messageId: string) {
    return this.prisma.message.findFirst({ where: { tenantId: this.context.currentTenantId(), id: messageId, deletedAt: null } }).then(async (message: Record<string, unknown> | null) => {
      if (!message) throw new NotFoundException('Message not found');
      const conversationId = message.conversationId as string | undefined;
      const [sentiment, intent] = await Promise.all([
        this.prisma.sentimentRecord.findMany({ where: { tenantId: this.context.currentTenantId(), messageId, deletedAt: null }, orderBy: { detectedAt: 'desc' }, take: 5 }),
        this.prisma.intentRecord.findMany({ where: { tenantId: this.context.currentTenantId(), messageId, deletedAt: null }, orderBy: { detectedAt: 'desc' }, take: 5 }),
      ]);
      return { message, conversationId, sentiment, intent };
    });
  }

  private async requireConversation(id: string) {
    const conversation = await this.prisma.conversation.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }
}
