export type ConnectivityEntity = 'globalIntegrationHub' | 'globalIntegrationCatalog' | 'globalIntegrationTenantConfig' | 'globalIntegrationConnection' | 'salesforceConnection' | 'salesforceObjectMapping' | 'salesforceSyncJob' | 'salesforceEventSubscription' | 'sapConnection' | 'sapBapiMapping' | 'sapIdocSubscription' | 'sapSyncJob' | 'oracleConnection' | 'oracleObjectMapping' | 'oracleSyncJob' | 'oracleEventSubscription' | 'microsoftEcosystemConnection' | 'microsoftGraphSubscription' | 'microsoftTeamsIntegration' | 'microsoftDynamicsMapping' | 'googleWorkspaceConnection' | 'googleDirectorySync' | 'googleCalendarIntegration' | 'googleDriveMapping' | 'communicationIntegrationChannel' | 'communicationMessageRoute' | 'communicationProviderCredential' | 'communicationDeliveryLog' | 'paymentIntegrationProvider' | 'paymentIntegrationAccount' | 'paymentIntegrationTransaction' | 'paymentReconciliationJob' | 'cloudIntegrationProvider' | 'cloudStorageConnection' | 'cloudEventBridge' | 'cloudSecretReference' | 'enterpriseApiGateway' | 'apiGatewayRoute' | 'apiGatewayPolicy' | 'apiGatewayConsumer' | 'connectivityWebhookEndpoint' | 'connectivityWebhookDelivery' | 'connectivityWebhookSignature' | 'connectivityWebhookSubscription' | 'enterpriseConnectorSdk' | 'connectorSdkPackage' | 'connectorSdkExtensionPoint' | 'connectorSdkVersion' | 'integrationHealthCheck' | 'integrationSyncRun' | 'integrationAlert' | 'integrationUsageMetric' | 'integrationCopilotQuery' | 'integrationRecommendation' | 'integrationRiskSignal' | 'integrationAuditEvent';

export interface ConnectivityEntityDefinition {
  entity: ConnectivityEntity;
  model: string;
  delegate: string;
  route: string;
  group: string;
  event: string;
}

