import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateEnterpriseConnectorSdkDto, CreateConnectorSdkPackageDto, CreateConnectorSdkExtensionPointDto, CreateConnectorSdkVersionDto } from '../dto/global-connectivity.dto';
import { GlobalConnectivityAnalyticsService } from '../global-connectivity-analytics.service';
import { GlobalConnectivityCommandService } from '../global-connectivity-command.service';
import { GlobalConnectivityQueryService } from '../global-connectivity-query.service';

@ApiTags('Enterprise Connector SDK')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'connector-sdk', version: '1' })
export class EnterpriseConnectorSdkController {
  constructor(private readonly commands: GlobalConnectivityCommandService, private readonly queries: GlobalConnectivityQueryService, private readonly analytics: GlobalConnectivityAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Enterprise Connector SDK');
  }

  @Get('sdks') listEnterpriseConnectorSdk(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('enterpriseConnectorSdk', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('sdks') createEnterpriseConnectorSdk(@Body() dto: CreateEnterpriseConnectorSdkDto) {
    return this.commands.create('enterpriseConnectorSdk', dto);
  }

  @Get('packages') listConnectorSdkPackage(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('connectorSdkPackage', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('packages') createConnectorSdkPackage(@Body() dto: CreateConnectorSdkPackageDto) {
    return this.commands.create('connectorSdkPackage', dto);
  }

  @Get('extension-points') listConnectorSdkExtensionPoint(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('connectorSdkExtensionPoint', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('extension-points') createConnectorSdkExtensionPoint(@Body() dto: CreateConnectorSdkExtensionPointDto) {
    return this.commands.create('connectorSdkExtensionPoint', dto);
  }

  @Get('versions') listConnectorSdkVersion(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('connectorSdkVersion', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('versions') createConnectorSdkVersion(@Body() dto: CreateConnectorSdkVersionDto) {
    return this.commands.create('connectorSdkVersion', dto);
  }
}
