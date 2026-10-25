import { scenarioCases } from '@/lib/enterprise-digital-twin';
import { DigitalTwinPanel } from './digital-twin-panel';

export function ScenarioIntelligenceEngine() {
  return (
    <DigitalTwinPanel
      eyebrow="Scenario Intelligence Engine"
      title="Best, expected and worst case intelligence"
      description="Compares Best Case, Expected Case and Worst Case assumptions with automatically generated business impact."
      items={scenarioCases.map((item) => ({ title: item.caseName, meta: item.assumptions, detail: item.businessImpact + ' ' + item.action, status: item.status }))}
    />
  );
}
