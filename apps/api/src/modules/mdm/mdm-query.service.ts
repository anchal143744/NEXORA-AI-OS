import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { MDM_ENTITIES, MdmEntity, getMdmEntity } from './mdm.entities';

type MdmDelegate = {
  findMany(args: Record<string, unknown>): Promise<Record<string, unknown>[]>;
  count(args: Record<string, unknown>): Promise<number>;
};

@Injectable()
export class MdmQueryService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private delegate(entity: MdmEntity): MdmDelegate {
    const definition = getMdmEntity(entity);
    return (this.prisma as unknown as Record<string, MdmDelegate>)[definition.delegate];
  }

  private scope(filters: Record<string, string | undefined> = {}) {
    return {
      tenantId: this.context.currentTenantId(),
      workspaceId: this.context.currentWorkspaceId() ?? undefined,
      deletedAt: null,
      status: filters.status ?? undefined,
      domain: filters.domain ?? undefined,
      entityType: filters.entityType ?? undefined,
      qualityStatus: filters.qualityStatus ?? undefined,
      matchStatus: filters.matchStatus ?? undefined,
      governanceStatus: filters.governanceStatus ?? undefined,
      riskLevel: filters.riskLevel ?? undefined,
      goldenRecordId: filters.goldenRecordId ?? undefined,
      sourceSystemId: filters.sourceSystemId ?? undefined,
      stewardUserId: filters.stewardUserId ?? undefined,
      ownerUserId: filters.ownerUserId ?? undefined,
    };
  }

  list(entity: MdmEntity, filters: Record<string, string | undefined> = {}) {
    return this.delegate(entity).findMany({ where: this.scope(filters), orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async dashboard(group: string) {
    const definitions = MDM_ENTITIES.filter((entity) => entity.group === group);
    const counts = await Promise.all(definitions.map(async (definition) => ({ entity: definition.entity, model: definition.model, count: await this.delegate(definition.entity).count({ where: this.scope() }) })));
    return { group, counts, summary: { entityCount: definitions.length, recordCount: counts.reduce((sum, item) => sum + item.count, 0) } };
  }

  async platformDashboard() {
    const groups = [...new Set(MDM_ENTITIES.map((entity) => entity.group))];
    const dashboards = await Promise.all(groups.map((group) => this.dashboard(group)));
    return { groups: dashboards, summary: { groupCount: dashboards.length, entityCount: MDM_ENTITIES.length, recordCount: dashboards.reduce((sum, dashboard) => sum + dashboard.summary.recordCount, 0) } };
  }
}
