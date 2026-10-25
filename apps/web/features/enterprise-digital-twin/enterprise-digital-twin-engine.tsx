import { twinEntities } from '@/lib/enterprise-digital-twin';
import { DigitalTwinPanel } from './digital-twin-panel';

export function EnterpriseDigitalTwinEngine() {
  return (
    <DigitalTwinPanel
      eyebrow="Digital Twin Engine"
      title="Simulation-ready enterprise model"
      description="The digital twin synchronizes business context across people, customers, revenue, operations, projects, assets and finance."
      items={twinEntities.map((item) => ({ title: item.entity, meta: item.signal, detail: item.insight, score: item.synchronization, status: item.status }))}
    />
  );
}
