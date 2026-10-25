import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recordKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataDomainId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceSystemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceRecordId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() masterRecordId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() goldenRecordId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() duplicateClusterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolutionRunId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() qualityRunId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lineageRecordId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() governancePolicyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stewardUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reviewerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() domain?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() entityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() entityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() externalId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lifecycleStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() qualityStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() matchStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() governanceStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() countryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() languageCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() version?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() sequence?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() matchScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() qualityScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() completenessScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() accuracyScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() consistencyScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() timelinessScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() uniquenessScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() riskScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() trustScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() mergeScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() sourcePriority?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() totalRecords?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() failedRecords?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() duplicateCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() resolvedCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isGolden?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isCanonical?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() effectiveTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reviewedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mergedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastSyncedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() attributes?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() identifiers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() relationships?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() qualityDimensions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() survivorshipRules?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() lineage?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() sourcePayload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() resolvedPayload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() createdByUserId?: string;
}

export class CreateCustomerMasterRecordDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() customerMasterRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerMasterRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() customerMasterRecordAttributes?: Record<string, unknown>;
}

export class CreateCustomerMasterProfileDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() customerMasterProfileCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerMasterProfileOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() customerMasterProfileAttributes?: Record<string, unknown>;
}

export class CreateCustomerMasterIdentifierDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() customerMasterIdentifierCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerMasterIdentifierOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() customerMasterIdentifierAttributes?: Record<string, unknown>;
}

export class CreateCustomerMasterRelationshipDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() customerMasterRelationshipCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerMasterRelationshipOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() customerMasterRelationshipAttributes?: Record<string, unknown>;
}

export class CreateVendorMasterRecordDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() vendorMasterRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() vendorMasterRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() vendorMasterRecordAttributes?: Record<string, unknown>;
}

export class CreateVendorMasterProfileDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() vendorMasterProfileCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() vendorMasterProfileOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() vendorMasterProfileAttributes?: Record<string, unknown>;
}

export class CreateVendorMasterIdentifierDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() vendorMasterIdentifierCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() vendorMasterIdentifierOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() vendorMasterIdentifierAttributes?: Record<string, unknown>;
}

export class CreateVendorMasterRelationshipDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() vendorMasterRelationshipCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() vendorMasterRelationshipOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() vendorMasterRelationshipAttributes?: Record<string, unknown>;
}

export class CreateProductMasterRecordDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productMasterRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productMasterRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() productMasterRecordAttributes?: Record<string, unknown>;
}

export class CreateProductMasterCatalogDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productMasterCatalogCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productMasterCatalogOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() productMasterCatalogAttributes?: Record<string, unknown>;
}

export class CreateProductMasterAttributeDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productMasterAttributeCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productMasterAttributeOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() productMasterAttributeAttributes?: Record<string, unknown>;
}

export class CreateProductMasterHierarchyDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() productMasterHierarchyCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productMasterHierarchyOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() productMasterHierarchyAttributes?: Record<string, unknown>;
}

export class CreateEmployeeMasterRecordDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeMasterRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeMasterRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeMasterRecordAttributes?: Record<string, unknown>;
}

export class CreateEmployeeMasterProfileDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeMasterProfileCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeMasterProfileOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeMasterProfileAttributes?: Record<string, unknown>;
}

export class CreateEmployeeMasterIdentifierDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeMasterIdentifierCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeMasterIdentifierOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeMasterIdentifierAttributes?: Record<string, unknown>;
}

export class CreateEmployeeMasterAssignmentDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() employeeMasterAssignmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() employeeMasterAssignmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() employeeMasterAssignmentAttributes?: Record<string, unknown>;
}

export class CreateAssetMasterRecordDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetMasterRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetMasterRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetMasterRecordAttributes?: Record<string, unknown>;
}

export class CreateAssetMasterProfileDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetMasterProfileCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetMasterProfileOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetMasterProfileAttributes?: Record<string, unknown>;
}

export class CreateAssetMasterIdentifierDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetMasterIdentifierCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetMasterIdentifierOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetMasterIdentifierAttributes?: Record<string, unknown>;
}

export class CreateAssetMasterHierarchyDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() assetMasterHierarchyCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assetMasterHierarchyOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() assetMasterHierarchyAttributes?: Record<string, unknown>;
}

export class CreateMdmDataQualityRuleDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDataQualityRuleCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDataQualityRuleOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmDataQualityRuleAttributes?: Record<string, unknown>;
}

export class CreateMdmDataQualityScoreDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDataQualityScoreCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDataQualityScoreOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmDataQualityScoreAttributes?: Record<string, unknown>;
}

export class CreateMdmDataQualityIssueDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDataQualityIssueCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDataQualityIssueOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmDataQualityIssueAttributes?: Record<string, unknown>;
}

export class CreateMdmDataQualityRunDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDataQualityRunCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDataQualityRunOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmDataQualityRunAttributes?: Record<string, unknown>;
}

export class CreateMdmDuplicateRuleDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDuplicateRuleCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDuplicateRuleOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmDuplicateRuleAttributes?: Record<string, unknown>;
}

export class CreateMdmDuplicateCandidateDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDuplicateCandidateCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDuplicateCandidateOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmDuplicateCandidateAttributes?: Record<string, unknown>;
}

export class CreateMdmDuplicateClusterDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDuplicateClusterCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDuplicateClusterOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmDuplicateClusterAttributes?: Record<string, unknown>;
}

export class CreateMdmDuplicateReviewDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDuplicateReviewCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDuplicateReviewOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmDuplicateReviewAttributes?: Record<string, unknown>;
}

export class CreateMdmEntityResolutionRuleDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmEntityResolutionRuleCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmEntityResolutionRuleOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmEntityResolutionRuleAttributes?: Record<string, unknown>;
}

export class CreateMdmEntityMatchDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmEntityMatchCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmEntityMatchOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmEntityMatchAttributes?: Record<string, unknown>;
}

export class CreateMdmEntityResolutionRunDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmEntityResolutionRunCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmEntityResolutionRunOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmEntityResolutionRunAttributes?: Record<string, unknown>;
}

export class CreateMdmEntityResolutionDecisionDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmEntityResolutionDecisionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmEntityResolutionDecisionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmEntityResolutionDecisionAttributes?: Record<string, unknown>;
}

export class CreateMdmGoldenRecordDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmGoldenRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmGoldenRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmGoldenRecordAttributes?: Record<string, unknown>;
}

export class CreateMdmGoldenRecordVersionDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmGoldenRecordVersionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmGoldenRecordVersionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmGoldenRecordVersionAttributes?: Record<string, unknown>;
}

export class CreateMdmSurvivorshipRuleDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmSurvivorshipRuleCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmSurvivorshipRuleOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmSurvivorshipRuleAttributes?: Record<string, unknown>;
}

export class CreateMdmMergeRequestDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmMergeRequestCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmMergeRequestOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmMergeRequestAttributes?: Record<string, unknown>;
}

export class CreateMdmGovernancePolicyDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmGovernancePolicyCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmGovernancePolicyOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmGovernancePolicyAttributes?: Record<string, unknown>;
}

export class CreateMdmStewardshipAssignmentDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmStewardshipAssignmentCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmStewardshipAssignmentOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmStewardshipAssignmentAttributes?: Record<string, unknown>;
}

export class CreateMdmDataDomainDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDataDomainCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDataDomainOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmDataDomainAttributes?: Record<string, unknown>;
}

export class CreateMdmComplianceControlDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmComplianceControlCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmComplianceControlOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmComplianceControlAttributes?: Record<string, unknown>;
}

export class CreateMdmLineageRecordDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmLineageRecordCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmLineageRecordOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmLineageRecordAttributes?: Record<string, unknown>;
}

export class CreateMdmLineageEventDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmLineageEventCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmLineageEventOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmLineageEventAttributes?: Record<string, unknown>;
}

export class CreateMdmSourceSystemDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmSourceSystemCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmSourceSystemOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmSourceSystemAttributes?: Record<string, unknown>;
}

export class CreateMdmDataContractLinkDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDataContractLinkCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmDataContractLinkOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmDataContractLinkAttributes?: Record<string, unknown>;
}

export class CreateMdmCopilotQueryDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmCopilotQueryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmCopilotQueryOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmCopilotQueryAttributes?: Record<string, unknown>;
}

export class CreateMdmRecommendationDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmRecommendationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmRecommendationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmRecommendationAttributes?: Record<string, unknown>;
}

export class CreateMdmRiskSignalDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmRiskSignalCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmRiskSignalOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmRiskSignalAttributes?: Record<string, unknown>;
}

export class CreateMdmAuditEventDto extends CreateMdmRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() mdmAuditEventCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mdmAuditEventOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mdmAuditEventAttributes?: Record<string, unknown>;
}
