import { organizationalMetrics } from '@/lib/enterprise-agi';
import { EnterpriseAgiPanel } from './enterprise-agi-panel';

export function OrganizationalIntelligenceLayer() {
  return (
    <EnterpriseAgiPanel
      title="Organizational Intelligence Layer"
      description="Analyzes Performance, Productivity, Growth, Risk and Opportunities with executive-readable recommendations."
      metrics={[
        { label: 'Metrics', value: String(organizationalMetrics.length) },
        { label: 'Health', value: '92' },
        { label: 'Watches', value: '7' },
        { label: 'Actions', value: '23' },
      ]}
      items={organizationalMetrics.map((item) => ({ id: item.id, title: item.metric, eyebrow: item.value, description: item.insight, detail: item.recommendation, status: item.status }))}
    />
  );
}
