import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateBusinessDto } from '../dto/create-business.dto';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { CreateWorkspaceDto } from '../../workspaces/dto/create-workspace.dto';
import { UpdateWorkspaceDto } from '../../workspaces/dto/update-workspace.dto';

@Injectable()
export class TenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  createOrganization(tenantId: string, dto: CreateOrganizationDto) {
    return this.prisma.organization.create({ data: { tenantId, ...dto } });
  }

  async createBusiness(tenantId: string, dto: CreateBusinessDto) {
    await this.requireOrganization(tenantId, dto.organizationId);
    return this.prisma.business.create({ data: { tenantId, organizationId: dto.organizationId, name: dto.name, businessType: dto.businessType, industry: dto.industry, countryCode: dto.countryCode, goals: dto.goals ?? [] } });
  }

  async createWorkspace(tenantId: string, dto: CreateWorkspaceDto) {
    await this.requireOrganization(tenantId, dto.organizationId);
    if (dto.businessId) await this.requireBusiness(tenantId, dto.organizationId, dto.businessId);
    return this.prisma.workspace.create({ data: { tenantId, organizationId: dto.organizationId, businessId: dto.businessId, name: dto.name, slug: dto.slug, description: dto.description } });
  }

  getWorkspace(tenantId: string, workspaceId: string) {
    return this.prisma.workspace.findFirst({ where: { tenantId, id: workspaceId, deletedAt: null } });
  }

  ensureOrganizationMembership(tenantId: string, organizationId: string, userId: string, title = 'Member') {
    return this.prisma.membership.upsert({
      where: { tenantId_organizationId_userId: { tenantId, organizationId, userId } },
      update: { deletedAt: null },
      create: { tenantId, organizationId, userId, title },
    });
  }

  ensureWorkspaceMembership(tenantId: string, workspaceId: string, userId: string) {
    return this.prisma.workspaceMember.upsert({
      where: { tenantId_workspaceId_userId: { tenantId, workspaceId, userId } },
      update: { status: 'ACTIVE', deletedAt: null },
      create: { tenantId, workspaceId, userId, status: 'ACTIVE' },
    });
  }

  updateWorkspace(tenantId: string, workspaceId: string, dto: UpdateWorkspaceDto) {
    return this.prisma.workspace.updateMany({ where: { tenantId, id: workspaceId, deletedAt: null }, data: dto });
  }

  private async requireOrganization(tenantId: string, organizationId: string) {
    const organization = await this.prisma.organization.findFirst({ where: { tenantId, id: organizationId, deletedAt: null }, select: { id: true } });
    if (!organization) throw new NotFoundException('Organization not found');
  }

  private async requireBusiness(tenantId: string, organizationId: string, businessId: string) {
    const business = await this.prisma.business.findFirst({ where: { tenantId, organizationId, id: businessId, deletedAt: null }, select: { id: true } });
    if (!business) throw new NotFoundException('Business not found');
  }
}
