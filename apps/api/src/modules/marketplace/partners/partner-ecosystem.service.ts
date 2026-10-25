import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreatePartnerCertificationDto, CreatePartnerProfileDto, CreatePartnerServiceListingDto } from '../dto/marketplace.dto';

@Injectable()
export class PartnerEcosystemService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  partners(type?: string, status?: string) {
    return this.prisma.partnerProfile.findMany({ where: { tenantId: this.context.currentTenantId(), partnerType: type ?? undefined, status: status ?? undefined, deletedAt: null }, include: { certifications: { where: { deletedAt: null } }, serviceListings: { where: { deletedAt: null } }, apps: { where: { deletedAt: null } } }, orderBy: [{ tier: 'asc' }, { name: 'asc' }], take: 100 });
  }

  async createPartner(dto: CreatePartnerProfileDto) {
    const tenantId = this.context.currentTenantId();
    const partnerKey = dto.partnerKey ?? this.slugify(dto.name);
    const partner = await this.prisma.partnerProfile.create({ data: { tenantId, partnerKey, name: dto.name, partnerType: dto.partnerType, tier: dto.tier ?? 'registered', status: dto.status ?? 'active', websiteUrl: dto.websiteUrl, contactEmail: dto.contactEmail, countryCode: dto.countryCode, description: dto.description, capabilities: dto.capabilities ?? [], metadata: dto.metadata ?? {}, certifiedAt: dto.status === 'active' && dto.tier && dto.tier !== 'registered' ? new Date() : undefined } });
    await this.events.publish({ tenantId, workspaceId: this.context.currentWorkspaceId(), type: 'partner.created', source: 'partner-ecosystem', subject: { type: 'partner_profile', id: partner.id }, payload: { partnerKey: partner.partnerKey, partnerType: partner.partnerType, tier: partner.tier }, actorUserId: this.context.context()?.userId });
    return partner;
  }

  certifications(partnerId: string) {
    return this.prisma.partnerCertification.findMany({ where: { tenantId: this.context.currentTenantId(), partnerProfileId: partnerId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async addCertification(partnerId: string, dto: CreatePartnerCertificationDto) {
    const tenantId = this.context.currentTenantId();
    await this.requirePartner(partnerId);
    const certification = await this.prisma.partnerCertification.create({ data: { tenantId, partnerProfileId: partnerId, certificationKey: dto.certificationKey, certificationType: dto.certificationType, status: dto.status ?? 'pending', issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, evidence: dto.evidence ?? {}, metadata: dto.metadata ?? {} } });
    if (certification.status === 'active') await this.prisma.partnerProfile.update({ where: { id: partnerId }, data: { certifiedAt: certification.issuedAt ?? new Date() } });
    return certification;
  }

  services(type?: string) {
    return this.prisma.partnerServiceListing.findMany({ where: { tenantId: this.context.currentTenantId(), serviceType: type ?? undefined, deletedAt: null }, include: { partnerProfile: true }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async addService(partnerId: string, dto: CreatePartnerServiceListingDto) {
    const tenantId = this.context.currentTenantId();
    await this.requirePartner(partnerId);
    return this.prisma.partnerServiceListing.create({ data: { tenantId, partnerProfileId: partnerId, title: dto.title, serviceType: dto.serviceType, description: dto.description, industries: dto.industries ?? [], regions: dto.regions ?? [], pricingModel: dto.pricingModel ?? 'custom', status: dto.status ?? 'active', metadata: dto.metadata ?? {} }, include: { partnerProfile: true } });
  }

  private async requirePartner(partnerId: string) {
    const partner = await this.prisma.partnerProfile.findFirst({ where: { tenantId: this.context.currentTenantId(), id: partnerId, deletedAt: null } });
    if (!partner) throw new NotFoundException('Partner profile not found');
    return partner;
  }

  private slugify(value: string) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
}