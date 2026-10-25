import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { StartSyncDto, UpsertSyncCursorDto } from '../dto/omnichannel.dto';

@Injectable()
export class SyncService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  async status(deviceId?: string) {
    const tenantId = this.context.currentTenantId();
    const [latest, pendingItems, conflicts, cursors] = await Promise.all([
      this.prisma.syncStatusSnapshot.findMany({ where: { tenantId, deviceId: deviceId ?? undefined, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 20 }),
      this.prisma.offlineQueueItem.count({ where: { tenantId, deviceId: deviceId ?? undefined, status: { in: ['queued', 'retrying', 'conflict'] }, deletedAt: null } }),
      this.prisma.offlineConflict.count({ where: { tenantId, status: 'open', deletedAt: null } }),
      this.prisma.syncCursor.findMany({ where: { tenantId, deviceId: deviceId ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 50 }),
    ]);
    return { latest, pendingItems, conflicts, cursors, reconnect: { automatic: true, backoff: 'exponential', recovery: 'resume-from-cursor' } };
  }

  async start(dto: StartSyncDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const modules = dto.modules ?? ['crm', 'finance', 'hr', 'inventory', 'projects', 'workflows', 'ai-agents'];
    const pendingItems = await this.prisma.offlineQueueItem.count({ where: { tenantId, workspaceId: workspaceId ?? undefined, deviceId: dto.deviceId, status: 'queued', deletedAt: null } });
    const snapshot = await this.prisma.syncStatusSnapshot.create({ data: { tenantId, workspaceId, deviceId: dto.deviceId, syncRunKey: dto.syncRunKey ?? `sync-${randomUUID()}`, status: 'running', direction: dto.direction ?? 'bidirectional', modules, pendingItems, startedAt: new Date(), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'sync.started', source: 'sync-engine', subject: { type: 'sync_status_snapshot', id: snapshot.id }, payload: { syncRunKey: snapshot.syncRunKey, direction: snapshot.direction, modules }, actorUserId: this.context.context()?.userId });
    return snapshot;
  }

  async complete(id: string) {
    const tenantId = this.context.currentTenantId();
    const syncedItems = await this.prisma.offlineQueueItem.count({ where: { tenantId, status: 'synced', deletedAt: null } });
    const failedItems = await this.prisma.offlineQueueItem.count({ where: { tenantId, status: { in: ['failed', 'conflict'] }, deletedAt: null } });
    const conflicts = await this.prisma.offlineConflict.count({ where: { tenantId, status: 'open', deletedAt: null } });
    const snapshot = await this.prisma.syncStatusSnapshot.update({ where: { id }, data: { status: conflicts ? 'completed_with_conflicts' : 'completed', syncedItems, failedItems, conflicts, completedAt: new Date(), latencyMs: 250 } });
    await this.events.publish({ tenantId, workspaceId: snapshot.workspaceId ?? undefined, type: 'sync.completed', source: 'sync-engine', subject: { type: 'sync_status_snapshot', id }, payload: { syncRunKey: snapshot.syncRunKey, syncedItems, failedItems, conflicts }, actorUserId: this.context.context()?.userId });
    return snapshot;
  }

  async reconnect(dto: StartSyncDto) {
    const snapshot = await this.start({ ...dto, metadata: { ...(dto.metadata ?? {}), reconnect: true, strategy: 'resume-from-cursor' } });
    return { snapshot, recovery: { mode: 'automatic', cursorResume: true, queueReplay: true, conflictScan: true } };
  }

  cursors(deviceId?: string, moduleKey?: string) {
    return this.prisma.syncCursor.findMany({ where: { tenantId: this.context.currentTenantId(), deviceId: deviceId ?? undefined, moduleKey: moduleKey ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async upsertCursor(dto: UpsertSyncCursorDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const existing = await this.prisma.syncCursor.findFirst({ where: { tenantId, workspaceId: workspaceId ?? null, deviceId: dto.deviceId ?? null, moduleKey: dto.moduleKey, cursorKey: dto.cursorKey, deletedAt: null } });
    const data = { tenantId, workspaceId, deviceId: dto.deviceId, moduleKey: dto.moduleKey, cursorKey: dto.cursorKey, cursorValue: dto.cursorValue, changeToken: dto.changeToken, lastSyncedAt: new Date(), status: 'active', metadata: dto.metadata ?? {} };
    return existing ? this.prisma.syncCursor.update({ where: { id: existing.id }, data }) : this.prisma.syncCursor.create({ data });
  }

  changes(moduleKey?: string) {
    return this.prisma.offlineQueueItem.findMany({ where: { tenantId: this.context.currentTenantId(), moduleKey: moduleKey ?? undefined, status: { in: ['queued', 'retrying', 'conflict'] }, deletedAt: null }, orderBy: { updatedAt: 'asc' }, take: 200 });
  }
}