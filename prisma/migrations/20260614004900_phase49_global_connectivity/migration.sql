-- Phase 49 - Global Integrations and Enterprise Connectivity Layer
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TABLE IF NOT EXISTS "global_integration_hubs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "global_integration_hubs_tenant_record_key_uidx" ON "global_integration_hubs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_tenant_workspace_idx" ON "global_integration_hubs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_tenant_provider_idx" ON "global_integration_hubs" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_tenant_status_idx" ON "global_integration_hubs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_connection_idx" ON "global_integration_hubs" ("connectionId");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_connector_idx" ON "global_integration_hubs" ("connectorId");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_route_idx" ON "global_integration_hubs" ("routeId");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_webhook_endpoint_idx" ON "global_integration_hubs" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_gateway_idx" ON "global_integration_hubs" ("gatewayId");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_sync_run_idx" ON "global_integration_hubs" ("syncRunId");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_health_check_idx" ON "global_integration_hubs" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_external_object_type_idx" ON "global_integration_hubs" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_connection_status_idx" ON "global_integration_hubs" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_auth_status_idx" ON "global_integration_hubs" ("authStatus");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_sync_status_idx" ON "global_integration_hubs" ("syncStatus");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_delivery_status_idx" ON "global_integration_hubs" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_health_status_idx" ON "global_integration_hubs" ("healthStatus");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_risk_idx" ON "global_integration_hubs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "global_integration_hubs_deleted_idx" ON "global_integration_hubs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "global_integration_catalogs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "global_integration_catalogs_tenant_record_key_uidx" ON "global_integration_catalogs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_tenant_workspace_idx" ON "global_integration_catalogs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_tenant_provider_idx" ON "global_integration_catalogs" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_tenant_status_idx" ON "global_integration_catalogs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_connection_idx" ON "global_integration_catalogs" ("connectionId");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_connector_idx" ON "global_integration_catalogs" ("connectorId");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_route_idx" ON "global_integration_catalogs" ("routeId");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_webhook_endpoint_idx" ON "global_integration_catalogs" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_gateway_idx" ON "global_integration_catalogs" ("gatewayId");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_sync_run_idx" ON "global_integration_catalogs" ("syncRunId");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_health_check_idx" ON "global_integration_catalogs" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_external_object_type_idx" ON "global_integration_catalogs" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_connection_status_idx" ON "global_integration_catalogs" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_auth_status_idx" ON "global_integration_catalogs" ("authStatus");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_sync_status_idx" ON "global_integration_catalogs" ("syncStatus");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_delivery_status_idx" ON "global_integration_catalogs" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_health_status_idx" ON "global_integration_catalogs" ("healthStatus");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_risk_idx" ON "global_integration_catalogs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "global_integration_catalogs_deleted_idx" ON "global_integration_catalogs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "global_integration_tenant_configs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "global_integration_tenant_configs_tenant_record_key_uidx" ON "global_integration_tenant_configs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_tenant_workspace_idx" ON "global_integration_tenant_configs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_tenant_provider_idx" ON "global_integration_tenant_configs" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_tenant_status_idx" ON "global_integration_tenant_configs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_connection_idx" ON "global_integration_tenant_configs" ("connectionId");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_connector_idx" ON "global_integration_tenant_configs" ("connectorId");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_route_idx" ON "global_integration_tenant_configs" ("routeId");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_webhook_endpoint_idx" ON "global_integration_tenant_configs" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_gateway_idx" ON "global_integration_tenant_configs" ("gatewayId");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_sync_run_idx" ON "global_integration_tenant_configs" ("syncRunId");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_health_check_idx" ON "global_integration_tenant_configs" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_external_object_type_idx" ON "global_integration_tenant_configs" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_connection_status_idx" ON "global_integration_tenant_configs" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_auth_status_idx" ON "global_integration_tenant_configs" ("authStatus");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_sync_status_idx" ON "global_integration_tenant_configs" ("syncStatus");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_delivery_status_idx" ON "global_integration_tenant_configs" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_health_status_idx" ON "global_integration_tenant_configs" ("healthStatus");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_risk_idx" ON "global_integration_tenant_configs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "global_integration_tenant_configs_deleted_idx" ON "global_integration_tenant_configs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "global_integration_connections" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "global_integration_connections_tenant_record_key_uidx" ON "global_integration_connections" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "global_integration_connections_tenant_workspace_idx" ON "global_integration_connections" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "global_integration_connections_tenant_provider_idx" ON "global_integration_connections" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "global_integration_connections_tenant_status_idx" ON "global_integration_connections" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "global_integration_connections_connection_idx" ON "global_integration_connections" ("connectionId");
CREATE INDEX IF NOT EXISTS "global_integration_connections_connector_idx" ON "global_integration_connections" ("connectorId");
CREATE INDEX IF NOT EXISTS "global_integration_connections_route_idx" ON "global_integration_connections" ("routeId");
CREATE INDEX IF NOT EXISTS "global_integration_connections_webhook_endpoint_idx" ON "global_integration_connections" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "global_integration_connections_gateway_idx" ON "global_integration_connections" ("gatewayId");
CREATE INDEX IF NOT EXISTS "global_integration_connections_sync_run_idx" ON "global_integration_connections" ("syncRunId");
CREATE INDEX IF NOT EXISTS "global_integration_connections_health_check_idx" ON "global_integration_connections" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "global_integration_connections_external_object_type_idx" ON "global_integration_connections" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "global_integration_connections_connection_status_idx" ON "global_integration_connections" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "global_integration_connections_auth_status_idx" ON "global_integration_connections" ("authStatus");
CREATE INDEX IF NOT EXISTS "global_integration_connections_sync_status_idx" ON "global_integration_connections" ("syncStatus");
CREATE INDEX IF NOT EXISTS "global_integration_connections_delivery_status_idx" ON "global_integration_connections" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "global_integration_connections_health_status_idx" ON "global_integration_connections" ("healthStatus");
CREATE INDEX IF NOT EXISTS "global_integration_connections_risk_idx" ON "global_integration_connections" ("riskLevel");
CREATE INDEX IF NOT EXISTS "global_integration_connections_deleted_idx" ON "global_integration_connections" ("deletedAt");


CREATE TABLE IF NOT EXISTS "salesforce_connections" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "salesforce_connections_tenant_record_key_uidx" ON "salesforce_connections" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "salesforce_connections_tenant_workspace_idx" ON "salesforce_connections" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "salesforce_connections_tenant_provider_idx" ON "salesforce_connections" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "salesforce_connections_tenant_status_idx" ON "salesforce_connections" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "salesforce_connections_connection_idx" ON "salesforce_connections" ("connectionId");
CREATE INDEX IF NOT EXISTS "salesforce_connections_connector_idx" ON "salesforce_connections" ("connectorId");
CREATE INDEX IF NOT EXISTS "salesforce_connections_route_idx" ON "salesforce_connections" ("routeId");
CREATE INDEX IF NOT EXISTS "salesforce_connections_webhook_endpoint_idx" ON "salesforce_connections" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "salesforce_connections_gateway_idx" ON "salesforce_connections" ("gatewayId");
CREATE INDEX IF NOT EXISTS "salesforce_connections_sync_run_idx" ON "salesforce_connections" ("syncRunId");
CREATE INDEX IF NOT EXISTS "salesforce_connections_health_check_idx" ON "salesforce_connections" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "salesforce_connections_external_object_type_idx" ON "salesforce_connections" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "salesforce_connections_connection_status_idx" ON "salesforce_connections" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "salesforce_connections_auth_status_idx" ON "salesforce_connections" ("authStatus");
CREATE INDEX IF NOT EXISTS "salesforce_connections_sync_status_idx" ON "salesforce_connections" ("syncStatus");
CREATE INDEX IF NOT EXISTS "salesforce_connections_delivery_status_idx" ON "salesforce_connections" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "salesforce_connections_health_status_idx" ON "salesforce_connections" ("healthStatus");
CREATE INDEX IF NOT EXISTS "salesforce_connections_risk_idx" ON "salesforce_connections" ("riskLevel");
CREATE INDEX IF NOT EXISTS "salesforce_connections_deleted_idx" ON "salesforce_connections" ("deletedAt");


CREATE TABLE IF NOT EXISTS "salesforce_object_mappings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "salesforce_object_mappings_tenant_record_key_uidx" ON "salesforce_object_mappings" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_tenant_workspace_idx" ON "salesforce_object_mappings" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_tenant_provider_idx" ON "salesforce_object_mappings" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_tenant_status_idx" ON "salesforce_object_mappings" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_connection_idx" ON "salesforce_object_mappings" ("connectionId");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_connector_idx" ON "salesforce_object_mappings" ("connectorId");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_route_idx" ON "salesforce_object_mappings" ("routeId");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_webhook_endpoint_idx" ON "salesforce_object_mappings" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_gateway_idx" ON "salesforce_object_mappings" ("gatewayId");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_sync_run_idx" ON "salesforce_object_mappings" ("syncRunId");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_health_check_idx" ON "salesforce_object_mappings" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_external_object_type_idx" ON "salesforce_object_mappings" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_connection_status_idx" ON "salesforce_object_mappings" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_auth_status_idx" ON "salesforce_object_mappings" ("authStatus");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_sync_status_idx" ON "salesforce_object_mappings" ("syncStatus");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_delivery_status_idx" ON "salesforce_object_mappings" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_health_status_idx" ON "salesforce_object_mappings" ("healthStatus");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_risk_idx" ON "salesforce_object_mappings" ("riskLevel");
CREATE INDEX IF NOT EXISTS "salesforce_object_mappings_deleted_idx" ON "salesforce_object_mappings" ("deletedAt");


CREATE TABLE IF NOT EXISTS "salesforce_sync_jobs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "salesforce_sync_jobs_tenant_record_key_uidx" ON "salesforce_sync_jobs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_tenant_workspace_idx" ON "salesforce_sync_jobs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_tenant_provider_idx" ON "salesforce_sync_jobs" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_tenant_status_idx" ON "salesforce_sync_jobs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_connection_idx" ON "salesforce_sync_jobs" ("connectionId");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_connector_idx" ON "salesforce_sync_jobs" ("connectorId");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_route_idx" ON "salesforce_sync_jobs" ("routeId");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_webhook_endpoint_idx" ON "salesforce_sync_jobs" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_gateway_idx" ON "salesforce_sync_jobs" ("gatewayId");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_sync_run_idx" ON "salesforce_sync_jobs" ("syncRunId");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_health_check_idx" ON "salesforce_sync_jobs" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_external_object_type_idx" ON "salesforce_sync_jobs" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_connection_status_idx" ON "salesforce_sync_jobs" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_auth_status_idx" ON "salesforce_sync_jobs" ("authStatus");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_sync_status_idx" ON "salesforce_sync_jobs" ("syncStatus");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_delivery_status_idx" ON "salesforce_sync_jobs" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_health_status_idx" ON "salesforce_sync_jobs" ("healthStatus");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_risk_idx" ON "salesforce_sync_jobs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "salesforce_sync_jobs_deleted_idx" ON "salesforce_sync_jobs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "salesforce_event_subscriptions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "salesforce_event_subscriptions_tenant_record_key_uidx" ON "salesforce_event_subscriptions" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_tenant_workspace_idx" ON "salesforce_event_subscriptions" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_tenant_provider_idx" ON "salesforce_event_subscriptions" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_tenant_status_idx" ON "salesforce_event_subscriptions" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_connection_idx" ON "salesforce_event_subscriptions" ("connectionId");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_connector_idx" ON "salesforce_event_subscriptions" ("connectorId");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_route_idx" ON "salesforce_event_subscriptions" ("routeId");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_webhook_endpoint_idx" ON "salesforce_event_subscriptions" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_gateway_idx" ON "salesforce_event_subscriptions" ("gatewayId");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_sync_run_idx" ON "salesforce_event_subscriptions" ("syncRunId");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_health_check_idx" ON "salesforce_event_subscriptions" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_external_object_type_idx" ON "salesforce_event_subscriptions" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_connection_status_idx" ON "salesforce_event_subscriptions" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_auth_status_idx" ON "salesforce_event_subscriptions" ("authStatus");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_sync_status_idx" ON "salesforce_event_subscriptions" ("syncStatus");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_delivery_status_idx" ON "salesforce_event_subscriptions" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_health_status_idx" ON "salesforce_event_subscriptions" ("healthStatus");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_risk_idx" ON "salesforce_event_subscriptions" ("riskLevel");
CREATE INDEX IF NOT EXISTS "salesforce_event_subscriptions_deleted_idx" ON "salesforce_event_subscriptions" ("deletedAt");


