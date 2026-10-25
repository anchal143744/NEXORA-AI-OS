import { strategyPlanSignals } from '@/lib/autonomous-enterprise';
import { AutonomousEnterprisePanel } from './autonomous-enterprise-panel';

export function AiStrategyPlanner() {
  return (
    <AutonomousEnterprisePanel
      eyebrow="AI Strategy Planner"
      title="Quarterly, annual and growth planning"
      description="Quarterly Planning, Annual Planning, Strategic Roadmaps and Growth Planning turn recommendations into executive roadmaps."
      items={strategyPlanSignals.map((item) => ({ title: item.plan, meta: item.horizon, detail: item.roadmap + ' ' + item.outcome, status: item.status }))}
    />
  );
}
