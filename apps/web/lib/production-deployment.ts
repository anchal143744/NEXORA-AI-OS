import type {
  BackupPolicy,
  CidcPipeline,
  ContainerImageSpec,
  InfrastructureService,
  KubernetesWorkload,
  LaunchReadinessGate,
  LogStream,
  MonitoringSignal,
  ProductionEnvironment,
  ProductionMetric,
  ProductionRoute,
  SecurityHardeningControl,
} from '@/types/production-deployment';

export const productionMetrics: ProductionMetric[] = [
  { id: 'deployment-status', label: 'Deployment Status', value: '3 envs', detail: 'Development, staging and production paths are isolated with approval gates.' },
  { id: 'service-health', label: 'Service Health', value: '99.95%', detail: 'API, web, workers, Redis and PostgreSQL have explicit probes and SLO targets.' },
  { id: 'release-controls', label: 'Release Controls', value: '4 gates', detail: 'Build, test, security and executive approval must pass before production.' },
  { id: 'recovery-target', label: 'Recovery Target', value: 'RPO 15m', detail: 'Database, config, workflow and object storage backups are scheduled.' },
  { id: 'observability', label: 'Observability', value: '12 signals', detail: 'Latency, throughput, errors, queues, AI runtime and database usage are tracked.' },
];

export const productionEnvironments: ProductionEnvironment[] = [
  { id: 'development', label: 'Development', isolation: 'Local Docker Compose with disposable volumes', configSource: 'infra/env/.env.development.local', secretSource: 'developer vault', deploymentPolicy: 'automatic preview builds', healthTarget: 'smoke checks before merge', state: 'ready' },
  { id: 'staging', label: 'Staging', isolation: 'Dedicated namespace and staging database', configSource: 'infra/env/.env.staging.example', secretSource: 'sealed Kubernetes secret', deploymentPolicy: 'approval after tests and audit', healthTarget: 'release-candidate validation', state: 'ready' },
  { id: 'production', label: 'Production', isolation: 'Production namespace, isolated database and protected storage', configSource: 'infra/env/.env.production.example', secretSource: 'external secret manager', deploymentPolicy: 'manual approval with rollback checkpoint', healthTarget: 'SLO and launch readiness gates', state: 'watch' },
];

export const infrastructureServices: InfrastructureService[] = [
  { id: 'web', name: 'Frontend Service', tier: 'frontend', runtime: 'Next.js 15 Node runtime', scaling: '2-10 replicas by CPU and request latency', readiness: '/ health and route smoke' },
  { id: 'api', name: 'API Service', tier: 'api', runtime: 'NestJS on Node 22', scaling: '2-12 replicas by CPU and throughput', readiness: '/v1/health readiness probe' },
  { id: 'worker', name: 'Background Worker', tier: 'worker', runtime: 'Nest application context worker', scaling: '1-8 replicas by BullMQ depth', readiness: 'queue heartbeat and Redis ping' },
  { id: 'ai-worker', name: 'AI Execution Worker', tier: 'ai', runtime: 'Nest application context AI worker', scaling: '1-8 replicas by AI queue latency', readiness: 'provider health and token budget guard' },
  { id: 'postgres', name: 'PostgreSQL', tier: 'database', runtime: 'PostgreSQL 16', scaling: 'primary with backup and restore policy', readiness: 'pg_isready and migration gate' },
  { id: 'redis', name: 'Redis', tier: 'cache', runtime: 'Redis 7', scaling: 'single primary foundation with persistence', readiness: 'PING and memory usage alert' },
  { id: 'storage', name: 'Object Storage', tier: 'storage', runtime: 'S3-compatible bucket', scaling: 'regional object store lifecycle policy', readiness: 'signed upload and restore probe' },
];

export const cicdPipelines: CidcPipeline[] = [
  { provider: 'github-actions', stages: ['install', 'prisma validate', 'typecheck', 'test', 'build', 'containerize', 'security scan', 'deploy'], approvalGate: 'required for production environment', rollbackMode: 'kubectl rollout undo plus database backup checkpoint', artifactPolicy: 'GitHub Actions immutable image tags using git SHA' },
  { provider: 'azure-devops', stages: ['restore', 'validate', 'test', 'build', 'publish', 'approval', 'release'], approvalGate: 'environment approval check', rollbackMode: 'deployment slot rollback', artifactPolicy: 'container registry retention policy' },
  { provider: 'gitlab-ci', stages: ['prepare', 'quality', 'package', 'scan', 'release'], approvalGate: 'manual production job', rollbackMode: 'previous image redeploy', artifactPolicy: 'protected registry tags' },
];

