import { Injectable } from '@nestjs/common';
import { EAM_RBAC_ROLES, EAM_PERMISSIONS } from './eam-rbac.constants';
import { EAM_ENTITIES } from './eam.entities';
import { EamCqrsService } from './eam-cqrs.service';

@Injectable()
export class EamReadinessService {
  constructor(private readonly cqrs: EamCqrsService) {}
  readiness() {
    return {
      roles: EAM_RBAC_ROLES,
      permissions: EAM_PERMISSIONS,
      entityCount: EAM_ENTITIES.length,
      eventDriven: true,
      tenantIsolation: true,
      workspaceIsolation: true,
      cqrs: { commands: this.cqrs.commandHandlers().length, queries: this.cqrs.queryHandlers().length },
      openApiReady: true,
    };
  }
}

