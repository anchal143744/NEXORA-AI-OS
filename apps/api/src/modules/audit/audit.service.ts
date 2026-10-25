import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { AuditSearchDto } from './dto/audit-search.dto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService, private readonly tenantContext: TenantContextService) {}

  list() {
    return this.prisma.auditLog.findMany({ where: { tenantId: this.tenantContext.currentTenantId() }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  search(dto: AuditSearchDto) {
    return this.prisma.auditLog.findMany({
      where: {
        tenantId: this.tenantContext.currentTenantId(),
        actorUserId: dto.actorUserId,
        action: dto.action,
        resourceType: dto.resourceType,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  userActivity(userId: string) {
    return this.prisma.activityLog.findMany({ where: { tenantId: this.tenantContext.currentTenantId(), userId }, orderBy: { createdAt: 'desc' }, take: 100 });
  }
}
