import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CollaborationFeedService } from '../collaboration-feed.service';
import { CollaborationIndexService } from '../collaboration-index.service';
import { GenerateAiSummaryDto } from '../dto/collaboration.dto';

type ExtractedAction = { title: string; description?: string; priority?: string; assigneeUserId?: string; dueAt?: string };

@Injectable()
export class AiCollaborationService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly feed: CollaborationFeedService, private readonly indexer: CollaborationIndexService) {}

  summaries(summaryType?: string) {
    return this.prisma.aiCollaborationSummary.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, summaryType: summaryType ?? undefined, deletedAt: null }, include: { space: true, discussion: true, room: true, actionRecords: { where: { deletedAt: null } } }, orderBy: { generatedAt: 'desc' }, take: 100 });
  }

  async generateSummary(dto: GenerateAiSummaryDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const sourceText = await this.sourceText(dto);
    const extractedActions = dto.actionItems?.length ? dto.actionItems as ExtractedAction[] : this.extractActions(sourceText);
    const recommendations = dto.recommendations?.length ? dto.recommendations : this.generateRecommendations(sourceText, dto.summaryType);
    const summaryText = this.summarize(sourceText, dto.summaryType);
    const summary = await this.prisma.aiCollaborationSummary.create({ data: { tenantId, workspaceId, spaceId: dto.spaceId, discussionId: dto.discussionId, roomId: dto.roomId, summaryKey: dto.summaryKey ?? `collab-summary-${randomUUID()}`, summaryType: dto.summaryType, title: dto.title, summary: summaryText, actionItems: extractedActions, recommendations, risks: dto.risks ?? [], sourceRefs: dto.sourceRefs ?? this.defaultSourceRefs(dto), provider: dto.provider ?? 'nexora-ai-provider-abstraction', model: dto.model ?? 'collaboration-summary-v1', generatedByUserId: dto.generatedByUserId ?? this.context.context()?.userId, metadata: dto.metadata ?? {} } });
    await this.indexer.indexRecord({ sourceType: 'ai_collaboration_summary', sourceId: summary.id, moduleKey: 'collaboration_ai', title: summary.title, summary: summary.summary, searchableText: `${summary.title}\n${summary.summary}`, workspaceId: summary.workspaceId, metadata: { summaryType: summary.summaryType, discussionId: summary.discussionId, roomId: summary.roomId } });
    if (dto.createActionItems !== false) {
      for (const item of extractedActions.slice(0, 25)) {
        await this.feed.createActionItem({ workspaceId, spaceId: dto.spaceId, discussionId: dto.discussionId, roomId: dto.roomId, summaryId: summary.id, title: item.title, description: item.description, priority: item.priority ?? 'medium', assigneeUserId: item.assigneeUserId, dueAt: item.dueAt, sourceType: 'ai_collaboration_summary', sourceId: summary.id, metadata: { extracted: true, summaryType: dto.summaryType } });
      }
    }
    await this.events.publish({ tenantId, workspaceId, type: 'ai.collaboration.summary.generated', source: 'ai-collaboration-engine', subject: { type: 'ai_collaboration_summary', id: summary.id }, payload: { summaryType: summary.summaryType, actionItemCount: extractedActions.length, recommendationCount: recommendations.length }, actorUserId: this.context.context()?.userId });
    await this.feed.recordActivity({ workspaceId, spaceId: summary.spaceId, actorUserId: this.context.context()?.userId, activityType: 'ai_collaboration.summary_generated', subjectType: 'ai_collaboration_summary', subjectId: summary.id, description: summary.title, payload: { summaryType: summary.summaryType } });
    return { summary, extractedActions, recommendations };
  }

  async extractActionItems(dto: GenerateAiSummaryDto) {
    const sourceText = await this.sourceText(dto);
    return { sourceRefs: dto.sourceRefs ?? this.defaultSourceRefs(dto), actionItems: this.extractActions(sourceText), recommendations: this.generateRecommendations(sourceText, dto.summaryType) };
  }

  async recommendationReport(spaceId?: string) {
    const summaries = await this.prisma.aiCollaborationSummary.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, spaceId: spaceId ?? undefined, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 50 });
    return summaries.map((summary: { id: string; title: string; summaryType: string; recommendations: unknown; generatedAt: Date }) => ({ summaryId: summary.id, title: summary.title, summaryType: summary.summaryType, recommendations: summary.recommendations, generatedAt: summary.generatedAt }));
  }

  private async sourceText(dto: GenerateAiSummaryDto) {
    if (dto.sourceText?.trim()) return dto.sourceText;
    if (dto.discussionId) {
      const discussion = await this.prisma.discussion.findFirst({ where: { tenantId: this.context.currentTenantId(), id: dto.discussionId, deletedAt: null }, include: { messages: { where: { deletedAt: null }, orderBy: { createdAt: 'asc' }, take: 200 } } });
      if (!discussion) throw new NotFoundException('Discussion not found for AI summary');
      return [discussion.title, ...discussion.messages.map((message: { body?: string | null }) => message.body ?? '')].join('\n');
    }
    if (dto.roomId) {
      const room = await this.prisma.decisionRoom.findFirst({ where: { tenantId: this.context.currentTenantId(), id: dto.roomId, deletedAt: null }, include: { votes: { where: { deletedAt: null } }, approvals: { where: { deletedAt: null } }, records: { where: { deletedAt: null } } } });
      if (!room) throw new NotFoundException('Decision room not found for AI summary');
      return [room.title, room.description, JSON.stringify(room.criteria), JSON.stringify(room.context), JSON.stringify(room.votes), JSON.stringify(room.approvals), JSON.stringify(room.records)].filter(Boolean).join('\n');
    }
    return dto.title;
  }

  private summarize(text: string, summaryType: string) {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    const excerpt = cleaned.length > 700 ? `${cleaned.slice(0, 700)}...` : cleaned;
    return `${summaryType} summary: ${excerpt || 'No source text provided.'}`;
  }

  private extractActions(text: string): ExtractedAction[] {
    const lines = text.split(/\r?\n|\. /).map((line) => line.trim()).filter(Boolean);
    const actionLines = lines.filter((line) => /\b(action|todo|follow up|follow-up|assign|owner|next step|deadline|approve|review)\b/i.test(line));
    return actionLines.slice(0, 10).map((line, index) => ({ title: this.titleFromLine(line, index), description: line, priority: /urgent|critical|blocker/i.test(line) ? 'high' : 'medium' }));
  }

  private titleFromLine(line: string, index: number) {
    const cleaned = line.replace(/^[-*\d.\s]+/, '').trim();
    if (!cleaned) return `Action item ${index + 1}`;
    return cleaned.length > 90 ? `${cleaned.slice(0, 90)}...` : cleaned;
  }

  private generateRecommendations(text: string, summaryType: string) {
    const recommendations: Array<Record<string, unknown>> = [];
    if (/risk|blocked|issue|delay|failed/i.test(text)) recommendations.push({ type: 'risk_review', title: 'Schedule a decision review for unresolved risks', priority: 'high' });
    if (/customer|client|lead|pipeline/i.test(text)) recommendations.push({ type: 'customer_follow_up', title: 'Create follow-up tasks for customer-facing decisions', priority: 'medium' });
    if (/budget|cost|revenue|cash/i.test(text)) recommendations.push({ type: 'financial_review', title: 'Attach finance impact to the decision record', priority: 'medium' });
    if (recommendations.length === 0) recommendations.push({ type: 'collaboration_hygiene', title: `Publish ${summaryType} notes and assign owners for next steps`, priority: 'medium' });
    return recommendations;
  }

  private defaultSourceRefs(dto: GenerateAiSummaryDto) {
    return [{ sourceType: dto.discussionId ? 'discussion' : dto.roomId ? 'decision_room' : dto.spaceId ? 'knowledge_space' : 'manual', sourceId: dto.discussionId ?? dto.roomId ?? dto.spaceId ?? 'manual' }];
  }
}