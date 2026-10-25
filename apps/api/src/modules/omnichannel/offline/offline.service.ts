import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateOfflineStoreDto, QueueOfflineOperationDto, ResolveOfflineConflictDto, UpsertCachePolicyDto, UpsertOfflineModulePolicyDto } from '../dto/omnichannel.dto';

@Injectable()
export class OfflineService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  policies() {
    const tenantId = this.context.currentTenantId();
    return Promise.all([
      this.prisma.localCachePolicy.findMany({ where: { tenantId, deletedAt: null }, orderBy: { moduleKey: 'asc' } }),
      this.prisma.offlineModulePolicy.findMany({ where: { tenantId, deletedAt: null }, orderBy: { moduleKey: 'asc' } }),
    ]).then(([cachePolicies, modulePolicies]) => ({ cachePolicies, modulePolicies, supportedModules: ['crm', 'finance', 'hr', 'inventory', 'projects', 'workflows', 'ai-agents'] }));
  }

  stores(moduleKey?: string) {
    return this.prisma.offlineStore.findMany({ where: { tenantId: this.context.currentTenantId(), moduleKey: moduleKey ?? undefined, deletedAt: null }, include: { device: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  createStore(dto: CreateOfflineStoreDto) {
    const tenantId = this.context.currentTenantId();
    return this.prisma.offlineStore.create({ data: { tenantId, workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), deviceId: dto.deviceId, storeKey: dto.storeKey ?? `${dto.storeType}-${dto.moduleKey ?? 'core'}-${randomUUID()}`, storeType: dto.storeType, moduleKey: dto.moduleKey, encryptionStatus: dto.encryptionStatus ?? 'encrypted', retentionPolicy: dto.retentionPolicy ?? { maxAgeDays: 30, purgeOnDeviceRevoke: true }, maxSizeMb: dto.maxSizeMb ?? 256, currentSizeMb: 0, metadata: dto.metadata ?? {} }, include: { device: true } });
  }

  queue(status?: string, moduleKey?: string) {
    return this.prisma.offlineQueueItem.findMany({ where: { tenantId: this.context.currentTenantId(), status: status ?? undefined, moduleKey: moduleKey ?? undefined, deletedAt: null }, include: { device: true, offlineStore: true, conflicts: { where: { deletedAt: null } } }, orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }], take: 200 });
  }

  async queueOperation(dto: QueueOfflineOperationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const item = await this.prisma.offlineQueueItem.create({ data: { tenantId, workspaceId, deviceId: dto.deviceId, offlineStoreId: dto.offlineStoreId, queueType: dto.queueType, moduleKey: dto.moduleKey, operation: dto.operation, payload: dto.payload ?? {}, status: 'queued', priority: dto.priority ?? 100, conflictPolicy: dto.conflictPolicy ?? 'server_wins', dedupeKey: dto.dedupeKey, metadata: dto.metadata ?? {} }, include: { offlineStore: true, device: true } });
    await this.events.publish({ tenantId, workspaceId, type: 'offline.queue.item.created', source: 'offline-operations', subject: { type: 'offline_queue_item', id: item.id }, payload: { queueType: item.queueType, moduleKey: item.moduleKey, operation: item.operation, deviceId: item.deviceId }, actorUserId: this.context.context()?.userId });
    return item;
  }

  async executeQueueItem(id: string) {
    const tenantId = this.context.currentTenantId();
    const item = await this.prisma.offlineQueueItem.findFirst({ where: { tenantId, id, deletedAt: null } });
    if (!item) throw new NotFoundException('Offline queue item not found');
    const policy = await this.prisma.offlineModulePolicy.findFirst({ where: { tenantId, workspaceId: item.workspaceId ?? null, moduleKey: item.moduleKey, deletedAt: null } });
    if (policy && !policy.writeOffline && item.queueType !== 'ai') {
      const conflict = await this.prisma.offlineConflict.create({ data: { tenantId, workspaceId: item.workspaceId, queueItemId: id, entityType: item.moduleKey, conflictType: 'offline_write_not_allowed', status: 'open', localVersion: item.payload, remoteVersion: {}, resolutionStrategy: 'manager_review', metadata: { operation: item.operation } } });
      await this.events.publish({ tenantId, workspaceId: item.workspaceId ?? undefined, type: 'sync.conflict.detected', source: 'offline-operations', subject: { type: 'offline_conflict', id: conflict.id }, payload: { moduleKey: item.moduleKey, conflictType: conflict.conflictType }, actorUserId: this.context.context()?.userId });
      return this.prisma.offlineQueueItem.update({ where: { id }, data: { status: 'conflict', retryCount: item.retryCount + 1 } });
    }
    const updated = await this.prisma.offlineQueueItem.update({ where: { id }, data: { status: 'synced', processedAt: new Date() } });
    await this.events.publish({ tenantId, workspaceId: updated.workspaceId ?? undefined, type: 'offline.queue.item.synced', source: 'offline-operations', subject: { type: 'offline_queue_item', id }, payload: { queueType: updated.queueType, moduleKey: updated.moduleKey, operation: updated.operation }, actorUserId: this.context.context()?.userId });
    return updated;
  }

  conflicts(status?: string) { return this.prisma.offlineConflict.findMany({ where: { tenantId: this.context.currentTenantId(), status: status ?? undefined, deletedAt: null }, include: { queueItem: true }, orderBy: { createdAt: 'desc' }, take: 100 }); }

  async resolveConflict(id: string, dto: ResolveOfflineConflictDto) {
    const tenantId = this.context.currentTenantId();
    const conflict = await this.prisma.offlineConflict.findFirst({ where: { tenantId, id, deletedAt: null } });
    if (!conflict) throw new NotFoundException('Offline conflict not found');
    return this.prisma.offlineConflict.update({ where: { id }, data: { status: 'resolved', resolutionStrategy: dto.resolutionStrategy, resolvedByUserId: this.context.context()?.userId, resolvedAt: new Date(), metadata: { ...(conflict.metadata ?? {}), resolvedVersion: dto.resolvedVersion ?? {}, note: dto.note } } });
  }

  async upsertCachePolicy(dto: UpsertCachePolicyDto) {
    const tenantId = this.context.currentTenantId();
    const existing = await this.prisma.localCachePolicy.findFirst({ where: { tenantId, policyKey: dto.policyKey, deletedAt: null } });
    const data = { tenantId, workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), policyKey: dto.policyKey, moduleKey: dto.moduleKey, cacheStrategy: dto.cacheStrategy ?? 'incremental', encryptionRequired: dto.encryptionRequired ?? true, ttlSeconds: dto.ttlSeconds ?? 86400, maxRecords: dto.maxRecords ?? 10000, allowOfflineMutation: dto.allowOfflineMutation ?? false, syncOnReconnect: dto.syncOnReconnect ?? true, rules: dto.rules ?? {}, metadata: dto.metadata ?? {} };
    return existing ? this.prisma.localCachePolicy.update({ where: { id: existing.id }, data }) : this.prisma.localCachePolicy.create({ data });
  }

  async upsertModulePolicy(dto: UpsertOfflineModulePolicyDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const existing = await this.prisma.offlineModulePolicy.findFirst({ where: { tenantId, workspaceId: workspaceId ?? null, moduleKey: dto.moduleKey, deletedAt: null } });
    const data = { tenantId, workspaceId, moduleKey: dto.moduleKey, supported: dto.supported ?? true, readOffline: dto.readOffline ?? true, writeOffline: dto.writeOffline ?? false, queueType: dto.queueType ?? 'task', conflictPolicy: dto.conflictPolicy ?? 'server_wins', permissionRules: dto.permissionRules ?? {}, metadata: dto.metadata ?? {} };
    return existing ? this.prisma.offlineModulePolicy.update({ where: { id: existing.id }, data }) : this.prisma.offlineModulePolicy.create({ data });
  }
}