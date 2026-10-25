import { Injectable } from '@nestjs/common';
import { AiAuditComplianceService } from './ai-audit-compliance.service';
import { AiExplainabilityService } from './ai-explainability.service';
import { DecisionIntelligenceService } from './decision-intelligence.service';
import { ModelPerformanceService } from './model-performance.service';
import { ModelRegistryService } from './model-registry.service';
import { ModelOpsService } from './modelops.service';

@Injectable()
export class AiGovernanceService {
  constructor(
    private readonly registry: ModelRegistryService,
    private readonly modelOps: ModelOpsService,
    private readonly decisions: DecisionIntelligenceService,
    private readonly auditCompliance: AiAuditComplianceService,
    private readonly explainability: AiExplainabilityService,
    private readonly performance: ModelPerformanceService,
  ) {}

  async center() {
    const [registry, lifecycle, decisionDashboard, compliance, performance] = await Promise.all([this.registry.dashboard(), this.modelOps.lifecycle(), this.decisions.dashboard(), this.auditCompliance.complianceDashboard(), this.performance.dashboard()]);
    return { registry, lifecycle, decisionDashboard, compliance, performance, summary: { modelCount: registry.summary.modelCount, highRiskModelCount: registry.summary.highRiskModelCount, pendingApprovals: lifecycle.summary.pendingApprovals, openDecisionRisks: decisionDashboard.summary.openRiskCount, complianceFailures: compliance.summary.failedCount, performanceAlerts: performance.summary.alertCount } };
  }

  riskMonitoring() {
    return Promise.all([this.decisions.risks(undefined, undefined, 'open'), this.performance.drift(), this.modelOps.deployments(undefined, undefined, 'degraded')]).then(([decisionRisks, drift, degradedDeployments]) => ({ decisionRisks, drift, degradedDeployments, summary: { openDecisionRiskCount: decisionRisks.length, driftAlertCount: drift.driftAlerts.length, degradedDeploymentCount: degradedDeployments.length } }));
  }

  policy() { return this.registry.registries().then((registries: Array<{ id: string; governancePolicy: unknown; accessPolicy: unknown }>) => ({ registries, policies: registries.map((registry) => ({ registryId: registry.id, governancePolicy: registry.governancePolicy, accessPolicy: registry.accessPolicy })) })); }

  auditability() { return Promise.all([this.auditCompliance.auditTrail(), this.explainability.records()]).then(([audit, explanations]) => ({ audit, explanations })); }
}