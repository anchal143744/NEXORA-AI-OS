import { assertRegisteredWorkspaceModule } from './helpers/web-contracts.mjs';
import { assertReleaseVersions } from './helpers/web-contracts.mjs';
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('Phase 61 production deployment files exist', () => {
  [
    'apps/web/types/production-deployment.ts',
    'apps/web/lib/production-deployment.ts',
    'apps/web/features/production-deployment/production-deployment-workspace.tsx',
    'apps/web/app/production-deployment/page.tsx',
    'apps/web/app/workspace/production-deployment/page.tsx',
    'Dockerfile.api',
    'Dockerfile.web',
    'Dockerfile.worker',
    'Dockerfile.ai-worker',
    'docker-compose.production.yml',
    '.github/workflows/production-release.yml',
    'scripts/production-readiness-check.mjs',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Production Deployment covers all requested modules', () => {
  const source = read('apps/web/features/production-deployment/production-deployment-workspace.tsx');
  [
    'ProductionInfrastructure',
    'MultiEnvironmentManagement',
    'CidcPlatform',
    'ContainerizationCenter',
    'KubernetesDeployment',
    'MonitoringObservability',
    'CentralizedLogging',
    'SecurityHardening',
    'BackupDisasterRecovery',
    'ProductionReadinessDashboard',
    'EnterpriseTrialEnvironment',
    'LaunchReadinessCenter',
  ].forEach((name) => assert.match(source, new RegExp(name)));
});

test('Infrastructure artifacts cover Docker, Kubernetes, monitoring, logging and backups', () => {
  [
    'infra/kubernetes/api-deployment.yaml',
    'infra/kubernetes/web-deployment.yaml',
    'infra/kubernetes/worker-deployment.yaml',
    'infra/kubernetes/ai-worker-deployment.yaml',
    'infra/kubernetes/postgres-statefulset.yaml',
    'infra/kubernetes/redis-deployment.yaml',
    'infra/kubernetes/ingress.yaml',
    'infra/kubernetes/hpa.yaml',
    'infra/monitoring/prometheus.yml',
    'infra/monitoring/alert-rules.yml',
    'infra/monitoring/grafana-dashboard.json',
    'infra/logging/vector.toml',
    'infra/backups/backup-policy.yml',
    'infra/backups/recovery-runbook.md',
  ].forEach((file) => assert.equal(existsSync(new URL(file, root)), true, file));
});

test('Workspace config registers Phase 61 through adaptive navigation metadata', () => {
  assertRegisteredWorkspaceModule('production-deployment', '/production-deployment', 'Production Ops');
});

test('Production readiness data exposes environments, gates and routes', () => {
  const source = read('apps/web/lib/production-deployment.ts');
  ['development', 'staging', 'production', 'GitHub Actions', 'Kubernetes', 'Public Beta Launch', '/production-deployment/launch-center'].forEach((token) => {
    assert.match(source, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
});

test('Phase 61 package versions and worker scripts are present', () => {
  const rootPkg = JSON.parse(read('package.json'));
  const webPkg = JSON.parse(read('apps/web/package.json'));
  const apiPkg = JSON.parse(read('apps/api/package.json'));
  assertReleaseVersions();


  assert.equal(apiPkg.scripts['worker:start'], 'node dist/worker.js');
  assert.equal(apiPkg.scripts['ai-worker:start'], 'node dist/ai-worker.js');
});
