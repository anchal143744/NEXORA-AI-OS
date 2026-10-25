import { knowledgeReasoningSignals } from '@/lib/autonomous-enterprise';
import { AutonomousEnterprisePanel } from './autonomous-enterprise-panel';

export function EnterpriseKnowledgeReasoningGraph() {
  return (
    <AutonomousEnterprisePanel
      eyebrow="Enterprise Knowledge Reasoning Graph"
      title="Relationship discovery and context awareness"
      description="Relationship Discovery, Context Awareness, Knowledge Linking and Enterprise Intelligence give AI agents a coherent business graph."
      items={knowledgeReasoningSignals.map((item) => ({ title: item.capability, meta: item.context, detail: item.intelligence, status: item.status }))}
    />
  );
}