CREATE TABLE IF NOT EXISTS "sap_connections" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "sap_connections_tenant_record_key_uidx" ON "sap_connections" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "sap_connections_tenant_workspace_idx" ON "sap_connections" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "sap_connections_tenant_provider_idx" ON "sap_connections" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "sap_connections_tenant_status_idx" ON "sap_connections" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "sap_connections_connection_idx" ON "sap_connections" ("connectionId");
CREATE INDEX IF NOT EXISTS "sap_connections_connector_idx" ON "sap_connections" ("connectorId");
CREATE INDEX IF NOT EXISTS "sap_connections_route_idx" ON "sap_connections" ("routeId");
CREATE INDEX IF NOT EXISTS "sap_connections_webhook_endpoint_idx" ON "sap_connections" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "sap_connections_gateway_idx" ON "sap_connections" ("gatewayId");
CREATE INDEX IF NOT EXISTS "sap_connections_sync_run_idx" ON "sap_connections" ("syncRunId");
CREATE INDEX IF NOT EXISTS "sap_connections_health_check_idx" ON "sap_connections" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "sap_connections_external_object_type_idx" ON "sap_connections" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "sap_connections_connection_status_idx" ON "sap_connections" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "sap_connections_auth_status_idx" ON "sap_connections" ("authStatus");
CREATE INDEX IF NOT EXISTS "sap_connections_sync_status_idx" ON "sap_connections" ("syncStatus");
CREATE INDEX IF NOT EXISTS "sap_connections_delivery_status_idx" ON "sap_connections" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "sap_connections_health_status_idx" ON "sap_connections" ("healthStatus");
CREATE INDEX IF NOT EXISTS "sap_connections_risk_idx" ON "sap_connections" ("riskLevel");
CREATE INDEX IF NOT EXISTS "sap_connections_deleted_idx" ON "sap_connections" ("deletedAt");


CREATE TABLE IF NOT EXISTS "sap_bapi_mappings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "sap_bapi_mappings_tenant_record_key_uidx" ON "sap_bapi_mappings" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_tenant_workspace_idx" ON "sap_bapi_mappings" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_tenant_provider_idx" ON "sap_bapi_mappings" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_tenant_status_idx" ON "sap_bapi_mappings" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_connection_idx" ON "sap_bapi_mappings" ("connectionId");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_connector_idx" ON "sap_bapi_mappings" ("connectorId");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_route_idx" ON "sap_bapi_mappings" ("routeId");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_webhook_endpoint_idx" ON "sap_bapi_mappings" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_gateway_idx" ON "sap_bapi_mappings" ("gatewayId");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_sync_run_idx" ON "sap_bapi_mappings" ("syncRunId");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_health_check_idx" ON "sap_bapi_mappings" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_external_object_type_idx" ON "sap_bapi_mappings" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_connection_status_idx" ON "sap_bapi_mappings" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_auth_status_idx" ON "sap_bapi_mappings" ("authStatus");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_sync_status_idx" ON "sap_bapi_mappings" ("syncStatus");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_delivery_status_idx" ON "sap_bapi_mappings" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_health_status_idx" ON "sap_bapi_mappings" ("healthStatus");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_risk_idx" ON "sap_bapi_mappings" ("riskLevel");
CREATE INDEX IF NOT EXISTS "sap_bapi_mappings_deleted_idx" ON "sap_bapi_mappings" ("deletedAt");


CREATE TABLE IF NOT EXISTS "sap_idoc_subscriptions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "sap_idoc_subscriptions_tenant_record_key_uidx" ON "sap_idoc_subscriptions" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_tenant_workspace_idx" ON "sap_idoc_subscriptions" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_tenant_provider_idx" ON "sap_idoc_subscriptions" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_tenant_status_idx" ON "sap_idoc_subscriptions" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_connection_idx" ON "sap_idoc_subscriptions" ("connectionId");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_connector_idx" ON "sap_idoc_subscriptions" ("connectorId");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_route_idx" ON "sap_idoc_subscriptions" ("routeId");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_webhook_endpoint_idx" ON "sap_idoc_subscriptions" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_gateway_idx" ON "sap_idoc_subscriptions" ("gatewayId");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_sync_run_idx" ON "sap_idoc_subscriptions" ("syncRunId");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_health_check_idx" ON "sap_idoc_subscriptions" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_external_object_type_idx" ON "sap_idoc_subscriptions" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_connection_status_idx" ON "sap_idoc_subscriptions" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_auth_status_idx" ON "sap_idoc_subscriptions" ("authStatus");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_sync_status_idx" ON "sap_idoc_subscriptions" ("syncStatus");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_delivery_status_idx" ON "sap_idoc_subscriptions" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_health_status_idx" ON "sap_idoc_subscriptions" ("healthStatus");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_risk_idx" ON "sap_idoc_subscriptions" ("riskLevel");
CREATE INDEX IF NOT EXISTS "sap_idoc_subscriptions_deleted_idx" ON "sap_idoc_subscriptions" ("deletedAt");


CREATE TABLE IF NOT EXISTS "sap_sync_jobs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "sap_sync_jobs_tenant_record_key_uidx" ON "sap_sync_jobs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_tenant_workspace_idx" ON "sap_sync_jobs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_tenant_provider_idx" ON "sap_sync_jobs" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_tenant_status_idx" ON "sap_sync_jobs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_connection_idx" ON "sap_sync_jobs" ("connectionId");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_connector_idx" ON "sap_sync_jobs" ("connectorId");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_route_idx" ON "sap_sync_jobs" ("routeId");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_webhook_endpoint_idx" ON "sap_sync_jobs" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_gateway_idx" ON "sap_sync_jobs" ("gatewayId");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_sync_run_idx" ON "sap_sync_jobs" ("syncRunId");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_health_check_idx" ON "sap_sync_jobs" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_external_object_type_idx" ON "sap_sync_jobs" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_connection_status_idx" ON "sap_sync_jobs" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_auth_status_idx" ON "sap_sync_jobs" ("authStatus");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_sync_status_idx" ON "sap_sync_jobs" ("syncStatus");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_delivery_status_idx" ON "sap_sync_jobs" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_health_status_idx" ON "sap_sync_jobs" ("healthStatus");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_risk_idx" ON "sap_sync_jobs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "sap_sync_jobs_deleted_idx" ON "sap_sync_jobs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "oracle_connections" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "oracle_connections_tenant_record_key_uidx" ON "oracle_connections" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "oracle_connections_tenant_workspace_idx" ON "oracle_connections" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "oracle_connections_tenant_provider_idx" ON "oracle_connections" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "oracle_connections_tenant_status_idx" ON "oracle_connections" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "oracle_connections_connection_idx" ON "oracle_connections" ("connectionId");
CREATE INDEX IF NOT EXISTS "oracle_connections_connector_idx" ON "oracle_connections" ("connectorId");
CREATE INDEX IF NOT EXISTS "oracle_connections_route_idx" ON "oracle_connections" ("routeId");
CREATE INDEX IF NOT EXISTS "oracle_connections_webhook_endpoint_idx" ON "oracle_connections" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "oracle_connections_gateway_idx" ON "oracle_connections" ("gatewayId");
CREATE INDEX IF NOT EXISTS "oracle_connections_sync_run_idx" ON "oracle_connections" ("syncRunId");
CREATE INDEX IF NOT EXISTS "oracle_connections_health_check_idx" ON "oracle_connections" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "oracle_connections_external_object_type_idx" ON "oracle_connections" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "oracle_connections_connection_status_idx" ON "oracle_connections" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "oracle_connections_auth_status_idx" ON "oracle_connections" ("authStatus");
CREATE INDEX IF NOT EXISTS "oracle_connections_sync_status_idx" ON "oracle_connections" ("syncStatus");
CREATE INDEX IF NOT EXISTS "oracle_connections_delivery_status_idx" ON "oracle_connections" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "oracle_connections_health_status_idx" ON "oracle_connections" ("healthStatus");
CREATE INDEX IF NOT EXISTS "oracle_connections_risk_idx" ON "oracle_connections" ("riskLevel");
CREATE INDEX IF NOT EXISTS "oracle_connections_deleted_idx" ON "oracle_connections" ("deletedAt");


CREATE TABLE IF NOT EXISTS "oracle_object_mappings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "oracle_object_mappings_tenant_record_key_uidx" ON "oracle_object_mappings" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_tenant_workspace_idx" ON "oracle_object_mappings" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_tenant_provider_idx" ON "oracle_object_mappings" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_tenant_status_idx" ON "oracle_object_mappings" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_connection_idx" ON "oracle_object_mappings" ("connectionId");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_connector_idx" ON "oracle_object_mappings" ("connectorId");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_route_idx" ON "oracle_object_mappings" ("routeId");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_webhook_endpoint_idx" ON "oracle_object_mappings" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_gateway_idx" ON "oracle_object_mappings" ("gatewayId");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_sync_run_idx" ON "oracle_object_mappings" ("syncRunId");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_health_check_idx" ON "oracle_object_mappings" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_external_object_type_idx" ON "oracle_object_mappings" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_connection_status_idx" ON "oracle_object_mappings" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_auth_status_idx" ON "oracle_object_mappings" ("authStatus");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_sync_status_idx" ON "oracle_object_mappings" ("syncStatus");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_delivery_status_idx" ON "oracle_object_mappings" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_health_status_idx" ON "oracle_object_mappings" ("healthStatus");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_risk_idx" ON "oracle_object_mappings" ("riskLevel");
CREATE INDEX IF NOT EXISTS "oracle_object_mappings_deleted_idx" ON "oracle_object_mappings" ("deletedAt");


