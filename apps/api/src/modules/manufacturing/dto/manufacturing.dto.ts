import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

class TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateManufacturingPlantDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() plantKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() plantType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() countryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() address?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() capabilities?: Record<string, unknown>[];
}

export class CreateProductionLineDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() plantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lineKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lineType?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() capacityPerHour?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() shiftPattern?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() constraints?: Record<string, unknown>;
}

export class CreateWorkCenterDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() plantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productionLineId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workCenterKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workCenterType?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() capacityProfile?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() constraints?: Record<string, unknown>;
}

export class CreateFactoryResourceDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() plantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resourceKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resourceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() capacityUnits?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() maintenanceStatus?: string;
}

export class CreateBillOfMaterialDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() itemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bomKey?: string;
  @ApiProperty() @IsString() bomNumber!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() version?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() outputQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveTo?: string;
}

export class CreateBomComponentDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() bomId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() componentItemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() componentKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() quantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unitOfMeasure?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() scrapRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() sequence?: number;
}

export class CreateProductionPlanDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() plantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiProperty() @IsString() planningHorizonStart!: string;
  @ApiProperty() @IsString() planningHorizonEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() demandSource?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() constraints?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
}

export class CreateProductionScheduleDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productionPlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() plantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scheduleKey?: string;
  @ApiProperty() @IsString() scheduleDate!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() shift?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() capacityLoad?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() scheduleItems?: Record<string, unknown>[];
}

export class CreateProductionOrderDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productionPlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bomId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() plantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() orderKey?: string;
  @ApiProperty() @IsString() orderNumber!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() plannedQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() completedQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() startAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
}

export class CreateProductionOperationDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productionOrderId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() operationKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() sequence?: number;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() plannedDurationMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() actualDurationMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() startedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() completedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() instructions?: Record<string, unknown>;
}

export class CreateManufacturingExecutionRunDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productionOrderId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() operationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() runKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() quantityStarted?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() quantityCompleted?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() quantityScrapped?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() startedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() completedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() telemetry?: Record<string, unknown>;
}

export class CreateProductionMaterialRequirementDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productionPlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productionOrderId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requirementKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() requiredQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() availableQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() shortageQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() neededBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
}

export class CreateMachineTelemetryDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() factoryResourceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() telemetryKey?: string;
  @ApiProperty() @IsString() signalType!: string;
  @ApiProperty() @IsNumber() value!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() capturedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
}

export class CreateQualityInspectionDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productionOrderId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inspectionKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inspectionType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() result?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() inspectedQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() defectQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() inspectorUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() inspectedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() checklist?: Record<string, unknown>[];
}

export class CreateQualityIssueDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() qualityInspectionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productionOrderId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() issueKey?: string;
  @ApiProperty() @IsString() issueType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() rootCause?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() correctiveActions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() detectedAt?: string;
}

export class CreateMaintenanceAssetDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() factoryResourceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() plantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() criticality?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastServicedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nextServiceAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() sensorProfile?: Record<string, unknown>;
}

export class CreateMaintenancePredictionDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() maintenanceAssetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() predictionKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() failureProbability?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() riskBand?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() predictedFailureAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() signals?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
}

export class CreateProductionCostRecordDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productionOrderId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() plantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() materialCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() laborCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() overheadCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() totalCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() recordedAt?: string;
}

export class CreateManufacturingMetricDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() plantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productionLineId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricKey?: string;
  @ApiProperty() @IsString() metricType!: string;
  @ApiProperty() @IsString() metricName!: string;
  @ApiProperty() @IsNumber() value!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiProperty() @IsString() periodStart!: string;
  @ApiProperty() @IsString() periodEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() dimensions?: Record<string, unknown>;
}

export class CreateManufacturingRiskDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() riskKey?: string;
  @ApiProperty() @IsString() riskType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subjectType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subjectId?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() probability?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() impactScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() detectedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() signals?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() mitigationActions?: Record<string, unknown>[];
}

export class CreateDigitalTwinModelDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() plantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productionLineId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() twinKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() twinType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() simulationProfile?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() linkedEntities?: Record<string, unknown>[];
}

export class CreateDigitalTwinSnapshotDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() digitalTwinModelId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() snapshotKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() capturedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() state?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() predictions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() anomalies?: Record<string, unknown>[];
}

export class CreateManufacturingCopilotQueryDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() queryKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiProperty() @IsString() query!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() response?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() context?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
}

export class CreateManufacturingEventDto extends TenantScopedManufacturingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() plantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productionOrderId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventKey?: string;
  @ApiProperty() @IsString() eventType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subjectType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subjectId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() occurredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() processedAt?: string;
}

