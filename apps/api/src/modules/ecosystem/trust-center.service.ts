import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateComplianceArtifactDto, CreateSecurityCertificationDto, CreateTrustReportDto } from './dto/ecosystem.dto';

@Injectable()
export class TrustCenterService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  reports(reportType?: string, status?: string, visibility?: string) {
    return this.prisma.trustReport.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, reportType: reportType ?? undefined, status: status ?? undefined, visibility: visibility ?? undefined, deletedAt: null },
      include: { securityCertifications: true, complianceArtifacts: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createReport(dto: CreateTrustReportDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.trustReport.create({ data: { tenantId, workspaceId, reportKey: dto.reportKey ?? 'trust-report-' + randomUUID(), title: dto.title, reportType: dto.reportType ?? 'security', status: dto.status ?? 'draft', visibility: dto.visibility ?? 'private', summary: dto.summary, periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined, periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined, publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, evidence: dto.evidence ?? [], metrics: dto.metrics ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'trust.report.created', source: 'ecosystem', subject: { type: 'trust_report', id: record.id }, payload: { reportKey: record.reportKey, reportType: record.reportType, status: record.status, visibility: record.visibility }, actorUserId: this.context.context()?.userId });
    return record;
  }

  certifications(certificationType?: string, status?: string, authority?: string) {
    return this.prisma.securityCertification.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, certificationType: certificationType ?? undefined, status: status ?? undefined, authority: authority ?? undefined, deletedAt: null },
      include: { trustReport: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createCertification(dto: CreateSecurityCertificationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.securityCertification.create({ data: { tenantId, workspaceId, trustReportId: dto.trustReportId, certificationKey: dto.certificationKey ?? 'security-certification-' + randomUUID(), name: dto.name, authority: dto.authority, certificationType: dto.certificationType ?? 'security', status: dto.status ?? 'active', issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, scope: dto.scope ?? [], evidenceUrl: dto.evidenceUrl, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'security.certification.created', source: 'ecosystem', subject: { type: 'security_certification', id: record.id }, payload: { certificationKey: record.certificationKey, authority: record.authority, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  artifacts(artifactType?: string, framework?: string, status?: string) {
    return this.prisma.complianceArtifact.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, artifactType: artifactType ?? undefined, framework: framework ?? undefined, status: status ?? undefined, deletedAt: null },
      include: { trustReport: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  async createArtifact(dto: CreateComplianceArtifactDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.complianceArtifact.create({ data: { tenantId, workspaceId, trustReportId: dto.trustReportId, artifactKey: dto.artifactKey ?? 'compliance-artifact-' + randomUUID(), title: dto.title, artifactType: dto.artifactType ?? 'policy', framework: dto.framework, status: dto.status ?? 'active', classification: dto.classification ?? 'confidential', storageUri: dto.storageUri, version: dto.version, publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, accessRules: dto.accessRules ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'compliance.artifact.created', source: 'ecosystem', subject: { type: 'compliance_artifact', id: record.id }, payload: { artifactKey: record.artifactKey, artifactType: record.artifactType, framework: record.framework, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [reports, certifications, artifacts] = await Promise.all([this.reports(), this.certifications(), this.artifacts()]);
    return {
      reports,
      certifications,
      artifacts,
      summary: {
        reportCount: reports.length,
        publicReportCount: reports.filter((report: { visibility: string }) => report.visibility === 'public').length,
        activeCertificationCount: certifications.filter((certification: { status: string }) => certification.status === 'active').length,
        artifactCount: artifacts.length,
        expiringCertificationCount: certifications.filter((certification: { expiresAt: Date | null }) => certification.expiresAt && certification.expiresAt.getTime() < Date.now() + 1000 * 60 * 60 * 24 * 45).length,
      },
    };
  }
}
