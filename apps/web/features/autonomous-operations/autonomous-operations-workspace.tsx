'use client';

import { motion } from 'framer-motion';
import { ServerCog, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { AiGovernanceEvolutionPlatform } from './ai-governance-evolution-platform';
import { AutonomousExecutionCenter } from './autonomous-execution-center';
import { AutonomousOperationsHome } from './autonomous-operations-home';
import { AutonomousOperationsNavigation } from './autonomous-operations-navigation';
import { AutonomousWorkflowRecovery } from './autonomous-workflow-recovery';
import { ComplianceAutomationCenter } from './compliance-automation-center';
import { EnterpriseMonitoringHub } from './enterprise-monitoring-hub';
import { EnterpriseResilienceDashboard } from './enterprise-resilience-dashboard';
import { ExecutiveOperationsCopilot } from './executive-operations-copilot';
import { IncidentPredictionEngine } from './incident-prediction-engine';
import { OperationalIntelligenceCenter } from './operational-intelligence-center';
import { SelfHealingOperationsEngine } from './self-healing-operations-engine';

export function AutonomousOperationsWorkspace({ activeSection }: { activeSection?: string }) {
  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><ServerCog className="size-3" />Phase 69 Autonomous Operations</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Self-healing operations and AI governance evolution.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">NEXORA now coordinates enterprise execution, monitors operational health, predicts incidents, recommends recovery, automates compliance evidence and evolves AI governance for autonomous operations.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSection ? <Badge variant="info"><Zap className="size-3" />{activeSection}</Badge> : null}
            <Badge variant="success"><ServerCog className="size-3" />2.9.0 ready</Badge>
          </div>
        </motion.div>
        <motion.div variants={staggerItem}><AutonomousOperationsNavigation /></motion.div>
        <motion.div variants={staggerItem}><AutonomousOperationsHome /></motion.div>
        <motion.div variants={staggerItem}><AutonomousExecutionCenter /></motion.div>
        <motion.div variants={staggerItem}><SelfHealingOperationsEngine /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseMonitoringHub /></motion.div>
        <motion.div variants={staggerItem}><OperationalIntelligenceCenter /></motion.div>
        <motion.div variants={staggerItem}><IncidentPredictionEngine /></motion.div>
        <motion.div variants={staggerItem}><AiGovernanceEvolutionPlatform /></motion.div>
        <motion.div variants={staggerItem}><ComplianceAutomationCenter /></motion.div>
        <motion.div variants={staggerItem}><AutonomousWorkflowRecovery /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseResilienceDashboard /></motion.div>
        <motion.div variants={staggerItem}><ExecutiveOperationsCopilot /></motion.div>
      </motion.div>
    </EnterpriseShell>
  );
}
