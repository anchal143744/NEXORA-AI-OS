import { Injectable } from '@nestjs/common';

@Injectable()
export class IamService {
  hasPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }
}
