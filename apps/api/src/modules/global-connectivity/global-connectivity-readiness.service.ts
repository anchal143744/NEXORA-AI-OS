import { Injectable } from '@nestjs/common';
import { CONNECTIVITY_ENTITIES, CONNECTIVITY_GROUPS } from './global-connectivity.entities';
import { CONNECTIVITY_PERMISSIONS, CONNECTIVITY_RBAC_ROLES } from './global-connectivity-rbac.constants';

@Injectable()
export class GlobalConnectivityReadinessService {
  readiness() {
    return {
      phase: 49,
      modules: Object.keys(CONNECTIVITY_GROUPS).length,
      entities: CONNECTIVITY_ENTITIES.length,
      roles: CONNECTIVITY_RBAC_ROLES,
      permissions: CONNECTIVITY_PERMISSIONS,
      controls: ['multi_tenant_scope', 'workspace_scope', 'rbac_ready', 'audit_events', 'oauth2_ready', 'openid_connect_ready', 'api_versioning_ready', 'cqrs_services', 'openapi_controllers'],
    };
  }
}
