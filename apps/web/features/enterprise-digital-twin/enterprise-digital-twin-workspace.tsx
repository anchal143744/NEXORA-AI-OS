'use client';

import { motion } from 'framer-motion';
import { Network, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { BusinessSimulationCenter } from './business-simulation-center';
import { DigitalTwinNavigation } from './digital-twin-navigation';
import { EnterpriseDigitalTwinEngine } from './enterprise-digital-twin-engine';
import { EnterpriseDigitalTwinHome } from './enterprise-digital-twin-home';
import { ExecutiveStrategyCopilot } from './executive-strategy-copilot';
import { ForecastSimulationPlatform } from './forecast-simulation-platform';
import { MarketExpansionSimulator } from './market-expansion-simulator';
import { ResourceAllocationSimulator } from './resource-allocation-simulator';
import { RevenueSimulationEngine } from './revenue-simulation-engine';
import { RiskSimulationCenter } from './risk-simulation-center';
import { ScenarioIntelligenceEngine } from './scenario-intelligence-engine';
import { StrategicPlanningWorkspace } from './strategic-planning-workspace';

export function EnterpriseDigitalTwinWorkspace({ activeSection }: { activeSection?: string }) {
  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><Network className="size-3" />Phase 68 Enterprise Digital Twin</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Simulation intelligence and autonomous strategic planning.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">NEXORA now models the enterprise as a digital twin so executives can simulate business outcomes, forecast future states, evaluate risk, optimize resources and generate board-level plans.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSection ? <Badge variant="info"><Zap className="size-3" />{activeSection}</Badge> : null}
            <Badge variant="success"><Network className="size-3" />2.8.0 ready</Badge>
          </div>
        </motion.div>
        <motion.div variants={staggerItem}><DigitalTwinNavigation /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseDigitalTwinHome /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseDigitalTwinEngine /></motion.div>
        <motion.div variants={staggerItem}><BusinessSimulationCenter /></motion.div>
        <motion.div variants={staggerItem}><StrategicPlanningWorkspace /></motion.div>
        <motion.div variants={staggerItem}><ScenarioIntelligenceEngine /></motion.div>
        <motion.div variants={staggerItem}><ForecastSimulationPlatform /></motion.div>
        <motion.div variants={staggerItem}><RiskSimulationCenter /></motion.div>
        <motion.div variants={staggerItem}><ResourceAllocationSimulator /></motion.div>
        <motion.div variants={staggerItem}><RevenueSimulationEngine /></motion.div>
        <motion.div variants={staggerItem}><MarketExpansionSimulator /></motion.div>
        <motion.div variants={staggerItem}><ExecutiveStrategyCopilot /></motion.div>
      </motion.div>
    </EnterpriseShell>
  );
}
