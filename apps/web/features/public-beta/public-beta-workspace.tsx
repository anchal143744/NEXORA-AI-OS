'use client';

import { motion } from 'framer-motion';
import { Megaphone, Rocket, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { AiCustomerSuccessCopilot } from './ai-customer-success-copilot';
import { BetaCommunityHub } from './beta-community-hub';
import { CustomerOnboardingCenter } from './customer-onboarding-center';
import { CustomerSuccessWorkspace } from './customer-success-workspace';
import { FeatureRequestPortal } from './feature-request-portal';
import { FeedbackIntelligencePlatform } from './feedback-intelligence-platform';
import { GoToMarketReadinessCenter } from './go-to-market-readiness-center';
import { GuidedProductTours } from './guided-product-tours';
import { InAppFeedbackSystem } from './in-app-feedback-system';
import { NpsCustomerSatisfaction } from './nps-customer-satisfaction';
import { ProductAdoptionAnalytics } from './product-adoption-analytics';
import { PublicBetaHome } from './public-beta-home';
import { PublicBetaManagement } from './public-beta-management';
import { PublicBetaNavigation } from './public-beta-navigation';

export function PublicBetaWorkspace({ activeSection }: { activeSection?: string }) {
  return (
    <EnterpriseShell>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge><Megaphone className="size-3" />Phase 62 Public Beta</Badge>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Public beta, customer onboarding and go-to-market readiness for NEXORA AI OS.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">Beta cohorts, guided onboarding, product tours, feedback intelligence, customer success, adoption analytics, NPS, community and GTM gates are unified into one launch operating workspace.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSection ? <Badge variant="info"><ShieldCheck className="size-3" />{activeSection}</Badge> : null}
            <Badge variant="success"><Rocket className="size-3" />2.2.0-RC1 ready</Badge>
          </div>
        </motion.div>
        <motion.div variants={staggerItem}><PublicBetaNavigation /></motion.div>
        <motion.div variants={staggerItem}><PublicBetaHome /></motion.div>
        <motion.div variants={staggerItem}><PublicBetaManagement /></motion.div>
        <motion.div variants={staggerItem}><CustomerOnboardingCenter /></motion.div>
        <motion.div variants={staggerItem}><GuidedProductTours /></motion.div>
        <motion.div variants={staggerItem}><FeedbackIntelligencePlatform /></motion.div>
        <motion.div variants={staggerItem}><CustomerSuccessWorkspace /></motion.div>
        <motion.div variants={staggerItem}><ProductAdoptionAnalytics /></motion.div>
        <motion.div variants={staggerItem}><FeatureRequestPortal /></motion.div>
        <motion.div variants={staggerItem}><InAppFeedbackSystem /></motion.div>
        <motion.div variants={staggerItem}><NpsCustomerSatisfaction /></motion.div>
        <motion.div variants={staggerItem}><BetaCommunityHub /></motion.div>
        <motion.div variants={staggerItem}><GoToMarketReadinessCenter /></motion.div>
        <motion.div variants={staggerItem}><AiCustomerSuccessCopilot /></motion.div>
      </motion.div>
    </EnterpriseShell>
  );
}