CREATE TABLE IF NOT EXISTS "oracle_sync_jobs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "oracle_sync_jobs_tenant_record_key_uidx" ON "oracle_sync_jobs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_tenant_workspace_idx" ON "oracle_sync_jobs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_tenant_provider_idx" ON "oracle_sync_jobs" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_tenant_status_idx" ON "oracle_sync_jobs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_connection_idx" ON "oracle_sync_jobs" ("connectionId");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_connector_idx" ON "oracle_sync_jobs" ("connectorId");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_route_idx" ON "oracle_sync_jobs" ("routeId");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_webhook_endpoint_idx" ON "oracle_sync_jobs" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_gateway_idx" ON "oracle_sync_jobs" ("gatewayId");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_sync_run_idx" ON "oracle_sync_jobs" ("syncRunId");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_health_check_idx" ON "oracle_sync_jobs" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_external_object_type_idx" ON "oracle_sync_jobs" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_connection_status_idx" ON "oracle_sync_jobs" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_auth_status_idx" ON "oracle_sync_jobs" ("authStatus");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_sync_status_idx" ON "oracle_sync_jobs" ("syncStatus");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_delivery_status_idx" ON "oracle_sync_jobs" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_health_status_idx" ON "oracle_sync_jobs" ("healthStatus");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_risk_idx" ON "oracle_sync_jobs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "oracle_sync_jobs_deleted_idx" ON "oracle_sync_jobs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "oracle_event_subscriptions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "oracle_event_subscriptions_tenant_record_key_uidx" ON "oracle_event_subscriptions" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_tenant_workspace_idx" ON "oracle_event_subscriptions" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_tenant_provider_idx" ON "oracle_event_subscriptions" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_tenant_status_idx" ON "oracle_event_subscriptions" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_connection_idx" ON "oracle_event_subscriptions" ("connectionId");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_connector_idx" ON "oracle_event_subscriptions" ("connectorId");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_route_idx" ON "oracle_event_subscriptions" ("routeId");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_webhook_endpoint_idx" ON "oracle_event_subscriptions" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_gateway_idx" ON "oracle_event_subscriptions" ("gatewayId");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_sync_run_idx" ON "oracle_event_subscriptions" ("syncRunId");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_health_check_idx" ON "oracle_event_subscriptions" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_external_object_type_idx" ON "oracle_event_subscriptions" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_connection_status_idx" ON "oracle_event_subscriptions" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_auth_status_idx" ON "oracle_event_subscriptions" ("authStatus");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_sync_status_idx" ON "oracle_event_subscriptions" ("syncStatus");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_delivery_status_idx" ON "oracle_event_subscriptions" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_health_status_idx" ON "oracle_event_subscriptions" ("healthStatus");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_risk_idx" ON "oracle_event_subscriptions" ("riskLevel");
CREATE INDEX IF NOT EXISTS "oracle_event_subscriptions_deleted_idx" ON "oracle_event_subscriptions" ("deletedAt");


CREATE TABLE IF NOT EXISTS "microsoft_ecosystem_connections" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_tenant_record_key_uidx" ON "microsoft_ecosystem_connections" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_tenant_workspace_idx" ON "microsoft_ecosystem_connections" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_tenant_provider_idx" ON "microsoft_ecosystem_connections" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_tenant_status_idx" ON "microsoft_ecosystem_connections" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_connection_idx" ON "microsoft_ecosystem_connections" ("connectionId");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_connector_idx" ON "microsoft_ecosystem_connections" ("connectorId");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_route_idx" ON "microsoft_ecosystem_connections" ("routeId");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_webhook_endpoint_idx" ON "microsoft_ecosystem_connections" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_gateway_idx" ON "microsoft_ecosystem_connections" ("gatewayId");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_sync_run_idx" ON "microsoft_ecosystem_connections" ("syncRunId");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_health_check_idx" ON "microsoft_ecosystem_connections" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_external_object_type_idx" ON "microsoft_ecosystem_connections" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_connection_status_idx" ON "microsoft_ecosystem_connections" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_auth_status_idx" ON "microsoft_ecosystem_connections" ("authStatus");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_sync_status_idx" ON "microsoft_ecosystem_connections" ("syncStatus");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_delivery_status_idx" ON "microsoft_ecosystem_connections" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_health_status_idx" ON "microsoft_ecosystem_connections" ("healthStatus");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_risk_idx" ON "microsoft_ecosystem_connections" ("riskLevel");
CREATE INDEX IF NOT EXISTS "microsoft_ecosystem_connections_deleted_idx" ON "microsoft_ecosystem_connections" ("deletedAt");


CREATE TABLE IF NOT EXISTS "microsoft_graph_subscriptions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_tenant_record_key_uidx" ON "microsoft_graph_subscriptions" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_tenant_workspace_idx" ON "microsoft_graph_subscriptions" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_tenant_provider_idx" ON "microsoft_graph_subscriptions" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_tenant_status_idx" ON "microsoft_graph_subscriptions" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_connection_idx" ON "microsoft_graph_subscriptions" ("connectionId");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_connector_idx" ON "microsoft_graph_subscriptions" ("connectorId");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_route_idx" ON "microsoft_graph_subscriptions" ("routeId");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_webhook_endpoint_idx" ON "microsoft_graph_subscriptions" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_gateway_idx" ON "microsoft_graph_subscriptions" ("gatewayId");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_sync_run_idx" ON "microsoft_graph_subscriptions" ("syncRunId");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_health_check_idx" ON "microsoft_graph_subscriptions" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_external_object_type_idx" ON "microsoft_graph_subscriptions" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_connection_status_idx" ON "microsoft_graph_subscriptions" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_auth_status_idx" ON "microsoft_graph_subscriptions" ("authStatus");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_sync_status_idx" ON "microsoft_graph_subscriptions" ("syncStatus");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_delivery_status_idx" ON "microsoft_graph_subscriptions" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_health_status_idx" ON "microsoft_graph_subscriptions" ("healthStatus");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_risk_idx" ON "microsoft_graph_subscriptions" ("riskLevel");
CREATE INDEX IF NOT EXISTS "microsoft_graph_subscriptions_deleted_idx" ON "microsoft_graph_subscriptions" ("deletedAt");


CREATE TABLE IF NOT EXISTS "microsoft_teams_integrations" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "microsoft_teams_integrations_tenant_record_key_uidx" ON "microsoft_teams_integrations" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_tenant_workspace_idx" ON "microsoft_teams_integrations" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_tenant_provider_idx" ON "microsoft_teams_integrations" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_tenant_status_idx" ON "microsoft_teams_integrations" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_connection_idx" ON "microsoft_teams_integrations" ("connectionId");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_connector_idx" ON "microsoft_teams_integrations" ("connectorId");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_route_idx" ON "microsoft_teams_integrations" ("routeId");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_webhook_endpoint_idx" ON "microsoft_teams_integrations" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_gateway_idx" ON "microsoft_teams_integrations" ("gatewayId");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_sync_run_idx" ON "microsoft_teams_integrations" ("syncRunId");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_health_check_idx" ON "microsoft_teams_integrations" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_external_object_type_idx" ON "microsoft_teams_integrations" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_connection_status_idx" ON "microsoft_teams_integrations" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_auth_status_idx" ON "microsoft_teams_integrations" ("authStatus");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_sync_status_idx" ON "microsoft_teams_integrations" ("syncStatus");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_delivery_status_idx" ON "microsoft_teams_integrations" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_health_status_idx" ON "microsoft_teams_integrations" ("healthStatus");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_risk_idx" ON "microsoft_teams_integrations" ("riskLevel");
CREATE INDEX IF NOT EXISTS "microsoft_teams_integrations_deleted_idx" ON "microsoft_teams_integrations" ("deletedAt");


CREATE TABLE IF NOT EXISTS "microsoft_dynamics_mappings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_tenant_record_key_uidx" ON "microsoft_dynamics_mappings" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_tenant_workspace_idx" ON "microsoft_dynamics_mappings" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_tenant_provider_idx" ON "microsoft_dynamics_mappings" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_tenant_status_idx" ON "microsoft_dynamics_mappings" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_connection_idx" ON "microsoft_dynamics_mappings" ("connectionId");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_connector_idx" ON "microsoft_dynamics_mappings" ("connectorId");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_route_idx" ON "microsoft_dynamics_mappings" ("routeId");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_webhook_endpoint_idx" ON "microsoft_dynamics_mappings" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_gateway_idx" ON "microsoft_dynamics_mappings" ("gatewayId");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_sync_run_idx" ON "microsoft_dynamics_mappings" ("syncRunId");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_health_check_idx" ON "microsoft_dynamics_mappings" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_external_object_type_idx" ON "microsoft_dynamics_mappings" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_connection_status_idx" ON "microsoft_dynamics_mappings" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_auth_status_idx" ON "microsoft_dynamics_mappings" ("authStatus");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_sync_status_idx" ON "microsoft_dynamics_mappings" ("syncStatus");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_delivery_status_idx" ON "microsoft_dynamics_mappings" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_health_status_idx" ON "microsoft_dynamics_mappings" ("healthStatus");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_risk_idx" ON "microsoft_dynamics_mappings" ("riskLevel");
CREATE INDEX IF NOT EXISTS "microsoft_dynamics_mappings_deleted_idx" ON "microsoft_dynamics_mappings" ("deletedAt");


CREATE TABLE IF NOT EXISTS "google_workspace_connections" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "google_workspace_connections_tenant_record_key_uidx" ON "google_workspace_connections" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_tenant_workspace_idx" ON "google_workspace_connections" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_tenant_provider_idx" ON "google_workspace_connections" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_tenant_status_idx" ON "google_workspace_connections" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_connection_idx" ON "google_workspace_connections" ("connectionId");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_connector_idx" ON "google_workspace_connections" ("connectorId");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_route_idx" ON "google_workspace_connections" ("routeId");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_webhook_endpoint_idx" ON "google_workspace_connections" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_gateway_idx" ON "google_workspace_connections" ("gatewayId");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_sync_run_idx" ON "google_workspace_connections" ("syncRunId");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_health_check_idx" ON "google_workspace_connections" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_external_object_type_idx" ON "google_workspace_connections" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_connection_status_idx" ON "google_workspace_connections" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_auth_status_idx" ON "google_workspace_connections" ("authStatus");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_sync_status_idx" ON "google_workspace_connections" ("syncStatus");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_delivery_status_idx" ON "google_workspace_connections" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_health_status_idx" ON "google_workspace_connections" ("healthStatus");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_risk_idx" ON "google_workspace_connections" ("riskLevel");
CREATE INDEX IF NOT EXISTS "google_workspace_connections_deleted_idx" ON "google_workspace_connections" ("deletedAt");


