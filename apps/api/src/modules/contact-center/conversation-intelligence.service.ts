import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { ConversationActionExtractionDto, CreateConversationSummaryDto, EscalationRecommendationDto, IntentDetectionDto, RiskDetectionDto, SentimentAnalysisDto } from './dto/contact-center.dto';

@Injectable()
export class ConversationIntelligenceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  async analyzeSentiment(dto: SentimentAnalysisDto) {
    const result = this.scoreSentiment(dto.sourceText);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.sentimentRecord.create({ data: { tenantId, workspaceId, conversationId: dto.conversationId, messageId: dto.messageId, voiceSessionId: dto.voiceSessionId, customerIdentityId: dto.customerIdentityId, sentiment: result.sentiment, score: result.score, confidence: result.confidence, sourceText: dto.sourceText, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'conversation.sentiment.detected', source: 'conversation-intelligence', subject: { type: 'sentiment_record', id: record.id }, payload: { sentiment: record.sentiment, score: record.score, conversationId: record.conversationId }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async detectIntent(dto: IntentDetectionDto) {
    const result = this.detectIntentFromText(dto.sourceText);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.intentRecord.create({ data: { tenantId, workspaceId, conversationId: dto.conversationId, messageId: dto.messageId, voiceSessionId: dto.voiceSessionId, customerIdentityId: dto.customerIdentityId, intent: result.intent, category: result.category, confidence: result.confidence, entities: result.entities, sourceText: dto.sourceText, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'conversation.intent.detected', source: 'conversation-intelligence', subject: { type: 'intent_record', id: record.id }, payload: { intent: record.intent, category: record.category, conversationId: record.conversationId }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async summarize(dto: CreateConversationSummaryDto) {
    const sentiment = this.scoreSentiment(dto.sourceText);
    const extractedActions = this.extractActionItems(dto.sourceText);
    const risks = this.findRisks(dto.sourceText);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const summary = await this.prisma.conversationSummary.create({ data: { tenantId, workspaceId, summaryKey: dto.summaryKey ?? `conversation-summary-${randomUUID()}`, conversationId: dto.conversationId, voiceSessionId: dto.voiceSessionId, customerIdentityId: dto.customerIdentityId, summaryType: dto.summaryType ?? 'conversation', title: dto.title, summaryText: this.buildSummary(dto.sourceText), decisions: dto.decisions ?? this.extractDecisions(dto.sourceText), actionItems: dto.actionItems ?? extractedActions, followUps: dto.followUps ?? this.extractFollowUps(dto.sourceText), risks: dto.risks ?? risks, sentiment, generatedBy: 'nexora-conversation-intelligence', metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'conversation.summary.generated', source: 'conversation-intelligence', subject: { type: 'conversation_summary', id: summary.id }, payload: { title: summary.title, summaryType: summary.summaryType, conversationId: summary.conversationId, riskCount: risks.length }, actorUserId: this.context.context()?.userId });
    return summary;
  }

  async insights(conversationId: string) {
    const [sentiment, intents, summaries, escalations] = await Promise.all([
      this.prisma.sentimentRecord.findMany({ where: { tenantId: this.context.currentTenantId(), conversationId, deletedAt: null }, orderBy: { detectedAt: 'desc' }, take: 25 }),
      this.prisma.intentRecord.findMany({ where: { tenantId: this.context.currentTenantId(), conversationId, deletedAt: null }, orderBy: { detectedAt: 'desc' }, take: 25 }),
      this.prisma.conversationSummary.findMany({ where: { tenantId: this.context.currentTenantId(), conversationId, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 10 }),
      this.prisma.escalationEvent.findMany({ where: { tenantId: this.context.currentTenantId(), conversationId, deletedAt: null }, orderBy: { escalatedAt: 'desc' }, take: 10 }),
    ]);
    return { conversationId, sentiment, intents, summaries, escalations };
  }

  extractActions(dto: ConversationActionExtractionDto) {
    return { actionItems: this.extractActionItems(dto.sourceText), followUps: this.extractFollowUps(dto.sourceText) };
  }

  detectRisk(dto: RiskDetectionDto) {
    const risks = this.findRisks(dto.sourceText);
    const priority = risks.some((risk) => risk.severity === 'critical') ? 'critical' : risks.some((risk) => risk.severity === 'high') ? 'high' : risks.length ? 'medium' : 'low';
    return { priority, risks };
  }

  recommendEscalation(dto: EscalationRecommendationDto) {
    const sentiment = this.scoreSentiment(dto.sourceText);
    const risks = this.findRisks(dto.sourceText);
    const shouldEscalate = sentiment.score < -0.35 || risks.some((risk) => ['high', 'critical'].includes(risk.severity));
    return { shouldEscalate, recommendedQueue: shouldEscalate ? 'priority-support' : 'standard-support', severity: risks[0]?.severity ?? (sentiment.score < -0.35 ? 'high' : 'low'), rationale: shouldEscalate ? 'Negative sentiment or explicit risk language detected.' : 'No escalation threshold reached.', sentiment, risks };
  }

  private scoreSentiment(text: string) {
    const normalized = text.toLowerCase();
    const positive = ['great', 'thanks', 'resolved', 'happy', 'excellent', 'good', 'appreciate', 'love'].filter((word) => normalized.includes(word)).length;
    const negative = ['angry', 'cancel', 'bad', 'broken', 'late', 'refund', 'complaint', 'urgent', 'unacceptable', 'risk'].filter((word) => normalized.includes(word)).length;
    const raw = positive - negative;
    const score = Math.max(-1, Math.min(1, raw / 4));
    const sentiment = score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral';
    return { sentiment, score, confidence: Math.min(0.95, 0.55 + Math.abs(score) * 0.4) };
  }

  private detectIntentFromText(text: string) {
    const normalized = text.toLowerCase();
    if (normalized.includes('refund') || normalized.includes('invoice') || normalized.includes('payment')) return { intent: 'billing_support', category: 'finance', confidence: 0.86, entities: this.entities(text) };
    if (normalized.includes('schedule') || normalized.includes('appointment') || normalized.includes('meeting')) return { intent: 'appointment_request', category: 'scheduling', confidence: 0.84, entities: this.entities(text) };
    if (normalized.includes('cancel') || normalized.includes('churn')) return { intent: 'retention_risk', category: 'customer_success', confidence: 0.9, entities: this.entities(text) };
    if (normalized.includes('demo') || normalized.includes('pricing') || normalized.includes('upgrade')) return { intent: 'sales_opportunity', category: 'sales', confidence: 0.82, entities: this.entities(text) };
    return { intent: 'general_support', category: 'support', confidence: 0.65, entities: this.entities(text) };
  }

  private entities(text: string) {
    const emails = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
    const amounts = text.match(/[$€£?]\s?\d+(?:,\d{3})*(?:\.\d+)?/g) ?? [];
    return [{ type: 'email', values: emails }, { type: 'amount', values: amounts }].filter((entry) => entry.values.length > 0);
  }

  private extractActionItems(text: string) {
    const sentences = this.sentences(text);
    return sentences.filter((sentence) => /follow up|send|create|schedule|assign|call|review/i.test(sentence)).map((sentence, index) => ({ key: `action-${index + 1}`, title: sentence.slice(0, 160), priority: /urgent|today|asap/i.test(sentence) ? 'high' : 'normal' }));
  }

  private extractFollowUps(text: string) {
    return this.sentences(text).filter((sentence) => /follow up|next step|tomorrow|next week|later/i.test(sentence)).map((sentence, index) => ({ key: `follow-up-${index + 1}`, note: sentence.slice(0, 180) }));
  }

  private extractDecisions(text: string) {
    return this.sentences(text).filter((sentence) => /decided|approved|agreed|confirmed/i.test(sentence)).map((sentence, index) => ({ key: `decision-${index + 1}`, outcome: sentence.slice(0, 180) }));
  }

  private findRisks(text: string) {
    return this.sentences(text).filter((sentence) => /risk|blocked|angry|cancel|churn|unacceptable|legal|compliance|security|refund/i.test(sentence)).map((sentence, index) => ({ key: `risk-${index + 1}`, severity: /legal|security|compliance|cancel|churn/i.test(sentence) ? 'high' : 'medium', detail: sentence.slice(0, 200) }));
  }

  private buildSummary(text: string) {
    const sentences = this.sentences(text);
    return sentences.slice(0, 3).join(' ') || text.slice(0, 500);
  }

  private sentences(text: string) {
    return text.split(/[.!?]\s+/).map((sentence) => sentence.trim()).filter(Boolean);
  }
}
