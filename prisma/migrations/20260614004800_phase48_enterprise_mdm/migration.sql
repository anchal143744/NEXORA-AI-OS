-- Phase 48 - Enterprise Master Data Management and Data Intelligence
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TABLE IF NOT EXISTS "customer_master_records" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "customer_master_records_tenant_record_key_uidx" ON "customer_master_records" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "customer_master_records_tenant_workspace_idx" ON "customer_master_records" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "customer_master_records_tenant_status_idx" ON "customer_master_records" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "customer_master_records_tenant_domain_idx" ON "customer_master_records" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "customer_master_records_tenant_entity_type_idx" ON "customer_master_records" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "customer_master_records_data_domain_idx" ON "customer_master_records" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "customer_master_records_source_system_idx" ON "customer_master_records" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "customer_master_records_master_record_idx" ON "customer_master_records" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "customer_master_records_golden_record_idx" ON "customer_master_records" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "customer_master_records_duplicate_cluster_idx" ON "customer_master_records" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "customer_master_records_resolution_run_idx" ON "customer_master_records" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "customer_master_records_quality_run_idx" ON "customer_master_records" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "customer_master_records_steward_idx" ON "customer_master_records" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "customer_master_records_owner_idx" ON "customer_master_records" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "customer_master_records_quality_status_idx" ON "customer_master_records" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "customer_master_records_match_status_idx" ON "customer_master_records" ("matchStatus");
CREATE INDEX IF NOT EXISTS "customer_master_records_governance_status_idx" ON "customer_master_records" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "customer_master_records_risk_idx" ON "customer_master_records" ("riskLevel");
CREATE INDEX IF NOT EXISTS "customer_master_records_deleted_idx" ON "customer_master_records" ("deletedAt");


CREATE TABLE IF NOT EXISTS "customer_master_profiles" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "customer_master_profiles_tenant_record_key_uidx" ON "customer_master_profiles" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_tenant_workspace_idx" ON "customer_master_profiles" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_tenant_status_idx" ON "customer_master_profiles" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_tenant_domain_idx" ON "customer_master_profiles" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_tenant_entity_type_idx" ON "customer_master_profiles" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_data_domain_idx" ON "customer_master_profiles" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_source_system_idx" ON "customer_master_profiles" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_master_record_idx" ON "customer_master_profiles" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_golden_record_idx" ON "customer_master_profiles" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_duplicate_cluster_idx" ON "customer_master_profiles" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_resolution_run_idx" ON "customer_master_profiles" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_quality_run_idx" ON "customer_master_profiles" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_steward_idx" ON "customer_master_profiles" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_owner_idx" ON "customer_master_profiles" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_quality_status_idx" ON "customer_master_profiles" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_match_status_idx" ON "customer_master_profiles" ("matchStatus");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_governance_status_idx" ON "customer_master_profiles" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_risk_idx" ON "customer_master_profiles" ("riskLevel");
CREATE INDEX IF NOT EXISTS "customer_master_profiles_deleted_idx" ON "customer_master_profiles" ("deletedAt");


CREATE TABLE IF NOT EXISTS "customer_master_identifiers" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "customer_master_identifiers_tenant_record_key_uidx" ON "customer_master_identifiers" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_tenant_workspace_idx" ON "customer_master_identifiers" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_tenant_status_idx" ON "customer_master_identifiers" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_tenant_domain_idx" ON "customer_master_identifiers" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_tenant_entity_type_idx" ON "customer_master_identifiers" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_data_domain_idx" ON "customer_master_identifiers" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_source_system_idx" ON "customer_master_identifiers" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_master_record_idx" ON "customer_master_identifiers" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_golden_record_idx" ON "customer_master_identifiers" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_duplicate_cluster_idx" ON "customer_master_identifiers" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_resolution_run_idx" ON "customer_master_identifiers" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_quality_run_idx" ON "customer_master_identifiers" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_steward_idx" ON "customer_master_identifiers" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_owner_idx" ON "customer_master_identifiers" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_quality_status_idx" ON "customer_master_identifiers" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_match_status_idx" ON "customer_master_identifiers" ("matchStatus");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_governance_status_idx" ON "customer_master_identifiers" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_risk_idx" ON "customer_master_identifiers" ("riskLevel");
CREATE INDEX IF NOT EXISTS "customer_master_identifiers_deleted_idx" ON "customer_master_identifiers" ("deletedAt");


CREATE TABLE IF NOT EXISTS "customer_master_relationships" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "customer_master_relationships_tenant_record_key_uidx" ON "customer_master_relationships" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_tenant_workspace_idx" ON "customer_master_relationships" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_tenant_status_idx" ON "customer_master_relationships" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_tenant_domain_idx" ON "customer_master_relationships" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_tenant_entity_type_idx" ON "customer_master_relationships" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_data_domain_idx" ON "customer_master_relationships" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_source_system_idx" ON "customer_master_relationships" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_master_record_idx" ON "customer_master_relationships" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_golden_record_idx" ON "customer_master_relationships" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_duplicate_cluster_idx" ON "customer_master_relationships" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_resolution_run_idx" ON "customer_master_relationships" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_quality_run_idx" ON "customer_master_relationships" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_steward_idx" ON "customer_master_relationships" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_owner_idx" ON "customer_master_relationships" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_quality_status_idx" ON "customer_master_relationships" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_match_status_idx" ON "customer_master_relationships" ("matchStatus");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_governance_status_idx" ON "customer_master_relationships" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_risk_idx" ON "customer_master_relationships" ("riskLevel");
CREATE INDEX IF NOT EXISTS "customer_master_relationships_deleted_idx" ON "customer_master_relationships" ("deletedAt");


CREATE TABLE IF NOT EXISTS "vendor_master_records" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "vendor_master_records_tenant_record_key_uidx" ON "vendor_master_records" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "vendor_master_records_tenant_workspace_idx" ON "vendor_master_records" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "vendor_master_records_tenant_status_idx" ON "vendor_master_records" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "vendor_master_records_tenant_domain_idx" ON "vendor_master_records" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "vendor_master_records_tenant_entity_type_idx" ON "vendor_master_records" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "vendor_master_records_data_domain_idx" ON "vendor_master_records" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "vendor_master_records_source_system_idx" ON "vendor_master_records" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "vendor_master_records_master_record_idx" ON "vendor_master_records" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "vendor_master_records_golden_record_idx" ON "vendor_master_records" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "vendor_master_records_duplicate_cluster_idx" ON "vendor_master_records" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "vendor_master_records_resolution_run_idx" ON "vendor_master_records" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "vendor_master_records_quality_run_idx" ON "vendor_master_records" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "vendor_master_records_steward_idx" ON "vendor_master_records" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "vendor_master_records_owner_idx" ON "vendor_master_records" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "vendor_master_records_quality_status_idx" ON "vendor_master_records" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "vendor_master_records_match_status_idx" ON "vendor_master_records" ("matchStatus");
CREATE INDEX IF NOT EXISTS "vendor_master_records_governance_status_idx" ON "vendor_master_records" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "vendor_master_records_risk_idx" ON "vendor_master_records" ("riskLevel");
CREATE INDEX IF NOT EXISTS "vendor_master_records_deleted_idx" ON "vendor_master_records" ("deletedAt");


CREATE TABLE IF NOT EXISTS "vendor_master_profiles" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "vendor_master_profiles_tenant_record_key_uidx" ON "vendor_master_profiles" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_tenant_workspace_idx" ON "vendor_master_profiles" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_tenant_status_idx" ON "vendor_master_profiles" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_tenant_domain_idx" ON "vendor_master_profiles" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_tenant_entity_type_idx" ON "vendor_master_profiles" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_data_domain_idx" ON "vendor_master_profiles" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_source_system_idx" ON "vendor_master_profiles" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_master_record_idx" ON "vendor_master_profiles" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_golden_record_idx" ON "vendor_master_profiles" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_duplicate_cluster_idx" ON "vendor_master_profiles" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_resolution_run_idx" ON "vendor_master_profiles" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_quality_run_idx" ON "vendor_master_profiles" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_steward_idx" ON "vendor_master_profiles" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_owner_idx" ON "vendor_master_profiles" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_quality_status_idx" ON "vendor_master_profiles" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_match_status_idx" ON "vendor_master_profiles" ("matchStatus");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_governance_status_idx" ON "vendor_master_profiles" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_risk_idx" ON "vendor_master_profiles" ("riskLevel");
CREATE INDEX IF NOT EXISTS "vendor_master_profiles_deleted_idx" ON "vendor_master_profiles" ("deletedAt");


