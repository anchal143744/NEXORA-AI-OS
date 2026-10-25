import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreatePredictionModelDto, GeneratePredictionResultDto } from './dto/strategic-forecasting.dto';

@Injectable()
export class PredictionService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  models(predictionType?: string, status?: string) {
    return this.prisma.predictionModel.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, predictionType: predictionType ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createModel(dto: CreatePredictionModelDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.predictionModel.create({ data: { tenantId, workspaceId, modelKey: dto.modelKey ?? `prediction-model-${randomUUID()}`, name: dto.name, predictionType: dto.predictionType, algorithm: dto.algorithm ?? 'ai_assisted', status: dto.status ?? 'active', targetEntity: dto.targetEntity, features: dto.features ?? [], thresholds: dto.thresholds ?? {}, trainingWindow: dto.trainingWindow ?? {}, confidence: dto.confidence, ownerUserId: dto.ownerUserId, lastTrainedAt: dto.lastTrainedAt ? new Date(dto.lastTrainedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'prediction.model.created', source: 'strategic-forecasting', subject: { type: 'prediction_model', id: record.id }, payload: { predictionType: record.predictionType, modelKey: record.modelKey }, actorUserId: this.context.context()?.userId });
    return record;
  }

  results(predictionModelId?: string, predictionType?: string, band?: string) {
    return this.prisma.predictionResult.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, predictionModelId: predictionModelId ?? undefined, predictionType: predictionType ?? undefined, band: band ?? undefined, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 100 });
  }

  async generateResult(dto: GeneratePredictionResultDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const model = await this.prisma.predictionModel.findFirst({ where: { id: dto.predictionModelId, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!model) throw new NotFoundException('Prediction model not found');
    const band = dto.band ?? this.bandFromScore(dto.score);
    const record = await this.prisma.predictionResult.create({ data: { tenantId, workspaceId, predictionModelId: dto.predictionModelId, resultKey: dto.resultKey ?? `prediction-result-${randomUUID()}`, predictionType: dto.predictionType, targetType: dto.targetType, targetId: dto.targetId, score: dto.score, probability: dto.probability, confidence: dto.confidence, band, horizonStart: dto.horizonStart ? new Date(dto.horizonStart) : undefined, horizonEnd: dto.horizonEnd ? new Date(dto.horizonEnd) : undefined, drivers: dto.drivers ?? [], explanation: dto.explanation ?? { method: 'ai_assisted_prediction', score: dto.score, band }, recommendedActions: dto.recommendedActions ?? this.defaultActions(dto.predictionType, band), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'prediction.result.generated', source: 'strategic-forecasting', subject: { type: 'prediction_result', id: record.id }, payload: { predictionType: record.predictionType, targetType: record.targetType, score: record.score, band: record.band }, actorUserId: this.context.context()?.userId });
    return record;
  }

  byType(predictionType: string) {
    return Promise.all([this.models(predictionType), this.results(undefined, predictionType)]).then(([models, results]) => ({ predictionType, models, results, summary: { modelCount: models.length, resultCount: results.length, highRiskCount: results.filter((result: { band: string }) => ['high', 'critical'].includes(result.band)).length } }));
  }

  private bandFromScore(score: number) { return score >= 0.85 ? 'critical' : score >= 0.65 ? 'high' : score >= 0.35 ? 'medium' : 'low'; }
  private defaultActions(type: string, band: string) { return ['high', 'critical'].includes(band) ? [{ action: `open_${type}_mitigation_plan` }, { action: 'notify_owner' }] : [{ action: `monitor_${type}_trend` }]; }
}