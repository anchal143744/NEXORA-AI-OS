import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateMobileProfileDto, MobileCommandDto } from '../dto/omnichannel.dto';

const mobileModules = ['crm', 'finance', 'hr', 'inventory', 'projects', 'workflows', 'ai-agents'];

@Injectable()
export class MobileService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  shell() {
    return {
      layout: 'adaptive-mobile-enterprise-shell',
      breakpoints: ['mobile', 'tablet', 'foldable'],
      navigation: this.navigation(),
      commandCenter: ['global-search', 'quick-create', 'approval-queue', 'offline-sync', 'ai-copilot'],
      copilot: { docked: true, voiceReady: true, offlineQueue: true },
      workspaceSupport: { switcher: true, tenantIsolation: true, roleAwareNavigation: true },
      security: { deviceTrustRequired: true, offlinePermissionValidation: true, encryptedLocalStorage: true },
    };
  }

  dashboardFramework(role?: string) {
    return {
      role: role ?? 'adaptive',
      cards: ['business-health', 'priority-tasks', 'approval-queue', 'offline-status', 'ai-recommendations'],
      widgets: ['kpi-strip', 'activity-feed', 'workflow-status', 'sync-health'],
      density: 'scan-first',
      gestures: ['swipe-actions', 'pull-to-refresh', 'long-press-command'],
    };
  }

  workspaces() {
    return this.prisma.workspace.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, select: { id: true, name: true, slug: true, status: true, organizationId: true, businessId: true, updatedAt: true }, orderBy: { updatedAt: 'desc' }, take: 50 });
  }

  profiles() {
    return this.prisma.mobileWorkspaceProfile.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, include: { device: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  createProfile(dto: CreateMobileProfileDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    return this.prisma.mobileWorkspaceProfile.create({ data: { tenantId, workspaceId, userId: this.context.context()?.userId, deviceId: dto.deviceId, profileKey: dto.profileKey ?? `mobile-${workspaceId ?? 'tenant'}-${randomUUID()}`, layoutMode: dto.layoutMode ?? 'adaptive', navigation: dto.navigation ?? this.navigation(), dashboardConfig: dto.dashboardConfig ?? this.dashboardFramework(), commandCenter: dto.commandCenter ?? { actions: ['create-task', 'scan-invoice', 'ask-copilot', 'sync-now'] }, copilotEnabled: dto.copilotEnabled ?? true, offlineEnabled: dto.offlineEnabled ?? true, supportedModules: dto.supportedModules ?? mobileModules, metadata: dto.metadata ?? {} }, include: { device: true } });
  }

  async command(dto: MobileCommandDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const queueItem = await this.prisma.offlineQueueItem.create({ data: { tenantId, workspaceId, queueType: 'task', moduleKey: dto.commandType, operation: dto.commandKey, payload: dto.payload ?? {}, status: 'queued', priority: 50, conflictPolicy: 'manual_review', metadata: { source: 'mobile-command-center' } } });
    await this.events.publish({ tenantId, workspaceId, type: 'mobile.command.created', source: 'mobile-command-center', subject: { type: 'offline_queue_item', id: queueItem.id }, payload: { commandKey: dto.commandKey, commandType: dto.commandType }, actorUserId: this.context.context()?.userId });
    return queueItem;
  }

  private navigation() {
    return [
      { key: 'command', label: 'Command', modules: ['ai-agents', 'workflows'] },
      { key: 'customers', label: 'Customers', modules: ['crm'] },
      { key: 'money', label: 'Finance', modules: ['finance'] },
      { key: 'people', label: 'People', modules: ['hr'] },
      { key: 'operations', label: 'Operations', modules: ['inventory', 'projects'] },
    ];
  }
}