export const containerImages: ContainerImageSpec[] = [
  { id: 'api', image: 'nexora/api', dockerfile: 'Dockerfile.api', command: 'npm --workspace @nexora/api run start', healthcheck: 'GET /v1/health' },
  { id: 'web', image: 'nexora/web', dockerfile: 'Dockerfile.web', command: 'npm --workspace @nexora/web run start', healthcheck: 'GET /' },
  { id: 'worker', image: 'nexora/worker', dockerfile: 'Dockerfile.worker', command: 'npm --workspace @nexora/api run worker:start', healthcheck: 'Redis heartbeat' },
  { id: 'ai-worker', image: 'nexora/ai-worker', dockerfile: 'Dockerfile.ai-worker', command: 'npm --workspace @nexora/api run ai-worker:start', healthcheck: 'AI provider readiness' },
];

export const kubernetesWorkloads: KubernetesWorkload[] = [
  { id: 'api', manifest: 'infra/kubernetes/api-deployment.yaml', replicas: '3 min / 12 max', rollout: 'rolling update with maxUnavailable 0', recovery: 'readiness probe removes bad pods' },
  { id: 'web', manifest: 'infra/kubernetes/web-deployment.yaml', replicas: '2 min / 10 max', rollout: 'rolling update with request based HPA', recovery: 'liveness probe restarts unhealthy pods' },
  { id: 'worker', manifest: 'infra/kubernetes/worker-deployment.yaml', replicas: '1 min / 8 max', rollout: 'queue drain before termination', recovery: 'dead letter queue and retry policy' },
  { id: 'ai-worker', manifest: 'infra/kubernetes/ai-worker-deployment.yaml', replicas: '1 min / 8 max', rollout: 'token budget guard before rollout', recovery: 'provider failover and retry queue' },
  { id: 'postgres', manifest: 'infra/kubernetes/postgres-statefulset.yaml', replicas: 'stateful primary', rollout: 'manual migration gate', recovery: 'point-in-time restore runbook' },
  { id: 'redis', manifest: 'infra/kubernetes/redis-deployment.yaml', replicas: 'single primary foundation', rollout: 'rolling restart with persistent volume', recovery: 'AOF persistence and reconnect backoff' },
];

export const monitoringSignals: MonitoringSignal[] = [
  { id: 'latency', label: 'API Response Time', metric: 'http_request_duration_seconds', target: 'p95 < 450ms', alert: 'p95 above 800ms for 10 minutes' },
  { id: 'throughput', label: 'API Throughput', metric: 'http_requests_total', target: 'tracked by route and tenant', alert: 'unexpected 40% traffic drop' },
  { id: 'errors', label: 'Error Rate', metric: 'http_request_errors_total', target: '< 1%', alert: '5xx above 2% for 5 minutes' },
  { id: 'queues', label: 'Queue Depth', metric: 'bullmq_waiting_jobs', target: '< 500 waiting per queue', alert: 'queue depth above 1000' },
  { id: 'ai-runtime', label: 'AI Runtime Health', metric: 'ai_execution_latency_seconds', target: 'p95 < 30s', alert: 'provider failures above 3%' },
  { id: 'database', label: 'Database Usage', metric: 'postgres_connection_usage', target: '< 75%', alert: 'connections above 85%' },
];

export const logStreams: LogStream[] = [
  { id: 'application', source: 'API and Web application logs', retention: '30 days hot, 365 days archive', routing: 'central log collector with tenant metadata', protection: 'PII redaction before export' },
  { id: 'audit', source: 'Audit and compliance events', retention: '7 years archive', routing: 'append-only audit stream', protection: 'write-once storage policy' },
  { id: 'security', source: 'Auth, RBAC, rate limit and incident logs', retention: '3 years archive', routing: 'security index and alert pipeline', protection: 'restricted security operations role' },
  { id: 'ai', source: 'AI executions, prompts and provider events', retention: '365 days with prompt redaction', routing: 'AI governance index', protection: 'tenant and workspace scoped retrieval' },
];

export const securityControls: SecurityHardeningControl[] = [
  { id: 'rbac', area: 'RBAC', control: 'Workspace and tenant scoped permissions remain enforced before deployment', evidence: 'Phase 3-50 security foundation plus release gate checks', state: 'ready' },
  { id: 'rate-limit', area: 'Rate Limiting', control: 'Per tenant, user, API key and workspace throttles are checked before release', evidence: 'production readiness script validates env limits', state: 'ready' },
  { id: 'secrets', area: 'Secrets Protection', control: 'Examples only are committed; production values must come from the secret manager', evidence: 'Kubernetes secret example uses stringData and no real credentials', state: 'ready' },
  { id: 'encryption', area: 'Encryption', control: 'TLS ingress, database SSL and backup encryption are mandatory in production', evidence: 'NGINX and Kubernetes ingress enforce HTTPS', state: 'watch' },
  { id: 'headers', area: 'Security Headers', control: 'NGINX applies HSTS, frame, content type and referrer protections', evidence: 'infra/nginx/nexora.conf', state: 'ready' },
];

