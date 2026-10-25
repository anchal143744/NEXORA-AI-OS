'use client';

import { motion } from 'framer-motion';
import { Bot, Sparkles, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { AutonomousBusinessEcosystem } from './autonomous-business-ecosystem';
import { CrossModuleCoordinationEngine } from './cross-module-coordination-engine';
import { EnterpriseAgiCore } from './enterprise-agi-core';
import { EnterpriseAgiHome } from './enterprise-agi-home';
import { EnterpriseAgiNavigation } from './enterprise-agi-navigation';
import { EnterpriseContextEngine } from './enterprise-context-engine';
import { EnterpriseKnowledgeGraph } from './enterprise-knowledge-graph';
import { ExecutiveAgiWorkspace } from './executive-agi-workspace';
import { MultiAgentCommandNetwork } from './multi-agent-command-network';
import { OrganizationalIntelligenceLayer } from './organizational-intelligence-layer';
import { StrategicCoordinationHub } from './strategic-coordination-hub';
import { UnifiedIntelligenceFabric } from './unified-intelligence-fabric';

export function EnterpriseAgiWorkspace({ activeSection }: { activeSection?: string }) {
  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><Bot className="size-3" />Phase 70 Enterprise AGI</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Unified intelligence fabric for autonomous enterprise coordination.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">NEXORA now connects modules, agents, knowledge graphs, context engines and executive decision systems into one coordinated AGI-powered enterprise ecosystem.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSection ? <Badge variant="info"><Zap className="size-3" />{activeSection}</Badge> : null}
            <Badge variant="success"><Sparkles className="size-3" />3.0.0 ready</Badge>
          </div>
        </motion.div>
        <motion.div variants={staggerItem}><EnterpriseAgiNavigation /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseAgiHome /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseAgiCore /></motion.div>
        <motion.div variants={staggerItem}><UnifiedIntelligenceFabric /></motion.div>
        <motion.div variants={staggerItem}><CrossModuleCoordinationEngine /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseKnowledgeGraph /></motion.div>
        <motion.div variants={staggerItem}><AutonomousBusinessEcosystem /></motion.div>
        <motion.div variants={staggerItem}><MultiAgentCommandNetwork /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseContextEngine /></motion.div>
        <motion.div variants={staggerItem}><OrganizationalIntelligenceLayer /></motion.div>
        <motion.div variants={staggerItem}><ExecutiveAgiWorkspace /></motion.div>
        <motion.div variants={staggerItem}><StrategicCoordinationHub /></motion.div>
      </motion.div>
    </EnterpriseShell>
  );
}
