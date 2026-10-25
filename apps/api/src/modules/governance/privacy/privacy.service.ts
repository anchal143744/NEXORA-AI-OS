import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CompletePrivacyRequestDto, CreatePrivacyRequestDto, UpsertConsentDto } from '../dto/governance.dto';

@Injectable()
export class PrivacyAutomationService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  workflows() {
    return {
      gdpr: ['right_to_access', 'right_to_deletion', 'right_to_rectification', 'data_export', 'consent_review'],
      ccpa: ['know_request', 'delete_request', 'opt_out_request'],
      verification: ['identity_check', 'scope_discovery', 'data_collection', 'approval', 'fulfillment', 'evidence_capture'],
      automation: { dueDays: 30, escalationDays: 21, evidenceRequired: true },
    };
  }

  consents(subjectType?: string, status?: string) {
    return this.prisma.privacyConsentRecord.findMany({ where: { tenantId: this.context.currentTenantId(), subjectType: subjectType ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async upsertConsent(dto: UpsertConsentDto) {
    const tenantId = this.context.currentTenantId();
    const existing = await this.prisma.privacyConsentRecord.findFirst({ where: { tenantId, subjectType: dto.subjectType, subjectId: dto.subjectId, consentKey: dto.consentKey, deletedAt: null } });
    const status = dto.status ?? 'granted';
    const data = { tenantId, workspaceId: this.context.currentWorkspaceId(), subjectType: dto.subjectType, subjectId: dto.subjectId, consentKey: dto.consentKey, purpose: dto.purpose, lawfulBasis: dto.lawfulBasis, status, source: dto.source, grantedAt: status === 'granted' ? new Date() : undefined, withdrawnAt: status === 'withdrawn' ? new Date() : undefined, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, evidence: dto.evidence ?? {}, metadata: dto.metadata ?? {} };
    const record = existing ? await this.prisma.privacyConsentRecord.update({ where: { id: existing.id }, data }) : await this.prisma.privacyConsentRecord.create({ data });
    await this.events.publish({ tenantId, workspaceId: record.workspaceId ?? undefined, type: 'privacy.consent.updated', source: 'privacy-automation', subject: { type: 'privacy_consent_record', id: record.id }, payload: { subjectType: record.subjectType, subjectId: record.subjectId, consentKey: record.consentKey, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  requests(type?: string, status?: string) {
    return this.prisma.privacyRequest.findMany({ where: { tenantId: this.context.currentTenantId(), requestType: type ?? undefined, status: status ?? undefined, deletedAt: null }, include: { workflowRuns: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async createRequest(dto: CreatePrivacyRequestDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = this.context.currentWorkspaceId();
    const request = await this.prisma.privacyRequest.create({ data: { tenantId, workspaceId, requestKey: dto.requestKey ?? `privacy-${randomUUID()}`, requestType: dto.requestType, subjectType: dto.subjectType, subjectId: dto.subjectId, subjectEmail: dto.subjectEmail, framework: dto.framework ?? 'GDPR', status: 'open', priority: dto.priority ?? 'normal', dueAt: dto.dueAt ? new Date(dto.dueAt) : this.defaultDueDate(), requesterUserId: this.context.context()?.userId, assignedUserId: dto.assignedUserId, metadata: dto.metadata ?? {}, workflowRuns: { create: { tenantId, workspaceId, workflowKey: `${dto.framework ?? 'GDPR'}-${dto.requestType}`, status: 'queued', steps: this.stepsFor(dto.requestType), metadata: { automation: true } } } }, include: { workflowRuns: true } });
    await this.events.publish({ tenantId, workspaceId, type: 'privacy.request.created', source: 'privacy-automation', subject: { type: 'privacy_request', id: request.id }, payload: { requestType: request.requestType, framework: request.framework, subjectType: request.subjectType, status: request.status }, actorUserId: this.context.context()?.userId });
    return request;
  }

  async runWorkflow(id: string) {
    const request = await this.requireRequest(id);
    const run = await this.prisma.privacyWorkflowRun.create({ data: { tenantId: request.tenantId, workspaceId: request.workspaceId, privacyRequestId: id, workflowKey: `${request.framework}-${request.requestType}-automation`, status: 'running', currentStep: 'scope_discovery', steps: this.stepsFor(request.requestType), startedAt: new Date(), metadata: { source: 'privacy-automation' } } });
    return run;
  }

  async completeRequest(id: string, dto: CompletePrivacyRequestDto) {
    const request = await this.requireRequest(id);
    const updated = await this.prisma.privacyRequest.update({ where: { id }, data: { status: 'completed', verificationStatus: dto.verificationStatus ?? 'verified', completedAt: new Date(), result: dto.result ?? { completed: true } } });
    await this.prisma.privacyWorkflowRun.updateMany({ where: { tenantId: request.tenantId, privacyRequestId: id, status: { in: ['queued', 'running'] } }, data: { status: 'completed', currentStep: 'fulfillment_complete', completedAt: new Date(), output: dto.result ?? { completed: true } } });
    await this.events.publish({ tenantId: request.tenantId, workspaceId: request.workspaceId ?? undefined, type: 'privacy.request.completed', source: 'privacy-automation', subject: { type: 'privacy_request', id }, payload: { requestType: request.requestType, framework: request.framework, verificationStatus: updated.verificationStatus }, actorUserId: this.context.context()?.userId });
    return updated;
  }

  async accessPackage(id: string) {
    const request = await this.requireRequest(id);
    return { requestId: id, subjectType: request.subjectType, subjectId: request.subjectId, packageType: 'subject_access', generatedAt: new Date().toISOString(), sections: ['profile', 'activity', 'records', 'consents', 'retention'], delivery: { encrypted: true, expiresInDays: 7 } };
  }

  async deletionPlan(id: string) {
    const request = await this.requireRequest(id);
    return { requestId: id, requestType: request.requestType, status: 'planned', steps: ['verify_identity', 'locate_records', 'check_legal_hold', 'schedule_deletion', 'capture_evidence'], safeguards: ['retention_policy_check', 'compliance_exception_review', 'recovery_window'] };
  }

  private async requireRequest(id: string) {
    const request = await this.prisma.privacyRequest.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!request) throw new NotFoundException('Privacy request not found');
    return request;
  }

  private defaultDueDate() { const date = new Date(); date.setDate(date.getDate() + 30); return date; }
  private stepsFor(type: string) { return ['identity_check', 'scope_discovery', type === 'deletion' ? 'legal_hold_review' : 'data_collection', 'approval', 'fulfillment', 'evidence_capture']; }
}