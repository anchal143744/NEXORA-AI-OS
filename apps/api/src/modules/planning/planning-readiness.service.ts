import { Injectable } from '@nestjs/common';
import { PLANNING_ENTITIES, PLANNING_GROUPS } from './planning.entities';
import { PLANNING_PERMISSIONS, PLANNING_RBAC_ROLES } from './planning-rbac.constants';

@Injectable()
export class PlanningReadinessService {
  readiness() {
    return {
      phase: 47,
      modules: Object.keys(PLANNING_GROUPS).length,
      entities: PLANNING_ENTITIES.length,
      roles: PLANNING_RBAC_ROLES,
      permissions: PLANNING_PERMISSIONS,
      controls: ['multi_tenant_scope', 'workspace_scope', 'rbac_ready', 'audit_events', 'cqrs_services', 'openapi_controllers', 'strategy_copilot_context'],
    };
  }
}
