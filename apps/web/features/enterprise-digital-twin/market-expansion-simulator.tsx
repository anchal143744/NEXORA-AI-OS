import { marketExpansionModels } from '@/lib/enterprise-digital-twin';
import { DigitalTwinPanel } from './digital-twin-panel';

export function MarketExpansionSimulator() {
  return (
    <DigitalTwinPanel
      eyebrow="Market Expansion Simulator"
      title="Model countries, regions, industries and segments"
      description="Evaluates New Countries, New Regions, New Industries and New Customer Segments for expansion strategy."
      items={marketExpansionModels.map((item) => ({ title: item.market, value: item.readiness, meta: item.opportunity, detail: item.risk, status: item.status }))}
    />
  );
}
