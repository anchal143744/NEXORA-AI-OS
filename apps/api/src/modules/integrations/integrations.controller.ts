import { Body, Controller, Get, Headers, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyService } from './api-keys/api-key.service';
import { ConnectionManager } from './connection-manager.service';
import { IntegrationEngine } from './integration-engine.service';
import { IntegrationManager } from './integration-manager.service';
import { CreateApiKeyDto, CreateIntegrationDto, CreateWebhookDto, InboundWebhookDto, RotateSecretDto, SyncRequestDto } from './dto/integration.dto';
import { ExternalEventSubscriptionService } from './event-subscription.service';
import { OAuthService } from './oauth/oauth.service';
import { SyncEngine } from './sync/sync-engine.service';
import { WebhookManager } from './webhooks/webhook-manager.service';
@ApiTags('Integrations') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller({ version: '1' })
export class IntegrationsController { constructor(private readonly engine: IntegrationEngine, private readonly manager: IntegrationManager, private readonly oauth: OAuthService, private readonly webhooks: WebhookManager, private readonly sync: SyncEngine, private readonly apiKeys: ApiKeyService, private readonly subscriptions: ExternalEventSubscriptionService) {}
  @Get('integrations/registry') registry() { return this.engine.registrySnapshot(); }
  @Post('integrations') connect(@Body() dto: CreateIntegrationDto) { return this.engine.connect(dto); }
  @Get('integrations') list() { return this.manager.list(); }
  @Post('integrations/:id/validate') validate(@Param('id') id: string) { return this.manager.validate(id); }
  @Post('integrations/:id/revoke') revoke(@Param('id') id: string) { return this.manager.revoke(id); }
  @Post('integrations/:id/rotate') rotate(@Param('id') id: string, @Body() dto: RotateSecretDto) { return this.manager.rotate(id, { secret: dto.secret }); }
  @Get('oauth/authorize-url') authorizeUrl(@Query() q: any) { return this.oauth.buildAuthorizationUrl({ connectorKey: q.connectorKey, clientId: q.clientId, redirectUri: q.redirectUri, scopes: String(q.scopes ?? '').split(',').filter(Boolean), state: q.state }); }
  @Post('webhooks') createWebhook(@Body() dto: CreateWebhookDto) { return this.webhooks.create(dto); }
  @Get('webhooks') listWebhooks() { return this.webhooks.list(); }
  @Post('webhooks/:id/inbound') inbound(@Param('id') id: string, @Body() dto: InboundWebhookDto, @Headers('x-nexora-signature') signature?: string, @Headers('x-nexora-timestamp') timestamp?: string, @Headers('x-nexora-nonce') nonce?: string) { return this.webhooks.inbound(id, { payload: dto.payload ?? {}, signature, timestamp, nonce }); }
  @Post('sync') startSync(@Body() dto: SyncRequestDto) { return this.sync.start({ integrationId: dto.integrationId, mode: dto.mode, payload: dto.payload }); }
  @Post('api-keys') createApiKey(@Body() dto: CreateApiKeyDto) { return this.apiKeys.create(dto); }
  @Get('api-keys') listApiKeys() { return this.apiKeys.list(); }
  @Post('api-keys/:id/rotate') rotateApiKey(@Param('id') id: string) { return this.apiKeys.rotate(id); }
  @Post('api-keys/:id/revoke') revokeApiKey(@Param('id') id: string) { return this.apiKeys.revoke(id); }
  @Post('event-subscriptions') subscribe(@Body() dto: { topic: string; subscriberName: string; filter?: Record<string, unknown> }) { return this.subscriptions.subscribe(dto); }
  @Get('event-subscriptions') listSubscriptions() { return this.subscriptions.list(); }
}
