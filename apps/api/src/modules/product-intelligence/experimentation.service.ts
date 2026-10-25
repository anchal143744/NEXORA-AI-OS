import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { AddExperimentVariantDto, CreateExperimentDto, EvaluateExperimentResultDto } from './dto/product-intelligence.dto';

@Injectable()
export class ExperimentationService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  experiments(status?: string, experimentType?: string) {
    return this.prisma.experiment.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, experimentType: experimentType ?? undefined, deletedAt: null }, include: { variants: { where: { deletedAt: null } }, results: { where: { deletedAt: null }, orderBy: { evaluatedAt: 'desc' }, take: 5 } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createExperiment(dto: CreateExperimentDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const experiment = await this.prisma.experiment.create({ data: { tenantId, workspaceId, experimentKey: dto.experimentKey ?? `experiment-${randomUUID()}`, name: dto.name, hypothesis: dto.hypothesis, experimentType: dto.experimentType ?? 'ab_test', status: dto.status ?? 'draft', ownerUserId: dto.ownerUserId ?? this.context.context()?.userId, targetAudience: dto.targetAudience ?? {}, primaryMetric: dto.primaryMetric, secondaryMetrics: dto.secondaryMetrics ?? [], startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined, endedAt: dto.endedAt ? new Date(dto.endedAt) : undefined, metadata: dto.metadata ?? {} } });
    for (const variant of dto.variants ?? []) await this.addVariant(experiment.id, { name: variant.name, allocationPercent: variant.allocationPercent, isControl: variant.isControl, config: variant.config });
    await this.events.publish({ tenantId, workspaceId, type: 'experiment.created', source: 'experimentation', subject: { type: 'experiment', id: experiment.id }, payload: { name: experiment.name, experimentType: experiment.experimentType, status: experiment.status }, actorUserId: this.context.context()?.userId });
    return this.getExperiment(experiment.id);
  }

  async getExperiment(id: string) {
    const experiment = await this.prisma.experiment.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { variants: { where: { deletedAt: null } }, results: { where: { deletedAt: null }, orderBy: { evaluatedAt: 'desc' } } } });
    if (!experiment) throw new NotFoundException('Experiment not found');
    return experiment;
  }

  async addVariant(experimentId: string, dto: AddExperimentVariantDto) {
    const experiment = await this.getExperiment(experimentId);
    return this.prisma.experimentVariant.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? experiment.workspaceId ?? this.context.currentWorkspaceId(), experimentId, variantKey: dto.variantKey ?? `variant-${randomUUID()}`, name: dto.name, allocationPercent: dto.allocationPercent ?? 50, isControl: dto.isControl ?? false, config: dto.config ?? {}, metadata: dto.metadata ?? {} } });
  }

  results(experimentId?: string) {
    return this.prisma.experimentResult.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, experimentId: experimentId ?? undefined, deletedAt: null }, orderBy: { evaluatedAt: 'desc' }, take: 100 });
  }

  async evaluateResult(experimentId: string, dto: EvaluateExperimentResultDto) {
    const experiment = await this.getExperiment(experimentId);
    const sampleSize = dto.sampleSize ?? 0;
    const conversions = dto.conversions ?? 0;
    const conversionRate = dto.conversionRate ?? (sampleSize ? conversions / sampleSize : 0);
    const significant = dto.significant ?? Number(dto.pValue ?? 1) < 0.05;
    const result = await this.prisma.experimentResult.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? experiment.workspaceId ?? this.context.currentWorkspaceId(), experimentId, variantId: dto.variantId, resultKey: dto.resultKey ?? `experiment-result-${randomUUID()}`, sampleSize, conversions, conversionRate, uplift: dto.uplift, pValue: dto.pValue, significant, metricResults: dto.metricResults ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId: this.context.currentTenantId(), workspaceId: result.workspaceId ?? undefined, type: 'experiment.result.evaluated', source: 'experimentation', subject: { type: 'experiment_result', id: result.id }, payload: { experimentId, conversionRate: result.conversionRate, significant: result.significant }, actorUserId: this.context.context()?.userId });
    return result;
  }

  dashboard() {
    return this.experiments().then((experiments: Array<{ status: string; results: Array<{ significant: boolean }> }>) => ({ experimentCount: experiments.length, runningCount: experiments.filter((experiment) => experiment.status === 'running').length, significantResults: experiments.flatMap((experiment) => experiment.results).filter((result) => result.significant).length, experiments }));
  }
}
