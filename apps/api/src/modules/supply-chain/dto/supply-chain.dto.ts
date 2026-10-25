
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateSupplyChainItemDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemKey?: string;
  @ApiProperty() @IsString() sku!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() unitOfMeasure?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() trackBatch?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() trackSerial?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() reorderPoint?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() safetyStock?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() leadTimeDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateWarehouseDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() countryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() address?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() capabilities?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateWarehouseZoneDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() zoneKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() zoneType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() temperatureClass?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateWarehouseBinDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() zoneId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() binKey?: string;
  @ApiProperty() @IsString() code!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() binType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() capacity?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateStockBalanceDto {
  @ApiPropertyOptional() @IsOptional() @IsString() costingCurrency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() unitCost?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() zoneId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() binId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() batchId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stockKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() quantityOnHand?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() quantityAvailable?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() quantityReserved?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() quantityDamaged?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() lastCountedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateInventoryBatchDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() batchKey?: string;
  @ApiProperty() @IsString() batchNumber!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() manufacturedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() receivedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() supplierReference?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() qualityStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateInventorySerialDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() batchId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serialKey?: string;
  @ApiProperty() @IsString() serialNumber!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currentWarehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currentBinId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() activatedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warrantyExpiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateInventoryAuditDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() auditKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() auditType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() countedQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() expectedQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() varianceQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() auditorUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() auditedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() findings?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateInventoryMovementHistoryDto {
  @ApiProperty() @IsString() stockId!: string;
  @ApiProperty() @IsString() currency!: string;
  @ApiProperty() @IsString() reason!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() unitCost?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceBinId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() destinationBinId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() movementKey?: string;
  @ApiProperty() @IsString() movementType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() quantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() referenceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() referenceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() occurredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateInventoryTransferDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceWarehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() destinationWarehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() transferKey?: string;
  @ApiProperty() @IsString() transferNumber!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requestedByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requestedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() shippedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() receivedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() lineItems?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateReceivingRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() receivingKey?: string;
  @ApiProperty() @IsString() receivingNumber!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() vendorId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() receivedQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() rejectedQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() receivedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() qualityStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() documents?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateFulfillmentOrderDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fulfillmentKey?: string;
  @ApiProperty() @IsString() orderNumber!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() promisedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requestedShipAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() lineItems?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() deliveryAddress?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePickingTaskDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fulfillmentOrderId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceBinId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() taskKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedToUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() quantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() pickedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePackingTaskDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fulfillmentOrderId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() taskKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedToUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() packageCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() weight?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() packedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() packaging?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateShipmentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fulfillmentOrderId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() carrierId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() shipmentKey?: string;
  @ApiProperty() @IsString() shipmentNumber!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() trackingNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serviceLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() shippedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() predictedEta?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deliveredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() delayRiskScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() exceptionStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() routePlan?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateShipmentTrackingEventDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() shipmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventKey?: string;
  @ApiProperty() @IsString() eventType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() occurredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eta?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() exceptionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() exceptionMessage?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
}

export class CreateCarrierDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() carrierKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() carrierType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() serviceLevels?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() performanceScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateDistributionCenterDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() centerKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() capacityScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() networkRole?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRouteOptimizationPlanDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() carrierId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() originCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() destinationCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() routeKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() optimizationGoal?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() estimatedCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() estimatedDurationHours?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() carbonScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() routeData?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
}

export class CreateDemandForecastModelDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() modelKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() modelType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() horizonDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() accuracyScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() seasonalityProfile?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() trendProfile?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() parameters?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateDemandForecastScenarioDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() modelId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scenarioKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scenarioType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiProperty() @IsString() periodStart!: string;
  @ApiProperty() @IsString() periodEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() forecastQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() trendAnalysis?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() seasonalityAnalysis?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() assumptions?: Record<string, unknown>;
}

export class CreateReplenishmentPlanDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() itemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() reorderPoint?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() safetyStock?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() recommendedQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() plannedOrderDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expectedReceiptDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() aiRecommendation?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSupplyChainRiskDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
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
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSupplyChainInsightDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() insightKey?: string;
  @ApiProperty() @IsString() insightType!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() generatedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() findings?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() context?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSupplyChainCopilotQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() queryKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiProperty() @IsString() query!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() response?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() context?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
}
