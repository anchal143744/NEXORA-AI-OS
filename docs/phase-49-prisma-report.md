# Phase 49 Prisma Report

## Models Added

- GlobalIntegrationHub mapped to global_integration_hubs
- GlobalIntegrationCatalog mapped to global_integration_catalogs
- GlobalIntegrationTenantConfig mapped to global_integration_tenant_configs
- GlobalIntegrationConnection mapped to global_integration_connections
- SalesforceConnection mapped to salesforce_connections
- SalesforceObjectMapping mapped to salesforce_object_mappings
- SalesforceSyncJob mapped to salesforce_sync_jobs
- SalesforceEventSubscription mapped to salesforce_event_subscriptions
- SapConnection mapped to sap_connections
- SapBapiMapping mapped to sap_bapi_mappings
- SapIdocSubscription mapped to sap_idoc_subscriptions
- SapSyncJob mapped to sap_sync_jobs
- OracleConnection mapped to oracle_connections
- OracleObjectMapping mapped to oracle_object_mappings
- OracleSyncJob mapped to oracle_sync_jobs
- OracleEventSubscription mapped to oracle_event_subscriptions
- MicrosoftEcosystemConnection mapped to microsoft_ecosystem_connections
- MicrosoftGraphSubscription mapped to microsoft_graph_subscriptions
- MicrosoftTeamsIntegration mapped to microsoft_teams_integrations
- MicrosoftDynamicsMapping mapped to microsoft_dynamics_mappings
- GoogleWorkspaceConnection mapped to google_workspace_connections
- GoogleDirectorySync mapped to google_directory_syncs
- GoogleCalendarIntegration mapped to google_calendar_integrations
- GoogleDriveMapping mapped to google_drive_mappings
- CommunicationIntegrationChannel mapped to communication_integration_channels
- CommunicationMessageRoute mapped to communication_message_routes
- CommunicationProviderCredential mapped to communication_provider_credentials
- CommunicationDeliveryLog mapped to communication_delivery_logs
- PaymentIntegrationProvider mapped to payment_integration_providers
- PaymentIntegrationAccount mapped to payment_integration_accounts
- PaymentIntegrationTransaction mapped to payment_integration_transactions
- PaymentReconciliationJob mapped to payment_reconciliation_jobs
- CloudIntegrationProvider mapped to cloud_integration_providers
- CloudStorageConnection mapped to cloud_storage_connections
- CloudEventBridge mapped to cloud_event_bridges
- CloudSecretReference mapped to cloud_secret_references
- EnterpriseApiGateway mapped to enterprise_api_gateways
- ApiGatewayRoute mapped to api_gateway_routes
- ApiGatewayPolicy mapped to api_gateway_policys
- ApiGatewayConsumer mapped to api_gateway_consumers
- ConnectivityWebhookEndpoint mapped to connectivity_webhook_endpoints
- ConnectivityWebhookDelivery mapped to connectivity_webhook_deliverys
- ConnectivityWebhookSignature mapped to connectivity_webhook_signatures
- ConnectivityWebhookSubscription mapped to connectivity_webhook_subscriptions
- EnterpriseConnectorSdk mapped to enterprise_connector_sdks
- ConnectorSdkPackage mapped to connector_sdk_packages
- ConnectorSdkExtensionPoint mapped to connector_sdk_extension_points
- ConnectorSdkVersion mapped to connector_sdk_versions
- IntegrationHealthCheck mapped to integration_health_checks
- IntegrationSyncRun mapped to integration_sync_runs
- IntegrationAlert mapped to integration_alerts
- IntegrationUsageMetric mapped to integration_usage_metrics
- IntegrationCopilotQuery mapped to integration_copilot_querys
- IntegrationRecommendation mapped to integration_recommendations
- IntegrationRiskSignal mapped to integration_risk_signals
- IntegrationAuditEvent mapped to integration_audit_events

## Model Count

- Previous total: 726.
- Added in Phase 49: 56.
- New total: 782.

## Index Strategy

Every model includes tenant/workspace indexes, provider indexes, connection and connector indexes, route/webhook/gateway indexes, sync and health indexes, external object indexes, auth/sync/delivery/health status indexes, risk indexes and soft-delete indexes.
