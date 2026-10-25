import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { FIELD_SERVICE_ENTITIES, FieldServiceEntity, getFieldServiceEntity } from './field-service.entities';

type FieldServiceDelegate = {
  findMany(args: Record<string, unknown>): Promise<Record<string, unknown>[]>;
  count(args: Record<string, unknown>): Promise<number>;
};

@Injectable()
export class FieldServiceQueryService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private delegate(entity: FieldServiceEntity): FieldServiceDelegate {
    const definition = getFieldServiceEntity(entity);
    return (this.prisma as unknown as Record<string, FieldServiceDelegate>)[definition.delegate];
  }

  private scope(filters: Record<string, string | undefined> = {}) {
    return {
      tenantId: this.context.currentTenantId(),
      workspaceId: this.context.currentWorkspaceId() ?? undefined,
      deletedAt: null,
      status: filters.status ?? undefined,
      stage: filters.stage ?? undefined,
      priority: filters.priority ?? undefined,
      severity: filters.severity ?? undefined,
      riskLevel: filters.riskLevel ?? undefined,
      workOrderId: filters.workOrderId ?? undefined,
      customerId: filters.customerId ?? undefined,
      technicianId: filters.technicianId ?? undefined,
      territoryId: filters.territoryId ?? undefined,
      slaPolicyId: filters.slaPolicyId ?? undefined,
    };
  }

  list(entity: FieldServiceEntity, filters: Record<string, string | undefined> = {}) {
    return this.delegate(entity).findMany({ where: this.scope(filters), orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async dashboard(group: string) {
    const definitions = FIELD_SERVICE_ENTITIES.filter((entity) => entity.group === group);
    const counts = await Promise.all(definitions.map(async (definition) => ({ entity: definition.entity, model: definition.model, count: await this.delegate(definition.entity).count({ where: this.scope() }) })));
    return { group, counts, summary: { entityCount: definitions.length, recordCount: counts.reduce((sum, item) => sum + item.count, 0) } };
  }

  async platformDashboard() {
    const groups = [...new Set(FIELD_SERVICE_ENTITIES.map((entity) => entity.group))];
    const dashboards = await Promise.all(groups.map((group) => this.dashboard(group)));
    return { groups: dashboards, summary: { groupCount: dashboards.length, entityCount: FIELD_SERVICE_ENTITIES.length, recordCount: dashboards.reduce((sum, dashboard) => sum + dashboard.summary.recordCount, 0) } };
  }
}

