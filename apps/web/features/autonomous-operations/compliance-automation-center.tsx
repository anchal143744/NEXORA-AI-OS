import { complianceAutomationSignals } from '@/lib/autonomous-operations';
import { AutonomousOperationsPanel } from './autonomous-operations-panel';

export function ComplianceAutomationCenter() {
  return (
    <AutonomousOperationsPanel
      eyebrow="Compliance Automation Center"
      title="Automated compliance checks and reporting"
      description="Supports Automated Checks, Audit Preparation, Policy Validation and Governance Reporting for enterprise operations."
      items={complianceAutomationSignals.map((item) => ({ title: item.capability, meta: item.cadence + ' | ' + item.owner, detail: item.output, status: item.status }))}
    />
  );
}
