import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class ActivityRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(input: { tenantId: string; userId?: string; activityType: string; message: string; resourceType?: string; resourceId?: string; workspaceId?: string; metadata?: Record<string, unknown> }) {
    const { workspaceId, metadata, ...data } = input;
    return this.prisma.activityLog.create({ data: { ...data, metadata: workspaceId ? { ...(metadata ?? {}), workspaceId } : metadata ?? {} } });
  }
  list(tenantId: string, userId?: string) { return this.prisma.activityLog.findMany({ where: { tenantId, userId }, orderBy: { createdAt: 'desc' }, take: 100 }); }
}
