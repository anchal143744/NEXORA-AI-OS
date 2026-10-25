'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { AiExpansionPlatform } from './ai-expansion-platform';
import { CustomerExpansionEngine } from './customer-expansion-engine';
import { CustomerRetentionCenter } from './customer-retention-center';
import { EnterpriseAccountManagement } from './enterprise-account-management';
import { EnterpriseSuccessDashboard } from './enterprise-success-dashboard';
import { ExecutiveGrowthIntelligence } from './executive-growth-intelligence';
import { GlobalScaleReadiness } from './global-scale-readiness';
import { GrowthCommandCenter } from './growth-command-center';
import { GrowthProgramHome } from './growth-program-home';
import { GrowthProgramNavigation } from './growth-program-navigation';
import { MultiAgentIntelligenceNetwork } from './multi-agent-intelligence-network';
import { ProductAdoptionIntelligence } from './product-adoption-intelligence';
import { RevenueExpansionIntelligence } from './revenue-expansion-intelligence';
import { UsageAnalyticsCenter } from './usage-analytics-center';

export function GrowthProgramWorkspace({ activeSection }: { activeSection?: string }) {
  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><TrendingUp className="size-3" />Phase 66 Growth Program</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Post-launch growth, AI expansion and global enterprise scale program.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">Customer expansion, product adoption, AI capabilities, enterprise growth, retention, usage analytics, revenue expansion, global scale readiness and executive growth intelligence are unified into one post-launch operating surface.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSection ? <Badge variant="info"><Zap className="size-3" />{activeSection}</Badge> : null}
            <Badge variant="success"><TrendingUp className="size-3" />2.6.0 ready</Badge>
          </div>
        </motion.div>
        <motion.div variants={staggerItem}><GrowthProgramNavigation /></motion.div>
        <motion.div variants={staggerItem}><GrowthProgramHome /></motion.div>
        <motion.div variants={staggerItem}><GrowthCommandCenter /></motion.div>
        <motion.div variants={staggerItem}><ProductAdoptionIntelligence /></motion.div>
        <motion.div variants={staggerItem}><CustomerExpansionEngine /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseAccountManagement /></motion.div>
        <motion.div variants={staggerItem}><AiExpansionPlatform /></motion.div>
        <motion.div variants={staggerItem}><MultiAgentIntelligenceNetwork /></motion.div>
        <motion.div variants={staggerItem}><UsageAnalyticsCenter /></motion.div>
        <motion.div variants={staggerItem}><RevenueExpansionIntelligence /></motion.div>
        <motion.div variants={staggerItem}><CustomerRetentionCenter /></motion.div>
        <motion.div variants={staggerItem}><GlobalScaleReadiness /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseSuccessDashboard /></motion.div>
        <motion.div variants={staggerItem}><ExecutiveGrowthIntelligence /></motion.div>
      </motion.div>
    </EnterpriseShell>
  );
}
