import { Injectable } from '@nestjs/common';
import { FIELD_SERVICE_RBAC_ROLES, FIELD_SERVICE_PERMISSIONS } from './field-service-rbac.constants';
import { FIELD_SERVICE_ENTITIES } from './field-service.entities';
import { FieldServiceCqrsService } from './field-service-cqrs.service';

@Injectable()
export class FieldServiceReadinessService {
  constructor(private readonly cqrs: FieldServiceCqrsService) {}
  readiness() {
    return {
      roles: FIELD_SERVICE_RBAC_ROLES,
      permissions: FIELD_SERVICE_PERMISSIONS,
      entityCount: FIELD_SERVICE_ENTITIES.length,
      eventDriven: true,
      tenantIsolation: true,
      workspaceIsolation: true,
      cqrs: { commands: this.cqrs.commandHandlers().length, queries: this.cqrs.queryHandlers().length },
      openApiReady: true,
    };
  }
}

