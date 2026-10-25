import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateDeviceTrustPolicyDto, DeviceApprovalDecisionDto, GrantDevicePermissionDto, RegisterDeviceDto, TrustDeviceDto } from '../dto/omnichannel.dto';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  devices(deviceType?: string, status?: string) {
    return this.prisma.registeredDevice.findMany({ where: { tenantId: this.context.currentTenantId(), deviceType: deviceType ?? undefined, status: status ?? undefined, deletedAt: null }, include: { sessions: { where: { deletedAt: null }, orderBy: { lastSeenAt: 'desc' }, take: 3 }, permissions: { where: { deletedAt: null } }, approvals: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 3 } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async register(dto: RegisterDeviceDto) {
    const tenantId = this.context.currentTenantId();
    const deviceKey = dto.deviceKey ?? `${dto.deviceType}-${randomUUID()}`;
    const existing = await this.prisma.registeredDevice.findFirst({ where: { tenantId, deviceKey, deletedAt: null } });
    if (existing) throw new ConflictException('Device key is already registered');
    const device = await this.prisma.registeredDevice.create({ data: { tenantId, userId: this.context.context()?.userId, workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), deviceKey, deviceType: dto.deviceType, platform: dto.platform, name: dto.name, status: 'pending', trustLevel: 'untrusted', osVersion: dto.osVersion, appVersion: dto.appVersion, lastIpAddress: dto.lastIpAddress, lastUserAgent: dto.lastUserAgent, lastSeenAt: new Date(), metadata: dto.metadata ?? {}, approvals: { create: { tenantId, requestedByUserId: this.context.context()?.userId, requestType: 'device_trust', status: 'pending', riskLevel: dto.deviceType === 'desktop' ? 'medium' : 'low', requestedTrustLevel: 'trusted', reason: 'New device registration' } }, sessions: { create: { tenantId, userId: this.context.context()?.userId, workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), status: 'active', authMethod: 'jwt', ipAddress: dto.lastIpAddress, userAgent: dto.lastUserAgent } }, activities: { create: { tenantId, userId: this.context.context()?.userId, workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), activityType: 'device.registered', severity: 'info', message: `Device ${dto.name} registered`, ipAddress: dto.lastIpAddress, userAgent: dto.lastUserAgent, metadata: { platform: dto.platform, deviceType: dto.deviceType } } } }, include: { approvals: true, sessions: true } });
    await this.events.publish({ tenantId, workspaceId: device.workspaceId ?? undefined, type: 'device.registered', source: 'device-management', subject: { type: 'registered_device', id: device.id }, payload: { deviceKey: device.deviceKey, deviceType: device.deviceType, platform: device.platform, status: device.status }, actorUserId: this.context.context()?.userId });
    return device;
  }

  sessions(deviceId?: string) { return this.prisma.deviceSession.findMany({ where: { tenantId: this.context.currentTenantId(), deviceId: deviceId ?? undefined, deletedAt: null }, include: { device: true }, orderBy: { lastSeenAt: 'desc' }, take: 100 }); }

  async trustDevice(id: string, dto: TrustDeviceDto) {
    const tenantId = this.context.currentTenantId();
    await this.requireDevice(id);
    const device = await this.prisma.registeredDevice.update({ where: { id }, data: { trustLevel: dto.trustLevel, status: dto.status ?? 'active', approvedAt: dto.trustLevel === 'untrusted' ? undefined : new Date(), metadata: dto.metadata ?? undefined } });
    await this.logActivity(id, 'device.trust.updated', `Device trust set to ${dto.trustLevel}`, dto.reason ?? 'Trust policy update');
    await this.events.publish({ tenantId, workspaceId: device.workspaceId ?? undefined, type: 'device.approved', source: 'device-management', subject: { type: 'registered_device', id }, payload: { trustLevel: device.trustLevel, status: device.status, reason: dto.reason }, actorUserId: this.context.context()?.userId });
    return device;
  }

  async revokeDevice(id: string, reason?: string) {
    const tenantId = this.context.currentTenantId();
    const existing = await this.requireDevice(id);
    const device = await this.prisma.registeredDevice.update({ where: { id }, data: { status: 'revoked', trustLevel: 'untrusted', revokedAt: new Date() } });
    await this.prisma.deviceSession.updateMany({ where: { tenantId, deviceId: id, status: 'active' }, data: { status: 'revoked', revokedAt: new Date() } });
    await this.logActivity(id, 'device.revoked', `Device ${existing.name} revoked`, reason ?? 'Remote revocation');
    await this.events.publish({ tenantId, workspaceId: device.workspaceId ?? undefined, type: 'device.revoked', source: 'device-management', subject: { type: 'registered_device', id }, payload: { reason }, actorUserId: this.context.context()?.userId });
    return device;
  }

  async revokeSessions(id: string) {
    const tenantId = this.context.currentTenantId();
    await this.requireDevice(id);
    const result = await this.prisma.deviceSession.updateMany({ where: { tenantId, deviceId: id, status: 'active', deletedAt: null }, data: { status: 'revoked', revokedAt: new Date() } });
    await this.logActivity(id, 'device.sessions.revoked', `${result.count} device sessions revoked`, 'Remote session revocation');
    await this.events.publish({ tenantId, workspaceId: this.context.currentWorkspaceId(), type: 'device.session.revoked', source: 'device-management', subject: { type: 'registered_device', id }, payload: { revokedSessions: result.count }, actorUserId: this.context.context()?.userId });
    return result;
  }

  async grantPermission(id: string, dto: GrantDevicePermissionDto) {
    const tenantId = this.context.currentTenantId();
    await this.requireDevice(id);
    return this.prisma.devicePermission.create({ data: { tenantId, deviceId: id, permissionKey: dto.permissionKey, moduleKey: dto.moduleKey, scope: dto.scope ?? 'workspace', allowed: dto.allowed ?? true, offlineAllowed: dto.offlineAllowed ?? false, conditions: dto.conditions ?? {}, grantedByUserId: this.context.context()?.userId, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, metadata: dto.metadata ?? {} } });
  }

  activity(id: string) { return this.prisma.deviceActivityLog.findMany({ where: { tenantId: this.context.currentTenantId(), deviceId: id, deletedAt: null }, orderBy: { occurredAt: 'desc' }, take: 100 }); }
  approvals(status?: string) { return this.prisma.deviceApprovalRequest.findMany({ where: { tenantId: this.context.currentTenantId(), status: status ?? undefined, deletedAt: null }, include: { device: true }, orderBy: { createdAt: 'desc' }, take: 100 }); }
  policies() { return this.prisma.deviceTrustPolicy.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 }); }

  createPolicy(dto: CreateDeviceTrustPolicyDto) {
    return this.prisma.deviceTrustPolicy.create({ data: { tenantId: this.context.currentTenantId(), policyKey: dto.policyKey, name: dto.name, deviceType: dto.deviceType, platform: dto.platform, requiredTrustLevel: dto.requiredTrustLevel ?? 'trusted', approvalRequired: dto.approvalRequired ?? true, mfaRequired: dto.mfaRequired ?? true, encryptionRequired: dto.encryptionRequired ?? true, offlineAllowed: dto.offlineAllowed ?? false, rules: dto.rules ?? {}, metadata: dto.metadata ?? {} } });
  }

  async decideApproval(id: string, dto: DeviceApprovalDecisionDto) {
    const tenantId = this.context.currentTenantId();
    const approval = await this.prisma.deviceApprovalRequest.findFirst({ where: { tenantId, id, deletedAt: null } });
    if (!approval) throw new NotFoundException('Device approval request not found');
    const updated = await this.prisma.deviceApprovalRequest.update({ where: { id }, data: { status: dto.decision, approverUserId: this.context.context()?.userId, decisionReason: dto.decisionReason, decidedAt: new Date() }, include: { device: true } });
    if (dto.decision === 'approved') await this.trustDevice(approval.deviceId, { trustLevel: dto.trustLevel ?? approval.requestedTrustLevel, status: 'active', reason: dto.decisionReason });
    return updated;
  }

  private async requireDevice(id: string) {
    const device = await this.prisma.registeredDevice.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null } });
    if (!device) throw new NotFoundException('Registered device not found');
    return device;
  }

  private logActivity(deviceId: string, activityType: string, message: string, reason: string) {
    return this.prisma.deviceActivityLog.create({ data: { tenantId: this.context.currentTenantId(), deviceId, userId: this.context.context()?.userId, workspaceId: this.context.currentWorkspaceId(), activityType, severity: 'info', message, metadata: { reason } } });
  }
}