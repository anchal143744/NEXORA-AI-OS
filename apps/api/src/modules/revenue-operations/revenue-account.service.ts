
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateRevenueAccountDto } from './dto/revenue-operations.dto';

@Injectable()
export class RevenueAccountService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  accounts(status?: string, lifecycleStage?: string, segment?: string) {
    return this.prisma.revenueAccount.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, lifecycleStage: lifecycleStage ?? undefined, segment: segment ?? undefined, deletedAt: null },
      include: { contracts: true, renewalSchedules: true, renewalForecasts: true, churnSignals: true, expansionOpportunities: true, accountHealthScores: true, revenueForecasts: true, revenueEvents: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createAccount(dto: CreateRevenueAccountDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.revenueAccount.create({
      data: {
        tenantId,
        workspaceId,
        customerAccountId: dto.customerAccountId,
        customerIdentityId: dto.customerIdentityId,
        customerId: dto.customerId,
        accountKey: dto.accountKey ?? 'revenue-account-' + randomUUID(),
        name: dto.name,
        segment: dto.segment ?? 'enterprise',
        status: dto.status ?? 'active',
        lifecycleStage: dto.lifecycleStage ?? 'retention',
        ownerUserId: dto.ownerUserId,
        annualRecurringRevenue: dto.annualRecurringRevenue ?? 0,
        totalContractValue: dto.totalContractValue ?? 0,
        currency: dto.currency ?? 'USD',
        healthScore: dto.healthScore,
        churnRiskScore: dto.churnRiskScore,
        expansionScore: dto.expansionScore,
        renewalDate: dto.renewalDate ? new Date(dto.renewalDate) : undefined,
        metadata: dto.metadata ?? {},
      },
    });
    await this.events.publish({ tenantId, workspaceId, type: 'revenue.account.created', source: 'revenue-operations', subject: { type: 'revenue_account', id: record.id }, payload: { accountKey: record.accountKey, status: record.status, lifecycleStage: record.lifecycleStage }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const accounts = await this.accounts();
    return {
      accounts,
      summary: {
        accountCount: accounts.length,
        activeAccountCount: accounts.filter((account: { status: string }) => account.status === 'active').length,
        atRiskAccountCount: accounts.filter((account: { churnRiskScore: number | null }) => typeof account.churnRiskScore === 'number' && account.churnRiskScore >= 70).length,
        renewalPipelineCount: accounts.filter((account: { renewalDate: Date | null }) => Boolean(account.renewalDate)).length,
      },
    };
  }
}
