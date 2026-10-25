import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreatePartnerAccountDto, CreatePartnerCommissionDto, CreatePartnerReferralDto, CreatePartnerWorkspaceDto } from './dto/customer-portal.dto';

@Injectable()
export class PartnerPortalService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  accounts(status?: string, partnerType?: string, tier?: string) {
    return this.prisma.partnerAccount.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, partnerType: partnerType ?? undefined, tier: tier ?? undefined, deletedAt: null }, include: { partnerWorkspaces: true, commissions: true, referrals: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createAccount(dto: CreatePartnerAccountDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.partnerAccount.create({ data: { tenantId, workspaceId, partnerKey: dto.partnerKey ?? 'partner-account-' + randomUUID(), name: dto.name, partnerType: dto.partnerType ?? 'reseller', status: dto.status ?? 'active', tier: dto.tier ?? 'standard', primaryEmail: dto.primaryEmail, countryCode: dto.countryCode, commissionRate: dto.commissionRate ?? 0, portalAccess: dto.portalAccess ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'partner.account.created', source: 'partner-portal', subject: { type: 'partner_account', id: record.id }, payload: { partnerKey: record.partnerKey, partnerType: record.partnerType, tier: record.tier, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  workspaces(partnerAccountId?: string, status?: string, portalRole?: string) {
    return this.prisma.partnerWorkspace.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, partnerAccountId: partnerAccountId ?? undefined, status: status ?? undefined, portalRole: portalRole ?? undefined, deletedAt: null }, include: { partnerAccount: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createWorkspace(dto: CreatePartnerWorkspaceDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.partnerWorkspace.create({ data: { tenantId, workspaceId, partnerAccountId: dto.partnerAccountId, workspaceKey: dto.workspaceKey ?? 'partner-workspace-' + randomUUID(), name: dto.name, status: dto.status ?? 'active', accessLevel: dto.accessLevel ?? 'partner', portalRole: dto.portalRole ?? 'partner_admin', permissions: dto.permissions ?? [], users: dto.users ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'partner.workspace.created', source: 'partner-portal', subject: { type: 'partner_workspace', id: record.id }, payload: { workspaceKey: record.workspaceKey, portalRole: record.portalRole, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  commissions(partnerAccountId?: string, status?: string, sourceType?: string) {
    return this.prisma.partnerCommission.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, partnerAccountId: partnerAccountId ?? undefined, status: status ?? undefined, sourceType: sourceType ?? undefined, deletedAt: null }, include: { partnerAccount: true }, orderBy: { earnedAt: 'desc' }, take: 100 });
  }

  async createCommission(dto: CreatePartnerCommissionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.partnerCommission.create({ data: { tenantId, workspaceId, partnerAccountId: dto.partnerAccountId, commissionKey: dto.commissionKey ?? 'partner-commission-' + randomUUID(), sourceType: dto.sourceType ?? 'subscription', sourceId: dto.sourceId, currency: dto.currency ?? 'USD', grossAmount: dto.grossAmount ?? 0, commissionRate: dto.commissionRate ?? 0, commissionAmount: dto.commissionAmount ?? 0, status: dto.status ?? 'pending', earnedAt: dto.earnedAt ? new Date(dto.earnedAt) : new Date(), paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'partner.commission.created', source: 'partner-portal', subject: { type: 'partner_commission', id: record.id }, payload: { commissionKey: record.commissionKey, status: record.status, currency: record.currency }, actorUserId: this.context.context()?.userId });
    return record;
  }

  referrals(partnerAccountId?: string, status?: string, customerAccountId?: string) {
    return this.prisma.partnerReferral.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, partnerAccountId: partnerAccountId ?? undefined, customerAccountId: customerAccountId ?? undefined, status: status ?? undefined, deletedAt: null }, include: { partnerAccount: true, customerAccount: true }, orderBy: { submittedAt: 'desc' }, take: 100 });
  }

  async createReferral(dto: CreatePartnerReferralDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.partnerReferral.create({ data: { tenantId, workspaceId, partnerAccountId: dto.partnerAccountId, customerAccountId: dto.customerAccountId, referralKey: dto.referralKey ?? 'partner-referral-' + randomUUID(), leadId: dto.leadId, status: dto.status ?? 'submitted', source: dto.source ?? 'partner_portal', customerName: dto.customerName, customerEmail: dto.customerEmail, estimatedValue: dto.estimatedValue ?? 0, currency: dto.currency ?? 'USD', submittedAt: dto.submittedAt ? new Date(dto.submittedAt) : new Date(), convertedAt: dto.convertedAt ? new Date(dto.convertedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'partner.referral.created', source: 'partner-portal', subject: { type: 'partner_referral', id: record.id }, payload: { referralKey: record.referralKey, status: record.status, currency: record.currency }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [accounts, workspaces, commissions, referrals] = await Promise.all([this.accounts(), this.workspaces(), this.commissions(), this.referrals()]);
    return {
      accounts,
      workspaces,
      commissions,
      referrals,
      summary: {
        partnerAccountCount: accounts.length,
        activePartnerCount: accounts.filter((account: { status: string }) => account.status === 'active').length,
        partnerWorkspaceCount: workspaces.length,
        pendingCommissionCount: commissions.filter((commission: { status: string }) => commission.status === 'pending').length,
        totalCommissionAmount: commissions.reduce((sum: number, commission: { commissionAmount: unknown }) => sum + Number(commission.commissionAmount ?? 0), 0),
        openReferralCount: referrals.filter((referral: { status: string }) => ['submitted', 'accepted', 'in_progress'].includes(referral.status)).length,
      },
    };
  }
}
