import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateContractVersionDto, CreateDataContractDto } from './dto/platform-governance.dto';

@Injectable()
export class DataContractService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  contracts(domain?: string, status?: string, contractType?: string) {
    return this.prisma.dataContract.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, domain: domain ?? undefined, status: status ?? undefined, contractType: contractType ?? undefined, deletedAt: null },
      include: { versions: true, apiProducts: true, governancePolicies: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createContract(dto: CreateDataContractDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.dataContract.create({ data: { tenantId, workspaceId, contractKey: dto.contractKey ?? 'data-contract-' + randomUUID(), name: dto.name, domain: dto.domain, contractType: dto.contractType ?? 'api', status: dto.status ?? 'draft', ownerUserId: dto.ownerUserId, schema: dto.schema ?? {}, qualityRules: dto.qualityRules ?? [], consumers: dto.consumers ?? [], tags: dto.tags ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'data.contract.created', source: 'platform-governance', subject: { type: 'data_contract', id: record.id }, payload: { contractKey: record.contractKey, domain: record.domain, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  versions(dataContractId?: string, status?: string) {
    return this.prisma.contractVersion.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, dataContractId: dataContractId ?? undefined, status: status ?? undefined, deletedAt: null },
      include: { dataContract: true, apiProducts: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createVersion(dto: CreateContractVersionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.contractVersion.create({ data: { tenantId, workspaceId, dataContractId: dto.dataContractId, versionKey: dto.versionKey ?? 'contract-version-' + randomUUID(), version: dto.version, status: dto.status ?? 'draft', schema: dto.schema ?? {}, changelog: dto.changelog ?? [], compatibilityMode: dto.compatibilityMode ?? 'backward', publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined, deprecatedAt: dto.deprecatedAt ? new Date(dto.deprecatedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'contract.version.created', source: 'platform-governance', subject: { type: 'contract_version', id: record.id }, payload: { dataContractId: record.dataContractId, version: record.version, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [contracts, versions] = await Promise.all([this.contracts(), this.versions()]);
    return {
      contracts,
      versions,
      summary: {
        contractCount: contracts.length,
        publishedContractCount: contracts.filter((contract: { status: string }) => contract.status === 'published').length,
        versionCount: versions.length,
        breakingVersionCount: versions.filter((version: { compatibilityMode: string }) => version.compatibilityMode === 'breaking').length,
      },
    };
  }
}
