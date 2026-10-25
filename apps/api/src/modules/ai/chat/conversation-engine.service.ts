import { createHash } from 'crypto';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { BusinessAuditService } from '../../audit/business-audit.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { AiContextBuilderService } from '../context/ai-context-builder.service';
import { AiChatDto } from '../dto/ai-copilot-v2.dto';
import { AiMemoryEngineService } from '../memory/ai-memory-engine.service';
import { AiProviderRouterService } from '../providers/ai-provider-router.service';
import { AiCopilotService } from '../copilot/ai-copilot.service';

@Injectable()
export class ConversationEngineService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly audit: BusinessAuditService, private readonly contextBuilder: AiContextBuilderService, private readonly memory: AiMemoryEngineService, private readonly providers: AiProviderRouterService, private readonly copilots: AiCopilotService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId(input?: string) {
    const currentWorkspaceId = this.context.currentWorkspaceId();
    if (input && input !== currentWorkspaceId) throw new ForbiddenException('Workspace context is not authorized');
    return currentWorkspaceId;
  }
  private userId() { return this.context.context()?.userId; }

  async chat(dto: AiChatDto) {
    const tenantId = this.tenantId();
    const workspaceId = this.workspaceId(dto.workspaceId);
    const copilot = await this.copilots.getDefaultCopilot(dto.copilotKey);
    const conversation = await this.resolveConversation(dto, copilot.id, workspaceId);
    const userMessage = await this.prisma.aiMessage.create({ data: { tenantId, conversationId: conversation.id, userId: this.userId(), role: 'user', content: dto.message, metadata: { provider: dto.provider, model: dto.model } } });
    const context = await this.contextBuilder.build({ ...dto, workspaceId, conversationId: conversation.id });
    const memory = await this.memory.retrieve({ ...dto, workspaceId, conversationId: conversation.id });
    const messages = this.assemblePrompt(dto.message, context.payload, memory, dto.userRole);
    const provider = dto.provider ?? copilot.provider ?? 'openai';
    const model = dto.model ?? copilot.modelKey ?? undefined;
    const promptHash = createHash('sha256').update(JSON.stringify(messages)).digest('hex');
    const response = await this.providers.complete(provider, { tenantId, model, messages, temperature: 0.2, metadata: { workspaceId, conversationId: conversation.id, contextId: context.contextId } });
    const assistantMessage = await this.prisma.aiMessage.create({ data: { tenantId, conversationId: conversation.id, role: 'assistant', content: response.content, metadata: { provider, model: response.model, usage: response.usage, contextId: context.contextId, promptHash } } });
    await this.prisma.aiPromptLog.create({ data: { tenantId, workspaceId, conversationId: conversation.id, contextId: context.contextId, provider, modelKey: response.model, promptHash, promptMessages: messages, responseMetadata: { responseId: response.id, usage: response.usage } } });
    await this.prisma.aiKnowledgeReference.create({ data: { tenantId, workspaceId, conversationId: conversation.id, messageId: assistantMessage.id, contextId: context.contextId, sourceType: 'ai_context', sourceId: context.contextId, title: 'Assembled AI business context', excerpt: JSON.stringify(context.payload).slice(0, 500), relevanceScore: 95, metadata: { contextHash: context.contextHash } } });
    await this.prisma.aiActionLog.create({ data: { tenantId, workspaceId, userId: this.userId(), conversationId: conversation.id, actionType: 'ai.chat.completed', targetType: 'ai_message', targetId: assistantMessage.id, status: 'completed', payload: { provider, model, promptHash }, result: { responseId: response.id, usage: response.usage } } });
    await this.memory.store({ workspaceId, businessId: dto.businessId, departmentId: dto.departmentId, conversationId: conversation.id, memoryType: 'conversation_summary', title: `Conversation ${conversation.id}`, content: { userMessage: dto.message, assistantMessage: response.content, contextId: context.contextId }, scope: 'conversation', importance: 40, source: 'chat_pipeline' });
    await this.audit.record({ tenantId, workspaceId, userId: this.userId(), action: 'EXECUTE', resourceType: 'ai.chat', resourceId: conversation.id, message: 'AI chat completed', metadata: { provider, model: response.model, contextId: context.contextId } });
    return { conversationId: conversation.id, userMessage, assistantMessage, provider, model: response.model, contextId: context.contextId, knowledgeReferences: [{ sourceType: 'ai_context', sourceId: context.contextId }], usage: response.usage };
  }

  async conversations() {
    return this.copilots.listConversations();
  }

  async conversation(id: string) {
    const row = await this.copilots.getConversation(id);
    if (!row) throw new NotFoundException('AI conversation not found');
    return row;
  }

  private async resolveConversation(dto: AiChatDto, copilotId: string, workspaceId?: string) {
    const tenantId = this.tenantId();
    if (dto.conversationId) {
      const existing = await this.prisma.aiConversation.findFirst({ where: { tenantId, id: dto.conversationId, workspaceId, deletedAt: null } });
      if (!existing) throw new NotFoundException('AI conversation not found');
      return existing;
    }
    return this.prisma.aiConversation.create({ data: { tenantId, workspaceId, title: dto.message.slice(0, 80), modelKey: dto.model, context: { copilotId, provider: dto.provider, countryCode: dto.countryCode, userRole: dto.userRole, businessId: dto.businessId, departmentId: dto.departmentId } } });
  }

  private assemblePrompt(userMessage: string, context: Record<string, unknown>, memory: Record<string, unknown>, userRole?: string) {
    const compactContext = JSON.stringify(context).slice(0, 12000);
    const compactMemory = JSON.stringify(memory).slice(0, 6000);
    return [
      { role: 'system' as const, content: `You are NEXORA AI Copilot Brain V2, the central intelligence layer for an adaptive business operating system. Consider business, industry, department, user role, country, workspace, goals, KPIs, CRM, HR, inventory, projects, workflows and financial state. Provide practical recommendations with clear reasoning. User role: ${userRole ?? 'unknown'}.` },
      { role: 'system' as const, content: `Business context JSON: ${compactContext}` },
      { role: 'system' as const, content: `Relevant memory JSON: ${compactMemory}` },
      { role: 'user' as const, content: userMessage },
    ];
  }
}
