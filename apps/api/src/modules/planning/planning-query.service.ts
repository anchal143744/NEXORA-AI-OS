import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { PLANNING_ENTITIES, PlanningEntity, getPlanningEntity } from './planning.entities';

type PlanningDelegate = {
  findMany(args: Record<string, unknown>): Promise<Record<string, unknown>[]>;
  count(args: Record<string, unknown>): Promise<number>;
};

@Injectable()
export class PlanningQueryService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private delegate(entity: PlanningEntity): PlanningDelegate {
    const definition = getPlanningEntity(entity);
    return (this.prisma as unknown as Record<string, PlanningDelegate>)[definition.delegate];
  }

  private scope(filters: Record<string, string | undefined> = {}) {
    return {
      tenantId: this.context.currentTenantId(),
      workspaceId: this.context.currentWorkspaceId() ?? undefined,
      deletedAt: null,
      status: filters.status ?? undefined,
      stage: filters.stage ?? undefined,
      priority: filters.priority ?? undefined,
      riskLevel: filters.riskLevel ?? undefined,
      healthStatus: filters.healthStatus ?? undefined,
      planId: filters.planId ?? undefined,
      objectiveId: filters.objectiveId ?? undefined,
      portfolioId: filters.portfolioId ?? undefined,
      programId: filters.programId ?? undefined,
      ownerUserId: filters.ownerUserId ?? undefined,
      departmentId: filters.departmentId ?? undefined,
      fiscalYear: filters.fiscalYear ? Number(filters.fiscalYear) : undefined,
    };
  }

  list(entity: PlanningEntity, filters: Record<string, string | undefined> = {}) {
    return this.delegate(entity).findMany({ where: this.scope(filters), orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async dashboard(group: string) {
    const definitions = PLANNING_ENTITIES.filter((entity) => entity.group === group);
    const counts = await Promise.all(definitions.map(async (definition) => ({ entity: definition.entity, model: definition.model, count: await this.delegate(definition.entity).count({ where: this.scope() }) })));
    return { group, counts, summary: { entityCount: definitions.length, recordCount: counts.reduce((sum, item) => sum + item.count, 0) } };
  }

  async platformDashboard() {
    const groups = [...new Set(PLANNING_ENTITIES.map((entity) => entity.group))];
    const dashboards = await Promise.all(groups.map((group) => this.dashboard(group)));
    return { groups: dashboards, summary: { groupCount: dashboards.length, entityCount: PLANNING_ENTITIES.length, recordCount: dashboards.reduce((sum, dashboard) => sum + dashboard.summary.recordCount, 0) } };
  }
}
