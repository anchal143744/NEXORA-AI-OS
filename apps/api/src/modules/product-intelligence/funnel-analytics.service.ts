import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateFunnelDefinitionDto, CreateFunnelResultDto } from './dto/product-intelligence.dto';

@Injectable()
export class FunnelAnalyticsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  funnels(funnelType?: string, status?: string) {
    return this.prisma.funnelDefinition.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, funnelType: funnelType ?? undefined, status: status ?? undefined, deletedAt: null }, include: { stages: { where: { deletedAt: null }, orderBy: { orderIndex: 'asc' } }, results: { where: { deletedAt: null }, orderBy: { calculatedAt: 'desc' }, take: 3 } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createFunnel(dto: CreateFunnelDefinitionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const funnel = await this.prisma.funnelDefinition.create({ data: { tenantId, workspaceId, funnelKey: dto.funnelKey ?? `funnel-${randomUUID()}`, name: dto.name, description: dto.description, funnelType: dto.funnelType ?? 'activation', status: dto.status ?? 'active', ownerUserId: dto.ownerUserId ?? this.context.context()?.userId, targetAudience: dto.targetAudience ?? {}, conversionGoal: dto.conversionGoal, metadata: dto.metadata ?? {} } });
    for (const [index, stage] of (dto.stages ?? []).entries()) {
      await this.prisma.funnelStage.create({ data: { tenantId, workspaceId, funnelId: funnel.id, stageKey: `funnel-stage-${randomUUID()}`, name: stage.name, orderIndex: stage.orderIndex ?? index, eventName: stage.eventName, criteria: stage.criteria ?? {}, targetConversionRate: stage.targetConversionRate } });
    }
    return this.getFunnel(funnel.id);
  }

  async getFunnel(id: string) {
    const funnel = await this.prisma.funnelDefinition.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { stages: { where: { deletedAt: null }, orderBy: { orderIndex: 'asc' } }, results: { where: { deletedAt: null }, orderBy: { calculatedAt: 'desc' } } } });
    if (!funnel) throw new NotFoundException('Funnel not found');
    return funnel;
  }

  results(funnelId?: string) {
    return this.prisma.funnelResult.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, funnelId: funnelId ?? undefined, deletedAt: null }, orderBy: { calculatedAt: 'desc' }, take: 100 });
  }

  async createResult(dto: CreateFunnelResultDto) {
    const funnel = await this.getFunnel(dto.funnelId);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? funnel.workspaceId ?? this.context.currentWorkspaceId();
    const stageResults = dto.stageResults ?? [];
    const dropOffRate = dto.dropOffRate ?? this.dropOff(stageResults);
    const result = await this.prisma.funnelResult.create({ data: { tenantId, workspaceId, funnelId: dto.funnelId, resultKey: dto.resultKey ?? `funnel-result-${randomUUID()}`, periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd), stageResults, conversionRate: dto.conversionRate, dropOffRate, bottlenecks: dto.bottlenecks ?? this.bottlenecks(stageResults), recommendations: dto.recommendations ?? this.recommendations(dropOffRate), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'funnel.result.generated', source: 'funnel-analytics', subject: { type: 'funnel_result', id: result.id }, payload: { funnelId: result.funnelId, conversionRate: result.conversionRate, dropOffRate: result.dropOffRate }, actorUserId: this.context.context()?.userId });
    return result;
  }

  bottleneckAnalysis(funnelId?: string) {
    return this.results(funnelId).then((results: Array<{ bottlenecks: unknown; dropOffRate?: number | null }>) => ({ funnelId, bottlenecks: results.flatMap((result) => Array.isArray(result.bottlenecks) ? result.bottlenecks : []), highDropOffResults: results.filter((result) => Number(result.dropOffRate ?? 0) > 0.35) }));
  }

  conversionRecommendations(funnelId?: string) {
    return this.results(funnelId).then((results: Array<{ recommendations: unknown }>) => ({ funnelId, recommendations: results.flatMap((result) => Array.isArray(result.recommendations) ? result.recommendations : []) }));
  }

  private dropOff(stageResults: Record<string, unknown>[]) { const last = stageResults[stageResults.length - 1]; return typeof last?.dropOffRate === 'number' ? last.dropOffRate : 0; }
  private bottlenecks(stageResults: Record<string, unknown>[]) { return stageResults.filter((stage) => Number(stage.dropOffRate ?? 0) > 0.35).map((stage) => ({ stage: stage.name ?? stage.stage, dropOffRate: stage.dropOffRate })); }
  private recommendations(dropOffRate: number) { return dropOffRate > 0.35 ? [{ action: 'run_funnel_experiment' }, { action: 'simplify_high_dropoff_step' }] : [{ action: 'continue_monitoring' }]; }
}
