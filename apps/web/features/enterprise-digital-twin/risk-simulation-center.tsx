import { riskSignals } from '@/lib/enterprise-digital-twin';
import { DigitalTwinPanel } from './digital-twin-panel';

export function RiskSimulationCenter() {
  return (
    <DigitalTwinPanel
      eyebrow="Risk Simulation Center"
      title="Evaluate enterprise risk before execution"
      description="Evaluates Financial Risk, Operational Risk, Compliance Risk, Workforce Risk and Vendor Risk with mitigation owners."
      items={riskSignals.map((item) => ({ title: item.risk, meta: item.exposure + ' | ' + item.owner, detail: item.mitigation, status: item.status }))}
    />
  );
}
