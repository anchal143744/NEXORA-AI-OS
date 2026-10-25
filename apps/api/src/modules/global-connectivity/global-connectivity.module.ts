import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { IntegrationHubController } from './controllers/integration-hub.controller';
import { SalesforceConnectorController } from './controllers/salesforce-connector.controller';
import { SapConnectorController } from './controllers/sap-connector.controller';
import { OracleConnectorController } from './controllers/oracle-connector.controller';
import { MicrosoftEcosystemConnectorController } from './controllers/microsoft-ecosystem-connector.controller';
import { GoogleWorkspaceConnectorController } from './controllers/google-workspace-connector.controller';
import { CommunicationIntegrationsController } from './controllers/communication-integrations.controller';
import { PaymentIntegrationsController } from './controllers/payment-integrations.controller';
import { CloudIntegrationsController } from './controllers/cloud-integrations.controller';
import { ApiGatewayController } from './controllers/api-gateway.controller';
import { WebhookPlatformController } from './controllers/webhook-platform.controller';
import { EnterpriseConnectorSdkController } from './controllers/enterprise-connector-sdk.controller';
import { IntegrationMonitoringController } from './controllers/integration-monitoring.controller';
import { AiIntegrationCopilotController } from './controllers/ai-integration-copilot.controller';
import { GlobalConnectivityAnalyticsService } from './global-connectivity-analytics.service';
import { GlobalConnectivityCommandService } from './global-connectivity-command.service';
import { GlobalConnectivityCqrsService } from './global-connectivity-cqrs.service';
import { GlobalConnectivityQueryService } from './global-connectivity-query.service';
import { GlobalConnectivityReadinessService } from './global-connectivity-readiness.service';
import { GlobalConnectivityService } from './global-connectivity.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [IntegrationHubController, SalesforceConnectorController, SapConnectorController, OracleConnectorController, MicrosoftEcosystemConnectorController, GoogleWorkspaceConnectorController, CommunicationIntegrationsController, PaymentIntegrationsController, CloudIntegrationsController, ApiGatewayController, WebhookPlatformController, EnterpriseConnectorSdkController, IntegrationMonitoringController, AiIntegrationCopilotController],
  providers: [GlobalConnectivityService, GlobalConnectivityCommandService, GlobalConnectivityQueryService, GlobalConnectivityCqrsService, GlobalConnectivityAnalyticsService, GlobalConnectivityReadinessService],
  exports: [GlobalConnectivityService, GlobalConnectivityCommandService, GlobalConnectivityQueryService, GlobalConnectivityCqrsService, GlobalConnectivityAnalyticsService, GlobalConnectivityReadinessService],
})
export class GlobalConnectivityModule {}
