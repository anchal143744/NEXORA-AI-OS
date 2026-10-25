import { reasoningCapabilities } from '@/lib/autonomous-enterprise';
import { AutonomousEnterprisePanel } from './autonomous-enterprise-panel';

export function AdvancedReasoningEngine() {
  return (
    <AutonomousEnterprisePanel
      eyebrow="Advanced Reasoning Engine"
      title="Reasoning, planning and governed decisions"
      description="Supports Chain Of Thought Planning, Multi Step Decision Trees, Scenario Analysis, Strategic Reasoning and Business Logic Reasoning with executive-safe summaries."
      items={reasoningCapabilities.map((item) => ({ title: item.capability, meta: item.mode, detail: item.governance + ' ' + item.outcome, status: item.status }))}
    />
  );
}
