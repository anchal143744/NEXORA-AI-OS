import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { DomainEventType } from '../events/contracts/domain-event.contract';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateConnectivityRecordDto } from './dto/global-connectivity.dto';
import { ConnectivityEntity, getConnectivityEntity } from './global-connectivity.entities';

type ConnectivityDelegate = {
  create(args: Record<string, unknown>): Promise<Record<string, unknown>>;
};

@Injectable()
export class GlobalConnectivityCommandService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  private delegate(entity: ConnectivityEntity): ConnectivityDelegate {
    const definition = getConnectivityEntity(entity);
    return (this.prisma as unknown as Record<string, ConnectivityDelegate>)[definition.delegate];
  }

  private date(value?: string) { return value ? new Date(value) : undefined; }

  async create(entity: ConnectivityEntity, dto: CreateConnectivityRecordDto) {
    const definition = getConnectivityEntity(entity);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const data = {
      tenantId,
      workspaceId,
      recordKey: dto.recordKey ?? entity + '-' + randomUUID(),
      provider: dto.provider,
      providerAccountId: dto.providerAccountId,
      connectionId: dto.connectionId,
      connectorId: dto.connectorId,
      catalogId: dto.catalogId,
      routeId: dto.routeId,
      webhookEndpointId: dto.webhookEndpointId,
      gatewayId: dto.gatewayId,
      sdkPackageId: dto.sdkPackageId,
      syncRunId: dto.syncRunId,
      healthCheckId: dto.healthCheckId,
      credentialRefId: dto.credentialRefId,
      secretReferenceId: dto.secretReferenceId,
      externalTenantId: dto.externalTenantId,
      externalUserId: dto.externalUserId,
      externalObjectType: dto.externalObjectType,
      externalObjectId: dto.externalObjectId,
      relatedEntityType: dto.relatedEntityType,
      relatedEntityId: dto.relatedEntityId,
      name: dto.name,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      type: dto.type,
      status: dto.status ?? 'active',
      lifecycleStatus: dto.lifecycleStatus,
      connectionStatus: dto.connectionStatus,
      authStatus: dto.authStatus,
      syncStatus: dto.syncStatus,
      deliveryStatus: dto.deliveryStatus,
      healthStatus: dto.healthStatus,
      riskLevel: dto.riskLevel,
      priority: dto.priority ?? 'normal',
      environment: dto.environment ?? 'production',
      region: dto.region,
      countryCode: dto.countryCode,
      apiVersion: dto.apiVersion,
      protocol: dto.protocol,
      baseUrl: dto.baseUrl,
      endpointPath: dto.endpointPath,
      httpMethod: dto.httpMethod,
      authType: dto.authType,
      oauthClientId: dto.oauthClientId,
      oauthTenantId: dto.oauthTenantId,
      oidcIssuer: dto.oidcIssuer,
      oidcAudience: dto.oidcAudience,
      scopes: dto.scopes ?? [],
      permissions: dto.permissions ?? [],
      rateLimitPolicy: dto.rateLimitPolicy ?? {},
      retryPolicy: dto.retryPolicy ?? {},
      mappingConfig: dto.mappingConfig ?? {},
      transformConfig: dto.transformConfig ?? {},
      routingRules: dto.routingRules ?? {},
      subscriptionConfig: dto.subscriptionConfig ?? {},
      headers: dto.headers ?? {},
      requestTemplate: dto.requestTemplate ?? {},
      responseTemplate: dto.responseTemplate ?? {},
      payload: dto.payload ?? {},
      metrics: dto.metrics ?? {},
      recommendations: dto.recommendations ?? [],
      metadata: dto.metadata ?? {},
      lastValidatedAt: this.date(dto.lastValidatedAt),
      lastSyncedAt: this.date(dto.lastSyncedAt),
      lastDeliveredAt: this.date(dto.lastDeliveredAt),
      tokenExpiresAt: this.date(dto.tokenExpiresAt),
      nextRunAt: this.date(dto.nextRunAt),
      disabledAt: this.date(dto.disabledAt),
      version: dto.version ?? 1,
      sequence: dto.sequence ?? 0,
      timeoutMs: dto.timeoutMs ?? 30000,
      retryCount: dto.retryCount ?? 0,
      failureCount: dto.failureCount ?? 0,
      successCount: dto.successCount ?? 0,
      requestCount: dto.requestCount ?? 0,
      errorCount: dto.errorCount ?? 0,
      latencyMs: dto.latencyMs ?? 0,
      throughputPerMinute: dto.throughputPerMinute ?? 0,
      uptimePercent: dto.uptimePercent ?? 0,
      successRate: dto.successRate ?? 0,
      riskScore: dto.riskScore ?? 0,
      confidence: dto.confidence ?? 0,
      costEstimate: dto.costEstimate ?? 0,
      isEnabled: dto.isEnabled ?? true,
      isManaged: dto.isManaged ?? false,
      requiresApproval: dto.requiresApproval ?? false,
      createdByUserId: dto.createdByUserId ?? this.context.context()?.userId,
      approvedByUserId: dto.approvedByUserId,
    };
    const record = await this.delegate(entity).create({ data });
    await this.events.publish({
      tenantId,
      workspaceId,
      type: definition.event as DomainEventType,
      source: 'global-connectivity',
      subject: { type: definition.model, id: String(record.id) },
      payload: { entity, model: definition.model, recordKey: record.recordKey, provider: record.provider, connectionStatus: record.connectionStatus, authStatus: record.authStatus, healthStatus: record.healthStatus, riskLevel: record.riskLevel },
      actorUserId: this.context.context()?.userId,
    });
    return record;
  }
}
