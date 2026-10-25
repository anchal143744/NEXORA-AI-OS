import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { AddChannelMemberDto, CreateAnnouncementDto, CreateChannelDto, CreateConversationDto, CreateMessageAttachmentDto, CreateMessageReactionDto, SendMessageDto } from './dto/communications.dto';
import { CommunicationsIndexService } from './communications-index.service';

@Injectable()
export class CommunicationsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly indexer: CommunicationsIndexService) {}

  channels(channelType?: string) {
    return this.prisma.communicationChannel.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, channelType: channelType ?? undefined, deletedAt: null }, include: { _count: { select: { members: true, conversations: true, messages: true } } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createChannel(dto: CreateChannelDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const channel = await this.prisma.communicationChannel.create({ data: { tenantId, workspaceId, channelKey: dto.channelKey ?? `channel-${randomUUID()}`, name: dto.name, description: dto.description, channelType: dto.channelType, visibility: dto.visibility ?? 'workspace', departmentId: dto.departmentId, teamId: dto.teamId, projectId: dto.projectId, createdByUserId: dto.createdByUserId ?? this.context.context()?.userId, permissions: dto.permissions ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'communication.channel.created', source: 'communications-center', subject: { type: 'communication_channel', id: channel.id }, payload: { name: channel.name, channelType: channel.channelType, visibility: channel.visibility }, actorUserId: this.context.context()?.userId });
    return channel;
  }

  async getChannel(id: string) {
    const channel = await this.prisma.communicationChannel.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { members: { where: { deletedAt: null } }, conversations: { where: { deletedAt: null }, orderBy: { lastMessageAt: 'desc' }, take: 20 }, messages: { where: { deletedAt: null }, orderBy: { sentAt: 'desc' }, take: 30 } } });
    if (!channel) throw new NotFoundException('Communication channel not found');
    return channel;
  }

  async addMember(channelId: string, dto: AddChannelMemberDto) {
    const channel = await this.requireChannel(channelId);
    return this.prisma.communicationMember.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? channel.workspaceId ?? this.context.currentWorkspaceId(), channelId, userId: dto.userId, teamId: dto.teamId, memberRole: dto.memberRole ?? 'member', notificationLevel: dto.notificationLevel ?? 'mentions', metadata: dto.metadata ?? {} } });
  }

  async members(channelId: string) {
    await this.requireChannel(channelId);
    return this.prisma.communicationMember.findMany({ where: { tenantId: this.context.currentTenantId(), channelId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  conversations(conversationType?: string) {
    return this.prisma.conversation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, conversationType: conversationType ?? undefined, deletedAt: null }, include: { channel: true, messages: { where: { deletedAt: null }, orderBy: { sentAt: 'desc' }, take: 1 } }, orderBy: { lastMessageAt: 'desc' }, take: 100 });
  }

  async createConversation(dto: CreateConversationDto) {
    if (dto.channelId) await this.requireChannel(dto.channelId);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const conversation = await this.prisma.conversation.create({ data: { tenantId, workspaceId, channelId: dto.channelId, conversationKey: dto.conversationKey ?? `conversation-${randomUUID()}`, conversationType: dto.conversationType, subject: dto.subject, privacy: dto.privacy ?? 'workspace', participantRefs: dto.participantRefs ?? [], createdByUserId: dto.createdByUserId ?? this.context.context()?.userId, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'conversation.created', source: 'communications-center', subject: { type: 'conversation', id: conversation.id }, payload: { conversationType: conversation.conversationType, subject: conversation.subject, channelId: conversation.channelId }, actorUserId: this.context.context()?.userId });
    return conversation;
  }

  async getConversation(id: string) {
    const conversation = await this.prisma.conversation.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { channel: true, messages: { where: { deletedAt: null }, include: { attachments: { where: { deletedAt: null } }, reactions: { where: { deletedAt: null } } }, orderBy: { sentAt: 'asc' }, take: 200 } } });
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async sendMessage(dto: SendMessageDto) {
    if (dto.channelId) await this.requireChannel(dto.channelId);
    if (dto.conversationId) await this.requireConversation(dto.conversationId);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const message = await this.prisma.message.create({ data: { tenantId, workspaceId, channelId: dto.channelId, conversationId: dto.conversationId, senderUserId: dto.senderUserId ?? this.context.context()?.userId, messageType: dto.messageType ?? 'text', body: dto.body, content: dto.content ?? {}, metadata: dto.metadata ?? {} } });
    if (dto.conversationId) await this.prisma.conversation.update({ where: { id: dto.conversationId }, data: { lastMessageAt: new Date() } });
    await this.indexer.indexRecord({ sourceType: 'message', sourceId: message.id, moduleKey: 'communications', title: dto.body?.slice(0, 120) || 'Message', summary: dto.body ?? undefined, searchableText: dto.body ?? JSON.stringify(dto.content ?? {}), workspaceId, metadata: { channelId: message.channelId, conversationId: message.conversationId, messageType: message.messageType } });
    await this.events.publish({ tenantId, workspaceId, type: 'message.sent', source: 'communications-center', subject: { type: 'message', id: message.id }, payload: { channelId: message.channelId, conversationId: message.conversationId, messageType: message.messageType }, actorUserId: this.context.context()?.userId });
    return message;
  }

  messages(channelId?: string, conversationId?: string) {
    return this.prisma.message.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, channelId: channelId ?? undefined, conversationId: conversationId ?? undefined, deletedAt: null }, include: { attachments: { where: { deletedAt: null } }, reactions: { where: { deletedAt: null } } }, orderBy: { sentAt: 'desc' }, take: 200 });
  }

  searchMessages(query: string) {
    const value = query.trim();
    return this.prisma.message.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null, OR: value ? [{ body: { contains: value, mode: 'insensitive' } }, { messageType: { contains: value, mode: 'insensitive' } }] : undefined }, include: { conversation: true, channel: true }, orderBy: { sentAt: 'desc' }, take: 100 });
  }

  async addAttachment(messageId: string, dto: CreateMessageAttachmentDto) {
    const message = await this.requireMessage(messageId);
    return this.prisma.messageAttachment.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? message.workspaceId ?? this.context.currentWorkspaceId(), messageId, attachmentType: dto.attachmentType, fileId: dto.fileId, fileName: dto.fileName, url: dto.url, storageKey: dto.storageKey, sizeBytes: dto.sizeBytes, metadata: dto.metadata ?? {} } });
  }

  async react(messageId: string, dto: CreateMessageReactionDto) {
    const message = await this.requireMessage(messageId);
    return this.prisma.messageReaction.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? message.workspaceId ?? this.context.currentWorkspaceId(), messageId, actorUserId: dto.actorUserId ?? this.context.context()?.userId, reactionType: dto.reactionType, metadata: dto.metadata ?? {} } });
  }

  async markRead(messageId: string) {
    const message = await this.requireMessage(messageId);
    const reader = this.context.context()?.userId ?? 'current-user';
    const current = Array.isArray(message.readBy) ? message.readBy : [];
    const next = current.some((entry: { userId?: string }) => entry.userId === reader) ? current : [...current, { userId: reader, readAt: new Date().toISOString() }];
    return this.prisma.message.update({ where: { id: messageId }, data: { readBy: next } });
  }

  announcements(status?: string) {
    return this.prisma.announcement.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, deletedAt: null }, include: { recipients: { where: { deletedAt: null }, take: 25 } }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async createAnnouncement(dto: CreateAnnouncementDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const announcement = await this.prisma.announcement.create({ data: { tenantId, workspaceId, announcementKey: dto.announcementKey ?? `announcement-${randomUUID()}`, title: dto.title, body: dto.body, audienceType: dto.audienceType ?? 'workspace', priority: dto.priority ?? 'normal', status: dto.status ?? 'draft', createdByUserId: dto.createdByUserId ?? this.context.context()?.userId, scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, metadata: dto.metadata ?? {} } });
    for (const recipient of dto.recipients ?? []) {
      await this.prisma.announcementRecipient.create({ data: { tenantId, workspaceId, announcementId: announcement.id, recipientType: recipient.recipientType, recipientId: recipient.recipientId } });
    }
    await this.indexer.indexRecord({ sourceType: 'announcement', sourceId: announcement.id, moduleKey: 'communications', title: announcement.title, summary: announcement.body, searchableText: `${announcement.title}\n${announcement.body}`, workspaceId, metadata: { audienceType: announcement.audienceType, priority: announcement.priority, status: announcement.status } });
    return announcement;
  }

  async publishAnnouncement(id: string) {
    const announcement = await this.requireAnnouncement(id);
    const published = await this.prisma.announcement.update({ where: { id }, data: { status: 'published', publishedAt: new Date() } });
    await this.events.publish({ tenantId: this.context.currentTenantId(), workspaceId: published.workspaceId ?? undefined, type: 'announcement.sent', source: 'communications-center', subject: { type: 'announcement', id: published.id }, payload: { title: published.title, audienceType: published.audienceType, priority: published.priority }, actorUserId: this.context.context()?.userId });
    return { ...published, previousStatus: announcement.status };
  }

  private async requireChannel(id: string) {
    const channel = await this.prisma.communicationChannel.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!channel) throw new NotFoundException('Communication channel not found');
    return channel;
  }

  private async requireConversation(id: string) {
    const conversation = await this.prisma.conversation.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  private async requireMessage(id: string) {
    const message = await this.prisma.message.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  private async requireAnnouncement(id: string) {
    const announcement = await this.prisma.announcement.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!announcement) throw new NotFoundException('Announcement not found');
    return announcement;
  }
}