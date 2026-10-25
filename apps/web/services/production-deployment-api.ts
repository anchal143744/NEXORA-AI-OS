import {
  backupPolicies,
  cicdPipelines,
  containerImages,
  infrastructureServices,
  kubernetesWorkloads,
  launchReadinessGates,
  logStreams,
  monitoringSignals,
  productionEnvironments,
  productionMetrics,
  trialEnvironmentModules,
} from '@/lib/production-deployment';

export async function getProductionDeploymentSnapshot() {
  return {
    metrics: productionMetrics,
    environments: productionEnvironments,
    infrastructure: infrastructureServices,
    pipelines: cicdPipelines,
    containers: containerImages,
    kubernetes: kubernetesWorkloads,
    monitoring: monitoringSignals,
    logging: logStreams,
    backups: backupPolicies,
    readiness: launchReadinessGates,
    trialModules: trialEnvironmentModules,
    generatedAt: new Date().toISOString(),
  };
}

export const productionDeploymentEndpoints = {
  environments: '/v1/production/environments',
  deployments: '/v1/production/deployments',
  health: '/v1/production/health',
  monitoring: '/v1/production/monitoring',
  logs: '/v1/production/logs',
  backups: '/v1/production/backups',
  launchReadiness: '/v1/production/launch-readiness',
};
