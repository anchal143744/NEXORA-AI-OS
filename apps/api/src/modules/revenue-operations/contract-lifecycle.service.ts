
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateContractAmendmentDto, CreateRevenueContractDto } from './dto/revenue-operations.dto';

@Injectable()
export class ContractLifecycleService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  contracts(status?: string, contractType?: string, revenueAccountId?: string) {
    return this.prisma.revenueContract.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, contractType: contractType ?? undefined, revenueAccountId: revenueAccountId ?? undefined, deletedAt: null },
      include: { revenueAccount: true, amendments: true, renewalSchedules: true, revenueEvents: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createContract(dto: CreateRevenueContractDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.revenueContract.create({
      data: {
        tenantId,
        workspaceId,
        revenueAccountId: dto.revenueAccountId,
        contractKey: dto.contractKey ?? 'revenue-contract-' + randomUUID(),
        contractNumber: dto.contractNumber,
        title: dto.title,
        contractType: dto.contractType ?? 'subscription',
        status: dto.status ?? 'active',
        currency: dto.currency ?? 'USD',
        contractValue: dto.contractValue ?? 0,
        annualRecurringRevenue: dto.annualRecurringRevenue ?? 0,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        renewalDate: dto.renewalDate ? new Date(dto.renewalDate) : undefined,
        autoRenew: dto.autoRenew ?? false,
        terms: dto.terms ?? {},
        obligations: dto.obligations ?? [],
        metadata: dto.metadata ?? {},
      },
    });
    await this.events.publish({ tenantId, workspaceId, type: 'revenue.contract.created', source: 'revenue-operations', subject: { type: 'revenue_contract', id: record.id }, payload: { contractKey: record.contractKey, status: record.status, contractValue: record.contractValue }, actorUserId: this.context.context()?.userId });
    return record;
  }

  amendments(revenueContractId?: string, status?: string) {
    return this.prisma.contractAmendment.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, revenueContractId: revenueContractId ?? undefined, status: status ?? undefined, deletedAt: null },
      include: { revenueContract: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createAmendment(dto: CreateContractAmendmentDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.contractAmendment.create({
      data: {
        tenantId,
        workspaceId,
        revenueContractId: dto.revenueContractId,
        amendmentKey: dto.amendmentKey ?? 'contract-amendment-' + randomUUID(),
        amendmentNumber: dto.amendmentNumber,
        title: dto.title,
        amendmentType: dto.amendmentType ?? 'commercial',
        status: dto.status ?? 'draft',
        effectiveAt: dto.effectiveAt ? new Date(dto.effectiveAt) : undefined,
        signedAt: dto.signedAt ? new Date(dto.signedAt) : undefined,
        valueDelta: dto.valueDelta ?? 0,
        arrDelta: dto.arrDelta ?? 0,
        termsDelta: dto.termsDelta ?? {},
        approvals: dto.approvals ?? [],
        metadata: dto.metadata ?? {},
      },
    });
    await this.events.publish({ tenantId, workspaceId, type: 'contract.amendment.created', source: 'revenue-operations', subject: { type: 'contract_amendment', id: record.id }, payload: { amendmentKey: record.amendmentKey, status: record.status, amendmentType: record.amendmentType }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [contracts, amendments] = await Promise.all([this.contracts(), this.amendments()]);
    return {
      contracts,
      amendments,
      summary: {
        contractCount: contracts.length,
        activeContractCount: contracts.filter((contract: { status: string }) => contract.status === 'active').length,
        renewalReadyCount: contracts.filter((contract: { renewalDate: Date | null }) => Boolean(contract.renewalDate)).length,
        amendmentCount: amendments.length,
      },
    };
  }
}
