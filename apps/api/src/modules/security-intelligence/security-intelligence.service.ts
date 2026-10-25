import { Injectable } from '@nestjs/common';
import { SecurityAuditService } from './security-audit.service';
import { SecurityCommandService } from './security-command.service';
import { SecurityRiskService } from './security-risk.service';
import { ThreatDetectionService } from './threat-detection.service';
import { ZeroTrustService } from './zero-trust.service';

@Injectable()
export class SecurityIntelligenceService {
  constructor(
    private readonly command: SecurityCommandService,
    private readonly threats: ThreatDetectionService,
    private readonly risk: SecurityRiskService,
    private readonly audits: SecurityAuditService,
    private readonly zeroTrust: ZeroTrustService,
  ) {}

  async dashboard() {
    const [commandCenter, threatMonitoring, riskAssessment, compliance, zeroTrust] = await Promise.all([this.command.commandCenter(), this.threats.monitoring(), this.risk.assessment(), this.audits.complianceMonitoring(), this.zeroTrust.accessLayer()]);
    return { commandCenter, threatMonitoring, riskAssessment, compliance, zeroTrust, summary: { openIncidents: commandCenter.summary.openIncidentCount, criticalAlerts: commandCenter.summary.criticalAlertCount, activeThreats: threatMonitoring.summary.activeThreatCount, openRisks: riskAssessment.summary.openRiskCount, openComplianceViolations: compliance.summary.openViolationCount, deniedAccess: zeroTrust.summary.deniedVerificationCount } };
  }

  commandCenter() { return this.command.commandCenter(); }
  threatSummary() { return this.threats.monitoring(); }
  recommendations() { return this.dashboard().then((dashboard) => ({ recommendations: [{ type: 'zero_trust', priority: dashboard.summary.deniedAccess > 0 ? 'high' : 'medium', action: 'Review denied and step-up access verifications.' }, { type: 'threat_detection', priority: dashboard.summary.activeThreats > 0 ? 'high' : 'low', action: 'Tune active threat rules and correlate recent threat events.' }, { type: 'compliance', priority: dashboard.summary.openComplianceViolations > 0 ? 'high' : 'medium', action: 'Generate remediation evidence for open compliance violations.' }], dashboard: dashboard.summary })); }
  complianceMonitoring() { return this.audits.complianceMonitoring(); }
  posture() { return this.risk.posture(); }
}