CREATE TABLE IF NOT EXISTS "google_directory_syncs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "google_directory_syncs_tenant_record_key_uidx" ON "google_directory_syncs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_tenant_workspace_idx" ON "google_directory_syncs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_tenant_provider_idx" ON "google_directory_syncs" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_tenant_status_idx" ON "google_directory_syncs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_connection_idx" ON "google_directory_syncs" ("connectionId");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_connector_idx" ON "google_directory_syncs" ("connectorId");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_route_idx" ON "google_directory_syncs" ("routeId");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_webhook_endpoint_idx" ON "google_directory_syncs" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_gateway_idx" ON "google_directory_syncs" ("gatewayId");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_sync_run_idx" ON "google_directory_syncs" ("syncRunId");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_health_check_idx" ON "google_directory_syncs" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_external_object_type_idx" ON "google_directory_syncs" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_connection_status_idx" ON "google_directory_syncs" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_auth_status_idx" ON "google_directory_syncs" ("authStatus");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_sync_status_idx" ON "google_directory_syncs" ("syncStatus");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_delivery_status_idx" ON "google_directory_syncs" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_health_status_idx" ON "google_directory_syncs" ("healthStatus");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_risk_idx" ON "google_directory_syncs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "google_directory_syncs_deleted_idx" ON "google_directory_syncs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "google_calendar_integrations" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "google_calendar_integrations_tenant_record_key_uidx" ON "google_calendar_integrations" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_tenant_workspace_idx" ON "google_calendar_integrations" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_tenant_provider_idx" ON "google_calendar_integrations" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_tenant_status_idx" ON "google_calendar_integrations" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_connection_idx" ON "google_calendar_integrations" ("connectionId");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_connector_idx" ON "google_calendar_integrations" ("connectorId");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_route_idx" ON "google_calendar_integrations" ("routeId");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_webhook_endpoint_idx" ON "google_calendar_integrations" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_gateway_idx" ON "google_calendar_integrations" ("gatewayId");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_sync_run_idx" ON "google_calendar_integrations" ("syncRunId");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_health_check_idx" ON "google_calendar_integrations" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_external_object_type_idx" ON "google_calendar_integrations" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_connection_status_idx" ON "google_calendar_integrations" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_auth_status_idx" ON "google_calendar_integrations" ("authStatus");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_sync_status_idx" ON "google_calendar_integrations" ("syncStatus");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_delivery_status_idx" ON "google_calendar_integrations" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_health_status_idx" ON "google_calendar_integrations" ("healthStatus");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_risk_idx" ON "google_calendar_integrations" ("riskLevel");
CREATE INDEX IF NOT EXISTS "google_calendar_integrations_deleted_idx" ON "google_calendar_integrations" ("deletedAt");


CREATE TABLE IF NOT EXISTS "google_drive_mappings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "google_drive_mappings_tenant_record_key_uidx" ON "google_drive_mappings" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_tenant_workspace_idx" ON "google_drive_mappings" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_tenant_provider_idx" ON "google_drive_mappings" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_tenant_status_idx" ON "google_drive_mappings" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_connection_idx" ON "google_drive_mappings" ("connectionId");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_connector_idx" ON "google_drive_mappings" ("connectorId");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_route_idx" ON "google_drive_mappings" ("routeId");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_webhook_endpoint_idx" ON "google_drive_mappings" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_gateway_idx" ON "google_drive_mappings" ("gatewayId");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_sync_run_idx" ON "google_drive_mappings" ("syncRunId");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_health_check_idx" ON "google_drive_mappings" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_external_object_type_idx" ON "google_drive_mappings" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_connection_status_idx" ON "google_drive_mappings" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_auth_status_idx" ON "google_drive_mappings" ("authStatus");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_sync_status_idx" ON "google_drive_mappings" ("syncStatus");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_delivery_status_idx" ON "google_drive_mappings" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_health_status_idx" ON "google_drive_mappings" ("healthStatus");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_risk_idx" ON "google_drive_mappings" ("riskLevel");
CREATE INDEX IF NOT EXISTS "google_drive_mappings_deleted_idx" ON "google_drive_mappings" ("deletedAt");


CREATE TABLE IF NOT EXISTS "communication_integration_channels" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "communication_integration_channels_tenant_record_key_uidx" ON "communication_integration_channels" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_tenant_workspace_idx" ON "communication_integration_channels" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_tenant_provider_idx" ON "communication_integration_channels" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_tenant_status_idx" ON "communication_integration_channels" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_connection_idx" ON "communication_integration_channels" ("connectionId");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_connector_idx" ON "communication_integration_channels" ("connectorId");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_route_idx" ON "communication_integration_channels" ("routeId");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_webhook_endpoint_idx" ON "communication_integration_channels" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_gateway_idx" ON "communication_integration_channels" ("gatewayId");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_sync_run_idx" ON "communication_integration_channels" ("syncRunId");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_health_check_idx" ON "communication_integration_channels" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_external_object_type_idx" ON "communication_integration_channels" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_connection_status_idx" ON "communication_integration_channels" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_auth_status_idx" ON "communication_integration_channels" ("authStatus");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_sync_status_idx" ON "communication_integration_channels" ("syncStatus");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_delivery_status_idx" ON "communication_integration_channels" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_health_status_idx" ON "communication_integration_channels" ("healthStatus");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_risk_idx" ON "communication_integration_channels" ("riskLevel");
CREATE INDEX IF NOT EXISTS "communication_integration_channels_deleted_idx" ON "communication_integration_channels" ("deletedAt");


CREATE TABLE IF NOT EXISTS "communication_message_routes" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "communication_message_routes_tenant_record_key_uidx" ON "communication_message_routes" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "communication_message_routes_tenant_workspace_idx" ON "communication_message_routes" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "communication_message_routes_tenant_provider_idx" ON "communication_message_routes" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "communication_message_routes_tenant_status_idx" ON "communication_message_routes" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "communication_message_routes_connection_idx" ON "communication_message_routes" ("connectionId");
CREATE INDEX IF NOT EXISTS "communication_message_routes_connector_idx" ON "communication_message_routes" ("connectorId");
CREATE INDEX IF NOT EXISTS "communication_message_routes_route_idx" ON "communication_message_routes" ("routeId");
CREATE INDEX IF NOT EXISTS "communication_message_routes_webhook_endpoint_idx" ON "communication_message_routes" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "communication_message_routes_gateway_idx" ON "communication_message_routes" ("gatewayId");
CREATE INDEX IF NOT EXISTS "communication_message_routes_sync_run_idx" ON "communication_message_routes" ("syncRunId");
CREATE INDEX IF NOT EXISTS "communication_message_routes_health_check_idx" ON "communication_message_routes" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "communication_message_routes_external_object_type_idx" ON "communication_message_routes" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "communication_message_routes_connection_status_idx" ON "communication_message_routes" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "communication_message_routes_auth_status_idx" ON "communication_message_routes" ("authStatus");
CREATE INDEX IF NOT EXISTS "communication_message_routes_sync_status_idx" ON "communication_message_routes" ("syncStatus");
CREATE INDEX IF NOT EXISTS "communication_message_routes_delivery_status_idx" ON "communication_message_routes" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "communication_message_routes_health_status_idx" ON "communication_message_routes" ("healthStatus");
CREATE INDEX IF NOT EXISTS "communication_message_routes_risk_idx" ON "communication_message_routes" ("riskLevel");
CREATE INDEX IF NOT EXISTS "communication_message_routes_deleted_idx" ON "communication_message_routes" ("deletedAt");


CREATE TABLE IF NOT EXISTS "communication_provider_credentials" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "communication_provider_credentials_tenant_record_key_uidx" ON "communication_provider_credentials" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_tenant_workspace_idx" ON "communication_provider_credentials" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_tenant_provider_idx" ON "communication_provider_credentials" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_tenant_status_idx" ON "communication_provider_credentials" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_connection_idx" ON "communication_provider_credentials" ("connectionId");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_connector_idx" ON "communication_provider_credentials" ("connectorId");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_route_idx" ON "communication_provider_credentials" ("routeId");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_webhook_endpoint_idx" ON "communication_provider_credentials" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_gateway_idx" ON "communication_provider_credentials" ("gatewayId");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_sync_run_idx" ON "communication_provider_credentials" ("syncRunId");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_health_check_idx" ON "communication_provider_credentials" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_external_object_type_idx" ON "communication_provider_credentials" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_connection_status_idx" ON "communication_provider_credentials" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_auth_status_idx" ON "communication_provider_credentials" ("authStatus");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_sync_status_idx" ON "communication_provider_credentials" ("syncStatus");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_delivery_status_idx" ON "communication_provider_credentials" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_health_status_idx" ON "communication_provider_credentials" ("healthStatus");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_risk_idx" ON "communication_provider_credentials" ("riskLevel");
CREATE INDEX IF NOT EXISTS "communication_provider_credentials_deleted_idx" ON "communication_provider_credentials" ("deletedAt");