CREATE TABLE IF NOT EXISTS "vendor_master_identifiers" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "vendor_master_identifiers_tenant_record_key_uidx" ON "vendor_master_identifiers" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_tenant_workspace_idx" ON "vendor_master_identifiers" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_tenant_status_idx" ON "vendor_master_identifiers" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_tenant_domain_idx" ON "vendor_master_identifiers" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_tenant_entity_type_idx" ON "vendor_master_identifiers" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_data_domain_idx" ON "vendor_master_identifiers" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_source_system_idx" ON "vendor_master_identifiers" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_master_record_idx" ON "vendor_master_identifiers" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_golden_record_idx" ON "vendor_master_identifiers" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_duplicate_cluster_idx" ON "vendor_master_identifiers" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_resolution_run_idx" ON "vendor_master_identifiers" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_quality_run_idx" ON "vendor_master_identifiers" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_steward_idx" ON "vendor_master_identifiers" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_owner_idx" ON "vendor_master_identifiers" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_quality_status_idx" ON "vendor_master_identifiers" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_match_status_idx" ON "vendor_master_identifiers" ("matchStatus");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_governance_status_idx" ON "vendor_master_identifiers" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_risk_idx" ON "vendor_master_identifiers" ("riskLevel");
CREATE INDEX IF NOT EXISTS "vendor_master_identifiers_deleted_idx" ON "vendor_master_identifiers" ("deletedAt");


CREATE TABLE IF NOT EXISTS "vendor_master_relationships" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "vendor_master_relationships_tenant_record_key_uidx" ON "vendor_master_relationships" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_tenant_workspace_idx" ON "vendor_master_relationships" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_tenant_status_idx" ON "vendor_master_relationships" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_tenant_domain_idx" ON "vendor_master_relationships" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_tenant_entity_type_idx" ON "vendor_master_relationships" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_data_domain_idx" ON "vendor_master_relationships" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_source_system_idx" ON "vendor_master_relationships" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_master_record_idx" ON "vendor_master_relationships" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_golden_record_idx" ON "vendor_master_relationships" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_duplicate_cluster_idx" ON "vendor_master_relationships" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_resolution_run_idx" ON "vendor_master_relationships" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_quality_run_idx" ON "vendor_master_relationships" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_steward_idx" ON "vendor_master_relationships" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_owner_idx" ON "vendor_master_relationships" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_quality_status_idx" ON "vendor_master_relationships" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_match_status_idx" ON "vendor_master_relationships" ("matchStatus");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_governance_status_idx" ON "vendor_master_relationships" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_risk_idx" ON "vendor_master_relationships" ("riskLevel");
CREATE INDEX IF NOT EXISTS "vendor_master_relationships_deleted_idx" ON "vendor_master_relationships" ("deletedAt");


CREATE TABLE IF NOT EXISTS "product_master_records" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "product_master_records_tenant_record_key_uidx" ON "product_master_records" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "product_master_records_tenant_workspace_idx" ON "product_master_records" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "product_master_records_tenant_status_idx" ON "product_master_records" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "product_master_records_tenant_domain_idx" ON "product_master_records" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "product_master_records_tenant_entity_type_idx" ON "product_master_records" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "product_master_records_data_domain_idx" ON "product_master_records" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "product_master_records_source_system_idx" ON "product_master_records" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "product_master_records_master_record_idx" ON "product_master_records" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "product_master_records_golden_record_idx" ON "product_master_records" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "product_master_records_duplicate_cluster_idx" ON "product_master_records" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "product_master_records_resolution_run_idx" ON "product_master_records" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "product_master_records_quality_run_idx" ON "product_master_records" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "product_master_records_steward_idx" ON "product_master_records" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "product_master_records_owner_idx" ON "product_master_records" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "product_master_records_quality_status_idx" ON "product_master_records" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "product_master_records_match_status_idx" ON "product_master_records" ("matchStatus");
CREATE INDEX IF NOT EXISTS "product_master_records_governance_status_idx" ON "product_master_records" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "product_master_records_risk_idx" ON "product_master_records" ("riskLevel");
CREATE INDEX IF NOT EXISTS "product_master_records_deleted_idx" ON "product_master_records" ("deletedAt");


CREATE TABLE IF NOT EXISTS "product_master_catalogs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "product_master_catalogs_tenant_record_key_uidx" ON "product_master_catalogs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_tenant_workspace_idx" ON "product_master_catalogs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_tenant_status_idx" ON "product_master_catalogs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_tenant_domain_idx" ON "product_master_catalogs" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_tenant_entity_type_idx" ON "product_master_catalogs" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_data_domain_idx" ON "product_master_catalogs" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_source_system_idx" ON "product_master_catalogs" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_master_record_idx" ON "product_master_catalogs" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_golden_record_idx" ON "product_master_catalogs" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_duplicate_cluster_idx" ON "product_master_catalogs" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_resolution_run_idx" ON "product_master_catalogs" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_quality_run_idx" ON "product_master_catalogs" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_steward_idx" ON "product_master_catalogs" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_owner_idx" ON "product_master_catalogs" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_quality_status_idx" ON "product_master_catalogs" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_match_status_idx" ON "product_master_catalogs" ("matchStatus");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_governance_status_idx" ON "product_master_catalogs" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_risk_idx" ON "product_master_catalogs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "product_master_catalogs_deleted_idx" ON "product_master_catalogs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "product_master_attributes" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "product_master_attributes_tenant_record_key_uidx" ON "product_master_attributes" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "product_master_attributes_tenant_workspace_idx" ON "product_master_attributes" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "product_master_attributes_tenant_status_idx" ON "product_master_attributes" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "product_master_attributes_tenant_domain_idx" ON "product_master_attributes" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "product_master_attributes_tenant_entity_type_idx" ON "product_master_attributes" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "product_master_attributes_data_domain_idx" ON "product_master_attributes" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "product_master_attributes_source_system_idx" ON "product_master_attributes" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "product_master_attributes_master_record_idx" ON "product_master_attributes" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "product_master_attributes_golden_record_idx" ON "product_master_attributes" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "product_master_attributes_duplicate_cluster_idx" ON "product_master_attributes" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "product_master_attributes_resolution_run_idx" ON "product_master_attributes" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "product_master_attributes_quality_run_idx" ON "product_master_attributes" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "product_master_attributes_steward_idx" ON "product_master_attributes" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "product_master_attributes_owner_idx" ON "product_master_attributes" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "product_master_attributes_quality_status_idx" ON "product_master_attributes" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "product_master_attributes_match_status_idx" ON "product_master_attributes" ("matchStatus");
CREATE INDEX IF NOT EXISTS "product_master_attributes_governance_status_idx" ON "product_master_attributes" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "product_master_attributes_risk_idx" ON "product_master_attributes" ("riskLevel");
CREATE INDEX IF NOT EXISTS "product_master_attributes_deleted_idx" ON "product_master_attributes" ("deletedAt");


