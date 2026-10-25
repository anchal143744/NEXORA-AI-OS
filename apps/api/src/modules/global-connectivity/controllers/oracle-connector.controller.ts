import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateOracleConnectionDto, CreateOracleObjectMappingDto, CreateOracleSyncJobDto, CreateOracleEventSubscriptionDto } from '../dto/global-connectivity.dto';
import { GlobalConnectivityAnalyticsService } from '../global-connectivity-analytics.service';
import { GlobalConnectivityCommandService } from '../global-connectivity-command.service';
import { GlobalConnectivityQueryService } from '../global-connectivity-query.service';

@ApiTags('Oracle Connector')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'connectors/oracle', version: '1' })
export class OracleConnectorController {
  constructor(private readonly commands: GlobalConnectivityCommandService, private readonly queries: GlobalConnectivityQueryService, private readonly analytics: GlobalConnectivityAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Oracle Connector');
  }

  @Get('connections') listOracleConnection(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('oracleConnection', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('connections') createOracleConnection(@Body() dto: CreateOracleConnectionDto) {
    return this.commands.create('oracleConnection', dto);
  }

  @Get('object-mappings') listOracleObjectMapping(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('oracleObjectMapping', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('object-mappings') createOracleObjectMapping(@Body() dto: CreateOracleObjectMappingDto) {
    return this.commands.create('oracleObjectMapping', dto);
  }

  @Get('sync-jobs') listOracleSyncJob(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('oracleSyncJob', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('sync-jobs') createOracleSyncJob(@Body() dto: CreateOracleSyncJobDto) {
    return this.commands.create('oracleSyncJob', dto);
  }

  @Get('event-subscriptions') listOracleEventSubscription(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('oracleEventSubscription', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('event-subscriptions') createOracleEventSubscription(@Body() dto: CreateOracleEventSubscriptionDto) {
    return this.commands.create('oracleEventSubscription', dto);
  }
}
