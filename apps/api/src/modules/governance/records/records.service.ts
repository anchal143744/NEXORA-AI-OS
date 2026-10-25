import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateArchiveJobDto, CreateLifecycleActionDto } from '../dto/governance.dto';

@Injectable()
export class RecordsLifecycleService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  actions(status?: string, actionType?: string) {
    return this.prisma.recordsLifecycleAction.findMany({ where: { tenantId: this.context.currentTenantId(), status: status ?? undefined, actionType: actionType ?? undefined, deletedAt: null }, include: { policy: true }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async createAction(dto: CreateLifecycleActionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const policy = dto.policyId ? await this.prisma.recordsLifecyclePolicy.findFirst({ where: { tenantId, id: dto.policyId, deletedAt: null } }) : await this.prisma.recordsLifecyclePolicy.findFirst({ where: { tenantId, workspaceId: workspaceId ?? undefined, recordType: dto.recordType, enabled: true, deletedAt: null }, orderBy: { updatedAt: 'desc' } });
    const recoveryExpiresAt = dto.actionType === 'delete' ? this.recoveryDate(policy?.recoveryWindowDays ?? 30) : undefined;
    const action = await this.prisma.recordsLifecycleAction.create({ data: { tenantId, workspaceId, policyId: policy?.id, recordType: dto.recordType, recordId: dto.recordId, actionType: dto.actionType, status: dto.scheduledAt ? 'scheduled' : 'ready', scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined, recoveryExpiresAt, legalHold: dto.legalHold ?? false, performedByUserId: this.context.context()?.userId, evidence: dto.evidence ?? {}, metadata: dto.metadata ?? {} }, include: { policy: true } });
    await this.events.publish({ tenantId, workspaceId, type: 'records.lifecycle.action.created', source: 'records-lifecycle-engine', subject: { type: 'records_lifecycle_action', id: action.id }, payload: { recordType: action.recordType, recordId: action.recordId, actionType: action.actionType, status: action.status }, actorUserId: this.context.context()?.userId });
    return action;
  }

  async executeAction(id: string) {
    const action = await this.requireAction(id);
    const updated = await this.prisma.recordsLifecycleAction.update({ where: { id }, data: { status: 'executed', executedAt: new Date(), evidence: { ...(action.evidence ?? {}), executed: true, executedAt: new Date().toISOString() } }, include: { policy: true } });
    return updated;
  }

  async recoverAction(id: string) {
    await this.requireAction(id);
    return this.prisma.recordsLifecycleAction.update({ where: { id }, data: { status: 'recovered', evidence: { recovered: true, recoveredAt: new Date().toISOString() } }, include: { policy: true } });
  }

  archives(status?: string) {
    return this.prisma.recordsArchiveJob.findMany({ where: { tenantId: this.context.currentTenantId(), status: status ?? undefined, deletedAt: null }, include: { policy: true }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async createArchive(dto: CreateArchiveJobDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const archive = await this.prisma.recordsArchiveJob.create({ data: { tenantId, workspaceId, policyId: dto.policyId, archiveKey: dto.archiveKey ?? `archive-${dto.recordType}-${randomUUID()}`, recordType: dto.recordType, status: 'queued', totalRecords: dto.totalRecords ?? 0, storageLocation: dto.storageLocation, manifest: dto.manifest ?? {}, metadata: dto.metadata ?? {} }, include: { policy: true } });
    await this.events.publish({ tenantId, workspaceId, type: 'records.archive.created', source: 'records-lifecycle-engine', subject: { type: 'records_archive_job', id: archive.id }, payload: { archiveKey: archive.archiveKey, recordType: archive.recordType, totalRecords: archive.totalRecords }, actorUserId: this.context.context()?.userId });
    return archive;
  }

  async completeArchive(id: string) {
    const archive = await this.prisma.recordsArchiveJob.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!archive) throw new NotFoundException('Records archive job not found');
    return this.prisma.recordsArchiveJob.update({ where: { id }, data: { status: 'completed', archivedRecords: archive.totalRecords, completedAt: new Date() }, include: { policy: true } });
  }

  private async requireAction(id: string) {
    const action = await this.prisma.recordsLifecycleAction.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!action) throw new NotFoundException('Records lifecycle action not found');
    return action;
  }

  private recoveryDate(days: number) { const date = new Date(); date.setDate(date.getDate() + days); return date; }
}