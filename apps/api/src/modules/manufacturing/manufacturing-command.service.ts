import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { DomainEventType } from '../events/contracts/domain-event.contract';
import { TenantContextService } from '../tenants/tenant-context.service';
import {
  CreateBillOfMaterialDto,
  CreateBomComponentDto,
  CreateDigitalTwinModelDto,
  CreateDigitalTwinSnapshotDto,
  CreateFactoryResourceDto,
  CreateMachineTelemetryDto,
  CreateMaintenanceAssetDto,
  CreateMaintenancePredictionDto,
  CreateManufacturingCopilotQueryDto,
  CreateManufacturingEventDto,
  CreateManufacturingExecutionRunDto,
  CreateManufacturingMetricDto,
  CreateManufacturingPlantDto,
  CreateManufacturingRiskDto,
  CreateProductionCostRecordDto,
  CreateProductionLineDto,
  CreateProductionMaterialRequirementDto,
  CreateProductionOperationDto,
  CreateProductionOrderDto,
  CreateProductionPlanDto,
  CreateProductionScheduleDto,
  CreateQualityInspectionDto,
  CreateQualityIssueDto,
  CreateWorkCenterDto,
} from './dto/manufacturing.dto';

@Injectable()
export class ManufacturingCommandService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId(dtoWorkspaceId?: string) { return dtoWorkspaceId ?? this.context.currentWorkspaceId(); }
  private actorUserId() { return this.context.context()?.userId; }
  private date(value?: string) { return value ? new Date(value) : undefined; }

  private async publish(type: DomainEventType, workspaceId: string | undefined, subjectType: string, subjectId: string, payload: Record<string, unknown>) {
    await this.events.publish({ tenantId: this.tenantId(), workspaceId, type, source: 'manufacturing', subject: { type: subjectType, id: subjectId }, payload, actorUserId: this.actorUserId() });
  }

  async createPlant(dto: CreateManufacturingPlantDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.manufacturingPlant.create({ data: { tenantId, workspaceId, plantKey: dto.plantKey ?? 'plant-' + randomUUID(), name: dto.name, status: dto.status ?? 'active', plantType: dto.plantType ?? 'factory', countryCode: dto.countryCode, region: dto.region, timezone: dto.timezone, address: dto.address ?? {}, capabilities: dto.capabilities ?? [], metadata: dto.metadata ?? {} } });
    await this.publish('manufacturing.plant.created', workspaceId, 'manufacturing_plant', record.id, { plantKey: record.plantKey, status: record.status, countryCode: record.countryCode });
    return record;
  }

  async createProductionLine(dto: CreateProductionLineDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.productionLine.create({ data: { tenantId, workspaceId, plantId: dto.plantId, lineKey: dto.lineKey ?? 'production-line-' + randomUUID(), name: dto.name, status: dto.status ?? 'active', lineType: dto.lineType ?? 'assembly', capacityPerHour: dto.capacityPerHour ?? 0, shiftPattern: dto.shiftPattern ?? {}, constraints: dto.constraints ?? {}, metadata: dto.metadata ?? {} } });
    await this.publish('production.line.created', workspaceId, 'production_line', record.id, { lineKey: record.lineKey, status: record.status, plantId: record.plantId });
    return record;
  }

  async createWorkCenter(dto: CreateWorkCenterDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.workCenter.create({ data: { tenantId, workspaceId, plantId: dto.plantId, productionLineId: dto.productionLineId, workCenterKey: dto.workCenterKey ?? 'work-center-' + randomUUID(), name: dto.name, status: dto.status ?? 'available', workCenterType: dto.workCenterType ?? 'cell', capacityProfile: dto.capacityProfile ?? {}, constraints: dto.constraints ?? {}, metadata: dto.metadata ?? {} } });
    await this.publish('work.center.created', workspaceId, 'work_center', record.id, { workCenterKey: record.workCenterKey, status: record.status });
    return record;
  }

  async createFactoryResource(dto: CreateFactoryResourceDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.factoryResource.create({ data: { tenantId, workspaceId, plantId: dto.plantId, workCenterId: dto.workCenterId, resourceKey: dto.resourceKey ?? 'factory-resource-' + randomUUID(), name: dto.name, resourceType: dto.resourceType ?? 'machine', status: dto.status ?? 'available', capacityUnits: dto.capacityUnits ?? 0, maintenanceStatus: dto.maintenanceStatus ?? 'normal', metadata: dto.metadata ?? {} } });
    await this.publish('factory.resource.created', workspaceId, 'factory_resource', record.id, { resourceKey: record.resourceKey, status: record.status, maintenanceStatus: record.maintenanceStatus });
    return record;
  }

  async createBom(dto: CreateBillOfMaterialDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.billOfMaterial.create({ data: { tenantId, workspaceId, itemId: dto.itemId, bomKey: dto.bomKey ?? 'bom-' + randomUUID(), bomNumber: dto.bomNumber, name: dto.name, status: dto.status ?? 'draft', version: dto.version ?? 1, outputQuantity: dto.outputQuantity ?? 1, effectiveFrom: this.date(dto.effectiveFrom), effectiveTo: this.date(dto.effectiveTo), metadata: dto.metadata ?? {} } });
    await this.publish('bom.created', workspaceId, 'bill_of_material', record.id, { bomKey: record.bomKey, bomNumber: record.bomNumber, version: record.version });
    return record;
  }

  async createBomComponent(dto: CreateBomComponentDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.bomComponent.create({ data: { tenantId, workspaceId, bomId: dto.bomId, componentItemId: dto.componentItemId, componentKey: dto.componentKey ?? 'bom-component-' + randomUUID(), quantity: dto.quantity ?? 1, unitOfMeasure: dto.unitOfMeasure ?? 'each', scrapRate: dto.scrapRate ?? 0, sequence: dto.sequence ?? 1, metadata: dto.metadata ?? {} } });
    await this.publish('bom.component.created', workspaceId, 'bom_component', record.id, { componentKey: record.componentKey, bomId: record.bomId, quantity: record.quantity });
    return record;
  }

  async createProductionPlan(dto: CreateProductionPlanDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.productionPlan.create({ data: { tenantId, workspaceId, plantId: dto.plantId, planKey: dto.planKey ?? 'production-plan-' + randomUUID(), name: dto.name, status: dto.status ?? 'draft', planningHorizonStart: new Date(dto.planningHorizonStart), planningHorizonEnd: new Date(dto.planningHorizonEnd), demandSource: dto.demandSource ?? 'forecast', constraints: dto.constraints ?? {}, recommendations: dto.recommendations ?? [], metadata: dto.metadata ?? {} } });
    await this.publish('production.plan.created', workspaceId, 'production_plan', record.id, { planKey: record.planKey, status: record.status, demandSource: record.demandSource });
    return record;
  }

  async createProductionSchedule(dto: CreateProductionScheduleDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.productionSchedule.create({ data: { tenantId, workspaceId, productionPlanId: dto.productionPlanId, plantId: dto.plantId, scheduleKey: dto.scheduleKey ?? 'production-schedule-' + randomUUID(), scheduleDate: new Date(dto.scheduleDate), status: dto.status ?? 'planned', shift: dto.shift ?? 'day', capacityLoad: dto.capacityLoad ?? 0, scheduleItems: dto.scheduleItems ?? [], metadata: dto.metadata ?? {} } });
    await this.publish('production.schedule.created', workspaceId, 'production_schedule', record.id, { scheduleKey: record.scheduleKey, status: record.status, shift: record.shift });
    return record;
  }

  async createProductionOrder(dto: CreateProductionOrderDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.productionOrder.create({ data: { tenantId, workspaceId, productionPlanId: dto.productionPlanId, bomId: dto.bomId, plantId: dto.plantId, workCenterId: dto.workCenterId, orderKey: dto.orderKey ?? 'production-order-' + randomUUID(), orderNumber: dto.orderNumber, itemId: dto.itemId, status: dto.status ?? 'planned', priority: dto.priority ?? 'normal', plannedQuantity: dto.plannedQuantity ?? 0, completedQuantity: dto.completedQuantity ?? 0, startAt: this.date(dto.startAt), dueAt: this.date(dto.dueAt), metadata: dto.metadata ?? {} } });
    await this.publish('production.order.created', workspaceId, 'production_order', record.id, { orderKey: record.orderKey, orderNumber: record.orderNumber, status: record.status, priority: record.priority });
    return record;
  }

  async createProductionOperation(dto: CreateProductionOperationDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.productionOperation.create({ data: { tenantId, workspaceId, productionOrderId: dto.productionOrderId, workCenterId: dto.workCenterId, operationKey: dto.operationKey ?? 'production-operation-' + randomUUID(), sequence: dto.sequence ?? 1, name: dto.name, status: dto.status ?? 'planned', plannedDurationMinutes: dto.plannedDurationMinutes ?? 0, actualDurationMinutes: dto.actualDurationMinutes ?? 0, startedAt: this.date(dto.startedAt), completedAt: this.date(dto.completedAt), instructions: dto.instructions ?? {}, metadata: dto.metadata ?? {} } });
    await this.publish('production.operation.created', workspaceId, 'production_operation', record.id, { operationKey: record.operationKey, status: record.status, sequence: record.sequence });
    return record;
  }

  async createExecutionRun(dto: CreateManufacturingExecutionRunDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.manufacturingExecutionRun.create({ data: { tenantId, workspaceId, productionOrderId: dto.productionOrderId, operationId: dto.operationId, workCenterId: dto.workCenterId, runKey: dto.runKey ?? 'mes-run-' + randomUUID(), status: dto.status ?? 'running', quantityStarted: dto.quantityStarted ?? 0, quantityCompleted: dto.quantityCompleted ?? 0, quantityScrapped: dto.quantityScrapped ?? 0, startedAt: this.date(dto.startedAt) ?? new Date(), completedAt: this.date(dto.completedAt), telemetry: dto.telemetry ?? {}, metadata: dto.metadata ?? {} } });
    await this.publish('mes.execution.started', workspaceId, 'manufacturing_execution_run', record.id, { runKey: record.runKey, status: record.status, quantityStarted: record.quantityStarted });
    return record;
  }

  async createMaterialRequirement(dto: CreateProductionMaterialRequirementDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const requiredQuantity = dto.requiredQuantity ?? 0; const availableQuantity = dto.availableQuantity ?? 0;
    const record = await this.prisma.productionMaterialRequirement.create({ data: { tenantId, workspaceId, productionPlanId: dto.productionPlanId, productionOrderId: dto.productionOrderId, itemId: dto.itemId, requirementKey: dto.requirementKey ?? 'material-requirement-' + randomUUID(), requiredQuantity, availableQuantity, shortageQuantity: dto.shortageQuantity ?? Math.max(requiredQuantity - availableQuantity, 0), neededBy: this.date(dto.neededBy), status: dto.status ?? 'planned', metadata: dto.metadata ?? {} } });
    await this.publish('production.material.requirement.created', workspaceId, 'production_material_requirement', record.id, { requirementKey: record.requirementKey, status: record.status, shortageQuantity: record.shortageQuantity });
    return record;
  }

  async createTelemetry(dto: CreateMachineTelemetryDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.machineTelemetry.create({ data: { tenantId, workspaceId, factoryResourceId: dto.factoryResourceId, workCenterId: dto.workCenterId, telemetryKey: dto.telemetryKey ?? 'machine-telemetry-' + randomUUID(), signalType: dto.signalType, value: dto.value, unit: dto.unit, capturedAt: this.date(dto.capturedAt) ?? new Date(), payload: dto.payload ?? {}, metadata: dto.metadata ?? {} } });
    await this.publish('machine.telemetry.recorded', workspaceId, 'machine_telemetry', record.id, { telemetryKey: record.telemetryKey, signalType: record.signalType, value: record.value });
    return record;
  }

  async createQualityInspection(dto: CreateQualityInspectionDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.qualityInspection.create({ data: { tenantId, workspaceId, productionOrderId: dto.productionOrderId, itemId: dto.itemId, inspectionKey: dto.inspectionKey ?? 'quality-inspection-' + randomUUID(), inspectionType: dto.inspectionType ?? 'in_process', status: dto.status ?? 'open', result: dto.result ?? 'pending', inspectedQuantity: dto.inspectedQuantity ?? 0, defectQuantity: dto.defectQuantity ?? 0, inspectorUserId: dto.inspectorUserId, inspectedAt: this.date(dto.inspectedAt), checklist: dto.checklist ?? [], metadata: dto.metadata ?? {} } });
    await this.publish('quality.inspection.created', workspaceId, 'quality_inspection', record.id, { inspectionKey: record.inspectionKey, result: record.result, status: record.status });
    return record;
  }

  async createQualityIssue(dto: CreateQualityIssueDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.qualityIssue.create({ data: { tenantId, workspaceId, qualityInspectionId: dto.qualityInspectionId, productionOrderId: dto.productionOrderId, issueKey: dto.issueKey ?? 'quality-issue-' + randomUUID(), issueType: dto.issueType, severity: dto.severity ?? 'medium', status: dto.status ?? 'open', rootCause: dto.rootCause, correctiveActions: dto.correctiveActions ?? [], detectedAt: this.date(dto.detectedAt) ?? new Date(), metadata: dto.metadata ?? {} } });
    await this.publish('quality.issue.created', workspaceId, 'quality_issue', record.id, { issueKey: record.issueKey, issueType: record.issueType, severity: record.severity });
    return record;
  }

  async createMaintenanceAsset(dto: CreateMaintenanceAssetDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.maintenanceAsset.create({ data: { tenantId, workspaceId, factoryResourceId: dto.factoryResourceId, plantId: dto.plantId, assetKey: dto.assetKey ?? 'maintenance-asset-' + randomUUID(), name: dto.name, assetType: dto.assetType ?? 'machine', status: dto.status ?? 'operational', criticality: dto.criticality ?? 'medium', lastServicedAt: this.date(dto.lastServicedAt), nextServiceAt: this.date(dto.nextServiceAt), sensorProfile: dto.sensorProfile ?? {}, metadata: dto.metadata ?? {} } });
    await this.publish('maintenance.asset.created', workspaceId, 'maintenance_asset', record.id, { assetKey: record.assetKey, status: record.status, criticality: record.criticality });
    return record;
  }

  async createMaintenancePrediction(dto: CreateMaintenancePredictionDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.maintenancePrediction.create({ data: { tenantId, workspaceId, maintenanceAssetId: dto.maintenanceAssetId, predictionKey: dto.predictionKey ?? 'maintenance-prediction-' + randomUUID(), failureProbability: dto.failureProbability ?? 0, riskBand: dto.riskBand ?? 'low', predictedFailureAt: this.date(dto.predictedFailureAt), confidence: dto.confidence ?? 0, signals: dto.signals ?? [], recommendations: dto.recommendations ?? [], metadata: dto.metadata ?? {} } });
    await this.publish('maintenance.prediction.created', workspaceId, 'maintenance_prediction', record.id, { predictionKey: record.predictionKey, riskBand: record.riskBand, confidence: record.confidence });
    return record;
  }

  async createCostRecord(dto: CreateProductionCostRecordDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const totalCost = dto.totalCost ?? ((dto.materialCost ?? 0) + (dto.laborCost ?? 0) + (dto.overheadCost ?? 0));
    const record = await this.prisma.productionCostRecord.create({ data: { tenantId, workspaceId, productionOrderId: dto.productionOrderId, plantId: dto.plantId, costKey: dto.costKey ?? 'production-cost-' + randomUUID(), costType: dto.costType ?? 'actual', currency: dto.currency ?? 'USD', materialCost: dto.materialCost ?? 0, laborCost: dto.laborCost ?? 0, overheadCost: dto.overheadCost ?? 0, totalCost, recordedAt: this.date(dto.recordedAt) ?? new Date(), metadata: dto.metadata ?? {} } });
    await this.publish('production.cost.recorded', workspaceId, 'production_cost_record', record.id, { costKey: record.costKey, currency: record.currency, totalCost: record.totalCost });
    return record;
  }

  async createMetric(dto: CreateManufacturingMetricDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.manufacturingMetric.create({ data: { tenantId, workspaceId, plantId: dto.plantId, productionLineId: dto.productionLineId, workCenterId: dto.workCenterId, metricKey: dto.metricKey ?? 'manufacturing-metric-' + randomUUID(), metricType: dto.metricType, metricName: dto.metricName, value: dto.value, unit: dto.unit ?? 'count', periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd), dimensions: dto.dimensions ?? {}, metadata: dto.metadata ?? {} } });
    await this.publish('manufacturing.metric.recorded', workspaceId, 'manufacturing_metric', record.id, { metricKey: record.metricKey, metricType: record.metricType, value: record.value });
    return record;
  }

  async createRisk(dto: CreateManufacturingRiskDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.manufacturingRisk.create({ data: { tenantId, workspaceId, riskKey: dto.riskKey ?? 'manufacturing-risk-' + randomUUID(), riskType: dto.riskType, severity: dto.severity ?? 'medium', status: dto.status ?? 'open', subjectType: dto.subjectType, subjectId: dto.subjectId, probability: dto.probability ?? 0, impactScore: dto.impactScore ?? 0, detectedAt: this.date(dto.detectedAt) ?? new Date(), signals: dto.signals ?? [], mitigationActions: dto.mitigationActions ?? [], metadata: dto.metadata ?? {} } });
    await this.publish('manufacturing.risk.detected', workspaceId, 'manufacturing_risk', record.id, { riskKey: record.riskKey, riskType: record.riskType, severity: record.severity });
    return record;
  }

  async createDigitalTwinModel(dto: CreateDigitalTwinModelDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.digitalTwinModel.create({ data: { tenantId, workspaceId, plantId: dto.plantId, productionLineId: dto.productionLineId, twinKey: dto.twinKey ?? 'digital-twin-' + randomUUID(), name: dto.name, twinType: dto.twinType ?? 'factory', status: dto.status ?? 'active', simulationProfile: dto.simulationProfile ?? {}, linkedEntities: dto.linkedEntities ?? [], metadata: dto.metadata ?? {} } });
    await this.publish('digital.twin.model.created', workspaceId, 'digital_twin_model', record.id, { twinKey: record.twinKey, twinType: record.twinType, status: record.status });
    return record;
  }

  async createDigitalTwinSnapshot(dto: CreateDigitalTwinSnapshotDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.digitalTwinSnapshot.create({ data: { tenantId, workspaceId, digitalTwinModelId: dto.digitalTwinModelId, snapshotKey: dto.snapshotKey ?? 'digital-twin-snapshot-' + randomUUID(), status: dto.status ?? 'captured', capturedAt: this.date(dto.capturedAt) ?? new Date(), state: dto.state ?? {}, predictions: dto.predictions ?? [], anomalies: dto.anomalies ?? [], metadata: dto.metadata ?? {} } });
    await this.publish('digital.twin.snapshot.created', workspaceId, 'digital_twin_snapshot', record.id, { snapshotKey: record.snapshotKey, status: record.status });
    return record;
  }

  async createCopilotQuery(dto: CreateManufacturingCopilotQueryDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const response = dto.response ?? 'Manufacturing copilot assembled plant, production, quality, maintenance, cost, risk and digital twin context for governed analysis.';
    const record = await this.prisma.manufacturingCopilotQuery.create({ data: { tenantId, workspaceId, queryKey: dto.queryKey ?? 'manufacturing-copilot-' + randomUUID(), userId: dto.userId ?? this.actorUserId(), query: dto.query, response, status: dto.status ?? 'completed', context: dto.context ?? {}, recommendations: dto.recommendations ?? [], metadata: dto.metadata ?? {} } });
    await this.publish('manufacturing.copilot.queried', workspaceId, 'manufacturing_copilot_query', record.id, { queryKey: record.queryKey, status: record.status });
    return record;
  }

  async createEvent(dto: CreateManufacturingEventDto) {
    const tenantId = this.tenantId(); const workspaceId = this.workspaceId(dto.workspaceId);
    const record = await this.prisma.manufacturingEvent.create({ data: { tenantId, workspaceId, plantId: dto.plantId, productionOrderId: dto.productionOrderId, eventKey: dto.eventKey ?? 'manufacturing-event-' + randomUUID(), eventType: dto.eventType, source: dto.source ?? 'manufacturing', severity: dto.severity ?? 'info', subjectType: dto.subjectType, subjectId: dto.subjectId, payload: dto.payload ?? {}, occurredAt: this.date(dto.occurredAt) ?? new Date(), processedAt: this.date(dto.processedAt), metadata: dto.metadata ?? {} } });
    await this.publish('manufacturing.event.created', workspaceId, 'manufacturing_event', record.id, { eventKey: record.eventKey, eventType: record.eventType, severity: record.severity });
    return record;
  }
}

