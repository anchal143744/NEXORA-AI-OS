import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recordKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() provider?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() providerAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() connectionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() connectorId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() catalogId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() routeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() webhookEndpointId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() gatewayId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sdkPackageId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() syncRunId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() healthCheckId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() credentialRefId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() secretReferenceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() externalTenantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() externalUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() externalObjectType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() externalObjectId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedEntityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lifecycleStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() connectionStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() authStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() syncStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deliveryStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() healthStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() environment?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() countryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiVersion?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() protocol?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() baseUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endpointPath?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() httpMethod?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() authType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() oauthClientId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() oauthTenantId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() oidcIssuer?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() oidcAudience?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() scopes?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() permissions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() rateLimitPolicy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() retryPolicy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() mappingConfig?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() transformConfig?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() routingRules?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() subscriptionConfig?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() headers?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() requestTemplate?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() responseTemplate?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metrics?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() lastValidatedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastSyncedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastDeliveredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tokenExpiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nextRunAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() disabledAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() version?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() sequence?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() timeoutMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() retryCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() failureCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() successCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() requestCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() errorCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() latencyMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() throughputPerMinute?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() uptimePercent?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() successRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() riskScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() costEstimate?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isEnabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isManaged?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requiresApproval?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() createdByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedByUserId?: string;
}

export class CreateGlobalIntegrationHubDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() globalIntegrationHubCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() globalIntegrationHubOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() globalIntegrationHubAttributes?: Record<string, unknown>;
}

export class CreateGlobalIntegrationCatalogDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() globalIntegrationCatalogCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() globalIntegrationCatalogOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() globalIntegrationCatalogAttributes?: Record<string, unknown>;
}

export class CreateGlobalIntegrationTenantConfigDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() globalIntegrationTenantConfigCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() globalIntegrationTenantConfigOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() globalIntegrationTenantConfigAttributes?: Record<string, unknown>;
}

export class CreateGlobalIntegrationConnectionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() globalIntegrationConnectionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() globalIntegrationConnectionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() globalIntegrationConnectionAttributes?: Record<string, unknown>;
}

export class CreateSalesforceConnectionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() salesforceConnectionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() salesforceConnectionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() salesforceConnectionAttributes?: Record<string, unknown>;
}

export class CreateSalesforceObjectMappingDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() salesforceObjectMappingCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() salesforceObjectMappingOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() salesforceObjectMappingAttributes?: Record<string, unknown>;
}

export class CreateSalesforceSyncJobDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() salesforceSyncJobCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() salesforceSyncJobOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() salesforceSyncJobAttributes?: Record<string, unknown>;
}

export class CreateSalesforceEventSubscriptionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() salesforceEventSubscriptionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() salesforceEventSubscriptionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() salesforceEventSubscriptionAttributes?: Record<string, unknown>;
}

export class CreateSapConnectionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() sapConnectionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sapConnectionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() sapConnectionAttributes?: Record<string, unknown>;
}

export class CreateSapBapiMappingDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() sapBapiMappingCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sapBapiMappingOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() sapBapiMappingAttributes?: Record<string, unknown>;
}

export class CreateSapIdocSubscriptionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() sapIdocSubscriptionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sapIdocSubscriptionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() sapIdocSubscriptionAttributes?: Record<string, unknown>;
}

export class CreateSapSyncJobDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() sapSyncJobCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sapSyncJobOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() sapSyncJobAttributes?: Record<string, unknown>;
}

export class CreateOracleConnectionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() oracleConnectionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() oracleConnectionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() oracleConnectionAttributes?: Record<string, unknown>;
}

export class CreateOracleObjectMappingDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() oracleObjectMappingCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() oracleObjectMappingOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() oracleObjectMappingAttributes?: Record<string, unknown>;
}

export class CreateOracleSyncJobDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() oracleSyncJobCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() oracleSyncJobOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() oracleSyncJobAttributes?: Record<string, unknown>;
}

export class CreateOracleEventSubscriptionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() oracleEventSubscriptionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() oracleEventSubscriptionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() oracleEventSubscriptionAttributes?: Record<string, unknown>;
}

export class CreateMicrosoftEcosystemConnectionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() microsoftEcosystemConnectionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() microsoftEcosystemConnectionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() microsoftEcosystemConnectionAttributes?: Record<string, unknown>;
}

export class CreateMicrosoftGraphSubscriptionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() microsoftGraphSubscriptionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() microsoftGraphSubscriptionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() microsoftGraphSubscriptionAttributes?: Record<string, unknown>;
}

export class CreateMicrosoftTeamsIntegrationDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() microsoftTeamsIntegrationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() microsoftTeamsIntegrationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() microsoftTeamsIntegrationAttributes?: Record<string, unknown>;
}

export class CreateMicrosoftDynamicsMappingDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() microsoftDynamicsMappingCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() microsoftDynamicsMappingOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() microsoftDynamicsMappingAttributes?: Record<string, unknown>;
}

export class CreateGoogleWorkspaceConnectionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() googleWorkspaceConnectionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() googleWorkspaceConnectionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() googleWorkspaceConnectionAttributes?: Record<string, unknown>;
}

export class CreateGoogleDirectorySyncDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() googleDirectorySyncCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() googleDirectorySyncOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() googleDirectorySyncAttributes?: Record<string, unknown>;
}

export class CreateGoogleCalendarIntegrationDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() googleCalendarIntegrationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() googleCalendarIntegrationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() googleCalendarIntegrationAttributes?: Record<string, unknown>;
}

export class CreateGoogleDriveMappingDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() googleDriveMappingCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() googleDriveMappingOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() googleDriveMappingAttributes?: Record<string, unknown>;
}

export class CreateCommunicationIntegrationChannelDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() communicationIntegrationChannelCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() communicationIntegrationChannelOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() communicationIntegrationChannelAttributes?: Record<string, unknown>;
}

export class CreateCommunicationMessageRouteDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() communicationMessageRouteCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() communicationMessageRouteOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() communicationMessageRouteAttributes?: Record<string, unknown>;
}

export class CreateCommunicationProviderCredentialDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() communicationProviderCredentialCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() communicationProviderCredentialOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() communicationProviderCredentialAttributes?: Record<string, unknown>;
}

export class CreateCommunicationDeliveryLogDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() communicationDeliveryLogCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() communicationDeliveryLogOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() communicationDeliveryLogAttributes?: Record<string, unknown>;
}

export class CreatePaymentIntegrationProviderDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() paymentIntegrationProviderCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paymentIntegrationProviderOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() paymentIntegrationProviderAttributes?: Record<string, unknown>;
}

export class CreatePaymentIntegrationAccountDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() paymentIntegrationAccountCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paymentIntegrationAccountOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() paymentIntegrationAccountAttributes?: Record<string, unknown>;
}

export class CreatePaymentIntegrationTransactionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() paymentIntegrationTransactionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paymentIntegrationTransactionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() paymentIntegrationTransactionAttributes?: Record<string, unknown>;
}

export class CreatePaymentReconciliationJobDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() paymentReconciliationJobCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paymentReconciliationJobOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() paymentReconciliationJobAttributes?: Record<string, unknown>;
}

export class CreateCloudIntegrationProviderDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() cloudIntegrationProviderCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cloudIntegrationProviderOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() cloudIntegrationProviderAttributes?: Record<string, unknown>;
}

export class CreateCloudStorageConnectionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() cloudStorageConnectionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cloudStorageConnectionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() cloudStorageConnectionAttributes?: Record<string, unknown>;
}

export class CreateCloudEventBridgeDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() cloudEventBridgeCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cloudEventBridgeOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() cloudEventBridgeAttributes?: Record<string, unknown>;
}

export class CreateCloudSecretReferenceDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() cloudSecretReferenceCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cloudSecretReferenceOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() cloudSecretReferenceAttributes?: Record<string, unknown>;
}

export class CreateEnterpriseApiGatewayDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() enterpriseApiGatewayCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enterpriseApiGatewayOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() enterpriseApiGatewayAttributes?: Record<string, unknown>;
}

export class CreateApiGatewayRouteDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() apiGatewayRouteCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiGatewayRouteOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() apiGatewayRouteAttributes?: Record<string, unknown>;
}

export class CreateApiGatewayPolicyDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() apiGatewayPolicyCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiGatewayPolicyOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() apiGatewayPolicyAttributes?: Record<string, unknown>;
}

export class CreateApiGatewayConsumerDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() apiGatewayConsumerCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiGatewayConsumerOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() apiGatewayConsumerAttributes?: Record<string, unknown>;
}

export class CreateConnectivityWebhookEndpointDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() connectivityWebhookEndpointCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() connectivityWebhookEndpointOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() connectivityWebhookEndpointAttributes?: Record<string, unknown>;
}

export class CreateConnectivityWebhookDeliveryDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() connectivityWebhookDeliveryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() connectivityWebhookDeliveryOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() connectivityWebhookDeliveryAttributes?: Record<string, unknown>;
}

export class CreateConnectivityWebhookSignatureDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() connectivityWebhookSignatureCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() connectivityWebhookSignatureOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() connectivityWebhookSignatureAttributes?: Record<string, unknown>;
}

export class CreateConnectivityWebhookSubscriptionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() connectivityWebhookSubscriptionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() connectivityWebhookSubscriptionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() connectivityWebhookSubscriptionAttributes?: Record<string, unknown>;
}

export class CreateEnterpriseConnectorSdkDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() enterpriseConnectorSdkCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enterpriseConnectorSdkOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() enterpriseConnectorSdkAttributes?: Record<string, unknown>;
}

export class CreateConnectorSdkPackageDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() connectorSdkPackageCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() connectorSdkPackageOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() connectorSdkPackageAttributes?: Record<string, unknown>;
}

export class CreateConnectorSdkExtensionPointDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() connectorSdkExtensionPointCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() connectorSdkExtensionPointOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() connectorSdkExtensionPointAttributes?: Record<string, unknown>;
}

export class CreateConnectorSdkVersionDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() connectorSdkVersionCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() connectorSdkVersionOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() connectorSdkVersionAttributes?: Record<string, unknown>;
}

export class CreateIntegrationHealthCheckDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() integrationHealthCheckCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() integrationHealthCheckOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() integrationHealthCheckAttributes?: Record<string, unknown>;
}

export class CreateIntegrationSyncRunDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() integrationSyncRunCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() integrationSyncRunOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() integrationSyncRunAttributes?: Record<string, unknown>;
}

export class CreateIntegrationAlertDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() integrationAlertCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() integrationAlertOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() integrationAlertAttributes?: Record<string, unknown>;
}

export class CreateIntegrationUsageMetricDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() integrationUsageMetricCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() integrationUsageMetricOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() integrationUsageMetricAttributes?: Record<string, unknown>;
}

export class CreateIntegrationCopilotQueryDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() integrationCopilotQueryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() integrationCopilotQueryOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() integrationCopilotQueryAttributes?: Record<string, unknown>;
}

export class CreateIntegrationRecommendationDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() integrationRecommendationCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() integrationRecommendationOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() integrationRecommendationAttributes?: Record<string, unknown>;
}

export class CreateIntegrationRiskSignalDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() integrationRiskSignalCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() integrationRiskSignalOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() integrationRiskSignalAttributes?: Record<string, unknown>;
}

export class CreateIntegrationAuditEventDto extends CreateConnectivityRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() integrationAuditEventCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() integrationAuditEventOwnerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() integrationAuditEventAttributes?: Record<string, unknown>;
}
