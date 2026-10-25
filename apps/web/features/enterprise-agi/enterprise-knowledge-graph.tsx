import { knowledgeGraphRelations } from '@/lib/enterprise-agi';
import { EnterpriseAgiPanel } from './enterprise-agi-panel';

export function EnterpriseKnowledgeGraph() {
  return (
    <EnterpriseAgiPanel
      title="Enterprise Knowledge Graph"
      description="Creates relationships between Customers, Employees, Vendors, Assets, Projects, Revenue and Operations."
      metrics={[
        { label: 'Entities', value: String(knowledgeGraphRelations.length) },
        { label: 'Context', value: 'Graph' },
        { label: 'Discovery', value: 'Active' },
        { label: 'Evidence', value: 'Linked' },
      ]}
      items={knowledgeGraphRelations.map((item) => ({ id: item.id, title: item.entity, eyebrow: 'Knowledge Relation', description: item.relationship, detail: item.action, status: item.status }))}
    />
  );
}
