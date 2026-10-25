import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { EAM_ENTITIES, EamEntity, getEamEntity } from './eam.entities';

type EamDelegate = {
  findMany(args: Record<string, unknown>): Promise<Record<string, unknown>[]>;
  count(args: Record<string, unknown>): Promise<number>;
};

@Injectable()
export class EamQueryService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private delegate(entity: EamEntity): EamDelegate {
    const definition = getEamEntity(entity);
    return (this.prisma as unknown as Record<string, EamDelegate>)[definition.delegate];
  }

  private scope(filters: Record<string, string | undefined> = {}) {
    return {
      tenantId: this.context.currentTenantId(),
      workspaceId: this.context.currentWorkspaceId() ?? undefined,
      deletedAt: null,
      status: filters.status ?? undefined,
      assetId: filters.assetId ?? undefined,
      workOrderId: filters.workOrderId ?? undefined,
      locationId: filters.locationId ?? undefined,
      vendorId: filters.vendorId ?? undefined,
      riskLevel: filters.riskLevel ?? undefined,
      lifecycleStage: filters.lifecycleStage ?? undefined,
      conditionStatus: filters.conditionStatus ?? undefined,
    };
  }

  list(entity: EamEntity, filters: Record<string, string | undefined> = {}) {
    return this.delegate(entity).findMany({ where: this.scope(filters), orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async dashboard(group: string) {
    const definitions = EAM_ENTITIES.filter((entity) => entity.group === group);
    const counts = await Promise.all(definitions.map(async (definition) => ({ entity: definition.entity, model: definition.model, count: await this.delegate(definition.entity).count({ where: this.scope() }) })));
    return { group, counts, summary: { entityCount: definitions.length, recordCount: counts.reduce((sum, item) => sum + item.count, 0) } };
  }

  async platformDashboard() {
    const groups = [...new Set(EAM_ENTITIES.map((entity) => entity.group))];
    const dashboards = await Promise.all(groups.map((group) => this.dashboard(group)));
    return { groups: dashboards, summary: { groupCount: dashboards.length, entityCount: EAM_ENTITIES.length, recordCount: dashboards.reduce((sum, dashboard) => sum + dashboard.summary.recordCount, 0) } };
  }
}

