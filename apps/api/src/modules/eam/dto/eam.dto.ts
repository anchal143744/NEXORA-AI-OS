import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recordKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() parentAssetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() equipmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() locationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() categoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workOrderId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() maintenancePlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contractId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warrantyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() vendorId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedToUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() iotDeviceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serialNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conditionStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lifecycleStage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() healthScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() utilizationRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() reliabilityScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() acquisitionCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() maintenanceCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() replacementCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() totalCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() acquiredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() commissionedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() retiredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() completedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastServiceAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nextServiceAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() telemetry?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metrics?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() createdByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedByUserId?: string;
}

export class CreateEnterpriseAssetDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() enterpriseAssetCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enterpriseAssetOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() enterpriseAssetAttributes?: Record<string, unknown>;
}

export class CreateAssetCategoryDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetCategoryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetCategoryOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetCategoryAttributes?: Record<string, unknown>;
}

export class CreateAssetLocationDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetLocationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetLocationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetLocationAttributes?: Record<string, unknown>;
}

export class CreateAssetTagDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetTagCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetTagOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetTagAttributes?: Record<string, unknown>;
}

export class CreateAssetLifecycleRecordDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetLifecycleRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetLifecycleRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetLifecycleRecordAttributes?: Record<string, unknown>;
}

export class CreateAssetAssignmentDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetAssignmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetAssignmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetAssignmentAttributes?: Record<string, unknown>;
}

export class CreateAssetDepreciationPolicyDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetDepreciationPolicyCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetDepreciationPolicyOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetDepreciationPolicyAttributes?: Record<string, unknown>;
}

export class CreateAssetMaintenancePlanDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetMaintenancePlanCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetMaintenancePlanOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetMaintenancePlanAttributes?: Record<string, unknown>;
}

export class CreateAssetMaintenanceScheduleDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetMaintenanceScheduleCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetMaintenanceScheduleOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetMaintenanceScheduleAttributes?: Record<string, unknown>;
}

export class CreateAssetMaintenanceTaskDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetMaintenanceTaskCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetMaintenanceTaskOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetMaintenanceTaskAttributes?: Record<string, unknown>;
}

export class CreateAssetInspectionDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetInspectionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetInspectionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetInspectionAttributes?: Record<string, unknown>;
}

export class CreateAssetWorkOrderDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetWorkOrderCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetWorkOrderOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetWorkOrderAttributes?: Record<string, unknown>;
}

export class CreateWorkOrderTaskDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workOrderTaskCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workOrderTaskOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() workOrderTaskAttributes?: Record<string, unknown>;
}

export class CreateWorkOrderPartDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workOrderPartCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workOrderPartOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() workOrderPartAttributes?: Record<string, unknown>;
}

export class CreateWorkOrderTimeEntryDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workOrderTimeEntryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workOrderTimeEntryOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() workOrderTimeEntryAttributes?: Record<string, unknown>;
}

export class CreateWorkOrderApprovalDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workOrderApprovalCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workOrderApprovalOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() workOrderApprovalAttributes?: Record<string, unknown>;
}

export class CreateAssetHealthScoreDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetHealthScoreCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetHealthScoreOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetHealthScoreAttributes?: Record<string, unknown>;
}

export class CreateAssetConditionSignalDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetConditionSignalCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetConditionSignalOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetConditionSignalAttributes?: Record<string, unknown>;
}

export class CreateAssetRiskAssessmentDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetRiskAssessmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetRiskAssessmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetRiskAssessmentAttributes?: Record<string, unknown>;
}

export class CreateAssetFailurePredictionDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetFailurePredictionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetFailurePredictionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetFailurePredictionAttributes?: Record<string, unknown>;
}

export class CreateAssetWarrantyDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetWarrantyCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetWarrantyOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetWarrantyAttributes?: Record<string, unknown>;
}

export class CreateAssetServiceContractDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetServiceContractCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetServiceContractOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetServiceContractAttributes?: Record<string, unknown>;
}

export class CreateAssetVendorAgreementDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetVendorAgreementCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetVendorAgreementOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetVendorAgreementAttributes?: Record<string, unknown>;
}

export class CreateAssetRenewalReminderDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetRenewalReminderCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetRenewalReminderOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetRenewalReminderAttributes?: Record<string, unknown>;
}

export class CreateAssetCostRecordDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetCostRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetCostRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetCostRecordAttributes?: Record<string, unknown>;
}

export class CreateAssetBudgetDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetBudgetCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetBudgetOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetBudgetAttributes?: Record<string, unknown>;
}

export class CreateAssetTcoSnapshotDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetTcoSnapshotCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetTcoSnapshotOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetTcoSnapshotAttributes?: Record<string, unknown>;
}

export class CreateAssetCostOptimizationDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetCostOptimizationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetCostOptimizationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetCostOptimizationAttributes?: Record<string, unknown>;
}

export class CreateAssetIotDeviceDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetIotDeviceCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetIotDeviceOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetIotDeviceAttributes?: Record<string, unknown>;
}

export class CreateAssetIotTelemetryDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetIotTelemetryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetIotTelemetryOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetIotTelemetryAttributes?: Record<string, unknown>;
}

export class CreateAssetIotAlertDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetIotAlertCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetIotAlertOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetIotAlertAttributes?: Record<string, unknown>;
}

export class CreateAssetSensorCalibrationDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetSensorCalibrationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetSensorCalibrationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetSensorCalibrationAttributes?: Record<string, unknown>;
}

export class CreateAssetMetricDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetMetricCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetMetricOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetMetricAttributes?: Record<string, unknown>;
}

export class CreateAssetAnalyticsSnapshotDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetAnalyticsSnapshotCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetAnalyticsSnapshotOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetAnalyticsSnapshotAttributes?: Record<string, unknown>;
}

export class CreateAssetReliabilityScoreDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetReliabilityScoreCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetReliabilityScoreOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetReliabilityScoreAttributes?: Record<string, unknown>;
}

export class CreateAssetUtilizationRecordDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetUtilizationRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetUtilizationRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetUtilizationRecordAttributes?: Record<string, unknown>;
}

export class CreateAssetCopilotQueryDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetCopilotQueryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetCopilotQueryOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetCopilotQueryAttributes?: Record<string, unknown>;
}

export class CreateAssetRecommendationDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetRecommendationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetRecommendationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetRecommendationAttributes?: Record<string, unknown>;
}

export class CreateAssetInsightDto extends CreateEamRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetInsightCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetInsightOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetInsightAttributes?: Record<string, unknown>;
}

