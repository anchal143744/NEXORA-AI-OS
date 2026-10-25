import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
@Injectable()
export class AuditTrackingService { constructor(private readonly prisma: PrismaService) {} track(input: { tenantId: string; actorUserId?: string; action: string; resourceType: string; resourceId?: string; metadata?: Record<string, unknown> }) { return this.prisma.auditLog.create({ data: { tenantId: input.tenantId, actorUserId: input.actorUserId, action: input.action, resourceType: input.resourceType, resourceId: input.resourceId, metadata: input.metadata ?? {} } }); } }
