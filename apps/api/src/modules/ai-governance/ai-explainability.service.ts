import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateAIExplainabilityRecordDto } from './dto/ai-governance.dto';

@Injectable()
export class AiExplainabilityService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  records(explanationType?: string, decisionId?: string) {
    return this.prisma.aIExplainabilityRecord.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, explanationType: explanationType ?? undefined, decisionId: decisionId ?? undefined, deletedAt: null }, include: { aiModel: true, modelVersion: true, decision: true }, orderBy: { generatedAt: 'desc' }, take: 100 });
  }

  async createRecord(dto: CreateAIExplainabilityRecordDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.aIExplainabilityRecord.create({ data: { tenantId, workspaceId, aiModelId: dto.aiModelId, modelVersionId: dto.modelVersionId, decisionId: dto.decisionId, explanationKey: dto.explanationKey ?? `ai-explainability-${randomUUID()}`, explanationType: dto.explanationType ?? 'rationale', summary: dto.summary, factors: dto.factors ?? [], counterfactuals: dto.counterfactuals ?? [], confidence: dto.confidence, generatedAt: dto.generatedAt ? new Date(dto.generatedAt) : new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'ai.explainability.record.created', source: 'ai-governance', subject: { type: 'ai_explainability_record', id: record.id }, payload: { explanationType: record.explanationType, decisionId: record.decisionId, confidence: record.confidence }, actorUserId: this.context.context()?.userId });
    return record;
  }

  decisionExplanation(decisionId: string) { return this.records(undefined, decisionId); }

  async factors(aiModelId?: string) {
    const records = await this.prisma.aIExplainabilityRecord.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, aiModelId: aiModelId ?? undefined, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 100 });
    return { records, factors: records.flatMap((record: { id: string; factors: unknown }) => Array.isArray(record.factors) ? record.factors.map((factor) => ({ explainabilityRecordId: record.id, factor })) : []) };
  }
}