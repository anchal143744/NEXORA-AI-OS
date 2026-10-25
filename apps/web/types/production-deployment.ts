export type EnvironmentTier = 'development' | 'staging' | 'production';
export type ReadinessState = 'ready' | 'watch' | 'blocked';
export type DeploymentProvider = 'github-actions' | 'azure-devops' | 'gitlab-ci';

export interface ProductionEnvironment {
  id: EnvironmentTier;
  label: string;
  isolation: string;
  configSource: string;
  secretSource: string;
  deploymentPolicy: string;
  healthTarget: string;
  state: ReadinessState;
}

export interface InfrastructureService {
  id: string;
  name: string;
  tier: 'frontend' | 'api' | 'worker' | 'database' | 'cache' | 'storage' | 'ai';
  runtime: string;
  scaling: string;
  readiness: string;
}

export interface CidcPipeline {
  provider: DeploymentProvider;
  stages: string[];
  approvalGate: string;
  rollbackMode: string;
  artifactPolicy: string;
}

export interface ContainerImageSpec {
  id: string;
  image: string;
  dockerfile: string;
  command: string;
  healthcheck: string;
}

export interface KubernetesWorkload {
  id: string;
  manifest: string;
  replicas: string;
  rollout: string;
  recovery: string;
}

export interface MonitoringSignal {
  id: string;
  label: string;
  metric: string;
  target: string;
  alert: string;
}

export interface LogStream {
  id: string;
  source: string;
  retention: string;
  routing: string;
  protection: string;
}

export interface SecurityHardeningControl {
  id: string;
  area: string;
  control: string;
  evidence: string;
  state: ReadinessState;
}

export interface BackupPolicy {
  id: string;
  scope: string;
  cadence: string;
  retention: string;
  recoveryTarget: string;
}

export interface LaunchReadinessGate {
  id: string;
  gate: string;
  owner: string;
  state: ReadinessState;
  evidence: string;
}

export interface ProductionMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface ProductionRoute {
  path: string;
  module: string;
  marker: string;
}