export const backupPolicies: BackupPolicy[] = [
  { id: 'database', scope: 'PostgreSQL database', cadence: '15 minute WAL archive plus daily full backup', retention: '35 days hot, 1 year archive', recoveryTarget: 'RPO 15m / RTO 60m' },
  { id: 'object-storage', scope: 'S3-compatible files and documents', cadence: 'daily versioned replication', retention: '365 days', recoveryTarget: 'object-level restore within 4 hours' },
  { id: 'configuration', scope: 'Environment config and release manifests', cadence: 'on every release', retention: 'all tagged release artifacts', recoveryTarget: 'restore previous release in 20 minutes' },
  { id: 'audit', scope: 'Audit logs and compliance evidence', cadence: 'continuous append-only export', retention: '7 years', recoveryTarget: 'searchable restore within 24 hours' },
];

export const launchReadinessGates: LaunchReadinessGate[] = [
  { id: 'backend', gate: 'Backend build and health checks', owner: 'Platform Engineering', state: 'ready', evidence: 'Nest build, health probes and route smoke included in release checklist' },
  { id: 'frontend', gate: 'Frontend build and route checks', owner: 'Product Engineering', state: 'ready', evidence: 'Next production build and Production Ops routes are validated' },
  { id: 'security', gate: 'Security and dependency audit', owner: 'Security Operations', state: 'watch', evidence: 'Known non-critical advisories remain tracked for remediation decisions' },
  { id: 'monitoring', gate: 'Monitoring and centralized logging', owner: 'SRE', state: 'ready', evidence: 'Prometheus, alert rules, Grafana dashboard and Vector logging are present' },
  { id: 'backup', gate: 'Backup and disaster recovery', owner: 'Cloud Operations', state: 'ready', evidence: 'Backup policy and recovery runbook define RPO, RTO and restore order' },
  { id: 'trial', gate: 'Enterprise trial environment', owner: 'Growth Operations', state: 'ready', evidence: 'Trial organization, demo workspace and guided setup contract are defined' },
];

export const trialEnvironmentModules = [
  'Trial organizations',
  'Demo workspaces',
  'Sample data packs',
  'Guided setup',
  'Workspace blueprint replay',
  'AI copilot onboarding prompts',
  'Usage monitoring',
  'Trial conversion handoff',
];

export const productionDeploymentNavigation = [
  { group: 'Deploy', items: ['Infrastructure', 'Environments', 'CI/CD', 'Containers', 'Kubernetes'] },
  { group: 'Operate', items: ['Monitoring', 'Logging', 'Security', 'Backup & Recovery'] },
  { group: 'Launch', items: ['Readiness Dashboard', 'Trial Environment', 'Launch Center'] },
];

export const phase61Routes: ProductionRoute[] = [
  { path: '/production-deployment', module: 'Production Deployment Workspace', marker: 'Production Deployment' },
  { path: '/production-deployment/infrastructure', module: 'Production Infrastructure', marker: 'Production Infrastructure' },
  { path: '/production-deployment/environments', module: 'Multi-Environment Management', marker: 'Environment Isolation' },
  { path: '/production-deployment/cicd', module: 'CI/CD Platform', marker: 'Release Pipeline' },
  { path: '/production-deployment/containers', module: 'Containerization Center', marker: 'Container Images' },
  { path: '/production-deployment/kubernetes', module: 'Kubernetes Deployment', marker: 'Kubernetes Workloads' },
  { path: '/production-deployment/monitoring', module: 'Monitoring & Observability', marker: 'Monitoring Signals' },
  { path: '/production-deployment/logging', module: 'Centralized Logging', marker: 'Log Streams' },
  { path: '/production-deployment/security', module: 'Security Hardening', marker: 'Security Controls' },
  { path: '/production-deployment/backup-recovery', module: 'Backup & Disaster Recovery', marker: 'Recovery Target' },
  { path: '/production-deployment/readiness', module: 'Production Readiness Dashboard', marker: 'Launch Readiness Gates' },
  { path: '/production-deployment/trial-environment', module: 'Enterprise Trial Environment', marker: 'Trial Organizations' },
  { path: '/production-deployment/launch-center', module: 'Launch Readiness Center', marker: 'Public Beta Launch' },
  { path: '/workspace/production-deployment', module: 'Production Deployment compatibility route', marker: 'Production Deployment' },
];
