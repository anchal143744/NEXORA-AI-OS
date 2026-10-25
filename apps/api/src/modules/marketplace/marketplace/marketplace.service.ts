import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateMarketplaceAppDto, CreateMarketplacePermissionDto, CreateMarketplaceVersionDto, InstallMarketplaceAppDto } from '../dto/marketplace.dto';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  catalog(category?: string, status?: string) {
    return this.prisma.marketplaceApp.findMany({
      where: { tenantId: this.context.currentTenantId(), category: category ?? undefined, status: status ?? undefined, deletedAt: null },
      include: { versions: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 5 }, permissions: { where: { deletedAt: null } }, partnerProfile: true },
      orderBy: [{ status: 'asc' }, { name: 'asc' }],
      take: 100,
    });
  }

  async app(id: string) {
    const app = await this.prisma.marketplaceApp.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { versions: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } }, permissions: { where: { deletedAt: null } }, extensions: { where: { deletedAt: null } }, installations: { where: { deletedAt: null } }, partnerProfile: true } });
    if (!app) throw new NotFoundException('Marketplace app not found');
    return app;
  }

  async createApp(dto: CreateMarketplaceAppDto) {
    const tenantId = this.context.currentTenantId();
    const appKey = dto.appKey ?? this.slugify(dto.name);
    const slug = dto.slug ?? appKey;
    const duplicate = await this.prisma.marketplaceApp.findFirst({ where: { tenantId, OR: [{ appKey }, { slug }], deletedAt: null } });
    if (duplicate) throw new ConflictException('Marketplace app key or slug already exists');
    const app = await this.prisma.marketplaceApp.create({ data: { tenantId, appKey, slug, name: dto.name, category: dto.category, summary: dto.summary, description: dto.description, developerName: dto.developerName, supportEmail: dto.supportEmail, partnerProfileId: dto.partnerProfileId, pricingModel: dto.pricingModel ?? 'free', visibility: dto.visibility ?? 'private', status: dto.status ?? 'draft', riskLevel: dto.riskLevel ?? 'low', iconUrl: dto.iconUrl, documentationUrl: dto.documentationUrl, requiredScopes: dto.requiredScopes ?? [], supportedModules: dto.supportedModules ?? [], supportedIndustries: dto.supportedIndustries ?? [], metadata: dto.metadata ?? {}, publishedAt: dto.status === 'published' ? new Date() : undefined } });
    await this.publish('marketplace.app.created', { type: 'marketplace_app', id: app.id }, { appKey: app.appKey, category: app.category, status: app.status });
    return app;
  }

  async createVersion(appId: string, dto: CreateMarketplaceVersionDto) {
    const tenantId = this.context.currentTenantId();
    await this.requireApp(appId);
    const version = await this.prisma.marketplaceAppVersion.create({ data: { tenantId, appId, version: dto.version, releaseNotes: dto.releaseNotes, manifest: dto.manifest ?? {}, sdkVersion: dto.sdkVersion, minimumNexoraVersion: dto.minimumNexoraVersion, checksum: dto.checksum, status: dto.status ?? 'draft', metadata: dto.metadata ?? {}, publishedAt: dto.status === 'published' ? new Date() : undefined } });
    if (version.status === 'published') await this.prisma.marketplaceApp.update({ where: { id: appId }, data: { latestVersion: version.version, status: 'published', publishedAt: new Date() } });
    return version;
  }

  async createPermission(appId: string, dto: CreateMarketplacePermissionDto) {
    const tenantId = this.context.currentTenantId();
    await this.requireApp(appId);
    return this.prisma.marketplacePermission.create({ data: { tenantId, appId, permissionKey: dto.permissionKey, name: dto.name, category: dto.category, description: dto.description, riskLevel: dto.riskLevel ?? 'low', required: dto.required ?? false, defaultGrant: dto.defaultGrant ?? false, conditions: dto.conditions ?? {}, metadata: dto.metadata ?? {} } });
  }

  installations(status?: string) {
    return this.prisma.marketplaceInstallation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, deletedAt: null }, include: { app: true, version: true }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async installApp(appId: string, dto: InstallMarketplaceAppDto) {
    const tenantId = this.context.currentTenantId();
    await this.requireApp(appId);
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const installationScope = dto.installationScope ?? (workspaceId ? 'workspace' : 'tenant');
    if (installationScope === 'workspace' && !workspaceId) throw new BadRequestException('Workspace installation requires a workspace context or workspaceId');
    const existing = await this.prisma.marketplaceInstallation.findFirst({ where: { tenantId, appId, workspaceId: workspaceId ?? null, installationScope, status: { not: 'uninstalled' }, deletedAt: null } });
    if (existing) throw new ConflictException('Marketplace app is already installed for this scope');
    const version = dto.versionId ? await this.prisma.marketplaceAppVersion.findFirst({ where: { tenantId, appId, id: dto.versionId, deletedAt: null } }) : await this.prisma.marketplaceAppVersion.findFirst({ where: { tenantId, appId, status: 'published', deletedAt: null }, orderBy: { createdAt: 'desc' } });
    const installation = await this.prisma.marketplaceInstallation.create({ data: { tenantId, organizationId: dto.organizationId, businessId: dto.businessId, workspaceId, appId, versionId: version?.id, installationScope, status: 'installed', installedByUserId: this.context.context()?.userId, configuration: dto.configuration ?? {}, grantedScopes: dto.grantedScopes ?? [], healthStatus: 'healthy', lastCheckedAt: new Date(), metadata: dto.metadata ?? {} }, include: { app: true, version: true } });
    await this.publish('marketplace.app.installed', { type: 'marketplace_installation', id: installation.id }, { appId, versionId: installation.versionId, installationScope, workspaceId });
    return installation;
  }

  async uninstall(id: string) {
    const tenantId = this.context.currentTenantId();
    const installation = await this.prisma.marketplaceInstallation.findFirst({ where: { tenantId, id, deletedAt: null } });
    if (!installation) throw new NotFoundException('Marketplace installation not found');
    const updated = await this.prisma.marketplaceInstallation.update({ where: { id }, data: { status: 'uninstalled', uninstalledAt: new Date(), healthStatus: 'inactive' }, include: { app: true, version: true } });
    await this.publish('marketplace.app.uninstalled', { type: 'marketplace_installation', id }, { appId: updated.appId, workspaceId: updated.workspaceId, installationScope: updated.installationScope });
    return updated;
  }

  private async requireApp(appId: string) {
    const app = await this.prisma.marketplaceApp.findFirst({ where: { tenantId: this.context.currentTenantId(), id: appId, deletedAt: null } });
    if (!app) throw new NotFoundException('Marketplace app not found');
    return app;
  }

  private publish(type: 'marketplace.app.created' | 'marketplace.app.installed' | 'marketplace.app.uninstalled', subject: { type: string; id: string }, payload: Record<string, unknown>) {
    return this.events.publish({ tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId(), type, source: 'marketplace-platform', subject, payload, actorUserId: this.context.context()?.userId });
  }

  private slugify(value: string) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
}