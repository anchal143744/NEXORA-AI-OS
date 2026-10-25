
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateVendorContractDto, CreateVendorDto, CreateVendorScorecardDto } from './dto/procurement.dto';

@Injectable()
export class VendorManagementService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  vendors(status?: string, riskLevel?: string, vendorType?: string) {
    return this.prisma.vendor.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, riskLevel: riskLevel ?? undefined, vendorType: vendorType ?? undefined, deletedAt: null },
      include: { contracts: true, scorecards: true, procurementRequests: true, purchaseOrders: true, spendTransactions: true, costOptimizationRecommendations: true, procurementEvents: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createVendor(dto: CreateVendorDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.vendor.create({ data: { tenantId, workspaceId, vendorKey: dto.vendorKey ?? 'vendor-' + randomUUID(), name: dto.name, legalName: dto.legalName, vendorType: dto.vendorType ?? 'supplier', status: dto.status ?? 'active', riskLevel: dto.riskLevel ?? 'low', tier: dto.tier ?? 'standard', primaryEmail: dto.primaryEmail, countryCode: dto.countryCode, taxId: dto.taxId, paymentTerms: dto.paymentTerms, ownerUserId: dto.ownerUserId, categories: dto.categories ?? [], capabilities: dto.capabilities ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'vendor.created', source: 'procurement', subject: { type: 'vendor', id: record.id }, payload: { vendorKey: record.vendorKey, status: record.status, riskLevel: record.riskLevel }, actorUserId: this.context.context()?.userId });
    return record;
  }

  contracts(status?: string, contractType?: string, vendorId?: string) {
    return this.prisma.vendorContract.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, contractType: contractType ?? undefined, vendorId: vendorId ?? undefined, deletedAt: null },
      include: { vendor: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createContract(dto: CreateVendorContractDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.vendorContract.create({ data: { tenantId, workspaceId, vendorId: dto.vendorId, contractKey: dto.contractKey ?? 'vendor-contract-' + randomUUID(), contractNumber: dto.contractNumber, title: dto.title, contractType: dto.contractType ?? 'master_service', status: dto.status ?? 'active', currency: dto.currency ?? 'USD', contractValue: dto.contractValue ?? 0, startDate: dto.startDate ? new Date(dto.startDate) : undefined, endDate: dto.endDate ? new Date(dto.endDate) : undefined, renewalDate: dto.renewalDate ? new Date(dto.renewalDate) : undefined, autoRenew: dto.autoRenew ?? false, terms: dto.terms ?? {}, compliance: dto.compliance ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'vendor.contract.created', source: 'procurement', subject: { type: 'vendor_contract', id: record.id }, payload: { contractKey: record.contractKey, status: record.status, contractValue: record.contractValue }, actorUserId: this.context.context()?.userId });
    return record;
  }

  scorecards(scoreBand?: string, vendorId?: string) {
    return this.prisma.vendorScorecard.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, scoreBand: scoreBand ?? undefined, vendorId: vendorId ?? undefined, deletedAt: null },
      include: { vendor: true },
      orderBy: { calculatedAt: 'desc' },
      take: 100,
    });
  }

  async createScorecard(dto: CreateVendorScorecardDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.vendorScorecard.create({ data: { tenantId, workspaceId, vendorId: dto.vendorId, scorecardKey: dto.scorecardKey ?? 'vendor-scorecard-' + randomUUID(), score: dto.score, scoreBand: dto.scoreBand ?? 'good', periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined, periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined, qualityScore: dto.qualityScore, deliveryScore: dto.deliveryScore, costScore: dto.costScore, riskScore: dto.riskScore, calculatedAt: dto.calculatedAt ? new Date(dto.calculatedAt) : undefined, metrics: dto.metrics ?? {}, recommendations: dto.recommendations ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'vendor.scorecard.created', source: 'procurement', subject: { type: 'vendor_scorecard', id: record.id }, payload: { scorecardKey: record.scorecardKey, score: record.score, scoreBand: record.scoreBand }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [vendors, contracts, scorecards] = await Promise.all([this.vendors(), this.contracts(), this.scorecards()]);
    return { vendors, contracts, scorecards, summary: { vendorCount: vendors.length, activeVendorCount: vendors.filter((vendor: { status: string }) => vendor.status === 'active').length, highRiskVendorCount: vendors.filter((vendor: { riskLevel: string }) => vendor.riskLevel === 'high' || vendor.riskLevel === 'critical').length, contractCount: contracts.length, scorecardCount: scorecards.length } };
  }
}