export const CONNECTIVITY_ENTITIES: ConnectivityEntityDefinition[] = [
  { entity: 'globalIntegrationHub', model: 'GlobalIntegrationHub', delegate: 'globalIntegrationHub', route: 'hubs', group: 'Integration Hub', event: 'GLOBAL_INTEGRATION_REGISTERED' },
  { entity: 'globalIntegrationCatalog', model: 'GlobalIntegrationCatalog', delegate: 'globalIntegrationCatalog', route: 'catalog', group: 'Integration Hub', event: 'GLOBAL_INTEGRATION_REGISTERED' },
  { entity: 'globalIntegrationTenantConfig', model: 'GlobalIntegrationTenantConfig', delegate: 'globalIntegrationTenantConfig', route: 'tenant-configs', group: 'Integration Hub', event: 'INTEGRATION_CONNECTION_CREATED' },
  { entity: 'globalIntegrationConnection', model: 'GlobalIntegrationConnection', delegate: 'globalIntegrationConnection', route: 'connections', group: 'Integration Hub', event: 'INTEGRATION_CONNECTION_CREATED' },
  { entity: 'salesforceConnection', model: 'SalesforceConnection', delegate: 'salesforceConnection', route: 'connections', group: 'Salesforce Connector', event: 'INTEGRATION_CONNECTION_CREATED' },
  { entity: 'salesforceObjectMapping', model: 'SalesforceObjectMapping', delegate: 'salesforceObjectMapping', route: 'object-mappings', group: 'Salesforce Connector', event: 'GLOBAL_INTEGRATION_REGISTERED' },
  { entity: 'salesforceSyncJob', model: 'SalesforceSyncJob', delegate: 'salesforceSyncJob', route: 'sync-jobs', group: 'Salesforce Connector', event: 'SALESFORCE_SYNC_STARTED' },
  { entity: 'salesforceEventSubscription', model: 'SalesforceEventSubscription', delegate: 'salesforceEventSubscription', route: 'event-subscriptions', group: 'Salesforce Connector', event: 'GLOBAL_INTEGRATION_REGISTERED' },
  { entity: 'sapConnection', model: 'SapConnection', delegate: 'sapConnection', route: 'connections', group: 'SAP Connector', event: 'INTEGRATION_CONNECTION_CREATED' },
  { entity: 'sapBapiMapping', model: 'SapBapiMapping', delegate: 'sapBapiMapping', route: 'bapi-mappings', group: 'SAP Connector', event: 'GLOBAL_INTEGRATION_REGISTERED' },
  { entity: 'sapIdocSubscription', model: 'SapIdocSubscription', delegate: 'sapIdocSubscription', route: 'idoc-subscriptions', group: 'SAP Connector', event: 'GLOBAL_INTEGRATION_REGISTERED' },
  { entity: 'sapSyncJob', model: 'SapSyncJob', delegate: 'sapSyncJob', route: 'sync-jobs', group: 'SAP Connector', event: 'SAP_SYNC_STARTED' },
  { entity: 'oracleConnection', model: 'OracleConnection', delegate: 'oracleConnection', route: 'connections', group: 'Oracle Connector', event: 'INTEGRATION_CONNECTION_CREATED' },
  { entity: 'oracleObjectMapping', model: 'OracleObjectMapping', delegate: 'oracleObjectMapping', route: 'object-mappings', group: 'Oracle Connector', event: 'GLOBAL_INTEGRATION_REGISTERED' },
  { entity: 'oracleSyncJob', model: 'OracleSyncJob', delegate: 'oracleSyncJob', route: 'sync-jobs', group: 'Oracle Connector', event: 'ORACLE_SYNC_STARTED' },
  { entity: 'oracleEventSubscription', model: 'OracleEventSubscription', delegate: 'oracleEventSubscription', route: 'event-subscriptions', group: 'Oracle Connector', event: 'GLOBAL_INTEGRATION_REGISTERED' },
  { entity: 'microsoftEcosystemConnection', model: 'MicrosoftEcosystemConnection', delegate: 'microsoftEcosystemConnection', route: 'connections', group: 'Microsoft Ecosystem Connector', event: 'INTEGRATION_CONNECTION_CREATED' },
  { entity: 'microsoftGraphSubscription', model: 'MicrosoftGraphSubscription', delegate: 'microsoftGraphSubscription', route: 'graph-subscriptions', group: 'Microsoft Ecosystem Connector', event: 'MICROSOFT_GRAPH_SUBSCRIBED' },
  { entity: 'microsoftTeamsIntegration', model: 'MicrosoftTeamsIntegration', delegate: 'microsoftTeamsIntegration', route: 'teams-integrations', group: 'Microsoft Ecosystem Connector', event: 'GLOBAL_INTEGRATION_REGISTERED' },
  { entity: 'microsoftDynamicsMapping', model: 'MicrosoftDynamicsMapping', delegate: 'microsoftDynamicsMapping', route: 'dynamics-mappings', group: 'Microsoft Ecosystem Connector', event: 'GLOBAL_INTEGRATION_REGISTERED' },
  { entity: 'googleWorkspaceConnection', model: 'GoogleWorkspaceConnection', delegate: 'googleWorkspaceConnection', route: 'connections', group: 'Google Workspace Connector', event: 'INTEGRATION_CONNECTION_CREATED' },
  { entity: 'googleDirectorySync', model: 'GoogleDirectorySync', delegate: 'googleDirectorySync', route: 'directory-syncs', group: 'Google Workspace Connector', event: 'GOOGLE_WORKSPACE_SYNC_STARTED' },
  { entity: 'googleCalendarIntegration', model: 'GoogleCalendarIntegration', delegate: 'googleCalendarIntegration', route: 'calendar-integrations', group: 'Google Workspace Connector', event: 'GLOBAL_INTEGRATION_REGISTERED' },
  { entity: 'googleDriveMapping', model: 'GoogleDriveMapping', delegate: 'googleDriveMapping', route: 'drive-mappings', group: 'Google Workspace Connector', event: 'GLOBAL_INTEGRATION_REGISTERED' },
  { entity: 'communicationIntegrationChannel', model: 'CommunicationIntegrationChannel', delegate: 'communicationIntegrationChannel', route: 'channels', group: 'Communication Integrations', event: 'COMMUNICATION_ROUTE_CREATED' },
  { entity: 'communicationMessageRoute', model: 'CommunicationMessageRoute', delegate: 'communicationMessageRoute', route: 'message-routes', group: 'Communication Integrations', event: 'COMMUNICATION_ROUTE_CREATED' },
  { entity: 'communicationProviderCredential', model: 'CommunicationProviderCredential', delegate: 'communicationProviderCredential', route: 'provider-credentials', group: 'Communication Integrations', event: 'INTEGRATION_CONNECTION_CREATED' },
  { entity: 'communicationDeliveryLog', model: 'CommunicationDeliveryLog', delegate: 'communicationDeliveryLog', route: 'delivery-logs', group: 'Communication Integrations', event: 'INTEGRATION_USAGE_RECORDED' },
  { entity: 'paymentIntegrationProvider', model: 'PaymentIntegrationProvider', delegate: 'paymentIntegrationProvider', route: 'providers', group: 'Payment Integrations', event: 'PAYMENT_PROVIDER_CONNECTED' },
  { entity: 'paymentIntegrationAccount', model: 'PaymentIntegrationAccount', delegate: 'paymentIntegrationAccount', route: 'accounts', group: 'Payment Integrations', event: 'PAYMENT_PROVIDER_CONNECTED' },
  { entity: 'paymentIntegrationTransaction', model: 'PaymentIntegrationTransaction', delegate: 'paymentIntegrationTransaction', route: 'transactions', group: 'Payment Integrations', event: 'INTEGRATION_USAGE_RECORDED' },
  { entity: 'paymentReconciliationJob', model: 'PaymentReconciliationJob', delegate: 'paymentReconciliationJob', route: 'reconciliation-jobs', group: 'Payment Integrations', event: 'PAYMENT_RECONCILIATION_COMPLETED' },
  { entity: 'cloudIntegrationProvider', model: 'CloudIntegrationProvider', delegate: 'cloudIntegrationProvider', route: 'providers', group: 'Cloud Integrations', event: 'CLOUD_INTEGRATION_CONNECTED' },
  { entity: 'cloudStorageConnection', model: 'CloudStorageConnection', delegate: 'cloudStorageConnection', route: 'storage-connections', group: 'Cloud Integrations', event: 'CLOUD_INTEGRATION_CONNECTED' },
  { entity: 'cloudEventBridge', model: 'CloudEventBridge', delegate: 'cloudEventBridge', route: 'event-bridges', group: 'Cloud Integrations', event: 'CLOUD_INTEGRATION_CONNECTED' },
  { entity: 'cloudSecretReference', model: 'CloudSecretReference', delegate: 'cloudSecretReference', route: 'secret-references', group: 'Cloud Integrations', event: 'CLOUD_INTEGRATION_CONNECTED' },
  { entity: 'enterpriseApiGateway', model: 'EnterpriseApiGateway', delegate: 'enterpriseApiGateway', route: 'gateways', group: 'API Gateway', event: 'API_GATEWAY_ROUTE_CREATED' },
  { entity: 'apiGatewayRoute', model: 'ApiGatewayRoute', delegate: 'apiGatewayRoute', route: 'routes', group: 'API Gateway', event: 'API_GATEWAY_ROUTE_CREATED' },
  { entity: 'apiGatewayPolicy', model: 'ApiGatewayPolicy', delegate: 'apiGatewayPolicy', route: 'policies', group: 'API Gateway', event: 'API_GATEWAY_POLICY_UPDATED' },
  { entity: 'apiGatewayConsumer', model: 'ApiGatewayConsumer', delegate: 'apiGatewayConsumer', route: 'consumers', group: 'API Gateway', event: 'API_GATEWAY_ROUTE_CREATED' },
  { entity: 'connectivityWebhookEndpoint', model: 'ConnectivityWebhookEndpoint', delegate: 'connectivityWebhookEndpoint', route: 'endpoints', group: 'Webhook Platform', event: 'WEBHOOK_ENDPOINT_CREATED' },
  { entity: 'connectivityWebhookDelivery', model: 'ConnectivityWebhookDelivery', delegate: 'connectivityWebhookDelivery', route: 'deliveries', group: 'Webhook Platform', event: 'WEBHOOK_DELIVERY_SUCCEEDED' },
  { entity: 'connectivityWebhookSignature', model: 'ConnectivityWebhookSignature', delegate: 'connectivityWebhookSignature', route: 'signatures', group: 'Webhook Platform', event: 'WEBHOOK_ENDPOINT_CREATED' },
  { entity: 'connectivityWebhookSubscription', model: 'ConnectivityWebhookSubscription', delegate: 'connectivityWebhookSubscription', route: 'subscriptions', group: 'Webhook Platform', event: 'WEBHOOK_ENDPOINT_CREATED' },
  { entity: 'enterpriseConnectorSdk', model: 'EnterpriseConnectorSdk', delegate: 'enterpriseConnectorSdk', route: 'sdks', group: 'Enterprise Connector SDK', event: 'CONNECTOR_SDK_PUBLISHED' },
  { entity: 'connectorSdkPackage', model: 'ConnectorSdkPackage', delegate: 'connectorSdkPackage', route: 'packages', group: 'Enterprise Connector SDK', event: 'CONNECTOR_SDK_PUBLISHED' },
  { entity: 'connectorSdkExtensionPoint', model: 'ConnectorSdkExtensionPoint', delegate: 'connectorSdkExtensionPoint', route: 'extension-points', group: 'Enterprise Connector SDK', event: 'CONNECTOR_EXTENSION_REGISTERED' },
  { entity: 'connectorSdkVersion', model: 'ConnectorSdkVersion', delegate: 'connectorSdkVersion', route: 'versions', group: 'Enterprise Connector SDK', event: 'CONNECTOR_SDK_PUBLISHED' },
  { entity: 'integrationHealthCheck', model: 'IntegrationHealthCheck', delegate: 'integrationHealthCheck', route: 'health-checks', group: 'Integration Monitoring', event: 'INTEGRATION_HEALTH_CHECK_RECORDED' },
  { entity: 'integrationSyncRun', model: 'IntegrationSyncRun', delegate: 'integrationSyncRun', route: 'sync-runs', group: 'Integration Monitoring', event: 'INTEGRATION_SYNC_COMPLETED' },
  { entity: 'integrationAlert', model: 'IntegrationAlert', delegate: 'integrationAlert', route: 'alerts', group: 'Integration Monitoring', event: 'INTEGRATION_ALERT_CREATED' },
  { entity: 'integrationUsageMetric', model: 'IntegrationUsageMetric', delegate: 'integrationUsageMetric', route: 'usage-metrics', group: 'Integration Monitoring', event: 'INTEGRATION_USAGE_RECORDED' },
  { entity: 'integrationCopilotQuery', model: 'IntegrationCopilotQuery', delegate: 'integrationCopilotQuery', route: 'queries', group: 'AI Integration Copilot', event: 'INTEGRATION_COPILOT_QUERIED' },
  { entity: 'integrationRecommendation', model: 'IntegrationRecommendation', delegate: 'integrationRecommendation', route: 'recommendations', group: 'AI Integration Copilot', event: 'INTEGRATION_RECOMMENDATION_CREATED' },
  { entity: 'integrationRiskSignal', model: 'IntegrationRiskSignal', delegate: 'integrationRiskSignal', route: 'risk-signals', group: 'AI Integration Copilot', event: 'INTEGRATION_RISK_DETECTED' },
  { entity: 'integrationAuditEvent', model: 'IntegrationAuditEvent', delegate: 'integrationAuditEvent', route: 'audit-events', group: 'AI Integration Copilot', event: 'INTEGRATION_AUDIT_RECORDED' },
];