CREATE TABLE IF NOT EXISTS "product_master_hierarchys" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "product_master_hierarchys_tenant_record_key_uidx" ON "product_master_hierarchys" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_tenant_workspace_idx" ON "product_master_hierarchys" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_tenant_status_idx" ON "product_master_hierarchys" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_tenant_domain_idx" ON "product_master_hierarchys" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_tenant_entity_type_idx" ON "product_master_hierarchys" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_data_domain_idx" ON "product_master_hierarchys" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_source_system_idx" ON "product_master_hierarchys" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_master_record_idx" ON "product_master_hierarchys" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_golden_record_idx" ON "product_master_hierarchys" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_duplicate_cluster_idx" ON "product_master_hierarchys" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_resolution_run_idx" ON "product_master_hierarchys" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_quality_run_idx" ON "product_master_hierarchys" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_steward_idx" ON "product_master_hierarchys" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_owner_idx" ON "product_master_hierarchys" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_quality_status_idx" ON "product_master_hierarchys" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_match_status_idx" ON "product_master_hierarchys" ("matchStatus");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_governance_status_idx" ON "product_master_hierarchys" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_risk_idx" ON "product_master_hierarchys" ("riskLevel");
CREATE INDEX IF NOT EXISTS "product_master_hierarchys_deleted_idx" ON "product_master_hierarchys" ("deletedAt");


CREATE TABLE IF NOT EXISTS "employee_master_records" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "employee_master_records_tenant_record_key_uidx" ON "employee_master_records" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "employee_master_records_tenant_workspace_idx" ON "employee_master_records" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "employee_master_records_tenant_status_idx" ON "employee_master_records" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "employee_master_records_tenant_domain_idx" ON "employee_master_records" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "employee_master_records_tenant_entity_type_idx" ON "employee_master_records" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "employee_master_records_data_domain_idx" ON "employee_master_records" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "employee_master_records_source_system_idx" ON "employee_master_records" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "employee_master_records_master_record_idx" ON "employee_master_records" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "employee_master_records_golden_record_idx" ON "employee_master_records" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "employee_master_records_duplicate_cluster_idx" ON "employee_master_records" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "employee_master_records_resolution_run_idx" ON "employee_master_records" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "employee_master_records_quality_run_idx" ON "employee_master_records" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "employee_master_records_steward_idx" ON "employee_master_records" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "employee_master_records_owner_idx" ON "employee_master_records" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "employee_master_records_quality_status_idx" ON "employee_master_records" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "employee_master_records_match_status_idx" ON "employee_master_records" ("matchStatus");
CREATE INDEX IF NOT EXISTS "employee_master_records_governance_status_idx" ON "employee_master_records" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "employee_master_records_risk_idx" ON "employee_master_records" ("riskLevel");
CREATE INDEX IF NOT EXISTS "employee_master_records_deleted_idx" ON "employee_master_records" ("deletedAt");


CREATE TABLE IF NOT EXISTS "employee_master_profiles" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "employee_master_profiles_tenant_record_key_uidx" ON "employee_master_profiles" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_tenant_workspace_idx" ON "employee_master_profiles" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_tenant_status_idx" ON "employee_master_profiles" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_tenant_domain_idx" ON "employee_master_profiles" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_tenant_entity_type_idx" ON "employee_master_profiles" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_data_domain_idx" ON "employee_master_profiles" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_source_system_idx" ON "employee_master_profiles" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_master_record_idx" ON "employee_master_profiles" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_golden_record_idx" ON "employee_master_profiles" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_duplicate_cluster_idx" ON "employee_master_profiles" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_resolution_run_idx" ON "employee_master_profiles" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_quality_run_idx" ON "employee_master_profiles" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_steward_idx" ON "employee_master_profiles" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_owner_idx" ON "employee_master_profiles" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_quality_status_idx" ON "employee_master_profiles" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_match_status_idx" ON "employee_master_profiles" ("matchStatus");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_governance_status_idx" ON "employee_master_profiles" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_risk_idx" ON "employee_master_profiles" ("riskLevel");
CREATE INDEX IF NOT EXISTS "employee_master_profiles_deleted_idx" ON "employee_master_profiles" ("deletedAt");


CREATE TABLE IF NOT EXISTS "employee_master_identifiers" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "employee_master_identifiers_tenant_record_key_uidx" ON "employee_master_identifiers" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_tenant_workspace_idx" ON "employee_master_identifiers" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_tenant_status_idx" ON "employee_master_identifiers" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_tenant_domain_idx" ON "employee_master_identifiers" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_tenant_entity_type_idx" ON "employee_master_identifiers" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_data_domain_idx" ON "employee_master_identifiers" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_source_system_idx" ON "employee_master_identifiers" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_master_record_idx" ON "employee_master_identifiers" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_golden_record_idx" ON "employee_master_identifiers" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_duplicate_cluster_idx" ON "employee_master_identifiers" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_resolution_run_idx" ON "employee_master_identifiers" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_quality_run_idx" ON "employee_master_identifiers" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_steward_idx" ON "employee_master_identifiers" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_owner_idx" ON "employee_master_identifiers" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_quality_status_idx" ON "employee_master_identifiers" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_match_status_idx" ON "employee_master_identifiers" ("matchStatus");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_governance_status_idx" ON "employee_master_identifiers" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_risk_idx" ON "employee_master_identifiers" ("riskLevel");
CREATE INDEX IF NOT EXISTS "employee_master_identifiers_deleted_idx" ON "employee_master_identifiers" ("deletedAt");


CREATE TABLE IF NOT EXISTS "employee_master_assignments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "employee_master_assignments_tenant_record_key_uidx" ON "employee_master_assignments" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_tenant_workspace_idx" ON "employee_master_assignments" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_tenant_status_idx" ON "employee_master_assignments" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_tenant_domain_idx" ON "employee_master_assignments" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_tenant_entity_type_idx" ON "employee_master_assignments" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_data_domain_idx" ON "employee_master_assignments" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_source_system_idx" ON "employee_master_assignments" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_master_record_idx" ON "employee_master_assignments" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_golden_record_idx" ON "employee_master_assignments" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_duplicate_cluster_idx" ON "employee_master_assignments" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_resolution_run_idx" ON "employee_master_assignments" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_quality_run_idx" ON "employee_master_assignments" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_steward_idx" ON "employee_master_assignments" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_owner_idx" ON "employee_master_assignments" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_quality_status_idx" ON "employee_master_assignments" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_match_status_idx" ON "employee_master_assignments" ("matchStatus");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_governance_status_idx" ON "employee_master_assignments" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_risk_idx" ON "employee_master_assignments" ("riskLevel");
CREATE INDEX IF NOT EXISTS "employee_master_assignments_deleted_idx" ON "employee_master_assignments" ("deletedAt");


CREATE TABLE IF NOT EXISTS "asset_master_records" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "asset_master_records_tenant_record_key_uidx" ON "asset_master_records" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "asset_master_records_tenant_workspace_idx" ON "asset_master_records" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "asset_master_records_tenant_status_idx" ON "asset_master_records" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "asset_master_records_tenant_domain_idx" ON "asset_master_records" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "asset_master_records_tenant_entity_type_idx" ON "asset_master_records" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "asset_master_records_data_domain_idx" ON "asset_master_records" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "asset_master_records_source_system_idx" ON "asset_master_records" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "asset_master_records_master_record_idx" ON "asset_master_records" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "asset_master_records_golden_record_idx" ON "asset_master_records" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "asset_master_records_duplicate_cluster_idx" ON "asset_master_records" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "asset_master_records_resolution_run_idx" ON "asset_master_records" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "asset_master_records_quality_run_idx" ON "asset_master_records" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "asset_master_records_steward_idx" ON "asset_master_records" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "asset_master_records_owner_idx" ON "asset_master_records" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "asset_master_records_quality_status_idx" ON "asset_master_records" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "asset_master_records_match_status_idx" ON "asset_master_records" ("matchStatus");
CREATE INDEX IF NOT EXISTS "asset_master_records_governance_status_idx" ON "asset_master_records" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "asset_master_records_risk_idx" ON "asset_master_records" ("riskLevel");
CREATE INDEX IF NOT EXISTS "asset_master_records_deleted_idx" ON "asset_master_records" ("deletedAt");


