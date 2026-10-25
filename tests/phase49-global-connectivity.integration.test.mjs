import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const schema = fs.readFileSync(path.join(root, 'prisma/schema.prisma'), 'utf8');
const appModule = fs.readFileSync(path.join(root, 'apps/api/src/app.module.ts'), 'utf8');
const apiMap = fs.readFileSync(path.join(root, 'apps/web/services/global-connectivity-api.ts'), 'utf8');
const registry = fs.readFileSync(path.join(root, 'apps/api/src/modules/events/registry/event-registry.ts'), 'utf8');

test('Phase 49 Prisma schema includes required connectivity model surface', () => {
  const required = ["GlobalIntegrationHub","GlobalIntegrationCatalog","GlobalIntegrationTenantConfig","GlobalIntegrationConnection","SalesforceConnection","SalesforceObjectMapping","SalesforceSyncJob","SalesforceEventSubscription","SapConnection","SapBapiMapping","SapIdocSubscription","SapSyncJob","OracleConnection","OracleObjectMapping","OracleSyncJob","OracleEventSubscription","MicrosoftEcosystemConnection","MicrosoftGraphSubscription","MicrosoftTeamsIntegration","MicrosoftDynamicsMapping","GoogleWorkspaceConnection","GoogleDirectorySync","GoogleCalendarIntegration","GoogleDriveMapping","CommunicationIntegrationChannel","CommunicationMessageRoute","CommunicationProviderCredential","CommunicationDeliveryLog","PaymentIntegrationProvider","PaymentIntegrationAccount","PaymentIntegrationTransaction","PaymentReconciliationJob","CloudIntegrationProvider","CloudStorageConnection","CloudEventBridge","CloudSecretReference","EnterpriseApiGateway","ApiGatewayRoute","ApiGatewayPolicy","ApiGatewayConsumer","ConnectivityWebhookEndpoint","ConnectivityWebhookDelivery","ConnectivityWebhookSignature","ConnectivityWebhookSubscription","EnterpriseConnectorSdk","ConnectorSdkPackage","ConnectorSdkExtensionPoint","ConnectorSdkVersion","IntegrationHealthCheck","IntegrationSyncRun","IntegrationAlert","IntegrationUsageMetric","IntegrationCopilotQuery","IntegrationRecommendation","IntegrationRiskSignal","IntegrationAuditEvent"];
  for (const model of required) assert.ok(schema.includes('model ' + model + ' {'), model + ' exists in Prisma schema');
});

test('Phase 49 module, API map and connectivity events are registered', () => {
  assert.match(appModule, /GlobalConnectivityModule/);
  for (const apiPath of ["/v1/integration-hub","/v1/connectors/salesforce","/v1/connectors/sap","/v1/connectors/oracle","/v1/connectors/microsoft","/v1/connectors/google-workspace","/v1/communication-integrations","/v1/payment-integrations","/v1/cloud-integrations","/v1/api-gateway","/v1/webhook-platform","/v1/connector-sdk","/v1/integration-monitoring","/v1/ai-integration-copilot"]) assert.ok(apiMap.includes(apiPath), apiPath + ' exists in API map');
  for (const eventName of ['GLOBAL_INTEGRATION_REGISTERED', 'OAUTH_TOKEN_ROTATED', 'WEBHOOK_DELIVERY_FAILED', 'CONNECTOR_SDK_PUBLISHED', 'INTEGRATION_COPILOT_QUERIED']) assert.ok(registry.includes(eventName), eventName + ' registered');
});
