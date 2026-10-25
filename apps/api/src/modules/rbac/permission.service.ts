import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { PERMISSION_ACTIONS } from './constants/permissions';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  defaultActions() {
    return Object.values(PERMISSION_ACTIONS);
  }

  async seedResourcePermissions(tenantId: string, resources: string[]) {
    const actions = this.defaultActions();
    return Promise.all(resources.flatMap((resource) =>
      actions.map((action) => this.prisma.permission.upsert({
        where: { tenantId_resource_action_scope: { tenantId, resource, action, scope: 'tenant' } },
        update: {},
        create: { tenantId, resource, action, scope: 'tenant', effect: 'ALLOW' },
      })),
    ));
  }
}
