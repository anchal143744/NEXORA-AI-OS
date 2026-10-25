import { resourceAllocations } from '@/lib/enterprise-digital-twin';
import { DigitalTwinPanel } from './digital-twin-panel';

export function ResourceAllocationSimulator() {
  return (
    <DigitalTwinPanel
      eyebrow="Resource Allocation Simulator"
      title="Optimize teams, budget, infrastructure and projects"
      description="Models resource allocation decisions across teams, budget, infrastructure and project portfolio priorities."
      items={resourceAllocations.map((item) => ({ title: item.resource, meta: item.currentAllocation, detail: item.optimizedAllocation + ' ' + item.expectedOutcome, status: item.status }))}
    />
  );
}
