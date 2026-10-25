import { Injectable, NotFoundException } from '@nestjs/common';
import { EventBusService } from '../../events/event-bus.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateEmergencyControlDto, CreateIncidentDto, SuspendTenantDto } from '../dto/enterprise-admin.dto';

@Injectable()
export class SecurityOperationsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  async suspendTenant(dto: SuspendTenantDto) {
    const tenantId = this.context.currentTenantId();
    const suspension = await this.prisma.tenantSuspension.create({ data: { tenantId, reason: dto.reason, status: 'active', suspendedByUserId: this.context.context()?.userId, metadata: dto.metadata ?? {} } });
    await this.prisma.tenant.update({ where: { id: tenantId }, data: { status: 'SUSPENDED' } });
    await this.events.publish({ tenantId, type: 'tenant.suspended', source: 'security-operations', subject: { type: 'tenant', id: tenantId }, payload: { suspensionId: suspension.id, reason: dto.reason }, actorUserId: this.context.context()?.userId });
    return suspension;
  }

  async restoreTenant(suspensionId: string) {
    const tenantId = this.context.currentTenantId();
    const suspension = await this.prisma.tenantSuspension.findFirst({ where: { tenantId, id: suspensionId, deletedAt: null } });
    if (!suspension) throw new NotFoundException('Tenant suspension not found');
    const restored = await this.prisma.tenantSuspension.update({ where: { id: suspensionId }, data: { status: 'restored', restoredAt: new Date() } });
    await this.prisma.tenant.update({ where: { id: tenantId }, data: { status: 'ACTIVE' } });
    await this.events.publish({ tenantId, type: 'tenant.restored', source: 'security-operations', subject: { type: 'tenant', id: tenantId }, payload: { suspensionId }, actorUserId: this.context.context()?.userId });
    return restored;
  }

  tenantSuspensions() { return this.prisma.tenantSuspension.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, orderBy: { suspendedAt: 'desc' } }); }

  async activateEmergencyControl(dto: CreateEmergencyControlDto) {
    const tenantId = this.context.currentTenantId();
    const control = await this.prisma.emergencyControl.upsert({ where: { tenantId_controlKey: { tenantId, controlKey: dto.controlKey } }, update: { scope: dto.scope, status: 'active', reason: dto.reason, activatedByUserId: this.context.context()?.userId, activatedAt: new Date(), expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, deactivatedAt: undefined, metadata: dto.metadata ?? {} }, create: { tenantId, controlKey: dto.controlKey, scope: dto.scope, status: 'active', reason: dto.reason, activatedByUserId: this.context.context()?.userId, activatedAt: new Date(), expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, type: 'emergency_control.activated', source: 'security-operations', subject: { type: 'emergency_control', id: control.id }, payload: { controlKey: control.controlKey, scope: control.scope }, actorUserId: this.context.context()?.userId });
    return control;
  }

  async deactivateEmergencyControl(controlKey: string) {
    const tenantId = this.context.currentTenantId();
    const control = await this.prisma.emergencyControl.findFirst({ where: { tenantId, controlKey, deletedAt: null } });
    if (!control) throw new NotFoundException('Emergency control not found');
    return this.prisma.emergencyControl.update({ where: { id: control.id }, data: { status: 'inactive', deactivatedAt: new Date() } });
  }

  emergencyControls() { return this.prisma.emergencyControl.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, orderBy: { updatedAt: 'desc' } }); }

  globalPermissions() {
    const tenantId = this.context.currentTenantId();
    return Promise.all([
      this.prisma.role.findMany({ where: { tenantId, deletedAt: null }, include: { permissions: true } }),
      this.prisma.permission.findMany({ where: { tenantId, deletedAt: null }, orderBy: { resource: 'asc' } }),
      this.prisma.roleAssignment.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 }),
    ]).then(([roles, permissions, assignments]) => ({ roles, permissions, assignments }));
  }

  incidents(status?: string) { return this.prisma.adminIncident.findMany({ where: { tenantId: this.context.currentTenantId(), status: status ?? undefined, deletedAt: null }, orderBy: { detectedAt: 'desc' }, take: 100 }); }

  async createIncident(dto: CreateIncidentDto) {
    const tenantId = this.context.currentTenantId();
    const incident = await this.prisma.adminIncident.create({ data: { tenantId, workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), severity: dto.severity, title: dto.title, description: dto.description, source: dto.source, ownerUserId: dto.ownerUserId, metadata: dto.metadata ?? {}, timeline: [{ at: new Date().toISOString(), event: 'created', actorUserId: this.context.context()?.userId }] } });
    await this.events.publish({ tenantId, workspaceId: incident.workspaceId ?? undefined, type: 'incident.created', source: 'security-operations', subject: { type: 'incident', id: incident.id }, payload: { severity: incident.severity, title: incident.title }, actorUserId: this.context.context()?.userId });
    return incident;
  }

  async resolveIncident(id: string) {
    const tenantId = this.context.currentTenantId();
    const incident = await this.prisma.adminIncident.findFirst({ where: { tenantId, id, deletedAt: null } });
    if (!incident) throw new NotFoundException('Incident not found');
    return this.prisma.adminIncident.update({ where: { id }, data: { status: 'resolved', resolvedAt: new Date(), timeline: [...((incident.timeline as Array<Record<string, unknown>>) ?? []), { at: new Date().toISOString(), event: 'resolved', actorUserId: this.context.context()?.userId }] } });
  }
}
