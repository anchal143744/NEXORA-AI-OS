'use client';

import { motion } from 'framer-motion';
import { Globe2, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { AdoptionIntelligenceCenter } from './adoption-intelligence-center';
import { AiLaunchCopilot } from './ai-launch-copilot';
import { CustomerAcquisitionEngine } from './customer-acquisition-engine';
import { CustomerSuccessLaunchHub } from './customer-success-launch-hub';
import { EnterpriseSalesEnablement } from './enterprise-sales-enablement';
import { EnterpriseTrialExperience } from './enterprise-trial-experience';
import { ExecutiveLaunchWarRoom } from './executive-launch-war-room';
import { GlobalReadinessValidation } from './global-readiness-validation';
import { LaunchAnalyticsDashboard } from './launch-analytics-dashboard';
import { LaunchCommandCenter } from './launch-command-center';
import { PricingPackagingPlatform } from './pricing-packaging-platform';
import { ProductMarketingCenter } from './product-marketing-center';
import { PublicLaunchHome } from './public-launch-home';
import { PublicLaunchNavigation } from './public-launch-navigation';
import { PublicLaunchWebsite } from './public-launch-website';

export function PublicLaunchWorkspace({ activeSection }: { activeSection?: string }) {
  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><Globe2 className="size-3" />Phase 65 Public Launch</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">NEXORA AI OS v2.0 public launch, enterprise adoption and global scale readiness.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">Launch operations, pricing, trials, marketing, acquisition, sales enablement, website pages, customer success, global validation, adoption intelligence, analytics, executive war room and AI Launch Copilot are unified for official public launch.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSection ? <Badge variant="info"><Rocket className="size-3" />{activeSection}</Badge> : null}
            <Badge variant="success"><Globe2 className="size-3" />2.5.0 ready</Badge>
          </div>
        </motion.div>
        <motion.div variants={staggerItem}><PublicLaunchNavigation /></motion.div>
        <motion.div variants={staggerItem}><PublicLaunchHome /></motion.div>
        <motion.div variants={staggerItem}><LaunchCommandCenter /></motion.div>
        <motion.div variants={staggerItem}><PricingPackagingPlatform /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseTrialExperience /></motion.div>
        <motion.div variants={staggerItem}><ProductMarketingCenter /></motion.div>
        <motion.div variants={staggerItem}><CustomerAcquisitionEngine /></motion.div>
        <motion.div variants={staggerItem}><EnterpriseSalesEnablement /></motion.div>
        <motion.div variants={staggerItem}><PublicLaunchWebsite /></motion.div>
        <motion.div variants={staggerItem}><CustomerSuccessLaunchHub /></motion.div>
        <motion.div variants={staggerItem}><GlobalReadinessValidation /></motion.div>
        <motion.div variants={staggerItem}><AdoptionIntelligenceCenter /></motion.div>
        <motion.div variants={staggerItem}><LaunchAnalyticsDashboard /></motion.div>
        <motion.div variants={staggerItem}><ExecutiveLaunchWarRoom /></motion.div>
        <motion.div variants={staggerItem}><AiLaunchCopilot /></motion.div>
      </motion.div>
    </EnterpriseShell>
  );
}
