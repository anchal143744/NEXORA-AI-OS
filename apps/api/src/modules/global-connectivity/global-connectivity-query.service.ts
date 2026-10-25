import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CONNECTIVITY_ENTITIES, ConnectivityEntity, getConnectivityEntity } from './global-connectivity.entities';

type ConnectivityDelegate = {
  findMany(args: Record<string, unknown>): Promise<Record<string, unknown>[]>;
  count(args: Record<string, unknown>): Promise<number>;
};

@Injectable()
export class GlobalConnectivityQueryService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private delegate(entity: ConnectivityEntity): ConnectivityDelegate {
    const definition = getConnectivityEntity(entity);
    return (this.prisma as unknown as Record<string, ConnectivityDelegate>)[definition.delegate];
  }

  private scope(filters: Record<string, string | undefined> = {}) {
    return {
      tenantId: this.context.currentTenantId(),
      workspaceId: this.context.currentWorkspaceId() ?? undefined,
      deletedAt: null,
      status: filters.status ?? undefined,
      provider: filters.provider ?? undefined,
      connectionStatus: filters.connectionStatus ?? undefined,
      authStatus: filters.authStatus ?? undefined,
      syncStatus: filters.syncStatus ?? undefined,
      deliveryStatus: filters.deliveryStatus ?? undefined,
      healthStatus: filters.healthStatus ?? undefined,
      riskLevel: filters.riskLevel ?? undefined,
      environment: filters.environment ?? undefined,
      apiVersion: filters.apiVersion ?? undefined,
      connectionId: filters.connectionId ?? undefined,
      gatewayId: filters.gatewayId ?? undefined,
      webhookEndpointId: filters.webhookEndpointId ?? undefined,
    };
  }

  list(entity: ConnectivityEntity, filters: Record<string, string | undefined> = {}) {
    return this.delegate(entity).findMany({ where: this.scope(filters), orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async dashboard(group: string) {
    const definitions = CONNECTIVITY_ENTITIES.filter((entity) => entity.group === group);
    const counts = await Promise.all(definitions.map(async (definition) => ({ entity: definition.entity, model: definition.model, count: await this.delegate(definition.entity).count({ where: this.scope() }) })));
    return { group, counts, summary: { entityCount: definitions.length, recordCount: counts.reduce((sum, item) => sum + item.count, 0) } };
  }

  async platformDashboard() {
    const groups = [...new Set(CONNECTIVITY_ENTITIES.map((entity) => entity.group))];
    const dashboards = await Promise.all(groups.map((group) => this.dashboard(group)));
    return { groups: dashboards, summary: { groupCount: dashboards.length, entityCount: CONNECTIVITY_ENTITIES.length, recordCount: dashboards.reduce((sum, dashboard) => sum + dashboard.summary.recordCount, 0) } };
  }
}
