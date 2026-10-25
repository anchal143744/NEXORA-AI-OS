import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RequestContextStore } from '../../../common/context/request-context.store';
import { AccessTokenPayload } from '../../auth/tokens/token-payload';
import { RBAC_PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { RBAC_ROLES_KEY } from '../decorators/require-roles.decorator';

type RequestWithAuth = Request & { auth?: AccessTokenPayload };

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly contextStore: RequestContextStore) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(RBAC_ROLES_KEY, [context.getHandler(), context.getClass()]) ?? [];
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(RBAC_PERMISSIONS_KEY, [context.getHandler(), context.getClass()]) ?? [];
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const requestContext = this.contextStore.get();
    const roles = request.auth?.roles ?? requestContext?.roles ?? [];
    const permissions = request.auth?.permissions ?? requestContext?.permissions ?? [];
    const hasRole = requiredRoles.length === 0 || requiredRoles.some((role) => roles.includes(role));
    const hasPermissions = requiredPermissions.every((permission) => permissions.includes(permission));
    if (!hasRole || !hasPermissions) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}
