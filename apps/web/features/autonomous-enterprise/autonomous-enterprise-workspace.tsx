'use client';

import { motion } from 'framer-motion';
import { Bot, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { AdvancedReasoningEngine } from './advanced-reasoning-engine';
import { AiExecutiveAdvisor } from './ai-executive-advisor';
import { AiStrategyPlanner } from './ai-strategy-planner';
import { AutonomousEnterpriseCommandCenter } from './autonomous-enterprise-command-center';
import { AutonomousEnterpriseHome } from './autonomous-enterprise-home';
import { AutonomousEnterpriseNavigation } from './autonomous-enterprise-navigation';
import { AutonomousWorkflowOptimization } from './autonomous-workflow-optimization';
import { BusinessSimulationEngine } from './business-simulation-engine';
import { EnterpriseKnowledgeReasoningGraph } from './enterprise-knowledge-reasoning-graph';
import { ExecutiveCopilotWorkspace } from './executive-copilot-workspace';
import { GoalDrivenEnterpriseAutomation } from './goal-driven-enterprise-automation';
import { MultiAgentCollaborationNetwork } from './multi-agent-collaboration-network';
import { PredictiveDecisionIntelligence } from './predictive-decision-intelligence';
import { SelfOptimizingOperationsLayer } from './self-optimizing-operations-layer';

export function AutonomousEnterpriseWorkspace({ activeSection }: { activeSection?: string }) {
  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><Bot className="size-3" />Phase 67 Autonomous AI Enterprise</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Advanced reasoning and self-optimizing business operations.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">NEXORA now coordinates reasoning, planning, simulation, multi-agent execution, executive advisory, predictive decisions, goal-driven automation and knowledge graph intelligence in one autonomous operating layer.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSection ? <Badge variant="info"><Zap className="size-3" />{activeSection}</Badge> : null}
            <Badge variant="success"><Bot className="size-3" />2.7.0 ready</Badge>
          </div>
        </motion.div>
        <motion.div variants={staggerItem}><AutonomousEnterpriseNavigation /></motion.div>
        <motion.div variants={staggerItem}><AutonomousEnterpriseHome /></motion.div>
        <motion.div variants={staggerItem}><AutonomousEnterpriseCommandCenter /></motion.div>
        <motion.div variants={staggerItem}><AdvancedReasoningEngine /></motion.div>
        <motion.div variants={staggerItem}><MultiAgentCollaborationNetwork /></motion.div>
        <motion.div variants={staggerItem}><AiExecutiveAdvisor /></motion.div>
        <motion.div variants={staggerItem}><AutonomousWorkflowOptimization /></motion.div>
        <motion.div variants={staggerItem}><PredictiveDecisionIntelligence /></motion.div>
        <motion.div variants={staggerItem}><BusinessSimulationEngine /></motion.div>
        <motion.div variants={staggerItem}><GoalDrivenEnterpriseAutomation /></motion.div>
        <motion.div variants={staggerItem}><SelfOptimizingOperationsLayer /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseKnowledgeReasoningGraph /></motion.div>
        <motion.div variants={staggerItem}><AiStrategyPlanner /></motion.div>
        <motion.div variants={staggerItem}><ExecutiveCopilotWorkspace /></motion.div>
      </motion.div>
    </EnterpriseShell>
  );
}
