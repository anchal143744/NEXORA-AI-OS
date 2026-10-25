import { goalAutomationSignals } from '@/lib/autonomous-enterprise';
import { AutonomousEnterprisePanel } from './autonomous-enterprise-panel';

export function GoalDrivenEnterpriseAutomation() {
  return (
    <AutonomousEnterprisePanel
      eyebrow="Goal Driven Enterprise Automation"
      title="Goals converted into action plans"
      description="Goal Assignment, Goal Monitoring, Goal Achievement Tracking and Automated Action Plans keep autonomous work tied to executive outcomes."
      items={goalAutomationSignals.map((item) => ({ title: item.goal, value: item.progress, meta: item.owner, detail: item.actionPlan, status: item.status }))}
    />
  );
}
