import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class LoginAuditService {
  private readonly logger = new Logger(LoginAuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async recordLogin(input: { tenantId?: string; userId?: string; success: boolean; ipAddress?: string; userAgent?: string }) {
    if (!input.tenantId) {
      this.logger.warn('Skipped login audit without tenant context');
      return null;
    }

    try {
      const tenantExists = await this.prisma.tenant.findFirst({ where: { id: input.tenantId, deletedAt: null }, select: { id: true } });
      if (!tenantExists) {
        this.logger.warn(`Skipped login audit for unknown tenant: ${input.tenantId}`);
        return null;
      }

      return await this.prisma.auditLog.create({
        data: {
          tenantId: input.tenantId,
          actorUserId: input.userId,
          action: input.success ? 'LOGIN' : 'SECURITY_EVENT',
          resourceType: 'auth.session',
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          metadata: { success: input.success },
        },
      });
    } catch (error) {
      this.logger.warn(`Login audit write failed: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }
}