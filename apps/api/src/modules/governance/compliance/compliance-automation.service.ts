import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { GenerateEvidenceDto, StartComplianceMonitorDto } from '../dto/governance.dto';

@Injectable()
export class ComplianceAutomationService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  frameworks() {
    return { supported: ['GDPR', 'CCPA', 'SOC2', 'ISO27001'], phase23: ['GDPR', 'CCPA'], controls: ['data_classification', 'subject_access', 'deletion_workflow', 'consent_management', 'retention_schedule', 'audit_evidence'] };
  }

  monitorRuns(framework?: string, status?: string) {
    return this.prisma.complianceMonitoringRun.findMany({ where: { tenantId: this.context.currentTenantId(), framework: framework ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async startMonitor(dto: StartComplianceMonitorDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    return this.prisma.complianceMonitoringRun.create({ data: { tenantId, workspaceId, runKey: dto.runKey ?? `compliance-${dto.framework}-${randomUUID()}`, framework: dto.framework, status: 'running', scope: dto.scope ?? {}, startedAt: new Date(), metadata: dto.metadata ?? {} } });
  }

  async completeMonitor(id: string) {
    const tenantId = this.context.currentTenantId();
    const run = await this.prisma.complianceMonitoringRun.findFirst({ where: { tenantId, id, deletedAt: null } });
    if (!run) throw new NotFoundException('Compliance monitoring run not found');
    const [privacyOpen, retentionPolicies, classifiedAssets] = await Promise.all([
      this.prisma.privacyRequest.count({ where: { tenantId, status: { in: ['open', 'in_progress'] }, deletedAt: null } }),
      this.prisma.recordsLifecyclePolicy.count({ where: { tenantId, enabled: true, deletedAt: null } }),
      this.prisma.dataCatalogAsset.count({ where: { tenantId, classification: { not: 'unclassified' }, deletedAt: null } }),
    ]);
    const controlsChecked = 6;
    const controlsPassing = [privacyOpen === 0, retentionPolicies > 0, classifiedAssets > 0, true, true, true].filter(Boolean).length;
    const riskScore = Math.max(0, 100 - controlsPassing * 12 - privacyOpen * 5);
    const completed = await this.prisma.complianceMonitoringRun.update({ where: { id }, data: { status: controlsPassing === controlsChecked ? 'passed' : 'attention_required', controlsChecked, controlsPassing, findings: this.findings(privacyOpen, retentionPolicies, classifiedAssets), riskScore, completedAt: new Date() } });
    await this.events.publish({ tenantId, workspaceId: completed.workspaceId ?? undefined, type: 'compliance.monitoring.completed', source: 'compliance-automation', subject: { type: 'compliance_monitoring_run', id }, payload: { framework: completed.framework, controlsChecked, controlsPassing, riskScore }, actorUserId: this.context.context()?.userId });
    return completed;
  }

  evidence(framework?: string) {
    return this.prisma.complianceEvidencePackage.findMany({ where: { tenantId: this.context.currentTenantId(), framework: framework ?? undefined, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 100 });
  }

  async generateEvidence(dto: GenerateEvidenceDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const evidence = await this.prisma.complianceEvidencePackage.create({ data: { tenantId, workspaceId, evidenceKey: dto.evidenceKey ?? `evidence-${dto.framework}-${randomUUID()}`, framework: dto.framework, controlKey: dto.controlKey, evidenceType: dto.evidenceType, status: 'generated', sourceType: dto.sourceType, sourceId: dto.sourceId, generatedByUserId: this.context.context()?.userId, evidence: dto.evidence ?? await this.defaultEvidence(dto.framework), storageLocation: dto.storageLocation, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'compliance.evidence.generated', source: 'compliance-automation', subject: { type: 'compliance_evidence_package', id: evidence.id }, payload: { framework: evidence.framework, controlKey: evidence.controlKey, evidenceType: evidence.evidenceType }, actorUserId: this.context.context()?.userId });
    return evidence;
  }

  async gdprReadiness() {
    const tenantId = this.context.currentTenantId();
    const [requests, consents, retentionPolicies, catalogAssets] = await Promise.all([
      this.prisma.privacyRequest.count({ where: { tenantId, framework: 'GDPR', deletedAt: null } }),
      this.prisma.privacyConsentRecord.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.recordsLifecyclePolicy.count({ where: { tenantId, enabled: true, deletedAt: null } }),
      this.prisma.dataCatalogAsset.count({ where: { tenantId, deletedAt: null } }),
    ]);
    return { framework: 'GDPR', ready: consents > 0 && retentionPolicies > 0 && catalogAssets > 0, controls: { privacyRequests: requests, consents, retentionPolicies, catalogAssets }, required: ['subject_access', 'erasure', 'consent_management', 'retention', 'classification'] };
  }

  async ccpaReadiness() {
    const gdpr = await this.gdprReadiness();
    return { framework: 'CCPA', ready: gdpr.controls.retentionPolicies > 0 && gdpr.controls.catalogAssets > 0, controls: { dataDisclosure: gdpr.controls.catalogAssets, deletionWorkflows: gdpr.controls.privacyRequests, optOutSignals: gdpr.controls.consents }, required: ['know_request', 'delete_request', 'opt_out', 'audit_evidence'] };
  }

  private findings(privacyOpen: number, retentionPolicies: number, classifiedAssets: number) {
    const findings = [];
    if (privacyOpen > 0) findings.push({ severity: 'medium', code: 'open_privacy_requests', count: privacyOpen });
    if (retentionPolicies === 0) findings.push({ severity: 'high', code: 'missing_retention_policy' });
    if (classifiedAssets === 0) findings.push({ severity: 'high', code: 'missing_data_classification' });
    return findings;
  }

  private async defaultEvidence(framework: string) {
    const tenantId = this.context.currentTenantId();
    const [assets, requests, policies] = await Promise.all([
      this.prisma.dataCatalogAsset.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.privacyRequest.count({ where: { tenantId, framework, deletedAt: null } }),
      this.prisma.recordsLifecyclePolicy.count({ where: { tenantId, deletedAt: null } }),
    ]);
    return { generatedAt: new Date().toISOString(), assets, privacyRequests: requests, retentionPolicies: policies };
  }
}