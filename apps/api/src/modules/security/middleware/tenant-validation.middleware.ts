import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

const PUBLIC_ROUTE_MARKERS = ['/docs', '/health', '/auth', '/metrics'];

@Injectable()
export class TenantValidationMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] ?? req.body?.tenantId;
    if (requiresTenant(resolveRequestPath(req)) && !tenantId && !hasBearerToken(req)) throw new UnauthorizedException('Bearer token or tenant context is required for tenant-scoped APIs');
    next();
  }
}

function resolveRequestPath(req: Request) { const rawPath = req.originalUrl || req.path || req.url || '/'; const pathOnly = rawPath.split('?')[0] || '/'; return pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`; }
function requiresTenant(path: string) { return !PUBLIC_ROUTE_MARKERS.some((marker) => path.includes(marker)); }
function hasBearerToken(req: Request) {
  const authorization = req.headers.authorization;
  return typeof authorization === 'string' && authorization.startsWith('Bearer ');
}