CREATE TABLE IF NOT EXISTS "asset_master_profiles" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "asset_master_profiles_tenant_record_key_uidx" ON "asset_master_profiles" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_tenant_workspace_idx" ON "asset_master_profiles" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_tenant_status_idx" ON "asset_master_profiles" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_tenant_domain_idx" ON "asset_master_profiles" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_tenant_entity_type_idx" ON "asset_master_profiles" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_data_domain_idx" ON "asset_master_profiles" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_source_system_idx" ON "asset_master_profiles" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_master_record_idx" ON "asset_master_profiles" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_golden_record_idx" ON "asset_master_profiles" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_duplicate_cluster_idx" ON "asset_master_profiles" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_resolution_run_idx" ON "asset_master_profiles" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_quality_run_idx" ON "asset_master_profiles" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_steward_idx" ON "asset_master_profiles" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_owner_idx" ON "asset_master_profiles" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_quality_status_idx" ON "asset_master_profiles" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_match_status_idx" ON "asset_master_profiles" ("matchStatus");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_governance_status_idx" ON "asset_master_profiles" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_risk_idx" ON "asset_master_profiles" ("riskLevel");
CREATE INDEX IF NOT EXISTS "asset_master_profiles_deleted_idx" ON "asset_master_profiles" ("deletedAt");


CREATE TABLE IF NOT EXISTS "asset_master_identifiers" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "asset_master_identifiers_tenant_record_key_uidx" ON "asset_master_identifiers" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_tenant_workspace_idx" ON "asset_master_identifiers" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_tenant_status_idx" ON "asset_master_identifiers" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_tenant_domain_idx" ON "asset_master_identifiers" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_tenant_entity_type_idx" ON "asset_master_identifiers" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_data_domain_idx" ON "asset_master_identifiers" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_source_system_idx" ON "asset_master_identifiers" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_master_record_idx" ON "asset_master_identifiers" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_golden_record_idx" ON "asset_master_identifiers" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_duplicate_cluster_idx" ON "asset_master_identifiers" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_resolution_run_idx" ON "asset_master_identifiers" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_quality_run_idx" ON "asset_master_identifiers" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_steward_idx" ON "asset_master_identifiers" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_owner_idx" ON "asset_master_identifiers" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_quality_status_idx" ON "asset_master_identifiers" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_match_status_idx" ON "asset_master_identifiers" ("matchStatus");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_governance_status_idx" ON "asset_master_identifiers" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_risk_idx" ON "asset_master_identifiers" ("riskLevel");
CREATE INDEX IF NOT EXISTS "asset_master_identifiers_deleted_idx" ON "asset_master_identifiers" ("deletedAt");


