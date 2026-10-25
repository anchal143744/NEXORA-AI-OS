import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateConnectivityWebhookEndpointDto, CreateConnectivityWebhookDeliveryDto, CreateConnectivityWebhookSignatureDto, CreateConnectivityWebhookSubscriptionDto } from '../dto/global-connectivity.dto';
import { GlobalConnectivityAnalyticsService } from '../global-connectivity-analytics.service';
import { GlobalConnectivityCommandService } from '../global-connectivity-command.service';
import { GlobalConnectivityQueryService } from '../global-connectivity-query.service';

@ApiTags('Webhook Platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'webhook-platform', version: '1' })
export class WebhookPlatformController {
  constructor(private readonly commands: GlobalConnectivityCommandService, private readonly queries: GlobalConnectivityQueryService, private readonly analytics: GlobalConnectivityAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Webhook Platform');
  }

  @Get('endpoints') listConnectivityWebhookEndpoint(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('connectivityWebhookEndpoint', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('endpoints') createConnectivityWebhookEndpoint(@Body() dto: CreateConnectivityWebhookEndpointDto) {
    return this.commands.create('connectivityWebhookEndpoint', dto);
  }

  @Get('deliveries') listConnectivityWebhookDelivery(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('connectivityWebhookDelivery', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('deliveries') createConnectivityWebhookDelivery(@Body() dto: CreateConnectivityWebhookDeliveryDto) {
    return this.commands.create('connectivityWebhookDelivery', dto);
  }

  @Get('signatures') listConnectivityWebhookSignature(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('connectivityWebhookSignature', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('signatures') createConnectivityWebhookSignature(@Body() dto: CreateConnectivityWebhookSignatureDto) {
    return this.commands.create('connectivityWebhookSignature', dto);
  }

  @Get('subscriptions') listConnectivityWebhookSubscription(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('connectivityWebhookSubscription', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('subscriptions') createConnectivityWebhookSubscription(@Body() dto: CreateConnectivityWebhookSubscriptionDto) {
    return this.commands.create('connectivityWebhookSubscription', dto);
  }
}
