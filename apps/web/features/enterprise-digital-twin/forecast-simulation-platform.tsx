import { forecastSignals } from '@/lib/enterprise-digital-twin';
import { DigitalTwinPanel } from './digital-twin-panel';

export function ForecastSimulationPlatform() {
  return (
    <DigitalTwinPanel
      eyebrow="Forecast Simulation Platform"
      title="Forecast revenue, profitability and growth"
      description="Predicts Revenue, Profitability, Customer Growth, Team Expansion and Market Share with explicit drivers."
      items={forecastSignals.map((item) => ({ title: item.metric, value: item.forecast, meta: item.current, detail: item.driver, status: item.status }))}
    />
  );
}
