import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateDesktopNotificationDto, CreateDesktopProfileDto } from '../dto/omnichannel.dto';

@Injectable()
export class DesktopService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  architecture() {
    return {
      shell: 'desktop-companion-command-center',
      nativeTargets: ['windows', 'macos', 'linux'],
      multiWindow: { supported: true, windows: ['command-center', 'workflow-console', 'ai-copilot', 'approval-queue'] },
      notifications: { desktop: true, workspaceAware: true, actionButtons: true },
      systemTray: { supported: true, actions: ['open-command-center', 'sync-now', 'pause-notifications', 'quick-capture'] },
      security: { deviceTrustRequired: true, sessionRevocation: true, encryptedLocalCache: true },
    };
  }

  profiles() {
    return this.prisma.desktopCompanionProfile.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, include: { device: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  createProfile(dto: CreateDesktopProfileDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    return this.prisma.desktopCompanionProfile.create({ data: { tenantId, workspaceId, userId: this.context.context()?.userId, deviceId: dto.deviceId, profileKey: dto.profileKey ?? `desktop-${workspaceId ?? 'tenant'}-${randomUUID()}`, windowState: dto.windowState ?? { commandCenter: { width: 1280, height: 860 }, copilot: { docked: true } }, notificationConfig: dto.notificationConfig ?? { desktop: true, criticalOnlyAfterHours: true }, trayConfig: dto.trayConfig ?? { enabled: true, quickActions: ['sync-now', 'create-task', 'ask-ai'] }, nativeCapabilities: dto.nativeCapabilities ?? ['multi-window', 'desktop-notifications', 'system-tray', 'secure-cache'], multiWindowEnabled: dto.multiWindowEnabled ?? true, desktopNotificationsEnabled: dto.desktopNotificationsEnabled ?? true, offlineEnabled: dto.offlineEnabled ?? true, metadata: dto.metadata ?? {} }, include: { device: true } });
  }

  windows() {
    return { windows: ['command-center', 'ai-copilot', 'workflow-execution-console', 'offline-sync-monitor', 'approval-queue'], restorePolicy: 'workspace-and-device', focusPolicy: 'last-active-workspace' };
  }

  tray() {
    return { enabled: true, quickActions: ['open-command-center', 'sync-now', 'queue-status', 'create-task', 'ask-copilot'], notificationBadges: ['critical-alerts', 'pending-approvals', 'offline-queue'] };
  }

  async notification(dto: CreateDesktopNotificationDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const activity = await this.prisma.deviceActivityLog.create({ data: { tenantId, deviceId: dto.deviceId, userId: this.context.context()?.userId, workspaceId, activityType: 'desktop.notification.created', severity: dto.severity ?? 'info', message: dto.title, metadata: { body: dto.body, payload: dto.payload ?? {} } } });
    await this.events.publish({ tenantId, workspaceId, type: 'desktop.notification.created', source: 'desktop-companion', subject: { type: 'device_activity_log', id: activity.id }, payload: { title: dto.title, body: dto.body, severity: dto.severity ?? 'info', deviceId: dto.deviceId }, actorUserId: this.context.context()?.userId });
    return activity;
  }
}