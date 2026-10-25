import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateCustomerAccountDto, CreateCustomerWorkspaceDto } from './dto/customer-portal.dto';

@Injectable()
export class CustomerPortalService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  accounts(status?: string, lifecycleStage?: string, accountType?: string) {
    return this.prisma.customerAccount.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, lifecycleStage: lifecycleStage ?? undefined, accountType: accountType ?? undefined, deletedAt: null },
      include: { customerWorkspaces: true, subscriptions: true, billingProfiles: true, invoices: true, paymentMethods: true, usageMetrics: true, partnerReferrals: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createAccount(dto: CreateCustomerAccountDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.customerAccount.create({ data: { tenantId, workspaceId, customerIdentityId: dto.customerIdentityId, customerId: dto.customerId, accountKey: dto.accountKey ?? 'customer-account-' + randomUUID(), name: dto.name, legalName: dto.legalName, accountType: dto.accountType ?? 'business', status: dto.status ?? 'active', lifecycleStage: dto.lifecycleStage ?? 'active', primaryContactEmail: dto.primaryContactEmail, countryCode: dto.countryCode, industry: dto.industry, healthScore: dto.healthScore, successTier: dto.successTier ?? 'standard', metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'customer.account.created', source: 'customer-portal', subject: { type: 'customer_account', id: record.id }, payload: { accountKey: record.accountKey, status: record.status, lifecycleStage: record.lifecycleStage }, actorUserId: this.context.context()?.userId });
    return record;
  }

  workspaces(customerAccountId?: string, status?: string, accessLevel?: string) {
    return this.prisma.customerWorkspace.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, customerAccountId: customerAccountId ?? undefined, status: status ?? undefined, accessLevel: accessLevel ?? undefined, deletedAt: null },
      include: { customerAccount: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createWorkspace(dto: CreateCustomerWorkspaceDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.customerWorkspace.create({ data: { tenantId, workspaceId, customerAccountId: dto.customerAccountId, workspaceKey: dto.workspaceKey ?? 'customer-workspace-' + randomUUID(), name: dto.name, workspaceType: dto.workspaceType ?? 'customer', status: dto.status ?? 'active', accessLevel: dto.accessLevel ?? 'member', externalWorkspaceRef: dto.externalWorkspaceRef, activatedAt: dto.activatedAt ? new Date(dto.activatedAt) : undefined, suspendedAt: dto.suspendedAt ? new Date(dto.suspendedAt) : undefined, users: dto.users ?? [], permissions: dto.permissions ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'customer.workspace.created', source: 'customer-portal', subject: { type: 'customer_workspace', id: record.id }, payload: { workspaceKey: record.workspaceKey, status: record.status, accessLevel: record.accessLevel }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [accounts, workspaces] = await Promise.all([this.accounts(), this.workspaces()]);
    return {
      accounts,
      workspaces,
      summary: {
        accountCount: accounts.length,
        activeAccountCount: accounts.filter((account: { status: string }) => account.status === 'active').length,
        atRiskAccountCount: accounts.filter((account: { healthScore: number | null }) => typeof account.healthScore === 'number' && account.healthScore < 50).length,
        workspaceCount: workspaces.length,
        activeWorkspaceCount: workspaces.filter((workspace: { status: string }) => workspace.status === 'active').length,
      },
    };
  }
}
