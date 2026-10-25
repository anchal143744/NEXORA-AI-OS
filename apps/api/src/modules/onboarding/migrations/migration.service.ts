import { Injectable, NotFoundException } from '@nestjs/common';
import { EventBusService } from '../../events/event-bus.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateMigrationConnectionDto, CreateMigrationMappingDto, CreateMigrationRunDto } from '../dto/onboarding.dto';

const ADAPTERS: Record<string, { objects: string[]; defaultMap: Record<string, string>; auth: string }> = {
  salesforce: { objects: ['Lead', 'Account', 'Contact', 'Opportunity'], defaultMap: { Id: 'externalId', Name: 'name', Email: 'email', Company: 'company' }, auth: 'oauth2' },
  hubspot: { objects: ['contacts', 'companies', 'deals', 'tickets'], defaultMap: { id: 'externalId', firstname: 'firstName', lastname: 'lastName', email: 'email' }, auth: 'oauth2' },
  zoho: { objects: ['Leads', 'Accounts', 'Contacts', 'Deals'], defaultMap: { id: 'externalId', Full_Name: 'name', Email: 'email', Company: 'company' }, auth: 'oauth2' },
  monday: { objects: ['boards', 'items', 'groups', 'updates'], defaultMap: { id: 'externalId', name: 'title', board: 'sourceBoard' }, auth: 'api_key' },
  notion: { objects: ['databases', 'pages', 'users'], defaultMap: { id: 'externalId', title: 'title', url: 'sourceUrl' }, auth: 'oauth2' },
};

@Injectable()
export class MigrationService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  adapters() { return Object.entries(ADAPTERS).map(([provider, config]) => ({ provider, ...config })); }
  connections() { return this.prisma.migrationConnection.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, include: { mappings: true, runs: true }, orderBy: { createdAt: 'desc' } }); }

  createConnection(dto: CreateMigrationConnectionDto) {
    return this.prisma.migrationConnection.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId(), provider: dto.provider, name: dto.name, status: 'connected', credentialRef: dto.credentialRef, connectionConfig: dto.connectionConfig ?? {}, lastValidatedAt: new Date(), metadata: dto.metadata ?? {} } });
  }

  mappings() { return this.prisma.migrationMapping.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, orderBy: { createdAt: 'desc' } }); }
  createMapping(dto: CreateMigrationMappingDto) { return this.prisma.migrationMapping.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId(), connectionId: dto.connectionId, provider: dto.provider, sourceObject: dto.sourceObject, targetEntity: dto.targetEntity, fieldMap: dto.fieldMap, transformRules: dto.transformRules ?? [], validationRules: dto.validationRules ?? {} } }); }

  runs(status?: string) { return this.prisma.migrationRun.findMany({ where: { tenantId: this.context.currentTenantId(), status: status ?? undefined, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 }); }

  async createRun(dto: CreateMigrationRunDto) {
    const tenantId = this.context.currentTenantId();
    const adapter = ADAPTERS[dto.provider];
    const mapping = dto.mapping ?? adapter?.defaultMap ?? {};
    const records = dto.records ?? [];
    const run = await this.prisma.migrationRun.create({ data: { tenantId, workspaceId: this.context.currentWorkspaceId(), connectionId: dto.connectionId, provider: dto.provider, sourceObject: dto.sourceObject, targetEntity: dto.targetEntity, status: 'queued', totalRecords: records.length, mapping, report: { preview: records.slice(0, 5).map((record) => this.normalize(record, mapping)), adapter: adapter ?? null }, createdByUserId: this.context.context()?.userId } });
    await this.events.publish({ tenantId, workspaceId: run.workspaceId ?? undefined, type: 'migration.started', source: 'migration-engine', subject: { type: 'migration_run', id: run.id }, payload: { provider: dto.provider, sourceObject: dto.sourceObject, targetEntity: dto.targetEntity, totalRecords: records.length }, actorUserId: this.context.context()?.userId });
    return run;
  }

  async executeRun(id: string, records: Array<Record<string, unknown>> = []) {
    const tenantId = this.context.currentTenantId();
    const run = await this.prisma.migrationRun.findFirst({ where: { tenantId, id, deletedAt: null } });
    if (!run) throw new NotFoundException('Migration run not found');
    const mapping = run.mapping as Record<string, string>;
    const normalized = records.map((record) => this.normalize(record, mapping));
    const failed = normalized.filter((record) => Object.values(record).every((value) => value === undefined || value === null || value === '')).length;
    const updated = await this.prisma.migrationRun.update({ where: { id }, data: { status: failed > 0 ? 'completed_with_errors' : 'completed', startedAt: run.startedAt ?? new Date(), completedAt: new Date(), totalRecords: records.length || run.totalRecords, migratedRecords: Math.max(0, (records.length || run.totalRecords) - failed), failedRecords: failed, report: { normalizedPreview: normalized.slice(0, 20), failed, provider: run.provider, sourceObject: run.sourceObject } } });
    await this.events.publish({ tenantId, workspaceId: run.workspaceId ?? undefined, type: 'migration.completed', source: 'migration-engine', subject: { type: 'migration_run', id: run.id }, payload: { provider: run.provider, targetEntity: run.targetEntity, migratedRecords: updated.migratedRecords, failedRecords: updated.failedRecords }, actorUserId: this.context.context()?.userId });
    return updated;
  }

  private normalize(record: Record<string, unknown>, mapping: Record<string, string>) { return Object.fromEntries(Object.entries(mapping).map(([source, target]) => [target, record[source]])); }
}