CREATE TABLE IF NOT EXISTS "communication_delivery_logs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "communication_delivery_logs_tenant_record_key_uidx" ON "communication_delivery_logs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_tenant_workspace_idx" ON "communication_delivery_logs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_tenant_provider_idx" ON "communication_delivery_logs" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_tenant_status_idx" ON "communication_delivery_logs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_connection_idx" ON "communication_delivery_logs" ("connectionId");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_connector_idx" ON "communication_delivery_logs" ("connectorId");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_route_idx" ON "communication_delivery_logs" ("routeId");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_webhook_endpoint_idx" ON "communication_delivery_logs" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_gateway_idx" ON "communication_delivery_logs" ("gatewayId");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_sync_run_idx" ON "communication_delivery_logs" ("syncRunId");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_health_check_idx" ON "communication_delivery_logs" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_external_object_type_idx" ON "communication_delivery_logs" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_connection_status_idx" ON "communication_delivery_logs" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_auth_status_idx" ON "communication_delivery_logs" ("authStatus");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_sync_status_idx" ON "communication_delivery_logs" ("syncStatus");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_delivery_status_idx" ON "communication_delivery_logs" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_health_status_idx" ON "communication_delivery_logs" ("healthStatus");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_risk_idx" ON "communication_delivery_logs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "communication_delivery_logs_deleted_idx" ON "communication_delivery_logs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "payment_integration_providers" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "payment_integration_providers_tenant_record_key_uidx" ON "payment_integration_providers" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_tenant_workspace_idx" ON "payment_integration_providers" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_tenant_provider_idx" ON "payment_integration_providers" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_tenant_status_idx" ON "payment_integration_providers" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_connection_idx" ON "payment_integration_providers" ("connectionId");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_connector_idx" ON "payment_integration_providers" ("connectorId");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_route_idx" ON "payment_integration_providers" ("routeId");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_webhook_endpoint_idx" ON "payment_integration_providers" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_gateway_idx" ON "payment_integration_providers" ("gatewayId");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_sync_run_idx" ON "payment_integration_providers" ("syncRunId");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_health_check_idx" ON "payment_integration_providers" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_external_object_type_idx" ON "payment_integration_providers" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_connection_status_idx" ON "payment_integration_providers" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_auth_status_idx" ON "payment_integration_providers" ("authStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_sync_status_idx" ON "payment_integration_providers" ("syncStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_delivery_status_idx" ON "payment_integration_providers" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_health_status_idx" ON "payment_integration_providers" ("healthStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_risk_idx" ON "payment_integration_providers" ("riskLevel");
CREATE INDEX IF NOT EXISTS "payment_integration_providers_deleted_idx" ON "payment_integration_providers" ("deletedAt");


CREATE TABLE IF NOT EXISTS "payment_integration_accounts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "payment_integration_accounts_tenant_record_key_uidx" ON "payment_integration_accounts" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_tenant_workspace_idx" ON "payment_integration_accounts" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_tenant_provider_idx" ON "payment_integration_accounts" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_tenant_status_idx" ON "payment_integration_accounts" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_connection_idx" ON "payment_integration_accounts" ("connectionId");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_connector_idx" ON "payment_integration_accounts" ("connectorId");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_route_idx" ON "payment_integration_accounts" ("routeId");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_webhook_endpoint_idx" ON "payment_integration_accounts" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_gateway_idx" ON "payment_integration_accounts" ("gatewayId");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_sync_run_idx" ON "payment_integration_accounts" ("syncRunId");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_health_check_idx" ON "payment_integration_accounts" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_external_object_type_idx" ON "payment_integration_accounts" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_connection_status_idx" ON "payment_integration_accounts" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_auth_status_idx" ON "payment_integration_accounts" ("authStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_sync_status_idx" ON "payment_integration_accounts" ("syncStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_delivery_status_idx" ON "payment_integration_accounts" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_health_status_idx" ON "payment_integration_accounts" ("healthStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_risk_idx" ON "payment_integration_accounts" ("riskLevel");
CREATE INDEX IF NOT EXISTS "payment_integration_accounts_deleted_idx" ON "payment_integration_accounts" ("deletedAt");


CREATE TABLE IF NOT EXISTS "payment_integration_transactions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "payment_integration_transactions_tenant_record_key_uidx" ON "payment_integration_transactions" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_tenant_workspace_idx" ON "payment_integration_transactions" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_tenant_provider_idx" ON "payment_integration_transactions" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_tenant_status_idx" ON "payment_integration_transactions" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_connection_idx" ON "payment_integration_transactions" ("connectionId");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_connector_idx" ON "payment_integration_transactions" ("connectorId");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_route_idx" ON "payment_integration_transactions" ("routeId");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_webhook_endpoint_idx" ON "payment_integration_transactions" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_gateway_idx" ON "payment_integration_transactions" ("gatewayId");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_sync_run_idx" ON "payment_integration_transactions" ("syncRunId");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_health_check_idx" ON "payment_integration_transactions" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_external_object_type_idx" ON "payment_integration_transactions" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_connection_status_idx" ON "payment_integration_transactions" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_auth_status_idx" ON "payment_integration_transactions" ("authStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_sync_status_idx" ON "payment_integration_transactions" ("syncStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_delivery_status_idx" ON "payment_integration_transactions" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_health_status_idx" ON "payment_integration_transactions" ("healthStatus");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_risk_idx" ON "payment_integration_transactions" ("riskLevel");
CREATE INDEX IF NOT EXISTS "payment_integration_transactions_deleted_idx" ON "payment_integration_transactions" ("deletedAt");


CREATE TABLE IF NOT EXISTS "payment_reconciliation_jobs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "payment_reconciliation_jobs_tenant_record_key_uidx" ON "payment_reconciliation_jobs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_tenant_workspace_idx" ON "payment_reconciliation_jobs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_tenant_provider_idx" ON "payment_reconciliation_jobs" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_tenant_status_idx" ON "payment_reconciliation_jobs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_connection_idx" ON "payment_reconciliation_jobs" ("connectionId");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_connector_idx" ON "payment_reconciliation_jobs" ("connectorId");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_route_idx" ON "payment_reconciliation_jobs" ("routeId");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_webhook_endpoint_idx" ON "payment_reconciliation_jobs" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_gateway_idx" ON "payment_reconciliation_jobs" ("gatewayId");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_sync_run_idx" ON "payment_reconciliation_jobs" ("syncRunId");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_health_check_idx" ON "payment_reconciliation_jobs" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_external_object_type_idx" ON "payment_reconciliation_jobs" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_connection_status_idx" ON "payment_reconciliation_jobs" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_auth_status_idx" ON "payment_reconciliation_jobs" ("authStatus");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_sync_status_idx" ON "payment_reconciliation_jobs" ("syncStatus");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_delivery_status_idx" ON "payment_reconciliation_jobs" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_health_status_idx" ON "payment_reconciliation_jobs" ("healthStatus");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_risk_idx" ON "payment_reconciliation_jobs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "payment_reconciliation_jobs_deleted_idx" ON "payment_reconciliation_jobs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "cloud_integration_providers" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "cloud_integration_providers_tenant_record_key_uidx" ON "cloud_integration_providers" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_tenant_workspace_idx" ON "cloud_integration_providers" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_tenant_provider_idx" ON "cloud_integration_providers" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_tenant_status_idx" ON "cloud_integration_providers" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_connection_idx" ON "cloud_integration_providers" ("connectionId");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_connector_idx" ON "cloud_integration_providers" ("connectorId");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_route_idx" ON "cloud_integration_providers" ("routeId");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_webhook_endpoint_idx" ON "cloud_integration_providers" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_gateway_idx" ON "cloud_integration_providers" ("gatewayId");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_sync_run_idx" ON "cloud_integration_providers" ("syncRunId");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_health_check_idx" ON "cloud_integration_providers" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_external_object_type_idx" ON "cloud_integration_providers" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_connection_status_idx" ON "cloud_integration_providers" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_auth_status_idx" ON "cloud_integration_providers" ("authStatus");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_sync_status_idx" ON "cloud_integration_providers" ("syncStatus");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_delivery_status_idx" ON "cloud_integration_providers" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_health_status_idx" ON "cloud_integration_providers" ("healthStatus");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_risk_idx" ON "cloud_integration_providers" ("riskLevel");
CREATE INDEX IF NOT EXISTS "cloud_integration_providers_deleted_idx" ON "cloud_integration_providers" ("deletedAt");


CREATE TABLE IF NOT EXISTS "cloud_storage_connections" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "cloud_storage_connections_tenant_record_key_uidx" ON "cloud_storage_connections" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_tenant_workspace_idx" ON "cloud_storage_connections" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_tenant_provider_idx" ON "cloud_storage_connections" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_tenant_status_idx" ON "cloud_storage_connections" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_connection_idx" ON "cloud_storage_connections" ("connectionId");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_connector_idx" ON "cloud_storage_connections" ("connectorId");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_route_idx" ON "cloud_storage_connections" ("routeId");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_webhook_endpoint_idx" ON "cloud_storage_connections" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_gateway_idx" ON "cloud_storage_connections" ("gatewayId");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_sync_run_idx" ON "cloud_storage_connections" ("syncRunId");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_health_check_idx" ON "cloud_storage_connections" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_external_object_type_idx" ON "cloud_storage_connections" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_connection_status_idx" ON "cloud_storage_connections" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_auth_status_idx" ON "cloud_storage_connections" ("authStatus");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_sync_status_idx" ON "cloud_storage_connections" ("syncStatus");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_delivery_status_idx" ON "cloud_storage_connections" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_health_status_idx" ON "cloud_storage_connections" ("healthStatus");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_risk_idx" ON "cloud_storage_connections" ("riskLevel");
CREATE INDEX IF NOT EXISTS "cloud_storage_connections_deleted_idx" ON "cloud_storage_connections" ("deletedAt");


CREATE TABLE IF NOT EXISTS "cloud_event_bridges" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "cloud_event_bridges_tenant_record_key_uidx" ON "cloud_event_bridges" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_tenant_workspace_idx" ON "cloud_event_bridges" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_tenant_provider_idx" ON "cloud_event_bridges" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_tenant_status_idx" ON "cloud_event_bridges" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_connection_idx" ON "cloud_event_bridges" ("connectionId");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_connector_idx" ON "cloud_event_bridges" ("connectorId");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_route_idx" ON "cloud_event_bridges" ("routeId");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_webhook_endpoint_idx" ON "cloud_event_bridges" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_gateway_idx" ON "cloud_event_bridges" ("gatewayId");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_sync_run_idx" ON "cloud_event_bridges" ("syncRunId");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_health_check_idx" ON "cloud_event_bridges" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_external_object_type_idx" ON "cloud_event_bridges" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_connection_status_idx" ON "cloud_event_bridges" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_auth_status_idx" ON "cloud_event_bridges" ("authStatus");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_sync_status_idx" ON "cloud_event_bridges" ("syncStatus");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_delivery_status_idx" ON "cloud_event_bridges" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_health_status_idx" ON "cloud_event_bridges" ("healthStatus");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_risk_idx" ON "cloud_event_bridges" ("riskLevel");
CREATE INDEX IF NOT EXISTS "cloud_event_bridges_deleted_idx" ON "cloud_event_bridges" ("deletedAt");


CREATE TABLE IF NOT EXISTS "cloud_secret_references" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "cloud_secret_references_tenant_record_key_uidx" ON "cloud_secret_references" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_tenant_workspace_idx" ON "cloud_secret_references" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_tenant_provider_idx" ON "cloud_secret_references" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_tenant_status_idx" ON "cloud_secret_references" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_connection_idx" ON "cloud_secret_references" ("connectionId");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_connector_idx" ON "cloud_secret_references" ("connectorId");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_route_idx" ON "cloud_secret_references" ("routeId");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_webhook_endpoint_idx" ON "cloud_secret_references" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_gateway_idx" ON "cloud_secret_references" ("gatewayId");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_sync_run_idx" ON "cloud_secret_references" ("syncRunId");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_health_check_idx" ON "cloud_secret_references" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_external_object_type_idx" ON "cloud_secret_references" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_connection_status_idx" ON "cloud_secret_references" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_auth_status_idx" ON "cloud_secret_references" ("authStatus");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_sync_status_idx" ON "cloud_secret_references" ("syncStatus");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_delivery_status_idx" ON "cloud_secret_references" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_health_status_idx" ON "cloud_secret_references" ("healthStatus");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_risk_idx" ON "cloud_secret_references" ("riskLevel");
CREATE INDEX IF NOT EXISTS "cloud_secret_references_deleted_idx" ON "cloud_secret_references" ("deletedAt");


CREATE TABLE IF NOT EXISTS "enterprise_api_gateways" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "enterprise_api_gateways_tenant_record_key_uidx" ON "enterprise_api_gateways" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_tenant_workspace_idx" ON "enterprise_api_gateways" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_tenant_provider_idx" ON "enterprise_api_gateways" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_tenant_status_idx" ON "enterprise_api_gateways" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_connection_idx" ON "enterprise_api_gateways" ("connectionId");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_connector_idx" ON "enterprise_api_gateways" ("connectorId");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_route_idx" ON "enterprise_api_gateways" ("routeId");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_webhook_endpoint_idx" ON "enterprise_api_gateways" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_gateway_idx" ON "enterprise_api_gateways" ("gatewayId");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_sync_run_idx" ON "enterprise_api_gateways" ("syncRunId");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_health_check_idx" ON "enterprise_api_gateways" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_external_object_type_idx" ON "enterprise_api_gateways" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_connection_status_idx" ON "enterprise_api_gateways" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_auth_status_idx" ON "enterprise_api_gateways" ("authStatus");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_sync_status_idx" ON "enterprise_api_gateways" ("syncStatus");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_delivery_status_idx" ON "enterprise_api_gateways" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_health_status_idx" ON "enterprise_api_gateways" ("healthStatus");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_risk_idx" ON "enterprise_api_gateways" ("riskLevel");
CREATE INDEX IF NOT EXISTS "enterprise_api_gateways_deleted_idx" ON "enterprise_api_gateways" ("deletedAt");


CREATE TABLE IF NOT EXISTS "api_gateway_routes" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "api_gateway_routes_tenant_record_key_uidx" ON "api_gateway_routes" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_tenant_workspace_idx" ON "api_gateway_routes" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_tenant_provider_idx" ON "api_gateway_routes" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_tenant_status_idx" ON "api_gateway_routes" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_connection_idx" ON "api_gateway_routes" ("connectionId");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_connector_idx" ON "api_gateway_routes" ("connectorId");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_route_idx" ON "api_gateway_routes" ("routeId");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_webhook_endpoint_idx" ON "api_gateway_routes" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_gateway_idx" ON "api_gateway_routes" ("gatewayId");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_sync_run_idx" ON "api_gateway_routes" ("syncRunId");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_health_check_idx" ON "api_gateway_routes" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_external_object_type_idx" ON "api_gateway_routes" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_connection_status_idx" ON "api_gateway_routes" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_auth_status_idx" ON "api_gateway_routes" ("authStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_sync_status_idx" ON "api_gateway_routes" ("syncStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_delivery_status_idx" ON "api_gateway_routes" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_health_status_idx" ON "api_gateway_routes" ("healthStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_risk_idx" ON "api_gateway_routes" ("riskLevel");
CREATE INDEX IF NOT EXISTS "api_gateway_routes_deleted_idx" ON "api_gateway_routes" ("deletedAt");


CREATE TABLE IF NOT EXISTS "api_gateway_policys" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "api_gateway_policys_tenant_record_key_uidx" ON "api_gateway_policys" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_tenant_workspace_idx" ON "api_gateway_policys" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_tenant_provider_idx" ON "api_gateway_policys" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_tenant_status_idx" ON "api_gateway_policys" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_connection_idx" ON "api_gateway_policys" ("connectionId");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_connector_idx" ON "api_gateway_policys" ("connectorId");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_route_idx" ON "api_gateway_policys" ("routeId");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_webhook_endpoint_idx" ON "api_gateway_policys" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_gateway_idx" ON "api_gateway_policys" ("gatewayId");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_sync_run_idx" ON "api_gateway_policys" ("syncRunId");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_health_check_idx" ON "api_gateway_policys" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_external_object_type_idx" ON "api_gateway_policys" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_connection_status_idx" ON "api_gateway_policys" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_auth_status_idx" ON "api_gateway_policys" ("authStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_sync_status_idx" ON "api_gateway_policys" ("syncStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_delivery_status_idx" ON "api_gateway_policys" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_health_status_idx" ON "api_gateway_policys" ("healthStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_risk_idx" ON "api_gateway_policys" ("riskLevel");
CREATE INDEX IF NOT EXISTS "api_gateway_policys_deleted_idx" ON "api_gateway_policys" ("deletedAt");


CREATE TABLE IF NOT EXISTS "api_gateway_consumers" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "api_gateway_consumers_tenant_record_key_uidx" ON "api_gateway_consumers" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_tenant_workspace_idx" ON "api_gateway_consumers" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_tenant_provider_idx" ON "api_gateway_consumers" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_tenant_status_idx" ON "api_gateway_consumers" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_connection_idx" ON "api_gateway_consumers" ("connectionId");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_connector_idx" ON "api_gateway_consumers" ("connectorId");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_route_idx" ON "api_gateway_consumers" ("routeId");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_webhook_endpoint_idx" ON "api_gateway_consumers" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_gateway_idx" ON "api_gateway_consumers" ("gatewayId");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_sync_run_idx" ON "api_gateway_consumers" ("syncRunId");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_health_check_idx" ON "api_gateway_consumers" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_external_object_type_idx" ON "api_gateway_consumers" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_connection_status_idx" ON "api_gateway_consumers" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_auth_status_idx" ON "api_gateway_consumers" ("authStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_sync_status_idx" ON "api_gateway_consumers" ("syncStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_delivery_status_idx" ON "api_gateway_consumers" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_health_status_idx" ON "api_gateway_consumers" ("healthStatus");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_risk_idx" ON "api_gateway_consumers" ("riskLevel");
CREATE INDEX IF NOT EXISTS "api_gateway_consumers_deleted_idx" ON "api_gateway_consumers" ("deletedAt");


CREATE TABLE IF NOT EXISTS "connectivity_webhook_endpoints" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_tenant_record_key_uidx" ON "connectivity_webhook_endpoints" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_tenant_workspace_idx" ON "connectivity_webhook_endpoints" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_tenant_provider_idx" ON "connectivity_webhook_endpoints" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_tenant_status_idx" ON "connectivity_webhook_endpoints" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_connection_idx" ON "connectivity_webhook_endpoints" ("connectionId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_connector_idx" ON "connectivity_webhook_endpoints" ("connectorId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_route_idx" ON "connectivity_webhook_endpoints" ("routeId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_webhook_endpoint_idx" ON "connectivity_webhook_endpoints" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_gateway_idx" ON "connectivity_webhook_endpoints" ("gatewayId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_sync_run_idx" ON "connectivity_webhook_endpoints" ("syncRunId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_health_check_idx" ON "connectivity_webhook_endpoints" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_external_object_type_idx" ON "connectivity_webhook_endpoints" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_connection_status_idx" ON "connectivity_webhook_endpoints" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_auth_status_idx" ON "connectivity_webhook_endpoints" ("authStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_sync_status_idx" ON "connectivity_webhook_endpoints" ("syncStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_delivery_status_idx" ON "connectivity_webhook_endpoints" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_health_status_idx" ON "connectivity_webhook_endpoints" ("healthStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_risk_idx" ON "connectivity_webhook_endpoints" ("riskLevel");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_endpoints_deleted_idx" ON "connectivity_webhook_endpoints" ("deletedAt");


CREATE TABLE IF NOT EXISTS "connectivity_webhook_deliverys" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_tenant_record_key_uidx" ON "connectivity_webhook_deliverys" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_tenant_workspace_idx" ON "connectivity_webhook_deliverys" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_tenant_provider_idx" ON "connectivity_webhook_deliverys" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_tenant_status_idx" ON "connectivity_webhook_deliverys" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_connection_idx" ON "connectivity_webhook_deliverys" ("connectionId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_connector_idx" ON "connectivity_webhook_deliverys" ("connectorId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_route_idx" ON "connectivity_webhook_deliverys" ("routeId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_webhook_endpoint_idx" ON "connectivity_webhook_deliverys" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_gateway_idx" ON "connectivity_webhook_deliverys" ("gatewayId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_sync_run_idx" ON "connectivity_webhook_deliverys" ("syncRunId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_health_check_idx" ON "connectivity_webhook_deliverys" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_external_object_type_idx" ON "connectivity_webhook_deliverys" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_connection_status_idx" ON "connectivity_webhook_deliverys" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_auth_status_idx" ON "connectivity_webhook_deliverys" ("authStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_sync_status_idx" ON "connectivity_webhook_deliverys" ("syncStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_delivery_status_idx" ON "connectivity_webhook_deliverys" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_health_status_idx" ON "connectivity_webhook_deliverys" ("healthStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_risk_idx" ON "connectivity_webhook_deliverys" ("riskLevel");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_deliverys_deleted_idx" ON "connectivity_webhook_deliverys" ("deletedAt");


CREATE TABLE IF NOT EXISTS "connectivity_webhook_signatures" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "connectivity_webhook_signatures_tenant_record_key_uidx" ON "connectivity_webhook_signatures" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_tenant_workspace_idx" ON "connectivity_webhook_signatures" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_tenant_provider_idx" ON "connectivity_webhook_signatures" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_tenant_status_idx" ON "connectivity_webhook_signatures" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_connection_idx" ON "connectivity_webhook_signatures" ("connectionId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_connector_idx" ON "connectivity_webhook_signatures" ("connectorId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_route_idx" ON "connectivity_webhook_signatures" ("routeId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_webhook_endpoint_idx" ON "connectivity_webhook_signatures" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_gateway_idx" ON "connectivity_webhook_signatures" ("gatewayId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_sync_run_idx" ON "connectivity_webhook_signatures" ("syncRunId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_health_check_idx" ON "connectivity_webhook_signatures" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_external_object_type_idx" ON "connectivity_webhook_signatures" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_connection_status_idx" ON "connectivity_webhook_signatures" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_auth_status_idx" ON "connectivity_webhook_signatures" ("authStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_sync_status_idx" ON "connectivity_webhook_signatures" ("syncStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_delivery_status_idx" ON "connectivity_webhook_signatures" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_health_status_idx" ON "connectivity_webhook_signatures" ("healthStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_risk_idx" ON "connectivity_webhook_signatures" ("riskLevel");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_signatures_deleted_idx" ON "connectivity_webhook_signatures" ("deletedAt");


CREATE TABLE IF NOT EXISTS "connectivity_webhook_subscriptions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_tenant_record_key_uidx" ON "connectivity_webhook_subscriptions" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_tenant_workspace_idx" ON "connectivity_webhook_subscriptions" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_tenant_provider_idx" ON "connectivity_webhook_subscriptions" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_tenant_status_idx" ON "connectivity_webhook_subscriptions" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_connection_idx" ON "connectivity_webhook_subscriptions" ("connectionId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_connector_idx" ON "connectivity_webhook_subscriptions" ("connectorId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_route_idx" ON "connectivity_webhook_subscriptions" ("routeId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_webhook_endpoint_idx" ON "connectivity_webhook_subscriptions" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_gateway_idx" ON "connectivity_webhook_subscriptions" ("gatewayId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_sync_run_idx" ON "connectivity_webhook_subscriptions" ("syncRunId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_health_check_idx" ON "connectivity_webhook_subscriptions" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_external_object_type_idx" ON "connectivity_webhook_subscriptions" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_connection_status_idx" ON "connectivity_webhook_subscriptions" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_auth_status_idx" ON "connectivity_webhook_subscriptions" ("authStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_sync_status_idx" ON "connectivity_webhook_subscriptions" ("syncStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_delivery_status_idx" ON "connectivity_webhook_subscriptions" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_health_status_idx" ON "connectivity_webhook_subscriptions" ("healthStatus");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_risk_idx" ON "connectivity_webhook_subscriptions" ("riskLevel");
CREATE INDEX IF NOT EXISTS "connectivity_webhook_subscriptions_deleted_idx" ON "connectivity_webhook_subscriptions" ("deletedAt");


CREATE TABLE IF NOT EXISTS "enterprise_connector_sdks" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "enterprise_connector_sdks_tenant_record_key_uidx" ON "enterprise_connector_sdks" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_tenant_workspace_idx" ON "enterprise_connector_sdks" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_tenant_provider_idx" ON "enterprise_connector_sdks" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_tenant_status_idx" ON "enterprise_connector_sdks" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_connection_idx" ON "enterprise_connector_sdks" ("connectionId");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_connector_idx" ON "enterprise_connector_sdks" ("connectorId");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_route_idx" ON "enterprise_connector_sdks" ("routeId");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_webhook_endpoint_idx" ON "enterprise_connector_sdks" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_gateway_idx" ON "enterprise_connector_sdks" ("gatewayId");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_sync_run_idx" ON "enterprise_connector_sdks" ("syncRunId");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_health_check_idx" ON "enterprise_connector_sdks" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_external_object_type_idx" ON "enterprise_connector_sdks" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_connection_status_idx" ON "enterprise_connector_sdks" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_auth_status_idx" ON "enterprise_connector_sdks" ("authStatus");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_sync_status_idx" ON "enterprise_connector_sdks" ("syncStatus");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_delivery_status_idx" ON "enterprise_connector_sdks" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_health_status_idx" ON "enterprise_connector_sdks" ("healthStatus");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_risk_idx" ON "enterprise_connector_sdks" ("riskLevel");
CREATE INDEX IF NOT EXISTS "enterprise_connector_sdks_deleted_idx" ON "enterprise_connector_sdks" ("deletedAt");


CREATE TABLE IF NOT EXISTS "connector_sdk_packages" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "connector_sdk_packages_tenant_record_key_uidx" ON "connector_sdk_packages" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_tenant_workspace_idx" ON "connector_sdk_packages" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_tenant_provider_idx" ON "connector_sdk_packages" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_tenant_status_idx" ON "connector_sdk_packages" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_connection_idx" ON "connector_sdk_packages" ("connectionId");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_connector_idx" ON "connector_sdk_packages" ("connectorId");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_route_idx" ON "connector_sdk_packages" ("routeId");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_webhook_endpoint_idx" ON "connector_sdk_packages" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_gateway_idx" ON "connector_sdk_packages" ("gatewayId");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_sync_run_idx" ON "connector_sdk_packages" ("syncRunId");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_health_check_idx" ON "connector_sdk_packages" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_external_object_type_idx" ON "connector_sdk_packages" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_connection_status_idx" ON "connector_sdk_packages" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_auth_status_idx" ON "connector_sdk_packages" ("authStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_sync_status_idx" ON "connector_sdk_packages" ("syncStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_delivery_status_idx" ON "connector_sdk_packages" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_health_status_idx" ON "connector_sdk_packages" ("healthStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_risk_idx" ON "connector_sdk_packages" ("riskLevel");
CREATE INDEX IF NOT EXISTS "connector_sdk_packages_deleted_idx" ON "connector_sdk_packages" ("deletedAt");


CREATE TABLE IF NOT EXISTS "connector_sdk_extension_points" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "connector_sdk_extension_points_tenant_record_key_uidx" ON "connector_sdk_extension_points" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_tenant_workspace_idx" ON "connector_sdk_extension_points" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_tenant_provider_idx" ON "connector_sdk_extension_points" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_tenant_status_idx" ON "connector_sdk_extension_points" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_connection_idx" ON "connector_sdk_extension_points" ("connectionId");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_connector_idx" ON "connector_sdk_extension_points" ("connectorId");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_route_idx" ON "connector_sdk_extension_points" ("routeId");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_webhook_endpoint_idx" ON "connector_sdk_extension_points" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_gateway_idx" ON "connector_sdk_extension_points" ("gatewayId");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_sync_run_idx" ON "connector_sdk_extension_points" ("syncRunId");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_health_check_idx" ON "connector_sdk_extension_points" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_external_object_type_idx" ON "connector_sdk_extension_points" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_connection_status_idx" ON "connector_sdk_extension_points" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_auth_status_idx" ON "connector_sdk_extension_points" ("authStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_sync_status_idx" ON "connector_sdk_extension_points" ("syncStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_delivery_status_idx" ON "connector_sdk_extension_points" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_health_status_idx" ON "connector_sdk_extension_points" ("healthStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_risk_idx" ON "connector_sdk_extension_points" ("riskLevel");
CREATE INDEX IF NOT EXISTS "connector_sdk_extension_points_deleted_idx" ON "connector_sdk_extension_points" ("deletedAt");


CREATE TABLE IF NOT EXISTS "connector_sdk_versions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "connector_sdk_versions_tenant_record_key_uidx" ON "connector_sdk_versions" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_tenant_workspace_idx" ON "connector_sdk_versions" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_tenant_provider_idx" ON "connector_sdk_versions" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_tenant_status_idx" ON "connector_sdk_versions" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_connection_idx" ON "connector_sdk_versions" ("connectionId");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_connector_idx" ON "connector_sdk_versions" ("connectorId");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_route_idx" ON "connector_sdk_versions" ("routeId");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_webhook_endpoint_idx" ON "connector_sdk_versions" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_gateway_idx" ON "connector_sdk_versions" ("gatewayId");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_sync_run_idx" ON "connector_sdk_versions" ("syncRunId");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_health_check_idx" ON "connector_sdk_versions" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_external_object_type_idx" ON "connector_sdk_versions" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_connection_status_idx" ON "connector_sdk_versions" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_auth_status_idx" ON "connector_sdk_versions" ("authStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_sync_status_idx" ON "connector_sdk_versions" ("syncStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_delivery_status_idx" ON "connector_sdk_versions" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_health_status_idx" ON "connector_sdk_versions" ("healthStatus");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_risk_idx" ON "connector_sdk_versions" ("riskLevel");
CREATE INDEX IF NOT EXISTS "connector_sdk_versions_deleted_idx" ON "connector_sdk_versions" ("deletedAt");


CREATE TABLE IF NOT EXISTS "integration_health_checks" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "integration_health_checks_tenant_record_key_uidx" ON "integration_health_checks" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "integration_health_checks_tenant_workspace_idx" ON "integration_health_checks" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "integration_health_checks_tenant_provider_idx" ON "integration_health_checks" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "integration_health_checks_tenant_status_idx" ON "integration_health_checks" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "integration_health_checks_connection_idx" ON "integration_health_checks" ("connectionId");
CREATE INDEX IF NOT EXISTS "integration_health_checks_connector_idx" ON "integration_health_checks" ("connectorId");
CREATE INDEX IF NOT EXISTS "integration_health_checks_route_idx" ON "integration_health_checks" ("routeId");
CREATE INDEX IF NOT EXISTS "integration_health_checks_webhook_endpoint_idx" ON "integration_health_checks" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "integration_health_checks_gateway_idx" ON "integration_health_checks" ("gatewayId");
CREATE INDEX IF NOT EXISTS "integration_health_checks_sync_run_idx" ON "integration_health_checks" ("syncRunId");
CREATE INDEX IF NOT EXISTS "integration_health_checks_health_check_idx" ON "integration_health_checks" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "integration_health_checks_external_object_type_idx" ON "integration_health_checks" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "integration_health_checks_connection_status_idx" ON "integration_health_checks" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "integration_health_checks_auth_status_idx" ON "integration_health_checks" ("authStatus");
CREATE INDEX IF NOT EXISTS "integration_health_checks_sync_status_idx" ON "integration_health_checks" ("syncStatus");
CREATE INDEX IF NOT EXISTS "integration_health_checks_delivery_status_idx" ON "integration_health_checks" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "integration_health_checks_health_status_idx" ON "integration_health_checks" ("healthStatus");
CREATE INDEX IF NOT EXISTS "integration_health_checks_risk_idx" ON "integration_health_checks" ("riskLevel");
CREATE INDEX IF NOT EXISTS "integration_health_checks_deleted_idx" ON "integration_health_checks" ("deletedAt");


CREATE TABLE IF NOT EXISTS "integration_sync_runs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "integration_sync_runs_tenant_record_key_uidx" ON "integration_sync_runs" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_tenant_workspace_idx" ON "integration_sync_runs" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_tenant_provider_idx" ON "integration_sync_runs" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_tenant_status_idx" ON "integration_sync_runs" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_connection_idx" ON "integration_sync_runs" ("connectionId");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_connector_idx" ON "integration_sync_runs" ("connectorId");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_route_idx" ON "integration_sync_runs" ("routeId");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_webhook_endpoint_idx" ON "integration_sync_runs" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_gateway_idx" ON "integration_sync_runs" ("gatewayId");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_sync_run_idx" ON "integration_sync_runs" ("syncRunId");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_health_check_idx" ON "integration_sync_runs" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_external_object_type_idx" ON "integration_sync_runs" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_connection_status_idx" ON "integration_sync_runs" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_auth_status_idx" ON "integration_sync_runs" ("authStatus");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_sync_status_idx" ON "integration_sync_runs" ("syncStatus");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_delivery_status_idx" ON "integration_sync_runs" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_health_status_idx" ON "integration_sync_runs" ("healthStatus");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_risk_idx" ON "integration_sync_runs" ("riskLevel");
CREATE INDEX IF NOT EXISTS "integration_sync_runs_deleted_idx" ON "integration_sync_runs" ("deletedAt");


CREATE TABLE IF NOT EXISTS "integration_alerts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "integration_alerts_tenant_record_key_uidx" ON "integration_alerts" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "integration_alerts_tenant_workspace_idx" ON "integration_alerts" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "integration_alerts_tenant_provider_idx" ON "integration_alerts" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "integration_alerts_tenant_status_idx" ON "integration_alerts" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "integration_alerts_connection_idx" ON "integration_alerts" ("connectionId");
CREATE INDEX IF NOT EXISTS "integration_alerts_connector_idx" ON "integration_alerts" ("connectorId");
CREATE INDEX IF NOT EXISTS "integration_alerts_route_idx" ON "integration_alerts" ("routeId");
CREATE INDEX IF NOT EXISTS "integration_alerts_webhook_endpoint_idx" ON "integration_alerts" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "integration_alerts_gateway_idx" ON "integration_alerts" ("gatewayId");
CREATE INDEX IF NOT EXISTS "integration_alerts_sync_run_idx" ON "integration_alerts" ("syncRunId");
CREATE INDEX IF NOT EXISTS "integration_alerts_health_check_idx" ON "integration_alerts" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "integration_alerts_external_object_type_idx" ON "integration_alerts" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "integration_alerts_connection_status_idx" ON "integration_alerts" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "integration_alerts_auth_status_idx" ON "integration_alerts" ("authStatus");
CREATE INDEX IF NOT EXISTS "integration_alerts_sync_status_idx" ON "integration_alerts" ("syncStatus");
CREATE INDEX IF NOT EXISTS "integration_alerts_delivery_status_idx" ON "integration_alerts" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "integration_alerts_health_status_idx" ON "integration_alerts" ("healthStatus");
CREATE INDEX IF NOT EXISTS "integration_alerts_risk_idx" ON "integration_alerts" ("riskLevel");
CREATE INDEX IF NOT EXISTS "integration_alerts_deleted_idx" ON "integration_alerts" ("deletedAt");


CREATE TABLE IF NOT EXISTS "integration_usage_metrics" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "integration_usage_metrics_tenant_record_key_uidx" ON "integration_usage_metrics" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_tenant_workspace_idx" ON "integration_usage_metrics" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_tenant_provider_idx" ON "integration_usage_metrics" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_tenant_status_idx" ON "integration_usage_metrics" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_connection_idx" ON "integration_usage_metrics" ("connectionId");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_connector_idx" ON "integration_usage_metrics" ("connectorId");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_route_idx" ON "integration_usage_metrics" ("routeId");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_webhook_endpoint_idx" ON "integration_usage_metrics" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_gateway_idx" ON "integration_usage_metrics" ("gatewayId");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_sync_run_idx" ON "integration_usage_metrics" ("syncRunId");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_health_check_idx" ON "integration_usage_metrics" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_external_object_type_idx" ON "integration_usage_metrics" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_connection_status_idx" ON "integration_usage_metrics" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_auth_status_idx" ON "integration_usage_metrics" ("authStatus");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_sync_status_idx" ON "integration_usage_metrics" ("syncStatus");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_delivery_status_idx" ON "integration_usage_metrics" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_health_status_idx" ON "integration_usage_metrics" ("healthStatus");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_risk_idx" ON "integration_usage_metrics" ("riskLevel");
CREATE INDEX IF NOT EXISTS "integration_usage_metrics_deleted_idx" ON "integration_usage_metrics" ("deletedAt");


CREATE TABLE IF NOT EXISTS "integration_copilot_querys" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "integration_copilot_querys_tenant_record_key_uidx" ON "integration_copilot_querys" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_tenant_workspace_idx" ON "integration_copilot_querys" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_tenant_provider_idx" ON "integration_copilot_querys" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_tenant_status_idx" ON "integration_copilot_querys" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_connection_idx" ON "integration_copilot_querys" ("connectionId");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_connector_idx" ON "integration_copilot_querys" ("connectorId");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_route_idx" ON "integration_copilot_querys" ("routeId");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_webhook_endpoint_idx" ON "integration_copilot_querys" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_gateway_idx" ON "integration_copilot_querys" ("gatewayId");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_sync_run_idx" ON "integration_copilot_querys" ("syncRunId");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_health_check_idx" ON "integration_copilot_querys" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_external_object_type_idx" ON "integration_copilot_querys" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_connection_status_idx" ON "integration_copilot_querys" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_auth_status_idx" ON "integration_copilot_querys" ("authStatus");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_sync_status_idx" ON "integration_copilot_querys" ("syncStatus");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_delivery_status_idx" ON "integration_copilot_querys" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_health_status_idx" ON "integration_copilot_querys" ("healthStatus");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_risk_idx" ON "integration_copilot_querys" ("riskLevel");
CREATE INDEX IF NOT EXISTS "integration_copilot_querys_deleted_idx" ON "integration_copilot_querys" ("deletedAt");


CREATE TABLE IF NOT EXISTS "integration_recommendations" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "integration_recommendations_tenant_record_key_uidx" ON "integration_recommendations" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "integration_recommendations_tenant_workspace_idx" ON "integration_recommendations" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "integration_recommendations_tenant_provider_idx" ON "integration_recommendations" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "integration_recommendations_tenant_status_idx" ON "integration_recommendations" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "integration_recommendations_connection_idx" ON "integration_recommendations" ("connectionId");
CREATE INDEX IF NOT EXISTS "integration_recommendations_connector_idx" ON "integration_recommendations" ("connectorId");
CREATE INDEX IF NOT EXISTS "integration_recommendations_route_idx" ON "integration_recommendations" ("routeId");
CREATE INDEX IF NOT EXISTS "integration_recommendations_webhook_endpoint_idx" ON "integration_recommendations" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "integration_recommendations_gateway_idx" ON "integration_recommendations" ("gatewayId");
CREATE INDEX IF NOT EXISTS "integration_recommendations_sync_run_idx" ON "integration_recommendations" ("syncRunId");
CREATE INDEX IF NOT EXISTS "integration_recommendations_health_check_idx" ON "integration_recommendations" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "integration_recommendations_external_object_type_idx" ON "integration_recommendations" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "integration_recommendations_connection_status_idx" ON "integration_recommendations" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "integration_recommendations_auth_status_idx" ON "integration_recommendations" ("authStatus");
CREATE INDEX IF NOT EXISTS "integration_recommendations_sync_status_idx" ON "integration_recommendations" ("syncStatus");
CREATE INDEX IF NOT EXISTS "integration_recommendations_delivery_status_idx" ON "integration_recommendations" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "integration_recommendations_health_status_idx" ON "integration_recommendations" ("healthStatus");
CREATE INDEX IF NOT EXISTS "integration_recommendations_risk_idx" ON "integration_recommendations" ("riskLevel");
CREATE INDEX IF NOT EXISTS "integration_recommendations_deleted_idx" ON "integration_recommendations" ("deletedAt");


CREATE TABLE IF NOT EXISTS "integration_risk_signals" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "integration_risk_signals_tenant_record_key_uidx" ON "integration_risk_signals" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_tenant_workspace_idx" ON "integration_risk_signals" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_tenant_provider_idx" ON "integration_risk_signals" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_tenant_status_idx" ON "integration_risk_signals" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_connection_idx" ON "integration_risk_signals" ("connectionId");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_connector_idx" ON "integration_risk_signals" ("connectorId");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_route_idx" ON "integration_risk_signals" ("routeId");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_webhook_endpoint_idx" ON "integration_risk_signals" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_gateway_idx" ON "integration_risk_signals" ("gatewayId");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_sync_run_idx" ON "integration_risk_signals" ("syncRunId");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_health_check_idx" ON "integration_risk_signals" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_external_object_type_idx" ON "integration_risk_signals" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_connection_status_idx" ON "integration_risk_signals" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_auth_status_idx" ON "integration_risk_signals" ("authStatus");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_sync_status_idx" ON "integration_risk_signals" ("syncStatus");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_delivery_status_idx" ON "integration_risk_signals" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_health_status_idx" ON "integration_risk_signals" ("healthStatus");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_risk_idx" ON "integration_risk_signals" ("riskLevel");
CREATE INDEX IF NOT EXISTS "integration_risk_signals_deleted_idx" ON "integration_risk_signals" ("deletedAt");


CREATE TABLE IF NOT EXISTS "integration_audit_events" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "provider" TEXT,
  "providerAccountId" TEXT,
  "connectionId" UUID,
  "connectorId" UUID,
  "catalogId" UUID,
  "routeId" UUID,
  "webhookEndpointId" UUID,
  "gatewayId" UUID,
  "sdkPackageId" UUID,
  "syncRunId" UUID,
  "healthCheckId" UUID,
  "credentialRefId" TEXT,
  "secretReferenceId" TEXT,
  "externalTenantId" TEXT,
  "externalUserId" TEXT,
  "externalObjectType" TEXT,
  "externalObjectId" TEXT,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "type" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lifecycleStatus" TEXT,
  "connectionStatus" TEXT,
  "authStatus" TEXT,
  "syncStatus" TEXT,
  "deliveryStatus" TEXT,
  "healthStatus" TEXT,
  "riskLevel" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "environment" TEXT NOT NULL DEFAULT 'production',
  "region" TEXT,
  "countryCode" TEXT,
  "apiVersion" TEXT,
  "protocol" TEXT,
  "baseUrl" TEXT,
  "endpointPath" TEXT,
  "httpMethod" TEXT,
  "authType" TEXT,
  "oauthClientId" TEXT,
  "oauthTenantId" TEXT,
  "oidcIssuer" TEXT,
  "oidcAudience" TEXT,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "rateLimitPolicy" JSONB NOT NULL DEFAULT '{}',
  "retryPolicy" JSONB NOT NULL DEFAULT '{}',
  "mappingConfig" JSONB NOT NULL DEFAULT '{}',
  "transformConfig" JSONB NOT NULL DEFAULT '{}',
  "routingRules" JSONB NOT NULL DEFAULT '{}',
  "subscriptionConfig" JSONB NOT NULL DEFAULT '{}',
  "headers" JSONB NOT NULL DEFAULT '{}',
  "requestTemplate" JSONB NOT NULL DEFAULT '{}',
  "responseTemplate" JSONB NOT NULL DEFAULT '{}',
  "payload" JSONB NOT NULL DEFAULT '{}',
  "metrics" JSONB NOT NULL DEFAULT '{}',
  "recommendations" JSONB NOT NULL DEFAULT '[]',
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "lastValidatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "lastDeliveredAt" TIMESTAMP(3),
  "tokenExpiresAt" TIMESTAMP(3),
  "nextRunAt" TIMESTAMP(3),
  "disabledAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "sequence" INTEGER NOT NULL DEFAULT 0,
  "timeoutMs" INTEGER NOT NULL DEFAULT 30000,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "failureCount" INTEGER NOT NULL DEFAULT 0,
  "successCount" INTEGER NOT NULL DEFAULT 0,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "latencyMs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "throughputPerMinute" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "uptimePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "isManaged" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "integration_audit_events_tenant_record_key_uidx" ON "integration_audit_events" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "integration_audit_events_tenant_workspace_idx" ON "integration_audit_events" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "integration_audit_events_tenant_provider_idx" ON "integration_audit_events" ("tenantId", "provider");
CREATE INDEX IF NOT EXISTS "integration_audit_events_tenant_status_idx" ON "integration_audit_events" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "integration_audit_events_connection_idx" ON "integration_audit_events" ("connectionId");
CREATE INDEX IF NOT EXISTS "integration_audit_events_connector_idx" ON "integration_audit_events" ("connectorId");
CREATE INDEX IF NOT EXISTS "integration_audit_events_route_idx" ON "integration_audit_events" ("routeId");
CREATE INDEX IF NOT EXISTS "integration_audit_events_webhook_endpoint_idx" ON "integration_audit_events" ("webhookEndpointId");
CREATE INDEX IF NOT EXISTS "integration_audit_events_gateway_idx" ON "integration_audit_events" ("gatewayId");
CREATE INDEX IF NOT EXISTS "integration_audit_events_sync_run_idx" ON "integration_audit_events" ("syncRunId");
CREATE INDEX IF NOT EXISTS "integration_audit_events_health_check_idx" ON "integration_audit_events" ("healthCheckId");
CREATE INDEX IF NOT EXISTS "integration_audit_events_external_object_type_idx" ON "integration_audit_events" ("externalObjectType");
CREATE INDEX IF NOT EXISTS "integration_audit_events_connection_status_idx" ON "integration_audit_events" ("connectionStatus");
CREATE INDEX IF NOT EXISTS "integration_audit_events_auth_status_idx" ON "integration_audit_events" ("authStatus");
CREATE INDEX IF NOT EXISTS "integration_audit_events_sync_status_idx" ON "integration_audit_events" ("syncStatus");
CREATE INDEX IF NOT EXISTS "integration_audit_events_delivery_status_idx" ON "integration_audit_events" ("deliveryStatus");
CREATE INDEX IF NOT EXISTS "integration_audit_events_health_status_idx" ON "integration_audit_events" ("healthStatus");
CREATE INDEX IF NOT EXISTS "integration_audit_events_risk_idx" ON "integration_audit_events" ("riskLevel");
CREATE INDEX IF NOT EXISTS "integration_audit_events_deleted_idx" ON "integration_audit_events" ("deletedAt");
