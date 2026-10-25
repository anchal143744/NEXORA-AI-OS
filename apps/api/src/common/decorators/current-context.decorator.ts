import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenPayload } from '../../modules/auth/tokens/token-payload';

type AuthenticatedRequest = Request & { auth?: AccessTokenPayload };

export const CurrentContext = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  return {
    tenantId: request.auth?.tenantId,
    organizationId: request.auth?.organizationId,
    workspaceId: request.auth?.workspaceId,
    userId: request.auth?.userId,
    roles: request.auth?.roles ?? [],
    permissions: request.auth?.permissions ?? [],
  };
});
