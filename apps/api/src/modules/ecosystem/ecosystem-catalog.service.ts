import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateApiDocumentationDto, CreateEcosystemEventDto, CreateExternalIntegrationDto, CreateMarketplaceApplicationDto, CreatePartnerListingDto, CreateSdkPackageDto, CreateStatusIncidentDto } from './dto/ecosystem.dto';

@Injectable()
export class EcosystemCatalogService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  apiDocs(status?: string, audience?: string, apiProductId?: string) {
    return this.prisma.apiDocumentation.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, audience: audience ?? undefined, apiProductId: apiProductId ?? undefined, deletedAt: null }, include: { sdkPackages: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createApiDocumentation(dto: CreateApiDocumentationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.apiDocumentation.create({ data: { tenantId, workspaceId, documentationKey: dto.documentationKey ?? 'api-docs-' + randomUUID(), title: dto.title, apiProductId: dto.apiProductId, version: dto.version ?? 'v1', status: dto.status ?? 'draft', audience: dto.audience ?? 'developers', specFormat: dto.specFormat ?? 'openapi', spec: dto.spec ?? {}, examples: dto.examples ?? [], content: dto.content, publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'api.documentation.created', source: 'ecosystem', subject: { type: 'api_documentation', id: record.id }, payload: { documentationKey: record.documentationKey, version: record.version, status: record.status, audience: record.audience }, actorUserId: this.context.context()?.userId });
    return record;
  }

  sdkPackages(language?: string, status?: string, packageManager?: string) {
    return this.prisma.sdkPackage.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, language: language ?? undefined, status: status ?? undefined, packageManager: packageManager ?? undefined, deletedAt: null }, include: { apiDocumentation: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createSdkPackage(dto: CreateSdkPackageDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.sdkPackage.create({ data: { tenantId, workspaceId, apiDocumentationId: dto.apiDocumentationId, packageKey: dto.packageKey ?? 'sdk-package-' + randomUUID(), name: dto.name, language: dto.language, version: dto.version, status: dto.status ?? 'draft', packageManager: dto.packageManager, downloadUrl: dto.downloadUrl, checksum: dto.checksum, releaseNotes: dto.releaseNotes, publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'sdk.package.created', source: 'ecosystem', subject: { type: 'sdk_package', id: record.id }, payload: { packageKey: record.packageKey, language: record.language, version: record.version, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  partnerListings(partnerType?: string, status?: string, certificationLevel?: string) {
    return this.prisma.partnerListing.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, partnerType: partnerType ?? undefined, status: status ?? undefined, certificationLevel: certificationLevel ?? undefined, deletedAt: null }, include: { marketplaceApplications: true, externalIntegrations: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createPartnerListing(dto: CreatePartnerListingDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.partnerListing.create({ data: { tenantId, workspaceId, listingKey: dto.listingKey ?? 'partner-listing-' + randomUUID(), partnerName: dto.partnerName, partnerType: dto.partnerType ?? 'technology', status: dto.status ?? 'draft', certificationLevel: dto.certificationLevel ?? 'standard', countries: dto.countries ?? [], industries: dto.industries ?? [], description: dto.description, websiteUrl: dto.websiteUrl, supportUrl: dto.supportUrl, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'partner.listing.created', source: 'ecosystem', subject: { type: 'partner_listing', id: record.id }, payload: { listingKey: record.listingKey, partnerName: record.partnerName, status: record.status, certificationLevel: record.certificationLevel }, actorUserId: this.context.context()?.userId });
    return record;
  }

  marketplaceApplications(category?: string, status?: string, pricingModel?: string) {
    return this.prisma.marketplaceApplication.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, category: category ?? undefined, status: status ?? undefined, pricingModel: pricingModel ?? undefined, deletedAt: null }, include: { developerApplication: true, partnerListing: true, externalIntegrations: true, statusIncidents: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createMarketplaceApplication(dto: CreateMarketplaceApplicationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.marketplaceApplication.create({ data: { tenantId, workspaceId, developerApplicationId: dto.developerApplicationId, partnerListingId: dto.partnerListingId, marketplaceKey: dto.marketplaceKey ?? 'marketplace-app-' + randomUUID(), name: dto.name, category: dto.category ?? 'integration', status: dto.status ?? 'draft', pricingModel: dto.pricingModel ?? 'free', installCount: dto.installCount ?? 0, rating: dto.rating ?? 0, description: dto.description, screenshots: dto.screenshots ?? [], permissions: dto.permissions ?? [], publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'marketplace.application.created', source: 'ecosystem', subject: { type: 'marketplace_application', id: record.id }, payload: { marketplaceKey: record.marketplaceKey, category: record.category, status: record.status, pricingModel: record.pricingModel }, actorUserId: this.context.context()?.userId });
    return record;
  }

  integrations(provider?: string, category?: string, status?: string) {
    return this.prisma.externalIntegration.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, provider: provider ?? undefined, category: category ?? undefined, status: status ?? undefined, deletedAt: null }, include: { partnerListing: true, marketplaceApplication: true, statusIncidents: true, ecosystemEvents: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createIntegration(dto: CreateExternalIntegrationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.externalIntegration.create({ data: { tenantId, workspaceId, partnerListingId: dto.partnerListingId, marketplaceApplicationId: dto.marketplaceApplicationId, integrationKey: dto.integrationKey ?? 'external-integration-' + randomUUID(), name: dto.name, provider: dto.provider, category: dto.category ?? 'business', status: dto.status ?? 'available', authType: dto.authType ?? 'oauth2', capabilities: dto.capabilities ?? [], configurationSchema: dto.configurationSchema ?? {}, healthStatus: dto.healthStatus ?? 'unknown', lastVerifiedAt: dto.lastVerifiedAt ? new Date(dto.lastVerifiedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'external.integration.created', source: 'ecosystem', subject: { type: 'external_integration', id: record.id }, payload: { integrationKey: record.integrationKey, provider: record.provider, status: record.status, healthStatus: record.healthStatus }, actorUserId: this.context.context()?.userId });
    return record;
  }

  statusIncidents(severity?: string, status?: string, incidentType?: string) {
    return this.prisma.statusIncident.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, severity: severity ?? undefined, status: status ?? undefined, incidentType: incidentType ?? undefined, deletedAt: null }, include: { externalIntegration: true, marketplaceApplication: true }, orderBy: { startedAt: 'desc' }, take: 100 });
  }

  async createStatusIncident(dto: CreateStatusIncidentDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.statusIncident.create({ data: { tenantId, workspaceId, externalIntegrationId: dto.externalIntegrationId, marketplaceApplicationId: dto.marketplaceApplicationId, incidentKey: dto.incidentKey ?? 'status-incident-' + randomUUID(), title: dto.title, incidentType: dto.incidentType ?? 'availability', severity: dto.severity ?? 'minor', status: dto.status ?? 'investigating', impact: dto.impact ?? 'partial', startedAt: dto.startedAt ? new Date(dto.startedAt) : new Date(), resolvedAt: dto.resolvedAt ? new Date(dto.resolvedAt) : undefined, updates: dto.updates ?? [], affectedComponents: dto.affectedComponents ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'status.incident.created', source: 'ecosystem', subject: { type: 'status_incident', id: record.id }, payload: { incidentKey: record.incidentKey, severity: record.severity, status: record.status, impact: record.impact }, actorUserId: this.context.context()?.userId });
    return record;
  }

  ecosystemEvents(eventType?: string, severity?: string, source?: string) {
    return this.prisma.ecosystemEvent.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, eventType: eventType ?? undefined, severity: severity ?? undefined, source: source ?? undefined, deletedAt: null }, include: { developerApplication: true, externalIntegration: true }, orderBy: { occurredAt: 'desc' }, take: 100 });
  }

  async createEcosystemEvent(dto: CreateEcosystemEventDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.ecosystemEvent.create({ data: { tenantId, workspaceId, developerApplicationId: dto.developerApplicationId, externalIntegrationId: dto.externalIntegrationId, eventKey: dto.eventKey ?? 'ecosystem-event-' + randomUUID(), eventType: dto.eventType, source: dto.source ?? 'ecosystem', subjectType: dto.subjectType, subjectId: dto.subjectId, severity: dto.severity ?? 'info', payload: dto.payload ?? {}, occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(), processedAt: dto.processedAt ? new Date(dto.processedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'ecosystem.event.created', source: 'ecosystem', subject: { type: 'ecosystem_event', id: record.id }, payload: { eventKey: record.eventKey, eventType: record.eventType, severity: record.severity, source: record.source }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [docs, sdks, partners, apps, integrations, incidents, events] = await Promise.all([this.apiDocs(), this.sdkPackages(), this.partnerListings(), this.marketplaceApplications(), this.integrations(), this.statusIncidents(), this.ecosystemEvents()]);
    return {
      docs,
      sdks,
      partners,
      apps,
      integrations,
      incidents,
      events,
      summary: {
        apiDocumentationCount: docs.length,
        sdkPackageCount: sdks.length,
        partnerListingCount: partners.length,
        marketplaceApplicationCount: apps.length,
        availableIntegrationCount: integrations.filter((integration: { status: string }) => integration.status === 'available').length,
        openIncidentCount: incidents.filter((incident: { status: string }) => incident.status !== 'resolved').length,
        ecosystemEventCount: events.length,
      },
    };
  }
}
