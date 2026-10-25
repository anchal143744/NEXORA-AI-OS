import { selfOptimizingSignals } from '@/lib/autonomous-enterprise';
import { AutonomousEnterprisePanel } from './autonomous-enterprise-panel';

export function SelfOptimizingOperationsLayer() {
  return (
    <AutonomousEnterprisePanel
      eyebrow="Self Optimizing Operations Layer"
      title="Continuous improvement loop"
      description="Performance Monitoring, Optimization Suggestions, Continuous Improvement and AI Driven Enhancements make operations improve after every cycle."
      items={selfOptimizingSignals.map((item) => ({ title: item.signal, meta: item.area, detail: item.recommendation + ' ' + item.impact, status: item.status }))}
    />
  );
}
