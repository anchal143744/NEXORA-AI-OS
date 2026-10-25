import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { PRODUCTION_READINESS_ENTITIES, ProductionReadinessEntity, getProductionReadinessEntity } from './production-readiness.entities';

type ProductionReadinessDelegate = {
  findMany(args: Record<string, unknown>): Promise<Record<string, unknown>[]>;
  count(args: Record<string, unknown>): Promise<number>;
};

@Injectable()
export class ProductionReadinessQueryService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private delegate(entity: ProductionReadinessEntity): ProductionReadinessDelegate {
    const definition = getProductionReadinessEntity(entity);
    return (this.prisma as unknown as Record<string, ProductionReadinessDelegate>)[definition.delegate];
  }

  private scope(filters: Record<string, string | undefined> = {}) {
    return {
      tenantId: this.context.currentTenantId(),
      workspaceId: this.context.currentWorkspaceId() ?? undefined,
      deletedAt: null,
      status: filters.status ?? undefined,
      environment: filters.environment ?? undefined,
      releaseVersion: filters.releaseVersion ?? undefined,
      validationStatus: filters.validationStatus ?? undefined,
      approvalStatus: filters.approvalStatus ?? undefined,
      riskLevel: filters.riskLevel ?? undefined,
      severity: filters.severity ?? undefined,
      isBlocking: filters.isBlocking ? filters.isBlocking === 'true' : undefined,
    };
  }

  list(entity: ProductionReadinessEntity, filters: Record<string, string | undefined> = {}) {
    return this.delegate(entity).findMany({ where: this.scope(filters), orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async dashboard(group: string) {
    const definitions = PRODUCTION_READINESS_ENTITIES.filter((entity) => entity.group === group);
    const counts = await Promise.all(definitions.map(async (definition) => ({ entity: definition.entity, model: definition.model, count: await this.delegate(definition.entity).count({ where: this.scope() }) })));
    return { group, counts, summary: { entityCount: definitions.length, recordCount: counts.reduce((sum, item) => sum + item.count, 0) } };
  }

  async platformDashboard() {
    const groups = [...new Set(PRODUCTION_READINESS_ENTITIES.map((entity) => entity.group))];
    const dashboards = await Promise.all(groups.map((group) => this.dashboard(group)));
    return { groups: dashboards, summary: { groupCount: dashboards.length, entityCount: PRODUCTION_READINESS_ENTITIES.length, recordCount: dashboards.reduce((sum, dashboard) => sum + dashboard.summary.recordCount, 0) } };
  }
}
