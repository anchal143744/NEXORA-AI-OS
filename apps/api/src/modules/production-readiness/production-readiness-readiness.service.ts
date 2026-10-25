import { Injectable } from '@nestjs/common';
import { PRODUCTION_READINESS_ENTITIES, PRODUCTION_READINESS_GROUPS } from './production-readiness.entities';
import { PRODUCTION_READINESS_PERMISSIONS, PRODUCTION_READINESS_RBAC_ROLES } from './production-readiness-rbac.constants';

@Injectable()
export class ProductionReadinessReadinessService {
  readiness() {
    return {
      phase: 50,
      releaseCandidate: '1.0.0-RC1',
      modules: Object.keys(PRODUCTION_READINESS_GROUPS).length,
      entities: PRODUCTION_READINESS_ENTITIES.length,
      roles: PRODUCTION_READINESS_RBAC_ROLES,
      permissions: PRODUCTION_READINESS_PERMISSIONS,
      controls: ['security_audit', 'dependency_remediation', 'load_testing', 'stress_testing', 'observability', 'backup_validation', 'disaster_recovery', 'api_governance', 'test_coverage', 'documentation_review', 'release_scoring'],
    };
  }
}
