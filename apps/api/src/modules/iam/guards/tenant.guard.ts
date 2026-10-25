import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.headers['x-tenant-id']) {
      throw new BadRequestException('x-tenant-id header is required');
    }
    return true;
  }
}
