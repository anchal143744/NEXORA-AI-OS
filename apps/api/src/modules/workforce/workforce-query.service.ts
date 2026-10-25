import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { getWorkforceEntity, WorkforceEntity, WORKFORCE_ENTITIES } from './workforce.entities';

type WorkforceDelegate = {
  findMany(args: Record<string, unknown>): Promise<Record<string, unknown>[]>;
  count(args: Record<string, unknown>): Promise<number>;
};

@Injectable()
export class WorkforceQueryService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private delegate(entity: WorkforceEntity): WorkforceDelegate {
    const definition = getWorkforceEntity(entity);
    return (this.prisma as unknown as Record<string, WorkforceDelegate>)[definition.delegate];
  }

  private scope(filters: Record<string, string | undefined> = {}) {
    return {
      tenantId: this.context.currentTenantId(),
      workspaceId: this.context.currentWorkspaceId() ?? undefined,
      deletedAt: null,
      status: filters.status ?? undefined,
      stage: filters.stage ?? undefined,
      employeeId: filters.employeeId ?? undefined,
      candidateId: filters.candidateId ?? undefined,
      departmentId: filters.departmentId ?? undefined,
      riskLevel: filters.riskLevel ?? undefined,
    };
  }

  list(entity: WorkforceEntity, filters: Record<string, string | undefined> = {}) {
    return this.delegate(entity).findMany({ where: this.scope(filters), orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async dashboard(group: string) {
    const definitions = WORKFORCE_ENTITIES.filter((entity) => entity.group === group);
    const counts = await Promise.all(definitions.map(async (definition) => ({ entity: definition.entity, model: definition.model, count: await this.delegate(definition.entity).count({ where: this.scope() }) })));
    return {
      group,
      counts,
      summary: {
        entityCount: definitions.length,
        recordCount: counts.reduce((sum, item) => sum + item.count, 0),
      },
    };
  }

  async platformDashboard() {
    const groups = [...new Set(WORKFORCE_ENTITIES.map((entity) => entity.group))];
    const dashboards = await Promise.all(groups.map((group) => this.dashboard(group)));
    return {
      groups: dashboards,
      summary: {
        groupCount: dashboards.length,
        entityCount: WORKFORCE_ENTITIES.length,
        recordCount: dashboards.reduce((sum, dashboard) => sum + dashboard.summary.recordCount, 0),
      },
    };
  }
}

