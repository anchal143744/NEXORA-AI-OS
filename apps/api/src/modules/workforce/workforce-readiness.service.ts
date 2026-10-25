import { Injectable } from '@nestjs/common';
import { WORKFORCE_RBAC_ROLES, WORKFORCE_PERMISSIONS } from './workforce-rbac.constants';
import { WORKFORCE_ENTITIES } from './workforce.entities';
import { WorkforceCqrsService } from './workforce-cqrs.service';

@Injectable()
export class WorkforceReadinessService {
  constructor(private readonly cqrs: WorkforceCqrsService) {}

  readiness() {
    return {
      roles: WORKFORCE_RBAC_ROLES,
      permissions: WORKFORCE_PERMISSIONS,
      entityCount: WORKFORCE_ENTITIES.length,
      eventDriven: true,
      tenantIsolation: true,
      workspaceIsolation: true,
      cqrs: { commands: this.cqrs.commandHandlers().length, queries: this.cqrs.queryHandlers().length },
      openApiReady: true,
    };
  }
}