CREATE TABLE IF NOT EXISTS "asset_master_hierarchys" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "asset_master_hierarchys_tenant_record_key_uidx" ON "asset_master_hierarchys" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_tenant_workspace_idx" ON "asset_master_hierarchys" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_tenant_status_idx" ON "asset_master_hierarchys" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_tenant_domain_idx" ON "asset_master_hierarchys" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_tenant_entity_type_idx" ON "asset_master_hierarchys" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_data_domain_idx" ON "asset_master_hierarchys" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_source_system_idx" ON "asset_master_hierarchys" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_master_record_idx" ON "asset_master_hierarchys" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_golden_record_idx" ON "asset_master_hierarchys" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_duplicate_cluster_idx" ON "asset_master_hierarchys" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_resolution_run_idx" ON "asset_master_hierarchys" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_quality_run_idx" ON "asset_master_hierarchys" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_steward_idx" ON "asset_master_hierarchys" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_owner_idx" ON "asset_master_hierarchys" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_quality_status_idx" ON "asset_master_hierarchys" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_match_status_idx" ON "asset_master_hierarchys" ("matchStatus");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_governance_status_idx" ON "asset_master_hierarchys" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_risk_idx" ON "asset_master_hierarchys" ("riskLevel");
CREATE INDEX IF NOT EXISTS "asset_master_hierarchys_deleted_idx" ON "asset_master_hierarchys" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_data_quality_rules" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_data_quality_rules_tenant_record_key_uidx" ON "mdm_data_quality_rules" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_tenant_workspace_idx" ON "mdm_data_quality_rules" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_tenant_status_idx" ON "mdm_data_quality_rules" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_tenant_domain_idx" ON "mdm_data_quality_rules" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_tenant_entity_type_idx" ON "mdm_data_quality_rules" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_data_domain_idx" ON "mdm_data_quality_rules" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_source_system_idx" ON "mdm_data_quality_rules" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_master_record_idx" ON "mdm_data_quality_rules" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_golden_record_idx" ON "mdm_data_quality_rules" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_duplicate_cluster_idx" ON "mdm_data_quality_rules" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_resolution_run_idx" ON "mdm_data_quality_rules" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_quality_run_idx" ON "mdm_data_quality_rules" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_steward_idx" ON "mdm_data_quality_rules" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_owner_idx" ON "mdm_data_quality_rules" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_quality_status_idx" ON "mdm_data_quality_rules" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_match_status_idx" ON "mdm_data_quality_rules" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_governance_status_idx" ON "mdm_data_quality_rules" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_risk_idx" ON "mdm_data_quality_rules" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_rules_deleted_idx" ON "mdm_data_quality_rules" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_data_quality_scores" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_data_quality_scores_tenant_record_key_uidx" ON "mdm_data_quality_scores" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_tenant_workspace_idx" ON "mdm_data_quality_scores" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_tenant_status_idx" ON "mdm_data_quality_scores" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_tenant_domain_idx" ON "mdm_data_quality_scores" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_tenant_entity_type_idx" ON "mdm_data_quality_scores" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_data_domain_idx" ON "mdm_data_quality_scores" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_source_system_idx" ON "mdm_data_quality_scores" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_master_record_idx" ON "mdm_data_quality_scores" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_golden_record_idx" ON "mdm_data_quality_scores" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_duplicate_cluster_idx" ON "mdm_data_quality_scores" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_resolution_run_idx" ON "mdm_data_quality_scores" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_quality_run_idx" ON "mdm_data_quality_scores" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_steward_idx" ON "mdm_data_quality_scores" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_owner_idx" ON "mdm_data_quality_scores" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_quality_status_idx" ON "mdm_data_quality_scores" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_match_status_idx" ON "mdm_data_quality_scores" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_governance_status_idx" ON "mdm_data_quality_scores" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_risk_idx" ON "mdm_data_quality_scores" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_scores_deleted_idx" ON "mdm_data_quality_scores" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_data_quality_issues" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_data_quality_issues_tenant_record_key_uidx" ON "mdm_data_quality_issues" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_tenant_workspace_idx" ON "mdm_data_quality_issues" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_tenant_status_idx" ON "mdm_data_quality_issues" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_tenant_domain_idx" ON "mdm_data_quality_issues" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_tenant_entity_type_idx" ON "mdm_data_quality_issues" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_data_domain_idx" ON "mdm_data_quality_issues" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_source_system_idx" ON "mdm_data_quality_issues" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_master_record_idx" ON "mdm_data_quality_issues" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_golden_record_idx" ON "mdm_data_quality_issues" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_duplicate_cluster_idx" ON "mdm_data_quality_issues" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_resolution_run_idx" ON "mdm_data_quality_issues" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_quality_run_idx" ON "mdm_data_quality_issues" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_steward_idx" ON "mdm_data_quality_issues" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_owner_idx" ON "mdm_data_quality_issues" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_quality_status_idx" ON "mdm_data_quality_issues" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_match_status_idx" ON "mdm_data_quality_issues" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_governance_status_idx" ON "mdm_data_quality_issues" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_risk_idx" ON "mdm_data_quality_issues" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_issues_deleted_idx" ON "mdm_data_quality_issues" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_data_quality_runs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_data_quality_runs_tenant_record_key_uidx" ON "mdm_data_quality_runs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_tenant_workspace_idx" ON "mdm_data_quality_runs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_tenant_status_idx" ON "mdm_data_quality_runs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_tenant_domain_idx" ON "mdm_data_quality_runs" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_tenant_entity_type_idx" ON "mdm_data_quality_runs" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_data_domain_idx" ON "mdm_data_quality_runs" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_source_system_idx" ON "mdm_data_quality_runs" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_master_record_idx" ON "mdm_data_quality_runs" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_golden_record_idx" ON "mdm_data_quality_runs" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_duplicate_cluster_idx" ON "mdm_data_quality_runs" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_resolution_run_idx" ON "mdm_data_quality_runs" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_quality_run_idx" ON "mdm_data_quality_runs" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_steward_idx" ON "mdm_data_quality_runs" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_owner_idx" ON "mdm_data_quality_runs" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_quality_status_idx" ON "mdm_data_quality_runs" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_match_status_idx" ON "mdm_data_quality_runs" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_governance_status_idx" ON "mdm_data_quality_runs" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_risk_idx" ON "mdm_data_quality_runs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_data_quality_runs_deleted_idx" ON "mdm_data_quality_runs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_duplicate_rules" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_duplicate_rules_tenant_record_key_uidx" ON "mdm_duplicate_rules" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_tenant_workspace_idx" ON "mdm_duplicate_rules" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_tenant_status_idx" ON "mdm_duplicate_rules" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_tenant_domain_idx" ON "mdm_duplicate_rules" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_tenant_entity_type_idx" ON "mdm_duplicate_rules" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_data_domain_idx" ON "mdm_duplicate_rules" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_source_system_idx" ON "mdm_duplicate_rules" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_master_record_idx" ON "mdm_duplicate_rules" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_golden_record_idx" ON "mdm_duplicate_rules" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_duplicate_cluster_idx" ON "mdm_duplicate_rules" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_resolution_run_idx" ON "mdm_duplicate_rules" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_quality_run_idx" ON "mdm_duplicate_rules" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_steward_idx" ON "mdm_duplicate_rules" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_owner_idx" ON "mdm_duplicate_rules" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_quality_status_idx" ON "mdm_duplicate_rules" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_match_status_idx" ON "mdm_duplicate_rules" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_governance_status_idx" ON "mdm_duplicate_rules" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_risk_idx" ON "mdm_duplicate_rules" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_rules_deleted_idx" ON "mdm_duplicate_rules" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_duplicate_candidates" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_duplicate_candidates_tenant_record_key_uidx" ON "mdm_duplicate_candidates" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_tenant_workspace_idx" ON "mdm_duplicate_candidates" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_tenant_status_idx" ON "mdm_duplicate_candidates" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_tenant_domain_idx" ON "mdm_duplicate_candidates" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_tenant_entity_type_idx" ON "mdm_duplicate_candidates" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_data_domain_idx" ON "mdm_duplicate_candidates" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_source_system_idx" ON "mdm_duplicate_candidates" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_master_record_idx" ON "mdm_duplicate_candidates" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_golden_record_idx" ON "mdm_duplicate_candidates" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_duplicate_cluster_idx" ON "mdm_duplicate_candidates" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_resolution_run_idx" ON "mdm_duplicate_candidates" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_quality_run_idx" ON "mdm_duplicate_candidates" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_steward_idx" ON "mdm_duplicate_candidates" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_owner_idx" ON "mdm_duplicate_candidates" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_quality_status_idx" ON "mdm_duplicate_candidates" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_match_status_idx" ON "mdm_duplicate_candidates" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_governance_status_idx" ON "mdm_duplicate_candidates" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_risk_idx" ON "mdm_duplicate_candidates" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_candidates_deleted_idx" ON "mdm_duplicate_candidates" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_duplicate_clusters" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_duplicate_clusters_tenant_record_key_uidx" ON "mdm_duplicate_clusters" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_tenant_workspace_idx" ON "mdm_duplicate_clusters" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_tenant_status_idx" ON "mdm_duplicate_clusters" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_tenant_domain_idx" ON "mdm_duplicate_clusters" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_tenant_entity_type_idx" ON "mdm_duplicate_clusters" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_data_domain_idx" ON "mdm_duplicate_clusters" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_source_system_idx" ON "mdm_duplicate_clusters" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_master_record_idx" ON "mdm_duplicate_clusters" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_golden_record_idx" ON "mdm_duplicate_clusters" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_duplicate_cluster_idx" ON "mdm_duplicate_clusters" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_resolution_run_idx" ON "mdm_duplicate_clusters" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_quality_run_idx" ON "mdm_duplicate_clusters" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_steward_idx" ON "mdm_duplicate_clusters" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_owner_idx" ON "mdm_duplicate_clusters" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_quality_status_idx" ON "mdm_duplicate_clusters" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_match_status_idx" ON "mdm_duplicate_clusters" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_governance_status_idx" ON "mdm_duplicate_clusters" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_risk_idx" ON "mdm_duplicate_clusters" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_clusters_deleted_idx" ON "mdm_duplicate_clusters" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_duplicate_reviews" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_duplicate_reviews_tenant_record_key_uidx" ON "mdm_duplicate_reviews" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_tenant_workspace_idx" ON "mdm_duplicate_reviews" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_tenant_status_idx" ON "mdm_duplicate_reviews" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_tenant_domain_idx" ON "mdm_duplicate_reviews" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_tenant_entity_type_idx" ON "mdm_duplicate_reviews" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_data_domain_idx" ON "mdm_duplicate_reviews" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_source_system_idx" ON "mdm_duplicate_reviews" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_master_record_idx" ON "mdm_duplicate_reviews" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_golden_record_idx" ON "mdm_duplicate_reviews" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_duplicate_cluster_idx" ON "mdm_duplicate_reviews" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_resolution_run_idx" ON "mdm_duplicate_reviews" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_quality_run_idx" ON "mdm_duplicate_reviews" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_steward_idx" ON "mdm_duplicate_reviews" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_owner_idx" ON "mdm_duplicate_reviews" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_quality_status_idx" ON "mdm_duplicate_reviews" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_match_status_idx" ON "mdm_duplicate_reviews" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_governance_status_idx" ON "mdm_duplicate_reviews" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_risk_idx" ON "mdm_duplicate_reviews" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_duplicate_reviews_deleted_idx" ON "mdm_duplicate_reviews" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_entity_resolution_rules" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_tenant_record_key_uidx" ON "mdm_entity_resolution_rules" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_tenant_workspace_idx" ON "mdm_entity_resolution_rules" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_tenant_status_idx" ON "mdm_entity_resolution_rules" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_tenant_domain_idx" ON "mdm_entity_resolution_rules" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_tenant_entity_type_idx" ON "mdm_entity_resolution_rules" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_data_domain_idx" ON "mdm_entity_resolution_rules" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_source_system_idx" ON "mdm_entity_resolution_rules" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_master_record_idx" ON "mdm_entity_resolution_rules" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_golden_record_idx" ON "mdm_entity_resolution_rules" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_duplicate_cluster_idx" ON "mdm_entity_resolution_rules" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_resolution_run_idx" ON "mdm_entity_resolution_rules" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_quality_run_idx" ON "mdm_entity_resolution_rules" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_steward_idx" ON "mdm_entity_resolution_rules" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_owner_idx" ON "mdm_entity_resolution_rules" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_quality_status_idx" ON "mdm_entity_resolution_rules" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_match_status_idx" ON "mdm_entity_resolution_rules" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_governance_status_idx" ON "mdm_entity_resolution_rules" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_risk_idx" ON "mdm_entity_resolution_rules" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_rules_deleted_idx" ON "mdm_entity_resolution_rules" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_entity_matchs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_entity_matchs_tenant_record_key_uidx" ON "mdm_entity_matchs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_tenant_workspace_idx" ON "mdm_entity_matchs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_tenant_status_idx" ON "mdm_entity_matchs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_tenant_domain_idx" ON "mdm_entity_matchs" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_tenant_entity_type_idx" ON "mdm_entity_matchs" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_data_domain_idx" ON "mdm_entity_matchs" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_source_system_idx" ON "mdm_entity_matchs" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_master_record_idx" ON "mdm_entity_matchs" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_golden_record_idx" ON "mdm_entity_matchs" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_duplicate_cluster_idx" ON "mdm_entity_matchs" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_resolution_run_idx" ON "mdm_entity_matchs" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_quality_run_idx" ON "mdm_entity_matchs" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_steward_idx" ON "mdm_entity_matchs" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_owner_idx" ON "mdm_entity_matchs" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_quality_status_idx" ON "mdm_entity_matchs" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_match_status_idx" ON "mdm_entity_matchs" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_governance_status_idx" ON "mdm_entity_matchs" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_risk_idx" ON "mdm_entity_matchs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_entity_matchs_deleted_idx" ON "mdm_entity_matchs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_entity_resolution_runs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_tenant_record_key_uidx" ON "mdm_entity_resolution_runs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_tenant_workspace_idx" ON "mdm_entity_resolution_runs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_tenant_status_idx" ON "mdm_entity_resolution_runs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_tenant_domain_idx" ON "mdm_entity_resolution_runs" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_tenant_entity_type_idx" ON "mdm_entity_resolution_runs" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_data_domain_idx" ON "mdm_entity_resolution_runs" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_source_system_idx" ON "mdm_entity_resolution_runs" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_master_record_idx" ON "mdm_entity_resolution_runs" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_golden_record_idx" ON "mdm_entity_resolution_runs" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_duplicate_cluster_idx" ON "mdm_entity_resolution_runs" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_resolution_run_idx" ON "mdm_entity_resolution_runs" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_quality_run_idx" ON "mdm_entity_resolution_runs" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_steward_idx" ON "mdm_entity_resolution_runs" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_owner_idx" ON "mdm_entity_resolution_runs" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_quality_status_idx" ON "mdm_entity_resolution_runs" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_match_status_idx" ON "mdm_entity_resolution_runs" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_governance_status_idx" ON "mdm_entity_resolution_runs" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_risk_idx" ON "mdm_entity_resolution_runs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_runs_deleted_idx" ON "mdm_entity_resolution_runs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_entity_resolution_decisions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_tenant_record_key_uidx" ON "mdm_entity_resolution_decisions" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_tenant_workspace_idx" ON "mdm_entity_resolution_decisions" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_tenant_status_idx" ON "mdm_entity_resolution_decisions" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_tenant_domain_idx" ON "mdm_entity_resolution_decisions" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_tenant_entity_type_idx" ON "mdm_entity_resolution_decisions" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_data_domain_idx" ON "mdm_entity_resolution_decisions" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_source_system_idx" ON "mdm_entity_resolution_decisions" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_master_record_idx" ON "mdm_entity_resolution_decisions" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_golden_record_idx" ON "mdm_entity_resolution_decisions" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_duplicate_cluster_idx" ON "mdm_entity_resolution_decisions" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_resolution_run_idx" ON "mdm_entity_resolution_decisions" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_quality_run_idx" ON "mdm_entity_resolution_decisions" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_steward_idx" ON "mdm_entity_resolution_decisions" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_owner_idx" ON "mdm_entity_resolution_decisions" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_quality_status_idx" ON "mdm_entity_resolution_decisions" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_match_status_idx" ON "mdm_entity_resolution_decisions" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_governance_status_idx" ON "mdm_entity_resolution_decisions" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_risk_idx" ON "mdm_entity_resolution_decisions" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_entity_resolution_decisions_deleted_idx" ON "mdm_entity_resolution_decisions" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_golden_records" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_golden_records_tenant_record_key_uidx" ON "mdm_golden_records" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_tenant_workspace_idx" ON "mdm_golden_records" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_tenant_status_idx" ON "mdm_golden_records" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_tenant_domain_idx" ON "mdm_golden_records" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_tenant_entity_type_idx" ON "mdm_golden_records" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_data_domain_idx" ON "mdm_golden_records" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_source_system_idx" ON "mdm_golden_records" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_master_record_idx" ON "mdm_golden_records" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_golden_record_idx" ON "mdm_golden_records" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_duplicate_cluster_idx" ON "mdm_golden_records" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_resolution_run_idx" ON "mdm_golden_records" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_quality_run_idx" ON "mdm_golden_records" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_steward_idx" ON "mdm_golden_records" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_owner_idx" ON "mdm_golden_records" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_quality_status_idx" ON "mdm_golden_records" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_match_status_idx" ON "mdm_golden_records" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_governance_status_idx" ON "mdm_golden_records" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_risk_idx" ON "mdm_golden_records" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_golden_records_deleted_idx" ON "mdm_golden_records" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_golden_record_versions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_golden_record_versions_tenant_record_key_uidx" ON "mdm_golden_record_versions" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_tenant_workspace_idx" ON "mdm_golden_record_versions" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_tenant_status_idx" ON "mdm_golden_record_versions" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_tenant_domain_idx" ON "mdm_golden_record_versions" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_tenant_entity_type_idx" ON "mdm_golden_record_versions" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_data_domain_idx" ON "mdm_golden_record_versions" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_source_system_idx" ON "mdm_golden_record_versions" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_master_record_idx" ON "mdm_golden_record_versions" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_golden_record_idx" ON "mdm_golden_record_versions" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_duplicate_cluster_idx" ON "mdm_golden_record_versions" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_resolution_run_idx" ON "mdm_golden_record_versions" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_quality_run_idx" ON "mdm_golden_record_versions" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_steward_idx" ON "mdm_golden_record_versions" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_owner_idx" ON "mdm_golden_record_versions" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_quality_status_idx" ON "mdm_golden_record_versions" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_match_status_idx" ON "mdm_golden_record_versions" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_governance_status_idx" ON "mdm_golden_record_versions" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_risk_idx" ON "mdm_golden_record_versions" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_golden_record_versions_deleted_idx" ON "mdm_golden_record_versions" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_survivorship_rules" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_survivorship_rules_tenant_record_key_uidx" ON "mdm_survivorship_rules" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_tenant_workspace_idx" ON "mdm_survivorship_rules" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_tenant_status_idx" ON "mdm_survivorship_rules" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_tenant_domain_idx" ON "mdm_survivorship_rules" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_tenant_entity_type_idx" ON "mdm_survivorship_rules" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_data_domain_idx" ON "mdm_survivorship_rules" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_source_system_idx" ON "mdm_survivorship_rules" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_master_record_idx" ON "mdm_survivorship_rules" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_golden_record_idx" ON "mdm_survivorship_rules" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_duplicate_cluster_idx" ON "mdm_survivorship_rules" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_resolution_run_idx" ON "mdm_survivorship_rules" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_quality_run_idx" ON "mdm_survivorship_rules" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_steward_idx" ON "mdm_survivorship_rules" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_owner_idx" ON "mdm_survivorship_rules" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_quality_status_idx" ON "mdm_survivorship_rules" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_match_status_idx" ON "mdm_survivorship_rules" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_governance_status_idx" ON "mdm_survivorship_rules" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_risk_idx" ON "mdm_survivorship_rules" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_survivorship_rules_deleted_idx" ON "mdm_survivorship_rules" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_merge_requests" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_merge_requests_tenant_record_key_uidx" ON "mdm_merge_requests" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_tenant_workspace_idx" ON "mdm_merge_requests" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_tenant_status_idx" ON "mdm_merge_requests" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_tenant_domain_idx" ON "mdm_merge_requests" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_tenant_entity_type_idx" ON "mdm_merge_requests" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_data_domain_idx" ON "mdm_merge_requests" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_source_system_idx" ON "mdm_merge_requests" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_master_record_idx" ON "mdm_merge_requests" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_golden_record_idx" ON "mdm_merge_requests" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_duplicate_cluster_idx" ON "mdm_merge_requests" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_resolution_run_idx" ON "mdm_merge_requests" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_quality_run_idx" ON "mdm_merge_requests" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_steward_idx" ON "mdm_merge_requests" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_owner_idx" ON "mdm_merge_requests" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_quality_status_idx" ON "mdm_merge_requests" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_match_status_idx" ON "mdm_merge_requests" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_governance_status_idx" ON "mdm_merge_requests" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_risk_idx" ON "mdm_merge_requests" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_merge_requests_deleted_idx" ON "mdm_merge_requests" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_governance_policys" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_governance_policys_tenant_record_key_uidx" ON "mdm_governance_policys" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_tenant_workspace_idx" ON "mdm_governance_policys" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_tenant_status_idx" ON "mdm_governance_policys" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_tenant_domain_idx" ON "mdm_governance_policys" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_tenant_entity_type_idx" ON "mdm_governance_policys" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_data_domain_idx" ON "mdm_governance_policys" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_source_system_idx" ON "mdm_governance_policys" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_master_record_idx" ON "mdm_governance_policys" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_golden_record_idx" ON "mdm_governance_policys" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_duplicate_cluster_idx" ON "mdm_governance_policys" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_resolution_run_idx" ON "mdm_governance_policys" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_quality_run_idx" ON "mdm_governance_policys" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_steward_idx" ON "mdm_governance_policys" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_owner_idx" ON "mdm_governance_policys" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_quality_status_idx" ON "mdm_governance_policys" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_match_status_idx" ON "mdm_governance_policys" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_governance_status_idx" ON "mdm_governance_policys" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_risk_idx" ON "mdm_governance_policys" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_governance_policys_deleted_idx" ON "mdm_governance_policys" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_stewardship_assignments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_stewardship_assignments_tenant_record_key_uidx" ON "mdm_stewardship_assignments" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_tenant_workspace_idx" ON "mdm_stewardship_assignments" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_tenant_status_idx" ON "mdm_stewardship_assignments" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_tenant_domain_idx" ON "mdm_stewardship_assignments" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_tenant_entity_type_idx" ON "mdm_stewardship_assignments" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_data_domain_idx" ON "mdm_stewardship_assignments" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_source_system_idx" ON "mdm_stewardship_assignments" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_master_record_idx" ON "mdm_stewardship_assignments" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_golden_record_idx" ON "mdm_stewardship_assignments" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_duplicate_cluster_idx" ON "mdm_stewardship_assignments" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_resolution_run_idx" ON "mdm_stewardship_assignments" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_quality_run_idx" ON "mdm_stewardship_assignments" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_steward_idx" ON "mdm_stewardship_assignments" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_owner_idx" ON "mdm_stewardship_assignments" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_quality_status_idx" ON "mdm_stewardship_assignments" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_match_status_idx" ON "mdm_stewardship_assignments" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_governance_status_idx" ON "mdm_stewardship_assignments" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_risk_idx" ON "mdm_stewardship_assignments" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_stewardship_assignments_deleted_idx" ON "mdm_stewardship_assignments" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_data_domains" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_data_domains_tenant_record_key_uidx" ON "mdm_data_domains" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_tenant_workspace_idx" ON "mdm_data_domains" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_tenant_status_idx" ON "mdm_data_domains" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_tenant_domain_idx" ON "mdm_data_domains" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_tenant_entity_type_idx" ON "mdm_data_domains" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_data_domain_idx" ON "mdm_data_domains" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_source_system_idx" ON "mdm_data_domains" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_master_record_idx" ON "mdm_data_domains" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_golden_record_idx" ON "mdm_data_domains" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_duplicate_cluster_idx" ON "mdm_data_domains" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_resolution_run_idx" ON "mdm_data_domains" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_quality_run_idx" ON "mdm_data_domains" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_steward_idx" ON "mdm_data_domains" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_owner_idx" ON "mdm_data_domains" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_quality_status_idx" ON "mdm_data_domains" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_match_status_idx" ON "mdm_data_domains" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_governance_status_idx" ON "mdm_data_domains" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_risk_idx" ON "mdm_data_domains" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_data_domains_deleted_idx" ON "mdm_data_domains" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_compliance_controls" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_compliance_controls_tenant_record_key_uidx" ON "mdm_compliance_controls" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_tenant_workspace_idx" ON "mdm_compliance_controls" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_tenant_status_idx" ON "mdm_compliance_controls" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_tenant_domain_idx" ON "mdm_compliance_controls" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_tenant_entity_type_idx" ON "mdm_compliance_controls" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_data_domain_idx" ON "mdm_compliance_controls" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_source_system_idx" ON "mdm_compliance_controls" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_master_record_idx" ON "mdm_compliance_controls" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_golden_record_idx" ON "mdm_compliance_controls" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_duplicate_cluster_idx" ON "mdm_compliance_controls" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_resolution_run_idx" ON "mdm_compliance_controls" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_quality_run_idx" ON "mdm_compliance_controls" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_steward_idx" ON "mdm_compliance_controls" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_owner_idx" ON "mdm_compliance_controls" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_quality_status_idx" ON "mdm_compliance_controls" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_match_status_idx" ON "mdm_compliance_controls" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_governance_status_idx" ON "mdm_compliance_controls" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_risk_idx" ON "mdm_compliance_controls" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_compliance_controls_deleted_idx" ON "mdm_compliance_controls" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_lineage_records" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_lineage_records_tenant_record_key_uidx" ON "mdm_lineage_records" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_tenant_workspace_idx" ON "mdm_lineage_records" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_tenant_status_idx" ON "mdm_lineage_records" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_tenant_domain_idx" ON "mdm_lineage_records" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_tenant_entity_type_idx" ON "mdm_lineage_records" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_data_domain_idx" ON "mdm_lineage_records" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_source_system_idx" ON "mdm_lineage_records" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_master_record_idx" ON "mdm_lineage_records" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_golden_record_idx" ON "mdm_lineage_records" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_duplicate_cluster_idx" ON "mdm_lineage_records" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_resolution_run_idx" ON "mdm_lineage_records" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_quality_run_idx" ON "mdm_lineage_records" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_steward_idx" ON "mdm_lineage_records" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_owner_idx" ON "mdm_lineage_records" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_quality_status_idx" ON "mdm_lineage_records" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_match_status_idx" ON "mdm_lineage_records" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_governance_status_idx" ON "mdm_lineage_records" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_risk_idx" ON "mdm_lineage_records" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_lineage_records_deleted_idx" ON "mdm_lineage_records" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_lineage_events" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_lineage_events_tenant_record_key_uidx" ON "mdm_lineage_events" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_tenant_workspace_idx" ON "mdm_lineage_events" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_tenant_status_idx" ON "mdm_lineage_events" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_tenant_domain_idx" ON "mdm_lineage_events" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_tenant_entity_type_idx" ON "mdm_lineage_events" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_data_domain_idx" ON "mdm_lineage_events" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_source_system_idx" ON "mdm_lineage_events" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_master_record_idx" ON "mdm_lineage_events" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_golden_record_idx" ON "mdm_lineage_events" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_duplicate_cluster_idx" ON "mdm_lineage_events" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_resolution_run_idx" ON "mdm_lineage_events" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_quality_run_idx" ON "mdm_lineage_events" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_steward_idx" ON "mdm_lineage_events" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_owner_idx" ON "mdm_lineage_events" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_quality_status_idx" ON "mdm_lineage_events" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_match_status_idx" ON "mdm_lineage_events" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_governance_status_idx" ON "mdm_lineage_events" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_risk_idx" ON "mdm_lineage_events" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_lineage_events_deleted_idx" ON "mdm_lineage_events" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_source_systems" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_source_systems_tenant_record_key_uidx" ON "mdm_source_systems" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_tenant_workspace_idx" ON "mdm_source_systems" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_tenant_status_idx" ON "mdm_source_systems" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_tenant_domain_idx" ON "mdm_source_systems" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_tenant_entity_type_idx" ON "mdm_source_systems" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_data_domain_idx" ON "mdm_source_systems" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_source_system_idx" ON "mdm_source_systems" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_master_record_idx" ON "mdm_source_systems" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_golden_record_idx" ON "mdm_source_systems" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_duplicate_cluster_idx" ON "mdm_source_systems" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_resolution_run_idx" ON "mdm_source_systems" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_quality_run_idx" ON "mdm_source_systems" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_steward_idx" ON "mdm_source_systems" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_owner_idx" ON "mdm_source_systems" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_quality_status_idx" ON "mdm_source_systems" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_match_status_idx" ON "mdm_source_systems" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_governance_status_idx" ON "mdm_source_systems" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_risk_idx" ON "mdm_source_systems" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_source_systems_deleted_idx" ON "mdm_source_systems" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_data_contract_links" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_data_contract_links_tenant_record_key_uidx" ON "mdm_data_contract_links" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_tenant_workspace_idx" ON "mdm_data_contract_links" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_tenant_status_idx" ON "mdm_data_contract_links" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_tenant_domain_idx" ON "mdm_data_contract_links" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_tenant_entity_type_idx" ON "mdm_data_contract_links" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_data_domain_idx" ON "mdm_data_contract_links" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_source_system_idx" ON "mdm_data_contract_links" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_master_record_idx" ON "mdm_data_contract_links" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_golden_record_idx" ON "mdm_data_contract_links" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_duplicate_cluster_idx" ON "mdm_data_contract_links" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_resolution_run_idx" ON "mdm_data_contract_links" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_quality_run_idx" ON "mdm_data_contract_links" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_steward_idx" ON "mdm_data_contract_links" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_owner_idx" ON "mdm_data_contract_links" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_quality_status_idx" ON "mdm_data_contract_links" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_match_status_idx" ON "mdm_data_contract_links" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_governance_status_idx" ON "mdm_data_contract_links" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_risk_idx" ON "mdm_data_contract_links" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_data_contract_links_deleted_idx" ON "mdm_data_contract_links" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_copilot_querys" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_copilot_querys_tenant_record_key_uidx" ON "mdm_copilot_querys" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_tenant_workspace_idx" ON "mdm_copilot_querys" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_tenant_status_idx" ON "mdm_copilot_querys" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_tenant_domain_idx" ON "mdm_copilot_querys" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_tenant_entity_type_idx" ON "mdm_copilot_querys" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_data_domain_idx" ON "mdm_copilot_querys" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_source_system_idx" ON "mdm_copilot_querys" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_master_record_idx" ON "mdm_copilot_querys" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_golden_record_idx" ON "mdm_copilot_querys" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_duplicate_cluster_idx" ON "mdm_copilot_querys" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_resolution_run_idx" ON "mdm_copilot_querys" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_quality_run_idx" ON "mdm_copilot_querys" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_steward_idx" ON "mdm_copilot_querys" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_owner_idx" ON "mdm_copilot_querys" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_quality_status_idx" ON "mdm_copilot_querys" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_match_status_idx" ON "mdm_copilot_querys" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_governance_status_idx" ON "mdm_copilot_querys" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_risk_idx" ON "mdm_copilot_querys" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_copilot_querys_deleted_idx" ON "mdm_copilot_querys" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_recommendations" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_recommendations_tenant_record_key_uidx" ON "mdm_recommendations" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_tenant_workspace_idx" ON "mdm_recommendations" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_tenant_status_idx" ON "mdm_recommendations" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_tenant_domain_idx" ON "mdm_recommendations" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_tenant_entity_type_idx" ON "mdm_recommendations" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_data_domain_idx" ON "mdm_recommendations" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_source_system_idx" ON "mdm_recommendations" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_master_record_idx" ON "mdm_recommendations" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_golden_record_idx" ON "mdm_recommendations" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_duplicate_cluster_idx" ON "mdm_recommendations" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_resolution_run_idx" ON "mdm_recommendations" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_quality_run_idx" ON "mdm_recommendations" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_steward_idx" ON "mdm_recommendations" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_owner_idx" ON "mdm_recommendations" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_quality_status_idx" ON "mdm_recommendations" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_match_status_idx" ON "mdm_recommendations" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_governance_status_idx" ON "mdm_recommendations" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_risk_idx" ON "mdm_recommendations" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_recommendations_deleted_idx" ON "mdm_recommendations" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_risk_signals" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_risk_signals_tenant_record_key_uidx" ON "mdm_risk_signals" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_tenant_workspace_idx" ON "mdm_risk_signals" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_tenant_status_idx" ON "mdm_risk_signals" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_tenant_domain_idx" ON "mdm_risk_signals" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_tenant_entity_type_idx" ON "mdm_risk_signals" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_data_domain_idx" ON "mdm_risk_signals" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_source_system_idx" ON "mdm_risk_signals" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_master_record_idx" ON "mdm_risk_signals" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_golden_record_idx" ON "mdm_risk_signals" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_duplicate_cluster_idx" ON "mdm_risk_signals" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_resolution_run_idx" ON "mdm_risk_signals" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_quality_run_idx" ON "mdm_risk_signals" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_steward_idx" ON "mdm_risk_signals" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_owner_idx" ON "mdm_risk_signals" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_quality_status_idx" ON "mdm_risk_signals" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_match_status_idx" ON "mdm_risk_signals" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_governance_status_idx" ON "mdm_risk_signals" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_risk_idx" ON "mdm_risk_signals" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_risk_signals_deleted_idx" ON "mdm_risk_signals" ("deletedAt");


