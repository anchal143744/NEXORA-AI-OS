import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'Dockerfile.api',
  'Dockerfile.web',
  'Dockerfile.worker',
  'Dockerfile.ai-worker',
  'docker-compose.production.yml',
  '.github/workflows/production-release.yml',
  'infra/nginx/nexora.conf',
  'infra/kubernetes/namespace.yaml',
  'infra/kubernetes/configmap.yaml',
  'infra/kubernetes/secrets.example.yaml',
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
  'infra/env/.env.production.example',
  'infra/env/.env.staging.example',
];

const missing = requiredFiles.filter((file) => !existsSync(join(root, file)));
const inspected = requiredFiles
  .filter((file) => existsSync(join(root, file)))
  .map((file) => ({ file, hasTodo: /TODO|FIXME/i.test(readFileSync(join(root, file), 'utf8')) }));
const todoFiles = inspected.filter((item) => item.hasTodo).map((item) => item.file);

const compose = readFileSync(join(root, 'docker-compose.production.yml'), 'utf8');
const workflow = readFileSync(join(root, '.github/workflows/production-release.yml'), 'utf8');
const kubernetes = readFileSync(join(root, 'infra/kubernetes/api-deployment.yaml'), 'utf8');

const checks = [
  { name: 'required files', passed: missing.length === 0, detail: (requiredFiles.length - missing.length) + '/' + requiredFiles.length + ' files present' },
  { name: 'no TODO markers', passed: todoFiles.length === 0, detail: todoFiles.join(', ') || 'clean' },
  { name: 'compose services', passed: ['postgres', 'redis', 'api', 'web', 'worker', 'ai-worker'].every((token) => compose.includes(token + ':')), detail: 'compose services verified' },
  { name: 'release workflow', passed: ['prisma validate', 'web:build', 'production-readiness-check'].every((token) => workflow.includes(token)), detail: 'release gates verified' },
  { name: 'kubernetes probes', passed: ['readinessProbe', 'livenessProbe', 'RollingUpdate'].every((token) => kubernetes.includes(token)), detail: 'deployment probes verified' },
];

const failed = checks.filter((check) => !check.passed);
const result = {
  status: failed.length === 0 ? 'PASSED' : 'FAILED',
  checkedAt: new Date().toISOString(),
  checks,
  missing,
  todoFiles,
};

console.log(JSON.stringify(result, null, 2));

if (failed.length > 0) {
  process.exitCode = 1;
}
