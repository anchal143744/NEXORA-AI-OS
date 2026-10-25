import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { RequestContextStore } from '../../../common/context/request-context.store';
import { telemetryRegistry } from '../../../common/observability/telemetry-registry';
import { tracingBackend } from '../../../common/observability/tracing-backend';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { SessionsService } from '../../sessions/sessions.service';
import { AccessTokenPayload } from '../tokens/token-payload';
import { TokenService } from '../tokens/token.service';

type AuthenticatedRequest = Request & { auth?: AccessTokenPayload };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly contextStore: RequestContextStore,
    private readonly sessionsService: SessionsService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;
    const span = tracingBackend.startSpan('auth.jwt.verify', { kind: 'internal' });
    const started = process.hrtime.bigint();
    if (!header || !String(header).startsWith('Bearer ')) {
      recordAuth(started, 'missing_token');
      tracingBackend.finishSpan(span, 'ERROR', { reason: 'missing_token' });
      throw new UnauthorizedException('Bearer token is required');
    }
    const token = String(header).replace('Bearer ', '').trim();
    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      for (const [headerName, expected] of [['x-tenant-id', payload.tenantId], ['x-organization-id', payload.organizationId], ['x-workspace-id', payload.workspaceId]] as const) {
        const supplied = request.headers[headerName];
        if (supplied !== undefined && supplied !== expected) throw new ForbiddenException('Request scope does not match the signed-in workspace');
      }
      await this.validateActiveSession(payload);
      if (Reflect.getMetadata('nexora.identityOnly', context.getHandler()) !== true) await this.validateMembership(payload);
      request.auth = payload;
      const requestContext = this.contextStore.get();
      if (requestContext) {
        requestContext.tenantId = payload.tenantId;
        requestContext.organizationId = payload.organizationId;
        requestContext.workspaceId = payload.workspaceId;
        requestContext.userId = payload.userId;
        requestContext.roles = payload.roles;
        requestContext.permissions = payload.permissions;
      }
      recordAuth(started, 'ok');
      tracingBackend.finishSpan(span, 'OK', { tenantId: payload.tenantId, organizationId: payload.organizationId, workspaceId: payload.workspaceId, userId: payload.userId });
      return true;
    } catch (error) {
      recordAuth(started, 'invalid_token');
      tracingBackend.finishSpan(span, 'ERROR', { reason: 'invalid_token' });
      if (error instanceof ForbiddenException) throw error;
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private async validateActiveSession(payload: AccessTokenPayload) {
    const activeSession = await this.sessionsService.findActiveSession(payload.tenantId, payload.userId, payload.sessionId);
    if (!activeSession) throw new UnauthorizedException('Invalid access token');
  }

  private async validateMembership(payload: AccessTokenPayload) {
    const workspaceMembership = payload.workspaceId ? await this.findWorkspaceMembership(payload) : null;
    if (payload.workspaceId && !workspaceMembership) throw new UnauthorizedException('Invalid workspace access');

    if (!payload.organizationId) return;

    const organizationMembership = await this.prisma.membership.findFirst({
      where: {
        tenantId: payload.tenantId,
        organizationId: payload.organizationId,
        userId: payload.userId,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (!organizationMembership) throw new ForbiddenException('Organization membership is required');
  }

  private async findWorkspaceMembership(payload: AccessTokenPayload): Promise<{ id: string; organizationId: string } | null> {
    if (!payload.workspaceId) return null;
    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        tenantId: payload.tenantId,
        workspaceId: payload.workspaceId,
        userId: payload.userId,
        status: 'ACTIVE',
        deletedAt: null,
        workspace: { tenantId: payload.tenantId, ...(payload.organizationId ? { organizationId: payload.organizationId } : {}), deletedAt: null, organization: { tenantId: payload.tenantId, deletedAt: null } },
      },
      select: { id: true, workspace: { select: { organizationId: true } } },
    });
    return member ? { id: member.id, organizationId: member.workspace.organizationId } : null;
  }
}

function recordAuth(started: bigint, status: string) {
  const durationMs = Number(process.hrtime.bigint() - started) / 1_000_000;
  telemetryRegistry.incrementCounter('nexora_auth_attempts_total', 1, { strategy: 'jwt', status });
  telemetryRegistry.observeHistogram('nexora_auth_verification_duration_ms', durationMs, { strategy: 'jwt', status });
}
