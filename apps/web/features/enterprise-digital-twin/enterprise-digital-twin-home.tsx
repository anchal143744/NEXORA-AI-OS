import { twinEntities } from '@/lib/enterprise-digital-twin';
import { DigitalTwinPanel } from './digital-twin-panel';

export function EnterpriseDigitalTwinHome() {
  return (
    <DigitalTwinPanel
      eyebrow="Enterprise Digital Twin Engine"
      title="Virtual model of the enterprise"
      description="Organization, Workforce, Revenue, Customers, Operations, Projects, Assets and Financial Systems are represented as one simulation-ready model."
      items={twinEntities.map((item) => ({ title: item.entity, meta: item.signal, detail: item.insight, score: item.synchronization, status: item.status }))}
    />
  );
}
