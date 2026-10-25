import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { SessionDeviceDto } from './dto/session-device.dto';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(input: { tenantId: string; userId: string; sessionId?: string; refreshToken: string; device: SessionDeviceDto }) {
    return this.prisma.session.create({
      data: {
        id: input.sessionId,
        tenantId: input.tenantId,
        userId: input.userId,
        refreshTokenHash: this.hashToken(input.refreshToken),
        ipAddress: input.device.ipAddress,
        userAgent: input.device.userAgent ?? input.device.deviceName,
        expiresAt: this.refreshTokenExpiresAt(),
      },
    });
  }

  async validateRefreshToken(tenantId: string, sessionId: string, refreshToken: string) {
    const session = await this.prisma.session.findFirst({ where: { id: sessionId, tenantId, user: { status: 'ACTIVE', deletedAt: null }, tenant: { status: 'ACTIVE', deletedAt: null }, status: 'ACTIVE', revokedAt: null, expiresAt: { gt: new Date() } } });
    if (!session) return null;
    return session.refreshTokenHash === this.hashToken(refreshToken) ? session : null;
  }

  findActiveSession(tenantId: string, userId: string, sessionId: string) {
    return this.prisma.session.findFirst({
      where: {
        id: sessionId,
        tenantId,
        userId,
        user: { status: 'ACTIVE', deletedAt: null },
        tenant: { status: 'ACTIVE', deletedAt: null },
        status: 'ACTIVE',
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: { id: true },
    });
  }

  async rotateRefreshToken(tenantId: string, sessionId: string, refreshToken: string, previousToken: string) {
    const changed = await this.prisma.session.updateMany({
      where: { id: sessionId, tenantId, status: 'ACTIVE', revokedAt: null, expiresAt: { gt: new Date() }, refreshTokenHash: this.hashToken(previousToken) },
      data: {
        refreshTokenHash: this.hashToken(refreshToken),
        expiresAt: this.refreshTokenExpiresAt(),
      },
    });
    if (changed.count !== 1) return null;
    return this.prisma.session.findFirst({ where: { id: sessionId, tenantId, status: 'ACTIVE', revokedAt: null, expiresAt: { gt: new Date() } } });
  }

  async revokeSession(tenantId: string, sessionId: string) {
    return this.prisma.session.updateMany({ where: { id: sessionId, tenantId }, data: { status: 'REVOKED', revokedAt: new Date() } });
  }

  async revokeAllUserSessions(tenantId: string, userId: string) {
    return this.prisma.session.updateMany({ where: { tenantId, userId, status: 'ACTIVE' }, data: { status: 'REVOKED', revokedAt: new Date() } });
  }

  async listUserSessions(tenantId: string, userId: string) {
    return this.prisma.session.findMany({ where: { tenantId, userId }, orderBy: { createdAt: 'desc' } });
  }

  hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private refreshTokenExpiresAt() {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
}
