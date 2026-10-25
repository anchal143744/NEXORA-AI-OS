import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateDeveloperAccountDto, CreateDeveloperApplicationDto } from './dto/ecosystem.dto';

@Injectable()
export class DeveloperPortalService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  accounts(accountType?: string, status?: string, verificationStatus?: string) {
    return this.prisma.developerAccount.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, accountType: accountType ?? undefined, status: status ?? undefined, verificationStatus: verificationStatus ?? undefined, deletedAt: null },
      include: { applications: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createAccount(dto: CreateDeveloperAccountDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.developerAccount.create({ data: { tenantId, workspaceId, accountKey: dto.accountKey ?? 'developer-account-' + randomUUID(), name: dto.name, email: dto.email, organizationName: dto.organizationName, status: dto.status ?? 'pending', accountType: dto.accountType ?? 'partner', verificationStatus: dto.verificationStatus ?? 'unverified', billingProfile: dto.billingProfile ?? {}, profile: dto.profile ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'developer.account.created', source: 'ecosystem', subject: { type: 'developer_account', id: record.id }, payload: { accountKey: record.accountKey, accountType: record.accountType, status: record.status, verificationStatus: record.verificationStatus }, actorUserId: this.context.context()?.userId });
    return record;
  }

  applications(appType?: string, status?: string, approvalStatus?: string) {
    return this.prisma.developerApplication.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, appType: appType ?? undefined, status: status ?? undefined, approvalStatus: approvalStatus ?? undefined, deletedAt: null },
      include: { developerAccount: true, marketplaceApplications: true, ecosystemEvents: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createApplication(dto: CreateDeveloperApplicationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.developerApplication.create({ data: { tenantId, workspaceId, developerAccountId: dto.developerAccountId, applicationKey: dto.applicationKey ?? 'developer-application-' + randomUUID(), name: dto.name, description: dto.description, status: dto.status ?? 'draft', appType: dto.appType ?? 'integration', apiProductIds: dto.apiProductIds ?? [], redirectUris: dto.redirectUris ?? [], webhookUrl: dto.webhookUrl, scopes: dto.scopes ?? [], approvalStatus: dto.approvalStatus ?? 'pending', publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'developer.application.created', source: 'ecosystem', subject: { type: 'developer_application', id: record.id }, payload: { applicationKey: record.applicationKey, appType: record.appType, status: record.status, approvalStatus: record.approvalStatus }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [accounts, applications] = await Promise.all([this.accounts(), this.applications()]);
    return {
      accounts,
      applications,
      summary: {
        developerAccountCount: accounts.length,
        verifiedDeveloperCount: accounts.filter((account: { verificationStatus: string }) => account.verificationStatus === 'verified').length,
        applicationCount: applications.length,
        approvedApplicationCount: applications.filter((application: { approvalStatus: string }) => application.approvalStatus === 'approved').length,
        publishedApplicationCount: applications.filter((application: { status: string }) => application.status === 'published').length,
      },
    };
  }
}
