import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';

@Injectable()
export class ManufacturingQueryService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private scope(extra: Record<string, unknown> = {}) {
    return { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null, ...extra };
  }

  plants(status?: string) { return this.prisma.manufacturingPlant.findMany({ where: this.scope({ status: status ?? undefined }), orderBy: { updatedAt: 'desc' }, take: 100 }); }
  lines(status?: string, plantId?: string) { return this.prisma.productionLine.findMany({ where: this.scope({ status: status ?? undefined, plantId: plantId ?? undefined }), orderBy: { updatedAt: 'desc' }, take: 100 }); }
  workCenters(status?: string, plantId?: string) { return this.prisma.workCenter.findMany({ where: this.scope({ status: status ?? undefined, plantId: plantId ?? undefined }), orderBy: { updatedAt: 'desc' }, take: 100 }); }
  resources(status?: string, workCenterId?: string) { return this.prisma.factoryResource.findMany({ where: this.scope({ status: status ?? undefined, workCenterId: workCenterId ?? undefined }), orderBy: { updatedAt: 'desc' }, take: 100 }); }
  boms(status?: string) { return this.prisma.billOfMaterial.findMany({ where: this.scope({ status: status ?? undefined }), orderBy: { updatedAt: 'desc' }, take: 100 }); }
  bomComponents(bomId?: string) { return this.prisma.bomComponent.findMany({ where: this.scope({ bomId: bomId ?? undefined }), orderBy: { sequence: 'asc' }, take: 100 }); }
  plans(status?: string, plantId?: string) { return this.prisma.productionPlan.findMany({ where: this.scope({ status: status ?? undefined, plantId: plantId ?? undefined }), orderBy: { updatedAt: 'desc' }, take: 100 }); }
  schedules(status?: string, plantId?: string) { return this.prisma.productionSchedule.findMany({ where: this.scope({ status: status ?? undefined, plantId: plantId ?? undefined }), orderBy: { scheduleDate: 'asc' }, take: 100 }); }
  orders(status?: string, plantId?: string) { return this.prisma.productionOrder.findMany({ where: this.scope({ status: status ?? undefined, plantId: plantId ?? undefined }), orderBy: { updatedAt: 'desc' }, take: 100 }); }
  operations(status?: string, productionOrderId?: string) { return this.prisma.productionOperation.findMany({ where: this.scope({ status: status ?? undefined, productionOrderId: productionOrderId ?? undefined }), orderBy: { sequence: 'asc' }, take: 100 }); }
  executionRuns(status?: string, productionOrderId?: string) { return this.prisma.manufacturingExecutionRun.findMany({ where: this.scope({ status: status ?? undefined, productionOrderId: productionOrderId ?? undefined }), orderBy: { updatedAt: 'desc' }, take: 100 }); }
  materialRequirements(status?: string, productionPlanId?: string) { return this.prisma.productionMaterialRequirement.findMany({ where: this.scope({ status: status ?? undefined, productionPlanId: productionPlanId ?? undefined }), orderBy: { updatedAt: 'desc' }, take: 100 }); }
  telemetry(signalType?: string, factoryResourceId?: string) { return this.prisma.machineTelemetry.findMany({ where: this.scope({ signalType: signalType ?? undefined, factoryResourceId: factoryResourceId ?? undefined }), orderBy: { capturedAt: 'desc' }, take: 100 }); }
  inspections(status?: string, result?: string) { return this.prisma.qualityInspection.findMany({ where: this.scope({ status: status ?? undefined, result: result ?? undefined }), orderBy: { updatedAt: 'desc' }, take: 100 }); }
  qualityIssues(severity?: string, status?: string) { return this.prisma.qualityIssue.findMany({ where: this.scope({ severity: severity ?? undefined, status: status ?? undefined }), orderBy: { detectedAt: 'desc' }, take: 100 }); }
  maintenanceAssets(status?: string, criticality?: string) { return this.prisma.maintenanceAsset.findMany({ where: this.scope({ status: status ?? undefined, criticality: criticality ?? undefined }), orderBy: { updatedAt: 'desc' }, take: 100 }); }
  maintenancePredictions(riskBand?: string) { return this.prisma.maintenancePrediction.findMany({ where: this.scope({ riskBand: riskBand ?? undefined }), orderBy: { updatedAt: 'desc' }, take: 100 }); }
  costs(currency?: string, productionOrderId?: string) { return this.prisma.productionCostRecord.findMany({ where: this.scope({ currency: currency ?? undefined, productionOrderId: productionOrderId ?? undefined }), orderBy: { recordedAt: 'desc' }, take: 100 }); }
  metrics(metricType?: string, plantId?: string) { return this.prisma.manufacturingMetric.findMany({ where: this.scope({ metricType: metricType ?? undefined, plantId: plantId ?? undefined }), orderBy: { periodEnd: 'desc' }, take: 100 }); }
  risks(severity?: string, status?: string, riskType?: string) { return this.prisma.manufacturingRisk.findMany({ where: this.scope({ severity: severity ?? undefined, status: status ?? undefined, riskType: riskType ?? undefined }), orderBy: { detectedAt: 'desc' }, take: 100 }); }
  twinModels(status?: string, twinType?: string) { return this.prisma.digitalTwinModel.findMany({ where: this.scope({ status: status ?? undefined, twinType: twinType ?? undefined }), orderBy: { updatedAt: 'desc' }, take: 100 }); }
  twinSnapshots(status?: string, digitalTwinModelId?: string) { return this.prisma.digitalTwinSnapshot.findMany({ where: this.scope({ status: status ?? undefined, digitalTwinModelId: digitalTwinModelId ?? undefined }), orderBy: { capturedAt: 'desc' }, take: 100 }); }
  copilotQueries(status?: string, userId?: string) { return this.prisma.manufacturingCopilotQuery.findMany({ where: this.scope({ status: status ?? undefined, userId: userId ?? undefined }), orderBy: { createdAt: 'desc' }, take: 100 }); }
  events(eventType?: string, severity?: string) { return this.prisma.manufacturingEvent.findMany({ where: this.scope({ eventType: eventType ?? undefined, severity: severity ?? undefined }), orderBy: { occurredAt: 'desc' }, take: 100 }); }

  async analyticsDashboard() {
    const [plants, orders, runs, inspections, issues, predictions, metrics, risks, twins] = await Promise.all([
      this.plants(),
      this.orders(),
      this.executionRuns(),
      this.inspections(),
      this.qualityIssues(),
      this.maintenancePredictions(),
      this.metrics(),
      this.risks(),
      this.twinModels(),
    ]);
    return {
      plants,
      orders,
      runs,
      inspections,
      issues,
      predictions,
      metrics,
      risks,
      twins,
      summary: {
        plantCount: plants.length,
        productionOrderCount: orders.length,
        runningExecutionCount: runs.filter((run: { status: string }) => run.status === 'running').length,
        openQualityIssueCount: issues.filter((issue: { status: string }) => issue.status === 'open').length,
        highRiskCount: risks.filter((risk: { severity: string }) => ['high', 'critical'].includes(risk.severity)).length,
        digitalTwinCount: twins.length,
      },
    };
  }
}

