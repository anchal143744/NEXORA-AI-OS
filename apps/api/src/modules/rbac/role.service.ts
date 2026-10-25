import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ROLES, RoleKey } from './constants/roles';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  defaultRoles(): RoleKey[] {
    return Object.values(ROLES);
  }

  async seedTenantRoles(tenantId: string) {
    return Promise.all(
      this.defaultRoles().map((role) =>
        this.prisma.role.upsert({
          where: { tenantId_slug: { tenantId, slug: role } },
          update: {},
          create: { tenantId, slug: role, name: humanize(role), isSystem: true },
        }),
      ),
    );
  }
}

function humanize(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}
