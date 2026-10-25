import { Injectable } from '@nestjs/common';
import { MDM_ENTITIES, MDM_GROUPS } from './mdm.entities';
import { MDM_PERMISSIONS, MDM_RBAC_ROLES } from './mdm-rbac.constants';

@Injectable()
export class MdmReadinessService {
  readiness() {
    return {
      phase: 48,
      modules: Object.keys(MDM_GROUPS).length,
      entities: MDM_ENTITIES.length,
      roles: MDM_RBAC_ROLES,
      permissions: MDM_PERMISSIONS,
      controls: ['multi_tenant_scope', 'workspace_scope', 'rbac_ready', 'audit_events', 'cqrs_services', 'openapi_controllers', 'golden_record_controls', 'data_quality_controls'],
    };
  }
}