CREATE TABLE IF NOT EXISTS "mdm_audit_events" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "dataDomainId" UUID,
  "sourceSystemId" UUID,
  "sourceRecordId" TEXT,
  "masterRecordId" UUID,
  "goldenRecordId" UUID,
  "duplicateClusterId" UUID,
  "resolutionRunId" UUID,
  "qualityRunId" UUID,
  "lineageRecordId" UUID,
  "governancePolicyId" UUID,
  "stewardUserId" UUID,
  "ownerUserId" UUID,
  "reviewerUserId" UUID,
  "approvedByUserId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "domain" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "externalId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "qualityStatus" TEXT,
  "matchStatus" TEXT,
  "governanceStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "languageCode" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "matchScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "timelinessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uniquenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mergeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourcePriority" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "failedRecords" INTEGER NOT NULL DEFAULT 0,
  "duplicateCount" INTEGER NOT NULL DEFAULT 0,
  "resolvedCount" INTEGER NOT NULL DEFAULT 0,
  "isGolden" BOOLEAN NOT NULL DEFAULT false,
  "isCanonical" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "effectiveFrom" TIMESTAMP(3),
  "effectiveTo" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "mergedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL DEFAULT '{}',
  "identifiers" JSONB NOT NULL DEFAULT '[]',
  "relationships" JSONB NOT NULL DEFAULT '[]',
  "qualityDimensions" JSONB NOT NULL DEFAULT '{}',
  "survivorshipRules" JSONB NOT NULL DEFAULT '{}',
  "lineage" JSONB NOT NULL DEFAULT '[]',
  "sourcePayload" JSONB NOT NULL DEFAULT '{}',
  "resolvedPayload" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "mdm_audit_events_tenant_record_key_uidx" ON "mdm_audit_events" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_tenant_workspace_idx" ON "mdm_audit_events" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_tenant_status_idx" ON "mdm_audit_events" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_tenant_domain_idx" ON "mdm_audit_events" ("tenantId", "domain");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_tenant_entity_type_idx" ON "mdm_audit_events" ("tenantId", "entityType");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_data_domain_idx" ON "mdm_audit_events" ("dataDomainId");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_source_system_idx" ON "mdm_audit_events" ("sourceSystemId");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_master_record_idx" ON "mdm_audit_events" ("masterRecordId");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_golden_record_idx" ON "mdm_audit_events" ("goldenRecordId");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_duplicate_cluster_idx" ON "mdm_audit_events" ("duplicateClusterId");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_resolution_run_idx" ON "mdm_audit_events" ("resolutionRunId");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_quality_run_idx" ON "mdm_audit_events" ("qualityRunId");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_steward_idx" ON "mdm_audit_events" ("stewardUserId");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_owner_idx" ON "mdm_audit_events" ("ownerUserId");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_quality_status_idx" ON "mdm_audit_events" ("qualityStatus");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_match_status_idx" ON "mdm_audit_events" ("matchStatus");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_governance_status_idx" ON "mdm_audit_events" ("governanceStatus");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_risk_idx" ON "mdm_audit_events" ("riskLevel");
CREATE INDEX IF NOT EXISTS "mdm_audit_events_deleted_idx" ON "mdm_audit_events" ("deletedAt");
