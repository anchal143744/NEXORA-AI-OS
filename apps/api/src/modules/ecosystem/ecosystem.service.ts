import { Injectable } from '@nestjs/common';
import { DeveloperPortalService } from './developer-portal.service';
import { EcosystemCatalogService } from './ecosystem-catalog.service';
import { TrustCenterService } from './trust-center.service';

@Injectable()
export class EcosystemService {
  constructor(private readonly trust: TrustCenterService, private readonly developers: DeveloperPortalService, private readonly catalog: EcosystemCatalogService) {}

  async center() {
    const [trust, developerPortal, ecosystem] = await Promise.all([this.trust.dashboard(), this.developers.dashboard(), this.catalog.dashboard()]);
    return {
      trust,
      developerPortal,
      ecosystem,
      summary: {
        publicTrustReports: trust.summary.publicReportCount,
        activeCertifications: trust.summary.activeCertificationCount,
        developerAccounts: developerPortal.summary.developerAccountCount,
        approvedApplications: developerPortal.summary.approvedApplicationCount,
        marketplaceApplications: ecosystem.summary.marketplaceApplicationCount,
        availableIntegrations: ecosystem.summary.availableIntegrationCount,
        openStatusIncidents: ecosystem.summary.openIncidentCount,
      },
      recommendations: [
        { type: 'trust_center', priority: trust.summary.expiringCertificationCount > 0 ? 'high' : 'medium', action: 'Review expiring certifications and refresh customer-facing trust evidence.' },
        { type: 'developer_portal', priority: developerPortal.summary.approvedApplicationCount === 0 ? 'medium' : 'low', action: 'Move approved developer applications into marketplace publication flow.' },
        { type: 'status_center', priority: ecosystem.summary.openIncidentCount > 0 ? 'high' : 'low', action: 'Publish status updates for open ecosystem incidents and affected integrations.' },
      ],
    };
  }

  developerPortal() { return this.developers.dashboard(); }
  apiDocs() { return this.catalog.dashboard(); }
  sdkCenter() { return this.catalog.dashboard(); }
  integrationCatalog() { return this.catalog.dashboard(); }
  partnerMarketplace() { return this.catalog.dashboard(); }
  statusCenter() { return this.catalog.dashboard(); }
}
