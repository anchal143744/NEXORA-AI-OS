import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateGlobalIntegrationHubDto, CreateGlobalIntegrationCatalogDto, CreateGlobalIntegrationTenantConfigDto, CreateGlobalIntegrationConnectionDto } from '../dto/global-connectivity.dto';
import { GlobalConnectivityAnalyticsService } from '../global-connectivity-analytics.service';
import { GlobalConnectivityCommandService } from '../global-connectivity-command.service';
import { GlobalConnectivityQueryService } from '../global-connectivity-query.service';

@ApiTags('Integration Hub')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'integration-hub', version: '1' })
export class IntegrationHubController {
  constructor(private readonly commands: GlobalConnectivityCommandService, private readonly queries: GlobalConnectivityQueryService, private readonly analytics: GlobalConnectivityAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Integration Hub');
  }

  @Get('hubs') listGlobalIntegrationHub(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('globalIntegrationHub', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('hubs') createGlobalIntegrationHub(@Body() dto: CreateGlobalIntegrationHubDto) {
    return this.commands.create('globalIntegrationHub', dto);
  }

  @Get('catalog') listGlobalIntegrationCatalog(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('globalIntegrationCatalog', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('catalog') createGlobalIntegrationCatalog(@Body() dto: CreateGlobalIntegrationCatalogDto) {
    return this.commands.create('globalIntegrationCatalog', dto);
  }

  @Get('tenant-configs') listGlobalIntegrationTenantConfig(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('globalIntegrationTenantConfig', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('tenant-configs') createGlobalIntegrationTenantConfig(@Body() dto: CreateGlobalIntegrationTenantConfigDto) {
    return this.commands.create('globalIntegrationTenantConfig', dto);
  }

  @Get('connections') listGlobalIntegrationConnection(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('globalIntegrationConnection', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('connections') createGlobalIntegrationConnection(@Body() dto: CreateGlobalIntegrationConnectionDto) {
    return this.commands.create('globalIntegrationConnection', dto);
  }
}
