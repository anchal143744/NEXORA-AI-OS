import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { DomainEventType } from '../events/contracts/domain-event.contract';
import { EventBusService } from '../events/event-bus.service';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class BusinessAuditService {
  constructor(private readonly prisma: PrismaService, private readonly activity: ActivityService, private readonly eventBus: EventBusService, private readonly notifications: NotificationService) {}

  async record(input: { tenantId: string; workspaceId?: string; userId?: string; action: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXECUTE'; resourceType: string; resourceId?: string; message: string; metadata?: Record<string, unknown>; eventType?: DomainEventType }) {
    await this.prisma.auditLog.create({ data: { tenantId: input.tenantId, actorUserId: input.userId, action: input.action, resourceType: input.resourceType, resourceId: input.resourceId, metadata: input.metadata ?? {} } });
    await this.activity.record({ tenantId: input.tenantId, workspaceId: input.workspaceId, userId: input.userId, activityType: `${input.resourceType}.${input.action.toLowerCase()}`, message: input.message, resourceType: input.resourceType, resourceId: input.resourceId, metadata: input.metadata });
    const eventType = input.eventType ?? deriveEventType(input.resourceType, input.action);
    if (eventType) await this.eventBus.publish({ tenantId: input.tenantId, workspaceId: input.workspaceId, type: eventType, source: input.resourceType, actorUserId: input.userId, subject: input.resourceId ? { type: input.resourceType, id: input.resourceId } : undefined, payload: input.metadata ?? { message: input.message } });
    if (input.userId) await this.notifications.create({ userId: input.userId, type: input.action === 'DELETE' ? 'warning' : 'info', title: input.message, body: input.resourceType, actionUrl: input.resourceId });
  }
}

function deriveEventType(resourceType: string, action: string): DomainEventType | undefined {
  const key = `${resourceType}.${action.toLowerCase()}`;
  const map: Record<string, DomainEventType> = {
    'user.create': 'user.created',
    'user.update': 'user.updated',
    'organization.create': 'organization.created',
    'workspace.create': 'workspace.created',
    'crm.lead.create': 'lead.created',
    'crm.lead.update': 'lead.updated',
    'crm.customer.create': 'customer.created',
    'crm.opportunity.create': 'lead.converted',
    'finance.invoice.create': 'invoice.created',
    'finance.invoice.update': 'invoice.updated',
    'finance.expense.create': 'expense.created',
    'hr.employee.create': 'employee.created',
    'project.create': 'project.created',
    'task.create': 'task.created',
    'task.update': 'task.completed',
  };
  return map[key];
}

