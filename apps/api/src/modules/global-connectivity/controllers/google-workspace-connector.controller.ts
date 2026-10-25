import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateGoogleWorkspaceConnectionDto, CreateGoogleDirectorySyncDto, CreateGoogleCalendarIntegrationDto, CreateGoogleDriveMappingDto } from '../dto/global-connectivity.dto';
import { GlobalConnectivityAnalyticsService } from '../global-connectivity-analytics.service';
import { GlobalConnectivityCommandService } from '../global-connectivity-command.service';
import { GlobalConnectivityQueryService } from '../global-connectivity-query.service';

@ApiTags('Google Workspace Connector')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'connectors/google-workspace', version: '1' })
export class GoogleWorkspaceConnectorController {
  constructor(private readonly commands: GlobalConnectivityCommandService, private readonly queries: GlobalConnectivityQueryService, private readonly analytics: GlobalConnectivityAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Google Workspace Connector');
  }

  @Get('connections') listGoogleWorkspaceConnection(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('googleWorkspaceConnection', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('connections') createGoogleWorkspaceConnection(@Body() dto: CreateGoogleWorkspaceConnectionDto) {
    return this.commands.create('googleWorkspaceConnection', dto);
  }

  @Get('directory-syncs') listGoogleDirectorySync(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('googleDirectorySync', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('directory-syncs') createGoogleDirectorySync(@Body() dto: CreateGoogleDirectorySyncDto) {
    return this.commands.create('googleDirectorySync', dto);
  }

  @Get('calendar-integrations') listGoogleCalendarIntegration(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('googleCalendarIntegration', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('calendar-integrations') createGoogleCalendarIntegration(@Body() dto: CreateGoogleCalendarIntegrationDto) {
    return this.commands.create('googleCalendarIntegration', dto);
  }

  @Get('drive-mappings') listGoogleDriveMapping(@Query('status') status?: string, @Query('provider') provider?: string, @Query('connectionStatus') connectionStatus?: string, @Query('authStatus') authStatus?: string, @Query('syncStatus') syncStatus?: string, @Query('deliveryStatus') deliveryStatus?: string, @Query('healthStatus') healthStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('environment') environment?: string, @Query('apiVersion') apiVersion?: string, @Query('connectionId') connectionId?: string, @Query('gatewayId') gatewayId?: string, @Query('webhookEndpointId') webhookEndpointId?: string) {
    return this.queries.list('googleDriveMapping', { status, provider, connectionStatus, authStatus, syncStatus, deliveryStatus, healthStatus, riskLevel, environment, apiVersion, connectionId, gatewayId, webhookEndpointId });
  }

  @Post('drive-mappings') createGoogleDriveMapping(@Body() dto: CreateGoogleDriveMappingDto) {
    return this.commands.create('googleDriveMapping', dto);
  }
}