export const CONNECTIVITY_GROUPS = {
  'Integration Hub': { apiGroup: '/v1/integration-hub', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'Integration Hub') },
  'Salesforce Connector': { apiGroup: '/v1/connectors/salesforce', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'Salesforce Connector') },
  'SAP Connector': { apiGroup: '/v1/connectors/sap', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'SAP Connector') },
  'Oracle Connector': { apiGroup: '/v1/connectors/oracle', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'Oracle Connector') },
  'Microsoft Ecosystem Connector': { apiGroup: '/v1/connectors/microsoft', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'Microsoft Ecosystem Connector') },
  'Google Workspace Connector': { apiGroup: '/v1/connectors/google-workspace', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'Google Workspace Connector') },
  'Communication Integrations': { apiGroup: '/v1/communication-integrations', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'Communication Integrations') },
  'Payment Integrations': { apiGroup: '/v1/payment-integrations', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'Payment Integrations') },
  'Cloud Integrations': { apiGroup: '/v1/cloud-integrations', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'Cloud Integrations') },
  'API Gateway': { apiGroup: '/v1/api-gateway', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'API Gateway') },
  'Webhook Platform': { apiGroup: '/v1/webhook-platform', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'Webhook Platform') },
  'Enterprise Connector SDK': { apiGroup: '/v1/connector-sdk', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'Enterprise Connector SDK') },
  'Integration Monitoring': { apiGroup: '/v1/integration-monitoring', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'Integration Monitoring') },
  'AI Integration Copilot': { apiGroup: '/v1/ai-integration-copilot', entities: CONNECTIVITY_ENTITIES.filter((entity) => entity.group === 'AI Integration Copilot') },
} as const;

export function getConnectivityEntity(entity: ConnectivityEntity) {
  const definition = CONNECTIVITY_ENTITIES.find((item) => item.entity === entity);
  if (!definition) throw new Error('Unknown connectivity entity: ' + entity);
  return definition;
}
